import { useState, useMemo, useRef } from 'react';
import * as math from 'mathjs';
import {
  Search,
  Sparkles,
  BookOpen,
  LineChart,
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
  ArrowRightLeft,
  Divide,
  Infinity as InfinityIcon,
  PieChart,
  Compass,
  FileText
} from 'lucide-react';
import MathVirtualKeyboard from './MathVirtualKeyboard';

interface IntegrationAnalysisResult {
  success: boolean;
  technique: string;
  whyTechnique: string;
  formulaLatex: string;
  antiderivative: string;
  definiteResult: number | null;
  ftcSteps: string[];
  activeFormulaIds: string[];
  a?: number;
  b?: number;
  error?: string;
}

type TopicId =
  | 'fundamentals'
  | 'basic_rules'
  | 'u_sub'
  | 'by_parts'
  | 'partial_fractions'
  | 'trig_integrals'
  | 'trig_sub'
  | 'improper'
  | 'definite'
  | 'applications'
  | 'diff_eq';

type FlowMode = 'learn' | 'formula' | 'explore' | 'practice' | 'solve';

interface TopicMeta {
  id: TopicId;
  title: string;
  shortDesc: string;
  icon: any;
  tag: string;
}

const TOPICS: TopicMeta[] = [
  {
    id: 'fundamentals',
    title: '∫ Fundamentals',
    shortDesc: 'Antiderivatives, reverse differentiation, and constant + C.',
    icon: FileText,
    tag: 'Core Concept',
  },
  {
    id: 'basic_rules',
    title: '📐 Basic Rules',
    shortDesc: 'Power rule, constant multiple, sum & standard integrals.',
    icon: Layers,
    tag: 'Standard Formulas',
  },
  {
    id: 'u_sub',
    title: '🔄 Substitution',
    shortDesc: 'U-substitution: transforming composite integrals ∫f(g(x))g’(x)dx.',
    icon: ArrowRightLeft,
    tag: 'Chain Rule Reverse',
  },
  {
    id: 'by_parts',
    title: '🔀 By Parts',
    shortDesc: 'Product integration via ∫u dv = uv − ∫v du and LIATE rule.',
    icon: Compass,
    tag: 'Product Rule Reverse',
  },
  {
    id: 'partial_fractions',
    title: '➗ Partial Fractions',
    shortDesc: 'Decomposing rational fractions P(x)/Q(x) into log terms.',
    icon: Divide,
    tag: 'Algebraic Fractions',
  },
  {
    id: 'trig_integrals',
    title: '🔢 Trigonometric',
    shortDesc: 'Integrating powers of sin, cos, tan, sec via identities.',
    icon: Layers,
    tag: 'Trig Identities',
  },
  {
    id: 'trig_sub',
    title: '🔺 Trig Substitution',
    shortDesc: 'Radical forms √(a²−x²), √(x²+a²) via geometric triangles.',
    icon: Compass,
    tag: 'Radical Simplification',
  },
  {
    id: 'improper',
    title: '∞ Improper Integrals',
    shortDesc: 'Unbounded limits (±∞) and vertical asymptote integrals.',
    icon: InfinityIcon,
    tag: 'Limits & Convergence',
  },
  {
    id: 'definite',
    title: '📊 Definite Integrals',
    shortDesc: 'Evaluating net change via the Fundamental Theorem of Calculus.',
    icon: LineChart,
    tag: 'Bounds & FTC',
  },
  {
    id: 'applications',
    title: '📈 Applications',
    shortDesc: 'Area under curves, area between curves, volumes & work.',
    icon: PieChart,
    tag: 'Area & Volume',
  },
  {
    id: 'diff_eq',
    title: '🧮 Differential Eqs',
    shortDesc: 'Separable first-order differential equations dy/dx = f(x)g(y).',
    icon: Sparkles,
    tag: 'Differential Systems',
  },
];

interface PracticeItem {
  id: string;
  topicId: TopicId;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  question: string;
  hint: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const PRACTICE_QUESTIONS: PracticeItem[] = [
  {
    id: 'pr1',
    topicId: 'basic_rules',
    difficulty: 'Basic',
    question: 'Evaluate the indefinite integral: ∫ (4x³ - 6x + 5) dx',
    hint: 'Use the Power Rule ∫ xⁿ dx = xⁿ⁺¹/(n+1) on each term separately.',
    options: ['x⁴ - 3x² + 5x + C', '12x² - 6 + C', 'x⁴ - 6x² + 5x + C', '4x⁴ - 3x² + C'],
    correctIdx: 0,
    explanation: 'Integrating term-by-term: 4(x⁴/4) - 6(x²/2) + 5x + C = x⁴ - 3x² + 5x + C.',
  },
  {
    id: 'pr2',
    topicId: 'basic_rules',
    difficulty: 'Basic',
    question: 'What is ∫ (1 / x) dx for x > 0?',
    hint: 'Remember that the derivative of ln(x) is 1/x.',
    options: ['-1/x² + C', 'ln|x| + C', 'x⁰ + C', 'eˣ + C'],
    correctIdx: 1,
    explanation: 'By standard rule, ∫ (1/x) dx = ln|x| + C because d/dx[ln|x|] = 1/x.',
  },
  {
    id: 'pr3',
    topicId: 'u_sub',
    difficulty: 'Intermediate',
    question: 'Evaluate ∫ 2x · cos(x²) dx using u-substitution.',
    hint: 'Let u = x², so that du = 2x dx.',
    options: ['sin(x²) + C', '-sin(x²) + C', '2sin(x²) + C', 'x²·sin(x²) + C'],
    correctIdx: 0,
    explanation: 'With u = x², du = 2x dx. The integral becomes ∫ cos(u) du = sin(u) + C = sin(x²) + C.',
  },
  {
    id: 'pr4',
    topicId: 'by_parts',
    difficulty: 'Intermediate',
    question: 'Using Integration by Parts (∫ u dv = uv - ∫ v du), what is ∫ x · eˣ dx?',
    hint: 'Choose u = x (algebraic) and dv = eˣ dx (exponential) according to LIATE.',
    options: ['x eˣ + eˣ + C', 'x eˣ - eˣ + C', '(x² / 2) eˣ + C', 'eˣ - x + C'],
    correctIdx: 1,
    explanation: 'Let u = x ⇒ du = dx, and dv = eˣ dx ⇒ v = eˣ. Then ∫ u dv = x eˣ - ∫ eˣ dx = x eˣ - eˣ + C = eˣ(x - 1) + C.',
  },
  {
    id: 'pr5',
    topicId: 'definite',
    difficulty: 'Basic',
    question: 'Evaluate the definite integral: ∫₀² (3x²) dx',
    hint: 'Find the antiderivative F(x) = x³, then calculate F(2) - F(0).',
    options: ['6', '8', '12', '24'],
    correctIdx: 1,
    explanation: 'Antiderivative is F(x) = x³. Applying FTC: F(2) - F(0) = 2³ - 0³ = 8.',
  },
  {
    id: 'pr6',
    topicId: 'applications',
    difficulty: 'Intermediate',
    question: 'What is the area bounded between the curve y = 4 - x² and the x-axis (from x = -2 to x = 2)?',
    hint: 'Integrate (4 - x²) dx from -2 to 2.',
    options: ['16/3', '32/3', '8', '16'],
    correctIdx: 1,
    explanation: '∫₋₂² (4 - x²) dx = [4x - x³/3]₋₂² = (8 - 8/3) - (-8 + 8/3) = 16/3 - (-16/3) = 32/3 ≈ 10.67.',
  },
  {
    id: 'pr7',
    topicId: 'partial_fractions',
    difficulty: 'Advanced',
    question: 'Decompose 1 / (x² - 1) into partial fractions.',
    hint: 'Factor denominator as (x - 1)(x + 1) and set equal to A/(x - 1) + B/(x + 1).',
    options: ['1/(2(x-1)) - 1/(2(x+1))', '1/(x-1) + 1/(x+1)', '2/(x-1) - 2/(x+1)', '1/(x² - 1)'],
    correctIdx: 0,
    explanation: '1 / ((x-1)(x+1)) = A/(x-1) + B/(x+1). Solving gives A = 1/2 and B = -1/2.',
  },
  {
    id: 'pr8',
    topicId: 'improper',
    difficulty: 'Advanced',
    question: 'Does the improper integral ∫₁^∞ (1 / x²) dx converge, and if so, to what value?',
    hint: 'Compute lim_{b → ∞} ∫₁ᵇ x⁻² dx = lim_{b → ∞} [-1/x]₁ᵇ.',
    options: ['Diverges to ∞', 'Converges to 1', 'Converges to 1/2', 'Converges to 0'],
    correctIdx: 1,
    explanation: 'lim_{b→∞} [-1/x]₁ᵇ = lim_{b→∞} (-1/b - (-1/1)) = 0 + 1 = 1. The integral converges to 1.',
  },
];

interface FormulaCard {
  id: string;
  name: string;
  category: string;
  formula: string;
  meaning: string;
  whenToUse: string;
  example: string;
}

const FORMULA_LIBRARY: FormulaCard[] = [
  {
    id: 'power_rule',
    name: 'Power Rule',
    category: 'Basic Rules',
    formula: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\ne -1)',
    meaning: 'Add 1 to the exponent and divide by the new exponent.',
    whenToUse: 'For any variable raised to a constant numerical power (except n = -1).',
    example: '\\int x^4 \\, dx = \\frac{x^5}{5} + C',
  },
  {
    id: 'constant_rule',
    name: 'Constant Rule',
    category: 'Basic Rules',
    formula: '\\int k \\, dx = kx + C',
    meaning: 'The integral of a constant is the constant multiplied by the variable.',
    whenToUse: 'When integrating any constant real number.',
    example: '\\int 7 \\, dx = 7x + C',
  },
  {
    id: 'reciprocal_rule',
    name: 'Reciprocal / Log Rule',
    category: 'Basic Rules',
    formula: '\\int \\frac{1}{x} \\, dx = \\ln|x| + C',
    meaning: 'The special case where power rule exponent is -1.',
    whenToUse: 'For 1/x or expressions reducible to du/u.',
    example: '\\int \\frac{3}{x} \\, dx = 3\\ln|x| + C',
  },
  {
    id: 'exp_rule',
    name: 'Natural Exponential',
    category: 'Exponentials',
    formula: '\\int e^{kx} \\, dx = \\frac{1}{k}e^{kx} + C',
    meaning: 'Exponential functions reproduce themselves upon integration, scaled by 1/k.',
    whenToUse: 'When integrating e raised to a linear argument.',
    example: '\\int e^{3x} \\, dx = \\frac{1}{3}e^{3x} + C',
  },
  {
    id: 'sin_rule',
    name: 'Sine Integral',
    category: 'Trigonometric',
    formula: '\\int \\sin(kx) \\, dx = -\\frac{1}{k}\\cos(kx) + C',
    meaning: 'The antiderivative of sine is negative cosine.',
    whenToUse: 'Standard sine waves or periodic motion equations.',
    example: '\\int \\sin(2x) \\, dx = -\\frac{1}{2}\\cos(2x) + C',
  },
  {
    id: 'cos_rule',
    name: 'Cosine Integral',
    category: 'Trigonometric',
    formula: '\\int \\cos(kx) \\, dx = \\frac{1}{k}\\sin(kx) + C',
    meaning: 'The antiderivative of cosine is positive sine.',
    whenToUse: 'Standard cosine terms.',
    example: '\\int \\cos(4x) \\, dx = \\frac{1}{4}\\sin(4x) + C',
  },
  {
    id: 'sec2_rule',
    name: 'Secant Squared',
    category: 'Trigonometric',
    formula: '\\int \\sec^2(x) \\, dx = \\tan(x) + C',
    meaning: 'Direct antiderivative of tangent derivative.',
    whenToUse: 'Trigonometric integrals involving sec²(x).',
    example: '\\int \\sec^2(x) \\, dx = \\tan(x) + C',
  },
  {
    id: 'by_parts_rule',
    name: 'Integration by Parts',
    category: 'Advanced Methods',
    formula: '\\int u \\, dv = u v - \\int v \\, du',
    meaning: 'Product rule inverted for integration; swap difficult integral for easier one.',
    whenToUse: 'Products of algebraic, logarithmic, exponential, and trig functions.',
    example: '\\int x e^x \\, dx = x e^x - e^x + C',
  },
  {
    id: 'atan_rule',
    name: 'Inverse Tangent Form',
    category: 'Inverse Trig',
    formula: '\\int \\frac{1}{a^2 + x^2} \\, dx = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) + C',
    meaning: 'Produces arctan without any square roots in denominator.',
    whenToUse: 'Sum of squares in the denominator.',
    example: '\\int \\frac{1}{9 + x^2} \\, dx = \\frac{1}{3}\\arctan(x/3) + C',
  },
];

export default function IntegrationCalculator() {
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('basic_rules');
  const [flowMode, setFlowMode] = useState<FlowMode>('solve');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Inputs
  const [expr, setExpr] = useState<string>('3x^2 + 4x - 5');
  const [isDefinite, setIsDefinite] = useState<boolean>(false);
  const [lowerLimit, setLowerLimit] = useState<string>('0');
  const [upperLimit, setUpperLimit] = useState<string>('2');
  const [activeInput, setActiveInput] = useState<'expr' | 'lower' | 'upper'>('expr');

  // UI States
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [graphZoom, setGraphZoom] = useState<number>(5);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});

  const exprInputRef = useRef<HTMLInputElement>(null);
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

  // Symbolic and Numerical Integration Engine
  const analysis: IntegrationAnalysisResult = useMemo(() => {
    if (!cleanExpr) {
      return {
        success: false,
        technique: 'Standard Integration',
        whyTechnique: 'Please enter a valid mathematical expression.',
        formulaLatex: '\\int f(x) dx',
        antiderivative: '',
        definiteResult: null as number | null,
        ftcSteps: [] as string[],
        activeFormulaIds: [] as string[],
        error: 'Please enter a valid expression.',
      };
    }

    try {
      // Dynamic Technique Detection
      let technique = 'Direct / Polynomial Integration';
      let whyTechnique =
        'The integrand is a polynomial or linear combination of powers. We integrate term by term using the Power Rule.';
      let formulaLatex = '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C';
      const activeFormulaIds: string[] = [];

      const exprLower = cleanExpr.toLowerCase();
      const hasProduct = exprLower.includes('*');
      const hasFraction = exprLower.includes('/');
      const hasExp = exprLower.includes('e^') || exprLower.includes('exp');
      const hasLn = exprLower.includes('ln') || exprLower.includes('log');
      const hasSin = exprLower.includes('sin');
      const hasCos = exprLower.includes('cos');
      const hasTan = exprLower.includes('tan') || exprLower.includes('sec');
      const hasSqrt = exprLower.includes('sqrt') || exprLower.includes('^0.5');

      // Check By Parts
      if ((hasLn || hasExp || hasSin || hasCos) && hasProduct && !hasFraction) {
        technique = 'Integration by Parts';
        whyTechnique =
          'The integrand is a product of two distinct families of functions (algebraic and transcendental). The product rule of differentiation in reverse (LIATE rule) decomposes this product.';
        formulaLatex = '\\int u \\, dv = uv - \\int v \\, du';
        activeFormulaIds.push('by_parts_rule');
      }
      // Check Partial Fractions
      else if (hasFraction && !hasExp && !hasSin && !hasCos && !hasSqrt) {
        technique = 'Partial Fractions Decomposition';
        whyTechnique =
          'The integrand is a rational function P(x)/Q(x) where the denominator factors into linear or irreducible quadratic terms.';
        formulaLatex = '\\int \\frac{P(x)}{Q(x)} \\, dx = \\int \\frac{A}{x - r_1} \\, dx + \\int \\frac{B}{x - r_2} \\, dx';
        activeFormulaIds.push('reciprocal_rule');
      }
      // Check Substitution
      else if (
        (hasExp && hasProduct) ||
        (hasSin && hasCos) ||
        (hasSqrt && hasProduct) ||
        (hasFraction && /\d*\*?x\s*\//.test(cleanExpr))
      ) {
        technique = 'U-Substitution';
        whyTechnique =
          'The integrand contains an inner composite function g(x) alongside its derivative factor g’(x), allowing direct substitution u = g(x) and du = g’(x)dx.';
        formulaLatex = '\\int f(g(x)) \\, g\'(x) \\, dx = \\int f(u) \\, du';
      }
      // Check Trig Integrals
      else if (hasSin || hasCos || hasTan) {
        technique = 'Trigonometric Integration';
        whyTechnique =
          'The expression consists of trigonometric powers and identities that can be integrated using standard periodic formulas.';
        formulaLatex = '\\int \\sin(x) \\, dx = -\\cos(x) + C, \\quad \\int \\cos(x) \\, dx = \\sin(x) + C';
        if (hasSin) activeFormulaIds.push('sin_rule');
        if (hasCos) activeFormulaIds.push('cos_rule');
        if (hasTan) activeFormulaIds.push('sec2_rule');
      }
      // Check Exponential / Log
      else if (hasExp) {
        technique = 'Exponential Integration';
        whyTechnique = 'The integrand features an exponential term which reproduces itself under integration.';
        formulaLatex = '\\int e^{kx} \\, dx = \\frac{1}{k}e^{kx} + C';
        activeFormulaIds.push('exp_rule');
      }
      else {
        activeFormulaIds.push('power_rule', 'constant_rule');
      }

      // Analytical Antiderivative Pattern Matching & Construction
      let antiderivative = '';
      const trimmed = cleanExpr.replace(/\s+/g, '');

      // Common standard symbolic integrations
      if (/^x\^(\d+)$/.test(trimmed)) {
        const n = parseInt(trimmed.match(/^x\^(\d+)$/)![1]);
        antiderivative = `(x^${n + 1}) / ${n + 1}`;
      } else if (/^(\d+)\*x\^(\d+)$/.test(trimmed)) {
        const m = trimmed.match(/^(\d+)\*x\^(\d+)$/)!;
        const c = parseInt(m[1]);
        const n = parseInt(m[2]);
        const n1 = n + 1;
        antiderivative = `${c} * (x^${n1}) / ${n1}`;
      } else if (trimmed === 'x') {
        antiderivative = '(x^2) / 2';
      } else if (trimmed === '1/x' || trimmed === '1/(x)') {
        antiderivative = 'ln(|x|)';
      } else if (trimmed === 'e^x' || trimmed === 'exp(x)') {
        antiderivative = 'e^x';
      } else if (trimmed === 'sin(x)') {
        antiderivative = '-cos(x)';
      } else if (trimmed === 'cos(x)') {
        antiderivative = 'sin(x)';
      } else if (trimmed === 'sec(x)^2' || trimmed === 'sec^2(x)') {
        antiderivative = 'tan(x)';
      } else if (trimmed === '1/(1+x^2)' || trimmed === '1/(x^2+1)') {
        antiderivative = 'arctan(x)';
      } else if (trimmed === 'x*e^x' || trimmed === 'x*exp(x)') {
        antiderivative = 'e^x * (x - 1)';
      } else if (trimmed === 'x*sin(x)') {
        antiderivative = 'sin(x) - x*cos(x)';
      } else if (trimmed === 'x*cos(x)') {
        antiderivative = 'cos(x) + x*sin(x)';
      } else if (trimmed === 'ln(x)') {
        antiderivative = 'x*ln(x) - x';
      } else {
        // Polynomial term-by-term symbolic integrator
        try {
          const terms = cleanExpr.split(/(?=[+-])/);
          const integratedTerms = terms.map((t) => {
            const tr = t.trim();
            if (!tr) return '';
            const sign = tr.startsWith('-') ? '-' : tr.startsWith('+') ? '+' : '';
            const core = tr.replace(/^[+-]/, '').trim();

            // Match constant: e.g. 5
            if (/^\d+(\.\d+)?$/.test(core)) {
              return `${sign} ${core}*${variable}`;
            }
            // Match c*x^n
            const powMatch = core.match(/^(\d+)?\*?([a-zA-Z])\^(\d+)$/);
            if (powMatch) {
              const c = powMatch[1] ? parseFloat(powMatch[1]) : 1;
              const n = parseFloat(powMatch[3]);
              const n1 = n + 1;
              const coeff = c / n1;
              const cleanCoeff = Math.abs(coeff - Math.round(coeff)) < 1e-5 ? Math.round(coeff) : coeff.toFixed(2);
              return `${sign} ${cleanCoeff === 1 ? '' : cleanCoeff}*${variable}^${n1}`;
            }
            // Match c*x
            const linMatch = core.match(/^(\d+)?\*?([a-zA-Z])$/);
            if (linMatch) {
              const c = linMatch[1] ? parseFloat(linMatch[1]) : 1;
              const coeff = c / 2;
              const cleanCoeff = Math.abs(coeff - Math.round(coeff)) < 1e-5 ? Math.round(coeff) : coeff.toFixed(2);
              return `${sign} ${cleanCoeff === 1 ? '' : cleanCoeff}*${variable}^2`;
            }
            // Match sin
            if (core.includes('sin')) return `${sign === '-' ? '+' : '-'} cos(${variable})`;
            // Match cos
            if (core.includes('cos')) return `${sign} sin(${variable})`;
            // Match exp
            if (core.includes('e^') || core.includes('exp')) return `${sign} e^${variable}`;

            return `${sign} ∫(${core})d${variable}`;
          });

          antiderivative = integratedTerms.join(' ').replace(/\s+/g, ' ').trim();
          if (antiderivative.startsWith('+')) antiderivative = antiderivative.slice(1).trim();
        } catch {
          antiderivative = `F(${variable})`;
        }
      }

      // Definite Integration & Fundamental Theorem of Calculus (FTC)
      let definiteResult: number | null = null;
      const ftcSteps: string[] = [];

      let a = 0;
      let b = 2;
      if (lowerLimit.trim() === 'pi' || lowerLimit.trim() === 'π') a = Math.PI;
      else if (!isNaN(parseFloat(lowerLimit))) a = parseFloat(lowerLimit);

      if (upperLimit.trim() === 'pi' || upperLimit.trim() === 'π') b = Math.PI;
      else if (!isNaN(parseFloat(upperLimit))) b = parseFloat(upperLimit);

      // Numerical quadrature via Simpson's rule (1000 intervals)
      const compiledF = math.compile(cleanExpr);
      const n = 1000;
      const h = (b - a) / n;
      let simpsonSum = 0;

      for (let i = 0; i <= n; i++) {
        const xVal = a + i * h;
        let fx = 0;
        try {
          const evalVal = compiledF.evaluate({ [variable]: xVal });
          fx = isFinite(evalVal) && !isNaN(evalVal) ? Number(evalVal) : 0;
        } catch {
          fx = 0;
        }
        const coeff = i === 0 || i === n ? 1 : i % 2 === 0 ? 2 : 4;
        simpsonSum += coeff * fx;
      }
      definiteResult = Number(((h / 3) * simpsonSum).toFixed(4));

      // Build FTC steps
      ftcSteps.push(`Step 1: Determine the general antiderivative F(${variable}) = ${antiderivative}`);
      ftcSteps.push(
        `Step 2: Apply the Fundamental Theorem of Calculus: ∫ₐᵇ f(${variable})d${variable} = [F(${variable})]ₐᵇ = F(${b}) - F(${a})`
      );

      try {
        let cleanAnti = antiderivative.replace(/∫\([^)]+\)d[a-zA-Z]/g, '0');
        if (!cleanAnti.trim()) cleanAnti = '0';
        const compiledAnti = math.compile(cleanAnti);
        const fb = Number(compiledAnti.evaluate({ [variable]: b }));
        const fa = Number(compiledAnti.evaluate({ [variable]: a }));
        ftcSteps.push(`Step 3: Evaluate at upper limit ${variable} = ${b}: F(${b}) ≈ ${fb.toFixed(3)}`);
        ftcSteps.push(`Step 4: Evaluate at lower limit ${variable} = ${a}: F(${a}) ≈ ${fa.toFixed(3)}`);
        ftcSteps.push(`Step 5: Subtract lower from upper: F(${b}) - F(${a}) = ${fb.toFixed(3)} - (${fa.toFixed(3)}) = ${definiteResult}`);
      } catch {
        ftcSteps.push(`Step 3: Evaluate [F(${b}) - F(${a})] to obtain net accumulation.`);
        ftcSteps.push(`Step 4: Net area = ${definiteResult}`);
      }

      return {
        success: true,
        technique,
        whyTechnique,
        formulaLatex,
        antiderivative,
        definiteResult,
        ftcSteps,
        activeFormulaIds,
        a,
        b,
        error: undefined,
      };
    } catch (e: any) {
      return {
        success: false,
        technique: 'Direct Integration',
        whyTechnique: 'Error parsing mathematical syntax.',
        formulaLatex: '\\int f(x) dx',
        antiderivative: '',
        definiteResult: null,
        ftcSteps: [],
        activeFormulaIds: [],
        error: e.message || 'Error compiling integral.',
      };
    }
  }, [cleanExpr, variable, lowerLimit, upperLimit]);

  // SVG Coordinate Generation with Area Shading
  const graphData = useMemo(() => {
    if (!analysis.success) return null;

    try {
      const aVal = analysis.a ?? 0;
      const bVal = analysis.b ?? 2;
      const center = (aVal + bVal) / 2;
      const span = Math.max(graphZoom, Math.abs(bVal - aVal) + 2);
      const minX = center - span;
      const maxX = center + span;
      const step = (maxX - minX) / 140;

      const compiledF = math.compile(cleanExpr);
      const fPoints: { x: number; y: number }[] = [];
      const shadedPoints: { x: number; y: number }[] = [];

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

            // If within [a, b], collect points for area polygon
            if (x >= aVal && x <= bVal) {
              shadedPoints.push({ x, y: clampedY });
            }
          }
        } catch {
          // ignore domain discontinuity
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

      return { minX, maxX, minY, maxY, fPoints, shadedPoints, aVal, bVal };
    } catch {
      return null;
    }
  }, [cleanExpr, variable, analysis, graphZoom]);

  // Virtual keyboard insertions
  const handleKeyboardInsert = (char: string) => {
    if (activeInput === 'expr') {
      setExpr((prev) => prev + char);
      if (exprInputRef.current) exprInputRef.current.focus();
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
    else if (activeInput === 'lower') setLowerLimit((prev) => prev.slice(0, -1));
    else setUpperLimit((prev) => prev.slice(0, -1));
  };

  const handleKeyboardClear = () => {
    if (activeInput === 'expr') setExpr('');
    else if (activeInput === 'lower') setLowerLimit('');
    else setUpperLimit('');
  };

  // Filtered topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return TOPICS;
    const q = searchQuery.toLowerCase();
    return TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const currentTopicMeta = TOPICS.find((t) => t.id === selectedTopic) || TOPICS[0];

  return (
    <div className="space-y-6 font-sans">
      {/* ─── HEADER & MODERN SEARCH DASHBOARD ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#14264c]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Calculus · Integral Calculus
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Exact & FTC Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white mt-1.5 tracking-tight">
            INTEGRATION ENGINE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-normal">
            Learn, visualize, and solve integrals—from fundamental concepts to advanced techniques.
          </p>
        </div>

        {/* Quick Access Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integration topics..."
            className="w-full bg-[#071024] border border-[#162c57] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* ─── 1. EASY-TO-ACCESS TOPIC DASHBOARD (CLICKABLE TILES) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {filteredTopics.map((top) => {
          const isSelected = selectedTopic === top.id;
          const IconComp = top.icon;

          return (
            <button
              key={top.id}
              type="button"
              onClick={() => setSelectedTopic(top.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#10244e] to-[#0c1a38] border-blue-400 shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                  : 'bg-[#081226] hover:bg-[#0d1e40] border-[#132244] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg bg-[#060c1d] border border-[#14264c] ${
                    isSelected ? 'text-blue-400 border-blue-500/50' : 'text-slate-400'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                )}
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 leading-tight">
                  {top.tag}
                </div>
                <div
                  className={`text-xs font-semibold mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {top.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── 2. 5-STEP WORKSPACE NAV: LEARN | FORMULA | EXPLORE | PRACTICE | SOLVE ─── */}
      <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2 pl-3">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs font-bold text-white tracking-wide">
            {currentTopicMeta.title}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            — {currentTopicMeta.shortDesc}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#060c1d] p-1 rounded-xl border border-[#14264c]">
          {[
            { id: 'learn', label: 'Learn' },
            { id: 'formula', label: 'Formula' },
            { id: 'explore', label: 'Explore (Graph)' },
            { id: 'practice', label: 'Practice' },
            { id: 'solve', label: 'Solve Your Own' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setFlowMode(mode.id as FlowMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                flowMode === mode.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1833]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── WORKSPACE CONTENT ─── */}

      {/* ═══ MODE A: LEARN ═══ */}
      {flowMode === 'learn' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Fundamentals & Conceptual Guide: {currentTopicMeta.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h3 className="font-bold text-blue-300 text-sm">Integration as Reverse Differentiation</h3>
              <p>
                If differentiation asks: <em>"Given a position s(t), what is the velocity v(t) = s’(t)?"</em>, then
                integration asks the reverse: <em>"Given a velocity v(t), what was the position s(t)?"</em>
              </p>
              <div className="p-2.5 rounded bg-[#060c1d] font-mono text-xs text-sky-300 border border-[#132244]">
                {"d/dx[F(x)] = f(x) ⟺ ∫ f(x) dx = F(x) + C"}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h3 className="font-bold text-amber-300 text-sm">Why the Constant of Integration (+ C)?</h3>
              <p>
                When taking the derivative of any constant number (e.g. 5, -12, π), the result is zero. Because of this,
                functions like x² + 1, x² + 10, and x² - 50 all share the exact same derivative 2x. Thus, an indefinite
                integral must always include an arbitrary constant <strong>+ C</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h3 className="font-bold text-emerald-300 text-sm">The Fundamental Theorem of Calculus (FTC)</h3>
              <p>
                The FTC builds the bridge between static geometry (area under a curve) and dynamic calculus (antiderivatives).
                To find the net area between x = a and x = b, evaluate the antiderivative at the upper limit and subtract the lower:
              </p>
              <div className="p-2.5 rounded bg-[#060c1d] font-mono text-xs text-emerald-300 border border-[#132244]">
                {"∫ₐᵇ f(x) dx = F(b) - F(a)"}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h3 className="font-bold text-purple-300 text-sm">Definite vs. Indefinite Integrals</h3>
              <p>
                <strong>Indefinite Integrals (∫ f(x) dx):</strong> Result in a family of functions F(x) + C.
                <br />
                <strong>Definite Integrals (∫ₐᵇ f(x) dx):</strong> Include upper and lower boundaries and evaluate to a single real number representing net signed accumulation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODE B: FORMULA LIBRARY ═══ */}
      {flowMode === 'formula' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Integration Formula Library
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Formulas active in your current expression are automatically highlighted.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {FORMULA_LIBRARY.map((fCard) => {
              const isActive = analysis.activeFormulaIds.includes(fCard.id);

              return (
                <div
                  key={fCard.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#0c1f46] border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500/40'
                      : 'bg-[#081226] border-[#14264c]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      {fCard.category}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-600 text-white font-semibold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Active in Expression
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{fCard.name}</h3>
                  <div className="p-2.5 rounded-lg bg-[#050a18] border border-[#14264c] font-mono text-xs text-sky-300 text-center mb-2">
                    {fCard.formula}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">{fCard.meaning}</p>
                  <div className="pt-2 border-t border-[#132244] text-[11px] text-amber-400">
                    <strong>Example:</strong> <span className="font-mono">{fCard.example}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ MODE C: EXPLORE (GRAPH VISUALIZER) ═══ */}
      {flowMode === 'explore' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-sky-400" />
                <span>Visual Area Explorer: ∫ f({variable}) d{variable}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing the net signed area shaded beneath f({variable}) = {expr} between boundaries [{analysis.a}, {analysis.b}].
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

          {/* SVG Canvas with Shaded Area */}
          <div className="w-full h-72 sm:h-80 bg-[#060c1d] rounded-xl border border-[#132244] overflow-hidden relative flex items-center justify-center select-none">
            {graphData && graphData.fPoints.length > 1 ? (
              <svg viewBox="0 0 700 320" className="w-full h-full">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.08" />
                  </linearGradient>
                </defs>

                {/* Axes */}
                <line x1={0} y1={160} x2={700} y2={160} stroke="#172b52" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1={350} y1={0} x2={350} y2={320} stroke="#172b52" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Shaded Area Polygon under [a, b] */}
                {graphData.shadedPoints.length > 1 && (
                  <polygon
                    points={[
                      // Start at baseline (x = a, y = 0)
                      `${(((graphData.aVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700).toFixed(1)},160`,
                      // Follow curve points
                      ...graphData.shadedPoints.map((pt) => {
                        const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                        const sy = 320 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 320;
                        return `${sx.toFixed(1)},${sy.toFixed(1)}`;
                      }),
                      // End at baseline (x = b, y = 0)
                      `${(((graphData.bVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700).toFixed(1)},160`,
                    ].join(' ')}
                    fill="url(#areaGradient)"
                  />
                )}

                {/* Function Curve f(x) */}
                <path
                  d={graphData.fPoints
                    .map((pt, idx) => {
                      const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                      const sy = 320 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 320;
                      return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Boundary Vertical lines at x = a and x = b */}
                <line
                  x1={((graphData.aVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                  y1={0}
                  x2={((graphData.aVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                  y2={320}
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
                <line
                  x1={((graphData.bVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                  y1={0}
                  x2={((graphData.bVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                  y2={320}
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
              </svg>
            ) : (
              <div className="text-xs text-slate-500 font-mono">Generating integration plot...</div>
            )}
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-sky-400 rounded-full" />
                <span className="font-mono text-slate-300">f({variable}) = {expr}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500/40 border border-sky-400" />
                <span className="font-mono text-amber-300">
                  Area [{analysis.a}, {analysis.b}] ≈ {analysis.definiteResult}
                </span>
              </div>
            </div>
            <div>X bounds: [{graphData?.minX.toFixed(1)}, {graphData?.maxX.toFixed(1)}]</div>
          </div>
        </div>
      )}

      {/* ═══ MODE D: PRACTICE ═══ */}
      {flowMode === 'practice' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span>Integration Practice Laboratory</span>
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
                          item.difficulty === 'Basic'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
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

      {/* ═══ MODE E: SOLVE YOUR OWN (MAIN CALCULATION WORKSPACE) ═══ */}
      {flowMode === 'solve' && (
        <div className="space-y-6">
          {/* Main Input Control Center */}
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#132244]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDefinite(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !isDefinite
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white bg-[#071126]'
                  }`}
                >
                  Indefinite Integral ∫ f({variable}) d{variable}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDefinite(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isDefinite
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white bg-[#071126]'
                  }`}
                >
                  Definite Integral ∫ₐᵇ f({variable}) d{variable}
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Variable: <strong className="font-mono text-blue-300">{variable}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
              {/* Function Expression */}
              <div className={isDefinite ? 'lg:col-span-6 space-y-1.5' : 'lg:col-span-8 space-y-1.5'}>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Integrand Function: f({variable}) =</span>
                  <span className="text-[11px] text-blue-400 font-normal">e.g. 3x^2 + 4x, sin(x), x*e^x</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-blue-400 font-mono text-base pointer-events-none select-none">
                    ∫
                  </span>
                  <input
                    ref={exprInputRef}
                    type="text"
                    value={expr}
                    onChange={(e) => setExpr(e.target.value)}
                    onFocus={() => setActiveInput('expr')}
                    placeholder="3x^2 + 4x - 5"
                    className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-12 py-2.5 text-sm sm:text-base font-mono text-white placeholder-slate-600 outline-none transition-all"
                  />
                  <span className="absolute right-3.5 text-blue-400 font-mono text-sm pointer-events-none select-none">
                    d{variable}
                  </span>
                </div>
              </div>

              {/* Definite Bounds */}
              {isDefinite && (
                <div className="lg:col-span-2 grid grid-cols-2 gap-2">
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
              )}

              {/* Action Toolbar */}
              <div className={isDefinite ? 'lg:col-span-4 flex items-center gap-2' : 'lg:col-span-4 flex items-center gap-2'}>
                <button
                  type="button"
                  onClick={() => setShowKeyboard((prev) => !prev)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
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
                  onClick={() => setFlowMode('explore')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#09152e] hover:bg-[#10234a] border border-[#1d3c75] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="View Area Graph"
                >
                  <LineChart className="w-4 h-4 text-sky-400" />
                  <span>Graph</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#09152e] hover:bg-[#10234a] border border-[#1d3c75] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="Upload problem image"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Picture</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#132244] text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 text-[11px] mr-1">Curated Presets:</span>
                {[
                  { label: 'Polynomial Sum', f: '3x^2 + 4x - 5', a: '0', b: '2', def: false },
                  { label: 'By Parts (x·eˣ)', f: 'x * e^x', a: '0', b: '1', def: false },
                  { label: 'Sine Wave Area', f: 'sin(x)', a: '0', b: 'pi', def: true },
                  { label: 'Parabolic Definite Area', f: '4 - x^2', a: '-2', b: '2', def: true },
                ].map((pr) => (
                  <button
                    key={pr.label}
                    type="button"
                    onClick={() => {
                      setExpr(pr.f);
                      setLowerLimit(pr.a);
                      setUpperLimit(pr.b);
                      setIsDefinite(pr.def);
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

          {/* ─── TECHNIQUE & SOLUTION SECTION ─── */}
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-7 space-y-6 shadow-xl">
            {/* Header: Technique Identification */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#14264c]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold mb-1">
                  TECHNIQUE & SOLUTION
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>Technique Selected:</span>
                  <span className="text-blue-300 bg-blue-950/70 px-3 py-0.5 rounded-lg border border-blue-800/60 text-lg sm:text-xl font-sans">
                    {analysis.technique}
                  </span>
                </h2>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 self-start sm:self-auto">
                Automatic Technique Detected ✨
              </span>
            </div>

            {/* Why this technique? */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                Why this technique?
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {analysis.whyTechnique}
              </p>
            </div>

            {/* Formula Used Display */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block">
                Formula Used
              </span>
              <div className="font-mono text-base sm:text-lg text-white bg-[#050a18] p-3 rounded-lg border border-[#132244] text-center overflow-x-auto scrollbar-hide">
                {analysis.formulaLatex}
              </div>
            </div>

            {/* Step-by-Step Derivation */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Step-by-Step Solution
              </span>

              {isDefinite ? (
                <div className="space-y-2.5">
                  {analysis.ftcSteps.map((st, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-xl bg-[#081226] border border-[#14264c] text-xs sm:text-sm text-slate-200">
                      {st}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-[#081226] border border-[#14264c] text-xs sm:text-sm text-slate-200 space-y-1">
                    <strong className="text-blue-300 block">Step 1 — Identify Integrand & Decompose</strong>
                    <p>Integrate each algebraic term across addition and subtraction: ∫ ({expr}) d{variable}.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081226] border border-[#14264c] text-xs sm:text-sm text-slate-200 space-y-1">
                    <strong className="text-blue-300 block">Step 2 — Apply Antiderivative Rules</strong>
                    <p>Apply the Power Rule ∫ xⁿ dx = xⁿ⁺¹/(n+1) and standard antiderivatives to integrate each term.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081226] border border-[#14264c] text-xs sm:text-sm text-slate-200 space-y-1">
                    <strong className="text-blue-300 block">Step 3 — Append Constant of Integration (+ C)</strong>
                    <p>Since the integral is indefinite, an arbitrary real constant + C must be added to represent all parallel curves.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Final Answer Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0d1d3d] to-blue-950/60 border-2 border-blue-600/70 shadow-lg text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold block">
                FINAL INTEGRAL ANSWER
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white py-1">
                {isDefinite ? (
                  <span>
                    ∫<sub className="text-sm">{analysis.a}</sub><sup className="text-sm">{analysis.b}</sup> ({expr}) d{variable} = {analysis.definiteResult}
                  </span>
                ) : (
                  <span>
                    ∫ ({expr}) d{variable} = {analysis.antiderivative} + C
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                {isDefinite
                  ? `Represents the net signed area bounded between the curve and the horizontal axis on [${analysis.a}, ${analysis.b}].`
                  : 'Represents the complete family of antiderivative curves.'}
              </p>
            </div>
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
                <h3 className="text-base font-bold text-white">Upload Integration Problem</h3>
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
              Upload a photo of an integration question or click a classic textbook example to load it immediately:
            </p>

            <div className="border-2 border-dashed border-[#1c3970] hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-all bg-[#081226]/50">
              <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-300 font-medium">Upload Textbook Photo</div>
              <div className="text-[10px] text-slate-500">Detects indefinite and definite integrals</div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Standard Curriculum Examples:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { title: 'Polynomial Sum', f: '4x^3 - 6x + 2', def: false, a: '0', b: '2' },
                  { title: 'Substitution Form', f: '2x * cos(x^2)', def: false, a: '0', b: '1.41' },
                  { title: 'Integration by Parts', f: 'x * e^x', def: false, a: '0', b: '1' },
                  { title: 'Definite Parabola Area', f: '4 - x^2', def: true, a: '-2', b: '2' },
                  { title: 'Inverse Trig Form', f: '1 / (1 + x^2)', def: true, a: '0', b: '1' },
                  { title: 'Sine Wave Accumulation', f: 'sin(x)', def: true, a: '0', b: 'pi' },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      setExpr(item.f);
                      setIsDefinite(item.def);
                      setLowerLimit(item.a);
                      setUpperLimit(item.b);
                      setShowImageModal(false);
                      setFlowMode('solve');
                    }}
                    className="p-2.5 rounded-lg bg-[#081226] hover:bg-[#10234a] border border-[#14264c] text-left transition-all"
                  >
                    <span className="text-blue-300 font-semibold block text-[11px]">{item.title}</span>
                    <span className="font-mono text-slate-300 text-[10px] truncate block">{item.f}</span>
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
