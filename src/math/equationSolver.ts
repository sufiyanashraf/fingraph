import * as math from 'mathjs';

export interface SolverResult {
  equation: string;
  type: 'linear' | 'quadratic' | 'unsupported' | 'error';
  solutions: string[];
  discriminant?: number;
  explanation: string[];
}

export function solveEquation(equationStr: string): SolverResult {
  try {
    const sides = equationStr.split('=');
    if (sides.length !== 2) {
      throw new Error("Equation must have exactly one '=' sign.");
    }

    const [lhs, rhs] = sides;
    
    // We want to solve LHS - RHS = 0
    const expressionStr = `(${lhs}) - (${rhs})`;
    
    // Using math.rationalize to get polynomial coefficients
    // rationalize returns an object with coefficients if we pass true as 3rd arg, but wait
    // math.rationalize('x^2 - 5x + 6', {}, true) is not a standard signature in all mathjs versions.
    // Let's use a simpler approach. Evaluate the expression at different points to find coefficients.
    
    const node = math.parse(expressionStr);
    const compiled = node.compile();
    
    // Find variables
    const vars = node.filter(n => (n as any).isSymbolNode && (n as any).name !== 'e' && (n as any).name !== 'pi');
    const varNames = Array.from(new Set(vars.map((v: any) => v.name)));
    
    if (varNames.length > 1) {
      return {
        equation: equationStr,
        type: 'unsupported',
        solutions: [],
        explanation: ['Multiple variables are not supported in this version.']
      };
    }
    
    const xName = varNames.length === 1 ? varNames[0] : 'x';
    
    // Evaluate at x = 0, 1, 2, -1 to determine degree
    const evalAt = (val: number) => compiled.evaluate({ [xName]: val });
    
    const y0 = evalAt(0);
    const y1 = evalAt(1);
    const y2 = evalAt(2);
    const y_1 = evalAt(-1);
    const y3 = evalAt(3);

    // If y is constant, degree = 0
    // If dy is constant, degree = 1
    // If d2y is constant, degree = 2
    
    const d1_1 = y1 - y0;
    const d1_2 = y2 - y1;
    const d1_3 = y3 - y2;
    
    const d2_1 = d1_2 - d1_1;
    const d2_2 = d1_3 - d1_2;

    const isLinear = Math.abs(d1_2 - d1_1) < 1e-10;
    const isQuadratic = !isLinear && Math.abs(d2_2 - d2_1) < 1e-10;

    if (isLinear) {
      const c = y0; // intercept
      const m = d1_1; // slope
      
      if (Math.abs(m) < 1e-10) {
        if (Math.abs(c) < 1e-10) {
          return {
            equation: equationStr, type: 'linear', solutions: ['All real numbers'], explanation: ['Equation simplifies to 0 = 0.']
          };
        } else {
          return {
            equation: equationStr, type: 'linear', solutions: ['No solution'], explanation: ['Equation is a contradiction (e.g., 1 = 0).']
          };
        }
      }
      
      const x = -c / m;
      return {
        equation: equationStr,
        type: 'linear',
        solutions: [`${xName} = ${math.format(x, {precision: 14})}`],
        explanation: [
          `Step 1: Move all terms to one side to form f(${xName}) = 0.`,
          `Step 2: Simplify the expression to standard linear form: ${math.format(m)}*${xName} + ${math.format(c)} = 0`,
          `Step 3: Subtract the constant term (${math.format(c)}) from both sides: ${math.format(m)}*${xName} = ${math.format(-c)}`,
          `Step 4: Divide both sides by the coefficient of ${xName} (${math.format(m)}).`,
          `Result: ${xName} = ${math.format(-c)} / ${math.format(m)} = ${math.format(x)}`
        ]
      };
    } else if (isQuadratic) {
      // y = ax^2 + bx + c
      const c = y0;
      // y1 = a + b + c => a + b = y1 - c
      // y_1 = a - b + c => a - b = y_1 - c
      // 2a = (y1 - c) + (y_1 - c)
      const a = ((y1 - c) + (y_1 - c)) / 2;
      const b = y1 - c - a;
      
      const discriminant = b * b - 4 * a * c;
      const explanation = [
        `Step 1: Move all terms to one side to form f(${xName}) = 0.`,
        `Step 2: Recognize this is a polynomial of degree 2 (quadratic).`,
        `Step 3: Simplify to standard quadratic form: ax² + bx + c = 0.`,
        `Resulting form: ${math.format(a)}*${xName}² + ${math.format(b)}*${xName} + ${math.format(c)} = 0`,
        `Step 4: Identify the coefficients:`,
        `   • a (quadratic coefficient) = ${math.format(a)}`,
        `   • b (linear coefficient) = ${math.format(b)}`,
        `   • c (constant term) = ${math.format(c)}`,
        `Step 5: Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a`,
        `Step 6: Calculate the discriminant (Δ = b² - 4ac) to determine the nature of roots.`,
        `   • Δ = (${math.format(b)})² - 4*(${math.format(a)})*(${math.format(c)}) = ${math.format(discriminant)}`
      ];

      if (Math.abs(discriminant) < 1e-10) {
        const x = -b / (2 * a);
        explanation.push(`Δ = 0, so there is one repeated real solution.`);
        explanation.push(`${xName} = -b / (2a) = ${math.format(x)}`);
        return {
          equation: equationStr, type: 'quadratic', solutions: [`${xName} = ${math.format(x)}`], discriminant: 0, explanation
        };
      } else if (discriminant > 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        explanation.push(`Δ > 0, so there are two distinct real solutions.`);
        explanation.push(`${xName} = (-b ± √Δ) / 2a`);
        return {
          equation: equationStr, type: 'quadratic',
          solutions: [`${xName} = ${math.format(x1)}`, `${xName} = ${math.format(x2)}`], discriminant, explanation
        };
      } else {
        const real = -b / (2 * a);
        const imag = Math.sqrt(-discriminant) / (2 * a);
        explanation.push(`Δ < 0, so there are complex solutions.`);
        const sol1 = `${math.format(real)} + ${math.format(imag)}i`;
        const sol2 = `${math.format(real)} - ${math.format(imag)}i`;
        return {
          equation: equationStr, type: 'quadratic',
          solutions: [`${xName} = ${sol1}`, `${xName} = ${sol2}`], discriminant, explanation
        };
      }
    } else {
      return {
        equation: equationStr, type: 'unsupported', solutions: [],
        explanation: ['Equation is neither linear nor quadratic, which is currently unsupported.']
      };
    }
  } catch (err: any) {
    return {
      equation: equationStr, type: 'error', solutions: [],
      explanation: [`Could not parse or evaluate the equation. ${err.message}`]
    };
  }
}
