"""Reviewed system overrides shared by catalogue repair and both source converters."""
MALE_SKELETAL_MUSCLE_IDS = frozenset(base+suffix for base in ['FJ1409','FJ1410','FJ1411','FJ1439','FJ1440','FJ1504','FJ1532'] for suffix in ['','M'])
def expected_system(part,sex):
 i=part['id'];name=part['name'].lower()
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
