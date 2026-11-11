import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type ActionMode = 'sin' | 'cos' | 'tan' | 'all';

interface TrigResult {
  sin: number;
  cos: number;
  tan: number;
  csc: number;
  sec: number;
  cot: number;
  angleRad: number;
  angleDeg: number;
}

export default function TrigFunctionsTab() {
  const [action, setAction] = useState<ActionMode>('sin');
  const [angleInput, setAngleInput] = useState('');
  const [unit, setUnit] = useState<'degrees' | 'radians'>('degrees');
  const [result, setResult] = useState<TrigResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  // Practice
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  const actions: { key: ActionMode; label: string }[] = [
    { key: 'sin', label: 'Evaluate sin(θ)' },
    { key: 'cos', label: 'Evaluate cos(θ)' },
    { key: 'tan', label: 'Evaluate tan(θ)' },
    { key: 'all', label: 'All Six Functions' },
  ];

  const handleCalculate = () => {
    const val = parseFloat(angleInput);
    if (isNaN(val)) return;

    const angleDeg = unit === 'degrees' ? val : val * (180 / Math.PI);
    const angleRad = unit === 'radians' ? val : val * (Math.PI / 180);

    const sinVal = Math.sin(angleRad);
    const cosVal = Math.cos(angleRad);
    const tanVal = Math.abs(cosVal) < 1e-12 ? (sinVal >= 0 ? Infinity : -Infinity) : sinVal / cosVal;
    const cscVal = Math.abs(sinVal) < 1e-12 ? (sinVal >= 0 ? Infinity : -Infinity) : 1 / sinVal;
    const secVal = Math.abs(cosVal) < 1e-12 ? (cosVal >= 0 ? Infinity : -Infinity) : 1 / cosVal;
    const cotVal = Math.abs(sinVal) < 1e-12 ? (cosVal >= 0 ? Infinity : -Infinity) : cosVal / sinVal;

    setResult({ sin: sinVal, cos: cosVal, tan: tanVal, csc: cscVal, sec: secVal, cot: cotVal, angleRad, angleDeg });
    setShowSteps(true);
  };

  const handleReset = () => {
    setAngleInput('');
    setResult(null);
    setShowSteps(false);
  };

  const fmt = (n: number) => {
    if (!isFinite(n)) return 'undefined';
    if (Math.abs(n) < 1e-12) return '0';
    return n.toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-6">
      {/* ──── Topic Header ──── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          TRIGONOMETRY
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-2">
          Trigonometric Functions
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          The three primary trigonometric functions — sine, cosine, and tangent — relate the angles of a right triangle to the ratios of its sides. Together with their reciprocals (cosecant, secant, cotangent), they form the foundation of trigonometry.
        </p>
      </div>

      {/* ──── Mathematical Definition ──── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Mathematical Definition</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          For a right triangle with an angle θ, the trigonometric functions are defined as ratios of the triangle's sides. On the unit circle, sin(θ) and cos(θ) represent the y- and x-coordinates of a point at angle θ from the positive x-axis.
        </p>
        <div className="p-3 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-sm text-blue-300">
          sin(θ) = opposite / hypotenuse &nbsp;|&nbsp; cos(θ) = adjacent / hypotenuse &nbsp;|&nbsp; tan(θ) = sin(θ) / cos(θ)
        </div>
      </div>

      {/* ──── Formula Cards ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Primary Functions',
            formulas: [
              'sin(θ) = opposite / hypotenuse',
              'cos(θ) = adjacent / hypotenuse',
              'tan(θ) = opposite / adjacent = sin(θ) / cos(θ)',
            ],
            note: 'θ = angle in degrees or radians',
          },
          {
            title: 'Reciprocal Functions',
            formulas: [
              'csc(θ) = 1 / sin(θ)',
              'sec(θ) = 1 / cos(θ)',
              'cot(θ) = 1 / tan(θ) = cos(θ) / sin(θ)',
            ],
            note: 'Undefined when the denominator is zero',
          },
          {
            title: 'Pythagorean Identity',
            formulas: ['sin²(θ) + cos²(θ) = 1'],
            note: 'Holds for every angle θ',
          },
          {
            title: 'Degree ↔ Radian Conversion',
            formulas: [
              'radians = degrees × π / 180',
              'degrees = radians × 180 / π',
            ],
            note: '360° = 2π radians',
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
              onClick={() => { setAction(a.key); setResult(null); setShowSteps(false); }}
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

        {/* Input grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Angle (θ)</label>
            <input
              type="number"
              value={angleInput}
              onChange={(e) => setAngleInput(e.target.value)}
              placeholder="e.g. 45"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Unit</label>
            <div className="flex gap-2">
              {(['degrees', 'radians'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    unit === u
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                      : 'bg-[#070f22] text-slate-300 hover:text-white border border-[#162c57]'
                  }`}
                >
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

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
            <p className="text-xs text-slate-400 mb-1">
              θ = {fmt(result.angleDeg)}° = {fmt(result.angleRad)} rad
            </p>

            {(action === 'sin' || action === 'all') && (
              <p className="text-lg font-bold text-white">sin(θ) = <span className="text-blue-300">{fmt(result.sin)}</span></p>
            )}
            {(action === 'cos' || action === 'all') && (
              <p className="text-lg font-bold text-white">cos(θ) = <span className="text-blue-300">{fmt(result.cos)}</span></p>
            )}
            {(action === 'tan' || action === 'all') && (
              <p className="text-lg font-bold text-white">tan(θ) = <span className="text-blue-300">{fmt(result.tan)}</span></p>
            )}
            {action === 'all' && (
              <>
                <hr className="border-blue-500/30 my-2" />
                <p className="text-sm text-white">csc(θ) = <span className="text-blue-300">{fmt(result.csc)}</span></p>
                <p className="text-sm text-white">sec(θ) = <span className="text-blue-300">{fmt(result.sec)}</span></p>
                <p className="text-sm text-white">cot(θ) = <span className="text-blue-300">{fmt(result.cot)}</span></p>
              </>
            )}
          </div>
        )}

        {/* Step-by-step */}
        {result && showSteps && (
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244] space-y-2 text-sm">
            <h4 className="text-slate-100 font-semibold mb-1">Step-by-Step Solution</h4>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 1:</span> Convert angle to radians{' '}
              {unit === 'degrees' ? (
                <span className="font-mono text-blue-300">θ = {angleInput}° × π/180 = {fmt(result.angleRad)} rad</span>
              ) : (
                <span className="font-mono text-blue-300">θ = {angleInput} rad = {fmt(result.angleDeg)}°</span>
              )}
            </p>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 2:</span> Evaluate the function(s):
            </p>
            <div className="ml-4 font-mono text-blue-300 space-y-0.5">
              <p>sin({fmt(result.angleRad)}) = {fmt(result.sin)}</p>
              <p>cos({fmt(result.angleRad)}) = {fmt(result.cos)}</p>
              <p>tan({fmt(result.angleRad)}) = {fmt(result.tan)}</p>
              {action === 'all' && (
                <>
                  <p>csc({fmt(result.angleRad)}) = 1/sin(θ) = {fmt(result.csc)}</p>
                  <p>sec({fmt(result.angleRad)}) = 1/cos(θ) = {fmt(result.sec)}</p>
                  <p>cot({fmt(result.angleRad)}) = cos(θ)/sin(θ) = {fmt(result.cot)}</p>
                </>
              )}
            </div>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 3:</span> Verify with identity: sin²(θ) + cos²(θ) = {fmt(result.sin ** 2 + result.cos ** 2)} ≈ 1 ✓
            </p>
          </div>
        )}
      </div>

      {/* ──── Graphical Representation ──── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Graphical Representation</h2>
        <p className="text-xs text-slate-400 mb-3">sin(θ) and cos(θ) values at key angles</p>
        <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-3">
          <svg viewBox="0 0 680 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Axis */}
            <line x1="30" y1="70" x2="670" y2="70" stroke="#14264c" strokeWidth="1" />
            {/* Bars */}
            {[0, 30, 45, 60, 90, 120, 150, 180, 270, 360].map((deg, i) => {
              const rad = deg * (Math.PI / 180);
              const sinVal = Math.sin(rad);
              const cosVal = Math.cos(rad);
              const x = 50 + i * 64;
              const sinH = sinVal * 55;
              const cosH = cosVal * 55;
              return (
                <g key={deg}>
                  {/* sin bar */}
                  <rect
                    x={x - 10}
                    y={sinH < 0 ? 70 : 70 - sinH}
                    width={8}
                    height={Math.abs(sinH) || 1}
                    fill="#3b82f6"
                    rx={2}
                    opacity={0.85}
                  />
                  {/* cos bar */}
                  <rect
                    x={x}
                    y={cosH < 0 ? 70 : 70 - cosH}
                    width={8}
                    height={Math.abs(cosH) || 1}
                    fill="#22d3ee"
                    rx={2}
                    opacity={0.85}
                  />
                  {/* label */}
                  <text x={x - 3} y={135} fill="#94a3b8" fontSize="9" textAnchor="middle">{deg}°</text>
                </g>
              );
            })}
            {/* Legend */}
            <rect x="40" y="2" width="8" height="8" fill="#3b82f6" rx={2} />
            <text x="52" y="10" fill="#94a3b8" fontSize="9">sin</text>
            <rect x="80" y="2" width="8" height="8" fill="#22d3ee" rx={2} />
            <text x="92" y="10" fill="#94a3b8" fontSize="9">cos</text>
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
            <h3 className="text-sm font-bold text-slate-100 mb-2">Example 1 — Basic: Find sin(60°)</h3>
            <div className="space-y-1 text-sm text-slate-300">
              <p><span className="text-blue-400">Step 1:</span> Convert: 60° × π/180 = π/3 ≈ 1.0472 rad</p>
              <p><span className="text-blue-400">Step 2:</span> In a 30-60-90 triangle, the side opposite 60° = √3/2</p>
              <p><span className="text-blue-400">Step 3:</span> sin(60°) = √3/2 ≈ <span className="text-blue-300 font-mono font-bold">0.866025</span></p>
            </div>
          </div>

          {/* Example 2 */}
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244]">
            <h3 className="text-sm font-bold text-slate-100 mb-2">Example 2 — Challenging: Find all six trig values at θ = 5π/4 rad</h3>
            <div className="space-y-1 text-sm text-slate-300">
              <p><span className="text-blue-400">Step 1:</span> 5π/4 rad = 225°. This is in Quadrant III where sin &lt; 0 and cos &lt; 0.</p>
              <p><span className="text-blue-400">Step 2:</span> Reference angle = 225° − 180° = 45°</p>
              <p><span className="text-blue-400">Step 3:</span> sin(225°) = −√2/2 ≈ −0.7071, cos(225°) = −√2/2 ≈ −0.7071</p>
              <p><span className="text-blue-400">Step 4:</span> tan(225°) = sin/cos = 1</p>
              <p><span className="text-blue-400">Step 5:</span> csc = −√2, sec = −√2, cot = 1</p>
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

        <p className="text-slate-300 text-sm mb-4">What is sin(30°)?</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: '0.5', value: 0 },
            { label: '0.707', value: 1 },
            { label: '0.866', value: 2 },
            { label: '1', value: 3 },
          ].map((opt) => {
            const isSelected = practiceAnswer === opt.value;
            const isCorrect = opt.value === 0; // 0.5 is correct
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
          <div className={`p-3 rounded-lg text-sm mb-3 ${practiceAnswer === 0 ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/30' : 'bg-red-900/30 text-red-300 border border-red-500/30'}`}>
            {practiceAnswer === 0 ? '✓ Correct! sin(30°) = 0.5' : '✗ Incorrect. The correct answer is 0.5.'}
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
            <p><span className="text-blue-400">Step 1:</span> In a 30-60-90 triangle, the sides are in ratio 1 : √3 : 2.</p>
            <p><span className="text-blue-400">Step 2:</span> The side opposite 30° has length 1, and the hypotenuse has length 2.</p>
            <p><span className="text-blue-400">Step 3:</span> sin(30°) = opposite/hypotenuse = 1/2 = <span className="font-mono text-blue-300 font-bold">0.5</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
