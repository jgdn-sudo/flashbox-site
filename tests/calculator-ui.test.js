import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import * as model from '../assets/js/calculator.js';
async function fixture(query=''){
 const html=await readFile(new URL('../beregner/index.html',import.meta.url),'utf8');
 const script=await readFile(new URL('../assets/js/calculator-page.js',import.meta.url),'utf8');
 const dom=new JSDOM(html,{url:'https://flashbox.test/beregner/'+query,runScripts:'outside-only'});
 dom.window.__model=model;
 dom.window.eval(script.replace("import * as model from './calculator.js?v=20261111-net-range';",'const model=window.__model;'));
 const byId=id=>dom.window.document.getElementById(id);
 const input=(id,value)=>{byId(id).value=value;byId(id).dispatchEvent(new dom.window.Event('input',{bubbles:true}));};
 return {dom,byId,input,close:()=>dom.window.close()};
}
test('calculator shows annual and monthly estimates with optional detail collapsed',async()=>{const f=await fixture();try{
 assert.equal(f.byId('annualResult').textContent,'10.733 til 16.938 kr.');
 assert.equal(f.byId('monthlyResult').textContent,'894 til 1.411 kr. pr. måned i gennemsnit');
 assert.match(f.byId('taxLabel').textContent,/Ekskl. moms og før skat/);
 assert.equal(f.byId('method').open,false);
 for(const id of ['nightResult','logoResult','initialResult','regularResult'])assert.equal(f.byId(id).closest('details').id,'method');
 assert.equal(f.byId('calculationError').hidden,true);
 assert.equal(f.byId('presentationMode'),null);
}finally{f.close()}});
test('venue is available immediately, displays as plain text, and opening presets recalculate',async()=>{const f=await fixture();try{
 assert.equal(f.byId('venueField').hidden,false);
 assert.equal(f.byId('naetter').tagName,'SELECT');assert.equal(f.byId('naetter').value,'2');
 f.input('venue','<img src=x onerror=alert(1)>');assert.equal(f.byId('venueHeading').textContent,'<img src=x onerror=alert(1)>');assert.equal(f.byId('venueHeading').children.length,0);
 f.input('venue','');assert.equal(f.byId('venueHeading').textContent,'Jeres klub');
 f.byId('naetter').value='3';f.byId('naetter').dispatchEvent(new f.dom.window.Event('change',{bubbles:true}));
 const expected=model.calculateRange(600,3);const fmt=n=>new Intl.NumberFormat('da-DK',{maximumFractionDigits:0}).format(n);
 assert.equal(f.byId('annualResult').textContent,fmt(expected.low.firstYearAnnual)+' til '+fmt(expected.high.firstYearAnnual)+' kr.');
}finally{f.close()}});
test('invalid inputs hide old estimates and details; zero opening gives zero',async()=>{const f=await fixture();try{
 f.input('gaester','');assert.equal(f.byId('calculationResults').hidden,true);assert.equal(f.byId('calculationError').hidden,false);assert.equal(f.byId('initialResult').textContent,'—');assert.equal(f.byId('logoResult').textContent,'—');
 f.input('gaester','600');f.input('naetter','0');assert.equal(f.byId('annualResult').textContent,'0 kr.');
 f.input('naetter','8');assert.equal(f.byId('calculationResults').hidden,true);
}finally{f.close()}});
test('existing links restore numerical assumptions in the single simplified view',async()=>{const f=await fixture('?visning=praesentation&gaester=1000&naetter=3&personer=1');try{
 assert.equal(f.byId('gaester').value,'1000');assert.equal(f.byId('naetter').value,'3');assert.equal(f.byId('personer').value,'1');
 assert.equal(f.byId('venueField').hidden,false);assert.equal(f.byId('calculationResults').hidden,false);
}finally{f.close()}});
