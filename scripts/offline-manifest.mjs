import {readdir,writeFile,readFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await copyFile('LICENSE','dist/LICENSE.txt');
const files=[];
async function walk(dir,prefix=''){for(const e of await readdir(dir,{withFileTypes:true})){const p=prefix+'/'+e.name;if(e.isDirectory())await walk(dir+'/'+e.name,p);else if(!p.endsWith('.bin')&&!['/sw.js','/offline-manifest.json'].includes(p))files.push(p);}}
await walk('dist');
const hash=createHash('sha256');for(const file of files.sort())hash.update(await readFile('dist'+file));
const version=hash.digest('hex').slice(0,16);
await writeFile('dist/offline-manifest.json',JSON.stringify({version,files}));
// A changed build must change the worker bytes so installed browsers update.
await writeFile('dist/sw.js',`// Offline build ${version}\n`+await readFile('public/sw.js','utf8'));
console.log(`Offline manifest: ${files.length} assets, including all model chunks.`);
