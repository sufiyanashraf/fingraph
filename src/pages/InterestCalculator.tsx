import CurrencySelector from '../components/CurrencySelector';
import { useCurrency } from '../hooks/useCurrency';
import { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import GrowthChart from '../components/GrowthChart';
import { calculateCompoundInterest } from '../calculations/compoundInterest';
import { calculateSimpleInterest } from '../calculations/simpleInterest';
import { formatCurrency } from '../utils/formatCurrency';
import ResultCard from '../components/ResultCard';

type InterestType = 'simple' | 'compound';

export default function InterestCalculator() {
  const { currency } = useCurrency();
  const [type, setType] = useState<InterestType>('compound');
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const [compoundFreq, setCompoundFreq] = useState(12);

  const handleRateChange = (val: number) => {
    if (val > 100) val = 100;
    if (val < 0) val = 0;
    setRate(val);
  };

  const results = useMemo(() => {
    if (type === 'simple') {
      const res = calculateSimpleInterest(principal, rate, years);
      return { finalBalance: res.finalAmount, totalInterest: res.interest || (res.finalAmount - principal) };
    }
    const res = calculateCompoundInterest(principal, rate, years, compoundFreq);
    return { finalBalance: res.finalAmount, totalInterest: res.totalInterest };
  }, [type, principal, rate, years, compoundFreq]);

  const currentView = useMemo(() => {
    const x = Array.from({ length: years + 1 }, (_, i) => i);
    const principalData = Array(years + 1).fill(principal);
    const totalData = x.map(year => {
      if (type === 'simple') {
        return principal * (1 + (rate / 100) * year);
      } else {
        return principal * Math.pow(1 + (rate / 100) / compoundFreq, compoundFreq * year);
      }
    });

    const series = [
      { name: 'Principal', y: principalData, color: '#3b82f6', type: 'bar' as const },
      { name: 'Total Value', y: totalData, color: '#10b981', type: 'bar' as const }
    ];
    
    return {
      chart: <GrowthChart x={x} yData={series} />
    };
  }, [type, principal, rate, years, compoundFreq]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-3">
        <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interest Calculator</h1>
      <div className="mt-4"><CurrencySelector /></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
            <button 
              className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${type === 'simple' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setType('simple')}
            >
              Simple
            </button>
            <button 
              className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${type === 'compound' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setType('compound')}
            >
              Compound
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Principal Amount</label>
            <div className="flex items-center">
              <button onClick={() => setPrincipal(Math.max(0, principal - 1000))} className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="0" value={principal} onChange={e => setPrincipal(Number(e.target.value) || 0)} 
                   className="w-full text-center px-4 py-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setPrincipal(principal + 1000)} className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Interest Rate (%)</label>
            <div className="flex items-center">
              <button onClick={() => handleRateChange(rate - 0.5)} className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" step="0.1" max="100" min="0" value={rate} onChange={e => handleRateChange(Number(e.target.value) || 0)} 
                   className="w-full text-center px-4 py-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => handleRateChange(rate + 0.5)} className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time (Years)</label>
            <div className="flex items-center">
              <button onClick={() => setYears(Math.max(1, years - 1))} className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="1" value={years} onChange={e => setYears(Number(e.target.value) || 1)} 
                   className="w-full text-center px-4 py-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setYears(years + 1)} className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>
          </div>

          {type === 'compound' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compounding Frequency</label>
              <select value={compoundFreq} onChange={e => setCompoundFreq(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option value={1}>Annually</option>
                <option value={2}>Semi-annually</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
                <option value={365}>Daily</option>
              </select>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard title="Total Value" value={formatCurrency(results.finalBalance, currency)} type="success" />
            <ResultCard title="Total Interest Earned" value={formatCurrency(results.totalInterest, currency)} type="success" />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Growth Over Time</h2>
            {currentView.chart}
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-100 dark:border-blue-800 overflow-hidden">
            <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Your Growth Function</h2>
            <div className="font-mono bg-white dark:bg-gray-900 p-4 rounded text-blue-800 dark:text-blue-300 overflow-x-auto whitespace-nowrap">
              {type === 'simple' ? (
                <>
                  <p>A(t) = P(1 + rt)</p>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">A({years}) = {principal}(1 + {(rate/100).toFixed(4)} × {years})</p>
                  <p className="mt-2 font-bold text-blue-600 dark:text-blue-400">A({years}) = {formatCurrency(results.finalBalance, currency)}</p>
                </>
              ) : (
                <>
                  <p>A(t) = P(1 + r/n)^(nt)</p>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">A({years}) = {principal}(1 + {(rate/100).toFixed(4)}/{compoundFreq})^({compoundFreq} × {years})</p>
                  <p className="mt-2 font-bold text-blue-600 dark:text-blue-400">A({years}) = {formatCurrency(results.finalBalance, currency)}</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800">
            <h2 className="text-xl font-semibold mb-4 text-indigo-900 dark:text-indigo-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Analysis & Explanation
            </h2>
            <ul className="space-y-3 text-indigo-800 dark:text-indigo-200">
              <li className="flex items-start">
                <span className="mr-2">📈</span>
                <span><strong>Interest Earned:</strong> Your money will earn <strong>{formatCurrency(results.totalInterest, currency)}</strong> in interest, which is <strong>{(principal > 0 ? (results.totalInterest / principal * 100).toFixed(1) : 0)}%</strong> of your original principal.</span>
              </li>
              {type === 'compound' && compoundFreq > 1 && (
                <li className="flex items-start">
                  <span className="mr-2">🔄</span>
                  <span><strong>Compounding Effect:</strong> Because you are compounding {compoundFreq === 12 ? 'monthly' : compoundFreq === 4 ? 'quarterly' : compoundFreq === 365 ? 'daily' : 'multiple times a year'}, you earn "interest on your interest" faster than a simple annual rate.</span>
                </li>
              )}
              {type === 'simple' && (
                <li className="flex items-start">
                  <span className="mr-2">📏</span>
                  <span><strong>Simple Interest:</strong> You are earning a flat rate on your principal every year. Notice how the green growth line in the chart is perfectly straight (linear) rather than curving upwards.</span>
                </li>
              )}
              {years >= 10 && rate >= 5 && type === 'compound' && (
                <li className="flex items-start">
                  <span className="mr-2">🚀</span>
                  <span><strong>Long-Term Magic:</strong> Because you are investing for {years} years, the compounding curve accelerates significantly in the later years. Notice how the green bars start growing much faster toward the right side of the graph!</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
