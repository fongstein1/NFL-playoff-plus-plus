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
