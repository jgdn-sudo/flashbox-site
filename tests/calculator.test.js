import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PRICE,NET_PRICE,SHARE,INITIAL_SHARE,MINIMUM_INITIAL_INCOME,calculateScenario,calculateRange,calculateYearFromPurchases} from '../assets/js/calculator.js';

test('approved after-VAT amounts are 6.24 and 12.48 per purchase',()=>{
 assert.equal(PRICE,39);assert.equal(NET_PRICE,31.2);assert.equal(NET_PRICE*SHARE,6.24);assert.equal(NET_PRICE*INITIAL_SHARE,12.48);assert.equal(MINIMUM_INITIAL_INCOME,3500);
});
test('600 guests, two nights and three purchases per hundred matches the explicit model',()=>{
 const s=calculateScenario(600,2,3);assert.equal(s.purchasesPerNight,18);assert.equal(s.annualPurchases,1872);assert.equal(s.initialIncome,2695.68);assert.equal(s.guaranteeTopUp,804.32);assert.equal(s.initialTotal,3500);assert.equal(s.ongoingFirstYear,10333.44);assert.equal(s.firstYearAnnual,13833.44);assert.equal(s.annual,11681.28);
});
test('guarantee is only a top-up and is not added when the share is larger',()=>{
 const s=calculateScenario(1000,2,4);assert.equal(s.initialIncome,5990.4);assert.equal(s.guaranteeTopUp,0);assert.equal(s.initialTotal,5990.4);assert.equal(s.firstYearAnnual,28953.6);
});
test('closed scenario carries no guarantee or annual revenue',()=>{
 const s=calculateScenario(600,0,3);assert.equal(s.initialTotal,0);assert.equal(s.firstYearAnnual,0);assert.equal(s.annualPurchases,0);
});
test('zero purchases during an otherwise open full-period scenario has only the conditional minimum',()=>{
 const s=calculateScenario(600,2,0);assert.equal(s.initialIncome,0);assert.equal(s.guaranteeTopUp,3500);assert.equal(s.firstYearAnnual,3500);assert.equal(s.annual,0);
});
test('range follows the reference 3 percent and 70 to 130 percent, before guarantee top-ups',()=>{
 const r=calculateRange(600,2,2);assert.equal(r.low.firstYearAnnual,10733.41);assert.equal(r.high.firstYearAnnual,16937.86);assert(Math.abs(r.low.annualPurchases-1310.4)<1e-9);assert(Math.abs(r.high.annualLogoVisits-4867.2)<1e-9);assert(Math.abs(calculateRange(600,2,1).high.annualLogoVisits-2433.6)<1e-9);assert(Math.abs(calculateRange(600,2,1).high.annualPrints-4867.2)<1e-9);assert.equal(calculateRange(600,2,1).high.firstYearAnnual,r.high.firstYearAnnual);
});
test('invalid values cannot produce misleading numeric results',()=>{
 for(const [g,n,r]of [[NaN,2,3],[600,Infinity,3],[-1,2,3],[600,8,3],[600,1.5,3],[600,2,-1],[600,2,101],[100001,2,3]])assert.throws(()=>calculateScenario(g,n,r));
 for(const people of [NaN,0,3])assert.throws(()=>calculateRange(600,2,people));assert.throws(()=>calculateYearFromPurchases(-1));
});
test('ordinary-year homepage examples use the same after-VAT basis',()=>{
 assert.equal(calculateYearFromPurchases(150*12),11232);assert.equal(calculateYearFromPurchases(250*12),18720);assert.equal(calculateYearFromPurchases(400*12),29952);assert.equal(calculateYearFromPurchases(30*2*52),19468.8);
});
test('both old and canonical calculator URLs contain the same controls and source caveats',async()=>{
 const page=await readFile(new URL('../beregner/index.html',import.meta.url),'utf8');assert.equal(page,await readFile(new URL('../beregner.html',import.meta.url),'utf8'));
 for(const id of ['gaester','naetter','personer','presentationMode','rangeMode','annualResult','initialResult','topupResult'])assert(page.includes('id="'+id+'"'));
 assert(page.includes('Casenes momsgrundlag'));assert(!page.match(/<input id="venue"[^>]*>/)[0].includes('value='));assert(!/(?<!\d)2\.500/.test(page));assert(!page.includes('app.notion.com'));
});
test('the site has working canonical calculator links and no calculator form on the homepage',async()=>{
 const page=await readFile(new URL('../index.html',import.meta.url),'utf8');assert(page.includes('href="/beregner/"'));assert(!page.includes('id="gaester"'));assert(!page.includes('24.336'));
});

test('large-volume range exactly follows reference multipliers when no guarantee top-up applies',()=>{
 const result=calculateRange(1000,7);
 assert.equal(result.low.firstYearAnnual,Math.round(result.base.firstYearAnnual*0.7*100)/100);
 assert.equal(result.high.firstYearAnnual,Math.round(result.base.firstYearAnnual*1.3*100)/100);
 assert.equal(result.low.guaranteeTopUp,0);
 assert.equal(result.high.guaranteeTopUp,0);
});
