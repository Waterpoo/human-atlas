import fs from 'node:fs';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
const filename=process.argv[2]??'atlas.json';
const base=new URL('../public/models/',import.meta.url),atlas=JSON.parse(fs.readFileSync(new URL(filename,base)));
const female=filename==='atlas-female.json',extended=filename==='atlas-extended.json';assert.equal(atlas.parts.length,extended?2821:female?888:2234);assert.equal(atlas.concepts.length,extended?4375:female?1073:3432);
if(!female&&!extended){for(const id of ['FJ1423','FJ1423M'])assert.equal(atlas.parts.find(p=>p.id===id)?.system,'connective',`${id}: iliotibial fascia must not appear in Skeleton`);}
if(!female&&!extended){
 for(const baseId of ['FJ1409','FJ1410','FJ1411','FJ1439','FJ1440','FJ1504','FJ1532'])for(const suffix of ['', 'M']){
  const id=baseId+suffix;assert.equal(atlas.parts.find(p=>p.id===id)?.system,'muscular',`${id}: skeletal muscle must be in Muscles`);
 }
}
for(const p of atlas.parts.filter(p=>p.system==='skeletal'))assert.ok(!/\b(fibularis|tibialis|subscapularis|levator scapulae|muscle)\b/i.test(p.name),`${p.id}: muscle incorrectly classified as Skeleton`);
if(extended){assert.equal(atlas.parts.filter(p=>p.system==='joints').length,349);for(const side of ['Left','Right'])assert.ok(atlas.concepts.find(c=>c.name===side+' knee joint'&&c.category==='joints')?.elements.length>10);assert.ok(atlas.concepts.filter(c=>c.definition&&c.definitionSource).length>100);for(const name of ['Fibularis brevis.l','Fibularis tertius.l','Tibialis anterior.l']){const p=atlas.parts.find(p=>p.sourceName===name||p.sourceName===name.replace('.l',' muscle.l'));if(p)assert.equal(p.system,'muscular');}assert.equal(atlas.parts.find(p=>p.sourceName==='Choroid plexus.l')?.system,'nervous');assert.equal(atlas.parts.find(p=>p.sourceName==='Coeliac trunk')?.system,'arterial');assert.ok(atlas.parts.find(p=>p.sourceName==='Lateral temporomandibular ligament.l')?.reviewFlags?.length);assert.ok(atlas.parts.find(p=>p.sourceName==='?x.l')?.reviewFlags?.length);assert.ok(!atlas.parts.some(p=>/^(Kidney|Cochlea|Vestibule)\./.test(p.sourceName)));}
const ids=new Set(atlas.parts.map(p=>p.id));assert.equal(ids.size,atlas.parts.length);
const files=atlas.chunks.map(c=>{const b=fs.readFileSync(new URL(c.url.split('/').pop(),base));assert.equal(b.length,c.bytes);if(c.gzip)assert.deepEqual(gunzipSync(fs.readFileSync(new URL(c.gzip.split('/').pop(),base))),b);return b;});
let tris=0;
for(const p of atlas.parts){assert.ok(p.name.trim()&&p.name!=='-'&&!p.name.includes('Bounds('));assert.ok(p.conceptId!=='-');assert.ok(p.system);const b=files[p.chunk];assert.ok(p.indices+p.indexCount*4<=b.length);const pos=new Float32Array(b.buffer,b.byteOffset+p.positions,p.vertexCount*3),indices=new Uint32Array(b.buffer,b.byteOffset+p.indices,p.indexCount);assert.ok(indices.length>=3);for(const i of indices)assert.ok(i<p.vertexCount,`${p.id}: invalid vertex`);for(let j=0;j<pos.length;j++){const value=pos[j];assert.ok(Number.isFinite(value));assert.ok(value>=p.bounds[0][j%3]-2e-6&&value<=p.bounds[1][j%3]+2e-6,`${p.id}: position outside original bounds`);}const normals=new Int16Array(b.buffer,b.byteOffset+p.normals,p.vertexCount*3);assert.ok(normals.some(n=>n!==0),`${p.id}: empty normals`);tris+=p.indexCount/3;}
for(const c of atlas.concepts){assert.ok(c.elements.length);for(const id of c.elements)assert.ok(ids.has(id),`${c.id}: missing ${id}`);}
assert.equal(tris,atlas.triangles);
console.log(`Verified ${ids.size} individually indexed meshes, ${atlas.concepts.length} complete concept mappings, ${tris.toLocaleString()} triangles, and every binary buffer.`);
