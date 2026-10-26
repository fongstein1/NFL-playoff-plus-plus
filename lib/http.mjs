export async function webHandler(req,res,handler){
 const proto=req.headers['x-forwarded-proto']||'https',host=req.headers['x-forwarded-host']||req.headers.host;
 const body=req.method==='GET'||req.method==='HEAD'?undefined:typeof req.body==='string'?req.body:JSON.stringify(req.body||{});
 const request=new Request(`${proto}://${host}${req.url}`,{method:req.method,headers:Object.fromEntries(Object.entries(req.headers).filter(([,v])=>typeof v==='string')),body});
 const result=await handler(request);res.statusCode=result.status;result.headers.forEach((v,k)=>res.setHeader(k,v));res.end(await result.text());
}
