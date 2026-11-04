// Team accounts never receive a navigation entry for commissioner actions.
export function renderFundNav(tab,{shared=false,isAdmin=false}={}){
 if(!['investments','lab','commissioner'].includes(tab))return '';
 const links=[['investments','Portfolio & results'],['lab','Scenario analysis']];
 if(!shared||isAdmin)links.push(['commissioner',shared?'Commissioner controls':'Demo controls']);
 return `<div class="round-tabs fund-nav">${links.map(([id,label])=>`<button data-go="${id}" class="${tab===id?'selected':''}">${label}</button>`).join('')}</div>`;
}
