"""Exhaustive data audit; warning flags require anatomical/source review, not automatic correction."""
import json,csv,re,hashlib,gzip
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[1];out=root/'audits';out.mkdir(exist_ok=True)
rows=[];summaries=[]
for filename in ['atlas.json','atlas-female.json','atlas-extended.json']:
 atlas=json.loads((root/'public/models'/filename).read_text());buffers=[]
 for chunk in atlas['chunks']:
  path=root/'public'/chunk['url'].lstrip('/');b=path.read_bytes();assert len(b)==chunk['bytes']
  if chunk.get('gzip'):assert gzip.decompress((root/'public'/chunk['gzip'].lstrip('/')).read_bytes())==b
  buffers.append(b)
 for p in atlas['parts']:
  b=buffers[p['chunk']];pos=np.frombuffer(b,dtype='<f4',count=p['vertexCount']*3,offset=p['positions']).reshape(-1,3);ind=np.frombuffer(b,dtype='<u4',count=p['indexCount'],offset=p['indices']);norm=np.frombuffer(b,dtype='<i2',count=p['vertexCount']*3,offset=p['normals']).reshape(-1,3)
  assert np.isfinite(pos).all() and len(ind)%3==0 and ind.max()<len(pos),p['id']
  lo=pos.min(axis=0);hi=pos.max(axis=0);assert np.all(lo>=np.array(p['bounds'][0])-2e-6) and np.all(hi<=np.array(p['bounds'][1])+2e-6),p['id']
  assert np.isfinite(norm).all() and np.any(norm),p['id']
  flags=[];name=p['name'].lower();left=bool(re.search(r'\bleft\b',name));right=bool(re.search(r'\bright\b',name))
  if left!=right and ((left and hi[0]<-.005) or (right and lo[0]>.005)):flags.append('side_vs_body_midline: review regional laterality; cardiac/hepatic labels can legitimately cross midline')
  if np.any(lo<[-.8,-.1,-.6]) or np.any(hi>[.8,2.1,.6]):flags.append('outside_broad_body_envelope')
  if filename=='atlas-female.json' and p['id'].startswith('Allen_'):flags.append('source_brain_laterality_requires_review: Allen hemisphere labels oppose body convention')
  if p['id'] in ['VH_F_superior_rectal_vein','VH_F_inferior_mesenteric_vein']:flags.append('source_identity_conflict: mesh node says vein; source label and ontology say artery')
  if p['id']=='VH_F_left_anterior_descending_artery':flags.append('source_label_conflict: node says coronary LAD; label says pulmonary branch')
  rows.append(dict(model='extended-male' if filename=='atlas-extended.json' else atlas['sex'],id=p['id'],name=p['name'],system=p['system'],vertices=p['vertexCount'],triangles=p['indexCount']//3,bounds=json.dumps([lo.tolist(),hi.tolist()]),geometry_sha256=hashlib.sha256(pos.tobytes()+ind.tobytes()+norm.tobytes()).hexdigest(),geometry_check='pass',review_flags='; '.join(flags)))
 summaries.append(dict(model='extended-male' if filename=='atlas-extended.json' else atlas['sex'],parts=len(atlas['parts']),systems={s:sum(p['system']==s for p in atlas['parts']) for s in sorted(set(p['system'] for p in atlas['parts']))}))
with (out/'component-audit.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
(out/'audit-summary.json').write_text(json.dumps(dict(models=summaries,total_parts=len(rows),geometry_passes=len(rows),flagged_parts=sum(bool(r['review_flags']) for r in rows),clinical_or_anatomical_certification=False),indent=2)+'\n')
print((out/'audit-summary.json').read_text())
