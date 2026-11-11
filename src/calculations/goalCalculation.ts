import Decimal from 'decimal.js';

export function calculateRequiredMonthlyContribution(
  targetAmount: number,
  currentSavings: number,
  expectedAnnualReturnPercent: number,
  years: number
) {
  const FV = new Decimal(targetAmount);
  const P = new Decimal(currentSavings);
  const r = new Decimal(expectedAnnualReturnPercent).dividedBy(100).dividedBy(12);
  const t = new Decimal(years).times(12);

  if (r.isZero()) {
    return FV.minus(P).dividedBy(t).toNumber();
  }

  // FV = P(1+r)^t + PMT * ((1+r)^t - 1) / r
  // PMT * ((1+r)^t - 1) / r = FV - P(1+r)^t
  // PMT = (FV - P(1+r)^t) * r / ((1+r)^t - 1)

  const growthFactor = new Decimal(1).plus(r).pow(t);
  const principalGrowth = P.times(growthFactor);
  
  const pmt = FV.minus(principalGrowth).times(r).dividedBy(growthFactor.minus(1));
  
  return pmt.toNumber();
}

export function calculateRequiredTime(
  targetAmount: number,
  currentSavings: number,
  expectedAnnualReturnPercent: number,
  monthlyContribution: number
) {
  const FV = new Decimal(targetAmount);
  const P = new Decimal(currentSavings);
  const r = new Decimal(expectedAnnualReturnPercent).dividedBy(100).dividedBy(12);
  const PMT = new Decimal(monthlyContribution);

  if (r.isZero()) {
    if (PMT.isZero()) return Infinity;
    return FV.minus(P).dividedBy(PMT).dividedBy(12).toNumber(); // in years
  }

  // t = ln( (FV + PMT/r) / (P + PMT/r) ) / ln(1+r)
  const PMT_over_r = PMT.dividedBy(r);
  const numerator = FV.plus(PMT_over_r);
  const denominator = P.plus(PMT_over_r);
  
  if (numerator.isNegative() || denominator.isNegative()) {
    return Infinity; // Not reachable
  }

  const ratio = numerator.dividedBy(denominator).toNumber();
  if (ratio <= 0) return Infinity;

  const tMonths = Math.log(ratio) / Math.log(1 + r.toNumber());
  return tMonths / 12; // in years
}
