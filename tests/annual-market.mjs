import assert from 'node:assert/strict';
import {annualReturns,annualFunds,modelCovariance} from '../lib/annual-market.mjs';
const zero={growth:0,inflation:0,ratesBps:0,riskBps:0,earnings:0,property:0,creditBps:0};
const base=annualReturns(zero,{volatility:false});for(const [k,a]of Object.entries(annualFunds))assert.ok(Math.abs(base.returns[k]-a.base*100)<1e-6);
const spread=annualReturns({...zero,creditBps:-20},{volatility:false});assert.equal(spread.returns.bonds,base.returns.bonds);assert.ok(spread.returns.corporate>base.returns.corporate);
const f={...zero,ratesBps:50,creditBps:-20},r=annualReturns(f,{volatility:false});assert.ok(Math.abs(r.returns.corporate-100*(1.04*(1-4.2*.005+4*.002+12*.003**2)-1))<1e-6);
assert.deepEqual(annualReturns(f,{seed:'same'}),annualReturns(f,{seed:'same'}));
assert.throws(()=>annualReturns({...zero,ratesBps:Infinity}),/finite/);
let sum=0,sum2=0,cross=0;const n=6000;for(let i=0;i<n;i++){const x=annualReturns(zero,{seed:'sample-'+i});const a=x.components.equity.noiseLog,b=x.components.technology.noiseLog;sum+=a;sum2+=a*a;cross+=a*b;for(const [k,c]of Object.entries(x.components)){assert.ok(x.returns[k]>-100);assert.ok(Math.abs(100*((1+c.basePct/100)*(1+c.newsPct/100)*(1+c.volatilityPct/100)-1)-c.totalPct)<1e-6);}}
assert.ok(Math.abs(sum/n)<.015);assert.ok(Math.abs(sum2/n-.18**2)<.005);assert.ok(Math.abs(cross/n-modelCovariance().equity.technology)<.004);
console.log('PASS: annual carry, independent spread repricing, reproducibility, bounds, covariance and component reconciliation');
// A falling yield must help the price component, even if a later annual draw overwhelms it.
const {annualScenario}=await import('../lib/annual-market.mjs');
const {previewPortfolios}=await import('../lib/portfolio-preview.mjs');
const {deck}=await import('../lib/scenario-engine.mjs');
const {governmentBondNote}=await import('../public/scenario-return-view.mjs');
const portfolios=[{id:'b',name:'Bonds',balance:100,weights:{equity:0,bonds:100,corporate:0,property:0,technology:0,energy:0,gold:0,cash:0}}];
const simple=previewPortfolios({model:'annual',mode:'preset',scenarioId:'credit-crunch',portfolios});
assert.equal(simple.volatilityIncluded,false);assert.equal(simple.components.bonds.newsPct,.4212);assert.equal(simple.components.bonds.noiseLog,0);assert.equal(simple.returns.bonds,3.433836);
assert.ok(governmentBondNote(simple).includes('103.43 points'));
const full=previewPortfolios({model:'annual',mode:'preset',scenarioId:'credit-crunch',volatility:true,portfolios});
assert.equal(full.returns.bonds,-8.073128);assert.ok(governmentBondNote(full).includes('Other market moves cause the loss'));assert.ok(governmentBondNote(full).includes('91.93 points'));
for(const scenario of deck)for(const severity of ['mild','moderate','severe']){
 const x=previewPortfolios({model:'annual',mode:'preset',scenarioId:scenario.id,severity,portfolios});
 assert.ok(Object.values(x.components).every(c=>c.noiseLog===0));
 if(x.factors.ratesBps<0){assert.ok(x.components.bonds.newsPct>0);assert.match(x.transmission.steps[0].detail,/Lower yields raise/);}
 if(x.factors.ratesBps>0){assert.ok(x.components.bonds.newsPct<0);assert.match(x.transmission.steps[0].detail,/Higher yields lower/);}
 if(x.factors.ratesBps===0)assert.equal(x.components.bonds.newsPct,0);
 const official=annualScenario({scenarioId:scenario.id,seed:'official-check'});assert.ok(Object.values(official.components).some(c=>c.noiseLog!==0));
}
console.log('PASS: screenshot reproduced, default preview isolates news, 66 scenario/strength cases have correct bond direction, official years retain market moves');
