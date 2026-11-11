import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function ArithmeticProgressionTab() {
  // Mode: What would you like to find?
  const [action, setAction] = useState<'nth_term' | 'sum_terms' | 'common_diff' | 'missing_term'>('nth_term');

  // Input states
  const [firstTermA, setFirstTermA] = useState<string>('5');
  const [commonDiffD, setCommonDiffD] = useState<string>('3');
  const [numTermsN, setNumTermsN] = useState<string>('10');
  const [lastTermL, setLastTermL] = useState<string>('32');

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
    resultTitle: '10th Term (a₁₀)',
    answer: 'a₁₀ = 32',
    formula: 'aₙ = a + (n - 1)d',
    step1: 'Identify given parameters: First term a = 5, common difference d = 3, term index n = 10.',
    step2: 'Apply the standard nth-term formula: aₙ = a + (n - 1)d.',
    step3: 'Substitute the given values: a₁₀ = 5 + (10 - 1) × 3.',
    step4: 'Calculate product: (10 - 1) × 3 = 9 × 3 = 27. Then add 5: 5 + 27 = 32.',
    step5: 'The 10th term of this Arithmetic Progression is 32.',
    terms: [5, 8, 11, 14, 17, 20, 23, 26, 29, 32]
  });

  // Practice quiz state
  const [selectedPractice, setSelectedPractice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleCalculate = () => {
    const a = parseFloat(firstTermA) || 0;
    const d = parseFloat(commonDiffD) || 0;
    const n = Math.max(1, Math.round(parseFloat(numTermsN) || 1));
    const l = parseFloat(lastTermL) || 0;

    if (action === 'nth_term') {
      const an = a + (n - 1) * d;
      const sampleTerms = Array.from({ length: Math.min(n, 12) }, (_, i) => a + i * d);
      setCalculated({
        resultTitle: `${n}th Term (a_${n})`,
        answer: `a_${n} = ${an}`,
        formula: 'aₙ = a + (n - 1)d',
        step1: `Given: First term a = ${a}, Common difference d = ${d}, Term count n = ${n}.`,
        step2: `Use the nth term formula: aₙ = a + (n - 1)d.`,
        step3: `Substitute values: a_${n} = ${a} + (${n} - 1) × (${d}) = ${a} + (${n - 1}) × (${d}).`,
        step4: `Multiply: (${n - 1}) × (${d}) = ${(n - 1) * d}. Then add a: ${a} + ${(n - 1) * d} = ${an}.`,
        step5: `The ${n}th term of this Arithmetic Progression is ${an}.`,
        terms: sampleTerms
      });
    } else if (action === 'sum_terms') {
      const sn = (n / 2) * (2 * a + (n - 1) * d);
      const sampleTerms = Array.from({ length: Math.min(n, 12) }, (_, i) => a + i * d);
      setCalculated({
        resultTitle: `Sum of First ${n} Terms (S_${n})`,
        answer: `S_${n} = ${sn}`,
        formula: 'Sₙ = (n/2) · [2a + (n - 1)d]',
        step1: `Given: a = ${a}, d = ${d}, n = ${n}.`,
        step2: `Apply Gauss sum formula: Sₙ = (n/2)[2a + (n - 1)d].`,
        step3: `Substitute: S_${n} = (${n}/2) × [2(${a}) + (${n} - 1)(${d})].`,
        step4: `Simplify inside brackets: 2(${a}) = ${2 * a}; (${n - 1})(${d}) = ${(n - 1) * d}; Total bracket = ${2 * a + (n - 1) * d}.`,
        step5: `Multiply by n/2 (${n / 2}): ${n / 2} × ${2 * a + (n - 1) * d} = ${sn}.`,
        terms: sampleTerms
      });
    } else if (action === 'common_diff') {
      // Find d given a, l, n: d = (l - a)/(n - 1)
      const computedD = n > 1 ? (l - a) / (n - 1) : 0;
      const sampleTerms = Array.from({ length: Math.min(n, 10) }, (_, i) => a + i * computedD);
      setCalculated({
        resultTitle: 'Common Difference (d)',
        answer: `d = ${computedD}`,
        formula: 'd = (l - a) / (n - 1)',
        step1: `Given: First term a = ${a}, Last term l = ${l}, Number of terms n = ${n}.`,
        step2: `Rearrange l = a + (n - 1)d to solve for d: d = (l - a) / (n - 1).`,
        step3: `Substitute: d = (${l} - ${a}) / (${n} - 1) = ${l - a} / ${n - 1}.`,
        step4: `Divide: ${l - a} ÷ ${n - 1} = ${computedD}.`,
        step5: `The constant common difference between successive terms is d = ${computedD}.`,
        terms: sampleTerms
      });
    } else {
      // Missing term
      const an = a + (n - 1) * d;
      setCalculated({
        resultTitle: `Missing Term at Position ${n}`,
        answer: `Term = ${an}`,
        formula: 'aₙ = a + (n - 1)d',
        step1: `Locate position n = ${n} with a = ${a} and d = ${d}.`,
        step2: `Apply difference progression step formula.`,
        step3: `Substitute: a_${n} = ${a} + (${n} - 1) × ${d}.`,
        step4: `Evaluate: ${a} + ${(n - 1) * d} = ${an}.`,
        step5: `The missing value at position ${n} is ${an}.`,
        terms: [a, a + d, a + 2 * d, an]
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 font-sans">
      {/* ─── 1. TOPIC HEADER & EXPLANATION ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-semibold">
            TOPIC 02 · PROGRESSIONS
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#112347] text-slate-300">
            CLASS 11–12
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-tight">
          Arithmetic Progression (AP)
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          An Arithmetic Progression (AP) is a numerical sequence where each term after the first is obtained by adding a fixed constant value, known as the common difference (<span className="text-blue-300 font-mono font-bold">d</span>), to the preceding term.
        </p>
      </div>

      {/* ─── 2. MATHEMATICAL DEFINITION CARD ─── */}
      <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Mathematical Definition</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          A sequence <span className="font-mono text-white">a₁, a₂, a₃, ..., aₙ</span> is called an Arithmetic Progression if and only if the difference between any two consecutive terms remains constant throughout:
        </p>
        <div className="mt-2.5 p-3 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-xs sm:text-sm text-blue-200">
          aₖ₊₁ - aₖ = d = constant  for all  k ≥ 1
        </div>
        <p className="mt-2.5 text-xs text-slate-400">
          The constant <span className="text-blue-300 font-mono">d</span> can be positive (increasing AP), negative (decreasing AP), or zero (constant AP).
        </p>
      </div>

      {/* ─── 3. FORMULA CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">nth Term Formula</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3.5 py-2 my-2 shadow-inner">
            aₙ = a + (n - 1)d
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1">
            <li><span className="font-mono text-blue-300">a</span> = First term (a₁)</li>
            <li><span className="font-mono text-blue-300">d</span> = Common difference (a₂ - a₁)</li>
            <li><span className="font-mono text-blue-300">n</span> = Number of terms / term index</li>
          </ul>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Sum of First n Terms (Sₙ)</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3.5 py-2 my-2 shadow-inner">
            Sₙ = n/2 · [2a + (n - 1)d] = n/2 · (a + l)
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1">
            <li><span className="font-mono text-blue-300">Sₙ</span> = Total sum of first n terms</li>
            <li><span className="font-mono text-blue-300">l</span> = Last term (l = aₙ)</li>
            <li><span className="font-mono text-blue-300">n/2</span> = Number of paired terms</li>
          </ul>
        </div>
      </div>

      {/* ─── 4. INTERACTIVE CALCULATOR (CONNECTED WORKSPACE) ─── */}
      <div className="bg-[#091530] border-2 border-blue-900/60 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#14264c] mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 font-mono">
              Arithmetic Progression Calculator
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
              { id: 'sum_terms', label: 'Sum of Terms (Sₙ)' },
              { id: 'common_diff', label: 'Common Difference (d)' },
              { id: 'missing_term', label: 'Missing Term' }
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
              placeholder="e.g. 5"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>

          {action !== 'common_diff' ? (
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Common Difference (d):</label>
              <input
                type="number"
                value={commonDiffD}
                onChange={(e) => setCommonDiffD(e.target.value)}
                placeholder="e.g. 3"
                className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Last Term (l):</label>
              <input
                type="number"
                value={lastTermL}
                onChange={(e) => setLastTermL(e.target.value)}
                placeholder="e.g. 32"
                className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Number of Terms (n):</label>
            <input
              type="number"
              value={numTermsN}
              onChange={(e) => setNumTermsN(e.target.value)}
              placeholder="e.g. 10"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>
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
              setFirstTermA('5');
              setCommonDiffD('3');
              setNumTermsN('10');
              setLastTermL('32');
            }}
            className="p-2.5 rounded-xl bg-[#070f22] border border-[#162c57] hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to sample values"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Calculated Answer & Step-by-Step Derivation in Connected Layout */}
        <div className="mt-6 pt-5 border-t border-[#14264c] space-y-4">
          {/* Answer Card */}
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

          {/* Sequence Preview Badges */}
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mb-1.5">Progression Terms Preview:</div>
            <div className="flex flex-wrap gap-1.5">
              {calculated.terms.map((term, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-[#060c1d] border border-[#162c57] text-xs font-mono text-slate-200"
                >
                  a_{idx + 1} = <strong className="text-blue-300">{term}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* 5-Step Derivation Breakdown */}
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
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span>Graphical Representation (Linear AP Growth)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          An arithmetic progression graphs as discrete points along a straight line of slope m = d.
        </p>

        {/* SVG Discrete Progression Plot */}
        <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-3 flex items-end justify-between gap-1 overflow-x-auto">
          {calculated.terms.map((term, idx) => {
            const minVal = Math.min(...calculated.terms);
            const maxVal = Math.max(...calculated.terms);
            const range = maxVal - minVal || 1;
            const heightPct = Math.max(15, Math.min(95, ((term - minVal) / range) * 80 + 15));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-300">
                  {term}
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full max-w-[28px] bg-blue-600/80 hover:bg-blue-500 rounded-t border-t border-blue-400 transition-all shadow-sm"
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

        {/* Example 1: Basic */}
        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-300 font-mono">Example 1 (Basic)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Direct nth Term</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: Find the 15th term of the arithmetic progression 4, 7, 10, 13, ...
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> Identify a = 4, common difference d = 7 - 4 = 3, target n = 15.</div>
            <div><strong>Step 2:</strong> Use aₙ = a + (n - 1)d.</div>
            <div><strong>Step 3:</strong> a₁₅ = 4 + (15 - 1)(3) = 4 + 14(3).</div>
            <div><strong>Step 4:</strong> 14 × 3 = 42. Then 4 + 42 = 46.</div>
            <div className="text-emerald-400 font-semibold">Answer: The 15th term is a₁₅ = 46.</div>
          </div>
        </div>

        {/* Example 2: Moderately Challenging */}
        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300 font-mono">Example 2 (Moderately Challenging)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">Working Backwards from Sum</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: How many terms of the AP 17, 15, 13, ... must be added to yield a sum of 72?
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> First term a = 17, difference d = 15 - 17 = -2, Sum Sₙ = 72.</div>
            <div><strong>Step 2:</strong> Apply Sₙ = (n/2)[2a + (n - 1)d]: 72 = (n/2)[34 + (n - 1)(-2)].</div>
            <div><strong>Step 3:</strong> 72 = (n/2)[36 - 2n] = n(18 - n) = 18n - n².</div>
            <div><strong>Step 4:</strong> Quadratic equation: n² - 18n + 72 = 0 ⇒ (n - 6)(n - 12) = 0.</div>
            <div className="text-emerald-400 font-semibold">Answer: Both n = 6 and n = 12 give sum 72 (terms from 7 to 12 sum to zero).</div>
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
            What is the 20th term of an AP whose first term is 6 and common difference is 5?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {['101', '106', '96', '100'].map((opt, oIdx) => {
              const isSelected = selectedPractice === oIdx;
              const isCorrect = oIdx === 0; // 6 + 19(5) = 6 + 95 = 101
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
                  {selectedPractice === 0 ? '✓ Correct! a₂₀ = 6 + 19(5) = 101.' : '✗ Incorrect. Try viewing the solution step below:'}
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
                  Formula: aₙ = a + (n - 1)d → a₂₀ = 6 + (20 - 1) × 5 = 6 + 19 × 5 = 6 + 95 = 101.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
