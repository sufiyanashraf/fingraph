import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import GraphingCalculator from './GraphingCalculator';
import ScenarioComparison from './ScenarioComparison';
import { LineChart, BarChart2 } from 'lucide-react';

type VisualTab = 'graphing' | 'scenarios' | 'models';

export default function VisualsExploring() {
  const [activeTab, setActiveTab] = useState<VisualTab>('graphing');

  const TABS = [
    { id: 'graphing' as VisualTab, label: 'Interactive Function Plotter', icon: LineChart, desc: 'Plot algebraic, trigonometric, and parametric equations in real time.' },
    { id: 'scenarios' as VisualTab, label: 'Scenario Comparison', icon: BarChart2, desc: 'Side-by-side comparative modeling across diverse mathematical and financial conditions.' },
  ];

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="min-h-screen bg-[#060c1d] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <SiteHeader currentSection="Visuals & Exploring" />

      {/* Top Horizontal Navigation Bar */}
      <div className="w-full bg-[#081226] border-b border-[#132244] px-4 sm:px-8 py-2 overflow-x-auto scrollbar-hide flex items-center gap-1 sm:gap-2">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#0e1e3e]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-[#070f22] border-b md:border-b-0 md:border-r border-[#132244] p-4 sm:p-6 shrink-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold mb-3">
            VISUALS AND EXPLORING
          </div>
          <h2 className="text-xl font-serif text-white mb-4">Visual Studio</h2>

          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1833]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 mb-2">
            Visuals and Exploring / <span className="text-blue-300">{currentTab.label}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif text-white font-normal mb-2">
            {currentTab.label}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
            {currentTab.desc}
          </p>

          {/* Active Tool Renderer */}
          <div className="mb-10">
            {activeTab === 'graphing' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <GraphingCalculator />
              </div>
            ) : activeTab === 'scenarios' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <ScenarioComparison />
              </div>
            ) : null}
          </div>

          {/* 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#132244]">
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Interactive graphics</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Render curves, functions, and models with real-time domain and range navigation.
              </p>
            </div>
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Parameter exploration</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Adjust variables and see changes immediately reflected on the canvas.
              </p>
            </div>
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Comparative analysis</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Overlay multiple curves or scenarios to detect intersections and inflection points.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
