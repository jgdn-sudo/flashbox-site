export const PRICE=39;
export const VAT_RATE=0.25;
export const NET_PRICE=PRICE/(1+VAT_RATE);
export const SHARE=0.20;
export const INITIAL_SHARE=0.40;
export const INITIAL_WEEKS=6;
export const MINIMUM_INITIAL_INCOME=3500;
export const BASE_USAGE_PERCENT=3;
export const RANGE_LOW=0.7;
export const RANGE_HIGH=1.3;
export const DISPLAY_TERMS={
  label:'Beløb efter moms og før skat. Egne eventuelle udgifter er ikke fratrukket.',
  description:'Beregneren tager udgangspunkt i tre køb pr. 100 gæstebesøg og viser 70 til 130 % af den beregnede andel fra køb, som Fotonbox’ offentlige beregner. Spændet er valgt i modellen, ikke målt usikkerhed. Gæsten betaler 39 kr. inkl. moms. Efter 25 % moms er beregningsgrundlaget 31,20 kr. pr. køb. Vi bruger 40 % de første seks uger og 20 % de følgende 46 uger, svarende til 12,48 kr. og 6,24 kr. pr. køb efter moms. Minimumsgarantien er 3.500 kr. efter moms i de første seks uger ved aftalt drift. Garantien skaleres ikke med spændet: I hver ende medregnes kun den nødvendige forskel op til minimum. Den lægges ikke oveni hele andelen.'
};
const cents=n=>Math.round((n+Number.EPSILON)*100)/100;
export function calculateYearFromPurchases(purchases){
  if(!Number.isFinite(purchases)||purchases<0)throw new RangeError('Invalid purchases');
  return cents(purchases*NET_PRICE*SHARE);
}
export function calculateScenario(guests,nights,usagePercent){
  if(![guests,nights,usagePercent].every(Number.isFinite)||!Number.isInteger(guests)||!Number.isInteger(nights)||guests<0||guests>100000||nights<0||nights>7||usagePercent<0||usagePercent>100)throw new RangeError('Invalid scenario');
  const purchasesPerNight=guests*usagePercent/100;
  const annualPurchases=purchasesPerNight*nights*52;
  const annual=calculateYearFromPurchases(annualPurchases);
  const initialPurchases=purchasesPerNight*nights*INITIAL_WEEKS;
  const initialRaw=initialPurchases*NET_PRICE*INITIAL_SHARE;
  const topupRaw=nights>0?Math.max(0,MINIMUM_INITIAL_INCOME-initialRaw):0;
  const ongoingRaw=purchasesPerNight*nights*NET_PRICE*(52-INITIAL_WEEKS)*SHARE;
  const initialIncome=cents(initialRaw),guaranteeTopUp=cents(topupRaw);
  const initialTotal=cents(initialRaw+topupRaw),ongoingFirstYear=cents(ongoingRaw);
  const firstYearAnnual=cents(initialRaw+topupRaw+ongoingRaw);
  return {guests,nights,usagePercent,purchasesPerNight,annualPurchases,annual,initialIncome,guaranteeTopUp,initialTotal,ongoingFirstYear,firstYearAnnual};
}
export function calculateRange(guests,nights,peoplePerPurchase=2){
  if(!Number.isFinite(peoplePerPurchase)||peoplePerPurchase<1||peoplePerPurchase>2)throw new RangeError('Invalid print recipients');
  const withLogo=scenario=>({...scenario,annualPrints:scenario.annualPurchases*2,annualLogoVisits:scenario.annualPurchases*peoplePerPurchase});
  return {guests,nights,peoplePerPurchase,base:withLogo(calculateScenario(guests,nights,BASE_USAGE_PERCENT)),low:withLogo(calculateScenario(guests,nights,BASE_USAGE_PERCENT*70/100)),high:withLogo(calculateScenario(guests,nights,BASE_USAGE_PERCENT*130/100))};
}
