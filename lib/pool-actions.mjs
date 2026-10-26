import {ensureWeekly,publishPoolPrices} from '../public/weekly-data.mjs';
import {closeNewsWeek,nextNewsWeek} from './weekly-engine.mjs';
import {upgradeMarket} from '../public/portfolio-schema.mjs';
import {sourceMatches} from './game-source.mjs';
import {people,sharedSeed} from '../public/pool-seed.mjs';
import {balance,validateSlip} from '../public/engine.mjs';
import {initialMarket,validateWeights,applyMarketDay} from '../public/markets.mjs';
import {scenarioFor} from './scenario-engine.mjs';
export function applyAction(previous,action,actor){
 const s=structuredClone(previous),a=action||{},admin=actor?.role==='admin';upgradeMarket(s.market);ensureWeekly(s);if(!s.weekly.pricesInitialized){publishPoolPrices(s,s.weekly.week);s.weekly.pricesInitialized=true;}
 const own=id=>{if(!people.some(p=>p.id===id)||(!admin&&actor?.teamId!==id))throw Error('You can only change your own team.');};
 const requireAdmin=()=>{if(!admin)throw Error('Commissioner access required.');};
 const ready=()=>s.games.every(g=>g.result!==null);

 if(a.type==='pick'){own(a.teamId);const g=s.games.find(g=>g.id===a.gameId);if(!g||g.result!==null||g.pickClosed||(s.rulesVersion===2&&!s.weekly.past.some(r=>r.week===g.round+1))||![0,1].includes(a.side))throw Error('This game is closed or invalid.');if(s.picks[a.teamId]?.[g.id]===a.side)return s;s.picks[a.teamId]??={};s.picks[a.teamId][g.id]=a.side;s.pickQuotes[a.teamId]??={};s.pickQuotes[a.teamId][g.id]=(a.newsPricing?(g.poolP||g.p):g.p)[a.side];}
 else if(a.type==='allocation'){own(a.teamId);if(s.market.locked||s.market.frozen||!validateWeights(a.weights))throw Error('Allocation window is closed or weights do not add to 100.');s.market.allocations[a.teamId]=Object.fromEntries(Object.keys(s.market.allocations[a.teamId]).map(k=>[k,a.weights[k]]));}
 else if(a.type==='slip'){own(a.teamId);if(s.rulesVersion===2&&!s.weekly.past.some(r=>r.week===4))throw Error('Complete the final investment year and sell to cash before Super Bowl props.');if(!ready()||s.locked)throw Error('The prop desk is closed.');if(!a.bets||typeof a.bets!=='object'||Array.isArray(a.bets))throw Error('Invalid slip.');const error=validateSlip(a.bets,balance(s,a.teamId)+(s.market.pnl[a.teamId]||0),s.markets);if(error)throw Error(error);if(a.submitted&&s.market.locked)throw Error('Finish or reopen the market session before submitting a slip.');s.slips[a.teamId]={bets:Object.fromEntries(Object.entries(a.bets).map(([id,b])=>[id,{side:b.side,stake:b.stake}])),submitted:!!a.submitted};if(a.submitted)s.market.frozen=true;}
 else if(a.type==='gameSource'){requireAdmin();const g=s.games.find(g=>g.id===a.gameId);if(!g||!sourceMatches(g,a.context))throw Error('The linked postseason game must match both NFL teams.');g.source=structuredClone(a.context);}
 else if(a.type==='result'){requireAdmin();const g=s.games.find(g=>g.id===a.gameId);if(!g||![null,0,1].includes(a.result))throw Error('Invalid game result.');if(g.result!==null&&g.result!==a.result&&s.market.history.length)throw Error('Results with investment history cannot be corrected in place. Reset the season to correct earlier results.');const correcting=g.result!==null&&g.result!==a.result;g.result=a.result;if(correcting){s.slips={};s.locked=false;s.market.frozen=false;s.markets.forEach(m=>m.result=null);}}
 else if(a.type==='finish'){requireAdmin();s.games.forEach((g,i)=>{if(g.result===null)g.result=i%2;});}
 else if(a.type==='closeNewsWeek'){requireAdmin();closeNewsWeek(s,a.seed||'demo-week');}
 else if(a.type==='lockNewsPicks'){requireAdmin();if(s.weekly.phase!=='betting')throw Error('Sell investments to cash before locking picks.');for(const g of s.games)if(g.round===s.weekly.week-1)g.pickClosed=true;s.weekly.phase='recap';}
 else if(a.type==='nextNewsWeek'){requireAdmin();nextNewsWeek(s);}
 else if(a.type==='discussion'){own(a.teamId);if(a.week!==s.weekly.week||s.weekly.phase!=='planning'||typeof a.text!=='string'||a.text.length>1200)throw Error('Notes are closed or too long.');s.weekly.discussions[a.week]??={};s.weekly.discussions[a.week][a.teamId]=a.text.trim();}
 else if(a.type==='reset'){requireAdmin();return sharedSeed();}
 else if(a.type==='lockSlips'){requireAdmin();if(!ready())throw Error('Settle playoff games first.');s.locked=!!a.locked;if(s.locked){for(const p of people){const error=validateSlip(s.slips[p.id]?.bets||{},balance(s,p.id)+(s.market.pnl[p.id]||0),s.markets);if(error)throw Error(p.name+': '+error);}s.market.frozen=true;}else s.markets.forEach(m=>m.result=null);}
 else if(a.type==='propResult'){requireAdmin();const m=s.markets.find(m=>m.id===a.marketId);if(!s.locked||!m||![null,0,1,'void'].includes(a.result))throw Error('Lock slips before settling a valid outcome.');m.result=a.result;}
 else if(a.type==='lockAllocations'){requireAdmin();if(s.market.frozen)throw Error('Investments have ended.');s.market.locked=!!a.locked;s.market.lockedWeights=a.locked?structuredClone(s.market.allocations):null;}
 else if(a.type==='marketSession'){requireAdmin();if(s.rulesVersion===2)throw Error('Use the weekly news cycle: one investment year per week.');const day=s.market.history.length+1;const e=scenarioFor({day,previousRegime:s.market.history.at(-1)?.regime||'neutral',seed:'surplus-bowl-demo',...(a.scenarioId?{scenarioId:a.scenarioId}:{})});s.market=applyMarketDay(s.market,people,Object.fromEntries(people.map(p=>[p.id,balance(s,p.id)])),e);Object.assign(s.market.history.at(-1),{factors:e.factors,regime:e.regime,modelVersion:e.modelVersion,scenarioId:e.id});}
 else throw Error('Unknown pool action.');
 return s;
}
export function replay(initial,rows){let state=structuredClone(initial),revision=0;if(!state.rulesVersion)state.rulesVersion=rows[0]?.schemaVersion===2||(!rows.length&&!state.games.some(g=>g.result!==null)&&Object.values(state.picks).every(x=>!Object.keys(x).length))?2:1;const seen=new Map(),results=new Map();for(const row of rows){const e=typeof row==='string'?JSON.parse(row):row;if(seen.has(e.id))continue;seen.set(e.id,true);if(e.baseRevision!==revision){results.set(e.id,{accepted:false,error:'The pool changed. Refresh and try again.'});continue;}try{state=applyAction(state,e.action,e.actor);revision++;results.set(e.id,{accepted:true});}catch(err){results.set(e.id,{accepted:false,error:err.message});}}return{state,revision,results};}
