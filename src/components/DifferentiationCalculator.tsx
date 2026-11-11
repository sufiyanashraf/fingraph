import { useState, useMemo, useRef } from 'react';
import * as math from 'mathjs';
import {
  Keyboard,
  Camera,
  LineChart,
  Sparkles,
  BookOpen,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle
} from 'lucide-react';
import MathVirtualKeyboard from './MathVirtualKeyboard';

interface DiffAnalysisResult {
  success: boolean;
  derivativeStr: string;
  simplifiedStr: string;
  detectedRules: string[];
  activeRuleIds: string[];
  primaryTechnique: string;
  formulaLatex: string;
  steps: { step: number; title: string; desc: string; math?: string }[];
  whyRule: string;
  error?: string;
}

interface RuleDefinition {
  id: string;
  name: string;
  category: 'basic' | 'prod_quot' | 'chain' | 'trig' | 'exp_log' | 'inverse';
  formula: string;
  explanation: string;
  example: string;
}

const FORMULA_LIBRARY: RuleDefinition[] = [
  // Basic
  {
    id: 'constant',
    name: 'Constant Rule',
    category: 'basic',
    formula: '\\frac{d}{dx}[c] = 0',
    explanation: 'The derivative of any constant number is zero because constants do not change.',
    example: '\\frac{d}{dx}[7] = 0',
  },
  {
    id: 'identity',
    name: 'Identity / Linear Rule',
    category: 'basic',
    formula: '\\frac{d}{dx}[x] = 1, \\quad \\frac{d}{dx}[c x] = c',
    explanation: 'The rate of change of x with respect to itself is 1. The slope of a linear term cx is just c.',
    example: '\\frac{d}{dx}[5x] = 5',
  },
  {
    id: 'power',
    name: 'Power Rule',
    category: 'basic',
    formula: '\\frac{d}{dx}[x^n] = n x^{n-1}',
    explanation: 'Bring down the exponent n in front as a multiplier, then decrease the exponent by 1.',
    example: '\\frac{d}{dx}[x^4] = 4x^3',
  },
  {
    id: 'constant_multiple',
    name: 'Constant Multiple Rule',
    category: 'basic',
    formula: '\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f\'(x)',
    explanation: 'A constant multiplier can be pulled outside the differentiation operator untouched.',
    example: '\\frac{d}{dx}[3x^5] = 3 \\cdot (5x^4) = 15x^4',
  },
  {
    id: 'sum_diff',
    name: 'Sum & Difference Rule',
    category: 'basic',
    formula: '\\frac{d}{dx}[u \\pm v] = \\frac{du}{dx} \\pm \\frac{dv}{dx}',
    explanation: 'The derivative of a sum or difference of functions is the sum or difference of their individual derivatives.',
    example: '\\frac{d}{dx}[x^3 + 4x] = 3x^2 + 4',
  },

  // Product & Quotient
  {
    id: 'product',
    name: 'Product Rule',
    category: 'prod_quot',
    formula: '\\frac{d}{dx}[u \\cdot v] = u\'v + uv\'',
    explanation: 'First times the derivative of the second, plus the second times the derivative of the first.',
    example: '\\frac{d}{dx}[x \\cdot \\sin x] = 1 \\cdot \\sin x + x \\cdot \\cos x',
  },
  {
    id: 'quotient',
    name: 'Quotient Rule',
    category: 'prod_quot',
    formula: '\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}',
    explanation: 'Low d-high minus high d-low over the square of what\'s below.',
    example: '\\frac{d}{dx}\\left[\\frac{x}{x+1}\\right] = \\frac{1(x+1) - x(1)}{(x+1)^2} = \\frac{1}{(x+1)^2}',
  },
  {
    id: 'reciprocal',
    name: 'Reciprocal Rule',
    category: 'prod_quot',
    formula: '\\frac{d}{dx}\\left[\\frac{1}{v}\\right] = -\\frac{v\'}{v^2}',
    explanation: 'A special case of the quotient rule when the numerator is a constant 1.',
    example: '\\frac{d}{dx}\\left[\\frac{1}{x^2}\\right] = -\\frac{2x}{x^4} = -\\frac{2}{x^3}',
  },

  // Chain Rule
  {
    id: 'chain',
    name: 'Chain Rule (Composites)',
    category: 'chain',
    formula: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
    explanation: 'Differentiate the outer function evaluated at the inner function, then multiply by the derivative of the inner function.',
    example: '\\frac{d}{dx}[(2x+1)^3] = 3(2x+1)^2 \\cdot 2 = 6(2x+1)^2',
  },
  {
    id: 'gen_power',
    name: 'Generalized Power Rule',
    category: 'chain',
    formula: '\\frac{d}{dx}[g(x)^n] = n g(x)^{n-1} \\cdot g\'(x)',
    explanation: 'Chain rule combined with the power rule for functions raised to an exponent.',
    example: '\\frac{d}{dx}[(x^2 + 5)^4] = 4(x^2 + 5)^3 \\cdot (2x) = 8x(x^2+5)^3',
  },

  // Trigonometric
  {
    id: 'trig_sin',
    name: 'Derivative of Sine',
    category: 'trig',
    formula: '\\frac{d}{dx}[\\sin x] = \\cos x',
    explanation: 'The slope of the sine wave at any angle x equals the cosine of that angle.',
    example: '\\frac{d}{dx}[\\sin(3x)] = 3\\cos(3x)',
  },
  {
    id: 'trig_cos',
    name: 'Derivative of Cosine',
    category: 'trig',
    formula: '\\frac{d}{dx}[\\cos x] = -\\sin x',
    explanation: 'The rate of change of cosine is the negative of the sine function.',
    example: '\\frac{d}{dx}[\\cos(x^2)] = -2x\\sin(x^2)',
  },
  {
    id: 'trig_tan',
    name: 'Derivative of Tangent',
    category: 'trig',
    formula: '\\frac{d}{dx}[\\tan x] = \\sec^2 x = 1 + \\tan^2 x',
    explanation: 'The derivative of tangent is secant squared, always positive on its domain.',
    example: '\\frac{d}{dx}[\\tan(2x)] = 2\\sec^2(2x)',
  },
  {
    id: 'trig_other',
    name: 'Secant, Cosecant & Cotangent',
    category: 'trig',
    formula: '\\frac{d}{dx}[\\sec x] = \\sec x \\tan x, \\quad \\frac{d}{dx}[\\csc x] = -\\csc x \\cot x',
    explanation: 'Standard trigonometric derivatives derived via quotient rule from 1/cos and 1/sin.',
    example: '\\frac{d}{dx}[\\sec x] = \\sec x \\tan x',
  },

  // Exponential & Logarithmic
  {
    id: 'exp_natural',
    name: 'Natural Exponential',
    category: 'exp_log',
    formula: '\\frac{d}{dx}[e^x] = e^x',
    explanation: 'e^x is the unique non-zero function that is its own instantaneous rate of change everywhere.',
    example: '\\frac{d}{dx}[e^{4x}] = 4e^{4x}',
  },
  {
    id: 'exp_general',
    name: 'General Exponential',
    category: 'exp_log',
    formula: '\\frac{d}{dx}[a^x] = a^x \\ln a',
    explanation: 'For any positive base a, the derivative equals the function multiplied by the natural log of the base.',
    example: '\\frac{d}{dx}[2^x] = 2^x \\ln 2',
  },
  {
    id: 'log_natural',
    name: 'Natural Logarithm',
    category: 'exp_log',
    formula: '\\frac{d}{dx}[\\ln x] = \\frac{1}{x} \\quad (x > 0)',
    explanation: 'The rate of growth of the natural log function is inversely proportional to x.',
    example: '\\frac{d}{dx}[\\ln(x^2 + 1)] = \\frac{2x}{x^2 + 1}',
  },
  {
    id: 'log_general',
    name: 'General Logarithm',
    category: 'exp_log',
    formula: '\\frac{d}{dx}[\\log_a x] = \\frac{1}{x \\ln a}',
    explanation: 'Change of base theorem converts log base a to ln(x)/ln(a).',
    example: '\\frac{d}{dx}[\\log_{10} x] = \\frac{1}{x \\ln 10}',
  },

  // Inverse Trig
  {
    id: 'inv_asin',
    name: 'Inverse Sine (Arcsin)',
    category: 'inverse',
    formula: '\\frac{d}{dx}[\\arcsin x] = \\frac{1}{\\sqrt{1 - x^2}}',
    explanation: 'Derived via implicit differentiation of sin(y) = x on (-1, 1).',
    example: '\\frac{d}{dx}[\\arcsin(2x)] = \\frac{2}{\\sqrt{1 - 4x^2}}',
  },
  {
    id: 'inv_atan',
    name: 'Inverse Tangent (Arctan)',
    category: 'inverse',
    formula: '\\frac{d}{dx}[\\arctan x] = \\frac{1}{1 + x^2}',
    explanation: 'Everywhere positive, decreasing to 0 as |x| approaches infinity.',
    example: '\\frac{d}{dx}[\\arctan(3x)] = \\frac{3}{1 + 9x^2}',
  },
  {
    id: 'inv_acos',
    name: 'Inverse Cosine (Arccos)',
    category: 'inverse',
    formula: '\\frac{d}{dx}[\\arccos x] = -\\frac{1}{\\sqrt{1 - x^2}}',
    explanation: 'The negative of the arcsin derivative on (-1, 1).',
    example: '\\frac{d}{dx}[\\arccos x] = -\\frac{1}{\\sqrt{1 - x^2}}',
  },
];

export default function DifferentiationCalculator() {
  const [expr, setExpr] = useState<string>('3x^2 + 5x - 4');
  const [point, setPoint] = useState<string>('2');
  const [activeInput, setActiveInput] = useState<'expr' | 'point'>('expr');

  // UI state
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(true);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'solution' | 'library' | 'concept'>('solution');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [graphZoom, setGraphZoom] = useState<number>(6);

  const exprInputRef = useRef<HTMLInputElement>(null);
  const pointInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect variable
  const variable = useMemo(() => {
    const letters = expr.match(/[a-zA-Z]/g) || [];
    const reserved = ['s', 'i', 'n', 'c', 'o', 't', 'a', 'l', 'g', 'e', 'x', 'p', 'r', 'q', 'b', 'd'];
    const candidates = letters.filter(
      (ch) => !reserved.includes(ch.toLowerCase()) || ['x', 't', 'y', 'u', 'z', 'n', 'w'].includes(ch.toLowerCase())
    );
    return candidates.length > 0 ? candidates[0] : 'x';
  }, [expr]);

  // Clean expression for mathjs parsing
  const cleanExpr = useMemo(() => {
    return expr
      .replace(/(\d+)([a-zA-Z])/g, '$1 * $2')
      .replace(/\)\(/g, ') * (')
      .replace(/(\d+)\(/g, '$1 * (')
      .replace(/\)([a-zA-Z])/g, ') * $1')
      .trim();
  }, [expr]);

  // Symbolic Differentiation & Rule Detection Engine
  const diffAnalysis: DiffAnalysisResult = useMemo(() => {
    if (!cleanExpr) {
      return {
        success: false,
        derivativeStr: '',
        simplifiedStr: '',
        detectedRules: [] as string[],
        activeRuleIds: [] as string[],
        primaryTechnique: 'Direct Differentiation',
        formulaLatex: '',
        steps: [] as { step: number; title: string; desc: string; math?: string }[],
        whyRule: '',
        error: 'Please enter a valid expression.',
      };
    }

    try {
      const parsedNode = math.parse(cleanExpr);
      const derived = math.derivative(parsedNode, variable);
      const derivativeStr = derived.toString();
      let simplifiedStr = derivativeStr;
      try {
        simplifiedStr = math.simplify(derived).toString();
      } catch {
        // Fallback to unsimplified if math.simplify fails on custom forms
        simplifiedStr = derivativeStr;
      }

      // Check rules present in the expression
      const exprLower = cleanExpr.toLowerCase();
      const hasVariable = exprLower.includes(variable);
      const hasPower = exprLower.includes('^') || exprLower.includes('sqrt');
      const hasSumDiff = exprLower.includes('+') || (exprLower.includes('-') && !exprLower.startsWith('-'));
      const hasProduct = exprLower.includes('*');
      const hasQuotient = exprLower.includes('/');
      const hasSin = exprLower.includes('sin') && !exprLower.includes('asin') && !exprLower.includes('arcsin');
      const hasCos = exprLower.includes('cos') && !exprLower.includes('acos') && !exprLower.includes('arccos');
      const hasTan = exprLower.includes('tan') && !exprLower.includes('atan') && !exprLower.includes('arctan');
      const hasSecCscCot = exprLower.includes('sec') || exprLower.includes('csc') || exprLower.includes('cot');
      const hasExp = exprLower.includes('e^') || exprLower.includes('exp');
      const hasLnLog = exprLower.includes('ln') || exprLower.includes('log');
      const hasArcsin = exprLower.includes('asin') || exprLower.includes('arcsin');
      const hasArctan = exprLower.includes('atan') || exprLower.includes('arctan');
      const hasArccos = exprLower.includes('acos') || exprLower.includes('arccos');

      // Check for chain rule composition: function inside function or bracket power like (something)^n
      const hasBracketPower = /\([^)]+\)\s*\^\s*\d+/.test(cleanExpr) || /sqrt\([^)]+\)/.test(cleanExpr);
      const hasNestedArg = /(?:sin|cos|tan|exp|ln|log)\((?![a-zA-Z]\))[^)]+\)/.test(cleanExpr);
      const isChain = hasBracketPower || hasNestedArg;

      const detectedRules: string[] = [];
      const activeRuleIds: string[] = [];

      if (!hasVariable) {
        detectedRules.push('Constant Rule');
        activeRuleIds.push('constant');
      } else {
        if (hasQuotient) {
          detectedRules.push('Quotient Rule');
          activeRuleIds.push('quotient');
        }
        if (hasProduct && !hasQuotient) {
          detectedRules.push('Product Rule');
          activeRuleIds.push('product');
        }
        if (isChain) {
          detectedRules.push('Chain Rule');
          activeRuleIds.push('chain');
          if (hasBracketPower) activeRuleIds.push('gen_power');
        }
        if (hasPower && !hasBracketPower) {
          detectedRules.push('Power Rule');
          activeRuleIds.push('power');
        }
        if (hasSumDiff) {
          detectedRules.push('Sum & Difference Rule');
          activeRuleIds.push('sum_diff');
        }
        if (hasSin) {
          detectedRules.push('Trig (Sine) Rule');
          activeRuleIds.push('trig_sin');
        }
        if (hasCos) {
          detectedRules.push('Trig (Cosine) Rule');
          activeRuleIds.push('trig_cos');
        }
        if (hasTan) {
          detectedRules.push('Trig (Tangent) Rule');
          activeRuleIds.push('trig_tan');
        }
        if (hasSecCscCot) {
          detectedRules.push('Trig Rule (Sec/Csc/Cot)');
          activeRuleIds.push('trig_other');
        }
        if (hasExp) {
          detectedRules.push('Exponential Rule');
          activeRuleIds.push('exp_natural');
        }
        if (hasLnLog) {
          detectedRules.push('Logarithmic Rule');
          activeRuleIds.push('log_natural');
        }
        if (hasArcsin) {
          detectedRules.push('Inverse Sine Rule');
          activeRuleIds.push('inv_asin');
        }
        if (hasArctan) {
          detectedRules.push('Inverse Tangent Rule');
          activeRuleIds.push('inv_atan');
        }
        if (hasArccos) {
          detectedRules.push('Inverse Cosine Rule');
          activeRuleIds.push('inv_acos');
        }

        // If only linear variable term
        if (detectedRules.length === 0) {
          detectedRules.push('Linear / Identity Rule');
          activeRuleIds.push('identity');
        }
        // Always useful to mark constant multiple if digits precede x
        if (/\d+\s*\*?\s*[a-zA-Z]/.test(cleanExpr)) {
          activeRuleIds.push('constant_multiple');
        }
      }

      // Determine Primary Technique label and formula
      let primaryTechnique = detectedRules[0] || 'Standard Differentiation';
      let formulaLatex = '\\frac{d}{dx}[x^n] = n x^{n-1}';
      let whyRule = '';

      if (detectedRules.includes('Quotient Rule')) {
        primaryTechnique = 'Quotient Rule';
        formulaLatex = `\\frac{d}{d${variable}}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}`;
        whyRule = `The expression contains a fraction with the variable ${variable} in the denominator. Standard term-by-term differentiation cannot be applied across division; thus, the Quotient Rule must be employed.`;
      } else if (detectedRules.includes('Product Rule')) {
        primaryTechnique = 'Product Rule';
        formulaLatex = `\\frac{d}{d${variable}}[u \\cdot v] = u'v + uv'`;
        whyRule = `The expression is composed of two variable factors multiplying each other. By the product rule theorem, the derivative of a product is NOT simply the product of their derivatives; instead, we differentiate each factor alternately while keeping the other intact.`;
      } else if (detectedRules.includes('Chain Rule')) {
        primaryTechnique = 'Chain Rule (Composition of Functions)';
        formulaLatex = `\\frac{d}{d${variable}}[f(g(${variable}))] = f'(g(${variable})) \\cdot g'(${variable})`;
        whyRule = `The function is a composite expression where an outer operation (such as a power, trigonometric, exponential, or square root) envelops an inner function g(${variable}). The Chain Rule allows us to peel the derivative layer by layer from outside to inside.`;
      } else if (detectedRules.includes('Exponential Rule')) {
        primaryTechnique = 'Exponential Differentiation';
        formulaLatex = `\\frac{d}{d${variable}}[e^{${variable}}] = e^{${variable}}`;
        whyRule = `The expression features an exponential term with the variable in the exponent. Natural exponential functions reproduce themselves upon differentiation, scaled by inner derivatives.`;
      } else if (detectedRules.includes('Logarithmic Rule')) {
        primaryTechnique = 'Logarithmic Differentiation';
        formulaLatex = `\\frac{d}{d${variable}}[\\ln(${variable})] = \\frac{1}{${variable}}`;
        whyRule = `The expression contains a logarithm. Logarithmic derivatives convert exponential and multiplicative structures into reciprocal polynomial forms.`;
      } else if (detectedRules.includes('Trig (Sine) Rule') || detectedRules.includes('Trig (Cosine) Rule')) {
        primaryTechnique = 'Trigonometric Differentiation';
        formulaLatex = `\\frac{d}{d${variable}}[\\sin(${variable})] = \\cos(${variable}), \\quad \\frac{d}{d${variable}}[\\cos(${variable})] = -\\sin(${variable})`;
        whyRule = `The function contains trigonometric terms whose slopes correspond to cyclical angular transformations.`;
      } else if (detectedRules.includes('Power Rule') || detectedRules.includes('Sum & Difference Rule')) {
        primaryTechnique = 'Power & Polynomial Sum Rule';
        formulaLatex = `\\frac{d}{d${variable}}[${variable}^n] = n ${variable}^{n-1}, \\quad \\frac{d}{d${variable}}[u \\pm v] = u' \\pm v'`;
        whyRule = `The function is a polynomial or linear combination of powers. We differentiate term by term by multiplying by each exponent and reducing the power by one.`;
      } else if (detectedRules.includes('Constant Rule')) {
        primaryTechnique = 'Constant Rule';
        formulaLatex = `\\frac{d}{d${variable}}[c] = 0`;
        whyRule = `The expression contains no instances of the variable ${variable}. Since it represents a constant flat value, its rate of change is zero everywhere.`;
      }

      // Generate Step-by-Step Derivation
      const steps: { step: number; title: string; desc: string; math?: string }[] = [];

      // Step 1: Identify setup
      steps.push({
        step: 1,
        title: 'Identify Function Structure and Rules',
        desc: `Examine the mathematical composition of f(${variable}) = ${expr}. The expression triggers: ${detectedRules.join(', ')}.`,
        math: `f(${variable}) = ${expr}`,
      });

      // Step 2: Decomposition / Sub-part derivatives
      if (hasQuotient) {
        steps.push({
          step: 2,
          title: 'Decompose Numerator u and Denominator v',
          desc: `Set u(${variable}) as the top expression and v(${variable}) as the bottom expression. Differentiate each independently: u' = du/d${variable} and v' = dv/d${variable}.`,
          math: `u(${variable}) \\text{ and } v(${variable}) \\implies u'(${variable}), v'(${variable})`,
        });
      } else if (hasProduct && !hasQuotient) {
        steps.push({
          step: 2,
          title: 'Identify Factors u and v',
          desc: `Decompose the product into two distinct terms u(${variable}) and v(${variable}), and compute their respective derivatives.`,
          math: `u(${variable}) \\cdot v(${variable}) \\implies u'(${variable}) \\text{ and } v'(${variable})`,
        });
      } else if (isChain) {
        steps.push({
          step: 2,
          title: 'Separate Outer Function f(u) and Inner Core g(x)',
          desc: `Let u = g(${variable}) be the inner core. Compute the derivative of the outer wrapper with respect to u, and differentiate the inside g'(${variable}).`,
          math: `\\frac{df}{du} \\cdot \\frac{du}{d${variable}}`,
        });
      } else {
        steps.push({
          step: 2,
          title: 'Apply Term-by-Term Differentiation',
          desc: `Differentiate each term independently across addition and subtraction using the power rule d/d${variable}[${variable}^n] = n·${variable}^(n-1) and constant multiple rule.`,
          math: `\\frac{d}{d${variable}}\\left[${expr}\\right]`,
        });
      }

      // Step 3: Raw derivative
      steps.push({
        step: 3,
        title: 'Apply Differentiation Theorem',
        desc: `Substitute the components into the ${primaryTechnique} formula:`,
        math: `f'(${variable}) = \\frac{d}{d${variable}}\\left[${expr}\\right] = ${derivativeStr}`,
      });

      // Step 4: Algebraic simplification
      if (simplifiedStr !== derivativeStr) {
        steps.push({
          step: 4,
          title: 'Simplify Algebraic Terms',
          desc: 'Combine like terms, factor common multipliers, and reduce powers to state the final derivative in standard form:',
          math: `f'(${variable}) = ${simplifiedStr}`,
        });
      } else {
        steps.push({
          step: 4,
          title: 'Final Clean Result',
          desc: 'The derivative is already in its most concise and standard algebraic format:',
          math: `f'(${variable}) = ${simplifiedStr}`,
        });
      }

      return {
        success: true,
        derivativeStr,
        simplifiedStr,
        detectedRules,
        activeRuleIds,
        primaryTechnique,
        formulaLatex,
        steps,
        whyRule,
        error: undefined,
      };
    } catch (e: any) {
      return {
        success: false,
        derivativeStr: '',
        simplifiedStr: '',
        detectedRules: [],
        activeRuleIds: [],
        primaryTechnique: 'Error',
        formulaLatex: '',
        steps: [],
        whyRule: '',
        error: e.message || 'Could not parse mathematical expression.',
      };
    }
  }, [cleanExpr, variable, expr]);

  // Point Evaluation & Tangent Line Calculations
  const pointAnalysis = useMemo(() => {
    const trimmed = point.trim();
    if (!trimmed) {
      return { hasPoint: false, pointVal: 0, fa: 0, fPrimeA: 0, tangentLineStr: '', slopeDirection: 'none' };
    }

    try {
      let aVal = 0;
      if (trimmed === 'pi' || trimmed === 'π') aVal = Math.PI;
      else if (trimmed === 'e') aVal = Math.E;
      else aVal = parseFloat(trimmed);

      if (isNaN(aVal)) return { hasPoint: false, pointVal: 0, fa: 0, fPrimeA: 0, tangentLineStr: '', slopeDirection: 'none' };

      // Evaluate f(a)
      const compiledExpr = math.compile(cleanExpr);
      const faVal = Number(compiledExpr.evaluate({ [variable]: aVal }));

      // Evaluate f'(a)
      let fPrimeVal = 0;
      if (diffAnalysis.success && diffAnalysis.simplifiedStr) {
        const compiledDiff = math.compile(diffAnalysis.simplifiedStr);
        fPrimeVal = Number(compiledDiff.evaluate({ [variable]: aVal }));
      } else {
        // Numerical derivative fallback: (f(a+h) - f(a-h))/(2h)
        const h = 1e-6;
        const f1 = Number(compiledExpr.evaluate({ [variable]: aVal + h }));
        const f0 = Number(compiledExpr.evaluate({ [variable]: aVal - h }));
        fPrimeVal = (f1 - f0) / (2 * h);
      }

      // Format clean decimals
      const cleanFa = Math.abs(faVal - Math.round(faVal)) < 1e-6 ? Math.round(faVal) : Number(faVal.toFixed(4));
      const cleanM = Math.abs(fPrimeVal - Math.round(fPrimeVal)) < 1e-6 ? Math.round(fPrimeVal) : Number(fPrimeVal.toFixed(4));

      // Tangent line: y - y0 = m(x - x0) => y = m*x + (y0 - m*x0)
      const intercept = cleanFa - cleanM * aVal;
      const cleanIntercept = Math.abs(intercept - Math.round(intercept)) < 1e-6 ? Math.round(intercept) : Number(intercept.toFixed(4));

      let tangentLineStr = `y = ${cleanM}${variable}`;
      if (cleanIntercept > 0) tangentLineStr += ` + ${cleanIntercept}`;
      else if (cleanIntercept < 0) tangentLineStr += ` - ${Math.abs(cleanIntercept)}`;

      let slopeDirection: 'increasing' | 'decreasing' | 'horizontal' = 'horizontal';
      if (cleanM > 0.0001) slopeDirection = 'increasing';
      else if (cleanM < -0.0001) slopeDirection = 'decreasing';

      return {
        hasPoint: true,
        pointVal: aVal,
        fa: cleanFa,
        fPrimeA: cleanM,
        intercept: cleanIntercept,
        tangentLineStr,
        slopeDirection,
      };
    } catch {
      return { hasPoint: false, pointVal: 0, fa: 0, fPrimeA: 0, tangentLineStr: '', slopeDirection: 'none' };
    }
  }, [point, cleanExpr, variable, diffAnalysis]);

  // Graph Data Computation
  const graphData = useMemo(() => {
    if (!diffAnalysis.success) return null;

    try {
      const compiledExpr = math.compile(cleanExpr);
      const center = pointAnalysis.hasPoint ? pointAnalysis.pointVal : 0;
      const minX = center - graphZoom;
      const maxX = center + graphZoom;
      const step = (maxX - minX) / 120;

      const fPoints: { x: number; y: number }[] = [];
      const tangentPoints: { x: number; y: number }[] = [];

      let minY = Infinity;
      let maxY = -Infinity;

      for (let x = minX; x <= maxX; x += step) {
        try {
          const y = Number(compiledExpr.evaluate({ [variable]: x }));
          if (isFinite(y) && !isNaN(y)) {
            // clamp extreme values to avoid breaking SVG
            const clampedY = Math.max(-50, Math.min(50, y));
            fPoints.push({ x, y: clampedY });
            if (clampedY < minY) minY = clampedY;
            if (clampedY > maxY) maxY = clampedY;
          }
        } catch {
          // ignore domain errors at specific x
        }
      }

      // If point analysis active, generate tangent line points across minX..maxX
      if (pointAnalysis.hasPoint) {
        const m = pointAnalysis.fPrimeA;
        const b = pointAnalysis.intercept ?? 0;
        for (let x = minX; x <= maxX; x += step * 4) {
          const y = m * x + b;
          if (isFinite(y)) {
            const clampedY = Math.max(-50, Math.min(50, y));
            tangentPoints.push({ x, y: clampedY });
            if (clampedY < minY) minY = clampedY;
            if (clampedY > maxY) maxY = clampedY;
          }
        }
      }

      if (minY === Infinity || maxY === -Infinity) {
        minY = -10;
        maxY = 10;
      }
      if (maxY - minY < 2) {
        maxY += 2;
        minY -= 2;
      }

      // Add 15% padding on Y axis
      const yPadding = (maxY - minY) * 0.15;
      minY -= yPadding;
      maxY += yPadding;

      return { minX, maxX, minY, maxY, fPoints, tangentPoints };
    } catch {
      return null;
    }
  }, [cleanExpr, variable, diffAnalysis, pointAnalysis, graphZoom]);

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

  // Filtered rules in library
  const filteredLibrary = useMemo(() => {
    if (selectedCategory === 'all') return FORMULA_LIBRARY;
    return FORMULA_LIBRARY.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {/* ─── TITLE & HERO INTRO ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#14264c]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Calculus · Differential Calculus
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Exact Symbolic Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1.5 font-bold tracking-tight">
            DIFFERENTIATION ENGINE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Analyze rates of change, discover exact symbolic derivatives, understand rule selection, and inspect tangent lines at any point.
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1 bg-[#09152e] p-1 rounded-xl border border-[#162c57] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('solution')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'solution'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#0e2046]'
            }`}
          >
            Technique & Solution
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#0e2046]'
            }`}
          >
            Formula Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('concept')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'concept'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#0e2046]'
            }`}
          >
            Understand Concept
          </button>
        </div>
      </div>

      {/* ─── MAIN INPUT PANEL ─── */}
      <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-4 sm:p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* Function Input (f(x) = ...) */}
          <div className="lg:col-span-6 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Function / Expression: f({variable}) =</span>
              <span className="text-[11px] text-blue-400 font-normal">e.g. 3x^2 + 5x - 4, x*sin(x), (2x+1)/(x-1)</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-blue-400 font-serif italic text-base pointer-events-none select-none">
                f({variable}) =
              </span>
              <input
                ref={exprInputRef}
                type="text"
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                onFocus={() => setActiveInput('expr')}
                placeholder="3x^2 + 5x - 4"
                className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-20 pr-4 py-2.5 text-sm sm:text-base font-mono text-white placeholder-slate-600 transition-all outline-none"
              />
            </div>
          </div>

          {/* Optional Point x = a */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Optional Point {variable} =
            </label>
            <input
              ref={pointInputRef}
              type="text"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              onFocus={() => setActiveInput('point')}
              placeholder="e.g. 2, 0, pi"
              className="w-full bg-[#060c1d] border border-[#1d3c75] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm sm:text-base font-mono text-white placeholder-slate-600 transition-all outline-none text-center"
            />
          </div>

          {/* Action Toolbar */}
          <div className="lg:col-span-4 flex items-center gap-2">
            {/* Virtual Keyboard Button */}
            <button
              type="button"
              onClick={() => setShowKeyboard((prev) => !prev)}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                showKeyboard
                  ? 'bg-blue-600 border-blue-400 text-white shadow-blue-600/30'
                  : 'bg-[#09152e] hover:bg-[#10234a] border-[#1d3c75] text-slate-200'
              }`}
              title="Toggle Math Keyboard"
            >
              <Keyboard className="w-4 h-4 text-blue-400" />
              <span>Keyboard</span>
            </button>

            {/* Graph Button */}
            <button
              type="button"
              onClick={() => setShowGraph((prev) => !prev)}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                showGraph
                  ? 'bg-sky-600 border-sky-400 text-white shadow-sky-600/30'
                  : 'bg-[#09152e] hover:bg-[#10234a] border-[#1d3c75] text-slate-200'
              }`}
              title="Toggle Graph Visualizer"
            >
              <LineChart className="w-4 h-4 text-sky-400" />
              <span>Graph</span>
            </button>

            {/* Picture Button */}
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#09152e] hover:bg-[#10234a] border border-[#1d3c75] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Upload problem image or select preset"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Picture</span>
            </button>
          </div>
        </div>

        {/* Quick Rule Indicators Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#132244] text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Detected Rules:</span>
            {diffAnalysis.detectedRules.length > 0 ? (
              diffAnalysis.detectedRules.map((ruleName) => (
                <span
                  key={ruleName}
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-blue-950/70 text-blue-300 border border-blue-800/60 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-blue-400" />
                  {ruleName}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic text-[11px]">Type an expression to auto-detect rules</span>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Variable: <span className="font-mono text-blue-300 font-bold">{variable}</span>
          </div>
        </div>
      </div>

      {/* ─── COLLAPSIBLE GRAPH & TANGENT VISUALIZER ─── */}
      {showGraph && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Interactive Curve & Tangent Line Plot
              </h3>
            </div>
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setGraphZoom((z) => Math.max(2, z - 2))}
                className="p-1 rounded bg-[#09152e] hover:bg-[#122650] text-slate-300 border border-[#162c57] transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setGraphZoom((z) => Math.min(24, z + 2))}
                className="p-1 rounded bg-[#09152e] hover:bg-[#122650] text-slate-300 border border-[#162c57] transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setGraphZoom(6)}
                className="p-1 rounded bg-[#09152e] hover:bg-[#122650] text-slate-300 border border-[#162c57] transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Plot Canvas */}
          <div className="w-full h-64 sm:h-72 bg-[#060c1d] rounded-xl border border-[#132244] overflow-hidden relative flex items-center justify-center select-none">
            {graphData && graphData.fPoints.length > 1 ? (
              <svg viewBox="0 0 700 280" className="w-full h-full">
                {/* Grid Lines */}
                <line x1={0} y1={140} x2={700} y2={140} stroke="#1b3360" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={350} y1={0} x2={350} y2={280} stroke="#1b3360" strokeWidth="1" strokeDasharray="3 3" />

                {/* Function Curve f(x) */}
                <path
                  d={graphData.fPoints
                    .map((pt, idx) => {
                      const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                      const sy = 280 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 280;
                      return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Tangent Line if point specified */}
                {pointAnalysis.hasPoint && graphData.tangentPoints.length > 1 && (
                  <path
                    d={graphData.tangentPoints
                      .map((pt, idx) => {
                        const sx = ((pt.x - graphData.minX) / (graphData.maxX - graphData.minX)) * 700;
                        const sy = 280 - ((pt.y - graphData.minY) / (graphData.maxY - graphData.minY)) * 280;
                        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                  />
                )}

                {/* Tangent Point of Contact (a, f(a)) */}
                {pointAnalysis.hasPoint && (
                  <g>
                    {/* Vertical reference drop line */}
                    <line
                      x1={((pointAnalysis.pointVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                      y1={0}
                      x2={((pointAnalysis.pointVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                      y2={280}
                      stroke="#f59e0b"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                    {/* Point Circle */}
                    <circle
                      cx={((pointAnalysis.pointVal - graphData.minX) / (graphData.maxX - graphData.minX)) * 700}
                      cy={280 - ((pointAnalysis.fa - graphData.minY) / (graphData.maxY - graphData.minY)) * 280}
                      r={6}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  </g>
                )}
              </svg>
            ) : (
              <div className="text-xs text-slate-500 font-mono">Plotting mathematical curves...</div>
            )}
          </div>

          {/* Graph Legend & Information */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-sky-400 rounded-full" />
                <span className="font-mono text-slate-300">f({variable}) = {expr}</span>
              </div>
              {pointAnalysis.hasPoint && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-0.5 bg-amber-400 border-b border-dashed border-amber-400" />
                    <span className="font-mono text-amber-300">Tangent: {pointAnalysis.tangentLineStr}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                    <span className="font-mono text-slate-300">
                      Point ({pointAnalysis.pointVal}, {pointAnalysis.fa}) · Slope m = {pointAnalysis.fPrimeA}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              X range: [{graphData?.minX.toFixed(1)}, {graphData?.maxX.toFixed(1)}]
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 1: TECHNIQUE & SOLUTION (CORE WORKSPACE) ─── */}
      {activeTab === 'solution' && (
        <div className="space-y-6">
          {/* Main Solution Box */}
          <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-7 space-y-6 shadow-xl">
            {/* Header: Technique Identification */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#14264c]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold mb-1">
                  TECHNIQUE & SOLUTION
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <span>Technique:</span>
                  <span className="text-blue-300 bg-blue-950/70 px-3 py-0.5 rounded-lg border border-blue-800/60 font-sans text-lg sm:text-xl">
                    {diffAnalysis.primaryTechnique}
                  </span>
                </h3>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  {diffAnalysis.detectedRules.length} Rule{diffAnalysis.detectedRules.length > 1 ? 's' : ''} Applied
                </span>
              </div>
            </div>

            {/* Formula Used Display */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block">
                Formula Used
              </span>
              <div className="font-mono text-base sm:text-lg text-white bg-[#050a18] p-3 rounded-lg border border-[#132244] overflow-x-auto scrollbar-hide text-center">
                {diffAnalysis.formulaLatex}
              </div>
            </div>

            {/* Step-by-Step Derivation */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Step-by-Step Derivation
              </span>

              <div className="space-y-3">
                {diffAnalysis.steps.map((st) => (
                  <div key={st.step} className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                        STEP {st.step} — {st.title}
                      </span>
                    </div>
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

            {/* Final Derivative Highlight Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0d1d3d] to-blue-950/60 border-2 border-blue-600/70 shadow-lg text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold block">
                FINAL DERIVATIVE RESULT
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white py-1">
                f'({variable}) = {diffAnalysis.simplifiedStr || diffAnalysis.derivativeStr}
              </div>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Represents the exact instantaneous rate of change of f({variable}) for every point in its domain.
              </p>
            </div>
          </div>

          {/* ─── DERIVATIVE AT SPECIFIC POINT & TANGENT LINE ANALYSIS ─── */}
          {pointAnalysis.hasPoint && (
            <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-5 sm:p-7 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#14264c]">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
                    POINT EVALUATION & TANGENT LINE
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                    Derivative at {variable} = {pointAnalysis.pointVal}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-950/70 text-amber-300 border border-amber-800/60">
                  Slope m = {pointAnalysis.fPrimeA}
                </span>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                {/* 1. Value on Curve f(a) */}
                <div className="p-4 bg-[#081226] rounded-xl border border-[#14264c] space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block">
                    Point of Tangency
                  </span>
                  <div className="text-lg font-bold text-white">
                    ({pointAnalysis.pointVal}, {pointAnalysis.fa})
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    f({pointAnalysis.pointVal}) = {pointAnalysis.fa}
                  </p>
                </div>

                {/* 2. Instantaneous Slope f'(a) */}
                <div className="p-4 bg-[#081226] rounded-xl border border-[#14264c] space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block">
                    Slope of Tangent (f'(a))
                  </span>
                  <div className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                    {pointAnalysis.slopeDirection === 'increasing' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                    {pointAnalysis.slopeDirection === 'decreasing' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {pointAnalysis.slopeDirection === 'horizontal' && <Minus className="w-4 h-4 text-slate-400" />}
                    <span>m = {pointAnalysis.fPrimeA}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans capitalize">
                    Function is {pointAnalysis.slopeDirection} at this point.
                  </p>
                </div>

                {/* 3. Tangent Line Equation */}
                <div className="p-4 bg-[#081226] rounded-xl border border-[#14264c] space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block">
                    Tangent Line Equation
                  </span>
                  <div className="text-base font-bold text-sky-300">
                    {pointAnalysis.tangentLineStr}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Point-slope: y - {pointAnalysis.fa} = {pointAnalysis.fPrimeA}({variable} - {pointAnalysis.pointVal})
                  </p>
                </div>
              </div>

              {/* Plain-Language Physical / Geometric Meaning */}
              <div className="p-4 rounded-xl bg-[#09152e] border border-[#162c57] text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span>Geometric Interpretation at {variable} = {pointAnalysis.pointVal}</span>
                </div>
                <p className="leading-relaxed">
                  A line placed tangent to the curve f({variable}) at the coordinate ({pointAnalysis.pointVal}, {pointAnalysis.fa})
                  has an exact slope of <strong className="text-amber-300">{pointAnalysis.fPrimeA}</strong>.
                  For every 1 unit move to the right in {variable}, the curve changes by approximately{' '}
                  <strong className="text-white">{pointAnalysis.fPrimeA}</strong> units.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: DERIVATIVE FORMULA LIBRARY ─── */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            {[
              { id: 'all', label: 'All Rules' },
              { id: 'basic', label: 'Basic & Powers' },
              { id: 'prod_quot', label: 'Product & Quotient' },
              { id: 'chain', label: 'Chain Rule' },
              { id: 'trig', label: 'Trigonometric' },
              { id: 'exp_log', label: 'Exponential & Log' },
              { id: 'inverse', label: 'Inverse Trig' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#081226] text-slate-400 hover:text-white hover:bg-[#0f2042] border border-[#14264c]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredLibrary.map((rule) => {
              const isActiveInExpression = diffAnalysis.activeRuleIds.includes(rule.id);
              const isExpanded = expandedRuleId === rule.id;

              return (
                <div
                  key={rule.id}
                  onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isActiveInExpression
                      ? 'bg-[#0c1f46] border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500/40'
                      : 'bg-[#081226] hover:bg-[#0c1a36] border-[#14264c]'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      {rule.category.replace('_', ' ')}
                    </span>
                    {isActiveInExpression && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-600 text-white font-semibold flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" /> Active in current expression
                      </span>
                    )}
                  </div>

                  {/* Title & Formula */}
                  <h4 className="text-sm font-bold text-white mb-2">{rule.name}</h4>
                  <div className="p-2.5 rounded-lg bg-[#050a18] border border-[#14264c] font-mono text-xs text-sky-300 text-center mb-2">
                    {rule.formula}
                  </div>

                  {/* Explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {rule.explanation}
                  </p>

                  {/* Example */}
                  <div className="pt-2 border-t border-[#132244] text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Example:</span>
                    <span className="font-mono text-amber-300">{rule.example}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 3: UNDERSTAND THE CONCEPT ─── */}
      {activeTab === 'concept' && (
        <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-6 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">
              EDUCATIONAL BREAKDOWN
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mt-1">
              Why This Rule? Understanding Calculus Intuitively
            </h3>
          </div>

          {/* Dynamic Explanation for the current expression */}
          <div className="p-5 rounded-xl bg-[#081226] border border-blue-900/40 space-y-2">
            <h4 className="text-sm font-semibold text-blue-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Why {diffAnalysis.primaryTechnique} for f({variable}) = {expr}?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {diffAnalysis.whyRule ||
                'The algebraic structure of your expression dictates which differentiation theorem applies.'}
            </p>
          </div>

          {/* Three Fundamental Pillars of Differentiation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 1. Geometric Meaning */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-sky-400" />
                <span>Geometric Meaning</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                The derivative f'(x) is the slope of the tangent line touching the curve y = f(x) at any chosen point.
                A positive slope indicates the function is climbing; zero marks a flat peak, trough, or terrace; negative indicates decline.
              </p>
            </div>

            {/* 2. Physical Rate of Change */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Physical Meaning</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                In kinematics, if s(t) is position, the derivative ds/dt = v(t) is instant velocity, and dv/dt = a(t) is acceleration.
                In finance and economics, derivatives yield marginal cost and marginal revenue.
              </p>
            </div>

            {/* 3. Leibniz & Limit Foundation */}
            <div className="p-4 rounded-xl bg-[#081226] border border-[#14264c] space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>The Formal Limit</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                All differentiation rules are rigorous shortcuts derived from Fermat and Leibniz's difference quotient:
                f'(x) = lim_{'{h → 0}'} [f(x+h) - f(x)] / h.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── PICTURE / PRESETS MODAL ─── */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b162f] border border-[#162c57] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#14264c]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Camera / Textbook Problem Presets</h3>
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
              Select a classic textbook differentiation problem or upload your own photo to immediately populate the workspace:
            </p>

            {/* Upload Dummy */}
            <div className="border-2 border-dashed border-[#1c3970] hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-all bg-[#081226]/50">
              <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <div className="text-xs text-slate-300 font-medium">Upload Problem Photo</div>
              <div className="text-[10px] text-slate-500">PNG, JPG or Screenshot</div>
            </div>

            {/* 6 Curated Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Standard Textbook Examples:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Polynomial & Powers', func: '3x^3 - 5x^2 + 2x - 7', p: '1' },
                  { label: 'Product Rule', func: 'x^2 * sin(x)', p: '1.57' },
                  { label: 'Quotient Rule', func: '(2x + 1) / (x - 3)', p: '4' },
                  { label: 'Chain Rule Composite', func: '(3x^2 + 1)^3', p: '1' },
                  { label: 'Exponential & Cosine', func: 'exp(2x) * cos(x)', p: '0' },
                  { label: 'Logarithmic Composition', func: 'ln(x^2 + 4)', p: '1' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setExpr(item.func);
                      setPoint(item.p);
                      setShowImageModal(false);
                    }}
                    className="p-2.5 rounded-lg bg-[#081226] hover:bg-[#10234a] border border-[#14264c] text-left transition-all"
                  >
                    <span className="text-blue-300 font-semibold block text-[11px]">{item.label}</span>
                    <span className="font-mono text-slate-300 text-[10px] truncate block">{item.func}</span>
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
