import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function GeometricProgressionTab() {
  // Mode: What would you like to find?
  const [action, setAction] = useState<'nth_term' | 'sum_terms' | 'sum_infinity' | 'common_ratio'>('nth_term');

  // Input states
  const [firstTermA, setFirstTermA] = useState<string>('3');
  const [commonRatioR, setCommonRatioR] = useState<string>('2');
  const [numTermsN, setNumTermsN] = useState<string>('6');

  // Calculation output state
  const [calculated, setCalculated] = useState<{
    resultTitle: string;
    answer: string;
    formula: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    terms: number[];
  }>({
    resultTitle: '6th Term (a₆)',
    answer: 'a₆ = 96',
    formula: 'aₙ = a · r^{n - 1}',
    step1: 'Identify given parameters: First term a = 3, common ratio r = 2, term position n = 6.',
    step2: 'Apply the standard GP nth-term formula: aₙ = a · rⁿ⁻¹.',
    step3: 'Substitute the given values: a₆ = 3 · 2⁶⁻¹ = 3 · 2⁵.',
    step4: 'Calculate exponent: 2⁵ = 32. Multiply by first term: 3 × 32 = 96.',
    step5: 'The 6th term of this Geometric Progression is 96.',
    terms: [3, 6, 12, 24, 48, 96]
  });

  // Practice quiz state
  const [selectedPractice, setSelectedPractice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleCalculate = () => {
    const a = parseFloat(firstTermA) || 0;
    const r = parseFloat(commonRatioR) || 1;
    const n = Math.max(1, Math.round(parseFloat(numTermsN) || 1));

    if (action === 'nth_term') {
      const an = a * Math.pow(r, n - 1);
      const sampleTerms = Array.from({ length: Math.min(n, 8) }, (_, i) => a * Math.pow(r, i));
      setCalculated({
        resultTitle: `${n}th Term (a_${n})`,
        answer: `a_${n} = ${Number(an.toFixed(4))}`,
        formula: 'aₙ = a · r^{n - 1}',
        step1: `Given: First term a = ${a}, Common ratio r = ${r}, Term count n = ${n}.`,
        step2: `Apply GP general term formula: aₙ = a · rⁿ⁻¹.`,
        step3: `Substitute: a_${n} = ${a} · (${r})^(${n} - 1) = ${a} · (${r})^${n - 1}.`,
        step4: `Evaluate exponent: (${r})^${n - 1} = ${Math.pow(r, n - 1).toFixed(4)}. Multiply by ${a}: ${an.toFixed(4)}.`,
        step5: `The ${n}th term of this Geometric Progression is ${Number(an.toFixed(4))}.`,
        terms: sampleTerms
      });
    } else if (action === 'sum_terms') {
      let sn = 0;
      if (Math.abs(r - 1) < 1e-9) {
        sn = a * n;
      } else {
        sn = (a * (1 - Math.pow(r, n))) / (1 - r);
      }
      const sampleTerms = Array.from({ length: Math.min(n, 8) }, (_, i) => a * Math.pow(r, i));
      setCalculated({
        resultTitle: `Sum of First ${n} Terms (S_${n})`,
        answer: `S_${n} = ${Number(sn.toFixed(4))}`,
        formula: 'Sₙ = a(1 - rⁿ) / (1 - r)',
        step1: `Given: a = ${a}, r = ${r}, n = ${n}.`,
        step2: `Use the finite geometric series sum formula: Sₙ = a(1 - rⁿ) / (1 - r).`,
        step3: `Substitute: S_${n} = ${a}[1 - (${r})^${n}] / [1 - (${r})].`,
        step4: `Calculate rⁿ = ${Math.pow(r, n).toFixed(4)}, numerator = ${a * (1 - Math.pow(r, n))}, denominator = ${1 - r}.`,
        step5: `The sum of the first ${n} terms is S_${n} = ${Number(sn.toFixed(4))}.`,
        terms: sampleTerms
      });
    } else if (action === 'sum_infinity') {
      if (Math.abs(r) >= 1) {
        setCalculated({
          resultTitle: 'Sum to Infinity (S_∞)',
          answer: 'Divergent (No Finite Sum)',
          formula: 'S_∞ = a / (1 - r)  (valid only when |r| < 1)',
          step1: `Given: a = ${a}, r = ${r}.`,
          step2: `Check convergence condition: |r| < 1.`,
          step3: `Here |${r}| = ${Math.abs(r)} ≥ 1.`,
          step4: `Because the magnitude of r is 1 or greater, successive terms do not approach 0.`,
          step5: `The infinite series diverges and does not possess a finite sum.`,
          terms: [a, a * r, a * r * r]
        });
      } else {
        const sinf = a / (1 - r);
        const sampleTerms = Array.from({ length: 6 }, (_, i) => a * Math.pow(r, i));
        setCalculated({
          resultTitle: 'Sum to Infinity (S_∞)',
          answer: `S_∞ = ${Number(sinf.toFixed(4))}`,
          formula: 'S_∞ = a / (1 - r)',
          step1: `Given: First term a = ${a}, Common ratio r = ${r}.`,
          step2: `Check convergence: |${r}| < 1 holds. The series converges.`,
          step3: `Substitute into S_∞ = a / (1 - r): S_∞ = ${a} / (1 - ${r}).`,
          step4: `Denominator: 1 - (${r}) = ${1 - r}. Divide: ${a} ÷ ${1 - r} = ${sinf.toFixed(4)}.`,
          step5: `The sum to infinity converges exactly to ${Number(sinf.toFixed(4))}.`,
          terms: sampleTerms
        });
      }
    } else {
      // Common ratio
      const sampleTerms = [a, a * r, a * r * r, a * r * r * r];
      setCalculated({
        resultTitle: 'Common Ratio (r)',
        answer: `r = ${r}`,
        formula: 'r = aₖ₊₁ / aₖ',
        step1: `Consecutive terms: a₁ = ${a}, a₂ = ${a * r}.`,
        step2: `Evaluate quotient: r = a₂ / a₁.`,
        step3: `Substitute: ${a * r} / ${a} = ${r}.`,
        step4: `The multiplicative growth multiplier is constant.`,
        step5: `Common ratio r = ${r}.`,
        terms: sampleTerms
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 font-sans">
      {/* ─── 1. TOPIC HEADER & EXPLANATION ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-semibold">
            TOPIC 03 · PROGRESSIONS
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#112347] text-slate-300">
            CLASS 11–12
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-tight">
          Geometric Progression (GP)
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          A Geometric Progression (GP) is a numerical sequence in which each term after the first is obtained by multiplying the preceding term by a fixed non-zero constant, called the common ratio (<span className="text-blue-300 font-mono font-bold">r</span>).
        </p>
      </div>

      {/* ─── 2. MATHEMATICAL DEFINITION CARD ─── */}
      <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Mathematical Definition</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          A sequence <span className="font-mono text-white">a, ar, ar², ar³, ..., arⁿ⁻¹</span> is called a Geometric Progression if the ratio of any term to its immediately preceding term is always constant:
        </p>
        <div className="mt-2.5 p-3 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-xs sm:text-sm text-blue-200">
          aₖ₊₁ / aₖ = r = constant  (where r ≠ 0)
        </div>
        <p className="mt-2.5 text-xs text-slate-400">
          If <span className="text-blue-300 font-mono">r &gt; 1</span>, terms grow exponentially; if <span className="text-blue-300 font-mono">0 &lt; r &lt; 1</span>, terms decay toward zero; if <span className="text-blue-300 font-mono">r &lt; 0</span>, signs alternate.
        </p>
      </div>

      {/* ─── 3. FORMULA CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">nth Term Formula</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            {'aₙ = a · r^(n - 1)'}
          </div>
          <p className="text-[11px] text-slate-400">Calculates value of term n from first term a and ratio r.</p>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Sum of n Terms (Sₙ)</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            Sₙ = a(1 - rⁿ) / (1 - r)
          </div>
          <p className="text-[11px] text-slate-400">Finite sum when ratio r ≠ 1.</p>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Sum to Infinity (S_∞)</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            S_∞ = a / (1 - r)
          </div>
          <p className="text-[11px] text-emerald-300">Converges strictly when |r| &lt; 1.</p>
        </div>
      </div>

      {/* ─── 4. INTERACTIVE CALCULATOR (CONNECTED WORKSPACE) ─── */}
      <div className="bg-[#091530] border-2 border-blue-900/60 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#14264c] mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 font-mono">
              Geometric Progression Calculator
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Fast & Step-by-Step</span>
        </div>

        {/* Action Toggle Pills: What would you like to find? */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2 font-medium">What would you like to find?</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'nth_term', label: 'nth Term (aₙ)' },
              { id: 'sum_terms', label: 'Sum of n Terms (Sₙ)' },
              { id: 'sum_infinity', label: 'Sum to Infinity (S_∞)' },
              { id: 'common_ratio', label: 'Common Ratio (r)' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setAction(pill.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  action === pill.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                    : 'bg-[#070f22] text-slate-300 hover:text-white border border-[#162c57]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prominent Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">First Term (a):</label>
            <input
              type="number"
              value={firstTermA}
              onChange={(e) => setFirstTermA(e.target.value)}
              placeholder="e.g. 3"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Common Ratio (r):</label>
            <input
              type="number"
              value={commonRatioR}
              onChange={(e) => setCommonRatioR(e.target.value)}
              placeholder="e.g. 2 or 0.5"
              step="any"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>

          {action !== 'sum_infinity' && (
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Number of Terms (n):</label>
              <input
                type="number"
                value={numTermsN}
                onChange={(e) => setNumTermsN(e.target.value)}
                placeholder="e.g. 6"
                className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCalculate}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Calculate</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setFirstTermA('3');
              setCommonRatioR('2');
              setNumTermsN('6');
            }}
            className="p-2.5 rounded-xl bg-[#070f22] border border-[#162c57] hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to sample values"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Calculated Answer & Step-by-Step Derivation */}
        <div className="mt-6 pt-5 border-t border-[#14264c] space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 to-[#0e214d] border-2 border-blue-500 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Result: {calculated.resultTitle}</span>
              </div>
              <div className="text-xl sm:text-2xl font-serif text-white font-bold mt-1">
                {calculated.answer}
              </div>
            </div>
            <div className="text-xs font-mono text-blue-200 bg-[#060c1d] px-3 py-1.5 rounded border border-[#14264c] self-start sm:self-auto">
              Applied: {calculated.formula}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mb-1.5">Progression Terms Preview:</div>
            <div className="flex flex-wrap gap-1.5">
              {calculated.terms.map((term, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-[#060c1d] border border-[#162c57] text-xs font-mono text-slate-200"
                >
                  a_{idx + 1} = <strong className="text-blue-300">{Number(term.toFixed(3))}</strong>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Step-by-Step Solution:
            </div>
            <div className="p-3 rounded-lg bg-[#070f22] border border-[#132244] text-xs space-y-1.5 text-slate-300 leading-relaxed">
              <div className="text-blue-400 font-semibold">Step 1 — Identify Given Values:</div>
              <div>{calculated.step1}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 2 — Select Formula:</div>
              <div>{calculated.step2}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 3 — Substitute Values:</div>
              <div className="font-mono text-blue-200">{calculated.step3}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 4 — Simplify & Evaluate:</div>
              <div>{calculated.step4}</div>
              <div className="text-emerald-400 font-semibold pt-1">Step 5 — Final Statement:</div>
              <div className="font-medium text-white">{calculated.step5}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. GRAPHICAL REPRESENTATION ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-2">
          Graphical Representation (Exponential GP Growth / Decay)
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          A geometric progression grows or decays exponentially: y = a · r^(x - 1).
        </p>

        <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-3 flex items-end justify-between gap-1 overflow-x-auto">
          {calculated.terms.map((term, idx) => {
            const minVal = Math.min(...calculated.terms);
            const maxVal = Math.max(...calculated.terms);
            const range = maxVal - minVal || 1;
            const heightPct = Math.max(15, Math.min(95, ((term - minVal) / range) * 80 + 15));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-300">
                  {Number(term.toFixed(1))}
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full max-w-[28px] bg-indigo-600/80 hover:bg-indigo-500 rounded-t border-t border-indigo-400 transition-all shadow-sm"
                />
                <span className="text-[10px] font-mono text-slate-500">
                  n={idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 6. WORKED EXAMPLES ─── */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider px-1">
          Worked Examples
        </h3>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-300 font-mono">Example 1 (Basic)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Direct nth Term</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: In the GP 2, 6, 18, 54, ..., find the 6th term.
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> a = 2, r = 6 / 2 = 3, n = 6.</div>
            <div><strong>Step 2:</strong> Use aₙ = a · rⁿ⁻¹.</div>
            <div><strong>Step 3:</strong> a₆ = 2 · 3⁶⁻¹ = 2 · 3⁵.</div>
            <div><strong>Step 4:</strong> 3⁵ = 243. Then 2 × 243 = 486.</div>
            <div className="text-emerald-400 font-semibold">Answer: The 6th term is 486.</div>
          </div>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-300 font-mono">Example 2 (Infinite Sum)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Convergence |r| &lt; 1</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: Evaluate the infinite geometric series: 12 + 4 + 4/3 + 4/9 + ...
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> a = 12, r = 4 / 12 = 1/3.</div>
            <div><strong>Step 2:</strong> Check |r| = 1/3 &lt; 1 (convergent). Use S_∞ = a / (1 - r).</div>
            <div><strong>Step 3:</strong> S_∞ = 12 / (1 - 1/3) = 12 / (2/3).</div>
            <div><strong>Step 4:</strong> 12 × (3/2) = 18.</div>
            <div className="text-emerald-400 font-semibold">Answer: The infinite series converges to 18.</div>
          </div>
        </div>
      </div>

      {/* ─── 7. PRACTICE MODE ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Practice Mode: Check Your Understanding</h3>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 font-mono">Question 1:</div>
          <div className="text-sm text-white font-medium mb-3">
            What is the sum to infinity of the GP 16, 8, 4, 2, ...?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {['32', '64', '30', 'Divergent'].map((opt, oIdx) => {
              const isSelected = selectedPractice === oIdx;
              const isCorrect = oIdx === 0; // 16 / (1 - 0.5) = 32
              let style = 'bg-[#070f22] text-slate-300 border-[#14264c] hover:bg-[#12244a]';
              if (selectedPractice !== null) {
                if (isCorrect) style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                else if (isSelected) style = 'bg-rose-950/80 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => setSelectedPractice(oIdx)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {selectedPractice !== null && (
            <div className="pt-2 border-t border-[#14264c]">
              <div className="flex items-center justify-between text-xs">
                <span className={selectedPractice === 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {selectedPractice === 0 ? '✓ Correct! S_∞ = 16 / (1 - 0.5) = 32.' : '✗ Incorrect. Try viewing the solution step below:'}
                </span>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-blue-400 hover:text-blue-300 font-mono underline cursor-pointer"
                >
                  {showExplanation ? 'Hide Solution' : 'Show Solution'}
                </button>
              </div>

              {showExplanation && (
                <div className="mt-2 p-2.5 rounded bg-[#060c1d] border border-[#132244] text-xs font-mono text-slate-300">
                  Formula: S_∞ = a / (1 - r) → S_∞ = 16 / (1 - 0.5) = 16 / 0.5 = 32.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
