import assert from 'node:assert/strict';
import {assetReturns,scenarioFor,transmissionFor} from '../lib/scenario-engine.mjs';
import {previewPortfolios} from '../lib/portfolio-preview.mjs';
import {upgradeMarket,presets} from '../public/portfolio-schema.mjs';
const flat={growth:0,inflation:0,ratesBps:0,riskBps:0,earnings:0,property:0,creditBps:0};
const credit=assetReturns({...flat,creditBps:-30}),base=assetReturns(flat);
assert.equal(credit.bonds,base.bonds);assert.equal(credit.equity,base.equity);
assert.equal(credit.corporate,1.2408); // 1.20 spread effect + .0108 convexity + .03 carry
assert.ok(assetReturns({...flat,creditBps:30}).corporate<base.corporate);
const offset=scenarioFor({day:1,scenarioId:'credit-rates-offset'});assert.ok(offset.factors.creditBps<0);assert.ok(offset.factors.ratesBps>0);assert.ok(offset.returns.corporate<0);
const easing=scenarioFor({day:1,scenarioId:'credit-relief'});assert.ok(easing.returns.corporate>easing.returns.bonds);assert.equal(easing.factors.ratesBps,0);
const crunch=scenarioFor({day:1,scenarioId:'credit-crunch'});assert.ok(crunch.returns.corporate<0);assert.ok(crunch.returns.bonds>0);
const story=transmissionFor({...flat,creditBps:-30});assert.equal(story.bondAttribution.creditSpreadPct,1.2);assert.ok(story.steps[0].detail.includes('tighten'));
const teams=[{id:'c',name:'Credit',balance:1000,weights:{equity:0,bonds:0,corporate:100,property:0,cash:0}},{id:'g',name:'Government',balance:1000,weights:{equity:0,bonds:100,corporate:0,property:0,cash:0}}];
const preview=previewPortfolios({mode:'preset',scenarioId:'credit-relief',portfolios:teams});assert.equal(preview.scenarioId,'credit-relief');assert.ok(preview.transmission.drivers.some(d=>d.label==='Corporate spreads'));assert.ok(preview.results[0].gain>preview.results[1].gain);assert.ok(Math.abs(preview.results[0].gain-12.408)<1e-10);
const old={allocations:{a:{equity:50,bonds:30,property:10,cash:10}},lockedWeights:{a:{equity:50,bonds:30,property:10,cash:10}},pnl:{a:7},history:[{returns:{equity:1,bonds:1,property:1,cash:0},outcomes:{a:{opening:100,closing:101,gain:1,weights:{equity:50,bonds:30,property:10,cash:10},byAsset:{equity:.5,bonds:.3,property:.1,cash:0}}}}]};
upgradeMarket(old);assert.equal(old.pnl.a,7);assert.equal(old.history[0].outcomes.a.closing,101);assert.equal(old.allocations.a.corporate,0);assert.equal(old.lockedWeights.a.corporate,0);assert.equal(old.history[0].outcomes.a.weights.corporate,0);assert.equal(old.history[0].outcomes.a.byAsset.corporate,0);
for(const w of Object.values(presets))assert.equal(Object.values(w).reduce((n,x)=>n+x,0),100);
console.log('PASS: spread-duration example, independent government yields, offsetting shocks, causal explanations, portfolio attribution and non-destructive legacy migration');
