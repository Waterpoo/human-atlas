import {readdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const files=[];
async function walk(dir,prefix=''){for(const e of await readdir(dir,{withFileTypes:true})){const p=prefix+'/'+e.name;if(e.isDirectory())await walk(dir+'/'+e.name,p);else if(!p.endsWith('.bin')&&!['/sw.js','/offline-manifest.json'].includes(p))files.push(p);}}
await walk('dist');
const hash=createHash('sha256');for(const file of files.sort())hash.update(await readFile('dist'+file));
await writeFile('dist/offline-manifest.json',JSON.stringify({version:hash.digest('hex').slice(0,16),files}));
console.log(`Offline manifest: ${files.length} assets, including all model chunks.`);
