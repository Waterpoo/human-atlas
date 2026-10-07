import {test,expect} from '@playwright/test';
import {PerspectiveCamera,Vector3} from 'three';
import {gunzipSync} from 'node:zlib';
test('Extended atlas joints are searchable, selectable, isolated, and available offline with saved appearance',async({page,context})=>{
 test.setTimeout(600000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.getByLabel('Reference model',{exact:true}).selectOption('extended');
 await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:120000});await expect(page.getByRole('alert')).toHaveCount(0);
 const atlas=await (await page.request.get('/models/atlas-extended.json')).json();
 expect(atlas.parts.length).toBe(2821);expect(atlas.parts.filter((p:{system:string})=>p.system==='joints').length).toBe(349);
 for(const system of ['skeletal','muscular','cardiac','arterial','venous','nervous','lymphatic','connective','sensory','digestive','endocrine','respiratory','urinary','reproductive','joints']){
 const button=page.locator('.system-name').filter({hasText:({skeletal:'Skeleton',muscular:'Muscles',cardiac:'Heart',arterial:'Arteries',venous:'Veins',nervous:'Nervous system',lymphatic:'Lymphatic',connective:'Connective tissue',sensory:'Sensory organs',digestive:'Digestive',endocrine:'Endocrine',respiratory:'Respiratory',urinary:'Urinary',reproductive:'Reproductive',joints:'Joints'} as Record<string,string>)[system]});
 const count=atlas.parts.filter((p:{system:string})=>p.system===system).length;if(!count)continue;await button.click();
 await expect.poll(async()=>JSON.parse((await page.locator('canvas').getAttribute('data-visible-system-counts'))??'{}')[system]).toBe(count);
 await page.screenshot({path:`test-results/extended-${system}-view.png`});
 }
 await page.locator('.system-name').filter({hasText:'Joints'}).click();
 await expect.poll(async()=>JSON.parse((await page.locator('canvas').getAttribute('data-visible-system-counts'))??'{}').joints).toBe(349);
 await page.getByRole('button',{name:'front view',exact:true}).click();
 const canvas=page.locator('canvas'),box=(await canvas.boundingBox())!;let picked=false;
 const capsule=atlas.parts.find((p:{sourceName:string})=>p.sourceName==='Articular capsule of knee joint.l');
 const response=await page.request.get(atlas.chunks[capsule.chunk].gzip);let buffer=await response.body();if(buffer[0]===31&&buffer[1]===139)buffer=gunzipSync(buffer);
 const camera=new PerspectiveCamera(34,box.width/box.height,.005,100),target=new Vector3(0,.68,0);camera.position.copy(target).addScaledVector(new Vector3(0,.02,1).normalize(),4);camera.lookAt(target);camera.updateMatrixWorld();
 // Aim at real triangle centroids on the imported capsule through the pointer path.
 for(let t=0;t<Math.min(30,capsule.indexCount/3);t++){
 const triangle=Math.floor(t*(capsule.indexCount/3)/30)*3,point=new Vector3();
 for(let k=0;k<3;k++){const i=buffer.readUInt32LE(capsule.indices+(triangle+k)*4);point.add(new Vector3(buffer.readFloatLE(capsule.positions+i*12),buffer.readFloatLE(capsule.positions+i*12+4),buffer.readFloatLE(capsule.positions+i*12+8)));}
 point.multiplyScalar(1/3).project(camera);await canvas.click({position:{x:(point.x+1)*box.width/2,y:(1-point.y)*box.height/2}});
 if(await page.locator('.detail-sheet').count()){picked=true;break;}
 }
 expect(picked,'A rendered joint surface must be selectable with a pointer').toBe(true);
 await page.getByRole('button',{name:'Clear selection',exact:true}).click();
 await page.getByRole('button',{name:'Search anatomy',exact:true}).click();await page.getByLabel('Search named anatomical structures',{exact:true}).fill('Left knee joint');
 await page.getByRole('option').filter({hasText:'Left knee joint'}).click();
 await expect(page.getByRole('heading',{name:'Left knee joint',exact:true})).toBeVisible();
 const knee=atlas.concepts.find((c:{name:string})=>c.name==='Left knee joint');
 await expect.poll(async()=>JSON.parse((await page.locator('canvas').getAttribute('data-selected-parts'))??'[]')).toEqual(knee.elements);
 await page.getByRole('button',{name:'Isolate structure',exact:false}).click();
 await expect.poll(async()=>Object.values(JSON.parse((await page.locator('canvas').getAttribute('data-visible-system-counts'))??'{}')).reduce((a:number,b)=>a+Number(b),0)).toBe(knee.elements.length);
 await page.screenshot({path:'test-results/extended-knee-view.png'});
 await page.getByRole('button',{name:'View appearance',exact:true}).click();await page.getByRole('button',{name:'Dark background',exact:true}).click();
 const contrast=page.getByRole('slider',{name:'Model contrast',exact:true});await contrast.focus();await contrast.press('Home');for(let i=0;i<100;i++)await contrast.press('ArrowRight');
 await expect(page.locator('canvas')).toHaveAttribute('data-background','#202936');await expect(page.locator('canvas')).toHaveAttribute('data-model-contrast','1.5');
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Reset view and layers',exact:true}).click();
 await expect(page.locator('canvas')).toHaveAttribute('data-background','#202936');await expect(page.locator('canvas')).toHaveAttribute('data-model-contrast','1.5');
 await page.locator('.system-name').filter({hasText:'Skeleton'}).click();await page.screenshot({path:'test-results/extended-skeleton-contrast-view.png'});
 await page.waitForFunction(async()=>!!navigator.serviceWorker.controller&&(await navigator.serviceWorker.ready).active?.state==='activated');
 await page.waitForFunction(async()=>{const c=await caches.open((await caches.keys()).find(k=>k.startsWith('halo-'))!);return !!await c.match('/models/extended-33.bin.gz',{ignoreVary:true});},undefined,{timeout:120000});
 await context.setOffline(true);await page.reload();await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:120000});await expect(page.getByRole('alert')).toHaveCount(0);
 await expect(page.getByLabel('Reference model',{exact:true})).toHaveValue('extended');await expect(page.locator('canvas')).toHaveAttribute('data-background','#202936');await expect(page.locator('canvas')).toHaveAttribute('data-model-contrast','1.5');
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'View appearance',exact:true}).click();await expect(page.getByLabel('Background color',{exact:true})).toBeVisible();await page.keyboard.press('Escape');
 expect(errors).toEqual([]);
});
