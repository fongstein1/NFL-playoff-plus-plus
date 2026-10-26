import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import pool from '../api/backend/pool.mjs';
import scenarios from '../api/backend/scenarios.mjs';
import preview from '../api/backend/scenarios/preview.mjs';
import games from '../api/backend/games.mjs';
import weekly from '../api/backend/weekly.mjs';
const root=fileURLToPath(new URL('../public/',import.meta.url));
const routes={'/api/pool':pool,'/api/scenarios':scenarios,'/api/scenarios/preview':preview,'/api/weekly':weekly,'/api/games':games};
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff':'font/woff','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const handler=routes[url.pathname];
  if(handler){let body='';for await(const chunk of req){body+=chunk;if(body.length>131072){res.writeHead(413);res.end('Request too large.');return;}}req.body=body;req.headers['x-forwarded-proto']='http';req.headers['x-forwarded-host']=req.headers.host;return await handler(req,res);}
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const name=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/,''),file=path.resolve(root,name);
  if(!file.startsWith(root)){res.writeHead(403);res.end();return;}
  const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
 }catch(err){res.writeHead(err.code==='ENOENT'?404:500,{'Content-Type':'text/plain'});res.end(err.code==='ENOENT'?'Not found.':'Request failed.');}
});
server.listen(Number(process.env.PORT||4173),'0.0.0.0',()=>console.log(`Surplus Bowl listening on http://localhost:${server.address().port}`));
