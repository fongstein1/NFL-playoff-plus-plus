import assert from 'node:assert/strict';
import {calculateReinsurance,compareReinsurance,demoRisks,claimScenarios,defaultTerms} from '../lib/reinsurance.mjs';
import {POST} from '../app/api/reinsurance/route.ts';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const input={capital:1000,risks:structuredClone(demoRisks),claims:structuredClone(claimScenarios.storm.claims),terms:{...defaultTerms}};
const original=JSON.stringify(input);
const q=calculateReinsurance({...input,type:'quota'});close(q.recovery,152);close(q.retainedLoss,228);close(q.cededPremium,28.8);close(q.commission,4.32);close(q.endingCapital,819.52);close(q.retainedLoss/(q.grossPremium-q.cededPremium),q.grossLoss/q.grossPremium);
const s=calculateReinsurance({...input,type:'surplus'});close(s.recovery,240);close(s.cededPremium,40);close(s.commission,6);close(s.endingCapital,898);close(s.shares[0].share,0);close(s.shares[2].cededSum,400);close(s.shares[2].retainedSum,200);assert.ok(s.shares[2].retainedSum>s.terms.line);
const x=calculateReinsurance({...input,type:'riskXL'});close(x.recovery,150);close(x.endingCapital,824);close(x.rows.find(c=>c.riskId==='c').retained,160);
const cat=calculateReinsurance({...input,type:'eventXL'});close(cat.recovery,200);close(cat.endingCapital,872);
const unrelated=calculateReinsurance({...input,type:'eventXL',claims:claimScenarios.unrelated.claims});close(unrelated.recovery,0);
const eventOnly=calculateReinsurance({...input,type:'eventXL',claims:claimScenarios.unrelated.claims,terms:{...defaultTerms,minRisks:1}});close(eventOnly.recovery,90);
const agg=calculateReinsurance({...input,type:'aggregate'});close(agg.aggregateAttachment,57.6);close(agg.recovery,150);close(agg.endingCapital,827);
const small={...input,claims:claimScenarios.small.claims};close(calculateReinsurance({...small,type:'riskXL'}).recovery,20);close(calculateReinsurance({...small,type:'aggregate'}).recovery,150);close(calculateReinsurance({...small,type:'eventXL'}).recovery,0);
const single={...input,claims:claimScenarios.large.claims};close(calculateReinsurance({...single,type:'riskXL'}).recovery,80);close(calculateReinsurance({...single,type:'eventXL'}).recovery,0);
// Two claim records on one risk/occurrence must share one attachment and limit.
const split={...input,claims:[{riskId:'c',eventId:'e',amount:60},{riskId:'c',eventId:'e',amount:60}]};close(calculateReinsurance({...split,type:'riskXL'}).recovery,70);
for(const scenario of Object.values(claimScenarios))for(const r of compareReinsurance({...input,claims:scenario.claims}).results){assert.ok(r.recovery>=0&&r.recovery<=r.grossLoss);close(r.recovery+r.retainedLoss,r.grossLoss);close(r.underwriting+r.reinsurerResult,r.grossPremium-r.grossLoss);close(r.rows.reduce((n,c)=>n+c.recovery,0),r.recovery);close(r.endingCapital,input.capital+r.underwriting);}
for(const r of compareReinsurance({...input,claims:[]}).results){close(r.recovery,0);close(r.retainedLoss,0);}
const quiet=calculateReinsurance({...input,type:'riskXL',claims:claimScenarios.quiet.claims});assert.ok(quiet.benefitVsNone<0);
assert.equal(JSON.stringify(input),original);
assert.throws(()=>calculateReinsurance({...input,claims:[{riskId:'a',eventId:'e',amount:101}]}));
assert.throws(()=>calculateReinsurance({...input,terms:{share:1.1}}));
assert.throws(()=>calculateReinsurance({...input,terms:{line:0}}));
assert.throws(()=>calculateReinsurance({...input,claims:[{riskId:'a',eventId:'e',amount:-1}]}));
const response=await POST(new Request('https://pool.example/api/reinsurance',{method:'POST',body:JSON.stringify(input)}));assert.equal(response.status,200);assert.equal((await response.json()).results.length,6);
const invalid=await POST(new Request('https://pool.example/api/reinsurance',{method:'POST',body:'{}'}));assert.equal(invalid.status,400);
console.log('PASS: independently worked treaty examples, line-capacity surplus share, risk/event aggregation, stop-loss limit, commission accounting, cost trade-offs, reconciliation, input validation and API');
