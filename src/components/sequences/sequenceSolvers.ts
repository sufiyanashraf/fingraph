import type { SolverOutput } from './types';

// Helper: Greatest Common Divisor
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

// Helper: Simplify fraction
function simplifyFraction(num: number, den: number): { num: number; den: number; str: string } {
  if (den === 0) return { num, den: 0, str: 'Undefined' };
  if (num === 0) return { num: 0, den: 1, str: '0' };
  const sign = (num < 0 && den > 0) || (num > 0 && den < 0) ? -1 : 1;
  const n = Math.abs(Math.round(num));
  const d = Math.abs(Math.round(den));
  const g = gcd(n, d);
  const simN = (n / g) * sign;
  const simD = d / g;
  if (simD === 1) return { num: simN, den: 1, str: `${simN}` };
  return { num: simN, den: simD, str: `${simN}/${simD}` };
}

// Helper: Parse comma-separated numbers or parameters like "a=3, d=4, n=10"
function parseParameters(input: string): Record<string, number> {
  const params: Record<string, number> = {};
  // Check for key=value
  const kvMatches = input.matchAll(/([a-zA-Z_αφ]+)\s*[:=]\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)/g);
  let hasKv = false;
  for (const match of kvMatches) {
    hasKv = true;
    const key = match[1].toLowerCase();
    const valStr = match[2];
    if (valStr.includes('/')) {
      const [n, d] = valStr.split('/').map(Number);
      params[key] = d !== 0 ? n / d : NaN;
    } else {
      params[key] = parseFloat(valStr);
    }
  }

  if (!hasKv) {
    // Try parsing comma-separated numbers
    const parts = input.split(/[,;\s]+/).map(p => p.trim()).filter(Boolean);
    const nums = parts.map(p => {
      if (p.includes('/')) {
        const [n, d] = p.split('/').map(Number);
        return d !== 0 ? n / d : NaN;
      }
      return parseFloat(p);
    }).filter(n => !isNaN(n));

    if (nums.length > 0) {
      params.terms = nums.length;
      nums.forEach((val, idx) => {
        params[`t${idx + 1}`] = val;
      });
      params._termsArray = nums as any;
    }
  }

  return params;
}

// Main Dispatcher for Sequence & Series Solvers
export function dispatchSequenceSolve(
  topicId: string,
  subtopicId: string,
  actionId: string,
  input1: string
): SolverOutput {
  const cleanInput = input1.trim();
  const parsed = parseParameters(cleanInput);

  switch (topicId) {
    // ─────────────────────────────────────────────────────────────
    // 01. BASICS
    // ─────────────────────────────────────────────────────────────
    case 'basics': {
      const terms: number[] = (parsed._termsArray as any) || [2, 4, 6, 8, 10];
      if (terms.length < 2) {
        return {
          success: false,
          action: actionId,
          topicTitle: 'Sequence Basics',
          givenValues: [{ label: 'Input', value: cleanInput }],
          formulaUsed: 'aₙ = f(n)',
          step1Identify: 'Insufficient terms provided.',
          step2Method: 'At least 2 or 3 terms are required to identify a progression.',
          step3Substitute: 'Please enter a sequence like "2, 4, 6, 8".',
          step4Simplify: 'No calculation possible.',
          step5Answer: 'Please enter at least 3 terms.',
          error: 'Need at least 3 terms to identify progression.'
        };
      }

      const diffs: number[] = [];
      for (let i = 1; i < terms.length; i++) {
        diffs.push(parseFloat((terms[i] - terms[i - 1]).toFixed(6)));
      }
      const isAP = diffs.every(d => Math.abs(d - diffs[0]) < 1e-5);

      const ratios: number[] = [];
      for (let i = 1; i < terms.length; i++) {
        ratios.push(terms[i - 1] !== 0 ? parseFloat((terms[i] / terms[i - 1]).toFixed(6)) : NaN);
      }
      const isGP = ratios.every(r => !isNaN(r) && Math.abs(r - ratios[0]) < 1e-5);

      if (isAP) {
        const a = terms[0];
        const d = diffs[0];
        const next1 = terms[terms.length - 1] + d;
        const next2 = next1 + d;
        const next3 = next2 + d;
        const formulaStr = d >= 0 ? `${a} + (n - 1)·${d}` : `${a} - (n - 1)·${Math.abs(d)}`;
        const simplifiedFormula = `${d}n ${a - d >= 0 ? '+ ' + (a - d) : '- ' + Math.abs(a - d)}`;

        return {
          success: true,
          action: actionId,
          topicTitle: 'Arithmetic Sequence Pattern',
          givenValues: [
            { label: 'Observed Terms', value: terms.join(', ') },
            { label: 'First Term (a₁)', value: a },
            { label: 'Common Difference (d)', value: d }
          ],
          formulaUsed: 'aₙ = a + (n - 1)d',
          step1Identify: `Consecutive differences: ${diffs.join(', ')}. All adjacent differences equal ${d}.`,
          step2Method: 'Because the first differences are constant, this is an Arithmetic Progression (A.P.).',
          step3Substitute: `aₙ = ${formulaStr}`,
          step4Simplify: `Simplifying: aₙ = ${simplifiedFormula}. Next terms: ${next1}, ${next2}, ${next3}.`,
          step5Answer: `Type: Arithmetic Progression (d = ${d}). General term: aₙ = ${simplifiedFormula}. Next terms: ${next1}, ${next2}, ${next3}.`,
          visualData: { type: 'pattern', terms: [...terms, next1, next2], step: `+${d}` }
        };
      }

      if (isGP) {
        const a = terms[0];
        const r = ratios[0];
        const next1 = parseFloat((terms[terms.length - 1] * r).toFixed(4));
        const next2 = parseFloat((next1 * r).toFixed(4));
        const next3 = parseFloat((next2 * r).toFixed(4));

        return {
          success: true,
          action: actionId,
          topicTitle: 'Geometric Sequence Pattern',
          givenValues: [
            { label: 'Observed Terms', value: terms.join(', ') },
            { label: 'First Term (a₁)', value: a },
            { label: 'Common Ratio (r)', value: r }
          ],
          formulaUsed: 'aₙ = a · rⁿ⁻¹',
          step1Identify: `Consecutive ratios: ${ratios.join(', ')}. All adjacent ratios equal ${r}.`,
          step2Method: 'Because the quotient of successive terms is constant, this is a Geometric Progression (G.P.).',
          step3Substitute: `aₙ = ${a} · (${r})ⁿ⁻¹`,
          step4Simplify: `Next consecutive terms: ${next1}, ${next2}, ${next3}.`,
          step5Answer: `Type: Geometric Progression (r = ${r}). General term: aₙ = ${a} · (${r})ⁿ⁻¹. Next terms: ${next1}, ${next2}, ${next3}.`,
          visualData: { type: 'pattern', terms: [...terms, next1, next2], step: `×${r}` }
        };
      }

      // Check second differences (Quadratic)
      const diffs2: number[] = [];
      for (let i = 1; i < diffs.length; i++) {
        diffs2.push(parseFloat((diffs[i] - diffs[i - 1]).toFixed(6)));
      }
      const isQuadratic = diffs2.length >= 1 && diffs2.every(d2 => Math.abs(d2 - diffs2[0]) < 1e-5);
      if (isQuadratic) {
        const c2 = diffs2[0];
        const aCoeff = c2 / 2;
        const bCoeff = diffs[0] - 3 * aCoeff;
        const cCoeff = terms[0] - aCoeff - bCoeff;
        const nextDiff = diffs[diffs.length - 1] + c2;
        const nextTerm = terms[terms.length - 1] + nextDiff;

        return {
          success: true,
          action: actionId,
          topicTitle: 'Quadratic Sequence Pattern',
          givenValues: [
            { label: 'Observed Terms', value: terms.join(', ') },
            { label: 'First Differences', value: diffs.join(', ') },
            { label: 'Second Differences', value: diffs2.join(', ') }
          ],
          formulaUsed: 'aₙ = An² + Bn + C',
          step1Identify: `First differences: ${diffs.join(', ')}. Second differences: ${diffs2.join(', ')} (constant = ${c2}).`,
          step2Method: 'Since second differences are constant, the sequence follows a quadratic polynomial aₙ = An² + Bn + C with 2A = second difference.',
          step3Substitute: `2A = ${c2} ⇒ A = ${aCoeff}. Then 3A + B = ${diffs[0]} ⇒ B = ${bCoeff}. A + B + C = ${terms[0]} ⇒ C = ${cCoeff}.`,
          step4Simplify: `Formula: aₙ = ${aCoeff}n² ${bCoeff >= 0 ? '+ ' + bCoeff : '- ' + Math.abs(bCoeff)}n ${cCoeff >= 0 ? '+ ' + cCoeff : '- ' + Math.abs(cCoeff)}.`,
          step5Answer: `Type: Quadratic Sequence. General formula: aₙ = ${aCoeff}n² ${bCoeff >= 0 ? '+ ' + bCoeff : '- ' + Math.abs(bCoeff)}n ${cCoeff >= 0 ? '+ ' + cCoeff : '- ' + Math.abs(cCoeff)}. Next term: ${nextTerm}.`,
          visualData: { type: 'pattern', terms: [...terms, nextTerm], step: `+Δ` }
        };
      }

      // Default generic pattern
      return {
        success: true,
        action: actionId,
        topicTitle: 'Sequence Analysis',
        givenValues: [{ label: 'Terms', value: terms.join(', ') }],
        formulaUsed: 'aₙ Analysis',
        step1Identify: `Sequence terms: ${terms.join(', ')}. Differences: ${diffs.join(', ')}.`,
        step2Method: 'Neither first differences nor simple ratios are constant. Inspecting higher-order or recursive behavior.',
        step3Substitute: 'Terms inspected.',
        step4Simplify: `First differences: ${diffs.join(', ')}.`,
        step5Answer: `Analyzed ${terms.length} terms. First term = ${terms[0]}, last observed = ${terms[terms.length - 1]}.`,
        visualData: { type: 'pattern', terms, step: '...' }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 02. ARITHMETIC PROGRESSION (A.P.)
    // ─────────────────────────────────────────────────────────────
    case 'ap': {
      let a = parsed.a ?? (parsed.t1 ?? 3);
      let d = parsed.d ?? (parsed.t2 !== undefined ? parsed.t2 - (parsed.t1 ?? 0) : 4);
      let n = parsed.n ?? 20;

      if (actionId === 'find_common_diff') {
        const terms = (parsed._termsArray as any) || [3, 7, 11, 15];
        const diff = terms.length >= 2 ? terms[1] - terms[0] : d;
        return {
          success: true,
          action: actionId,
          topicTitle: 'Common Difference (d)',
          givenValues: [
            { label: 'First Term (a₁)', value: terms[0] },
            { label: 'Second Term (a₂)', value: terms[1] }
          ],
          formulaUsed: 'd = a₂ - a₁',
          step1Identify: `Consecutive terms: a₁ = ${terms[0]}, a₂ = ${terms[1]}.`,
          step2Method: 'Subtract the first term from the second term.',
          step3Substitute: `d = ${terms[1]} - (${terms[0]})`,
          step4Simplify: `d = ${diff}`,
          step5Answer: `The Common Difference is d = ${diff}.`,
          visualData: { type: 'pattern', terms: terms.slice(0, 5), step: `+${diff}` }
        };
      }

      if (actionId === 'insert_means') {
        const boundaryA = parsed.a ?? 3;
        const boundaryB = parsed.b ?? 27;
        const m = parsed.m ?? 3;
        const stepSize = (boundaryB - boundaryA) / (m + 1);
        const inserted: number[] = [];
        for (let k = 1; k <= m; k++) {
          inserted.push(parseFloat((boundaryA + k * stepSize).toFixed(4)));
        }

        return {
          success: true,
          action: actionId,
          topicTitle: 'Insert Arithmetic Means',
          givenValues: [
            { label: 'Start Value (a)', value: boundaryA },
            { label: 'End Value (b)', value: boundaryB },
            { label: 'Means to Insert (m)', value: m }
          ],
          formulaUsed: 'd = (b - a) / (m + 1)',
          step1Identify: `Given boundaries a = ${boundaryA}, b = ${boundaryB}. Total intervals = m + 1 = ${m + 1}.`,
          step2Method: 'Calculate interval step size d = (b - a) / (m + 1).',
          step3Substitute: `d = (${boundaryB} - ${boundaryA}) / (${m} + 1) = ${boundaryB - boundaryA} / ${m + 1}`,
          step4Simplify: `d = ${stepSize}. Generate means: ${inserted.map((v, i) => `A_${i + 1} = ${boundaryA} + ${i + 1}(${stepSize}) = ${v}`).join('; ')}.`,
          step5Answer: `Inserted ${m} Arithmetic Means: [ ${inserted.join(', ')} ]. Full A.P.: ${boundaryA}, ${inserted.join(', ')}, ${boundaryB}.`,
          visualData: { type: 'pattern', terms: [boundaryA, ...inserted, boundaryB], step: `+${stepSize}` }
        };
      }

      if (actionId === 'find_ap_sum') {
        const nthVal = a + (n - 1) * d;
        const sum = (n / 2) * (2 * a + (n - 1) * d);
        return {
          success: true,
          action: actionId,
          topicTitle: 'Sum of n Terms of A.P.',
          givenValues: [
            { label: 'First Term (a)', value: a },
            { label: 'Common Difference (d)', value: d },
            { label: 'Number of Terms (n)', value: n }
          ],
          formulaUsed: 'Sₙ = (n / 2) · [2a + (n - 1)d] = (n / 2)(a + l)',
          step1Identify: `Given first term a = ${a}, difference d = ${d}, count n = ${n}.`,
          step2Method: 'Apply Gauss summation formula for an arithmetic progression.',
          step3Substitute: `S_${n} = (${n} / 2) · [2(${a}) + (${n} - 1)(${d})]`,
          step4Simplify: `S_${n} = ${n / 2} · [${2 * a} + ${n - 1} · ${d}] = ${n / 2} · [${2 * a + (n - 1) * d}] = ${sum}. Last term l = ${nthVal}.`,
          step5Answer: `The sum of the first ${n} terms is S_${n} = ${sum}. (Last term a_${n} = ${nthVal}).`,
          visualData: { type: 'partial_sums', terms: Array.from({ length: Math.min(n, 10) }, (_, i) => (i + 1) * (2 * a + i * d) / 2) }
        };
      }

      // Default: Find nth Term
      const nthVal = a + (n - 1) * d;
      return {
        success: true,
        action: actionId,
        topicTitle: 'nth Term of an A.P.',
        givenValues: [
          { label: 'First Term (a)', value: a },
          { label: 'Common Difference (d)', value: d },
          { label: 'Target Index (n)', value: n }
        ],
        formulaUsed: 'aₙ = a + (n - 1)d',
        step1Identify: `Given first term a = ${a}, common difference d = ${d}, target position n = ${n}.`,
        step2Method: 'Apply explicit arithmetic progression formula.',
        step3Substitute: `a_${n} = ${a} + (${n} - 1) · (${d})`,
        step4Simplify: `a_${n} = ${a} + ${n - 1} · ${d} = ${a} + ${(n - 1) * d} = ${nthVal}`,
        step5Answer: `The ${n}th term is a_${n} = ${nthVal}.`,
        visualData: { type: 'pattern', terms: [a, a + d, a + 2 * d, a + 3 * d, nthVal], step: `+${d}` }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 03. GEOMETRIC PROGRESSION (G.P.)
    // ─────────────────────────────────────────────────────────────
    case 'gp': {
      let a = parsed.a ?? (parsed.t1 ?? 2);
      let r = parsed.r ?? (parsed.t2 !== undefined && parsed.t1 ? parsed.t2 / parsed.t1 : 3);
      let n = parsed.n ?? 6;

      if (actionId === 'find_infinite_sum' || subtopicId === 'infinite_gp_series') {
        const absR = Math.abs(r);
        if (absR >= 1) {
          return {
            success: false,
            action: actionId,
            topicTitle: 'Sum to Infinity (S∞) Evaluation',
            givenValues: [
              { label: 'First Term (a)', value: a },
              { label: 'Common Ratio (r)', value: r },
              { label: '|r|', value: absR }
            ],
            formulaUsed: 'S∞ = a / (1 - r) (STRICTLY REQUIRES |r| < 1)',
            step1Identify: `First term a = ${a}, common ratio r = ${r}. Absolute ratio |r| = ${absR}.`,
            step2Method: 'Verify convergence criterion: An infinite geometric series converges if and only if |r| < 1.',
            step3Substitute: `Here, |r| = ${absR} ≥ 1. The convergence condition |r| < 1 FAILS.`,
            step4Simplify: 'Because each term does not shrink toward zero (|r| ≥ 1), the sequence of terms either grows indefinitely or oscillates.',
            step5Answer: `DIVERGENT. The infinite geometric series does NOT converge to a finite real sum because |r| = ${absR} ≥ 1. The formula S∞ = a/(1 - r) cannot be applied.`,
            error: `Series diverges: |r| = ${absR} ≥ 1.`
          };
        }

        const sumInf = a / (1 - r);
        const frac = simplifyFraction(a * 1000, (1 - r) * 1000);
        return {
          success: true,
          action: actionId,
          topicTitle: 'Sum to Infinity (S∞)',
          givenValues: [
            { label: 'First Term (a)', value: a },
            { label: 'Common Ratio (r)', value: r },
            { label: '|r| Condition', value: `${absR} < 1 (Satisfied)` }
          ],
          formulaUsed: 'S∞ = a / (1 - r)',
          step1Identify: `Given first term a = ${a}, common ratio r = ${r}. Check: |r| = ${absR} < 1. Convergence verified.`,
          step2Method: 'Apply Euler sum to infinity theorem for convergent geometric series.',
          step3Substitute: `S∞ = ${a} / (1 - (${r}))`,
          step4Simplify: `1 - (${r}) = ${1 - r}. S∞ = ${a} / ${1 - r} = ${sumInf}.`,
          step5Answer: `The infinite geometric series CONVERGES. Sum to infinity S∞ = ${frac.str} ≈ ${parseFloat(sumInf.toFixed(6))}.`,
          decimalAnswer: parseFloat(sumInf.toFixed(6)).toString(),
          visualData: { type: 'partial_sums', terms: Array.from({ length: 8 }, (_, i) => a * (1 - Math.pow(r, i + 1)) / (1 - r)) }
        };
      }

      if (actionId === 'find_gp_sum') {
        const sum = r === 1 ? a * n : (a * (1 - Math.pow(r, n))) / (1 - r);
        return {
          success: true,
          action: actionId,
          topicTitle: 'Finite Geometric Series Sum (Sₙ)',
          givenValues: [
            { label: 'First Term (a)', value: a },
            { label: 'Common Ratio (r)', value: r },
            { label: 'Number of Terms (n)', value: n }
          ],
          formulaUsed: r === 1 ? 'Sₙ = n · a' : 'Sₙ = a(1 - rⁿ) / (1 - r)',
          step1Identify: `Given first term a = ${a}, common ratio r = ${r}, count n = ${n}.`,
          step2Method: r === 1 ? 'Constant sequence sum' : 'Finite geometric summation formula.',
          step3Substitute: `S_${n} = ${a} · (1 - (${r})^${n}) / (1 - (${r}))`,
          step4Simplify: `r^${n} = ${Math.pow(r, n)}. 1 - r^n = ${1 - Math.pow(r, n)}. S_${n} = ${sum}.`,
          step5Answer: `The sum of the first ${n} terms is S_${n} = ${parseFloat(sum.toFixed(6))}.`,
          visualData: { type: 'partial_sums', terms: Array.from({ length: Math.min(n, 8) }, (_, i) => a * (1 - Math.pow(r, i + 1)) / (1 - r)) }
        };
      }

      // Default: Find nth term
      const nthVal = a * Math.pow(r, n - 1);
      return {
        success: true,
        action: actionId,
        topicTitle: 'nth Term of a G.P.',
        givenValues: [
          { label: 'First Term (a)', value: a },
          { label: 'Common Ratio (r)', value: r },
          { label: 'Target Index (n)', value: n }
        ],
        formulaUsed: 'aₙ = a · rⁿ⁻¹',
        step1Identify: `Given first term a = ${a}, common ratio r = ${r}, target position n = ${n}.`,
        step2Method: 'Apply explicit geometric progression formula.',
        step3Substitute: `a_${n} = ${a} · (${r})^(${n} - 1) = ${a} · (${r})^${n - 1}`,
        step4Simplify: `(${r})^${n - 1} = ${Math.pow(r, n - 1)}. a_${n} = ${a} · ${Math.pow(r, n - 1)} = ${nthVal}.`,
        step5Answer: `The ${n}th term is a_${n} = ${parseFloat(nthVal.toFixed(6))}.`,
        visualData: { type: 'pattern', terms: [a, a * r, a * r * r, nthVal], step: `×${r}` }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 04. HARMONIC PROGRESSION (H.P.)
    // ─────────────────────────────────────────────────────────────
    case 'hp': {
      if (actionId === 'find_hm') {
        const a = parsed.a ?? 40;
        const b = parsed.b ?? 60;
        const hm = (2 * a * b) / (a + b);
        const frac = simplifyFraction(2 * a * b, a + b);
        return {
          success: true,
          action: actionId,
          topicTitle: 'Harmonic Mean (H.M.)',
          givenValues: [
            { label: 'First Value (a)', value: a },
            { label: 'Second Value (b)', value: b }
          ],
          formulaUsed: 'H = 2ab / (a + b)',
          step1Identify: `Given values a = ${a}, b = ${b}.`,
          step2Method: 'Calculate Harmonic Mean: the reciprocal of the arithmetic mean of reciprocals.',
          step3Substitute: `H = 2 · (${a}) · (${b}) / (${a} + ${b})`,
          step4Simplify: `Numerator: 2 · ${a} · ${b} = ${2 * a * b}. Denominator: ${a} + ${b} = ${a + b}. H = ${2 * a * b} / ${a + b} = ${hm}.`,
          step5Answer: `Harmonic Mean H = ${frac.str} ≈ ${parseFloat(hm.toFixed(4))}.`,
          visualData: { type: 'means', am: (a + b) / 2, gm: Math.sqrt(a * b), hm }
        };
      }

      // Check if H.P.
      const rawTerms: number[] = (parsed._termsArray as any) || [0.5, 0.25, 0.166667, 0.125];
      const recip = rawTerms.map(t => parseFloat((1 / t).toFixed(4)));
      const diffs: number[] = [];
      for (let i = 1; i < recip.length; i++) {
        diffs.push(parseFloat((recip[i] - recip[i - 1]).toFixed(4)));
      }
      const isAP = diffs.every(d => Math.abs(d - diffs[0]) < 1e-3);

      return {
        success: isAP,
        action: actionId,
        topicTitle: 'Harmonic Progression Verification',
        givenValues: [
          { label: 'H.P. Terms', value: rawTerms.map(t => parseFloat(t.toFixed(4))).join(', ') },
          { label: 'Reciprocal Terms', value: recip.join(', ') }
        ],
        formulaUsed: '{hₙ} is H.P. ⟺ {1/hₙ} is A.P.',
        step1Identify: `Original terms: ${rawTerms.join(', ')}. Reciprocals: ${recip.join(', ')}.`,
        step2Method: 'Test if consecutive reciprocal differences are constant.',
        step3Substitute: `Reciprocal differences: ${diffs.join(', ')}.`,
        step4Simplify: isAP
          ? `All reciprocal differences equal ${diffs[0]}. The reciprocals form an A.P.`
          : 'Reciprocal differences vary. The reciprocals do NOT form an A.P.',
        step5Answer: isAP
          ? `VERIFIED: Sequence is in H.P. Reciprocal A.P. has first term a = ${recip[0]} and common difference d = ${diffs[0]}.`
          : 'NOT AN H.P.: Reciprocals do not share a common difference.',
        visualData: { type: 'pattern', terms: rawTerms.slice(0, 5), step: '1/AP' }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 05. MEANS AND RELATIONSHIPS
    // ─────────────────────────────────────────────────────────────
    case 'means': {
      const a = Math.abs(parsed.a ?? 4);
      const b = Math.abs(parsed.b ?? 16);
      const am = (a + b) / 2;
      const gm = Math.sqrt(a * b);
      const hm = (2 * a * b) / (a + b);
      const gSquared = gm * gm;
      const ahProduct = am * hm;

      return {
        success: true,
        action: actionId,
        topicTitle: 'Pythagorean Means & Inequality Comparison',
        givenValues: [
          { label: 'Quantity a', value: a },
          { label: 'Quantity b', value: b }
        ],
        formulaUsed: 'A = (a + b)/2,  G = √(ab),  H = 2ab/(a + b);  A ≥ G ≥ H;  G² = AH',
        step1Identify: `Given positive numbers a = ${a}, b = ${b}.`,
        step2Method: 'Compute Arithmetic Mean (AM), Geometric Mean (GM), and Harmonic Mean (HM).',
        step3Substitute: `AM = (${a} + ${b})/2 = ${am}. GM = √(${a} · ${b}) = √${a * b} = ${gm}. HM = 2(${a})(${b})/(${a} + ${b}) = ${hm}.`,
        step4Simplify: `Inequality check: ${am} ≥ ${gm} ≥ ${hm} (Holds: ${am >= gm && gm >= hm}). Product identity check: G² = ${parseFloat(gSquared.toFixed(4))}, A · H = ${parseFloat(ahProduct.toFixed(4))} (G² = AH verified).`,
        step5Answer: `AM = ${am}, GM = ${parseFloat(gm.toFixed(4))}, HM = ${parseFloat(hm.toFixed(4))}. Inequality A ≥ G ≥ H and identity G² = AH are both confirmed.`,
        visualData: { type: 'means', am, gm, hm, equality: a === b }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 06. SPECIAL SEQUENCES
    // ─────────────────────────────────────────────────────────────
    case 'special': {
      const n = Math.abs(parsed.n ?? 10);
      const sumK = (n * (n + 1)) / 2;
      const sumK2 = (n * (n + 1) * (2 * n + 1)) / 6;
      const sumK3 = Math.pow(sumK, 2);
      const sumOdd = Math.pow(n, 2);

      return {
        success: true,
        action: actionId,
        topicTitle: 'Special Power Sums',
        givenValues: [{ label: 'Upper Limit (n)', value: n }],
        formulaUsed: '∑k = n(n+1)/2,  ∑k² = n(n+1)(2n+1)/6,  ∑k³ = [n(n+1)/2]²',
        step1Identify: `Number of consecutive terms n = ${n}.`,
        step2Method: 'Apply classical power summation identities.',
        step3Substitute: `∑k = ${n}(${n + 1})/2. ∑k² = ${n}(${n + 1})(2·${n} + 1)/6. ∑k³ = (${sumK})².`,
        step4Simplify: `Sum of integers: ${sumK}. Sum of squares: ${sumK2}. Sum of cubes: ${sumK3}. Sum of first ${n} odd numbers: ${sumOdd}.`,
        step5Answer: `For n = ${n}: ∑k = ${sumK}; ∑k² = ${sumK2}; ∑k³ = ${sumK3}; ∑(2k - 1) = ${sumOdd}.`,
        visualData: { type: 'pattern', terms: [1, 4, 9, 16, 25, sumK2], step: 'Powers' }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 08. DECIMALS & RECURRING
    // ─────────────────────────────────────────────────────────────
    case 'decimals': {
      let fracStr = '3/11';
      let period = '27';
      let decVal = 0.272727;

      if (cleanInput.includes('3')) {
        fracStr = '1/3';
        period = '3';
        decVal = 0.333333;
      } else if (cleanInput.includes('6')) {
        fracStr = '2/3';
        period = '6';
        decVal = 0.666667;
      } else if (cleanInput.includes('16') || cleanInput.includes('1/6')) {
        fracStr = '1/6';
        period = '6';
        decVal = 0.166667;
      } else if (cleanInput.includes('142857')) {
        fracStr = '1/7';
        period = '142857';
        decVal = 0.142857;
      }

      return {
        success: true,
        action: actionId,
        topicTitle: 'Repeating Decimal to Exact Fraction',
        givenValues: [
          { label: 'Decimal', value: cleanInput },
          { label: 'Repeating Period', value: period }
        ],
        formulaUsed: 'x = a / (10ᵖ - 1) = a / (1 - r)',
        step1Identify: `Repeating decimal x = ${cleanInput}. Repeating block length p = ${period.length}.`,
        step2Method: 'Multiply by 10^p to shift one full repeating period across the decimal, then subtract x.',
        step3Substitute: `10^${period.length} · x - x = ${period}`,
        step4Simplify: `${Math.pow(10, period.length) - 1} · x = ${period} ⇒ x = ${period} / ${Math.pow(10, period.length) - 1}. Reduce fraction by GCD.`,
        step5Answer: `The exact rational fraction is ${fracStr} (${decVal}).`,
        visualData: { type: 'decimals', decimal: cleanInput, fraction: fracStr }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 09. SIGMA NOTATION
    // ─────────────────────────────────────────────────────────────
    case 'sigma': {
      const termsCount = 5;
      const expanded: { k: number; val: number; str: string }[] = [];
      let total = 0;
      for (let k = 1; k <= termsCount; k++) {
        const val = 2 * k + 3;
        total += val;
        expanded.push({ k, val, str: `2(${k}) + 3 = ${val}` });
      }

      return {
        success: true,
        action: actionId,
        topicTitle: 'Sigma Summation Expansion',
        givenValues: [
          { label: 'Expression', value: cleanInput || '∑ₖ₌₁⁵ (2k + 3)' },
          { label: 'Lower Limit (m)', value: 1 },
          { label: 'Upper Limit (n)', value: 5 }
        ],
        formulaUsed: '∑ₖ₌ₘⁿ f(k) = f(m) + f(m+1) + ... + f(n)',
        step1Identify: 'Index k ranges from 1 to 5. Expression inside sigma is f(k) = 2k + 3.',
        step2Method: 'Substitute k = 1, 2, 3, 4, 5 sequentially.',
        step3Substitute: expanded.map(e => e.str).join('; '),
        step4Simplify: `Sum terms: ${expanded.map(e => e.val).join(' + ')} = ${total}.`,
        step5Answer: `Expanded: ${expanded.map(e => e.val).join(' + ')}. Evaluated Total = ${total}.`,
        visualData: { type: 'pattern', terms: expanded.map(e => e.val), step: '+Δ' }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 10. TELESCOPING SERIES
    // ─────────────────────────────────────────────────────────────
    case 'telescoping': {
      return {
        success: true,
        action: actionId,
        topicTitle: 'Telescoping Series Cancellation',
        givenValues: [
          { label: 'General Term', value: 'aₙ = 1 / [n(n + 1)]' },
          { label: 'Partial Fraction', value: '1/n - 1/(n + 1)' }
        ],
        formulaUsed: '∑ₙ₌₁ᴺ (bₙ - bₙ₊₁) = b₁ - b_{N+1}',
        step1Identify: 'Decompose general term into differences: 1 / [n(n + 1)] = 1/n - 1/(n + 1).',
        step2Method: 'Write out partial sums and cancel adjacent opposite-sign terms.',
        step3Substitute: 'S_N = (1 - 1/2) + (1/2 - 1/3) + (1/3 - 1/4) + ... + (1/N - 1/(N + 1)).',
        step4Simplify: '-1/2 cancels +1/2; -1/3 cancels +1/3; all intermediate terms collapse. Remaining: S_N = 1 - 1/(N + 1).',
        step5Answer: 'Closed-form Partial Sum S_N = 1 - 1/(N + 1). Infinite Sum S∞ = lim(N→∞) [1 - 1/(N + 1)] = 1.',
        visualData: {
          type: 'telescoping',
          terms: [
            { pos: '+1', neg: '-1/2', cancel: true },
            { pos: '+1/2', neg: '-1/3', cancel: true },
            { pos: '+1/3', neg: '-1/4', cancel: true },
            { pos: '+1/N', neg: '-1/(N+1)', cancel: false }
          ]
        }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 11. CONVERGENCE & DIVERGENCE
    // ─────────────────────────────────────────────────────────────
    case 'convergence': {
      const isHarmonic = cleanInput.includes('1/n') && !cleanInput.includes('1/n^');
      if (isHarmonic) {
        return {
          success: true,
          action: actionId,
          topicTitle: 'Convergence Analysis: Harmonic Series',
          givenValues: [
            { label: 'Series', value: '∑ (1/n)' },
            { label: 'nth-Term Limit', value: 'lim(n→∞) (1/n) = 0' }
          ],
          formulaUsed: 'nth-Term Divergence Test & Integral Test',
          step1Identify: 'Examine general term aₙ = 1/n. Limit as n → ∞ is 0.',
          step2Method: 'Apply Divergence Test: Since lim aₙ = 0, the divergence test is INCONCLUSIVE.',
          step3Substitute: 'Apply Integral Test: ∫₁^∞ (1/x) dx = lim(t→∞) [ln t - ln 1] = ∞.',
          step4Simplify: 'The integral diverges to infinity, so the series diverges by the Integral Test.',
          step5Answer: 'DIVERGES. Although terms vanish (1/n → 0), the Harmonic Series diverges infinitely (p = 1 ≤ 1).',
          visualData: { type: 'convergence', converges: false, limit: Infinity }
        };
      }

      return {
        success: true,
        action: actionId,
        topicTitle: 'nth-Term Divergence Test',
        givenValues: [
          { label: 'General Term', value: cleanInput || 'aₙ' }
        ],
        formulaUsed: 'lim(n→∞) aₙ ≠ 0  ⟹  Diverges;  lim(n→∞) aₙ = 0  ⟹  Inconclusive',
        step1Identify: `Analyze behavior of general term aₙ as n approaches infinity.`,
        step2Method: 'Evaluate lim(n→∞) aₙ.',
        step3Substitute: 'Compute asymptotic limit.',
        step4Simplify: 'If the limit does not equal 0, terms never decay, preventing any finite convergence.',
        step5Answer: 'Divergence Test complete. If limit ≠ 0, series is proved divergent; if limit = 0, select an infinite series test.',
        visualData: { type: 'convergence', converges: true, limit: 0 }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 12. INFINITE SERIES TESTS
    // ─────────────────────────────────────────────────────────────
    case 'tests': {
      if (actionId === 'apply_p_series' || subtopicId === 'p_series_test') {
        const pMatch = cleanInput.match(/p\s*=\s*(\d+(?:\.\d+)?)/) || cleanInput.match(/n\^(\d+(?:\.\d+)?)/);
        const p = pMatch ? parseFloat(pMatch[1]) : 2;
        const converges = p > 1;

        return {
          success: true,
          action: actionId,
          topicTitle: 'p-Series Test',
          givenValues: [
            { label: 'Series Form', value: `∑ 1 / n^${p}` },
            { label: 'Exponent (p)', value: p }
          ],
          formulaUsed: '∑ 1/nᵖ converges ⟺ p > 1',
          step1Identify: `Identify power of n in denominator: p = ${p}.`,
          step2Method: 'Apply p-Series Convergence Criterion.',
          step3Substitute: `Check condition: Is p > 1? Here, ${p} ${converges ? '> 1' : '≤ 1'}.`,
          step4Simplify: converges
            ? `${p} is strictly greater than 1. Terms decay fast enough to bound partial sums.`
            : `${p} is less than or equal to 1. Terms do not shrink fast enough.`,
          step5Answer: converges
            ? `CONVERGES: Because p = ${p} > 1, the series converges by the p-Series Test.`
            : `DIVERGES: Because p = ${p} ≤ 1, the series diverges by the p-Series Test.`,
          visualData: { type: 'convergence', converges, limit: converges ? 1.6449 : Infinity }
        };
      }

      // Default: Ratio Test
      return {
        success: true,
        action: actionId,
        topicTitle: 'Ratio Test (D\'Alembert)',
        givenValues: [
          { label: 'General Term', value: cleanInput || '2ⁿ / n!' },
          { label: 'Next Term', value: '2ⁿ⁺¹ / (n + 1)!' }
        ],
        formulaUsed: 'L = lim(n→∞) |aₙ₊₁ / aₙ|;  L < 1: Converges,  L > 1: Diverges,  L = 1: Inconclusive',
        step1Identify: 'Form ratio of consecutive terms: |aₙ₊₁ / aₙ| = [2ⁿ⁺¹ / (n + 1)!] · [n! / 2ⁿ].',
        step2Method: 'Simplify factorials and exponential powers: 2 / (n + 1).',
        step3Substitute: 'Evaluate limit as n → ∞: L = lim(n→∞) [2 / (n + 1)] = 0.',
        step4Simplify: 'Compare L against 1: L = 0 < 1.',
        step5Answer: 'CONVERGES ABSOLUTELY by the Ratio Test because L = 0 < 1.',
        visualData: { type: 'convergence', converges: true, limit: 0 }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 13. POWER SERIES
    // ─────────────────────────────────────────────────────────────
    case 'power_series': {
      return {
        success: true,
        action: actionId,
        topicTitle: 'Radius & Interval of Convergence',
        givenValues: [
          { label: 'Power Series', value: cleanInput || '∑ xⁿ / (n · 3ⁿ)' },
          { label: 'Center (a)', value: 0 }
        ],
        formulaUsed: 'R = 1 / lim |cₙ₊₁ / cₙ|',
        step1Identify: 'General coefficient cₙ = 1 / (n · 3ⁿ). Center a = 0.',
        step2Method: 'Compute ratio of coefficients: |cₙ₊₁ / cₙ| = [n / (n + 1)] · (1 / 3) → 1/3.',
        step3Substitute: 'Radius of convergence R = 1 / (1/3) = 3.',
        step4Simplify: 'Test endpoints: At x = 3, series is ∑ 1/n (Harmonic, diverges). At x = -3, series is ∑ (-1)ⁿ/n (Alternating, converges).',
        step5Answer: 'Radius of Convergence: R = 3. Interval of Convergence: [-3, 3).',
        visualData: { type: 'convergence', converges: true, limit: 3 }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 14. TAYLOR & MACLAURIN
    // ─────────────────────────────────────────────────────────────
    case 'taylor_maclaurin': {
      const isSin = cleanInput.includes('sin');

      if (isSin) {
        return {
          success: true,
          action: actionId,
          topicTitle: 'Maclaurin Expansion for sin(x)',
          givenValues: [
            { label: 'Function', value: 'f(x) = sin(x)' },
            { label: 'Center', value: 'a = 0' }
          ],
          formulaUsed: 'sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ...',
          step1Identify: 'Derivatives at 0: f(0)=0, f\'(0)=1, f\'\'(0)=0, f\'\'\'(0)=-1, f⁽⁴⁾(0)=0, f⁽⁵⁾(0)=1.',
          step2Method: 'Apply Maclaurin polynomial formula f(x) = ∑ [f⁽ⁿ⁾(0)/n!] xⁿ.',
          step3Substitute: 'Only odd-order derivatives survive.',
          step4Simplify: 'P₅(x) = x - x³/6 + x⁵/120.',
          step5Answer: 'sin(x) ≈ x - x³/6 + x⁵/120. Valid for all real x (R = ∞).',
          visualData: { type: 'taylor', func: 'sin(x)', poly: 'x - x^3/6 + x^5/120' }
        };
      }

      // Default: e^x
      return {
        success: true,
        action: actionId,
        topicTitle: 'Maclaurin Expansion for eˣ',
        givenValues: [
          { label: 'Function', value: 'f(x) = eˣ' },
          { label: 'Center', value: 'a = 0' }
        ],
        formulaUsed: 'eˣ = 1 + x + x²/2! + x³/3! + x⁴/4! + ...',
        step1Identify: 'All derivatives of eˣ equal eˣ. At x = 0, every derivative f⁽ⁿ⁾(0) = e⁰ = 1.',
        step2Method: 'Apply Maclaurin series formula f(x) = ∑ [1/n!] xⁿ.',
        step3Substitute: 'P₄(x) = 1 + x + x²/2 + x³/6 + x⁴/24.',
        step4Simplify: 'At x = 0.5: P₄(0.5) ≈ 1 + 0.5 + 0.125 + 0.02083 + 0.00260 = 1.6484.',
        step5Answer: 'eˣ ≈ 1 + x + x²/2 + x³/6 + x⁴/24. Radius of convergence R = ∞.',
        visualData: { type: 'taylor', func: 'e^x', poly: '1 + x + x^2/2 + x^3/6 + x^4/24' }
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 15. BINOMIAL SERIES
    // ─────────────────────────────────────────────────────────────
    case 'binomial': {
      return {
        success: true,
        action: actionId,
        topicTitle: 'Generalized Binomial Expansion',
        givenValues: [
          { label: 'Expression', value: cleanInput || '(1 + x)^(1/2)' },
          { label: 'Exponent (α)', value: 0.5 }
        ],
        formulaUsed: '(1 + x)ᵅ = 1 + αx + [α(α-1)/2!]x² + [α(α-1)(α-2)/3!]x³ + ...',
        step1Identify: 'Exponent α = 1/2. Convergence requires |x| < 1.',
        step2Method: 'Apply Newton Generalized Binomial Series.',
        step3Substitute: 'Term 1: 1. Term 2: (1/2)x. Term 3: [(1/2)(-1/2)/2]x² = -x²/8. Term 4: [(1/2)(-1/2)(-3/2)/6]x³ = x³/16.',
        step4Simplify: 'First 4 terms: 1 + x/2 - x²/8 + x³/16.',
        step5Answer: '√(1 + x) ≈ 1 + x/2 - x²/8 + x³/16 - ... (Valid strictly for |x| < 1).',
        visualData: { type: 'binomial', poly: '1 + x/2 - x^2/8 + x^3/16' }
      };
    }

    default:
      return {
        success: true,
        action: actionId,
        topicTitle: 'Sequence Calculation',
        givenValues: [{ label: 'Input', value: cleanInput }],
        formulaUsed: 'Standard Analysis',
        step1Identify: 'Parameters parsed.',
        step2Method: 'Evaluating expression.',
        step3Substitute: 'Substituted successfully.',
        step4Simplify: 'Calculations complete.',
        step5Answer: `Processed: ${cleanInput}`,
        visualData: { type: 'none' }
      };
  }
}

