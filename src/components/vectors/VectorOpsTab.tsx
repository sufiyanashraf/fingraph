import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type ActionMode = 'Magnitude' | 'Dot Product' | 'Cross Product' | 'Angle Between Vectors' | 'Unit Vector';

export default function VectorOpsTab() {
  const [action, setAction] = useState<ActionMode>('Magnitude');
  const [ax, setAx] = useState('');
  const [ay, setAy] = useState('');
  const [az, setAz] = useState('');
  const [bx, setBx] = useState('');
  const [by, setBy] = useState('');
  const [bz, setBz] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  // Practice mode
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  // Worked examples toggle
  const [showExample1, setShowExample1] = useState(false);
  const [showExample2, setShowExample2] = useState(false);

  const actions: ActionMode[] = ['Magnitude', 'Dot Product', 'Cross Product', 'Angle Between Vectors', 'Unit Vector'];

  const needsVectorB = action === 'Dot Product' || action === 'Cross Product' || action === 'Angle Between Vectors';

  const handleReset = () => {
    setAx(''); setAy(''); setAz('');
    setBx(''); setBy(''); setBz('');
    setResult(null); setSteps([]);
  };

  const handleCalculate = () => {
    const a = { x: parseFloat(ax) || 0, y: parseFloat(ay) || 0, z: parseFloat(az) || 0 };
    const b = { x: parseFloat(bx) || 0, y: parseFloat(by) || 0, z: parseFloat(bz) || 0 };

    const magA = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
    const magB = Math.sqrt(b.x ** 2 + b.y ** 2 + b.z ** 2);

    switch (action) {
      case 'Magnitude': {
        const s: string[] = [];
        s.push(`Given vector A = (${a.x}, ${a.y}, ${a.z})`);
        s.push(`|A| = √(ax² + ay² + az²)`);
        s.push(`|A| = √(${a.x}² + ${a.y}² + ${a.z}²)`);
        s.push(`|A| = √(${a.x ** 2} + ${a.y ** 2} + ${a.z ** 2})`);
        s.push(`|A| = √${a.x ** 2 + a.y ** 2 + a.z ** 2}`);
        s.push(`|A| = ${magA.toFixed(6)}`);
        setSteps(s);
        setResult(`|A| = ${magA.toFixed(6)}`);
        break;
      }
      case 'Dot Product': {
        const dot = a.x * b.x + a.y * b.y + a.z * b.z;
        const s: string[] = [];
        s.push(`Given A = (${a.x}, ${a.y}, ${a.z}), B = (${b.x}, ${b.y}, ${b.z})`);
        s.push(`A·B = ax×bx + ay×by + az×bz`);
        s.push(`A·B = (${a.x})(${b.x}) + (${a.y})(${b.y}) + (${a.z})(${b.z})`);
        s.push(`A·B = ${a.x * b.x} + ${a.y * b.y} + ${a.z * b.z}`);
        s.push(`A·B = ${dot}`);
        setSteps(s);
        setResult(`A·B = ${dot}`);
        break;
      }
      case 'Cross Product': {
        const cx = a.y * b.z - a.z * b.y;
        const cy = a.z * b.x - a.x * b.z;
        const cz = a.x * b.y - a.y * b.x;
        const s: string[] = [];
        s.push(`Given A = (${a.x}, ${a.y}, ${a.z}), B = (${b.x}, ${b.y}, ${b.z})`);
        s.push(`A×B = (ay·bz − az·by, az·bx − ax·bz, ax·by − ay·bx)`);
        s.push(`i-component: (${a.y})(${b.z}) − (${a.z})(${b.y}) = ${a.y * b.z} − ${a.z * b.y} = ${cx}`);
        s.push(`j-component: (${a.z})(${b.x}) − (${a.x})(${b.z}) = ${a.z * b.x} − ${a.x * b.z} = ${cy}`);
        s.push(`k-component: (${a.x})(${b.y}) − (${a.y})(${b.x}) = ${a.x * b.y} − ${a.y * b.x} = ${cz}`);
        s.push(`A×B = (${cx}, ${cy}, ${cz})`);
        setSteps(s);
        setResult(`A×B = (${cx}, ${cy}, ${cz})`);
        break;
      }
      case 'Angle Between Vectors': {
        if (magA === 0 || magB === 0) {
          setResult('Error: Cannot compute angle — one or both vectors have zero magnitude.');
          setSteps(['One or both vectors are zero vectors. Angle is undefined.']);
          break;
        }
        const dot = a.x * b.x + a.y * b.y + a.z * b.z;
        const cosTheta = Math.max(-1, Math.min(1, dot / (magA * magB)));
        const radians = Math.acos(cosTheta);
        const degrees = radians * (180 / Math.PI);
        const s: string[] = [];
        s.push(`Given A = (${a.x}, ${a.y}, ${a.z}), B = (${b.x}, ${b.y}, ${b.z})`);
        s.push(`A·B = ${dot}`);
        s.push(`|A| = ${magA.toFixed(6)}, |B| = ${magB.toFixed(6)}`);
        s.push(`cos(θ) = A·B / (|A| × |B|) = ${dot} / (${magA.toFixed(6)} × ${magB.toFixed(6)})`);
        s.push(`cos(θ) = ${dot} / ${(magA * magB).toFixed(6)} = ${cosTheta.toFixed(6)}`);
        s.push(`θ = arccos(${cosTheta.toFixed(6)})`);
        s.push(`θ = ${radians.toFixed(6)} rad = ${degrees.toFixed(4)}°`);
        setSteps(s);
        setResult(`θ = ${degrees.toFixed(4)}° (${radians.toFixed(6)} rad)`);
        break;
      }
      case 'Unit Vector': {
        if (magA === 0) {
          setResult('Error: Cannot compute unit vector of a zero vector.');
          setSteps(['The zero vector has no direction, so its unit vector is undefined.']);
          break;
        }
        const ux = a.x / magA;
        const uy = a.y / magA;
        const uz = a.z / magA;
        const s: string[] = [];
        s.push(`Given A = (${a.x}, ${a.y}, ${a.z})`);
        s.push(`|A| = √(${a.x}² + ${a.y}² + ${a.z}²) = ${magA.toFixed(6)}`);
        s.push(`Â = A / |A|`);
        s.push(`Â = (${a.x}/${magA.toFixed(6)}, ${a.y}/${magA.toFixed(6)}, ${a.z}/${magA.toFixed(6)})`);
        s.push(`Â = (${ux.toFixed(6)}, ${uy.toFixed(6)}, ${uz.toFixed(6)})`);
        s.push(`Verification: |Â| = √(${ux.toFixed(4)}² + ${uy.toFixed(4)}² + ${uz.toFixed(4)}²) = ${Math.sqrt(ux ** 2 + uy ** 2 + uz ** 2).toFixed(6)} ≈ 1`);
        setSteps(s);
        setResult(`Â = (${ux.toFixed(6)}, ${uy.toFixed(6)}, ${uz.toFixed(6)})`);
        break;
      }
    }
  };

  const inputClass = 'w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner';

  // SVG vector graph
  const renderGraph = () => {
    const a = { x: parseFloat(ax) || 0, y: parseFloat(ay) || 0 };
    const b = { x: parseFloat(bx) || 0, y: parseFloat(by) || 0 };

    const allX = [0, a.x, b.x];
    const allY = [0, a.y, b.y];
    if (!needsVectorB) { allX.pop(); allY.pop(); }

    const maxVal = Math.max(1, ...allX.map(Math.abs), ...allY.map(Math.abs));
    const scale = 70 / maxVal;
    const cx = 160, cy = 88;

    const toSvg = (vx: number, vy: number) => ({
      sx: cx + vx * scale,
      sy: cy - vy * scale
    });

    const aEnd = toSvg(a.x, a.y);
    const bEnd = toSvg(b.x, b.y);

    return (
      <svg className="w-full h-44" viewBox="0 0 320 176">
        <rect width="320" height="176" fill="#060c1d" rx="12" />
        {/* Grid lines */}
        <line x1="0" y1={cy} x2="320" y2={cy} stroke="#132244" strokeWidth="1" />
        <line x1={cx} y1="0" x2={cx} y2="176" stroke="#132244" strokeWidth="1" />
        {/* Axis labels */}
        <text x="310" y={cy - 4} fill="#475569" fontSize="10" textAnchor="end">x</text>
        <text x={cx + 6} y="14" fill="#475569" fontSize="10">y</text>

        {/* Vector A */}
        <line x1={cx} y1={cy} x2={aEnd.sx} y2={aEnd.sy} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowA)" />
        <defs>
          <marker id="arrowA" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
          <marker id="arrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>
        <text x={aEnd.sx + 6} y={aEnd.sy - 6} fill="#3b82f6" fontSize="11" fontWeight="bold">A</text>

        {/* Vector B */}
        {needsVectorB && (
          <>
            <line x1={cx} y1={cy} x2={bEnd.sx} y2={bEnd.sy} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowB)" />
            <text x={bEnd.sx + 6} y={bEnd.sy - 6} fill="#f59e0b" fontSize="11" fontWeight="bold">B</text>
          </>
        )}

        {/* Origin label */}
        <text x={cx - 12} y={cy + 14} fill="#64748b" fontSize="9">O</text>
      </svg>
    );
  };

  const practiceOptions = [0, 1, -1, 1.414];
  const correctPracticeAnswer = 0;

  return (
    <div className="space-y-6">
      {/* ─── Topic Header ─── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          Vectors &amp; Matrices
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-2">Vector Operations</h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Compute magnitude, dot product, cross product, angles, and unit vectors for 3D vectors.
        </p>
      </div>

      {/* ─── Mathematical Definition ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Mathematical Definition</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          A <strong className="text-blue-300">vector</strong> in 3D space is an ordered triple <span className="font-mono text-blue-300">A = (aₓ, aᵧ, a_z)</span> representing both magnitude and direction. Vector operations form the backbone of physics, engineering, and computer graphics.
        </p>
        <div className="bg-[#060c1d] rounded-lg p-3 border border-[#132244]">
          <code className="text-blue-300 font-mono text-sm">
            |A| = √(aₓ² + aᵧ² + a_z²) &nbsp;|&nbsp; A·B = Σ aᵢbᵢ &nbsp;|&nbsp; A×B = det([î, ĵ, k̂; A; B])
          </code>
        </div>
      </div>

      {/* ─── Formula Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: 'Magnitude', formula: '|A| = √(aₓ² + aᵧ² + a_z²)', desc: 'Length/norm of vector A' },
          { title: 'Dot Product', formula: 'A·B = aₓbₓ + aᵧbᵧ + a_zb_z', desc: 'Scalar measure of alignment' },
          { title: 'Cross Product', formula: 'A×B = (aᵧb_z − a_zbᵧ, a_zbₓ − aₓb_z, aₓbᵧ − aᵧbₓ)', desc: 'Vector perpendicular to both' },
          { title: 'Unit Vector', formula: 'Â = A / |A|', desc: 'Direction with magnitude 1' },
          { title: 'Angle Between Vectors', formula: 'θ = arccos(A·B / (|A|·|B|))', desc: 'Angle in [0, π]' },
        ].map((card) => (
          <div key={card.title} className="relative p-4 pl-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />
            <h3 className="text-sm font-semibold text-slate-100 mb-1">{card.title}</h3>
            <p className="font-mono text-blue-300 text-xs sm:text-sm mb-1">{card.formula}</p>
            <p className="text-slate-400 text-xs">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* ─── Interactive Calculator ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Interactive Calculator</h2>
        </div>

        {/* Action pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {actions.map((a) => (
            <button
              key={a}
              onClick={() => { setAction(a); setResult(null); setSteps([]); }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                action === a
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-[#070f22] text-slate-300 hover:text-white border border-[#162c57]'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-sm text-slate-300 mb-2 font-medium">Vector A = (aₓ, aᵧ, a_z)</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">aₓ</label>
                <input type="number" value={ax} onChange={(e) => setAx(e.target.value)} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">aᵧ</label>
                <input type="number" value={ay} onChange={(e) => setAy(e.target.value)} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">a_z</label>
                <input type="number" value={az} onChange={(e) => setAz(e.target.value)} placeholder="0" className={inputClass} />
              </div>
            </div>
          </div>
          {needsVectorB && (
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">Vector B = (bₓ, bᵧ, b_z)</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">bₓ</label>
                  <input type="number" value={bx} onChange={(e) => setBx(e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">bᵧ</label>
                  <input type="number" value={by} onChange={(e) => setBy(e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">b_z</label>
                  <input type="number" value={bz} onChange={(e) => setBz(e.target.value)} placeholder="0" className={inputClass} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={handleCalculate} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Calculate
          </button>
          <button onClick={handleReset} className="p-2.5 rounded-xl bg-[#070f22] border border-[#162c57] hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 to-[#0e214d] border-2 border-blue-500 shadow-lg mb-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-slate-100">Result</span>
            </div>
            <p className="text-xl font-mono text-blue-300 font-bold">{result}</p>
          </div>
        )}

        {/* Step-by-step */}
        {steps.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">Step-by-Step Solution</h3>
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#060c1d] border border-[#132244]">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300 font-mono">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Graphical Representation ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Graphical Representation</h2>
        <p className="text-slate-400 text-xs mb-3">2D projection of vectors onto the xy-plane. Enter values above to see them update.</p>
        <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-0 overflow-hidden">
          {renderGraph()}
        </div>
      </div>

      {/* ─── Worked Examples ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Worked Examples</h2>
        </div>

        {/* Example 1: Basic */}
        <div className="mb-4 p-3 rounded-xl bg-[#060c1d] border border-[#132244]">
          <button onClick={() => setShowExample1(!showExample1)} className="w-full flex items-center justify-between text-left cursor-pointer">
            <span className="text-sm font-semibold text-slate-100">Example 1 (Basic): Dot Product of A = (1, 2, 3) and B = (4, 5, 6)</span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showExample1 ? 'rotate-90' : ''}`} />
          </button>
          {showExample1 && (
            <div className="mt-3 space-y-2">
              {[
                'Given A = (1, 2, 3) and B = (4, 5, 6)',
                'A·B = aₓbₓ + aᵧbᵧ + a_zb_z',
                'A·B = (1)(4) + (2)(5) + (3)(6)',
                'A·B = 4 + 10 + 18',
                'A·B = 32',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300 font-mono">{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Example 2: Challenging */}
        <div className="p-3 rounded-xl bg-[#060c1d] border border-[#132244]">
          <button onClick={() => setShowExample2(!showExample2)} className="w-full flex items-center justify-between text-left cursor-pointer">
            <span className="text-sm font-semibold text-slate-100">Example 2 (Challenging): Cross Product of A = (1, 2, 3) and B = (4, 5, 6)</span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showExample2 ? 'rotate-90' : ''}`} />
          </button>
          {showExample2 && (
            <div className="mt-3 space-y-2">
              {[
                'Given A = (1, 2, 3) and B = (4, 5, 6)',
                'A×B = (aᵧb_z − a_zbᵧ,  a_zbₓ − aₓb_z,  aₓbᵧ − aᵧbₓ)',
                'i-component: (2)(6) − (3)(5) = 12 − 15 = −3',
                'j-component: (3)(4) − (1)(6) = 12 − 6 = 6',
                'k-component: (1)(5) − (2)(4) = 5 − 8 = −3',
                'A×B = (−3, 6, −3)',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300 font-mono">{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Practice Mode ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-slate-100">Practice Mode</h2>
        </div>

        <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244] mb-4">
          <p className="text-sm text-slate-100 font-semibold mb-3">
            What is the dot product of (1, 0, 0) and (0, 1, 0)?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {practiceOptions.map((opt, idx) => {
              const isSelected = practiceAnswer === idx;
              const isCorrect = opt === correctPracticeAnswer;
              let btnClass = 'p-2.5 rounded-xl text-sm font-mono font-medium transition-all cursor-pointer border ';
              if (isSelected) {
                btnClass += isCorrect
                  ? 'bg-green-600/20 border-green-500 text-green-300 ring-2 ring-green-400/40'
                  : 'bg-red-600/20 border-red-500 text-red-300 ring-2 ring-red-400/40';
              } else {
                btnClass += 'bg-[#070f22] border-[#162c57] text-slate-300 hover:text-white hover:border-slate-500';
              }
              return (
                <button key={idx} onClick={() => setPracticeAnswer(idx)} className={btnClass}>
                  {opt === 1.414 ? '√2' : opt}
                  {isSelected && (
                    <span className="ml-2">{isCorrect ? '✓' : '✗'}</span>
                  )}
                </button>
              );
            })}
          </div>

          {practiceAnswer !== null && practiceOptions[practiceAnswer] === correctPracticeAnswer && (
            <div className="mt-3 p-3 rounded-lg bg-green-900/30 border border-green-600/40">
              <p className="text-sm text-green-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Correct!
              </p>
              <p className="text-xs text-green-400 mt-1">The vectors (1,0,0) and (0,1,0) are perpendicular, so their dot product is 0.</p>
            </div>
          )}

          {practiceAnswer !== null && practiceOptions[practiceAnswer] !== correctPracticeAnswer && (
            <div className="mt-3 p-3 rounded-lg bg-red-900/30 border border-red-600/40">
              <p className="text-sm text-red-300 font-semibold">Incorrect — try again or view the solution below.</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowPracticeSolution(!showPracticeSolution)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${showPracticeSolution ? 'rotate-90' : ''}`} />
          {showPracticeSolution ? 'Hide Solution' : 'Show Solution'}
        </button>

        {showPracticeSolution && (
          <div className="mt-3 space-y-2 p-3 rounded-xl bg-[#060c1d] border border-[#132244]">
            {[
              'A = (1, 0, 0), B = (0, 1, 0)',
              'A·B = (1)(0) + (0)(1) + (0)(0)',
              'A·B = 0 + 0 + 0 = 0',
              'These vectors are perpendicular (orthogonal), so A·B = 0.',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300 font-mono">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
