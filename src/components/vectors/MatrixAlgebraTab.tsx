import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type ActionMode =
  | 'Determinant (2×2)'
  | 'Determinant (3×3)'
  | 'Matrix Addition'
  | 'Matrix Multiply'
  | 'Transpose'
  | 'Inverse (2×2)';

export default function MatrixAlgebraTab() {
  const [action, setAction] = useState<ActionMode>('Determinant (2×2)');

  // 2×2 matrix A
  const [a11, setA11] = useState(''); const [a12, setA12] = useState('');
  const [a21, setA21] = useState(''); const [a22, setA22] = useState('');

  // 3×3 matrix A
  const [m11, setM11] = useState(''); const [m12, setM12] = useState(''); const [m13, setM13] = useState('');
  const [m21, setM21] = useState(''); const [m22, setM22] = useState(''); const [m23, setM23] = useState('');
  const [m31, setM31] = useState(''); const [m32, setM32] = useState(''); const [m33, setM33] = useState('');

  // 2×2 matrix B (for add/multiply)
  const [b11, setB11] = useState(''); const [b12, setB12] = useState('');
  const [b21, setB21] = useState(''); const [b22, setB22] = useState('');

  // 3×3 matrix B (for add/multiply with 3×3 — we use 2×2 for simplicity in add/multiply)
  // Actually the spec says add/multiply show two matrices and result. We'll use 2×2 for these.

  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  // Practice
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  // Worked examples toggle
  const [showExample1, setShowExample1] = useState(false);
  const [showExample2, setShowExample2] = useState(false);

  const actions: ActionMode[] = [
    'Determinant (2×2)', 'Determinant (3×3)', 'Matrix Addition',
    'Matrix Multiply', 'Transpose', 'Inverse (2×2)'
  ];

  const inputClass = 'w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner text-center';

  const p = (v: string) => parseFloat(v) || 0;

  const needs2x2 = action === 'Determinant (2×2)' || action === 'Inverse (2×2)';
  const needs3x3 = action === 'Determinant (3×3)';
  const needsTwoMatrices = action === 'Matrix Addition' || action === 'Matrix Multiply';
  const needsTranspose = action === 'Transpose';

  const handleReset = () => {
    setA11(''); setA12(''); setA21(''); setA22('');
    setM11(''); setM12(''); setM13('');
    setM21(''); setM22(''); setM23('');
    setM31(''); setM32(''); setM33('');
    setB11(''); setB12(''); setB21(''); setB22('');
    setResult(null); setSteps([]);
  };

  const handleCalculate = () => {
    switch (action) {
      case 'Determinant (2×2)': {
        const a = p(a11), b = p(a12), c = p(a21), d = p(a22);
        const det = a * d - b * c;
        const s: string[] = [];
        s.push(`Matrix A = [[${a}, ${b}], [${c}, ${d}]]`);
        s.push(`det(A) = a·d − b·c`);
        s.push(`det(A) = (${a})(${d}) − (${b})(${c})`);
        s.push(`det(A) = ${a * d} − ${b * c}`);
        s.push(`det(A) = ${det}`);
        setSteps(s);
        setResult(`det(A) = ${det}`);
        break;
      }
      case 'Determinant (3×3)': {
        const a = [
          [p(m11), p(m12), p(m13)],
          [p(m21), p(m22), p(m23)],
          [p(m31), p(m32), p(m33)]
        ];
        // Cofactor expansion along first row
        const minor1 = a[1][1] * a[2][2] - a[1][2] * a[2][1];
        const minor2 = a[1][0] * a[2][2] - a[1][2] * a[2][0];
        const minor3 = a[1][0] * a[2][1] - a[1][1] * a[2][0];
        const det = a[0][0] * minor1 - a[0][1] * minor2 + a[0][2] * minor3;
        const s: string[] = [];
        s.push(`Matrix A = [[${a[0].join(', ')}], [${a[1].join(', ')}], [${a[2].join(', ')}]]`);
        s.push(`Cofactor expansion along first row:`);
        s.push(`C₁₁ = +(${a[0][0]}) × det([[${a[1][1]}, ${a[1][2]}], [${a[2][1]}, ${a[2][2]}]])`);
        s.push(`     = ${a[0][0]} × (${a[1][1]}×${a[2][2]} − ${a[1][2]}×${a[2][1]}) = ${a[0][0]} × ${minor1} = ${a[0][0] * minor1}`);
        s.push(`C₁₂ = −(${a[0][1]}) × det([[${a[1][0]}, ${a[1][2]}], [${a[2][0]}, ${a[2][2]}]])`);
        s.push(`     = −${a[0][1]} × (${a[1][0]}×${a[2][2]} − ${a[1][2]}×${a[2][0]}) = −${a[0][1]} × ${minor2} = ${-a[0][1] * minor2}`);
        s.push(`C₁₃ = +(${a[0][2]}) × det([[${a[1][0]}, ${a[1][1]}], [${a[2][0]}, ${a[2][1]}]])`);
        s.push(`     = ${a[0][2]} × (${a[1][0]}×${a[2][1]} − ${a[1][1]}×${a[2][0]}) = ${a[0][2]} × ${minor3} = ${a[0][2] * minor3}`);
        s.push(`det(A) = ${a[0][0] * minor1} + (${-a[0][1] * minor2}) + ${a[0][2] * minor3} = ${det}`);
        setSteps(s);
        setResult(`det(A) = ${det}`);
        break;
      }
      case 'Matrix Addition': {
        const A = [[p(a11), p(a12)], [p(a21), p(a22)]];
        const B = [[p(b11), p(b12)], [p(b21), p(b22)]];
        const C = [
          [A[0][0] + B[0][0], A[0][1] + B[0][1]],
          [A[1][0] + B[1][0], A[1][1] + B[1][1]]
        ];
        const s: string[] = [];
        s.push(`A = [[${A[0].join(', ')}], [${A[1].join(', ')}]]`);
        s.push(`B = [[${B[0].join(', ')}], [${B[1].join(', ')}]]`);
        s.push(`C = A + B  (element-wise addition)`);
        s.push(`c₁₁ = ${A[0][0]} + ${B[0][0]} = ${C[0][0]}`);
        s.push(`c₁₂ = ${A[0][1]} + ${B[0][1]} = ${C[0][1]}`);
        s.push(`c₂₁ = ${A[1][0]} + ${B[1][0]} = ${C[1][0]}`);
        s.push(`c₂₂ = ${A[1][1]} + ${B[1][1]} = ${C[1][1]}`);
        s.push(`C = [[${C[0].join(', ')}], [${C[1].join(', ')}]]`);
        setSteps(s);
        setResult(`A + B = [[${C[0].join(', ')}], [${C[1].join(', ')}]]`);
        break;
      }
      case 'Matrix Multiply': {
        const A = [[p(a11), p(a12)], [p(a21), p(a22)]];
        const B = [[p(b11), p(b12)], [p(b21), p(b22)]];
        const C = [
          [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
          [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
        ];
        const s: string[] = [];
        s.push(`A = [[${A[0].join(', ')}], [${A[1].join(', ')}]]`);
        s.push(`B = [[${B[0].join(', ')}], [${B[1].join(', ')}]]`);
        s.push(`C = A × B  (row × column)`);
        s.push(`c₁₁ = (${A[0][0]})(${B[0][0]}) + (${A[0][1]})(${B[1][0]}) = ${A[0][0] * B[0][0]} + ${A[0][1] * B[1][0]} = ${C[0][0]}`);
        s.push(`c₁₂ = (${A[0][0]})(${B[0][1]}) + (${A[0][1]})(${B[1][1]}) = ${A[0][0] * B[0][1]} + ${A[0][1] * B[1][1]} = ${C[0][1]}`);
        s.push(`c₂₁ = (${A[1][0]})(${B[0][0]}) + (${A[1][1]})(${B[1][0]}) = ${A[1][0] * B[0][0]} + ${A[1][1] * B[1][0]} = ${C[1][0]}`);
        s.push(`c₂₂ = (${A[1][0]})(${B[0][1]}) + (${A[1][1]})(${B[1][1]}) = ${A[1][0] * B[0][1]} + ${A[1][1] * B[1][1]} = ${C[1][1]}`);
        s.push(`C = [[${C[0].join(', ')}], [${C[1].join(', ')}]]`);
        setSteps(s);
        setResult(`A × B = [[${C[0].join(', ')}], [${C[1].join(', ')}]]`);
        break;
      }
      case 'Transpose': {
        // Use 3×3 for transpose to be more interesting
        const a = [
          [p(m11), p(m12), p(m13)],
          [p(m21), p(m22), p(m23)],
          [p(m31), p(m32), p(m33)]
        ];
        const t = [
          [a[0][0], a[1][0], a[2][0]],
          [a[0][1], a[1][1], a[2][1]],
          [a[0][2], a[1][2], a[2][2]]
        ];
        const s: string[] = [];
        s.push(`Matrix A = [[${a[0].join(', ')}], [${a[1].join(', ')}], [${a[2].join(', ')}]]`);
        s.push(`Aᵀ: swap rows ↔ columns (aᵢⱼ → aⱼᵢ)`);
        s.push(`Row 1 of Aᵀ = Column 1 of A = (${a[0][0]}, ${a[1][0]}, ${a[2][0]})`);
        s.push(`Row 2 of Aᵀ = Column 2 of A = (${a[0][1]}, ${a[1][1]}, ${a[2][1]})`);
        s.push(`Row 3 of Aᵀ = Column 3 of A = (${a[0][2]}, ${a[1][2]}, ${a[2][2]})`);
        s.push(`Aᵀ = [[${t[0].join(', ')}], [${t[1].join(', ')}], [${t[2].join(', ')}]]`);
        setSteps(s);
        setResult(`Aᵀ = [[${t[0].join(', ')}], [${t[1].join(', ')}], [${t[2].join(', ')}]]`);
        break;
      }
      case 'Inverse (2×2)': {
        const a = p(a11), b = p(a12), c = p(a21), d = p(a22);
        const det = a * d - b * c;
        if (det === 0) {
          setResult('Error: Matrix is singular (det = 0). No inverse exists.');
          setSteps(['det(A) = ad − bc = ' + a + '×' + d + ' − ' + b + '×' + c + ' = 0', 'A singular matrix has no inverse.']);
          break;
        }
        const inv = [
          [d / det, -b / det],
          [-c / det, a / det]
        ];
        const fmt = (n: number) => Number.isInteger(n) ? n.toString() : n.toFixed(6);
        const s: string[] = [];
        s.push(`Matrix A = [[${a}, ${b}], [${c}, ${d}]]`);
        s.push(`det(A) = ad − bc = (${a})(${d}) − (${b})(${c}) = ${a * d} − ${b * c} = ${det}`);
        s.push(`A⁻¹ = (1/det) × [[d, −b], [−c, a]]`);
        s.push(`A⁻¹ = (1/${det}) × [[${d}, ${-b}], [${-c}, ${a}]]`);
        s.push(`A⁻¹ = [[${fmt(inv[0][0])}, ${fmt(inv[0][1])}], [${fmt(inv[1][0])}, ${fmt(inv[1][1])}]]`);
        s.push(`Verification: A × A⁻¹ should equal I₂`);
        setSteps(s);
        setResult(`A⁻¹ = [[${fmt(inv[0][0])}, ${fmt(inv[0][1])}], [${fmt(inv[1][0])}, ${fmt(inv[1][1])}]]`);
        break;
      }
    }
  };

  const render2x2Input = (
    label: string,
    v11: string, v12: string, v21: string, v22: string,
    s11: (v: string) => void, s12: (v: string) => void,
    s21: (v: string) => void, s22: (v: string) => void
  ) => (
    <div>
      <label className="block text-sm text-slate-300 mb-2 font-medium">{label}</label>
      <div className="inline-grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#060c1d] border border-[#132244]">
        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-lg font-mono">[</span>
          <input type="number" value={v11} onChange={(e) => s11(e.target.value)} placeholder="0" className={inputClass + ' w-20'} />
          <input type="number" value={v12} onChange={(e) => s12(e.target.value)} placeholder="0" className={inputClass + ' w-20'} />
          <span className="text-slate-500 text-lg font-mono">]</span>
        </div>
        <div className="col-span-2 flex items-center gap-1">
          <span className="text-slate-500 text-lg font-mono">[</span>
          <input type="number" value={v21} onChange={(e) => s21(e.target.value)} placeholder="0" className={inputClass + ' w-20'} />
          <input type="number" value={v22} onChange={(e) => s22(e.target.value)} placeholder="0" className={inputClass + ' w-20'} />
          <span className="text-slate-500 text-lg font-mono">]</span>
        </div>
      </div>
    </div>
  );

  const render3x3Input = () => (
    <div>
      <label className="block text-sm text-slate-300 mb-2 font-medium">Matrix A (3×3)</label>
      <div className="inline-block p-3 rounded-xl bg-[#060c1d] border border-[#132244]">
        {[
          [m11, setM11, m12, setM12, m13, setM13],
          [m21, setM21, m22, setM22, m23, setM23],
          [m31, setM31, m32, setM32, m33, setM33],
        ].map((row, ri) => (
          <div key={ri} className="flex items-center gap-1 mb-1 last:mb-0">
            <span className="text-slate-500 text-lg font-mono">{ri === 0 ? '⎡' : ri === 1 ? '⎢' : '⎣'}</span>
            <input type="number" value={row[0] as string} onChange={(e) => (row[1] as (v: string) => void)(e.target.value)} placeholder="0" className={inputClass + ' w-16'} />
            <input type="number" value={row[2] as string} onChange={(e) => (row[3] as (v: string) => void)(e.target.value)} placeholder="0" className={inputClass + ' w-16'} />
            <input type="number" value={row[4] as string} onChange={(e) => (row[5] as (v: string) => void)(e.target.value)} placeholder="0" className={inputClass + ' w-16'} />
            <span className="text-slate-500 text-lg font-mono">{ri === 0 ? '⎤' : ri === 1 ? '⎥' : '⎦'}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Visual matrix grid display with color coding
  const renderMatrixGraph = () => {
    if (needs2x2) {
      const vals = [[p(a11), p(a12)], [p(a21), p(a22)]];
      const maxVal = Math.max(1, ...vals.flat().map(Math.abs));
      return (
        <svg className="w-full h-44" viewBox="0 0 320 176">
          <rect width="320" height="176" fill="#060c1d" rx="12" />
          <text x="160" y="20" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Matrix A (2×2)</text>
          {vals.map((row, ri) =>
            row.map((val, ci) => {
              const x = 100 + ci * 65;
              const y = 40 + ri * 65;
              const intensity = Math.abs(val) / maxVal;
              const fillColor = val >= 0
                ? `rgba(59, 130, 246, ${0.15 + intensity * 0.6})`
                : `rgba(239, 68, 68, ${0.15 + intensity * 0.6})`;
              return (
                <g key={`${ri}-${ci}`}>
                  <rect x={x} y={y} width="55" height="50" rx="8" fill={fillColor} stroke="#1a3363" strokeWidth="1" />
                  <text x={x + 27.5} y={y + 30} fill="white" fontSize="16" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                    {val}
                  </text>
                  <text x={x + 27.5} y={y + 46} fill="#64748b" fontSize="8" textAnchor="middle">
                    a{ri + 1}{ci + 1}
                  </text>
                </g>
              );
            })
          )}
          {/* Brackets */}
          <line x1="92" y1="38" x2="92" y2="155" stroke="#3b82f6" strokeWidth="2" />
          <line x1="92" y1="38" x2="98" y2="38" stroke="#3b82f6" strokeWidth="2" />
          <line x1="92" y1="155" x2="98" y2="155" stroke="#3b82f6" strokeWidth="2" />
          <line x1="228" y1="38" x2="228" y2="155" stroke="#3b82f6" strokeWidth="2" />
          <line x1="222" y1="38" x2="228" y2="38" stroke="#3b82f6" strokeWidth="2" />
          <line x1="222" y1="155" x2="228" y2="155" stroke="#3b82f6" strokeWidth="2" />
        </svg>
      );
    }
    // 3×3
    const vals = [
      [p(m11), p(m12), p(m13)],
      [p(m21), p(m22), p(m23)],
      [p(m31), p(m32), p(m33)]
    ];
    const maxVal = Math.max(1, ...vals.flat().map(Math.abs));
    return (
      <svg className="w-full h-44" viewBox="0 0 320 176">
        <rect width="320" height="176" fill="#060c1d" rx="12" />
        <text x="160" y="16" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">Matrix A (3×3)</text>
        {vals.map((row, ri) =>
          row.map((val, ci) => {
            const x = 80 + ci * 58;
            const y = 24 + ri * 50;
            const intensity = Math.abs(val) / maxVal;
            const fillColor = val >= 0
              ? `rgba(59, 130, 246, ${0.15 + intensity * 0.6})`
              : `rgba(239, 68, 68, ${0.15 + intensity * 0.6})`;
            return (
              <g key={`${ri}-${ci}`}>
                <rect x={x} y={y} width="48" height="42" rx="6" fill={fillColor} stroke="#1a3363" strokeWidth="1" />
                <text x={x + 24} y={y + 26} fill="white" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  {val}
                </text>
                <text x={x + 24} y={y + 38} fill="#64748b" fontSize="7" textAnchor="middle">
                  a{ri + 1}{ci + 1}
                </text>
              </g>
            );
          })
        )}
        {/* Brackets */}
        <line x1="72" y1="22" x2="72" y2="172" stroke="#3b82f6" strokeWidth="2" />
        <line x1="72" y1="22" x2="78" y2="22" stroke="#3b82f6" strokeWidth="2" />
        <line x1="72" y1="172" x2="78" y2="172" stroke="#3b82f6" strokeWidth="2" />
        <line x1="256" y1="22" x2="256" y2="172" stroke="#3b82f6" strokeWidth="2" />
        <line x1="250" y1="22" x2="256" y2="22" stroke="#3b82f6" strokeWidth="2" />
        <line x1="250" y1="172" x2="256" y2="172" stroke="#3b82f6" strokeWidth="2" />
      </svg>
    );
  };

  const practiceOptions = [5, 11, -5, 8];
  const correctPracticeAnswer = 5;

  return (
    <div className="space-y-6">
      {/* ─── Topic Header ─── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          Vectors &amp; Matrices
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-2">Matrix Algebra</h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Compute determinants, inverses, transposes, and perform matrix addition and multiplication.
        </p>
      </div>

      {/* ─── Mathematical Definition ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Mathematical Definition</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          A <strong className="text-blue-300">matrix</strong> is a rectangular array of numbers arranged in rows and columns. An <span className="font-mono text-blue-300">m × n</span> matrix has m rows and n columns. The <strong className="text-blue-300">determinant</strong> of a square matrix is a scalar that encodes properties like invertibility and volume scaling.
        </p>
        <div className="bg-[#060c1d] rounded-lg p-3 border border-[#132244]">
          <code className="text-blue-300 font-mono text-sm">
            det(A₂ₓ₂) = ad − bc &nbsp;|&nbsp; A⁻¹ = (1/det) adj(A) &nbsp;|&nbsp; (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ
          </code>
        </div>
      </div>

      {/* ─── Formula Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: '2×2 Determinant', formula: 'det([[a,b],[c,d]]) = ad − bc', desc: 'Product of diag minus product of anti-diag' },
          { title: '3×3 Determinant', formula: 'det(A) = a₁₁C₁₁ + a₁₂C₁₂ + a₁₃C₁₃', desc: 'Cofactor expansion along first row' },
          { title: '2×2 Inverse', formula: 'A⁻¹ = (1/det)·[[d,−b],[−c,a]]', desc: 'Exists only when det ≠ 0' },
          { title: 'Transpose', formula: '(Aᵀ)ᵢⱼ = Aⱼᵢ', desc: 'Swap rows and columns' },
          { title: 'Matrix Addition', formula: '(A + B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ', desc: 'Element-wise addition (same dimensions)' },
          { title: 'Matrix Multiplication', formula: '(AB)ᵢⱼ = Σₖ Aᵢₖ Bₖⱼ', desc: 'Row-by-column dot products' },
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

        {/* Matrix Inputs */}
        <div className="space-y-4 mb-5">
          {needs2x2 && (
            render2x2Input('Matrix A (2×2)', a11, a12, a21, a22, setA11, setA12, setA21, setA22)
          )}

          {(needs3x3 || needsTranspose) && render3x3Input()}

          {needsTwoMatrices && (
            <>
              {render2x2Input('Matrix A (2×2)', a11, a12, a21, a22, setA11, setA12, setA21, setA22)}
              <div className="mt-3">
                {render2x2Input('Matrix B (2×2)', b11, b12, b21, b22, setB11, setB12, setB21, setB22)}
              </div>
            </>
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
            <p className="text-xl font-mono text-blue-300 font-bold break-all">{result}</p>
          </div>
        )}

        {/* Step-by-step */}
        {steps.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">Step-by-Step Solution</h3>
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#060c1d] border border-[#132244]">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300 font-mono whitespace-pre-wrap">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Graphical Representation ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Graphical Representation</h2>
        <p className="text-slate-400 text-xs mb-3">Visual matrix grid — blue cells are non-negative, red cells are negative. Intensity reflects relative magnitude.</p>
        <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-0 overflow-hidden">
          {renderMatrixGraph()}
        </div>
      </div>

      {/* ─── Worked Examples ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-100">Worked Examples</h2>
        </div>

        {/* Example 1: Basic 2×2 Determinant */}
        <div className="mb-4 p-3 rounded-xl bg-[#060c1d] border border-[#132244]">
          <button onClick={() => setShowExample1(!showExample1)} className="w-full flex items-center justify-between text-left cursor-pointer">
            <span className="text-sm font-semibold text-slate-100">Example 1 (Basic): det([[3, 8], [4, 6]])</span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showExample1 ? 'rotate-90' : ''}`} />
          </button>
          {showExample1 && (
            <div className="mt-3 space-y-2">
              {[
                'Matrix A = [[3, 8], [4, 6]]',
                'det(A) = ad − bc',
                'det(A) = (3)(6) − (8)(4)',
                'det(A) = 18 − 32',
                'det(A) = −14',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300 font-mono">{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Example 2: 3×3 Determinant */}
        <div className="p-3 rounded-xl bg-[#060c1d] border border-[#132244]">
          <button onClick={() => setShowExample2(!showExample2)} className="w-full flex items-center justify-between text-left cursor-pointer">
            <span className="text-sm font-semibold text-slate-100">Example 2 (Challenging): det([[2, 1, 3], [0, −1, 2], [1, 4, −1]])</span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showExample2 ? 'rotate-90' : ''}`} />
          </button>
          {showExample2 && (
            <div className="mt-3 space-y-2">
              {[
                'A = [[2, 1, 3], [0, −1, 2], [1, 4, −1]]',
                'Cofactor expansion along row 1:',
                'C₁₁ = +2 × det([[−1, 2], [4, −1]]) = 2 × ((−1)(−1) − (2)(4)) = 2 × (1 − 8) = 2 × (−7) = −14',
                'C₁₂ = −1 × det([[0, 2], [1, −1]]) = −1 × ((0)(−1) − (2)(1)) = −1 × (0 − 2) = −1 × (−2) = 2',
                'C₁₃ = +3 × det([[0, −1], [1, 4]]) = 3 × ((0)(4) − (−1)(1)) = 3 × (0 + 1) = 3 × 1 = 3',
                'det(A) = −14 + 2 + 3 = −9',
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
          <p className="text-sm text-slate-100 font-semibold mb-1">
            What is the determinant of the matrix:
          </p>
          <div className="font-mono text-blue-300 text-base mb-3 ml-2">
            <div>⎡ 2 &nbsp; 3 ⎤</div>
            <div>⎣ 1 &nbsp; 4 ⎦</div>
          </div>

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
                  {opt}
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
              <p className="text-xs text-green-400 mt-1">det = (2)(4) − (3)(1) = 8 − 3 = 5</p>
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
              'Matrix = [[2, 3], [1, 4]]',
              'det = ad − bc',
              'det = (2)(4) − (3)(1)',
              'det = 8 − 3',
              'det = 5',
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
