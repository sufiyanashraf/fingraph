import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  LineChart,
  BookOpen,
  Calculator,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';

const CATEGORIES = [
  {
    id: 'study-maths',
    title: 'Study Maths',
    path: '/study-maths',
    icon: Calculator,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-500/15 border-blue-200/80 dark:border-blue-500/30',
    pills: [
      { label: 'Calculus', path: '/study-maths?cat=calculus' },
      { label: 'Algebra', path: '/study-maths?cat=algebra' },
      { label: 'Sequences & Series', path: '/study-maths?cat=sequences' },
      { label: 'Trigonometry', path: '/study-maths?cat=trig' },
      { label: 'Coordinate Geometry', path: '/study-maths?cat=geometry' }
    ]
  },
  {
    id: 'finance-business',
    title: 'Finance and Business',
    path: '/finance',
    icon: TrendingUp,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200/80 dark:border-emerald-500/30',
    pills: [
      { label: 'Compound Interest', path: '/finance' },
      { label: 'Investment Growth', path: '/finance' },
      { label: 'Monte Carlo', path: '/finance' },
      { label: 'Loan & EMI Analysis', path: '/finance' }
    ]
  },
  {
    id: 'visuals-exploring',
    title: 'Visuals and Exploring',
    path: '/visuals',
    icon: LineChart,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-500/15 border-amber-200/80 dark:border-amber-500/30',
    pills: [
      { label: 'Interactive Grapher', path: '/visuals' },
      { label: 'Root & Tangent Inspector', path: '/visuals' },
      { label: '2D / 3D Geometry Visuals', path: '/visuals' }
    ]
  },
  {
    id: 'learn-practice',
    title: 'Learn and Practice',
    path: '/learn',
    icon: BookOpen,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-500/15 border-purple-200/80 dark:border-purple-500/30',
    pills: [
      { label: 'Practice Problems', path: '/learn' },
      { label: 'Math Challenge Quiz', path: '/learn' },
      { label: 'Interactive Whiteboard', path: '/learn' }
    ]
  },
] as const;

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-slate-50 dark:bg-[#060c1d] text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-200">
      {/* Top Header with rotating logo and circular theme toggle */}
      <SiteHeader />

      {/* Main Content Area - Optimized single-screen layout on desktop */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex flex-col items-center justify-center">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-mono font-medium mb-1.5 shadow-xs">
          <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span>MATHEMATICS · FINANCE · VISUALIZATION</span>
        </div>

        {/* Hero Title with Girard Font */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-girard text-slate-900 dark:text-white tracking-tight text-center font-normal drop-shadow-xs leading-tight">
          FinGraph Lab
        </h1>

        {/* Middle Line Separator Tagline */}
        <div className="flex items-center justify-center gap-3 my-1.5 sm:my-2">
          <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-blue-500/40 dark:to-blue-400/40"></span>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-blue-700 dark:text-blue-300 font-medium font-sans">
            VISUALIZE · SIMULATE · CALCULATE
          </span>
          <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-blue-500/40 dark:to-blue-400/40"></span>
        </div>

        {/* Lead Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-center font-normal leading-relaxed mb-3 sm:mb-4">
          A refined educational mathematical workspace to study algebra, calculus, and progressions, model finance, and see equations come alive in real time.
        </p>

        {/* ─── FOUR MAIN SECTIONS (VERTICALLY ARRANGED, FIT ON ONE SCREEN) ─── */}
        <div className="w-full max-w-2xl space-y-2 sm:space-y-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="group bg-white dark:bg-[#0b162f]/90 hover:bg-slate-50 dark:hover:bg-[#0f1f42] border border-slate-200 dark:border-[#162c57] hover:border-blue-500/50 dark:hover:border-blue-400/50 rounded-xl p-3 sm:p-3.5 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
                onClick={() => navigate(cat.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(cat.path)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    {/* Colorful, Topic-Relevant Icon (No numbers) */}
                    <div className={`p-2.5 sm:p-3 rounded-xl border ${cat.iconBg} ${cat.iconColor} shrink-0 transition-transform duration-200 group-hover:scale-105`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="min-w-0">
                      {/* Main Heading with Girard Font */}
                      <h2 className="text-lg sm:text-xl font-girard font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors tracking-wide leading-tight">
                        {cat.title}
                      </h2>

                      {/* Clean Unboxed Topic Names (No cards, borders, or pills) */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        {cat.pills.map((pill, pIdx) => (
                          <span key={pIdx} className="inline-flex items-center gap-2">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(pill.path);
                              }}
                              className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-normal transition-colors cursor-pointer"
                            >
                              {pill.label}
                            </span>
                            {pIdx < cat.pills.length - 1 && (
                              <span className="text-slate-300 dark:text-slate-600 select-none text-[10px]">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Subtle chevron indicator */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-[#070f22] border border-slate-200 dark:border-[#14264c] flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-500/40 group-hover:translate-x-0.5 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Compact Clean Footer to maintain 1-screen fit on desktop */}
      <footer className="w-full border-t border-slate-200 dark:border-[#132244] py-2.5 sm:py-3 px-4 sm:px-8 bg-white dark:bg-[#060c1d] transition-colors">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="font-girard font-medium text-slate-700 dark:text-slate-300">© FinGraph Lab</span>
            <span>·</span>
            <span>Educational Mathematics & Financial Engineering</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <button onClick={() => navigate('/study-maths')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Study Maths</button>
            <button onClick={() => navigate('/finance')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Finance</button>
            <button onClick={() => navigate('/visuals')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Visuals</button>
            <button onClick={() => navigate('/learn')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Practice</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
