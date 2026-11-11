import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import * as math from 'mathjs';

export default function SequenceIntroTab() {
  const [ruleStr, setRuleStr] = useState<string>('3*n - 1');
  const [numTermsN, setNumTermsN] = useState<string>('6');

  const [calculated, setCalculated] = useState<{
    formula: string;
    terms: { n: number; val: number }[];
    seriesSum: number;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  }>({
    formula: 'aₙ = 3n - 1',
    terms: [
      { n: 1, val: 2 },
      { n: 2, val: 5 },
      { n: 3, val: 8 },
      { n: 4, val: 11 },
      { n: 5, val: 14 },
      { n: 6, val: 17 }
    ],
    seriesSum: 57,
    step1: 'Identify explicit formula: f(n) = 3n - 1 across index values n = 1, 2, 3, 4, 5, 6.',
    step2: 'Substitute integer index n = 1 to 6 into the explicit algebraic formula.',
    step3: 'Terms: a₁ = 3(1) - 1 = 2; a₂ = 3(2) - 1 = 5; a₃ = 3(3) - 1 = 8; a₄ = 11; a₅ = 14; a₆ = 17.',
    step4: 'Compute series sum: S₆ = 2 + 5 + 8 + 11 + 14 + 17 = 57.',
    step5: 'First 6 terms are 2, 5, 8, 11, 14, 17 with total series sum S₆ = 57.'
  });

  const [selectedPractice, setSelectedPractice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleGenerate = () => {
    const n = Math.max(1, Math.min(20, Math.round(parseFloat(numTermsN) || 6)));
    const cleanExpr = ruleStr.trim() || '2*n + 1';

    try {
      const compiled = math.compile(cleanExpr);
      const generated: { n: number; val: number }[] = [];
      let total = 0;

      for (let i = 1; i <= n; i++) {
        let v = 0;
        try {
          const raw = compiled.evaluate({ n: i });
          v = typeof raw === 'number' && isFinite(raw) ? Number(raw.toFixed(4)) : 0;
        } catch {
          v = 0;
        }
        generated.push({ n: i, val: v });
        total += v;
      }

      setCalculated({
        formula: `aₙ = ${cleanExpr}`,
        terms: generated,
        seriesSum: Number(total.toFixed(4)),
        step1: `Given explicit rule: aₙ = ${cleanExpr} evaluated for n = 1, ..., ${n}.`,
        step2: `Directly substitute index values n = 1 through ${n} into the expression.`,
        step3: `Evaluated terms: ${generated.map(t => `a_${t.n} = ${t.val}`).join('; ')}.`,
        step4: `Sum of first ${n} terms: ${generated.map(t => t.val).join(' + ')} = ${Number(total.toFixed(4))}.`,
        step5: `Generated ${n} sequence terms with series sum S_${n} = ${Number(total.toFixed(4))}.`
      });
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 font-sans">
      {/* ─── 1. TOPIC HEADER & EXPLANATION ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-semibold">
            TOPIC 01 · FOUNDATIONS
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#112347] text-slate-300">
            CLASS 11–12
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-tight">
          Definition of Sequences and Series
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          A sequence is an ordered collection of numbers following a definite mathematical rule. A series is the indicated sum of the terms of a sequence. Understanding the distinction between individual terms aₙ and accumulated partial sums Sₙ is the foundation of all progression analysis.
        </p>
      </div>

      {/* ─── 2. MATHEMATICAL DEFINITION CARD ─── */}
      <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Core Concepts: Sequence vs Series</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div className="p-3.5 rounded-lg bg-[#060c1d] border border-[#132244]">
            <div className="text-xs font-bold text-blue-300 font-mono mb-1">Sequence {`{aₙ}`}</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              An ordered list separated by commas where position matters:
            </p>
            <div className="font-mono text-xs text-white mt-1.5">a₁, a₂, a₃, ..., aₙ, ...</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#060c1d] border border-[#132244]">
            <div className="text-xs font-bold text-indigo-300 font-mono mb-1">Series ∑aₙ</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The indicated summation of terms connected by addition signs:
            </p>
            <div className="font-mono text-xs text-white mt-1.5">Sₙ = a₁ + a₂ + a₃ + ... + aₙ</div>
          </div>
        </div>
      </div>

      {/* ─── 3. FORMULA CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Explicit nth Term Rule</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            aₙ = f(n),  n ∈ {`{1, 2, 3, ...}`}
          </div>
          <p className="text-[11px] text-slate-400">Allows direct calculation of any term without knowing previous terms.</p>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Sigma Summation Notation</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            Sₙ = ∑_{`{k=1}`}^n a_k
          </div>
          <p className="text-[11px] text-slate-400">Compact notation for summing terms from index 1 to n.</p>
        </div>
      </div>

      {/* ─── 4. INTERACTIVE CALCULATOR (CONNECTED WORKSPACE) ─── */}
      <div className="bg-[#091530] border-2 border-blue-900/60 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#14264c] mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 font-mono">
              Sequence Term Generator & Series Calculator
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Fast & Step-by-Step</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-slate-300 mb-1">Explicit Rule f(n):</label>
            <input
              type="text"
              value={ruleStr}
              onChange={(e) => setRuleStr(e.target.value)}
              placeholder="e.g. 3*n - 1 or n^2 + 1 or 2^n"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Terms to Generate (n):</label>
            <input
              type="number"
              value={numTermsN}
              onChange={(e) => setNumTermsN(e.target.value)}
              placeholder="e.g. 6"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>
        </div>

        {/* Quick Example Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="text-[10px] text-slate-400 uppercase font-mono mr-1">Presets:</span>
          {[
            { label: '3n - 1', rule: '3*n - 1' },
            { label: 'n² + 1', rule: 'n^2 + 1' },
            { label: '2ⁿ', rule: '2^n' },
            { label: '1 / n', rule: '1 / n' }
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRuleStr(preset.rule);
              }}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#070f22] text-slate-300 border border-[#162c57] hover:border-blue-500 hover:text-white cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Calculate Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Generate & Evaluate</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setRuleStr('3*n - 1');
              setNumTermsN('6');
            }}
            className="p-2.5 rounded-xl bg-[#070f22] border border-[#162c57] hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to sample rule"
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
                <span>Series Sum Result</span>
              </div>
              <div className="text-xl sm:text-2xl font-serif text-white font-bold mt-1">
                S_{calculated.terms.length} = {calculated.seriesSum}
              </div>
            </div>
            <div className="text-xs font-mono text-blue-200 bg-[#060c1d] px-3 py-1.5 rounded border border-[#14264c] self-start sm:self-auto">
              {calculated.formula}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mb-1.5">Generated Terms:</div>
            <div className="flex flex-wrap gap-1.5">
              {calculated.terms.map((t) => (
                <span
                  key={t.n}
                  className="px-2.5 py-1 rounded bg-[#060c1d] border border-[#162c57] text-xs font-mono text-slate-200"
                >
                  a_{t.n} = <strong className="text-blue-300">{t.val}</strong>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Step-by-Step Solution:
            </div>
            <div className="p-3 rounded-lg bg-[#070f22] border border-[#132244] text-xs space-y-1.5 text-slate-300 leading-relaxed">
              <div className="text-blue-400 font-semibold">Step 1 — Identify Rule:</div>
              <div>{calculated.step1}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 2 — Method:</div>
              <div>{calculated.step2}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 3 — Substitute Values:</div>
              <div className="font-mono text-blue-200">{calculated.step3}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 4 — Evaluate Partial Sum:</div>
              <div>{calculated.step4}</div>
              <div className="text-emerald-400 font-semibold pt-1">Step 5 — Final Result:</div>
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
            <span className="text-xs font-semibold text-blue-300 font-mono">Example 1 (Linear Explicit Rule)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Generating Terms</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: Find the first 4 terms of the sequence aₙ = 3n + 2, and evaluate S₄.
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> Substitute n = 1, 2, 3, 4 into aₙ = 3n + 2.</div>
            <div><strong>Step 2:</strong> a₁ = 3(1) + 2 = 5; a₂ = 3(2) + 2 = 8; a₃ = 3(3) + 2 = 11; a₄ = 3(4) + 2 = 14.</div>
            <div><strong>Step 3:</strong> Sum S₄ = 5 + 8 + 11 + 14 = 38.</div>
            <div className="text-emerald-400 font-semibold">Answer: Terms are 5, 8, 11, 14. Series sum S₄ = 38.</div>
          </div>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300 font-mono">Example 2 (Alternating Sequence)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">Sign Oscillation</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: Evaluate aₙ = (-1)ⁿ · 2ⁿ for the first 3 terms.
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> a₁ = (-1)¹ · 2¹ = -2.</div>
            <div><strong>Step 2:</strong> a₂ = (-1)² · 2² = +4.</div>
            <div><strong>Step 3:</strong> a₃ = (-1)³ · 2³ = -8.</div>
            <div className="text-emerald-400 font-semibold">Answer: The terms are -2, 4, -8.</div>
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
            What is the 5th term of the sequence defined by aₙ = 2n² - 3?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {['47', '50', '35', '43'].map((opt, oIdx) => {
              const isSelected = selectedPractice === oIdx;
              const isCorrect = oIdx === 0; // 2*(25) - 3 = 47
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
                  {selectedPractice === 0 ? '✓ Correct! a₅ = 2(5)² - 3 = 2(25) - 3 = 47.' : '✗ Incorrect. Try viewing the solution step below:'}
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
                  Substitute n = 5: a₅ = 2(5²) - 3 = 2(25) - 3 = 50 - 3 = 47.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
