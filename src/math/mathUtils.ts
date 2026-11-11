import * as math from 'mathjs';

// ─── Differentiation ──────────────────────────────────────────────────────────

export interface DiffResult {
  derivative: string;
  rule: string;
  steps: string[];
  error?: string;
}

/** Symbolically differentiates f(x) using mathjs derivative. */
export function differentiate(funcStr: string): DiffResult {
  try {
    const node = math.parse(funcStr);
    const derived = math.derivative(node, 'x');
    const simplified = derived.toString();
    const rule = detectDiffRule(funcStr);
    const steps = buildDiffSteps(funcStr, simplified, rule);
    return { derivative: simplified, rule, steps };
  } catch (e: any) {
    return { derivative: '', rule: '', steps: [], error: e.message || 'Could not differentiate.' };
  }
}

function detectDiffRule(f: string): string {
  if (/sin|cos|tan|sec|csc|cot/.test(f)) return 'Trigonometric Derivative Rule';
  if (/log|ln/.test(f)) return 'Logarithmic Derivative Rule';
  if (/e\^|exp/.test(f)) return 'Exponential Derivative Rule';
  if (/\*/.test(f) || /\(/.test(f)) return 'Product / Chain Rule';
  if (/\//.test(f)) return 'Quotient Rule';
  if (/x\^/.test(f) || /\^/.test(f)) return 'Power Rule';
  if (/x/.test(f)) return 'Basic Linear Rule (d/dx[ax] = a)';
  return 'Constant Rule (d/dx[c] = 0)';
}

function buildDiffSteps(original: string, derivative: string, rule: string): string[] {
  return [
    `Original function: f(x) = ${original}`,
    `Applying: ${rule}`,
    `Computed derivative: f'(x) = ${derivative}`,
  ];
}

// ─── Integration ─────────────────────────────────────────────────────────────

export interface IntResult {
  indefinite: string;
  definite?: number;
  steps: string[];
  error?: string;
}

type IntegralPattern = { pattern: RegExp; integral: (m: RegExpMatchArray) => string; rule: string };

const INTEGRAL_PATTERNS: IntegralPattern[] = [
  {
    pattern: /^x\^(\d+(?:\.\d+)?)$/,
    integral: (m) => {
      const n = parseFloat(m[1]);
      const n1 = n + 1;
      return `x^${n1} / ${n1}`;
    },
    rule: 'Power Rule: ∫xⁿ dx = xⁿ⁺¹/(n+1)',
  },
  { pattern: /^x$/, integral: () => 'x^2 / 2', rule: 'Power Rule: ∫x dx = x²/2' },
  { pattern: /^(\d+(?:\.\d+)?)$/, integral: (m) => `${m[1]} * x`, rule: 'Constant Rule: ∫c dx = cx' },
  { pattern: /^(\d+(?:\.\d+)?) \* x$|^(\d+(?:\.\d+)?)x$/, integral: (m) => { const c = m[1] || m[2]; return `${c} * x^2 / 2`; }, rule: 'Power Rule: ∫ax dx = ax²/2' },
  { pattern: /^sin\(x\)$/, integral: () => '-cos(x)', rule: 'Trig Rule: ∫sin(x) dx = -cos(x)' },
  { pattern: /^cos\(x\)$/, integral: () => 'sin(x)', rule: 'Trig Rule: ∫cos(x) dx = sin(x)' },
  { pattern: /^tan\(x\)$/, integral: () => '-ln(|cos(x)|)', rule: 'Trig Rule: ∫tan(x) dx = -ln|cos(x)|' },
  { pattern: /^e\^x$/, integral: () => 'e^x', rule: 'Exponential Rule: ∫eˣ dx = eˣ' },
  { pattern: /^1 \/ x$|^1\/x$/, integral: () => 'ln(|x|)', rule: 'Log Rule: ∫(1/x) dx = ln|x|' },
  { pattern: /^ln\(x\)$/, integral: () => 'x * ln(x) - x', rule: 'Integration by Parts: ∫ln(x) dx = x·ln(x) - x' },
  { pattern: /^(\d+(?:\.\d+)?) \* sin\(x\)$/, integral: (m) => `-${m[1]} * cos(x)`, rule: 'Trig Rule (scaled)' },
  { pattern: /^(\d+(?:\.\d+)?) \* cos\(x\)$/, integral: (m) => `${m[1]} * sin(x)`, rule: 'Trig Rule (scaled)' },
  { pattern: /^(\d+(?:\.\d+)?) \* e\^x$/, integral: (m) => `${m[1]} * e^x`, rule: 'Exponential Rule (scaled)' },
  { pattern: /^x\^2$/, integral: () => 'x^3 / 3', rule: 'Power Rule: ∫x² dx = x³/3' },
  { pattern: /^x\^3$/, integral: () => 'x^4 / 4', rule: 'Power Rule: ∫x³ dx = x⁴/4' },
  { pattern: /^sqrt\(x\)$/, integral: () => '(2/3) * x^(3/2)', rule: 'Power Rule: ∫√x dx = (2/3)x^(3/2)' },
  { pattern: /^1 \/ x\^(\d+)$|^x\^\((-\d+)\)$/, integral: (m) => { const n = parseInt(m[1] || m[2]); const pow = n > 0 ? -n : n; const p1 = pow + 1; return p1 === 0 ? 'ln(|x|)' : `x^${p1} / ${p1}`; }, rule: 'Power Rule for negative exponents' },
];

/** Attempts pattern-based symbolic integration of common functions. */
export function integrateSymbolic(funcStr: string): IntResult {
  const trimmed = funcStr.trim();
  for (const { pattern, integral, rule } of INTEGRAL_PATTERNS) {
    const m = trimmed.match(pattern);
    if (m) {
      const result = integral(m);
      return {
        indefinite: `${result} + C`,
        steps: [
          `f(x) = ${trimmed}`,
          `Rule: ${rule}`,
          `∫f(x)dx = ${result} + C`,
        ],
      };
    }
  }

  // Fallback: numerical hint only
  return {
    indefinite: '',
    steps: [],
    error: `Symbolic integration for "${trimmed}" is not in the built-in pattern library. Use Definite mode with numeric bounds instead.`,
  };
}

/** Numerical definite integration via Simpson's rule. */
export function integrateDefinite(funcStr: string, a: number, b: number): IntResult {
  try {
    const compiled = math.compile(funcStr);
    const n = 1000;
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      let fx: number;
      try {
        const val = compiled.evaluate({ x });
        fx = typeof val === 'number' && isFinite(val) ? val : 0;
      } catch { fx = 0; }
      const coeff = i === 0 || i === n ? 1 : i % 2 === 0 ? 2 : 4;
      sum += coeff * fx;
    }
    const result = (h / 3) * sum;
    return {
      indefinite: '',
      definite: result,
      steps: [
        `f(x) = ${funcStr}`,
        `Bounds: [${a}, ${b}]`,
        `Method: Simpson's Rule (n=${n} intervals)`,
        `∫[${a},${b}] f(x)dx ≈ ${math.format(result, { precision: 10 })}`,
      ],
    };
  } catch (e: any) {
    return { indefinite: '', steps: [], error: e.message || 'Could not integrate.' };
  }
}

// ─── Limits ──────────────────────────────────────────────────────────────────

export interface LimitResult {
  value: string;
  steps: string[];
  error?: string;
}

/** Numerically evaluates lim_{x→a} f(x) by approaching from both sides. */
export function computeLimit(funcStr: string, approach: number | 'inf' | '-inf'): LimitResult {
  try {
    const compiled = math.compile(funcStr);
    const evaluate = (x: number): number => {
      try {
        const v = compiled.evaluate({ x });
        return typeof v === 'number' ? v : NaN;
      } catch { return NaN; }
    };

    if (approach === 'inf') {
      const v = evaluate(1e12);
      const label = isFinite(v) ? math.format(v, { precision: 8 }) : (v > 0 ? '+∞' : '-∞');
      return { value: label, steps: [`lim (x→+∞) ${funcStr}`, `Evaluated at x=10¹²: ${label}`] };
    }
    if (approach === '-inf') {
      const v = evaluate(-1e12);
      const label = isFinite(v) ? math.format(v, { precision: 8 }) : (v > 0 ? '+∞' : '-∞');
      return { value: label, steps: [`lim (x→-∞) ${funcStr}`, `Evaluated at x=-10¹²: ${label}`] };
    }

    const eps = 1e-7;
    const left = evaluate(approach - eps);
    const right = evaluate(approach + eps);

    const steps = [
      `f(x) = ${funcStr}`,
      `x → ${approach}`,
      `Left-hand limit  (x→${approach}⁻): ${isFinite(left) ? math.format(left, { precision: 8 }) : 'DNE / ±∞'}`,
      `Right-hand limit (x→${approach}⁺): ${isFinite(right) ? math.format(right, { precision: 8 }) : 'DNE / ±∞'}`,
    ];

    if (!isFinite(left) || !isFinite(right)) {
      const val = !isFinite(left) && !isFinite(right) && Math.sign(left) === Math.sign(right) ? (left > 0 ? '+∞' : '-∞') : 'Does Not Exist';
      steps.push(`Conclusion: Limit = ${val}`);
      return { value: val, steps };
    }

    if (Math.abs(left - right) < 1e-5) {
      const avg = (left + right) / 2;
      const formatted = math.format(avg, { precision: 8 });
      steps.push(`Both sides agree → Limit = ${formatted}`);
      return { value: formatted, steps };
    }

    steps.push('Left ≠ Right → Limit Does Not Exist');
    return { value: 'Does Not Exist', steps };
  } catch (e: any) {
    return { value: '', steps: [], error: e.message };
  }
}

// ─── Trigonometry ─────────────────────────────────────────────────────────────

export type AngleMode = 'deg' | 'rad';

export interface TrigResult {
  sin: string;
  cos: string;
  tan: string;
  csc: string;
  sec: string;
  cot: string;
  asin?: string;
  acos?: string;
  atan?: string;
}

function fmt(n: number): string {
  if (!isFinite(n)) return 'undefined';
  if (Math.abs(n) < 1e-12) return '0';
  return math.format(n, { precision: 10 });
}

export function computeTrig(angle: number, mode: AngleMode): TrigResult {
  const rad = mode === 'deg' ? (angle * Math.PI) / 180 : angle;
  const sinV = Math.sin(rad);
  const cosV = Math.cos(rad);
  const tanV = Math.tan(rad);

  return {
    sin: fmt(sinV),
    cos: fmt(cosV),
    tan: Math.abs(cosV) < 1e-10 ? 'undefined' : fmt(tanV),
    csc: Math.abs(sinV) < 1e-10 ? 'undefined' : fmt(1 / sinV),
    sec: Math.abs(cosV) < 1e-10 ? 'undefined' : fmt(1 / cosV),
    cot: Math.abs(sinV) < 1e-10 ? 'undefined' : fmt(cosV / sinV),
  };
}

export function computeInverseTrig(value: number, mode: AngleMode): TrigResult {
  const asinRad = Math.asin(value);
  const acosRad = Math.acos(value);
  const atanRad = Math.atan(value);
  const scale = mode === 'deg' ? 180 / Math.PI : 1;
  return {
    sin: fmt(value),
    cos: fmt(value),
    tan: fmt(value),
    csc: 'N/A',
    sec: 'N/A',
    cot: 'N/A',
    asin: isNaN(asinRad) ? 'undefined (|val|>1)' : fmt(asinRad * scale),
    acos: isNaN(acosRad) ? 'undefined (|val|>1)' : fmt(acosRad * scale),
    atan: fmt(atanRad * scale),
  };
}

// ─── Algebra & Equations ─────────────────────────────────────────────────────

// re-exported from equationSolver (kept here for single import)
export { solveEquation } from './equationSolver';

// ─── AP & GP ──────────────────────────────────────────────────────────────────

export interface APResult {
  nthTerm: number;
  sum: number;
  commonDiff: number;
}

export interface GPResult {
  nthTerm: number;
  sum: number;
  commonRatio: number;
}

export function computeAP(a: number, d: number, n: number): APResult {
  return {
    nthTerm: a + (n - 1) * d,
    sum: (n / 2) * (2 * a + (n - 1) * d),
    commonDiff: d,
  };
}

export function computeGP(a: number, r: number, n: number): GPResult {
  const nthTerm = a * Math.pow(r, n - 1);
  let sum: number;
  if (Math.abs(r - 1) < 1e-12) {
    sum = a * n;
  } else {
    sum = a * (1 - Math.pow(r, n)) / (1 - r);
  }
  return { nthTerm, sum, commonRatio: r };
}

// ─── Matrices ────────────────────────────────────────────────────────────────

export type Matrix = number[][];

export interface MatrixResult {
  result?: Matrix | number;
  steps: string[];
  error?: string;
}

function matValid(m: Matrix): boolean {
  return m.length > 0 && m[0].length > 0;
}

export function matAdd(A: Matrix, B: Matrix): MatrixResult {
  try {
    const r = math.add(A as any, B as any) as unknown as Matrix;
    return { result: r, steps: ['A + B computed element-wise.'] };
  } catch (e: any) { return { steps: [], error: e.message }; }
}

export function matSubtract(A: Matrix, B: Matrix): MatrixResult {
  try {
    const r = math.subtract(A as any, B as any) as unknown as Matrix;
    return { result: r, steps: ['A - B computed element-wise.'] };
  } catch (e: any) { return { steps: [], error: e.message }; }
}

export function matMultiply(A: Matrix, B: Matrix): MatrixResult {
  try {
    const r = math.multiply(A as any, B as any) as unknown as Matrix;
    return { result: r, steps: ['A × B computed via standard matrix multiplication.'] };
  } catch (e: any) { return { steps: [], error: e.message }; }
}

export function matDeterminant(A: Matrix): MatrixResult {
  try {
    if (!matValid(A) || A.length !== A[0].length) return { steps: [], error: 'Determinant requires a square matrix.' };
    const det = math.det(A as any) as number;
    return { result: det, steps: [`det(A) = ${math.format(det, { precision: 10 })}`] };
  } catch (e: any) { return { steps: [], error: e.message }; }
}

export function matTranspose(A: Matrix): MatrixResult {
  try {
    const r = math.transpose(A as any) as Matrix;
    return { result: r, steps: ['Aᵀ: rows and columns swapped.'] };
  } catch (e: any) { return { steps: [], error: e.message }; }
}

export function matInverse(A: Matrix): MatrixResult {
  try {
    if (!matValid(A) || A.length !== A[0].length) return { steps: [], error: 'Inverse requires a square matrix.' };
    const det = math.det(A as any) as number;
    if (Math.abs(det) < 1e-12) return { steps: [], error: 'Matrix is singular (det = 0); inverse does not exist.' };
    const inv = math.inv(A as any) as Matrix;
    return { result: inv, steps: [`det(A) = ${math.format(det, { precision: 6 })} ≠ 0, so inverse exists.`, 'A⁻¹ computed.'] };
  } catch (e: any) { return { steps: [], error: e.message }; }
}

// ─── Vectors ─────────────────────────────────────────────────────────────────

export type Vec3 = [number, number, number];

export interface VectorResult {
  label: string;
  value: string;
}

export function vectorOps(a: Vec3, b: Vec3): VectorResult[] {
  const mag = (v: Vec3) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross: Vec3 = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const magA = mag(a);
  const magB = mag(b);
  const angle = magA > 0 && magB > 0 ? (Math.acos(Math.max(-1, Math.min(1, dot / (magA * magB)))) * 180) / Math.PI : 0;

  const fmtVec = (v: Vec3) => `(${fmt(v[0])}, ${fmt(v[1])}, ${fmt(v[2])})`;

  return [
    { label: '|A|  Magnitude of A', value: fmt(magA) },
    { label: '|B|  Magnitude of B', value: fmt(magB) },
    { label: 'A + B  Sum', value: fmtVec([a[0] + b[0], a[1] + b[1], a[2] + b[2]]) },
    { label: 'A - B  Difference', value: fmtVec([a[0] - b[0], a[1] - b[1], a[2] - b[2]]) },
    { label: 'A · B  Dot Product', value: fmt(dot) },
    { label: 'A × B  Cross Product', value: fmtVec(cross) },
    { label: 'Angle between A & B', value: `${fmt(angle)}°` },
    { label: 'Unit vector of A', value: magA > 0 ? fmtVec([a[0] / magA, a[1] / magA, a[2] / magA]) : '(0,0,0)' },
  ];
}

// ─── Coordinate Geometry (2D) ─────────────────────────────────────────────────

export interface CoordResult {
  label: string;
  value: string;
}

export function coordGeometry(x1: number, y1: number, x2: number, y2: number): CoordResult[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const slope = dx === 0 ? Infinity : dy / dx;
  const slopeStr = dx === 0 ? 'undefined (vertical line)' : fmt(slope);
  const intercept = dx === 0 ? undefined : y1 - slope * x1;
  const lineEq = dx === 0 ? `x = ${x1}` : intercept !== undefined ? `y = ${fmt(slope)}x + ${fmt(intercept)}` : '';

  return [
    { label: 'Distance', value: fmt(dist) },
    { label: 'Midpoint', value: `(${fmt(mx)}, ${fmt(my)})` },
    { label: 'Slope (m)', value: slopeStr },
    { label: 'Y-Intercept (b)', value: intercept !== undefined ? fmt(intercept) : 'N/A' },
    { label: 'Line Equation', value: lineEq },
    { label: 'Section Ratio (1:1)', value: `(${fmt(mx)}, ${fmt(my)})` },
  ];
}

// ─── 3D Geometry ─────────────────────────────────────────────────────────────

export interface Geo3DResult {
  label: string;
  value: string;
}

export function geo3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): Geo3DResult[] {
  const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const mz = (z1 + z2) / 2;
  const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
  const len = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
  const ux = len > 0 ? dx / len : 0;
  const uy = len > 0 ? dy / len : 0;
  const uz = len > 0 ? dz / len : 0;

  return [
    { label: 'Distance between points', value: fmt(dist) },
    { label: 'Midpoint', value: `(${fmt(mx)}, ${fmt(my)}, ${fmt(mz)})` },
    { label: 'Direction vector', value: `(${fmt(dx)}, ${fmt(dy)}, ${fmt(dz)})` },
    { label: 'Unit direction vector', value: `(${fmt(ux)}, ${fmt(uy)}, ${fmt(uz)})` },
    { label: 'Distance from origin to P1', value: fmt(Math.sqrt(x1 ** 2 + y1 ** 2 + z1 ** 2)) },
    { label: 'Distance from origin to P2', value: fmt(Math.sqrt(x2 ** 2 + y2 ** 2 + z2 ** 2)) },
  ];
}

// ─── Probability & Statistics ─────────────────────────────────────────────────

export interface StatsResult {
  label: string;
  value: string;
}

export function computeStats(data: number[]): StatsResult[] {
  if (data.length === 0) return [];
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const mean = data.reduce((s, v) => s + v, 0) / n;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

  const freq = new Map<number, number>();
  data.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
  const maxFreq = Math.max(...freq.values());
  const modes = [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v);
  const modeStr = modes.length === data.length ? 'No mode' : modes.join(', ');

  const range = sorted[n - 1] - sorted[0];
  const variance = data.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);
  const q1 = sorted[Math.floor(n / 4)];
  const q3 = sorted[Math.floor(3 * n / 4)];
  const iqr = q3 - q1;

  return [
    { label: 'Count (n)', value: `${n}` },
    { label: 'Mean', value: fmt(mean) },
    { label: 'Median', value: fmt(median) },
    { label: 'Mode', value: modeStr },
    { label: 'Range', value: fmt(range) },
    { label: 'Min', value: fmt(sorted[0]) },
    { label: 'Max', value: fmt(sorted[n - 1]) },
    { label: 'Variance (σ²)', value: fmt(variance) },
    { label: 'Std Deviation (σ)', value: fmt(stdDev) },
    { label: 'Q1', value: fmt(q1) },
    { label: 'Q3', value: fmt(q3) },
    { label: 'IQR (Q3-Q1)', value: fmt(iqr) },
    { label: 'Sum', value: fmt(data.reduce((s, v) => s + v, 0)) },
  ];
}

/** Basic probability: P(A) = favorable / total */
export function basicProbability(favorable: number, total: number): StatsResult[] {
  if (total <= 0) return [{ label: 'Error', value: 'Total outcomes must be > 0' }];
  const p = favorable / total;
  const q = 1 - p;
  return [
    { label: 'P(A) — Probability of Event', value: fmt(p) },
    { label: "P(A') — Complement", value: fmt(q) },
    { label: 'Odds in favor (p:q)', value: `${favorable} : ${total - favorable}` },
    { label: 'Percentage', value: `${fmt(p * 100)}%` },
  ];
}
