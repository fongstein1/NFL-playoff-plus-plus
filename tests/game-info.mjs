import assert from 'node:assert/strict';
import {normalizeGameSource,sourceMatches} from '../lib/game-source.mjs';
import {nflTeam} from '../public/branding.mjs';
const a=nflTeam('Buffalo'),b=nflTeam('Kansas City');assert.ok(a.logo&&b.logo);
const x=normalizeGameSource({header:{season:{year:2026,type:3},competitions:[{date:'2027-01-24',competitors:[{team:{id:a.id,displayName:a.name}},{team:{id:b.id,displayName:b.name}}]}]}},'401999999');
assert.ok(sourceMatches({teams:['Buffalo','Kansas City']},x));assert.ok(!sourceMatches({teams:['Buffalo','Kansas City']},{...x,seasonType:2}));
assert.throws(()=>normalizeGameSource({},'123'));
console.log('PASS: official team identity, game metadata and postseason matchup validation');
