"""Apply reviewed system corrections; never move geometry based on name heuristics."""
import json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def expected_system(part,sex):
 i=part['id'];name=part['name'].lower()
 if sex=='male':
  if i in ['FJ1730','FJ1731','FJ1752','FJ1767','FJ1814','FJ1755','FJ1803']:return 'nervous'
  if i in ['FJ1438','FJ1438M']:return 'muscular'
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
changes=[]
for file,sex in [('atlas.json','male'),('atlas-female.json','female')]:
 path=root/'public/models'/file;a=json.loads(path.read_text())
 for p in a['parts']:
  system=expected_system(p,sex)
  if p['system']!=system:
   changes.append({'model':sex,'id':p['id'],'name':p['name'],'from':p['system'],'to':system});p['system']=system
 if '--check' not in sys.argv:path.write_text(json.dumps(a,separators=(',',':')))
if '--check' in sys.argv:
 assert not changes,changes
else:
 (root/'audits/system-corrections.json').write_text(json.dumps(changes,indent=2)+'\n')
 print('Corrected',len(changes),'system assignments')
