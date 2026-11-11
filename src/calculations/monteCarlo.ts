export interface MonteCarloParams {
  initialInvestment: number;
  monthlyContribution: number;
  expectedAnnualReturnPercent: number;
  annualVolatilityPercent: number;
  years: number;
  numSimulations: number;
}

// Box-Muller transform for standard normal distribution
function randomNormal() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function runMonteCarlo(params: MonteCarloParams) {
  const {
    initialInvestment,
    monthlyContribution,
    expectedAnnualReturnPercent,
    annualVolatilityPercent,
    years,
    numSimulations
  } = params;

  const months = years * 12;
  const annualMu = expectedAnnualReturnPercent / 100;
  const annualSigma = annualVolatilityPercent / 100;
  
  // Convert to monthly parameters for lognormal model
  // continuous compounding adjustment: mu_monthly = (mu - sigma^2/2) / 12
  const monthlyMu = (annualMu - Math.pow(annualSigma, 2) / 2) / 12;
  const monthlySigma = annualSigma / Math.sqrt(12);

  const finalBalances: number[] = [];
  const percentilesOverTime: { [percentile: number]: number[] } = {
    10: Array(months + 1).fill(0),
    25: Array(months + 1).fill(0),
    50: Array(months + 1).fill(0),
    75: Array(months + 1).fill(0),
    90: Array(months + 1).fill(0),
  };

  // We will store just a subset of trajectories to save memory, or compute percentiles iteratively.
  // Storing all simulations (e.g., 5000) for all months (e.g., 360) is 5000 * 360 = 1.8M numbers.
  // We can afford to hold that in memory temporarily.
  
  const allSimulations = Array.from({ length: numSimulations }, () => new Float64Array(months + 1));

  for (let s = 0; s < numSimulations; s++) {
    let balance = initialInvestment;
    allSimulations[s][0] = balance;

    for (let m = 1; m <= months; m++) {
      const z = randomNormal();
      const monthlyReturn = Math.exp(monthlyMu + monthlySigma * z) - 1;
      
      // End of month contribution
      balance = balance * (1 + monthlyReturn) + monthlyContribution;
      allSimulations[s][m] = Math.max(0, balance); // Balance doesn't go below zero usually unless margin
    }
    finalBalances.push(balance);
  }

  // Calculate percentiles for each month
  for (let m = 0; m <= months; m++) {
    const monthValues = new Float64Array(numSimulations);
    for (let s = 0; s < numSimulations; s++) {
      monthValues[s] = allSimulations[s][m];
    }
    monthValues.sort();
    
    percentilesOverTime[10][m] = monthValues[Math.floor(numSimulations * 0.10)];
    percentilesOverTime[25][m] = monthValues[Math.floor(numSimulations * 0.25)];
    percentilesOverTime[50][m] = monthValues[Math.floor(numSimulations * 0.50)];
    percentilesOverTime[75][m] = monthValues[Math.floor(numSimulations * 0.75)];
    percentilesOverTime[90][m] = monthValues[Math.floor(numSimulations * 0.90)];
  }

  finalBalances.sort((a, b) => a - b);

  return {
    percentilesOverTime,
    final: {
      p10: finalBalances[Math.floor(numSimulations * 0.10)],
      p25: finalBalances[Math.floor(numSimulations * 0.25)],
      median: finalBalances[Math.floor(numSimulations * 0.50)],
      p75: finalBalances[Math.floor(numSimulations * 0.75)],
      p90: finalBalances[Math.floor(numSimulations * 0.90)],
      best: finalBalances[numSimulations - 1],
      worst: finalBalances[0]
    }
  };
}
