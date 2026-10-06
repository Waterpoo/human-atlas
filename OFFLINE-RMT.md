# Halo Anatomy 1.0 — Offline RMT Study Atlas

## Desktop app

The Mac build bundles the complete viewer, catalogue and model geometry. Once installed, it runs without an internet connection from the very first launch. No account, API key or local Node installation is needed. Both Apple Silicon and Intel build targets are configured in `.github/workflows/halo-anatomy.yml`.

Desktop packages are unsigned until an Apple Developer signing identity is supplied. On macOS, use Finder's Open action for a downloaded app and approve it in Privacy & Security if required. Do not disable Gatekeeper globally.

For a developer build: `npm ci`, then `npm run desktop`. To package on a Mac: `npm run package:mac -- --arm64` (Apple Silicon) or `--x64` (Intel). The local desktop server listens on loopback port 3017; study data persists at that origin. Keep this port free.

## Browser offline use

Run `npm ci`, `npm run build`, then `npx vite preview --host 127.0.0.1 --port 3016`. Open http://127.0.0.1:3016. Keep the complete `dist` directory for first-run offline use with a local server.

When used from HTTPS or localhost, the production service worker saves **all 15 compressed geometry chunks**, the catalogue, JavaScript, CSS, attribution, and application shell before activating. Wait for “All anatomy saved for offline use” before disconnecting. If storage is full or caching is interrupted, the worker does not report readiness. Development mode intentionally does not register a worker. Browser storage may be cleared or evicted; export notes periodically. Opening index.html directly through file:// is not supported.

## Study tools

- 18 high-yield muscle summaries: origin, insertion, action, innervation, region.
- Selection shows the corresponding summary in the structure inspector.
- RMT Study offers region filtering, muscle selection, 3D muscle location, favorites, notes, and self-assessed recall quizzes.
- Notes, favorites, quiz totals, layers, camera preset, and explosion amount are saved locally.
- Export/import JSON backups for your notes and progress. Import replaces study data after validation.
- The latissimus dorsi summary has no matching mesh in this reference dataset. Other muscle summaries may highlight a union of modeled heads or subdivisions. Model coverage is not a claim of complete anatomy.

The study layer is a concise learning aid. Root values and attachment conventions can differ between texts; use your RMT course reference for examination detail. No clinical recommendations are included.

## Verification

`npm run check`, `npm test`, and `npm run build` validate TypeScript, all geometry buffers, named concepts, exploded packing, selection contracts, gesture handling, study matching, and coverage. `npx playwright test` checks the production viewer, study tools, persistence, mobile panel and offline reload. GitHub Actions builds Mac packages only after checks and browser tests pass.

## Attribution

No ZygoteBody code or assets are included. BodyParts3D © The Database Center for Life Science, CC BY 4.0; axes, geometry simplification, packing, colors and grouping are adaptations. See `public/ATTRIBUTION.md`, included in the offline distribution. Original application code remains MIT under `LICENSE`.
