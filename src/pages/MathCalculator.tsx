import { useState, useMemo, useEffect } from 'react';
import * as math from 'mathjs';
import Plot from 'react-plotly.js';
import {
  FunctionSquare,
  TrendingUp,
  Compass,
  Infinity,
  Sigma,
  BarChart3,
  Grid3X3,
  ArrowUpDown,
  MapPin,
  Box,
  Dice5,
  Triangle,
  ChevronRight,
  Calculator,
} from 'lucide-react';

import {
  differentiate,
  integrateSymbolic,
  integrateDefinite,
  computeLimit,
  computeTrig,
  computeInverseTrig,
  solveEquation,
  computeAP,
  computeGP,
  matAdd, matSubtract, matMultiply, matDeterminant, matTranspose, matInverse,
  vectorOps,
  coordGeometry,
  geo3D,
  computeStats,
  basicProbability,
} from '../math/mathUtils';
import type { Matrix, Vec3, AngleMode } from '../math/mathUtils';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'algebra',      label: 'Algebra',         icon: FunctionSquare,  color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/30'   },
  { id: 'graphing',     label: 'Graphing',         icon: TrendingUp,      color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30'},
  { id: 'trig',         label: 'Trigonometry',     icon: Triangle,        color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/30' },
  { id: 'limits',       label: 'Limits',           icon: Infinity,        color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30'},
  { id: 'diff',         label: 'Differentiation',  icon: Compass,         color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30'},
  { id: 'integ',        label: 'Integration',      icon: Sigma,           color: 'text-pink-500',   bg: 'bg-pink-50 dark:bg-pink-900/30'   },
  { id: 'apgp',         label: 'AP & GP',          icon: BarChart3,       color: 'text-cyan-500',   bg: 'bg-cyan-50 dark:bg-cyan-900/30'   },
  { id: 'matrix',       label: 'Matrices',         icon: Grid3X3,         color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/30'},
  { id: 'vectors',      label: 'Vectors',          icon: ArrowUpDown,     color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/30'     },
  { id: 'coord2d',      label: 'Coord. Geometry',  icon: MapPin,          color: 'text-teal-500',   bg: 'bg-teal-50 dark:bg-teal-900/30'   },
  { id: 'geo3d',        label: '3D Geometry',      icon: Box,             color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/30'},
  { id: 'stats',        label: 'Probability & Stats', icon: Dice5,        color: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-900/30'},
];

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider text-sm">{title}</h3>
      {children}
    </div>
  );
}

function ResultBox({ children, error }: { children?: React.ReactNode; error?: string }) {
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium">
        ⚠️ {error}
      </div>
    );
  }
  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
      {children}
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <div className="mt-3 space-y-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">{i + 1}</span>
          <span className="font-mono leading-relaxed">{s}</span>
        </div>
      ))}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}

function CalcButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="mt-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
    >
      <Calculator className="w-4 h-4" />
      {label || 'Calculate'}
    </button>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-blue-100 dark:border-blue-800/50 last:border-0">
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 shrink-0 max-w-[55%]">{label}</span>
      <span className="text-sm font-mono font-bold text-gray-900 dark:text-white text-right break-all">{value}</span>
    </div>
  );
}

// ─── Algebra Module ───────────────────────────────────────────────────────────

function AlgebraModule() {
  const [equation, setEquation] = useState('x^2 - 5x + 6 = 0');
  const [result, setResult] = useState<ReturnType<typeof solveEquation> | null>(null);

  const examples = ['2x + 4 = 10', 'x^2 - 5x + 6 = 0', '3x - 7 = 2x + 1', 'x^2 + 4 = 0'];

  return (
    <div className="space-y-6">
      <SectionCard title="Equation Solver">
        <InputField label="Equation (use = sign)" value={equation} onChange={setEquation} placeholder="e.g. 2x + 4 = 10" />
        <div className="flex flex-wrap gap-2 mt-1">
          {examples.map(ex => (
            <button key={ex} onClick={() => setEquation(ex)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 font-mono transition-colors">
              {ex}
            </button>
          ))}
        </div>
        <CalcButton onClick={() => setResult(solveEquation(equation))} label="Solve Equation" />
        {result && (
          result.type === 'error' || result.type === 'unsupported' ? (
            <ResultBox error={result.explanation.join(' ')} />
          ) : (
            <ResultBox>
              <div className="flex flex-wrap gap-3 mb-3">
                {result.solutions.map((s, i) => (
                  <div key={i} className="text-2xl font-extrabold font-mono text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-900 shadow-sm py-2 px-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    {s}
                  </div>
                ))}
              </div>
              <StepList steps={result.explanation} />
            </ResultBox>
          )
        )}
      </SectionCard>
    </div>
  );
}

// ─── Graphing Module ──────────────────────────────────────────────────────────

function GraphingModule() {
  const [funcStr, setFuncStr] = useState('x^2');
  const [appliedFunc, setAppliedFunc] = useState('x^2');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  const plotData = useMemo(() => {
    const xs: number[] = [];
    const ys: number[] = [];
    try {
      const compiled = math.compile(appliedFunc);
      for (let i = -100; i <= 100; i++) {
        const x = i * 0.1;
        try {
          const y = compiled.evaluate({ x });
          xs.push(x);
          ys.push(typeof y === 'number' && isFinite(y) ? y : NaN);
        } catch { xs.push(x); ys.push(NaN); }
      }
    } catch { /* invalid */ }
    return [{ x: xs, y: ys, type: 'scatter' as const, mode: 'lines' as const, line: { color: '#3b82f6', width: 2 }, name: `f(x)=${appliedFunc}` }];
  }, [appliedFunc]);

  const presets = ['sin(x)', 'cos(x)', 'x^2', 'x^3', 'sqrt(x)', 'log(x)', 'e^x', 'tan(x)', '1/x', 'abs(x)'];

  return (
    <div className="space-y-6">
      <SectionCard title="Function Grapher">
        <InputField label="f(x) =" value={funcStr} onChange={setFuncStr} placeholder="e.g. sin(x) or x^2+2*x" />
        <div className="flex flex-wrap gap-2 mt-1">
          {presets.map(p => (
            <button key={p} onClick={() => { setFuncStr(p); setAppliedFunc(p); }}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 text-gray-700 dark:text-gray-300 font-mono transition-colors">
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAppliedFunc(funcStr)}
          className="mt-2 w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
        >
          <TrendingUp className="w-4 h-4" /> Plot Graph
        </button>
      </SectionCard>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4" style={{ height: 400 }}>
        <Plot
          data={plotData}
          layout={{
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            xaxis: {
              zeroline: true,
              zerolinecolor: isDark ? '#4b5563' : '#9ca3af',
              gridcolor: isDark ? '#374151' : '#e5e7eb',
              tickfont: { color: isDark ? '#9ca3af' : '#4b5563' },
            },
            yaxis: {
              zeroline: true,
              zerolinecolor: isDark ? '#4b5563' : '#9ca3af',
              gridcolor: isDark ? '#374151' : '#e5e7eb',
              tickfont: { color: isDark ? '#9ca3af' : '#4b5563' },
            },
            legend: { font: { color: isDark ? '#e5e7eb' : '#111827' } },
            margin: { t: 10, l: 40, r: 10, b: 40 },
            autosize: true,
          }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>
    </div>
  );
}

// ─── Trigonometry Module ──────────────────────────────────────────────────────

function TrigModule() {
  const [angle, setAngle] = useState('30');
  const [mode, setMode] = useState<AngleMode>('deg');
  const [result, setResult] = useState<ReturnType<typeof computeTrig> | null>(null);
  const [invValue, setInvValue] = useState('0.5');
  const [invResult, setInvResult] = useState<ReturnType<typeof computeInverseTrig> | null>(null);

  const presets = mode === 'deg' ? ['0', '30', '45', '60', '90', '120', '180', '270', '360'] : ['0', '0.5236', '0.7854', '1.0472', '1.5708'];

  return (
    <div className="space-y-6">
      <SectionCard title="Trigonometric Functions">
        <div className="flex gap-2 mb-2">
          <button onClick={() => setMode('deg')} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'deg' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Degrees</button>
          <button onClick={() => setMode('rad')} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'rad' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Radians</button>
        </div>
        <InputField label={`Angle (${mode === 'deg' ? 'degrees' : 'radians'})`} value={angle} onChange={setAngle} type="number" />
        <div className="flex flex-wrap gap-1.5 mt-1">
          {presets.map(p => (
            <button key={p} onClick={() => setAngle(p)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-green-100 dark:hover:bg-green-900/40 text-gray-700 dark:text-gray-300 font-mono transition-colors">
              {p}{mode === 'deg' ? '°' : 'r'}
            </button>
          ))}
        </div>
        <CalcButton onClick={() => setResult(computeTrig(parseFloat(angle) || 0, mode))} label="Compute Trig Values" />
        {result && (
          <ResultBox>
            {Object.entries(result).map(([k, v]) => (
              v !== undefined && <ResultRow key={k} label={k.toUpperCase()} value={v} />
            ))}
          </ResultBox>
        )}
      </SectionCard>

      <SectionCard title="Inverse Trigonometric Functions">
        <InputField label="Input value (for asin/acos: must be in [-1,1])" value={invValue} onChange={setInvValue} type="number" />
        <CalcButton onClick={() => setInvResult(computeInverseTrig(parseFloat(invValue) || 0, mode))} label="Compute Inverse Trig" />
        {invResult && (
          <ResultBox>
            {invResult.asin !== undefined && <ResultRow label={`arcsin (${mode})`} value={invResult.asin!} />}
            {invResult.acos !== undefined && <ResultRow label={`arccos (${mode})`} value={invResult.acos!} />}
            {invResult.atan !== undefined && <ResultRow label={`arctan (${mode})`} value={invResult.atan!} />}
          </ResultBox>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Limits Module ────────────────────────────────────────────────────────────

function LimitsModule() {
  const [funcStr, setFuncStr] = useState('sin(x) / x');
  const [approach, setApproach] = useState<string>('0');
  const [result, setResult] = useState<ReturnType<typeof computeLimit> | null>(null);

  const examples = [
    { f: 'sin(x) / x', a: '0' },
    { f: '(x^2 - 1) / (x - 1)', a: '1' },
    { f: '1 / x', a: 'inf' },
    { f: 'e^x', a: '-inf' },
    { f: '(x^2 - 4) / (x - 2)', a: '2' },
  ];

  const handleCalc = () => {
    const a = approach === 'inf' ? 'inf' : approach === '-inf' ? '-inf' : parseFloat(approach);
    setResult(computeLimit(funcStr, a as number | 'inf' | '-inf'));
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Limit Calculator">
        <InputField label="f(x)" value={funcStr} onChange={setFuncStr} placeholder="e.g. sin(x)/x" />
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">x approaches</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={approach}
              onChange={e => setApproach(e.target.value)}
              placeholder="e.g. 0 or inf or -inf"
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button onClick={() => setApproach('inf')} className="px-3 py-2 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-mono hover:bg-orange-200 transition-colors">+∞</button>
            <button onClick={() => setApproach('-inf')} className="px-3 py-2 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-mono hover:bg-orange-200 transition-colors">-∞</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {examples.map((ex, i) => (
            <button key={i} onClick={() => { setFuncStr(ex.f); setApproach(ex.a); }}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-orange-100 dark:hover:bg-orange-900/40 text-gray-700 dark:text-gray-300 font-mono transition-colors">
              lim({ex.f}, x→{ex.a})
            </button>
          ))}
        </div>
        <CalcButton onClick={handleCalc} label="Evaluate Limit" />
        {result && (
          result.error ? <ResultBox error={result.error} /> : (
            <ResultBox>
              <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-mono py-1">= {result.value}</div>
              <StepList steps={result.steps} />
            </ResultBox>
          )
        )}
      </SectionCard>
    </div>
  );
}

// ─── Differentiation Module ───────────────────────────────────────────────────

function DiffModule() {
  const [funcStr, setFuncStr] = useState('x^3 + 2*x^2 - 5*x + 1');
  const [result, setResult] = useState<ReturnType<typeof differentiate> | null>(null);

  const examples = ['x^3 + 2*x^2 - 5*x + 1', 'sin(x) * cos(x)', 'e^x', 'ln(x)', 'x^2 * sin(x)', 'sqrt(x)', '1/x', 'tan(x)'];

  return (
    <div className="space-y-6">
      <SectionCard title="Derivative Calculator">
        <InputField label="f(x)" value={funcStr} onChange={setFuncStr} placeholder="e.g. x^3 + 2*x^2" />
        <div className="flex flex-wrap gap-2 mt-1">
          {examples.map(ex => (
            <button key={ex} onClick={() => setFuncStr(ex)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-gray-700 dark:text-gray-300 font-mono transition-colors">
              {ex}
            </button>
          ))}
        </div>
        <CalcButton onClick={() => setResult(differentiate(funcStr))} label="Differentiate" />
        {result && (
          result.error ? <ResultBox error={result.error} /> : (
            <ResultBox>
              <div className="mb-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">Rule used: </span>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{result.rule}</span>
              </div>
              <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 font-mono py-1 break-all">
                f'(x) = {result.derivative}
              </div>
              <StepList steps={result.steps} />
            </ResultBox>
          )
        )}
      </SectionCard>
    </div>
  );
}

// ─── Integration Module ───────────────────────────────────────────────────────

function IntegModule() {
  const [funcStr, setFuncStr] = useState('x^2');
  const [mode, setMode] = useState<'indefinite' | 'definite'>('indefinite');
  const [lower, setLower] = useState('0');
  const [upper, setUpper] = useState('1');
  const [result, setResult] = useState<ReturnType<typeof integrateSymbolic> | null>(null);

  const examples = ['x^2', 'sin(x)', 'cos(x)', 'e^x', '1/x', 'x^3', 'sqrt(x)', '2 * x'];

  const handleCalc = () => {
    if (mode === 'indefinite') {
      setResult(integrateSymbolic(funcStr));
    } else {
      setResult(integrateDefinite(funcStr, parseFloat(lower) || 0, parseFloat(upper) || 1));
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Integration Calculator">
        <div className="flex gap-2 mb-2">
          <button onClick={() => setMode('indefinite')} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'indefinite' ? 'bg-pink-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Indefinite ∫</button>
          <button onClick={() => setMode('definite')} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'definite' ? 'bg-pink-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Definite ∫[a,b]</button>
        </div>
        <InputField label="f(x)" value={funcStr} onChange={setFuncStr} placeholder="e.g. x^2" />
        {mode === 'definite' && (
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Lower bound (a)" value={lower} onChange={setLower} type="number" />
            <InputField label="Upper bound (b)" value={upper} onChange={setUpper} type="number" />
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-1">
          {examples.map(ex => (
            <button key={ex} onClick={() => setFuncStr(ex)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-pink-100 dark:hover:bg-pink-900/40 text-gray-700 dark:text-gray-300 font-mono transition-colors">
              {ex}
            </button>
          ))}
        </div>
        <CalcButton onClick={handleCalc} label="Integrate" />
        {result && (
          result.error ? <ResultBox error={result.error} /> : (
            <ResultBox>
              {mode === 'indefinite' && result.indefinite && (
                <div className="text-2xl font-extrabold text-pink-700 dark:text-pink-300 font-mono py-1 break-all">
                  ∫f(x)dx = {result.indefinite}
                </div>
              )}
              {mode === 'definite' && result.definite !== undefined && (
                <div className="text-2xl font-extrabold text-pink-700 dark:text-pink-300 font-mono py-1">
                  = {math.format(result.definite, { precision: 10 })}
                </div>
              )}
              <StepList steps={result.steps} />
            </ResultBox>
          )
        )}
      </SectionCard>
    </div>
  );
}

// ─── AP & GP Module ───────────────────────────────────────────────────────────

function ApGpModule() {
  const [apMode, setApMode] = useState<'ap' | 'gp'>('ap');
  const [a, setA] = useState('1');
  const [d, setD] = useState('3');
  const [r, setR] = useState('2');
  const [n, setN] = useState('10');
  const [result, setResult] = useState<ReturnType<typeof computeAP> | ReturnType<typeof computeGP> | null>(null);

  const handleCalc = () => {
    const aV = parseFloat(a) || 0;
    const nV = Math.max(1, Math.floor(parseFloat(n) || 1));
    if (apMode === 'ap') {
      setResult(computeAP(aV, parseFloat(d) || 0, nV));
    } else {
      setResult(computeGP(aV, parseFloat(r) || 1, nV));
    }
  };

  const res = result as any;

  return (
    <div className="space-y-6">
      <SectionCard title="AP / GP Calculator">
        <div className="flex gap-2 mb-2">
          <button onClick={() => { setApMode('ap'); setResult(null); }} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${apMode === 'ap' ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Arithmetic Progression (AP)</button>
          <button onClick={() => { setApMode('gp'); setResult(null); }} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${apMode === 'gp' ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Geometric Progression (GP)</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="First term (a)" value={a} onChange={setA} type="number" />
          {apMode === 'ap'
            ? <InputField label="Common difference (d)" value={d} onChange={setD} type="number" />
            : <InputField label="Common ratio (r)" value={r} onChange={setR} type="number" />
          }
        </div>
        <InputField label="Number of terms (n)" value={n} onChange={setN} type="number" />
        <CalcButton onClick={handleCalc} label="Calculate" />
        {result && (
          <ResultBox>
            <ResultRow label="n-th term" value={math.format(res.nthTerm, { precision: 10 })} />
            <ResultRow label="Sum of n terms" value={math.format(res.sum, { precision: 10 })} />
            {apMode === 'ap' && <ResultRow label="Common difference (d)" value={`${res.commonDiff}`} />}
            {apMode === 'gp' && <ResultRow label="Common ratio (r)" value={`${res.commonRatio}`} />}
            {apMode === 'ap' && (
              <div className="mt-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-xs font-mono text-cyan-800 dark:text-cyan-300">
                aₙ = a + (n-1)d = {a} + ({n}-1)×{d} = {res.nthTerm}
                <br />
                Sₙ = (n/2)(2a+(n-1)d) = {res.sum}
              </div>
            )}
            {apMode === 'gp' && (
              <div className="mt-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-xs font-mono text-cyan-800 dark:text-cyan-300">
                aₙ = a·rⁿ⁻¹ = {a}×{r}^{(parseInt(n) - 1)} = {math.format(res.nthTerm, { precision: 6 })}
                <br />
                Sₙ = a(1-rⁿ)/(1-r) = {math.format(res.sum, { precision: 6 })}
              </div>
            )}
          </ResultBox>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Matrices Module ──────────────────────────────────────────────────────────

function parseMatrix(str: string): Matrix {
  return str.trim().split(/[\n;]+/).map(row =>
    row.trim().split(/[\s,]+/).map(v => parseFloat(v) || 0)
  );
}

function formatMatrix(m: Matrix | number): string {
  if (typeof m === 'number') return math.format(m, { precision: 10 });
  return m.map(row => '[' + row.map(v => math.format(v, { precision: 6 })).join(', ') + ']').join('\n');
}

function MatrixInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{label} (rows on new lines, values comma/space separated)</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y"
        placeholder="1 2&#10;3 4"
      />
    </div>
  );
}

function MatrixModule() {
  const [matA, setMatA] = useState('1 2\n3 4');
  const [matB, setMatB] = useState('5 6\n7 8');
  const [op, setOp] = useState<'add' | 'sub' | 'mul' | 'det' | 'trans' | 'inv'>('add');
  const [result, setResult] = useState<{ result?: Matrix | number; steps: string[]; error?: string } | null>(null);

  const ops = [
    { id: 'add', label: 'A + B' },
    { id: 'sub', label: 'A - B' },
    { id: 'mul', label: 'A × B' },
    { id: 'det', label: 'det(A)' },
    { id: 'trans', label: 'Aᵀ' },
    { id: 'inv', label: 'A⁻¹' },
  ] as const;

  const handleCalc = () => {
    const A = parseMatrix(matA);
    const B = parseMatrix(matB);
    switch (op) {
      case 'add': setResult(matAdd(A, B)); break;
      case 'sub': setResult(matSubtract(A, B)); break;
      case 'mul': setResult(matMultiply(A, B)); break;
      case 'det': setResult(matDeterminant(A)); break;
      case 'trans': setResult(matTranspose(A)); break;
      case 'inv': setResult(matInverse(A)); break;
    }
  };

  const needsB = ['add', 'sub', 'mul'].includes(op);

  return (
    <div className="space-y-6">
      <SectionCard title="Matrix Operations">
        <div className="flex flex-wrap gap-2 mb-3">
          {ops.map(o => (
            <button key={o.id} onClick={() => { setOp(o.id); setResult(null); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono font-semibold transition-colors ${op === o.id ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'}`}>
              {o.label}
            </button>
          ))}
        </div>
        <MatrixInput label="Matrix A" value={matA} onChange={setMatA} />
        {needsB && <MatrixInput label="Matrix B" value={matB} onChange={setMatB} />}
        <CalcButton onClick={handleCalc} label="Compute" />
        {result && (
          result.error ? <ResultBox error={result.error} /> : (
            <ResultBox>
              <div className="font-mono text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap font-bold break-all">
                {result.result !== undefined ? formatMatrix(result.result as Matrix | number) : ''}
              </div>
              <StepList steps={result.steps} />
            </ResultBox>
          )
        )}
      </SectionCard>
    </div>
  );
}

// ─── Vectors Module ───────────────────────────────────────────────────────────

function VectorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{label} (x, y, z)</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. 1, 2, 3"
        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
    </div>
  );
}

function parseVec(str: string): Vec3 {
  const parts = str.split(/[\s,]+/).map(v => parseFloat(v) || 0);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

function VectorsModule() {
  const [vecA, setVecA] = useState('1, 2, 3');
  const [vecB, setVecB] = useState('4, 5, 6');
  const [result, setResult] = useState<ReturnType<typeof vectorOps> | null>(null);

  return (
    <div className="space-y-6">
      <SectionCard title="3D Vector Calculator">
        <VectorInput label="Vector A" value={vecA} onChange={setVecA} />
        <VectorInput label="Vector B" value={vecB} onChange={setVecB} />
        <CalcButton onClick={() => setResult(vectorOps(parseVec(vecA), parseVec(vecB)))} label="Compute Vector Operations" />
        {result && (
          <ResultBox>
            {result.map((r, i) => <ResultRow key={i} label={r.label} value={r.value} />)}
          </ResultBox>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Coordinate Geometry Module ───────────────────────────────────────────────

function Coord2DModule() {
  const [x1, setX1] = useState('1');
  const [y1, setY1] = useState('2');
  const [x2, setX2] = useState('4');
  const [y2, setY2] = useState('6');
  const [result, setResult] = useState<ReturnType<typeof coordGeometry> | null>(null);

  return (
    <div className="space-y-6">
      <SectionCard title="2D Coordinate Geometry">
        <div className="grid grid-cols-2 gap-3">
          <InputField label="x₁" value={x1} onChange={setX1} type="number" />
          <InputField label="y₁" value={y1} onChange={setY1} type="number" />
          <InputField label="x₂" value={x2} onChange={setX2} type="number" />
          <InputField label="y₂" value={y2} onChange={setY2} type="number" />
        </div>
        <CalcButton onClick={() => setResult(coordGeometry(parseFloat(x1) || 0, parseFloat(y1) || 0, parseFloat(x2) || 0, parseFloat(y2) || 0))} label="Calculate" />
        {result && (
          <ResultBox>
            {result.map((r, i) => <ResultRow key={i} label={r.label} value={r.value} />)}
          </ResultBox>
        )}
      </SectionCard>
    </div>
  );
}

// ─── 3D Geometry Module ───────────────────────────────────────────────────────

function Geo3DModule() {
  const [x1, setX1] = useState('1'); const [y1, setY1] = useState('2'); const [z1, setZ1] = useState('3');
  const [x2, setX2] = useState('4'); const [y2, setY2] = useState('6'); const [z2, setZ2] = useState('8');
  const [result, setResult] = useState<ReturnType<typeof geo3D> | null>(null);

  return (
    <div className="space-y-6">
      <SectionCard title="3D Geometry — Two Points">
        <div className="grid grid-cols-3 gap-3">
          <InputField label="x₁" value={x1} onChange={setX1} type="number" />
          <InputField label="y₁" value={y1} onChange={setY1} type="number" />
          <InputField label="z₁" value={z1} onChange={setZ1} type="number" />
          <InputField label="x₂" value={x2} onChange={setX2} type="number" />
          <InputField label="y₂" value={y2} onChange={setY2} type="number" />
          <InputField label="z₂" value={z2} onChange={setZ2} type="number" />
        </div>
        <CalcButton onClick={() => setResult(geo3D(parseFloat(x1)||0, parseFloat(y1)||0, parseFloat(z1)||0, parseFloat(x2)||0, parseFloat(y2)||0, parseFloat(z2)||0))} label="Calculate" />
        {result && (
          <ResultBox>
            {result.map((r, i) => <ResultRow key={i} label={r.label} value={r.value} />)}
          </ResultBox>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Probability & Stats Module ───────────────────────────────────────────────

function StatsModule() {
  const [dataStr, setDataStr] = useState('4, 7, 13, 2, 7, 9, 1, 5, 7');
  const [result, setResult] = useState<ReturnType<typeof computeStats> | null>(null);
  const [favStr, setFavStr] = useState('3');
  const [totStr, setTotStr] = useState('6');
  const [probResult, setProbResult] = useState<ReturnType<typeof basicProbability> | null>(null);

  const parseData = () => dataStr.split(/[\s,]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));

  return (
    <div className="space-y-6">
      <SectionCard title="Descriptive Statistics">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Data set (comma or space separated numbers)</label>
          <input
            value={dataStr}
            onChange={e => setDataStr(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            placeholder="e.g. 4, 7, 13, 2, 7"
          />
        </div>
        <CalcButton onClick={() => setResult(computeStats(parseData()))} label="Compute Statistics" />
        {result && (
          result.length === 0 ? <ResultBox error="No valid numbers found." /> : (
            <ResultBox>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {result.map((r, i) => <ResultRow key={i} label={r.label} value={r.value} />)}
              </div>
            </ResultBox>
          )
        )}
      </SectionCard>

      <SectionCard title="Basic Probability">
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Favorable outcomes" value={favStr} onChange={setFavStr} type="number" />
          <InputField label="Total outcomes" value={totStr} onChange={setTotStr} type="number" />
        </div>
        <CalcButton onClick={() => setProbResult(basicProbability(parseFloat(favStr) || 0, parseFloat(totStr) || 1))} label="Calculate Probability" />
        {probResult && (
          <ResultBox>
            {probResult.map((r, i) => <ResultRow key={i} label={r.label} value={r.value} />)}
          </ResultBox>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const MODULE_MAP: Record<string, React.ComponentType> = {
  algebra: AlgebraModule,
  graphing: GraphingModule,
  trig: TrigModule,
  limits: LimitsModule,
  diff: DiffModule,
  integ: IntegModule,
  apgp: ApGpModule,
  matrix: MatrixModule,
  vectors: VectorsModule,
  coord2d: Coord2DModule,
  geo3d: Geo3DModule,
  stats: StatsModule,
};

export default function MathCalculator() {
  const [activeTab, setActiveTab] = useState('algebra');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ActiveModule = MODULE_MAP[activeTab];
  const activeTabInfo = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="animate-slide-down">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <span className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
            <Sigma className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </span>
          Mathematics Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          12 specialized calculators — Algebra, Calculus, Trigonometry, Matrices, Vectors, Statistics & more.
        </p>
      </header>

      {/* Mobile tab selector */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(v => !v)}
          className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        >
          <span className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100">
            <activeTabInfo.icon className={`w-5 h-5 ${activeTabInfo.color}`} />
            {activeTabInfo.label}
          </span>
          <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isSidebarOpen ? 'rotate-90' : ''}`} />
        </button>
        {isSidebarOpen && (
          <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 grid grid-cols-2 gap-1.5">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === tab.id ? `${tab.bg} ${tab.color} font-bold` : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
              >
                <tab.icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main layout: sidebar + content */}
      <div className="flex gap-6">
        {/* Sidebar tabs — desktop */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === tab.id
                  ? `${tab.bg} ${tab.color} font-bold shadow-sm`
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          {/* Tab breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Math Calculator</span>
            <ChevronRight className="w-4 h-4" />
            <span className={`font-semibold ${activeTabInfo.color}`}>{activeTabInfo.label}</span>
          </div>

          {/* Active module */}
          <div key={activeTab}>
            <ActiveModule />
          </div>
        </main>
      </div>
    </div>
  );
}
