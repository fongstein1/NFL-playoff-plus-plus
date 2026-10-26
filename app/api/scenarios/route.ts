import {catalog,scenarioFor} from '../../../lib/scenario-engine.mjs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','Content-Type':'application/json'};
export async function GET(){return new Response(JSON.stringify(catalog()),{headers});}
export async function POST(request:Request){
 const origin=request.headers.get('Origin');
 if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Same-origin requests only.'},{status:403,headers});
 if(Number(request.headers.get('Content-Length')||0)>4096)return Response.json({error:'Request too large.'},{status:413,headers});
 try{const raw=await request.text();if(raw.length>4096)return Response.json({error:'Request too large.'},{status:413,headers});const body=JSON.parse(raw);const result=scenarioFor(body);return new Response(JSON.stringify(result),{headers});}catch(e){return Response.json({error:e instanceof Error?e.message:'Invalid scenario request.'},{status:400,headers});}
}
