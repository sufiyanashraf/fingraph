import CurrencySelector from '../components/CurrencySelector';
import { useCurrency } from '../hooks/useCurrency';
import { useState } from 'react';
import { calculateRecurringInvestment } from '../calculations/recurringInvestment';
import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import ResultCard from '../components/ResultCard';
import GrowthChart from '../components/GrowthChart';

export default function InvestmentSimulator() {
  const { currency } = useCurrency();
  const [startingBalance, setStartingBalance] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [years, setYears] = useState(20);
  
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [annualFees, setAnnualFees] = useState(0);
  const [inflation, setInflation] = useState(0);

  const res = calculateRecurringInvestment({
    startingBalance,
    monthlyContribution,
    expectedAnnualReturnPercent: expectedReturn,
    years,
    contributionTiming: 'end',
    annualContributionIncreasePercent: annualIncrease,
    annualFeesPercent: annualFees,
    inflationPercent: inflation,
  });

  const x = res.yearlyData.map(d => d.year);
  const contributionsData = res.yearlyData.map(d => d.contributions);
  const valueData = res.yearlyData.map(d => d.investmentValue);
  const inflationData = res.yearlyData.map(d => d.inflationAdjustedValue);

  const chartSeries: any[] = [
    { name: 'Total Contributed', y: contributionsData, color: '#3b82f6', type: 'bar' },
    { name: 'Portfolio Value', y: valueData, color: '#10b981', type: 'bar' },
  ];

  if (inflation > 0) {
    chartSeries.push({ name: 'Inflation Adjusted', y: inflationData, color: '#f59e0b', type: 'bar' });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investment Simulator</h1>
      <div className="mt-4"><CurrencySelector /></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Balance</label>
            <div className="flex items-center">
              <button onClick={() => setStartingBalance(Math.max(0, startingBalance - 1000))} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="0" value={startingBalance} onChange={e => setStartingBalance(Number(e.target.value) || 0)} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setStartingBalance(startingBalance + 1000)} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Contribution</label>
            <div className="flex items-center">
              <button onClick={() => setMonthlyContribution(Math.max(0, monthlyContribution - 100))} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="0" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value) || 0)} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setMonthlyContribution(monthlyContribution + 100)} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Annual Return (%)</label>
            <div className="flex items-center">
              <button onClick={() => setExpectedReturn(Math.max(0, expectedReturn - 0.5))} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" step="0.1" max="100" min="0" value={expectedReturn} onChange={e => setExpectedReturn(Math.min(100, Math.max(0, Number(e.target.value) || 0)))} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setExpectedReturn(Math.min(100, expectedReturn + 0.5))} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years</label>
            <div className="flex items-center">
              <button onClick={() => setYears(Math.max(1, years - 1))} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="1" value={years} onChange={e => setYears(Number(e.target.value) || 1)} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setYears(years + 1)} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>

          <div className="pt-4 border-t dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase">Advanced</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Contribution Increase (%)</label>
                <div className="flex items-center">
                  <button onClick={() => setAnnualIncrease(Math.max(0, annualIncrease - 0.5))} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                  <input type="number" step="0.1" value={annualIncrease} onChange={e => setAnnualIncrease(Number(e.target.value) || 0)} 
                       className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button onClick={() => setAnnualIncrease(annualIncrease + 0.5)} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inflation Rate (%)</label>
                <div className="flex items-center">
                  <button onClick={() => setInflation(Math.max(0, inflation - 0.5))} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                  <input type="number" step="0.1" value={inflation} onChange={e => setInflation(Number(e.target.value) || 0)} 
                       className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button onClick={() => setInflation(inflation + 0.5)} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Fees (%)</label>
                <div className="flex items-center">
                  <button onClick={() => setAnnualFees(Math.max(0, annualFees - 0.1))} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                  <input type="number" step="0.1" value={annualFees} onChange={e => setAnnualFees(Number(e.target.value) || 0)} 
                       className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button onClick={() => setAnnualFees(annualFees + 0.1)} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <ResultCard title="Total Contributed" value={formatCurrency(res.totalPersonallyContributed, currency)} />
            <ResultCard title="Estimated Growth" value={formatCurrency(res.estimatedGrowth, currency)} type="success" />
            <ResultCard title="Projected Value" value={formatCurrency(res.finalBalance, currency)} type="success" />
            <ResultCard title="Total Return" value={formatPercent(res.totalReturnPercent)} />
            
            {inflation > 0 && (
              <ResultCard title="Inflation Adjusted Value" value={formatCurrency(res.inflationAdjustedValue, currency)} type="warning" />
            )}
            {annualFees > 0 && (
              <ResultCard title="Total Fees Paid" value={formatCurrency(res.effectOfFees, currency)} type="danger" />
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Portfolio Growth Projection</h2>
            <GrowthChart x={x} yData={chartSeries} />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Analysis & Advice
            </h2>
            <ul className="space-y-3 text-blue-800 dark:text-blue-200">
              {expectedReturn > 12 && (
                <li className="flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span><strong>Optimistic Return Rate:</strong> An expected return of {expectedReturn}% is highly optimistic. Historically, the stock market averages about 7-10% annually before inflation. Be careful with overly aggressive projections.</span>
                </li>
              )}
              {expectedReturn <= inflation && (
                <li className="flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span><strong>Inflation Risk:</strong> Your expected return ({expectedReturn}%) is lower than or equal to inflation ({inflation}%). Your real purchasing power will decrease over time. Consider investing in higher-yield assets.</span>
                </li>
              )}
              {annualFees >= 1.5 && (
                <li className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span><strong>High Fees:</strong> You are paying {annualFees}% in annual fees, resulting in {formatCurrency(res.effectOfFees, currency)} lost to fees over {years} years. Consider switching to low-cost index funds or ETFs to preserve your compound growth.</span>
                </li>
              )}
              {monthlyContribution === 0 && years > 5 && (
                <li className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span><strong>Accelerate Growth:</strong> You are relying entirely on your starting balance. Adding even a small monthly contribution can drastically increase your final projected value over {years} years through dollar-cost averaging.</span>
                </li>
              )}
              {res.finalBalance > res.totalPersonallyContributed * 2 && (
                <li className="flex items-start">
                  <span className="mr-2">📈</span>
                  <span><strong>Compound Magic:</strong> Excellent! Thanks to compound interest, your money will more than double. The majority of your final balance will come from growth, not just your contributions.</span>
                </li>
              )}
              {(expectedReturn <= 12 && expectedReturn > inflation && annualFees < 1.5 && (monthlyContribution > 0 || res.finalBalance <= res.totalPersonallyContributed * 2)) && (
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span><strong>On Track:</strong> Your investment parameters are well-balanced and realistic. Stay consistent with your strategy to reach your projected {formatCurrency(res.finalBalance, currency)}!</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
