import {webHandler} from '../../lib/http.mjs';
import {fetchGameSource} from '../../lib/game-source.mjs';
export default async function handler(req,res){return webHandler(req,res,async request=>{if(request.method!=='GET')return Response.json({error:'Method not allowed.'},{status:405});try{return Response.json(await fetchGameSource(new URL(request.url).searchParams.get('event')),{headers:{'Cache-Control':'private, max-age=300'}});}catch(e){return Response.json({error:e.message},{status:400});}});}
