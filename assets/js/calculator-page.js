import {calculateRange,SHARE} from './calculator.js';
const fmt = n => new Intl.NumberFormat('da-DK',{maximumFractionDigits:0}).format(n);
const fmtKr = n => fmt(n) + ' kr.';
/* ---------- Beregner og henvendelser ---------- */
const $n=document.getElementById('naetter'),$g=document.getElementById('gaester'),$p=document.getElementById('personer'),$res=document.getElementById('calcResult');
let calcData=null;
function runCalc(){
  const inputs=[$n,$g,$p];
  const valid=inputs.every(e=>e.value!==''&&e.checkValidity());
  calcData=valid?calculateRange($g.valueAsNumber,$n.valueAsNumber,$p.valueAsNumber):null;
  document.getElementById('beregner').classList.toggle('ready',!!calcData);
  $res.classList.toggle('has',!!calcData);
  if(!calcData){
    $res.innerHTML='<p class="calc__placeholder">Udfyld gyldige tal. Åbningsaftener skal være fra 0 til 7, gæstetal et helt tal fra 0 til 100.000 og personer pr. køb fra 1 til 2.</p>';
    return;
  }
  const d=calcData,low=d.low,high=d.high;
  const num=n=>new Intl.NumberFormat('da-DK',{maximumFractionDigits:1}).format(n);
  $res.innerHTML='<div class="calc__income"><h2 class="calc__metric-label">Til klubben det første år</h2><p class="calc__range">'+fmt(low.firstYearAnnual)+' til '+fmt(high.firstYearAnnual)+' kr.</p><p class="calc__monthly">'+fmt(low.firstYearAnnual/12)+' til '+fmt(high.firstYearAnnual/12)+' kr. pr. måned i gennemsnit</p></div><div class="calc__logo"><h2 class="calc__metric-label">Gæster med jeres logo med hjem om året</h2><p class="calc__logo-number">'+fmt(low.annualLogoVisits)+' til '+fmt(high.annualLogoVisits)+'</p><p class="calc__monthly">'+fmt(low.annualLogoVisits/12)+' til '+fmt(high.annualLogoVisits/12)+' pr. måned i gennemsnit</p></div><p class="calc__purchases"><strong>'+num(low.purchasesPerNight)+' til '+num(high.purchasesPerNight)+'</strong> køb pr. nat</p>';

}
for(const input of [$n,$g,$p])input.addEventListener('input',runCalc);
runCalc();
