import {webHandler} from '../../lib/http.mjs';
import {applyAction} from '../../lib/pool-actions.mjs';
export default async function handler(req,res){return webHandler(req,res,async request=>{
 if(request.method!=='POST')return Response.json({error:'Method not allowed.'},{status:405});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Same-origin requests only.'},{status:403});
 try{const raw=await request.text();if(raw.length>131072)return Response.json({error:'Request too large.'},{status:413});const {state,action}=JSON.parse(raw);if(!['closeNewsWeek','nextNewsWeek','discussion'].includes(action?.type))throw Error('Unknown weekly preview.');return Response.json({previewOnly:true,state:applyAction(state,action,{role:'admin',teamId:'david'})},{headers:{'Cache-Control':'no-store'}});}catch(e){return Response.json({error:e.message},{status:400});}
});}
