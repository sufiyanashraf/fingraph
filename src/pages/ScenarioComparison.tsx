import CurrencySelector from '../components/CurrencySelector';
import { useCurrency } from '../hooks/useCurrency';
import { useState } from 'react';

import { calculateRecurringInvestment } from '../calculations/recurringInvestment';
import { formatCurrency } from '../utils/formatCurrency';
import ResultCard from '../components/ResultCard';
import GrowthChart from '../components/GrowthChart';

export default function ScenarioComparison() {
  const { currency } = useCurrency();
  const [base, setBase] = useState({
    startingBalance: 100000,
    monthlyContribution: 10000,
    expectedReturn: 8,
    years: 20
  });

  const [alt, setAlt] = useState({
    startingBalance: 100000,
    monthlyContribution: 15000,
    expectedReturn: 8,
    years: 20
  });

  const resA = calculateRecurringInvestment({
    startingBalance: base.startingBalance,
    monthlyContribution: base.monthlyContribution,
    expectedAnnualReturnPercent: base.expectedReturn,
    years: base.years,
    contributionTiming: 'end'
  });

  const resB = calculateRecurringInvestment({
    startingBalance: alt.startingBalance,
    monthlyContribution: alt.monthlyContribution,
    expectedAnnualReturnPercent: alt.expectedReturn,
    years: alt.years,
    contributionTiming: 'end'
  });

  const diffValue = resB.finalBalance - resA.finalBalance;
  const diffPercent = resA.finalBalance > 0 ? (diffValue / resA.finalBalance) * 100 : 0;

  const maxYears = Math.max(base.years, alt.years);
  const x = Array.from({length: maxYears + 1}, (_, i) => i);
  
  const yData = [
    { name: 'Scenario A', y: resA.yearlyData.map(d => d.investmentValue), color: '#3b82f6', type: 'bar' as const },
    { name: 'Scenario B', y: resB.yearlyData.map(d => d.investmentValue), color: '#10b981', type: 'bar' as const }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scenario Comparison</h1>
      <div className="mt-4"><CurrencySelector /></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scenario A */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-blue-900">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Scenario A (Current)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Starting Balance</label>
              <div className="flex items-center">
                <button onClick={() => setBase({ ...base, startingBalance: Math.max(0, base.startingBalance - 1000) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                <input type="number" min="0" value={base.startingBalance} onChange={e => setBase({...base, startingBalance: Number(e.target.value) || 0})} className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setBase({ ...base, startingBalance: base.startingBalance + 1000 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Monthly Contribution</label>
              <div className="flex items-center">
                <button onClick={() => setBase({ ...base, monthlyContribution: Math.max(0, base.monthlyContribution - 100) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                <input type="number" min="0" value={base.monthlyContribution} onChange={e => setBase({...base, monthlyContribution: Number(e.target.value) || 0})} className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setBase({ ...base, monthlyContribution: base.monthlyContribution + 100 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Expected Return (%)</label>
              <div className="flex items-center">
                <button onClick={() => setBase({ ...base, expectedReturn: Math.max(0, base.expectedReturn - 0.5) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                <input type="number" step="0.1" max="100" min="0" value={base.expectedReturn} onChange={e => setBase({...base, expectedReturn: Number(e.target.value) || 0})} className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setBase({ ...base, expectedReturn: Math.min(100, base.expectedReturn + 0.5) })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Years</label>
              <div className="flex items-center">
                <button onClick={() => setBase({ ...base, years: Math.max(1, base.years - 1) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                <input type="number" min="1" value={base.years} onChange={e => setBase({...base, years: Number(e.target.value) || 1})} className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setBase({ ...base, years: base.years + 1 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <div className="text-sm text-gray-500">Projected Value</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(resA.finalBalance, currency)}</div>
          </div>
        </div>

        {/* Scenario B */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-green-200 dark:border-green-900">
          <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">Scenario B (Alternative)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Starting Balance</label>
              <div className="flex items-center">
                <button onClick={() => setAlt({ ...alt, startingBalance: Math.max(0, alt.startingBalance - 1000) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                <input type="number" min="0" value={alt.startingBalance} onChange={e => setAlt({...alt, startingBalance: Number(e.target.value) || 0})} className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setAlt({ ...alt, startingBalance: alt.startingBalance + 1000 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Monthly Contribution</label>
              <div className="flex items-center">
                <button onClick={() => setAlt({ ...alt, monthlyContribution: Math.max(0, alt.monthlyContribution - 100) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                <input type="number" min="0" value={alt.monthlyContribution} onChange={e => setAlt({...alt, monthlyContribution: Number(e.target.value) || 0})} className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setAlt({ ...alt, monthlyContribution: alt.monthlyContribution + 100 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Expected Return (%)</label>
              <div className="flex items-center">
                <button onClick={() => setAlt({ ...alt, expectedReturn: Math.max(0, alt.expectedReturn - 0.5) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                <input type="number" step="0.1" max="100" min="0" value={alt.expectedReturn} onChange={e => setAlt({...alt, expectedReturn: Number(e.target.value) || 0})} className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setAlt({ ...alt, expectedReturn: Math.min(100, alt.expectedReturn + 0.5) })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Years</label>
              <div className="flex items-center">
                <button onClick={() => setAlt({ ...alt, years: Math.max(1, alt.years - 1) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
                <input type="number" min="1" value={alt.years} onChange={e => setAlt({...alt, years: Number(e.target.value) || 1})} className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setAlt({ ...alt, years: alt.years + 1 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <div className="text-sm text-gray-500">Projected Value</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(resB.finalBalance, currency)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResultCard 
          title="Difference in Value" 
          value={(diffValue > 0 ? '+' : '') + formatCurrency(diffValue, currency)} 
          type={diffValue >= 0 ? 'success' : 'danger'} 
        />
        <ResultCard 
          title="Percentage Improvement" 
          value={(diffPercent > 0 ? '+' : '') + diffPercent.toFixed(1) + '%'} 
          type={diffPercent >= 0 ? 'success' : 'danger'} 
        />
        <ResultCard 
          title="Extra Contributions Required" 
          value={formatCurrency(resB.totalPersonallyContributed - resA.totalPersonallyContributed, currency)} 
          type="warning" 
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <GrowthChart x={x} yData={yData} title="Scenario Comparison Projection" />
      </div>
    </div>
  );
}
