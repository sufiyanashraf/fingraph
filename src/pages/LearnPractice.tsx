import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import Learn from './Learn';
import MathChallenge from './MathChallenge';
import GoalCalculator from './GoalCalculator';
import ScenarioComparison from './ScenarioComparison';
import Whiteboard from './Whiteboard';
import { BookOpen, Gamepad2, Target, ArrowLeftRight, PenTool } from 'lucide-react';

type LearnTab = 'lessons' | 'challenge' | 'goals' | 'compare' | 'whiteboard';

export default function LearnPractice() {
  const [activeTab, setActiveTab] = useState<LearnTab>('lessons');

  const TABS = [
    { id: 'lessons' as LearnTab, label: 'Guided Lessons', icon: BookOpen, desc: 'Interactive guided modules covering mathematics and quantitative financial foundations.' },
    { id: 'challenge' as LearnTab, label: 'Math Challenge', icon: Gamepad2, desc: 'Practice calculations, time trials, and test your skills with instant feedback.' },
    { id: 'goals' as LearnTab, label: 'Financial & Study Goals', icon: Target, desc: 'Plan timelines, target milestones, and calculate required savings or progress.' },
    { id: 'compare' as LearnTab, label: 'Scenario Comparison', icon: ArrowLeftRight, desc: 'Model different parameters side by side to see optimal outcomes.' },
    { id: 'whiteboard' as LearnTab, label: 'Digital Whiteboard', icon: PenTool, desc: 'Freeform problem solving scratchpad and diagramming canvas.' },
  ];

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="min-h-screen bg-[#060c1d] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <SiteHeader currentSection="Learn & Practice" />

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
            LEARN AND PRACTICE
          </div>
          <h2 className="text-xl font-serif text-white mb-4">Practice Hub</h2>

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
            Learn and Practice / <span className="text-blue-300">{currentTab.label}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif text-white font-normal mb-2">
            {currentTab.label}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
            {currentTab.desc}
          </p>

          {/* Active Tool Renderer */}
          <div className="mb-10">
            {activeTab === 'lessons' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <Learn />
              </div>
            ) : activeTab === 'challenge' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <MathChallenge />
              </div>
            ) : activeTab === 'goals' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <GoalCalculator />
              </div>
            ) : activeTab === 'compare' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <ScenarioComparison />
              </div>
            ) : activeTab === 'whiteboard' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <Whiteboard />
              </div>
            ) : null}
          </div>

          {/* 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#132244]">
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Lessons</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step-by-step explanations written in clean, accessible language.
              </p>
            </div>
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Interactive practice</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Self-paced quizzes, challenges, and customizable goals.
              </p>
            </div>
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Whiteboard workspace</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Draft solutions and formulas visually with full freehand freedom.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
