import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function GeometricMeanTab() {
  const [action, setAction] = useState<'two_nums' | 'insert_means' | 'multi_list'>('two_nums');

  // Input states
  const [valA, setValA] = useState<string>('4');
  const [valB, setValB] = useState<string>('36');
  const [countK, setCountK] = useState<string>('3');
  const [numListStr, setNumListStr] = useState<string>('2, 4, 8, 16');

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
    insertedValues?: number[];
  }>({
    resultTitle: 'Geometric Mean (GM)',
    answer: 'GM = 12',
    formula: 'GM = √(a · b)',
    step1: 'Identify given positive numbers: a = 4 and b = 36.',
    step2: 'Apply single geometric mean formula: GM = √(a · b).',
    step3: 'Multiply numbers: 4 × 36 = 144.',
    step4: 'Take square root: √144 = 12.',
    step5: 'The geometric mean is 12 (the sequence 4, 12, 36 is a GP with common ratio r = 3).'
  });

  // Practice quiz state
  const [selectedPractice, setSelectedPractice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleCalculate = () => {
    const a = Math.abs(parseFloat(valA)) || 1;
    const b = Math.abs(parseFloat(valB)) || 1;
    const k = Math.max(1, Math.round(parseFloat(countK) || 1));

    if (action === 'two_nums') {
      const gm = Math.sqrt(a * b);
      setCalculated({
        resultTitle: `Geometric Mean of ${a} & ${b}`,
        answer: `GM = ${Number(gm.toFixed(4))}`,
        formula: 'GM = √(a · b)',
        step1: `Given positive numbers: a = ${a}, b = ${b}.`,
        step2: `Use the formula GM = √(a · b).`,
        step3: `Multiply terms: ${a} × ${b} = ${a * b}.`,
        step4: `Take square root: √(${a * b}) = ${gm.toFixed(4)}.`,
        step5: `The geometric mean is ${Number(gm.toFixed(4))}. The sequence ${a}, ${Number(gm.toFixed(4))}, ${b} forms a GP.`
      });
    } else if (action === 'insert_means') {
      const r = Math.pow(b / a, 1 / (k + 1));
      const means = Array.from({ length: k }, (_, i) => a * Math.pow(r, i + 1));
      const formatted = means.map(m => Number(m.toFixed(3)));
      setCalculated({
        resultTitle: `${k} Inserted Geometric Means`,
        answer: `Means: [ ${formatted.join(', ')} ]`,
        formula: 'r = (b / a)^{1 / (k + 1)};  G_i = a · r^i',
        step1: `Given: a = ${a}, b = ${b}, number of means k = ${k}. Total terms in extended GP = ${k + 2}.`,
        step2: `Calculate common ratio: r = (${b} / ${a})^(1 / (${k} + 1)) = (${(b / a).toFixed(3)})^(1 / ${k + 1}).`,
        step3: `Evaluate r = ${Number(r.toFixed(4))}.`,
        step4: `Generate terms G_i = ${a} · (${Number(r.toFixed(4))})^i.`,
        step5: `The inserted geometric means are: ${formatted.join(', ')}. Full GP: ${a}, ${formatted.join(', ')}, ${b}.`,
        insertedValues: [a, ...formatted, b]
      });
    } else {
      const nums = numListStr.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n) && n > 0);
      const count = nums.length || 1;
      const product = nums.reduce((acc, v) => acc * v, 1);
      const gm = Math.pow(product, 1 / count);
      setCalculated({
        resultTitle: `Geometric Mean of ${count} Numbers`,
        answer: `GM = ${Number(gm.toFixed(4))}`,
        formula: 'GM = (∏ xᵢ)^{1/n}',
        step1: `Positive values: [ ${nums.join(', ')} ], count n = ${count}.`,
        step2: `Multiply all values: ∏xᵢ = ${product.toFixed(4)}.`,
        step3: `Take the ${count}-th root: (${product.toFixed(4)})^(1 / ${count}).`,
        step4: `Evaluate power: ${gm.toFixed(4)}.`,
        step5: `The geometric mean of the dataset is ${Number(gm.toFixed(4))}.`
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 font-sans">
      {/* ─── 1. TOPIC HEADER & EXPLANATION ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-semibold">
            TOPIC 05 · MEANS
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#112347] text-slate-300">
            CLASS 11–12
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-tight">
          Geometric Mean (GM)
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          The Geometric Mean (GM) is the central tendency of a set of positive numbers calculated by using their product. For two positive numbers a and b, inserting GM = √(ab) between them forms a Geometric Progression: a, GM, b.
        </p>
      </div>

      {/* ─── 2. MATHEMATICAL DEFINITION CARD ─── */}
      <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Mathematical Definition & Proportional Mean</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          If three positive numbers <span className="font-mono text-white">a, G, b</span> are in GP, then <span className="font-mono text-blue-300">G</span> is the Geometric Mean of <span className="font-mono text-white">a</span> and <span className="font-mono text-white">b</span>:
        </p>
        <div className="mt-2.5 p-3 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-xs sm:text-sm text-blue-200">
          G / a = b / G  ⟹  G² = a · b  ⟹  G = √(a · b)
        </div>
        <p className="mt-2.5 text-xs text-slate-400">
          For n positive values, the geometric mean is <span className="font-mono text-white">GM = (x₁ · x₂ · ... · xₙ)^(1/n)</span>. It is the proper average for exponential growth rates, percentages, and financial compounding factors.
        </p>
      </div>

      {/* ─── 3. FORMULA CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Single GM Formula</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            GM = √(a · b)
          </div>
          <p className="text-[11px] text-slate-400">Side length of a square having the same area as a rectangle of sides a and b.</p>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Inserting k GMs Formula</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            {'r = (b / a)^(1 / (k + 1)),  G_i = a · r^i'}
          </div>
          <p className="text-[11px] text-slate-400">Product of all k inserted means = [√(ab)]^k.</p>
        </div>
      </div>

      {/* ─── 4. INTERACTIVE CALCULATOR (CONNECTED WORKSPACE) ─── */}
      <div className="bg-[#091530] border-2 border-blue-900/60 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#14264c] mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 font-mono">
              Geometric Mean Calculator
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Fast & Step-by-Step</span>
        </div>

        {/* Action Toggle Pills: What would you like to find? */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2 font-medium">What would you like to calculate?</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'two_nums', label: 'GM of 2 Numbers' },
              { id: 'insert_means', label: 'Insert k Means Between a & b' },
              { id: 'multi_list', label: 'GM of Dataset' }
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
        {action !== 'multi_list' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">First Value (a &gt; 0):</label>
              <input
                type="number"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                placeholder="e.g. 4"
                className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Second Value (b &gt; 0):</label>
              <input
                type="number"
                value={valB}
                onChange={(e) => setValB(e.target.value)}
                placeholder="e.g. 36"
                className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>

            {action === 'insert_means' && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Means to Insert (k):</label>
                <input
                  type="number"
                  value={countK}
                  onChange={(e) => setCountK(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-xs font-mono text-slate-300 mb-1">Comma-Separated Positive Numbers:</label>
            <input
              type="text"
              value={numListStr}
              onChange={(e) => setNumListStr(e.target.value)}
              placeholder="e.g. 2, 4, 8, 16"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>
        )}

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
              setValA('4');
              setValB('36');
              setCountK('3');
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
              {calculated.formula}
            </div>
          </div>

          {calculated.insertedValues && (
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-mono mb-1.5">Full Geometric Progression:</div>
              <div className="flex flex-wrap gap-1.5">
                {calculated.insertedValues.map((val, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded border text-xs font-mono ${
                      idx === 0 || idx === calculated.insertedValues!.length - 1
                        ? 'bg-[#060c1d] border-slate-600 text-slate-400'
                        : 'bg-blue-950 border-blue-700 text-blue-300 font-bold'
                    }`}
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Step-by-Step Derivation:
            </div>
            <div className="p-3 rounded-lg bg-[#070f22] border border-[#132244] text-xs space-y-1.5 text-slate-300 leading-relaxed">
              <div className="text-blue-400 font-semibold">Step 1 — Identify Parameters:</div>
              <div>{calculated.step1}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 2 — Method:</div>
              <div>{calculated.step2}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 3 — Evaluate Product / Ratio:</div>
              <div className="font-mono text-blue-200">{calculated.step3}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 4 — Calculate Root:</div>
              <div>{calculated.step4}</div>
              <div className="text-emerald-400 font-semibold pt-1">Step 5 — Conclusion:</div>
              <div className="font-medium text-white">{calculated.step5}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. WORKED EXAMPLES ─── */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider px-1">
          Worked Examples
        </h3>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-300 font-mono">Example 1 (Basic GM)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Direct Root</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: Find the geometric mean between 9 and 36.
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> a = 9, b = 36.</div>
            <div><strong>Step 2:</strong> GM = √(a · b).</div>
            <div><strong>Step 3:</strong> 9 × 36 = 324.</div>
            <div><strong>Step 4:</strong> √324 = 18.</div>
            <div className="text-emerald-400 font-semibold">Answer: The geometric mean is 18.</div>
          </div>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300 font-mono">Example 2 (Inserting Means)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">3 Inserted GMs</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: Insert 3 geometric means between 2 and 162.
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> a = 2, b = 162, k = 3. Extended GP length = 5.</div>
            <div><strong>Step 2:</strong> r = (162 / 2)^(1 / 4) = 81^(1/4) = 3.</div>
            <div><strong>Step 3:</strong> G₁ = 2 × 3 = 6; G₂ = 6 × 3 = 18; G₃ = 18 × 3 = 54.</div>
            <div className="text-emerald-400 font-semibold">Answer: The 3 inserted geometric means are 6, 18, and 54.</div>
          </div>
        </div>
      </div>

      {/* ─── 6. PRACTICE MODE ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Practice Mode: Check Your Understanding</h3>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 font-mono">Question 1:</div>
          <div className="text-sm text-white font-medium mb-3">
            What is the geometric mean between 4 and 64?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {['16', '34', '32', '8'].map((opt, oIdx) => {
              const isSelected = selectedPractice === oIdx;
              const isCorrect = oIdx === 0; // sqrt(4 * 64) = sqrt(256) = 16
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
                  {selectedPractice === 0 ? '✓ Correct! GM = √(4 × 64) = √256 = 16.' : '✗ Incorrect. Try viewing the solution step below:'}
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
                  Formula: GM = √(a · b) → GM = √(4 × 64) = √256 = 16.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
