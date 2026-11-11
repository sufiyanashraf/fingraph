import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface TrigValues {
  sin: number;
  cos: number;
  tan: number;
  csc: number;
  sec: number;
  cot: number;
}

const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

function getTrigValues(deg: number): TrigValues {
  const rad = deg * (Math.PI / 180);
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.abs(cosVal) < 1e-12 ? (sinVal >= 0 ? Infinity : -Infinity) : sinVal / cosVal;
  const cscVal = Math.abs(sinVal) < 1e-12 ? (sinVal >= 0 || Math.abs(sinVal) < 1e-12 ? Infinity : -Infinity) : 1 / sinVal;
  const secVal = Math.abs(cosVal) < 1e-12 ? (cosVal >= 0 || Math.abs(cosVal) < 1e-12 ? Infinity : -Infinity) : 1 / cosVal;
  const cotVal = Math.abs(sinVal) < 1e-12 ? (cosVal >= 0 ? Infinity : -Infinity) : cosVal / sinVal;
  return { sin: sinVal, cos: cosVal, tan: tanVal, csc: cscVal, sec: secVal, cot: cotVal };
}

function fmt(n: number): string {
  if (!isFinite(n)) return 'undef';
  if (Math.abs(n) < 1e-12) return '0';
  // Check for common exact values
  const absN = Math.abs(n);
  const sign = n < 0 ? '−' : '';
  if (Math.abs(absN - 0.5) < 1e-9) return sign + '1/2';
  if (Math.abs(absN - Math.sqrt(2) / 2) < 1e-9) return sign + '√2/2';
  if (Math.abs(absN - Math.sqrt(3) / 2) < 1e-9) return sign + '√3/2';
  if (Math.abs(absN - 1) < 1e-9) return sign + '1';
  if (Math.abs(absN - Math.sqrt(3)) < 1e-9) return sign + '√3';
  if (Math.abs(absN - Math.sqrt(3) / 3) < 1e-9) return sign + '√3/3';
  return n.toFixed(4).replace(/\.?0+$/, '');
}

function fmtDec(n: number): string {
  if (!isFinite(n)) return 'undefined';
  if (Math.abs(n) < 1e-12) return '0';
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export default function UnitCircleTab() {
  const [angleDeg, setAngleDeg] = useState(45);
  const [angleInput, setAngleInput] = useState('45');
  const [showSteps, setShowSteps] = useState(false);

  // Practice
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  const angleRad = angleDeg * (Math.PI / 180);
  const trigVals = getTrigValues(angleDeg);
  const cosX = Math.cos(angleRad);
  const sinY = Math.sin(angleRad);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAngleDeg(val);
    setAngleInput(String(val));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAngleInput(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0 && val <= 360) {
      setAngleDeg(Math.round(val));
    }
  };

  const handleReset = () => {
    setAngleDeg(45);
    setAngleInput('45');
    setShowSteps(false);
  };

  // SVG unit circle coords — center at (150, 150), radius 110
  const cx = 150, cy = 150, r = 110;
  const px = cx + r * cosX;
  const py = cy - r * sinY; // SVG y is inverted

  return (
    <div className="space-y-6">
      {/* ──── Topic Header ──── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          TRIGONOMETRY
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-2">
          Unit Circle Explorer
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          The unit circle is a circle with radius 1 centered at the origin. Every point on the circle corresponds to an angle θ and has coordinates (cos θ, sin θ). Explore how all six trigonometric values change as the angle varies.
        </p>
      </div>

      {/* ──── Mathematical Definition ──── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Mathematical Definition</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          On the unit circle (radius = 1), an angle θ measured counter-clockwise from the positive x-axis determines a unique point. The x-coordinate of that point is cos θ and the y-coordinate is sin θ.
        </p>
        <div className="p-3 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-sm text-blue-300">
          Point on unit circle = (cos θ, sin θ)&nbsp;&nbsp;|&nbsp;&nbsp;x = cos θ&nbsp;&nbsp;|&nbsp;&nbsp;y = sin θ&nbsp;&nbsp;|&nbsp;&nbsp;x² + y² = 1
        </div>
      </div>

      {/* ──── Formula Cards ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Unit Circle Point',
            formulas: ['P(θ) = (cos θ, sin θ)', 'x² + y² = 1'],
            note: 'Every point lies on the circle of radius 1',
          },
          {
            title: 'Quadrant Signs',
            formulas: [
              'Q I (0°–90°): sin +, cos +',
              'Q II (90°–180°): sin +, cos −',
              'Q III (180°–270°): sin −, cos −',
              'Q IV (270°–360°): sin −, cos +',
            ],
            note: 'Remember: All Students Take Calculus',
          },
          {
            title: 'Derived Functions',
            formulas: [
              'tan θ = sin θ / cos θ = y / x',
              'cot θ = cos θ / sin θ = x / y',
            ],
            note: 'Undefined when denominator = 0',
          },
          {
            title: 'Symmetry Properties',
            formulas: [
              'sin(−θ) = −sin θ',
              'cos(−θ) = cos θ',
              'sin(θ + 360°) = sin θ',
            ],
            note: 'Periodic with period 360° (2π)',
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

      {/* ──── Interactive Calculator / Explorer ──── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Interactive Explorer</h2>
        </div>

        {/* Input: angle + slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Angle θ (degrees)</label>
            <input
              type="number"
              min={0}
              max={360}
              value={angleInput}
              onChange={handleInputChange}
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Slider (0° – 360°)</label>
            <input
              type="range"
              min={0}
              max={360}
              value={angleDeg}
              onChange={handleSlider}
              className="w-full h-2 mt-3 rounded-lg appearance-none cursor-pointer accent-blue-500 bg-[#132244]"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setShowSteps(!showSteps)} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4" /> {showSteps ? 'Hide Details' : 'Show Details'}
          </button>
          <button onClick={handleReset} className="p-2.5 rounded-xl bg-[#070f22] border border-[#162c57] hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Result card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 to-[#0e214d] border-2 border-blue-500 shadow-lg mb-4">
          <p className="text-xs text-slate-400 mb-2">θ = {angleDeg}° = {fmtDec(angleRad)} rad</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-slate-400">cos θ (x)</p>
              <p className="text-lg font-bold text-blue-300 font-mono">{fmt(trigVals.cos)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">sin θ (y)</p>
              <p className="text-lg font-bold text-blue-300 font-mono">{fmt(trigVals.sin)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Point</p>
              <p className="text-lg font-bold text-white font-mono">({fmt(trigVals.cos)}, {fmt(trigVals.sin)})</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">tan θ</p>
              <p className="text-sm font-bold text-blue-300 font-mono">{fmt(trigVals.tan)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">csc θ</p>
              <p className="text-sm font-bold text-blue-300 font-mono">{fmt(trigVals.csc)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">sec θ</p>
              <p className="text-sm font-bold text-blue-300 font-mono">{fmt(trigVals.sec)}</p>
            </div>
          </div>
        </div>

        {/* Step-by-step */}
        {showSteps && (
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244] space-y-2 text-sm">
            <h4 className="text-slate-100 font-semibold mb-1">Step-by-Step</h4>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 1:</span> Convert to radians: {angleDeg}° × π/180 = <span className="font-mono text-blue-300">{fmtDec(angleRad)} rad</span>
            </p>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 2:</span> Locate on unit circle — Quadrant {
                angleDeg <= 90 ? 'I' : angleDeg <= 180 ? 'II' : angleDeg <= 270 ? 'III' : 'IV'
              }
            </p>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 3:</span> x-coordinate = cos({angleDeg}°) = <span className="font-mono text-blue-300">{fmt(trigVals.cos)}</span>
            </p>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 4:</span> y-coordinate = sin({angleDeg}°) = <span className="font-mono text-blue-300">{fmt(trigVals.sin)}</span>
            </p>
            <p className="text-slate-300">
              <span className="text-blue-400">Step 5:</span> Verify: cos²θ + sin²θ = {fmtDec(trigVals.cos ** 2 + trigVals.sin ** 2)} ≈ 1 ✓
            </p>
          </div>
        )}
      </div>

      {/* ──── Graphical Representation — SVG Unit Circle ──── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Unit Circle Visualization</h2>
        <div className="w-full bg-[#060c1d] border border-[#132244] rounded-xl p-3 flex justify-center">
          <svg viewBox="0 0 300 300" className="w-full max-w-sm h-auto" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            <line x1={cx} y1="20" x2={cx} y2="280" stroke="#14264c" strokeWidth="0.5" />
            <line x1="20" y1={cy} x2="280" y2={cy} stroke="#14264c" strokeWidth="0.5" />

            {/* Unit circle */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e3a5f" strokeWidth="1.5" />

            {/* Axis labels */}
            <text x="275" y={cy - 5} fill="#64748b" fontSize="10">x</text>
            <text x={cx + 5} y="25" fill="#64748b" fontSize="10">y</text>
            <text x={cx + r + 3} y={cy + 12} fill="#475569" fontSize="8">1</text>
            <text x={cx - r - 10} y={cy + 12} fill="#475569" fontSize="8">−1</text>
            <text x={cx + 4} y={cy - r - 3} fill="#475569" fontSize="8">1</text>
            <text x={cx + 4} y={cy + r + 12} fill="#475569" fontSize="8">−1</text>

            {/* Special angle dots */}
            {specialAngles.filter(a => a < 360).map((deg) => {
              const rad = deg * (Math.PI / 180);
              const dx = cx + r * Math.cos(rad);
              const dy = cy - r * Math.sin(rad);
              return <circle key={deg} cx={dx} cy={dy} r={2} fill="#334155" />;
            })}

            {/* Angle arc */}
            {angleDeg > 0 && angleDeg < 360 && (() => {
              const arcR = 25;
              const endAngleRad = angleRad;
              const ax = cx + arcR * Math.cos(0);
              const ay = cy - arcR * Math.sin(0);
              const bx = cx + arcR * Math.cos(endAngleRad);
              const by = cy - arcR * Math.sin(endAngleRad);
              const largeArc = angleDeg > 180 ? 1 : 0;
              return (
                <path
                  d={`M ${ax} ${ay} A ${arcR} ${arcR} 0 ${largeArc} 0 ${bx} ${by}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  opacity={0.6}
                />
              );
            })()}

            {/* Angle label */}
            {(() => {
              const labelR = 35;
              const midAngle = angleRad / 2;
              const lx = cx + labelR * Math.cos(midAngle);
              const ly = cy - labelR * Math.sin(midAngle);
              return <text x={lx} y={ly} fill="#60a5fa" fontSize="9" textAnchor="middle">{angleDeg}°</text>;
            })()}

            {/* Angle ray */}
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#3b82f6" strokeWidth="2" />

            {/* cos projection (horizontal) */}
            <line x1={cx} y1={cy} x2={cx + r * cosX} y2={cy} stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* sin projection (vertical) */}
            <line x1={px} y1={cy} x2={px} y2={py} stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Point on circle */}
            <circle cx={px} cy={py} r={5} fill="#3b82f6" stroke="#93c5fd" strokeWidth="1.5" />

            {/* Point label */}
            <text
              x={px + (cosX >= 0 ? 8 : -8)}
              y={py + (sinY >= 0 ? -8 : 14)}
              fill="#e2e8f0"
              fontSize="8"
              textAnchor={cosX >= 0 ? 'start' : 'end'}
            >
              ({fmt(cosX)}, {fmt(sinY)})
            </text>

            {/* Legend */}
            <line x1="15" y1="285" x2="25" y2="285" stroke="#22d3ee" strokeWidth="2" />
            <text x="28" y="288" fill="#94a3b8" fontSize="7">cos θ</text>
            <line x1="65" y1="285" x2="75" y2="285" stroke="#f472b6" strokeWidth="2" />
            <text x="78" y="288" fill="#94a3b8" fontSize="7">sin θ</text>
          </svg>
        </div>
      </div>

      {/* ──── Special Angles Table ──── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Special Angles Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#14264c]">
                <th className="text-left text-slate-400 py-2 px-2">θ°</th>
                <th className="text-left text-slate-400 py-2 px-2">θ (rad)</th>
                <th className="text-left text-slate-400 py-2 px-2">sin θ</th>
                <th className="text-left text-slate-400 py-2 px-2">cos θ</th>
                <th className="text-left text-slate-400 py-2 px-2">tan θ</th>
              </tr>
            </thead>
            <tbody>
              {specialAngles.map((deg) => {
                const vals = getTrigValues(deg);
                const radFracs: Record<number, string> = {
                  0: '0', 30: 'π/6', 45: 'π/4', 60: 'π/3', 90: 'π/2',
                  120: '2π/3', 135: '3π/4', 150: '5π/6', 180: 'π',
                  210: '7π/6', 225: '5π/4', 240: '4π/3', 270: '3π/2',
                  300: '5π/3', 315: '7π/4', 330: '11π/6', 360: '2π',
                };
                const isActive = deg === angleDeg;
                return (
                  <tr
                    key={deg}
                    onClick={() => { setAngleDeg(deg === 360 ? 0 : deg); setAngleInput(String(deg === 360 ? 0 : deg)); }}
                    className={`border-b border-[#0e1d3a] cursor-pointer transition-colors ${
                      isActive ? 'bg-blue-600/10' : 'hover:bg-[#091530]'
                    }`}
                  >
                    <td className={`py-1.5 px-2 font-mono ${isActive ? 'text-blue-300 font-bold' : 'text-slate-300'}`}>{deg}°</td>
                    <td className="py-1.5 px-2 font-mono text-slate-400">{radFracs[deg]}</td>
                    <td className="py-1.5 px-2 font-mono text-blue-300">{fmt(vals.sin)}</td>
                    <td className="py-1.5 px-2 font-mono text-blue-300">{fmt(vals.cos)}</td>
                    <td className="py-1.5 px-2 font-mono text-blue-300">{fmt(vals.tan)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
            <h3 className="text-sm font-bold text-slate-100 mb-2">Example 1 — Basic: Coordinates at 30°</h3>
            <div className="space-y-1 text-sm text-slate-300">
              <p><span className="text-blue-400">Step 1:</span> On the unit circle at θ = 30°, x = cos 30° = √3/2 ≈ 0.866</p>
              <p><span className="text-blue-400">Step 2:</span> y = sin 30° = 1/2 = 0.5</p>
              <p><span className="text-blue-400">Step 3:</span> The point is <span className="font-mono text-blue-300 font-bold">(√3/2, 1/2)</span></p>
              <p><span className="text-blue-400">Verify:</span> (√3/2)² + (1/2)² = 3/4 + 1/4 = 1 ✓</p>
            </div>
          </div>

          {/* Example 2 */}
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244]">
            <h3 className="text-sm font-bold text-slate-100 mb-2">Example 2 — Challenging: All six values at 240°</h3>
            <div className="space-y-1 text-sm text-slate-300">
              <p><span className="text-blue-400">Step 1:</span> 240° is in Quadrant III. Reference angle = 240° − 180° = 60°.</p>
              <p><span className="text-blue-400">Step 2:</span> In Q III, both sin and cos are negative.</p>
              <p><span className="text-blue-400">Step 3:</span> cos 240° = −cos 60° = −1/2, sin 240° = −sin 60° = −√3/2</p>
              <p><span className="text-blue-400">Step 4:</span> tan 240° = (−√3/2)/(−1/2) = √3</p>
              <p><span className="text-blue-400">Step 5:</span> csc = −2/√3 = −2√3/3, sec = −2, cot = 1/√3 = √3/3</p>
              <p><span className="text-blue-400">Point:</span> <span className="font-mono text-blue-300 font-bold">(−1/2, −√3/2)</span></p>
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

        <p className="text-slate-300 text-sm mb-4">What are the coordinates at 45° on the unit circle?</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: '(√2/2, √2/2)', value: 0 },
            { label: '(1/2, √3/2)', value: 1 },
            { label: '(√3/2, 1/2)', value: 2 },
            { label: '(0, 1)', value: 3 },
          ].map((opt) => {
            const isSelected = practiceAnswer === opt.value;
            const isCorrect = opt.value === 0; // (√2/2, √2/2) is correct
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
            {practiceAnswer === 0 ? '✓ Correct! At 45°, the coordinates are (√2/2, √2/2) ≈ (0.7071, 0.7071).' : '✗ Incorrect. The correct answer is (√2/2, √2/2).'}
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
            <p><span className="text-blue-400">Step 1:</span> At 45°, the reference triangle is a 45-45-90 triangle with hypotenuse 1.</p>
            <p><span className="text-blue-400">Step 2:</span> The sides are 1/√2 = √2/2 each.</p>
            <p><span className="text-blue-400">Step 3:</span> cos 45° = √2/2, sin 45° = √2/2</p>
            <p><span className="text-blue-400">Step 4:</span> The point is <span className="font-mono text-blue-300 font-bold">(√2/2, √2/2) ≈ (0.7071, 0.7071)</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
