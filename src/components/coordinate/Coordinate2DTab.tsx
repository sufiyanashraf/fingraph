import { useState, type ReactNode } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type ActionMode = 'distance' | 'midpoint' | 'slope' | 'equation' | 'area';

interface Result {
  label: string;
  value: string;
  steps: string[];
}

export default function Coordinate2DTab() {
  const [action, setAction] = useState<ActionMode>('distance');
  const [x1, setX1] = useState('');
  const [y1, setY1] = useState('');
  const [x2, setX2] = useState('');
  const [y2, setY2] = useState('');
  const [x3, setX3] = useState('');
  const [y3, setY3] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  // Practice state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  const actions: { key: ActionMode; label: string }[] = [
    { key: 'distance', label: 'Distance Between Points' },
    { key: 'midpoint', label: 'Midpoint' },
    { key: 'slope', label: 'Slope of Line' },
    { key: 'equation', label: 'Equation of Line' },
    { key: 'area', label: 'Area of Triangle' },
  ];

  const handleReset = () => {
    setX1(''); setY1(''); setX2(''); setY2(''); setX3(''); setY3('');
    setResult(null);
  };

  const handleCalculate = () => {
    const px1 = parseFloat(x1), py1 = parseFloat(y1);
    const px2 = parseFloat(x2), py2 = parseFloat(y2);

    if (isNaN(px1) || isNaN(py1) || isNaN(px2) || isNaN(py2)) {
      setResult({ label: 'Error', value: 'Invalid input', steps: ['Please enter valid numbers for all required fields.'] });
      return;
    }

    if (action === 'distance') {
      const dx = px2 - px1;
      const dy = py2 - py1;
      const d = Math.sqrt(dx * dx + dy * dy);
      setResult({
        label: 'Distance',
        value: `d = ${d % 1 === 0 ? d : d.toFixed(6)}`,
        steps: [
          `d = √[(x₂ − x₁)² + (y₂ − y₁)²]`,
          `d = √[(${px2} − ${px1})² + (${py2} − ${py1})²]`,
          `d = √[(${dx})² + (${dy})²]`,
          `d = √[${dx * dx} + ${dy * dy}]`,
          `d = √${dx * dx + dy * dy}`,
          `d = ${d % 1 === 0 ? d : d.toFixed(6)}`,
        ],
      });
    } else if (action === 'midpoint') {
      const mx = (px1 + px2) / 2;
      const my = (py1 + py2) / 2;
      setResult({
        label: 'Midpoint',
        value: `M = (${mx % 1 === 0 ? mx : mx.toFixed(4)}, ${my % 1 === 0 ? my : my.toFixed(4)})`,
        steps: [
          `M = ((x₁ + x₂)/2, (y₁ + y₂)/2)`,
          `M = ((${px1} + ${px2})/2, (${py1} + ${py2})/2)`,
          `M = (${px1 + px2}/2, ${py1 + py2}/2)`,
          `M = (${mx % 1 === 0 ? mx : mx.toFixed(4)}, ${my % 1 === 0 ? my : my.toFixed(4)})`,
        ],
      });
    } else if (action === 'slope') {
      const dx = px2 - px1;
      const dy = py2 - py1;
      if (dx === 0) {
        setResult({
          label: 'Slope',
          value: 'Undefined (vertical line)',
          steps: [
            `m = (y₂ − y₁) / (x₂ − x₁)`,
            `m = (${py2} − ${py1}) / (${px2} − ${px1})`,
            `m = ${dy} / 0`,
            `The slope is undefined because the line is vertical (x₁ = x₂).`,
          ],
        });
      } else {
        const m = dy / dx;
        setResult({
          label: 'Slope',
          value: `m = ${m % 1 === 0 ? m : m.toFixed(6)}`,
          steps: [
            `m = (y₂ − y₁) / (x₂ − x₁)`,
            `m = (${py2} − ${py1}) / (${px2} − ${px1})`,
            `m = ${dy} / ${dx}`,
            `m = ${m % 1 === 0 ? m : m.toFixed(6)}`,
          ],
        });
      }
    } else if (action === 'equation') {
      const dx = px2 - px1;
      const dy = py2 - py1;
      if (dx === 0) {
        setResult({
          label: 'Equation of Line',
          value: `x = ${px1}`,
          steps: [
            `Since x₁ = x₂ = ${px1}, the line is vertical.`,
            `Equation: x = ${px1}`,
          ],
        });
      } else {
        const m = dy / dx;
        const c = py1 - m * px1;
        const mStr = m % 1 === 0 ? String(m) : m.toFixed(6);
        const cStr = c % 1 === 0 ? String(c) : c.toFixed(6);
        const cSign = c >= 0 ? `+ ${cStr}` : `− ${Math.abs(c) % 1 === 0 ? Math.abs(c) : Math.abs(c).toFixed(6)}`;
        setResult({
          label: 'Equation of Line',
          value: `y = ${mStr}x ${cSign}`,
          steps: [
            `First, find slope: m = (y₂ − y₁) / (x₂ − x₁)`,
            `m = (${py2} − ${py1}) / (${px2} − ${px1}) = ${dy} / ${dx} = ${mStr}`,
            `Using point-slope form: y − y₁ = m(x − x₁)`,
            `y − ${py1} = ${mStr}(x − ${px1})`,
            `y = ${mStr}x − ${mStr} × ${px1} + ${py1}`,
            `y = ${mStr}x ${cSign}`,
          ],
        });
      }
    } else if (action === 'area') {
      const px3 = parseFloat(x3), py3 = parseFloat(y3);
      if (isNaN(px3) || isNaN(py3)) {
        setResult({ label: 'Error', value: 'Invalid input', steps: ['Please enter valid coordinates for all three points.'] });
        return;
      }
      const areaVal = Math.abs(px1 * (py2 - py3) + px2 * (py3 - py1) + px3 * (py1 - py2)) / 2;
      setResult({
        label: 'Area of Triangle',
        value: `A = ${areaVal % 1 === 0 ? areaVal : areaVal.toFixed(6)} sq. units`,
        steps: [
          `A = ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|`,
          `A = ½|${px1}(${py2} − ${py3}) + ${px2}(${py3} − ${py1}) + ${px3}(${py1} − ${py2})|`,
          `A = ½|${px1}(${py2 - py3}) + ${px2}(${py3 - py1}) + ${px3}(${py1 - py2})|`,
          `A = ½|${px1 * (py2 - py3)} + ${px2 * (py3 - py1)} + ${px3 * (py1 - py2)}|`,
          `A = ½|${px1 * (py2 - py3) + px2 * (py3 - py1) + px3 * (py1 - py2)}|`,
          `A = ½ × ${Math.abs(px1 * (py2 - py3) + px2 * (py3 - py1) + px3 * (py1 - py2))}`,
          `A = ${areaVal % 1 === 0 ? areaVal : areaVal.toFixed(6)} sq. units`,
        ],
      });
    }
  };

  // --- Graph helpers ---
  const renderGraph = () => {
    const px1 = parseFloat(x1), py1 = parseFloat(y1);
    const px2 = parseFloat(x2), py2 = parseFloat(y2);
    const hasP1 = !isNaN(px1) && !isNaN(py1);
    const hasP2 = !isNaN(px2) && !isNaN(py2);
    const hasP3 = action === 'area' && !isNaN(parseFloat(x3)) && !isNaN(parseFloat(y3));
    const px3n = parseFloat(x3), py3n = parseFloat(y3);

    const allX: number[] = [];
    const allY: number[] = [];
    if (hasP1) { allX.push(px1); allY.push(py1); }
    if (hasP2) { allX.push(px2); allY.push(py2); }
    if (hasP3) { allX.push(px3n); allY.push(py3n); }
    if (allX.length === 0) { allX.push(-5, 5); allY.push(-5, 5); }

    const pad = 2;
    let minX = Math.min(...allX) - pad;
    let maxX = Math.max(...allX) + pad;
    let minY = Math.min(...allY) - pad;
    let maxY = Math.max(...allY) + pad;
    if (maxX - minX < 4) { minX -= 2; maxX += 2; }
    if (maxY - minY < 4) { minY -= 2; maxY += 2; }

    const W = 340, H = 176;
    const mL = 30, mR = 15, mT = 15, mB = 25;
    const plotW = W - mL - mR, plotH = H - mT - mB;

    const toSvgX = (v: number) => mL + ((v - minX) / (maxX - minX)) * plotW;
    const toSvgY = (v: number) => mT + ((maxY - v) / (maxY - minY)) * plotH;

    // Grid lines
    const gridLines: ReactNode[] = [];
    const xStep = Math.max(1, Math.ceil((maxX - minX) / 8));
    const yStep = Math.max(1, Math.ceil((maxY - minY) / 6));
    for (let gx = Math.ceil(minX); gx <= Math.floor(maxX); gx += xStep) {
      const sx = toSvgX(gx);
      gridLines.push(<line key={`gx${gx}`} x1={sx} y1={mT} x2={sx} y2={H - mB} stroke="#162c57" strokeWidth={gx === 0 ? 1.5 : 0.5} />);
      gridLines.push(<text key={`lx${gx}`} x={sx} y={H - mB + 14} fill="#64748b" fontSize="9" textAnchor="middle">{gx}</text>);
    }
    for (let gy = Math.ceil(minY); gy <= Math.floor(maxY); gy += yStep) {
      const sy = toSvgY(gy);
      gridLines.push(<line key={`gy${gy}`} x1={mL} y1={sy} x2={W - mR} y2={sy} stroke="#162c57" strokeWidth={gy === 0 ? 1.5 : 0.5} />);
      gridLines.push(<text key={`ly${gy}`} x={mL - 5} y={sy + 3} fill="#64748b" fontSize="9" textAnchor="end">{gy}</text>);
    }

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        {gridLines}
        {/* Axes if in view */}
        {minX <= 0 && maxX >= 0 && <line x1={toSvgX(0)} y1={mT} x2={toSvgX(0)} y2={H - mB} stroke="#1e3a6e" strokeWidth={1.2} />}
        {minY <= 0 && maxY >= 0 && <line x1={mL} y1={toSvgY(0)} x2={W - mR} y2={toSvgY(0)} stroke="#1e3a6e" strokeWidth={1.2} />}

        {/* Line / Triangle */}
        {hasP1 && hasP2 && !hasP3 && (
          <line x1={toSvgX(px1)} y1={toSvgY(py1)} x2={toSvgX(px2)} y2={toSvgY(py2)} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="6 3" />
        )}
        {hasP1 && hasP2 && hasP3 && (
          <polygon
            points={`${toSvgX(px1)},${toSvgY(py1)} ${toSvgX(px2)},${toSvgY(py2)} ${toSvgX(px3n)},${toSvgY(py3n)}`}
            fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth={1.5}
          />
        )}

        {/* Midpoint */}
        {hasP1 && hasP2 && action === 'midpoint' && result && (
          <circle cx={toSvgX((px1 + px2) / 2)} cy={toSvgY((py1 + py2) / 2)} r={4} fill="#22d3ee" />
        )}

        {/* Points */}
        {hasP1 && (
          <>
            <circle cx={toSvgX(px1)} cy={toSvgY(py1)} r={5} fill="#3b82f6" stroke="#93c5fd" strokeWidth={1.5} />
            <text x={toSvgX(px1) + 8} y={toSvgY(py1) - 6} fill="#93c5fd" fontSize="10" fontWeight="bold">P₁({px1},{py1})</text>
          </>
        )}
        {hasP2 && (
          <>
            <circle cx={toSvgX(px2)} cy={toSvgY(py2)} r={5} fill="#f97316" stroke="#fdba74" strokeWidth={1.5} />
            <text x={toSvgX(px2) + 8} y={toSvgY(py2) - 6} fill="#fdba74" fontSize="10" fontWeight="bold">P₂({px2},{py2})</text>
          </>
        )}
        {hasP3 && (
          <>
            <circle cx={toSvgX(px3n)} cy={toSvgY(py3n)} r={5} fill="#a855f7" stroke="#c084fc" strokeWidth={1.5} />
            <text x={toSvgX(px3n) + 8} y={toSvgY(py3n) - 6} fill="#c084fc" fontSize="10" fontWeight="bold">P₃({px3n},{py3n})</text>
          </>
        )}
      </svg>
    );
  };

  const inputClass = "w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner";

  const practiceCorrect = 0; // index 0 = "5"
  const practiceOptions = ['5', '7', '25', '√7'];

  return (
    <div className="space-y-6">
      {/* ── Topic Header ── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          Coordinate Geometry
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-1">2D Coordinate Geometry</h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Analyze relationships between points, lines, and shapes on the Cartesian plane using algebraic formulas.
        </p>
      </div>

      {/* ── Mathematical Definition ── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-semibold text-sm">Mathematical Definition</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          The Cartesian coordinate system assigns every point in the plane an ordered pair <span className="text-blue-300 font-mono">(x, y)</span>.
          Using the coordinates of points, we can compute distances, midpoints, slopes, equations of lines, and areas of polygons.
        </p>
        <div className="bg-[#060c1d] rounded-lg p-3 font-mono text-sm text-blue-300 border border-[#132244]">
          d = √[(x₂ − x₁)² + (y₂ − y₁)²]  &nbsp;|&nbsp;  M = ((x₁+x₂)/2, (y₁+y₂)/2)
        </div>
      </div>

      {/* ── Formula Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { title: 'Distance', formula: 'd = √[(x₂−x₁)² + (y₂−y₁)²]', desc: 'd = Euclidean distance between two points' },
          { title: 'Midpoint', formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)', desc: 'M = point equidistant from both endpoints' },
          { title: 'Slope', formula: 'm = (y₂−y₁) / (x₂−x₁)', desc: 'm = rise over run (rate of change)' },
          { title: 'Line Equation', formula: 'y − y₁ = m(x − x₁) → y = mx + c', desc: 'c = y-intercept, m = slope' },
          { title: 'Triangle Area', formula: 'A = ½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|', desc: 'Shoelace formula for 3 vertices' },
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

        {/* Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-slate-400 text-xs mb-1">x₁</label>
            <input type="number" value={x1} onChange={(e) => setX1(e.target.value)} className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">y₁</label>
            <input type="number" value={y1} onChange={(e) => setY1(e.target.value)} className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">x₂</label>
            <input type="number" value={x2} onChange={(e) => setX2(e.target.value)} className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">y₂</label>
            <input type="number" value={y2} onChange={(e) => setY2(e.target.value)} className={inputClass} placeholder="0" />
          </div>
        </div>
        {action === 'area' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1">x₃</label>
              <input type="number" value={x3} onChange={(e) => setX3(e.target.value)} className={inputClass} placeholder="0" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">y₃</label>
              <input type="number" value={y3} onChange={(e) => setY3(e.target.value)} className={inputClass} placeholder="0" />
            </div>
          </div>
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
        <h3 className="text-slate-100 font-semibold text-sm mb-3">📐 Graphical Representation</h3>
        <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-3">
          {renderGraph()}
        </div>
        <p className="text-slate-500 text-xs mt-2">Enter point coordinates above to see them plotted on the Cartesian plane.</p>
      </div>

      {/* ── Worked Examples ── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-semibold text-sm">Worked Examples</span>
        </div>
        <div className="space-y-4">
          {/* Example 1 */}
          <div className="p-4 rounded-xl bg-[#091530] border border-[#14264c]">
            <h4 className="text-slate-100 font-semibold text-sm mb-1">Example 1 — Distance (Basic)</h4>
            <p className="text-slate-400 text-sm mb-2">Find the distance between <span className="text-blue-300 font-mono">(1, 2)</span> and <span className="text-blue-300 font-mono">(4, 6)</span>.</p>
            <div className="space-y-1 text-sm">
              {[
                'd = √[(x₂ − x₁)² + (y₂ − y₁)²]',
                'd = √[(4 − 1)² + (6 − 2)²]',
                'd = √[3² + 4²]',
                'd = √[9 + 16]',
                'd = √25 = 5',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-blue-500 mt-1 shrink-0" />
                  <span className="text-slate-300 font-mono">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Example 2 */}
          <div className="p-4 rounded-xl bg-[#091530] border border-[#14264c]">
            <h4 className="text-slate-100 font-semibold text-sm mb-1">Example 2 — Midpoint (Challenging)</h4>
            <p className="text-slate-400 text-sm mb-2">Find the midpoint of <span className="text-blue-300 font-mono">(−3, 5)</span> and <span className="text-blue-300 font-mono">(7, −1)</span>.</p>
            <div className="space-y-1 text-sm">
              {[
                'M = ((x₁ + x₂)/2, (y₁ + y₂)/2)',
                'M = ((−3 + 7)/2, (5 + (−1))/2)',
                'M = (4/2, 4/2)',
                'M = (2, 2)',
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
        <p className="text-slate-200 text-sm font-medium mb-3">What is the distance between (0, 0) and (3, 4)?</p>
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
              ? '✓ Correct! d = √(9+16) = √25 = 5'
              : '✗ Incorrect. Try again or view the solution below.'}
          </div>
        )}
        <button onClick={() => setShowPracticeSolution(!showPracticeSolution)} className="text-blue-400 hover:text-blue-300 text-xs font-medium cursor-pointer">
          {showPracticeSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
        {showPracticeSolution && (
          <div className="mt-2 p-3 rounded-xl bg-[#091530] border border-[#14264c] text-sm space-y-1">
            {[
              'd = √[(3−0)² + (4−0)²]',
              'd = √[9 + 16]',
              'd = √25 = 5',
              'Answer: 5',
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
