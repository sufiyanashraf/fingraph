import Decimal from 'decimal.js';

export function calculateSimpleInterest(
  principal: number,
  ratePercent: number,
  timeInYears: number
) {
  const p = new Decimal(principal);
  const r = new Decimal(ratePercent).dividedBy(100);
  const t = new Decimal(timeInYears);

  const interest = p.times(r).times(t);
  const finalAmount = p.plus(interest);

  return {
    principal: p.toNumber(),
    interest: interest.toNumber(),
    finalAmount: finalAmount.toNumber(),
  };
}
