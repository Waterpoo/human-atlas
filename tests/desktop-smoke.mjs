import {_electron as electron} from '@playwright/test';
import assert from 'node:assert/strict';
const exe=process.argv[2];
const gpu=process.arch==='arm64'?[]:['--use-gl=angle','--use-angle=swiftshader-webgl','--enable-unsafe-swiftshader'];
console.log('Launching packaged desktop:',exe??'development');
const watchdog=setTimeout(()=>{console.error('Desktop smoke test exceeded eight minutes');process.exit(1);},480000);
const app=await electron.launch(exe?{executablePath:exe,args:gpu,timeout:180000}:{args:['desktop/main.cjs',...gpu],timeout:180000});
console.log('Electron connected');
try{
 const page=await app.firstWindow({timeout:180000});console.log('Window opened');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const url=new URL(route.request().url());return url.hostname==='127.0.0.1'?route.continue():route.abort();});
 await page.waitForSelector('canvas',{timeout:90000});console.log('WebGL canvas ready');
 await page.getByText('Preparing the anatomy').waitFor({state:'hidden',timeout:90000});
 assert.equal(await page.getByRole('alert').count(),0,'Bundled geometry must load without errors');
 await page.getByLabel('Reference model',{exact:true}).selectOption('female');
 await page.getByText('888 modeled pieces',{exact:false}).waitFor({timeout:90000});
 await page.getByText('Preparing the anatomy').waitFor({state:'hidden',timeout:90000});
 assert.equal(await page.getByRole('alert').count(),0,'Female bundled geometry must load offline');
 await page.getByLabel('Reference model',{exact:true}).selectOption('male');
 await page.getByText('2,234 modeled pieces',{exact:false}).waitFor({timeout:90000});
 await page.getByText('Preparing the anatomy').waitFor({state:'hidden',timeout:90000});
 await page.getByRole('button',{name:'Move camera up',exact:true}).click();
 await page.getByRole('button',{name:'RMT Study',exact:true}).click();
 await page.getByRole('region',{name:'RMT study'}).getByRole('heading',{name:'Trapezius'}).waitFor();
 assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences().nodeIntegration),false);
 assert.deepEqual(errors,[]);
 console.log('Desktop starts with external network requests blocked, loads both bundled models, moves the camera, opens study tools, and disables renderer Node integration.');
}catch(error){const page=(await app.windows())[0];if(page){console.error(await page.locator('body').innerText());await page.screenshot({path:'desktop-failure.png'});}throw error;}finally{await app.close();clearTimeout(watchdog);}
