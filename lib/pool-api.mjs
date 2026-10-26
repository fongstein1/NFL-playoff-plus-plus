import {createHmac,timingSafeEqual} from 'node:crypto';
import {fetchGameSource} from './game-source.mjs';
import {replay,applyAction} from './pool-actions.mjs';
const headers={'Cache-Control':'no-store','Content-Type':'application/json'};
const json=(d,status=200,extra={})=>new Response(JSON.stringify(d),{status,headers:{...headers,...extra}});
const same=(a,b)=>{const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y);};
function session(secret,actor){const p=Buffer.from(JSON.stringify({...actor,exp:Date.now()+86400000})).toString('base64url');return p+'.'+createHmac('sha256',secret).update(p).digest('base64url');}
function parseSession(request,secret){try{const raw=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('pool_session='))?.slice(13);const [p,s]=raw.split('.');if(!same(s,createHmac('sha256',secret).update(p).digest('base64url')))return null;const a=JSON.parse(Buffer.from(p,'base64url'));return a.exp>Date.now()&&['admin','team'].includes(a.role)?{role:a.role,teamId:a.teamId}:null;}catch{return null;}}
export async function handlePool(request,{store,secret,configured=true}){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Same-origin requests only.'},403);
 if(!['GET','POST'].includes(request.method))return json({error:'Method not allowed.'},405);
 if(!configured||!secret)return json({error:'Shared pool setup is incomplete. Configure the Google Sheet and service-account credential in Vercel.'},503);
 const secure=new URL(request.url).protocol==='https:'?'; Secure':'';const cookie=value=>`pool_session=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${value?86400:0}${secure}`;
 try{
 let body={};if(request.method==='POST'){const text=await request.text();if(text.length>32768)return json({error:'Submission too large.'},413);body=JSON.parse(text);}
 if(body.mode==='logout')return json({ok:true},200,{'Set-Cookie':cookie('')});
 let actor=parseSession(request,secret);if(body.mode!=='login'&&!actor)return json({error:'Sign in with your team code.'},401);
 const data=await store.read();
 if(body.mode==='login'){const entry=data.access.find(row=>row[0]===body.teamId);if(!entry||typeof body.code!=='string'||body.code.length<12||!same(body.code,entry[2]))return json({error:'Team or access code not recognized.'},401);actor=body.teamId==='commissioner'?{role:'admin',teamId:'david'}:{role:'team',teamId:body.teamId};}
 let current=replay(data.initial,data.events);
 const output=()=>({state:current.state,revision:current.revision,actor});
 if(body.mode==='login')return json(output(),200,{'Set-Cookie':cookie(session(secret,actor))});
 if(request.method==='GET')return json(output());
 if(body.mode!=='mutate')return json({error:'Unknown request.'},400);
 if(typeof body.id!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(body.id)||!Number.isInteger(body.baseRevision))return json({error:'Invalid command identity.'},400);
 if(current.results.has(body.id)){const result=current.results.get(body.id);return json({...output(),...result},result.accepted?200:409);}
 if(body.baseRevision!==current.revision)return json({...output(),error:'Another submission arrived first. The latest pool is loaded; try your change again.'},409);
 let action=body.action?.type==='closeNewsWeek'?{...body.action,seed:createHmac('sha256',secret).update('weekly:'+body.id).digest('hex')}:body.action?.type==='pick'?{...body.action,newsPricing:true}:body.action;
 if(action?.type==='gameSource'){if(actor.role!=='admin')return json({error:'Commissioner access required.'},403);action={type:'gameSource',gameId:action.gameId,context:await fetchGameSource(action.eventId)};}
 try{applyAction(current.state,action,actor);}catch(err){return json({error:err.message},403);}
 if(data.events.length>=10000)return json({...output(),error:'The event log is full. Archive the season before adding more submissions.'},503);
 await store.append({schemaVersion:2,id:body.id,baseRevision:body.baseRevision,actor,action});
 const updated=await store.read();current=replay(updated.initial,updated.events);const result=current.results.get(body.id);if(!result)return json({error:'Save status is uncertain. Refresh before trying again.'},503);
 return json({...output(),...result,...(!result.accepted?{error:result.error}:{})},result.accepted?200:409);
 }catch(err){return json({error:err instanceof SyntaxError?'Invalid pool data.':err.message},err instanceof SyntaxError?400:503);}
}
