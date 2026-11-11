import type { SequenceTopic } from '../sequenceTopicsData';

export const GROUP_B_TOPICS: SequenceTopic[] = [
  {
    id: 'find_nth_term',
    number: 10,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Finding the nth Term',
    shortDesc: 'Calculate general term values for AP, GP, HP, or custom progressions',
    level: 'Beginner',
    definition: 'Finding the n-th term means determining the exact mathematical value of a sequence at position n without needing to calculate all preceding terms individually. Depending on whether the sequence is arithmetic, geometric, or harmonic, the corresponding general explicit formula is applied.',
    formulas: [
      {
        name: 'AP General Term',
        formula: 'aₙ = a + (n - 1)d',
        description: 'Used when consecutive terms differ by a constant addition/subtraction d.',
        symbols: [
          { symbol: 'a', meaning: 'First term' },
          { symbol: 'd', meaning: 'Common difference' },
          { symbol: 'n', meaning: 'Target position' }
        ]
      },
      {
        name: 'GP General Term',
        formula: 'aₙ = a · r^{n - 1}',
        description: 'Used when consecutive terms scale by a constant multiplier r.',
        symbols: [
          { symbol: 'a', meaning: 'First term' },
          { symbol: 'r', meaning: 'Common ratio' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Find the n-th term of a sequence:',
      actions: [
        { id: 'ap_nth', label: 'Arithmetic AP nth Term' },
        { id: 'gp_nth', label: 'Geometric GP nth Term' },
        { id: 'from_terms', label: 'From Given Terms' }
      ],
      defaultAction: 'ap_nth',
      fields: [
        { id: 'first_term', label: 'First Term (a)', placeholder: 'e.g. 7', defaultValue: '7' },
        { id: 'step_val', label: 'Difference (d) or Ratio (r)', placeholder: 'e.g. 4', defaultValue: '4' },
        { id: 'target_n', label: 'Target Position (n)', placeholder: 'e.g. 25', defaultValue: '25' }
      ],
      examplePills: [
        { label: 'AP: a=7, d=4, n=25', values: { first_term: '7', step_val: '4', target_n: '25' } },
        { label: 'GP: a=3, r=2, n=10', values: { first_term: '3', step_val: '2', target_n: '10' } },
        { label: 'AP: a=100, d=-3, n=50', values: { first_term: '100', step_val: '-3', target_n: '50' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: 25th Term of an AP',
        difficulty: 'Basic',
        problem: 'Find the 25th term of the arithmetic progression 7, 11, 15, 19, ...',
        step1Identify: 'First term a = 7, common difference d = 11 - 7 = 4, target index n = 25.',
        step2Method: 'Use the AP nth term formula: aₙ = a + (n - 1)d.',
        step3Substitute: 'a₂₅ = 7 + (25 - 1) × 4 = 7 + 24 × 4.',
        step4Simplify: '24 × 4 = 96. Then 7 + 96 = 103.',
        step5Answer: 'The 25th term of the AP is a₂₅ = 103.'
      },
      {
        title: 'Moderately Challenging: 8th Term of a Geometric Progression',
        difficulty: 'Moderately Challenging',
        problem: 'In a GP with first term a = 128 and common ratio r = -1/2, find the 8th term.',
        step1Identify: 'a = 128, r = -0.5, target index n = 8.',
        step2Method: 'Use GP nth term formula: aₙ = a · rⁿ⁻¹.',
        step3Substitute: 'a₈ = 128 · (-1/2)⁸⁻¹ = 128 · (-1/2)⁷.',
        step4Simplify: '(-1/2)⁷ = -1/128. Therefore a₈ = 128 × (-1/128) = -1.',
        step5Answer: 'The 8th term of the GP is a₈ = -1.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_fnth_1',
        question: 'What is the 30th term of the arithmetic progression 2, 5, 8, 11, ...?',
        options: ['89', '92', '86', '95'],
        correctIndex: 0,
        explanation: 'a = 2, d = 3. a₃₀ = 2 + 29(3) = 2 + 87 = 89.',
        stepByStep: ['a = 2, d = 3, n = 30', 'a₃₀ = 2 + (30 - 1) × 3', '2 + 87 = 89']
      },
      {
        id: 'q_fnth_2',
        question: 'What is the 6th term of the geometric progression 5, 15, 45, ...?',
        options: ['1215', '405', '3645', '135'],
        correctIndex: 0,
        explanation: 'a = 5, r = 3. a₆ = 5 × 3⁵ = 5 × 243 = 1215.',
        stepByStep: ['a = 5, r = 3, n = 6', 'a₆ = 5 · 3⁵', '5 × 243 = 1215']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'find_num_terms',
    number: 11,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Finding the Number of Terms',
    shortDesc: 'Solve for the index n given first term, last term, and step/ratio',
    level: 'Beginner',
    definition: 'Finding the number of terms n involves determining how many elements exist between the first term a and the final term l of a progression. In an AP, this is solved linearly; in a GP, logarithms are utilized.',
    formulas: [
      {
        name: 'Number of Terms in an AP',
        formula: 'n = [(l - a) / d] + 1',
        description: 'Direct formula derived from l = a + (n - 1)d.',
        symbols: [
          { symbol: 'n', meaning: 'Total number of terms' },
          { symbol: 'l', meaning: 'Last term (terminal value)' },
          { symbol: 'a', meaning: 'First term' },
          { symbol: 'd', meaning: 'Common difference' }
        ]
      },
      {
        name: 'Number of Terms in a GP',
        formula: 'n = [ln(l / a) / ln(r)] + 1',
        description: 'Logarithmic formula derived from l = a · rⁿ⁻¹.',
        symbols: [
          { symbol: 'ln', meaning: 'Natural logarithm' },
          { symbol: 'r', meaning: 'Common ratio' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Find the total number of terms (n):',
      actions: [
        { id: 'ap_num_terms', label: 'AP Number of Terms' },
        { id: 'gp_num_terms', label: 'GP Number of Terms' }
      ],
      defaultAction: 'ap_num_terms',
      fields: [
        { id: 'first_term', label: 'First Term (a)', placeholder: 'e.g. 5', defaultValue: '5' },
        { id: 'step_val', label: 'Difference (d) or Ratio (r)', placeholder: 'e.g. 3', defaultValue: '3' },
        { id: 'last_term', label: 'Last Term (l)', placeholder: 'e.g. 92', defaultValue: '92' }
      ],
      examplePills: [
        { label: 'AP: 5 to 92 (d=3)', values: { first_term: '5', step_val: '3', last_term: '92' } },
        { label: 'AP: 100 down to 10 (d=-5)', values: { first_term: '100', step_val: '-5', last_term: '10' } },
        { label: 'GP: 3 to 768 (r=2)', values: { first_term: '3', step_val: '2', last_term: '768' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Number of Terms in an Arithmetic Sequence',
        difficulty: 'Basic',
        problem: 'How many terms are there in the sequence 5, 8, 11, 14, ..., 92?',
        step1Identify: 'First term a = 5, common difference d = 8 - 5 = 3, last term l = 92.',
        step2Method: 'Use the formula n = [(l - a) / d] + 1.',
        step3Substitute: 'n = [(92 - 5) / 3] + 1 = [87 / 3] + 1.',
        step4Simplify: '87 / 3 = 29. Adding 1 gives n = 30.',
        step5Answer: 'There are exactly 30 terms in the sequence.'
      },
      {
        title: 'Moderately Challenging: Number of Terms in a Geometric Sequence',
        difficulty: 'Moderately Challenging',
        problem: 'How many terms are in the GP 6, 18, 54, ..., 4374?',
        step1Identify: 'First term a = 6, common ratio r = 18 / 6 = 3, last term l = 4374.',
        step2Method: 'Set up l = a · rⁿ⁻¹ ⇒ 4374 = 6 · 3ⁿ⁻¹.',
        step3Substitute: 'Divide by 6: 4374 / 6 = 729 = 3ⁿ⁻¹.',
        step4Simplify: 'Express 729 as a power of 3: 3⁶ = 729. Therefore n - 1 = 6 ⇒ n = 7.',
        step5Answer: 'There are 7 terms in this geometric progression.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_num_1',
        question: 'How many terms are in the AP 12, 19, 26, ..., 145?',
        options: ['20', '19', '21', '22'],
        correctIndex: 0,
        explanation: 'n = (145 - 12)/7 + 1 = 133/7 + 1 = 19 + 1 = 20.',
        stepByStep: ['l - a = 145 - 12 = 133', '133 / 7 = 19', '19 + 1 = 20']
      },
      {
        id: 'q_num_2',
        question: 'How many terms are in the GP 2, 4, 8, ..., 1024?',
        options: ['10', '9', '11', '12'],
        correctIndex: 0,
        explanation: '1024 = 2 · 2ⁿ⁻¹ = 2ⁿ ⇒ 2¹⁰ = 1024 ⇒ n = 10.',
        stepByStep: ['2ⁿ = 1024', 'Since 2¹⁰ = 1024, n = 10']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'find_missing_terms',
    number: 12,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Finding Missing Terms',
    shortDesc: 'Deduce unknown intermediate or boundary terms from given positions',
    level: 'Intermediate',
    definition: 'Finding missing terms involves setting up simultaneous linear or exponential equations based on the indices of the known terms. For an AP, differences are proportional to index gaps: a_q - a_p = (q - p)d. For a GP, ratios are exponential: a_q / a_p = r^(q - p).',
    formulas: [
      {
        name: 'AP Difference from Known Terms',
        formula: 'd = (a_q - a_p) / (q - p)',
        description: 'Finds common difference directly from any two known terms at positions p and q.',
        symbols: [
          { symbol: 'a_p, a_q', meaning: 'Known term values' },
          { symbol: 'p, q', meaning: 'Respective term positions' }
        ]
      },
      {
        name: 'GP Ratio from Known Terms',
        formula: 'r = (a_q / a_p)^{1 / (q - p)}',
        description: 'Finds common ratio directly from any two known terms at positions p and q.',
        symbols: [
          { symbol: 'r', meaning: 'Common ratio' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Solve for missing terms:',
      actions: [
        { id: 'ap_two_points', label: 'AP from Two Known Terms' },
        { id: 'gp_two_points', label: 'GP from Two Known Terms' },
        { id: 'fill_blanks', label: 'Fill Missing Terms List' }
      ],
      defaultAction: 'ap_two_points',
      fields: [
        { id: 'pos_p', label: 'Position of 1st Known Term (p)', placeholder: 'e.g. 3', defaultValue: '3' },
        { id: 'val_p', label: 'Value of 1st Known Term (a_p)', placeholder: 'e.g. 14', defaultValue: '14' },
        { id: 'pos_q', label: 'Position of 2nd Known Term (q)', placeholder: 'e.g. 7', defaultValue: '7' },
        { id: 'val_q', label: 'Value of 2nd Known Term (a_q)', placeholder: 'e.g. 30', defaultValue: '30' }
      ],
      examplePills: [
        { label: 'AP: T₃=14, T₇=30', values: { pos_p: '3', val_p: '14', pos_q: '7', val_q: '30' } },
        { label: 'AP: T₄=22, T₁₀=52', values: { pos_p: '4', val_p: '22', pos_q: '10', val_q: '52' } },
        { label: 'GP: T₂=6, T₅=162', values: { pos_p: '2', val_p: '6', pos_q: '5', val_q: '162' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Finding AP from 3rd and 7th Terms',
        difficulty: 'Basic',
        problem: 'In an AP, the 3rd term is 14 and the 7th term is 30. Find the first term a, the common difference d, and the missing 5th term.',
        step1Identify: 'Given a₃ = 14 and a₇ = 30.',
        step2Method: 'Use the index gap formula: d = (a₇ - a₃) / (7 - 3).',
        step3Substitute: 'd = (30 - 14) / 4 = 16 / 4 = 4.',
        step4Simplify: 'First term a = a₃ - 2d = 14 - 2(4) = 14 - 8 = 6. Missing 5th term a₅ = a + 4d = 6 + 4(4) = 22.',
        step5Answer: 'First term a = 6, common difference d = 4, and the 5th term is 22.'
      },
      {
        title: 'Moderately Challenging: Missing Terms in a GP',
        difficulty: 'Moderately Challenging',
        problem: 'The 2nd term of a positive GP is 6 and the 5th term is 162. Find the missing 3rd and 4th terms.',
        step1Identify: 'a₂ = 6 and a₅ = 162.',
        step2Method: 'Ratio equation: a₅ / a₂ = r⁵⁻² ⇒ 162 / 6 = r³.',
        step3Substitute: '27 = r³ ⇒ r = 3 (since terms are positive). First term a = a₂ / r = 6 / 3 = 2.',
        step4Simplify: '3rd term a₃ = 6 × 3 = 18. 4th term a₄ = 18 × 3 = 54.',
        step5Answer: 'The missing terms are a₃ = 18 and a₄ = 54. The progression is 2, 6, 18, 54, 162.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_miss_1',
        question: 'If the 4th term of an AP is 19 and the 9th term is 39, what is the common difference?',
        options: ['4', '5', '3', '6'],
        correctIndex: 0,
        explanation: 'd = (39 - 19)/(9 - 4) = 20/5 = 4.',
        stepByStep: ['Difference in values: 39 - 19 = 20', 'Difference in indices: 9 - 4 = 5', 'd = 20 / 5 = 4']
      },
      {
        id: 'q_miss_2',
        question: 'Fill the blank in the AP: 8, __, 24.',
        options: ['16', '14', '18', '12'],
        correctIndex: 0,
        explanation: 'The missing term is the AM: (8 + 24)/2 = 32/2 = 16.',
        stepByStep: ['Middle term of 3-term AP is arithmetic mean', '(8 + 24)/2 = 16']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'insert_am',
    number: 13,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Inserting Arithmetic Means',
    shortDesc: 'Place k intermediate values between a and b to form an extended AP',
    level: 'Intermediate',
    definition: 'Inserting k arithmetic means between two numbers a and b means finding k numbers A₁, A₂, ..., A_k such that the entire sequence a, A₁, A₂, ..., A_k, b forms an Arithmetic Progression with k + 2 terms.',
    formulas: [
      {
        name: 'Common Difference for k Means',
        formula: 'd = (b - a) / (k + 1)',
        description: 'Calculates the required step size across the k + 1 intervals.',
        symbols: [
          { symbol: 'd', meaning: 'Common difference of extended AP' },
          { symbol: 'b - a', meaning: 'Total interval span' },
          { symbol: 'k + 1', meaning: 'Number of intervals between k inserted means' }
        ]
      },
      {
        name: 'ith Inserted Mean',
        formula: 'A_i = a + i · d = a + i · [(b - a) / (k + 1)]',
        description: 'Gives the value of the i-th inserted arithmetic mean (i = 1, 2, ..., k).',
        symbols: [
          { symbol: 'A_i', meaning: 'The i-th inserted mean' },
          { symbol: 'i', meaning: 'Mean index (1 ≤ i ≤ k)' }
        ]
      },
      {
        name: 'Sum of k Inserted Means',
        formula: '∑_{i=1}^k A_i = k · [(a + b) / 2]',
        description: 'The sum of k inserted arithmetic means is exactly k times the single AM of a and b.',
        symbols: [
          { symbol: 'k', meaning: 'Count of inserted means' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Insert Arithmetic Means between a and b:',
      actions: [
        { id: 'insert_means', label: 'Insert k Means & List' },
        { id: 'sum_means', label: 'Find Sum of Inserted Means' }
      ],
      defaultAction: 'insert_means',
      fields: [
        { id: 'start_a', label: 'First Number (a)', placeholder: 'e.g. 3', defaultValue: '3' },
        { id: 'end_b', label: 'Second Number (b)', placeholder: 'e.g. 23', defaultValue: '23' },
        { id: 'count_k', label: 'Number of Means to Insert (k)', placeholder: 'e.g. 4', defaultValue: '4' }
      ],
      examplePills: [
        { label: 'Insert 4 AMs between 3 and 23', values: { start_a: '3', end_b: '23', count_k: '4' } },
        { label: 'Insert 3 AMs between 8 and 32', values: { start_a: '8', end_b: '32', count_k: '3' } },
        { label: 'Insert 5 AMs between -4 and 14', values: { start_a: '-4', end_b: '14', count_k: '5' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Inserting 4 AMs between 3 and 23',
        difficulty: 'Basic',
        problem: 'Insert 4 arithmetic means between 3 and 23.',
        step1Identify: 'a = 3, b = 23, k = 4. Total number of terms in resulting AP is 4 + 2 = 6.',
        step2Method: 'Compute d = (b - a) / (k + 1) = (23 - 3) / (4 + 1).',
        step3Substitute: 'd = 20 / 5 = 4.',
        step4Simplify: 'A₁ = 3 + 4 = 7; A₂ = 7 + 4 = 11; A₃ = 11 + 4 = 15; A₄ = 15 + 4 = 19.',
        step5Answer: 'The 4 inserted arithmetic means are 7, 11, 15, and 19. Complete AP: 3, 7, 11, 15, 19, 23.'
      },
      {
        title: 'Moderately Challenging: Sum of Inserted Means Theorem',
        difficulty: 'Moderately Challenging',
        problem: 'If 6 arithmetic means are inserted between 5 and 33, what is the exact sum of these 6 inserted means?',
        step1Identify: 'a = 5, b = 33, k = 6.',
        step2Method: 'Use the theorem: Sum of k AMs = k × [(a + b) / 2].',
        step3Substitute: 'Single AM = (5 + 33) / 2 = 38 / 2 = 19.',
        step4Simplify: 'Sum = 6 × 19 = 114.',
        step5Answer: 'The sum of the 6 inserted arithmetic means is 114.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_iam_1',
        question: 'If 3 arithmetic means are inserted between 2 and 18, what is the common difference?',
        options: ['4', '5', '3.5', '3'],
        correctIndex: 0,
        explanation: 'd = (18 - 2)/(3 + 1) = 16/4 = 4.',
        stepByStep: ['b - a = 18 - 2 = 16', 'k + 1 = 3 + 1 = 4', 'd = 16 / 4 = 4']
      },
      {
        id: 'q_iam_2',
        question: 'What is the 2nd inserted arithmetic mean between 5 and 29 if 3 means are inserted?',
        options: ['17', '11', '23', '15'],
        correctIndex: 0,
        explanation: 'd = (29 - 5)/(3 + 1) = 24/4 = 6. A₁ = 11, A₂ = 11 + 6 = 17.',
        stepByStep: ['d = 24/4 = 6', 'A₁ = 5 + 6 = 11', 'A₂ = 11 + 6 = 17']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'insert_gm',
    number: 14,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Inserting Geometric Means',
    shortDesc: 'Place k intermediate terms between a and b to form an extended GP',
    level: 'Intermediate',
    definition: 'Inserting k geometric means between two positive numbers a and b means finding k numbers G₁, G₂, ..., G_k such that the entire sequence a, G₁, G₂, ..., G_k, b forms a Geometric Progression with k + 2 terms.',
    formulas: [
      {
        name: 'Common Ratio for k Means',
        formula: 'r = (b / a)^{1 / (k + 1)}',
        description: 'Calculates the multiplicative step ratio across k + 1 intervals.',
        symbols: [
          { symbol: 'r', meaning: 'Common ratio of extended GP' },
          { symbol: 'b / a', meaning: 'Overall scaling factor' },
          { symbol: '1 / (k + 1)', meaning: 'Fractional exponent' }
        ]
      },
      {
        name: 'ith Inserted Geometric Mean',
        formula: 'G_i = a · r^i = a · (b / a)^{i / (k + 1)}',
        description: 'Calculates the i-th inserted geometric mean (i = 1, 2, ..., k).',
        symbols: [
          { symbol: 'G_i', meaning: 'The i-th inserted GM' }
        ]
      },
      {
        name: 'Product of k Inserted Means',
        formula: '∏_{i=1}^k G_i = [√(a · b)]^k',
        description: 'The product of k inserted geometric means equals the k-th power of the single GM between a and b.',
        symbols: [
          { symbol: '√(a · b)', meaning: 'Single geometric mean of a and b' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Insert Geometric Means between positive values a and b:',
      actions: [
        { id: 'insert_gms', label: 'Insert k GMs & List' },
        { id: 'product_gms', label: 'Find Product of Inserted GMs' }
      ],
      defaultAction: 'insert_gms',
      fields: [
        { id: 'start_a', label: 'First Number (a)', placeholder: 'e.g. 2', defaultValue: '2' },
        { id: 'end_b', label: 'Second Number (b)', placeholder: 'e.g. 162', defaultValue: '162' },
        { id: 'count_k', label: 'Number of Means (k)', placeholder: 'e.g. 3', defaultValue: '3' }
      ],
      examplePills: [
        { label: 'Insert 3 GMs between 2 and 162', values: { start_a: '2', end_b: '162', count_k: '3' } },
        { label: 'Insert 2 GMs between 3 and 192', values: { start_a: '3', end_b: '192', count_k: '2' } },
        { label: 'Insert 4 GMs between 1 and 32', values: { start_a: '1', end_b: '32', count_k: '4' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Inserting 3 GMs between 2 and 162',
        difficulty: 'Basic',
        problem: 'Insert 3 geometric means between 2 and 162.',
        step1Identify: 'a = 2, b = 162, k = 3. Total terms in GP is 3 + 2 = 5.',
        step2Method: 'Compute r = (b / a)^(1 / (k + 1)) = (162 / 2)^(1 / 4).',
        step3Substitute: 'r = 81^(1/4) = 3.',
        step4Simplify: 'G₁ = 2 × 3 = 6; G₂ = 6 × 3 = 18; G₃ = 18 × 3 = 54.',
        step5Answer: 'The 3 inserted geometric means are 6, 18, and 54. Complete GP: 2, 6, 18, 54, 162.'
      },
      {
        title: 'Moderately Challenging: Product of Inserted Means',
        difficulty: 'Moderately Challenging',
        problem: 'If 4 geometric means are inserted between 3 and 243, find the product of these 4 inserted means.',
        step1Identify: 'a = 3, b = 243, k = 4.',
        step2Method: 'Use the theorem: Product of k GMs = [√(a · b)]^k.',
        step3Substitute: 'Single GM = √(3 × 243) = √729 = 27.',
        step4Simplify: 'Product = (27)⁴ = (3³)⁴ = 3¹² = 531,441.',
        step5Answer: 'The product of the 4 inserted geometric means is 531,441.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_igm_1',
        question: 'If 2 geometric means are inserted between 3 and 192, what is the common ratio?',
        options: ['4', '3', '2', '8'],
        correctIndex: 0,
        explanation: 'r = (192 / 3)^(1 / (2 + 1)) = 64^(1/3) = 4.',
        stepByStep: ['192 / 3 = 64', 'k + 1 = 3', '64^(1/3) = 4']
      },
      {
        id: 'q_igm_2',
        question: 'What is the first of 2 geometric means inserted between 5 and 40?',
        options: ['10', '20', '15', '8'],
        correctIndex: 0,
        explanation: 'r = (40 / 5)^(1/3) = 8^(1/3) = 2. G₁ = 5 × 2 = 10.',
        stepByStep: ['40 / 5 = 8', 'Cube root of 8 is 2', 'G₁ = 5 × 2 = 10']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'insert_hm',
    number: 15,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Inserting Harmonic Means',
    shortDesc: 'Insert k harmonic terms by reciprocating to an AP and inverting',
    level: 'Intermediate',
    definition: 'Inserting k harmonic means between two numbers a and b means finding k values H₁, H₂, ..., H_k such that a, H₁, H₂, ..., H_k, b forms a Harmonic Progression. This is solved by taking reciprocals 1/a and 1/b, inserting k arithmetic means, and taking the reciprocals of the results.',
    formulas: [
      {
        name: 'Reciprocal AP Difference',
        formula: 'D = [(1/b) - (1/a)] / (k + 1)',
        description: 'Common difference of the reciprocal arithmetic progression.',
        symbols: [
          { symbol: 'D', meaning: 'Difference of reciprocal AP' },
          { symbol: '1/a, 1/b', meaning: 'Reciprocals of the endpoints' }
        ]
      },
      {
        name: 'ith Inserted Harmonic Mean',
        formula: 'H_i = 1 / [(1/a) + i · D]',
        description: 'Inverts the i-th term of the reciprocal arithmetic progression.',
        symbols: [
          { symbol: 'H_i', meaning: 'The i-th inserted harmonic mean' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Insert Harmonic Means between a and b:',
      actions: [
        { id: 'insert_hms', label: 'Insert k HMs & List' },
        { id: 'show_reciprocal_ap', label: 'Show Reciprocal AP Steps' }
      ],
      defaultAction: 'insert_hms',
      fields: [
        { id: 'start_a', label: 'First Number (a)', placeholder: 'e.g. 1/2 or 0.5', defaultValue: '0.5' },
        { id: 'end_b', label: 'Second Number (b)', placeholder: 'e.g. 1/14 or 0.0714', defaultValue: '0.0714' },
        { id: 'count_k', label: 'Number of Means (k)', placeholder: 'e.g. 3', defaultValue: '3' }
      ],
      examplePills: [
        { label: 'Insert 3 HMs between 1/2 and 1/14', values: { start_a: '0.5', end_b: '0.0714', count_k: '3' } },
        { label: 'Insert 2 HMs between 1/3 and 1/12', values: { start_a: '0.33333', end_b: '0.08333', count_k: '2' } },
        { label: 'Insert 3 HMs between 6 and 3', values: { start_a: '6', end_b: '3', count_k: '3' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Inserting 3 HMs between 1/2 and 1/14',
        difficulty: 'Basic',
        problem: 'Insert 3 harmonic means between 1/2 and 1/14.',
        step1Identify: 'Endpoints: a = 1/2, b = 1/14, count k = 3.',
        step2Method: 'Take reciprocals: 1/a = 2, 1/b = 14. We must insert 3 arithmetic means between 2 and 14.',
        step3Substitute: 'D = (14 - 2) / (3 + 1) = 12 / 4 = 3.',
        step4Simplify: 'The reciprocal AP terms are: 2, 5, 8, 11, 14. Invert to get the HMs: 1/5, 1/8, 1/11.',
        step5Answer: 'The 3 inserted harmonic means are 1/5, 1/8, and 1/11.'
      },
      {
        title: 'Moderately Challenging: Inserting HMs between Whole Numbers',
        difficulty: 'Moderately Challenging',
        problem: 'Insert 2 harmonic means between 3 and 6.',
        step1Identify: 'a = 3, b = 6, k = 2.',
        step2Method: 'Take reciprocals: 1/3 and 1/6. D = (1/6 - 1/3) / 3 = (-1/6) / 3 = -1/18.',
        step3Substitute: 'Reciprocal terms: 1/a + D = 6/18 - 1/18 = 5/18. Next: 5/18 - 1/18 = 4/18 = 2/9.',
        step4Simplify: 'Invert these values: H₁ = 18/5 = 3.6; H₂ = 9/2 = 4.5.',
        step5Answer: 'The 2 inserted harmonic means are 18/5 (3.6) and 9/2 (4.5).'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_ihm_1',
        question: 'What is the first step when inserting harmonic means between two numbers?',
        options: [
          'Take the reciprocals of both numbers to form an AP',
          'Multiply the two numbers together',
          'Take the square root of the two numbers',
          'Compute the natural logarithm of both values'
        ],
        correctIndex: 0,
        explanation: 'Because an HP is defined by the reciprocals forming an AP, you convert to reciprocals first.',
        stepByStep: ['Convert to reciprocals: 1/a and 1/b', 'Insert AMs', 'Invert back']
      },
      {
        id: 'q_ihm_2',
        question: 'If 1 harmonic mean is inserted between 4 and 12, what is it?',
        options: ['6', '8', '6.5', '7'],
        correctIndex: 0,
        explanation: 'A single HM between 4 and 12 is 2(4)(12)/(4 + 12) = 96 / 16 = 6.',
        stepByStep: ['HM = 2ab / (a + b)', '2 × 4 × 12 = 96', '96 / 16 = 6']
      }
    ],
    visualType: 'means_comparison'
  },
  {
    id: 'common_diff_ratio',
    number: 16,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Common Difference and Common Ratio',
    shortDesc: 'Analyze and extract the fundamental rate of change of progressions',
    level: 'Beginner',
    definition: 'The common difference d in an AP measures the additive rate of change between successive terms: d = a_{k+1} - a_k. The common ratio r in a GP measures the multiplicative scale factor: r = a_{k+1} / a_k. Both can be positive, negative, integer, or fractional.',
    formulas: [
      {
        name: 'Common Difference (Consecutive)',
        formula: 'd = a_{k+1} - a_k',
        description: 'Difference between any two adjacent terms in an arithmetic progression.',
        symbols: [
          { symbol: 'd', meaning: 'Common difference' }
        ]
      },
      {
        name: 'Common Ratio (Consecutive)',
        formula: 'r = a_{k+1} / a_k',
        description: 'Quotient of any two adjacent terms in a geometric progression.',
        symbols: [
          { symbol: 'r', meaning: 'Common ratio' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate common difference (d) or common ratio (r):',
      actions: [
        { id: 'detect_from_list', label: 'Detect from List of Terms' },
        { id: 'diff_from_two', label: 'AP Difference from Non-Adjacent' },
        { id: 'ratio_from_two', label: 'GP Ratio from Non-Adjacent' }
      ],
      defaultAction: 'detect_from_list',
      fields: [
        { id: 'terms_input', label: 'Sequence Terms', placeholder: 'e.g. 5, 11, 17, 23 or 3, 12, 48, 192', defaultValue: '5, 11, 17, 23' }
      ],
      examplePills: [
        { label: 'AP: 5, 11, 17, 23', values: { terms_input: '5, 11, 17, 23' } },
        { label: 'GP: 3, 12, 48, 192', values: { terms_input: '3, 12, 48, 192' } },
        { label: 'AP with negative d: 50, 43, 36, 29', values: { terms_input: '50, 43, 36, 29' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Identifying Common Difference',
        difficulty: 'Basic',
        problem: 'Determine whether the sequence 19, 13, 7, 1, -5 is an AP, and find its common difference d.',
        step1Identify: 'Check differences between consecutive terms.',
        step2Method: 'Compute d₁ = 13 - 19; d₂ = 7 - 13; d₃ = 1 - 7; d₄ = -5 - 1.',
        step3Substitute: 'd₁ = -6; d₂ = -6; d₃ = -6; d₄ = -6.',
        step4Simplify: 'All consecutive differences are identical (-6).',
        step5Answer: 'The sequence is an AP with common difference d = -6.'
      },
      {
        title: 'Moderately Challenging: Determining Common Ratio with Fractions',
        difficulty: 'Moderately Challenging',
        problem: 'In a sequence 16/9, -4/3, 1, -3/4, ..., show that it is a GP and find r.',
        step1Identify: 'Check ratios: r₁ = (-4/3) / (16/9); r₂ = 1 / (-4/3); r₃ = (-3/4) / 1.',
        step2Method: 'Evaluate each ratio to see if it is constant.',
        step3Substitute: 'r₁ = (-4/3) × (9/16) = -3/4. r₂ = -3/4. r₃ = -3/4.',
        step4Simplify: 'All ratios are constant and equal to -3/4.',
        step5Answer: 'The sequence is a GP with common ratio r = -3/4 (-0.75).'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_cdr_1',
        question: 'What is the common difference of the sequence 4.5, 7.2, 9.9, 12.6, ...?',
        options: ['2.7', '2.5', '3.1', '2.8'],
        correctIndex: 0,
        explanation: '7.2 - 4.5 = 2.7.',
        stepByStep: ['7.2 - 4.5 = 2.7', '9.9 - 7.2 = 2.7', 'd = 2.7']
      },
      {
        id: 'q_cdr_2',
        question: 'What is the common ratio of the sequence 81, -27, 9, -3, ...?',
        options: ['-1/3', '1/3', '-3', '3'],
        correctIndex: 0,
        explanation: 'r = -27 / 81 = -1/3.',
        stepByStep: ['-27 / 81 = -1/3', '9 / -27 = -1/3', 'r = -1/3']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'sum_arithmetic_series',
    number: 17,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Sum of Arithmetic Series',
    shortDesc: 'Evaluate arithmetic series using Gauss pairing and closed forms',
    level: 'Beginner',
    definition: 'The sum of an arithmetic series Sₙ = a₁ + a₂ + ... + aₙ represents the total accumulation of terms. As famously discovered by Carl Friedrich Gauss, writing the series forwards and backwards pairs each term into a constant sum of (first + last), giving Sₙ = (n/2)(a + l).',
    formulas: [
      {
        name: 'Gauss Sum Formula',
        formula: 'Sₙ = (n / 2) · (a + l)',
        description: 'Sum when first term a and last term l are known.',
        symbols: [
          { symbol: 'n / 2', meaning: 'Half the number of terms (number of pairs)' },
          { symbol: 'a + l', meaning: 'Sum of the first and last terms' }
        ]
      },
      {
        name: 'Difference Formula for Sum',
        formula: 'Sₙ = (n / 2) · [2a + (n - 1)d]',
        description: 'Sum when only first term a, common difference d, and term count n are known.',
        symbols: [
          { symbol: '2a', meaning: 'Twice the first term' },
          { symbol: '(n - 1)d', meaning: 'Total difference added across n terms' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate the sum of an Arithmetic Series:',
      actions: [
        { id: 'sum_a_d_n', label: 'Using a, d, and n' },
        { id: 'sum_a_l_n', label: 'Using a, l, and n' },
        { id: 'from_series_str', label: 'From Series Expression' }
      ],
      defaultAction: 'sum_a_d_n',
      fields: [
        { id: 'first_term', label: 'First Term (a)', placeholder: 'e.g. 1', defaultValue: '1' },
        { id: 'step_d', label: 'Common Difference (d)', placeholder: 'e.g. 1', defaultValue: '1' },
        { id: 'count_n', label: 'Number of Terms (n)', placeholder: 'e.g. 100', defaultValue: '100' }
      ],
      examplePills: [
        { label: 'Gauss: 1 to 100 (a=1, d=1, n=100)', values: { first_term: '1', step_d: '1', count_n: '100' } },
        { label: 'Odd numbers: a=1, d=2, n=50', values: { first_term: '1', step_d: '2', count_n: '50' } },
        { label: 'Multiples of 7: a=7, d=7, n=20', values: { first_term: '7', step_d: '7', count_n: '20' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Gauss Problem (Sum of 1 to 100)',
        difficulty: 'Basic',
        problem: 'Find the sum of the first 100 positive integers: 1 + 2 + 3 + ... + 100.',
        step1Identify: 'First term a = 1, last term l = 100, number of terms n = 100.',
        step2Method: 'Apply Gauss formula: Sₙ = (n / 2)(a + l).',
        step3Substitute: 'S₁₀₀ = (100 / 2)(1 + 100) = 50 × 101.',
        step4Simplify: '50 × 101 = 5,050.',
        step5Answer: 'The sum of the first 100 natural numbers is 5,050.'
      },
      {
        title: 'Moderately Challenging: Arithmetic Series with Negative Difference',
        difficulty: 'Moderately Challenging',
        problem: 'Evaluate the sum of the first 24 terms of the series: 35 + 31 + 27 + 23 + ...',
        step1Identify: 'a = 35, d = 31 - 35 = -4, n = 24.',
        step2Method: 'Use Sₙ = (n/2)[2a + (n - 1)d].',
        step3Substitute: 'S₂₄ = (24/2)[2(35) + (24 - 1)(-4)] = 12[70 + 23(-4)].',
        step4Simplify: '23 × (-4) = -92. Inside brackets: 70 - 92 = -22. Then 12 × (-22) = -264.',
        step5Answer: 'The sum of the first 24 terms is S₂₄ = -264.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_sar_1',
        question: 'What is the sum of the first 50 odd natural numbers (1 + 3 + 5 + ... + 99)?',
        options: ['2500', '2450', '2550', '5000'],
        correctIndex: 0,
        explanation: 'Sum of first n odd numbers is always n²: 50² = 2500.',
        stepByStep: ['Formula for sum of odd numbers: Sₙ = n²', 'S₅₀ = 50² = 2500']
      },
      {
        id: 'q_sar_2',
        question: 'What is the sum of the series 6 + 12 + 18 + ... + 120?',
        options: ['1260', '1200', '1320', '630'],
        correctIndex: 0,
        explanation: 'a = 6, l = 120, d = 6. n = 120/6 = 20. S = (20/2)(6 + 120) = 10(126) = 1260.',
        stepByStep: ['Number of terms: n = 20', 'S = 10 × (6 + 120) = 1260']
      }
    ],
    visualType: 'partial_sums'
  },
  {
    id: 'sum_geometric_series',
    number: 18,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Sum of Geometric Series',
    shortDesc: 'Calculate exponential summation and growth series',
    level: 'Beginner',
    definition: 'The sum of a finite geometric series Sₙ = a + ar + ar² + ... + arⁿ⁻¹ represents exponential accumulation. Multiplying the entire series by r and subtracting it from Sₙ cancels all intermediate terms, yielding the closed-form formula Sₙ = a(1 - rⁿ) / (1 - r).',
    formulas: [
      {
        name: 'Finite Geometric Series Sum (r < 1)',
        formula: 'Sₙ = a(1 - rⁿ) / (1 - r)',
        description: 'Standard formula preferred when r < 1 to keep numerator and denominator positive.',
        symbols: [
          { symbol: 'Sₙ', meaning: 'Sum of first n terms' },
          { symbol: 'rⁿ', meaning: 'Common ratio raised to power n' }
        ]
      },
      {
        name: 'Finite Geometric Series Sum (r > 1)',
        formula: 'Sₙ = a(rⁿ - 1) / (r - 1)',
        description: 'Equivalent algebraic form convenient when r > 1.',
        symbols: [
          { symbol: 'r - 1', meaning: 'Positive denominator when r > 1' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate the sum of a Geometric Series:',
      actions: [
        { id: 'sum_finite_gp', label: 'Sum of n Terms' },
        { id: 'show_derivation', label: 'Show Multiplier Cancellation' }
      ],
      defaultAction: 'sum_finite_gp',
      fields: [
        { id: 'first_term', label: 'First Term (a)', placeholder: 'e.g. 3', defaultValue: '3' },
        { id: 'ratio_r', label: 'Common Ratio (r)', placeholder: 'e.g. 2', defaultValue: '2' },
        { id: 'count_n', label: 'Number of Terms (n)', placeholder: 'e.g. 8', defaultValue: '8' }
      ],
      examplePills: [
        { label: 'Doubling: a=3, r=2, n=8', values: { first_term: '3', ratio_r: '2', count_n: '8' } },
        { label: 'Halving: a=64, r=0.5, n=6', values: { first_term: '64', ratio_r: '0.5', count_n: '6' } },
        { label: 'Alternating: a=5, r=-2, n=6', values: { first_term: '5', ratio_r: '-2', count_n: '6' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Doubling Series',
        difficulty: 'Basic',
        problem: 'Find the sum of the first 8 terms of the geometric series: 3 + 6 + 12 + 24 + ...',
        step1Identify: 'a = 3, r = 6 / 3 = 2, n = 8.',
        step2Method: 'Use the formula Sₙ = a(rⁿ - 1) / (r - 1).',
        step3Substitute: 'S₈ = 3(2⁸ - 1) / (2 - 1).',
        step4Simplify: '2⁸ = 256. 256 - 1 = 255. S₈ = 3 × 255 / 1 = 765.',
        step5Answer: 'The sum of the first 8 terms is S₈ = 765.'
      },
      {
        title: 'Moderately Challenging: Alternating Geometric Series Sum',
        difficulty: 'Moderately Challenging',
        problem: 'Evaluate the sum of the first 6 terms of the series: 4 - 8 + 16 - 32 + ...',
        step1Identify: 'a = 4, r = -8 / 4 = -2, n = 6.',
        step2Method: 'Use Sₙ = a(1 - rⁿ) / (1 - r).',
        step3Substitute: 'S₆ = 4[1 - (-2)⁶] / [1 - (-2)].',
        step4Simplify: '(-2)⁶ = 64. 1 - 64 = -63. Denominator 1 - (-2) = 3. S₆ = 4(-63) / 3 = 4(-21) = -84.',
        step5Answer: 'The sum of the first 6 terms is S₆ = -84.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_sgr_1',
        question: 'What is the sum of the first 5 terms of 2 + 6 + 18 + 54 + ...?',
        options: ['242', '240', '162', '486'],
        correctIndex: 0,
        explanation: 'a = 2, r = 3, n = 5. S₅ = 2(3⁵ - 1)/(3 - 1) = 2(243 - 1)/2 = 242.',
        stepByStep: ['3⁵ = 243', '243 - 1 = 242', '2 × 242 / 2 = 242']
      },
      {
        id: 'q_sgr_2',
        question: 'What is the sum of the first 4 terms of 100 + 50 + 25 + 12.5?',
        options: ['187.5', '175', '190', '180'],
        correctIndex: 0,
        explanation: '100 + 50 + 25 + 12.5 = 187.5.',
        stepByStep: ['100 + 50 = 150', '150 + 25 = 175', '175 + 12.5 = 187.5']
      }
    ],
    visualType: 'partial_sums'
  },
  {
    id: 'sum_to_infinity',
    number: 19,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Sum to Infinity',
    shortDesc: 'Infinite geometric sums, convergence limits, and repeating decimals',
    level: 'Intermediate',
    definition: 'An infinite geometric series converges to a finite sum if and only if the absolute value of the common ratio is strictly less than 1 (|r| < 1). As n → ∞, the term rⁿ approaches 0, reducing the sum formula to S_∞ = a / (1 - r). If |r| ≥ 1, the series diverges.',
    formulas: [
      {
        name: 'Sum to Infinity Formula',
        formula: 'S_∞ = a / (1 - r)',
        condition: 'Valid only when |r| < 1',
        description: 'Exact limit of infinite geometric accumulation.',
        symbols: [
          { symbol: 'S_∞', meaning: 'Sum to infinity' },
          { symbol: 'a', meaning: 'First term' },
          { symbol: 'r', meaning: 'Common ratio (-1 < r < 1)' }
        ]
      },
      {
        name: 'Repeating Decimal Conversion',
        formula: '0.\\bar{d} = d / 9  or  0.\\overline{dd} = dd / 99',
        description: 'Every repeating decimal is an infinite geometric series with r = 1/10^k.',
        symbols: [
          { symbol: 'd', meaning: 'Repeating block of digits' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate infinite sum or convert repeating decimal:',
      actions: [
        { id: 'infinite_sum', label: 'Sum to Infinity (a, r)' },
        { id: 'repeating_decimal', label: 'Convert Repeating Decimal' },
        { id: 'check_convergence', label: 'Check |r| < 1 Condition' }
      ],
      defaultAction: 'infinite_sum',
      fields: [
        { id: 'first_term', label: 'First Term (a)', placeholder: 'e.g. 16', defaultValue: '16' },
        { id: 'ratio_r', label: 'Common Ratio (r)', placeholder: 'e.g. 0.5 or 1/2', defaultValue: '0.5' }
      ],
      examplePills: [
        { label: 'a=16, r=0.5', values: { first_term: '16', ratio_r: '0.5' } },
        { label: 'a=9, r=1/3 (0.333)', values: { first_term: '9', ratio_r: '0.33333' } },
        { label: 'a=10, r=-0.5', values: { first_term: '10', ratio_r: '-0.5' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Infinite Series Evaluation',
        difficulty: 'Basic',
        problem: 'Find the sum to infinity of the series: 16 + 8 + 4 + 2 + 1 + ...',
        step1Identify: 'First term a = 16, ratio r = 8 / 16 = 0.5.',
        step2Method: 'Check |r| = |0.5| < 1. The series converges. Apply S_∞ = a / (1 - r).',
        step3Substitute: 'S_∞ = 16 / (1 - 0.5) = 16 / 0.5.',
        step4Simplify: '16 / 0.5 = 32.',
        step5Answer: 'The sum to infinity is S_∞ = 32.'
      },
      {
        title: 'Moderately Challenging: Converting 0.454545... to a Fraction',
        difficulty: 'Moderately Challenging',
        problem: 'Express the recurring decimal 0.454545... as a vulgar fraction using infinite geometric series.',
        step1Identify: 'Split into terms: 0.45 + 0.0045 + 0.000045 + ...',
        step2Method: 'First term a = 45/100, common ratio r = 1/100.',
        step3Substitute: 'S_∞ = (45/100) / (1 - 1/100) = (45/100) / (99/100).',
        step4Simplify: 'Multiply top and bottom by 100: 45 / 99 = 5 / 11.',
        step5Answer: 'The recurring decimal 0.4545... equals the fraction 5/11.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_inf_1',
        question: 'Under what condition does the infinite geometric series a + ar + ar² + ... have a finite sum?',
        options: ['|r| < 1', '|r| > 1', 'r = 1', 'a > 0'],
        correctIndex: 0,
        explanation: 'Only when |r| < 1 does rⁿ → 0, yielding a convergent sum.',
        stepByStep: ['Condition: -1 < r < 1', 'Equivalent to |r| < 1']
      },
      {
        id: 'q_inf_2',
        question: 'What is the sum to infinity of 27 - 9 + 3 - 1 + 1/3 - ...?',
        options: ['20.25 (81/4)', '18', '27/2', 'Diverges'],
        correctIndex: 0,
        explanation: 'a = 27, r = -1/3. S_∞ = 27 / (1 - (-1/3)) = 27 / (4/3) = 27 × (3/4) = 81/4 = 20.25.',
        stepByStep: ['a = 27, r = -1/3', '1 - (-1/3) = 4/3', '27 × 3/4 = 81/4 = 20.25']
      }
    ],
    visualType: 'partial_sums'
  },
  {
    id: 'sigma_notation_sum',
    number: 20,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Sigma Notation and Summation',
    shortDesc: 'Read, expand, and evaluate compact summation expressions',
    level: 'Intermediate',
    definition: 'Sigma notation (∑) is a compact mathematical shorthand for expressing sums. The Greek capital letter sigma indicates summation; the lower index specifies the starting integer k = m, and the upper index n specifies the terminating integer.',
    formulas: [
      {
        name: 'General Sigma Form',
        formula: '∑_{k=m}^n f(k) = f(m) + f(m+1) + ... + f(n)',
        description: 'Evaluates the expression f(k) for all integers k from m to n inclusive.',
        symbols: [
          { symbol: 'k', meaning: 'Index of summation (dummy variable)' },
          { symbol: 'm', meaning: 'Lower limit of summation' },
          { symbol: 'n', meaning: 'Upper limit of summation' },
          { symbol: 'n - m + 1', meaning: 'Total number of terms being summed' }
        ]
      },
      {
        name: 'Linearity Properties of Summation',
        formula: '∑ (c · a_k + b_k) = c · ∑ a_k + ∑ b_k',
        description: 'Constants can be factored out, and sums can be split across addition and subtraction.',
        symbols: [
          { symbol: 'c', meaning: 'Scalar constant' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Expand and evaluate Sigma Summation:',
      actions: [
        { id: 'evaluate_sigma', label: 'Evaluate Sum' },
        { id: 'expand_terms', label: 'Show Full Term Expansion' },
        { id: 'closed_form', label: 'Apply Linearity Rules' }
      ],
      defaultAction: 'evaluate_sigma',
      fields: [
        { id: 'expression', label: 'Expression f(k)', placeholder: 'e.g. 2*k + 1', defaultValue: '2*k + 1' },
        { id: 'lower_limit', label: 'Lower Limit (m)', placeholder: 'e.g. 1', defaultValue: '1' },
        { id: 'upper_limit', label: 'Upper Limit (n)', placeholder: 'e.g. 5', defaultValue: '5' }
      ],
      examplePills: [
        { label: '∑_{k=1}^5 (2k + 1)', values: { expression: '2*k + 1', lower_limit: '1', upper_limit: '5' } },
        { label: '∑_{k=1}^6 k²', values: { expression: 'k^2', lower_limit: '1', upper_limit: '6' } },
        { label: '∑_{k=0}^4 2^k', values: { expression: '2^k', lower_limit: '0', upper_limit: '4' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Expanding and Evaluating Sigma',
        difficulty: 'Basic',
        problem: 'Evaluate the sum: ∑_{k=1}^5 (3k - 2).',
        step1Identify: 'Expression is f(k) = 3k - 2. Range of k: 1, 2, 3, 4, 5 (5 terms).',
        step2Method: 'Evaluate f(k) for each k and add the results together.',
        step3Substitute: 'k=1: 3(1)-2 = 1; k=2: 3(2)-2 = 4; k=3: 3(3)-2 = 7; k=4: 3(4)-2 = 10; k=5: 3(5)-2 = 13.',
        step4Simplify: 'Sum = 1 + 4 + 7 + 10 + 13 = 35.',
        step5Answer: 'The value of the summation is 35.'
      },
      {
        title: 'Moderately Challenging: Using Linearity Properties',
        difficulty: 'Moderately Challenging',
        problem: 'Evaluate ∑_{k=1}^{10} (4k + 3) using standard summation formulas.',
        step1Identify: 'Split into two sums: 4 ∑_{k=1}^{10} k + ∑_{k=1}^{10} 3.',
        step2Method: 'Use ∑_{k=1}^n k = n(n+1)/2 and ∑_{k=1}^n c = n · c.',
        step3Substitute: '4 × [10(11)/2] + 10 × 3.',
        step4Simplify: '4 × 55 + 30 = 220 + 30 = 250.',
        step5Answer: 'The exact value is 250.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_sig_1',
        question: 'What is the value of ∑_{k=1}^4 k³?',
        options: ['100', '64', '36', '120'],
        correctIndex: 0,
        explanation: '1³ + 2³ + 3³ + 4³ = 1 + 8 + 27 + 64 = 100. (Also [4(5)/2]² = 10² = 100).',
        stepByStep: ['1 + 8 + 27 + 64 = 100', 'Formula: (n(n+1)/2)² = 10² = 100']
      },
      {
        id: 'q_sig_2',
        question: 'How many terms are in the sum ∑_{k=3}^8 f(k)?',
        options: ['6', '5', '8', '7'],
        correctIndex: 0,
        explanation: 'Number of terms = upper - lower + 1 = 8 - 3 + 1 = 6.',
        stepByStep: ['Indices: 3, 4, 5, 6, 7, 8', 'Total count = 6']
      }
    ],
    visualType: 'partial_sums'
  },
  {
    id: 'find_seq_patterns',
    number: 21,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Finding Sequence Patterns',
    shortDesc: 'Automated pattern detection: AP, GP, quadratic, or harmonic',
    level: 'Intermediate',
    definition: 'Pattern finding involves examining the differences or quotients between successive terms in an arbitrary number sequence. If first differences are constant, it is an AP; if quotients are constant, it is a GP; if second differences are constant, it is quadratic; if reciprocals have constant differences, it is an HP.',
    formulas: [
      {
        name: 'First Difference Test (AP)',
        formula: 'Δa_n = a_{n+1} - a_n = \\text{constant } d',
        description: 'Indicates a linear arithmetic progression.',
        symbols: [
          { symbol: 'Δ', meaning: 'Forward difference operator' }
        ]
      },
      {
        name: 'Second Difference Test (Quadratic)',
        formula: 'Δ²a_n = Δa_{n+1} - Δa_n = \\text{constant } 2a',
        description: 'Indicates a quadratic sequence a_n = an² + bn + c.',
        symbols: [
          { symbol: '2a', meaning: 'Value of constant second difference' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Detect pattern and find general formula:',
      actions: [
        { id: 'detect_pattern', label: 'Detect Pattern & Formula' },
        { id: 'next_terms', label: 'Predict Next 3 Terms' },
        { id: 'difference_table', label: 'Generate Difference Table' }
      ],
      defaultAction: 'detect_pattern',
      fields: [
        { id: 'numbers_list', label: 'Sequence Terms', placeholder: 'e.g. 2, 5, 10, 17, 26', defaultValue: '2, 5, 10, 17, 26' }
      ],
      examplePills: [
        { label: 'Quadratic: 2, 5, 10, 17, 26', values: { numbers_list: '2, 5, 10, 17, 26' } },
        { label: 'Geometric: 5, 15, 45, 135', values: { numbers_list: '5, 15, 45, 135' } },
        { label: 'Cubic: 1, 8, 27, 64, 125', values: { numbers_list: '1, 8, 27, 64, 125' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Identifying a Quadratic Sequence',
        difficulty: 'Basic',
        problem: 'Identify the pattern in 3, 8, 15, 24, 35 and find the formula for the nth term.',
        step1Identify: 'Terms: T₁=3, T₂=8, T₃=15, T₄=24, T₅=35.',
        step2Method: 'Compute 1st differences: 8-3=5, 15-8=7, 24-15=9, 35-24=11. Compute 2nd differences: 7-5=2, 9-7=2, 11-9=2.',
        step3Substitute: 'Constant 2nd difference = 2 ⇒ 2a = 2 ⇒ a = 1. The formula is aₙ = n² + bn + c.',
        step4Simplify: 'For n=1: 1 + b + c = 3 ⇒ b + c = 2. For n=2: 4 + 2b + c = 8 ⇒ 2b + c = 4. Subtracting: b = 2, so c = 0.',
        step5Answer: 'The sequence is quadratic with formula aₙ = n² + 2n = n(n + 2).'
      },
      {
        title: 'Moderately Challenging: Alternating Power Pattern',
        difficulty: 'Moderately Challenging',
        problem: 'Find the general rule for the pattern: 2, -4, 8, -16, 32, ...',
        step1Identify: 'Signs alternate positive/negative; magnitudes double each step: 2, 4, 8, 16, 32.',
        step2Method: 'This is a Geometric Progression with first term a = 2 and common ratio r = -4 / 2 = -2.',
        step3Substitute: 'Apply GP formula: aₙ = a · rⁿ⁻¹ = 2 · (-2)ⁿ⁻¹.',
        step4Simplify: 'Notice 2 · (-2)ⁿ⁻¹ = -(-2) · (-2)ⁿ⁻¹ = -(-2)ⁿ or (-1)ⁿ⁺¹ · 2ⁿ.',
        step5Answer: 'The rule is aₙ = (-1)ⁿ⁺¹ · 2ⁿ.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_pat_1',
        question: 'If the second difference of a sequence is constant and equal to 6, what is the coefficient of n²?',
        options: ['3', '6', '12', '1.5'],
        correctIndex: 0,
        explanation: 'The constant second difference is 2a. So 2a = 6 ⇒ a = 3.',
        stepByStep: ['2nd difference = 2a', '2a = 6', 'a = 3']
      },
      {
        id: 'q_pat_2',
        question: 'What are the next two terms of 1, 4, 9, 16, 25, ...?',
        options: ['36, 49', '30, 35', '32, 64', '35, 48'],
        correctIndex: 0,
        explanation: 'These are square numbers n²: 6² = 36, 7² = 49.',
        stepByStep: ['Pattern is n²', '6² = 36', '7² = 49']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'recursive_sequences',
    number: 22,
    group: 'B',
    groupTitle: 'Group B: Sequence Operations',
    title: 'Recursive Sequences',
    shortDesc: 'Sequences defined by recurrence relations and base conditions',
    level: 'Advanced',
    definition: 'A recursive sequence defines each term as a function of one or more preceding terms, anchored by one or more initial base cases. A first-order linear recurrence has the form a_n = c · a_{n-1} + d, while a second-order relation has the form a_n = c₁ a_{n-1} + c₂ a_{n-2}.',
    formulas: [
      {
        name: 'First-Order Linear Recurrence',
        formula: 'aₙ = c · a_{n-1} + d, \\quad a₁ = \\text{given}',
        description: 'Each term depends on the immediately preceding term.',
        symbols: [
          { symbol: 'a_{n-1}', meaning: 'Immediately preceding term' },
          { symbol: 'c, d', meaning: 'Constant coefficients' }
        ]
      },
      {
        name: 'Second-Order Characteristic Equation',
        formula: 'r² - c₁ r - c₂ = 0',
        description: 'Roots r₁ and r₂ provide the explicit closed-form solution aₙ = A · r₁ⁿ + B · r₂ⁿ.',
        symbols: [
          { symbol: 'r₁, r₂', meaning: 'Characteristic roots' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Generate terms from recurrence relation:',
      actions: [
        { id: 'generate_recurrence', label: 'Generate Terms' },
        { id: 'solve_explicit', label: 'Find Explicit Form' }
      ],
      defaultAction: 'generate_recurrence',
      fields: [
        { id: 'base_case', label: 'Base Term(s) (e.g. a₁=2 or a₁=1, a₂=1)', placeholder: 'e.g. 2', defaultValue: '2' },
        { id: 'relation', label: 'Relation (e.g. 2*a_{n-1} + 1)', placeholder: 'e.g. 2*a_{n-1} + 1', defaultValue: '2*a_{n-1} + 1' },
        { id: 'count_n', label: 'Number of Terms to Generate', placeholder: 'e.g. 7', defaultValue: '7' }
      ],
      examplePills: [
        { label: 'a₁=2, aₙ = 2a_{n-1} + 1', values: { base_case: '2', relation: '2*a_{n-1} + 1', count_n: '6' } },
        { label: 'Fibonacci: a₁=1, a₂=1', values: { base_case: '1, 1', relation: 'a_{n-1} + a_{n-2}', count_n: '8' } },
        { label: 'a₁=3, aₙ = 3a_{n-1} - 2', values: { base_case: '3', relation: '3*a_{n-1} - 2', count_n: '6' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: First-Order Recurrence Relation',
        difficulty: 'Basic',
        problem: 'Given the recursive definition a₁ = 3 and aₙ = 2a_{n-1} + 5 for n ≥ 2, find the first 5 terms.',
        step1Identify: 'Base case a₁ = 3. Recurrence rule: aₙ = 2a_{n-1} + 5.',
        step2Method: 'Successively substitute the previous term into the formula.',
        step3Substitute: 'a₂ = 2(3) + 5 = 11; a₃ = 2(11) + 5 = 27; a₄ = 2(27) + 5 = 59; a₅ = 2(59) + 5 = 123.',
        step4Simplify: 'Terms: 3, 11, 27, 59, 123.',
        step5Answer: 'The first 5 terms are 3, 11, 27, 59, and 123.'
      },
      {
        title: 'Moderately Challenging: Converting Recurrence to Explicit Formula',
        difficulty: 'Moderately Challenging',
        problem: 'Find the explicit formula for aₙ = 3a_{n-1} with initial condition a₁ = 4.',
        step1Identify: 'This is a pure geometric recurrence with multiplier c = 3.',
        step2Method: 'Notice a₂ = 4 · 3, a₃ = 4 · 3², and in general aₙ = a₁ · 3ⁿ⁻¹.',
        step3Substitute: 'aₙ = 4 · 3ⁿ⁻¹.',
        step4Simplify: 'Verification: a₁ = 4 · 3⁰ = 4. a₂ = 4 · 3¹ = 12 = 3(4). Consistent.',
        step5Answer: 'The explicit formula is aₙ = 4 · 3ⁿ⁻¹.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_rec_1',
        question: 'If a₁ = 1 and aₙ = 3a_{n-1} + 1, what is a₃?',
        options: ['13', '4', '12', '10'],
        correctIndex: 0,
        explanation: 'a₂ = 3(1) + 1 = 4. a₃ = 3(4) + 1 = 13.',
        stepByStep: ['a₁ = 1', 'a₂ = 3(1) + 1 = 4', 'a₃ = 3(4) + 1 = 13']
      },
      {
        id: 'q_rec_2',
        question: 'A recursive definition must always include which essential component to be well-defined?',
        options: ['A base case (initial condition)', 'A sigma symbol', 'An infinite limit', 'A negative difference'],
        correctIndex: 0,
        explanation: 'Without a base case, the recursion would continue indefinitely backwards and cannot produce specific values.',
        stepByStep: ['Base case defines where the sequence starts.']
      }
    ],
    visualType: 'sequence_plot'
  }
];
