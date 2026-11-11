import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function ArithmeticMeanTab() {
  const [action, setAction] = useState<'two_nums' | 'insert_means' | 'multi_list'>('two_nums');

  // Input states
  const [valA, setValA] = useState<string>('12');
  const [valB, setValB] = useState<string>('36');
  const [countK, setCountK] = useState<string>('3');
  const [numListStr, setNumListStr] = useState<string>('10, 15, 20, 25, 30');

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
    resultTitle: 'Arithmetic Mean (AM)',
    answer: 'AM = 24',
    formula: 'AM = (a + b) / 2',
    step1: 'Identify given numbers: a = 12 and b = 36.',
    step2: 'Apply single arithmetic mean formula: AM = (a + b) / 2.',
    step3: 'Substitute numbers: AM = (12 + 36) / 2.',
    step4: 'Sum: 12 + 36 = 48. Divide by 2: 48 / 2 = 24.',
    step5: 'The arithmetic mean between 12 and 36 is 24 (the sequence 12, 24, 36 is an AP with d = 12).'
  });

  // Practice quiz state
  const [selectedPractice, setSelectedPractice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleCalculate = () => {
    const a = parseFloat(valA) || 0;
    const b = parseFloat(valB) || 0;
    const k = Math.max(1, Math.round(parseFloat(countK) || 1));

    if (action === 'two_nums') {
      const am = (a + b) / 2;
      setCalculated({
        resultTitle: `Arithmetic Mean of ${a} & ${b}`,
        answer: `AM = ${am}`,
        formula: 'AM = (a + b) / 2',
        step1: `Given values: a = ${a}, b = ${b}.`,
        step2: `Use standard arithmetic average formula: AM = (a + b) / 2.`,
        step3: `Substitute: AM = (${a} + ${b}) / 2 = ${a + b} / 2.`,
        step4: `Evaluate quotient: ${a + b} ÷ 2 = ${am}.`,
        step5: `The arithmetic mean is ${am}. The sequence ${a}, ${am}, ${b} forms an AP with d = ${(b - a) / 2}.`
      });
    } else if (action === 'insert_means') {
      const d = (b - a) / (k + 1);
      const means = Array.from({ length: k }, (_, i) => a + (i + 1) * d);
      const meansFormatted = means.map(m => Number(m.toFixed(3)));
      setCalculated({
        resultTitle: `${k} Inserted Arithmetic Means`,
        answer: `Means: [ ${meansFormatted.join(', ')} ]`,
        formula: 'd = (b - a) / (k + 1);  A_i = a + i·d',
        step1: `Given endpoints a = ${a}, b = ${b}, count of means to insert k = ${k}.`,
        step2: `Calculate common difference of the extended (k + 2) term AP: d = (b - a) / (k + 1).`,
        step3: `Substitute: d = (${b} - ${a}) / (${k} + 1) = ${b - a} / ${k + 1} = ${Number(d.toFixed(4))}.`,
        step4: `Generate inserted terms: A_i = ${a} + i × (${Number(d.toFixed(4))}).`,
        step5: `Inserted means: ${meansFormatted.join(', ')}. Full AP: ${a}, ${meansFormatted.join(', ')}, ${b}.`,
        insertedValues: [a, ...meansFormatted, b]
      });
    } else {
      // Multiple list
      const nums = numListStr.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n));
      const count = nums.length || 1;
      const sum = nums.reduce((acc, v) => acc + v, 0);
      const avg = sum / count;
      setCalculated({
        resultTitle: `Arithmetic Mean of ${count} Values`,
        answer: `Mean = ${Number(avg.toFixed(4))}`,
        formula: 'AM = (∑xᵢ) / n',
        step1: `Values: [ ${nums.join(', ')} ], count n = ${count}.`,
        step2: `Sum all values: ∑xᵢ = ${nums.join(' + ')} = ${sum}.`,
        step3: `Divide by count n: ${sum} / ${count}.`,
        step4: `Evaluate: ${sum} ÷ ${count} = ${Number(avg.toFixed(4))}.`,
        step5: `The arithmetic mean of the dataset is ${Number(avg.toFixed(4))}.`
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 font-sans">
      {/* ─── 1. TOPIC HEADER & EXPLANATION ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-semibold">
            TOPIC 04 · MEANS
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#112347] text-slate-300">
            CLASS 11–12
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-tight">
          Arithmetic Mean (AM)
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          The Arithmetic Mean (AM) is the average value or balance point of numbers. For two numbers a and b, inserting their arithmetic mean AM = (a + b)/2 between them creates an Arithmetic Progression: a, AM, b.
        </p>
      </div>

      {/* ─── 2. MATHEMATICAL DEFINITION CARD ─── */}
      <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Mathematical Definition & Inserting Means</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          If three numbers <span className="font-mono text-white">a, A, b</span> are in AP, then <span className="font-mono text-blue-300">A</span> is the Arithmetic Mean of <span className="font-mono text-white">a</span> and <span className="font-mono text-white">b</span>. By common difference definition:
        </p>
        <div className="mt-2.5 p-3 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-xs sm:text-sm text-blue-200">
          A - a = b - A  ⟹  2A = a + b  ⟹  A = (a + b) / 2
        </div>
        <p className="mt-2.5 text-xs text-slate-400">
          To insert <span className="font-mono text-blue-300">k</span> arithmetic means between a and b, the common difference is <span className="font-mono text-white">d = (b - a)/(k + 1)</span>.
        </p>
      </div>

      {/* ─── 3. FORMULA CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Single AM Formula</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            AM = (a + b) / 2
          </div>
          <p className="text-[11px] text-slate-400">The exact midpoint balance between two quantities.</p>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Inserting k Means Formula</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            d = (b - a) / (k + 1),  A_i = a + i · d
          </div>
          <p className="text-[11px] text-slate-400">Sum of all k inserted means = k × (a + b)/2.</p>
        </div>
      </div>

      {/* ─── 4. INTERACTIVE CALCULATOR (CONNECTED WORKSPACE) ─── */}
      <div className="bg-[#091530] border-2 border-blue-900/60 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#14264c] mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 font-mono">
              Arithmetic Mean Calculator
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Fast & Step-by-Step</span>
        </div>

        {/* Action Toggle Pills: What would you like to find? */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2 font-medium">What would you like to calculate?</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'two_nums', label: 'AM of 2 Numbers' },
              { id: 'insert_means', label: 'Insert k Means Between a & b' },
              { id: 'multi_list', label: 'AM of Dataset' }
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
              <label className="block text-xs font-mono text-slate-300 mb-1">First Value (a):</label>
              <input
                type="number"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                placeholder="e.g. 12"
                className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Second Value (b):</label>
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
            <label className="block text-xs font-mono text-slate-300 mb-1">Comma-Separated Numbers:</label>
            <input
              type="text"
              value={numListStr}
              onChange={(e) => setNumListStr(e.target.value)}
              placeholder="e.g. 10, 15, 20, 25, 30"
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
              setValA('12');
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
              <div className="text-[11px] text-slate-400 uppercase font-mono mb-1.5">Full Arithmetic Progression:</div>
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
              <div className="text-blue-400 font-semibold pt-1">Step 3 — Substitute:</div>
              <div className="font-mono text-blue-200">{calculated.step3}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 4 — Simplify:</div>
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
            <span className="text-xs font-semibold text-blue-300 font-mono">Example 1 (Basic AM)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Direct Midpoint</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: Find the arithmetic mean between 28 and 72.
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> a = 28, b = 72.</div>
            <div><strong>Step 2:</strong> AM = (a + b) / 2.</div>
            <div><strong>Step 3:</strong> AM = (28 + 72) / 2 = 100 / 2.</div>
            <div className="text-emerald-400 font-semibold">Answer: The arithmetic mean is 50.</div>
          </div>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300 font-mono">Example 2 (Inserting Means)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">4 Inserted AMs</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: Insert 4 arithmetic means between 3 and 23.
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> a = 3, b = 23, k = 4. Number of terms in AP is 4 + 2 = 6.</div>
            <div><strong>Step 2:</strong> d = (b - a) / (k + 1) = (23 - 3) / 5 = 20 / 5 = 4.</div>
            <div><strong>Step 3:</strong> A₁ = 3 + 4 = 7; A₂ = 7 + 4 = 11; A₃ = 11 + 4 = 15; A₄ = 15 + 4 = 19.</div>
            <div className="text-emerald-400 font-semibold">Answer: The 4 inserted arithmetic means are 7, 11, 15, and 19.</div>
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
            If the arithmetic mean between a and 18 is 25, what is the value of a?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {['32', '30', '34', '28'].map((opt, oIdx) => {
              const isSelected = selectedPractice === oIdx;
              const isCorrect = oIdx === 0; // (a + 18)/2 = 25 -> a = 32
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
                  {selectedPractice === 0 ? '✓ Correct! (a + 18)/2 = 25 ⇒ a + 18 = 50 ⇒ a = 32.' : '✗ Incorrect. Try viewing the solution step below:'}
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
                  Equation: (a + 18) / 2 = 25 → a + 18 = 50 → a = 50 - 18 = 32.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
