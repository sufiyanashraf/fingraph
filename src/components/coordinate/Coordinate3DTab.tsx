import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type ActionMode = 'distance' | 'section' | 'direction';

interface Result {
  label: string;
  value: string;
  steps: string[];
}

export default function Coordinate3DTab() {
  const [action, setAction] = useState<ActionMode>('distance');
  const [x1, setX1] = useState('');
  const [y1, setY1] = useState('');
  const [z1, setZ1] = useState('');
  const [x2, setX2] = useState('');
  const [y2, setY2] = useState('');
  const [z2, setZ2] = useState('');
  const [ratioM, setRatioM] = useState('');
  const [ratioN, setRatioN] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  // Practice state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  const actions: { key: ActionMode; label: string }[] = [
    { key: 'distance', label: 'Distance Between 3D Points' },
    { key: 'section', label: 'Section Formula' },
    { key: 'direction', label: 'Direction Cosines' },
  ];

  const handleReset = () => {
    setX1(''); setY1(''); setZ1('');
    setX2(''); setY2(''); setZ2('');
    setRatioM(''); setRatioN('');
    setResult(null);
  };

  const fmt = (v: number) => (v % 1 === 0 ? String(v) : v.toFixed(6));

  const handleCalculate = () => {
    const px1 = parseFloat(x1), py1 = parseFloat(y1), pz1 = parseFloat(z1);
    const px2 = parseFloat(x2), py2 = parseFloat(y2), pz2 = parseFloat(z2);

    if (isNaN(px1) || isNaN(py1) || isNaN(pz1) || isNaN(px2) || isNaN(py2) || isNaN(pz2)) {
      setResult({ label: 'Error', value: 'Invalid input', steps: ['Please enter valid numbers for all six coordinates.'] });
      return;
    }

    if (action === 'distance') {
      const dx = px2 - px1, dy = py2 - py1, dz = pz2 - pz1;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      setResult({
        label: 'Distance (3D)',
        value: `d = ${fmt(d)}`,
        steps: [
          `d = √[(x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²]`,
          `d = √[(${px2}−${px1})² + (${py2}−${py1})² + (${pz2}−${pz1})²]`,
          `d = √[(${dx})² + (${dy})² + (${dz})²]`,
          `d = √[${dx * dx} + ${dy * dy} + ${dz * dz}]`,
          `d = √${dx * dx + dy * dy + dz * dz}`,
          `d = ${fmt(d)}`,
        ],
      });
    } else if (action === 'section') {
      const m = parseFloat(ratioM), n = parseFloat(ratioN);
      if (isNaN(m) || isNaN(n)) {
        setResult({ label: 'Error', value: 'Invalid ratio', steps: ['Please enter valid values for the ratio m : n.'] });
        return;
      }
      if (m + n === 0) {
        setResult({ label: 'Error', value: 'Invalid ratio', steps: ['m + n cannot be zero (this would imply an external division at infinity).'] });
        return;
      }
      const px = (m * px2 + n * px1) / (m + n);
      const py = (m * py2 + n * py1) / (m + n);
      const pz = (m * pz2 + n * pz1) / (m + n);
      setResult({
        label: 'Section Point (Internal)',
        value: `P = (${fmt(px)}, ${fmt(py)}, ${fmt(pz)})`,
        steps: [
          `P = ((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n), (mz₂ + nz₁)/(m+n))`,
          `m = ${m}, n = ${n}, m + n = ${m + n}`,
          `Pₓ = (${m}×${px2} + ${n}×${px1}) / ${m + n} = ${m * px2 + n * px1} / ${m + n} = ${fmt(px)}`,
          `Pᵧ = (${m}×${py2} + ${n}×${py1}) / ${m + n} = ${m * py2 + n * py1} / ${m + n} = ${fmt(py)}`,
          `P_z = (${m}×${pz2} + ${n}×${pz1}) / ${m + n} = ${m * pz2 + n * pz1} / ${m + n} = ${fmt(pz)}`,
          `P = (${fmt(px)}, ${fmt(py)}, ${fmt(pz)})`,
        ],
      });
    } else if (action === 'direction') {
      const dx = px2 - px1, dy = py2 - py1, dz = pz2 - pz1;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d === 0) {
        setResult({ label: 'Error', value: 'Identical points', steps: ['Both points are the same. Direction cosines are undefined.'] });
        return;
      }
      const l = dx / d, m = dy / d, n = dz / d;
      setResult({
        label: 'Direction Cosines',
        value: `(l, m, n) = (${fmt(l)}, ${fmt(m)}, ${fmt(n)})`,
        steps: [
          `First find d = √[(${dx})² + (${dy})² + (${dz})²] = √${dx * dx + dy * dy + dz * dz} = ${fmt(d)}`,
          `l = (x₂−x₁)/d = ${dx}/${fmt(d)} = ${fmt(l)}`,
          `m = (y₂−y₁)/d = ${dy}/${fmt(d)} = ${fmt(m)}`,
          `n = (z₂−z₁)/d = ${dz}/${fmt(d)} = ${fmt(n)}`,
          `Verification: l² + m² + n² = ${fmt(l * l)} + ${fmt(m * m)} + ${fmt(n * n)} = ${fmt(l * l + m * m + n * n)}`,
        ],
      });
    }
  };

  // --- 3D-like projection graph ---
  const renderGraph = () => {
    const px1 = parseFloat(x1), py1 = parseFloat(y1), pz1 = parseFloat(z1);
    const px2 = parseFloat(x2), py2 = parseFloat(y2), pz2 = parseFloat(z2);
    const hasP1 = !isNaN(px1) && !isNaN(py1) && !isNaN(pz1);
    const hasP2 = !isNaN(px2) && !isNaN(py2) && !isNaN(pz2);

    const W = 340, H = 176;
    const cx = W / 2, cy = H / 2;

    // Simple isometric-like projection: x goes right, y goes up, z goes left-up
    const project = (x: number, y: number, z: number) => {
      const scale = 15;
      const sx = cx + (x - z * 0.4) * scale;
      const sy = cy - (y + z * 0.3) * scale;
      return { x: sx, y: sy };
    };

    // Axes
    const origin = project(0, 0, 0);
    const xAxis = project(5, 0, 0);
    const yAxis = project(0, 5, 0);
    const zAxis = project(0, 0, 5);

    // Determine scale for points
    const allVals = [];
    if (hasP1) allVals.push(Math.abs(px1), Math.abs(py1), Math.abs(pz1));
    if (hasP2) allVals.push(Math.abs(px2), Math.abs(py2), Math.abs(pz2));
    const maxVal = allVals.length > 0 ? Math.max(...allVals, 1) : 5;
    const dynScale = Math.min(15, 60 / maxVal);

    const projectDyn = (x: number, y: number, z: number) => {
      const sx = cx + (x - z * 0.4) * dynScale;
      const sy = cy - (y + z * 0.3) * dynScale;
      return { x: sx, y: sy };
    };

    const p1Proj = hasP1 ? projectDyn(px1, py1, pz1) : null;
    const p2Proj = hasP2 ? projectDyn(px2, py2, pz2) : null;

    // Section point
    let secProj: { x: number; y: number } | null = null;
    if (action === 'section' && hasP1 && hasP2 && result && !result.label.includes('Error')) {
      const m = parseFloat(ratioM), n = parseFloat(ratioN);
      if (!isNaN(m) && !isNaN(n) && m + n !== 0) {
        const spx = (m * px2 + n * px1) / (m + n);
        const spy = (m * py2 + n * py1) / (m + n);
        const spz = (m * pz2 + n * pz1) / (m + n);
        secProj = projectDyn(spx, spy, spz);
      }
    }

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        {/* Grid floor */}
        {[-4, -2, 0, 2, 4].map((v) => {
          const a = project(v, 0, -4), b = project(v, 0, 4);
          return <line key={`fx${v}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#0e1c38" strokeWidth={0.5} />;
        })}
        {[-4, -2, 0, 2, 4].map((v) => {
          const a = project(-4, 0, v), b = project(4, 0, v);
          return <line key={`fz${v}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#0e1c38" strokeWidth={0.5} />;
        })}

        {/* Axes */}
        <line x1={origin.x} y1={origin.y} x2={xAxis.x} y2={xAxis.y} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#arrowR)" />
        <line x1={origin.x} y1={origin.y} x2={yAxis.x} y2={yAxis.y} stroke="#22c55e" strokeWidth={1.2} markerEnd="url(#arrowG)" />
        <line x1={origin.x} y1={origin.y} x2={zAxis.x} y2={zAxis.y} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#arrowB)" />
        <text x={xAxis.x + 4} y={xAxis.y + 3} fill="#ef4444" fontSize="10" fontWeight="bold">x</text>
        <text x={yAxis.x - 6} y={yAxis.y - 2} fill="#22c55e" fontSize="10" fontWeight="bold">y</text>
        <text x={zAxis.x - 10} y={zAxis.y - 2} fill="#3b82f6" fontSize="10" fontWeight="bold">z</text>

        <defs>
          <marker id="arrowR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" /></marker>
          <marker id="arrowG" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#22c55e" /></marker>
          <marker id="arrowB" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" /></marker>
        </defs>

        {/* Connecting line */}
        {p1Proj && p2Proj && (
          <line x1={p1Proj.x} y1={p1Proj.y} x2={p2Proj.x} y2={p2Proj.y} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="6 3" />
        )}

        {/* Points */}
        {p1Proj && (
          <>
            <circle cx={p1Proj.x} cy={p1Proj.y} r={5} fill="#3b82f6" stroke="#93c5fd" strokeWidth={1.5} />
            <text x={p1Proj.x + 8} y={p1Proj.y - 6} fill="#93c5fd" fontSize="9" fontWeight="bold">P₁({px1},{py1},{pz1})</text>
          </>
        )}
        {p2Proj && (
          <>
            <circle cx={p2Proj.x} cy={p2Proj.y} r={5} fill="#f97316" stroke="#fdba74" strokeWidth={1.5} />
            <text x={p2Proj.x + 8} y={p2Proj.y - 6} fill="#fdba74" fontSize="9" fontWeight="bold">P₂({px2},{py2},{pz2})</text>
          </>
        )}

        {/* Section point */}
        {secProj && (
          <circle cx={secProj.x} cy={secProj.y} r={4} fill="#22d3ee" stroke="#67e8f9" strokeWidth={1.5} />
        )}
      </svg>
    );
  };

  const inputClass = "w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner";

  const practiceCorrect = 0; // index 0 = "3"
  const practiceOptions = ['3', '9', '√5', '5'];

  return (
    <div className="space-y-6">
      {/* ── Topic Header ── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          Coordinate Geometry
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-1">3D Coordinate Geometry</h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Extend planar concepts to three-dimensional space — compute distances, divide line segments in given ratios, and find direction cosines.
        </p>
      </div>

      {/* ── Mathematical Definition ── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-semibold text-sm">Mathematical Definition</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          In 3D space every point is represented as an ordered triple <span className="text-blue-300 font-mono">(x, y, z)</span>.
          The Euclidean distance generalises naturally, and direction cosines describe the orientation of the line joining two points.
        </p>
        <div className="bg-[#060c1d] rounded-lg p-3 font-mono text-sm text-blue-300 border border-[#132244]">
          d = √[(x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²] &nbsp;|&nbsp; l² + m² + n² = 1
        </div>
      </div>

      {/* ── Formula Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          {
            title: '3D Distance',
            formula: 'd = √[(x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²]',
            desc: 'Euclidean distance extended to three dimensions',
          },
          {
            title: 'Section Formula (Internal)',
            formula: 'P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n), (mz₂+nz₁)/(m+n))',
            desc: 'Point dividing segment in ratio m : n internally',
          },
          {
            title: 'Direction Cosines',
            formula: 'l = Δx/d,  m = Δy/d,  n = Δz/d',
            desc: 'Cosines of angles with x, y, z axes; l² + m² + n² = 1',
          },
        ].map((f, i) => (
          <div key={i} className="relative p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />
            <h3 className="text-slate-100 font-semibold text-sm mb-1 ml-2">{f.title}</h3>
            <div className="font-mono text-blue-300 text-sm mb-1 ml-2">{f.formula}</div>
            <p className="text-slate-400 text-xs ml-2">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Interactive Calculator ── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-semibold text-sm">Interactive Calculator</span>
        </div>

        {/* Action pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {actions.map((a) => (
            <button
              key={a.key}
              onClick={() => { setAction(a.key); setResult(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                action === a.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-[#070f22] text-slate-300 hover:text-white border border-[#162c57]'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Point 1 */}
        <p className="text-slate-400 text-xs mb-1 font-semibold">Point 1</p>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-slate-400 text-xs mb-1">x₁</label>
            <input type="number" value={x1} onChange={(e) => setX1(e.target.value)} className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">y₁</label>
            <input type="number" value={y1} onChange={(e) => setY1(e.target.value)} className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">z₁</label>
            <input type="number" value={z1} onChange={(e) => setZ1(e.target.value)} className={inputClass} placeholder="0" />
          </div>
        </div>

        {/* Point 2 */}
        <p className="text-slate-400 text-xs mb-1 font-semibold">Point 2</p>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-slate-400 text-xs mb-1">x₂</label>
            <input type="number" value={x2} onChange={(e) => setX2(e.target.value)} className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">y₂</label>
            <input type="number" value={y2} onChange={(e) => setY2(e.target.value)} className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">z₂</label>
            <input type="number" value={z2} onChange={(e) => setZ2(e.target.value)} className={inputClass} placeholder="0" />
          </div>
        </div>

        {/* Ratio inputs for section formula */}
        {action === 'section' && (
          <>
            <p className="text-slate-400 text-xs mb-1 font-semibold">Ratio m : n</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">m</label>
                <input type="number" value={ratioM} onChange={(e) => setRatioM(e.target.value)} className={inputClass} placeholder="1" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">n</label>
                <input type="number" value={ratioN} onChange={(e) => setRatioN(e.target.value)} className={inputClass} placeholder="1" />
              </div>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={handleCalculate} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Calculate
          </button>
          <button onClick={handleReset} className="p-2.5 rounded-xl bg-[#070f22] border border-[#162c57] hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 to-[#0e214d] border-2 border-blue-500 shadow-lg">
              <span className="text-slate-400 text-xs">{result.label}</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">{result.value}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#091530] border border-[#14264c]">
              <h4 className="text-slate-300 text-xs font-semibold mb-2">Step-by-step Solution</h4>
              <div className="space-y-1">
                {result.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-3 h-3 text-blue-500 mt-1 shrink-0" />
                    <span className="text-slate-300 font-mono">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Graphical Representation ── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <h3 className="text-slate-100 font-semibold text-sm mb-3">📐 Graphical Representation (Isometric Projection)</h3>
        <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-3">
          {renderGraph()}
        </div>
        <p className="text-slate-500 text-xs mt-2">Axes: <span className="text-red-400">x</span>, <span className="text-green-400">y</span>, <span className="text-blue-400">z</span>. Enter 3D coordinates to see the projected points.</p>
      </div>

      {/* ── Worked Examples ── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-semibold text-sm">Worked Examples</span>
        </div>
        <div className="space-y-4">
          {/* Example 1 — Distance */}
          <div className="p-4 rounded-xl bg-[#091530] border border-[#14264c]">
            <h4 className="text-slate-100 font-semibold text-sm mb-1">Example 1 — 3D Distance (Basic)</h4>
            <p className="text-slate-400 text-sm mb-2">Find the distance between <span className="text-blue-300 font-mono">(1, 2, 3)</span> and <span className="text-blue-300 font-mono">(4, 6, 3)</span>.</p>
            <div className="space-y-1 text-sm">
              {[
                'd = √[(x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²]',
                'd = √[(4−1)² + (6−2)² + (3−3)²]',
                'd = √[3² + 4² + 0²]',
                'd = √[9 + 16 + 0]',
                'd = √25 = 5',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-blue-500 mt-1 shrink-0" />
                  <span className="text-slate-300 font-mono">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Example 2 — Section Formula */}
          <div className="p-4 rounded-xl bg-[#091530] border border-[#14264c]">
            <h4 className="text-slate-100 font-semibold text-sm mb-1">Example 2 — Section Formula (Challenging)</h4>
            <p className="text-slate-400 text-sm mb-2">
              Find the point dividing the segment from <span className="text-blue-300 font-mono">(2, −3, 4)</span> to <span className="text-blue-300 font-mono">(−1, 6, 1)</span> in ratio <span className="text-blue-300 font-mono">2 : 1</span> internally.
            </p>
            <div className="space-y-1 text-sm">
              {[
                'P = ((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n), (mz₂ + nz₁)/(m+n))',
                'm = 2, n = 1, m + n = 3',
                'Pₓ = (2×(−1) + 1×2) / 3 = (−2 + 2) / 3 = 0/3 = 0',
                'Pᵧ = (2×6 + 1×(−3)) / 3 = (12 − 3) / 3 = 9/3 = 3',
                'P_z = (2×1 + 1×4) / 3 = (2 + 4) / 3 = 6/3 = 2',
                'P = (0, 3, 2)',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-blue-500 mt-1 shrink-0" />
                  <span className="text-slate-300 font-mono">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Practice Mode ── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-semibold text-sm">Practice Mode</span>
        </div>
        <p className="text-slate-200 text-sm font-medium mb-3">What is the distance between (0, 0, 0) and (1, 2, 2)?</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {practiceOptions.map((opt, i) => {
            const chosen = selectedAnswer === i;
            const isCorrect = i === practiceCorrect;
            let btnClass = 'p-3 rounded-xl text-sm font-mono transition-all cursor-pointer border ';
            if (chosen) {
              btnClass += isCorrect
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-400/40'
                : 'bg-red-600/20 border-red-500 text-red-300 ring-2 ring-red-400/40';
            } else {
              btnClass += 'bg-[#070f22] border-[#162c57] text-slate-300 hover:text-white hover:border-slate-500';
            }
            return (
              <button key={i} onClick={() => setSelectedAnswer(i)} className={btnClass}>
                {opt}
                {chosen && isCorrect && <CheckCircle2 className="inline w-4 h-4 ml-2 text-emerald-400" />}
              </button>
            );
          })}
        </div>
        {selectedAnswer !== null && (
          <div className={`p-3 rounded-xl text-sm mb-3 ${selectedAnswer === practiceCorrect ? 'bg-emerald-900/30 border border-emerald-600 text-emerald-300' : 'bg-red-900/30 border border-red-600 text-red-300'}`}>
            {selectedAnswer === practiceCorrect
              ? '✓ Correct! d = √(1 + 4 + 4) = √9 = 3'
              : '✗ Incorrect. Try again or view the solution below.'}
          </div>
        )}
        <button onClick={() => setShowPracticeSolution(!showPracticeSolution)} className="text-blue-400 hover:text-blue-300 text-xs font-medium cursor-pointer">
          {showPracticeSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
        {showPracticeSolution && (
          <div className="mt-2 p-3 rounded-xl bg-[#091530] border border-[#14264c] text-sm space-y-1">
            {[
              'd = √[(1−0)² + (2−0)² + (2−0)²]',
              'd = √[1 + 4 + 4]',
              'd = √9 = 3',
              'Answer: 3',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-blue-500 mt-1 shrink-0" />
                <span className="text-slate-300 font-mono">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
