import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type ActionMode = 'Mean' | 'Median' | 'Mode' | 'Variance & Std Dev' | 'Full Summary';

export default function DescriptiveStatsTab() {
  const [action, setAction] = useState<ActionMode>('Mean');
  const [dataInput, setDataInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showSteps, setShowSteps] = useState(false);

  // Practice state
  const [selectedPractice, setSelectedPractice] = useState<number | null>(null);
  const [showPracticeSolution, setShowPracticeSolution] = useState(false);

  const actions: ActionMode[] = ['Mean', 'Median', 'Mode', 'Variance & Std Dev', 'Full Summary'];

  const parseData = (input: string): number[] => {
    return input
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n));
  };

  const computeMean = (data: number[]): number => {
    return data.reduce((a, b) => a + b, 0) / data.length;
  };

  const computeMedian = (data: number[]): number => {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
  };

  const computeMode = (data: number[]): { modes: number[]; frequency: number } => {
    const freq: Record<number, number> = {};
    data.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    if (maxFreq === 1) return { modes: [], frequency: 1 };
    const modes = Object.keys(freq)
      .filter(k => freq[Number(k)] === maxFreq)
      .map(Number)
      .sort((a, b) => a - b);
    return { modes, frequency: maxFreq };
  };

  const computeVariance = (data: number[], isSample: boolean): number => {
    const mean = computeMean(data);
    const sumSqDiff = data.reduce((acc, v) => acc + (v - mean) ** 2, 0);
    return sumSqDiff / (isSample ? data.length - 1 : data.length);
  };

  const handleCalculate = () => {
    const data = parseData(dataInput);
    if (data.length === 0) {
      setResult({ error: 'Please enter at least one valid number.' });
      return;
    }

    const sorted = [...data].sort((a, b) => a - b);
    const mean = computeMean(data);
    const sum = data.reduce((a, b) => a + b, 0);

    if (action === 'Mean') {
      setResult({
        type: 'Mean',
        data,
        sorted,
        mean,
        sum,
        n: data.length,
        steps: [
          `Data: {${data.join(', ')}}`,
          `n = ${data.length}`,
          `Sum = ${data.join(' + ')} = ${sum}`,
          `Mean (x̄) = Σxᵢ / n = ${sum} / ${data.length} = ${mean}`
        ]
      });
    } else if (action === 'Median') {
      const mid = Math.floor(sorted.length / 2);
      const median = computeMedian(data);
      const steps = [
        `Data: {${data.join(', ')}}`,
        `Sorted: {${sorted.join(', ')}}`,
        `n = ${sorted.length}`
      ];
      if (sorted.length % 2 === 0) {
        steps.push(`n is even → Median = (${sorted[mid - 1]} + ${sorted[mid]}) / 2 = ${median}`);
      } else {
        steps.push(`n is odd → Median = middle value = ${median}`);
      }
      setResult({ type: 'Median', data, sorted, median, n: data.length, steps });
    } else if (action === 'Mode') {
      const { modes, frequency } = computeMode(data);
      const freq: Record<number, number> = {};
      data.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
      const steps = [
        `Data: {${data.join(', ')}}`,
        `Frequency count:`,
        ...Object.entries(freq).map(([k, v]) => `  ${k} appears ${v} time(s)`),
        modes.length === 0
          ? `No mode — all values appear exactly once`
          : `Mode(s): ${modes.join(', ')} (each appears ${frequency} times)`
      ];
      setResult({ type: 'Mode', data, sorted, modes, frequency, steps });
    } else if (action === 'Variance & Std Dev') {
      if (data.length < 2) {
        setResult({ error: 'Need at least 2 values for variance/standard deviation.' });
        return;
      }
      const popVar = computeVariance(data, false);
      const samVar = computeVariance(data, true);
      const popStd = Math.sqrt(popVar);
      const samStd = Math.sqrt(samVar);
      const deviations = data.map(v => v - mean);
      const sqDeviations = deviations.map(d => d * d);
      const steps = [
        `Data: {${data.join(', ')}}`,
        `Mean (x̄) = ${mean}`,
        `Deviations (xᵢ - x̄): ${deviations.map(d => d.toFixed(4)).join(', ')}`,
        `Squared deviations: ${sqDeviations.map(d => d.toFixed(4)).join(', ')}`,
        `Sum of squared deviations = ${sqDeviations.reduce((a, b) => a + b, 0).toFixed(4)}`,
        `Population Variance (σ²) = ${sqDeviations.reduce((a, b) => a + b, 0).toFixed(4)} / ${data.length} = ${popVar.toFixed(4)}`,
        `Sample Variance (s²) = ${sqDeviations.reduce((a, b) => a + b, 0).toFixed(4)} / ${data.length - 1} = ${samVar.toFixed(4)}`,
        `Population Std Dev (σ) = √${popVar.toFixed(4)} = ${popStd.toFixed(4)}`,
        `Sample Std Dev (s) = √${samVar.toFixed(4)} = ${samStd.toFixed(4)}`
      ];
      setResult({ type: 'Variance & Std Dev', data, sorted, mean, popVar, samVar, popStd, samStd, steps });
    } else {
      // Full Summary
      if (data.length < 2) {
        setResult({ error: 'Need at least 2 values for a full summary.' });
        return;
      }
      const median = computeMedian(data);
      const { modes, frequency } = computeMode(data);
      const popVar = computeVariance(data, false);
      const samVar = computeVariance(data, true);
      const popStd = Math.sqrt(popVar);
      const samStd = Math.sqrt(samVar);
      const range = sorted[sorted.length - 1] - sorted[0];
      setResult({
        type: 'Full Summary',
        data,
        sorted,
        n: data.length,
        sum,
        mean,
        median,
        modes,
        frequency,
        popVar,
        samVar,
        popStd,
        samStd,
        range,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        steps: [
          `Data: {${data.join(', ')}}`,
          `Sorted: {${sorted.join(', ')}}`,
          `n = ${data.length}`,
          `Sum = ${sum}`,
          `Mean = ${sum} / ${data.length} = ${mean}`,
          sorted.length % 2 === 0
            ? `Median = (${sorted[Math.floor(sorted.length / 2) - 1]} + ${sorted[Math.floor(sorted.length / 2)]}) / 2 = ${median}`
            : `Median = ${median}`,
          modes.length === 0 ? `Mode: None` : `Mode: ${modes.join(', ')} (frequency: ${frequency})`,
          `Range = ${sorted[sorted.length - 1]} - ${sorted[0]} = ${range}`,
          `Population Variance (σ²) = ${popVar.toFixed(4)}`,
          `Sample Variance (s²) = ${samVar.toFixed(4)}`,
          `Population Std Dev (σ) = ${popStd.toFixed(4)}`,
          `Sample Std Dev (s) = ${samStd.toFixed(4)}`
        ]
      });
    }
  };

  const handleReset = () => {
    setDataInput('');
    setResult(null);
    setShowSteps(false);
  };

  const practiceOptions = [3.5, 4, 3, 4.5];
  const correctPractice = 0; // 3.5

  const renderGraph = () => {
    const data = result && !result.error ? result.data as number[] : [];
    if (data.length === 0) return null;
    const max = Math.max(...data);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const mean = computeMean(data);
    const barWidth = Math.max(8, Math.min(40, 500 / data.length));
    const graphWidth = data.length * (barWidth + 4) + 60;
    const svgWidth = Math.max(graphWidth, 300);
    const graphH = 140;
    const padTop = 10;
    const padBot = 25;
    const usable = graphH - padTop - padBot;

    const meanY = padTop + usable - ((mean - min) / range) * usable;

    return (
      <svg viewBox={`0 0 ${svgWidth} ${graphH}`} className="w-full h-44">
        {data.map((v, i) => {
          const barH = ((v - min) / range) * usable;
          const x = 40 + i * (barWidth + 4);
          const y = padTop + usable - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} rx={2} fill="#3b82f6" opacity={0.8} />
              <text x={x + barWidth / 2} y={graphH - 5} textAnchor="middle" fill="#94a3b8" fontSize="9">
                {v}
              </text>
            </g>
          );
        })}
        {/* Mean line */}
        <line x1={35} y1={meanY} x2={svgWidth - 10} y2={meanY} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={5} y={meanY + 3} fill="#f59e0b" fontSize="8">x̄={mean.toFixed(1)}</text>
      </svg>
    );
  };

  const fmt = (v: number) => Number.isInteger(v) ? v.toString() : v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');

  return (
    <div className="space-y-6">
      {/* ─── Topic Header ─── */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
          STATISTICS & PROBABILITY
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mb-2">
          Descriptive Statistics
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Descriptive statistics summarise and organise data into meaningful numbers — measures of
          central tendency (mean, median, mode) and measures of spread (range, variance, standard deviation).
        </p>
      </div>

      {/* ─── Mathematical Definition ─── */}
      <div className="p-4 rounded-xl bg-[#0b162f] border border-[#14264c]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h2 className="text-blue-300 font-semibold text-sm">Mathematical Definition</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Descriptive statistics are numerical values that describe the main features of a data set.
          They provide simple summaries about the sample and the measures, forming the basis of virtually every quantitative analysis.
        </p>
        <div className="bg-[#060c1d] rounded-lg p-3 font-mono text-sm text-blue-300 border border-[#132244]">
          x̄ = Σxᵢ / n &nbsp;&nbsp;|&nbsp;&nbsp; σ² = Σ(xᵢ − x̄)² / n &nbsp;&nbsp;|&nbsp;&nbsp; σ = √σ²
        </div>
      </div>

      {/* ─── Formula Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: 'Mean (Average)', formula: 'x̄ = Σxᵢ / n', desc: 'x̄ = mean, xᵢ = each value, n = count' },
          { title: 'Median', formula: 'Middle value of sorted data', desc: 'Average of two middle values if n is even' },
          { title: 'Mode', formula: 'Most frequently occurring value(s)', desc: 'A data set can have 0, 1, or many modes' },
          { title: 'Variance', formula: 'σ² = Σ(xᵢ − x̄)² / n', desc: 'Population var; use n−1 for sample variance (s²)' },
          { title: 'Standard Deviation', formula: 'σ = √(σ²)', desc: 'Square root of variance — same unit as data' },
          { title: 'Range', formula: 'Range = max − min', desc: 'Simplest measure of spread' }
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

        {/* Input */}
        <div className="mb-4">
          <label className="block text-slate-300 text-xs mb-1.5">Data Values (comma-separated)</label>
          <input
            type="text"
            value={dataInput}
            onChange={e => setDataInput(e.target.value)}
            placeholder="e.g. 5, 10, 15, 20, 25"
            className="w-full bg-[#060c1d] text-white font-mono text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
          />
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
              {result.type === 'Mean' && (
                <div>
                  <span className="text-slate-400 text-xs">Mean (x̄)</span>
                  <p className="text-2xl font-bold text-white font-mono">{fmt(result.mean)}</p>
                </div>
              )}
              {result.type === 'Median' && (
                <div>
                  <span className="text-slate-400 text-xs">Median</span>
                  <p className="text-2xl font-bold text-white font-mono">{fmt(result.median)}</p>
                </div>
              )}
              {result.type === 'Mode' && (
                <div>
                  <span className="text-slate-400 text-xs">Mode</span>
                  <p className="text-2xl font-bold text-white font-mono">
                    {result.modes.length === 0 ? 'No mode' : result.modes.map((m: number) => fmt(m)).join(', ')}
                  </p>
                  {result.modes.length > 0 && (
                    <p className="text-slate-400 text-xs mt-1">Frequency: {result.frequency}</p>
                  )}
                </div>
              )}
              {result.type === 'Variance & Std Dev' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs">Population Variance (σ²)</span>
                    <p className="text-lg font-bold text-white font-mono">{fmt(result.popVar)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Sample Variance (s²)</span>
                    <p className="text-lg font-bold text-white font-mono">{fmt(result.samVar)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Population Std Dev (σ)</span>
                    <p className="text-lg font-bold text-white font-mono">{fmt(result.popStd)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Sample Std Dev (s)</span>
                    <p className="text-lg font-bold text-white font-mono">{fmt(result.samStd)}</p>
                  </div>
                </div>
              )}
              {result.type === 'Full Summary' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['n', result.n],
                    ['Sum', fmt(result.sum)],
                    ['Mean (x̄)', fmt(result.mean)],
                    ['Median', fmt(result.median)],
                    ['Mode', result.modes.length === 0 ? 'None' : result.modes.map((m: number) => fmt(m)).join(', ')],
                    ['Range', fmt(result.range)],
                    ['Min', fmt(result.min)],
                    ['Max', fmt(result.max)],
                    ['Pop. Var (σ²)', fmt(result.popVar)],
                    ['Sam. Var (s²)', fmt(result.samVar)],
                    ['Pop. σ', fmt(result.popStd)],
                    ['Sam. s', fmt(result.samStd)]
                  ].map(([label, val], i) => (
                    <div key={i}>
                      <span className="text-slate-400 text-xs">{label}</span>
                      <p className="text-base font-bold text-white font-mono">{val}</p>
                    </div>
                  ))}
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
          <p className="text-slate-500 text-xs mt-2">Bar chart of data values. Dashed yellow line = mean (x̄).</p>
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
            <h3 className="text-slate-100 font-semibold text-sm mb-2">Example 1 — Basic: Mean, Median, Mode</h3>
            <p className="text-slate-300 text-sm mb-2">
              Find the mean, median, and mode of the data set: <span className="font-mono text-blue-300">{'{'}2, 4, 4, 4, 5, 5, 7, 9{'}'}</span>
            </p>
            <div className="space-y-1 text-sm font-mono text-slate-400">
              <p><span className="text-blue-400">Step 1:</span> n = 8</p>
              <p><span className="text-blue-400">Step 2:</span> Sum = 2 + 4 + 4 + 4 + 5 + 5 + 7 + 9 = 40</p>
              <p><span className="text-blue-400">Step 3:</span> Mean = 40 / 8 = <span className="text-white">5</span></p>
              <p><span className="text-blue-400">Step 4:</span> Sorted: 2, 4, 4, 4, 5, 5, 7, 9 (already sorted)</p>
              <p><span className="text-blue-400">Step 5:</span> n = 8 (even) → Median = (4th + 5th) / 2 = (4 + 5) / 2 = <span className="text-white">4.5</span></p>
              <p><span className="text-blue-400">Step 6:</span> 4 appears 3 times (most frequent) → Mode = <span className="text-white">4</span></p>
            </div>
          </div>

          {/* Example 2 */}
          <div className="p-4 rounded-xl bg-[#091530] border border-[#162c57]">
            <h3 className="text-slate-100 font-semibold text-sm mb-2">Example 2 — Challenging: Variance & Standard Deviation</h3>
            <p className="text-slate-300 text-sm mb-2">
              Find the population variance and standard deviation of: <span className="font-mono text-blue-300">{'{'}4, 8, 6, 5, 3{'}'}</span>
            </p>
            <div className="space-y-1 text-sm font-mono text-slate-400">
              <p><span className="text-blue-400">Step 1:</span> n = 5, Sum = 4 + 8 + 6 + 5 + 3 = 26</p>
              <p><span className="text-blue-400">Step 2:</span> Mean = 26 / 5 = 5.2</p>
              <p><span className="text-blue-400">Step 3:</span> Deviations: (4−5.2)=−1.2, (8−5.2)=2.8, (6−5.2)=0.8, (5−5.2)=−0.2, (3−5.2)=−2.2</p>
              <p><span className="text-blue-400">Step 4:</span> Squared: 1.44, 7.84, 0.64, 0.04, 4.84</p>
              <p><span className="text-blue-400">Step 5:</span> Sum of squares = 14.8</p>
              <p><span className="text-blue-400">Step 6:</span> σ² = 14.8 / 5 = <span className="text-white">2.96</span></p>
              <p><span className="text-blue-400">Step 7:</span> σ = √2.96 ≈ <span className="text-white">1.7205</span></p>
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
          What is the <span className="text-white font-semibold">median</span> of the data set <span className="font-mono text-blue-300">{'{'}3, 1, 4, 1, 5, 9, 2, 6{'}'}</span>?
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
          <p className="text-emerald-300 text-xs mb-2">✓ Correct! The median is 3.5.</p>
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
            <p><span className="text-blue-400">Step 1:</span> Data: 3, 1, 4, 1, 5, 9, 2, 6</p>
            <p><span className="text-blue-400">Step 2:</span> Sorted: 1, 1, 2, 3, 4, 5, 6, 9</p>
            <p><span className="text-blue-400">Step 3:</span> n = 8 (even)</p>
            <p><span className="text-blue-400">Step 4:</span> Median = (4th value + 5th value) / 2</p>
            <p><span className="text-blue-400">Step 5:</span> Median = (3 + 4) / 2 = <span className="text-white">3.5</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
