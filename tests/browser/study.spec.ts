import {test,expect} from '@playwright/test';
test('Study, saved notes, quiz, 3D matching, and complete offline reload',async({page,context})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:60000});await expect(page.getByRole('alert')).toHaveCount(0);
 await page.getByRole('button',{name:'Muscle reference',exact:true}).click();
 const study=page.getByRole('region',{name:'Muscle reference'});
 await expect(study.getByRole('heading',{name:'Trapezius',exact:true})).toBeVisible();
 await study.getByRole('button',{name:'Show in 3D'}).click();
 await study.getByLabel('Region',{exact:true}).selectOption('Leg');
 await expect(study.getByRole('heading',{name:'Gastrocnemius',exact:true})).toBeVisible();
 await study.getByLabel('Region',{exact:true}).selectOption('All');
 await study.getByLabel('Muscle',{exact:true}).selectOption('Latissimus dorsi');
 await expect(study.getByRole('heading',{name:'Latissimus dorsi',exact:true})).toBeVisible();
 await expect(study.getByText('No corresponding mesh in this dataset.')).toBeVisible();
 await study.getByLabel('Muscle',{exact:true}).selectOption('Trapezius');
 await expect(page.getByRole('heading',{name:'Trapezius',exact:true}).last()).toBeVisible();
 await study.getByRole('button',{name:'Save favorite'}).click();
 await study.getByRole('textbox',{name:'My study notes'}).fill('Review scapular upward rotation.');
 await study.getByRole('button',{name:'quiz',exact:true}).click();await study.getByRole('button',{name:'Reveal answer'}).click();await study.getByRole('button',{name:'I knew it'}).click();
 await expect(study.getByText('1 / 1 recalled',{exact:false})).toBeVisible();
 const downloadPromise=page.waitForEvent('download');
 await study.getByRole('button',{name:'Export study backup'}).click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('halo-anatomy-study.json');
 const backup=JSON.parse(await (await import('node:fs/promises')).readFile((await download.path())!,'utf8'));
 expect(backup.notes.Trapezius).toBe('Review scapular upward rotation.');
 await study.locator('input[type=file]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{}')});
 await expect(study.getByRole('status')).toHaveText('Invalid backup. Your existing study data was kept.');
 await study.getByRole('button',{name:'reference',exact:true}).click();
 await study.locator('input[type=file]').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...backup,notes:{Trapezius:'Restored note.'}}))});
 await expect(study.getByRole('textbox',{name:'My study notes'})).toHaveValue('Restored note.');
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await context.setOffline(true);await page.reload();
 await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:60000});await expect(page.getByRole('alert')).toHaveCount(0);
 await page.getByRole('button',{name:'Muscle reference',exact:true}).click();
 await expect(study.getByRole('textbox',{name:'My study notes'})).toHaveValue('Restored note.');
 await study.getByRole('button',{name:'favorites',exact:true}).click();await expect(study.getByRole('heading',{name:'Trapezius'})).toBeVisible();
 await page.setViewportSize({width:390,height:844});await expect(study).toBeVisible();
 expect(errors).toEqual([]);
});

test('Female model, clear selections, stage-free camera pan, and both models offline',async({page,context})=>{
 test.setTimeout(420000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:90000});
 await page.screenshot({path:'test-results/male-view.png'});
 const canvas=page.locator('canvas');
 const target=async()=>Number(await canvas.getAttribute('data-camera-target-y'));
 const start=await target();
 await page.getByRole('button',{name:'Move camera up',exact:true}).click();
 await expect.poll(target).toBeCloseTo(start+.15,2);
 await page.getByRole('button',{name:'Move camera down',exact:true}).click();
 await expect.poll(target).toBeCloseTo(start,2);
 await page.getByRole('button',{name:'Pan camera',exact:true}).click();
 await expect(canvas).toHaveAttribute('data-navigation','pan');
 const box=(await canvas.boundingBox())!;
 await page.mouse.move(box.width*.55,box.height*.45);await page.mouse.down();
 await page.mouse.move(box.width*.55,box.height*.55,{steps:12});await page.mouse.up();
 await expect.poll(async()=>Math.abs((await target())-start)).toBeGreaterThan(.02);
 await page.getByRole('button',{name:'Reset view and layers',exact:true}).click();
 await expect(canvas).toHaveAttribute('data-navigation','orbit');
 await expect.poll(target).toBeCloseTo(start,2);
 await page.getByLabel('Reference model',{exact:true}).selectOption('female');
 await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:90000});
 await expect(page.getByRole('alert')).toHaveCount(0);
 await expect(page.getByText('888 modeled pieces',{exact:false})).toBeVisible();
 await page.screenshot({path:'test-results/female-view.png'});
 await expect(page.getByText('Partial muscle and skeleton coverage')).toBeVisible();
 await expect(page.getByRole('switch',{name:'Show pregnancy reference'})).not.toBeChecked();
 await page.getByRole('button',{name:'Muscle reference',exact:true}).click();
 await expect(page.getByRole('region',{name:'Muscle reference'}).getByText('No corresponding mesh in this dataset.')).toBeVisible();
 await page.getByRole('button',{name:'Close Muscle reference'}).click();
 await page.getByRole('button',{name:'Search anatomy',exact:true}).click();
 await page.getByLabel('Search named anatomical structures').fill('uterus');
 await page.getByRole('option').filter({has:page.getByText('uterus',{exact:true})}).click();
 await expect(page.getByRole('heading',{name:'uterus',exact:true})).toBeVisible();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await context.setOffline(true);await page.reload();
 await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:90000});
 await expect(page.getByLabel('Reference model',{exact:true})).toHaveValue('female');
 await expect(page.getByRole('alert')).toHaveCount(0);
 await page.getByLabel('Reference model',{exact:true}).selectOption('male');
 await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:90000});
 await expect(page.getByText('2,234 modeled pieces',{exact:false})).toBeVisible();
 await expect(page.getByRole('heading',{name:'uterus',exact:true})).toHaveCount(0);
 await expect(page.getByRole('alert')).toHaveCount(0);
 await page.setViewportSize({width:390,height:844});
 await expect(page.getByLabel('Reference model',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Move camera up',exact:true})).toBeVisible();
 await page.screenshot({path:'test-results/mobile-view.png'});
 expect(errors).toEqual([]);
});

 test('System opacity and editable structure separation persist',async({page})=>{
 await page.goto('/');await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:90000});
 const muscles=page.getByRole('slider',{name:'Muscles opacity',exact:true});
 await muscles.focus();await muscles.press('Home');for(let i=0;i<25;i++)await muscles.press('ArrowRight');await expect(muscles).toHaveValue('25');
 await expect.poll(async()=>JSON.parse((await page.locator('canvas').getAttribute('data-system-opacity'))??'{}').muscular).toBe(.25);
 const skeleton=page.getByRole('slider',{name:'Skeleton opacity',exact:true});await expect(skeleton).toHaveValue('100');
 await muscles.press('Home');await expect(page.getByRole('switch',{name:'Show muscles',exact:true})).not.toBeChecked();
 await page.getByRole('switch',{name:'Show muscles',exact:true}).click();await expect(muscles).toHaveValue('100');await muscles.focus();await muscles.press('Home');for(let i=0;i<25;i++)await muscles.press('ArrowRight');
 const separation=page.getByRole('slider',{name:'Structure separation',exact:true});await separation.focus();await separation.press('Home');for(let i=0;i<30;i++)await separation.press('ArrowRight');
 await expect(page.getByRole('spinbutton',{name:'Separation percentage'})).toHaveValue('30');
 await page.getByRole('spinbutton',{name:'Separation percentage'}).fill('45');await expect(separation).toHaveValue('45');
 await page.reload();await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:90000});
 await expect(muscles).toHaveValue('25');await expect(separation).toHaveValue('45');
 await page.getByRole('button',{name:'Reset view and layers'}).click();await expect(muscles).toHaveValue('100');await expect(separation).toHaveValue('0');
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open system layers'}).click();await expect(muscles).toBeVisible();await muscles.focus();await muscles.press('Home');for(let i=0;i<40;i++)await muscles.press('ArrowRight');await expect(muscles).toHaveValue('40');
 });

 test('Every available system renders its complete component inventory in both models',async({page})=>{
 test.setTimeout(360000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 for(const sex of ['male','female']){
 await page.getByLabel('Reference model',{exact:true}).selectOption(sex);await expect(page.getByText('Preparing the anatomy')).toBeHidden({timeout:90000});
 const atlas=await (await page.request.get(sex==='male'?'/models/atlas.json':'/models/atlas-female.json')).json();
 if(sex==='female'){
 for(const p of atlas.parts.filter((p:{id:string})=>p.id.startsWith('Allen_')))expect(p.system).toBe('nervous');
 for(const p of atlas.parts.filter((p:{name:string})=>/articular cartilage|cruciate ligament|collateral ligament/i.test(p.name)))expect(p.system).toBe('joints');
 expect(atlas.parts.find((p:{id:string})=>p.id==='VH_F_superior_rectal_vein').reviewFlags.length).toBeGreaterThan(0);
 }
 if(sex==='male'){
 for(const baseId of ['FJ1409','FJ1410','FJ1411','FJ1439','FJ1440','FJ1504','FJ1532'])for(const suffix of ['', 'M'])expect(atlas.parts.find((p:{id:string})=>p.id===baseId+suffix)?.system).toBe('muscular');
 }
 for(const [id,name] of Object.entries({joints:'Joints',skeletal:'Skeleton',muscular:'Muscles',cardiac:'Heart',sensory:'Sensory organs',arterial:'Arteries',venous:'Veins',nervous:'Nervous system',respiratory:'Respiratory',digestive:'Digestive',urinary:'Urinary',lymphatic:'Lymphatic',endocrine:'Endocrine',reproductive:'Reproductive',integumentary:'Body surface',pregnancy:'Pregnancy reference',connective:'Connective tissue'})){
 const expected=atlas.parts.filter((p:{system:string})=>p.system===id).length;if(!expected)continue;
 await page.locator('.system-name').filter({hasText:name}).click();
 await expect.poll(async()=>JSON.parse((await page.locator('canvas').getAttribute('data-visible-system-counts'))??'{}')).toEqual(Object.fromEntries(Object.keys({joints:1,skeletal:1,muscular:1,cardiac:1,sensory:1,arterial:1,venous:1,nervous:1,respiratory:1,digestive:1,urinary:1,lymphatic:1,endocrine:1,reproductive:1,integumentary:1,pregnancy:1,connective:1}).map(s=>[s,s===id?expected:0])));
 await expect(page.getByRole('alert')).toHaveCount(0);await page.screenshot({path:`test-results/${sex}-${id}-view.png`});
 }
 }
 expect(errors).toEqual([]);
 });
