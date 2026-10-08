# Component audit — known source limitations

All 5,943 components (2,234 original male; 888 female; 2,821 extended male) have an individual record in component-audit.csv. Each record checks its geometry buffers, finite coordinates, valid indices, nonempty normals, containment within stored original bounds, and compressed geometry integrity. These checks establish data integrity, not anatomical certification. Larger original bounds are intentional after geometry simplification.

73 confirmed system assignments were corrected; the full before/after list is system-corrections.json. Both sides of fibularis brevis, longus and tertius, tibialis anterior and posterior, subscapularis and levator scapulae move from Skeleton to Muscles. Brain ventricular spaces and choroid plexuses move to Nervous system; tensor fasciae latae to Muscles; wrist retinacula to Connective tissue; lacrimal bones to Skeleton; gingiva to Digestive/oral structures; papillary muscles to Heart; nine hepatic tissue segments to Digestive (the word hepatovenous describes their liver subdivision, not a vein mesh). Female cardiac vessels move to Arteries, palatine tonsils to Lymphatic, optic nerves/tracts to Nervous system, and quadriceps tendons to Connective tissue.

Grouping policy: functional organ membership is retained for specialized eye, respiratory, reproductive and joint components. A ligament inside an eye or uterus is not automatically an error. Intracranial vessels stay in vascular systems; cardiac vessels belong to their vascular layers, while cardiac muscle belongs to Heart. Teeth and costal cartilage are grouped with the supporting skeleton, so this layer is not a bones-only segmentation. Separately modeled articular cartilage and knee ligaments are in Joints; nasal and laryngeal cartilage is displayed with Respiratory.

The user approved installer creation with these limitations documented on 2026-10-07. The following source issues remain unresolved and prevent anatomical sign-off:

- Female Allen brain hemisphere labels oppose the body left/right convention for many components. The official source GLB has the same baked positions and no node or parent transforms. This is not proven to be an application transform bug. Do not mirror or relabel the brain without resolving the source conventions.
- VH_F_superior_rectal_vein and VH_F_inferior_mesenteric_vein have vein node names but arterial source labels and arterial ontology IDs (UBERON:0035040 and UBERON:0001182). Geometry identity needs tracing through the vascular tree; neither spelling alone establishes identity.
- VH_F_left_anterior_descending_artery has a coronary LAD node name but a pulmonary-branch display label in the source. Its identity/ontology needs resolving before renaming.
- Male FJ1469/FJ1469M flexor pollicis brevis labels oppose their hand coordinates and neighboring named muscle subdivisions; FJ2190's right fibular vein label falls on the left leg. These require original source concept/mesh verification.
- Midline flags in cardiac and hepatic structures are review candidates, not necessarily errors: anatomical right/left chamber or liver-region membership does not require every vertex to lie on the corresponding side of the body.
- Female partial coverage and pregnancy reference geometry are dataset limitations. Pregnancy remains a separate reference layer.

Sources reviewed:
- Brain ventricular anatomy: https://www.ncbi.nlm.nih.gov/books/NBK11083/
- Tensor fasciae latae: https://www.ncbi.nlm.nih.gov/books/NBK499870/
- Palatine tonsils: https://www.ncbi.nlm.nih.gov/mesh/D014066
- Official female source: https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.5/assets/3d-vh-f-united.glb
- Brain reference provenance: https://3d.nih.gov/entries/3DPX-020959

Run python3 scripts/audit-anatomy.py (requires NumPy) to regenerate the itemized audit. npm test enforces reviewed system corrections. The browser suite also exercises every available system individually in both models and records system screenshots; it checks the complete rendered component inventory and page errors. It is not a substitute for expert anatomical review.

## Extended Z-Anatomy reference (version 1.3)

The application also includes a separate extended adult male atlas imported reproducibly from nqwrc/3d-anatomy commit 8ca3b7421bcfbe88b85859eb1983d5cf79f21749, a GLB export of Z-Anatomy. It contains 2,821 individually selectable components, including 349 joint components, and 4,375 searchable concepts. See z-anatomy-import.json for per-source hashes and counts. Original GLB node/world transforms are retained; negative-determinant transforms reverse triangle winding. Geometry is simplified with a maximum relative error of 0.001 and normals are recomputed. Joint groups highlight existing surfaces; they are not invented joint-center coordinates. The ankle entry is explicitly a region group rather than a whole-joint segmentation.

Six separately licensed kidney and inner-ear components are excluded from this derivative; the original male/female references remain available. Models are CC BY-SA 4.0, with upstream BodyParts3D attribution and separate upstream notices preserved. Source definitions and Latin names are included where supplied, with definition source links and Wikipedia CC BY-SA 3.0 attribution. These are source descriptions, not clinically validated medical guidance. This extension is gross anatomy coverage, not a complete library of pathology, physiology, histology or every medical topic. Counts and software checks do not establish anatomical certification.

Unidentified source vascular nodes (?x.l, ?x.r and ????????) retain their exact source identifiers and are displayed as unidentified components. They are grouped using their source vascular parent (pterygoid-canal arteries and coronary sinus), rather than given invented anatomical names.

The extended source lateral temporomandibular ligaments have side labels opposite their body-side coordinates. Their geometry and source identity are retained; individual and joint-group inspectors show a source laterality warning. These entries are not considered anatomically verified. Unidentified vascular components also show an identity warning.

## Reference-backed classification review — 2026-10-08

63 additional display assignments are corrected in classification-review.json, with individual IDs, names, before/after categories, reasons and reference URLs. These comprise 22 nasal/laryngeal cartilages moved to Respiratory, 14 female knee ligaments/articular cartilages and six original male syndesmosis/plantar ligament components moved to Joints, 17 female central neural/meningeal structures moved to Nervous, and four extended muscle/fascial components corrected (tensor fasciae latae and iliotibial tracts). Costal cartilage remains in Skeleton: skeletal-system cartilage is legitimate anatomy, not automatically an error.

classification-audit.json lists every one of the 5,943 components, distinguishing reference-backed corrections from source assignments retained without independent certification. Identity conflicts are surfaced in the structure inspector, including the three known female vessel conflicts and Allen hemisphere convention. All geometry buffers are rechecked; no geometry is moved, mirrored or relabeled by these display-layer changes.

The audit is a full catalogue consistency pass, not an independent manual anatomical assessment of every mesh. Textbooks and terminology establish tissue/system distinctions but cannot resolve an unidentified mesh or prove its exact shape/placement. Existing laterality, vascular identity and partial-coverage limitations therefore remain unresolved.

References for the latest review:
- skeleton: https://openstax.org/books/anatomy-and-physiology-2e/pages/7-1-divisions-of-the-skeletal-system
- airway: https://openstax.org/books/anatomy-and-physiology/pages/22-1-organs-and-structures-of-the-respiratory-system
- joint: https://openstax.org/books/anatomy-and-physiology-2e/pages/9-6-anatomy-of-selected-synovial-joints
- syndesmosis: https://openstax.org/books/anatomy-and-physiology-2e/pages/9-2-fibrous-joints
- neural: https://cdn.dal.ca/content/dam/dalhousie/pdf/library/FIPAT/TA2/FIPAT-TA2-Part-5.pdf
- meninges: https://openstax.org/books/anatomy-and-physiology/pages/13-3-circulation-and-the-central-nervous-system
- fascia: https://pubmed.ncbi.nlm.nih.gov/30725782/
- muscle: https://pubmed.ncbi.nlm.nih.gov/29500891/

Additional source findings: five original male pairs have byte-identical geometry and identical labels (FJ1846/FJ2013, FJ1916/FJ2386, FJ1924/FJ2394, FJ2440/FJ2769, FJ2772/FJ3201). Their IDs are retained and flagged; a future alias/segmentation decision must preserve source concept membership. The two extended triradiate cartilages are developmental acetabular structures; their presence is not validated as a mature adult variant. Reference: https://pubmed.ncbi.nlm.nih.gov/29309383/.

- FIPAT joint terminology (plantar ligaments and pelvic cartilage): https://cdn.dal.ca/content/dam/dalhousie/pdf/library/FIPAT/TA2/FIPAT-TA2-Part-2.pdf
