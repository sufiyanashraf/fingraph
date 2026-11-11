import * as math from 'mathjs';
import type { ToolType } from './algebraData';

export interface SolverOutput {
  title: string;
  summary: string;
  steps: string[];
  finalResult: string;
  details?: { [key: string]: string | number | boolean };
  visualData?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. BASICS ANALYZER
// ─────────────────────────────────────────────────────────────────────────────
export function solveBasics(input: string): SolverOutput {
  const clean = input.trim();
  if (!clean) {
    return {
      title: 'Expression Analyzer',
      summary: 'Please enter an algebraic expression or equation.',
      steps: [],
      finalResult: ''
    };
  }

  // Check if it's an equation
  if (clean.includes('=')) {
    const parts = clean.split('=');
    if (parts.length === 2) {
      const lhs = parts[0].trim();
      const rhs = parts[1].trim();

      // Check simple linear: ax + b = c
      const matchLinear = lhs.match(/^([+-]?\d*(?:\.\d+)?)?\s*\*?\s*([a-zA-Z])(?:\s*([+-])\s*(\d+(?:\.\d+)?))?$/);
      const rhsNum = parseFloat(rhs);

      if (matchLinear && !isNaN(rhsNum)) {
        const rawA = matchLinear[1];
        const variable = matchLinear[2];
        const signB = matchLinear[3];
        const rawB = matchLinear[4];

        let a = 1;
        if (rawA === '-' || rawA === '-1') a = -1;
        else if (rawA && rawA !== '+') a = parseFloat(rawA);

        let b = 0;
        if (rawB) {
          b = parseFloat(rawB);
          if (signB === '-') b = -b;
        }

        const steps: string[] = [
          `Original Equation: ${clean}`,
          `Identify variable: ${variable}, coefficient of ${variable}: ${a}, constant on LHS: ${b}`,
          b !== 0
            ? `Subtract constant ${b} from both sides: ${a}${variable} = ${rhsNum} - (${b}) = ${rhsNum - b}`
            : `Constant is 0: ${a}${variable} = ${rhsNum}`
        ];

        const afterSubtract = rhsNum - b;
        let finalVal = afterSubtract / a;
        if (a !== 1) {
          steps.push(`Divide both sides by ${a}: ${variable} = ${afterSubtract} / ${a} = ${Number(finalVal.toFixed(4))}`);
        }

        steps.push(`Final Answer: ${variable} = ${Number(finalVal.toFixed(4))}`);

        return {
          title: `Linear Solution for ${variable}`,
          summary: `Balanced equation and isolated ${variable}.`,
          steps,
          finalResult: `${variable} = ${Number(finalVal.toFixed(4))}`,
          details: { Variable: variable, Coefficient: a, Constant: b, Solution: Number(finalVal.toFixed(4)) }
        };
      }
    }
  }

  // Not an equation, analyze expression terms
  const variables = Array.from(new Set(clean.match(/[a-zA-Z]/g) || []));
  const numbers = clean.match(/[+-]?\s*\d+(\.\d+)?/g) || [];

  const steps = [
    `Expression: ${clean}`,
    `Detected variables: ${variables.length > 0 ? variables.join(', ') : 'None (Constant expression)'}`,
    `Extracting variable terms and constant numbers.`
  ];

  try {
    const simplified = math.simplify(clean).toString();
    steps.push(`Simplified expression: ${simplified}`);
    return {
      title: 'Expression Analysis & Simplification',
      summary: `Analyzed algebraic components and like terms.`,
      steps,
      finalResult: simplified,
      details: {
        Variables: variables.join(', ') || 'None',
        'Raw Numbers': numbers.join(', ') || 'None',
        'Simplified Form': simplified
      }
    };
  } catch {
    return {
      title: 'Component Analysis',
      summary: `Analyzed expression terms.`,
      steps,
      finalResult: clean,
      details: {
        Variables: variables.join(', ') || 'None'
      }
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXPRESSIONS TOOL (Expand, FOIL, Factor)
// ─────────────────────────────────────────────────────────────────────────────
export function solveExpressions(input: string): SolverOutput {
  const clean = input.trim();
  const steps: string[] = [`Input Expression: ${clean}`];

  // Check for (x + a)(x + b) FOIL pattern
  const foilMatch = clean.match(/^\(\s*([a-zA-Z])\s*([+-])\s*(\d+(?:\.\d+)?)\s*\)\s*\(\s*\1\s*([+-])\s*(\d+(?:\.\d+)?)\s*\)$/);
  if (foilMatch) {
    const v = foilMatch[1];
    const s1 = foilMatch[2];
    const n1 = parseFloat(foilMatch[3]) * (s1 === '-' ? -1 : 1);
    const s2 = foilMatch[4];
    const n2 = parseFloat(foilMatch[5]) * (s2 === '-' ? -1 : 1);

    const first = `${v}²`;
    const outer = n2;
    const inner = n1;
    const middleCoeff = n1 + n2;
    const last = n1 * n2;

    steps.push(`Applying FOIL Method to (${v} ${n1 >= 0 ? '+' : '-'} ${Math.abs(n1)})(${v} ${n2 >= 0 ? '+' : '-'} ${Math.abs(n2)}):`);
    steps.push(`First: ${v} · ${v} = ${first}`);
    steps.push(`Outer: ${v} · (${n2}) = ${outer}${v}`);
    steps.push(`Inner: (${n1}) · ${v} = ${inner}${v}`);
    steps.push(`Last: (${n1}) · (${n2}) = ${last}`);
    steps.push(`Combine Middle Terms: (${inner} + ${outer})${v} = ${middleCoeff}${v}`);

    const middleStr = middleCoeff !== 0 ? (middleCoeff > 0 ? ` + ${middleCoeff}${v}` : ` - ${Math.abs(middleCoeff)}${v}`) : '';
    const lastStr = last !== 0 ? (last > 0 ? ` + ${last}` : ` - ${Math.abs(last)}`) : '';
    const expanded = `${v}²${middleStr}${lastStr}`;

    steps.push(`Expanded Form: ${expanded}`);

    return {
      title: 'FOIL Expansion',
      summary: 'Expanded binomial product into standard trinomial form.',
      steps,
      finalResult: expanded,
      details: { Method: 'FOIL', MiddleCoefficient: middleCoeff, Constant: last }
    };
  }

  // Check for (a + b)^2 or (a - b)^2
  const sqMatch = clean.match(/^\(\s*([a-zA-Z]|\d+[a-zA-Z])\s*([+-])\s*(\d+)\s*\)\s*\^\s*2$/);
  if (sqMatch) {
    const aTerm = sqMatch[1];
    const sign = sqMatch[2];
    const bVal = parseFloat(sqMatch[3]);

    steps.push(`Recognized algebraic identity: (a ${sign} b)² = a² ${sign === '+' ? '+ 2ab +' : '- 2ab +'} b²`);
    steps.push(`Here a = ${aTerm}, b = ${bVal}`);
    steps.push(`a² = (${aTerm})²`);
    steps.push(`2ab = 2 · (${aTerm}) · ${bVal}`);
    steps.push(`b² = ${bVal}² = ${bVal * bVal}`);

    try {
      const expanded = math.simplify(clean).toString();
      steps.push(`Simplified Result: ${expanded}`);
      return {
        title: 'Perfect Square Expansion',
        summary: 'Applied standard algebraic identity for square of binomial.',
        steps,
        finalResult: expanded
      };
    } catch {
      // fallback
    }
  }

  // General simplification / expansion via mathjs
  try {
    const simplified = math.simplify(clean).toString();
    steps.push(`Combined like terms and simplified: ${simplified}`);
    return {
      title: 'Simplified Expression',
      summary: 'Combined like terms and evaluated operations.',
      steps,
      finalResult: simplified
    };
  } catch (err: any) {
    return {
      title: 'Expression Processed',
      summary: 'Processed input expression.',
      steps: [clean, 'Could not automatically expand further.'],
      finalResult: clean
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. POLYNOMIALS & ZERO POLYNOMIAL TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solvePolynomial(input: string): SolverOutput {
  const clean = input.trim();
  const steps: string[] = [`Polynomial: ${clean}`];

  // Zero polynomial check
  if (clean === '0' || clean.toLowerCase() === 'p(x) = 0' || clean.toLowerCase() === 'p(x)=0' || /^0x?(\^?\d+)?(\s*[+-]\s*0x?(\^?\d+)?)*$/.test(clean)) {
    return {
      title: 'Zero Polynomial Analysis (P(x) = 0)',
      summary: 'Every coefficient in the Zero Polynomial is identically zero.',
      steps: [
        'Polynomial: P(x) = 0',
        'Every coefficient is zero: aₙ = 0 for all n',
        'Degree: Undefined (or formally defined as -∞ by convention)',
        'Key Distinction: Constant polynomials c ≠ 0 have degree 0 (e.g. P(x) = 5 = 5x⁰), but P(x) = 0 has NO non-zero leading coefficient',
        'Roots: Every real and complex number is a root! For any c, P(c) = 0',
        'Additive Identity: P(x) + Q(x) = Q(x) for all polynomials Q(x)'
      ],
      finalResult: 'P(x) = 0 (Degree: Undefined / -∞, Infinitely many roots)',
      details: {
        Classification: 'Zero Polynomial',
        Degree: 'Undefined (-∞)',
        'Number of Roots': 'Infinite (All real numbers)'
      }
    };
  }

  // Check if polynomial division: P(x) / (x - c)
  const divMatch = clean.match(/^(.+?)\s*\/\s*\(\s*([a-zA-Z])\s*([+-])\s*(\d+(?:\.\d+)?)\s*\)$/);
  if (divMatch) {
    const dividendStr = divMatch[1].replace(/^\(|\)$/g, '');
    const variable = divMatch[2];
    const sign = divMatch[3];
    const cVal = parseFloat(divMatch[4]) * (sign === '-' ? 1 : -1);

    steps.push(`Polynomial Division: (${dividendStr}) ÷ (${variable} ${sign} ${divMatch[4]})`);
    steps.push(`Divisor form: (${variable} - c) with c = ${cVal}`);
    steps.push(`By the Remainder Theorem, the remainder is P(${cVal}).`);

    try {
      const parsed = math.parse(dividendStr);
      const compiled = parsed.compile();
      const remainder = compiled.evaluate({ [variable]: cVal });

      steps.push(`Evaluating remainder: P(${cVal}) = ${remainder}`);
      if (Math.abs(remainder) < 1e-9) {
        steps.push(`Remainder is 0! Therefore, (${variable} ${sign} ${divMatch[4]}) is an EXACT factor of the polynomial.`);
      } else {
        steps.push(`Remainder is ${remainder} ≠ 0 (not an exact factor).`);
      }

      return {
        title: 'Polynomial Division & Remainder Theorem',
        summary: `Evaluated division using Remainder Theorem at c = ${cVal}.`,
        steps,
        finalResult: `Remainder R = ${remainder}`,
        details: { Divisor: `${variable} - (${cVal})`, Remainder: remainder, 'Is Factor': Math.abs(remainder) < 1e-9 }
      };
    } catch {
      // Continue to general analysis
    }
  }

  // General polynomial degree & coefficient analysis
  // Find highest exponent of x
  const powers = Array.from(clean.matchAll(/x(?:\^(\d+))?/g)).map((m) => (m[1] ? parseInt(m[1], 10) : 1));
  const degree = powers.length > 0 ? Math.max(...powers) : 0;

  const typeName =
    degree === 0
      ? 'Constant Polynomial'
      : degree === 1
      ? 'Linear Polynomial'
      : degree === 2
      ? 'Quadratic Polynomial'
      : degree === 3
      ? 'Cubic Polynomial'
      : degree === 4
      ? 'Quartic Polynomial'
      : `Polynomial of Degree ${degree}`;

  steps.push(`Degree: ${degree} (highest exponent of variable)`);
  steps.push(`Classification: ${typeName}`);

  return {
    title: 'Polynomial Properties',
    summary: `Analyzed degree, leading term, and polynomial type.`,
    steps,
    finalResult: `Degree: ${degree} (${typeName})`,
    details: { Degree: degree, Classification: typeName }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RADICALS TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveRadicals(input: string): SolverOutput {
  const clean = input.trim();
  const steps: string[] = [`Radical Expression: ${clean}`];

  // Pattern: sqrt(N)
  const sqrtNumMatch = clean.match(/^sqrt\((\d+)\)$/i);
  if (sqrtNumMatch) {
    const n = parseInt(sqrtNumMatch[1], 10);
    steps.push(`Simplifying √${n}:`);

    // Find largest perfect square factor
    let outside = 1;
    let inside = n;
    for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
      if (inside % (i * i) === 0) {
        outside *= i;
        inside /= i * i;
        steps.push(`Extracted perfect square factor: ${i}² = ${i * i} (leaves ${inside})`);
        break;
      }
    }

    if (outside > 1 && inside === 1) {
      steps.push(`√${n} is a perfect square: ${outside}`);
      return {
        title: 'Radical Simplification',
        summary: `Computed integer square root of perfect square ${n}.`,
        steps,
        finalResult: `${outside}`,
        details: { Radicand: n, Result: outside }
      };
    } else if (outside > 1) {
      const res = `${outside}√${inside}`;
      steps.push(`Final simplified radical: ${res}`);
      return {
        title: 'Radical Simplification',
        summary: `Extracted highest square factor to simplify √${n}.`,
        steps,
        finalResult: res,
        details: { Outside: outside, Inside: inside, Simplified: res }
      };
    } else {
      steps.push(`√${n} has no square factors greater than 1. It is already in simplest form.`);
      return {
        title: 'Radical In Simplest Form',
        summary: `No square factors can be extracted from √${n}.`,
        steps,
        finalResult: `√${n}`
      };
    }
  }

  // Pattern: 1 / sqrt(N) rationalization
  const ratMatch = clean.match(/^(\d+)?\s*\/\s*sqrt\((\d+)\)$/i);
  if (ratMatch) {
    const num = ratMatch[1] ? parseInt(ratMatch[1], 10) : 1;
    const den = parseInt(ratMatch[2], 10);
    steps.push(`Rationalizing denominator for ${num} / √${den}:`);
    steps.push(`Multiply numerator and denominator by √${den}:`);
    steps.push(`= (${num} · √${den}) / (√${den} · √${den})`);
    steps.push(`= (${num}√${den}) / ${den}`);

    const gcdVal = math.gcd(num, den);
    const redNum = num / gcdVal;
    const redDen = den / gcdVal;

    let res = '';
    if (redDen === 1) {
      res = redNum === 1 ? `√${den}` : `${redNum}√${den}`;
    } else {
      res = redNum === 1 ? `√${den} / ${redDen}` : `(${redNum}√${den}) / ${redDen}`;
    }

    steps.push(`Reduced result: ${res}`);
    return {
      title: 'Rationalized Denominator',
      summary: `Eliminated radical from denominator.`,
      steps,
      finalResult: res
    };
  }

  // Radical equation: sqrt(ax + b) = c
  const eqMatch = clean.match(/^sqrt\(\s*(\d*)x\s*([+-])\s*(\d+)\s*\)\s*=\s*(\d+)$/i);
  if (eqMatch) {
    const a = eqMatch[1] ? parseInt(eqMatch[1], 10) : 1;
    const sign = eqMatch[2];
    const b = parseInt(eqMatch[3], 10) * (sign === '-' ? -1 : 1);
    const c = parseInt(eqMatch[4], 10);

    steps.push(`Solving radical equation: √( ${a}x ${b >= 0 ? '+' : ''}${b} ) = ${c}`);
    steps.push(`Step 1: Square both sides: (√( ${a}x ${b >= 0 ? '+' : ''}${b} ))² = ${c}²`);
    const cSq = c * c;
    steps.push(`Step 2: ${a}x ${b >= 0 ? '+' : ''}${b} = ${cSq}`);
    const rhsVal = cSq - b;
    steps.push(`Step 3: Subtract ${b} from both sides: ${a}x = ${rhsVal}`);
    const xVal = rhsVal / a;
    steps.push(`Step 4: Divide by ${a}: x = ${xVal}`);
    steps.push(`Step 5: Verify in original equation: √( ${a}(${xVal}) ${b >= 0 ? '+' : ''}${b} ) = √${cSq} = ${c} (Valid!)`);

    return {
      title: 'Radical Equation Solution',
      summary: `Squared both sides and solved for x with verification.`,
      steps,
      finalResult: `x = ${xVal}`,
      details: { Solution: xVal }
    };
  }

  return {
    title: 'Radical Expression',
    summary: `Processed radical input.`,
    steps: [clean, 'Evaluated using radical rules.'],
    finalResult: clean
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. QUADRATIC TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveQuadratic(input: string): SolverOutput {
  const clean = input.replace(/\s+/g, '');
  const steps: string[] = [`Quadratic Equation: ${input}`];

  // Try parsing ax^2 + bx + c = 0 or y = ax^2 + bx + c
  let expr = clean;
  if (expr.includes('=')) {
    const parts = expr.split('=');
    if (parts[0] === 'y' || parts[0] === 'f(x)') {
      expr = parts[1];
    } else if (parts[1] === '0') {
      expr = parts[0];
    } else {
      expr = `(${parts[0]}) - (${parts[1]})`;
    }
  }

  let a = 1;
  let b = 0;
  let c = 0;

  try {
    const node = math.parse(expr);
    const compiled = node.compile();

    const y0 = compiled.evaluate({ x: 0 });
    const y1 = compiled.evaluate({ x: 1 });
    const y_1 = compiled.evaluate({ x: -1 });

    c = Number(y0);
    a = Number((y1 + y_1 - 2 * y0) / 2);
    b = Number((y1 - y_1) / 2);
  } catch {
    // regex fallback for ax^2 + bx + c
    const match = clean.match(/([+-]?\d*(?:\.\d+)?)?x\^2(?:\s*([+-]\s*\d*(?:\.\d+)?)\s*x)?(?:\s*([+-]\s*\d+(?:\.\d+)?))?/);
    if (match) {
      const rawA = match[1];
      if (rawA === '-' || rawA === '-1') a = -1;
      else if (rawA && rawA !== '+') a = parseFloat(rawA);

      if (match[2]) {
        const rawB = match[2].replace(/\s+/g, '');
        if (rawB === '+' || rawB === '+1') b = 1;
        else if (rawB === '-' || rawB === '-1') b = -1;
        else b = parseFloat(rawB);
      }
      if (match[3]) c = parseFloat(match[3].replace(/\s+/g, ''));
    }
  }

  if (Math.abs(a) < 1e-9) {
    return {
      title: 'Degenerate Equation',
      summary: 'The coefficient a is 0, so this is a linear equation, not quadratic.',
      steps: ['Quadratic coefficient a = 0'],
      finalResult: 'Linear Equation'
    };
  }

  steps.push(`Standard Form: ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`);
  steps.push(`Coefficients: a = ${a}, b = ${b}, c = ${c}`);

  // Discriminant
  const disc = b * b - 4 * a * c;
  steps.push(`Calculate Discriminant: Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${disc}`);

  let nature = '';
  let roots: string[] = [];

  if (disc > 0) {
    nature = 'Two distinct real roots';
    const r1 = (-b + Math.sqrt(disc)) / (2 * a);
    const r2 = (-b - Math.sqrt(disc)) / (2 * a);
    roots = [`x₁ = ${Number(r1.toFixed(4))}`, `x₂ = ${Number(r2.toFixed(4))}`];
    steps.push(`Since Δ > 0: ${nature}`);
    steps.push(`x = [-b ± √Δ] / 2a = [-(${b}) ± √${disc}] / ${2 * a}`);
    steps.push(`Roots: ${roots.join(', ')}`);
  } else if (disc === 0) {
    nature = 'One repeated real root (vertex touches x-axis)';
    const r = -b / (2 * a);
    roots = [`x = ${Number(r.toFixed(4))}`];
    steps.push(`Since Δ = 0: ${nature}`);
    steps.push(`x = -b / 2a = -(${b}) / ${2 * a} = ${Number(r.toFixed(4))}`);
  } else {
    nature = 'Two complex conjugate roots';
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-disc) / (2 * Math.abs(a));
    roots = [
      `x₁ = ${Number(realPart.toFixed(4))} + ${Number(imagPart.toFixed(4))}i`,
      `x₂ = ${Number(realPart.toFixed(4))} - ${Number(imagPart.toFixed(4))}i`
    ];
    steps.push(`Since Δ < 0: ${nature}`);
    steps.push(`Roots: ${roots.join(', ')}`);
  }

  // Vertex and Axis of Symmetry
  const h = -b / (2 * a);
  const k = c - (b * b) / (4 * a);
  steps.push(`Vertex Coordinates: (h, k) = (${Number(h.toFixed(3))}, ${Number(k.toFixed(3))})`);
  steps.push(`Axis of Symmetry: x = ${Number(h.toFixed(3))}`);
  steps.push(`Parabola opens: ${a > 0 ? 'UPWARD (Minimum vertex)' : 'DOWNWARD (Maximum vertex)'}`);

  return {
    title: 'Complete Quadratic Solution',
    summary: `Solved using quadratic formula with discriminant Δ = ${disc}.`,
    steps,
    finalResult: roots.join(' | '),
    details: {
      'Coefficient a': a,
      'Coefficient b': b,
      'Coefficient c': c,
      Discriminant: disc,
      'Nature of Roots': nature,
      Vertex: `(${Number(h.toFixed(2))}, ${Number(k.toFixed(2))})`,
      'Axis of Symmetry': `x = ${Number(h.toFixed(2))}`,
      Direction: a > 0 ? 'Upward' : 'Downward'
    },
    visualData: { a, b, c, h, k, disc }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. LINEAR TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveLinear(input: string): SolverOutput {
  const clean = input.trim();
  const steps: string[] = [`Linear Equation: ${clean}`];

  // If y = mx + b
  const slopeIntercept = clean.match(/^y\s*=\s*([+-]?\d*(?:\.\d+)?)?\s*\*?\s*x(?:\s*([+-])\s*(\d+(?:\.\d+)?))?$/i);
  if (slopeIntercept) {
    const rawM = slopeIntercept[1];
    let m = 1;
    if (rawM === '-' || rawM === '-1') m = -1;
    else if (rawM && rawM !== '+') m = parseFloat(rawM);

    let b = 0;
    if (slopeIntercept[2] && slopeIntercept[3]) {
      b = parseFloat(slopeIntercept[3]) * (slopeIntercept[2] === '-' ? -1 : 1);
    }

    steps.push(`Identified slope-intercept form: y = mx + b`);
    steps.push(`Slope m = ${m} (rise/run)`);
    steps.push(`y-intercept = (0, ${b})`);
    if (m !== 0) {
      const xInt = -b / m;
      steps.push(`x-intercept = (${Number(xInt.toFixed(3))}, 0)`);
    }

    return {
      title: 'Slope-Intercept Analysis',
      summary: `Extracted slope, intercepts, and line behavior.`,
      steps,
      finalResult: `Slope: ${m}, y-intercept: (0, ${b})`,
      details: {
        Slope: m,
        'y-intercept': `(0, ${b})`,
        'x-intercept': m !== 0 ? `(${Number((-b / m).toFixed(2))}, 0)` : 'None (Horizontal)'
      },
      visualData: { m, b }
    };
  }

  // Fallback to one variable linear solver
  return solveBasics(clean);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SYSTEMS OF EQUATIONS TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveSystem(eq1: string, eq2: string): SolverOutput {
  const parseLinearEq = (str: string) => {
    // ax + by = c
    const clean = str.replace(/\s+/g, '');
    let [lhs, rhs] = clean.split('=');
    if (!rhs) rhs = '0';
    const c = parseFloat(rhs) || 0;

    let a = 0;
    let b = 0;

    const xMatch = lhs.match(/([+-]?\d*(?:\.\d+)?)?x/i);
    if (xMatch) {
      if (xMatch[1] === '-' || xMatch[1] === '-1') a = -1;
      else if (!xMatch[1] || xMatch[1] === '+') a = 1;
      else a = parseFloat(xMatch[1]);
    }

    const yMatch = lhs.match(/([+-]?\d*(?:\.\d+)?)?y/i);
    if (yMatch) {
      if (yMatch[1] === '-' || yMatch[1] === '-1') b = -1;
      else if (!yMatch[1] || yMatch[1] === '+') b = 1;
      else b = parseFloat(yMatch[1]);
    }

    return { a, b, c };
  };

  const l1 = parseLinearEq(eq1);
  const l2 = parseLinearEq(eq2);

  const steps = [
    `Equation [1]: ${eq1} ⟹ (${l1.a})x + (${l1.b})y = ${l1.c}`,
    `Equation [2]: ${eq2} ⟹ (${l2.a})x + (${l2.b})y = ${l2.c}`
  ];

  // Cramer's rule determinant: D = a1*b2 - a2*b1
  const D = l1.a * l2.b - l2.a * l1.b;
  const Dx = l1.c * l2.b - l2.c * l1.b;
  const Dy = l1.a * l2.c - l2.a * l1.c;

  steps.push(`Determinant D = a₁b₂ - a₂b₁ = (${l1.a})(${l2.b}) - (${l2.a})(${l1.b}) = ${D}`);

  if (Math.abs(D) < 1e-9) {
    if (Math.abs(Dx) < 1e-9 && Math.abs(Dy) < 1e-9) {
      steps.push('D = 0 and Dx = Dy = 0: Both equations describe the exact same line.');
      steps.push('Result: Infinitely Many Solutions (Dependent System)');
      return {
        title: 'System of Equations: Coincident',
        summary: 'Both equations represent the identical line.',
        steps,
        finalResult: 'Infinitely Many Solutions',
        details: { Status: 'Infinitely Many Solutions', Determinant: 0 }
      };
    } else {
      steps.push('D = 0 but Dx ≠ 0: The two lines are parallel with different intercepts.');
      steps.push('Result: No Solution (Inconsistent System)');
      return {
        title: 'System of Equations: Parallel Lines',
        summary: 'Lines are parallel and never intersect.',
        steps,
        finalResult: 'No Solution',
        details: { Status: 'No Solution', Determinant: 0 }
      };
    }
  }

  const x = Dx / D;
  const y = Dy / D;

  steps.push(`Cramer's Rule: Dx = c₁b₂ - c₂b₁ = ${Dx}, Dy = a₁c₂ - a₂c₁ = ${Dy}`);
  steps.push(`x = Dx / D = ${Dx} / ${D} = ${Number(x.toFixed(4))}`);
  steps.push(`y = Dy / D = ${Dy} / ${D} = ${Number(y.toFixed(4))}`);
  steps.push(`Intersection Point: (${Number(x.toFixed(4))}, ${Number(y.toFixed(4))})`);

  return {
    title: 'Simultaneous System Solution',
    summary: `Found unique intersection at (${Number(x.toFixed(2))}, ${Number(y.toFixed(2))}).`,
    steps,
    finalResult: `(x, y) = (${Number(x.toFixed(2))}, ${Number(y.toFixed(2))})`,
    details: {
      'x-coordinate': Number(x.toFixed(4)),
      'y-coordinate': Number(y.toFixed(4)),
      Determinant: D
    },
    visualData: { l1, l2, x, y }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. INEQUALITIES TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveInequality(input: string): SolverOutput {
  const clean = input.trim();
  const steps: string[] = [`Inequality: ${clean}`];

  // Match ax + b <= c
  const match = clean.match(/^([+-]?\d*(?:\.\d+)?)?\s*\*?\s*x(?:\s*([+-])\s*(\d+(?:\.\d+)?))?\s*(<=|>=|<|>)\s*([+-]?\d+(?:\.\d+)?)$/);
  if (match) {
    const rawA = match[1];
    let a = 1;
    if (rawA === '-' || rawA === '-1') a = -1;
    else if (rawA && rawA !== '+') a = parseFloat(rawA);

    let b = 0;
    if (match[2] && match[3]) {
      b = parseFloat(match[3]) * (match[2] === '-' ? -1 : 1);
    }

    let sign = match[4];
    const c = parseFloat(match[5]);

    steps.push(`Isolating x from: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} ${sign} ${c}`);
    const rhsVal = c - b;
    steps.push(`Subtract constant ${b}: ${a}x ${sign} ${rhsVal}`);

    let finalSign = sign;
    if (a < 0) {
      // SIGN FLIP
      if (sign === '<=') finalSign = '>=';
      else if (sign === '>=') finalSign = '<=';
      else if (sign === '<') finalSign = '>';
      else if (sign === '>') finalSign = '<';

      steps.push(`CRITICAL RULE: Dividing by negative coefficient (${a}) reverses the inequality sign from ${sign} to ${finalSign}!`);
    }

    const bound = rhsVal / a;
    steps.push(`Divide by ${a}: x ${finalSign} ${Number(bound.toFixed(3))}`);

    let interval = '';
    if (finalSign === '<=') interval = `(-∞, ${Number(bound.toFixed(3))}]`;
    else if (finalSign === '<') interval = `(-∞, ${Number(bound.toFixed(3))})`;
    else if (finalSign === '>=') interval = `[${Number(bound.toFixed(3))}, ∞)`;
    else if (finalSign === '>') interval = `(${Number(bound.toFixed(3))}, ∞)`;

    steps.push(`Interval Notation: ${interval}`);

    return {
      title: 'Inequality Solution & Interval',
      summary: `Solved linear inequality with boundary at ${Number(bound.toFixed(2))}.`,
      steps,
      finalResult: `x ${finalSign} ${Number(bound.toFixed(2))}  ${interval}`,
      details: {
        Inequality: `x ${finalSign} ${Number(bound.toFixed(2))}`,
        'Interval Notation': interval,
        'Sign Flipped': a < 0
      },
      visualData: { bound, sign: finalSign }
    };
  }

  return {
    title: 'Inequality Solution',
    summary: 'Evaluated inequality constraint.',
    steps: [clean, 'Could not parse into simple linear format.'],
    finalResult: clean
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. SEQUENCES TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveSequence(input: string): SolverOutput {
  const clean = input.trim();
  const steps: string[] = [`Sequence Input: ${clean}`];

  // Parse comma-separated numbers
  const nums = clean.split(',').map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
  if (nums.length >= 3) {
    const a1 = nums[0];
    const d1 = nums[1] - nums[0];
    const d2 = nums[2] - nums[1];

    const r1 = nums[0] !== 0 ? nums[1] / nums[0] : null;
    const r2 = nums[1] !== 0 ? nums[2] / nums[1] : null;

    if (Math.abs(d1 - d2) < 1e-7) {
      // Arithmetic
      const d = d1;
      steps.push(`Common difference d = ${nums[1]} - ${nums[0]} = ${d}`);
      steps.push(`Classification: Arithmetic Sequence (AP)`);
      steps.push(`Explicit Formula: aₙ = a₁ + (n - 1)d = ${a1} + (n - 1)·(${d})`);

      const nextTerms = [a1 + 3 * d, a1 + 4 * d, a1 + 5 * d];
      steps.push(`Next 3 terms: ${nextTerms.join(', ')}`);

      const S10 = (10 / 2) * (2 * a1 + 9 * d);
      steps.push(`Sum of first 10 terms (S₁₀): (10/2) · (2(${a1}) + 9(${d})) = ${S10}`);

      return {
        title: 'Arithmetic Progression Analysis',
        summary: `Identified common difference d = ${d}.`,
        steps,
        finalResult: `aₙ = ${a1} + (n - 1)(${d})`,
        details: { Type: 'Arithmetic', 'First Term (a1)': a1, 'Common Difference (d)': d, 'Sum S10': S10 }
      };
    } else if (r1 !== null && r2 !== null && Math.abs(r1 - r2) < 1e-7) {
      // Geometric
      const r = r1;
      steps.push(`Common ratio r = ${nums[1]} / ${nums[0]} = ${r}`);
      steps.push(`Classification: Geometric Sequence (GP)`);
      steps.push(`Explicit Formula: aₙ = a₁ · rⁿ⁻¹ = ${a1} · (${r})ⁿ⁻¹`);

      const nextTerms = [a1 * Math.pow(r, 3), a1 * Math.pow(r, 4), a1 * Math.pow(r, 5)];
      steps.push(`Next 3 terms: ${nextTerms.map((t) => Number(t.toFixed(4))).join(', ')}`);

      if (Math.abs(r) < 1) {
        const sInf = a1 / (1 - r);
        steps.push(`Since |r| = ${Math.abs(r)} < 1, the infinite series converges to:`);
        steps.push(`S_∞ = a₁ / (1 - r) = ${a1} / (1 - ${r}) = ${Number(sInf.toFixed(4))}`);
      }

      return {
        title: 'Geometric Progression Analysis',
        summary: `Identified common ratio r = ${r}.`,
        steps,
        finalResult: `aₙ = ${a1} · (${r})ⁿ⁻¹`,
        details: { Type: 'Geometric', 'First Term (a1)': a1, 'Common Ratio (r)': r }
      };
    }
  }

  return {
    title: 'Sequence Analysis',
    summary: 'Enter at least 3 comma-separated numbers (e.g. 3, 7, 11, 15).',
    steps: ['Provide sequence numbers separated by commas.'],
    finalResult: clean
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. FUNCTIONS TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveFunction(funcStr: string, inputVal: number = 3): SolverOutput {
  const clean = funcStr.replace(/^f\(x\)\s*=\s*/i, '').trim();
  const steps = [`Function rule: f(x) = ${clean}`, `Evaluating at input x = ${inputVal}:`];

  try {
    const parsed = math.parse(clean);
    const compiled = parsed.compile();
    const result = compiled.evaluate({ x: inputVal });

    steps.push(`f(${inputVal}) = ${clean.replace(/x/g, `(${inputVal})`)}`);
    steps.push(`Output: ${result}`);

    return {
      title: 'Function Evaluation',
      summary: `Computed output f(${inputVal}) = ${result}.`,
      steps,
      finalResult: `f(${inputVal}) = ${result}`,
      details: { 'Input x': inputVal, 'Output f(x)': result }
    };
  } catch (err: any) {
    return {
      title: 'Function Evaluation Error',
      summary: 'Could not evaluate function.',
      steps: [err.message || 'Error'],
      finalResult: 'Evaluation Error'
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPONENTS & LOGS TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveExpLogs(input: string): SolverOutput {
  const clean = input.trim();
  const steps: string[] = [`Input: ${clean}`];

  // Pattern logB(X)
  const logMatch = clean.match(/^log(\d+)?\((.+?)\)$/i);
  if (logMatch) {
    const base = logMatch[1] ? parseFloat(logMatch[1]) : 10;
    const arg = parseFloat(logMatch[2]);
    if (!isNaN(arg) && arg > 0) {
      const val = Math.log(arg) / Math.log(base);
      steps.push(`Logarithmic Form: log_${base}(${arg})`);
      steps.push(`Exponential Bridge: ${base}^y = ${arg} ⟹ y = ${Number(val.toFixed(4))}`);
      steps.push(`Change of Base: ln(${arg}) / ln(${base}) = ${Number(val.toFixed(4))}`);

      return {
        title: 'Logarithm Evaluation',
        summary: `Evaluated log base ${base} of ${arg}.`,
        steps,
        finalResult: `log_${base}(${arg}) = ${Number(val.toFixed(4))}`
      };
    }
  }

  // Pattern b^x = c
  const expEqMatch = clean.match(/^(\d+)\^x\s*=\s*(\d+)$/i);
  if (expEqMatch) {
    const b = parseFloat(expEqMatch[1]);
    const c = parseFloat(expEqMatch[2]);
    const xVal = Math.log(c) / Math.log(b);

    steps.push(`Exponential equation: ${b}^x = ${c}`);
    steps.push(`Convert to logarithmic form: x = log_${b}(${c})`);
    steps.push(`x = ln(${c}) / ln(${b}) = ${Number(xVal.toFixed(4))}`);

    return {
      title: 'Exponential Equation Solution',
      summary: `Solved ${b}^x = ${c} via logarithms.`,
      steps,
      finalResult: `x = ${Number(xVal.toFixed(4))}`
    };
  }

  return {
    title: 'Exponents & Logarithms',
    summary: 'Evaluated exponent expression.',
    steps: [clean],
    finalResult: clean
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. RATIONAL EXPRESSIONS TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveRational(input: string): SolverOutput {
  const clean = input.trim();
  const steps = [`Rational Expression: ${clean}`];

  // (x^2 - a^2)/(x - a)
  const matchDiffSq = clean.match(/^\(\s*x\^2\s*-\s*(\d+)\s*\)\s*\/\s*\(\s*x\s*([+-])\s*(\d+)\s*\)$/i);
  if (matchDiffSq) {
    const aSq = parseFloat(matchDiffSq[1]);
    const sign = matchDiffSq[2];
    const denomVal = parseFloat(matchDiffSq[3]);
    const a = Math.sqrt(aSq);

    steps.push(`Numerator is difference of squares: x² - ${aSq} = (x - ${a})(x + ${a})`);
    steps.push(`Denominator is (x ${sign} ${denomVal})`);
    const excluded = sign === '-' ? denomVal : -denomVal;
    steps.push(`Domain Restriction: Denominator ≠ 0 ⟹ x ≠ ${excluded}`);

    if (Math.abs(a - denomVal) < 1e-9) {
      const remainingSign = sign === '-' ? '+' : '-';
      steps.push(`Cancel common factor (x ${sign} ${denomVal}) from numerator and denominator`);
      const finalExp = `x ${remainingSign} ${a}`;
      steps.push(`Simplified Result: ${finalExp} (for x ≠ ${excluded})`);

      return {
        title: 'Rational Simplification & Excluded Values',
        summary: `Factored difference of squares and cancelled common factor.`,
        steps,
        finalResult: `${finalExp} (x ≠ ${excluded})`,
        details: { 'Excluded Value': `x ≠ ${excluded}`, 'Simplified Form': finalExp }
      };
    }
  }

  return {
    title: 'Rational Expression Analysis',
    summary: 'Analyzed rational fraction and domain restrictions.',
    steps: [clean, 'Check denominator for zeros to find domain restrictions.'],
    finalResult: clean
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. COMPLEX NUMBERS TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveComplex(input: string): SolverOutput {
  const clean = input.trim().replace(/\s+/g, '');
  const steps: string[] = [`Complex Number: ${clean}`];

  // Parse a + bi
  const match = clean.match(/^([+-]?\d*(?:\.\d+)?)\s*([+-])\s*(\d*(?:\.\d+)?)?i$/i);
  if (match) {
    const a = parseFloat(match[1]) || 0;
    const sign = match[2];
    let b = match[3] ? parseFloat(match[3]) : 1;
    if (sign === '-') b = -b;

    steps.push(`Standard Form: z = a + bi`);
    steps.push(`Real Part: Re(z) = ${a}`);
    steps.push(`Imaginary Part: Im(z) = ${b}`);

    const mod = Math.sqrt(a * a + b * b);
    steps.push(`Modulus (Distance from Origin): |z| = √(a² + b²) = √(${a}² + ${b}²) = √${a * a + b * b} = ${Number(mod.toFixed(4))}`);

    const conj = `${a} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}i`;
    steps.push(`Complex Conjugate: z* = a - bi = ${conj}`);
    steps.push(`Conjugate Product: z · z* = a² + b² = ${a * a + b * b} (Always real!)`);

    return {
      title: 'Complex Number Analysis',
      summary: `Analyzed standard form, conjugate, and modulus on the complex plane.`,
      steps,
      finalResult: `|z| = ${Number(mod.toFixed(3))}, Conjugate = ${conj}`,
      details: {
        'Real Part (a)': a,
        'Imaginary Part (b)': b,
        'Modulus |z|': Number(mod.toFixed(3)),
        Conjugate: conj
      },
      visualData: { a, b, mod }
    };
  }

  return {
    title: 'Complex Number Analysis',
    summary: 'Analyzed complex input.',
    steps: [clean, 'Supported format: a + bi (e.g. 3 + 4i)'],
    finalResult: clean
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. MATRICES TOOL
// ─────────────────────────────────────────────────────────────────────────────
export function solveMatrix(input: string): SolverOutput {
  const clean = input.trim();
  const steps: string[] = [`Matrix Input: ${clean}`];

  // Try parsing 2x2: [[a, b], [c, d]]
  try {
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed) && parsed.length === 2 && Array.isArray(parsed[0]) && parsed[0].length === 2) {
      const a = Number(parsed[0][0]);
      const b = Number(parsed[0][1]);
      const c = Number(parsed[1][0]);
      const d = Number(parsed[1][1]);

      steps.push(`Matrix A:\n[ ${a}  ${b} ]\n[ ${c}  ${d} ]`);
      const det = a * d - b * c;
      steps.push(`Determinant: det(A) = ad - bc = (${a})(${d}) - (${b})(${c}) = ${det}`);

      if (det === 0) {
        steps.push(`det(A) = 0: Matrix is SINGULAR (not invertible).`);
        return {
          title: 'Matrix Determinant (Singular)',
          summary: 'Matrix has determinant 0 and no inverse exists.',
          steps,
          finalResult: 'det(A) = 0 (Singular)',
          details: { Determinant: 0, Invertible: false }
        };
      }

      steps.push(`det(A) ≠ 0: Matrix is INVERTIBLE.`);
      steps.push(`Inverse Formula: A⁻¹ = (1 / det) · [ d  -b ; -c  a ]`);
      const invA = Number((d / det).toFixed(3));
      const invB = Number((-b / det).toFixed(3));
      const invC = Number((-c / det).toFixed(3));
      const invD = Number((a / det).toFixed(3));

      steps.push(`A⁻¹ = [ ${invA}  ${invB} ; ${invC}  ${invD} ]`);

      return {
        title: 'Matrix Determinant & Inverse',
        summary: `Computed det(A) = ${det} and 2x2 inverse matrix.`,
        steps,
        finalResult: `det(A) = ${det}`,
        details: { Determinant: det, Invertible: true, 'Inverse A⁻¹': `[${invA}, ${invB} ; ${invC}, ${invD}]` },
        visualData: { a, b, c, d, det }
      };
    }
  } catch {
    // fallback
  }

  return {
    title: 'Matrix Calculation',
    summary: 'Enter a 2x2 matrix as [[a, b], [c, d]] (e.g. [[4, 2], [3, 2]]).',
    steps: [clean],
    finalResult: clean
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────
export function dispatchSolve(toolType: ToolType, eq1: string, eq2?: string, pointVal?: number): SolverOutput {
  switch (toolType) {
    case 'basics_analyzer':
      return solveBasics(eq1);
    case 'expressions_tool':
      return solveExpressions(eq1);
    case 'polynomial_tool':
      return solvePolynomial(eq1);
    case 'zero_poly_tool':
      return solvePolynomial('0');
    case 'radicals_tool':
      return solveRadicals(eq1);
    case 'quadratic_tool':
      return solveQuadratic(eq1);
    case 'linear_tool':
      return solveLinear(eq1);
    case 'systems_tool':
      return solveSystem(eq1, eq2 || '2x - y = 5');
    case 'inequality_tool':
      return solveInequality(eq1);
    case 'sequences_tool':
      return solveSequence(eq1);
    case 'functions_tool':
      return solveFunction(eq1, pointVal ?? 3);
    case 'exponents_logs_tool':
      return solveExpLogs(eq1);
    case 'rational_tool':
      return solveRational(eq1);
    case 'complex_tool':
      return solveComplex(eq1);
    case 'matrix_tool':
      return solveMatrix(eq1);
    default:
      return solveBasics(eq1);
  }
}
