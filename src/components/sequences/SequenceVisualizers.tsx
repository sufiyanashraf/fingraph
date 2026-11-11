import React from 'react';
import { ArrowRight, TrendingUp, Sparkles, Scale } from 'lucide-react';

interface VisualizerProps {
  type: string;
  data?: any;
}

export default function SequenceVisualizers({ type, data }: VisualizerProps) {
  if (!data || type === 'none') return null;

  // 1. PATTERN VISUALIZER
  if (type === 'pattern' || data.type === 'pattern') {
    const terms: (number | string)[] = data.terms || [2, 4, 6, 8, 10];
    const stepLabel: string = data.step || '+d';

    return (
      <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Sequence Term Progression</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono">
            Step: {stepLabel}
          </span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            {terms.map((term, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div className="text-[10px] text-slate-400 font-mono mb-1">
                    a{idx + 1}
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-b from-[#0f244c] to-[#0a1836] border border-blue-500/40 shadow-inner flex items-center justify-center font-mono font-bold text-sm sm:text-base text-white">
                    {typeof term === 'number' ? (Number.isInteger(term) ? term : term.toFixed(2)) : term}
                  </div>
                </div>

                {idx < terms.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-1">
                    <span className="text-[10px] text-blue-400 font-mono font-semibold mb-0.5">
                      {stepLabel}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. TELESCOPING CANCELLATION VISUALIZER
  if (type === 'telescoping' || data.type === 'telescoping') {
    return (
      <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4 sm:p-5">
        <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Telescoping Cancellation Matrix</span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Observe how adjacent opposing terms pairwise annihilate throughout the infinite sum, leaving only the boundary terms intact:
        </p>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm">
          {/* First surviving term */}
          <div className="px-3 py-2 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold shadow-sm">
            1 (Survives)
          </div>

          <span className="text-slate-500">+</span>

          {/* Cancelling pair 1 */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300/80 line-through">
            <span>(-1/2)</span>
            <span>+</span>
            <span>(1/2)</span>
          </div>

          <span className="text-slate-500">+</span>

          {/* Cancelling pair 2 */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300/80 line-through">
            <span>(-1/3)</span>
            <span>+</span>
            <span>(1/3)</span>
          </div>

          <span className="text-slate-500">+</span>
          <span className="text-slate-400 font-bold">...</span>
          <span className="text-slate-500">+</span>

          {/* Final surviving boundary term */}
          <div className="px-3 py-2 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold shadow-sm">
            - 1/(N + 1)
          </div>

          <span className="text-blue-400 font-bold text-base ml-2">⟹</span>

          <div className="px-3.5 py-2 rounded-lg bg-blue-950/80 border border-blue-500 text-white font-bold">
            S_N = 1 - 1/(N + 1) → 1
          </div>
        </div>
      </div>
    );
  }

  // 3. MEANS COMPARISON VISUALIZER
  if (type === 'means' || data.type === 'means') {
    const am = data.am ?? 10;
    const gm = data.gm ?? 8;
    const hm = data.hm ?? 6.4;
    const maxVal = Math.max(am, gm, hm, 1);

    return (
      <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Classical Inequality: AM ≥ GM ≥ HM</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
            {am >= gm && gm >= hm ? 'Condition Verified ✓' : 'Strict Equality'}
          </span>
        </div>

        <div className="space-y-3">
          {/* AM Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Arithmetic Mean (AM)</span>
              <span className="text-blue-300 font-mono font-bold">{parseFloat(am.toFixed(3))}</span>
            </div>
            <div className="w-full bg-[#0c1833] rounded-full h-3 overflow-hidden border border-[#14264c]">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (am / maxVal) * 100)}%` }}
              />
            </div>
          </div>

          {/* GM Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Geometric Mean (GM)</span>
              <span className="text-emerald-300 font-mono font-bold">{parseFloat(gm.toFixed(3))}</span>
            </div>
            <div className="w-full bg-[#0c1833] rounded-full h-3 overflow-hidden border border-[#14264c]">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (gm / maxVal) * 100)}%` }}
              />
            </div>
          </div>

          {/* HM Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Harmonic Mean (HM)</span>
              <span className="text-amber-300 font-mono font-bold">{parseFloat(hm.toFixed(3))}</span>
            </div>
            <div className="w-full bg-[#0c1833] rounded-full h-3 overflow-hidden border border-[#14264c]">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (hm / maxVal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#14264c] flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>AM ({parseFloat(am.toFixed(2))}) ≥ GM ({parseFloat(gm.toFixed(2))}) ≥ HM ({parseFloat(hm.toFixed(2))})</span>
          <span>G² = A · H = {parseFloat((gm * gm).toFixed(2))}</span>
        </div>
      </div>
    );
  }

  // 4. PARTIAL SUMS VISUALIZER
  if (type === 'partial_sums' || data.type === 'partial_sums') {
    const sums: number[] = data.terms || [0.5, 0.75, 0.875, 0.9375, 0.96875, 0.984375, 0.992188];
    const maxVal = Math.max(...sums, 1);

    return (
      <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4 sm:p-5">
        <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Sequence of Partial Sums S_N → Limit</span>
        </div>

        <div className="space-y-2">
          {sums.slice(0, 6).map((sumVal, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 w-8">
                S_{idx + 1}
              </span>
              <div className="flex-1 bg-[#0c1833] rounded-full h-2.5 overflow-hidden border border-[#14264c]">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (sumVal / maxVal) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-200 w-16 text-right">
                {typeof sumVal === 'number' ? sumVal.toFixed(4) : sumVal}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

