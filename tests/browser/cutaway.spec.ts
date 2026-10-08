import {test,expect} from '@playwright/test';
test('Cutaway clips visible anatomy in all atlases and persists offline',async({page,context})=>{
 test.setTimeout(900000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGLProgram/.test(m.text()))errors.push(m.text());});
 await page.setViewportSize({width:1280,height:900});await page.goto('/');
 const canvas=page.locator('canvas');
 const depth=async(value:number)=>{await page.getByRole('button',{name:'Cutaway view',exact:true}).click();await page.getByRole('spinbutton',{name:'Cutaway percentage'}).fill(String(value));await expect(canvas).toHaveAttribute('data-cutaway-depth',String(value/100));await page.keyboard.press('Escape');};
 const pixelsChanged=async(a:Buffer,b:Buffer)=>page.evaluate(async([a,b])=>{
  const arrays=await Promise.all([a,b].map(async png=>{const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+png)).blob());const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;const ctx=c.getContext('2d')!;ctx.drawImage(bitmap,0,0);return ctx.getImageData(0,0,c.width,c.height).data;}));
  let changed=0;for(let i=0;i<arrays[0].length;i+=4)if(Math.abs(arrays[0][i]-arrays[1][i])+Math.abs(arrays[0][i+1]-arrays[1][i+1])+Math.abs(arrays[0][i+2]-arrays[1][i+2])>35)changed++;return changed;
 },[a.toString('base64'),b.toString('base64')]);
 for(const model of ['male','female','extended']){
  await page.getByLabel('Reference model',{exact:true}).selectOption(model);await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:120000});await expect(page.getByRole('alert')).toHaveCount(0);
  await depth(0);await page.getByRole('button',{name:'front view',exact:true}).click();
  const whole=await page.screenshot({clip:{x:440,y:160,width:400,height:450}});
  await depth(50);const cut=await page.screenshot({path:`test-results/${model}-cutaway-view.png`,clip:{x:440,y:160,width:400,height:450}});
  expect(await pixelsChanged(whole,cut)).toBeGreaterThan(1000);
  const front=JSON.parse((await canvas.getAttribute('data-cutaway-plane'))!);expect(front[2]).toBeLessThan(-.9);
  await page.getByRole('button',{name:'back view',exact:true}).click();await expect.poll(async()=>JSON.parse((await canvas.getAttribute('data-cutaway-plane'))!)[2]).toBeGreaterThan(.9);
  await depth(100);await expect(canvas).toHaveAttribute('data-cutaway-depth','1');
  // Every source-bounds corner must fall in the clipped half-space at full depth.
  const atlas=await(await page.request.get('/models/'+(model==='male'?'atlas.json':model==='female'?'atlas-female.json':'atlas-extended.json'))).json();
  const plane=JSON.parse((await canvas.getAttribute('data-cutaway-plane'))!);
  let nearestRetainedCorner=-Infinity;
  for(const part of atlas.parts)for(let c=0;c<8;c++)nearestRetainedCorner=Math.max(nearestRetainedCorner,plane[0]*part.bounds[c&1?1:0][0]+plane[1]*part.bounds[c&2?1:0][1]+plane[2]*part.bounds[c&4?1:0][2]+plane[3]);
  expect(nearestRetainedCorner).toBeLessThan(0);
  await depth(0);await expect(canvas).toHaveAttribute('data-cutaway-plane','null');
 }
 await depth(35);await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await context.setOffline(true);await page.reload();await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:120000});await expect(canvas).toHaveAttribute('data-cutaway-depth','0.35');
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Cutaway view',exact:true}).click();await expect(page.getByRole('slider',{name:'Cutaway depth'})).toBeVisible();await page.getByRole('button',{name:'Restore whole model',exact:true}).click();await expect(canvas).toHaveAttribute('data-cutaway-depth','0');await page.keyboard.press('Escape');
 await depth(35);await page.getByRole('button',{name:'Reset view and layers',exact:true}).click();await expect(canvas).toHaveAttribute('data-cutaway-depth','0');expect(errors).toEqual([]);
});
