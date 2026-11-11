import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function HarmonicMeanTab() {
  const [action, setAction] = useState<'two_nums' | 'avg_speed' | 'compare_all'>('two_nums');

  // Input states
  const [valA, setValA] = useState<string>('60');
  const [valB, setValB] = useState<string>('40');

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
    am?: number;
    gm?: number;
    hm?: number;
  }>({
    resultTitle: 'Harmonic Mean (HM)',
    answer: 'HM = 48',
    formula: 'HM = 2ab / (a + b)',
    step1: 'Identify given positive values: a = 60 and b = 40.',
    step2: 'Apply harmonic mean formula: HM = 2ab / (a + b).',
    step3: 'Multiply numerator: 2 × 60 × 40 = 4800. Sum denominator: 60 + 40 = 100.',
    step4: 'Evaluate quotient: 4800 / 100 = 48.',
    step5: 'The harmonic mean is exactly 48 (e.g. average round-trip speed over equal distances is 48 km/h).'
  });

  // Practice quiz state
  const [selectedPractice, setSelectedPractice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleCalculate = () => {
    const a = Math.abs(parseFloat(valA)) || 1;
    const b = Math.abs(parseFloat(valB)) || 1;

    const hm = (2 * a * b) / (a + b);
    const am = (a + b) / 2;
    const gm = Math.sqrt(a * b);

    if (action === 'two_nums') {
      setCalculated({
        resultTitle: `Harmonic Mean of ${a} & ${b}`,
        answer: `HM = ${Number(hm.toFixed(4))}`,
        formula: 'HM = 2ab / (a + b) = 2 / (1/a + 1/b)',
        step1: `Given positive numbers: a = ${a}, b = ${b}.`,
        step2: `Apply harmonic mean formula: HM = 2ab / (a + b).`,
        step3: `Numerator: 2 × ${a} × ${b} = ${2 * a * b}. Denominator: ${a} + ${b} = ${a + b}.`,
        step4: `Divide: ${2 * a * b} ÷ ${a + b} = ${hm.toFixed(4)}.`,
        step5: `The harmonic mean is ${Number(hm.toFixed(4))}.`
      });
    } else if (action === 'avg_speed') {
      setCalculated({
        resultTitle: `Round-Trip Average Speed`,
        answer: `Avg Speed = ${Number(hm.toFixed(2))} units/h`,
        formula: 'v_avg = 2 · v₁ · v₂ / (v₁ + v₂)',
        step1: `Speed outgoing v₁ = ${a}, Speed return v₂ = ${b} over identical distance d.`,
        step2: `Average speed is total distance (2d) divided by total time (d/v₁ + d/v₂).`,
        step3: `v_avg = 2 / (1/v₁ + 1/v₂) = 2 · v₁ · v₂ / (v₁ + v₂).`,
        step4: `Substitute: 2(${a})(${b}) / (${a} + ${b}) = ${2 * a * b} / ${a + b} = ${hm.toFixed(2)}.`,
        step5: `The correct average speed is ${Number(hm.toFixed(2))} (note: it is not the arithmetic mean ${(a + b) / 2}).`
      });
    } else {
      // Compare AM, GM, HM
      setCalculated({
        resultTitle: `Means Relationship: AM ≥ GM ≥ HM`,
        answer: `AM = ${am.toFixed(2)}  ≥  GM = ${gm.toFixed(2)}  ≥  HM = ${hm.toFixed(2)}`,
        formula: 'AM ≥ GM ≥ HM  and  GM² = AM · HM',
        step1: `Calculate AM = (${a} + ${b})/2 = ${am.toFixed(4)}.`,
        step2: `Calculate GM = √(${a} × ${b}) = ${gm.toFixed(4)}.`,
        step3: `Calculate HM = 2(${a})(${b})/(${a} + ${b}) = ${hm.toFixed(4)}.`,
        step4: `Verify identity: AM × HM = ${am.toFixed(4)} × ${hm.toFixed(4)} = ${(am * hm).toFixed(4)} ≈ GM² = ${(gm * gm).toFixed(4)}.`,
        step5: `Confirmed: ${am.toFixed(2)} ≥ ${gm.toFixed(2)} ≥ ${hm.toFixed(2)} with GM² = AM · HM.`,
        am,
        gm,
        hm
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 font-sans">
      {/* ─── 1. TOPIC HEADER & EXPLANATION ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-semibold">
            TOPIC 06 · MEANS
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#112347] text-slate-300">
            CLASS 11–12
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-tight">
          Harmonic Mean (HM) & AM–GM–HM Relation
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          The Harmonic Mean (HM) is the reciprocal of the arithmetic mean of the reciprocals. It is the mathematically accurate average for rates (such as speeds over equal distances). For positive numbers, the classical inequality <span className="text-blue-300 font-bold font-mono">AM ≥ GM ≥ HM</span> and product identity <span className="text-blue-300 font-bold font-mono">GM² = AM · HM</span> always hold.
        </p>
      </div>

      {/* ─── 2. MATHEMATICAL DEFINITION CARD ─── */}
      <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Mathematical Definition & Reciprocal Average</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          For two positive numbers <span className="font-mono text-white">a</span> and <span className="font-mono text-white">b</span>, the Harmonic Mean <span className="font-mono text-blue-300">H</span> satisfies:
        </p>
        <div className="mt-2.5 p-3 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-xs sm:text-sm text-blue-200">
          1/H = (1/a + 1/b) / 2  ⟹  H = 2 / (1/a + 1/b) = 2ab / (a + b)
        </div>
        <p className="mt-2.5 text-xs text-slate-400">
          If three numbers <span className="font-mono text-white">a, H, b</span> are in Harmonic Progression (HP), then their reciprocals <span className="font-mono text-white">1/a, 1/H, 1/b</span> form an Arithmetic Progression (AP).
        </p>
      </div>

      {/* ─── 3. FORMULA CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">Harmonic Mean Formula</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            HM = 2ab / (a + b)
          </div>
          <p className="text-[11px] text-slate-400">Correct formulation for averaging speeds, densities, and resistance in parallel.</p>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <div className="text-xs font-semibold text-slate-300 mb-1">AM–GM–HM Classical Relation</div>
          <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3 py-2 my-2 shadow-inner">
            AM ≥ GM ≥ HM  and  GM² = AM · HM
          </div>
          <p className="text-[11px] text-amber-300">Equality holds if and only if a = b.</p>
        </div>
      </div>

      {/* ─── 4. INTERACTIVE CALCULATOR (CONNECTED WORKSPACE) ─── */}
      <div className="bg-[#091530] border-2 border-blue-900/60 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#14264c] mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 font-mono">
              Harmonic Mean & Comparison Calculator
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Fast & Step-by-Step</span>
        </div>

        {/* Action Toggle Pills: What would you like to find? */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2 font-medium">What would you like to calculate?</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'two_nums', label: 'HM of 2 Values' },
              { id: 'avg_speed', label: 'Average Speed Problem' },
              { id: 'compare_all', label: 'Compare AM, GM & HM' }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              {action === 'avg_speed' ? 'Speed 1 (v₁ in km/h):' : 'First Value (a &gt; 0):'}
            </label>
            <input
              type="number"
              value={valA}
              onChange={(e) => setValA(e.target.value)}
              placeholder="e.g. 60"
              className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              {action === 'avg_speed' ? 'Speed 2 (v₂ in km/h):' : 'Second Value (b &gt; 0):'}
            </label>
            <input
              type="number"
              value={valB}
              onChange={(e) => setValB(e.target.value)}
              placeholder="e.g. 40"
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
              setValA('60');
              setValB('40');
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

          {calculated.am !== undefined && (
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#060c1d] border border-[#162c57] text-center font-mono">
              <div className="p-2 rounded bg-blue-950/50 border border-blue-800">
                <div className="text-[10px] text-slate-400 uppercase">Arithmetic Mean</div>
                <div className="text-base font-bold text-blue-300 mt-0.5">{calculated.am.toFixed(2)}</div>
              </div>
              <div className="p-2 rounded bg-indigo-950/50 border border-indigo-800">
                <div className="text-[10px] text-slate-400 uppercase">Geometric Mean</div>
                <div className="text-base font-bold text-indigo-300 mt-0.5">{calculated.gm!.toFixed(2)}</div>
              </div>
              <div className="p-2 rounded bg-emerald-950/50 border border-emerald-800">
                <div className="text-[10px] text-slate-400 uppercase">Harmonic Mean</div>
                <div className="text-base font-bold text-emerald-300 mt-0.5">{calculated.hm!.toFixed(2)}</div>
              </div>
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Step-by-Step Derivation:
            </div>
            <div className="p-3 rounded-lg bg-[#070f22] border border-[#132244] text-xs space-y-1.5 text-slate-300 leading-relaxed">
              <div className="text-blue-400 font-semibold">Step 1 — Identify Values:</div>
              <div>{calculated.step1}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 2 — Method:</div>
              <div>{calculated.step2}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 3 — Substitute:</div>
              <div className="font-mono text-blue-200">{calculated.step3}</div>
              <div className="text-blue-400 font-semibold pt-1">Step 4 — Evaluate:</div>
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
            <span className="text-xs font-semibold text-blue-300 font-mono">Example 1 (Round Trip Speed)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Equal Distances</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: A car travels from A to B at 60 km/h, and returns along the same route at 40 km/h. What is the average speed?
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> Outbound v₁ = 60 km/h, Inbound v₂ = 40 km/h over identical distance.</div>
            <div><strong>Step 2:</strong> Use HM = 2 · v₁ · v₂ / (v₁ + v₂).</div>
            <div><strong>Step 3:</strong> 2(60)(40) / (60 + 40) = 4800 / 100.</div>
            <div className="text-emerald-400 font-semibold">Answer: The average speed is 48 km/h. (Not 50 km/h!).</div>
          </div>
        </div>

        <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-300 font-mono">Example 2 (AM-GM-HM Relation)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">Checking G² = AH</span>
          </div>
          <div className="text-sm font-medium text-white mb-2">
            Problem: For numbers 18 and 8, calculate AM, GM, and HM, and verify GM² = AM · HM.
          </div>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed bg-[#060c1d] p-3 rounded-lg border border-[#132244]">
            <div><strong>Step 1:</strong> AM = (18 + 8)/2 = 13.</div>
            <div><strong>Step 2:</strong> GM = √(18 × 8) = √144 = 12.</div>
            <div><strong>Step 3:</strong> HM = 2(18)(8)/(18 + 8) = 288 / 26 = 144 / 13 ≈ 11.08.</div>
            <div><strong>Step 4:</strong> Check inequality: 13 ≥ 12 ≥ 11.08. Product: AM × HM = 13 × (144/13) = 144 = 12² = GM².</div>
            <div className="text-emerald-400 font-semibold">Answer: Verified: AM = 13, GM = 12, HM = 144/13, with GM² = AM · HM.</div>
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
            What is the harmonic mean between 6 and 12?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {['8', '9', '7.5', '8.5'].map((opt, oIdx) => {
              const isSelected = selectedPractice === oIdx;
              const isCorrect = oIdx === 0; // 2*6*12 / 18 = 144 / 18 = 8
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
                  {selectedPractice === 0 ? '✓ Correct! HM = 2(6)(12)/(6 + 12) = 144 / 18 = 8.' : '✗ Incorrect. Try viewing the solution step below:'}
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
                  Formula: HM = 2ab / (a + b) → 2(6)(12) / (6 + 12) = 144 / 18 = 8.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
