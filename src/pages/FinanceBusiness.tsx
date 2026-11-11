import { useState, useMemo } from 'react';
import SiteHeader from '../components/SiteHeader';
import InterestCalculator from './InterestCalculator';
import InvestmentSimulator from './InvestmentSimulator';
import GoalCalculator from './GoalCalculator';
import ScenarioComparison from './ScenarioComparison';
import MonteCarloSimulator from './MonteCarloSimulator';
import { ArrowRight, FileText, TrendingUp, Target, Repeat, BarChart2, Dices } from 'lucide-react';

type FinanceTab =
  | 'dashboard'
  | 'interest'
  | 'investment'
  | 'goals'
  | 'recurring'
  | 'comparison'
  | 'montecarlo';

export default function FinanceBusiness() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('dashboard');

  // Preview interactive parameters
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [freq] = useState(12);

  // Compute live FV for preview
  const futureValue = useMemo(() => {
    const r = rate / 100;
    const n = freq;
    const t = years;
    return principal * Math.pow(1 + r / n, n * t);
  }, [principal, rate, years, freq]);

  const TOOLS = [
    {
      id: 'interest' as FinanceTab,
      icon: FileText,
      title: 'Interest Calculator',
      desc: 'Work out simple and compound interest for any amount, rate and period.',
    },
    {
      id: 'investment' as FinanceTab,
      icon: TrendingUp,
      title: 'Investment Simulator',
      desc: 'Project how an investment could grow under different return assumptions.',
    },
    {
      id: 'goals' as FinanceTab,
      icon: Target,
      title: 'Financial Goal Planner',
      desc: 'Find out how much to save each month to reach a target by a chosen date.',
    },
    {
      id: 'recurring' as FinanceTab,
      icon: Repeat,
      title: 'Recurring Investment',
      desc: 'See how regular contributions build wealth through compounding.',
    },
    {
      id: 'comparison' as FinanceTab,
      icon: BarChart2,
      title: 'Scenario Comparison',
      desc: 'Compare optimistic, expected and cautious outcomes side by side.',
    },
    {
      id: 'montecarlo' as FinanceTab,
      icon: Dices,
      title: 'Monte Carlo Simulation',
      desc: 'Run thousands of random trials to see the range of possible results.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#060c1d] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <SiteHeader currentSection="Finance & Business" />

      {/* Top Horizontal Navigation Bar (PDF Page 3) */}
      <div className="w-full bg-[#081226] border-b border-[#132244] px-4 sm:px-8 py-2 overflow-x-auto scrollbar-hide flex items-center gap-1 sm:gap-2">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'interest', label: 'Time Value of Money' },
          { id: 'loans', label: 'Loans and Credit' },
          { id: 'stocks', label: 'Stocks' },
          { id: 'bonds', label: 'Bonds' },
          { id: 'options', label: 'Options and Derivatives' },
          { id: 'portfolio', label: 'Portfolio and Risk' },
          { id: 'corporate', label: 'Corporate Finance' },
          { id: 'montecarlo', label: 'Simulators' },
        ].map((item) => {
          const isActive =
            activeTab === item.id || (activeTab !== 'dashboard' && item.id === 'interest' && activeTab === 'interest');
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'montecarlo') setActiveTab('montecarlo');
                else if (item.id === 'interest') setActiveTab('interest');
                else if (item.id === 'dashboard') setActiveTab('dashboard');
                else setActiveTab('dashboard');
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#0e1e3e]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Layout: Sidebar + Main Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-[#070f22] border-b md:border-b-0 md:border-r border-[#132244] p-4 sm:p-6 shrink-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold mb-3">
            FINANCE AND BUSINESS
          </div>
          <h2 className="text-xl font-serif text-white mb-4">Dashboard</h2>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1833]'
              }`}
            >
              Dashboard
            </button>
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === t.id
                    ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1833]'
                }`}
              >
                {t.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
          {activeTab === 'dashboard' ? (
            <div className="space-y-10">
              {/* Header Title */}
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold mb-1">
                  DASHBOARD
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif text-white font-normal mb-2">
                  Finance &amp; Business
                </h1>
                <p className="text-sm text-slate-300">
                  Calculate, simulate, compare, and plan financial outcomes.
                </p>
              </div>

              {/* 6 Grid Cards Matching PDF Page 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => setActiveTab(tool.id)}
                      className="group bg-[#0b162f]/80 hover:bg-[#0f2146] border border-[#162c57] hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center mb-3">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-serif font-normal text-slate-100 group-hover:text-white mb-1.5">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#132244] flex items-center text-xs text-blue-400 font-medium group-hover:text-blue-300">
                        Open tool <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3 Step Process Indicator */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-y border-[#132244] py-3 px-2">
                <div><span className="text-blue-400 font-mono mr-1.5">01</span> Choose a tool</div>
                <div><span className="text-blue-400 font-mono mr-1.5">02</span> Set your parameters</div>
                <div><span className="text-blue-400 font-mono mr-1.5">03</span> Compare the results</div>
              </div>

              {/* Live Preview Section matching PDF Page 3 */}
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    Finance / Dashboard / <span className="text-blue-300">Interest Calculator</span>
                  </div>
                  <h2 className="text-2xl font-serif text-white font-normal mb-1">
                    Interest Calculator
                  </h2>
                  <p className="text-xs text-slate-300">
                    Work out simple and compound interest for any amount, rate and period, and see how the balance grows over time.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('interest')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                  >
                    Start lesson
                  </button>
                  <button
                    onClick={() => setActiveTab('interest')}
                    className="px-4 py-2 bg-[#0d1c3a] hover:bg-[#122449] border border-[#1a3363] text-slate-200 text-xs font-medium rounded-lg transition-colors"
                  >
                    Launch simulator
                  </button>
                </div>

                {/* SIMULATION PREVIEW (SVG exponential curve) */}
                <div className="border border-[#162c57] rounded-xl p-4 bg-[#070f22]">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold mb-3">
                    SIMULATION PREVIEW
                  </div>
                  <div className="relative h-44 w-full flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 600 160" className="w-full h-full stroke-blue-400 fill-none" preserveAspectRatio="none">
                      <line x1="0" y1="140" x2="600" y2="140" stroke="#162c57" strokeWidth="1" />
                      <line x1="60" y1="0" x2="60" y2="160" stroke="#162c57" strokeWidth="1" strokeDasharray="4 4" />
                      {/* Exponential growth curve */}
                      <path
                        d="M 60 135 Q 280 125, 450 70 T 580 20"
                        strokeWidth="2.5"
                      />
                      <circle cx="580" cy="20" r="4.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
                    </svg>
                  </div>
                </div>

                {/* Key formula & Key parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#070f22] border border-[#14264c] rounded-xl">
                    <div className="text-xs text-slate-400 font-medium mb-1">Key formula</div>
                    <div className="font-mono text-sm text-blue-300 font-semibold">
                      FV = PV (1 + r/m)^(m · t)
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Computed FV: <span className="text-white font-mono font-semibold">${futureValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#070f22] border border-[#14264c] rounded-xl space-y-2">
                    <div className="text-xs text-slate-400 font-medium">Key parameters</div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Principal: ${principal.toLocaleString()}</span>
                      <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={principal}
                        onChange={(e) => setPrincipal(Number(e.target.value))}
                        className="w-28 accent-blue-500"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Interest Rate: {rate}%</span>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-28 accent-blue-500"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Time Period: {years} yrs</span>
                      <input
                        type="range"
                        min="1"
                        max="40"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-28 accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'interest' ? (
            <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
              <InterestCalculator />
            </div>
          ) : activeTab === 'investment' || activeTab === 'recurring' ? (
            <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
              <InvestmentSimulator />
            </div>
          ) : activeTab === 'goals' ? (
            <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
              <GoalCalculator />
            </div>
          ) : activeTab === 'comparison' ? (
            <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
              <ScenarioComparison />
            </div>
          ) : activeTab === 'montecarlo' ? (
            <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
              <MonteCarloSimulator />
            </div>
          ) : null}

          {/* 3 Summary Cards at Bottom (Matching PDF Page 4) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#132244]">
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Lessons</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Plain-language explanations of every concept, with worked examples.
              </p>
            </div>
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Simulator</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Change the parameters and watch the outcome update in real time.
              </p>
            </div>
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Case studies</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Apply the ideas to realistic decisions faced by savers and professionals.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
