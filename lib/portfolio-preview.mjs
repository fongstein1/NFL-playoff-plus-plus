import {assetReturns,scenarioFor,modelVersion,deck,transmissionFor} from './scenario-engine.mjs';
import {assetIds,normalizedWeights} from '../public/portfolio-schema.mjs';
export function previewPortfolios(input={}){
 const {portfolios,mode='direct'}=input;
 if(!Array.isArray(portfolios)||!portfolios.length||portfolios.length>50)throw Error('Provide between 1 and 50 portfolios.');
 const normalized=portfolios.map(p=>({...p,weights:p?.weights?normalizedWeights(p.weights):null}));
 const seen=new Set();
 for(const p of normalized){if(!p||typeof p.id!=='string'||!p.id||p.id.length>80||seen.has(p.id))throw Error('Each portfolio needs a unique ID.');seen.add(p.id);if(typeof p.name!=='string'||!p.name.trim()||p.name.length>100)throw Error('Invalid portfolio name.');if(!Number.isFinite(p.balance)||p.balance<0||p.balance>1e12)throw Error('Invalid portfolio balance.');if(!p.weights||!assetIds.every(k=>Number.isFinite(p.weights[k])&&p.weights[k]>=0&&p.weights[k]<=100)||Math.abs(assetIds.reduce((n,k)=>n+p.weights[k],0)-100)>1e-8)throw Error('Portfolio allocations must add to 100%.');}
 let returns,headline,why,factors=null,seed=null,scenarioId=null;
 if(mode==='direct'){returns=input.returns?{...Object.fromEntries(assetIds.map(k=>[k,0])),...input.returns}:input.returns;if(!returns||!assetIds.every(k=>Number.isFinite(returns[k])&&Math.abs(returns[k])<=50))throw Error('Each asset move must be between −50% and +50%.');returns=Object.fromEntries(assetIds.map(k=>[k,returns[k]]));headline='Custom market moves';why='Each asset move is applied once to the current target allocation.';}
 else if(mode==='economic'){factors=input.factors;returns=assetReturns(factors);headline='Custom economic scenario';why='Economic shocks flow through the game’s factor sensitivities. Asset returns are capped at ±8%.';}
 else if(mode==='preset'||mode==='generate'){
  const strength={mild:.5,moderate:1,severe:1.8}[input.severity||'moderate'];if(strength===undefined)throw Error('Unknown severity.');
  seed=input.seed||'preview';let chosen=input.scenarioId;if(mode==='generate'){const candidates=deck.filter(e=>input.severity!=='severe'||e.id!=='quiet');let hash=2166136261;for(const c of seed){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619);}chosen=candidates[(hash>>>0)%candidates.length].id;}const e=scenarioFor({day:1,scenarioId:chosen,seed});
  factors=Object.fromEntries(Object.entries(e.factors).map(([k,v])=>[k,Math.max(['ratesBps','riskBps','creditBps'].includes(k)?-100:-5,Math.min(['ratesBps','riskBps','creditBps'].includes(k)?100:5,Math.round(v*strength*10000)/10000))]));returns=assetReturns(factors);headline=e.headline;why=e.why;scenarioId=e.id;
 }else throw Error('Unknown scenario mode.');
 const results=normalized.map(p=>{const contributions=Object.fromEntries(assetIds.map(k=>[k,p.balance*p.weights[k]/100*returns[k]/100]));const gain=Object.values(contributions).reduce((a,b)=>a+b,0);return{id:p.id,name:p.name,opening:p.balance,weights:{...p.weights},contributions,gain,returnPct:p.balance?gain/p.balance*100:0,closing:p.balance+gain};});
 return {previewOnly:true,mode,scenarioId,strength:input.severity||'moderate',headline,why,returns,factors,transmission:factors?transmissionFor(factors):null,seed,modelVersion,results,totalChange:results.reduce((n,p)=>n+p.gain,0)};
}
