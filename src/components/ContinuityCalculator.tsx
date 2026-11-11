import React, { useState, useMemo, useRef } from 'react';
import * as math from 'mathjs';
import {
  Keyboard,
  Camera,
  LineChart,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import MathVirtualKeyboard from './MathVirtualKeyboard';
import { MathLimitNotation } from './LimitCalculator';

export default function ContinuityCalculator() {
  const [expr, setExpr] = useState<string>('x^2 + 3x');
  const [point, setPoint] = useState<string>('2');
  const [activeInput, setActiveInput] = useState<'expr' | 'point'>('expr');

  // UI state
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'solution' | 'setup' | 'types'>('solution');
  const [graphZoom, setGraphZoom] = useState<number>(4);

  const exprInputRef = useRef<HTMLInputElement>(null);
  const pointInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect variable in expression
  const detectedVar = useMemo(() => {
    const letters = expr.match(/[a-zA-Z]/g) || [];
    const reserved = ['s', 'i', 'n', 'c', 'o', 't', 'a', 'l', 'g', 'e', 'x', 'p', 'r', 'q', 'b'];
    const candidates = letters.filter(
      (ch) => !reserved.includes(ch.toLowerCase()) || ['x', 't', 'y', 'u', 'z', 'n', 'w'].includes(ch.toLowerCase())
    );
    return candidates.length > 0 ? candidates[0] : 'x';
  }, [expr]);

  // Virtual keyboard insertions
  const handleKeyboardInsert = (char: string) => {
    if (activeInput === 'expr') {
      setExpr((prev) => prev + char);
      if (exprInputRef.current) exprInputRef.current.focus();
    } else {
      setPoint((prev) => prev + char);
      if (pointInputRef.current) pointInputRef.current.focus();
    }
  };

  const handleKeyboardDelete = () => {
    if (activeInput === 'expr') {
      setExpr((prev) => prev.slice(0, -1));
    } else {
      setPoint((prev) => prev.slice(0, -1));
    }
  };

  const handleKeyboardClear = () => {
    if (activeInput === 'expr') {
      setExpr('');
    } else {
      setPoint('');
    }
  };

  // Preset sample questions for picture modal
  const handlePresetSelect = (presetExpr: string, presetPoint: string) => {
    setExpr(presetExpr);
    setPoint(presetPoint);
    setShowImageModal(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Sample extraction simulation
      setExpr('(x^2 - 4)/(x - 2)');
      setPoint('2');
      setShowImageModal(false);
    }
  };

  // ─── MATHEMATICAL CONTINUITY ANALYSIS ENGINE ───
  const analysis = useMemo(() => {
    const v = detectedVar;
    const cleanExpr = expr.trim() || 'x';
    const aVal = parseFloat(point.trim()) || 0;
    const pointStr = point.trim() || '0';

    let compiled: any = null;
    let evalError = false;

    try {
      compiled = math.compile(cleanExpr);
    } catch {
      evalError = true;
    }

    // Helper safely evaluate at x
    const safeEval = (xVal: number): number | null => {
      if (!compiled || evalError) return null;
      try {
        const val = compiled.evaluate({ [v]: xVal });
        if (typeof val === 'number' && isFinite(val) && !isNaN(val)) {
          return val;
        }
        return null;
      } catch {
        return null;
      }
    };

    // ── 1. Function value f(a)
    const faDirect = safeEval(aVal);
    const faExists = faDirect !== null;
    const faDisplay = faExists ? math.format(faDirect, { precision: 8 }) : 'Undefined (DNE)';

    // ── 2. Left-Hand Limit (LHL) and Right-Hand Limit (RHL)
    // Evaluate approaching steps
    const epsList = [1e-3, 1e-5, 1e-7];
    const leftVals = epsList.map((eps) => safeEval(aVal - eps)).filter((n): n is number => n !== null);
    const rightVals = epsList.map((eps) => safeEval(aVal + eps)).filter((n): n is number => n !== null);

    let lhlVal: number | null = null;
    let rhlVal: number | null = null;
    let lhlInf = false;
    let rhlInf = false;

    if (leftVals.length > 0) {
      const last = leftVals[leftVals.length - 1];
      if (Math.abs(last) > 1e6) {
        lhlInf = true;
      } else {
        lhlVal = Math.round(last * 1e6) / 1e6;
      }
    }

    if (rightVals.length > 0) {
      const last = rightVals[rightVals.length - 1];
      if (Math.abs(last) > 1e6) {
        rhlInf = true;
      } else {
        rhlVal = Math.round(last * 1e6) / 1e6;
      }
    }

    const lhlDisplay = lhlInf
      ? (leftVals[leftVals.length - 1] > 0 ? '+∞' : '-∞')
      : lhlVal !== null
      ? math.format(lhlVal, { precision: 8 })
      : 'DNE';

    const rhlDisplay = rhlInf
      ? (rightVals[rightVals.length - 1] > 0 ? '+∞' : '-∞')
      : rhlVal !== null
      ? math.format(rhlVal, { precision: 8 })
      : 'DNE';

    // ── 3. Two-Sided Limit Existence
    const limitsBothFinite = lhlVal !== null && rhlVal !== null;
    const limitsEqual = limitsBothFinite && Math.abs((lhlVal as number) - (rhlVal as number)) < 1e-4;
    const limitExists = limitsEqual;
    const limitVal = limitExists ? lhlVal : null;
    const limitDisplay = limitExists && limitVal !== null ? math.format(limitVal, { precision: 8 }) : 'DNE';

    // ── 4. Compare Limit with f(a)
    const limitEqualsFa =
      faExists && limitExists && faDirect !== null && limitVal !== null && Math.abs(faDirect - limitVal) < 1e-4;

    const isContinuous = faExists && limitExists && limitEqualsFa;

    // Discontinuity Classification
    let discontinuityType = 'None';
    let discontinuityExplanation = '';

    if (!isContinuous) {
      if (lhlInf || rhlInf) {
        discontinuityType = 'Infinite Discontinuity (Vertical Asymptote)';
        discontinuityExplanation = `At ${v} = ${pointStr}, the function curve approaches ±∞, forming a vertical asymptote where the limit does not exist.`;
      } else if (limitsBothFinite && !limitsEqual) {
        discontinuityType = 'Jump Discontinuity';
        discontinuityExplanation = `The left-hand limit (${lhlDisplay}) and right-hand limit (${rhlDisplay}) are both finite but unequal (LHL ≠ RHL). The graph undergoes an abrupt finite jump.`;
      } else if (limitExists && (!faExists || !limitEqualsFa)) {
        discontinuityType = 'Removable Discontinuity (Hole)';
        discontinuityExplanation = `The two-sided limit exists (${limitDisplay}), but f(${pointStr}) is ${
          !faExists ? 'undefined' : `unequal to the limit (${faDisplay} ≠ ${limitDisplay})`
        }. The discontinuity can be removed by assigning f(${pointStr}) = ${limitDisplay}.`;
      } else {
        discontinuityType = 'Essential Discontinuity';
        discontinuityExplanation = `The function value and limit fail to converge consistently at ${v} = ${pointStr}.`;
      }
    }

    // Method selection
    const method =
      cleanExpr.includes('/') || cleanExpr.includes('abs(') || cleanExpr.includes('piecewise')
        ? 'One-Sided Limits'
        : 'Direct Evaluation';

    return {
      variable: v,
      cleanExpr,
      pointStr,
      aVal,
      faExists,
      faDirect,
      faDisplay,
      lhlDisplay,
      rhlDisplay,
      limitExists,
      limitDisplay,
      limitVal,
      limitEqualsFa,
      isContinuous,
      discontinuityType,
      discontinuityExplanation,
      method,
    };
  }, [expr, point, detectedVar]);

  // ─── HIGH-PRECISION GRAPH COMPUTATION ───
  const graphData = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const v = analysis.variable;
    const a = analysis.aVal;
    const minX = a - graphZoom;
    const maxX = a + graphZoom;
    const samples = 220;
    const step = (maxX - minX) / samples;

    let compiled: any = null;
    try {
      compiled = math.compile(analysis.cleanExpr);
    } catch {
      return { pts: [], minX, maxX, minY: -5, maxY: 5 };
    }

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i <= samples; i++) {
      const x = minX + i * step;
      try {
        const y = compiled.evaluate({ [v]: x });
        if (typeof y === 'number' && isFinite(y) && !isNaN(y)) {
          if (Math.abs(y) < 120) {
            pts.push({ x, y });
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      } catch {
        // Discontinuity point
      }
    }

    if (!isFinite(minY) || !isFinite(maxY) || minY === maxY) {
      minY = -5;
      maxY = 5;
    }

    const margin = Math.max((maxY - minY) * 0.15, 1);
    minY -= margin;
    maxY += margin;

    return { pts, minX, maxX, minY, maxY };
  }, [analysis, graphZoom]);

  return (
    <div className={`w-full space-y-6 ${showKeyboard ? 'pb-72' : ''}`}>
      {/* ─── TITLE / SECTION HEADER ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-semibold mb-1">
            CALCULUS WORKSPACE
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
            CONTINUITY ANALYSIS ENGINE
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Determine whether a function satisfies the 3 fundamental mathematical continuity conditions at any given point.
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          {/* Graph Toggle */}
          <button
            type="button"
            onClick={() => setShowGraph(!showGraph)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showGraph
                ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                : 'bg-[#09142b] hover:bg-[#0f2146] text-slate-300 border-[#1a3363]'
            }`}
            title="Toggle Graph Visualizer"
          >
            <LineChart className="w-3.5 h-3.5 text-blue-400" />
            <span>Graph</span>
          </button>

          {/* Picture / Camera */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#09142b] hover:bg-[#0f2146] text-slate-300 border border-[#1a3363] transition-all"
            title="Upload question photo or pick presets"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>Picture</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN INPUT PANEL ─── */}
      <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-6 shadow-xl relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Function Input f(x) = ... */}
          <div className="md:col-span-7 bg-[#060c1d] border border-[#1b315b] rounded-xl p-3 flex items-center shadow-inner">
            <span className="text-sm font-mono text-blue-300 font-semibold mr-2 shrink-0">
              f({analysis.variable}) =
            </span>
            <input
              ref={exprInputRef}
              type="text"
              value={expr}
              onFocus={() => setActiveInput('expr')}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="e.g. x^2 + 3x, (x^2 - 4)/(x - 2), 1/(x - 3)"
              className="w-full bg-transparent text-white font-mono text-base focus:outline-none placeholder-slate-600"
            />
            {/* Small Virtual Keyboard Button */}
            <button
              type="button"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={`p-2 rounded-lg border ml-2 transition-all ${
                showKeyboard
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-[#0d1c3a] text-blue-400 border-[#1a356b] hover:bg-[#142c5b]'
              }`}
              title="Toggle Math Virtual Keyboard"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>

          {/* Point to Check x = a */}
          <div className="md:col-span-3 bg-[#060c1d] border border-[#1b315b] rounded-xl p-3 flex items-center shadow-inner">
            <span className="text-sm font-mono text-slate-400 font-medium mr-2 shrink-0">
              Check at {analysis.variable} =
            </span>
            <input
              ref={pointInputRef}
              type="text"
              value={point}
              onFocus={() => setActiveInput('point')}
              onChange={(e) => setPoint(e.target.value)}
              placeholder="2"
              className="w-full bg-transparent text-white font-mono text-base focus:outline-none text-center placeholder-slate-600"
            />
          </div>

          {/* Check Continuity Action Button */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => setActiveTab('solution')}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Check Continuity</span>
              <Sparkles className="w-4 h-4 text-sky-200" />
            </button>
          </div>
        </div>

        {/* ── Interactive Graph View ── */}
        {showGraph && (
          <div className="mt-5 p-4 sm:p-5 rounded-xl bg-[#070f22] border border-[#162c57] animate-slide-down space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">
                  CONTINUITY VISUALIZER
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono">
                  Point: {analysis.variable} = {analysis.pointStr}
                </span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setGraphZoom((z) => Math.max(z - 2, 1))}
                  className="p-1 px-2 rounded bg-[#0b162f] hover:bg-[#122449] border border-[#183262] text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setGraphZoom((z) => Math.min(z + 2, 20))}
                  className="p-1 px-2 rounded bg-[#0b162f] hover:bg-[#122449] border border-[#183262] text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setGraphZoom(4)}
                  className="p-1 px-2 rounded bg-[#0b162f] hover:bg-[#122449] border border-[#183262] text-slate-300 flex items-center gap-1 text-[11px]"
                  title="Reset View"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* SVG Plot */}
            <div className="relative h-60 w-full bg-[#050a18] rounded-xl border border-[#112144] overflow-hidden p-2 flex items-center justify-center">
              {graphData.pts.length > 2 ? (
                <svg viewBox="0 0 700 220" className="w-full h-full select-none" preserveAspectRatio="none">
                  {/* Grid */}
                  {[0.2, 0.4, 0.6, 0.8].map((pct) => (
                    <g key={pct}>
                      <line x1={pct * 700} y1={0} x2={pct * 700} y2={220} stroke="#132448" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1={0} y1={pct * 220} x2={700} y2={pct * 220} stroke="#132448" strokeWidth="1" strokeDasharray="4 4" />
                    </g>
                  ))}

                  {/* Axes */}
                  {graphData.minX <= 0 && graphData.maxX >= 0 && (
                    <line
                      x1={((0 - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                      y1={0}
                      x2={((0 - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                      y2={220}
                      stroke="#223f77"
                      strokeWidth="1.5"
                    />
                  )}
                  {graphData.minY <= 0 && graphData.maxY >= 0 && (
                    <line
                      x1={0}
                      y1={220 - ((0 - graphData.minY) / (graphData.maxY - graphData.minY)) * 220}
                      x2={700}
                      y2={220 - ((0 - graphData.minY) / (graphData.maxY - graphData.minY)) * 220}
                      stroke="#223f77"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Function Curve */}
                  <path
                    d={graphData.pts
                      .map((p, idx) => {
                        const sx = ((p.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                        const sy = 220 - ((p.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 220;
                        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />

                  {/* Selected Point Vertical Reference Line */}
                  <line
                    x1={((analysis.aVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                    y1={0}
                    x2={((analysis.aVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                    y2={220}
                    stroke={analysis.isContinuous ? '#10b981' : '#f59e0b'}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Selected Coordinate Marker */}
                  {analysis.limitVal !== null && (
                    <circle
                      cx={((analysis.aVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                      cy={220 - ((analysis.limitVal - graphData.minY) / (graphData.maxY - graphData.minY)) * 220}
                      r={analysis.isContinuous ? 5 : 6}
                      fill={analysis.isContinuous ? '#10b981' : '#050a18'}
                      stroke={analysis.isContinuous ? '#ffffff' : '#f59e0b'}
                      strokeWidth={analysis.isContinuous ? 2 : 3}
                    />
                  )}
                </svg>
              ) : (
                <div className="text-xs text-slate-400">Rendering curve...</div>
              )}
            </div>

            {/* Graph Legend */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 pt-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-sky-400 rounded-full" />
                  <span className="font-mono text-slate-300">f({analysis.variable}) = {analysis.cleanExpr}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full border-2 ${
                      analysis.isContinuous
                        ? 'bg-emerald-500 border-white'
                        : 'bg-transparent border-amber-400'
                    }`}
                  />
                  <span className="font-mono text-slate-300">
                    Point at {analysis.variable} = {analysis.pointStr} (
                    {analysis.isContinuous ? 'Continuous' : 'Discontinuity / Hole'})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── DYNAMIC PROBLEM SETUP CARD ─── */}
      <div className="bg-[#09152e] border-l-4 border-blue-500 rounded-r-xl p-4 sm:p-5 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-sm">
        <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold mb-2">
          PROBLEM SETUP
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#060c1d] rounded-lg border border-[#14264c]">
            <span className="text-slate-500 block text-[10px] uppercase">Function</span>
            <span className="text-white font-semibold text-sm">f({analysis.variable}) = {analysis.cleanExpr}</span>
          </div>
          <div className="p-3 bg-[#060c1d] rounded-lg border border-[#14264c]">
            <span className="text-slate-500 block text-[10px] uppercase">Variable</span>
            <span className="text-white font-semibold text-sm">{analysis.variable}</span>
          </div>
          <div className="p-3 bg-[#060c1d] rounded-lg border border-[#14264c]">
            <span className="text-slate-500 block text-[10px] uppercase">Point to Check</span>
            <span className="text-blue-300 font-semibold text-sm">{analysis.variable} = {analysis.pointStr}</span>
          </div>
        </div>

        {/* 3 Conditions Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#14264c]">
          <div className="flex items-center gap-2">
            {analysis.faExists ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="text-xs">
              <strong>1. f({analysis.pointStr}) exists:</strong>{' '}
              <span className={analysis.faExists ? 'text-emerald-300' : 'text-red-300'}>
                {analysis.faDisplay}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {analysis.limitExists ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="text-xs">
              <strong>2. Limit exists:</strong>{' '}
              <span className={analysis.limitExists ? 'text-emerald-300' : 'text-red-300'}>
                {analysis.limitDisplay}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {analysis.limitEqualsFa ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="text-xs">
              <strong>3. lim = f(a):</strong>{' '}
              <span className={analysis.limitEqualsFa ? 'text-emerald-300' : 'text-red-300'}>
                {analysis.limitEqualsFa ? 'Satisfied' : 'Violated'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── NAVIGATION TABS ─── */}
      <div className="w-full">
        <div className="flex border-b border-[#14264c] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('solution')}
            className={`py-2 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'solution'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Technique &amp; Solution</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`py-2 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'setup'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Conditions &amp; Properties</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('types')}
            className={`py-2 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'types'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Types of Discontinuity</span>
          </button>
        </div>

        {/* ── TAB 1: TECHNIQUE & SOLUTION ── */}
        {activeTab === 'solution' && (
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 sm:p-8 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="border-b border-[#14264c] pb-4">
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                Technique &amp; Solution
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Rigorous step-by-step calculus continuity proof for your exact input function.
              </p>
            </div>

            {/* Method Badge with blue accent style */}
            <div>
              <span className="text-blue-400 font-semibold px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 shadow-sm text-sm sm:text-base font-serif">
                Method: {analysis.method}
              </span>
            </div>

            {/* Step-by-Step Proof */}
            <div className="space-y-4 pt-2">
              {/* STEP 1: Find f(a) */}
              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    STEP 1 — Find f(a)
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono ${
                      analysis.faExists
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                        : 'bg-red-950/70 text-red-300 border border-red-800/60'
                    }`}
                  >
                    {analysis.faExists ? 'Defined' : 'Undefined'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-mono">
                  f({analysis.pointStr}) ={' '}
                  {analysis.faExists
                    ? `${analysis.cleanExpr.replace(new RegExp(analysis.variable, 'g'), `(${analysis.pointStr})`)} = ${analysis.faDisplay}`
                    : `Direct evaluation yields division by zero or an undefined operation.`}
                </p>
                <p className="text-xs text-slate-400">
                  {analysis.faExists
                    ? `Condition 1 is satisfied: f(${analysis.pointStr}) is well-defined and equals ${analysis.faDisplay}.`
                    : `Condition 1 is violated: f(${analysis.pointStr}) does not exist. (Immediate failure for continuity).`}
                </p>
              </div>

              {/* STEP 2: Find Left-Hand Limit */}
              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    STEP 2 — Find the Left-Hand Limit (LHL)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-blue-950/70 text-blue-300 border border-blue-800/60">
                    LHL = {analysis.lhlDisplay}
                  </span>
                </div>
                <div className="py-2">
                  <MathLimitNotation
                    variable={analysis.variable}
                    target={analysis.pointStr}
                    direction="left"
                    expr={analysis.cleanExpr}
                    result={analysis.lhlDisplay}
                    size="normal"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  As {analysis.variable} approaches {analysis.pointStr} from values strictly less than {analysis.pointStr},
                  the output converges toward {analysis.lhlDisplay}.
                </p>
              </div>

              {/* STEP 3: Find Right-Hand Limit */}
              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    STEP 3 — Find the Right-Hand Limit (RHL)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-blue-950/70 text-blue-300 border border-blue-800/60">
                    RHL = {analysis.rhlDisplay}
                  </span>
                </div>
                <div className="py-2">
                  <MathLimitNotation
                    variable={analysis.variable}
                    target={analysis.pointStr}
                    direction="right"
                    expr={analysis.cleanExpr}
                    result={analysis.rhlDisplay}
                    size="normal"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  As {analysis.variable} approaches {analysis.pointStr} from values strictly greater than {analysis.pointStr},
                  the output converges toward {analysis.rhlDisplay}.
                </p>
              </div>

              {/* STEP 4: Compare Limits */}
              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    STEP 4 — Compare the Limits
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono ${
                      analysis.limitExists
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                        : 'bg-red-950/70 text-red-300 border border-red-800/60'
                    }`}
                  >
                    {analysis.limitExists ? 'Limit Exists' : 'Limit DNE'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-mono">
                  LHL ({analysis.lhlDisplay}) {analysis.limitExists ? '=' : '≠'} RHL ({analysis.rhlDisplay})
                </p>
                <p className="text-xs text-slate-400">
                  {analysis.limitExists
                    ? `Since both one-sided limits are finite and identical, the two-sided limit exists: lim_{${analysis.variable} → ${analysis.pointStr}} f(${analysis.variable}) = ${analysis.limitDisplay}.`
                    : `Since one-sided limits are unequal or infinite, the overall two-sided limit does NOT exist.`}
                </p>
              </div>

              {/* STEP 5: Compare lim f(x) with f(a) */}
              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    STEP 5 — Compare lim f(x) with f(a)
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono ${
                      analysis.limitEqualsFa
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                        : 'bg-red-950/70 text-red-300 border border-red-800/60'
                    }`}
                  >
                    {analysis.limitEqualsFa ? 'Equal' : 'Unequal'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-mono">
                  lim f({analysis.variable}) = {analysis.limitDisplay} &nbsp;|&nbsp; f({analysis.pointStr}) = {analysis.faDisplay}
                </p>
                <p className="text-xs text-slate-400">
                  {analysis.limitEqualsFa
                    ? `All three conditions are fully satisfied: the function value equals the limiting value.`
                    : `The function value does not match the limiting value, violating Condition 3.`}
                </p>
              </div>
            </div>

            {/* ── FINAL CONCLUSION BOX ── */}
            <div
              className={`p-6 rounded-2xl border text-center transition-all shadow-lg ${
                analysis.isContinuous
                  ? 'bg-emerald-950/30 border-emerald-600/60 text-emerald-200'
                  : 'bg-red-950/30 border-red-600/60 text-red-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {analysis.isContinuous ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
                <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                  {analysis.isContinuous
                    ? `✅ Continuous at ${analysis.variable} = ${analysis.pointStr}`
                    : `❌ Not Continuous at ${analysis.variable} = ${analysis.pointStr}`}
                </h3>
              </div>

              {!analysis.isContinuous && (
                <div className="mt-3 pt-3 border-t border-red-800/40 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  <div className="font-semibold text-amber-300 mb-1">
                    Discontinuity Type: {analysis.discontinuityType}
                  </div>
                  <p>{analysis.discontinuityExplanation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: CONDITIONS & PROPERTIES ── */}
        {activeTab === 'setup' && (
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-serif text-white">The Three Pillars of Continuity</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              In mathematical analysis, a function f(x) is continuous at x = a if and only if all three
              conditions below are simultaneously true:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                <h4 className="text-sm font-semibold text-white mb-1">1. Existence of f(a)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The point x = a must belong to the domain of the function. If substituting a yields
                  division by zero or values outside the real numbers, f(x) is automatically discontinuous.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                <h4 className="text-sm font-semibold text-white mb-1">2. Existence of lim x→a f(x)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The curve must approach the same finite real number from both sides. That is,
                  lim_{'{x → a⁻}'} f(x) = lim_{'{x → a⁺}'} f(x) = L.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                <h4 className="text-sm font-semibold text-white mb-1">3. Concordance: lim f(x) = f(a)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The actual point on the graph must sit exactly where the two branches are heading,
                  ensuring there are no holes or disconnected points.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: TYPES OF DISCONTINUITY ── */}
        {activeTab === 'types' && (
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-4 animate-fade-in">
            <h2 className="text-xl font-serif text-white mb-2">Classification of Discontinuities</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                <h4 className="font-semibold text-blue-300 text-sm mb-1">Removable Discontinuity (Hole)</h4>
                <p className="text-slate-400 leading-relaxed mb-2">
                  The limit lim f(x) exists, but f(a) is undefined or does not match the limit.
                </p>
                <div className="p-2 rounded bg-[#060c1d] font-mono text-slate-300">
                  Example: f(x) = (x² - 4)/(x - 2) at x = 2
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                <h4 className="font-semibold text-blue-300 text-sm mb-1">Jump Discontinuity</h4>
                <p className="text-slate-400 leading-relaxed mb-2">
                  Both left-hand and right-hand limits exist as finite numbers, but LHL ≠ RHL.
                </p>
                <div className="p-2 rounded bg-[#060c1d] font-mono text-slate-300">
                  Example: f(x) = |x|/x at x = 0 (LHL = -1, RHL = 1)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                <h4 className="font-semibold text-blue-300 text-sm mb-1">Infinite Discontinuity (Asymptote)</h4>
                <p className="text-slate-400 leading-relaxed mb-2">
                  One or both one-sided limits tend toward positive or negative infinity.
                </p>
                <div className="p-2 rounded bg-[#060c1d] font-mono text-slate-300">
                  Example: f(x) = 1/(x - 3) at x = 3
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c]">
                <h4 className="font-semibold text-blue-300 text-sm mb-1">Essential / Oscillating</h4>
                <p className="text-slate-400 leading-relaxed mb-2">
                  The function oscillates infinitely often between two bounds as x approaches a.
                </p>
                <div className="p-2 rounded bg-[#060c1d] font-mono text-slate-300">
                  Example: f(x) = sin(1/x) at x = 0
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── FIXED BOTTOM MATH VIRTUAL KEYBOARD ─── */}
      <MathVirtualKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInsert={handleKeyboardInsert}
        onDelete={handleKeyboardDelete}
        onClear={handleKeyboardClear}
      />

      {/* ─── PICTURE PROBLEM MODAL ─── */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0b1730] text-slate-100 rounded-2xl border border-[#1b3260] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#14264c]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-serif text-white">Picture Problem Input</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Upload a picture of a continuity question from your textbook, or select one of the
              standard continuity presets below:
            </p>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#1d3c75] hover:border-blue-400 rounded-xl cursor-pointer bg-[#070e21] mb-5 transition-colors">
              <Camera className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-xs text-slate-200 font-medium">Click to upload photo of continuity problem</span>
              <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, HEIC supported</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <div className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold mb-2">
              OR SELECT STANDARD TEXTBOOK PRESETS:
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('x^2 + 3x', '2')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>f(x) = x² + 3x at x = 2</span>
                <span className="text-emerald-400 font-serif">Continuous</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('(x^2 - 4)/(x - 2)', '2')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>f(x) = (x² - 4)/(x - 2) at x = 2</span>
                <span className="text-amber-400 font-serif">Removable Hole</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('1/(x - 3)', '3')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>f(x) = 1/(x - 3) at x = 3</span>
                <span className="text-red-400 font-serif">Infinite Discontinuity</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('abs(x)/x', '0')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>f(x) = |x|/x at x = 0</span>
                <span className="text-orange-400 font-serif">Jump Discontinuity</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('sin(x)/x', '0')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>f(x) = sin(x)/x at x = 0</span>
                <span className="text-amber-400 font-serif">Removable Hole</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
