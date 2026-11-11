import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type ActionMode = 'Permutation (nPr)' | 'Combination (nCr)' | 'Probability' | 'Factorial';

export default function ProbabilityTab() {
  const [action, setAction] = useState<ActionMode>('Combination (nCr)');
  const [nInput, setNInput] = useState('');
  const [rInput, setRInput] = useState('');
  const [favInput, setFavInput] = useState('');
  const [totalInput, setTotalInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showSteps, setShowSteps] = useState(false);

  // Practice
  const [selectedPractice, setSelectedPractice] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  const actions: ActionMode[] = ['Permutation (nPr)', 'Combination (nCr)', 'Probability', 'Factorial'];

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };

  const handleCalculate = () => {
    if (action === 'Factorial') {
      const n = parseFloat(nInput);
      if (isNaN(n) || n < 0 || !Number.isInteger(n)) {
        setResult({ error: 'n must be a non-negative integer.' });
        return;
      }
      if (n > 170) {
        setResult({ error: 'n is too large (max 170 for numeric precision).' });
        return;
      }
      const val = factorial(n);
      const steps = [`Computing ${n}!`];
      if (n <= 1) {
        steps.push(`${n}! = 1`);
      } else {
        const parts: string[] = [];
        for (let i = n; i >= 1; i--) parts.push(String(i));
        steps.push(`${n}! = ${parts.join(' × ')}`);
        steps.push(`${n}! = ${val}`);
      }
      setResult({ type: 'Factorial', n, value: val, steps });
    } else if (action === 'Permutation (nPr)') {
      const n = parseFloat(nInput);
      const r = parseFloat(rInput);
      if (isNaN(n) || isNaN(r) || !Number.isInteger(n) || !Number.isInteger(r)) {
        setResult({ error: 'n and r must be integers.' });
        return;
      }
      if (n < 0 || r < 0) {
        setResult({ error: 'n and r must be non-negative.' });
        return;
      }
      if (r > n) {
        setResult({ error: 'r cannot be greater than n.' });
        return;
      }
      const val = factorial(n) / factorial(n - r);
      const steps = [
        `nPr = n! / (n − r)!`,
        `${n}P${r} = ${n}! / (${n} − ${r})!`,
        `= ${n}! / ${n - r}!`
      ];
      if (n <= 20) {
        steps.push(`${n}! = ${factorial(n)}`);
        steps.push(`${n - r}! = ${factorial(n - r)}`);
      }
      // Show expansion with cancellation
      if (r > 0 && n <= 20) {
        const topParts: string[] = [];
        for (let i = n; i > n - r; i--) topParts.push(String(i));
        steps.push(`Cancelling: ${topParts.join(' × ')} = ${val}`);
      }
      steps.push(`${n}P${r} = ${val}`);
      setResult({ type: 'Permutation', n, r, value: val, steps });
    } else if (action === 'Combination (nCr)') {
      const n = parseFloat(nInput);
      const r = parseFloat(rInput);
      if (isNaN(n) || isNaN(r) || !Number.isInteger(n) || !Number.isInteger(r)) {
        setResult({ error: 'n and r must be integers.' });
        return;
      }
      if (n < 0 || r < 0) {
        setResult({ error: 'n and r must be non-negative.' });
        return;
      }
      if (r > n) {
        setResult({ error: 'r cannot be greater than n.' });
        return;
      }
      const val = factorial(n) / (factorial(r) * factorial(n - r));
      const steps = [
        `nCr = n! / [r! × (n − r)!]`,
        `${n}C${r} = ${n}! / [${r}! × (${n} − ${r})!]`,
        `= ${n}! / [${r}! × ${n - r}!]`
      ];
      if (n <= 20) {
        steps.push(`${n}! = ${factorial(n)}`);
        steps.push(`${r}! = ${factorial(r)}`);
        steps.push(`${n - r}! = ${factorial(n - r)}`);
        steps.push(`= ${factorial(n)} / (${factorial(r)} × ${factorial(n - r)})`);
        steps.push(`= ${factorial(n)} / ${factorial(r) * factorial(n - r)}`);
      }
      steps.push(`${n}C${r} = ${val}`);
      setResult({ type: 'Combination', n, r, value: val, steps });
    } else {
      // Probability
      const fav = parseFloat(favInput);
      const total = parseFloat(totalInput);
      if (isNaN(fav) || isNaN(total)) {
        setResult({ error: 'Please enter valid numbers for both fields.' });
        return;
      }
      if (total <= 0) {
        setResult({ error: 'Total outcomes must be greater than 0.' });
        return;
      }
      if (fav < 0) {
        setResult({ error: 'Favorable outcomes cannot be negative.' });
        return;
      }
      if (fav > total) {
        setResult({ error: 'Favorable outcomes cannot exceed total outcomes.' });
        return;
      }
      const prob = fav / total;
      const pct = prob * 100;
      // Simplify fraction
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const g = gcd(Math.round(fav), Math.round(total));
      const simpNum = Math.round(fav) / g;
      const simpDen = Math.round(total) / g;
      const steps = [
        `P(E) = favorable outcomes / total outcomes`,
        `P(E) = ${fav} / ${total}`,
        `P(E) = ${simpNum}/${simpDen}`,
        `P(E) ≈ ${prob.toFixed(6)}`,
        `P(E) = ${pct.toFixed(2)}%`
      ];
      setResult({ type: 'Probability', fav, total, prob, pct, simpNum, simpDen, steps });
    }
  };

  const handleReset = () => {
    setNInput('');
    setRInput('');
    setFavInput('');
    setTotalInput('');
    setResult(null);
    setShowSteps(false);
  };

  const practiceOptions = [35, 21, 210, 42];
  const correctPractice = 0; // 35

  const renderGraph = () => {
    if (!result || result.error) return null;

    // Show factorial/perm/comb growth chart
    if (result.type === 'Factorial' || result.type === 'Permutation' || result.type === 'Combination') {
      const n = result.n as number;
      const maxPoints = Math.min(n + 1, 13);
      const points: { x: number; y: number; label: string }[] = [];

      for (let i = 0; i < maxPoints; i++) {
        let val: number;
        let label: string;
        if (result.type === 'Factorial') {
          val = factorial(i);
          label = `${i}!`;
        } else if (result.type === 'Permutation') {
          const r = Math.min(result.r as number, i);
          val = factorial(i) / factorial(i - r);
          label = `${i}P${r}`;
        } else {
          const r = Math.min(result.r as number, i);
          val = factorial(i) / (factorial(r) * factorial(i - r));
          label = `${i}C${r}`;
        }
        points.push({ x: i, y: val, label });
      }

      const maxY = Math.max(...points.map(p => p.y), 1);
      const graphH = 130;
      const padL = 10;
      const padR = 10;
      const padT = 10;
      const padB = 20;
      const usableW = 500 - padL - padR;
      const usableH = graphH - padT - padB;

      const barW = Math.max(6, Math.min(30, usableW / points.length - 4));

      return (
        <svg viewBox={`0 0 520 ${graphH}`} className="w-full h-44">
          {points.map((p, i) => {
            const barH = maxY > 0 ? (p.y / maxY) * usableH : 0;
            const x = padL + i * (barW + 4) + 20;
            const y = padT + usableH - barH;
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={Math.max(barH, 1)} rx={2} fill="#3b82f6" opacity={0.8} />
                <text x={x + barW / 2} y={graphH - 3} textAnchor="middle" fill="#94a3b8" fontSize="7">
                  {p.label}
                </text>
                <text x={x + barW / 2} y={y - 3} textAnchor="middle" fill="#60a5fa" fontSize="7">
                  {p.y > 9999 ? p.y.toExponential(0) : p.y}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    // Probability: pie-like bar
    if (result.type === 'Probability') {
      const prob = result.prob as number;
      const w = 400;
      const barH = 24;
      return (
        <svg viewBox={`0 0 ${w} 80`} className="w-full h-28">
          <rect x={20} y={20} width={w - 40} height={barH} rx={6} fill="#0f172a" stroke="#1e3a5f" />
          <rect x={20} y={20} width={(w - 40) * prob} height={barH} rx={6} fill="#3b82f6" />
          <text x={w / 2} y={60} textAnchor="middle" fill="#94a3b8" fontSize="11">
            P(E) = {result.simpNum}/{result.simpDen} ≈ {(prob * 100).toFixed(1)}%
          </text>
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* ─── Topic Header ─── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          STATISTICS & PROBABILITY
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-2">
          Combinatorics & Probability
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Combinatorics studies the counting, arrangement, and combination of objects.
          Probability quantifies how likely an event is, using ratios of favorable to total outcomes.
        </p>
      </div>

      {/* ─── Mathematical Definition ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h2 className="text-blue-300 font-semibold text-sm">Mathematical Definition</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          A <span className="text-white font-semibold">permutation</span> counts ordered arrangements;
          a <span className="text-white font-semibold">combination</span> counts unordered selections.
          <span className="text-white font-semibold"> Probability</span> measures the chance of an event occurring,
          always between 0 (impossible) and 1 (certain).
        </p>
        <div className="bg-[#060c1d] rounded-lg p-3 font-mono text-sm text-blue-300 border border-[#132244]">
          nPr = n!/(n−r)! &nbsp;&nbsp;|&nbsp;&nbsp; nCr = n!/[r!(n−r)!] &nbsp;&nbsp;|&nbsp;&nbsp; P(E) = favorable / total
        </div>
      </div>

      {/* ─── Formula Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: 'Factorial', formula: 'n! = n × (n−1) × ⋯ × 1', desc: '0! = 1 by convention' },
          { title: 'Permutation (nPr)', formula: 'nPr = n! / (n − r)!', desc: 'Order matters; n ≥ r' },
          { title: 'Combination (nCr)', formula: 'nCr = n! / [r! × (n − r)!]', desc: 'Order does NOT matter; n ≥ r' },
          { title: 'Probability', formula: 'P(E) = favorable / total', desc: '0 ≤ P(E) ≤ 1; P = 1 means certain' }
        ].map((c, i) => (
          <div key={i} className="relative p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />
            <h3 className="text-slate-100 font-semibold text-sm mb-1 ml-2">{c.title}</h3>
            <p className="font-mono text-blue-300 text-sm ml-2 mb-1">{c.formula}</p>
            <p className="text-slate-400 text-xs ml-2">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* ─── Interactive Calculator ─── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h2 className="text-blue-300 font-semibold text-sm">Interactive Calculator</h2>
        </div>

        {/* Action pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {actions.map(a => (
            <button
              key={a}
              onClick={() => { setAction(a); setResult(null); setShowSteps(false); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                action === a
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-[#070f22] text-slate-300 hover:text-white border border-[#162c57]'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {action === 'Probability' ? (
            <>
              <div>
                <label className="block text-slate-300 text-xs mb-1.5">Favorable Outcomes</label>
                <input
                  type="number"
                  value={favInput}
                  onChange={e => setFavInput(e.target.value)}
                  placeholder="e.g. 1"
                  min="0"
                  className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs mb-1.5">Total Outcomes</label>
                <input
                  type="number"
                  value={totalInput}
                  onChange={e => setTotalInput(e.target.value)}
                  placeholder="e.g. 6"
                  min="1"
                  className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-slate-300 text-xs mb-1.5">n (total items)</label>
                <input
                  type="number"
                  value={nInput}
                  onChange={e => setNInput(e.target.value)}
                  placeholder="e.g. 7"
                  min="0"
                  className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                />
              </div>
              {action !== 'Factorial' && (
                <div>
                  <label className="block text-slate-300 text-xs mb-1.5">r (items chosen)</label>
                  <input
                    type="number"
                    value={rInput}
                    onChange={e => setRInput(e.target.value)}
                    placeholder="e.g. 3"
                    min="0"
                    className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={handleCalculate}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" /> Calculate
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-[#070f22] border border-[#162c57] hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Result */}
        {result && !result.error && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 to-[#0e214d] border-2 border-blue-500 shadow-lg">
              {result.type === 'Factorial' && (
                <div>
                  <span className="text-slate-400 text-xs">{result.n}!</span>
                  <p className="text-2xl font-bold text-white font-mono">{result.value.toLocaleString()}</p>
                </div>
              )}
              {result.type === 'Permutation' && (
                <div>
                  <span className="text-slate-400 text-xs">{result.n}P{result.r}</span>
                  <p className="text-2xl font-bold text-white font-mono">{result.value.toLocaleString()}</p>
                </div>
              )}
              {result.type === 'Combination' && (
                <div>
                  <span className="text-slate-400 text-xs">{result.n}C{result.r}</span>
                  <p className="text-2xl font-bold text-white font-mono">{result.value.toLocaleString()}</p>
                </div>
              )}
              {result.type === 'Probability' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs">P(E) — Fraction</span>
                    <p className="text-2xl font-bold text-white font-mono">{result.simpNum}/{result.simpDen}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">P(E) — Decimal / %</span>
                    <p className="text-2xl font-bold text-white font-mono">{result.prob.toFixed(6)}</p>
                    <p className="text-blue-300 text-sm font-mono">{result.pct.toFixed(2)}%</p>
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-step */}
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              <ChevronRight className={`w-3 h-3 transition-transform ${showSteps ? 'rotate-90' : ''}`} />
              {showSteps ? 'Hide' : 'Show'} Step-by-Step Solution
            </button>
            {showSteps && result.steps && (
              <div className="p-4 rounded-xl bg-[#060c1d] border border-[#132244] space-y-1.5">
                {result.steps.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-slate-300 text-sm font-mono">{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {result?.error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm">
            {result.error}
          </div>
        )}
      </div>

      {/* ─── Graphical Representation ─── */}
      {result && !result.error && (
        <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
          <h2 className="text-blue-300 font-semibold text-sm mb-3">Graphical Representation</h2>
          <div className="w-full h-44 bg-[#060c1d] border border-[#132244] rounded-xl p-3 overflow-x-auto">
            {renderGraph()}
          </div>
          <p className="text-slate-500 text-xs mt-2">
            {result.type === 'Probability'
              ? 'Probability bar showing favorable vs total outcomes.'
              : `Growth chart of ${result.type.toLowerCase()} values from 0 to n.`}
          </p>
        </div>
      )}

      {/* ─── Worked Examples ─── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-blue-400" />
          <h2 className="text-blue-300 font-semibold text-sm">Worked Examples</h2>
        </div>

        <div className="space-y-4">
          {/* Example 1 */}
          <div className="p-4 rounded-xl bg-[#091530] border border-[#162c57]">
            <h3 className="text-slate-100 font-semibold text-sm mb-2">Example 1 — Combination: 5C2</h3>
            <p className="text-slate-300 text-sm mb-2">
              How many ways can you choose 2 items from 5?
            </p>
            <div className="space-y-1 text-sm font-mono text-slate-400">
              <p><span className="text-blue-400">Step 1:</span> nCr = n! / [r! × (n − r)!]</p>
              <p><span className="text-blue-400">Step 2:</span> 5C2 = 5! / [2! × 3!]</p>
              <p><span className="text-blue-400">Step 3:</span> 5! = 120, 2! = 2, 3! = 6</p>
              <p><span className="text-blue-400">Step 4:</span> = 120 / (2 × 6) = 120 / 12</p>
              <p><span className="text-blue-400">Step 5:</span> 5C2 = <span className="text-white">10</span></p>
            </div>
          </div>

          {/* Example 2 */}
          <div className="p-4 rounded-xl bg-[#091530] border border-[#162c57]">
            <h3 className="text-slate-100 font-semibold text-sm mb-2">Example 2 — Probability: Rolling a 6</h3>
            <p className="text-slate-300 text-sm mb-2">
              What is the probability of rolling a 6 on a fair six-sided die?
            </p>
            <div className="space-y-1 text-sm font-mono text-slate-400">
              <p><span className="text-blue-400">Step 1:</span> P(E) = favorable outcomes / total outcomes</p>
              <p><span className="text-blue-400">Step 2:</span> Favorable outcomes (rolling a 6) = 1</p>
              <p><span className="text-blue-400">Step 3:</span> Total outcomes (faces on die) = 6</p>
              <p><span className="text-blue-400">Step 4:</span> P(6) = 1/6 ≈ 0.1667</p>
              <p><span className="text-blue-400">Step 5:</span> P(6) ≈ <span className="text-white">16.67%</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Practice Mode ─── */}
      <div className="p-5 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <h2 className="text-blue-300 font-semibold text-sm">Practice Mode</h2>
        </div>

        <p className="text-slate-200 text-sm mb-4">
          How many ways can you choose <span className="text-white font-semibold">3 items from 7</span>?
          &nbsp;<span className="text-slate-400">(Compute 7C3)</span>
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {practiceOptions.map((opt, i) => {
            const isSelected = selectedPractice === i;
            const isCorrect = i === correctPractice;
            let cls = 'p-3 rounded-xl text-center font-mono text-sm cursor-pointer transition-all ';
            if (isSelected) {
              cls += isCorrect
                ? 'bg-emerald-600/20 border-2 border-emerald-500 text-emerald-300'
                : 'bg-red-600/20 border-2 border-red-500 text-red-300';
            } else {
              cls += 'bg-[#070f22] border border-[#162c57] text-slate-300 hover:border-slate-500 hover:text-white';
            }
            return (
              <button
                key={i}
                onClick={() => setSelectedPractice(i)}
                className={cls}
              >
                {opt}
                {isSelected && isCorrect && <CheckCircle2 className="inline w-4 h-4 ml-2 text-emerald-400" />}
                {isSelected && !isCorrect && <span className="ml-2 text-red-400">✗</span>}
              </button>
            );
          })}
        </div>

        {selectedPractice !== null && selectedPractice !== correctPractice && (
          <p className="text-red-300 text-xs mb-2">Incorrect — try again or view the solution below.</p>
        )}
        {selectedPractice === correctPractice && (
          <p className="text-emerald-300 text-xs mb-2">✓ Correct! 7C3 = 35.</p>
        )}

        <button
          onClick={() => setShowPracticeSolution(!showPracticeSolution)}
          className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 cursor-pointer"
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${showPracticeSolution ? 'rotate-90' : ''}`} />
          {showPracticeSolution ? 'Hide' : 'Show'} Solution
        </button>
        {showPracticeSolution && (
          <div className="mt-3 p-4 rounded-xl bg-[#060c1d] border border-[#132244] space-y-1 text-sm font-mono text-slate-400">
            <p><span className="text-blue-400">Step 1:</span> 7C3 = 7! / [3! × (7 − 3)!]</p>
            <p><span className="text-blue-400">Step 2:</span> = 7! / [3! × 4!]</p>
            <p><span className="text-blue-400">Step 3:</span> 7! = 5040</p>
            <p><span className="text-blue-400">Step 4:</span> 3! = 6, 4! = 24</p>
            <p><span className="text-blue-400">Step 5:</span> = 5040 / (6 × 24) = 5040 / 144</p>
            <p><span className="text-blue-400">Step 6:</span> 7C3 = <span className="text-white">35</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
