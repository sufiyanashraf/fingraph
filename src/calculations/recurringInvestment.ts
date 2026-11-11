import Decimal from 'decimal.js';

export interface InvestmentParams {
  startingBalance: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
  years: number;
  contributionTiming: 'beginning' | 'end';
  annualContributionIncreasePercent?: number;
  annualFeesPercent?: number;
  inflationPercent?: number;
}

export interface YearlyData {
  year: number;
  contributions: number;
  investmentValue: number;
  inflationAdjustedValue: number;
  feesPaid: number;
}

export function calculateRecurringInvestment(params: InvestmentParams) {
  const {
    startingBalance,
    monthlyContribution,
    expectedAnnualReturnPercent,
    years,
    contributionTiming,
    annualContributionIncreasePercent = 0,
    annualFeesPercent = 0,
    inflationPercent = 0
  } = params;

  let balance = new Decimal(startingBalance);
  let currentMonthlyContrib = new Decimal(monthlyContribution);
  const monthlyReturnRate = new Decimal(expectedAnnualReturnPercent).dividedBy(100).dividedBy(12);
  const monthlyFeeRate = new Decimal(annualFeesPercent).dividedBy(100).dividedBy(12);
  const annualContribIncreaseRate = new Decimal(annualContributionIncreasePercent).dividedBy(100);
  const inflationRate = new Decimal(inflationPercent).dividedBy(100);

  let totalPersonallyContributed = new Decimal(startingBalance);
  let totalFeesPaid = new Decimal(0);
  
  const yearlyData: YearlyData[] = [];
  
  // Year 0
  yearlyData.push({
    year: 0,
    contributions: totalPersonallyContributed.toNumber(),
    investmentValue: balance.toNumber(),
    inflationAdjustedValue: balance.toNumber(),
    feesPaid: 0
  });

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      if (contributionTiming === 'beginning') {
        balance = balance.plus(currentMonthlyContrib);
        totalPersonallyContributed = totalPersonallyContributed.plus(currentMonthlyContrib);
      }

      // Growth
      balance = balance.times(new Decimal(1).plus(monthlyReturnRate));
      
      // Fees
      const fees = balance.times(monthlyFeeRate);
      balance = balance.minus(fees);
      totalFeesPaid = totalFeesPaid.plus(fees);

      if (contributionTiming === 'end') {
        balance = balance.plus(currentMonthlyContrib);
        totalPersonallyContributed = totalPersonallyContributed.plus(currentMonthlyContrib);
      }
    }

    // Annual contribution increase
    if (annualContributionIncreasePercent > 0) {
      currentMonthlyContrib = currentMonthlyContrib.times(new Decimal(1).plus(annualContribIncreaseRate));
    }

    const inflationDiscount = new Decimal(1).plus(inflationRate).pow(y);
    const inflationAdjusted = balance.dividedBy(inflationDiscount);

    yearlyData.push({
      year: y,
      contributions: totalPersonallyContributed.toNumber(),
      investmentValue: balance.toNumber(),
      inflationAdjustedValue: inflationAdjusted.toNumber(),
      feesPaid: totalFeesPaid.toNumber()
    });
  }

  const finalBalance = balance;
  const totalReturnPercent = finalBalance.minus(totalPersonallyContributed).dividedBy(totalPersonallyContributed).times(100);
  const estimatedGrowth = finalBalance.minus(totalPersonallyContributed);

  return {
    totalPersonallyContributed: totalPersonallyContributed.toNumber(),
    estimatedGrowth: estimatedGrowth.toNumber(),
    finalBalance: finalBalance.toNumber(),
    totalReturnPercent: totalReturnPercent.toNumber(),
    inflationAdjustedValue: yearlyData[years].inflationAdjustedValue,
    effectOfFees: totalFeesPaid.toNumber(),
    yearlyData
  };
}
