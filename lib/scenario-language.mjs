// Player-facing wording. Scenario IDs and numerical shocks are defined separately.
export const scenarioCopy={
 'earnings-miss':['Large companies report weaker profits','Lower profits hurt shares. Investors become more cautious, while a small fall in government yields helps existing bonds.'],
 'earnings-beat':['Large companies report stronger profits','Better profits help shares. Government yields rise slightly, reducing existing bond prices.'],
 'hot-inflation':['Prices rise faster than expected','Investors expect higher interest rates. Rising bond yields lower existing bond prices and make property and share valuations harder to justify.'],
 'cool-inflation':['Inflation slows','Investors expect lower interest rates. Falling yields raise existing bond prices and can help property and technology shares.'],
 'rate-hike':['The central bank raises rates unexpectedly','Borrowing becomes more expensive. Higher government yields lower existing bond prices and weigh on property and shares.'],
 'rate-cut':['The central bank cuts rates as growth holds up','Cheaper borrowing supports businesses and property. Falling government yields raise existing bond prices.'],
 'recession':['Spending slows and recession fears grow','Weaker sales hurt company profits and property demand. Investors buy government bonds, raising their prices and lowering yields.'],
 'soft-landing':['Growth holds up while inflation slows','Steady demand supports company profits. Lower inflation allows yields to ease, helping existing bonds and property.'],
 'property-boom':['Cheaper loans bring buyers back to property','Lower borrowing costs and stronger demand help property. Falling government yields also raise existing bond prices.'],
 'property-slump':['More commercial buildings sit empty','Empty buildings mean less rental income. Property values fall, and investors become more cautious about shares and company debt.'],
 'liquidity':['Investors rush to sell risky holdings','Investors sell shares and property to raise cash. Demand for government bonds rises, supporting their prices.'],
 'safety':['International tensions make investors cautious','Investors move toward government bonds and gold. Less demand for shares and property weighs on their values.'],
 'stagflation':['An energy shortage raises prices and slows spending','Higher fuel prices can help energy producers but squeeze other businesses and households. Higher yields also hurt existing bonds.'],
 'productivity':['Businesses produce more at lower cost','Better efficiency supports profits and helps slow inflation. Stronger growth also pushes government yields slightly higher.'],
 'tariffs':['New trade barriers raise business costs','Import costs rise and profits weaken. Higher inflation and borrowing costs put pressure on shares, property and existing bonds.'],
 'jobs':['Strong hiring supports spending but lifts yields','More jobs support sales and profits. Investors expect rates to stay higher, which lowers existing bond prices and offsets some gains in shares and property.'],
 'credit-relief':['Healthier company finances ease fears of missed payments','Investors accept less extra interest to lend to companies. Existing corporate bonds gain value; government yields stay unchanged.'],
 'credit-crunch':['Banks reduce lending after more loans go unpaid','Investors demand more extra interest on company debt, lowering corporate-bond prices. Buying of government bonds lowers their yields and raises their prices.'],
 'bank-backstop':['Emergency bank support restores confidence','Support reduces fears about bank funding and missed payments. Existing corporate bonds benefit, partly offset by a small rise in government yields.'],
 'downgrades':['More companies receive lower credit ratings','Investors demand more extra interest for company debt, lowering existing corporate-bond prices. Government yields stay unchanged.'],
 'credit-rates-offset':['Stronger profits meet higher interest rates','Improved company finances help corporate bonds, but rising government yields cause a larger price loss. The two effects pull in opposite directions.'],
 'quiet':['Little changes in the economic outlook','This news makes only small changes to asset values. Starting returns and any added market moves account for most of the year’s result.']
};
const pct=x=>(x<0?'−':'+')+Math.abs(x).toFixed(2)+'%';
export function annualExplanation(f,news,{volatility=true}={}){
 const change=(x,up,down,flat)=>x>0?up:x<0?down:flat;
 const steps=[
 {title:'Government bonds',detail:change(f.ratesBps,'Higher yields lower the price of bonds already held.','Lower yields raise the price of bonds already held.','This news leaves government yields unchanged.')+` Price effect from this news: ${pct(news.bonds)}.`},
 {title:'Corporate bonds',detail:change(f.creditBps,'Companies must offer more extra interest for the risk of missed payments. That lowers existing corporate-bond prices.','Companies can offer less extra interest as fears of missed payments ease. That raises existing corporate-bond prices.','The extra interest demanded for company lending is unchanged.')+` Government yield changes also matter. Combined price effect from this news: ${pct(news.corporate)}.`},
 {title:'Shares and property',detail:change(f.earnings,'Higher expected profits help shares.','Lower expected profits hurt shares.','Expected company profits are unchanged.')+' '+change(f.ratesBps,'Higher rates make borrowing more expensive and reduce what investors will pay for future profits and rent.','Lower rates make borrowing cheaper and raise what investors will pay for future profits and rent.','Government rates add no change to borrowing costs in this scenario.')+` Combined news effects: broad shares ${pct(news.equity)}, technology ${pct(news.technology)}, property ${pct(news.property)}.`},
 {title:'Energy, gold and cash',detail:change(f.inflation,'Higher prices can help energy producers.','Lower price pressure can reduce energy producers’ revenues.','There is no inflation shock in this news.')+` Energy also responds to spending and supply: ${pct(news.energy)}. Gold responds to interest rates after inflation and demand for safety: ${pct(news.gold)}. Cash has a small rate effect: ${pct(news.cash)}.`},
 {title:volatility?'Add the rest of the year':'Sell at the end of the year',detail:volatility?'The starting return and this news are combined with other simulated market moves. These can include further rate changes and can outweigh this news. All holdings are then sold to cash.':'The starting return and this news are combined. No other market moves are added. All holdings are then sold to cash.'}
 ];
 return{steps,note:'The return parts multiply rather than add. Model settings are game assumptions.'};
}
