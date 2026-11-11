import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Compass,
  Target,
  Activity
} from 'lucide-react';
import { ALGEBRA_TOPICS } from './algebra/algebraData';
import type { MajorTopic, SubtopicData } from './algebra/algebraData';
import { dispatchSolve } from './algebra/algebraSolvers';
import type { SolverOutput } from './algebra/algebraSolvers';
import {
  ParabolaVisualizer,
  LinearGraphVisualizer,
  SystemsIntersectionVisualizer,
  NumberLineVisualizer,
  ComplexPlaneVisualizer
} from './algebra/AlgebraVisualizers';
import AlgebraCameraModal from './algebra/AlgebraCameraModal';
import AlgebraMathKeyboard from './algebra/AlgebraMathKeyboard';

interface AlgebraLearningHubProps {
  defaultMajorId?: string;
  defaultSubtopicId?: string;
  onMajorChange?: (id: string) => void;
}

export default function AlgebraLearningHub({
  defaultMajorId,
  defaultSubtopicId,
  onMajorChange
}: AlgebraLearningHubProps = {}) {
  // Navigation State
  const [activeMajorId, setActiveMajorId] = useState<string>(defaultMajorId || 'basics');
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>(defaultSubtopicId || 'what_is_algebra');
  const [hoveredMajorId, setHoveredMajorId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync if external props change
  useEffect(() => {
    if (defaultMajorId && ALGEBRA_TOPICS.some((t) => t.id === defaultMajorId)) {
      setActiveMajorId(defaultMajorId);
      const major = ALGEBRA_TOPICS.find((t) => t.id === defaultMajorId);
      if (major && major.subtopics.length > 0) {
        if (defaultSubtopicId && major.subtopics.some((s) => s.id === defaultSubtopicId)) {
          setActiveSubtopicId(defaultSubtopicId);
        } else {
          setActiveSubtopicId(major.subtopics[0].id);
        }
      }
    }
  }, [defaultMajorId, defaultSubtopicId]);

  // Mobile Accordion state
  const [mobileExpandedMajor, setMobileExpandedMajor] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Active Major & Subtopic Resolvers
  const activeMajor = useMemo<MajorTopic>(() => {
    return ALGEBRA_TOPICS.find((t) => t.id === activeMajorId) || ALGEBRA_TOPICS[0];
  }, [activeMajorId]);

  const activeSubtopic = useMemo<SubtopicData>(() => {
    const found = activeMajor.subtopics.find((s) => s.id === activeSubtopicId);
    return found || activeMajor.subtopics[0];
  }, [activeMajor, activeSubtopicId]);

  // Equation Inputs State
  const [equation1, setEquation1] = useState<string>(activeSubtopic.defaultEquation);
  const [equation2, setEquation2] = useState<string>(activeSubtopic.defaultEquation2 || '2x - y = 5');
  const [activeInputTarget, setActiveInputTarget] = useState<'eq1' | 'eq2'>('eq1');

  // Solver Output State
  const [solverOutput, setSolverOutput] = useState<SolverOutput | null>(null);

  // Reset inputs & solve default problem whenever subtopic changes
  useEffect(() => {
    setEquation1(activeSubtopic.defaultEquation);
    setEquation2(activeSubtopic.defaultEquation2 || '2x - y = 5');
    // Pre-calculate solution for default problem
    const initialSol = dispatchSolve(
      activeSubtopic.toolType,
      activeSubtopic.defaultEquation,
      activeSubtopic.defaultEquation2
    );
    setSolverOutput(initialSol);
    setUserAnswers({});
  }, [activeSubtopic]);

  // Camera / Image Upload State
  const [uploadedImage, setUploadedImage] = useState<{ url: string; name: string } | null>(null);

  // Math Keyboard State
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

  // Practice Quiz State
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number | null }>({});

  // Handlers for Desktop Hover Dropdown
  const handleMouseEnterMajor = (topicId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMajorId(topicId);
  };

  const handleMouseLeaveMajor = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMajorId(null);
    }, 180);
  };

  const handleSelectSubtopic = (majorId: string, subtopicId: string) => {
    setActiveMajorId(majorId);
    setActiveSubtopicId(subtopicId);
    setHoveredMajorId(null);
    setIsSearchOpen(false);
    setSearchQuery('');
    setMobileExpandedMajor(null);
    onMajorChange?.(majorId);
  };

  // Keyboard Insert Handlers
  const handleKeyboardInsert = (char: string) => {
    if (activeInputTarget === 'eq2') {
      setEquation2((prev) => prev + char);
    } else {
      setEquation1((prev) => prev + char);
    }
  };

  const handleKeyboardDelete = () => {
    if (activeInputTarget === 'eq2') {
      setEquation2((prev) => prev.slice(0, -1));
    } else {
      setEquation1((prev) => prev.slice(0, -1));
    }
  };

  const handleKeyboardClear = () => {
    if (activeInputTarget === 'eq2') {
      setEquation2('');
    } else {
      setEquation1('');
    }
  };

  const handleRunSolve = () => {
    const result = dispatchSolve(activeSubtopic.toolType, equation1, equation2);
    setSolverOutput(result);
  };

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const matches: { major: MajorTopic; sub: SubtopicData }[] = [];
    ALGEBRA_TOPICS.forEach((major) => {
      major.subtopics.forEach((sub) => {
        if (
          sub.title.toLowerCase().includes(q) ||
          sub.shortDesc.toLowerCase().includes(q) ||
          sub.intro.toLowerCase().includes(q) ||
          major.title.toLowerCase().includes(q)
        ) {
          matches.push({ major, sub });
        }
      });
    });
    return matches.slice(0, 8);
  }, [searchQuery]);

  return (
    <div className="w-full text-slate-100 font-sans space-y-6">
      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b162f] via-[#091530] to-[#060c1d] border border-[#162c57] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-[11px] font-medium text-blue-300">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              COMPLETE ALGEBRA WORKSPACE · BEGINNER TO ADVANCED
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-normal text-white tracking-tight">
              Interactive Algebra Laboratory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real mathematical equations, live formula tools, step-by-step problem solvers, and interactive visualizers across 14 comprehensive algebra branches.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-[#081226] border border-[#14264c] p-2.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Topic</div>
              <div className="text-xs font-semibold text-blue-400">{activeMajor.title}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-serif font-bold">
              ∑
            </div>
          </div>
        </div>
      </div>

      {/* ─── SEARCH BAR ─── */}
      <div className="relative bg-[#081226] border border-[#14264c] rounded-xl p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-blue-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="Search any algebra topic (e.g. Zero Polynomial, Quadratic Formula, Synthetic Division, Parabola, Matrix Determinants)..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            Clear
          </button>
        )}

        {/* Search Results Dropdown Overlay */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#0b162f] border border-[#162c57] rounded-xl shadow-2xl p-3 z-50 max-h-80 overflow-y-auto space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 px-2 py-1 font-semibold">
              Matching Algebra Topics ({searchResults.length}):
            </div>
            {searchResults.map(({ major, sub }) => (
              <button
                key={sub.id}
                onClick={() => handleSelectSubtopic(major.id, sub.id)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-[#12244a] flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-blue-300 flex items-center gap-2">
                    <span>{sub.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                      {major.shortTitle}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{sub.shortDesc}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── 14 MAJOR TOPIC HOVER / DROPDOWN NAVIGATION BAR (DESKTOP) ─── */}
      <div className="relative">
        {/* Desktop Horizontal Bar with Hover Popovers */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-[#14264c]">
          {ALGEBRA_TOPICS.map((topic) => {
            const isActive = activeMajorId === topic.id;
            const isHovered = hoveredMajorId === topic.id;

            return (
              <div
                key={topic.id}
                className="relative"
                onMouseEnter={() => handleMouseEnterMajor(topic.id)}
                onMouseLeave={handleMouseLeaveMajor}
              >
                <button
                  onClick={() => {
                    setActiveMajorId(topic.id);
                    setActiveSubtopicId(topic.subtopics[0].id);
                    onMajorChange?.(topic.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : isHovered
                      ? 'bg-[#0e2148] text-white border border-blue-500/50'
                      : 'bg-[#081226] text-slate-300 hover:text-white hover:bg-[#0c1c3c] border border-[#14264c]'
                  }`}
                >
                  <span>{topic.shortTitle}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isHovered ? 'rotate-180 text-blue-300' : 'text-slate-400'}`}
                  />
                </button>

                {/* ─── DESKTOP HOVER DROPDOWN MENU ─── */}
                {isHovered && (
                  <div
                    className="absolute left-0 top-full pt-2 z-50 w-72 animate-in fade-in duration-150"
                    onMouseEnter={() => handleMouseEnterMajor(topic.id)}
                    onMouseLeave={handleMouseLeaveMajor}
                  >
                    <div className="bg-[#0b162f] border border-[#162c57] rounded-xl shadow-2xl p-2.5 backdrop-blur-md">
                      <div className="px-2 py-1.5 mb-1 border-b border-[#14264c] flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                          {topic.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/40 text-blue-300">
                          {topic.level}
                        </span>
                      </div>
                      <div className="space-y-1 max-h-72 overflow-y-auto">
                        {topic.subtopics.map((sub) => {
                          const isSubSelected = activeSubtopicId === sub.id && activeMajorId === topic.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleSelectSubtopic(topic.id, sub.id)}
                              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                                isSubSelected
                                  ? 'bg-blue-600/30 border border-blue-500/50 text-white'
                                  : 'text-slate-300 hover:text-white hover:bg-[#12244a]'
                              }`}
                            >
                              <span className="font-medium">{sub.title}</span>
                              <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sub.shortDesc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Tap-to-Expand Accordion */}
        <div className="lg:hidden space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Select Algebra Topic:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ALGEBRA_TOPICS.map((topic) => {
              const isActive = activeMajorId === topic.id;
              const isExpanded = mobileExpandedMajor === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    if (isExpanded) {
                      setMobileExpandedMajor(null);
                    } else {
                      setMobileExpandedMajor(topic.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-[#081226] text-slate-300 border-[#14264c]'
                  }`}
                >
                  <span>{topic.shortTitle}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Expanded Mobile Subtopics Drawer */}
          {mobileExpandedMajor && (
            <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-3 space-y-1.5">
              <div className="text-xs font-semibold text-blue-300 mb-2">
                Subtopics in {ALGEBRA_TOPICS.find((t) => t.id === mobileExpandedMajor)?.title}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {ALGEBRA_TOPICS.find((t) => t.id === mobileExpandedMajor)?.subtopics.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSubtopic(mobileExpandedMajor, sub.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors border ${
                      activeSubtopicId === sub.id && activeMajorId === mobileExpandedMajor
                        ? 'bg-blue-600/30 border-blue-500 text-white'
                        : 'bg-[#07122a] border-[#14264c] text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="font-medium">{sub.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{sub.shortDesc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── TOPIC BREADCRUMB & HEADER ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Algebra</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-slate-300 font-medium">{activeMajor.title}</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-blue-400 font-semibold">{activeSubtopic.title}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-white mt-1">
            {activeSubtopic.title}
          </h2>
          {/* 1. Compact Topic Introduction: 1-3 lines */}
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {activeSubtopic.intro}
          </p>
        </div>

        {activeSubtopic.badge && (
          <span className="self-start sm:self-center px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/50 text-xs font-semibold text-blue-300">
            {activeSubtopic.badge}
          </span>
        )}
      </div>

      {/* ─── 2. MATHEMATICAL ELEMENT SHOWCASE ─── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Mathematical Notation & Formula Showcase</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {activeSubtopic.mathShowcase.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#08142c] border border-blue-900/40 rounded-xl p-3.5 flex flex-col justify-center items-center text-center shadow-sm"
            >
              <div className="text-sm sm:text-base font-mono font-bold text-white tracking-wide">
                {item}
              </div>
            </div>
          ))}
        </div>

        {activeSubtopic.formulas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {activeSubtopic.formulas.map((form, fIdx) => (
              <div
                key={fIdx}
                className="bg-[#0b162f] border border-[#162c57] rounded-xl p-3 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded bg-blue-950 border border-blue-800 text-blue-300 flex items-center justify-center font-serif text-xs shrink-0 mt-0.5">
                  fx
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-300">{form.title}</div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">{form.formula}</div>
                  {form.note && <div className="text-[11px] text-slate-400 mt-0.5">{form.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 3. CLEAR EQUATION INPUT AREA ("TRY YOUR OWN PROBLEM") ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#14264c] pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-medium text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              Try Your Own Problem
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your algebraic equation or expression below, or upload a problem image.
            </p>
          </div>

          {/* Quick Examples Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase text-slate-400 font-semibold mr-1">Examples:</span>
            {activeSubtopic.examples.map((ex, exIdx) => (
              <button
                key={exIdx}
                type="button"
                onClick={() => {
                  if (ex.includes('&')) {
                    const [p1, p2] = ex.split('&');
                    setEquation1(p1.trim());
                    setEquation2(p2.trim());
                  } else {
                    setEquation1(ex);
                  }
                }}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0b1836] hover:bg-blue-600/40 text-blue-300 hover:text-white border border-[#1b315b] transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Input Rows & Camera Tool */}
        <div className="space-y-3">
          {/* Multiple inputs for Systems of Equations */}
          {activeSubtopic.toolType === 'systems_tool' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-blue-400">Equation 1:</label>
                <div className="relative flex items-center bg-[#050b18] border border-[#14264c] focus-within:border-blue-500 rounded-xl px-3 py-2 shadow-inner">
                  <input
                    type="text"
                    value={equation1}
                    onChange={(e) => setEquation1(e.target.value)}
                    onFocus={() => setActiveInputTarget('eq1')}
                    placeholder="e.g. x + y = 10"
                    className="w-full bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                  />
                  <AlgebraCameraModal
                    onImageSelected={(url, name) => setUploadedImage({ url, name })}
                    activeImage={uploadedImage}
                    onClearImage={() => setUploadedImage(null)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-400">Equation 2:</label>
                <div className="relative flex items-center bg-[#050b18] border border-[#14264c] focus-within:border-emerald-500 rounded-xl px-3 py-2 shadow-inner">
                  <input
                    type="text"
                    value={equation2}
                    onChange={(e) => setEquation2(e.target.value)}
                    onFocus={() => setActiveInputTarget('eq2')}
                    placeholder="e.g. 2x - y = 5"
                    className="w-full bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="relative flex items-center bg-[#050b18] border border-[#14264c] focus-within:border-blue-500 rounded-xl px-4 py-3 shadow-inner gap-2">
                <input
                  type="text"
                  value={equation1}
                  onChange={(e) => setEquation1(e.target.value)}
                  onFocus={() => setActiveInputTarget('eq1')}
                  placeholder={`Enter ${activeSubtopic.title.toLowerCase()}... (e.g. ${activeSubtopic.defaultEquation})`}
                  className="w-full bg-transparent text-sm sm:text-base font-mono text-white placeholder-slate-500 focus:outline-none"
                />

                {/* 4. Camera Button */}
                <AlgebraCameraModal
                  onImageSelected={(url, name) => setUploadedImage({ url, name })}
                  activeImage={uploadedImage}
                  onClearImage={() => setUploadedImage(null)}
                />
              </div>
            </div>
          )}

          {/* 5. Canvas-Quality Mathematical Keyboard */}
          <AlgebraMathKeyboard
            isOpen={isKeyboardOpen}
            onToggle={() => setIsKeyboardOpen((prev) => !prev)}
            onInsert={handleKeyboardInsert}
            onDelete={handleKeyboardDelete}
            onClear={handleKeyboardClear}
          />

          {/* 6. Topic-Specific Action Button */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRunSolve}
              className="px-6 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>{activeSubtopic.actionLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEquation1(activeSubtopic.defaultEquation);
                setEquation2(activeSubtopic.defaultEquation2 || '2x - y = 5');
                const res = dispatchSolve(
                  activeSubtopic.toolType,
                  activeSubtopic.defaultEquation,
                  activeSubtopic.defaultEquation2
                );
                setSolverOutput(res);
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0b1836] hover:bg-[#12244a] border border-[#1b315b] transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* ─── 7. TOPIC-SPECIFIC STEP-BY-STEP SOLUTION RESULTS ─── */}
        {solverOutput && (
          <div className="mt-6 bg-[#070f22] border border-[#14264c] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#14264c] pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">{solverOutput.title}</h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{solverOutput.summary}</span>
            </div>

            {/* Final Answer Banner */}
            {solverOutput.finalResult && (
              <div className="bg-[#0b1836] border border-blue-500/40 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Solution:</span>
                <span className="text-base sm:text-lg font-mono font-bold text-white tracking-wide">
                  {solverOutput.finalResult}
                </span>
              </div>
            )}

            {/* Step-by-Step Breakdown */}
            {solverOutput.steps.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mathematical Derivation Steps:
                </div>
                <div className="space-y-1.5 font-mono text-xs text-slate-300">
                  {solverOutput.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-[#050b18] border border-[#132448] p-2.5 rounded-lg flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            {solverOutput.details && Object.keys(solverOutput.details).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2 border-t border-[#132448]">
                {Object.entries(solverOutput.details).map(([key, val]) => (
                  <div key={key} className="bg-[#050b18] p-2 rounded border border-[#14264c]">
                    <div className="text-[10px] text-slate-400">{key}</div>
                    <div className="text-xs font-mono font-semibold text-white mt-0.5 truncate">
                      {String(val)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── 8. EXPLORE: TOPIC-SPECIFIC INTERACTIVE VISUALIZER ─── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Visualizer & Parameter Lab</span>
        </div>

        {activeMajor.id === 'quadratics' && (
          <ParabolaVisualizer initialA={1} initialB={-4} initialC={3} />
        )}

        {activeMajor.id === 'linear' && (
          <LinearGraphVisualizer initialM={2} initialB={-1} />
        )}

        {activeMajor.id === 'systems' && (
          <SystemsIntersectionVisualizer m1={1} b1={1} m2={-1} b2={5} />
        )}

        {activeMajor.id === 'inequalities' && (
          <NumberLineVisualizer bound={5} sign="<=" />
        )}

        {activeMajor.id === 'complex' && (
          <ComplexPlaneVisualizer a={3} b={4} />
        )}

        {/* Worked Example Card for Other Topics */}
        {activeMajor.id !== 'quadratics' &&
          activeMajor.id !== 'linear' &&
          activeMajor.id !== 'systems' &&
          activeMajor.id !== 'inequalities' &&
          activeMajor.id !== 'complex' && (
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Reference Worked Example</span>
              </h4>
              <div className="bg-[#050b18] border border-[#132448] p-3.5 rounded-lg font-mono text-xs space-y-2">
                <div className="text-blue-300 font-bold">{activeSubtopic.workedExample.problem}</div>
                <div className="space-y-1 text-slate-300">
                  {activeSubtopic.workedExample.steps.map((st, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-500">•</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
                <div className="text-emerald-400 font-bold pt-1 border-t border-[#132448]">
                  Final Answer: {activeSubtopic.workedExample.finalAnswer}
                </div>
              </div>
            </div>
          )}
      </div>

      {/* ─── 9. QUICK PRACTICE ─── */}
      {activeSubtopic.practice.length > 0 && (
        <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#14264c] pb-3">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-semibold text-white">Quick Practice Challenge</h3>
          </div>

          <div className="space-y-4">
            {activeSubtopic.practice.map((q, qIdx) => {
              const selected = userAnswers[qIdx];
              const isAnswered = selected !== undefined && selected !== null;
              const isCorrect = selected === q.correctIdx;

              return (
                <div key={qIdx} className="bg-[#050b18] border border-[#14264c] rounded-xl p-4 space-y-3">
                  <div className="text-xs sm:text-sm font-medium text-white">{q.question}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-[#091530] text-slate-300 hover:text-white border-[#162c57]';
                      if (isAnswered) {
                        if (optIdx === q.correctIdx) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-semibold';
                        } else if (optIdx === selected) {
                          btnStyle = 'bg-rose-950/80 border-rose-600 text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                          className={`w-full text-left p-2.5 rounded-lg text-xs font-mono border transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-800 text-rose-300'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold">{isCorrect ? 'Correct!' : 'Incorrect'}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{q.explanation}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 10. RELATED TOPICS ─── */}
      {activeSubtopic.relatedTopics.length > 0 && (
        <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Logically Related Topics
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSubtopic.relatedTopics.map((rel, rIdx) => (
              <button
                key={rIdx}
                type="button"
                onClick={() => handleSelectSubtopic(rel.majorId, rel.subtopicId)}
                className="px-3 py-1.5 rounded-lg bg-[#0b1836] hover:bg-blue-600 text-blue-300 hover:text-white border border-[#1b315b] hover:border-blue-400 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <span>{rel.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
