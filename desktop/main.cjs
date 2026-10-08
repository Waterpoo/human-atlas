const {app,BrowserWindow,shell,dialog}=require('electron');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
let server;
if(!app.requestSingleInstanceLock())app.quit();
app.whenReady().then(()=>{
 const root=path.join(__dirname,'../dist');
 server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.gz':'application/gzip','.bin':'application/octet-stream','.md':'text/plain'};
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);});
 }).listen(3017,'127.0.0.1',()=>{
  const origin=`http://127.0.0.1:${server.address().port}`;
  const win=new BrowserWindow({width:1400,height:950,title:'Halo Anatomy',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\//.test(url))shell.openExternal(url);return {action:'deny'};});
  win.webContents.on('will-navigate',(e,url)=>{if(new URL(url).origin!==origin)e.preventDefault();});
  win.loadURL(origin+'/?desktop=1');
 }).on('error',error=>{dialog.showErrorBox('Halo Anatomy could not start',`The local viewer could not start: ${error.message}. Close any application using port 3017 and try again.`);app.quit();});
});
app.on('window-all-closed',()=>app.quit());
app.on('before-quit',()=>server?.close());
