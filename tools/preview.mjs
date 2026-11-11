import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.webm':'video/webm','.mp4':'video/mp4','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);if(pathname.split('/').some(s=>s.startsWith('.'))){res.writeHead(403);res.end();return;}
 let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 if((await stat(file)).isDirectory())file=path.join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(req.method==='HEAD'?undefined:data);
}catch{res.writeHead(404);res.end('Not found');}}).listen(48810,'127.0.0.1',()=>console.log('Local preview http://127.0.0.1:48810/beregner/'));
