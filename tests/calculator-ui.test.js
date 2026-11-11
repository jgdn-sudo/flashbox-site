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
test('rendered calculator shows the agreed range and VAT wording',async()=>{const f=await fixture();try{
 assert.equal(f.byId('annualResult').textContent,'10.733 til 16.938 kr.');
 assert.equal(f.byId('nightResult').textContent,'12,6 til 23,4');
 assert.match(f.byId('taxLabel').textContent,/efter moms og før skat/);
 assert.match(f.byId('termsDescription').textContent,/70 til 130/);
 assert.equal(f.byId('calculationError').hidden,true);
}finally{f.close()}});
test('presentation changes layout but uses the same range, and venue text cannot inject markup',async()=>{const f=await fixture();try{
 const result=f.byId('annualResult').textContent;f.byId('presentationMode').click();
 assert(f.dom.window.document.body.classList.contains('presentation-mode'));assert.equal(f.byId('annualResult').textContent,result);assert.equal(f.byId('venueField').hidden,false);
 f.input('venue','<img src=x onerror=alert(1)>');assert.equal(f.byId('venueHeading').textContent,'<img src=x onerror=alert(1)>');assert.equal(f.byId('venueHeading').children.length,0);
 f.byId('rangeMode').click();assert.equal(f.byId('venueField').hidden,true);
}finally{f.close()}});
test('invalid and empty inputs hide old money results; zero opening gives zero',async()=>{const f=await fixture();try{
 f.input('gaester','');assert.equal(f.byId('calculationResults').hidden,true);assert.equal(f.byId('calculationError').hidden,false);assert.equal(f.byId('initialResult').textContent,'—');
 f.input('gaester','600');f.input('naetter','0');assert.equal(f.byId('annualResult').textContent,'0 kr.');
 f.input('naetter','8');assert.equal(f.byId('calculationResults').hidden,true);
}finally{f.close()}});
test('saved numerical assumptions restore in presentation and exclude venue names when copied',async()=>{const f=await fixture('?visning=praesentation&gaester=1000&naetter=3&personer=1');try{
 assert.equal(f.byId('gaester').value,'1000');assert(f.dom.window.document.body.classList.contains('presentation-mode'));
 f.input('venue','Private test venue');let copied='';Object.defineProperty(f.dom.window.navigator,'clipboard',{value:{writeText:async text=>{copied=text;}}});f.byId('copyCalculation').click();await new Promise(r=>setImmediate(r));
 const url=new URL(copied);assert.equal(url.searchParams.get('gaester'),'1000');assert.equal(url.searchParams.get('personer'),'1');assert.equal(url.searchParams.get('visning'),'praesentation');assert(!copied.includes('Private'));assert(!url.searchParams.has('brug'));
}finally{f.close()}});
test('unsupported fullscreen gives an inline message rather than breaking calculation',async()=>{const f=await fixture();try{f.byId('fullscreen').click();await new Promise(r=>setImmediate(r));assert.match(f.byId('linkStatus').textContent,/ikke tilgængelig/);assert.equal(f.byId('calculationResults').hidden,false);}finally{f.close()}});
