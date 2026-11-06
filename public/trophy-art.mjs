// Original rendered award assets, generated for The Surplus Bowl.
const awardIds=new Set(['overall','superBowl','correct','investment']);
export function awardTrophy(id){const key=awardIds.has(id)?id:'overall';return `<img src="/art/trophy-${key}.webp" class="award-trophy award-trophy-${key}" width="480" height="600" alt="" aria-hidden="true" loading="lazy" decoding="async">`;}
