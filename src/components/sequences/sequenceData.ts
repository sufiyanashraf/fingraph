import type { MajorTopic } from './types';

export const SEQUENCE_TOPICS: MajorTopic[] = [
  // ─────────────────────────────────────────────────────────────
  // 01. SEQUENCE & SERIES BASICS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'basics',
    number: '01',
    title: 'Sequence & Series Basics',
    shortTitle: 'Basics',
    level: 'Beginner',
    roadmapStage: 'Beginner',
    summary: 'The fundamental building blocks: sequences as ordered lists of numbers, series as their accumulation, and finding general terms.',
    subtopics: [
      {
        id: 'what_is_sequence',
        title: 'What is a Sequence?',
        shortDesc: 'An ordered progression of numbers governed by a specific mathematical rule or function.',
        level: 'Beginner',
        definition: 'A sequence is an ordered list of mathematical objects (usually real numbers) where order matters. Formally, a sequence is a function f: ℕ → ℝ whose domain is the set of positive integers {1, 2, 3, ...}.',
        classicNote: '"Order is the first law of heaven, and in mathematics, a sequence is order incarnate."',
        formulas: [
          {
            name: 'Sequence Notation',
            formula: '{aₙ} = a₁, a₂, a₃, ..., aₙ, ...',
            description: 'Individual elements are termed terms, indexed by natural numbers n ∈ {1, 2, 3, ...}.'
          },
          {
            name: 'Functional Definition',
            formula: 'aₙ = f(n) where n ∈ ℕ',
            description: 'The n-th term is evaluated by substituting the index n into the generating function.'
          }
        ],
        inputLabel: 'Enter Sequence or Terms',
        inputPlaceholder: 'e.g. 2, 4, 6, 8, ... or 2n + 1',
        defaultInput: '2, 4, 6, 8, 10',
        examplePills: ['2, 4, 6, 8', '1, 4, 9, 16', '3, 6, 12, 24', '1, 1/2, 1/3, 1/4'],
        actions: [
          { id: 'identify_pattern', label: 'Identify Pattern' },
          { id: 'find_next', label: 'Find Next Terms' },
          { id: 'find_nth', label: 'Find nth Term' },
          { id: 'analyze_seq', label: 'Analyze Sequence' }
        ],
        defaultAction: 'identify_pattern',
        workedExample: {
          problem: 'Given the sequence 2, 5, 8, 11, ..., determine the pattern, the next two terms, and the formula for the nth term aₙ.',
          step1Identify: 'List the consecutive terms: a₁ = 2, a₂ = 5, a₃ = 8, a₄ = 11. Calculate adjacent differences: 5 - 2 = 3, 8 - 5 = 3, 11 - 8 = 3.',
          step2Method: 'Because the consecutive difference is constant (d = 3), this is an Arithmetic Sequence with first term a = 2 and common difference d = 3.',
          step3Substitute: 'Use explicit linear formula: aₙ = a + (n - 1)d = 2 + (n - 1)·3.',
          step4Simplify: 'Expand: aₙ = 2 + 3n - 3 = 3n - 1. For n = 5: a₅ = 3(5) - 1 = 14. For n = 6: a₆ = 3(6) - 1 = 17.',
          step5Answer: 'General Term: aₙ = 3n - 1. Next two terms: 14, 17.'
        },
        commonMistakes: [
          {
            title: 'Confusing Index with Value',
            description: 'Mistaking the term position n with its numerical value aₙ. For example, in 3, 6, 9..., the 2nd term is 6, not 2.',
            correction: 'Always keep index n (1, 2, 3...) separate from the evaluated term value aₙ.'
          }
        ],
        practiceQuestions: [
          {
            id: 'b1',
            question: 'What is the 7th term of the sequence defined by aₙ = 4n - 3?',
            options: ['25', '28', '21', '29'],
            correctIndex: 0,
            explanation: 'Substitute n = 7: a₇ = 4(7) - 3 = 28 - 3 = 25.',
            stepByStep: ['Identify formula: aₙ = 4n - 3', 'Substitute n = 7', 'Compute 4 · 7 = 28', 'Subtract 3: 28 - 3 = 25']
          }
        ],
        visualType: 'pattern'
      },
      {
        id: 'what_is_series',
        title: 'What is a Series?',
        shortDesc: 'The indicated summation of the terms of a sequence.',
        level: 'Beginner',
        definition: 'A series is the mathematical operation of adding the terms of a sequence together. While a sequence is a collection of items separated by commas, a series connects them with addition signs (+).',
        classicNote: '"A sequence observes the steps; a series measures the total distance traveled."',
        formulas: [
          {
            name: 'Series Notation',
            formula: 'Sₙ = a₁ + a₂ + a₃ + ... + aₙ = ∑ₖ₌₁ⁿ aₖ',
            description: 'The sum of the first n terms forms the n-th partial sum of the series.'
          }
        ],
        inputLabel: 'Enter Sequence to Sum',
        inputPlaceholder: 'e.g. 1, 3, 5, 7 or 2k + 1',
        defaultInput: '1, 3, 5, 7, 9',
        examplePills: ['1, 3, 5, 7, 9', '2, 4, 8, 16', '1, 1/2, 1/4, 1/8'],
        actions: [
          { id: 'find_sum', label: 'Evaluate Series Sum' },
          { id: 'partial_sums', label: 'Find Partial Sums' },
          { id: 'write_sigma', label: 'Write in Sigma Form' }
        ],
        defaultAction: 'find_sum',
        workedExample: {
          problem: 'Find the sum of the finite series: 3 + 7 + 11 + 15 + 19.',
          step1Identify: 'Number of terms n = 5. First term a₁ = 3, last term a₅ = 19. Common difference d = 4.',
          step2Method: 'Since terms form an A.P., apply the summation theorem: Sₙ = (n/2)(a₁ + aₙ).',
          step3Substitute: 'S₅ = (5 / 2) · (3 + 19).',
          step4Simplify: 'S₅ = (5 / 2) · 22 = 5 · 11 = 55.',
          step5Answer: 'The sum of the series is S₅ = 55.'
        },
        commonMistakes: [
          {
            title: 'Equating Sequence with Series',
            description: 'Using the words sequence and series interchangeably. A sequence is a list; a series is a sum.',
            correction: '{2, 4, 6} is a sequence. (2 + 4 + 6 = 12) is a series.'
          }
        ],
        practiceQuestions: [
          {
            id: 'b2',
            question: 'What is the value of the series 2 + 5 + 8 + 11?',
            options: ['26', '24', '28', '30'],
            correctIndex: 0,
            explanation: '2 + 5 = 7; 7 + 8 = 15; 15 + 11 = 26.',
            stepByStep: ['Group pairs: (2 + 11) + (5 + 8)', '= 13 + 13 = 26']
          }
        ],
        visualType: 'partial_sums'
      },
      {
        id: 'terms_and_patterns',
        title: 'Terms of a Sequence & Ordered Patterns',
        shortDesc: 'Inspecting individual positions, index labels, and recognizing numerical symmetries.',
        level: 'Beginner',
        definition: 'Each number in a sequence is called a term. The notation aₙ or Tₙ denotes the term at position n. Sequences exhibit arithmetic, geometric, quadratic, or alternating signs depending on their difference structure.',
        formulas: [
          {
            name: 'Index Representation',
            formula: 'T₁ (First term), T₂ (Second term), ..., Tₙ (General term)',
            description: 'Subscripts denote exact 1-based order in standard classical analysis.'
          }
        ],
        inputLabel: 'Enter Sequence for Inspection',
        inputPlaceholder: 'e.g. 5, 10, 20, 40 or 1, 4, 9, 16',
        defaultInput: '1, 4, 9, 16, 25',
        examplePills: ['1, 4, 9, 16, 25', '2, 6, 12, 20, 30', '-1, 1, -1, 1'],
        actions: [
          { id: 'identify_pattern', label: 'Identify Pattern' },
          { id: 'find_next', label: 'Find Next 3 Terms' }
        ],
        defaultAction: 'identify_pattern',
        workedExample: {
          problem: 'Determine the underlying pattern of 1, 4, 9, 16, 25 and predict the 10th term.',
          step1Identify: 'First differences: 4 - 1 = 3, 9 - 4 = 5, 16 - 9 = 7, 25 - 16 = 9. Second differences: 5 - 3 = 2, 7 - 5 = 2, 9 - 7 = 2.',
          step2Method: 'Constant second difference of 2 confirms quadratic progression of the form aₙ = n².',
          step3Substitute: 'Substitute n = 10 into aₙ = n².',
          step4Simplify: '10² = 100.',
          step5Answer: 'Pattern: Perfect squares aₙ = n². The 10th term is 100.'
        },
        commonMistakes: [
          {
            title: 'Assuming All Patterns Are Linear',
            description: 'Checking only first differences and assuming every non-linear pattern is broken.',
            correction: 'Always check second differences (quadratics) and ratios (geometric).'
          }
        ],
        practiceQuestions: [
          {
            id: 'b3',
            question: 'What is the next term in the sequence 2, 6, 12, 20, 30, ...?',
            options: ['42', '40', '44', '38'],
            correctIndex: 0,
            explanation: 'The differences are +4, +6, +8, +10, so the next difference is +12. 30 + 12 = 42 (also n(n+1)).',
            stepByStep: ['Differences: 4, 6, 8, 10', 'Next difference is 12', '30 + 12 = 42']
          }
        ],
        visualType: 'pattern'
      },
      {
        id: 'recursive_vs_explicit',
        title: 'Recursive Definition vs Explicit Formula',
        shortDesc: 'Connecting terms via predecessor relations versus direct index computation.',
        level: 'Foundation',
        definition: 'An explicit formula expresses aₙ directly in terms of n (e.g. aₙ = 2n + 1). A recursive formula defines each term using one or more preceding terms along with a base initial condition (e.g. a₁ = 3, aₙ = aₙ₋₁ + 2).',
        formulas: [
          {
            name: 'Recursive Relation',
            formula: 'aₙ = f(aₙ₋₁), a₁ = c',
            description: 'Requires sequential evaluation of all intermediate terms.'
          },
          {
            name: 'Explicit Closed-Form',
            formula: 'aₙ = g(n)',
            description: 'Allows instantaneous computation of any distant term without knowing predecessors.'
          }
        ],
        inputLabel: 'Enter Recursive Rule or Explicit Formula',
        inputPlaceholder: 'e.g. a1 = 2, an = an-1 + 5 or an = 5n - 3',
        defaultInput: 'a1 = 3, an = 2*an-1 + 1',
        examplePills: ['a1 = 3, an = 2*an-1 + 1', 'a1 = 1, an = an-1 + 4', 'an = 3*n + 2'],
        actions: [
          { id: 'generate_terms', label: 'Generate Terms' },
          { id: 'find_explicit', label: 'Convert / Solve' }
        ],
        defaultAction: 'generate_terms',
        workedExample: {
          problem: 'Given the recursive sequence a₁ = 4 and aₙ = 3aₙ₋₁ - 2 for n ≥ 2, find the first four terms.',
          step1Identify: 'Initial condition: a₁ = 4. Recurrence: aₙ = 3aₙ₋₁ - 2.',
          step2Method: 'Iteratively evaluate step-by-step from n = 2 upwards.',
          step3Substitute: 'n = 2: a₂ = 3(4) - 2 = 12 - 2 = 10. n = 3: a₃ = 3(10) - 2 = 30 - 2 = 28. n = 4: a₄ = 3(28) - 2 = 84 - 2 = 82.',
          step4Simplify: 'The four terms in order are 4, 10, 28, 82.',
          step5Answer: 'Terms: a₁ = 4, a₂ = 10, a₃ = 28, a₄ = 82.'
        },
        commonMistakes: [
          {
            title: 'Forgetting the Base Case',
            description: 'A recurrence relation without an initial value a₁ has infinitely many possible solutions.',
            correction: 'Always verify that initial condition a₁ (or a₀) is explicitly provided.'
          }
        ],
        practiceQuestions: [
          {
            id: 'b4',
            question: 'If a₁ = 5 and aₙ = aₙ₋₁ + 7, what is the explicit formula for aₙ?',
            options: ['aₙ = 7n - 2', 'aₙ = 7n + 5', 'aₙ = 5n + 7', 'aₙ = 7n - 7'],
            correctIndex: 0,
            explanation: 'aₙ = a₁ + (n - 1)d = 5 + (n - 1)7 = 5 + 7n - 7 = 7n - 2.',
            stepByStep: ['Identify a = 5, d = 7', 'Substitute into a + (n-1)d', '5 + 7n - 7 = 7n - 2']
          }
        ],
        visualType: 'pattern'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 02. ARITHMETIC PROGRESSION (A.P.)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ap',
    number: '02',
    title: 'Arithmetic Progression (A.P.)',
    shortTitle: 'A.P.',
    level: 'Foundation',
    roadmapStage: 'Beginner',
    summary: 'Sequences governed by an invariant additive common difference. Covers nth term derivation, Gauss summation, and arithmetic means.',
    subtopics: [
      {
        id: 'what_is_ap',
        title: 'What is Arithmetic Progression?',
        shortDesc: 'A sequence where each term after the first is obtained by adding a fixed constant d.',
        level: 'Foundation',
        definition: 'An Arithmetic Progression (A.P.) is a sequence of the form a, a + d, a + 2d, a + 3d, ... where a is the first term and d is the common difference (d = aₖ - aₖ₋₁ for all k ≥ 2). If d > 0 the A.P. increases; if d < 0 it decreases; if d = 0 it is constant.',
        classicNote: '"The hallmark of arithmetic balance: equal intervals produce unwavering linear trajectories."',
        formulas: [
          {
            name: 'Common Difference',
            formula: 'd = aₙ - aₙ₋₁',
            description: 'Constant difference between any term and its immediate predecessor.'
          },
          {
            name: 'General Form',
            formula: 'a, a + d, a + 2d, ..., a + (n - 1)d',
            description: 'The standard expansion of an A.P.'
          }
        ],
        inputLabel: 'Enter A.P. Sequence or Parameters',
        inputPlaceholder: 'e.g. 3, 7, 11, 15 or a=3, d=4',
        defaultInput: '3, 7, 11, 15, 19',
        examplePills: ['3, 7, 11, 15', '100, 95, 90, 85', 'a=5, d=3, n=20', 'a=12, d=-4'],
        actions: [
          { id: 'find_common_diff', label: 'Find Common Difference' },
          { id: 'find_nth_term', label: 'Find nth Term' },
          { id: 'find_ap_sum', label: 'Find Sum (Sₙ)' },
          { id: 'verify_ap', label: 'Verify if A.P.' }
        ],
        defaultAction: 'find_common_diff',
        workedExample: {
          problem: 'For the sequence 7, 12, 17, 22, 27, ..., confirm whether it is an A.P., find d, and calculate the 25th term.',
          step1Identify: 'Terms: a₁ = 7, a₂ = 12, a₃ = 17, a₄ = 22. Target term index n = 25.',
          step2Method: 'Check differences: 12 - 7 = 5, 17 - 12 = 5, 22 - 17 = 5. Difference is invariant: d = 5. Formula: aₙ = a + (n - 1)d.',
          step3Substitute: 'a₂₅ = 7 + (25 - 1) · 5.',
          step4Simplify: 'a₂₅ = 7 + 24 · 5 = 7 + 120 = 127.',
          step5Answer: 'Common difference d = 5. The 25th term is a₂₅ = 127.'
        },
        commonMistakes: [
          {
            title: 'Sign of Common Difference',
            description: 'Subtracting in reverse order (e.g. a₁ - a₂ instead of a₂ - a₁).',
            correction: 'Always compute d = aₙ - aₙ₋₁ (later term minus earlier term).'
          }
        ],
        practiceQuestions: [
          {
            id: 'ap1',
            question: 'What is the common difference of the sequence 21, 16, 11, 6, ...?',
            options: ['-5', '5', '4', '-4'],
            correctIndex: 0,
            explanation: 'd = 16 - 21 = -5.',
            stepByStep: ['d = a₂ - a₁', 'd = 16 - 21', 'd = -5']
          }
        ],
        visualType: 'pattern'
      },
      {
        id: 'nth_term_ap',
        title: 'nth Term of an A.P.',
        shortDesc: 'Deriving and evaluating the general formula aₙ = a + (n - 1)d.',
        level: 'Foundation',
        definition: 'Starting at a, each step adds d. Reaching the n-th position requires exactly n - 1 steps. Hence, aₙ = a + (n - 1)d. If the last term l is known, l = a + (n - 1)d allows solving for total number of terms n.',
        formulas: [
          {
            name: 'nth Term Formula',
            formula: 'aₙ = a + (n - 1)d',
            description: 'Primary equation connecting first term a, difference d, index n, and value aₙ.'
          },
          {
            name: 'Last Term Formula',
            formula: 'l = a + (n - 1)d',
            description: 'Used to determine count of terms n in a bounded progression.'
          }
        ],
        inputLabel: 'Enter Known Parameters (a, d, n or sequence)',
        inputPlaceholder: 'e.g. a = 4, d = 3, n = 15 or 4, 7, 10, ...',
        defaultInput: 'a = 5, d = 7, n = 20',
        examplePills: ['a=5, d=7, n=20', 'a=100, d=-6, n=12', '2, 9, 16, ... find 50th'],
        actions: [
          { id: 'find_nth_term', label: 'Find nth Term' },
          { id: 'find_num_terms', label: 'Find Count of Terms (n)' }
        ],
        defaultAction: 'find_nth_term',
        workedExample: {
          problem: 'An A.P. begins at 14 and has common difference d = -3. Which term of this progression equals -46?',
          step1Identify: 'Given: First term a = 14, common difference d = -3, target value aₙ = -46. Unknown: n.',
          step2Method: 'Equate to general formula: aₙ = a + (n - 1)d.',
          step3Substitute: '-46 = 14 + (n - 1)(-3).',
          step4Simplify: '-46 - 14 = -3(n - 1) ⇒ -60 = -3(n - 1) ⇒ n - 1 = 20 ⇒ n = 21.',
          step5Answer: 'The 21st term of the A.P. equals -46.'
        },
        commonMistakes: [
          {
            title: 'Using n instead of (n - 1)',
            description: 'Writing aₙ = a + nd instead of a + (n - 1)d, which erroneously adds an extra difference step.',
            correction: 'Remember the first term has zero differences added: a₁ = a + 0d.'
          }
        ],
        practiceQuestions: [
          {
            id: 'ap2',
            question: 'If the 3rd term of an A.P. is 8 and the 7th term is 20, what is the first term a?',
            options: ['2', '3', '4', '1'],
            correctIndex: 0,
            explanation: 'a₃ = a + 2d = 8, a₇ = a + 6d = 20. Subtracting gives 4d = 12 ⇒ d = 3. Then a + 2(3) = 8 ⇒ a = 2.',
            stepByStep: ['a + 2d = 8', 'a + 6d = 20', '4d = 12 ⇒ d = 3', 'a = 8 - 6 = 2']
          }
        ],
        visualType: 'pattern'
      },
      {
        id: 'sum_n_terms_ap',
        title: 'Sum of n Terms of an A.P.',
        shortDesc: 'The Gauss summation formula Sₙ = (n/2)[2a + (n - 1)d] and Sₙ = (n/2)(a + l).',
        level: 'Foundation',
        definition: 'Carl Friedrich Gauss famously paired terms from both ends of an A.P.: (a₁) + (aₙ) = (a₂) + (aₙ₋₁) = ... = a + l. Adding the series forward and backward gives 2Sₙ = n(a + l), leading to Sₙ = (n/2)(a + l).',
        classicNote: '"The young Gauss observed in 1786 that sums collapse when folded upon their center."',
        formulas: [
          {
            name: 'Standard Sum Formula',
            formula: 'Sₙ = (n / 2) · [2a + (n - 1)d]',
            description: 'When first term a, difference d, and number of terms n are known.'
          },
          {
            name: 'First and Last Term Formula',
            formula: 'Sₙ = (n / 2) · (a + l)',
            description: 'When first term a and terminal term l are directly available.'
          }
        ],
        inputLabel: 'Enter A.P. Parameters or Sum Range',
        inputPlaceholder: 'e.g. a=2, d=3, n=30 or 2 + 5 + 8 + ... to 20 terms',
        defaultInput: 'a = 2, d = 3, n = 30',
        examplePills: ['a=2, d=3, n=30', 'a=1, d=1, n=100', 'a=50, d=-2, n=25', '5 + 10 + ... + 100'],
        actions: [
          { id: 'find_ap_sum', label: 'Find Sum (Sₙ)' },
          { id: 'find_num_terms', label: 'Solve for n' }
        ],
        defaultAction: 'find_ap_sum',
        workedExample: {
          problem: 'Find the sum of the first 40 terms of the arithmetic series: 5 + 9 + 13 + 17 + ...',
          step1Identify: 'First term a = 5, common difference d = 9 - 5 = 4, number of terms n = 40.',
          step2Method: 'Apply Sₙ = (n/2)[2a + (n - 1)d].',
          step3Substitute: 'S₄₀ = (40 / 2) · [2(5) + (40 - 1) · 4].',
          step4Simplify: 'S₄₀ = 20 · [10 + 39 · 4] = 20 · [10 + 156] = 20 · 166 = 3320.',
          step5Answer: 'The sum of the first 40 terms is S₄₀ = 3,320.'
        },
        commonMistakes: [
          {
            title: 'Multiplying by n instead of n/2',
            description: 'Forgetting the division by 2 in the Gauss formula.',
            correction: 'Always divide n by 2 (or pair terms).'
          }
        ],
        practiceQuestions: [
          {
            id: 'ap3',
            question: 'What is the sum of the first 100 positive integers (1 + 2 + ... + 100)?',
            options: ['5050', '5000', '5100', '4950'],
            correctIndex: 0,
            explanation: 'S₁₀₀ = (100 / 2)(1 + 100) = 50 · 101 = 5050.',
            stepByStep: ['Formula: n(n + 1) / 2', '100 · 101 / 2', '50 · 101 = 5050']
          }
        ],
        visualType: 'partial_sums'
      },
      {
        id: 'arithmetic_means',
        title: 'Arithmetic Mean & Inserting Means',
        shortDesc: 'The single midpoint A = (a + b)/2 and inserting m arithmetic means between two numbers.',
        level: 'Intermediate',
        definition: 'For any two numbers a and b, their Arithmetic Mean is A = (a + b)/2. When m numbers A₁, A₂, ..., Aₘ are inserted between a and b such that the resulting sequence a, A₁, A₂, ..., Aₘ, b forms an A.P., the new common difference is d = (b - a)/(m + 1).',
        formulas: [
          {
            name: 'Single Arithmetic Mean',
            formula: 'A = (a + b) / 2',
            description: 'The equidistant midpoint balancing two quantities.'
          },
          {
            name: 'Common Difference for m Means',
            formula: 'd = (b - a) / (m + 1)',
            description: 'Creates m evenly spaced intermediate steps between a and b.'
          },
          {
            name: 'k-th Inserted Mean',
            formula: 'Aₖ = a + k · d = a + k · [(b - a) / (m + 1)]',
            description: 'Direct evaluation of the k-th inserted mean.'
          }
        ],
        inputLabel: 'Enter a, b and Number of Means m',
        inputPlaceholder: 'e.g. a = 3, b = 27, m = 3',
        defaultInput: 'a = 3, b = 27, m = 3',
        examplePills: ['a=3, b=27, m=3', 'a=5, b=65, m=5', 'a=-10, b=30, m=4'],
        actions: [
          { id: 'insert_means', label: 'Insert Arithmetic Means' },
          { id: 'find_single_am', label: 'Find Single AM' }
        ],
        defaultAction: 'insert_means',
        workedExample: {
          problem: 'Insert 3 arithmetic means between 4 and 20.',
          step1Identify: 'First boundary a = 4, terminal boundary b = 20, count of means m = 3. Total terms N = m + 2 = 5.',
          step2Method: 'Compute step size: d = (b - a) / (m + 1) = (20 - 4) / (3 + 1).',
          step3Substitute: 'd = 16 / 4 = 4.',
          step4Simplify: 'A₁ = a + d = 4 + 4 = 8. A₂ = a + 2d = 4 + 8 = 12. A₃ = a + 3d = 4 + 12 = 16.',
          step5Answer: 'The 3 inserted arithmetic means are 8, 12, 16. (Sequence: 4, 8, 12, 16, 20).'
        },
        commonMistakes: [
          {
            title: 'Dividing by m instead of (m + 1)',
            description: 'Inserting m points creates m + 1 intervals, not m intervals.',
            correction: 'Always divide the gap (b - a) by (m + 1).'
          }
        ],
        practiceQuestions: [
          {
            id: 'ap4',
            question: 'If you insert 4 arithmetic means between 2 and 17, what is the common difference d?',
            options: ['3', '4', '2.5', '5'],
            correctIndex: 0,
            explanation: 'd = (17 - 2) / (4 + 1) = 15 / 5 = 3.',
            stepByStep: ['Gap: 17 - 2 = 15', 'Intervals: m + 1 = 4 + 1 = 5', 'd = 15 / 5 = 3']
          }
        ],
        visualType: 'pattern'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 03. GEOMETRIC PROGRESSION (G.P.)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'gp',
    number: '03',
    title: 'Geometric Progression (G.P.)',
    shortTitle: 'G.P.',
    level: 'Foundation',
    roadmapStage: 'Beginner',
    summary: 'Sequences governed by an invariant multiplicative common ratio. Explores finite summation, geometric means, and infinite series convergence under |r| < 1.',
    subtopics: [
      {
        id: 'what_is_gp',
        title: 'What is Geometric Progression?',
        shortDesc: 'A sequence where each term after the first is produced by multiplying by a constant common ratio r.',
        level: 'Foundation',
        definition: 'A Geometric Progression (G.P.) is a sequence of the form a, ar, ar², ar³, ... where a is the non-zero first term and r is the common ratio (r = aₖ / aₖ₋₁ for all k ≥ 2). If |r| > 1 terms grow exponentially; if |r| < 1 terms decay toward zero.',
        classicNote: '"Multiplication scales dimensions: each step is a reflection of the whole scaled by r."',
        formulas: [
          {
            name: 'Common Ratio',
            formula: 'r = aₙ / aₙ₋₁',
            description: 'Constant quotient of any term divided by its immediate predecessor.'
          },
          {
            name: 'nth Term Formula',
            formula: 'aₙ = a · rⁿ⁻¹',
            description: 'The power of r corresponds to n - 1 multiplication steps.'
          }
        ],
        inputLabel: 'Enter G.P. Sequence or Parameters',
        inputPlaceholder: 'e.g. 2, 6, 18, 54 or a=2, r=3',
        defaultInput: '2, 6, 18, 54, 162',
        examplePills: ['2, 6, 18, 54', '100, 50, 25, 12.5', 'a=3, r=2, n=10', 'a=81, r=1/3'],
        actions: [
          { id: 'find_ratio', label: 'Find Common Ratio (r)' },
          { id: 'find_gp_nth', label: 'Find nth Term' },
          { id: 'find_gp_sum', label: 'Find Finite Sum (Sₙ)' },
          { id: 'find_infinite_sum', label: 'Check Sum to Infinity (S∞)' }
        ],
        defaultAction: 'find_ratio',
        workedExample: {
          problem: 'Given the geometric sequence 3, 12, 48, 192, ..., determine the common ratio and calculate the 7th term.',
          step1Identify: 'Terms: a₁ = 3, a₂ = 12, a₃ = 48. Target index n = 7.',
          step2Method: 'Ratio r = a₂ / a₁ = 12 / 3 = 4. Check a₃ / a₂ = 48 / 12 = 4. Apply aₙ = a · rⁿ⁻¹.',
          step3Substitute: 'a₇ = 3 · 4⁷⁻¹ = 3 · 4⁶.',
          step4Simplify: '4⁶ = 4096. a₇ = 3 · 4096 = 12,288.',
          step5Answer: 'Common ratio r = 4. The 7th term is a₇ = 12,288.'
        },
        commonMistakes: [
          {
            title: 'Off-by-One Exponent',
            description: 'Using aₙ = a · rⁿ instead of a · rⁿ⁻¹. The first term has r⁰ = 1.',
            correction: 'Always raise the common ratio to (n - 1).'
          }
        ],
        practiceQuestions: [
          {
            id: 'gp1',
            question: 'What is the 5th term of the G.P. with a = 5 and r = 2?',
            options: ['80', '160', '40', '64'],
            correctIndex: 0,
            explanation: 'a₅ = 5 · 2⁵⁻¹ = 5 · 2⁴ = 5 · 16 = 80.',
            stepByStep: ['a₅ = a · r⁴', 'a₅ = 5 · 16', 'a₅ = 80']
          }
        ],
        visualType: 'pattern'
      },
      {
        id: 'sum_n_terms_gp',
        title: 'Sum of n Terms of a Finite G.P.',
        shortDesc: 'Summing finite geometric series via Sₙ = a(1 - rⁿ)/(1 - r) or Sₙ = a(rⁿ - 1)/(r - 1).',
        level: 'Foundation',
        definition: 'Multiplying Sₙ = a + ar + ... + arⁿ⁻¹ by r yields rSₙ = ar + ar² + ... + arⁿ. Subtracting these expressions cancels all intermediate terms, leaving Sₙ(1 - r) = a(1 - rⁿ), establishing the finite geometric sum identity for any r ≠ 1.',
        formulas: [
          {
            name: 'Finite Sum (|r| < 1 form)',
            formula: 'Sₙ = a(1 - rⁿ) / (1 - r),  r ≠ 1',
            description: 'Preferred format when r is a fraction less than 1 to avoid negative numbers.'
          },
          {
            name: 'Finite Sum (|r| > 1 form)',
            formula: 'Sₙ = a(rⁿ - 1) / (r - 1),  r ≠ 1',
            description: 'Equivalent algebraic standard form when r > 1.'
          },
          {
            name: 'Special Case r = 1',
            formula: 'Sₙ = n · a',
            description: 'When ratio is 1, each term is identical.'
          }
        ],
        inputLabel: 'Enter a, r, and n',
        inputPlaceholder: 'e.g. a = 2, r = 3, n = 6',
        defaultInput: 'a = 2, r = 3, n = 6',
        examplePills: ['a=2, r=3, n=6', 'a=64, r=1/2, n=7', 'a=5, r=2, n=8'],
        actions: [
          { id: 'find_gp_sum', label: 'Find Sum (Sₙ)' }
        ],
        defaultAction: 'find_gp_sum',
        workedExample: {
          problem: 'Find the sum of the first 6 terms of the series 2 + 6 + 18 + 54 + ...',
          step1Identify: 'First term a = 2, common ratio r = 6 / 2 = 3, count n = 6.',
          step2Method: 'Because r = 3 > 1, use Sₙ = a(rⁿ - 1) / (r - 1).',
          step3Substitute: 'S₆ = 2 · (3⁶ - 1) / (3 - 1).',
          step4Simplify: '3⁶ = 729. S₆ = 2 · (729 - 1) / 2 = 728.',
          step5Answer: 'The sum of the first 6 terms is S₆ = 728.'
        },
        commonMistakes: [
          {
            title: 'Division by Zero when r = 1',
            description: 'Attempting to use the fraction formula when r = 1.',
            correction: 'When r = 1, the series is a + a + ... + a = n · a.'
          }
        ],
        practiceQuestions: [
          {
            id: 'gp2',
            question: 'What is the sum of the first 4 terms of 1 + 1/2 + 1/4 + 1/8?',
            options: ['15/8', '7/4', '31/16', '2'],
            correctIndex: 0,
            explanation: '1 + 1/2 + 1/4 + 1/8 = (8 + 4 + 2 + 1)/8 = 15/8.',
            stepByStep: ['a = 1, r = 1/2, n = 4', 'S₄ = 1 · (1 - (1/2)⁴) / (1 - 1/2)', '(1 - 1/16) / (1/2) = (15/16) · 2 = 15/8']
          }
        ],
        visualType: 'partial_sums'
      },
      {
        id: 'infinite_gp_series',
        title: 'Infinite Geometric Series & Sum to Infinity',
        shortDesc: 'Convergence theorem: S∞ = a / (1 - r) valid STRICTLY if and only if |r| < 1.',
        level: 'Intermediate',
        definition: 'In Sₙ = a(1 - rⁿ)/(1 - r), as n → ∞, the quantity rⁿ converges to 0 IF AND ONLY IF |r| < 1. In this case, the series converges to the finite sum S∞ = a / (1 - r). If |r| ≥ 1, rⁿ does not vanish, and the series diverges.',
        classicNote: '"An infinite cascade of fractions settles upon a finite shore only when each step shrinks (|r| < 1)."',
        formulas: [
          {
            name: 'Sum to Infinity Formula',
            formula: 'S∞ = a / (1 - r)',
            condition: 'STRICTLY REQUIRES |r| < 1',
            description: 'Evaluates the limiting infinite sum. Diverges if |r| ≥ 1.'
          }
        ],
        inputLabel: 'Enter a and r (or infinite terms)',
        inputPlaceholder: 'e.g. a = 8, r = 0.5 or 8 + 4 + 2 + 1 + ...',
        defaultInput: 'a = 8, r = 0.5',
        examplePills: ['a=8, r=0.5', 'a=1, r=1/3', 'a=12, r=-0.5', 'a=4, r=2 (Divergent)'],
        actions: [
          { id: 'find_infinite_sum', label: 'Evaluate Sum to Infinity' },
          { id: 'check_convergence_gp', label: 'Verify |r| < 1' }
        ],
        defaultAction: 'find_infinite_sum',
        workedExample: {
          problem: 'Determine whether the infinite geometric series 12 + 6 + 3 + 1.5 + ... converges, and if so, evaluate S∞.',
          step1Identify: 'First term a = 12. Common ratio r = 6 / 12 = 0.5 = 1/2.',
          step2Method: 'Check convergence criterion: |r| = |1/2| = 0.5 < 1. The series converges. Apply S∞ = a / (1 - r).',
          step3Substitute: 'S∞ = 12 / (1 - 1/2).',
          step4Simplify: 'S∞ = 12 / (1/2) = 12 · 2 = 24.',
          step5Answer: 'The series converges. The sum to infinity is S∞ = 24.'
        },
        commonMistakes: [
          {
            title: 'Applying Formula When |r| ≥ 1',
            description: 'Blindly calculating 1 / (1 - 2) = -1 for 1 + 2 + 4 + 8 + ... which is violently divergent.',
            correction: 'Always test |r| < 1 before writing down any infinite geometric sum.'
          }
        ],
        practiceQuestions: [
          {
            id: 'gp3',
            question: 'What is the sum to infinity of 9 + 3 + 1 + 1/3 + ...?',
            options: ['13.5 (27/2)', '12', '14', 'Diverges'],
            correctIndex: 0,
            explanation: 'a = 9, r = 1/3. |1/3| < 1. S∞ = 9 / (1 - 1/3) = 9 / (2/3) = 27/2 = 13.5.',
            stepByStep: ['Check |r|: |1/3| < 1 (converges)', 'S∞ = a / (1 - r)', '9 / (2/3) = 27 / 2 = 13.5']
          }
        ],
        visualType: 'partial_sums'
      },
      {
        id: 'geometric_mean',
        title: 'Geometric Mean & Inserting Means',
        shortDesc: 'The single mean G = √(ab) and inserting m geometric means between two positive numbers.',
        level: 'Intermediate',
        definition: 'For two positive numbers a and b, their Geometric Mean is G = √(ab). If m numbers G₁, G₂, ..., Gₘ are inserted between a and b such that the entire sequence forms a G.P., the common ratio is r = (b / a)^(1 / (m + 1)).',
        formulas: [
          {
            name: 'Single Geometric Mean',
            formula: 'G = √(ab),  for a, b > 0',
            description: 'The multiplicative balance point between two positive values.'
          },
          {
            name: 'Common Ratio for m Geometric Means',
            formula: 'r = (b / a)^(1 / (m + 1))',
            description: 'Calculates the scaling factor for m intermediate geometric steps.'
          }
        ],
        inputLabel: 'Enter a, b and Number of Means m',
        inputPlaceholder: 'e.g. a = 2, b = 32, m = 3',
        defaultInput: 'a = 2, b = 32, m = 3',
        examplePills: ['a=2, b=32, m=3', 'a=3, b=243, m=3', 'a=1, b=64, m=5'],
        actions: [
          { id: 'insert_gm', label: 'Insert Geometric Means' },
          { id: 'find_single_gm', label: 'Find Single GM' }
        ],
        defaultAction: 'insert_gm',
        workedExample: {
          problem: 'Insert 3 geometric means between 2 and 32.',
          step1Identify: 'Start boundary a = 2, end boundary b = 32, count m = 3. Total terms N = 5.',
          step2Method: 'Calculate ratio: r = (b / a)^(1 / (m + 1)) = (32 / 2)^(1 / 4) = 16^(1/4).',
          step3Substitute: 'r = 2.',
          step4Simplify: 'G₁ = 2 · 2 = 4. G₂ = 4 · 2 = 8. G₃ = 8 · 2 = 16.',
          step5Answer: 'The 3 inserted geometric means are 4, 8, 16. (Sequence: 2, 4, 8, 16, 32).'
        },
        commonMistakes: [
          {
            title: 'Applying GM to Negative Numbers',
            description: 'Geometric mean in standard real analysis is defined strictly for positive quantities to preserve real-valued continuity.',
            correction: 'Ensure both terms a and b are positive.'
          }
        ],
        practiceQuestions: [
          {
            id: 'gp4',
            question: 'What is the geometric mean of 4 and 36?',
            options: ['12', '20', '16', '18'],
            correctIndex: 0,
            explanation: 'G = √(4 · 36) = √144 = 12.',
            stepByStep: ['G = √(a · b)', '√(4 · 36)', '√144 = 12']
          }
        ],
        visualType: 'pattern'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 04. HARMONIC PROGRESSION (H.P.)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'hp',
    number: '04',
    title: 'Harmonic Progression (H.P.)',
    shortTitle: 'H.P.',
    level: 'Foundation',
    roadmapStage: 'Beginner',
    summary: 'Sequences whose term reciprocals form an Arithmetic Progression. Vital in acoustics, rate balancing, and harmonic means.',
    subtopics: [
      {
        id: 'what_is_hp',
        title: 'What is Harmonic Progression?',
        shortDesc: 'A sequence a₁, a₂, a₃, ... where the reciprocal sequence 1/a₁, 1/a₂, 1/a₃, ... forms an A.P.',
        level: 'Foundation',
        definition: 'A sequence of non-zero numbers is in Harmonic Progression (H.P.) if their reciprocals form an Arithmetic Progression. That is, if 1/aₙ = 1/a₁ + (n - 1)d. Thus, the general term is Hₙ = 1 / (A + (n - 1)D). There is no standard closed-form algebraic formula for the sum of an H.P.',
        classicNote: '"Named by Pythagoras: vibrating strings with lengths in H.P. produce pleasing musical intervals."',
        formulas: [
          {
            name: 'Harmonic Progression Definition',
            formula: '{hₙ} is H.P. ⟺ {1 / hₙ} is A.P.',
            description: 'All analysis of H.P. proceeds by inverting terms into their associated A.P.'
          },
          {
            name: 'nth Term of an H.P.',
            formula: 'Hₙ = 1 / [a + (n - 1)d]',
            description: 'Where a = 1/H₁ and d = 1/H₂ - 1/H₁.'
          }
        ],
        inputLabel: 'Enter H.P. Sequence or Known Terms',
        inputPlaceholder: 'e.g. 1/2, 1/4, 1/6, 1/8 or 12, 6, 4',
        defaultInput: '1/2, 1/4, 1/6, 1/8',
        examplePills: ['1/2, 1/4, 1/6, 1/8', '12, 6, 4, 3', '1/3, 1/7, 1/11, 1/15'],
        actions: [
          { id: 'check_if_hp', label: 'Check if H.P.' },
          { id: 'find_hp_term', label: 'Find nth Term' },
          { id: 'convert_reciprocals', label: 'Convert to Reciprocal A.P.' },
          { id: 'find_hm', label: 'Find Harmonic Mean' }
        ],
        defaultAction: 'check_if_hp',
        workedExample: {
          problem: 'Determine if the sequence 1/3, 1/7, 1/11, 1/15, ... is an H.P., and find its 10th term.',
          step1Identify: 'Given terms: H₁ = 1/3, H₂ = 1/7, H₃ = 1/11, H₄ = 1/15.',
          step2Method: 'Take reciprocals: 3, 7, 11, 15. Check differences: 7 - 3 = 4, 11 - 7 = 4, 15 - 11 = 4. Constant difference d = 4 proves the reciprocals form an A.P., so the original sequence is in H.P.',
          step3Substitute: 'For the reciprocal A.P., a₁₀ = a + (10 - 1)d = 3 + 9 · 4.',
          step4Simplify: 'a₁₀ = 3 + 36 = 39. Invert to return to H.P.: H₁₀ = 1 / 39.',
          step5Answer: 'The sequence is in H.P. with reciprocal d = 4. The 10th term is H₁₀ = 1/39.'
        },
        commonMistakes: [
          {
            title: 'Trying to Sum H.P. with A.P. Formula',
            description: 'Assuming the sum of an H.P. is the reciprocal of the sum of the A.P. This is mathematically false: ∑(1/x) ≠ 1 / (∑x).',
            correction: 'Harmonic series do not have a closed-form algebraic polynomial sum.'
          }
        ],
        practiceQuestions: [
          {
            id: 'hp1',
            question: 'What is the 5th term of the H.P. 1/5, 1/8, 1/11, 1/14, ...?',
            options: ['1/17', '1/20', '1/16', '1/18'],
            correctIndex: 0,
            explanation: 'Reciprocals are 5, 8, 11, 14 (A.P. with a = 5, d = 3). The 5th reciprocal term is 5 + 4(3) = 17. Inverting gives 1/17.',
            stepByStep: ['Reciprocals: 5, 8, 11, 14', 'd = 3', '5th reciprocal = 5 + 4(3) = 17', 'H₅ = 1 / 17']
          }
        ],
        visualType: 'pattern'
      },
      {
        id: 'harmonic_mean',
        title: 'Harmonic Mean & Rate Applications',
        shortDesc: 'The classic formula H = 2ab / (a + b) for two numbers and harmonic averaging of rates.',
        level: 'Foundation',
        definition: 'The Harmonic Mean (H.M.) of two numbers a and b is H = 2ab / (a + b). It represents the reciprocal of the arithmetic mean of the reciprocals: 1/H = (1/a + 1/b)/2. It is the mathematically correct average for rates over equal distances (e.g. average velocity).',
        formulas: [
          {
            name: 'Harmonic Mean of Two Numbers',
            formula: 'H = 2ab / (a + b)',
            condition: 'a, b > 0',
            description: 'The reciprocal of the arithmetic mean of reciprocals.'
          },
          {
            name: 'Average Speed over Equal Distances',
            formula: 'V_avg = 2 · v₁ · v₂ / (v₁ + v₂)',
            description: 'When traveling distance d at speed v₁ and returning distance d at speed v₂.'
          }
        ],
        inputLabel: 'Enter Two Quantities a and b',
        inputPlaceholder: 'e.g. 40 and 60 or a=30, b=70',
        defaultInput: 'a = 40, b = 60',
        examplePills: ['a=40, b=60', 'a=10, b=90', 'a=12, b=24'],
        actions: [
          { id: 'find_hm', label: 'Find Harmonic Mean' }
        ],
        defaultAction: 'find_hm',
        workedExample: {
          problem: 'A vehicle travels from City A to City B at 40 km/h and returns along the same route at 60 km/h. Find the true average speed.',
          step1Identify: 'Given: Outbound speed v₁ = 40 km/h, return speed v₂ = 60 km/h over identical distances.',
          step2Method: 'Because distances are equal, average speed is the Harmonic Mean: V_avg = 2v₁v₂ / (v₁ + v₂).',
          step3Substitute: 'V_avg = 2(40)(60) / (40 + 60).',
          step4Simplify: 'Numerator = 4800. Denominator = 100. V_avg = 4800 / 100 = 48 km/h.',
          step5Answer: 'The true average speed is 48 km/h (notice it is strictly less than the arithmetic mean 50 km/h).'
        },
        commonMistakes: [
          {
            title: 'Using Arithmetic Mean for Average Speed',
            description: 'Averaging (40 + 60)/2 = 50 km/h for equal distances. This is wrong because more time is spent traveling at the slower speed.',
            correction: 'Always use Harmonic Mean for speeds over equal distances.'
          }
        ],
        practiceQuestions: [
          {
            id: 'hp2',
            question: 'What is the harmonic mean of 6 and 12?',
            options: ['8', '9', '7.5', '8.5'],
            correctIndex: 0,
            explanation: 'H = 2(6)(12)/(6 + 12) = 144 / 18 = 8.',
            stepByStep: ['H = 2ab / (a + b)', '2 · 6 · 12 = 144', '6 + 12 = 18', '144 / 18 = 8']
          }
        ],
        visualType: 'means'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 05. MEANS AND THEIR RELATIONSHIPS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'means',
    number: '05',
    title: 'Means and Their Relationships',
    shortTitle: 'Means',
    level: 'Foundation',
    roadmapStage: 'Beginner',
    summary: 'The triumvirate of classical Pythagorean means: Arithmetic (AM), Geometric (GM), and Harmonic (HM), establishing A ≥ G ≥ H and G² = AH.',
    subtopics: [
      {
        id: 'am_gm_hm_relationships',
        title: 'AM, GM, HM & The Classic Inequality A ≥ G ≥ H',
        shortDesc: 'Mathematical proof and properties of A = (a+b)/2, G = √(ab), H = 2ab/(a+b), and G² = AH.',
        level: 'Foundation',
        definition: 'For any two positive real numbers a and b: (1) A = (a + b)/2, (2) G = √(ab), (3) H = 2ab/(a + b). The fundamental inequality states that A ≥ G ≥ H, with equality holding if and only if a = b. Furthermore, G is the geometric mean of A and H, giving G² = A · H.',
        classicNote: '"Pappus of Alexandria observed in 320 AD that all three means can be inscribed simultaneously in a single semicircle."',
        formulas: [
          {
            name: 'Arithmetic Mean (AM)',
            formula: 'A = (a + b) / 2',
            description: 'Additive central tendency.'
          },
          {
            name: 'Geometric Mean (GM)',
            formula: 'G = √(ab)',
            condition: 'a, b > 0',
            description: 'Multiplicative central tendency.'
          },
          {
            name: 'Harmonic Mean (HM)',
            formula: 'H = 2ab / (a + b)',
            condition: 'a, b > 0',
            description: 'Reciprocal balance point.'
          },
          {
            name: 'The Fundamental Inequality',
            formula: 'A ≥ G ≥ H',
            condition: 'Equality holds ⟺ a = b',
            description: 'AM is always greater than or equal to GM, which is always greater than or equal to HM.'
          },
          {
            name: 'Pythagorean Mean Identity',
            formula: 'G² = A · H',
            description: 'For any two positive numbers, G is the geometric mean of A and H.'
          }
        ],
        inputLabel: 'Enter Two Positive Numbers a and b',
        inputPlaceholder: 'e.g. a = 4, b = 16 or 9, 25',
        defaultInput: 'a = 4, b = 16',
        examplePills: ['a=4, b=16', 'a=9, b=25', 'a=10, b=10 (Equality)', 'a=2, b=18'],
        actions: [
          { id: 'compare_means', label: 'Compare AM, GM, HM' },
          { id: 'verify_g2_ah', label: 'Verify G² = AH' }
        ],
        defaultAction: 'compare_means',
        workedExample: {
          problem: 'For a = 4 and b = 16, calculate AM, GM, and HM. Verify that A ≥ G ≥ H and that G² = A · H.',
          step1Identify: 'Given positive numbers a = 4, b = 16.',
          step2Method: 'Compute A = (a + b)/2, G = √(ab), and H = 2ab/(a + b).',
          step3Substitute: 'A = (4 + 16)/2 = 10. G = √(4 · 16) = √64 = 8. H = 2(4)(16)/(4 + 16) = 128 / 20 = 6.4.',
          step4Simplify: 'Ordering: 10 ≥ 8 ≥ 6.4 (A > G > H holds). Product test: G² = 8² = 64. A · H = 10 · 6.4 = 64.',
          step5Answer: 'AM = 10, GM = 8, HM = 6.4. Both A ≥ G ≥ H and G² = A · H are verified.'
        },
        commonMistakes: [
          {
            title: 'Applying to Non-Positive Values',
            description: 'If numbers are negative, G = √(ab) may yield signs incompatible with the inequality.',
            correction: 'The AM-GM-HM inequality strictly holds for positive real numbers.'
          }
        ],
        practiceQuestions: [
          {
            id: 'm1',
            question: 'If AM = 25 and HM = 9 for two numbers, what is their GM?',
            options: ['15', '17', '12', '225'],
            correctIndex: 0,
            explanation: 'G² = A · H = 25 · 9 = 225 ⇒ G = √225 = 15.',
            stepByStep: ['Identity: G² = A · H', 'G² = 25 · 9 = 225', 'G = √225 = 15']
          }
        ],
        visualType: 'means'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 06. SPECIAL SEQUENCES AND SERIES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'special',
    number: '06',
    title: 'Special Sequences and Series',
    shortTitle: 'Special Series',
    level: 'Foundation',
    roadmapStage: 'Beginner',
    summary: 'The classical cornerstone series: natural numbers, sums of squares, sums of cubes, triangular numbers, and the Fibonacci sequence.',
    subtopics: [
      {
        id: 'natural_powers',
        title: 'Sums of Powers: Natural Numbers, Squares, and Cubes',
        shortDesc: 'Formulas for ∑k, ∑k², and ∑k³ from k = 1 to n.',
        level: 'Foundation',
        definition: 'Closed-form polynomial expressions for the sums of powers of consecutive integers: (1) Sum of first n integers: n(n + 1)/2; (2) Sum of squares: n(n + 1)(2n + 1)/6; (3) Sum of cubes: [n(n + 1)/2]², which remarkably equals the square of the sum of the first n integers (Nicomachus theorem).',
        classicNote: '"Nicomachus of Gerasa (100 AD): The sum of cubes is ever equal to the square of the triangular sum."',
        formulas: [
          {
            name: 'Sum of First n Natural Numbers',
            formula: '∑ₖ₌₁ⁿ k = n(n + 1) / 2',
            description: 'Triangular number formula.'
          },
          {
            name: 'Sum of Squares',
            formula: '∑ₖ₌₁ⁿ k² = n(n + 1)(2n + 1) / 6',
            description: 'Pyramidal number formula.'
          },
          {
            name: 'Sum of Cubes (Nicomachus)',
            formula: '∑ₖ₌₁ⁿ k³ = [n(n + 1) / 2]² = (∑ₖ₌₁ⁿ k)²',
            description: 'The square of the first power sum.'
          },
          {
            name: 'Sum of First n Odd Numbers',
            formula: '∑ₖ₌₁ⁿ (2k - 1) = n²',
            description: 'Always forms a perfect square.'
          }
        ],
        inputLabel: 'Enter Upper Limit n or Expression',
        inputPlaceholder: 'e.g. n = 10 or 1^2 + 2^2 + ... + 15^2',
        defaultInput: 'n = 10',
        examplePills: ['n=10', 'n=20', 'n=50', 'Sum of squares to 10'],
        actions: [
          { id: 'eval_special_sum', label: 'Evaluate ∑k, ∑k², ∑k³' },
          { id: 'eval_odd_sum', label: 'Evaluate Sum of Odd Numbers' }
        ],
        defaultAction: 'eval_special_sum',
        workedExample: {
          problem: 'Find the sum of the squares of the first 10 positive integers: 1² + 2² + 3² + ... + 10².',
          step1Identify: 'Given n = 10. Series is ∑ k² from k = 1 to 10.',
          step2Method: 'Apply the sum of squares formula: S = n(n + 1)(2n + 1) / 6.',
          step3Substitute: 'S = 10 · (10 + 1) · (2 · 10 + 1) / 6 = 10 · 11 · 21 / 6.',
          step4Simplify: '10 · 11 = 110. 110 · 21 = 2310. 2310 / 6 = 385.',
          step5Answer: 'The sum of the squares is 385.'
        },
        commonMistakes: [
          {
            title: 'Squaring the Terms Instead of Index',
            description: 'Confusing (∑ k)² with ∑ k². The former is the sum of cubes; the latter is n(n+1)(2n+1)/6.',
            correction: 'Remember ∑ k² ≠ (∑ k)².'
          }
        ],
        practiceQuestions: [
          {
            id: 'sp1',
            question: 'What is the sum of the cubes of the first 4 integers (1³ + 2³ + 3³ + 4³)?',
            options: ['100', '64', '80', '120'],
            correctIndex: 0,
            explanation: '∑k = 4(5)/2 = 10. ∑k³ = 10² = 100. (1 + 8 + 27 + 64 = 100).',
            stepByStep: ['Triangular sum = 4 · 5 / 2 = 10', 'Cube sum = (10)² = 100']
          }
        ],
        visualType: 'pattern'
      },
      {
        id: 'fibonacci_sequence',
        title: 'Fibonacci Sequence & The Golden Ratio',
        shortDesc: 'The recurrence Fₙ = Fₙ₋₁ + Fₙ₋₂, Binet formula, and asymptotic ratio φ ≈ 1.6180339...',
        level: 'Foundation',
        definition: 'The Fibonacci sequence begins with F₀ = 0, F₁ = 1, and follows the recursive law Fₙ = Fₙ₋₁ + Fₙ₋₂ for n ≥ 2: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ... As n increases, the ratio of consecutive terms Fₙ / Fₙ₋₁ converges to the Golden Ratio φ = (1 + √5)/2 ≈ 1.6180339887... Binet formula gives the explicit closed form.',
        formulas: [
          {
            name: 'Fibonacci Recurrence',
            formula: 'F₀ = 0, F₁ = 1,  Fₙ = Fₙ₋₁ + Fₙ₋₂',
            description: 'Each term is the sum of the two preceding terms.'
          },
          {
            name: 'Binet Formula (Explicit Form)',
            formula: 'Fₙ = [φⁿ - (-φ)⁻ⁿ] / √5,  where φ = (1 + √5) / 2',
            description: 'Computes the n-th Fibonacci number directly without recursion.'
          },
          {
            name: 'Golden Ratio Limit',
            formula: 'lim(n→∞) [Fₙ₊₁ / Fₙ] = φ ≈ 1.6180339887...',
            description: 'Consecutive ratio limit.'
          }
        ],
        inputLabel: 'Enter Index n or Terms to Generate',
        inputPlaceholder: 'e.g. n = 12 or first 15 terms',
        defaultInput: 'n = 12',
        examplePills: ['n=12', 'n=20', 'Generate 10 terms'],
        actions: [
          { id: 'gen_fibonacci', label: 'Generate Fibonacci Sequence' },
          { id: 'eval_binet', label: 'Find nth Fibonacci (Binet)' }
        ],
        defaultAction: 'gen_fibonacci',
        workedExample: {
          problem: 'Calculate the first 8 terms of the Fibonacci sequence and observe the ratio F₈ / F₇.',
          step1Identify: 'Initial conditions: F₁ = 1, F₂ = 1.',
          step2Method: 'Generate iteratively: Fₙ = Fₙ₋₁ + Fₙ₋₂.',
          step3Substitute: 'F₃ = 2, F₄ = 3, F₅ = 5, F₆ = 8, F₇ = 13, F₈ = 21.',
          step4Simplify: 'Ratio F₈ / F₇ = 21 / 13 ≈ 1.61538.',
          step5Answer: 'First 8 terms: 1, 1, 2, 3, 5, 8, 13, 21. Ratio 21/13 ≈ 1.61538 approaches φ ≈ 1.61803.'
        },
        commonMistakes: [
          {
            title: 'Starting Index Ambiguity',
            description: 'Some texts index from F₀ = 0, others from F₁ = 1.',
            correction: 'Clarify whether 0 is counted as the 0-th term.'
          }
        ],
        practiceQuestions: [
          {
            id: 'sp2',
            question: 'What is the 10th Fibonacci number (starting 1, 1, 2, 3, 5...)?',
            options: ['55', '89', '34', '54'],
            correctIndex: 0,
            explanation: '1, 1, 2, 3, 5, 8, 13, 21, 34, 55 (10th term is 55).',
            stepByStep: ['F₁=1, F₂=1, F₃=2, F₄=3, F₅=5', 'F₆=8, F₇=13, F₈=21, F₉=34, F₁₀=55']
          }
        ],
        visualType: 'pattern'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 07. FINITE AND INFINITE SERIES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'finite_infinite',
    number: '07',
    title: 'Finite and Infinite Series',
    shortTitle: 'Finite & Infinite',
    level: 'Intermediate',
    roadmapStage: 'Intermediate',
    summary: 'Understanding the deep conceptual chasm between finite sums and the infinite limiting process of partial sums S_N.',
    subtopics: [
      {
        id: 'partial_sums_process',
        title: 'Partial Sums & The Infinite Limiting Process',
        shortDesc: 'How an infinite series is formally defined as the limit of its finite partial sums S_N = ∑ₖ₌₁ᴺ aₖ.',
        level: 'Intermediate',
        definition: 'An infinite series ∑ₖ₌₁^∞ aₖ is not an infinite arithmetic sum in the colloquial sense; rather, it is formally defined as the limit of its sequence of partial sums {S_N}: S = lim(N→∞) S_N, where S_N = a₁ + a₂ + ... + a_N. If this limit exists as a finite real number S, the series converges to S. Otherwise, it diverges.',
        classicNote: '"We cannot add infinitely many numbers directly; we take the limit of finite totals."'
        ,
        formulas: [
          {
            name: 'N-th Partial Sum',
            formula: 'S_N = ∑ₖ₌₁ᴺ aₖ = a₁ + a₂ + ... + a_N',
            description: 'A well-defined finite sum of the first N terms.'
          },
          {
            name: 'Sum of Infinite Series Definition',
            formula: '∑ₖ₌₁^∞ aₖ = lim(N→∞) S_N',
            description: 'The infinite sum exists if and only if the sequence of partial sums has a finite limit.'
          }
        ],
        inputLabel: 'Enter Series Expression or Terms',
        inputPlaceholder: 'e.g. a_n = (1/2)^n or 1/2 + 1/4 + 1/8 + ...',
        defaultInput: 'a_n = (1/2)^n',
        examplePills: ['a_n = (1/2)^n', 'a_n = 1/n (Harmonic)', 'a_n = 1/n^2', 'a_n = (-1)^n'],
        actions: [
          { id: 'explore_partial_sums', label: 'Explore Partial Sums S_N' },
          { id: 'analyze_convergence_limit', label: 'Analyze Limiting Value' }
        ],
        defaultAction: 'explore_partial_sums',
        workedExample: {
          problem: 'Observe the partial sums of the infinite series ∑ₙ₌₁^∞ (1/2ⁿ) for N = 1, 2, 3, 4, 5, and find lim(N→∞) S_N.',
          step1Identify: 'General term aₙ = (1/2)ⁿ = 1/2ⁿ. First terms: 1/2, 1/4, 1/8, 1/16, 1/32.',
          step2Method: 'Compute successive partial sums S_N = ∑ₙ₌₁ᴺ (1/2)ⁿ.',
          step3Substitute: 'S₁ = 1/2 = 0.5. S₂ = 1/2 + 1/4 = 3/4 = 0.75. S₃ = 3/4 + 1/8 = 7/8 = 0.875. S₄ = 15/16 = 0.9375. S₅ = 31/32 = 0.96875.',
          step4Simplify: 'Observe pattern: S_N = 1 - (1/2)ᴺ. Taking limit: lim(N→∞) [1 - (1/2)ᴺ] = 1 - 0 = 1.',
          step5Answer: 'The partial sums approach 1. Thus, ∑ₙ₌₁^∞ (1/2ⁿ) = 1.'
        },
        commonMistakes: [
          {
            title: 'Rearranging Terms of Conditional Series',
            description: 'Assuming associative and commutative laws hold identically for infinite series as they do for finite sums (Riemann Rearrangement Theorem).',
            correction: 'Unconditional rearrangement requires absolute convergence.'
          }
        ],
        practiceQuestions: [
          {
            id: 'fi1',
            question: 'What is the 3rd partial sum S₃ of the series ∑ₙ₌₁^∞ (1/3ⁿ)?',
            options: ['13/27', '1/3', '4/9', '1/27'],
            correctIndex: 0,
            explanation: 'S₃ = 1/3 + 1/9 + 1/27 = (9 + 3 + 1)/27 = 13/27.',
            stepByStep: ['a₁ = 1/3 = 9/27', 'a₂ = 1/9 = 3/27', 'a₃ = 1/27', 'S₃ = (9 + 3 + 1)/27 = 13/27']
          }
        ],
        visualType: 'partial_sums'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 08. DECIMAL SEQUENCES & RECURRING DECIMALS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'decimals',
    number: '08',
    title: 'Decimal Sequences and Recurring Decimals',
    shortTitle: 'Decimals',
    level: 'Foundation',
    roadmapStage: 'Intermediate',
    summary: 'Transforming repeating and decimal sequences into exact rational fractions using infinite geometric series and algebraic methods.',
    subtopics: [
      {
        id: 'repeating_decimals_to_fractions',
        title: 'Converting Repeating Decimals to Vulgar Fractions',
        shortDesc: 'Exact fractional representation of 0.3̄, 0.27̄, 0.16̄ via geometric series and 10^k x - x subtraction.',
        level: 'Foundation',
        definition: 'Every repeating decimal represents an infinite geometric series with common ratio r = 10^(-p), where p is the period length. For example, 0.272727... = 27/100 + 27/10000 + ... which is an infinite G.P. with a = 27/100 and r = 1/100, yielding S = a/(1 - r) = 27/99 = 3/11.',
        formulas: [
          {
            name: 'Geometric Form of Pure Recurring Decimal',
            formula: '0.a₁a₂...aₚ̄ = (a₁a₂...aₚ) / (10ᵖ - 1) = (a₁a₂...aₚ) / 99...9',
            description: 'Denominator consists of exactly p nines.'
          },
          {
            name: 'Algebraic Shift Method',
            formula: '10ᵖ · x - x = integer  ⇒  x = integer / (10ᵖ - 1)',
            description: 'Isolates and eliminates the infinite recurring decimal tail.'
          }
        ],
        inputLabel: 'Enter Repeating Decimal or Decimal Sequence',
        inputPlaceholder: 'e.g. 0.33333... or 0.272727... or 0.16666...',
        defaultInput: '0.272727...',
        examplePills: ['0.33333...', '0.272727...', '0.16666...', '0.142857...', '0.5, 0.55, 0.555'],
        actions: [
          { id: 'convert_repeating', label: 'Convert to Fraction' },
          { id: 'analyze_decimal_seq', label: 'Analyze Decimal Pattern' }
        ],
        defaultAction: 'convert_repeating',
        workedExample: {
          problem: 'Convert the repeating decimal 0.272727... into an exact simplified vulgar fraction.',
          step1Identify: 'Let x = 0.272727... The repeating block is "27", which has period length p = 2.',
          step2Method: 'Multiply by 10² = 100 to shift one period across the decimal point.',
          step3Substitute: '100x = 27.272727... Subtract the original equation x = 0.272727...: 100x - x = 27.',
          step4Simplify: '99x = 27 ⇒ x = 27 / 99. Divide numerator and denominator by GCD(27, 99) = 9: x = 3 / 11.',
          step5Answer: '0.272727... = 3 / 11.'
        },
        commonMistakes: [
          {
            title: 'Miscounting the Period Length',
            description: 'Multiplying by 10 instead of 100 for a 2-digit repeating block, which leaves mismatched decimals.',
            correction: 'Multiply by 10^p where p is the exact number of repeating digits.'
          }
        ],
        practiceQuestions: [
          {
            id: 'dec1',
            question: 'What is the fraction equivalent of 0.6666...?',
            options: ['2/3', '3/5', '6/10', '7/11'],
            correctIndex: 0,
            explanation: '10x - x = 6 ⇒ 9x = 6 ⇒ x = 6/9 = 2/3.',
            stepByStep: ['Let x = 0.666...', '10x = 6.666...', '9x = 6', 'x = 6/9 = 2/3']
          }
        ],
        visualType: 'decimals'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 09. SIGMA NOTATION
  // ─────────────────────────────────────────────────────────────
  {
    id: 'sigma',
    number: '09',
    title: 'Sigma Notation',
    shortTitle: 'Sigma ∑',
    level: 'Foundation',
    roadmapStage: 'Intermediate',
    summary: 'The universal compact notation for summation: limits, dummy indices, linearity, and algebraic expansion.',
    subtopics: [
      {
        id: 'expanding_evaluating_sigma',
        title: 'The Sigma Symbol, Limits & Properties',
        shortDesc: 'Decoding ∑ₖ₌ₘⁿ f(k), linearity rules, index shifts, and evaluation.',
        level: 'Foundation',
        definition: 'The capital Greek letter Sigma (∑) denotes compact summation. In ∑ₖ₌ₘⁿ aₖ: k is the index of summation (dummy variable), m is the lower limit, n is the upper limit, and aₖ is the general term expression. Total number of terms is always n - m + 1.',
        classicNote: '"The great Swiss mathematician Leonhard Euler introduced the Greek letter ∑ for summation in 1755."',
        formulas: [
          {
            name: 'Sigma Definition',
            formula: '∑ₖ₌ₘⁿ aₖ = aₘ + aₘ₊₁ + aₘ₊₂ + ... + aₙ',
            description: 'Expands into (n - m + 1) terms.'
          },
          {
            name: 'Linearity: Constant Factor',
            formula: '∑ c · aₖ = c · ∑ aₖ',
            description: 'Constants factor outside the summation symbol.'
          },
          {
            name: 'Linearity: Sum / Difference',
            formula: '∑ (aₖ ± bₖ) = ∑ aₖ ± ∑ bₖ',
            description: 'Summations split across addition and subtraction.'
          },
          {
            name: 'Sum of a Constant',
            formula: '∑ₖ₌₁ⁿ c = n · c',
            description: 'Adding c to itself n times equals n · c.'
          }
        ],
        inputLabel: 'Enter Sigma Expression to Expand or Evaluate',
        inputPlaceholder: 'e.g. sum(k=1 to 5, 2k + 3) or sum(k=1 to 4, k^2)',
        defaultInput: 'sum(k=1 to 5, 2k + 3)',
        examplePills: ['sum(k=1 to 5, 2k + 3)', 'sum(k=1 to 4, k^2)', 'sum(k=1 to 6, 3*2^k)', 'sum(k=0 to 4, (-1)^k / (k+1))'],
        actions: [
          { id: 'expand_sigma', label: 'Expand Terms' },
          { id: 'eval_sigma', label: 'Evaluate Sum' },
          { id: 'simplify_sigma', label: 'Simplify Expression' }
        ],
        defaultAction: 'expand_sigma',
        workedExample: {
          problem: 'Expand and evaluate the sigma expression: ∑ₖ₌₁⁵ (2k + 3).',
          step1Identify: 'Summation from lower limit k = 1 to upper limit n = 5. General term: f(k) = 2k + 3. Number of terms: 5 - 1 + 1 = 5.',
          step2Method: 'Substitute k = 1, 2, 3, 4, 5 into the term expression.',
          step3Substitute: 'k=1: 2(1)+3 = 5; k=2: 2(2)+3 = 7; k=3: 2(3)+3 = 9; k=4: 2(4)+3 = 11; k=5: 2(5)+3 = 13.',
          step4Simplify: 'Expanded sum: 5 + 7 + 9 + 11 + 13 = 45.',
          step5Answer: 'Expansion: 5 + 7 + 9 + 11 + 13. Evaluated sum = 45.'
        },
        commonMistakes: [
          {
            title: 'Miscounting Number of Terms',
            description: 'Assuming a sum from k = 0 to n has n terms. It actually has n + 1 terms.',
            correction: 'Count is always (Upper Limit - Lower Limit + 1).'
          }
        ],
        practiceQuestions: [
          {
            id: 'sig1',
            question: 'What is the value of ∑ₖ₌₁⁴ (k² + 1)?',
            options: ['34', '30', '35', '28'],
            correctIndex: 0,
            explanation: '(1+1) + (4+1) + (9+1) + (16+1) = 2 + 5 + 10 + 17 = 34.',
            stepByStep: ['k=1: 1+1=2', 'k=2: 4+1=5', 'k=3: 9+1=10', 'k=4: 16+1=17', 'Total = 2 + 5 + 10 + 17 = 34']
          }
        ],
        visualType: 'pattern'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 10. TELESCOPING SERIES & METHOD OF DIFFERENCES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'telescoping',
    number: '10',
    title: 'Telescoping Series & Method of Differences',
    shortTitle: 'Telescoping',
    level: 'Intermediate',
    roadmapStage: 'Intermediate',
    summary: 'The elegant cancellation of intermediate terms, collapsing infinite summations into compact boundary differences like a folding telescope.',
    subtopics: [
      {
        id: 'telescoping_cancellation',
        title: 'Telescoping Cancellation & Partial Fractions',
        shortDesc: 'Expanding expressions where adjacent terms annihilate: ∑ [1/(k(k+1))] = ∑ [1/k - 1/(k+1)].',
        level: 'Intermediate',
        definition: 'A telescoping series is a series whose general term can be decomposed as a difference aₙ = bₙ - bₙ₊₁. When summed, every term except the first and the last cancels out: (b₁ - b₂) + (b₂ - b₃) + ... + (b_N - b_{N+1}) = b₁ - b_{N+1}. In the infinite limit, S = b₁ - lim(N→∞) b_{N+1}.',
        classicNote: '"Like a classical brass marine telescope sliding shut into its brass casing, hundreds of terms vanish in pairs."',
        formulas: [
          {
            name: 'Telescoping Collapse Formula',
            formula: '∑ₙ₌₁ᴺ (bₙ - bₙ₊₁) = b₁ - b_{N+1}',
            description: 'All intermediate terms pairwise cancel.'
          },
          {
            name: 'Canonical Partial Fraction',
            formula: '1 / [n(n + 1)] = 1/n - 1/(n + 1)',
            description: 'The archetype of telescoping decomposition.'
          },
          {
            name: 'Infinite Telescoping Sum',
            formula: '∑ₙ₌₁^∞ [bₙ - bₙ₊₁] = b₁ - lim(N→∞) b_{N+1}',
            description: 'Converges whenever b_N has a finite limit.'
          }
        ],
        inputLabel: 'Enter Telescoping Expression',
        inputPlaceholder: 'e.g. 1/(n*(n+1)) or 1/(n*(n+2))',
        defaultInput: '1 / (n * (n + 1))',
        examplePills: ['1 / (n * (n + 1))', '1 / (n * (n + 2))', '1 / ((2n - 1) * (2n + 1))'],
        actions: [
          { id: 'show_cancellation', label: 'Show Cancellation Matrix' },
          { id: 'find_telescoping_sum', label: 'Find Infinite Sum' },
          { id: 'find_partial_telescoping', label: 'Find S_N Expression' }
        ],
        defaultAction: 'show_cancellation',
        workedExample: {
          problem: 'Evaluate the infinite telescoping series: ∑ₙ₌₁^∞ 1 / [n(n + 1)].',
          step1Identify: 'General term: aₙ = 1 / [n(n + 1)].',
          step2Method: 'Decompose via partial fractions: 1 / [n(n + 1)] = A/n + B/(n + 1) ⇒ 1 = A(n + 1) + Bn. At n = 0, A = 1; at n = -1, B = -1. Thus, aₙ = 1/n - 1/(n + 1).',
          step3Substitute: 'Write out the N-th partial sum: S_N = (1 - 1/2) + (1/2 - 1/3) + (1/3 - 1/4) + ... + (1/N - 1/(N + 1)).',
          step4Simplify: 'Observe pairwise cancellation: -1/2 cancels +1/2, -1/3 cancels +1/3, leaving S_N = 1 - 1/(N + 1).',
          step5Answer: 'Taking N → ∞: lim(N→∞) [1 - 1/(N + 1)] = 1 - 0 = 1. The sum is 1.'
        },
        commonMistakes: [
          {
            title: 'Premature Cancellation across Gaps',
            description: 'For terms like 1/[n(n+2)], cancellation occurs 2 steps later, leaving two starting terms b₁ + b₂ and two final terms.',
            correction: 'Always write out enough terms to accurately identify the cancellation phase.'
          }
        ],
        practiceQuestions: [
          {
            id: 'tel1',
            question: 'What is the sum to infinity of ∑ₙ₌₁^∞ 1 / [n(n + 1)]?',
            options: ['1', '2', '1/2', 'Diverges'],
            correctIndex: 0,
            explanation: 'S_N = 1 - 1/(N+1) → 1 as N → ∞.',
            stepByStep: ['Decompose to 1/n - 1/(n+1)', 'Expand S_N = (1 - 1/2) + (1/2 - 1/3) + ...', 'S_N = 1 - 1/(N+1)', 'Limit as N→∞ is 1']
          }
        ],
        visualType: 'telescoping'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 11. CONVERGENCE & DIVERGENCE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'convergence',
    number: '11',
    title: 'Convergence and Divergence',
    shortTitle: 'Convergence',
    level: 'Intermediate',
    roadmapStage: 'Advanced',
    summary: 'The rigorous dividing line of higher mathematical analysis: determining whether infinite accumulations approach a finite reality.',
    subtopics: [
      {
        id: 'convergence_foundations',
        title: 'Convergence, Divergence & The nth-Term Test',
        shortDesc: 'The definition of convergence, Cauchy criterion, and the critical Divergence Test.',
        level: 'Intermediate',
        definition: 'A series ∑ aₙ is convergent if its sequence of partial sums {S_N} tends to a finite limit S. If S_N → ±∞ or oscillates without a limit, it is divergent. The nth-Term Divergence Test states: If lim(n→∞) aₙ ≠ 0, then ∑ aₙ MUST DIVERGE. However, if lim(n→∞) aₙ = 0, the test is INCONCLUSIVE (e.g. the Harmonic Series ∑ 1/n diverges even though 1/n → 0).',
        classicNote: '"The most treacherous trap in analysis: terms vanishing to zero is a necessary, but never sufficient, condition for convergence."',
        formulas: [
          {
            name: 'The nth-Term Test for Divergence',
            formula: 'lim(n→∞) aₙ ≠ 0  ⟹  ∑ aₙ Diverges',
            description: 'If terms do not vanish, convergence is impossible.'
          },
          {
            name: 'Crucial Warning: Inconclusive Case',
            formula: 'lim(n→∞) aₙ = 0  ⟹  TEST IS INCONCLUSIVE',
            description: 'Requires further tests (Ratio, Comparison, Integral, etc.).'
          },
          {
            name: 'The Harmonic Series Paradox',
            formula: '∑ₙ₌₁^∞ (1/n) = 1 + 1/2 + 1/3 + ... = ∞  (Divergent)',
            description: 'Terms approach 0, yet the sum climbs infinitely.'
          }
        ],
        inputLabel: 'Enter Infinite Series Term aₙ',
        inputPlaceholder: 'e.g. a_n = 1/n or a_n = (n + 1) / (2n - 1) or a_n = 1/2^n',
        defaultInput: 'a_n = 1/n',
        examplePills: ['a_n = 1/n', 'a_n = (n + 1) / (2n - 1)', 'a_n = 1/2^n', 'a_n = n / (n + 1)'],
        actions: [
          { id: 'apply_divergence_test', label: 'Apply nth-Term Test' },
          { id: 'analyze_partial_sums_plot', label: 'Explore Partial Sums' }
        ],
        defaultAction: 'apply_divergence_test',
        workedExample: {
          problem: 'Apply the nth-Term Divergence Test to the series ∑ₙ₌₁^∞ n / (3n + 5).',
          step1Identify: 'General term aₙ = n / (3n + 5).',
          step2Method: 'Evaluate the limit of the general term as n → ∞: L = lim(n→∞) aₙ.',
          step3Substitute: 'Divide numerator and denominator by highest power n: lim(n→∞) [1 / (3 + 5/n)].',
          step4Simplify: 'As n → ∞, 5/n → 0. The limit is 1 / (3 + 0) = 1/3.',
          step5Answer: 'Since lim(n→∞) aₙ = 1/3 ≠ 0, by the nth-Term Divergence Test, the series DIVERGES.'
        },
        commonMistakes: [
          {
            title: 'Assuming lim aₙ = 0 Implies Convergence',
            description: 'Claiming that ∑ (1/n) converges because 1/n → 0. Nicole Oresme proved in 1350 that the Harmonic Series diverges.',
            correction: 'lim aₙ = 0 only means the series MIGHT converge; you must perform another test.'
          }
        ],
        practiceQuestions: [
          {
            id: 'cv1',
            question: 'What does the nth-Term Test tell us about the series ∑ (5n² + 1)/(2n² + 3)?',
            options: ['Diverges because limit is 5/2 ≠ 0', 'Converges to 5/2', 'Test is inconclusive', 'Converges to 0'],
            correctIndex: 0,
            explanation: 'lim(n→∞) (5n²+1)/(2n²+3) = 5/2 ≠ 0. Therefore the series diverges.',
            stepByStep: ['Evaluate limit as n→∞', 'Highest degree is n²: 5/2', '5/2 ≠ 0', 'By Divergence Test: DIVERGES']
          }
        ],
        visualType: 'convergence'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 12. INFINITE SERIES TESTS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'tests',
    number: '12',
    title: 'Infinite Series Tests',
    shortTitle: 'Series Tests',
    level: 'Advanced',
    roadmapStage: 'Advanced',
    summary: 'The master analytical toolkit: Ratio Test, Root Test, p-Series Test, Integral Test, and Comparison Tests.',
    subtopics: [
      {
        id: 'ratio_test',
        title: 'The Ratio Test (D\'Alembert)',
        shortDesc: 'Evaluating L = lim |aₙ₊₁ / aₙ|: L < 1 (converges), L > 1 (diverges), L = 1 (inconclusive).',
        level: 'Advanced',
        definition: 'Let ∑ aₙ be a series with non-zero terms. Compute L = lim(n→∞) |aₙ₊₁ / aₙ|. (1) If L < 1, the series converges absolutely. (2) If L > 1 or L = ∞, the series diverges. (3) If L = 1, the test fails completely (inconclusive), and an alternative test must be chosen. Exceptional for factorials (n!) and exponentials (cⁿ).',
        classicNote: '"Published by Jean le Rond d\'Alembert in 1768, comparing series against geometric benchmarks."',
        formulas: [
          {
            name: 'Ratio Test Limit',
            formula: 'L = lim(n→∞) |aₙ₊₁ / aₙ|',
            description: 'The limiting growth multiplier of consecutive terms.'
          },
          {
            name: 'Decision Criteria',
            formula: 'L < 1: Converges  |  L > 1: Diverges  |  L = 1: Inconclusive',
            description: 'L = 1 provides zero information.'
          }
        ],
        inputLabel: 'Enter Series Term aₙ for Ratio Test',
        inputPlaceholder: 'e.g. 2^n / n! or n^2 / 3^n or n! / (2n)!',
        defaultInput: '2^n / n!',
        examplePills: ['2^n / n!', 'n^2 / 3^n', 'n! / n^n', '3^n / n^2'],
        actions: [
          { id: 'apply_ratio_test', label: 'Execute Ratio Test' },
          { id: 'explain_test_steps', label: 'Show Limit Derivation' }
        ],
        defaultAction: 'apply_ratio_test',
        workedExample: {
          problem: 'Use the Ratio Test to determine the convergence of the series ∑ₙ₌₁^∞ (2ⁿ / n!).',
          step1Identify: 'General term aₙ = 2ⁿ / n!. Next term aₙ₊₁ = 2ⁿ⁺¹ / (n + 1)!.',
          step2Method: 'Form the ratio |aₙ₊₁ / aₙ| = [2ⁿ⁺¹ / (n + 1)!] · [n! / 2ⁿ].',
          step3Substitute: 'Simplify using (n + 1)! = (n + 1) · n! and 2ⁿ⁺¹ / 2ⁿ = 2: |aₙ₊₁ / aₙ| = 2 / (n + 1).',
          step4Simplify: 'Take limit as n → ∞: L = lim(n→∞) [2 / (n + 1)] = 0.',
          step5Answer: 'Since L = 0 < 1, by the Ratio Test the series CONVERGES absolutely.'
        },
        commonMistakes: [
          {
            title: 'Applying Ratio Test to Rational Functions',
            description: 'For any rational expression P(n)/Q(n), L is guaranteed to equal 1 (inconclusive).',
            correction: 'Do not use Ratio Test on polynomial/rational terms; use p-Series or Comparison Test instead.'
          }
        ],
        practiceQuestions: [
          {
            id: 'st1',
            question: 'What is L in the Ratio Test for the series ∑ n / 3ⁿ?',
            options: ['1/3 (Converges)', '3 (Diverges)', '1 (Inconclusive)', '0'],
            correctIndex: 0,
            explanation: 'aₙ₊₁ / aₙ = [(n+1)/3ⁿ⁺¹] · [3ⁿ/n] = (n+1)/(3n) → 1/3 as n → ∞. Since 1/3 < 1, it converges.',
            stepByStep: ['aₙ₊₁/aₙ = (n+1)/(3n)', 'lim = 1/3', '1/3 < 1 ⟹ Converges']
          }
        ],
        visualType: 'convergence'
      },
      {
        id: 'p_series_test',
        title: 'The p-Series Test',
        shortDesc: '∑ (1 / nᵖ) converges if and only if p > 1; diverges if p ≤ 1.',
        level: 'Advanced',
        definition: 'A p-series has the standard form ∑ₙ₌₁^∞ 1 / nᵖ. It converges IF AND ONLY IF p > 1. If p ≤ 1, it diverges. At p = 1, it is the divergent Harmonic Series.',
        formulas: [
          {
            name: 'p-Series Theorem',
            formula: '∑ₙ₌₁^∞ (1 / nᵖ) converges ⟺ p > 1',
            description: 'The golden benchmark for comparison tests in analysis.'
          }
        ],
        inputLabel: 'Enter Series in Form 1 / n^p',
        inputPlaceholder: 'e.g. 1/n^2 or 1/sqrt(n) or 1/n^(3/2)',
        defaultInput: '1 / n^2',
        examplePills: ['1 / n^2 (p=2)', '1 / sqrt(n) (p=0.5)', '1 / n^(3/2)', '1 / n (p=1)'],
        actions: [
          { id: 'apply_p_series', label: 'Apply p-Series Test' }
        ],
        defaultAction: 'apply_p_series',
        workedExample: {
          problem: 'Determine whether ∑ₙ₌₁^∞ 1 / √n converges.',
          step1Identify: 'Express in power form: 1 / √n = 1 / n^(1/2). Here p = 1/2 = 0.5.',
          step2Method: 'Apply p-series criterion: converges if p > 1, diverges if p ≤ 1.',
          step3Substitute: 'p = 0.5 ≤ 1.',
          step4Simplify: 'The exponent does not exceed 1.',
          step5Answer: 'Since p = 1/2 ≤ 1, the series DIVERGES.'
        },
        commonMistakes: [
          {
            title: 'Thinking p ≥ 1 Converges',
            description: 'Forgetting that p = 1 diverges (Harmonic Series).',
            correction: 'Convergence requires strictly p > 1.'
          }
        ],
        practiceQuestions: [
          {
            id: 'st2',
            question: 'Does ∑ 1 / n³ converge or diverge?',
            options: ['Converges because p = 3 > 1', 'Diverges', 'Inconclusive', 'Converges to 0'],
            correctIndex: 0,
            explanation: 'p = 3 > 1, so by the p-series test it converges.',
            stepByStep: ['Identify p = 3', '3 > 1', 'Converges']
          }
        ],
        visualType: 'convergence'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 13. POWER SERIES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'power_series',
    number: '13',
    title: 'Power Series',
    shortTitle: 'Power Series',
    level: 'Advanced',
    roadmapStage: 'Advanced',
    summary: 'Infinite polynomials in x: center, radius of convergence R, interval of convergence, and term-by-term calculus.',
    subtopics: [
      {
        id: 'radius_and_interval',
        title: 'Center, Radius & Interval of Convergence',
        shortDesc: 'Finding R = 1/L and testing boundary endpoints for ∑ cₙ(x - a)ⁿ.',
        level: 'Advanced',
        definition: 'A power series centered at a is an infinite series of the form ∑ₙ₌₀^∞ cₙ(x - a)ⁿ. For any power series, exactly one of three cases holds: (1) The series converges only at x = a (R = 0); (2) The series converges for all real x (R = ∞); (3) There exists a real number R > 0 (radius of convergence) such that the series converges absolutely for |x - a| < R and diverges for |x - a| > R. Convergence at the endpoints x = a ± R must be tested individually.',
        classicNote: '"A power series is an infinite polynomial whose domain of validity is a circle in the complex plane or an interval on the real line."',
        formulas: [
          {
            name: 'Standard Power Series',
            formula: '∑ₙ₌₀^∞ cₙ(x - a)ⁿ = c₀ + c₁(x - a) + c₂(x - a)² + ...',
            description: 'Centered at x = a with coefficients cₙ.'
          },
          {
            name: 'Radius of Convergence (Ratio Form)',
            formula: 'R = 1 / lim(n→∞) |cₙ₊₁ / cₙ|',
            description: 'Derived directly from the Ratio Test condition L < 1.'
          },
          {
            name: 'Interval of Convergence',
            formula: '(a - R, a + R) with endpoints tested',
            description: 'The set of all x-values for which the series converges.'
          }
        ],
        inputLabel: 'Enter Power Series Expression',
        inputPlaceholder: 'e.g. (x - 2)^n / n or x^n / (n * 3^n)',
        defaultInput: 'x^n / (n * 3^n)',
        examplePills: ['x^n / (n * 3^n)', '(x - 2)^n / n', 'x^n / n!', 'n * (x + 1)^n'],
        actions: [
          { id: 'find_radius_r', label: 'Find Radius of Convergence (R)' },
          { id: 'find_interval', label: 'Find Interval of Convergence' }
        ],
        defaultAction: 'find_radius_r',
        workedExample: {
          problem: 'Find the radius and interval of convergence of the power series ∑ₙ₌₁^∞ xⁿ / (n · 3ⁿ).',
          step1Identify: 'Center a = 0. General term uₙ = xⁿ / (n · 3ⁿ). Next term uₙ₊₁ = xⁿ⁺¹ / [(n + 1) · 3ⁿ⁺¹].',
          step2Method: 'Apply Ratio Test: L = lim(n→∞) |uₙ₊₁ / uₙ| = lim(n→∞) [|x| / 3] · [n / (n + 1)].',
          step3Substitute: 'As n → ∞, n / (n + 1) → 1. Hence, L = |x| / 3.',
          step4Simplify: 'For absolute convergence: L < 1 ⇒ |x| / 3 < 1 ⇒ |x| < 3. Therefore, radius R = 3. Test endpoints: At x = 3: ∑ 1/n (Harmonic, diverges). At x = -3: ∑ (-1)ⁿ/n (Alternating, converges).',
          step5Answer: 'Radius of convergence: R = 3. Interval of convergence: [-3, 3).'
        },
        commonMistakes: [
          {
            title: 'Neglecting Endpoint Testing',
            description: 'Assuming the interval is always strictly open (a - R, a + R) without testing the boundary endpoints.',
            correction: 'Always substitute x = a - R and x = a + R into the original series and test with alternating or p-series tests.'
          }
        ],
        practiceQuestions: [
          {
            id: 'ps1',
            question: 'What is the radius of convergence R of ∑ xⁿ / n! ?',
            options: ['R = ∞ (all x)', 'R = 1', 'R = 0', 'R = e'],
            correctIndex: 0,
            explanation: '|cₙ₊₁/cₙ| = n! / (n+1)! = 1/(n+1) → 0. R = 1/0 = ∞. Converges for all real x.',
            stepByStep: ['Ratio of coefficients = 1 / (n + 1)', 'Limit as n → ∞ is 0', 'R = 1 / 0 = ∞']
          }
        ],
        visualType: 'convergence'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 14. TAYLOR & MACLAURIN SERIES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'taylor_maclaurin',
    number: '14',
    title: 'Taylor and Maclaurin Series',
    shortTitle: 'Taylor & Maclaurin',
    level: 'University',
    roadmapStage: 'Advanced',
    summary: 'Approximating complex transcendental functions by polynomials using higher derivatives centered at a point.',
    subtopics: [
      {
        id: 'taylor_foundations',
        title: 'Taylor Expansions & Standard Maclaurin Series',
        shortDesc: 'Representing eˣ, sin x, cos x, ln(1+x), and 1/(1-x) via f(x) = ∑ [f⁽ⁿ⁾(a)/n!] (x - a)ⁿ.',
        level: 'University',
        definition: 'If a function f(x) has derivatives of all orders at x = a, its Taylor series centered at a is f(x) = ∑ₙ₌₀^∞ [f⁽ⁿ⁾(a) / n!] · (x - a)ⁿ. When centered at a = 0, it is specifically designated a Maclaurin series. Truncating the series yields the n-th degree Taylor polynomial approximation Pₙ(x).',
        classicNote: '"Brook Taylor (1715) and Colin Maclaurin (1742): Bridges the finite world of polynomials with transcendental functions."',
        formulas: [
          {
            name: 'Taylor Series Formula',
            formula: 'f(x) = ∑ₙ₌₀^∞ [f⁽ⁿ⁾(a) / n!] · (x - a)ⁿ',
            description: 'Expansion centered at x = a.'
          },
          {
            name: 'Maclaurin Series Formula (a = 0)',
            formula: 'f(x) = ∑ₙ₌₀^∞ [f⁽ⁿ⁾(0) / n!] · xⁿ = f(0) + f\'(0)x + [f\'\'(0)/2!]x² + ...',
            description: 'Taylor series centered at zero.'
          },
          {
            name: 'Standard Expansion: Exponential',
            formula: 'eˣ = 1 + x + x²/2! + x³/3! + ... = ∑ xⁿ / n!,  R = ∞',
            description: 'Valid for all real numbers x.'
          },
          {
            name: 'Standard Expansion: Sine',
            formula: 'sin x = x - x³/3! + x⁵/5! - ... = ∑ (-1)ⁿ x²ⁿ⁺¹ / (2n + 1)!,  R = ∞',
            description: 'Odd powers only.'
          },
          {
            name: 'Standard Expansion: Cosine',
            formula: 'cos x = 1 - x²/2! + x⁴/4! - ... = ∑ (-1)ⁿ x²ⁿ / (2n)!,  R = ∞',
            description: 'Even powers only.'
          },
          {
            name: 'Standard Expansion: Geometric Series',
            formula: '1 / (1 - x) = 1 + x + x² + x³ + ... = ∑ xⁿ,  |x| < 1',
            description: 'Valid for |x| < 1.'
          }
        ],
        inputLabel: 'Select Function and Degree of Approximation',
        inputPlaceholder: 'e.g. e^x, sin(x), cos(x), 1/(1-x)',
        defaultInput: 'sin(x)',
        examplePills: ['e^x', 'sin(x)', 'cos(x)', 'ln(1+x)', '1/(1-x)'],
        actions: [
          { id: 'generate_taylor_approx', label: 'Generate Polynomial Approximation' },
          { id: 'compare_function_poly', label: 'Compare Approximation vs Exact' }
        ],
        defaultAction: 'generate_taylor_approx',
        workedExample: {
          problem: 'Find the Maclaurin series for f(x) = eˣ up to the term in x⁴ and approximate e^0.5.',
          step1Identify: 'Function f(x) = eˣ centered at a = 0. Target degree n = 4.',
          step2Method: 'All derivatives of eˣ are eˣ: f⁽ⁿ⁾(0) = e⁰ = 1 for all n.',
          step3Substitute: 'Formula: P₄(x) = 1 + x + x²/2! + x³/3! + x⁴/4! = 1 + x + x²/2 + x³/6 + x⁴/24.',
          step4Simplify: 'Evaluate at x = 0.5: P₄(0.5) = 1 + 0.5 + 0.25/2 + 0.125/6 + 0.0625/24 = 1 + 0.5 + 0.125 + 0.020833 + 0.002604 = 1.648437.',
          step5Answer: 'Approximation P₄(0.5) ≈ 1.648437. Exact value e^0.5 ≈ 1.648721 (error < 0.0003).'
        },
        commonMistakes: [
          {
            title: 'Forgetting Factorial Denominators',
            description: 'Writing xⁿ instead of xⁿ / n!, resulting in wild divergences.',
            correction: 'Every term must be divided by n!.'
          }
        ],
        practiceQuestions: [
          {
            id: 'tm1',
            question: 'What is the coefficient of x³ in the Maclaurin series of sin(x)?',
            options: ['-1/6 (-1/3!)', '1/6', '-1/3', '0'],
            correctIndex: 0,
            explanation: 'sin x = x - x³/3! + ... Coefficient of x³ is -1/6.',
            stepByStep: ['sin x = x - x³/6 + x⁵/120', 'Term in x³ is -x³/6', 'Coefficient is -1/6']
          }
        ],
        visualType: 'taylor'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 15. BINOMIAL SERIES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'binomial',
    number: '15',
    title: 'Binomial Series',
    shortTitle: 'Binomial Series',
    level: 'University',
    roadmapStage: 'Advanced',
    summary: 'From Pascal\'s finite integer expansions (a + b)ⁿ to Newton\'s generalized infinite series (1 + x)ᵅ for fractional and negative powers.',
    subtopics: [
      {
        id: 'generalized_binomial',
        title: 'Finite Expansion & Newton\'s Generalized Binomial Theorem',
        shortDesc: 'Expanding (1 + x)ᵅ for arbitrary real exponents α where |x| < 1.',
        level: 'University',
        definition: 'For a positive integer n, (a + b)ⁿ terminates with n + 1 terms using combinatorial coefficients ⁿCᵣ. Sir Isaac Newton generalized this in 1665 to arbitrary real powers α: (1 + x)ᵅ = 1 + αx + [α(α - 1)/2!]x² + [α(α - 1)(α - 2)/3!]x³ + ... which yields an INFINITE convergent series valid strictly when |x| < 1.',
        classicNote: '"Inscribed on Newton\'s tomb at Westminster Abbey: The discovery of the Generalized Binomial Theorem."',
        formulas: [
          {
            name: 'Finite Binomial Theorem (n ∈ ℕ)',
            formula: '(a + b)ⁿ = ∑ᵣ₌₀ⁿ ⁿCᵣ · aⁿ⁻ʳ · bʳ',
            description: 'Terminates after n + 1 terms.'
          },
          {
            name: 'Generalized Binomial Series',
            formula: '(1 + x)ᵅ = 1 + αx + [α(α-1)/2!]x² + [α(α-1)(α-2)/3!]x³ + ...',
            condition: 'Valid strictly for |x| < 1 when α ∉ ℕ',
            description: 'Newton infinite series expansion for fractional or negative powers.'
          },
          {
            name: 'General (r + 1)-th Term',
            formula: 'Tᵣ₊₁ = [α(α - 1)...(α - r + 1) / r!] · xʳ',
            description: 'Evaluates the r-th degree term.'
          }
        ],
        inputLabel: 'Enter Binomial Expression',
        inputPlaceholder: 'e.g. (1 + x)^(1/2) or (1 + x)^(-1) or (a + b)^5',
        defaultInput: '(1 + x)^(1/2)',
        examplePills: ['(1 + x)^(1/2)', '(1 + x)^(-1)', '(1 - x)^(-2)', '(x + y)^5'],
        actions: [
          { id: 'expand_binomial', label: 'Expand Binomial Series' },
          { id: 'find_specific_term', label: 'Find Specific Term' },
          { id: 'approximate_root', label: 'Approximate Square Root' }
        ],
        defaultAction: 'expand_binomial',
        workedExample: {
          problem: 'Find the first four terms of the binomial expansion of √(1 + x) = (1 + x)^(1/2), and use it to estimate √1.04.',
          step1Identify: 'Expression: (1 + x)ᵅ with α = 1/2. Convergence requires |x| < 1.',
          step2Method: 'Apply Newton series: (1 + x)ᵅ = 1 + αx + [α(α - 1)/2]x² + [α(α - 1)(α - 2)/6]x³.',
          step3Substitute: 'α = 1/2. Term 1: 1. Term 2: (1/2)x. Term 3: [(1/2)(-1/2)/2]x² = -x²/8. Term 4: [(1/2)(-1/2)(-3/2)/6]x³ = x³/16.',
          step4Simplify: 'Series: √(1 + x) = 1 + x/2 - x²/8 + x³/16 - ... For √1.04, set x = 0.04: 1 + 0.04/2 - 0.0016/8 = 1 + 0.02 - 0.0002 = 1.0198.',
          step5Answer: 'Expansion: 1 + x/2 - x²/8 + x³/16. Estimate √1.04 ≈ 1.0198 (exact = 1.0198039...).'
        },
        commonMistakes: [
          {
            title: 'Applying Generalized Series when |x| ≥ 1',
            description: 'Attempting to expand (1 + x)^(1/2) when x = 3, which diverges wildly.',
            correction: 'The generalized binomial series is valid only for |x| < 1.'
          }
        ],
        practiceQuestions: [
          {
            id: 'bin1',
            question: 'What is the second term (term in x) of (1 + x)^(-2)?',
            options: ['-2x', '2x', '-x', '4x'],
            correctIndex: 0,
            explanation: 'First term is 1. Second term is α · x = -2x.',
            stepByStep: ['α = -2', 'Term in x = αx = -2x']
          }
        ],
        visualType: 'binomial'
      }
    ]
  }
];

