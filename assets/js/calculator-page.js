import * as model from './calculator.js?v=20261111-net-range';
const $=id=>document.getElementById(id);
const number=(n,d=0)=>new Intl.NumberFormat('da-DK',{maximumFractionDigits:d}).format(n);
const params=new URLSearchParams(location.search);
let presentation=params.get('visning')==='praesentation';
for(const [id,key] of [['gaester','gaester'],['naetter','naetter'],['personer','personer']]){
  const value=params.get(key);if(value!==null&&value.trim()!==''&&Number.isFinite(Number(value)))$(id).value=value;
}
function read(){
  const ids=['gaester','naetter','personer'];
  if(!ids.every(id=>$(id).value!==''&&$(id).checkValidity()))return null;
  const guests=$('gaester').valueAsNumber,nights=$('naetter').valueAsNumber,people=$('personer').valueAsNumber;
  try{return {...model.calculateRange(guests,nights,people),people};
  }catch{return null;}
}
function render(){
  const data=read();$('calculationError').hidden=!!data;$('calculationResults').hidden=!data;
  $('venueHeading').textContent=presentation?$('venue').value.trim()||'Jeres klub':'Jeres klub';
  const terms=model.DISPLAY_TERMS;
  $('taxLabel').textContent=terms?.label??'Beregningsgrundlaget afventer afklaring. Ikke klar til kundebrug.';
  $('termsDescription').textContent=terms?.description??'Denne lokale kladde afventer den sidste afklaring af momsgrundlaget.';
  if(!data){for(const id of ['initialResult','topupResult','regularResult'])$(id).textContent='—';return;}
  const span=(field,format=number)=>{
    const low=data.low[field],high=data.high?.[field];
    if(!Number.isFinite(low))return '—';return high===undefined||Math.abs(high-low)<0.005?format(low):format(low)+' til '+format(high);
  };
  const cash=field=>span(field,n=>number(n))+' kr.';
  $('annualResult').textContent=cash('firstYearAnnual');
  $('monthlyResult').textContent=span('firstYearAnnual',n=>number(n/12))+' kr. pr. måned i første års gennemsnit';
  $('logoResult').textContent=span('annualLogoVisits');
  $('logoMonthly').textContent=span('annualLogoVisits',n=>number(n/12))+' pr. måned i gennemsnit. Gentagne gæster kan tælle med.';
  $('nightResult').textContent=span('purchasesPerNight',n=>number(n,1));
  $('annualPurchases').textContent=span('annualPurchases')+' køb i første år';
  $('initialResult').textContent=cash('initialTotal');$('topupResult').textContent=cash('guaranteeTopUp');$('regularResult').textContent=cash('annual');
  $('scenarioNote').textContent='Udgangspunkt: tre køb pr. 100 gæstebesøg med et modelspænd på 30 %.'+' Beregnet med '+number(data.nights)+' aftener pr. uge i 52 uger. Det er scenarier, ikke en prognose eller dokumenteret drift.';
}
function setMode(value){
  presentation=value;document.body.classList.toggle('presentation-mode',value);$('venueField').hidden=!value;
  $('rangeMode').setAttribute('aria-pressed',String(!value));$('presentationMode').setAttribute('aria-pressed',String(value));
  const url=new URL(location.href);if(value)url.searchParams.set('visning','praesentation');else url.searchParams.delete('visning');history.replaceState({},'',url);render();
}
$('rangeMode').addEventListener('click',()=>setMode(false));$('presentationMode').addEventListener('click',()=>setMode(true));
for(const id of ['gaester','naetter','personer','venue'])$(id).addEventListener('input',render);
$('calculatorInputs').addEventListener('submit',event=>event.preventDefault());
$('copyCalculation').addEventListener('click',async()=>{
  if(!read()){$('linkStatus').textContent='Udfyld gyldige tal først.';return;}
  const url=new URL('/beregner/',location.origin);if(presentation)url.searchParams.set('visning','praesentation');
  for(const id of ['gaester','naetter','personer'])url.searchParams.set(id,$(id).value);
  try{await navigator.clipboard.writeText(url.href);$('linkStatus').textContent='Linket med regnetallene er kopieret. Klubnavnet er ikke med i linket.';}
  catch{$('linkStatus').replaceChildren();const a=document.createElement('a');a.href=url.href;a.textContent='Åbn linket med regnetallene og kopiér adressen.';$('linkStatus').append(a);}
});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('linkStatus').textContent='Fuldskærm er ikke tilgængelig i denne browser. Præsentationsvisningen kan stadig bruges.';}});
document.addEventListener('fullscreenchange',()=>$('fullscreen').textContent=document.fullscreenElement?'Forlad fuldskærm':'Fuldskærm');
setMode(presentation);
