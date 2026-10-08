"""Apply reviewed system corrections; never move geometry based on name heuristics."""
import json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
from anatomy_system_rules import expected_system, source_review_flags
changes=[]
for file,sex in [('atlas.json','male'),('atlas-female.json','female')]:
 path=root/'public/models'/file;a=json.loads(path.read_text())
 for p in a['parts']:
  system=expected_system(p,sex)
  if p['system']!=system:
   changes.append({'model':sex,'id':p['id'],'name':p['name'],'from':p['system'],'to':system});p['system']=system
  flags=source_review_flags(p)
  if flags!=p.get('reviewFlags',[]):
   if '--check' in sys.argv:raise AssertionError('Missing source review flags: '+p['id'])
   p['reviewFlags']=flags
 if '--check' not in sys.argv:path.write_text(json.dumps(a,separators=(',',':')))
if '--check' in sys.argv:
 assert not changes,changes
else:
 path=root/'audits/system-corrections.json'
 previous=json.loads(path.read_text()) if path.exists() else []
 keys={(p['model'],p['id']) for p in previous}
 previous.extend(p for p in changes if (p['model'],p['id']) not in keys)
 path.write_text(json.dumps(previous,indent=2)+'\n')
 print('Corrected',len(changes),'system assignments')
