export const assets=[
 {id:'equity',name:'Blue-chip equities',short:'Equities',color:'#d5b878',description:'Shares in large public companies.'},
 {id:'bonds',name:'Government bonds',short:'Govt bonds',color:'#95c8ef',description:'Interest-rate exposure without corporate credit spreads.'},
 {id:'corporate',name:'Corporate bonds',short:'Corp bonds',color:'#84b7ae',description:'Investment-grade debt, exposed to yields and credit spreads.'},
 {id:'property',name:'Real estate fund',short:'Real estate',color:'#bd9fe3',description:'Property income and valuations.'},
 {id:'cash',name:'Cash reserve',short:'Cash',color:'#9be1b3',description:'Uninvested points with a small game return.'}
];
export const assetIds=assets.map(a=>a.id);
export const presets={balanced:{equity:45,bonds:20,corporate:15,property:15,cash:5},growth:{equity:65,bonds:5,corporate:5,property:20,cash:5},defensive:{equity:15,bonds:40,corporate:15,property:5,cash:25},cash:{equity:0,bonds:0,corporate:0,property:0,cash:100}};
// Legacy four-asset portfolios have no corporate-bond exposure.
export function normalizedWeights(weights){return {...weights,corporate:weights.corporate??0}}
export function upgradeMarket(market){if(!market)return;for(const w of Object.values(market.allocations||{}))w.corporate??=0;for(const w of Object.values(market.lockedWeights||{}))w.corporate??=0;for(const d of market.history||[]){if(d.returns.corporate===undefined){d.corporateNotModelled=true;d.returns.corporate=0;}for(const outcome of Object.values(d.outcomes||{})){outcome.weights.corporate??=0;if(outcome.byAsset)outcome.byAsset.corporate??=0;}}}
