import {_electron as electron} from '@playwright/test';
import assert from 'node:assert/strict';
const exe=process.argv[2];
const app=await electron.launch(exe?{executablePath:exe}:{args:['desktop/main.cjs']});
try{
 const page=await app.firstWindow();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const url=new URL(route.request().url());return url.hostname==='127.0.0.1'?route.continue():route.abort();});
 await page.waitForSelector('canvas');
 await page.getByText('Preparing the anatomy').waitFor({state:'hidden',timeout:90000});
 await page.getByRole('button',{name:'RMT Study',exact:true}).click();
 await page.getByRole('region',{name:'RMT study'}).getByRole('heading',{name:'Trapezius'}).waitFor();
 assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences().nodeIntegration),false);
 assert.deepEqual(errors,[]);
 console.log('Desktop starts with external network requests blocked, loads bundled geometry, opens study tools, and disables renderer Node integration.');
}finally{await app.close();}
