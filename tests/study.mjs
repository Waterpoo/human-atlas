import assert from 'node:assert/strict';
import {RMT_STUDY,rmtStudyFor} from '../app/rmt-study.ts';
import {readFile} from 'node:fs/promises';
assert.equal(rmtStudyFor(''),undefined);assert.equal(rmtStudyFor('biceps'),undefined);assert.equal(rmtStudyFor('left biceps brachii muscle')?.name,'Biceps brachii');assert.equal(rmtStudyFor('brain'),undefined);
const atlas=JSON.parse(await readFile('public/models/atlas.json'));
for(const e of RMT_STUDY){for(const key of ['origin','insertion','action','innervation'])assert.ok(e[key].trim().length>0);assert.equal(atlas.concepts.some(c=>rmtStudyFor(c.name)?.name===e.name),e.name!=='Latissimus dorsi',`Unexpected coverage for ${e.name}`);}
console.log('Study content, exact matching, and 3D catalogue coverage passed.');
