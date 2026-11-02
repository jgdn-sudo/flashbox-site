export const PRICE=39;
export const SHARE=0.20;
export const INITIAL_SHARE=0.40;
export const INITIAL_WEEKS=6;
export const MINIMUM_INITIAL_INCOME=2500;
export function calculateYearFromPurchases(purchases){return purchases*PRICE*SHARE;}
export function calculateScenario(guests,nights,usagePercent){
  if(![guests,nights,usagePercent].every(Number.isFinite)||!Number.isInteger(guests)||!Number.isInteger(nights)||guests<0||guests>100000||nights<0||nights>7||usagePercent<0||usagePercent>100)throw new RangeError('Invalid scenario');
  const purchasesPerNight=guests*usagePercent/100;
  const annualPurchases=purchasesPerNight*nights*52;
  const annual=calculateYearFromPurchases(annualPurchases);
  const initialIncome=purchasesPerNight*nights*PRICE*INITIAL_WEEKS*INITIAL_SHARE;
  const guaranteeTopUp=nights>0?Math.max(0,MINIMUM_INITIAL_INCOME-initialIncome):0;
  const firstYearAnnual=Math.round(guaranteeTopUp*100+purchasesPerNight*nights*PRICE*(INITIAL_WEEKS*INITIAL_SHARE+(52-INITIAL_WEEKS)*SHARE)*100)/100;
  return {guests,nights,usagePercent,purchasesPerNight,annualPurchases,annual,firstYearAnnual};
}
export function calculateRange(guests,nights,peoplePerPurchase=2){
  if(!Number.isFinite(peoplePerPurchase)||peoplePerPurchase<1||peoplePerPurchase>2)throw new RangeError('Invalid print recipients');
  const low=calculateScenario(guests,nights,2),high=calculateScenario(guests,nights,4);
  const withLogo=scenario=>({...scenario,annualPrints:scenario.annualPurchases*2,annualLogoVisits:scenario.annualPurchases*peoplePerPurchase});
  return {guests,nights,peoplePerPurchase,low:withLogo(low),high:withLogo(high)};
}
