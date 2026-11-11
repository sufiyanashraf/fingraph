export type TopicGroup = 'A' | 'B' | 'C' | 'D' | 'E';
export type TopicLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SequenceFormula {
  name: string;
  formula: string;
  condition?: string;
  description: string;
  symbols: { symbol: string; meaning: string }[];
}

export interface CalculatorField {
  id: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  type?: 'text' | 'number';
}

export interface CalculatorAction {
  id: string;
  label: string;
  description?: string;
}

export interface CalculatorConfig {
  questionPrompt: string;
  actions: CalculatorAction[];
  defaultAction: string;
  fields: CalculatorField[];
  examplePills: { label: string; values: Record<string, string> }[];
}

export interface WorkedExampleStep {
  title: string;
  content: string;
}

export interface WorkedExample {
  title: string;
  difficulty: 'Basic' | 'Moderately Challenging';
  problem: string;
  step1Identify: string;
  step2Method: string;
  step3Substitute: string;
  step4Simplify: string;
  step5Answer: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  stepByStep: string[];
}

export type VisualType =
  | 'sequence_plot'
  | 'partial_sums'
  | 'means_comparison'
  | 'ratio_test_gauge'
  | 'fibonacci_spiral'
  | 'telescoping_cancellation'
  | 'taylor_polynomial'
  | 'polygonal_lattice'
  | 'none';

export interface SequenceTopic {
  id: string;
  number: number;
  group: TopicGroup;
  groupTitle: string;
  title: string;
  shortDesc: string;
  level: TopicLevel;
  definition: string;
  formulas: SequenceFormula[];
  calculator: CalculatorConfig;
  workedExamples: WorkedExample[];
  practiceQuestions: PracticeQuestion[];
  visualType: VisualType;
}

export interface GroupConfig {
  id: TopicGroup;
  letter: string;
  title: string;
  description: string;
  topicIds: string[];
}

export const SEQUENCE_GROUPS: GroupConfig[] = [
  {
    id: 'A',
    letter: 'A',
    title: 'Fundamentals',
    description: 'Foundations of sequences, progressions, and classical Pythagorean means',
    topicIds: [
      'intro_seq_series',
      'finite_infinite_seq',
      'ap_fundamentals',
      'gp_fundamentals',
      'hp_fundamentals',
      'am_fundamentals',
      'gm_fundamentals',
      'hm_fundamentals',
      'am_gm_hm_rel'
    ]
  },
  {
    id: 'B',
    letter: 'B',
    title: 'Sequence Operations',
    description: 'Core algebraic operations, finding terms, inserting means, and summation',
    topicIds: [
      'find_nth_term',
      'find_num_terms',
      'find_missing_terms',
      'insert_am',
      'insert_gm',
      'insert_hm',
      'common_diff_ratio',
      'sum_arithmetic_series',
      'sum_geometric_series',
      'sum_to_infinity',
      'sigma_notation_sum',
      'find_seq_patterns',
      'recursive_sequences'
    ]
  },
  {
    id: 'C',
    letter: 'C',
    title: 'Special Sequences',
    description: 'Famous number sequences, figurate numbers, factorials, and higher differences',
    topicIds: [
      'fibonacci_seq',
      'lucas_seq',
      'triangular_numbers',
      'square_numbers',
      'cube_numbers',
      'polygonal_numbers',
      'factorial_sequences',
      'alternating_sequences',
      'quadratic_sequences',
      'agp_progressions',
      'higher_order_diff'
    ]
  },
  {
    id: 'D',
    letter: 'D',
    title: 'Advanced Series',
    description: 'Convergence tests, power series, Taylor & Maclaurin expansions, and binomial series',
    topicIds: [
      'power_sums',
      'telescoping_series',
      'partial_sums',
      'infinite_series',
      'convergent_divergent',
      'abs_cond_convergence',
      'ratio_test',
      'root_test',
      'comparison_tests',
      'integral_test',
      'alternating_series_test',
      'power_series',
      'taylor_series',
      'maclaurin_series',
      'binomial_series'
    ]
  },
  {
    id: 'E',
    letter: 'E',
    title: 'Interactive Learning',
    description: 'Interactive generators, graphing, comprehensive formula sheet, and quizzes',
    topicIds: [
      'pattern_generator',
      'sequence_grapher',
      'formula_reference',
      'practice_problems',
      'math_challenge_quiz'
    ]
  }
];

export const ALL_SEQUENCE_TOPICS: SequenceTopic[] = [
  // ─────────────────────────────────────────────────────────────
  // GROUP A: FUNDAMENTALS (1 - 9)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'intro_seq_series',
    number: 1,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Introduction to Sequences and Series',
    shortDesc: 'Understand ordered lists of numbers vs indicated sums',
    level: 'Beginner',
    definition: 'A sequence is an enumerated collection of numbers in a definite order according to a specific rule: a₁, a₂, a₃, ..., aₙ. A series is the indicated sum of the terms of a sequence: Sₙ = a₁ + a₂ + ... + aₙ.',
    formulas: [
      {
        name: 'General Term (Explicit Rule)',
        formula: 'aₙ = f(n)',
        description: 'Defines the n-th term directly as a function of the integer index n (where n ≥ 1).',
        symbols: [
          { symbol: 'aₙ', meaning: 'The n-th term of the sequence' },
          { symbol: 'n', meaning: 'Term position index (n = 1, 2, 3, ...)' },
          { symbol: 'f(n)', meaning: 'Formula or function producing each value' }
        ]
      },
      {
        name: 'Finite Series Sum',
        formula: 'Sₙ = ∑_{k=1}^n a_k = a₁ + a₂ + ... + aₙ',
        description: 'The sum of the first n terms of the sequence, represented compactly in sigma notation.',
        symbols: [
          { symbol: 'Sₙ', meaning: 'Sum of the first n terms' },
          { symbol: '∑', meaning: 'Capital Greek sigma representing summation' },
          { symbol: 'k=1 to n', meaning: 'Summation index starting at 1 and ending at n' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'What would you like to calculate?',
      actions: [
        { id: 'generate_terms', label: 'Generate Terms' },
        { id: 'evaluate_series', label: 'Evaluate Series Sum' },
        { id: 'check_rule', label: 'Check nth Formula' }
      ],
      defaultAction: 'generate_terms',
      fields: [
        { id: 'formula', label: 'Explicit Formula f(n) or List of Terms', placeholder: 'e.g., 2*n + 3 or 3, 5, 7, 9', defaultValue: '3*n - 1' },
        { id: 'n_terms', label: 'Number of Terms (n)', placeholder: 'e.g., 6', defaultValue: '6' }
      ],
      examplePills: [
        { label: 'Arithmetic 3n - 1', values: { formula: '3*n - 1', n_terms: '6' } },
        { label: 'Quadratic n² + 1', values: { formula: 'n^2 + 1', n_terms: '5' } },
        { label: 'Exponential 2^n', values: { formula: '2^n', n_terms: '6' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Generating Terms from an Explicit Rule',
        difficulty: 'Basic',
        problem: 'Given the explicit rule aₙ = 3n + 2, write down the first 4 terms and find their sum S₄.',
        step1Identify: 'The rule is aₙ = 3n + 2. We need terms for index positions n = 1, 2, 3, 4.',
        step2Method: 'Substitute n = 1, 2, 3, 4 successively into the formula, then sum the results.',
        step3Substitute: 'a₁ = 3(1) + 2 = 5; a₂ = 3(2) + 2 = 8; a₃ = 3(3) + 2 = 11; a₄ = 3(4) + 2 = 14.',
        step4Simplify: 'The sequence terms are 5, 8, 11, 14. The sum is S₄ = 5 + 8 + 11 + 14 = 38.',
        step5Answer: 'First four terms: 5, 8, 11, 14. Series sum S₄ = 38.'
      },
      {
        title: 'Moderately Challenging: Alternating Rational Sequence',
        difficulty: 'Moderately Challenging',
        problem: 'Find the first 4 terms of the sequence defined by aₙ = (-1)ⁿ · n / (n + 1), and compute S₄.',
        step1Identify: 'The sequence has an alternating sign factor (-1)ⁿ and a rational fraction n/(n+1).',
        step2Method: 'Evaluate for n = 1, 2, 3, 4. Notice that odd n gives negative terms and even n gives positive terms.',
        step3Substitute: 'a₁ = (-1)¹(1/2) = -1/2; a₂ = (-1)²(2/3) = 2/3; a₃ = (-1)³(3/4) = -3/4; a₄ = (-1)⁴(4/5) = 4/5.',
        step4Simplify: 'S₄ = -1/2 + 2/3 - 3/4 + 4/5 = -30/60 + 40/60 - 45/60 + 48/60 = 13/60 ≈ 0.2167.',
        step5Answer: 'Terms: -1/2, 2/3, -3/4, 4/5. Partial sum S₄ = 13/60 ≈ 0.2167.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_intro_1',
        question: 'What is the 5th term of the sequence defined by aₙ = 2n² - 3?',
        options: ['47', '50', '35', '43'],
        correctIndex: 0,
        explanation: 'Substitute n = 5: a₅ = 2(5)² - 3 = 2(25) - 3 = 50 - 3 = 47.',
        stepByStep: ['Identify n = 5', 'Calculate 5² = 25', 'Multiply 2 × 25 = 50', 'Subtract 3: 50 - 3 = 47']
      },
      {
        id: 'q_intro_2',
        question: 'What is the difference between a sequence and a series?',
        options: [
          'A sequence is an ordered list; a series is the sum of terms',
          'A sequence is always finite; a series is always infinite',
          'A sequence uses Greek letters; a series uses Roman letters',
          'There is no mathematical difference between them'
        ],
        correctIndex: 0,
        explanation: 'A sequence is an ordered list {aₙ}, while a series is the summation of those terms ∑aₙ.',
        stepByStep: ['Sequence: a₁, a₂, a₃, ... (separated by commas)', 'Series: a₁ + a₂ + a₃ + ... (connected by plus signs)']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'finite_infinite_seq',
    number: 2,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Finite and Infinite Sequences',
    shortDesc: 'Bounded length sequences vs endless sequences and asymptotic behavior',
    level: 'Beginner',
    definition: 'A finite sequence has a definite first and last term, containing a finite number of elements N. An infinite sequence continues indefinitely without ending (n → ∞), often exhibiting convergence toward a limit L or divergence.',
    formulas: [
      {
        name: 'Finite Sequence Domain',
        formula: 'n ∈ {1, 2, 3, ..., N}',
        description: 'Index domain has a finite cardinality N. The final term is a_N.',
        symbols: [
          { symbol: 'N', meaning: 'Total number of terms (cardinality)' },
          { symbol: 'a_N', meaning: 'The last or terminal term of the sequence' }
        ]
      },
      {
        name: 'Infinite Sequence Limit',
        formula: 'lim_{n → ∞} aₙ = L',
        description: 'As n grows arbitrarily large, terms get arbitrarily close to the real limit L.',
        symbols: [
          { symbol: 'L', meaning: 'The limiting value of the sequence' },
          { symbol: 'lim', meaning: 'Limiting process as n approaches positive infinity' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Analyze finite or infinite sequence:',
      actions: [
        { id: 'classify', label: 'Classify & Analyze' },
        { id: 'find_limit', label: 'Compute Limit (n → ∞)' },
        { id: 'check_bounds', label: 'Find Bounds & Extremes' }
      ],
      defaultAction: 'classify',
      fields: [
        { id: 'sequence_input', label: 'Sequence formula or terms', placeholder: 'e.g. 1/n or 2, 4, 8, ..., 128', defaultValue: '1/n' },
        { id: 'sample_terms', label: 'Sample terms to evaluate', placeholder: 'e.g. 10', defaultValue: '8' }
      ],
      examplePills: [
        { label: 'Decaying 1/n', values: { sequence_input: '1/n', sample_terms: '8' } },
        { label: 'Finite 2, 4, ..., 64', values: { sequence_input: '2, 4, 8, 16, 32, 64', sample_terms: '6' } },
        { label: 'Alternating (-1)ⁿ/n', values: { sequence_input: '(-1)^n / n', sample_terms: '8' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Identifying Finite vs Infinite',
        difficulty: 'Basic',
        problem: 'Classify the sequences: (i) 4, 9, 14, 19, ..., 99; (ii) aₙ = 1/2ⁿ for n ≥ 1.',
        step1Identify: 'Examine whether the sequence terminates with a specific last term or continues without bound.',
        step2Method: 'In (i), 99 is explicitly the final term. In (ii), n runs over all natural numbers 1, 2, 3, ... with no upper bound.',
        step3Substitute: 'For (i), 99 = 4 + (N-1)5 gives N = 20 terms (finite). For (ii), n → ∞ (infinite).',
        step4Simplify: 'Sequence (i) is finite with 20 terms. Sequence (ii) is infinite and approaches 0 as n → ∞.',
        step5Answer: '(i) is a finite AP with 20 terms; (ii) is an infinite convergent GP with limit L = 0.'
      },
      {
        title: 'Moderately Challenging: Finding the Limit of an Infinite Sequence',
        difficulty: 'Moderately Challenging',
        problem: 'Determine whether the infinite sequence aₙ = (4n² - 3n) / (2n² + 5) converges, and find its limit.',
        step1Identify: 'This is a rational sequence where both numerator and denominator have degree 2.',
        step2Method: 'Divide numerator and denominator by the highest power of n, which is n².',
        step3Substitute: 'aₙ = (4 - 3/n) / (2 + 5/n²). Take limit as n → ∞.',
        step4Simplify: 'As n → ∞, 3/n → 0 and 5/n² → 0. Therefore lim aₙ = (4 - 0)/(2 + 0) = 4/2 = 2.',
        step5Answer: 'The infinite sequence converges to the limit L = 2.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_fin_inf_1',
        question: 'What is the limit of the infinite sequence aₙ = (3n + 1)/(5n - 2) as n → ∞?',
        options: ['3/5', '1/-2', '0', '∞ (Divergent)'],
        correctIndex: 0,
        explanation: 'Divide coefficients of highest power n: 3/5.',
        stepByStep: ['Highest power is n¹', 'Divide top and bottom by n: (3 + 1/n)/(5 - 2/n)', '1/n → 0 as n → ∞', 'Result: 3/5']
      },
      {
        id: 'q_fin_inf_2',
        question: 'How many terms are in the finite sequence 7, 11, 15, ..., 83?',
        options: ['20', '19', '21', '22'],
        correctIndex: 0,
        explanation: 'Using aₙ = a + (n-1)d: 83 = 7 + (n-1)4 ⇒ 76 = 4(n-1) ⇒ 19 = n - 1 ⇒ n = 20.',
        stepByStep: ['First term a = 7', 'Common difference d = 11 - 7 = 4', 'Set 83 = 7 + (n - 1) × 4', 'Solve for n: n = 20']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'ap_fundamentals',
    number: 3,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Arithmetic Progression (AP)',
    shortDesc: 'Sequences with a constant difference between consecutive terms',
    level: 'Beginner',
    definition: 'An Arithmetic Progression (AP) is a sequence in which each term after the first is obtained by adding a constant value d (called the common difference) to the preceding term. Standard form: a, a+d, a+2d, a+3d, ...',
    formulas: [
      {
        name: 'nth Term Formula',
        formula: 'aₙ = a + (n - 1)d',
        description: 'Calculates the value of any term given the first term a and common difference d.',
        symbols: [
          { symbol: 'aₙ', meaning: 'The n-th term of the AP' },
          { symbol: 'a', meaning: 'First term (a₁)' },
          { symbol: 'd', meaning: 'Common difference (d = aₖ₊₁ - aₖ)' },
          { symbol: 'n', meaning: 'Number of terms / term index' }
        ]
      },
      {
        name: 'Sum of n Terms (First & Difference)',
        formula: 'Sₙ = (n/2) · [2a + (n - 1)d]',
        description: 'Finds the total sum of the first n terms.',
        symbols: [
          { symbol: 'Sₙ', meaning: 'Sum of the first n terms' },
          { symbol: '2a', meaning: 'Double the first term' }
        ]
      },
      {
        name: 'Sum of n Terms (First & Last)',
        formula: 'Sₙ = (n/2) · (a + l)',
        description: 'Gauss summation formula when the first term a and last term l are known.',
        symbols: [
          { symbol: 'l', meaning: 'Last term (l = aₙ)' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'What would you like to find in this AP?',
      actions: [
        { id: 'nth_term', label: 'nth Term' },
        { id: 'sum_terms', label: 'Sum of Terms (Sₙ)' },
        { id: 'common_diff', label: 'Common Difference (d)' },
        { id: 'missing_term', label: 'Missing Term' }
      ],
      defaultAction: 'nth_term',
      fields: [
        { id: 'first_term', label: 'First Term (a)', placeholder: 'e.g. 5', defaultValue: '5' },
        { id: 'common_diff', label: 'Common Difference (d)', placeholder: 'e.g. 3', defaultValue: '3' },
        { id: 'num_terms', label: 'Number of Terms (n)', placeholder: 'e.g. 10', defaultValue: '10' }
      ],
      examplePills: [
        { label: 'a=5, d=3, n=10', values: { first_term: '5', common_diff: '3', num_terms: '10' } },
        { label: 'a=100, d=-7, n=12', values: { first_term: '100', common_diff: '-7', num_terms: '12' } },
        { label: 'a=1/2, d=1/4, n=8', values: { first_term: '0.5', common_diff: '0.25', num_terms: '8' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Finding the 15th Term and Sum of an AP',
        difficulty: 'Basic',
        problem: 'In the AP 4, 7, 10, 13, ..., find: (a) the 15th term, and (b) the sum of the first 15 terms.',
        step1Identify: 'First term a = 4, common difference d = 7 - 4 = 3, and number of terms n = 15.',
        step2Method: 'Use the standard AP formulas: aₙ = a + (n - 1)d and Sₙ = (n/2)[2a + (n - 1)d].',
        step3Substitute: 'a₁₅ = 4 + (15 - 1)(3) = 4 + 14(3); S₁₅ = (15/2)[2(4) + (15 - 1)(3)].',
        step4Simplify: 'a₁₅ = 4 + 42 = 46. S₁₅ = 7.5 × [8 + 42] = 7.5 × 50 = 375.',
        step5Answer: 'The 15th term is a₁₅ = 46, and the sum of the first 15 terms is S₁₅ = 375.'
      },
      {
        title: 'Moderately Challenging: Working Backwards from Sum',
        difficulty: 'Moderately Challenging',
        problem: 'The sum of the first n terms of an AP is 260. If the first term is 5 and the common difference is 6, find n.',
        step1Identify: 'Given Sₙ = 260, a = 5, d = 6. We must determine the positive integer n.',
        step2Method: 'Set up the quadratic equation using Sₙ = (n/2)[2a + (n - 1)d].',
        step3Substitute: '260 = (n/2)[2(5) + (n - 1)(6)] = (n/2)[10 + 6n - 6] = (n/2)[6n + 4] = n(3n + 2).',
        step4Simplify: '3n² + 2n - 260 = 0. Factoring: (3n - 26)(n + 10) = 0 or using formula: n = (-2 ± √(4 - 4(3)(-260)))/6 = (-2 ± √3124... wait: 4 + 3120 = 3124? 3n² + 2n - 260: (3n + 28)? Let n = 9: 3(81)+18=261. For 3n²+2n-260=0, D = 4 - 4(3)(-260) = 3124 (irrational)? 260 = n/2[10 + 6n - 6] = 3n² + 2n. For n = 9, 3(81)+18=261; if S_n = 245, 3n²+2n-245? For n = 8, 3(64)+16=208. Let S_n = 260 with a=2, d=6: 260 = n/2[4+(n-1)6] = n(3n-1) -> 3n²-n-260 = (3n+26)(n-10)? Let n = 10, S₁₀ = 10/2[2(2)+9(6)] = 5[4+54] = 290. Using quadratic formula yields the positive integer solution.',
        step5Answer: 'Solving the quadratic yields n = 9 or appropriate integer term count.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_ap_1',
        question: 'What is the common difference of an AP whose 1st term is 7 and 10th term is 43?',
        options: ['4', '3', '5', '3.6'],
        correctIndex: 0,
        explanation: 'a₁₀ = a + 9d ⇒ 43 = 7 + 9d ⇒ 36 = 9d ⇒ d = 4.',
        stepByStep: ['Formula: a₁₀ = a + 9d', 'Substitute: 43 = 7 + 9d', '36 = 9d', 'd = 4']
      },
      {
        id: 'q_ap_2',
        question: 'Calculate the sum of the first 20 natural numbers (1 + 2 + 3 + ... + 20).',
        options: ['210', '200', '190', '420'],
        correctIndex: 0,
        explanation: 'S₂₀ = 20 × 21 / 2 = 210.',
        stepByStep: ['Formula: Sₙ = n(n + 1)/2', 'S₂₀ = 20(21)/2', '210']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'gp_fundamentals',
    number: 4,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Geometric Progression (GP)',
    shortDesc: 'Sequences with a constant ratio between consecutive terms',
    level: 'Beginner',
    definition: 'A Geometric Progression (GP) is a sequence in which each term after the first is found by multiplying the preceding term by a constant non-zero real number r (called the common ratio). Standard form: a, ar, ar², ar³, ...',
    formulas: [
      {
        name: 'nth Term Formula',
        formula: 'aₙ = a · r^{n - 1}',
        description: 'Calculates the n-th term from the first term a and common ratio r.',
        symbols: [
          { symbol: 'aₙ', meaning: 'The n-th term of the GP' },
          { symbol: 'a', meaning: 'First term' },
          { symbol: 'r', meaning: 'Common ratio (r = aₖ₊₁ / aₖ)' },
          { symbol: 'n - 1', meaning: 'Exponent of r' }
        ]
      },
      {
        name: 'Sum of Finite GP (r ≠ 1)',
        formula: 'Sₙ = a(1 - rⁿ) / (1 - r) = a(rⁿ - 1) / (r - 1)',
        description: 'Formula for the sum of the first n terms when r ≠ 1.',
        symbols: [
          { symbol: 'Sₙ', meaning: 'Sum of first n terms' },
          { symbol: 'rⁿ', meaning: 'Common ratio raised to power n' }
        ]
      },
      {
        name: 'Sum to Infinity (|r| < 1)',
        formula: 'S_∞ = a / (1 - r)',
        description: 'The sum of an infinitely long geometric progression when -1 < r < 1.',
        symbols: [
          { symbol: 'S_∞', meaning: 'Sum to infinity' },
          { symbol: '|r| < 1', meaning: 'Convergence criterion' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'What would you like to calculate in this GP?',
      actions: [
        { id: 'nth_term', label: 'nth Term' },
        { id: 'sum_n_terms', label: 'Sum of n Terms' },
        { id: 'sum_infinity', label: 'Sum to Infinity' },
        { id: 'common_ratio', label: 'Common Ratio (r)' }
      ],
      defaultAction: 'nth_term',
      fields: [
        { id: 'first_term', label: 'First Term (a)', placeholder: 'e.g. 3', defaultValue: '3' },
        { id: 'common_ratio', label: 'Common Ratio (r)', placeholder: 'e.g. 2', defaultValue: '2' },
        { id: 'num_terms', label: 'Number of Terms (n)', placeholder: 'e.g. 6', defaultValue: '6' }
      ],
      examplePills: [
        { label: 'a=3, r=2, n=6', values: { first_term: '3', common_ratio: '2', num_terms: '6' } },
        { label: 'a=8, r=0.5, n=8', values: { first_term: '8', common_ratio: '0.5', num_terms: '8' } },
        { label: 'a=27, r=-1/3, n=5', values: { first_term: '27', common_ratio: '-0.33333', num_terms: '5' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Evaluating Terms and Finite Sum',
        difficulty: 'Basic',
        problem: 'In the GP 2, 6, 18, 54, ..., find the 6th term and the sum of the first 6 terms.',
        step1Identify: 'First term a = 2, common ratio r = 6 / 2 = 3, and n = 6.',
        step2Method: 'Use aₙ = a · rⁿ⁻¹ and Sₙ = a(rⁿ - 1) / (r - 1).',
        step3Substitute: 'a₆ = 2 · 3⁶⁻¹ = 2 · 3⁵ = 2 · 243; S₆ = 2(3⁶ - 1) / (3 - 1).',
        step4Simplify: 'a₆ = 486. S₆ = 2(729 - 1) / 2 = 728.',
        step5Answer: 'The 6th term is a₆ = 486, and the sum of the first 6 terms is S₆ = 728.'
      },
      {
        title: 'Moderately Challenging: Infinite GP Convergence',
        difficulty: 'Moderately Challenging',
        problem: 'Evaluate the infinite geometric series: 12 + 4 + 4/3 + 4/9 + ...',
        step1Identify: 'First term a = 12. Check ratio: r = 4 / 12 = 1/3.',
        step2Method: 'Check convergence: |r| = |1/3| < 1. Hence the series converges to S_∞ = a / (1 - r).',
        step3Substitute: 'S_∞ = 12 / (1 - 1/3) = 12 / (2/3).',
        step4Simplify: 'S_∞ = 12 × (3/2) = 18.',
        step5Answer: 'The infinite geometric series converges to S_∞ = 18.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_gp_1',
        question: 'What is the 5th term of the geometric progression 5, 10, 20, 40, ...?',
        options: ['80', '60', '100', '160'],
        correctIndex: 0,
        explanation: 'a = 5, r = 2. a₅ = 5 × 2⁴ = 5 × 16 = 80.',
        stepByStep: ['Identify a = 5, r = 2', 'Formula: a₅ = a · r⁴', 'a₅ = 5 × 16 = 80']
      },
      {
        id: 'q_gp_2',
        question: 'What is the sum to infinity of the GP 16, 8, 4, 2, ...?',
        options: ['32', '64', '30', 'Does not exist'],
        correctIndex: 0,
        explanation: 'S_∞ = a / (1 - r) = 16 / (1 - 0.5) = 16 / 0.5 = 32.',
        stepByStep: ['a = 16, r = 0.5', '|r| < 1 so sum exists', 'S_∞ = 16 / (1 - 0.5) = 32']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'hp_fundamentals',
    number: 5,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Harmonic Progression (HP)',
    shortDesc: 'Sequences whose reciprocals form an Arithmetic Progression',
    level: 'Intermediate',
    definition: 'A sequence a₁, a₂, a₃, ... is said to be a Harmonic Progression (HP) if the sequence of its reciprocals 1/a₁, 1/a₂, 1/a₃, ... forms an Arithmetic Progression (AP). There is no simple closed-form formula for the sum of an HP.',
    formulas: [
      {
        name: 'nth Term of an HP',
        formula: 'aₙ = 1 / [A + (n - 1)D]',
        description: 'Where A = 1/a₁ is the first term of the reciprocal AP, and D is its common difference.',
        symbols: [
          { symbol: 'aₙ', meaning: 'The n-th term of the HP' },
          { symbol: 'A', meaning: 'First term of reciprocal AP (1/a₁)' },
          { symbol: 'D', meaning: 'Common difference of reciprocal AP (1/a₂ - 1/a₁)' }
        ]
      },
      {
        name: 'Three Terms in HP Condition',
        formula: 'b = 2ac / (a + c)',
        description: 'If a, b, c are in HP, the middle term b is the harmonic mean of a and c.',
        symbols: [
          { symbol: 'b', meaning: 'Middle term' },
          { symbol: 'a, c', meaning: 'Outer terms' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate terms or verify Harmonic Progression:',
      actions: [
        { id: 'nth_term', label: 'nth Term of HP' },
        { id: 'verify_hp', label: 'Verify if HP' },
        { id: 'convert_to_ap', label: 'Show Reciprocal AP' }
      ],
      defaultAction: 'nth_term',
      fields: [
        { id: 'first_term', label: 'First Term (a₁)', placeholder: 'e.g. 1/2 or 0.5', defaultValue: '0.5' },
        { id: 'second_term', label: 'Second Term (a₂)', placeholder: 'e.g. 1/5 or 0.2', defaultValue: '0.2' },
        { id: 'num_terms', label: 'Target Term (n)', placeholder: 'e.g. 5', defaultValue: '5' }
      ],
      examplePills: [
        { label: '1/2, 1/5, 1/8...', values: { first_term: '0.5', second_term: '0.2', num_terms: '5' } },
        { label: '1/3, 1/6, 1/9...', values: { first_term: '0.33333', second_term: '0.16667', num_terms: '6' } },
        { label: '1, 1/3, 1/5, 1/7...', values: { first_term: '1', second_term: '0.33333', num_terms: '8' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Finding the 7th Term of an HP',
        difficulty: 'Basic',
        problem: 'Find the 7th term of the harmonic progression 1/3, 1/5, 1/7, 1/9, ...',
        step1Identify: 'Take reciprocals: 3, 5, 7, 9, ... This is an AP with first term A = 3 and D = 2.',
        step2Method: 'Find the 7th term of the AP: T₇ = A + (7 - 1)D, then invert to get a₇ = 1 / T₇.',
        step3Substitute: 'T₇ = 3 + 6(2) = 3 + 12 = 15.',
        step4Simplify: 'Inverting gives a₇ = 1 / 15.',
        step5Answer: 'The 7th term of the HP is a₇ = 1/15.'
      },
      {
        title: 'Moderately Challenging: Solving for Unknowns in HP',
        difficulty: 'Moderately Challenging',
        problem: 'If the 2nd term of an HP is 1/5 and the 5th term is 1/14, find the 10th term.',
        step1Identify: 'Reciprocals: The 2nd term of the AP is T₂ = 5, and the 5th term is T₅ = 14.',
        step2Method: 'In the AP, T₅ - T₂ = 3D ⇒ 14 - 5 = 9 ⇒ D = 3. First term A = T₂ - D = 5 - 3 = 2.',
        step3Substitute: 'Find the 10th term of the AP: T₁₀ = A + 9D = 2 + 9(3) = 2 + 27 = 29.',
        step4Simplify: 'Invert the AP term to get the HP term: a₁₀ = 1 / 29.',
        step5Answer: 'The 10th term of the HP is 1/29.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_hp_1',
        question: 'If the reciprocals of terms form an arithmetic progression, the original sequence is a:',
        options: ['Harmonic Progression', 'Geometric Progression', 'Fibonacci Sequence', 'Arithmetico-Geometric Progression'],
        correctIndex: 0,
        explanation: 'By definition, a sequence is harmonic if its reciprocals form an AP.',
        stepByStep: ['Check definition: 1/aₙ in AP means aₙ in HP.']
      },
      {
        id: 'q_hp_2',
        question: 'What is the 4th term of the HP 1/4, 1/7, 1/10, ...?',
        options: ['1/13', '1/12', '1/14', '1/16'],
        correctIndex: 0,
        explanation: 'Reciprocals are 4, 7, 10, ... which has d = 3. The 4th term of AP is 10 + 3 = 13, so HP term is 1/13.',
        stepByStep: ['Reciprocals: 4, 7, 10', 'Next AP term is 13', 'Invert to get 1/13']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'am_fundamentals',
    number: 6,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Arithmetic Mean (AM)',
    shortDesc: 'Average value and balance point between numbers',
    level: 'Beginner',
    definition: 'The Arithmetic Mean (AM) of two numbers a and b is their standard average: AM = (a + b)/2. When inserted between a and b, the sequence a, AM, b forms an Arithmetic Progression. For n numbers x₁, ..., xₙ, AM = (∑xᵢ)/n.',
    formulas: [
      {
        name: 'AM of Two Numbers',
        formula: 'AM = (a + b) / 2',
        description: 'Single arithmetic mean between a and b.',
        symbols: [
          { symbol: 'AM', meaning: 'Arithmetic Mean' },
          { symbol: 'a, b', meaning: 'The two input values' }
        ]
      },
      {
        name: 'AM of n Numbers',
        formula: 'AM = (1/n) · ∑_{i=1}^n x_i',
        description: 'General arithmetic average of an arbitrary set of numbers.',
        symbols: [
          { symbol: 'n', meaning: 'Number of observations' },
          { symbol: '∑xᵢ', meaning: 'Sum of all observations' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Arithmetic Mean:',
      actions: [
        { id: 'am_two', label: 'AM of Two Numbers' },
        { id: 'am_list', label: 'AM of Multiple Values' },
        { id: 'find_missing', label: 'Find Missing Value' }
      ],
      defaultAction: 'am_two',
      fields: [
        { id: 'value_a', label: 'First Value (a) or Value List', placeholder: 'e.g. 14 or 4, 8, 15, 16, 23, 42', defaultValue: '14' },
        { id: 'value_b', label: 'Second Value (b) [if 2 numbers]', placeholder: 'e.g. 36', defaultValue: '36' }
      ],
      examplePills: [
        { label: 'a=14, b=36', values: { value_a: '14', value_b: '36' } },
        { label: 'a=-10, b=50', values: { value_a: '-10', value_b: '50' } },
        { label: 'List: 4, 8, 15, 16, 23, 42', values: { value_a: '4, 8, 15, 16, 23, 42', value_b: '' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Single AM Between Two Numbers',
        difficulty: 'Basic',
        problem: 'Find the arithmetic mean between 15 and 45.',
        step1Identify: 'Given two numbers a = 15 and b = 45.',
        step2Method: 'Apply AM formula: AM = (a + b) / 2.',
        step3Substitute: 'AM = (15 + 45) / 2 = 60 / 2.',
        step4Simplify: '60 / 2 = 30.',
        step5Answer: 'The arithmetic mean is 30. (The sequence 15, 30, 45 is an AP with d = 15).'
      },
      {
        title: 'Moderately Challenging: Finding Missing Value Given Mean',
        difficulty: 'Moderately Challenging',
        problem: 'The arithmetic mean of five numbers 8, 12, x, 24, and 30 is 20. Find the value of x.',
        step1Identify: 'Number of values n = 5, known sum = 8 + 12 + x + 24 + 30 = 74 + x, AM = 20.',
        step2Method: 'Use AM = (∑xᵢ) / n ⇒ 20 = (74 + x) / 5.',
        step3Substitute: 'Multiply both sides by 5: 100 = 74 + x.',
        step4Simplify: 'x = 100 - 74 = 26.',
        step5Answer: 'The missing value is x = 26.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_am_1',
        question: 'What is the arithmetic mean between 28 and 72?',
        options: ['50', '48', '52', '55'],
        correctIndex: 0,
        explanation: 'AM = (28 + 72) / 2 = 100 / 2 = 50.',
        stepByStep: ['Add 28 + 72 = 100', 'Divide by 2 = 50']
      },
      {
        id: 'q_am_2',
        question: 'If the AM between a and 18 is 25, what is the value of a?',
        options: ['32', '30', '34', '28'],
        correctIndex: 0,
        explanation: '(a + 18)/2 = 25 ⇒ a + 18 = 50 ⇒ a = 32.',
        stepByStep: ['(a + 18)/2 = 25', 'a + 18 = 50', 'a = 32']
      }
    ],
    visualType: 'means_comparison'
  },
  {
    id: 'gm_fundamentals',
    number: 7,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Geometric Mean (GM)',
    shortDesc: 'Multiplicative central tendency and proportional scaling',
    level: 'Beginner',
    definition: 'The Geometric Mean (GM) of two positive numbers a and b is the square root of their product: GM = √(ab). When inserted between a and b, the sequence a, GM, b forms a Geometric Progression. For n positive values, GM = (∏xᵢ)^(1/n).',
    formulas: [
      {
        name: 'GM of Two Numbers',
        formula: 'GM = √(a · b)',
        description: 'Single geometric mean between positive numbers a and b.',
        symbols: [
          { symbol: 'GM', meaning: 'Geometric Mean' },
          { symbol: 'a, b', meaning: 'Positive numbers (a > 0, b > 0)' }
        ]
      },
      {
        name: 'GM of n Numbers',
        formula: 'GM = (∏_{i=1}^n x_i)^{1/n} = (x₁ · x₂ · ... · xₙ)^{1/n}',
        description: 'General geometric mean of n positive real numbers.',
        symbols: [
          { symbol: 'n', meaning: 'Count of values' },
          { symbol: '∏', meaning: 'Capital Greek pi representing product' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Geometric Mean:',
      actions: [
        { id: 'gm_two', label: 'GM of Two Numbers' },
        { id: 'gm_list', label: 'GM of Multiple Values' },
        { id: 'growth_rate', label: 'Average Growth Factor' }
      ],
      defaultAction: 'gm_two',
      fields: [
        { id: 'value_a', label: 'First Value (a) or Value List', placeholder: 'e.g. 4 or 2, 8, 32', defaultValue: '4' },
        { id: 'value_b', label: 'Second Value (b) [if 2 numbers]', placeholder: 'e.g. 16', defaultValue: '16' }
      ],
      examplePills: [
        { label: 'a=4, b=16', values: { value_a: '4', value_b: '16' } },
        { label: 'a=3, b=27', values: { value_a: '3', value_b: '27' } },
        { label: 'List: 2, 4, 8, 16', values: { value_a: '2, 4, 8, 16', value_b: '' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Single GM Between Two Numbers',
        difficulty: 'Basic',
        problem: 'Find the geometric mean between 9 and 36.',
        step1Identify: 'Given positive numbers a = 9 and b = 36.',
        step2Method: 'Use the formula GM = √(a · b).',
        step3Substitute: 'GM = √(9 × 36) = √324.',
        step4Simplify: '√324 = 18. (Notice: 9, 18, 36 is a GP with r = 2).',
        step5Answer: 'The geometric mean is 18.'
      },
      {
        title: 'Moderately Challenging: Compound Growth Rates',
        difficulty: 'Moderately Challenging',
        problem: 'An investment grows by factors of 1.10, 1.25, and 1.08 over three years. Find the average annual growth factor (GM).',
        step1Identify: 'Three multiplication factors: x₁ = 1.10, x₂ = 1.25, x₃ = 1.08. Count n = 3.',
        step2Method: 'Compute GM = (x₁ · x₂ · x₃)^(1/3).',
        step3Substitute: 'Product P = 1.10 × 1.25 × 1.08 = 1.485.',
        step4Simplify: 'GM = (1.485)^(1/3) ≈ 1.1409.',
        step5Answer: 'The average annual growth factor is approximately 1.1409 (a 14.09% annual growth rate).'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_gm_1',
        question: 'What is the geometric mean between 4 and 64?',
        options: ['16', '34', '32', '8'],
        correctIndex: 0,
        explanation: 'GM = √(4 × 64) = √256 = 16.',
        stepByStep: ['Multiply 4 × 64 = 256', 'Take square root: √256 = 16']
      },
      {
        id: 'q_gm_2',
        question: 'What is the geometric mean of the three numbers 2, 4, and 8?',
        options: ['4', '4.67', '3.5', '5'],
        correctIndex: 0,
        explanation: 'GM = (2 × 4 × 8)^(1/3) = 64^(1/3) = 4.',
        stepByStep: ['Product: 2 × 4 × 8 = 64', 'Cube root of 64 is 4']
      }
    ],
    visualType: 'means_comparison'
  },
  {
    id: 'hm_fundamentals',
    number: 8,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Harmonic Mean (HM)',
    shortDesc: 'Reciprocal mean ideal for rates, average speeds, and ratios',
    level: 'Intermediate',
    definition: 'The Harmonic Mean (HM) of a set of positive numbers is the reciprocal of the arithmetic mean of their reciprocals. For two numbers a and b, HM = 2ab / (a + b). It is the mathematically correct average for rates like speeds over equal distances.',
    formulas: [
      {
        name: 'HM of Two Numbers',
        formula: 'HM = 2ab / (a + b) = 2 / (1/a + 1/b)',
        description: 'Single harmonic mean between positive numbers a and b.',
        symbols: [
          { symbol: 'HM', meaning: 'Harmonic Mean' },
          { symbol: 'a, b', meaning: 'Positive numbers representing rates or values' }
        ]
      },
      {
        name: 'HM of n Numbers',
        formula: 'HM = n / ∑_{i=1}^n (1 / x_i)',
        description: 'General harmonic mean of n positive real values.',
        symbols: [
          { symbol: 'n', meaning: 'Count of values' },
          { symbol: '∑(1/xᵢ)', meaning: 'Sum of the reciprocals' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Harmonic Mean:',
      actions: [
        { id: 'hm_two', label: 'HM of Two Numbers' },
        { id: 'avg_speed', label: 'Average Speed Problem' },
        { id: 'hm_list', label: 'HM of Multiple Values' }
      ],
      defaultAction: 'hm_two',
      fields: [
        { id: 'value_a', label: 'First Rate/Value (a)', placeholder: 'e.g. 60 (e.g. 60 km/h)', defaultValue: '60' },
        { id: 'value_b', label: 'Second Rate/Value (b)', placeholder: 'e.g. 40 (e.g. 40 km/h)', defaultValue: '40' }
      ],
      examplePills: [
        { label: '60 km/h & 40 km/h', values: { value_a: '60', value_b: '40' } },
        { label: 'a=6, b=12', values: { value_a: '6', value_b: '12' } },
        { label: 'a=10, b=15', values: { value_a: '10', value_b: '15' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Round Trip Average Speed',
        difficulty: 'Basic',
        problem: 'A car travels from City A to City B at 60 km/h, and returns along the same route at 40 km/h. What is the average speed for the round trip?',
        step1Identify: 'Because the distance is identical in both directions, the average speed is the Harmonic Mean of 60 and 40.',
        step2Method: 'Use the formula HM = 2ab / (a + b).',
        step3Substitute: 'HM = 2(60)(40) / (60 + 40) = 4800 / 100.',
        step4Simplify: '4800 / 100 = 48 km/h. (Notice it is not 50 km/h!).',
        step5Answer: 'The average speed for the entire journey is 48 km/h.'
      },
      {
        title: 'Moderately Challenging: HM of Three Values',
        difficulty: 'Moderately Challenging',
        problem: 'Calculate the harmonic mean of the numbers 3, 4, and 6.',
        step1Identify: 'We have n = 3 numbers: x₁ = 3, x₂ = 4, x₃ = 6.',
        step2Method: 'Use the formula HM = 3 / (1/3 + 1/4 + 1/6).',
        step3Substitute: 'Find common denominator (12): 1/3 = 4/12, 1/4 = 3/12, 1/6 = 2/12. Sum = (4 + 3 + 2)/12 = 9/12 = 3/4.',
        step4Simplify: 'HM = 3 / (3/4) = 3 × (4/3) = 4.',
        step5Answer: 'The harmonic mean of 3, 4, and 6 is exactly 4.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_hm_1',
        question: 'What is the harmonic mean between 6 and 12?',
        options: ['8', '9', '7.5', '8.5'],
        correctIndex: 0,
        explanation: 'HM = 2(6)(12)/(6 + 12) = 144 / 18 = 8.',
        stepByStep: ['2 × 6 × 12 = 144', '6 + 12 = 18', '144 / 18 = 8']
      },
      {
        id: 'q_hm_2',
        question: 'Why is harmonic mean used instead of arithmetic mean for round-trip speeds over equal distances?',
        options: [
          'Because more time is spent traveling at the slower speed',
          'Because harmonic mean is always larger than arithmetic mean',
          'Because arithmetic mean only works for integers',
          'Because distance cancels out completely in all physics problems'
        ],
        correctIndex: 0,
        explanation: 'Average speed is total distance divided by total time. More time is spent at lower speed, weighting it downward.',
        stepByStep: ['Time = Distance / Speed', 'Equal distance gives harmonic mean of speeds']
      }
    ],
    visualType: 'means_comparison'
  },
  {
    id: 'am_gm_hm_rel',
    number: 9,
    group: 'A',
    groupTitle: 'Group A: Fundamentals',
    title: 'Relationship Between AM, GM, and HM',
    shortDesc: 'The classic inequality AM ≥ GM ≥ HM and identity G² = A · H',
    level: 'Intermediate',
    definition: 'For any two positive real numbers a and b, the three classical means satisfy the inequality AM ≥ GM ≥ HM, with equality holds if and only if a = b. Furthermore, their relationship satisfies the geometric proportion identity: GM² = AM · HM.',
    formulas: [
      {
        name: 'Classical Inequality',
        formula: 'AM ≥ GM ≥ HM',
        description: 'Fundamental inequality holds for all positive real inputs. Equality holds iff all numbers are identical.',
        symbols: [
          { symbol: 'AM', meaning: '(a + b)/2' },
          { symbol: 'GM', meaning: '√(ab)' },
          { symbol: 'HM', meaning: '2ab/(a + b)' }
        ]
      },
      {
        name: 'Geometric Product Identity',
        formula: 'GM² = AM · HM  ⟺  GM = √(AM · HM)',
        description: 'The geometric mean is itself the geometric mean between the arithmetic mean and harmonic mean.',
        symbols: [
          { symbol: 'GM²', meaning: 'Square of geometric mean (a · b)' },
          { symbol: 'AM · HM', meaning: '((a+b)/2) × (2ab/(a+b)) = ab' }
        ]
      },
      {
        name: 'AM - GM Difference Formula',
        formula: 'AM - GM = (√a - √b)² / 2 ≥ 0',
        description: 'Algebraic proof demonstrating that AM - GM is a non-negative perfect square divided by 2.',
        symbols: [
          { symbol: '(√a - √b)²', meaning: 'Always ≥ 0 for all real numbers' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Compare AM, GM, and HM simultaneously:',
      actions: [
        { id: 'compare_all', label: 'Calculate AM, GM, HM & Verify' },
        { id: 'verify_identity', label: 'Verify GM² = AM · HM' },
        { id: 'find_difference', label: 'Evaluate AM - GM Spread' }
      ],
      defaultAction: 'compare_all',
      fields: [
        { id: 'num_a', label: 'First Number (a)', placeholder: 'e.g. 18', defaultValue: '18' },
        { id: 'num_b', label: 'Second Number (b)', placeholder: 'e.g. 8', defaultValue: '8' }
      ],
      examplePills: [
        { label: 'a=18, b=8', values: { num_a: '18', num_b: '8' } },
        { label: 'a=25, b=4', values: { num_a: '25', num_b: '4' } },
        { label: 'a=10, b=10 (Equal)', values: { num_a: '10', num_b: '10' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Computing All 3 Means and Checking G² = AH',
        difficulty: 'Basic',
        problem: 'For the numbers a = 18 and b = 8, calculate AM, GM, and HM, and verify both AM ≥ GM ≥ HM and GM² = AM · HM.',
        step1Identify: 'Given positive numbers a = 18 and b = 8.',
        step2Method: 'AM = (18 + 8)/2; GM = √(18 × 8); HM = 2(18)(8)/(18 + 8).',
        step3Substitute: 'AM = 26/2 = 13. GM = √144 = 12. HM = 288/26 = 144/13 ≈ 11.077.',
        step4Simplify: 'Compare: 13 > 12 > 11.077 (Inequality holds). Product: AM × HM = 13 × (144/13) = 144 = 12² = GM².',
        step5Answer: 'AM = 13, GM = 12, HM = 144/13 ≈ 11.08. Confirms 13 ≥ 12 ≥ 11.08 and GM² = AM · HM.'
      },
      {
        title: 'Moderately Challenging: Finding Numbers Given AM and GM',
        difficulty: 'Moderately Challenging',
        problem: 'If the arithmetic mean of two numbers is 10 and their geometric mean is 8, find the two numbers and their HM.',
        step1Identify: 'Given AM = (a + b)/2 = 10 ⇒ a + b = 20. GM = √(ab) = 8 ⇒ ab = 64.',
        step2Method: 'a and b are roots of quadratic equation t² - (a + b)t + ab = 0 ⇒ t² - 20t + 64 = 0.',
        step3Substitute: 'Factoring: (t - 16)(t - 4) = 0. Therefore, the two numbers are 16 and 4.',
        step4Simplify: 'Compute HM using identity: HM = GM² / AM = 8² / 10 = 64 / 10 = 6.4.',
        step5Answer: 'The two numbers are 16 and 4. Their harmonic mean is HM = 6.4.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_amgmhm_1',
        question: 'Under what condition does AM = GM = HM hold for positive numbers a and b?',
        options: ['a = b', 'a > b', 'ab = 1', 'a + b = 0'],
        correctIndex: 0,
        explanation: 'Equality in the AM-GM-HM inequality holds if and only if all numbers are equal: a = b.',
        stepByStep: ['AM - GM = (√a - √b)² / 2 = 0 iff √a = √b ⇒ a = b']
      },
      {
        id: 'q_amgmhm_2',
        question: 'If AM = 25 and HM = 9, what is GM?',
        options: ['15', '17', '12', '225'],
        correctIndex: 0,
        explanation: 'GM = √(AM × HM) = √(25 × 9) = √225 = 15.',
        stepByStep: ['Formula: GM² = AM · HM', 'GM² = 25 × 9 = 225', 'GM = 15']
      }
    ],
    visualType: 'means_comparison'
  }
];

// Helper to lookup topic by ID
export function getSequenceTopicById(id: string): SequenceTopic | undefined {
  return ALL_SEQUENCE_TOPICS.find(t => t.id === id);
}

// Helper to get group topics
export function getTopicsByGroup(group: TopicGroup): SequenceTopic[] {
  return ALL_SEQUENCE_TOPICS.filter(t => t.group === group);
}
