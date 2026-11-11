import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. PARABOLA VISUALIZER
// ─────────────────────────────────────────────────────────────────────────────
export function ParabolaVisualizer({
  initialA = 1,
  initialB = -4,
  initialC = 3
}: {
  initialA?: number;
  initialB?: number;
  initialC?: number;
}) {
  const [a, setA] = useState<number>(initialA);
  const [b, setB] = useState<number>(initialB);
  const [c, setC] = useState<number>(initialC);

  const h = a !== 0 ? -b / (2 * a) : 0;
  const k = a !== 0 ? c - (b * b) / (4 * a) : 0;
  const disc = b * b - 4 * a * c;

  // SVG dimensions
  const width = 440;
  const height = 240;
  const cx = width / 2;
  const cy = height / 2;
  const scale = 18; // pixels per unit

  // Generate curve points
  const points: string[] = [];
  for (let px = -12; px <= 12; px += 0.25) {
    const py = a * px * px + b * px + c;
    const sx = cx + px * scale;
    const sy = cy - py * scale;
    if (sy >= -50 && sy <= height + 50) {
      points.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
    }
  }

  // Real roots
  let r1: number | null = null;
  let r2: number | null = null;
  if (disc > 0 && a !== 0) {
    r1 = (-b + Math.sqrt(disc)) / (2 * a);
    r2 = (-b - Math.sqrt(disc)) / (2 * a);
  } else if (disc === 0 && a !== 0) {
    r1 = -b / (2 * a);
  }

  return (
    <div className="bg-[#050b18] border border-[#14264c] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#14264c] pb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">Interactive Parabola Explorer</h4>
          <p className="text-xs text-blue-300 font-mono mt-0.5">
            y = {a}x² {b >= 0 ? '+' : '-'} {Math.abs(b)}x {c >= 0 ? '+' : '-'} {Math.abs(c)}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
            Vertex: ({h.toFixed(1)}, {k.toFixed(1)})
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            Δ = {disc.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Sliders */}
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Quadratic coeff (a):</span>
              <span className="font-mono text-blue-400 font-semibold">{a}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.5"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value) || 0.5)}
              className="w-full accent-blue-500"
            />
            <div className="text-[10px] text-slate-400">Controls curve width and opens up/down</div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Linear coeff (b):</span>
              <span className="font-mono text-blue-400 font-semibold">{b}</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.5"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-[10px] text-slate-400">Shifts axis of symmetry x = -b/2a</div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Constant term (c):</span>
              <span className="font-mono text-blue-400 font-semibold">{c}</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.5"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-[10px] text-slate-400">Vertical y-intercept: (0, {c})</div>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="md:col-span-2 relative flex justify-center bg-[#071024] border border-[#142850] rounded-lg p-2 overflow-hidden select-none">
          <svg width={width} height={height} className="max-w-full">
            {/* Grid lines */}
            {[-8, -6, -4, -2, 2, 4, 6, 8].map((gx) => (
              <line
                key={`gx-${gx}`}
                x1={cx + gx * scale}
                y1={0}
                x2={cx + gx * scale}
                y2={height}
                stroke="#132448"
                strokeWidth="1"
              />
            ))}
            {[-6, -4, -2, 2, 4, 6].map((gy) => (
              <line
                key={`gy-${gy}`}
                x1={0}
                y1={cy - gy * scale}
                x2={width}
                y2={cy - gy * scale}
                stroke="#132448"
                strokeWidth="1"
              />
            ))}

            {/* Axes */}
            <line x1={0} y1={cy} x2={width} y2={cy} stroke="#334155" strokeWidth="1.5" />
            <line x1={cx} y1={0} x2={cx} y2={height} stroke="#334155" strokeWidth="1.5" />

            {/* Axis of Symmetry */}
            <line
              x1={cx + h * scale}
              y1={0}
              x2={cx + h * scale}
              y2={height}
              stroke="#eab308"
              strokeDasharray="4,4"
              strokeWidth="1.2"
            />

            {/* Parabola Curve */}
            {points.length > 1 && (
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                points={points.join(' ')}
              />
            )}

            {/* Vertex Point */}
            <circle cx={cx + h * scale} cy={cy - k * scale} r="5" fill="#f59e0b" />

            {/* Real Roots Points */}
            {r1 !== null && (
              <circle cx={cx + r1 * scale} cy={cy} r="4.5" fill="#10b981" />
            )}
            {r2 !== null && (
              <circle cx={cx + r2 * scale} cy={cy} r="4.5" fill="#10b981" />
            )}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-2 right-2 bg-[#091530]/90 backdrop-blur border border-[#162c57] px-2 py-1 rounded text-[10px] space-y-0.5 text-slate-300 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Vertex ({h.toFixed(1)}, {k.toFixed(1)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Roots: {r1 !== null ? `${r1.toFixed(1)}${r2 !== null ? `, ${r2.toFixed(1)}` : ''}` : 'None (Real)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LINEAR GRAPH VISUALIZER
// ─────────────────────────────────────────────────────────────────────────────
export function LinearGraphVisualizer({
  initialM = 2,
  initialB = -1
}: {
  initialM?: number;
  initialB?: number;
}) {
  const [m, setM] = useState<number>(initialM);
  const [b, setB] = useState<number>(initialB);

  const width = 400;
  const height = 220;
  const cx = width / 2;
  const cy = height / 2;
  const scale = 20;

  const x1 = -10;
  const y1 = m * x1 + b;
  const x2 = 10;
  const y2 = m * x2 + b;

  const sx1 = cx + x1 * scale;
  const sy1 = cy - y1 * scale;
  const sx2 = cx + x2 * scale;
  const sy2 = cy - y2 * scale;

  return (
    <div className="bg-[#050b18] border border-[#14264c] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#14264c] pb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">Interactive Line Explorer (y = mx + b)</h4>
          <p className="text-xs text-blue-300 font-mono mt-0.5">
            y = {m}x {b >= 0 ? '+' : '-'} {Math.abs(b)}
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
          Slope m = {m} | y-int = (0, {b})
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Slope (m):</span>
              <span className="font-mono text-blue-400 font-semibold">{m}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.5"
              value={m}
              onChange={(e) => setM(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-[10px] text-slate-400">Positive: ascends; Negative: descends</div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>y-intercept (b):</span>
              <span className="font-mono text-blue-400 font-semibold">{b}</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-[10px] text-slate-400">Shifts line vertically up or down</div>
          </div>
        </div>

        <div className="md:col-span-2 relative flex justify-center bg-[#071024] border border-[#142850] rounded-lg p-2 overflow-hidden select-none">
          <svg width={width} height={height} className="max-w-full">
            <line x1={0} y1={cy} x2={width} y2={cy} stroke="#334155" strokeWidth="1.5" />
            <line x1={cx} y1={0} x2={cx} y2={height} stroke="#334155" strokeWidth="1.5" />
            <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="#38bdf8" strokeWidth="2.5" />
            {/* y-intercept dot */}
            <circle cx={cx} cy={cy - b * scale} r="4.5" fill="#f59e0b" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SYSTEMS INTERSECTION VISUALIZER
// ─────────────────────────────────────────────────────────────────────────────
export function SystemsIntersectionVisualizer({
  m1 = 1,
  b1 = 1,
  m2 = -1,
  b2 = 5
}: {
  m1?: number;
  b1?: number;
  m2?: number;
  b2?: number;
}) {
  const [lineM1, setLineM1] = useState(m1);
  const [lineB1, setLineB1] = useState(b1);
  const [lineM2, setLineM2] = useState(m2);
  const [lineB2, setLineB2] = useState(b2);

  const width = 420;
  const height = 220;
  const cx = width / 2;
  const cy = height / 2;
  const scale = 20;

  // Intersection: m1*x + b1 = m2*x + b2 ⟹ (m1 - m2)x = b2 - b1
  const denom = lineM1 - lineM2;
  let interX: number | null = null;
  let interY: number | null = null;

  if (Math.abs(denom) > 1e-9) {
    interX = (lineB2 - lineB1) / denom;
    interY = lineM1 * interX + lineB1;
  }

  return (
    <div className="bg-[#050b18] border border-[#14264c] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#14264c] pb-3">
        <h4 className="text-sm font-semibold text-white">Live System Intersection Explorer</h4>
        <div className="text-xs font-mono">
          {interX !== null ? (
            <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
              Unique Solution: ({interX.toFixed(2)}, {interY?.toFixed(2)})
            </span>
          ) : lineB1 === lineB2 ? (
            <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
              Coincident Lines (Infinite Solutions)
            </span>
          ) : (
            <span className="text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">
              Parallel Lines (No Solution)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <span className="text-blue-400 font-semibold font-mono">Line 1: y = {lineM1}x + {lineB1}</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={lineM1}
                onChange={(e) => setLineM1(parseFloat(e.target.value) || 0)}
                className="w-16 bg-[#091530] border border-[#162c57] rounded px-1.5 py-0.5 text-white"
                placeholder="m1"
              />
              <input
                type="number"
                value={lineB1}
                onChange={(e) => setLineB1(parseFloat(e.target.value) || 0)}
                className="w-16 bg-[#091530] border border-[#162c57] rounded px-1.5 py-0.5 text-white"
                placeholder="b1"
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-emerald-400 font-semibold font-mono">Line 2: y = {lineM2}x + {lineB2}</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={lineM2}
                onChange={(e) => setLineM2(parseFloat(e.target.value) || 0)}
                className="w-16 bg-[#091530] border border-[#162c57] rounded px-1.5 py-0.5 text-white"
                placeholder="m2"
              />
              <input
                type="number"
                value={lineB2}
                onChange={(e) => setLineB2(parseFloat(e.target.value) || 0)}
                className="w-16 bg-[#091530] border border-[#162c57] rounded px-1.5 py-0.5 text-white"
                placeholder="b2"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 relative flex justify-center bg-[#071024] border border-[#142850] rounded-lg p-2 overflow-hidden select-none">
          <svg width={width} height={height} className="max-w-full">
            <line x1={0} y1={cy} x2={width} y2={cy} stroke="#334155" strokeWidth="1.5" />
            <line x1={cx} y1={0} x2={cx} y2={height} stroke="#334155" strokeWidth="1.5" />

            {/* Line 1 */}
            <line
              x1={cx - 10 * scale}
              y1={cy - (lineM1 * -10 + lineB1) * scale}
              x2={cx + 10 * scale}
              y2={cy - (lineM1 * 10 + lineB1) * scale}
              stroke="#38bdf8"
              strokeWidth="2"
            />

            {/* Line 2 */}
            <line
              x1={cx - 10 * scale}
              y1={cy - (lineM2 * -10 + lineB2) * scale}
              x2={cx + 10 * scale}
              y2={cy - (lineM2 * 10 + lineB2) * scale}
              stroke="#34d399"
              strokeWidth="2"
            />

            {/* Intersection */}
            {interX !== null && interY !== null && (
              <circle cx={cx + interX * scale} cy={cy - interY * scale} r="6" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NUMBER LINE VISUALIZER
// ─────────────────────────────────────────────────────────────────────────────
export function NumberLineVisualizer({
  bound = 5,
  sign = '<='
}: {
  bound?: number;
  sign?: string;
}) {
  const width = 440;
  const height = 90;
  const cx = width / 2;
  const cy = height / 2;
  const scale = 20;

  const isInclusive = sign.includes('=');
  const isGreater = sign.includes('>');

  const dotX = cx + bound * scale;
  const rayEndX = isGreater ? width : 0;

  return (
    <div className="bg-[#050b18] border border-[#14264c] rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Number Line Visualizer</h4>
        <span className="text-xs font-mono text-cyan-300">
          x {sign} {bound} ({isInclusive ? 'Closed boundary' : 'Open boundary'})
        </span>
      </div>

      <div className="relative flex justify-center bg-[#071024] border border-[#142850] rounded-lg p-3 overflow-x-auto select-none">
        <svg width={width} height={height}>
          {/* Main Axis */}
          <line x1={10} y1={cy} x2={width - 10} y2={cy} stroke="#64748b" strokeWidth="2" />

          {/* Tick Marks & Numbers */}
          {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((n) => {
            const tx = cx + n * scale;
            return (
              <g key={n}>
                <line x1={tx} y1={cy - 5} x2={tx} y2={cy + 5} stroke="#475569" strokeWidth="1.5" />
                <text x={tx} y={cy + 20} fontSize="10" fill="#94a3b8" textAnchor="middle" fontFamily="monospace">
                  {n}
                </text>
              </g>
            );
          })}

          {/* Shaded Region */}
          <line
            x1={dotX}
            y1={cy}
            x2={rayEndX}
            y2={cy}
            stroke="#38bdf8"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Boundary Circle */}
          <circle
            cx={dotX}
            cy={cy}
            r="6"
            fill={isInclusive ? '#38bdf8' : '#071024'}
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMPLEX PLANE VISUALIZER (ARGAND DIAGRAM)
// ─────────────────────────────────────────────────────────────────────────────
export function ComplexPlaneVisualizer({
  a = 3,
  b = 4
}: {
  a?: number;
  b?: number;
}) {
  const [real, setReal] = useState(a);
  const [imag, setImag] = useState(b);

  const width = 380;
  const height = 240;
  const cx = width / 2;
  const cy = height / 2;
  const scale = 22;

  const zX = cx + real * scale;
  const zY = cy - imag * scale;
  const conjY = cy + imag * scale;
  const mod = Math.sqrt(real * real + imag * imag);

  return (
    <div className="bg-[#050b18] border border-[#14264c] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#14264c] pb-3">
        <h4 className="text-sm font-semibold text-white">Complex Plane (Argand Diagram)</h4>
        <div className="text-xs font-mono text-cyan-300">
          z = {real} {imag >= 0 ? '+' : '-'} {Math.abs(imag)}i | |z| = {mod.toFixed(2)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Real part Re(z):</span>
              <span className="font-mono text-blue-400 font-semibold">{real}</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="1"
              value={real}
              onChange={(e) => setReal(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Imaginary part Im(z):</span>
              <span className="font-mono text-cyan-400 font-semibold">{imag}i</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="1"
              value={imag}
              onChange={(e) => setImag(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        <div className="md:col-span-2 relative flex justify-center bg-[#071024] border border-[#142850] rounded-lg p-2 overflow-hidden select-none">
          <svg width={width} height={height} className="max-w-full">
            {/* Real & Imaginary Axes */}
            <line x1={0} y1={cy} x2={width} y2={cy} stroke="#334155" strokeWidth="1.5" />
            <line x1={cx} y1={0} x2={cx} y2={height} stroke="#334155" strokeWidth="1.5" />
            <text x={width - 25} y={cy - 6} fill="#64748b" fontSize="10" fontFamily="sans-serif">Re</text>
            <text x={cx + 8} y={15} fill="#64748b" fontSize="10" fontFamily="sans-serif">Im</text>

            {/* Vector from origin */}
            <line x1={cx} y1={cy} x2={zX} y2={zY} stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx={zX} cy={zY} r="5" fill="#38bdf8" />

            {/* Conjugate Point */}
            <circle cx={zX} cy={conjY} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <line x1={zX} y1={zY} x2={zX} y2={conjY} stroke="#475569" strokeDasharray="3,3" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
