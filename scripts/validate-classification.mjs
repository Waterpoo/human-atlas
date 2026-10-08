/** Reference-backed classification invariants; source grouping is not anatomical certification. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const review=JSON.parse(fs.readFileSync('audits/classification-review.json'));
const rows=[],maps=new Map();
for(const [model,file] of [['male','atlas.json'],['female','atlas-female.json'],['extended-male','atlas-extended.json']]){
 const atlas=JSON.parse(fs.readFileSync('public/models/'+file));
 const map=new Map(atlas.parts.map(p=>[p.id,p]));assert.equal(map.size,atlas.parts.length);maps.set(model,map);
 for(const p of atlas.parts){
  // Cartilage is not one organ system. Costal cartilage supports the thoracic skeleton;
  // separately modeled articular cartilage and airway cartilage have dedicated layers.
  if(/costal cartilage/i.test(p.name))assert.equal(p.system,'skeletal',p.id);
  if(/articular cartilage/i.test(p.name))assert.equal(p.system,'joints',p.id);
  if(/cartilage/i.test(p.name)&&/nasal|alar|thyroid|cricoid|arytenoid|corniculate|cuneiform|epiglot|trache|bronch/i.test(p.name))assert.equal(p.system,'respiratory',p.id);
  if(/tensor fasciae latae/i.test(p.name))assert.equal(p.system,'muscular',p.id);
  if(/iliotibial tract/i.test(p.name))assert.equal(p.system,'connective',p.id);
  if(model==='female'&&p.id.startsWith('Allen_'))assert.equal(p.system,'nervous',p.id);
  if(p.system==='skeletal')assert.ok(!/ligament|tendon|muscle/i.test(p.name),p.id);
  const correction=review.corrections.find(r=>r.model===model&&r.id===p.id);
  rows.push({model,id:p.id,name:p.name,system:p.system,classificationStatus:correction?'reference-backed display correction':'source assignment retained; not independently certified',references:correction?.references??[],sourceWarnings:p.reviewFlags??[],geometryCertified:false});
 }
}
assert.equal(rows.length,5943);
for(const r of review.corrections){
 const p=maps.get(r.model)?.get(r.id);assert.ok(p,'Missing reviewed component '+r.id);
 assert.equal(p.name,r.name,'Reviewed identity changed '+r.id);assert.equal(p.system,r.to,r.id);
 assert.ok(r.references.length&&r.reason);
}
for(const id of ['VH_F_superior_rectal_vein','VH_F_inferior_mesenteric_vein','VH_F_left_anterior_descending_artery'])assert.ok(maps.get('female').get(id).reviewFlags?.some(f=>f.includes('identity conflict')),id);
fs.writeFileSync('audits/classification-audit.json',JSON.stringify({date:review.date,scope:review.scope,componentsChecked:rows.length,referenceBackedCorrections:review.corrections.length,clinicalCertification:false,parts:rows},null,2)+'\n');
console.log('Classification checks: all 5,943 entries; 63 reference-backed display corrections; unresolved source identities retained with warnings.');
