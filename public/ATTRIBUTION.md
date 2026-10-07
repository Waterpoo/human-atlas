# Anatomy data attribution

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- License: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html (updated 2025-02-27)
- Dataset: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- License terms: https://creativecommons.org/licenses/by/4.0/
- Source geometry: `isa_BP3D_4.0_obj_99.zip`, BodyParts3D 4.0.
- English names and relationships: IS-A and PART-OF concept, element, and inclusion tables from the same archive.
- Publication: Mitsuhashi et al. (2009), BodyParts3D: 3D structure database for anatomical concepts. https://doi.org/10.1093/nar/gkn613

Adaptations: axes and units converted from millimeters/Z-up to meters/Y-up; translated to rest at the stage; geometry simplified using meshoptimizer with 0.2% relative error limit per structure; normals quantized to signed 16-bit; packed into binary chunks; curated display system groupings and colors. The source contains 2,234 individual OBJ meshes; all remain represented. The combined hierarchy contains 3,432 named FMA concepts, which may reference multiple meshes. Original source identity is preserved in the manifest.

Source OBJ comments mention an older CC BY-SA 2.1 Japan license. The official current database license linked above supersedes that legacy text and explicitly permits redistribution and adaptation under CC BY 4.0.

BodyParts3D represents an adult male reference anatomy based on TARO MRI and anatomical illustration refinements. It is not a complete model of every possible human anatomical structure or variation. This interface is educational and is not a clinical tool.

## Female anatomy

Female reference anatomy: Kristen Browne and Heidi Schlehlein, Human Reference Atlas / HuBMAP, *3D Reference Organ Set for Female v1.5* (2023). CC BY 4.0. Geometry adapted for this viewer.

- Source DOI: https://doi.org/10.48539/HBM352.BTSQ.586
- Dataset: https://lod.humanatlas.io/ref-organ/united-female/v1.5
- Original GLB: https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.5/assets/3d-vh-f-united.glb
- License: https://creativecommons.org/licenses/by/4.0/

Adaptations: translated native meter/Y-up coordinates to the viewer origin, coincident vertices welded and source normals averaged, geometry simplified with a 0.2% per-structure relative error bound, and normals quantized. Colors and display systems are curated for this interface. All 888 source meshes are represented, with 1,073 source nodes available as selectable individual or compound concepts.

This is a reference assembly with whole-body surface and selected organs, including female reproductive anatomy. Its skeleton and muscle coverage is partial. It is not a complete model of every human structure or a single-person scan. Eight placenta/umbilical structures are classified under Pregnancy reference and hidden by default.

## Z-Anatomy extended reference

Z-Anatomy — The open source atlas of anatomy — CC BY-SA 4.0. Authors: Gauthier Kervyn, Marcin Zielinski and upstream contributors. Derived from BodyParts3D — The Database Center for Life Science — CC BY-SA 2.1 Japan, with upstream notices preserved in Z-ANATOMY-LICENSE.txt. Source: https://github.com/Z-Anatomy/Models-of-human-anatomy . GLB export: https://github.com/nqwrc/3d-anatomy/tree/8ca3b7421bcfbe88b85859eb1983d5cf79f21749 . Cranial nerves/foramina: University of Dundee, CAHID, CC BY 4.0. Brain reference credit: Brainder and White matter, University of Washington. Six separately licensed non-commercial kidney/inner-ear components are excluded.

Adaptations: Draco decoding, retained world transforms, winding correction, per-part simplification, recomputed normals, binary packing, system regrouping and searchable joint groups. The adapted Z-Anatomy model assets remain CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ . Definitions supplied upstream mainly derive from Wikipedia, CC BY-SA 3.0 / GFDL; each available original source URL is retained with the definition. Definitions are distributed as a separate attributed work under their upstream license: https://creativecommons.org/licenses/by-sa/3.0/ . Source names, definitions and Latin terms are not independently clinically verified.
