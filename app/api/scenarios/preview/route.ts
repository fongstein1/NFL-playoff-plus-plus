import {previewPortfolios} from '../../../../lib/portfolio-preview.mjs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','Content-Type':'application/json'};
export async function POST(request:Request){
 const origin=request.headers.get('Origin');
 if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Same-origin requests only.'},{status:403,headers});
 try{const raw=await request.text();if(raw.length>32768)return Response.json({error:'Request too large.'},{status:413,headers});return Response.json(previewPortfolios(JSON.parse(raw)),{headers});}catch(e){return Response.json({error:e instanceof Error?e.message:'Invalid preview.'},{status:400,headers});}
}
