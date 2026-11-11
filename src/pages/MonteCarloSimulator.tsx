import CurrencySelector from '../components/CurrencySelector';
import { useCurrency } from '../hooks/useCurrency';
import { useState } from 'react';
import { runMonteCarlo } from '../calculations/monteCarlo';
import { formatCurrency } from '../utils/formatCurrency';
import ResultCard from '../components/ResultCard';
import GrowthChart from '../components/GrowthChart';
import { Dices } from 'lucide-react';

export default function MonteCarloSimulator() {
  const { currency } = useCurrency();
  const [params, setParams] = useState({
    initialInvestment: 100000,
    monthlyContribution: 10000,
    expectedAnnualReturnPercent: 8,
    annualVolatilityPercent: 15,
    years: 20,
    numSimulations: 5000
  });

  const [result, setResult] = useState<ReturnType<typeof runMonteCarlo> | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    // Use setTimeout to allow UI to render loading state before heavy calculation
    setTimeout(() => {
      const res = runMonteCarlo(params);
      setResult(res);
      setIsSimulating(false);
    }, 50);
  };

  const getChartData = () => {
    if (!result) return [];
    
    return [
      { name: '90th Percentile (Best 10%)', y: result.percentilesOverTime[90], color: 'rgba(16, 185, 129, 0.2)' },
      { name: '75th Percentile', y: result.percentilesOverTime[75], color: 'rgba(59, 130, 246, 0.3)' },
      { name: 'Median (50th Percentile)', y: result.percentilesOverTime[50], color: '#3b82f6', fill: 'tonexty' },
      { name: '25th Percentile', y: result.percentilesOverTime[25], color: 'rgba(245, 158, 11, 0.3)', fill: 'tonexty' },
      { name: '10th Percentile (Worst 10%)', y: result.percentilesOverTime[10], color: 'rgba(239, 68, 68, 0.2)', fill: 'tonexty' }
    ];
  };

  const months = params.years * 12;
  const xAxis = Array.from({length: months + 1}, (_, i) => i / 12);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Probability Simulator</h1>
      <div className="mt-4"><CurrencySelector /></div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300">
        <strong>Disclaimer:</strong> Projections and probability simulations are educational estimates based on the assumptions you enter. Investment returns are uncertain and results are not guaranteed. This tool does not provide personalized financial advice.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Investment</label>
            <div className="flex items-center">
              <button onClick={() => setParams({ ...params, initialInvestment: Math.max(0, params.initialInvestment - 1000) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="0" value={params.initialInvestment} onChange={e => setParams({...params, initialInvestment: Number(e.target.value) || 0})} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setParams({ ...params, initialInvestment: params.initialInvestment + 1000 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Contribution</label>
            <div className="flex items-center">
              <button onClick={() => setParams({ ...params, monthlyContribution: Math.max(0, params.monthlyContribution - 100) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="0" value={params.monthlyContribution} onChange={e => setParams({...params, monthlyContribution: Number(e.target.value) || 0})} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setParams({ ...params, monthlyContribution: params.monthlyContribution + 100 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Annual Return (%)</label>
            <div className="flex items-center">
              <button onClick={() => setParams({ ...params, expectedAnnualReturnPercent: Math.max(0, params.expectedAnnualReturnPercent - 0.5) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" step="0.1" max="100" min="0" value={params.expectedAnnualReturnPercent} onChange={e => setParams({...params, expectedAnnualReturnPercent: Number(e.target.value) || 0})} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setParams({ ...params, expectedAnnualReturnPercent: Math.min(100, params.expectedAnnualReturnPercent + 0.5) })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Volatility (%)</label>
            <div className="flex items-center">
              <button onClick={() => setParams({ ...params, annualVolatilityPercent: Math.max(0, params.annualVolatilityPercent - 0.5) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" step="0.1" max="100" min="0" value={params.annualVolatilityPercent} onChange={e => setParams({...params, annualVolatilityPercent: Number(e.target.value) || 0})} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setParams({ ...params, annualVolatilityPercent: Math.min(100, params.annualVolatilityPercent + 0.5) })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years</label>
            <div className="flex items-center">
              <button onClick={() => setParams({ ...params, years: Math.max(1, params.years - 1) })} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="1" value={params.years} onChange={e => setParams({...params, years: Number(e.target.value) || 1})} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setParams({ ...params, years: params.years + 1 })} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Simulations</label>
            <select value={params.numSimulations} onChange={e => setParams({...params, numSimulations: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
              <option value={1000}>1,000</option>
              <option value={5000}>5,000</option>
              <option value={10000}>10,000</option>
            </select>
          </div>

          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-lg transition-colors flex justify-center items-center"
          >
            {isSimulating ? 'Simulating...' : <><Dices className="w-5 h-5 mr-2"/> Run Simulation</>}
          </button>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {!result ? (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center text-gray-500">
              <Dices className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Configure your parameters and run the simulation to see probability projections.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ResultCard title="10th Percentile (Poor)" value={formatCurrency(result.final.p10, currency)} type="danger" />
                <ResultCard title="Median (Expected)" value={formatCurrency(result.final.median, currency)} type="default" />
                <ResultCard title="90th Percentile (Great)" value={formatCurrency(result.final.p90, currency)} type="success" />
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Probability Funnel</h2>
                <GrowthChart x={xAxis} yData={getChartData()} title="Simulated Portfolio Range" xAxisLabel="Years" />
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-800">
                <h2 className="text-xl font-semibold mb-3 text-indigo-800 dark:text-indigo-300">Analysis & Advice</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>If you experience the median scenario:</strong> You are expected to reach <strong>{formatCurrency(result.final.median, currency)}</strong>. This is your most likely baseline to plan around.
                  </p>
                  <p>
                    <strong>If the market performs poorly (10th percentile):</strong> Your portfolio might only reach <strong>{formatCurrency(result.final.p10, currency)}</strong>. 
                    <em> Advice:</em> To protect against this downside, consider increasing your monthly contribution by {formatCurrency(params.monthlyContribution * 0.2, currency)} or diversifying to lower the {params.annualVolatilityPercent}% volatility.
                  </p>
                  <p>
                    <strong>If the market performs exceptionally well (90th percentile):</strong> You could reach up to <strong>{formatCurrency(result.final.p90, currency)}</strong>.
                    <em> Advice:</em> If this happens, you may reach your goal much earlier than {params.years} years and can afford to shift to safer, lower-yield assets.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
