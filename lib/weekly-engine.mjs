import {packetFor,publicPacket,ensureWeekly,publishPoolPrices} from '../public/weekly-data.mjs';
import {people} from '../public/pool-seed.mjs';
import {balance} from '../public/engine.mjs';
import {applyMarketDay} from '../public/markets.mjs';
import {scenarioFor} from './scenario-engine.mjs';
function draw(seed,key){let h=2166136261;for(const c of seed+':'+key){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0)/4294967296;}
export function closeNewsWeek(state,seed){
 const w=ensureWeekly(state),p=packetFor(w.week);
 if(w.phase!=='planning')throw Error('This news week is already closed.');
 if(state.market.frozen)throw Error('Investment trading has ended for the Super Bowl.');
 if(state.market.locked)throw Error('Reopen allocations before closing a news week.');
 if(typeof seed!=='string'||seed.length>100)throw Error('Invalid weekly resolution seed.');
 const macro=draw(seed,'macro')<.7,sector=draw(seed,'sector')<.65,football=draw(seed,'football')<.55;
 const event=scenarioFor({day:state.market.history.length+1,scenarioId:macro?p.scenario:p.surprise});
 const extra={};if(p.week===1)extra.technology=sector?1.2:-1;if(p.week===2)extra.property=sector?1.1:-.8;if(p.week===3)extra.gold=sector?.9:-.7;if(p.week===4)extra.energy=sector?-.9:.8;
 for(const [id,move]of Object.entries(extra))event.returns[id]=Math.round(Math.max(-8,Math.min(8,event.returns[id]+move))*1e4)/1e4;
 event.headline=`Week ${w.week}: ${macro?'the lead story held':'the lead story reversed'}`;
 event.why=p.macro[macro?'confirmed':'reversed']+' '+p.sector[sector?'confirmed':'reversed'];
 state.market.locked=true;state.market.lockedWeights=structuredClone(state.market.allocations);
 state.market=applyMarketDay(state.market,people,Object.fromEntries(people.map(t=>[t.id,balance(state,t.id)])),event);
 const session=state.market.history.at(-1);Object.assign(session,{regime:event.regime,modelVersion:event.modelVersion,scenarioId:event.id,newsWeek:w.week});
 const g=p.football.gameIndex===null?null:state.games[p.football.gameIndex];
 const recap={week:w.week,title:p.title,sessionDay:session.day,returns:{...event.returns},outcomes:structuredClone(session.outcomes),items:[{kind:'Economy',headline:p.macro.title,result:macro?'Confirmed':'Reversed',explanation:p.macro[macro?'confirmed':'reversed']},{kind:'Sector',headline:p.sector.title,result:sector?'Confirmed':'Reversed',explanation:p.sector[sector?'confirmed':'reversed']},{kind:'Football',headline:p.football.title,result:p.football.gameIndex===null?'Reference prices':football?'Signal held':'False signal',explanation:p.football[football?'confirmed':'reversed']}],odds:g?{gameId:g.id,teams:[...g.teams],reference:[...g.p],pool:[...(g.poolP||g.p)]}:null};
 for(const game of state.games)if(game.round===p.round)game.pickClosed=true;
 w.past.push(recap);w.phase='recap';return recap;
}
export function nextNewsWeek(state){const w=ensureWeekly(state);if(w.phase!=='recap')throw Error('Close the current week before publishing another.');if(w.week>=4)throw Error('The final news week is complete.');if(state.market.frozen)throw Error('Investment trading has ended.');w.week++;w.phase='planning';publishPoolPrices(state,w.week);return publicPacket(w.week);}
