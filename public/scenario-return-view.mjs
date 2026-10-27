const pct=v=>(v<0?'−':'+')+Math.abs(v).toFixed(2)+'%';
const points=v=>v.toFixed(2);
export function governmentBondNote(result){
 const c=result.components?.bonds;if(!c)return '';
 const dy=result.factors.ratesBps,full=result.volatilityIncluded===true;
 const rate=dy===0?'This news leaves government yields unchanged.':`This news ${dy<0?'lowers':'raises'} government yields by ${(Math.abs(dy)/100).toFixed(2)} percentage points, ${dy<0?'raising':'lowering'} the price of bonds already held.`;
 const newsOnly=100*(1+c.basePct/100)*(1+c.newsPct/100),closing=100*(1+c.totalPct/100);
 const heading=c.newsPct>0&&c.totalPct<0?'This news helps bonds. Other market moves cause the loss.':'Government bonds: news effect and sale value';
 return `<section class="bond-explanation"><h3>${heading}</h3><p>${rate} The bond-price effect is <b>${pct(c.newsPct)}</b>.</p><p>With the <b>${c.basePct.toFixed(2)}% starting return</b> and this news, 100 points becomes <b>${points(newsOnly)} points</b>. ${full?`Other market moves add a <b>${pct(c.volatilityPct)}</b> adjustment, leaving <b>${points(closing)} points</b> at sale.`:'No other market moves are included.'}</p>${full?'<p class="tiny muted">The yield change above belongs to this news item. It is not the full year’s net yield change. This simplified model adds a return adjustment for other moves; it does not calculate a final yield.</p>':''}</section>`;
}
export function annualReturnTable(r,assetInfo){
 if(!r.components)return '';
 return `<section class="annual-breakdown"><h3>What makes up each return</h3><p class="tiny muted">The parts multiply rather than add. For example, a 3% starting return followed by a 1% price gain gives 1.03 × 1.01 − 1 = 4.03%.</p><div class="table-wrap"><table><thead><tr><th>Fund</th><th>Starting return</th><th>This news</th><th>Other moves</th><th>At sale</th></tr></thead><tbody>${assetInfo.map(([id,name])=>{const c=r.components[id];return `<tr><td>${name}</td><td>${pct(c.basePct)}</td><td>${pct(c.newsPct)}</td><td>${pct(c.volatilityPct)}</td><td>${pct(c.totalPct)}</td></tr>`;}).join('')}</tbody></table></div><p class="tiny muted">Starting returns are game assumptions, not guaranteed income.</p><details><summary>Model references</summary><div class="theory-links">${(r.theorySources||[]).map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ↗</a>`).join('')}</div></details></section>`;
}
