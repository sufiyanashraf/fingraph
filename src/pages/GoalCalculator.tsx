import { useState } from 'react';
import { calculateRequiredMonthlyContribution, calculateRequiredTime } from '../calculations/goalCalculation';
import { formatCurrency } from '../utils/formatCurrency';
import ResultCard from '../components/ResultCard';
import CurrencySelector from '../components/CurrencySelector';
import { useCurrency } from '../hooks/useCurrency';
import { Target, TrendingUp, Clock, Wallet } from 'lucide-react';

export default function GoalCalculator() {
  const { currency } = useCurrency();
  const [mode, setMode] = useState<'contribution' | 'time'>('contribution');
  
  const [target, setTarget] = useState(100000);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [rate, setRate] = useState(8);
  
  const [years, setYears] = useState(10);
  const [monthlyContribution, setMonthlyContribution] = useState(500);

  const renderResult = () => {
    if (mode === 'contribution') {
      const pmt = calculateRequiredMonthlyContribution(target, currentSavings, rate, years);
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" /> Action Plan
            </h3>
            <CurrencySelector />
          </div>
          <ResultCard 
            title="Required Monthly Contribution" 
            value={pmt > 0 ? formatCurrency(pmt, currency) : 'Target already reached!'} 
            type="success" 
          />
          {pmt > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm mt-6 flex items-start">
              <div className="text-blue-600 dark:text-blue-400 mr-4 mt-1">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">Strategic Insight</h4>
                <p className="text-lg text-blue-900 dark:text-blue-100 leading-relaxed">
                  You need to consistently invest <strong>{formatCurrency(pmt, currency)}</strong> every month for the next <strong>{years} years</strong> to successfully reach your financial goal of <strong>{formatCurrency(target, currency)}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      const t = calculateRequiredTime(target, currentSavings, rate, monthlyContribution);
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" /> Time Projection
            </h3>
            <CurrencySelector />
          </div>
          <ResultCard 
            title="Estimated Time" 
            value={t === Infinity ? 'Unreachable' : `${t.toFixed(1)} Years`} 
            type={t === Infinity ? 'danger' : 'success'} 
          />
          {t !== Infinity && t > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 shadow-sm mt-6 flex items-start">
              <div className="text-green-600 dark:text-green-400 mr-4 mt-1">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-wider mb-2">Strategic Insight</h4>
                <p className="text-lg text-green-900 dark:text-green-100 leading-relaxed">
                  It will take approximately <strong>{t.toFixed(1)} years</strong> to reach your target of <strong>{formatCurrency(target, currency)}</strong> by steadily investing <strong>{formatCurrency(monthlyContribution, currency)}</strong> every month.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-normal text-gray-900 dark:text-white tracking-wide">
          Goal Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Define your target and discover the exact path to achieve it.</p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Toggle Bar */}
        <div className="flex p-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
          <button 
            className={`flex-1 py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-wide ${mode === 'contribution' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setMode('contribution')}
          >
            Calculate Required Contribution
          </button>
          <button 
            className={`flex-1 py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-wide ${mode === 'time' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setMode('time')}
          >
            Calculate Required Time
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inputs Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center mb-6">
              <Wallet className="w-5 h-5 mr-2 text-indigo-500" /> Parameter Inputs
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Financial Target</label>
              <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
                <button onClick={() => setTarget(Math.max(0, target - 1000))} className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-bold text-lg">-</button>
                <input type="number" min="0" value={target} onChange={e => setTarget(Number(e.target.value) || 0)} 
                     className="w-full text-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setTarget(target + 1000)} className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-bold text-lg">+</button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Current Savings</label>
              <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
                <button onClick={() => setCurrentSavings(Math.max(0, currentSavings - 1000))} className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-bold text-lg">-</button>
                <input type="number" min="0" value={currentSavings} onChange={e => setCurrentSavings(Number(e.target.value) || 0)} 
                     className="w-full text-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setCurrentSavings(currentSavings + 1000)} className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-bold text-lg">+</button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Expected Annual Return (%)</label>
              <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
                <button onClick={() => setRate(Math.max(0, rate - 0.5))} className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-bold text-lg">-</button>
                <input type="number" step="0.1" max="100" min="0" value={rate} onChange={e => setRate(Number(e.target.value) || 0)} 
                     className="w-full text-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => setRate(Math.min(100, rate + 0.5))} className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-bold text-lg">+</button>
              </div>
            </div>
            
            {mode === 'contribution' ? (
              <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Time Available (Years)</label>
                <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800 focus-within:ring-2 focus-within:ring-blue-500">
                  <button onClick={() => setYears(Math.max(1, years - 1))} className="px-4 py-3 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition font-bold text-lg">-</button>
                  <input type="number" min="1" value={years} onChange={e => setYears(Number(e.target.value) || 1)} 
                       className="w-full text-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button onClick={() => setYears(years + 1)} className="px-4 py-3 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition font-bold text-lg">+</button>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Monthly Contribution</label>
                <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800 focus-within:ring-2 focus-within:ring-blue-500">
                  <button onClick={() => setMonthlyContribution(Math.max(0, monthlyContribution - 100))} className="px-4 py-3 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition font-bold text-lg">-</button>
                  <input type="number" min="0" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value) || 0)} 
                       className="w-full text-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button onClick={() => setMonthlyContribution(monthlyContribution + 100)} className="px-4 py-3 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition font-bold text-lg">+</button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="h-full flex flex-col justify-center">
            {renderResult()}
          </div>
        </div>
      </div>
    </div>
  );
}
