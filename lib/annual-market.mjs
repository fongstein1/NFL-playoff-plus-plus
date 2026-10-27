import {annualExplanation} from './scenario-language.mjs';
import {assetReturns,scenarioFor,transmissionFor} from './scenario-engine.mjs';
export const annualVersion='surplus-annual-v1';
// One real game week represents a full investment year. These are game assumptions.
// Factor columns: broad earnings/equity, rates, inflation/commodity, liquidity/risk.
export const annualFunds={
 equity:{base:.06,sigma:.18,beta:[.14,-.025,-.025,-.035]},
 bonds:{base:.03,sigma:.07,beta:[-.01,-.06,-.02,.015]},
 corporate:{base:.04,sigma:.08,beta:[.035,-.05,-.01,-.035]},
 property:{base:.05,sigma:.15,beta:[.08,-.06,.015,-.06]},
 technology:{base:.08,sigma:.28,beta:[.21,-.06,-.02,-.055]},
 energy:{base:.05,sigma:.30,beta:[.10,0,.19,-.06]},
 gold:{base:.02,sigma:.18,beta:[-.025,-.06,.05,.06]},
 cash:{base:.03,sigma:.005,beta:[0,.002,.001,0]}
};
export const theorySources=[
 {title:'CFA Institute · bond duration and convexity',url:'https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/yield-based-bond-convexity-and-portfolio-properties'},
 {title:'CFA Institute · discounted cash-flow valuation',url:'https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation'},
 {title:'CFA Institute · portfolio weights, covariance and correlation',url:'https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/portfolio-mathematics'}
];
function uniform(seed,key){let h=2166136261;for(const c of seed+':'+key){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return((h>>>0)+.5)/4294967296;}
export function normal(seed,key){return Math.sqrt(-2*Math.log(uniform(seed,key+':a')))*Math.cos(2*Math.PI*uniform(seed,key+':b'));}
export function newsEffects(f,sector={}){const dy=f.ratesBps/10000,ds=f.creditBps/10000,dr=f.riskBps/10000,realYield=dy-.002*f.inflation;
 const effects={equity:.016*f.growth+.01*f.earnings-7*dy-5*dr-.004*f.inflation,bonds:Math.log1p(-4.2*dy+.5*24*dy*dy),corporate:Math.log1p(-4.2*dy-4*ds+.5*24*(dy+ds)**2),property:.012*f.growth+.008*f.property-10*dy-4*dr+.002*f.inflation,technology:.02*f.growth+.018*f.earnings-12*dy-8*dr-.003*f.inflation,energy:.01*f.growth+.012*f.inflation+.004*f.earnings-2*dr,gold:-6*realYield+4*dr-.002*f.growth,cash:.5*dy};
 for(const [id,pct]of Object.entries(sector)){if(!(id in effects)||!Number.isFinite(pct)||Math.abs(pct)>20)throw Error('Invalid sector news adjustment.');effects[id]+=Math.log1p(pct/100);}return effects;
}
export function annualReturns(factors,{seed='annual-preview',sector={},volatility=true}={}){if(typeof seed!=='string'||seed.length>150)throw Error('Invalid market-year seed.');if(!factors||!['growth','inflation','ratesBps','riskBps','earnings','property','creditBps'].every(k=>Number.isFinite(factors[k])))throw Error('All seven factors must be finite.');assetReturns(factors);if(typeof volatility!=='boolean')throw Error('Volatility must be a boolean.');const news=newsEffects(factors,sector),common=Array.from({length:4},(_,i)=>normal(seed,'factor-'+i)),returns={},components={};for(const [id,a]of Object.entries(annualFunds)){const systematicVariance=a.beta.reduce((n,b)=>n+b*b,0),residual=Math.sqrt(Math.max(0,a.sigma*a.sigma-systematicVariance)),noise=volatility?(a.beta.reduce((n,b,i)=>n+b*common[i],0)+residual*normal(seed,'fund-'+id)):0;const baseLog=Math.log1p(a.base),value=100*Math.expm1(baseLog+news[id]+noise);returns[id]=Math.round(value*1e6)/1e6;components[id]={basePct:a.base*100,newsPct:100*Math.expm1(news[id]),volatilityPct:100*Math.expm1(noise),newsLog:news[id],noiseLog:noise,totalPct:returns[id],annualLogVolatilityPct:a.sigma*100};}return{returns,components};}
export function annualScenario({day=1,scenarioId,seed='annual-preview',previousRegime='neutral',sector={},factors:customFactors,volatility=true}={}){const e=scenarioFor({day,scenarioId,seed,previousRegime}),f=customFactors||e.factors;const {returns,components}=annualReturns(f,{seed:seed+':year:'+day,sector,volatility});return{...e,factors:f,returns,components,modelVersion:annualVersion,periodYears:1,realized:true,sector,source:'One simulated investment year, fully sold to cash. Structural news effects plus correlated market volatility; house calibration.',transmission:{drivers:transmissionFor(f).drivers,bondAttribution:{governmentRatePct:-4.2*f.ratesBps/100,creditSpreadPct:-4*f.creditBps/100,carryPct:4,convexityPct:100*.5*24*((f.ratesBps+f.creditBps)/10000)**2},...annualExplanation(f,Object.fromEntries(Object.entries(components).map(([id,c])=>[id,c.newsPct])),{volatility})},theorySources};}
export function modelCovariance(){const ids=Object.keys(annualFunds);return Object.fromEntries(ids.map(a=>[a,Object.fromEntries(ids.map(b=>[b,a===b?annualFunds[a].sigma**2:annualFunds[a].beta.reduce((n,x,i)=>n+x*annualFunds[b].beta[i],0)]))]));}
