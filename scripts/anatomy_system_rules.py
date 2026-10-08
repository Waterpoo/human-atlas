"""Reviewed system overrides shared by catalogue repair and both source converters."""
import json
from pathlib import Path
REVIEW = json.loads((Path(__file__).resolve().parents[1]/'audits/classification-review.json').read_text())
OVERRIDES = {(r['model'],r['id']):r['to'] for r in REVIEW['corrections']}
MALE_SKELETAL_MUSCLE_IDS = frozenset(base+suffix for base in ['FJ1409','FJ1410','FJ1411','FJ1439','FJ1440','FJ1504','FJ1532'] for suffix in ['','M'])
def expected_system(part,sex):
 i=part['id'];name=part['name'].lower()
 if (sex,i) in OVERRIDES:return OVERRIDES[(sex,i)]
 if sex=='male':
  if name.startswith('hepatovenous segment'):return 'digestive'
  if i in ['FJ1730','FJ1731','FJ1752','FJ1767','FJ1814','FJ1755','FJ1803']:return 'nervous'
  if i in MALE_SKELETAL_MUSCLE_IDS or i in ['FJ1438','FJ1438M']:return 'muscular'
  if i in ['FJ1423','FJ1423M','FJ1471','FJ1471M']:return 'connective'
  if i in ['FJ3265','FJ3371']:return 'skeletal'
  if i in ['FJ1252','FJ1253']:return 'digestive'
  if i in ['FJ2418','FJ2419','FJ2429','FJ2430','FJ2437']:return 'cardiac'
 else:
  if i in ['VH_F_palatine_tonsil_L','VH_F_palatine_tonsil_R']:return 'lymphatic'
  if i in ['VH_F_right_optic_nerve','VH_F_left_optic_nerve','Allen_optic_tract_L','Allen_optic_tract_R']:return 'nervous'
  if i.startswith('VH_F_tendon_of_quadriceps_femoris_'):return 'connective'
  if part['system']=='cardiac' and any(w in name for w in ['artery','aorta','pulmonary trunk']):return 'arterial'
 return part['system']

def source_review_flags(part):
 i=part['id'];flags=list(part.get('reviewFlags',[]))
 if i.startswith('Allen_'):flags.append('Source brain hemisphere labels oppose the body coordinate convention; laterality needs source review.')
 if i in ['VH_F_superior_rectal_vein','VH_F_inferior_mesenteric_vein']:flags.append('Source identity conflict: mesh node identifies a vein but its label/ontology identify an artery; identity is unresolved.')
 if i=='VH_F_left_anterior_descending_artery':flags.append('Source identity conflict: node identifies coronary LAD but the label identifies a pulmonary branch; identity is unresolved.')
 duplicates={'FJ1846':'FJ2013','FJ1916':'FJ2386','FJ1924':'FJ2394','FJ2440':'FJ2769','FJ2772':'FJ3201'}
 duplicates.update({v:k for k,v in list(duplicates.items())})
 if i in duplicates:flags.append('Byte-identical source geometry also exists under '+duplicates[i]+'; both source identities are retained.')
 return list(dict.fromkeys(flags))
