import assert from 'node:assert/strict';
import {renderFundNav} from '../public/fund-nav.mjs';
for(const tab of ['investments','lab','commissioner']){
 assert.match(renderFundNav(tab),/data-go="commissioner"/);
 assert.match(renderFundNav(tab,{shared:true,isAdmin:true}),/Commissioner controls/);
 assert.doesNotMatch(renderFundNav(tab,{shared:true,isAdmin:false}),/commissioner|Demo controls/);
 assert.match(renderFundNav(tab),new RegExp(`data-go="${tab}" class="selected"`));
}
assert.equal(renderFundNav('news'), '');
console.log('PASS: results and settlement controls reachable for demo/commissioner; hidden for team accounts');
