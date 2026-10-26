export const assets=[
 {id:'equity',name:'Blue-chip equities',short:'Equities',color:'#d5b878',description:'Shares in large public companies.'},
 {id:'bonds',name:'Government bonds',short:'Govt bonds',color:'#95c8ef',description:'Interest-rate exposure without corporate credit spreads.'},
 {id:'corporate',name:'Corporate bonds',short:'Corp bonds',color:'#84b7ae',description:'Investment-grade debt, exposed to yields and credit spreads.'},
 {id:'property',name:'Real estate fund',short:'Real estate',color:'#bd9fe3',description:'Property income and valuations.'},
 {id:'technology',name:'Technology fund',short:'Technology',color:'#68b8f2',description:'Growth shares with stronger earnings and interest-rate sensitivity.'},
 {id:'energy',name:'Energy fund',short:'Energy',color:'#f39b62',description:'Energy producers exposed to growth, fuel prices and supply shocks.'},
 {id:'gold',name:'Gold fund',short:'Gold',color:'#f0cf68',description:'Gold exposure sensitive to yields, inflation and demand for protection.'},
 {id:'cash',name:'Cash reserve',short:'Cash',color:'#9be1b3',description:'Uninvested points with a small game return.'}
];
export const assetIds=assets.map(a=>a.id);
export const presets={balanced:{equity:45,bonds:20,corporate:15,property:15,cash:5},growth:{equity:65,bonds:5,corporate:5,property:20,cash:5},defensive:{equity:15,bonds:40,corporate:15,property:5,cash:25},cash:{equity:0,bonds:0,corporate:0,property:0,cash:100}};
// Preserve old allocations and returns: new funds start at zero exposure.
export function normalizedWeights(weights){return {...Object.fromEntries(assetIds.map(k=>[k,0])),...weights};}
export function upgradeMarket(market){if(!market)return;for(const key of ['allocations','lockedWeights'])for(const [id,w]of Object.entries(market[key]||{}))market[key][id]=normalizedWeights(w);for(const day of market.history||[]){day.unmodelledAssets??=[];for(const id of assetIds)if(day.returns[id]===undefined){day.unmodelledAssets.push(id);day.returns[id]=0;if(id==='corporate')day.corporateNotModelled=true;}for(const o of Object.values(day.outcomes||{})){o.weights=normalizedWeights(o.weights);for(const id of assetIds)if(o.byAsset)o.byAsset[id]??=0;}}}
for(const [id,w]of Object.entries(presets))presets[id]=normalizedWeights(w);
presets.opportunistic={equity:25,bonds:10,corporate:5,property:5,technology:25,energy:15,gold:10,cash:5};
