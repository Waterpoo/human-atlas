# Halo Anatomy

An offline anatomy explorer with three selectable references: BodyParts3D adult male (2,234 components), Human Reference Atlas female (888 components), and Z-Anatomy extended adult male (2,821 components). The extended reference includes 349 joint components and 4,375 searchable entries, with source definitions and Latin terms where supplied.

## Explore

- Orbit, zoom, pan vertically or sideways, and select real modeled surfaces.
- Toggle system layers and adjust each system's opacity independently.
- In the extended reference, use Joints to inspect capsules, ligaments, labra, menisci and spinal discs. Search for a joint group to highlight its available components; select a joint capsule on the model to inspect its group.
- Isolate structures or spread the available pieces into an anatomical inventory.
- Change the background color and model contrast under View appearance. Appearance settings persist locally and survive view resets.
- Use the optional muscle reference, saved notes, favorites and backup tools.

This is a general anatomy explorer. A single reference does not cover every medical topic, every structure, every variation, or clinically verified pathology. The female dataset has partial skeleton and muscle coverage. Six separately licensed kidney/inner-ear meshes are excluded from the extended male reference; the original references remain available. Source identity/laterality uncertainties are documented in the included anatomy audit, with inspector warnings on identified extended-source conflicts.

## Run locally

Requires Node.js 22.13 or newer. No API keys or accounts are needed.

```sh
npm ci
npm run dev
```

Open http://localhost:3016. `npm run dev`, `npm test` and `npm run build` prepare the extended atlas from the pinned source files. `npm run build` produces the static offline app in `dist/`, including its model assets and service-worker manifest. `npm run package:mac -- --arm64` or `--x64` builds the corresponding Mac installer.

## Validate

```sh
npm run check
npm test
npm run build
npx playwright install --with-deps chromium
npx playwright test
```

Catalogue checks cover every binary buffer, compressed-file integrity, finite coordinates, original bounds, valid indices, nonempty normals, concept membership, reviewed muscle classification, layout and pointer handling. Browser tests exercise every available system in all three references, real joint-surface picking, grouping/isolation, opacity, appearance persistence/mobile controls and offline reloads. Packaged Mac smoke tests load all three references with external requests blocked. Intel target tests run through Rosetta; physical Intel hardware and real mobile multitouch hardware are not certified.

`python3 scripts/audit-anatomy.py` requires NumPy and regenerates the per-component report for all 5,943 components. Data integrity and successful rendering do not establish anatomical certification. See [audit notes](audits/README.md) and [Z-Anatomy import provenance](audits/z-anatomy-import.json).

## Data and licensing

Original app code is MIT. Anatomy assets and definitions have separate licenses; they are not relicensed as application code. BodyParts3D 4.0 and HRA female credits are in [ATTRIBUTION.md](public/ATTRIBUTION.md). Z-Anatomy-derived model assets remain CC BY-SA 4.0, with upstream BodyParts3D and contributor notices retained. Source definitions retain their supplied links and Wikipedia CC BY-SA 3.0 / GFDL attribution. See [upstream notices](public/Z-ANATOMY-LICENSE.txt).

The seven Z-Anatomy GLBs are pinned to nqwrc/3d-anatomy commit `8ca3b7421bcfbe88b85859eb1983d5cf79f21749`. The importer verifies their hashes, decodes Draco geometry, retains all node/world transforms, corrects triangle winding for reflected transforms, and packs individually indexed meshes. Simplification is bounded to 0.1% relative error per component. Atlas variants remain separate, avoiding unverified alignment between different references.

## Rendering

Geometry is merged into batches. Per-component GPU textures control visibility, translation and highlights; individual component geometry handles ray picking. The renderer redraws when the scene changes. Optional WebMCP tools provide catalogue search and inspection in supported browsers.
