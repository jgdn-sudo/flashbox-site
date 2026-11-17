import * as model from './calculator.js?v=20261111-net-range';
const $=id=>document.getElementById(id);
const number=(n,d=0)=>new Intl.NumberFormat('da-DK',{maximumFractionDigits:d}).format(n);
const params=new URLSearchParams(location.search);
for(const id of ['gaester','naetter','personer']){
  const value=params.get(id);if(value!==null&&value.trim()!==''&&Number.isFinite(Number(value)))$(id).value=value;
}
function read(){
  const ids=['gaester','naetter','personer'];
  if(!ids.every(id=>$(id).value!==''&&$(id).checkValidity()))return null;
  const guests=Number($('gaester').value),nights=Number($('naetter').value),people=Number($('personer').value);
  try{return {...model.calculateRange(guests,nights,people),people};}catch{return null;}
}
function render(){
  const data=read();$('calculationError').hidden=!!data;$('calculationResults').hidden=!data;
  $('taxLabel').textContent='Ekskl. moms og før skat.';
  $('termsDescription').textContent=model.DISPLAY_TERMS.description;
  $('calculationError').textContent=$('gaester').value===''?'Indtast antal gæster pr. åbningsaften for at se estimatet.':'Udfyld gyldige tal for at se beregningen.';
  if(!data){for(const id of ['annualResult','monthlyResult','annualPrintsResult','monthlyPrintsResult','initialResult','topupResult','regularResult','logoResult','logoMonthly','nightResult','annualPurchases'])$(id).textContent='—';return;}
  const span=(field,format=number)=>{
    const low=data.low[field],high=data.high?.[field];
    if(!Number.isFinite(low))return '—';return high===undefined||Math.abs(high-low)<0.005?format(low):format(low)+' til '+format(high);
  };
  const cash=field=>span(field,n=>number(n))+' kr.';
  $('annualResult').textContent=cash('firstYearAnnual');
  $('monthlyResult').textContent=span('firstYearAnnual',n=>number(n/12))+' kr. pr. måned i gennemsnit';
  $('annualPrintsResult').textContent=span('annualPrints');
  $('monthlyPrintsResult').textContent=span('annualPrints',n=>number(n/12))+' pr. måned i gennemsnit';
  $('logoResult').textContent=span('annualLogoVisits');
  $('logoMonthly').textContent=span('annualLogoVisits',n=>number(n/12))+' pr. måned i gennemsnit. Gentagne gæster kan tælle med.';
  $('nightResult').textContent=span('purchasesPerNight',n=>number(n,1));
  $('annualPurchases').textContent=span('annualPurchases')+' køb i første år';
  $('initialResult').textContent=cash('initialTotal');$('topupResult').textContent=cash('guaranteeTopUp');$('regularResult').textContent=cash('annual');
}
for(const id of ['gaester','naetter','personer']){
  $(id).addEventListener('input',render);
  $(id).addEventListener('change',render);
}
$('calculatorInputs').addEventListener('submit',event=>event.preventDefault());
render();
