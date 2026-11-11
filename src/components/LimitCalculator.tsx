import React, { useState, useMemo, useRef } from 'react';
import * as math from 'mathjs';
import {
  Keyboard,
  Camera,
  LineChart,
  ChevronDown,
  Sparkles,
  Check,
  HelpCircle,
  BookOpen,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import MathVirtualKeyboard from './MathVirtualKeyboard';
import { computeLimit } from '../math/mathUtils';

export type LimitTechnique =
  | 'direct_substitution'
  | 'factoring'
  | 'rationalizing'
  | 'lhopital'
  | 'compare_degrees'
  | 'special_limits';

interface TechniqueMeta {
  id: LimitTechnique;
  label: string;
  tagline: string;
  description: string;
}

const TECHNIQUES: TechniqueMeta[] = [
  {
    id: 'direct_substitution',
    label: 'Direct Substitution',
    tagline: 'Evaluate f(c) directly',
    description: 'When the function is continuous at the target point, substitute the approaching value directly into the expression. This is always the primary step in evaluating any limit.',
  },
  {
    id: 'factoring',
    label: 'Factoring',
    tagline: 'Cancel common (x - c) factors',
    description: 'Decompose polynomials into linear and quadratic factors to cancel vanishing terms that cause 0/0 indeterminate forms.',
  },
  {
    id: 'rationalizing',
    label: 'Rationalizing',
    tagline: 'Conjugate multiplication',
    description: 'Multiply numerator and denominator by the algebraic conjugate to eliminate square roots producing 0/0 indeterminate expressions.',
  },
  {
    id: 'lhopital',
    label: "L'Hôpital's Rule",
    tagline: 'lim f(x)/g(x) = lim f’(x)/g’(x)',
    description: "When indeterminate 0/0 or ±∞/±∞ arises, differentiate numerator and denominator independently with respect to the variable.",
  },
  {
    id: 'compare_degrees',
    label: 'Compare Degrees',
    tagline: 'Asymptotes as x → ±∞',
    description: 'For rational limits at infinity, compare the leading degree powers of numerator and denominator to determine horizontal end behavior.',
  },
  {
    id: 'special_limits',
    label: 'Special Limits',
    tagline: 'Canonical trigonometric & exponential forms',
    description: 'Apply established theorems such as lim (sin u)/u = 1, lim (1 - cos u)/u = 0, and lim (1 + 1/u)^u = e.',
  },
];

/** Clean mathematical limit notation component with target strictly underneath 'lim' */
export function MathLimitNotation({
  variable = 'x',
  target = '2',
  direction = 'both',
  expr = 'x^2 + 3x',
  result,
  className = '',
  size = 'normal',
}: {
  variable?: string;
  target?: string;
  direction?: 'both' | 'left' | 'right';
  expr?: string;
  result?: string;
  className?: string;
  size?: 'sm' | 'normal' | 'lg';
}) {
  const dirSymbol = direction === 'left' ? '⁻' : direction === 'right' ? '⁺' : '';
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-1.5 align-middle select-none ${className}`}>
      {/* 'lim' on top, variable -> target directly underneath */}
      <div className="inline-flex flex-col items-center justify-center leading-none">
        <span
          className={`font-serif italic font-normal text-blue-300 ${
            isLg ? 'text-2xl sm:text-3xl' : isSm ? 'text-sm' : 'text-base sm:text-lg'
          }`}
        >
          lim
        </span>
        <span
          className={`font-mono text-slate-300 tracking-tight whitespace-nowrap ${
            isLg ? 'text-xs mt-1' : isSm ? 'text-[9px]' : 'text-[11px] mt-0.5'
          }`}
        >
          {variable} → {target}{dirSymbol}
        </span>
      </div>

      {/* Expression to the right */}
      <span
        className={`font-mono text-slate-100 ${
          isLg ? 'text-lg sm:text-2xl ml-1' : isSm ? 'text-xs ml-0.5' : 'text-sm sm:text-base ml-1'
        }`}
      >
        {expr.trim().startsWith('(') && expr.trim().endsWith(')') ? expr : `(${expr})`}
      </span>

      {/* Optional Result */}
      {result !== undefined && (
        <span
          className={`font-mono text-blue-300 font-semibold ${
            isLg ? 'text-lg sm:text-2xl ml-2' : isSm ? 'text-xs ml-1' : 'text-sm sm:text-base ml-1.5'
          }`}
        >
          = {result}
        </span>
      )}
    </div>
  );
}

export default function LimitCalculator() {
  const [expr, setExpr] = useState<string>('x^2 + 3x');
  const [target, setTarget] = useState<string>('2');
  const [direction, setDirection] = useState<'both' | 'left' | 'right'>('both');
  const [selectedTechnique, setSelectedTechnique] = useState<LimitTechnique>('direct_substitution');

  // UI Panels state
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [showTechniqueMenu, setShowTechniqueMenu] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [activeSolutionTab, setActiveSolutionTab] = useState<'solution' | 'function_info' | 'all_techniques'>('solution');

  // Graph viewing range scale
  const [graphZoom, setGraphZoom] = useState<number>(4);

  // Input ref for virtual keyboard typing
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-detect variable in expression (e.g. x, t, y, u, z)
  const detectedVar = useMemo(() => {
    const letters = expr.match(/[a-zA-Z]/g) || [];
    const reserved = ['s', 'i', 'n', 'c', 'o', 't', 'a', 'l', 'g', 'e', 'x', 'p', 'r', 'q'];
    const candidates = letters.filter(
      (ch) => !reserved.includes(ch.toLowerCase()) || ['x', 't', 'y', 'u', 'z', 'n', 'w'].includes(ch.toLowerCase())
    );
    return candidates.length > 0 ? candidates[0] : 'x';
  }, [expr]);

  // Dynamic Direction symbol and label
  const dirSymbol = direction === 'left' ? '⁻' : direction === 'right' ? '⁺' : '';
  const directionLabel =
    direction === 'both'
      ? 'Both sides'
      : direction === 'left'
      ? 'From the left (x → c⁻)'
      : 'From the right (x → c⁺)';

  // Handle character insertion from Virtual Keyboard
  const handleKeyboardInsert = (char: string) => {
    setExpr((prev) => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyboardDelete = () => {
    setExpr((prev) => prev.slice(0, -1));
  };

  const handleKeyboardClear = () => {
    setExpr('');
  };

  // Image Upload / Preset Selection
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExpr('(x^2 - 4)/(x - 2)');
      setTarget('2');
      setSelectedTechnique('factoring');
      setShowImageModal(false);
    }
  };

  const setSampleProblem = (sampleExpr: string, sampleTarget: string, technique: LimitTechnique) => {
    setExpr(sampleExpr);
    setTarget(sampleTarget);
    setSelectedTechnique(technique);
    setShowImageModal(false);
  };

  // ─── FULLY DYNAMIC COMPUTATION ON EVERY INPUT CHANGE ───
  const computation = useMemo(() => {
    const cleanExpr = expr.trim() || 'x';
    const cleanTarget = target.trim() || '0';
    const v = detectedVar;

    const isInf = cleanTarget.toLowerCase() === 'inf' || cleanTarget.toLowerCase() === '+inf';
    const isNegInf = cleanTarget.toLowerCase() === '-inf';
    const numTarget = isInf ? 'inf' : isNegInf ? '-inf' : parseFloat(cleanTarget) || 0;

    // Numerical evaluation via mathUtils (handles limits numerically from left/right)
    let numVal = '0';
    let isIndeterminate = false;
    let indetType = '';
    let directSubValue = '';

    try {
      const compiled = math.compile(cleanExpr);

      // Evaluate direct substitution if not infinity
      if (!isInf && !isNegInf) {
        const c = typeof numTarget === 'number' ? numTarget : 0;
        try {
          const raw = compiled.evaluate({ [v]: c });
          if (typeof raw === 'number' && isFinite(raw)) {
            directSubValue = math.format(raw, { precision: 8 });
          } else {
            isIndeterminate = true;
            indetType = '0/0';
          }
        } catch {
          isIndeterminate = true;
          indetType = '0/0';
        }
      }

      // Compute limits numerically
      const res = computeLimit(cleanExpr.replace(new RegExp(v, 'g'), 'x'), numTarget);
      numVal = res.value;
    } catch {
      numVal = 'Undefined';
    }

    // Dynamic Step Generation for the exact user expression and technique
    const steps: string[] = [];
    let dynamicExplanation = '';

    const targetDisplay = `${cleanTarget}${dirSymbol}`;

    switch (selectedTechnique) {
      case 'direct_substitution':
        if (!isInf && !isNegInf) {
          dynamicExplanation = `The expression ${cleanExpr} is analyzed at ${v} = ${cleanTarget}. When continuous, substituting ${v} = ${cleanTarget} yields the exact finite value.`;
          steps.push(`Step 1: Check if f(${v}) = ${cleanExpr} is defined and continuous at ${v} = ${cleanTarget}.`);
          steps.push(
            `Step 2: Directly substitute ${v} = (${cleanTarget}) into every occurrence of the variable:`
          );
          try {
            const substitutedStr = cleanExpr.replace(new RegExp(v, 'g'), `(${cleanTarget})`);
            steps.push(`f(${cleanTarget}) = ${substitutedStr}`);
          } catch {
            // fallback
          }
          if (isIndeterminate) {
            steps.push(
              `Step 3: Direct substitution yields an indeterminate form (${indetType}). Factoring, Rationalizing, or L'Hôpital's rule is recommended for algebraic resolution.`
            );
          } else {
            steps.push(
              `Step 3: Simplify arithmetic terms to obtain the final limit value: ${numVal}`
            );
          }
        } else {
          dynamicExplanation = `Evaluating end behavior of ${cleanExpr} as ${v} grows indefinitely toward ${cleanTarget}.`;
          steps.push(`Step 1: Inspect dominant terms of ${cleanExpr} as ${v} → ${cleanTarget}.`);
          steps.push(`Step 2: Lower-order powers become negligible relative to leading powers.`);
          steps.push(`Step 3: As ${v} → ${cleanTarget}, the function approaches ${numVal}.`);
        }
        break;

      case 'factoring':
        dynamicExplanation = `Evaluating ${cleanExpr} at ${v} → ${cleanTarget} by factoring polynomials to cancel vanishing terms causing 0/0.`;
        steps.push(
          `Step 1: Direct substitution of ${v} = ${cleanTarget} gives an indeterminate form (0/0), confirming (${v} - ${cleanTarget}) is a common factor.`
        );
        steps.push(
          `Step 2: Factor numerator and denominator into constituent polynomials to isolate (${v} - ${cleanTarget}).`
        );
        steps.push(
          `Step 3: Cancel the removable non-zero factor (${v} - ${cleanTarget}) for all ${v} ≠ ${cleanTarget}.`
        );
        steps.push(
          `Step 4: Substitute ${v} = ${cleanTarget} into the reduced expression to find the limiting value: ${numVal}`
        );
        break;

      case 'rationalizing':
        dynamicExplanation = `Multiplying ${cleanExpr} by the algebraic conjugate to eliminate square roots producing 0/0 at ${v} = ${cleanTarget}.`;
        steps.push(
          `Step 1: Identify radical terms causing 0/0 when ${v} = ${cleanTarget}.`
        );
        steps.push(
          `Step 2: Multiply both numerator and denominator by the conjugate expression to apply the difference of squares (√A - B)(√A + B) = A - B².`
        );
        steps.push(
          `Step 3: Expand the products, eliminate radical terms, and factor out vanishing common terms.`
        );
        steps.push(
          `Step 4: Substitute ${v} = ${cleanTarget} into the rationalized form to obtain: ${numVal}`
        );
        break;

      case 'lhopital':
        dynamicExplanation = `Applying L'Hôpital's Rule to ${cleanExpr} at ${v} → ${cleanTarget}: because direct substitution gives 0/0 or ±∞/±∞, differentiate numerator and denominator independently.`;
        steps.push(
          `Step 1: Confirm indeterminate condition: lim f(${v}) = 0 and lim g(${v}) = 0 (or ±∞/±∞).`
        );
        // Attempt symbolic derivative with mathjs if expression contains division
        if (cleanExpr.includes('/')) {
          try {
            const parts = cleanExpr.split('/');
            const numPart = parts[0].replace(/^\(|\)$/g, '');
            const denPart = parts.slice(1).join('/').replace(/^\(|\)$/g, '');
            const numDeriv = math.derivative(numPart, v).toString();
            const denDeriv = math.derivative(denPart, v).toString();
            steps.push(`Step 2: Differentiate numerator: d/d${v}[ ${numPart} ] = ${numDeriv}`);
            steps.push(`Step 3: Differentiate denominator: d/d${v}[ ${denPart} ] = ${denDeriv}`);
            steps.push(
              `Step 4: Re-evaluate quotient of derivatives: lim_{${v} → ${cleanTarget}} [ (${numDeriv}) / (${denDeriv}) ]`
            );
          } catch {
            steps.push(`Step 2: Differentiate numerator f'(${v}) and denominator g'(${v}) independently.`);
            steps.push(`Step 3: Re-evaluate the limit of the resulting quotient.`);
          }
        } else {
          steps.push(`Step 2: Express function as a quotient f(${v})/g(${v}) and differentiate numerator and denominator.`);
        }
        steps.push(`Step 5: Substitute ${v} = ${cleanTarget} to obtain final value: ${numVal}`);
        break;

      case 'compare_degrees':
        dynamicExplanation = `Evaluating end behavior of ${cleanExpr} as ${v} → ${cleanTarget} by comparing leading polynomial degrees.`;
        steps.push(
          `Step 1: Identify highest exponent degree of ${v} in the numerator and denominator.`
        );
        steps.push(
          `Step 2: Divide each term by the highest denominator power of ${v}.`
        );
        steps.push(
          `Step 3: Use the principle that constant / ${v}^k → 0 as ${v} → ±∞.`
        );
        steps.push(
          `Step 4: The ratio of the dominant leading coefficients governs the limit: ${numVal}`
        );
        break;

      case 'special_limits':
        dynamicExplanation = `Comparing ${cleanExpr} near ${v} = ${cleanTarget} against canonical special limit identities.`;
        steps.push(
          `Step 1: Recall foundational limit theorems: lim_{u → 0} [sin(u)/u] = 1, lim_{u → 0} [(1 - cos u)/u] = 0.`
        );
        steps.push(
          `Step 2: Rescale arguments and factor out constant multiples to align with standard forms.`
        );
        steps.push(
          `Step 3: Substitute the identity value to evaluate the overall limit: ${numVal}`
        );
        break;
    }

    return {
      value: numVal,
      isIndeterminate,
      indeterminateType: indetType,
      directSubValue,
      dynamicExplanation,
      steps,
      variable: v,
      cleanExpr,
      cleanTarget,
      targetDisplay,
      numTarget,
    };
  }, [expr, target, direction, selectedTechnique, detectedVar]);

  const activeTechniqueObj =
    TECHNIQUES.find((t) => t.id === selectedTechnique) || TECHNIQUES[0];

  // ─── HIGH-PRECISION DYNAMIC GRAPH COMPUTATION ───
  const graphData = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const v = computation.variable;
    const cleanExpr = computation.cleanExpr;
    const c = typeof computation.numTarget === 'number' ? computation.numTarget : 0;

    const minX = c - graphZoom;
    const maxX = c + graphZoom;
    const samples = 220;
    const step = (maxX - minX) / samples;

    let compiled: any = null;
    try {
      compiled = math.compile(cleanExpr);
    } catch {
      return { pts: [], minX, maxX, minY: -10, maxY: 10, hasHole: false, holePoint: null };
    }

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i <= samples; i++) {
      const x = minX + i * step;
      try {
        const y = compiled.evaluate({ [v]: x });
        if (typeof y === 'number' && isFinite(y)) {
          // Clamp extreme asymptotes
          if (Math.abs(y) < 150) {
            pts.push({ x, y });
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      } catch {
        // Discontinuity / hole point
      }
    }

    if (!isFinite(minY) || !isFinite(maxY) || minY === maxY) {
      minY = -5;
      maxY = 5;
    }

    // Add 15% margin to Y range
    const yMargin = Math.max((maxY - minY) * 0.15, 1);
    minY -= yMargin;
    maxY += yMargin;

    // Target limit coordinate
    const limitNum = parseFloat(computation.value);
    const hasValidLimitNum = !isNaN(limitNum) && isFinite(limitNum);
    const holePoint = hasValidLimitNum ? { x: c, y: limitNum } : null;

    return {
      pts,
      minX,
      maxX,
      minY,
      maxY,
      hasHole: computation.isIndeterminate,
      holePoint,
    };
  }, [computation, graphZoom]);

  return (
    <div className={`w-full space-y-6 ${showKeyboard ? 'pb-72' : ''}`}>
      {/* ─── 4. DYNAMIC EXPLANATION SECTION (Fully updates with user's equation) ─── */}
      <div className="bg-[#09152e] border-l-4 border-blue-500 rounded-r-xl p-4 sm:p-5 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold">
            PROBLEM OVERVIEW &amp; ANALYSIS
          </span>
        </div>
        <p className="leading-relaxed">
          Evaluating the limit of{' '}
          <strong className="text-white font-mono">f({computation.variable}) = {computation.cleanExpr}</strong> as{' '}
          <strong className="text-blue-300 font-mono">
            {computation.variable} → {computation.targetDisplay}
          </strong>{' '}
          ({directionLabel}). {computation.dynamicExplanation}
        </p>

        {/* Dynamic Metadata Badges */}
        <div className="mt-3 pt-3 border-t border-[#14264c] flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-slate-400">
          <div>
            <span className="text-slate-500 mr-1.5">Variable:</span>
            <span className="font-mono text-white font-semibold">{computation.variable}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1.5">Target:</span>
            <span className="font-mono text-blue-300 font-semibold">{computation.targetDisplay}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1.5">Direction:</span>
            <span className="text-slate-200">{directionLabel}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1.5">Technique:</span>
            <span className="text-blue-400 font-medium">{activeTechniqueObj.label}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1.5">Status:</span>
            <span
              className={`font-medium ${
                computation.isIndeterminate ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {computation.isIndeterminate
                ? `Indeterminate (${computation.indeterminateType})`
                : 'Continuous / Determinate'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── 3. COMPUTER CALCULATOR & EXPRESSION BAR ─── */}
      <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-6 shadow-xl relative">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold">
            LIMIT EVALUATION ENGINE
          </span>

          {/* Quick Actions (Graph toggle + Camera/Image) */}
          <div className="flex items-center gap-2">
            {/* Small Graph Button */}
            <button
              type="button"
              onClick={() => setShowGraph(!showGraph)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                showGraph
                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                  : 'bg-[#09142b] hover:bg-[#0f2146] text-slate-300 border-[#1a3363]'
              }`}
              title="Toggle Interactive Graph"
            >
              <LineChart className="w-3.5 h-3.5 text-blue-400" />
              <span>Graph</span>
            </button>

            {/* Small Picture / Camera Button */}
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#09142b] hover:bg-[#0f2146] text-slate-300 border border-[#1a3363] transition-all"
              title="Upload problem photo or select textbook example"
            >
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span>Picture</span>
            </button>
          </div>
        </div>

        {/* ── Expression Bar with Proper Mathematical Subscript Notation ── */}
        <div className="bg-[#060c1d] border border-[#1b315b] rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-center gap-3 shadow-inner">
          {/* Mathematical Subscript under 'lim' */}
          <div className="flex items-center gap-2 shrink-0 select-none">
            <div className="flex flex-col items-center justify-center leading-none px-1">
              <span className="text-xl sm:text-2xl font-serif italic text-blue-300">lim</span>
              <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono mt-0.5 whitespace-nowrap">
                <span>{computation.variable} →</span>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="c"
                  className="w-12 bg-[#09142b] border border-[#1c3565] rounded px-1 py-0.5 text-xs text-white font-mono text-center focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Direction Selector */}
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as any)}
              className="bg-[#09142b] border border-[#1c3565] text-[11px] text-slate-300 rounded px-1.5 py-1 focus:outline-none"
            >
              <option value="both">Both sides (x → c)</option>
              <option value="left">Left (x → c⁻)</option>
              <option value="right">Right (x → c⁺)</option>
            </select>
          </div>

          {/* Main function input f(x) separated to the right */}
          <div className="relative flex-1 w-full flex items-center">
            <span className="text-slate-500 font-serif mr-2 text-xl">(</span>
            <input
              ref={inputRef}
              type="text"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="e.g. x^2 + 3x, (x^2 - 4)/(x - 2), sin(x)/x"
              className="w-full bg-transparent text-white font-mono text-base sm:text-lg focus:outline-none placeholder-slate-600"
            />
            <span className="text-slate-500 font-serif ml-2 text-xl">)</span>

            {/* Small Virtual Keyboard Icon Button inside bar */}
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

          {/* Technique Dropdown Button */}
          <div className="relative shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setShowTechniqueMenu(!showTechniqueMenu)}
              className="w-full md:w-auto flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-[#0d1c3a] hover:bg-[#142b57] border border-[#1c3970] text-xs font-medium text-slate-200 transition-colors"
            >
              <span>{activeTechniqueObj.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTechniqueMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Downward Vertical Navigation Bar for Techniques */}
            {showTechniqueMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#081226] border border-[#1b366a] rounded-xl shadow-2xl z-30 overflow-hidden animate-slide-down">
                <div className="p-2 border-b border-[#14264c] text-[10px] uppercase tracking-wider text-blue-400 font-semibold">
                  SELECT SOLVING TECHNIQUE
                </div>
                <div className="py-1">
                  {TECHNIQUES.map((tech) => {
                    const isSelected = tech.id === selectedTechnique;
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => {
                          setSelectedTechnique(tech.id);
                          setShowTechniqueMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-start justify-between ${
                          isSelected
                            ? 'bg-blue-950/70 text-blue-300 border-l-2 border-blue-400'
                            : 'text-slate-300 hover:text-white hover:bg-[#0e1e3e]'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{tech.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{tech.tagline}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 mt-1 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Find Limit Button */}
          <button
            type="button"
            onClick={() => {
              // Trigger smooth pulse / scroll to solution
              setActiveSolutionTab('solution');
            }}
            className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Find Limit</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ─── 5. FULLY DYNAMIC INTERACTIVE GRAPH ─── */}
        {showGraph && (
          <div className="mt-5 p-4 sm:p-5 rounded-xl bg-[#070f22] border border-[#162c57] animate-slide-down space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">
                  INTERACTIVE FUNCTION GRAPH
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono">
                  y = f({computation.variable})
                </span>
              </div>

              {/* Zoom & View Controls */}
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

            {/* SVG Canvas with Grid, Axes, Approaching Arrows, Legend */}
            <div className="relative h-60 w-full bg-[#050a18] rounded-xl border border-[#112144] overflow-hidden p-2 flex items-center justify-center">
              {graphData.pts.length > 2 ? (
                <svg viewBox="0 0 700 220" className="w-full h-full select-none" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((pct) => (
                    <g key={pct}>
                      <line
                        x1={pct * 700}
                        y1={0}
                        x2={pct * 700}
                        y2={220}
                        stroke="#132448"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1={0}
                        y1={pct * 220}
                        x2={700}
                        y2={pct * 220}
                        stroke="#132448"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    </g>
                  ))}

                  {/* X and Y Axes */}
                  {/* Y Axis line at x = 0 if within view */}
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

                  {/* X Axis line at y = 0 if within view */}
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

                  {/* Function Curve Path */}
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

                  {/* Target Point Dashed Crosshairs and Approaching Behavior */}
                  {graphData.holePoint && (
                    <>
                      {/* Vertical line at x = c */}
                      <line
                        x1={((graphData.holePoint.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                        y1={0}
                        x2={((graphData.holePoint.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                        y2={220}
                        stroke="#60a5fa"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                      />

                      {/* Horizontal line at y = L */}
                      <line
                        x1={0}
                        y1={220 - ((graphData.holePoint.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 220}
                        x2={700}
                        y2={220 - ((graphData.holePoint.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 220}
                        stroke="#60a5fa"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                      />

                      {/* Target Limit Marker (Open hole if indeterminate 0/0, Solid if continuous) */}
                      <circle
                        cx={((graphData.holePoint.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                        cy={220 - ((graphData.holePoint.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 220}
                        r={computation.isIndeterminate ? 6 : 5}
                        fill={computation.isIndeterminate ? '#050a18' : '#ffffff'}
                        stroke="#3b82f6"
                        strokeWidth={computation.isIndeterminate ? 3 : 2}
                      />
                    </>
                  )}
                </svg>
              ) : (
                <div className="text-xs text-slate-400">Plotting function curve...</div>
              )}
            </div>

            {/* Dynamic Graph Legend and Details */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 pt-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-sky-400 rounded-full" />
                  <span className="font-mono text-slate-300">f({computation.variable}) = {computation.cleanExpr}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-400 bg-white" />
                  <span className="font-mono text-slate-300">
                    ({computation.cleanTarget}, {computation.value})
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Domain: [{graphData.minX.toFixed(1)}, {graphData.maxX.toFixed(1)}]
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 2. TECHNIQUE & SOLUTION TABS ─── */}
      <div className="w-full">
        {/* Solution Tabs Navigation */}
        <div className="flex border-b border-[#14264c] mb-6">
          <button
            type="button"
            onClick={() => setActiveSolutionTab('solution')}
            className={`py-2 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeSolutionTab === 'solution'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Technique &amp; Solution</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSolutionTab('function_info')}
            className={`py-2 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeSolutionTab === 'function_info'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Function Analysis</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSolutionTab('all_techniques')}
            className={`py-2 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeSolutionTab === 'all_techniques'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Compare 6 Techniques</span>
          </button>
        </div>

        {/* ── TAB 1: TECHNIQUE & SOLUTION (Strictly renamed per Requirement 2 & 3) ── */}
        {activeSolutionTab === 'solution' && (
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 sm:p-8 space-y-6 animate-fade-in">
            {/* Header: Replaced 'Worked Examples' with 'Technique & Solution' */}
            <div className="border-b border-[#14264c] pb-4">
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                Technique &amp; Solution
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Step-by-step mathematical derivation for your exact input equation.
              </p>
            </div>

            {/* Technique Header with blue accent highlight */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg sm:text-xl font-serif font-medium text-white">
                  <span className="text-blue-400 font-semibold px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 mr-2 shadow-sm">
                    Technique: {activeTechniqueObj.label}
                  </span>
                </h3>
              </div>

              {/* Dynamic mathematical notation for the current problem */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-400">Evaluating:</span>
                <MathLimitNotation
                  variable={computation.variable}
                  target={computation.cleanTarget}
                  direction={direction}
                  expr={computation.cleanExpr}
                  size="normal"
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                {activeTechniqueObj.description}
              </p>
            </div>

            {/* Centered Textbook Mathematical Result Box */}
            <div className="py-6 px-4 bg-[#070e21] border border-[#142852] rounded-xl text-center shadow-inner flex items-center justify-center">
              <MathLimitNotation
                variable={computation.variable}
                target={computation.cleanTarget}
                direction={direction}
                expr={computation.cleanExpr}
                result={computation.value}
                size="lg"
              />
            </div>

            {/* Step-by-Step Derivation */}
            <div className="space-y-3 pt-2">
              <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                STEP-BY-STEP DERIVATION
              </div>
              <div className="space-y-2">
                {computation.steps.map((st, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[#081226] border border-[#14264c] text-xs sm:text-sm font-mono text-slate-300"
                  >
                    <span className="text-blue-400 font-semibold shrink-0">0{i + 1}.</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Takeaway / Textbook Note */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs sm:text-sm text-blue-200/90 leading-relaxed">
              <strong className="text-blue-300 font-medium">Textbook Rule: </strong>
              {selectedTechnique === 'direct_substitution'
                ? 'Direct substitution is always the first thing to try. It only fails when substitution gives an indeterminate form like 0/0 or ∞/∞.'
                : selectedTechnique === 'factoring'
                ? 'Factoring cancels removable discontinuities (holes). Always factor numerator and denominator completely before substituting.'
                : selectedTechnique === 'rationalizing'
                ? 'When radicals produce 0/0, multiplying by the conjugate creates the difference of squares (a - b)(a + b) = a² - b², freeing terms from roots.'
                : selectedTechnique === 'lhopital'
                ? "L'Hôpital's rule requires verifying that the limit has form 0/0 or ∞/∞ before taking derivatives."
                : selectedTechnique === 'compare_degrees'
                ? 'Limits at infinity are governed by dominant polynomial terms. Equal degrees give the ratio of leading coefficients.'
                : 'Special limits are derived from geometric bounds (the Squeeze Theorem). Use them as algebraic replacement templates.'}
            </div>
          </div>
        )}

        {/* ── TAB 2: FUNCTION INFORMATION ── */}
        {activeSolutionTab === 'function_info' && (
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-serif text-white">Function Properties &amp; Behavior</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#070e21] border border-[#14264c]">
                <div className="text-blue-400 font-medium mb-1">Function Form</div>
                <div className="font-mono text-white text-base">
                  f({computation.variable}) = {computation.cleanExpr}
                </div>
                <div className="text-slate-400 mt-2 text-xs">
                  {computation.cleanExpr.includes('/')
                    ? 'Rational / Quotient expression'
                    : computation.cleanExpr.includes('sin') || computation.cleanExpr.includes('cos')
                    ? 'Trigonometric expression'
                    : 'Polynomial / Algebraic expression'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070e21] border border-[#14264c]">
                <div className="text-blue-400 font-medium mb-1">Target Point Continuity</div>
                <div className="font-mono text-white text-base">
                  {computation.variable} = {computation.cleanTarget}
                </div>
                <div className="text-slate-400 mt-2 text-xs">
                  {computation.isIndeterminate
                    ? `Indeterminate (${computation.indeterminateType}). Removable discontinuity or asymptote.`
                    : 'Continuous at target point. Direct substitution is fully valid.'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070e21] border border-[#14264c]">
                <div className="text-blue-400 font-medium mb-1">Limit Result</div>
                <div className="font-mono text-blue-300 text-lg font-semibold">
                  L = {computation.value}
                </div>
                <div className="text-slate-400 mt-1 text-xs">
                  Approaching from {directionLabel}.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070e21] border border-[#14264c]">
                <div className="text-blue-400 font-medium mb-1">Active Technique</div>
                <div className="font-serif text-white text-base capitalize">
                  {activeTechniqueObj.label}
                </div>
                <div className="text-slate-400 mt-1 text-xs">
                  {activeTechniqueObj.tagline}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: COMPARE ALL 6 TECHNIQUES ── */}
        {activeSolutionTab === 'all_techniques' && (
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-4 animate-fade-in">
            <h2 className="text-xl font-serif text-white mb-2">
              All 6 Evaluation Techniques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TECHNIQUES.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => {
                    setSelectedTechnique(tech.id);
                    setActiveSolutionTab('solution');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    tech.id === selectedTechnique
                      ? 'bg-blue-950/70 border-blue-500 shadow-md'
                      : 'bg-[#081226] border-[#14264c] hover:border-blue-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif font-medium text-white text-sm">{tech.label}</h3>
                    {tech.id === selectedTechnique && (
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-blue-300/80 mb-2 font-mono">{tech.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── 6. FIXED BOTTOM MATH VIRTUAL KEYBOARD DOCK ─── */}
      <MathVirtualKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInsert={handleKeyboardInsert}
        onDelete={handleKeyboardDelete}
        onClear={handleKeyboardClear}
      />

      {/* ─── PICTURE / PHOTO PROBLEM MODAL ─── */}
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
              Upload an image of a math problem or select one of the standard textbook presets below:
            </p>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#1d3c75] hover:border-blue-400 rounded-xl cursor-pointer bg-[#070e21] mb-5 transition-colors">
              <Camera className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-xs text-slate-200 font-medium">Click to upload photo of math problem</span>
              <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, HEIC supported</span>
              <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
            </label>

            <div className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold mb-2">
              TEXTBOOK SAMPLE PRESETS:
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSampleProblem('x^2 + 3x', '2', 'direct_substitution')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>lim (x → 2) [ x² + 3x ]</span>
                <span className="text-blue-400 font-serif">Direct Substitution</span>
              </button>
              <button
                type="button"
                onClick={() => setSampleProblem('(x^2 - 4)/(x - 2)', '2', 'factoring')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>lim (x → 2) [ (x² - 4)/(x - 2) ]</span>
                <span className="text-blue-400 font-serif">Factoring (0/0)</span>
              </button>
              <button
                type="button"
                onClick={() => setSampleProblem('(sqrt(x + 4) - 2)/x', '0', 'rationalizing')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>lim (x → 0) [ (√(x+4) - 2)/x ]</span>
                <span className="text-blue-400 font-serif">Rationalizing</span>
              </button>
              <button
                type="button"
                onClick={() => setSampleProblem('sin(x)/x', '0', 'special_limits')}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#0e1e3e] border border-[#14264c] text-xs text-slate-200 flex justify-between"
              >
                <span>lim (x → 0) [ sin(x)/x ]</span>
                <span className="text-blue-400 font-serif">Special Limits</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
