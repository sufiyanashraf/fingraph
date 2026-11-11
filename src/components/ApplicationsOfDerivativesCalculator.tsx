import { useState, useMemo, useRef } from 'react';
import * as math from 'mathjs';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Compass,
  Activity,
  Zap,
  Layers,
  Globe,
  Search,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Keyboard,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Target,
  Info
} from 'lucide-react';
import MathVirtualKeyboard from './MathVirtualKeyboard';

type TopicId =
  | 'graph_analysis'
  | 'inc_dec'
  | 'extrema'
  | 'optimization'
  | 'tangent_normal'
  | 'motion'
  | 'related_rates'
  | 'curve_sketching'
  | 'real_world';

type FlowMode = 'learn' | 'formula' | 'explore' | 'practice' | 'solve';

interface TopicMeta {
  id: TopicId;
  title: string;
  shortDesc: string;
  icon: any;
  color: string;
  tag: string;
}

const TOPICS: TopicMeta[] = [
  {
    id: 'graph_analysis',
    title: 'Graph Analysis',
    shortDesc: 'Inspect critical points, concavity, and stationary behavior of curves.',
    icon: LineChart,
    color: 'from-blue-600/30 to-sky-600/10 border-blue-500/40 text-blue-300',
    tag: 'Core Visualization',
  },
  {
    id: 'inc_dec',
    title: 'Increasing & Decreasing',
    shortDesc: 'Determine where f’(x) > 0 (climbing) or f’(x) < 0 (falling) with sign charts.',
    icon: TrendingUp,
    color: 'from-emerald-600/30 to-teal-600/10 border-emerald-500/40 text-emerald-300',
    tag: 'First Derivative',
  },
  {
    id: 'extrema',
    title: 'Maxima & Minima',
    shortDesc: 'Locate local peaks and valleys using 1st and 2nd derivative tests.',
    icon: Maximize2,
    color: 'from-purple-600/30 to-indigo-600/10 border-purple-500/40 text-purple-300',
    tag: 'Extrema Tests',
  },
  {
    id: 'optimization',
    title: 'Optimization Problems',
    shortDesc: 'Maximize profits, areas & volumes, or minimize costs and distances.',
    icon: Target,
    color: 'from-amber-600/30 to-yellow-600/10 border-amber-500/40 text-amber-300',
    tag: 'Real-world Modeling',
  },
  {
    id: 'tangent_normal',
    title: 'Tangent & Normal Lines',
    shortDesc: 'Calculate instantaneous slopes, tangent lines, and perpendicular normals.',
    icon: Compass,
    color: 'from-sky-600/30 to-cyan-600/10 border-sky-500/40 text-sky-300',
    tag: 'Linear Approximation',
  },
  {
    id: 'motion',
    title: 'Rate of Change & Motion',
    shortDesc: 'Kinematics: position s(t), velocity v(t) = s’(t), and acceleration a(t) = v’(t).',
    icon: Activity,
    color: 'from-rose-600/30 to-pink-600/10 border-rose-500/40 text-rose-300',
    tag: 'Physics & Kinematics',
  },
  {
    id: 'related_rates',
    title: 'Related Rates',
    shortDesc: 'Solve geometric rates changing with respect to time via chain rule.',
    icon: Zap,
    color: 'from-indigo-600/30 to-blue-600/10 border-indigo-500/40 text-indigo-300',
    tag: 'Implicit Rates',
  },
  {
    id: 'curve_sketching',
    title: 'Curve Analysis & Concavity',
    shortDesc: 'Comprehensive concavity testing (f’’(x)) and points of inflection.',
    icon: Layers,
    color: 'from-cyan-600/30 to-emerald-600/10 border-cyan-500/40 text-cyan-300',
    tag: 'Second Derivative',
  },
  {
    id: 'real_world',
    title: 'Real-World Applications',
    shortDesc: 'Economics marginal cost/revenue, biology growth rates, and engineering.',
    icon: Globe,
    color: 'from-teal-600/30 to-blue-600/10 border-teal-500/40 text-teal-300',
    tag: 'Interdisciplinary',
  },
];

interface PracticeItem {
  id: string;
  topicId: TopicId;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const PRACTICE_QUESTIONS: PracticeItem[] = [
  {
    id: 'p1',
    topicId: 'inc_dec',
    difficulty: 'Basic',
    question: 'Where is the function f(x) = x² - 4x + 3 strictly increasing?',
    options: ['(-∞, 2)', '(2, ∞)', '(-∞, 4)', '(4, ∞)'],
    correctIdx: 1,
    explanation: 'Differentiating yields f’(x) = 2x - 4. Setting f’(x) > 0 gives 2x - 4 > 0 ⇒ x > 2. Thus f(x) is increasing on (2, ∞).',
  },
  {
    id: 'p2',
    topicId: 'inc_dec',
    difficulty: 'Intermediate',
    question: 'On which interval is f(x) = x³ - 3x strictly decreasing?',
    options: ['(-1, 1)', '(-∞, -1)', '(1, ∞)', '(-∞, 0)'],
    correctIdx: 0,
    explanation: 'f’(x) = 3x² - 3 = 3(x - 1)(x + 1). Testing the sign between the roots -1 and 1 gives f’(0) = -3 < 0, so f(x) decreases on (-1, 1).',
  },
  {
    id: 'p3',
    topicId: 'extrema',
    difficulty: 'Basic',
    question: 'At what x-coordinate does f(x) = -x² + 6x - 5 attain its maximum value?',
    options: ['x = 6', 'x = 3', 'x = -3', 'x = 0'],
    correctIdx: 1,
    explanation: 'f’(x) = -2x + 6 = 0 ⇒ x = 3. Since f’’(x) = -2 < 0, the curve is concave down, making x = 3 a local maximum.',
  },
  {
    id: 'p4',
    topicId: 'extrema',
    difficulty: 'Intermediate',
    question: 'Using the Second Derivative Test, if f’(c) = 0 and f’’(c) = 5, what is the classification of x = c?',
    options: ['Local Maximum', 'Local Minimum', 'Point of Inflection', 'Inconclusive'],
    correctIdx: 1,
    explanation: 'When f’’(c) > 0, the curve is concave upward (∪), which guarantees that the stationary point is a local minimum.',
  },
  {
    id: 'p5',
    topicId: 'tangent_normal',
    difficulty: 'Basic',
    question: 'What is the slope of the tangent line to y = x³ at x = 2?',
    options: ['m = 6', 'm = 12', 'm = 8', 'm = 4'],
    correctIdx: 1,
    explanation: 'dy/dx = 3x². At x = 2, m = 3(2)² = 3(4) = 12.',
  },
  {
    id: 'p6',
    topicId: 'tangent_normal',
    difficulty: 'Intermediate',
    question: 'If the slope of the tangent line is m = 2, what is the slope of the normal line?',
    options: ['m = 2', 'm = -2', 'm = -1/2', 'm = 1/2'],
    correctIdx: 2,
    explanation: 'The normal line is perpendicular to the tangent line, so its slope is the negative reciprocal: m_normal = -1 / m_tangent = -1/2.',
  },
  {
    id: 'p7',
    topicId: 'optimization',
    difficulty: 'Intermediate',
    question: 'A farmer has 100 meters of fencing to enclose a rectangular area. What dimensions yield the maximum area?',
    options: ['20m × 30m', '25m × 25m', '10m × 40m', '15m × 35m'],
    correctIdx: 1,
    explanation: 'Perimeter P = 2x + 2y = 100 ⇒ y = 50 - x. Area A(x) = x(50 - x) = 50x - x². dA/dx = 50 - 2x = 0 ⇒ x = 25m, y = 25m.',
  },
  {
    id: 'p8',
    topicId: 'motion',
    difficulty: 'Basic',
    question: 'A particle moves with position s(t) = 3t² - 12t. At what time t is the particle momentarily at rest?',
    options: ['t = 0', 't = 2', 't = 4', 't = 6'],
    correctIdx: 1,
    explanation: 'At rest means velocity v(t) = 0. v(t) = ds/dt = 6t - 12. Setting 6t - 12 = 0 yields t = 2 seconds.',
  },
  {
    id: 'p9',
    topicId: 'related_rates',
    difficulty: 'Intermediate',
    question: 'The radius of a circle increases at 3 cm/s. At what rate is the area increasing when r = 10 cm?',
    options: ['30π cm²/s', '60π cm²/s', '100π cm²/s', '20π cm²/s'],
    correctIdx: 1,
    explanation: 'A = πr². Differentiating with respect to time: dA/dt = 2πr (dr/dt) = 2π(10)(3) = 60π cm²/s.',
  },
];

export default function ApplicationsOfDerivativesCalculator() {
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('inc_dec');
  const [flowMode, setFlowMode] = useState<FlowMode>('solve');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Inputs
  const [funcExpr, setFuncExpr] = useState<string>('x^3 - 3x^2 + 2');
  const [pointVal, setPointVal] = useState<string>('2');
  const [activeInput, setActiveInput] = useState<'expr' | 'point'>('expr');

  // UI States
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [graphZoom, setGraphZoom] = useState<number>(6);
  const [motionGraphMode, setMotionGraphMode] = useState<'position' | 'velocity' | 'accel'>('position');

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceFilter, setPracticeFilter] = useState<'All' | 'Basic' | 'Intermediate' | 'Advanced'>('All');

  const exprInputRef = useRef<HTMLInputElement>(null);
  const pointInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect variable
  const variable = useMemo(() => {
    if (selectedTopic === 'motion') return 't';
    const letters = funcExpr.match(/[a-zA-Z]/g) || [];
    const reserved = ['s', 'i', 'n', 'c', 'o', 't', 'a', 'l', 'g', 'e', 'x', 'p', 'r', 'q', 'b', 'd'];
    const candidates = letters.filter(
      (ch) => !reserved.includes(ch.toLowerCase()) || ['x', 't', 'y', 'u', 'z', 'w'].includes(ch.toLowerCase())
    );
    return candidates.length > 0 ? candidates[0] : 'x';
  }, [funcExpr, selectedTopic]);

  // Clean math expression
  const cleanExpr = useMemo(() => {
    return funcExpr
      .replace(/(\d+)([a-zA-Z])/g, '$1 * $2')
      .replace(/\)\(/g, ') * (')
      .replace(/(\d+)\(/g, '$1 * (')
      .replace(/\)([a-zA-Z])/g, ') * $1')
      .trim();
  }, [funcExpr]);

  // Calculus Evaluation Engine
  const analysis = useMemo(() => {
    if (!cleanExpr) {
      return {
        success: false,
        fPrime: '',
        fDoublePrime: '',
        criticalPoints: [] as number[],
        intervals: [] as { start: number; end: number; label: string; testX: number; sign: number; behavior: string }[],
        extrema: [] as { x: number; y: number; type: 'Local Maximum' | 'Local Minimum' | 'Inconclusive / Inflection' }[],
        tangentSlope: 0,
        normalSlope: 0,
        tangentEq: '',
        normalEq: '',
        fa: 0,
        error: 'Please enter a valid mathematical expression.',
      };
    }

    try {
      const parsed = math.parse(cleanExpr);
      const d1 = math.derivative(parsed, variable);
      const d2 = math.derivative(d1, variable);

      const fPrimeStr = math.simplify(d1).toString();
      const fDoublePrimeStr = math.simplify(d2).toString();

      const compiledF = math.compile(cleanExpr);
      const compiledD1 = math.compile(fPrimeStr);
      const compiledD2 = math.compile(fDoublePrimeStr);

      // Find critical points by sampling and secant/bisection method across [-15, 15]
      const criticalPoints: number[] = [];
      const span = 15;
      const step = 0.2;
      let prevVal: number | null = null;
      let prevX = -span;

      for (let x = -span; x <= span; x += step) {
        try {
          const val = Number(compiledD1.evaluate({ [variable]: x }));
          if (prevVal !== null && !isNaN(val) && !isNaN(prevVal)) {
            // Sign change indicates a root of f'(x)
            if (prevVal * val <= 0) {
              // Simple bisection to refine root
              let low = prevX;
              let high = x;
              for (let iter = 0; iter < 12; iter++) {
                const mid = (low + high) / 2;
                const midVal = Number(compiledD1.evaluate({ [variable]: mid }));
                if (midVal * prevVal <= 0) high = mid;
                else low = mid;
              }
              const root = Number(((low + high) / 2).toFixed(3));
              // Avoid duplicates
              if (!criticalPoints.some((r) => Math.abs(r - root) < 0.05)) {
                criticalPoints.push(root);
              }
            }
          }
          prevVal = val;
          prevX = x;
        } catch {
          // ignore domain singularities
        }
      }

      criticalPoints.sort((a, b) => a - b);

      // Intervals of Increase / Decrease
      const boundaries = [-Infinity, ...criticalPoints, Infinity];
      const intervals: {
        start: number;
        end: number;
        label: string;
        testX: number;
        sign: number;
        behavior: string;
      }[] = [];

      for (let i = 0; i < boundaries.length - 1; i++) {
        const start = boundaries[i];
        const end = boundaries[i + 1];
        let testX = 0;
        if (start === -Infinity && end === Infinity) testX = 0;
        else if (start === -Infinity) testX = end - 1;
        else if (end === Infinity) testX = start + 1;
        else testX = (start + end) / 2;

        let sign = 1;
        try {
          const evalSign = Number(compiledD1.evaluate({ [variable]: testX }));
          sign = evalSign >= 0 ? 1 : -1;
        } catch {
          sign = 1;
        }

        const startStr = start === -Infinity ? '-∞' : start.toString();
        const endStr = end === Infinity ? '∞' : end.toString();

        intervals.push({
          start,
          end,
          label: `(${startStr}, ${endStr})`,
          testX: Number(testX.toFixed(2)),
          sign,
          behavior: sign > 0 ? 'Increasing ↗' : 'Decreasing ↘',
        });
      }

      // Classify Extrema using Second Derivative Test
      const extrema: {
        x: number;
        y: number;
        type: 'Local Maximum' | 'Local Minimum' | 'Inconclusive / Inflection';
      }[] = [];

      for (const cp of criticalPoints) {
        try {
          const yVal = Number(compiledF.evaluate({ [variable]: cp }));
          const d2Val = Number(compiledD2.evaluate({ [variable]: cp }));

          let type: 'Local Maximum' | 'Local Minimum' | 'Inconclusive / Inflection' = 'Inconclusive / Inflection';
          if (d2Val < -1e-5) type = 'Local Maximum';
          else if (d2Val > 1e-5) type = 'Local Minimum';

          extrema.push({
            x: cp,
            y: Number(yVal.toFixed(3)),
            type,
          });
        } catch {
          // ignore
        }
      }

      // Point Evaluation for Tangent & Normal
      let aVal = 2;
      if (pointVal.trim() === 'pi' || pointVal.trim() === 'π') aVal = Math.PI;
      else if (!isNaN(parseFloat(pointVal))) aVal = parseFloat(pointVal);

      let fa = 0;
      let tangentSlope = 0;
      let normalSlope = 0;
      let tangentEq = '';
      let normalEq = '';

      try {
        fa = Number(Number(compiledF.evaluate({ [variable]: aVal })).toFixed(3));
        tangentSlope = Number(Number(compiledD1.evaluate({ [variable]: aVal })).toFixed(3));

        // Tangent: y - fa = m(x - a) => y = mx + (fa - m*a)
        const tIntercept = Number((fa - tangentSlope * aVal).toFixed(3));
        tangentEq = `y = ${tangentSlope}${variable}`;
        if (tIntercept > 0) tangentEq += ` + ${tIntercept}`;
        else if (tIntercept < 0) tangentEq += ` - ${Math.abs(tIntercept)}`;

        // Normal slope: -1/m
        if (Math.abs(tangentSlope) > 1e-5) {
          normalSlope = Number((-1 / tangentSlope).toFixed(3));
          const nIntercept = Number((fa - normalSlope * aVal).toFixed(3));
          normalEq = `y = ${normalSlope}${variable}`;
          if (nIntercept > 0) normalEq += ` + ${nIntercept}`;
          else if (nIntercept < 0) normalEq += ` - ${Math.abs(nIntercept)}`;
        } else {
          normalSlope = Infinity;
          normalEq = `${variable} = ${aVal} (Vertical Line)`;
        }
      } catch {
        // ignore
      }

      return {
        success: true,
        fPrime: fPrimeStr,
        fDoublePrime: fDoublePrimeStr,
        criticalPoints,
        intervals,
        extrema,
        tangentSlope,
        normalSlope,
        tangentEq,
        normalEq,
        fa,
        aVal,
        error: undefined,
      };
    } catch (e: any) {
      return {
        success: false,
        fPrime: '',
        fDoublePrime: '',
        criticalPoints: [] as number[],
        intervals: [] as { start: number; end: number; label: string; testX: number; sign: number; behavior: string }[],
        extrema: [] as { x: number; y: number; type: 'Local Maximum' | 'Local Minimum' | 'Inconclusive / Inflection' }[],
        tangentSlope: 0,
        normalSlope: 0,
        tangentEq: '',
        normalEq: '',
        fa: 0,
        error: e.message || 'Error processing calculus derivation.',
      };
    }
  }, [cleanExpr, variable, pointVal]);

  // SVG Graph Coordinate Generation
  const graphData = useMemo(() => {
    if (!analysis.success) return null;

    try {
      const center = analysis.aVal ?? 0;
      const minX = center - graphZoom;
      const maxX = center + graphZoom;
      const step = (maxX - minX) / 120;

      const compiledF = math.compile(cleanExpr);
      const compiledD1 = math.compile(analysis.fPrime || '0');
      const compiledD2 = math.compile(analysis.fDoublePrime || '0');

      const fPoints: { x: number; y: number }[] = [];
      const tangentPoints: { x: number; y: number }[] = [];
      const normalPoints: { x: number; y: number }[] = [];

      let minY = Infinity;
      let maxY = -Infinity;

      for (let x = minX; x <= maxX; x += step) {
        try {
          let y = 0;
          if (selectedTopic === 'motion') {
            if (motionGraphMode === 'position') y = Number(compiledF.evaluate({ [variable]: x }));
            else if (motionGraphMode === 'velocity') y = Number(compiledD1.evaluate({ [variable]: x }));
            else y = Number(compiledD2.evaluate({ [variable]: x }));
          } else {
            y = Number(compiledF.evaluate({ [variable]: x }));
          }

          if (isFinite(y) && !isNaN(y)) {
            const clampedY = Math.max(-60, Math.min(60, y));
            fPoints.push({ x, y: clampedY });
            if (clampedY < minY) minY = clampedY;
            if (clampedY > maxY) maxY = clampedY;
          }
        } catch {
          // ignore domain discontinuity
        }
      }

      // Generate Tangent & Normal lines if in tangent_normal mode or point provided
      if (selectedTopic === 'tangent_normal' || selectedTopic === 'graph_analysis') {
        const mT = analysis.tangentSlope;
        const bT = analysis.fa - mT * (analysis.aVal ?? 0);
        const mN = analysis.normalSlope;
        const bN = analysis.fa - mN * (analysis.aVal ?? 0);

        for (let x = minX; x <= maxX; x += step * 4) {
          const yT = mT * x + bT;
          if (isFinite(yT)) {
            tangentPoints.push({ x, y: Math.max(-60, Math.min(60, yT)) });
          }
          if (isFinite(mN)) {
            const yN = mN * x + bN;
            if (isFinite(yN)) {
              normalPoints.push({ x, y: Math.max(-60, Math.min(60, yN)) });
            }
          }
        }
      }

      if (minY === Infinity || maxY === -Infinity) {
        minY = -10;
        maxY = 10;
      }
      if (maxY - minY < 2) {
        maxY += 2;
        minY -= 2;
      }

      const padding = (maxY - minY) * 0.15;
      minY -= padding;
      maxY += padding;

      return { minX, maxX, minY, maxY, fPoints, tangentPoints, normalPoints };
    } catch {
      return null;
    }
  }, [cleanExpr, variable, analysis, graphZoom, selectedTopic, motionGraphMode]);

  // Virtual Keyboard Insertions
  const handleKeyboardInsert = (char: string) => {
    if (activeInput === 'expr') {
      setFuncExpr((prev) => prev + char);
      if (exprInputRef.current) exprInputRef.current.focus();
    } else {
      setPointVal((prev) => prev + char);
      if (pointInputRef.current) pointInputRef.current.focus();
    }
  };

  const handleKeyboardDelete = () => {
    if (activeInput === 'expr') {
      setFuncExpr((prev) => prev.slice(0, -1));
    } else {
      setPointVal((prev) => prev.slice(0, -1));
    }
  };

  const handleKeyboardClear = () => {
    if (activeInput === 'expr') setFuncExpr('');
    else setPointVal('');
  };

  // Filtered topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return TOPICS;
    const q = searchQuery.toLowerCase();
    return TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Current active topic metadata
  const currentTopicMeta = TOPICS.find((t) => t.id === selectedTopic) || TOPICS[0];

  // Filtered practice questions
  const filteredPractice = useMemo(() => {
    let list = PRACTICE_QUESTIONS.filter((p) => p.topicId === selectedTopic);
    if (list.length === 0) list = PRACTICE_QUESTIONS; // fallback to general questions if specific topic list is empty
    if (practiceFilter !== 'All') {
      list = list.filter((p) => p.difficulty === practiceFilter);
    }
    return list;
  }, [selectedTopic, practiceFilter]);

  return (
    <div className="space-y-6">
      {/* ─── HEADER & SEARCH DASHBOARD ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#14264c]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Calculus · Applications of Derivatives
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Interactive Problem Laboratory
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1.5 font-bold tracking-tight">
            APPLICATIONS OF DERIVATIVES
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Explore how derivatives are used to study change, graphs, motion, optimization, and real-world problems.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. Maxima, Motion)..."
            className="w-full bg-[#071024] border border-[#162c57] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* ─── 1. EASY-TO-ACCESS TOPIC DASHBOARD (CLICKABLE CARDS) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {filteredTopics.map((top) => {
          const isSelected = selectedTopic === top.id;
          const IconComp = top.icon;

          return (
            <button
              key={top.id}
              type="button"
              onClick={() => setSelectedTopic(top.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#10244e] to-[#0c1a38] border-blue-400 shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                  : 'bg-[#081226] hover:bg-[#0d1e40] border-[#132244] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg bg-[#060c1d] border border-[#14264c] ${
                    isSelected ? 'text-blue-400 border-blue-500/50' : 'text-slate-400'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                )}
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 leading-tight">
                  {top.tag}
                </div>
                <div
                  className={`text-xs font-semibold mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {top.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── 2. 5-STEP WORKSPACE NAV: LEARN | FORMULA | EXPLORE | PRACTICE | SOLVE ─── */}
      <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2 pl-3">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs font-serif text-white font-semibold">
            {currentTopicMeta.title}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            — {currentTopicMeta.shortDesc}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#060c1d] p-1 rounded-xl border border-[#14264c]">
          {[
            { id: 'learn', label: 'Learn' },
            { id: 'formula', label: 'Formula' },
            { id: 'explore', label: 'Explore (Graph)' },
            { id: 'practice', label: 'Practice' },
            { id: 'solve', label: 'Solve Your Own' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setFlowMode(mode.id as FlowMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                flowMode === mode.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1833]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── DYNAMIC CONTENT AREA BASED ON 5-STEP WORKSPACE ─── */}

      {/* ═══ MODE A: LEARN ═══ */}
      {flowMode === 'learn' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-serif text-white font-bold">
              Conceptual Guide: {currentTopicMeta.title}
            </h3>
          </div>

          {selectedTopic === 'inc_dec' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                In differential calculus, the sign of the first derivative f’(x) dictates whether the graph is
                climbing upward, sloping downward, or momentarily level:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#081226] border border-emerald-900/50">
                  <div className="font-bold text-emerald-400 text-sm mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> f’(x) &gt; 0: Increasing
                  </div>
                  <p className="text-xs text-slate-400">
                    The slope of the tangent is positive. As you move from left to right, the curve climbs.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#081226] border border-rose-900/50">
                  <div className="font-bold text-rose-400 text-sm mb-1 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4" /> f’(x) &lt; 0: Decreasing
                  </div>
                  <p className="text-xs text-slate-400">
                    The slope of the tangent is negative. As you move from left to right, the curve descends.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#081226] border border-amber-900/50">
                  <div className="font-bold text-amber-400 text-sm mb-1 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> f’(x) = 0: Stationary Point
                  </div>
                  <p className="text-xs text-slate-400">
                    The tangent is completely horizontal. A potential peak, valley, or saddle terrace point.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTopic === 'extrema' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Extreme values (local and absolute extrema) occur at <strong>critical points</strong> where f’(x) = 0 or f’(x) is undefined.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                  <h4 className="font-bold text-purple-300 text-sm mb-1">First Derivative Test</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Check the sign change across critical number c:
                    <br />• If f’(x) changes from (+) to (-): <strong>Local Maximum (Peak ∩)</strong>
                    <br />• If f’(x) changes from (-) to (+): <strong>Local Minimum (Trough ∪)</strong>
                    <br />• If sign does not change: Neither (Inflection Terrace).
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                  <h4 className="font-bold text-purple-300 text-sm mb-1">Second Derivative Test</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluate f’’(c) directly at stationary points:
                    <br />• If f’’(c) &lt; 0: Concave down ∩ ⇒ <strong>Local Maximum</strong>
                    <br />• If f’’(c) &gt; 0: Concave up ∪ ⇒ <strong>Local Minimum</strong>
                    <br />• If f’’(c) = 0: Inconclusive (fallback to 1st derivative test).
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTopic === 'optimization' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Optimization is the science of finding the best possible outcome (maximum profit, minimum waste, lowest cost, optimal dimension).
              </p>
              <div className="p-4 rounded-xl bg-[#081226] border border-amber-900/40">
                <h4 className="font-bold text-amber-300 text-sm mb-2">The Standard 7-Step Optimization Algorithm:</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                  <li><strong>Understand the Problem:</strong> Identify given constraints and goal quantity.</li>
                  <li><strong>Define Variables:</strong> Assign x, y, and draw a sketch if geometric.</li>
                  <li><strong>Formulate Objective Function:</strong> Express the quantity to optimize P(x).</li>
                  <li><strong>Eliminate Secondary Variables:</strong> Use constraint equations (e.g. perimeter = 100).</li>
                  <li><strong>Differentiate:</strong> Compute P’(x) = dP/dx.</li>
                  <li><strong>Locate Critical Points:</strong> Solve P’(x) = 0 for plausible domain roots.</li>
                  <li><strong>Verify Extremum:</strong> Confirm via 2nd derivative P’’(x) &lt; 0 (max) or &gt; 0 (min).</li>
                </ol>
              </div>
            </div>
          )}

          {selectedTopic === 'tangent_normal' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                A <strong>tangent line</strong> touches the curve at a single point (x₀, y₀) with matching slope m = f’(x₀).
                A <strong>normal line</strong> is perpendicular to the tangent at that exact same coordinate.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#081226] border border-amber-900/40">
                  <span className="text-amber-400 font-bold block mb-1">Tangent Line Formula</span>
                  <div className="text-white text-sm bg-[#050a18] p-2 rounded border border-[#14264c]">
                    y - f(x₀) = f’(x₀) · (x - x₀)
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#081226] border border-indigo-900/40">
                  <span className="text-indigo-400 font-bold block mb-1">Normal Line Formula</span>
                  <div className="text-white text-sm bg-[#050a18] p-2 rounded border border-[#14264c]">
                    y - f(x₀) = -1 / f’(x₀) · (x - x₀)
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTopic === 'motion' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Differentiation is the cornerstone of Newtonian kinematics:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#081226] rounded-xl border border-[#14264c]">
                  <span className="text-slate-400 text-[10px] uppercase block">Position</span>
                  <div className="text-white font-bold text-sm">s(t)</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Location along path at time t.</p>
                </div>
                <div className="p-3 bg-[#081226] rounded-xl border border-sky-900/50">
                  <span className="text-sky-400 text-[10px] uppercase block">Velocity</span>
                  <div className="text-sky-300 font-bold text-sm">v(t) = s’(t)</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Instantaneous rate of change of position.</p>
                </div>
                <div className="p-3 bg-[#081226] rounded-xl border border-rose-900/50">
                  <span className="text-rose-400 text-[10px] uppercase block">Acceleration</span>
                  <div className="text-rose-300 font-bold text-sm">a(t) = v’(t) = s’’(t)</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Instantaneous rate of change of velocity.</p>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for others */}
          {!['inc_dec', 'extrema', 'optimization', 'tangent_normal', 'motion'].includes(selectedTopic) && (
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] text-xs text-slate-300">
              <p className="leading-relaxed">
                Learn how differential calculus transforms complex non-linear problems into solvable linear rates and critical conditions.
                Click on <strong>Solve Your Own</strong> or <strong>Explore</strong> to experiment with real mathematical functions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══ MODE B: FORMULA LIBRARY ═══ */}
      {flowMode === 'formula' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-serif text-white font-bold">
              Applications Formula Library
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                title: 'Increasing Function Condition',
                formula: "f'(x) > 0 \\quad \\forall x \\in (a, b)",
                explanation: 'A function strictly rises when its instantaneous slope is positive.',
                usage: 'When determining intervals of positive growth.',
              },
              {
                title: 'Decreasing Function Condition',
                formula: "f'(x) < 0 \\quad \\forall x \\in (a, b)",
                explanation: 'A function strictly descends when its instantaneous slope is negative.',
                usage: 'When determining intervals of decline or depreciation.',
              },
              {
                title: 'Critical Point Definition',
                formula: "f'(c) = 0 \\quad \\text{or} \\quad f'(c) \\text{ is undefined}",
                explanation: 'Candidates for local maxima, minima, or horizontal inflection points.',
                usage: 'Primary step in optimization and curve sketching.',
              },
              {
                title: 'Second Derivative Concavity',
                formula: "f''(x) > 0 \\implies \\text{Concave Up } \\cup, \\quad f''(x) < 0 \\implies \\text{Concave Down } \\cap",
                explanation: 'Second derivative measures the bending curvature of the function.',
                usage: 'Testing whether critical points are peaks or troughs.',
              },
              {
                title: 'Point of Inflection',
                formula: "f''(c) = 0 \\quad \\text{with sign change of } f''(x)",
                explanation: 'The point where the curve changes from concave up to concave down (or vice versa).',
                usage: 'Transition from accelerating to decelerating returns.',
              },
              {
                title: 'Tangent Line Equation',
                formula: "y - f(x_0) = f'(x_0)(x - x_0)",
                explanation: 'Point-slope equation using derivative as the instantaneous slope.',
                usage: 'Linear approximation and physics projectile angles.',
              },
              {
                title: 'Normal Line Equation',
                formula: "y - f(x_0) = -\\frac{1}{f'(x_0)}(x - x_0) \\quad (f'(x_0) \\ne 0)",
                explanation: 'Perpendicular line through the point of tangency.',
                usage: 'Optical reflection, refraction, and surface normal vectors.',
              },
              {
                title: 'Kinematics Relationship',
                formula: "v(t) = \\frac{ds}{dt}, \\quad a(t) = \\frac{dv}{dt} = \\frac{d^2s}{dt^2}",
                explanation: 'Connecting position s, velocity v, and acceleration a across time.',
                usage: 'Trajectory modeling, braking distances, rocket launches.',
              },
              {
                title: 'Related Rates Chain Rule',
                formula: "\\frac{d}{dt}[V] = \\frac{dV}{dr} \\cdot \\frac{dr}{dt}",
                explanation: 'Relates rates of interdependent variables evolving with respect to time.',
                usage: 'Expanding balloons, filling water tanks, sliding ladders.',
              },
            ].map((fItem) => (
              <div key={fItem.title} className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
                <h4 className="text-xs font-bold text-white tracking-wide">{fItem.title}</h4>
                <div className="p-2.5 rounded-lg bg-[#050a18] border border-[#14264c] font-mono text-xs text-sky-300 text-center">
                  {fItem.formula}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{fItem.explanation}</p>
                <div className="pt-2 border-t border-[#132244] text-[11px] text-amber-400">
                  <strong>When to use:</strong> {fItem.usage}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ MODE C: EXPLORE (GRAPH VISUALIZER) ═══ */}
      {flowMode === 'explore' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif text-white font-bold flex items-center gap-2">
                <LineChart className="w-5 h-5 text-sky-400" />
                <span>Visual Explorer: {currentTopicMeta.title}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Interactive plot of f({variable}) = {funcExpr} and its associated derivative properties.
              </p>
            </div>

            {/* Motion Graph Selector if in Motion topic */}
            {selectedTopic === 'motion' && (
              <div className="flex items-center gap-1 bg-[#081226] p-1 rounded-lg border border-[#14264c]">
                <button
                  type="button"
                  onClick={() => setMotionGraphMode('position')}
                  className={`px-2.5 py-1 rounded text-xs ${
                    motionGraphMode === 'position' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Position s(t)
                </button>
                <button
                  type="button"
                  onClick={() => setMotionGraphMode('velocity')}
                  className={`px-2.5 py-1 rounded text-xs ${
                    motionGraphMode === 'velocity' ? 'bg-sky-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Velocity v(t)
                </button>
                <button
                  type="button"
                  onClick={() => setMotionGraphMode('accel')}
                  className={`px-2.5 py-1 rounded text-xs ${
                    motionGraphMode === 'accel' ? 'bg-rose-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Acceleration a(t)
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setGraphZoom((z) => Math.max(2, z - 2))}
                className="p-1.5 rounded bg-[#081226] text-slate-300 border border-[#14264c]"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGraphZoom((z) => Math.min(24, z + 2))}
                className="p-1.5 rounded bg-[#081226] text-slate-300 border border-[#14264c]"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGraphZoom(6)}
                className="p-1.5 rounded bg-[#081226] text-slate-300 border border-[#14264c]"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full h-72 sm:h-80 bg-[#060c1d] rounded-xl border border-[#132244] overflow-hidden relative flex items-center justify-center select-none">
            {graphData && graphData.fPoints.length > 1 ? (
              <svg viewBox="0 0 700 320" className="w-full h-full">
                {/* Axes */}
                <line x1={0} y1={160} x2={700} y2={160} stroke="#172b52" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1={350} y1={0} x2={350} y2={320} stroke="#172b52" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Main Curve */}
                <path
                  d={graphData.fPoints
                    .map((pt, idx) => {
                      const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                      const sy = 320 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 320;
                      return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke={motionGraphMode === 'accel' ? '#f43f5e' : '#38bdf8'}
                  strokeWidth="2.5"
                />

                {/* Tangent line */}
                {graphData.tangentPoints.length > 1 && (
                  <path
                    d={graphData.tangentPoints
                      .map((pt, idx) => {
                        const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                        const sy = 320 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 320;
                        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                  />
                )}

                {/* Normal line */}
                {graphData.normalPoints.length > 1 && (
                  <path
                    d={graphData.normalPoints
                      .map((pt, idx) => {
                        const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                        const sy = 320 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 320;
                        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.8"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Extrema Points Markers */}
                {analysis.extrema.map((ex, idx) => {
                  const sx = ((ex.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                  const sy = 320 - ((ex.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 320;

                  return (
                    <g key={idx}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={6}
                        fill={ex.type === 'Local Maximum' ? '#ec4899' : '#10b981'}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                      <text
                        x={sx + 8}
                        y={sy - 8}
                        fill="#f1f5f9"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {ex.type === 'Local Maximum' ? 'Max' : 'Min'} ({ex.x}, {ex.y})
                      </text>
                    </g>
                  );
                })}

                {/* Tangent Point of Contact */}
                {analysis.aVal !== undefined && (
                  <circle
                    cx={((analysis.aVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                    cy={320 - ((analysis.fa - graphData.minY) / (graphData.maxY - graphData.minY)) * 320}
                    r={5}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )}
              </svg>
            ) : (
              <div className="text-xs text-slate-500 font-mono">Generating coordinate plot...</div>
            )}
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-sky-400 rounded-full" />
                <span className="font-mono text-slate-300">f({variable}) = {funcExpr}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Local Minimum</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <span>Local Maximum</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-400 border-b border-dashed border-amber-400" />
                <span>Tangent</span>
              </div>
            </div>
            <div>X bounds: [{graphData?.minX.toFixed(1)}, {graphData?.maxX.toFixed(1)}]</div>
          </div>
        </div>
      )}

      {/* ═══ MODE D: PRACTICE ═══ */}
      {flowMode === 'practice' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span>Practice Laboratory: {currentTopicMeta.title}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Solve step-by-step calculus questions and test your conceptual mastery.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-[#081226] p-1 rounded-xl border border-[#14264c]">
              {(['All', 'Basic', 'Intermediate', 'Advanced'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setPracticeFilter(tier)}
                  className={`px-2.5 py-1 rounded text-xs ${
                    practiceFilter === tier ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Grid */}
          <div className="space-y-4">
            {filteredPractice.map((item, qIdx) => {
              const selectedAnswer = practiceAnswers[item.id];
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = isAnswered && selectedAnswer === item.correctIdx;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#081226] border border-[#14264c] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Problem {qIdx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        item.difficulty === 'Basic'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : 'bg-purple-950/70 text-purple-300 border border-purple-800/60'
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-white">{item.question}</p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {item.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedAnswer === optIdx;
                      let btnStyle = 'bg-[#060c1d] hover:bg-[#0c1833] border-[#14264c] text-slate-300';

                      if (isAnswered) {
                        if (optIdx === item.correctIdx) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => setPracticeAnswers((prev) => ({ ...prev, [item.id]: optIdx }))}
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && optIdx === item.correctIdx && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                          {isAnswered && isOptionSelected && optIdx !== item.correctIdx && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback */}
                  {isAnswered && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        isCorrect
                          ? 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-200'
                          : 'bg-amber-950/40 border border-amber-800/50 text-amber-200'
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        <span>{isCorrect ? 'Correct! Well Done.' : 'Solution Breakdown:'}</span>
                      </div>
                      <p className="leading-relaxed">{item.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ MODE E: SOLVE YOUR OWN (MAIN INTERACTIVE WORKSPACE) ═══ */}
      {flowMode === 'solve' && (
        <div className="space-y-6">
          {/* Main Input Control Center */}
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
              {/* Function Input */}
              <div className="lg:col-span-6 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Function f({variable}) =</span>
                  <span className="text-[11px] text-blue-400 font-normal">
                    {selectedTopic === 'motion' ? 'e.g. 3t^2 - 12t + 5' : 'e.g. x^3 - 3x^2 + 2, x*exp(-x)'}
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-blue-400 font-serif italic text-base pointer-events-none select-none">
                    f({variable}) =
                  </span>
                  <input
                    ref={exprInputRef}
                    type="text"
                    value={funcExpr}
                    onChange={(e) => setFuncExpr(e.target.value)}
                    onFocus={() => setActiveInput('expr')}
                    placeholder="x^3 - 3x^2 + 2"
                    className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-20 pr-4 py-2.5 text-sm sm:text-base font-mono text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Point Input */}
              <div className="lg:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Target Point {variable} =
                </label>
                <input
                  ref={pointInputRef}
                  type="text"
                  value={pointVal}
                  onChange={(e) => setPointVal(e.target.value)}
                  onFocus={() => setActiveInput('point')}
                  placeholder="2"
                  className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm sm:text-base font-mono text-white placeholder-slate-600 outline-none text-center"
                />
              </div>

              {/* Action Toolbar */}
              <div className="lg:col-span-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyboard((prev) => !prev)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    showKeyboard
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-[#09152e] hover:bg-[#10234a] border-[#1d3c75] text-slate-200'
                  }`}
                  title="Toggle Math Keyboard"
                >
                  <Keyboard className="w-4 h-4 text-blue-400" />
                  <span>Keyboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlowMode('explore')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#09152e] hover:bg-[#10234a] border border-[#1d3c75] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="View Graph Explorer"
                >
                  <LineChart className="w-4 h-4 text-sky-400" />
                  <span>Graph</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#09152e] hover:bg-[#10234a] border border-[#1d3c75] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="Upload problem image"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Picture</span>
                </button>
              </div>
            </div>

            {/* Quick Presets row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#132244] text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 text-[11px] mr-1">Load Preset:</span>
                {[
                  { label: 'Cubic Extrema', f: 'x^3 - 3x^2 + 2', p: '2' },
                  { label: 'Parabola Vertex', f: '-x^2 + 4x + 5', p: '2' },
                  { label: 'Quartic Double-Well', f: 'x^4 - 4x^2 + 1', p: '1' },
                  { label: 'Trig Oscillations', f: 'sin(2x) + cos(x)', p: '1.57' },
                ].map((pr) => (
                  <button
                    key={pr.label}
                    type="button"
                    onClick={() => {
                      setFuncExpr(pr.f);
                      setPointVal(pr.p);
                    }}
                    className="px-2 py-0.5 rounded bg-[#071126] hover:bg-[#0e2148] text-slate-300 border border-[#14264c] text-[10px]"
                  >
                    {pr.label}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-400">
                1st Derivative: <span className="font-mono text-sky-300 font-bold">{analysis.fPrime || '...'}</span>
              </div>
            </div>
          </div>

          {/* ─── DERIVED RESULTS WORKSPACE ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Step-by-Step Mathematical Derivations */}
            <div className="lg:col-span-7 space-y-5">
              {/* Step 1: Derivative Derivatives */}
              <div className="p-5 rounded-2xl bg-[#0b162f] border border-[#162c57] space-y-3 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">
                    STEP 1 — FIRST & SECOND DERIVATIVES
                  </span>
                </div>
                <div className="space-y-2 font-mono text-xs sm:text-sm">
                  <div className="p-3 bg-[#081226] rounded-xl border border-[#14264c] flex items-center justify-between">
                    <span className="text-slate-400">f'({variable}) =</span>
                    <span className="text-sky-300 font-bold">{analysis.fPrime}</span>
                  </div>
                  <div className="p-3 bg-[#081226] rounded-xl border border-[#14264c] flex items-center justify-between">
                    <span className="text-slate-400">f''({variable}) =</span>
                    <span className="text-indigo-300 font-bold">{analysis.fDoublePrime}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  f'({variable}) tells us instantaneous slope and direction; f''({variable}) dictates curvature and concavity.
                </p>
              </div>

              {/* Step 2: Critical Points */}
              <div className="p-5 rounded-2xl bg-[#0b162f] border border-[#162c57] space-y-3 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 font-semibold">
                    STEP 2 — CRITICAL POINTS (f'({variable}) = 0)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/70 text-purple-300 border border-purple-800/60">
                    {analysis.criticalPoints.length} Found
                  </span>
                </div>
                {analysis.criticalPoints.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.criticalPoints.map((cp) => (
                      <span
                        key={cp}
                        className="px-3 py-1.5 rounded-xl font-mono text-xs bg-[#081226] border border-purple-800/60 text-purple-200"
                      >
                        {variable} = {cp}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No real roots found for f'({variable}) = 0 in this range. The function is monotonic.
                  </p>
                )}
              </div>

              {/* Step 3: Sign Chart & Intervals of Increase/Decrease */}
              <div className="p-5 rounded-2xl bg-[#0b162f] border border-[#162c57] space-y-3 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                    STEP 3 — SIGN CHART & INTERVALS
                  </span>
                </div>
                <div className="space-y-2">
                  {analysis.intervals.map((iv, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        iv.sign > 0
                          ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{iv.label}</span>
                        <span className="text-[11px] text-slate-400">
                          (test at {variable} = {iv.testX})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold">
                        <span>{iv.sign > 0 ? 'f’ > 0 ⊕' : 'f’ < 0 ⊖'}</span>
                        <span className="text-[11px]">{iv.behavior}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Extrema & Tangent / Normal Summaries */}
            <div className="lg:col-span-5 space-y-5">
              {/* Local Maxima & Minima Classification */}
              <div className="p-5 rounded-2xl bg-[#0b162f] border border-[#162c57] space-y-3 shadow-lg">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold block">
                  EXTREMA CLASSIFICATION
                </span>

                {analysis.extrema.length > 0 ? (
                  <div className="space-y-2">
                    {analysis.extrema.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#081226] rounded-xl border border-[#14264c] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span
                            className={`font-semibold text-xs block ${
                              ex.type === 'Local Maximum' ? 'text-pink-400' : 'text-emerald-400'
                            }`}
                          >
                            {ex.type}
                          </span>
                          <span className="font-mono text-slate-300">
                            Coordinate: ({ex.x}, {ex.y})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-[#060c1d] px-2 py-1 rounded">
                          x = {ex.x}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No local extrema detected.</p>
                )}
              </div>

              {/* Tangent & Normal Equations at point */}
              <div className="p-5 rounded-2xl bg-[#0b162f] border border-[#162c57] space-y-3 shadow-lg">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-sky-400 font-semibold block">
                  TANGENT & NORMAL AT {variable} = {analysis.aVal}
                </span>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-[#081226] rounded-xl border border-amber-900/40">
                    <span className="text-amber-400 text-[10px] uppercase tracking-wider block mb-1">
                      Tangent Line (m = {analysis.tangentSlope})
                    </span>
                    <div className="text-white font-bold">{analysis.tangentEq}</div>
                  </div>

                  <div className="p-3 bg-[#081226] rounded-xl border border-purple-900/40">
                    <span className="text-purple-400 text-[10px] uppercase tracking-wider block mb-1">
                      Normal Line (m = {analysis.normalSlope})
                    </span>
                    <div className="text-white font-bold">{analysis.normalEq}</div>
                  </div>
                </div>
              </div>

              {/* Optimization Quick Assistant */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1e40] to-[#081328] border border-blue-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Optimization Summary
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The maximum or minimum response is achieved at the critical boundary{' '}
                  <strong className="text-white">
                    {analysis.extrema[0] ? `x = ${analysis.extrema[0].x}` : 'at domain bounds'}
                  </strong>
                  , producing an optimal value of{' '}
                  <strong className="text-amber-300">
                    {analysis.extrema[0] ? `f = ${analysis.extrema[0].y}` : 'N/A'}
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PICTURE / PRESET UPLOAD MODAL ─── */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b162f] border border-[#162c57] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Upload / Select Problem</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Upload an image of an Applications of Derivatives problem or choose a classic curriculum problem:
            </p>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#1c3970] hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-all bg-[#081226]/50">
              <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-300 font-medium">Upload Textbook Photo</div>
              <div className="text-[10px] text-slate-500">Detects equations, intervals, and rates</div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Standard Applied Problems:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  {
                    title: 'Fencing Maximum Area',
                    f: '50x - x^2',
                    p: '25',
                    topic: 'optimization' as TopicId,
                  },
                  {
                    title: 'Sliding Ladder Rate',
                    f: 'sqrt(100 - x^2)',
                    p: '6',
                    topic: 'related_rates' as TopicId,
                  },
                  {
                    title: 'Rocket Velocity & Accel',
                    f: '-4.9t^2 + 100t',
                    p: '10.2',
                    topic: 'motion' as TopicId,
                  },
                  {
                    title: 'Profit Optimization',
                    f: '-2x^2 + 120x - 500',
                    p: '30',
                    topic: 'optimization' as TopicId,
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      setFuncExpr(item.f);
                      setPointVal(item.p);
                      setSelectedTopic(item.topic);
                      setShowImageModal(false);
                      setFlowMode('solve');
                    }}
                    className="p-2.5 rounded-lg bg-[#081226] hover:bg-[#10234a] border border-[#14264c] text-left transition-all"
                  >
                    <span className="text-blue-300 font-semibold block text-[11px]">{item.title}</span>
                    <span className="font-mono text-slate-300 text-[10px] truncate block">{item.f}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIRTUAL MATH KEYBOARD PORTAL ─── */}
      <MathVirtualKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInsert={handleKeyboardInsert}
        onDelete={handleKeyboardDelete}
        onClear={handleKeyboardClear}
      />
    </div>
  );
}
