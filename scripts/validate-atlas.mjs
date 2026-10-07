import fs from 'node:fs';
import assert from 'node:assert/strict';
const filename=process.argv[2]??'atlas.json';
const base=new URL('../public/models/',import.meta.url),atlas=JSON.parse(fs.readFileSync(new URL(filename,base)));
const female=filename==='atlas-female.json';assert.equal(atlas.parts.length,female?888:2234);assert.equal(atlas.concepts.length,female?1073:3432);
if(!female){for(const id of ['FJ1423','FJ1423M'])assert.equal(atlas.parts.find(p=>p.id===id)?.system,'connective',`${id}: iliotibial fascia must not appear in Skeleton`);}
if(!female){
 for(const baseId of ['FJ1409','FJ1410','FJ1411','FJ1439','FJ1440','FJ1504','FJ1532'])for(const suffix of ['', 'M']){
  const id=baseId+suffix;assert.equal(atlas.parts.find(p=>p.id===id)?.system,'muscular',`${id}: skeletal muscle must be in Muscles`);
 }
}
for(const p of atlas.parts.filter(p=>p.system==='skeletal'))assert.ok(!/\b(fibularis|tibialis|subscapularis|levator scapulae|muscle)\b/i.test(p.name),`${p.id}: muscle incorrectly classified as Skeleton`);
const ids=new Set(atlas.parts.map(p=>p.id));assert.equal(ids.size,atlas.parts.length);
const files=atlas.chunks.map(c=>{const b=fs.readFileSync(new URL(c.url.split('/').pop(),base));assert.equal(b.length,c.bytes);return b;});
let tris=0;
for(const p of atlas.parts){assert.ok(p.name.trim()&&p.name!=='-'&&!p.name.includes('Bounds('));assert.ok(p.conceptId!=='-');assert.ok(p.system);const b=files[p.chunk];assert.ok(p.indices+p.indexCount*4<=b.length);const pos=new Float32Array(b.buffer,b.byteOffset+p.positions,p.vertexCount*3),indices=new Uint32Array(b.buffer,b.byteOffset+p.indices,p.indexCount);assert.ok(indices.length>=3);for(const i of indices)assert.ok(i<p.vertexCount,`${p.id}: invalid vertex`);for(const value of pos)assert.ok(Number.isFinite(value));tris+=p.indexCount/3;}
for(const c of atlas.concepts){assert.ok(c.elements.length);for(const id of c.elements)assert.ok(ids.has(id),`${c.id}: missing ${id}`);}
assert.equal(tris,atlas.triangles);
console.log(`Verified ${ids.size} individually indexed meshes, ${atlas.concepts.length} complete concept mappings, ${tris.toLocaleString()} triangles, and every binary buffer.`);
