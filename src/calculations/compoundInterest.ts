import Decimal from 'decimal.js';

export function calculateCompoundInterest(
  principal: number,
  ratePercent: number,
  years: number,
  compoundsPerYear: number
) {
  const p = new Decimal(principal);
  const r = new Decimal(ratePercent).dividedBy(100);
  const t = new Decimal(years);
  const n = new Decimal(compoundsPerYear);

  // A = P(1 + r/n)^(nt)
  const ratePerPeriod = r.dividedBy(n);
  const totalPeriods = n.times(t);

  const base = new Decimal(1).plus(ratePerPeriod);
  const finalAmount = p.times(base.pow(totalPeriods));

  const totalInterest = finalAmount.minus(p);
  const percentageGrowth = totalInterest.dividedBy(p).times(100);

  // Effective annual return: (1 + r/n)^n - 1
  const effectiveAnnualReturn = base.pow(n).minus(1).times(100);

  return {
    initialPrincipal: p.toNumber(),
    totalInterest: totalInterest.toNumber(),
    finalAmount: finalAmount.toNumber(),
    percentageGrowth: percentageGrowth.toNumber(),
    effectiveAnnualReturn: effectiveAnnualReturn.toNumber()
  };
}
