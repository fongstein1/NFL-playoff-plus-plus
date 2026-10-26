import assert from 'node:assert/strict';
import {awardStandings,investmentPerformance} from '../public/awards.mjs';
import {sharedSeed,people} from '../public/pool-seed.mjs';
const s=sharedSeed();s.market.history=[{outcomes:{david:{opening:100,gain:10}}},{outcomes:{david:{opening:200,gain:40}}}];assert.ok(Math.abs(investmentPerformance(s,'david').pct-32)<1e-8);
const a=awardStandings(s,people);assert.equal(a.length,4);assert.equal(a.find(x=>x.id==='investment').winners[0].id,'david');assert.equal(a.find(x=>x.id==='superBowl').winners.length,0);
s.games[0].result=0;s.picks.david={g0:0};assert.equal(awardStandings(s,people).find(x=>x.id==='correct').winners[0].id,'david');
console.log('PASS: four independent awards, contribution-neutral investment return, pending exclusion and pick ranking');
