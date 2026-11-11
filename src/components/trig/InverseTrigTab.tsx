import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type ActionMode = 'arcsin' | 'arccos' | 'arctan';

interface InverseTrigResult {
  angleRad: number;
  angleDeg: number;
  inputValue: number;
  func: ActionMode;
}

export default function InverseTrigTab() {
  const [action, setAction] = useState<ActionMode>('arcsin');
  const [xInput, setXInput] = useState('');
  const [result, setResult] = useState<InverseTrigResult | null>(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  // Practice
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  const actions: { key: ActionMode; label: string }[] = [
    { key: 'arcsin', label: 'Find arcsin(x)' },
    { key: 'arccos', label: 'Find arccos(x)' },
    { key: 'arctan', label: 'Find arctan(x)' },
  ];

  const handleCalculate = () => {
    setError('');
    const x = parseFloat(xInput);
    if (isNaN(x)) {
      setError('Please enter a valid number.');
      return;
    }

    if ((action === 'arcsin' || action === 'arccos') && (x < -1 || x > 1)) {
      setError(`Domain error: ${action}(x) requires −1 ≤ x ≤ 1. You entered x = ${x}.`);
      return;
    }

    let angleRad: number;
    if (action === 'arcsin') angleRad = Math.asin(x);
    else if (action === 'arccos') angleRad = Math.acos(x);
    else angleRad = Math.atan(x);

    const angleDeg = angleRad * (180 / Math.PI);

    setResult({ angleRad, angleDeg, inputValue: x, func: action });
    setShowSteps(true);
  };

  const handleReset = () => {
    setXInput('');
    setResult(null);
    setError('');
    setShowSteps(false);
  };

  const fmt = (n: number, decimals = 6) => {
    if (!isFinite(n)) return 'undefined';
    if (Math.abs(n) < 1e-12) return '0';
    return n.toFixed(decimals).replace(/\.?0+$/, '');
  };

  const fmtFrac = (rad: number): string => {
    const fracs: [number, string][] = [
      [0, '0'],
      [Math.PI / 6, 'π/6'],
      [Math.PI / 4, 'π/4'],
      [Math.PI / 3, 'π/3'],
      [Math.PI / 2, 'π/2'],
      [2 * Math.PI / 3, '2π/3'],
      [3 * Math.PI / 4, '3π/4'],
      [5 * Math.PI / 6, '5π/6'],
      [Math.PI, 'π'],
      [-Math.PI / 6, '−π/6'],
      [-Math.PI / 4, '−π/4'],
      [-Math.PI / 3, '−π/3'],
      [-Math.PI / 2, '−π/2'],
    ];
    for (const [v, s] of fracs) {
      if (Math.abs(rad - v) < 1e-9) return s;
    }
    return fmt(rad);
  };

  const funcLabel = (m: ActionMode) => {
    switch (m) {
      case 'arcsin': return 'arcsin';
      case 'arccos': return 'arccos';
      case 'arctan': return 'arctan';
    }
  };

  // Bar graph data — showing arcsin values at key inputs
  const graphInputs = [-1, -0.866, -0.707, -0.5, 0, 0.5, 0.707, 0.866, 1];

  return (
    <div className="space-y-6">
      {/* ──── Topic Header ──── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          TRIGONOMETRY
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-2">
          Inverse Trigonometric Functions
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          The inverse trigonometric functions — arcsin, arccos, and arctan — reverse the standard trig functions. Given a ratio, they return the angle that produces it, restricted to a principal value range.
        </p>
      </div>

      {/* ──── Mathematical Definition ──── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Mathematical Definition</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          If y = sin(θ), then θ = arcsin(y). Each inverse function returns an angle within a specific principal value range to ensure the function is well-defined (one-to-one).
        </p>
        <div className="p-3 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-sm text-blue-300 space-y-1">
          <p>arcsin(x) → θ ∈ [−π/2, π/2]&nbsp;&nbsp;|&nbsp;&nbsp;domain: −1 ≤ x ≤ 1</p>
          <p>arccos(x) → θ ∈ [0, π]&nbsp;&nbsp;|&nbsp;&nbsp;domain: −1 ≤ x ≤ 1</p>
          <p>arctan(x) → θ ∈ (−π/2, π/2)&nbsp;&nbsp;|&nbsp;&nbsp;domain: all real numbers</p>
        </div>
      </div>

      {/* ──── Formula Cards ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'arcsin (sin⁻¹)',
            formulas: ['θ = arcsin(x)', 'Range: [−π/2, π/2] = [−90°, 90°]'],
            note: 'x must be in [−1, 1]',
          },
          {
            title: 'arccos (cos⁻¹)',
            formulas: ['θ = arccos(x)', 'Range: [0, π] = [0°, 180°]'],
            note: 'x must be in [−1, 1]',
          },
          {
            title: 'arctan (tan⁻¹)',
            formulas: ['θ = arctan(x)', 'Range: (−π/2, π/2) = (−90°, 90°)'],
            note: 'x can be any real number',
          },
          {
            title: 'Key Relationships',
            formulas: [
              'arcsin(x) + arccos(x) = π/2',
              'sin(arcsin(x)) = x',
              'arctan(1) = π/4 = 45°',
            ],
            note: 'Useful for verification',
          },
        ].map((card, i) => (
          <div key={i} className="relative p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />
            <h3 className="text-sm font-semibold text-slate-100 mb-2 ml-2">{card.title}</h3>
            <div className="space-y-1 ml-2">
              {card.formulas.map((f, j) => (
                <p key={j} className="font-mono text-sm text-blue-300">{f}</p>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-2">{card.note}</p>
          </div>
        ))}
      </div>

      {/* ──── Interactive Calculator ──── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Interactive Calculator</h2>
        </div>

        {/* Action pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {actions.map((a) => (
            <button
              key={a.key}
              onClick={() => { setAction(a.key); setResult(null); setError(''); setShowSteps(false); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                action === a.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-[#070f22] text-slate-300 hover:text-white border border-[#162c57]'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Value (x){action !== 'arctan' && <span className="ml-1 text-slate-500">— must be in [−1, 1]</span>}
            </label>
            <input
              type="number"
              step="any"
              value={xInput}
              onChange={(e) => setXInput(e.target.value)}
              placeholder="e.g. 0.5"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>
          <div className="flex items-end">
            <div className="p-3 rounded-xl bg-[#060c1d] border border-[#132244] text-xs text-slate-500 w-full">
              Principal range: {action === 'arcsin' ? '[−90°, 90°]' : action === 'arccos' ? '[0°, 180°]' : '(−90°, 90°)'}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-900/30 text-red-300 border border-red-500/30 text-sm mb-4">{error}</div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={handleCalculate} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4" /> Calculate
          </button>
          <button onClick={handleReset} className="p-2.5 rounded-xl bg-[#070f22] border border-[#162c57] hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Result card */}
        {result && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 to-[#0e214d] border-2 border-blue-500 shadow-lg mb-4">
            <p className="text-xs text-slate-400 mb-1">{funcLabel(result.func)}({fmt(result.inputValue)})</p>
            <p className="text-xl font-bold text-white">
              θ = <span className="text-blue-300">{fmt(result.angleDeg)}°</span>
            </p>
            <p className="text-sm text-slate-300">
              = <span className="font-mono text-blue-300">{fmtFrac(result.angleRad)} rad</span>
              <span className="text-slate-500 ml-2">({fmt(result.angleRad)} rad)</span>
            </p>
          </div>
        )}

        {/* Step-by-step */}
        {result && showSteps && (
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244] space-y-2 text-sm">
            <h4 className="text-slate-100 font-semibold mb-1">Step-by-Step Solution</h4>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 1:</span> Identify the function: <span className="font-mono text-blue-300">{funcLabel(result.func)}({fmt(result.inputValue)})</span>
            </p>
            {result.func !== 'arctan' && (
              <p className="text-slate-300">
                <span className="text-blue-400">Step 2:</span> Verify domain: {fmt(result.inputValue)} is in [−1, 1] ✓
              </p>
            )}
            <p className="text-slate-300">
              <span className="text-blue-400">Step {result.func !== 'arctan' ? 3 : 2}:</span> Compute: <span className="font-mono text-blue-300">θ = {fmtFrac(result.angleRad)} rad = {fmt(result.angleDeg)}°</span>
            </p>
            <p className="text-slate-300">
              <span className="text-blue-400">Step {result.func !== 'arctan' ? 4 : 3}:</span> Verify: {
                result.func === 'arcsin'
                  ? `sin(${fmt(result.angleDeg)}°) = ${fmt(Math.sin(result.angleRad))} ≈ ${fmt(result.inputValue)} ✓`
                  : result.func === 'arccos'
                  ? `cos(${fmt(result.angleDeg)}°) = ${fmt(Math.cos(result.angleRad))} ≈ ${fmt(result.inputValue)} ✓`
                  : `tan(${fmt(result.angleDeg)}°) = ${fmt(Math.tan(result.angleRad))} ≈ ${fmt(result.inputValue)} ✓`
              }
            </p>
            <p className="text-slate-300">
              <span className="text-blue-400">Range check:</span> {fmt(result.angleDeg)}° is within the principal range {
                result.func === 'arcsin' ? '[−90°, 90°]' : result.func === 'arccos' ? '[0°, 180°]' : '(−90°, 90°)'
              } ✓
            </p>
          </div>
        )}
      </div>

      {/* ──── Graphical Representation ──── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Graphical Representation</h2>
        <p className="text-xs text-slate-400 mb-3">arcsin(x) output angles at key input values</p>
        <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-3">
          <svg viewBox="0 0 600 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Axis */}
            <line x1="30" y1="70" x2="570" y2="70" stroke="#14264c" strokeWidth="1" />
            {/* Bars for arcsin */}
            {graphInputs.map((x, i) => {
              const angleRad = Math.asin(x);
              const angleDeg = angleRad * (180 / Math.PI);
              const barH = (angleDeg / 90) * 55;
              const xPos = 45 + i * 60;
              return (
                <g key={i}>
                  <rect
                    x={xPos - 8}
                    y={barH < 0 ? 70 : 70 - barH}
                    width={16}
                    height={Math.abs(barH) || 1}
                    fill="#3b82f6"
                    rx={2}
                    opacity={0.85}
                  />
                  <text x={xPos} y={135} fill="#94a3b8" fontSize="8" textAnchor="middle">{x}</text>
                  <text x={xPos} y={barH < 0 ? 70 + Math.abs(barH) + 10 : 70 - barH - 4} fill="#93c5fd" fontSize="7" textAnchor="middle">
                    {Math.round(angleDeg)}°
                  </text>
                </g>
              );
            })}
            {/* Label */}
            <text x="300" y="12" fill="#94a3b8" fontSize="9" textAnchor="middle">arcsin(x) → angle in degrees</text>
          </svg>
        </div>
      </div>

      {/* ──── Worked Examples ──── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Worked Examples</h2>
        </div>

        <div className="space-y-4">
          {/* Example 1 */}
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244]">
            <h3 className="text-sm font-bold text-slate-100 mb-2">Example 1 — Basic: Find arcsin(0.5)</h3>
            <div className="space-y-1 text-sm text-slate-300">
              <p><span className="text-blue-400">Step 1:</span> We need θ such that sin(θ) = 0.5 and θ ∈ [−90°, 90°].</p>
              <p><span className="text-blue-400">Step 2:</span> From the 30-60-90 triangle, sin(30°) = 1/2 = 0.5.</p>
              <p><span className="text-blue-400">Step 3:</span> arcsin(0.5) = 30° = <span className="font-mono text-blue-300 font-bold">π/6 rad</span></p>
              <p><span className="text-blue-400">Verify:</span> 30° is in [−90°, 90°] ✓</p>
            </div>
          </div>

          {/* Example 2 */}
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244]">
            <h3 className="text-sm font-bold text-slate-100 mb-2">Example 2 — Challenging: Find arctan(1)</h3>
            <div className="space-y-1 text-sm text-slate-300">
              <p><span className="text-blue-400">Step 1:</span> We need θ such that tan(θ) = 1 and θ ∈ (−90°, 90°).</p>
              <p><span className="text-blue-400">Step 2:</span> tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1.</p>
              <p><span className="text-blue-400">Step 3:</span> arctan(1) = 45° = <span className="font-mono text-blue-300 font-bold">π/4 rad ≈ 0.7854</span></p>
              <p><span className="text-blue-400">Verify:</span> 45° is in (−90°, 90°) ✓</p>
            </div>
          </div>
        </div>
      </div>

      {/* ──── Practice Mode ──── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Practice Mode</h2>
        </div>

        <p className="text-slate-300 text-sm mb-4">What is arccos(0.5) in degrees?</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: '30°', value: 0 },
            { label: '45°', value: 1 },
            { label: '60°', value: 2 },
            { label: '90°', value: 3 },
          ].map((opt) => {
            const isSelected = practiceAnswer === opt.value;
            const isCorrect = opt.value === 2; // 60° is correct
            const showFeedback = practiceAnswer !== null;
            let btnClass = 'bg-[#070f22] text-slate-300 border border-[#162c57] hover:border-slate-500';
            if (showFeedback && isSelected && isCorrect) {
              btnClass = 'bg-emerald-600/20 text-emerald-300 border-2 border-emerald-500';
            } else if (showFeedback && isSelected && !isCorrect) {
              btnClass = 'bg-red-600/20 text-red-300 border-2 border-red-500';
            } else if (showFeedback && isCorrect) {
              btnClass = 'bg-emerald-600/10 text-emerald-300 border border-emerald-500/50';
            }
            return (
              <button
                key={opt.value}
                onClick={() => setPracticeAnswer(opt.value)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${btnClass}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {practiceAnswer !== null && (
          <div className={`p-3 rounded-lg text-sm mb-3 ${practiceAnswer === 2 ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/30' : 'bg-red-900/30 text-red-300 border border-red-500/30'}`}>
            {practiceAnswer === 2 ? '✓ Correct! arccos(0.5) = 60°' : '✗ Incorrect. The correct answer is 60°.'}
          </div>
        )}

        <button
          onClick={() => setShowPracticeSolution(!showPracticeSolution)}
          className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
        >
          {showPracticeSolution ? 'Hide Solution' : 'Show Solution'}
        </button>

        {showPracticeSolution && (
          <div className="mt-3 p-3 rounded-lg bg-[#060c1d] border border-[#132244] text-sm text-slate-300 space-y-1">
            <p><span className="text-blue-400">Step 1:</span> We need θ such that cos(θ) = 0.5 and θ ∈ [0°, 180°].</p>
            <p><span className="text-blue-400">Step 2:</span> From the 30-60-90 triangle, cos(60°) = 1/2 = 0.5.</p>
            <p><span className="text-blue-400">Step 3:</span> arccos(0.5) = <span className="font-mono text-blue-300 font-bold">60° = π/3 rad</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
