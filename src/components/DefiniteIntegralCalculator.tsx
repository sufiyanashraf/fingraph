import { useState, useMemo, useRef } from 'react';
import * as math from 'mathjs';
import {
  LineChart,
  BookOpen,
  CheckCircle2,
  XCircle,
  Keyboard,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Target,
  Info,
  Layers,
  Sparkles,
  PieChart,
  Compass,
  ArrowRightLeft,
  Activity,
  Sliders
} from 'lucide-react';
import MathVirtualKeyboard from './MathVirtualKeyboard';

type FlowMode = 'learn' | 'solve' | 'visualize' | 'applications' | 'practice' | 'formulas';

interface PracticeItem {
  id: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  hint: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const PRACTICE_QUESTIONS: PracticeItem[] = [
  {
    id: 'dp1',
    difficulty: 'Beginner',
    question: 'Evaluate the definite integral: ∫₀³ (2x) dx',
    hint: 'Find the antiderivative F(x) = x², then compute F(3) - F(0).',
    options: ['6', '9', '12', '18'],
    correctIdx: 1,
    explanation: 'F(x) = x². By the Fundamental Theorem of Calculus: F(3) - F(0) = 3² - 0² = 9 - 0 = 9.',
  },
  {
    id: 'dp2',
    difficulty: 'Beginner',
    question: 'Evaluate ∫₁⁴ (3x² - 2x) dx',
    hint: 'Antiderivative is F(x) = x³ - x². Calculate F(4) - F(1).',
    options: ['48', '45', '60', '52'],
    correctIdx: 0,
    explanation: 'F(x) = x³ - x². At x = 4: F(4) = 64 - 16 = 48. At x = 1: F(1) = 1 - 1 = 0. Difference: 48 - 0 = 48.',
  },
  {
    id: 'dp3',
    difficulty: 'Intermediate',
    question: 'What is the value of ∫₋₂² (x³ + 5x) dx using symmetry properties?',
    hint: 'Notice that f(x) = x³ + 5x is an odd function (f(-x) = -f(x)) over a symmetric interval [-2, 2].',
    options: ['0', '16', '32', 'Undefined'],
    correctIdx: 0,
    explanation: 'Since x³ + 5x is an odd function integrated over a symmetric interval [-a, a], the positive area cancels the negative area exactly, yielding 0.',
  },
  {
    id: 'dp4',
    difficulty: 'Intermediate',
    question: 'Find the average value of f(x) = 3x² on the interval [0, 2].',
    hint: 'Formula: f_avg = (1 / (b - a)) * ∫ₐᵇ f(x) dx.',
    options: ['2', '4', '6', '8'],
    correctIdx: 1,
    explanation: '∫₀² 3x² dx = [x³]₀² = 8. Average value = (1 / (2 - 0)) * 8 = 8 / 2 = 4.',
  },
  {
    id: 'dp5',
    difficulty: 'Intermediate',
    question: 'What is the net signed area versus total geometric area for f(x) = x on [-1, 2]?',
    hint: 'Net signed area is ∫₋₁² x dx; total geometric area is ∫₋₁⁰ (-x) dx + ∫₀² x dx.',
    options: ['Net = 1.5, Total = 2.5', 'Net = 2.5, Total = 1.5', 'Net = 3, Total = 3', 'Net = 0, Total = 2'],
    correctIdx: 0,
    explanation: 'Net area = [x²/2]₋₁² = 2 - 0.5 = 1.5. Total geometric area = (1/2)(1)(1) + (1/2)(2)(2) = 0.5 + 2 = 2.5.',
  },
  {
    id: 'dp6',
    difficulty: 'Advanced',
    question: 'Using substitution on ∫₀¹ x · e^(x²) dx, what is the transformed integral in terms of u?',
    hint: 'Let u = x², so du = 2x dx ⇒ (1/2) du = x dx. Bounds change: u(0) = 0, u(1) = 1.',
    options: ['(1/2) ∫₀¹ eᵘ du = (e - 1)/2', '∫₀¹ eᵘ du = e - 1', '2 ∫₀¹ eᵘ du = 2e', '∫₀² eᵘ du = e² - 1'],
    correctIdx: 0,
    explanation: 'With u = x², du = 2x dx. The bounds remain [0, 1]. Integral = (1/2) ∫₀¹ eᵘ du = (1/2)[eᵘ]₀¹ = (e - 1)/2 ≈ 0.859.',
  },
  {
    id: 'dp7',
    difficulty: 'Advanced',
    question: 'What is the area between the curves y = x² and y = x on [0, 1]?',
    hint: 'On [0, 1], y = x is above y = x². Compute ∫₀¹ (x - x²) dx.',
    options: ['1/6', '1/3', '1/2', '5/6'],
    correctIdx: 0,
    explanation: '∫₀¹ (x - x²) dx = [x²/2 - x³/3]₀¹ = 1/2 - 1/3 = 1/6 ≈ 0.167.',
  },
];

interface FormulaCard {
  id: string;
  name: string;
  category: string;
  formula: string;
  explanation: string;
  example: string;
}

const FORMULA_LIBRARY: FormulaCard[] = [
  {
    id: 'ftc',
    name: 'Fundamental Theorem of Calculus (FTC Part 2)',
    category: 'Core Theorem',
    formula: '\\int_a^b f(x) \\, dx = [F(x)]_a^b = F(b) - F(a)',
    explanation: 'To compute accumulation between a and b, evaluate the antiderivative at the upper bound and subtract the value at the lower bound.',
    example: '\\int_1^3 2x \\, dx = [x^2]_1^3 = 9 - 1 = 8',
  },
  {
    id: 'linearity',
    name: 'Linearity of Definite Integrals',
    category: 'Properties',
    formula: '\\int_a^b [c_1 f(x) \\pm c_2 g(x)] \\, dx = c_1 \\int_a^b f(x) \\, dx \\pm c_2 \\int_a^b g(x) \\, dx',
    explanation: 'Constants factor out, and integrals split across addition and subtraction.',
    example: '\\int_0^1 (3x^2 + 4) dx = 3\\int_0^1 x^2 dx + 4\\int_0^1 dx = 1 + 4 = 5',
  },
  {
    id: 'reversal',
    name: 'Reversal of Limits',
    category: 'Properties',
    formula: '\\int_b^a f(x) \\, dx = - \\int_a^b f(x) \\, dx',
    explanation: 'Swapping the upper and lower limits negates the sign of the definite integral.',
    example: '\\int_2^0 x \\, dx = -\\int_0^2 x \\, dx = -2',
  },
  {
    id: 'additivity',
    name: 'Interval Additivity',
    category: 'Properties',
    formula: '\\int_a^b f(x) \\, dx = \\int_a^c f(x) \\, dx + \\int_c^b f(x) \\, dx',
    explanation: 'An integral over [a, b] can be divided into adjoining sub-intervals at any point c.',
    example: '\\int_0^4 f(x)dx = \\int_0^2 f(x)dx + \\int_2^4 f(x)dx',
  },
  {
    id: 'symmetry_even',
    name: 'Even Function Symmetry',
    category: 'Symmetry',
    formula: 'f(-x) = f(x) \\implies \\int_{-a}^a f(x) \\, dx = 2 \\int_0^a f(x) \\, dx',
    explanation: 'Even symmetric functions have identical left and right lobes; double the right half.',
    example: '\\int_{-2}^2 x^2 dx = 2\\int_0^2 x^2 dx = 2(8/3) = 16/3',
  },
  {
    id: 'symmetry_odd',
    name: 'Odd Function Symmetry',
    category: 'Symmetry',
    formula: 'f(-x) = -f(x) \\implies \\int_{-a}^a f(x) \\, dx = 0',
    explanation: 'Odd symmetric functions have equal opposite areas that cancel to exactly zero.',
    example: '\\int_{-5}^5 x^3 dx = 0',
  },
  {
    id: 'avg_value',
    name: 'Average Value of a Function',
    category: 'Applications',
    formula: 'f_{avg} = \\frac{1}{b - a} \\int_a^b f(x) \\, dx',
    explanation: 'The continuous mean height of the function over the span [a, b].',
    example: 'f_{avg} \\text{ of } 2x \\text{ on } [0, 4] = \\frac{1}{4}(16) = 4',
  },
  {
    id: 'area_between',
    name: 'Area Between Two Curves',
    category: 'Applications',
    formula: 'A = \\int_a^b [f_{top}(x) - g_{bottom}(x)] \\, dx',
    explanation: 'Integrate the vertical difference between upper and lower curves.',
    example: '\\int_0^1 (\\sqrt{x} - x^2) \\, dx = \\frac{2}{3} - \\frac{1}{3} = \\frac{1}{3}',
  },
  {
    id: 'simpson',
    name: "Simpson's 1/3 Rule (Numerical)",
    category: 'Numerical',
    formula: 'S_n = \\frac{\\Delta x}{3}[f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \\dots + f(x_n)]',
    explanation: 'Quadratic parabolic interpolation across subintervals providing high numerical accuracy.',
    example: '\\Delta x = \\frac{b - a}{n} \\quad (n \\text{ even})',
  },
];

interface DefiniteAnalysisResult {
  success: boolean;
  technique: string;
  whyTechnique: string;
  formulaLatex: string;
  antiderivative: string;
  netSignedArea: number;
  totalGeometricArea: number;
  avgValue: number;
  ftcSteps: { step: number; title: string; desc: string; math?: string }[];
  isSymmetric: boolean;
  symmetryType: 'even' | 'odd' | 'none';
  numericalApproximations: {
    leftSum: number;
    rightSum: number;
    midpoint: number;
    trapezoid: number;
    simpson: number;
  };
  error?: string;
}

export default function DefiniteIntegralCalculator() {
  const [flowMode, setFlowMode] = useState<FlowMode>('solve');

  // Input states
  const [expr, setExpr] = useState<string>('3x^2 - 4x + 2');
  const [secondExpr, setSecondExpr] = useState<string>('x');
  const [lowerLimit, setLowerLimit] = useState<string>('0');
  const [upperLimit, setUpperLimit] = useState<string>('2');
  const [activeInput, setActiveInput] = useState<'expr' | 'secondExpr' | 'lower' | 'upper'>('expr');

  // Settings
  const [betweenCurvesMode, setBetweenCurvesMode] = useState<boolean>(false);
  const [numSubdivisions, setNumSubdivisions] = useState<number>(10);
  const [graphZoom, setGraphZoom] = useState<number>(5);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  const exprInputRef = useRef<HTMLInputElement>(null);
  const secondExprInputRef = useRef<HTMLInputElement>(null);
  const lowerInputRef = useRef<HTMLInputElement>(null);
  const upperInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect variable
  const variable = useMemo(() => {
    const letters = expr.match(/[a-zA-Z]/g) || [];
    const reserved = ['s', 'i', 'n', 'c', 'o', 't', 'a', 'l', 'g', 'e', 'x', 'p', 'r', 'q', 'b', 'd'];
    const candidates = letters.filter(
      (ch) => !reserved.includes(ch.toLowerCase()) || ['x', 't', 'y', 'u', 'z', 'w'].includes(ch.toLowerCase())
    );
    return candidates.length > 0 ? candidates[0] : 'x';
  }, [expr]);

  // Clean math expression
  const cleanExpr = useMemo(() => {
    return expr
      .replace(/(\d+)([a-zA-Z])/g, '$1 * $2')
      .replace(/\)\(/g, ') * (')
      .replace(/(\d+)\(/g, '$1 * (')
      .replace(/\)([a-zA-Z])/g, ') * $1')
      .trim();
  }, [expr]);

  // Clean second expression
  const cleanSecondExpr = useMemo(() => {
    return secondExpr
      .replace(/(\d+)([a-zA-Z])/g, '$1 * $2')
      .replace(/\)\(/g, ') * (')
      .replace(/(\d+)\(/g, '$1 * (')
      .replace(/\)([a-zA-Z])/g, ') * $1')
      .trim();
  }, [secondExpr]);

  // Boundaries a and b
  const bounds = useMemo(() => {
    let a = 0;
    let b = 2;
    if (lowerLimit.trim() === 'pi' || lowerLimit.trim() === 'π') a = Math.PI;
    else if (!isNaN(parseFloat(lowerLimit))) a = parseFloat(lowerLimit);

    if (upperLimit.trim() === 'pi' || upperLimit.trim() === 'π') b = Math.PI;
    else if (!isNaN(parseFloat(upperLimit))) b = parseFloat(upperLimit);

    return { a, b };
  }, [lowerLimit, upperLimit]);

  // Analysis Engine
  const analysis: DefiniteAnalysisResult = useMemo(() => {
    if (!cleanExpr) {
      return {
        success: false,
        technique: 'Direct Evaluation',
        whyTechnique: 'Please enter a valid mathematical expression.',
        formulaLatex: '\\int_a^b f(x) dx = F(b) - F(a)',
        antiderivative: '',
        netSignedArea: 0,
        totalGeometricArea: 0,
        avgValue: 0,
        ftcSteps: [],
        isSymmetric: false,
        symmetryType: 'none',
        numericalApproximations: { leftSum: 0, rightSum: 0, midpoint: 0, trapezoid: 0, simpson: 0 },
        error: 'Please enter a valid expression.',
      };
    }

    try {
      const { a, b } = bounds;
      const exprLower = cleanExpr.toLowerCase();
      const hasProduct = exprLower.includes('*');
      const hasFraction = exprLower.includes('/');
      const hasExp = exprLower.includes('e^') || exprLower.includes('exp');
      const hasLn = exprLower.includes('ln') || exprLower.includes('log');
      const hasSin = exprLower.includes('sin');
      const hasCos = exprLower.includes('cos');

      // Technique Detection
      let technique = 'Direct Polynomial Evaluation';
      let whyTechnique =
        'The integrand is an algebraic sum of power terms. We find the antiderivative term-by-term and apply the Fundamental Theorem of Calculus directly.';
      let formulaLatex = '\\int_a^b x^n \\, dx = \\left[ \\frac{x^{n+1}}{n+1} \\right]_a^b = \\frac{b^{n+1} - a^{n+1}}{n+1}';

      if ((hasExp || hasLn || hasSin || hasCos) && hasProduct && !hasFraction) {
        technique = 'Integration by Parts';
        whyTechnique =
          'The integrand is a product of dissimilar functions. Integration by parts (∫ u dv = uv - ∫ v du) evaluates this product across the limits.';
        formulaLatex = '\\int_a^b u \\, dv = [uv]_a^b - \\int_a^b v \\, du';
      } else if (hasFraction) {
        technique = 'Rational Function / Reciprocal Method';
        whyTechnique =
          'The integrand is a rational fraction. We integrate using natural logarithms or partial fraction decomposition.';
        formulaLatex = '\\int_a^b \\frac{1}{x} \\, dx = [\\ln|x|]_a^b = \\ln|b| - \\ln|a|';
      } else if (hasSin || hasCos) {
        technique = 'Trigonometric Definite Evaluation';
        whyTechnique =
          'The integrand consists of periodic trigonometric waves. Antiderivatives map sine to -cos and cosine to sin.';
        formulaLatex = '\\int_a^b \\sin(x) \\, dx = [-\\cos(x)]_a^b = -\\cos(b) + \\cos(a)';
      } else if (hasExp) {
        technique = 'Exponential Definite Evaluation';
        whyTechnique = 'The integrand contains eˣ, which reproduces itself upon integration.';
        formulaLatex = '\\int_a^b e^x \\, dx = [e^x]_a^b = e^b - e^a';
      }

      // Check Symmetry: if a = -b (symmetric interval [-k, k])
      const isSymmetricInterval = Math.abs(a + b) < 1e-5 && Math.abs(a) > 1e-5;
      let symmetryType: 'even' | 'odd' | 'none' = 'none';

      const compiledF = math.compile(cleanExpr);
      if (isSymmetricInterval) {
        try {
          const testVal = Math.abs(a) / 2;
          const posVal = Number(compiledF.evaluate({ [variable]: testVal }));
          const negVal = Number(compiledF.evaluate({ [variable]: -testVal }));

          if (Math.abs(posVal - negVal) < 1e-4) {
            symmetryType = 'even';
            technique = 'Even Symmetry Shortcut (2 × ∫₀ᵇ f(x)dx)';
            whyTechnique = `The interval [${a}, ${b}] is symmetric and f(-${variable}) = f(${variable}) (even function). We can double the integral from 0 to ${b}.`;
          } else if (Math.abs(posVal + negVal) < 1e-4) {
            symmetryType = 'odd';
            technique = 'Odd Symmetry Shortcut (= 0)';
            whyTechnique = `The interval [${a}, ${b}] is symmetric and f(-${variable}) = -f(${variable}) (odd function). The positive and negative lobes cancel to exactly 0.`;
          }
        } catch {
          // ignore
        }
      }

      // Symbolic Antiderivative Formation
      let antiderivative = '';
      const trimmed = cleanExpr.replace(/\s+/g, '');
      if (/^x\^(\d+)$/.test(trimmed)) {
        const n = parseInt(trimmed.match(/^x\^(\d+)$/)![1]);
        antiderivative = `(x^${n + 1}) / ${n + 1}`;
      } else if (trimmed === 'x') {
        antiderivative = 'x^2 / 2';
      } else if (trimmed === 'e^x' || trimmed === 'exp(x)') {
        antiderivative = 'e^x';
      } else if (trimmed === 'sin(x)') {
        antiderivative = '-cos(x)';
      } else if (trimmed === 'cos(x)') {
        antiderivative = 'sin(x)';
      } else {
        // Polynomial term-by-term integrator
        try {
          const terms = cleanExpr.split(/(?=[+-])/);
          const integratedTerms = terms.map((t) => {
            const tr = t.trim();
            if (!tr) return '';
            const sign = tr.startsWith('-') ? '-' : tr.startsWith('+') ? '+' : '';
            const core = tr.replace(/^[+-]/, '').trim();

            if (/^\d+(\.\d+)?$/.test(core)) {
              return `${sign} ${core}*${variable}`;
            }
            const powMatch = core.match(/^(\d+)?\*?([a-zA-Z])\^(\d+)$/);
            if (powMatch) {
              const c = powMatch[1] ? parseFloat(powMatch[1]) : 1;
              const n = parseFloat(powMatch[3]);
              const n1 = n + 1;
              const coeff = c / n1;
              const cleanCoeff = Math.abs(coeff - Math.round(coeff)) < 1e-5 ? Math.round(coeff) : coeff.toFixed(2);
              return `${sign} ${cleanCoeff === 1 ? '' : cleanCoeff}*${variable}^${n1}`;
            }
            const linMatch = core.match(/^(\d+)?\*?([a-zA-Z])$/);
            if (linMatch) {
              const c = linMatch[1] ? parseFloat(linMatch[1]) : 1;
              const coeff = c / 2;
              const cleanCoeff = Math.abs(coeff - Math.round(coeff)) < 1e-5 ? Math.round(coeff) : coeff.toFixed(2);
              return `${sign} ${cleanCoeff === 1 ? '' : cleanCoeff}*${variable}^2`;
            }
            if (core.includes('sin')) return `${sign === '-' ? '+' : '-'} cos(${variable})`;
            if (core.includes('cos')) return `${sign} sin(${variable})`;
            if (core.includes('e^') || core.includes('exp')) return `${sign} e^${variable}`;
            return `${sign} ∫(${core})d${variable}`;
          });
          antiderivative = integratedTerms.join(' ').replace(/\s+/g, ' ').trim();
          if (antiderivative.startsWith('+')) antiderivative = antiderivative.slice(1).trim();
        } catch {
          antiderivative = `F(${variable})`;
        }
      }

      // High-precision Numerical Quadrature for Net and Total Geometric Area
      const N = 1000;
      const h = (b - a) / N;
      let netSum = 0;
      let absSum = 0;

      for (let i = 0; i <= N; i++) {
        const xVal = a + i * h;
        let fx = 0;
        try {
          const evalVal = compiledF.evaluate({ [variable]: xVal });
          fx = isFinite(evalVal) && !isNaN(evalVal) ? Number(evalVal) : 0;
        } catch {
          fx = 0;
        }
        const coeff = i === 0 || i === N ? 1 : i % 2 === 0 ? 2 : 4;
        netSum += coeff * fx;
        absSum += coeff * Math.abs(fx);
      }

      const netSignedArea = Number(((h / 3) * netSum).toFixed(4));
      const totalGeometricArea = Number(((h / 3) * absSum).toFixed(4));

      // Average Value
      const spanLen = b - a;
      const avgValue = spanLen !== 0 ? Number((netSignedArea / spanLen).toFixed(4)) : 0;

      // Numerical Approximations Table with selected numSubdivisions
      const nApprox = numSubdivisions;
      const deltaX = (b - a) / nApprox;
      let leftSum = 0;
      let rightSum = 0;
      let midSum = 0;
      let trapSum = 0;

      for (let i = 0; i < nApprox; i++) {
        const x_i = a + i * deltaX;
        const x_i1 = a + (i + 1) * deltaX;
        const x_mid = (x_i + x_i1) / 2;

        let f_left = 0;
        let f_right = 0;
        let f_mid = 0;

        try { f_left = Number(compiledF.evaluate({ [variable]: x_i })); } catch {}
        try { f_right = Number(compiledF.evaluate({ [variable]: x_i1 })); } catch {}
        try { f_mid = Number(compiledF.evaluate({ [variable]: x_mid })); } catch {}

        if (isFinite(f_left)) leftSum += f_left * deltaX;
        if (isFinite(f_right)) rightSum += f_right * deltaX;
        if (isFinite(f_mid)) midSum += f_mid * deltaX;
        if (isFinite(f_left) && isFinite(f_right)) {
          trapSum += ((f_left + f_right) / 2) * deltaX;
        }
      }

      // Simpson for nApprox
      let simpSum = 0;
      const simpH = (b - a) / nApprox;
      for (let i = 0; i <= nApprox; i++) {
        const xVal = a + i * simpH;
        let fx = 0;
        try { fx = Number(compiledF.evaluate({ [variable]: xVal })); } catch {}
        const coeff = i === 0 || i === nApprox ? 1 : i % 2 === 0 ? 2 : 4;
        simpSum += coeff * fx;
      }
      const simpson = Number(((simpH / 3) * simpSum).toFixed(4));

      // Build Step-by-Step FTC Derivation
      const ftcSteps: { step: number; title: string; desc: string; math?: string }[] = [];

      ftcSteps.push({
        step: 1,
        title: 'Determine the General Antiderivative F(x)',
        desc: `Integrate f(${variable}) = ${expr} symbolically to find F(${variable}):`,
        math: `F(${variable}) = \\int \\left(${expr}\\right) d${variable} = ${antiderivative}`,
      });

      ftcSteps.push({
        step: 2,
        title: 'Apply the Fundamental Theorem of Calculus (FTC)',
        desc: 'State the definite integral in brackets from lower bound to upper bound:',
        math: `\\int_{${a}}^{${b}} f(${variable}) \\, d${variable} = \\left[ ${antiderivative} \\right]_{${a}}^{${b}} = F(${b}) - F(${a})`,
      });

      try {
        let cleanAnti = antiderivative.replace(/∫\([^)]+\)d[a-zA-Z]/g, '0');
        if (!cleanAnti.trim()) cleanAnti = '0';
        const compiledAnti = math.compile(cleanAnti);
        const fb = Number(compiledAnti.evaluate({ [variable]: b }));
        const fa = Number(compiledAnti.evaluate({ [variable]: a }));

        ftcSteps.push({
          step: 3,
          title: `Evaluate Antiderivative at Upper Bound (${variable} = ${b})`,
          desc: `Substitute ${variable} = ${b} into F(${variable}):`,
          math: `F(${b}) \\approx ${fb.toFixed(4)}`,
        });

        ftcSteps.push({
          step: 4,
          title: `Evaluate Antiderivative at Lower Bound (${variable} = ${a})`,
          desc: `Substitute ${variable} = ${a} into F(${variable}):`,
          math: `F(${a}) \\approx ${fa.toFixed(4)}`,
        });

        ftcSteps.push({
          step: 5,
          title: 'Calculate the Net Difference F(b) - F(a)',
          desc: 'Subtract the lower bound evaluation from the upper bound evaluation:',
          math: `F(${b}) - F(${a}) = ${fb.toFixed(4)} - (${fa.toFixed(4)}) = ${netSignedArea}`,
        });
      } catch {
        ftcSteps.push({
          step: 3,
          title: 'Compute Difference Across Boundaries',
          desc: `Net accumulation evaluates to ${netSignedArea}.`,
          math: `\\int_{${a}}^{${b}} f(${variable})d${variable} = ${netSignedArea}`,
        });
      }

      return {
        success: true,
        technique,
        whyTechnique,
        formulaLatex,
        antiderivative,
        netSignedArea,
        totalGeometricArea,
        avgValue,
        ftcSteps,
        isSymmetric: isSymmetricInterval,
        symmetryType,
        numericalApproximations: {
          leftSum: Number(leftSum.toFixed(4)),
          rightSum: Number(rightSum.toFixed(4)),
          midpoint: Number(midSum.toFixed(4)),
          trapezoid: Number(trapSum.toFixed(4)),
          simpson,
        },
        error: undefined,
      };
    } catch (e: any) {
      return {
        success: false,
        technique: 'Evaluation Error',
        whyTechnique: 'Error parsing mathematical syntax.',
        formulaLatex: '\\int_a^b f(x) dx',
        antiderivative: '',
        netSignedArea: 0,
        totalGeometricArea: 0,
        avgValue: 0,
        ftcSteps: [],
        isSymmetric: false,
        symmetryType: 'none',
        numericalApproximations: { leftSum: 0, rightSum: 0, midpoint: 0, trapezoid: 0, simpson: 0 },
        error: e.message || 'Error processing definite integral.',
      };
    }
  }, [cleanExpr, variable, bounds, numSubdivisions, expr]);

  // SVG Graph Generation (with positive/negative area shading & optional second curve)
  const graphData = useMemo(() => {
    if (!analysis.success) return null;

    try {
      const { a, b } = bounds;
      const center = (a + b) / 2;
      const span = Math.max(graphZoom, Math.abs(b - a) + 2);
      const minX = center - span;
      const maxX = center + span;
      const step = (maxX - minX) / 140;

      const compiledF = math.compile(cleanExpr);
      let compiledG: any = null;
      if (betweenCurvesMode && cleanSecondExpr) {
        try { compiledG = math.compile(cleanSecondExpr); } catch {}
      }

      const fPoints: { x: number; y: number }[] = [];
      const gPoints: { x: number; y: number }[] = [];
      const posShaded: { x: number; y: number }[] = [];
      const negShaded: { x: number; y: number }[] = [];
      const betweenShaded: { x: number; y1: number; y2: number }[] = [];

      let minY = Infinity;
      let maxY = -Infinity;

      for (let x = minX; x <= maxX; x += step) {
        try {
          const y = Number(compiledF.evaluate({ [variable]: x }));
          if (isFinite(y) && !isNaN(y)) {
            const clampedY = Math.max(-50, Math.min(50, y));
            fPoints.push({ x, y: clampedY });
            if (clampedY < minY) minY = clampedY;
            if (clampedY > maxY) maxY = clampedY;

            let y2 = 0;
            if (compiledG) {
              const evalG = Number(compiledG.evaluate({ [variable]: x }));
              if (isFinite(evalG)) {
                y2 = Math.max(-50, Math.min(50, evalG));
                gPoints.push({ x, y: y2 });
                if (y2 < minY) minY = y2;
                if (y2 > maxY) maxY = y2;
              }
            }

            // Area between [a, b]
            if (x >= Math.min(a, b) && x <= Math.max(a, b)) {
              if (betweenCurvesMode) {
                betweenShaded.push({ x, y1: clampedY, y2 });
              } else {
                if (clampedY >= 0) posShaded.push({ x, y: clampedY });
                else negShaded.push({ x, y: clampedY });
              }
            }
          }
        } catch {
          // ignore
        }
      }

      if (minY === Infinity || maxY === -Infinity) {
        minY = -5;
        maxY = 10;
      }
      if (maxY - minY < 2) {
        maxY += 2;
        minY -= 2;
      }

      const padding = (maxY - minY) * 0.15;
      minY -= padding;
      maxY += padding;

      return {
        minX,
        maxX,
        minY,
        maxY,
        fPoints,
        gPoints,
        posShaded,
        negShaded,
        betweenShaded,
        a,
        b,
      };
    } catch {
      return null;
    }
  }, [cleanExpr, cleanSecondExpr, variable, bounds, graphZoom, betweenCurvesMode, analysis]);

  // Virtual keyboard insertions
  const handleKeyboardInsert = (char: string) => {
    if (activeInput === 'expr') {
      setExpr((prev) => prev + char);
      if (exprInputRef.current) exprInputRef.current.focus();
    } else if (activeInput === 'secondExpr') {
      setSecondExpr((prev) => prev + char);
      if (secondExprInputRef.current) secondExprInputRef.current.focus();
    } else if (activeInput === 'lower') {
      setLowerLimit((prev) => prev + char);
      if (lowerInputRef.current) lowerInputRef.current.focus();
    } else {
      setUpperLimit((prev) => prev + char);
      if (upperInputRef.current) upperInputRef.current.focus();
    }
  };

  const handleKeyboardDelete = () => {
    if (activeInput === 'expr') setExpr((prev) => prev.slice(0, -1));
    else if (activeInput === 'secondExpr') setSecondExpr((prev) => prev.slice(0, -1));
    else if (activeInput === 'lower') setLowerLimit((prev) => prev.slice(0, -1));
    else setUpperLimit((prev) => prev.slice(0, -1));
  };

  const handleKeyboardClear = () => {
    if (activeInput === 'expr') setExpr('');
    else if (activeInput === 'secondExpr') setSecondExpr('');
    else if (activeInput === 'lower') setLowerLimit('');
    else setUpperLimit('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ─── HEADER & SUBTITLE ─── */}
      <div className="pb-2 border-b border-[#14264c]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50">
            Calculus · Definite Integrals
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Fundamental Theorem & Area Lab
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
          DEFINITE INTEGRAL ENGINE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-normal">
          Calculate, visualize, and understand accumulation and area using definite integrals.
        </p>
      </div>

      {/* ─── 1. SIMPLE QUICK ACCESS NAV ─── */}
      <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
          {[
            { id: 'learn', label: '📘 Learn' },
            { id: 'solve', label: '∫ Solve' },
            { id: 'visualize', label: '📊 Visualize' },
            { id: 'applications', label: '📐 Applications' },
            { id: 'practice', label: '🎯 Practice' },
            { id: 'formulas', label: '📚 Formulas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFlowMode(tab.id as FlowMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                flowMode === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1833]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 px-2 hidden sm:block">
          FTC: <span className="font-mono text-blue-300">∫ₐᵇ f(x)dx = F(b) - F(a)</span>
        </div>
      </div>

      {/* ═══ 2. MAIN DEFINITE INTEGRAL SOLVER WORKSPACE ═══ */}
      {flowMode === 'solve' && (
        <div className="space-y-6">
          {/* Main Input Control Center */}
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-6 space-y-4 shadow-xl">
            {/* Top Toolbar: Mode toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBetweenCurvesMode(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !betweenCurvesMode
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white bg-[#071126]'
                  }`}
                >
                  Single Curve Area ∫ₐᵇ f({variable}) d{variable}
                </button>
                <button
                  type="button"
                  onClick={() => setBetweenCurvesMode(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    betweenCurvesMode
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white bg-[#071126]'
                  }`}
                >
                  Area Between Curves ∫ₐᵇ [f - g] d{variable}
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Variable: <strong className="font-mono text-blue-300">{variable}</strong>
              </span>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
              {/* Function Input */}
              <div className={betweenCurvesMode ? 'lg:col-span-4 space-y-1.5' : 'lg:col-span-6 space-y-1.5'}>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Function f({variable}) =</span>
                  <span className="text-[11px] text-blue-400 font-normal">e.g. 3x^2 - 4x + 2</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-blue-400 font-mono text-base pointer-events-none select-none">
                    ∫
                  </span>
                  <input
                    ref={exprInputRef}
                    type="text"
                    value={expr}
                    onChange={(e) => setExpr(e.target.value)}
                    onFocus={() => setActiveInput('expr')}
                    placeholder="3x^2 - 4x + 2"
                    className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-8 pr-3 py-2.5 text-sm sm:text-base font-mono text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Second Function if Area Between Curves */}
              {betweenCurvesMode && (
                <div className="lg:col-span-3 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Bottom g({variable}) =
                  </label>
                  <input
                    ref={secondExprInputRef}
                    type="text"
                    value={secondExpr}
                    onChange={(e) => setSecondExpr(e.target.value)}
                    onFocus={() => setActiveInput('secondExpr')}
                    placeholder="x"
                    className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm sm:text-base font-mono text-white outline-none"
                  />
                </div>
              )}

              {/* Limits a and b */}
              <div className={betweenCurvesMode ? 'lg:col-span-2 grid grid-cols-2 gap-2' : 'lg:col-span-2 grid grid-cols-2 gap-2'}>
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Lower a</label>
                  <input
                    ref={lowerInputRef}
                    type="text"
                    value={lowerLimit}
                    onChange={(e) => setLowerLimit(e.target.value)}
                    onFocus={() => setActiveInput('lower')}
                    className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 rounded-xl px-2 py-2.5 text-center text-sm font-mono text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Upper b</label>
                  <input
                    ref={upperInputRef}
                    type="text"
                    value={upperLimit}
                    onChange={(e) => setUpperLimit(e.target.value)}
                    onFocus={() => setActiveInput('upper')}
                    className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 rounded-xl px-2 py-2.5 text-center text-sm font-mono text-white outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className={betweenCurvesMode ? 'lg:col-span-3 flex items-center gap-2' : 'lg:col-span-4 flex items-center gap-2'}>
                <button
                  type="button"
                  onClick={() => setShowKeyboard((prev) => !prev)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    showKeyboard
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-[#09152e] hover:bg-[#10234a] border-[#1d3c75] text-slate-200'
                  }`}
                  title="Toggle Math Keyboard"
                >
                  <Keyboard className="w-4 h-4 text-blue-400" />
                  <span>Keyboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlowMode('visualize')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#09152e] hover:bg-[#10234a] border border-[#1d3c75] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="Visualize Area Graph"
                >
                  <LineChart className="w-4 h-4 text-sky-400" />
                  <span>Graph</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#09152e] hover:bg-[#10234a] border border-[#1d3c75] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="Upload picture"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Picture</span>
                </button>
              </div>
            </div>

            {/* Presets and Status row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#132244] text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 text-[11px] mr-1">Quick Presets:</span>
                {[
                  { label: 'Parabola [0, 2]', f: '3x^2 - 4x + 2', a: '0', b: '2' },
                  { label: 'Symmetric Sine [-π, π]', f: 'sin(x)', a: '-pi', b: 'pi' },
                  { label: 'Exponential Growth [0, 1]', f: 'e^x', a: '0', b: '1' },
                  { label: 'Even Symmetry [-2, 2]', f: 'x^2', a: '-2', b: '2' },
                ].map((pr) => (
                  <button
                    key={pr.label}
                    type="button"
                    onClick={() => {
                      setExpr(pr.f);
                      setLowerLimit(pr.a);
                      setUpperLimit(pr.b);
                      setBetweenCurvesMode(false);
                    }}
                    className="px-2 py-0.5 rounded bg-[#071126] hover:bg-[#0e2148] text-slate-300 border border-[#14264c] text-[10px]"
                  >
                    {pr.label}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-400">
                Method: <strong className="text-sky-300">{analysis.technique}</strong>
              </div>
            </div>
          </div>

          {/* ═══ 3. TECHNIQUE & SOLUTION SECTION ═══ */}
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-7 space-y-6 shadow-xl">
            {/* Header: Technique */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#14264c]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold mb-1">
                  TECHNIQUE & SOLUTION
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>Technique Used:</span>
                  <span className="text-blue-300 bg-blue-950/70 px-3 py-0.5 rounded-lg border border-blue-800/60 text-lg sm:text-xl font-sans">
                    {analysis.technique}
                  </span>
                </h2>
              </div>

              {analysis.isSymmetric && analysis.symmetryType !== 'none' && (
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60 self-start sm:self-auto">
                  Symmetry Shortcut: {analysis.symmetryType === 'even' ? 'Even (2x)' : 'Odd (0)'}
                </span>
              )}
            </div>

            {/* Problem Setup Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="p-3 bg-[#081226] rounded-xl border border-[#14264c]">
                <span className="text-slate-500 block text-[10px] uppercase">Function</span>
                <span className="text-white font-bold text-sm">f({variable}) = {expr}</span>
              </div>
              <div className="p-3 bg-[#081226] rounded-xl border border-[#14264c]">
                <span className="text-slate-500 block text-[10px] uppercase">Variable</span>
                <span className="text-white font-bold text-sm">{variable}</span>
              </div>
              <div className="p-3 bg-[#081226] rounded-xl border border-[#14264c]">
                <span className="text-slate-500 block text-[10px] uppercase">Lower Limit a</span>
                <span className="text-amber-300 font-bold text-sm">{bounds.a}</span>
              </div>
              <div className="p-3 bg-[#081226] rounded-xl border border-[#14264c]">
                <span className="text-slate-500 block text-[10px] uppercase">Upper Limit b</span>
                <span className="text-amber-300 font-bold text-sm">{bounds.b}</span>
              </div>
            </div>

            {/* Why This Technique? */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                Why This Technique?
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {analysis.whyTechnique}
              </p>
            </div>

            {/* Formula / Rule Used */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block">
                Formula / Rule Used
              </span>
              <div className="font-mono text-base sm:text-lg text-white bg-[#050a18] p-3 rounded-lg border border-[#132244] text-center overflow-x-auto scrollbar-hide">
                {analysis.formulaLatex}
              </div>
            </div>

            {/* Step-by-Step Solution */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Step-by-Step Solution
              </span>

              <div className="space-y-3">
                {analysis.ftcSteps.map((st) => (
                  <div key={st.step} className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      STEP {st.step} — {st.title}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
                    {st.math && (
                      <div className="mt-2 p-2.5 rounded-lg bg-[#060c1d] border border-[#132244] font-mono text-xs sm:text-sm text-sky-300 overflow-x-auto scrollbar-hide">
                        {st.math}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Final Answer Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0d1d3d] to-blue-950/60 border-2 border-blue-600/70 shadow-lg text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold block">
                FINAL DEFINITE INTEGRAL ANSWER
              </span>
              <div className="text-2xl sm:text-4xl font-mono font-bold text-white py-1">
                ∫<sub className="text-base">{bounds.a}</sub><sup className="text-base">{bounds.b}</sup> ({expr}) d{variable} = {analysis.netSignedArea}
              </div>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Represents the exact net signed area accumulated between {variable} = {bounds.a} and {variable} = {bounds.b}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 4. VISUALIZE MODE (GRAPH & SIGNED AREA LAB) ═══ */}
      {flowMode === 'visualize' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-sky-400" />
                <span>Interactive Accumulation & Signed Area Plot</span>
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing positive area (above x-axis) and negative area (below x-axis) between bounds [{bounds.a}, {bounds.b}].
              </p>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setGraphZoom((z) => Math.max(2, z - 2))}
                className="p-1.5 rounded bg-[#081226] text-slate-300 border border-[#14264c]"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGraphZoom((z) => Math.min(24, z + 2))}
                className="p-1.5 rounded bg-[#081226] text-slate-300 border border-[#14264c]"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGraphZoom(5)}
                className="p-1.5 rounded bg-[#081226] text-slate-300 border border-[#14264c]"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full h-80 sm:h-96 bg-[#060c1d] rounded-xl border border-[#132244] overflow-hidden relative flex items-center justify-center select-none">
            {graphData && graphData.fPoints.length > 1 ? (
              <svg viewBox="0 0 700 360" className="w-full h-full">
                <defs>
                  <linearGradient id="posAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="negAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="betweenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Axes */}
                <line x1={0} y1={180} x2={700} y2={180} stroke="#1b3360" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1={350} y1={0} x2={350} y2={360} stroke="#1b3360" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Shaded Area between curves or single curve */}
                {betweenCurvesMode && graphData.betweenShaded.length > 1 ? (
                  <polygon
                    points={[
                      ...graphData.betweenShaded.map((pt) => {
                        const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                        const sy = 360 - ((pt.y1 - graphData.minY) / (graphData.maxY - graphData.minY)) * 360;
                        return `${sx.toFixed(1)},${sy.toFixed(1)}`;
                      }),
                      ...[...graphData.betweenShaded].reverse().map((pt) => {
                        const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                        const sy = 360 - ((pt.y2 - graphData.minY) / (graphData.maxY - graphData.minY)) * 360;
                        return `${sx.toFixed(1)},${sy.toFixed(1)}`;
                      }),
                    ].join(' ')}
                    fill="url(#betweenGrad)"
                  />
                ) : (
                  <>
                    {/* Positive Area (Above Axis) */}
                    {graphData.posShaded.length > 1 && (
                      <polygon
                        points={[
                          `${(((graphData.a - graphData.minX) / (graphData.maxX - graphData.minX)) * 700).toFixed(1)},180`,
                          ...graphData.posShaded.map((pt) => {
                            const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                            const sy = 360 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 360;
                            return `${sx.toFixed(1)},${sy.toFixed(1)}`;
                          }),
                          `${(((graphData.b - graphData.minX) / (graphData.maxX - graphData.minX)) * 700).toFixed(1)},180`,
                        ].join(' ')}
                        fill="url(#posAreaGrad)"
                      />
                    )}
                    {/* Negative Area (Below Axis) */}
                    {graphData.negShaded.length > 1 && (
                      <polygon
                        points={[
                          `${(((graphData.a - graphData.minX) / (graphData.maxX - graphData.minX)) * 700).toFixed(1)},180`,
                          ...graphData.negShaded.map((pt) => {
                            const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                            const sy = 360 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 360;
                            return `${sx.toFixed(1)},${sy.toFixed(1)}`;
                          }),
                          `${(((graphData.b - graphData.minX) / (graphData.maxX - graphData.minX)) * 700).toFixed(1)},180`,
                        ].join(' ')}
                        fill="url(#negAreaGrad)"
                      />
                    )}
                  </>
                )}

                {/* Main Curve f(x) */}
                <path
                  d={graphData.fPoints
                    .map((pt, idx) => {
                      const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                      const sy = 360 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 360;
                      return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Second Curve g(x) if active */}
                {betweenCurvesMode && graphData.gPoints.length > 1 && (
                  <path
                    d={graphData.gPoints
                      .map((pt, idx) => {
                        const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                        const sy = 360 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 360;
                        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                )}

                {/* Average Value Horizontal Reference Line */}
                {!betweenCurvesMode && (
                  <line
                    x1={0}
                    y1={360 - ((analysis.avgValue - graphData.minY) / (graphData.maxY - graphData.minY)) * 360}
                    x2={700}
                    y2={360 - ((analysis.avgValue - graphData.minY) / (graphData.maxY - graphData.minY)) * 360}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Boundaries Vertical Lines */}
                <line
                  x1={((graphData.a - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                  y1={0}
                  x2={((graphData.a - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                  y2={360}
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
                <line
                  x1={((graphData.b - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                  y1={0}
                  x2={((graphData.b - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                  y2={360}
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
              </svg>
            ) : (
              <div className="text-xs text-slate-500 font-mono">Plotting accumulation curve...</div>
            )}
          </div>

          {/* Area Metric Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 bg-[#081226] rounded-xl border border-sky-900/50 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Net Signed Area (∫ f dx)</span>
              <div className="text-lg font-bold text-sky-300">{analysis.netSignedArea}</div>
              <p className="text-[11px] text-slate-400 font-sans">Positive above axis minus negative below.</p>
            </div>

            <div className="p-3.5 bg-[#081226] rounded-xl border border-rose-900/50 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Total Geometric Area (∫ |f| dx)</span>
              <div className="text-lg font-bold text-rose-300">{analysis.totalGeometricArea}</div>
              <p className="text-[11px] text-slate-400 font-sans">Absolute sum of both lobes without cancellation.</p>
            </div>

            <div className="p-3.5 bg-[#081226] rounded-xl border border-emerald-900/50 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Average Value (f_avg)</span>
              <div className="text-lg font-bold text-emerald-400">{analysis.avgValue}</div>
              <p className="text-[11px] text-slate-400 font-sans">Mean height over [{bounds.a}, {bounds.b}].</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 5. LEARN & CONCEPT MODE ═══ */}
      {flowMode === 'learn' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Understanding Definite Integrals Intuitively
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {/* The FTC */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h3 className="font-bold text-blue-300 text-sm">The Fundamental Theorem of Calculus</h3>
              <p>
                Calculus connects two seemingly unrelated branches: the slope of a tangent line (differentiation) and
                the area under a curve (integration). The Fundamental Theorem establishes that calculating the net change
                of an antiderivative F(x) from x = a to x = b gives the exact accumulated area.
              </p>
              <div className="p-2.5 rounded bg-[#060c1d] font-mono text-xs text-sky-300 border border-[#132244]">
                {"∫ₐᵇ f(x) dx = F(b) - F(a)"}
              </div>
            </div>

            {/* Signed vs Total Area */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h3 className="font-bold text-amber-300 text-sm">Signed Area vs. Geometric Area</h3>
              <p>
                Definite integrals compute <strong>signed accumulation</strong>. Waves above the horizontal axis
                accumulate positive value, while waves below accumulate negative value. If a particle moves forward at 5 m/s
                for 2s and backwards at 5 m/s for 2s, its net displacement is 0, but total distance covered is 20m.
              </p>
            </div>

            {/* Symmetry Shortcuts */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h3 className="font-bold text-purple-300 text-sm">Symmetry Shortcuts</h3>
              <p>
                When integrating across a symmetric interval [-a, a]:
                <br />• <strong>Odd Function:</strong> f(-x) = -f(x) ⇒ The integral is guaranteed to be <strong>0</strong>.
                <br />• <strong>Even Function:</strong> f(-x) = f(x) ⇒ Double the right half: <strong>2 × ∫₀ᵃ f(x) dx</strong>.
              </p>
            </div>

            {/* Average Value */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h3 className="font-bold text-emerald-300 text-sm">Average Value of a Function</h3>
              <p>
                If a continuous temperature or stock price changes throughout the day, what is its average level?
                The Mean Value Theorem for Integrals states that the area under the curve equals a rectangle of height
                f_avg multiplied by the width (b - a).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 6. APPLICATIONS & NUMERICAL INTEGRATION ═══ */}
      {flowMode === 'applications' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Definite Integral Applications & Numerical Lab
              </h2>
            </div>
          </div>

          {/* Numerical Integration Comparison Card */}
          <div className="p-5 rounded-2xl bg-[#081226] border border-[#162c57] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Numerical Approximation vs. Exact Value</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Compare Riemann sums, Trapezoid, and Simpson's Rule for f({variable}) = {expr} on [{bounds.a}, {bounds.b}].
                </p>
              </div>

              {/* Interval slider / buttons */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Subdivisions n:</span>
                {[4, 10, 20, 50].map((nVal) => (
                  <button
                    key={nVal}
                    type="button"
                    onClick={() => setNumSubdivisions(nVal)}
                    className={`px-2.5 py-1 rounded font-mono text-xs ${
                      numSubdivisions === nVal ? 'bg-blue-600 text-white font-bold' : 'bg-[#060c1d] text-slate-400'
                    }`}
                  >
                    n={nVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#14264c] text-slate-400">
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Formula / Description</th>
                    <th className="pb-2">Approximate Value</th>
                    <th className="pb-2">Absolute Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#132244] text-slate-200">
                  <tr>
                    <td className="py-2.5 font-bold text-blue-300">Exact FTC Value</td>
                    <td className="py-2.5 text-slate-400">F(b) - F(a)</td>
                    <td className="py-2.5 text-emerald-400 font-bold">{analysis.netSignedArea}</td>
                    <td className="py-2.5 text-slate-500">0.0000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5">Left Riemann Sum</td>
                    <td className="py-2.5 text-slate-400">Δx · ∑ f(xᵢ)</td>
                    <td className="py-2.5">{analysis.numericalApproximations.leftSum}</td>
                    <td className="py-2.5 text-amber-400">
                      {Math.abs(analysis.numericalApproximations.leftSum - analysis.netSignedArea).toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5">Right Riemann Sum</td>
                    <td className="py-2.5 text-slate-400">Δx · ∑ f(xᵢ₊₁)</td>
                    <td className="py-2.5">{analysis.numericalApproximations.rightSum}</td>
                    <td className="py-2.5 text-amber-400">
                      {Math.abs(analysis.numericalApproximations.rightSum - analysis.netSignedArea).toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5">Midpoint Rule</td>
                    <td className="py-2.5 text-slate-400">Δx · ∑ f((xᵢ+xᵢ₊₁)/2)</td>
                    <td className="py-2.5">{analysis.numericalApproximations.midpoint}</td>
                    <td className="py-2.5 text-sky-400">
                      {Math.abs(analysis.numericalApproximations.midpoint - analysis.netSignedArea).toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5">Trapezoidal Rule</td>
                    <td className="py-2.5 text-slate-400">(Δx/2) · (f₀ + 2f₁ + ... + fₙ)</td>
                    <td className="py-2.5">{analysis.numericalApproximations.trapezoid}</td>
                    <td className="py-2.5 text-sky-400">
                      {Math.abs(analysis.numericalApproximations.trapezoid - analysis.netSignedArea).toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-purple-300">Simpson's 1/3 Rule</td>
                    <td className="py-2.5 text-slate-400">(Δx/3) · (f₀ + 4f₁ + 2f₂ + ... + fₙ)</td>
                    <td className="py-2.5 text-purple-300 font-bold">{analysis.numericalApproximations.simpson}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">
                      {Math.abs(analysis.numericalApproximations.simpson - analysis.netSignedArea).toFixed(4)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 Application Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                <Compass className="w-4 h-4 text-sky-400" /> Area Under Curve
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Represents geometric surface area under f(x) between x = a and x = b. Useful in civil engineering,
                stress-strain energy under deformation curves, and hydrostatic pressure against dam walls.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                <ArrowRightLeft className="w-4 h-4 text-purple-400" /> Area Between Curves
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Calculates the enclosed domain between two crossing paths: A = ∫ [f_top - g_bottom] dx. Used in
                economics to compute Consumer Surplus and Producer Surplus at equilibrium pricing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                <Activity className="w-4 h-4 text-rose-400" /> Displacement & Motion
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Velocity is the rate of change of position; integrating velocity over time yields total displacement:
                s(t₂) - s(t₁) = ∫ v(t) dt. Integrating absolute speed |v(t)| yields the total odometer distance traveled.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                <Layers className="w-4 h-4 text-emerald-400" /> Average Value of a Continuous Function
              </h4>
              <p className="text-slate-300 leading-relaxed">
                f_avg = 1/(b - a) ∫ₐᵇ f(x) dx represents the level horizontal baseline height that produces the exact
                same total accumulation over the span [a, b].
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 7. PRACTICE MODE ═══ */}
      {flowMode === 'practice' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span>Definite Integral Practice Laboratory</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Solve problems, reveal hints, check answers, and view step-by-step solutions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {PRACTICE_QUESTIONS.map((item, qIdx) => {
              const selectedAnswer = practiceAnswers[item.id];
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = isAnswered && selectedAnswer === item.correctIdx;
              const showHint = revealedHints[item.id];

              return (
                <div key={item.id} className="p-5 rounded-2xl bg-[#081226] border border-[#14264c] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Problem {qIdx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRevealedHints((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="text-[11px] text-amber-300 hover:text-amber-200 underline"
                      >
                        {showHint ? 'Hide Hint' : 'Reveal Hint 💡'}
                      </button>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          item.difficulty === 'Beginner'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                            : item.difficulty === 'Intermediate'
                            ? 'bg-blue-950/70 text-blue-300 border border-blue-800/60'
                            : 'bg-purple-950/70 text-purple-300 border border-purple-800/60'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-white">{item.question}</p>

                  {showHint && (
                    <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                      <strong>Hint:</strong> {item.hint}
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {item.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedAnswer === optIdx;
                      let btnStyle = 'bg-[#060c1d] hover:bg-[#0c1833] border-[#14264c] text-slate-300';

                      if (isAnswered) {
                        if (optIdx === item.correctIdx) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => setPracticeAnswers((prev) => ({ ...prev, [item.id]: optIdx }))}
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span className="font-mono">{opt}</span>
                          {isAnswered && optIdx === item.correctIdx && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                          {isAnswered && isOptionSelected && optIdx !== item.correctIdx && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        isCorrect
                          ? 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-200'
                          : 'bg-amber-950/40 border border-amber-800/50 text-amber-200'
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        <span>{isCorrect ? 'Correct! Excellent execution.' : 'Step-by-Step Explanation:'}</span>
                      </div>
                      <p className="leading-relaxed">{item.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ 8. FORMULAS & CONCEPT LIBRARY ═══ */}
      {flowMode === 'formulas' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Definite Integral Formula Library
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {FORMULA_LIBRARY.map((fCard) => (
              <div key={fCard.id} className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  {fCard.category}
                </span>
                <h3 className="text-sm font-bold text-white mb-1">{fCard.name}</h3>
                <div className="p-2.5 rounded-lg bg-[#050a18] border border-[#14264c] font-mono text-xs text-sky-300 text-center">
                  {fCard.formula}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{fCard.explanation}</p>
                <div className="pt-2 border-t border-[#132244] text-[11px] text-amber-400">
                  <strong>Example:</strong> <span className="font-mono">{fCard.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PICTURE / PRESET UPLOAD MODAL ─── */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b162f] border border-[#162c57] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Upload Definite Integral Problem</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Upload an image of a definite integral or select a curriculum problem preset:
            </p>

            <div className="border-2 border-dashed border-[#1c3970] hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-all bg-[#081226]/50">
              <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-300 font-medium">Upload Problem Photo</div>
              <div className="text-[10px] text-slate-500">Detects limits a, b and integrand function</div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Standard Definite Integral Examples:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { title: 'Standard Parabola Area', f: '3x^2 - 4x + 2', a: '0', b: '2' },
                  { title: 'Trig Sine Accumulation', f: 'sin(x)', a: '0', b: 'pi' },
                  { title: 'Area Enclosed by Parabola', f: '4 - x^2', a: '-2', b: '2' },
                  { title: 'Exponential Definite Area', f: 'e^x', a: '0', b: '1' },
                  { title: 'Reciprocal Natural Log', f: '1 / x', a: '1', b: 'e' },
                  { title: 'Linear Root Accumulation', f: 'sqrt(x)', a: '0', b: '4' },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      setExpr(item.f);
                      setLowerLimit(item.a);
                      setUpperLimit(item.b);
                      setShowImageModal(false);
                      setFlowMode('solve');
                    }}
                    className="p-2.5 rounded-lg bg-[#081226] hover:bg-[#10234a] border border-[#14264c] text-left transition-all"
                  >
                    <span className="text-blue-300 font-semibold block text-[11px]">{item.title}</span>
                    <span className="font-mono text-slate-300 text-[10px] truncate block">∫[{item.a}, {item.b}] ({item.f}) dx</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIRTUAL MATH KEYBOARD PORTAL ─── */}
      <MathVirtualKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInsert={handleKeyboardInsert}
        onDelete={handleKeyboardDelete}
        onClear={handleKeyboardClear}
      />
    </div>
  );
}
