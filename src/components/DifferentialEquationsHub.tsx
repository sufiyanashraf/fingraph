import { useState, useMemo, useRef } from 'react';
import {
  Compass,
  LineChart,
  BookOpen,
  CheckCircle2,
  XCircle,
  Keyboard,
  Sparkles,
  Sliders,
  Search,
  Activity,
  Layers,
  FileText,
  Target,
  Info
} from 'lucide-react';
import MathVirtualKeyboard from './MathVirtualKeyboard';

type MainTab =
  | 'overview'
  | 'terminology'
  | 'first_order'
  | 'second_order'
  | 'slope_fields'
  | 'simulations'
  | 'solver'
  | 'numerical'
  | 'decision_tree'
  | 'quiz'
  | 'formulas';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the order of the differential equation: (d²y/dx²)³ + 4(dy/dx)⁴ + y = 0?',
    options: ['Order 3', 'Order 2', 'Order 4', 'Order 1'],
    correctIdx: 1,
    explanation: 'Order is determined by the highest-order derivative present, which is d²y/dx² (second derivative), so the order is 2.',
  },
  {
    id: 'q2',
    question: 'Which method is appropriate for solving dy/dx = x² · y?',
    options: ['Separation of Variables', 'Bernoulli Equation', 'Exact Equation', 'Second Order Characteristic'],
    correctIdx: 0,
    explanation: 'We can rewrite as (1/y) dy = x² dx. Since variables x and y are factorable and separable, Separation of Variables applies.',
  },
  {
    id: 'q3',
    question: 'For the linear differential equation dy/dx + 3y = 6, what is the Integrating Factor (I.F.)?',
    options: ['e^(3x)', '3x', 'e^(6x)', 'ln(3x)'],
    correctIdx: 0,
    explanation: 'Here P(x) = 3. The integrating factor is I.F. = e^(∫ P(x)dx) = e^(∫ 3 dx) = e^(3x).',
  },
  {
    id: 'q4',
    question: 'For y’’ + 9y = 0, the characteristic equation is r² + 9 = 0. What is the general solution?',
    options: ['y = C₁ e^(3x) + C₂ e^(-3x)', 'y = C₁ cos(3x) + C₂ sin(3x)', 'y = (C₁ + C₂x) e^(3x)', 'y = 9x + C'],
    correctIdx: 1,
    explanation: 'The roots are complex conjugate r = ±3i (α = 0, β = 3). The solution is y = e^(0x)[C₁ cos(3x) + C₂ sin(3x)].',
  },
  {
    id: 'q5',
    question: 'In an Initial Value Problem (IVP), what is the purpose of the initial condition y(x₀) = y₀?',
    options: ['To determine the degree of the equation', 'To eliminate the arbitrary constant C and select one specific trajectory', 'To prove the equation is linear', 'To approximate the derivative numerically'],
    correctIdx: 1,
    explanation: 'The general solution represents an infinite family of curves (+ C). The initial condition picks the single curve passing through (x₀, y₀).',
  },
];

export default function DifferentialEquationsHub() {
  const [activeTab, setActiveTab] = useState<MainTab>('overview');

  // Interactive Derivation Demo Slider (Section 2)
  const [sliderX, setSliderX] = useState<number>(1.5);

  // Slope Field State (Section 12)
  const [slopeEq, setSlopeEq] = useState<'x+y' | 'y-x' | 'x-y' | 'logistic' | '-x/y'>('x-y');
  const [trajStart, setTrajStart] = useState<{ x: number; y: number }>({ x: -2, y: 1 });

  // Simulation Lab State (Section 14 & 24)
  const [simType, setSimType] = useState<'population' | 'cooling' | 'harmonic'>('population');
  const [growthK, setGrowthK] = useState<number>(0.8);
  const [carryingCap, setCarryingCap] = useState<number>(100);
  const [initialPop, setInitialPop] = useState<number>(15);

  // Solver State (Section 15)
  const [solverInput, setSolverInput] = useState<string>('dy/dx = 2x');
  const [solverY0, setSolverY0] = useState<string>('3');
  const [activeSolverField, setActiveSolverField] = useState<'eq' | 'y0'>('eq');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);

  // Euler Numerical Lab State (Section 16)
  const [eulerH, setEulerH] = useState<number>(0.2);

  // Quiz State (Section 21)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const eqInputRef = useRef<HTMLInputElement>(null);
  const y0InputRef = useRef<HTMLInputElement>(null);

  // Derivative Tangent values for Section 2: y = x^2, dy/dx = 2x
  const demoSlope = 2 * sliderX;
  const demoY = sliderX * sliderX;

  // Slope Field grid vectors [-3..3]
  const slopeFieldGrid = useMemo(() => {
    const points: { x: number; y: number; slope: number; angle: number }[] = [];
    for (let x = -3; x <= 3; x += 0.6) {
      for (let y = -3; y <= 3; y += 0.6) {
        let slope = 0;
        if (slopeEq === 'x+y') slope = x + y;
        else if (slopeEq === 'y-x') slope = y - x;
        else if (slopeEq === 'x-y') slope = x - y;
        else if (slopeEq === 'logistic') slope = 0.5 * y * (1 - y / 2.5);
        else if (slopeEq === '-x/y') slope = Math.abs(y) > 0.05 ? -x / y : 10;

        const angle = Math.atan(Math.max(-8, Math.min(8, slope)));
        points.push({ x, y, slope, angle });
      }
    }
    return points;
  }, [slopeEq]);

  // Euler trajectory calculation for slope field starting from trajStart
  const slopeFieldTrajectory = useMemo(() => {
    const path: { x: number; y: number }[] = [{ x: trajStart.x, y: trajStart.y }];
    const dt = 0.08;
    let currX = trajStart.x;
    let currY = trajStart.y;

    for (let i = 0; i < 90; i++) {
      let slope = 0;
      if (slopeEq === 'x+y') slope = currX + currY;
      else if (slopeEq === 'y-x') slope = currY - currX;
      else if (slopeEq === 'x-y') slope = currX - currY;
      else if (slopeEq === 'logistic') slope = 0.5 * currY * (1 - currY / 2.5);
      else if (slopeEq === '-x/y') slope = Math.abs(currY) > 0.05 ? -currX / currY : 10;

      currX += dt;
      currY += slope * dt;
      if (Math.abs(currY) > 8 || Math.abs(currX) > 6) break;
      path.push({ x: Number(currX.toFixed(3)), y: Number(currY.toFixed(3)) });
    }
    return path;
  }, [slopeEq, trajStart]);

  // Simulation Lab Curves
  const simPoints = useMemo(() => {
    const pts: { t: number; val: number }[] = [];
    for (let t = 0; t <= 10; t += 0.2) {
      let val = 0;
      if (simType === 'population') {
        // Logistic curve: P(t) = K / (1 + ((K - P0)/P0)*e^(-rt))
        const p0 = initialPop;
        const k = carryingCap;
        const r = growthK;
        val = k / (1 + ((k - p0) / p0) * Math.exp(-r * t));
      } else if (simType === 'cooling') {
        // T(t) = Ts + (T0 - Ts)*e^(-kt), Ts = 20, T0 = 90
        val = 20 + 70 * Math.exp(-growthK * t);
      } else {
        // Harmonic: y(t) = A * cos(omega * t), omega = 1.5
        val = 50 + 40 * Math.cos(growthK * 3 * t);
      }
      pts.push({ t, val });
    }
    return pts;
  }, [simType, growthK, carryingCap, initialPop]);

  // Solver dynamic analysis
  const solverAnalysis = useMemo(() => {
    const raw = solverInput.trim().replace(/\s+/g, '');
    let order = 1;
    let classification = 'First-Order ODE';
    let method = 'Separation of Variables / Direct Integration';
    let generalSol = '';
    let particularSol = '';
    let steps: string[] = [];

    const y0Num = parseFloat(solverY0);
    const hasY0 = !isNaN(y0Num);

    if (raw.includes("y''") || raw.includes('d^2y') || raw.includes('d2y')) {
      order = 2;
      classification = 'Second-Order Linear Homogeneous ODE';
      method = 'Characteristic Auxiliary Equation ar² + br + c = 0';
      generalSol = 'y(x) = C₁ cos(x) + C₂ sin(x)';
      particularSol = hasY0 ? `y(x) = ${y0Num} cos(x)` : '';
      steps = [
        'Step 1: Write characteristic equation: r² + 1 = 0',
        'Step 2: Solve auxiliary roots: r = ± i (complex conjugate with α = 0, β = 1)',
        'Step 3: General solution: y(x) = C₁ cos(x) + C₂ sin(x)',
        hasY0 ? `Step 4: Apply condition y(0) = ${y0Num} ⇒ C₁ = ${y0Num}` : '',
      ].filter(Boolean);
    } else if (raw.includes('dy/dx=y') || raw.includes('dy/dx-y=0')) {
      generalSol = 'y(x) = C · eˣ';
      particularSol = hasY0 ? `y(x) = ${y0Num} · eˣ` : '';
      steps = [
        'Step 1: Separate variables: (1/y) dy = dx',
        'Step 2: Integrate both sides: ∫ (1/y) dy = ∫ dx ⇒ ln|y| = x + C₁',
        'Step 3: Exponentiate: y(x) = e^(x + C₁) = C · eˣ',
        hasY0 ? `Step 4: Substitute y(0) = ${y0Num} ⇒ C = ${y0Num} ⇒ y(x) = ${y0Num}eˣ` : '',
      ].filter(Boolean);
    } else if (raw.includes('dy/dx+y=x')) {
      classification = 'First-Order Linear ODE';
      method = 'Integrating Factor (I.F. = e^∫P dx)';
      generalSol = 'y(x) = x - 1 + C · e^(-x)';
      particularSol = hasY0 ? `y(x) = x - 1 + (${y0Num + 1}) · e^(-x)` : '';
      steps = [
        'Step 1: Identify standard form dy/dx + P(x)y = Q(x) with P(x) = 1, Q(x) = x',
        'Step 2: Compute Integrating Factor: I.F. = e^(∫ 1 dx) = eˣ',
        'Step 3: Multiply equation: d/dx [y · eˣ] = x · eˣ',
        'Step 4: Integrate right-hand side via parts: y · eˣ = eˣ(x - 1) + C',
        'Step 5: Solve for y: y(x) = x - 1 + C · e^(-x)',
        hasY0 ? `Step 6: Apply y(0) = ${y0Num} ⇒ ${y0Num} = -1 + C ⇒ C = ${y0Num + 1}` : '',
      ].filter(Boolean);
    } else {
      // Default polynomial direct integration: e.g. dy/dx = 2x
      generalSol = 'y(x) = x² + C';
      particularSol = hasY0 ? `y(x) = x² + ${y0Num}` : '';
      steps = [
        'Step 1: Separate differential: dy = 2x dx',
        'Step 2: Integrate both sides: ∫ dy = ∫ 2x dx',
        'Step 3: Obtain general solution: y(x) = x² + C',
        hasY0 ? `Step 4: Substitute condition y(0) = ${y0Num} ⇒ ${y0Num} = 0 + C ⇒ C = ${y0Num}` : '',
        hasY0 ? `Step 5: Specific trajectory: y(x) = x² + ${y0Num}` : '',
      ].filter(Boolean);
    }

    return { order, classification, method, generalSol, particularSol, steps };
  }, [solverInput, solverY0]);

  // Euler approximation points for dy/dx = y with y(0) = 1 on [0, 2]
  const eulerData = useMemo(() => {
    const exactPts: { x: number; y: number }[] = [];
    const approxPts: { x: number; y: number }[] = [{ x: 0, y: 1 }];

    for (let x = 0; x <= 2.05; x += 0.05) {
      exactPts.push({ x, y: Math.exp(x) });
    }

    let curX = 0;
    let curY = 1;
    const h = eulerH;
    while (curX < 2) {
      const slope = curY; // dy/dx = y
      curY += h * slope;
      curX += h;
      approxPts.push({ x: Number(curX.toFixed(2)), y: Number(curY.toFixed(3)) });
    }

    return { exactPts, approxPts };
  }, [eulerH]);

  // Virtual keyboard insertions
  const handleKeyboardInsert = (char: string) => {
    if (activeSolverField === 'eq') {
      setSolverInput((prev) => prev + char);
      if (eqInputRef.current) eqInputRef.current.focus();
    } else {
      setSolverY0((prev) => prev + char);
      if (y0InputRef.current) y0InputRef.current.focus();
    }
  };

  const handleKeyboardDelete = () => {
    if (activeSolverField === 'eq') setSolverInput((prev) => prev.slice(0, -1));
    else setSolverY0((prev) => prev.slice(0, -1));
  };

  const handleKeyboardClear = () => {
    if (activeSolverField === 'eq') setSolverInput('');
    else setSolverY0('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ─── HERO SECTION (MODERN SCIENTIFIC DASHBOARD) ─── */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#0c1c3f] via-[#081329] to-[#050a18] border border-[#162c57] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Advanced Calculus Hub
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              ODEs & PDEs
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Differential Equations
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Understand how change creates patterns—and learn how mathematics describes the dynamic world through equations involving rates of change.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <span>🚀 Start Learning</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('slope_fields')}
              className="px-4 py-2 rounded-xl bg-[#0b1b3b] hover:bg-[#122852] text-slate-200 border border-[#1d3c75] font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <span>📊 Slope Fields Lab</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('solver')}
              className="px-4 py-2 rounded-xl bg-[#0b1b3b] hover:bg-[#122852] text-slate-200 border border-[#1d3c75] font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <span>🧮 Interactive Solver</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className="px-4 py-2 rounded-xl bg-[#0b1b3b] hover:bg-[#122852] text-slate-200 border border-[#1d3c75] font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <span>🎯 Practice Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── QUICK NAVIGATION TABS BAR ─── */}
      <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 overflow-x-auto scrollbar-hide flex items-center gap-1.5">
        {[
          { id: 'overview', label: '1. What is an ODE?' },
          { id: 'terminology', label: '2. Terminology' },
          { id: 'first_order', label: '3. First-Order Methods' },
          { id: 'second_order', label: '4. Second-Order ODEs' },
          { id: 'slope_fields', label: '5. Slope Fields 📊' },
          { id: 'simulations', label: '6. Real-World Lab 🌍' },
          { id: 'solver', label: '7. Solver 🧮' },
          { id: 'numerical', label: '8. Euler’s Method' },
          { id: 'decision_tree', label: '9. Decision Tree 🌲' },
          { id: 'quiz', label: '10. Quiz 🎯' },
          { id: 'formulas', label: '11. Formulas 📚' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as MainTab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#0c1833]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ 1. WHAT IS A DIFFERENTIAL EQUATION & DERIVATIVES INTERACTION ═══ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-5 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>What is a Differential Equation?</span>
            </h2>

            <div className="p-4 rounded-xl bg-[#081226] border border-blue-900/50 text-sm text-slate-200 leading-relaxed space-y-2">
              <p>
                A <strong>differential equation</strong> is any mathematical equation containing an unknown function along with one or more of its derivatives.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 bg-[#060c1d] rounded-lg border border-[#14264c]">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Ordinary Algebraic Equation</span>
                  <div className="text-white font-bold text-sm mt-0.5">x + 3 = 7 ⇒ x = 4</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Asks: "What is the static numerical value of x?"</p>
                </div>
                <div className="p-3 bg-[#060c1d] rounded-lg border border-blue-800/60">
                  <span className="text-blue-400 block text-[10px] uppercase font-sans">Differential Equation</span>
                  <div className="text-sky-300 font-bold text-sm mt-0.5">dy/dx = 3x ⇒ y = 1.5x² + C</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Asks: "How does the output change over time/space?"</p>
                </div>
              </div>
            </div>

            {/* Interactive Derivative Slider Demo */}
            <div className="p-5 rounded-xl bg-[#081226] border border-[#14264c] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Derivative Foundation: Instantaneous Tangent Slope</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Curve: y = x² · Derivative: dy/dx = 2x. Drag the slider to see how the derivative dictates the tangent line.
                  </p>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#060c1d] text-amber-300 border border-[#14264c]">
                  x = {sliderX.toFixed(2)} · dy/dx = {demoSlope.toFixed(2)}
                </span>
              </div>

              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={sliderX}
                onChange={(e) => setSliderX(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />

              <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                <div className="p-2 bg-[#060c1d] rounded-lg border border-[#14264c]">
                  <span className="text-slate-400 block text-[10px]">Position (x, y)</span>
                  <span className="text-white font-bold">({sliderX.toFixed(2)}, {demoY.toFixed(2)})</span>
                </div>
                <div className="p-2 bg-[#060c1d] rounded-lg border border-[#14264c]">
                  <span className="text-slate-400 block text-[10px]">Instantaneous Slope (dy/dx)</span>
                  <span className="text-amber-400 font-bold">{demoSlope.toFixed(2)}</span>
                </div>
                <div className="p-2 bg-[#060c1d] rounded-lg border border-[#14264c]">
                  <span className="text-slate-400 block text-[10px]">Tangent Equation</span>
                  <span className="text-sky-300 font-bold">y - {demoY.toFixed(1)} = {demoSlope.toFixed(1)}(x - {sliderX.toFixed(1)})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 2. TERMINOLOGY & CLASSIFICATION ═══ */}
      {activeTab === 'terminology' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Essential Differential Equations Terminology</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {[
              {
                term: 'Independent Variable',
                desc: 'The variable with respect to which differentiation is performed (typically x for space, t for time).',
                eg: 't in dy/dt',
              },
              {
                term: 'Dependent Variable',
                desc: 'The unknown output function whose behavior we want to solve for.',
                eg: 'y in dy/dx = 2x',
              },
              {
                term: 'Order of an ODE',
                desc: 'The highest order of derivative occurring anywhere in the differential equation.',
                eg: 'd²y/dx² + y = 0 is Order 2',
              },
              {
                term: 'Degree of an ODE',
                desc: 'The algebraic power to which the highest derivative is raised, once free from fractional radicals.',
                eg: '(d²y/dx²)³ has Degree 3',
              },
              {
                term: 'General Solution',
                desc: 'The family of all valid functions satisfying the ODE, containing arbitrary integration constants (+ C).',
                eg: 'y(x) = C e^(2x)',
              },
              {
                term: 'Particular Solution',
                desc: 'The specific trajectory chosen when initial or boundary conditions determine the constants.',
                eg: 'y(0) = 5 ⇒ y(x) = 5 e^(2x)',
              },
            ].map((item) => (
              <div key={item.term} className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
                <h3 className="font-bold text-blue-300 text-sm">{item.term}</h3>
                <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                <div className="pt-2 border-t border-[#132244] text-[11px] text-amber-300 font-mono">
                  Example: {item.eg}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ 3. FIRST-ORDER METHODS (SEPARABLE, LINEAR, EXACT) ═══ */}
      {activeTab === 'first_order' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <span>Mastering First-Order Differential Equations</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Method 1: Separable */}
            <div className="p-5 rounded-xl bg-[#081226] border border-[#14264c] space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-emerald-400">1. Separable Differential Equations</h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
                  dy/dx = f(x)g(y)
                </span>
              </div>
              <p className="text-slate-300">
                Move all y terms to the left with dy and all x terms to the right with dx: <strong>(1/g(y)) dy = f(x) dx</strong>, then integrate both sides.
              </p>
              <div className="p-3 bg-[#060c1d] rounded-lg font-mono text-xs text-sky-300 border border-[#132244]">
                Example: dy/dx = 2xy ⇒ (1/y) dy = 2x dx ⇒ ln|y| = x² + C ⇒ y = C·e^(x²)
              </div>
            </div>

            {/* Method 2: Linear with Integrating Factor */}
            <div className="p-5 rounded-xl bg-[#081226] border border-[#14264c] space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-sky-400">2. Linear Equations (Integrating Factor)</h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800/60">
                  dy/dx + P(x)y = Q(x)
                </span>
              </div>
              <p className="text-slate-300">
                Calculate the Integrating Factor: <strong>I.F. = e^(∫ P(x)dx)</strong>. Multiply through to form a product rule derivative: <strong>d/dx [y · I.F.] = Q(x) · I.F.</strong>
              </p>
              <div className="p-3 bg-[#060c1d] rounded-lg font-mono text-xs text-sky-300 border border-[#132244]">
                Example: dy/dx + 2y = 4 ⇒ I.F. = e^(2x) ⇒ y · e^(2x) = ∫ 4e^(2x) dx = 2e^(2x) + C ⇒ y = 2 + C·e^(-2x)
              </div>
            </div>

            {/* Method 3: Exact Equations */}
            <div className="p-5 rounded-xl bg-[#081226] border border-[#14264c] space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-purple-400">3. Exact Differential Equations</h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/60">
                  M(x,y)dx + N(x,y)dy = 0
                </span>
              </div>
              <p className="text-slate-300">
                An equation is exact if <strong>∂M/∂y = ∂N/∂x</strong>. There exists a potential function Ψ(x,y) such that dΨ = 0, giving the solution Ψ(x,y) = C.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 4. SECOND-ORDER DIFFERENTIAL EQUATIONS ═══ */}
      {activeTab === 'second_order' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Second-Order Linear ODEs: a y’’ + b y’ + c y = 0</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Second-order equations describe oscillating springs, RLC circuits, and orbital mechanics.
            Substitute trial solution y = e^(rx) to yield the <strong>Characteristic Equation: a r² + b r + c = 0</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Case 1 */}
            <div className="p-4 rounded-xl bg-[#081226] border border-blue-900/50 space-y-2">
              <h3 className="font-bold text-blue-300 text-sm">Case 1: Distinct Real Roots (b² - 4ac &gt; 0)</h3>
              <p className="text-slate-300">Two separate real exponential decay/growth modes:</p>
              <div className="p-2.5 bg-[#060c1d] rounded font-mono text-sky-300 border border-[#14264c]">
                y(x) = C₁ e^(r₁ x) + C₂ e^(r₂ x)
              </div>
              <span className="text-[11px] text-slate-400 block">Example: y’’ - 3y’ + 2y = 0 ⇒ r = 1, 2</span>
            </div>

            {/* Case 2 */}
            <div className="p-4 rounded-xl bg-[#081226] border border-emerald-900/50 space-y-2">
              <h3 className="font-bold text-emerald-300 text-sm">Case 2: Repeated Real Root (b² - 4ac = 0)</h3>
              <p className="text-slate-300">Critically damped response (multiplied by x):</p>
              <div className="p-2.5 bg-[#060c1d] rounded font-mono text-emerald-300 border border-[#14264c]">
                y(x) = (C₁ + C₂ x) e^(r x)
              </div>
              <span className="text-[11px] text-slate-400 block">Example: y’’ - 4y’ + 4y = 0 ⇒ r = 2</span>
            </div>

            {/* Case 3 */}
            <div className="p-4 rounded-xl bg-[#081226] border border-purple-900/50 space-y-2">
              <h3 className="font-bold text-purple-300 text-sm">Case 3: Complex Conjugate (b² - 4ac &lt; 0)</h3>
              <p className="text-slate-300">Harmonic oscillation r = α ± iβ:</p>
              <div className="p-2.5 bg-[#060c1d] rounded font-mono text-purple-300 border border-[#14264c]">
                y(x) = e^(α x)[C₁ cos(βx) + C₂ sin(βx)]
              </div>
              <span className="text-[11px] text-slate-400 block">Example: y’’ + 9y = 0 ⇒ α = 0, β = 3</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 5. SLOPE FIELDS / DIRECTION FIELDS LAB ═══ */}
      {activeTab === 'slope_fields' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-sky-400" />
                <span>Interactive Slope Field & Trajectory Flow Lab</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Each line segment shows the vector slope dy/dx = f(x, y). The curve traces the particular trajectory.
              </p>
            </div>

            {/* Equation Picker */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#081226] p-1.5 rounded-xl border border-[#14264c] text-xs">
              <span className="text-slate-400 mr-1 text-[11px]">dy/dx =</span>
              {(['x-y', 'x+y', 'y-x', 'logistic', '-x/y'] as const).map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => setSlopeEq(eq)}
                  className={`px-2.5 py-1 rounded font-mono ${
                    slopeEq === eq ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Slope Field Plot */}
          <div className="w-full h-80 sm:h-96 bg-[#060c1d] rounded-xl border border-[#14264c] overflow-hidden relative select-none">
            <svg viewBox="0 0 700 360" className="w-full h-full">
              {/* Axes */}
              <line x1={0} y1={180} x2={700} y2={180} stroke="#1b3360" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1={350} y1={0} x2={350} y2={360} stroke="#1b3360" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Slope segments */}
              {slopeFieldGrid.map((pt, idx) => {
                const sx = ((pt.x + 3.5) / 7) * 700;
                const sy = 360 - ((pt.y + 3.5) / 7) * 360;
                const len = 9;
                const dx = Math.cos(pt.angle) * len;
                const dy = Math.sin(pt.angle) * len;

                return (
                  <line
                    key={idx}
                    x1={sx - dx}
                    y1={sy + dy}
                    x2={sx + dx}
                    y2={sy - dy}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeOpacity="0.65"
                  />
                );
              })}

              {/* Solution Trajectory Path */}
              {slopeFieldTrajectory.length > 1 && (
                <path
                  d={slopeFieldTrajectory
                    .map((pt, idx) => {
                      const sx = ((pt.x + 3.5) / 7) * 700;
                      const sy = 360 - ((pt.y + 3.5) / 7) * 360;
                      return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />
              )}

              {/* Initial Condition Start Dot */}
              <circle
                cx={((trajStart.x + 3.5) / 7) * 700}
                cy={360 - ((trajStart.y + 3.5) / 7) * 360}
                r={6}
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </svg>
          </div>

          {/* Interactive Start Point Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#081226] border border-[#14264c] text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 flex justify-between">
                <span>Start Coordinate x₀:</span>
                <span className="font-mono text-amber-300">{trajStart.x.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="-3"
                max="1"
                step="0.2"
                value={trajStart.x}
                onChange={(e) => setTrajStart((prev) => ({ ...prev, x: parseFloat(e.target.value) }))}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 flex justify-between">
                <span>Start Coordinate y₀:</span>
                <span className="font-mono text-amber-300">{trajStart.y.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.2"
                value={trajStart.y}
                onChange={(e) => setTrajStart((prev) => ({ ...prev, y: parseFloat(e.target.value) }))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ 6. REAL-WORLD SIMULATION LAB ═══ */}
      {activeTab === 'simulations' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Real-World Dynamic Simulation Lab</span>
              </h2>
              <p className="text-xs text-slate-400">
                Explore real biological, thermodynamic, and mechanical differential models live.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#081226] p-1 rounded-xl border border-[#14264c] text-xs">
              <button
                type="button"
                onClick={() => setSimType('population')}
                className={`px-3 py-1 rounded-lg ${simType === 'population' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
              >
                🌱 Population
              </button>
              <button
                type="button"
                onClick={() => setSimType('cooling')}
                className={`px-3 py-1 rounded-lg ${simType === 'cooling' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
              >
                ❄️ Cooling
              </button>
              <button
                type="button"
                onClick={() => setSimType('harmonic')}
                className={`px-3 py-1 rounded-lg ${simType === 'harmonic' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
              >
                🎢 Oscillator
              </button>
            </div>
          </div>

          {/* Simulation Graph */}
          <div className="w-full h-72 sm:h-80 bg-[#060c1d] rounded-xl border border-[#14264c] overflow-hidden select-none">
            <svg viewBox="0 0 700 320" className="w-full h-full">
              <line x1={0} y1={280} x2={700} y2={280} stroke="#1b3360" strokeWidth="1.5" />
              <line x1={40} y1={0} x2={40} y2={320} stroke="#1b3360" strokeWidth="1.5" />

              <path
                d={simPoints
                  .map((pt, idx) => {
                    const sx = 40 + (pt.t / 10) * 640;
                    const sy = 280 - (pt.val / 110) * 260;
                    return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />
            </svg>
          </div>

          {/* Sliders for Simulation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#081226] border border-[#14264c] text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 flex justify-between">
                <span>Rate Parameter (k):</span>
                <span className="font-mono text-emerald-300">{growthK.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={growthK}
                onChange={(e) => setGrowthK(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            {simType === 'population' && (
              <>
                <div className="space-y-1">
                  <label className="text-slate-400 flex justify-between">
                    <span>Initial Population P₀:</span>
                    <span className="font-mono text-emerald-300">{initialPop}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={initialPop}
                    onChange={(e) => setInitialPop(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 flex justify-between">
                    <span>Carrying Capacity K:</span>
                    <span className="font-mono text-emerald-300">{carryingCap}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="110"
                    step="10"
                    value={carryingCap}
                    onChange={(e) => setCarryingCap(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ 7. INTERACTIVE DIFFERENTIAL EQUATION SOLVER ═══ */}
      {activeTab === 'solver' && (
        <div className="space-y-6">
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Interactive Differential Equation Solver</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
              <div className="lg:col-span-7 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Differential Equation
                </label>
                <input
                  ref={eqInputRef}
                  type="text"
                  value={solverInput}
                  onChange={(e) => setSolverInput(e.target.value)}
                  onFocus={() => setActiveSolverField('eq')}
                  placeholder="dy/dx = 2x"
                  className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm sm:text-base font-mono text-white outline-none"
                />
              </div>

              <div className="lg:col-span-3 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Initial Condition y(0) =
                </label>
                <input
                  ref={y0InputRef}
                  type="text"
                  value={solverY0}
                  onChange={(e) => setSolverY0(e.target.value)}
                  onFocus={() => setActiveSolverField('y0')}
                  placeholder="3"
                  className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm sm:text-base font-mono text-white outline-none text-center"
                />
              </div>

              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowKeyboard((prev) => !prev)}
                  className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    showKeyboard
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-[#09152e] hover:bg-[#10234a] border-[#1d3c75] text-slate-200'
                  }`}
                >
                  <Keyboard className="w-4 h-4 text-blue-400" />
                  <span>Keyboard</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#132244] text-xs">
              <span className="text-slate-400 text-[11px]">Test Presets:</span>
              {[
                { label: 'dy/dx = 2x', eq: 'dy/dx = 2x', y0: '3' },
                { label: 'dy/dx = y', eq: 'dy/dx = y', y0: '2' },
                { label: 'dy/dx + y = x', eq: 'dy/dx + y = x', y0: '1' },
                { label: "y'' + y = 0", eq: "y'' + y = 0", y0: '4' },
              ].map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  onClick={() => {
                    setSolverInput(pr.eq);
                    setSolverY0(pr.y0);
                  }}
                  className="px-2.5 py-1 rounded bg-[#081226] text-slate-300 border border-[#14264c] text-[11px]"
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solver Output Card */}
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#14264c]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold block">
                  Classification & Strategy
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{solverAnalysis.classification}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
                Method: {solverAnalysis.method}
              </span>
            </div>

            {/* Derivation Steps */}
            <div className="space-y-2 text-xs sm:text-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Step-by-Step Derivation
              </span>
              {solverAnalysis.steps.map((st, sIdx) => (
                <div key={sIdx} className="p-3 bg-[#081226] rounded-xl border border-[#14264c] text-slate-200 font-mono">
                  {st}
                </div>
              ))}
            </div>

            {/* General and Particular Solutions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-4 bg-[#081226] rounded-xl border border-[#14264c] space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-sans">General Solution</span>
                <div className="text-base font-bold text-sky-300">{solverAnalysis.generalSol}</div>
              </div>
              <div className="p-4 bg-[#081226] rounded-xl border border-amber-900/40 space-y-1">
                <span className="text-amber-400 text-[10px] uppercase font-sans">Particular Solution (y(0) = {solverY0})</span>
                <div className="text-base font-bold text-amber-300">{solverAnalysis.particularSol || 'No condition'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 8. NUMERICAL METHODS (EULER) ═══ */}
      {activeTab === 'numerical' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Euler's Numerical Approximation Method</span>
              </h2>
              <p className="text-xs text-slate-400">
                yₙ₊₁ = yₙ + h · f(xₙ, yₙ). Compare exact curve y = eˣ against Euler polygon steps.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Step size h:</span>
              {[0.5, 0.2, 0.1].map((hVal) => (
                <button
                  key={hVal}
                  type="button"
                  onClick={() => setEulerH(hVal)}
                  className={`px-2.5 py-1 rounded font-mono ${eulerH === hVal ? 'bg-blue-600 text-white font-bold' : 'bg-[#081226] text-slate-400'}`}
                >
                  h={hVal}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-72 sm:h-80 bg-[#060c1d] rounded-xl border border-[#14264c] overflow-hidden select-none">
            <svg viewBox="0 0 700 320" className="w-full h-full">
              <line x1={0} y1={280} x2={700} y2={280} stroke="#1b3360" strokeWidth="1.5" />
              <line x1={40} y1={0} x2={40} y2={320} stroke="#1b3360" strokeWidth="1.5" />

              {/* Exact curve y = e^x */}
              <path
                d={eulerData.exactPts
                  .map((pt, idx) => {
                    const sx = 40 + (pt.x / 2) * 620;
                    const sy = 280 - (pt.y / 7.5) * 250;
                    return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Euler polygon */}
              <path
                d={eulerData.approxPts
                  .map((pt, idx) => {
                    const sx = 40 + (pt.x / 2) * 620;
                    const sy = 280 - (pt.y / 7.5) * 250;
                    return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            </svg>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-sky-400 rounded-full" />
              <span className="text-slate-300">Exact Solution: y = eˣ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-amber-400 border-b border-dashed border-amber-400" />
              <span className="text-amber-300">Euler Approximation (h = {eulerH})</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 9. DECISION TREE ═══ */}
      {activeTab === 'decision_tree' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>"Which Method Should I Use?" Interactive Decision Tree</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <div className="font-bold text-white text-base">Step 1: Check the Order</div>
              <p className="text-slate-300">
                Does the equation have only first derivatives dy/dx? If yes, it is First-Order. If it has d²y/dx², jump to Second-Order characteristic equations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#060c1d] border border-emerald-900/50 space-y-1.5">
                <span className="text-emerald-400 font-bold block text-sm">Can variables separate?</span>
                <p className="text-xs text-slate-400">Can it be written as g(y) dy = f(x) dx?</p>
                <div className="text-emerald-300 font-bold pt-1">⇒ Use Separation of Variables</div>
              </div>

              <div className="p-4 rounded-xl bg-[#060c1d] border border-sky-900/50 space-y-1.5">
                <span className="text-sky-400 font-bold block text-sm">Is y to the first power?</span>
                <p className="text-xs text-slate-400">Format: dy/dx + P(x)y = Q(x)</p>
                <div className="text-sky-300 font-bold pt-1">⇒ Use Integrating Factor (I.F.)</div>
              </div>

              <div className="p-4 rounded-xl bg-[#060c1d] border border-purple-900/50 space-y-1.5">
                <span className="text-purple-400 font-bold block text-sm">Is ∂M/∂y = ∂N/∂x?</span>
                <p className="text-xs text-slate-400">Format: M(x,y)dx + N(x,y)dy = 0</p>
                <div className="text-purple-300 font-bold pt-1">⇒ Use Exact Equation Method</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 10. PRACTICE QUIZ ═══ */}
      {activeTab === 'quiz' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span>Interactive Differential Equations Knowledge Check</span>
            </h2>
          </div>

          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((item, qIdx) => {
              const selectedAnswer = quizAnswers[item.id];
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = isAnswered && selectedAnswer === item.correctIdx;

              return (
                <div key={item.id} className="p-5 rounded-2xl bg-[#081226] border border-[#14264c] space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Question {qIdx + 1}
                  </span>
                  <p className="text-sm font-medium text-white">{item.question}</p>

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
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [item.id]: optIdx }))}
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span className="font-mono">{opt}</span>
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
                        <span>{isCorrect ? 'Correct! Outstanding understanding.' : 'Detailed Explanation:'}</span>
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

      {/* ═══ 11. FORMULAS & METHODS LIBRARY ═══ */}
      {activeTab === 'formulas' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#14264c]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Methods & Differential Equations Library</span>
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter methods..."
                className="w-full bg-[#071024] border border-[#162c57] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              { title: 'Separable ODE', form: 'dy/dx = f(x)g(y) ⇒ ∫ (1/g) dy = ∫ f dx', desc: 'Factor into products of isolated variables.' },
              { title: 'Linear First-Order', form: 'dy/dx + P(x)y = Q(x) ⇒ I.F. = e^(∫ P dx)', desc: 'Solved by multiplying the integrating factor.' },
              { title: 'Exact Condition', form: '∂M/∂y = ∂N/∂x on M dx + N dy = 0', desc: 'Guarantees conservative potential function Ψ(x,y).' },
              { title: 'Homogeneous Substitution', form: 'y = vx ⇒ dy/dx = v + x(dv/dx)', desc: 'Used when f(tx, ty) = f(x,y).' },
              { title: 'Bernoulli Equation', form: 'dy/dx + P(x)y = Q(x)yⁿ ⇒ u = y^(1-n)', desc: 'Transforms non-linear power into linear.' },
              { title: 'Euler’s Numerical Step', form: 'yₙ₊₁ = yₙ + h · f(xₙ, yₙ)', desc: 'Iterative tangent step approximation.' },
            ]
              .filter((f) => f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.desc.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.title} className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <div className="p-2 bg-[#060c1d] rounded font-mono text-xs text-sky-300 border border-[#14264c]">
                    {item.form}
                  </div>
                  <p className="text-xs text-slate-300">{item.desc}</p>
                </div>
              ))}
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
