import { describe, it, expect } from 'vitest';
import { calculateSimpleInterest } from '../calculations/simpleInterest';
import { calculateCompoundInterest } from '../calculations/compoundInterest';
import { calculateRequiredMonthlyContribution } from '../calculations/goalCalculation';
import { solveEquation } from '../math/equationSolver';
import { runMonteCarlo } from '../calculations/monteCarlo';

describe('Financial Calculations', () => {
  it('calculates simple interest correctly', () => {
    const res = calculateSimpleInterest(10000, 5, 2);
    expect(res.interest).toBe(1000);
    expect(res.finalAmount).toBe(11000);
  });

  it('calculates compound interest correctly', () => {
    const res = calculateCompoundInterest(10000, 5, 2, 1);
    expect(res.finalAmount).toBeCloseTo(11025);
  });

  it('calculates goal correctly for 0% interest', () => {
    const res = calculateRequiredMonthlyContribution(12000, 0, 0, 1);
    expect(res).toBeCloseTo(1000);
  });
});

describe('Equation Solver', () => {
  it('solves simple linear equation', () => {
    const res = solveEquation('2x + 4 = 10');
    expect(res.type).toBe('linear');
    expect(res.solutions[0]).toContain('3');
  });

  it('solves quadratic equation', () => {
    const res = solveEquation('x^2 - 5x + 6 = 0');
    expect(res.type).toBe('quadratic');
    expect(res.solutions.length).toBe(2);
    expect(res.solutions[0]).toContain('3');
    expect(res.solutions[1]).toContain('2');
  });
});

describe('Monte Carlo Simulator', () => {
  it('generates expected percentiles ordering', () => {
    const res = runMonteCarlo({
      initialInvestment: 10000,
      monthlyContribution: 100,
      expectedAnnualReturnPercent: 8,
      annualVolatilityPercent: 15,
      years: 5,
      numSimulations: 100
    });

    // 10th <= 25th <= median <= 75th <= 90th
    expect(res.final.p10).toBeLessThanOrEqual(res.final.p25);
    expect(res.final.p25).toBeLessThanOrEqual(res.final.median);
    expect(res.final.median).toBeLessThanOrEqual(res.final.p75);
    expect(res.final.p75).toBeLessThanOrEqual(res.final.p90);
  });
});
