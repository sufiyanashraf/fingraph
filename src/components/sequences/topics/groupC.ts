import type { SequenceTopic } from '../sequenceTopicsData';

export const GROUP_C_TOPICS: SequenceTopic[] = [
  {
    id: 'fibonacci_seq',
    number: 23,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Fibonacci Sequence',
    shortDesc: 'The nature sequence, golden ratio φ, and Binet formula',
    level: 'Intermediate',
    definition: 'The Fibonacci Sequence is defined by the recurrence F₀ = 0, F₁ = 1, and Fₙ = F_{n-1} + F_{n-2} for n ≥ 2: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ... The ratio of consecutive terms F_{n+1}/Fₙ approaches the Golden Ratio φ = (1 + √5)/2 ≈ 1.6180339887.',
    formulas: [
      {
        name: 'Recurrence Relation',
        formula: 'Fₙ = F_{n-1} + F_{n-2}, \\quad F₀ = 0, F₁ = 1',
        description: 'Each term is the sum of the two preceding terms.',
        symbols: [
          { symbol: 'Fₙ', meaning: 'The n-th Fibonacci number' },
          { symbol: 'F₀, F₁', meaning: 'Standard base conditions' }
        ]
      },
      {
        name: 'Binet Formula (Explicit Form)',
        formula: 'Fₙ = (φⁿ - ψⁿ) / √5',
        description: 'Where φ = (1 + √5)/2 and ψ = (1 - √5)/2 = -1/φ.',
        symbols: [
          { symbol: 'φ', meaning: 'Golden Ratio ≈ 1.6180339887' },
          { symbol: 'ψ', meaning: 'Conjugate golden root ≈ -0.6180339887' }
        ]
      },
      {
        name: 'Cassini Identity',
        formula: 'F_{n-1} · F_{n+1} - Fₙ² = (-1)ⁿ',
        description: 'Fundamental algebraic identity connecting consecutive Fibonacci numbers.',
        symbols: [
          { symbol: '(-1)ⁿ', meaning: 'Alternates between +1 and -1' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Fibonacci numbers and golden ratios:',
      actions: [
        { id: 'find_fn', label: 'Find nth Fibonacci (Fₙ)' },
        { id: 'generate_list', label: 'Generate First N Terms' },
        { id: 'golden_ratio_approx', label: 'Show Ratio F_{n+1}/Fₙ → φ' }
      ],
      defaultAction: 'find_fn',
      fields: [
        { id: 'target_n', label: 'Position (n)', placeholder: 'e.g. 10', defaultValue: '10' }
      ],
      examplePills: [
        { label: 'n = 10', values: { target_n: '10' } },
        { label: 'n = 15', values: { target_n: '15' } },
        { label: 'n = 20', values: { target_n: '20' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Generating Fibonacci Numbers',
        difficulty: 'Basic',
        problem: 'Find the 8th Fibonacci number F₈ by recurrence.',
        step1Identify: 'Start from base terms F₀ = 0, F₁ = 1.',
        step2Method: 'Add the previous two values: F₂ = 1, F₃ = 2, F₄ = 3, F₅ = 5, F₆ = 8, F₇ = 13, F₈ = 21.',
        step3Substitute: 'F₈ = F₇ + F₆ = 13 + 8.',
        step4Simplify: '13 + 8 = 21.',
        step5Answer: 'The 8th Fibonacci number is F₈ = 21.'
      },
      {
        title: 'Moderately Challenging: Checking Cassini Identity',
        difficulty: 'Moderately Challenging',
        problem: 'Verify Cassini identity for n = 6: F₅ · F₇ - F₆² = (-1)⁶.',
        step1Identify: 'F₅ = 5, F₆ = 8, F₇ = 13.',
        step2Method: 'Substitute these values into Cassini formula: F₅ · F₇ - F₆².',
        step3Substitute: '5 × 13 - 8² = 65 - 64.',
        step4Simplify: '65 - 64 = 1. Compare with (-1)⁶ = 1.',
        step5Answer: 'Both sides equal 1. Cassini identity is verified.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_fib_1',
        question: 'What is F₉ if F₇ = 13 and F₈ = 21?',
        options: ['34', '35', '33', '42'],
        correctIndex: 0,
        explanation: 'F₉ = F₈ + F₇ = 21 + 13 = 34.',
        stepByStep: ['21 + 13 = 34']
      },
      {
        id: 'q_fib_2',
        question: 'What is the limit of F_{n+1}/Fₙ as n approaches infinity?',
        options: ['The Golden Ratio φ ≈ 1.618', '2.0', '1.0', 'Euler number e ≈ 2.718'],
        correctIndex: 0,
        explanation: 'The ratio of consecutive Fibonacci numbers converges to φ = (1 + √5)/2 ≈ 1.618034.',
        stepByStep: ['lim F_{n+1}/Fₙ = (1 + √5)/2 = φ']
      }
    ],
    visualType: 'fibonacci_spiral'
  },
  {
    id: 'lucas_seq',
    number: 24,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Lucas Sequence',
    shortDesc: 'Sister sequence to Fibonacci with base values 2 and 1',
    level: 'Intermediate',
    definition: 'The Lucas Sequence satisfies the exact same recurrence relation as the Fibonacci sequence (Lₙ = L_{n-1} + L_{n-2}), but begins with the base values L₀ = 2 and L₁ = 1: 2, 1, 3, 4, 7, 11, 18, 29, 47, ... It is intrinsically linked to Fibonacci numbers via Lₙ = F_{n-1} + F_{n+1}.',
    formulas: [
      {
        name: 'Recurrence Relation',
        formula: 'Lₙ = L_{n-1} + L_{n-2}, \\quad L₀ = 2, L₁ = 1',
        description: 'Lucas recurrence definition.',
        symbols: [
          { symbol: 'Lₙ', meaning: 'The n-th Lucas number' }
        ]
      },
      {
        name: 'Fibonacci-Lucas Relation',
        formula: 'Lₙ = F_{n-1} + F_{n+1}',
        description: 'Direct representation of Lucas numbers as a sum of shifted Fibonacci numbers.',
        symbols: [
          { symbol: 'F_{n-1}, F_{n+1}', meaning: 'Neighboring Fibonacci numbers' }
        ]
      },
      {
        name: 'Binet Form for Lucas Numbers',
        formula: 'Lₙ = φⁿ + ψⁿ',
        description: 'Notice that unlike Fibonacci, there is no √5 division and terms are added.',
        symbols: [
          { symbol: 'φ', meaning: '(1 + √5)/2' },
          { symbol: 'ψ', meaning: '(1 - √5)/2' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Lucas numbers:',
      actions: [
        { id: 'find_ln', label: 'Find nth Lucas (Lₙ)' },
        { id: 'generate_list', label: 'Generate Lucas Sequence' },
        { id: 'fib_relation', label: 'Verify Lₙ = F_{n-1} + F_{n+1}' }
      ],
      defaultAction: 'find_ln',
      fields: [
        { id: 'target_n', label: 'Position (n)', placeholder: 'e.g. 7', defaultValue: '7' }
      ],
      examplePills: [
        { label: 'n = 5', values: { target_n: '5' } },
        { label: 'n = 7', values: { target_n: '7' } },
        { label: 'n = 10', values: { target_n: '10' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Finding the 6th Lucas Number',
        difficulty: 'Basic',
        problem: 'Compute the 6th Lucas number L₆ starting from L₀ = 2, L₁ = 1.',
        step1Identify: 'L₀ = 2, L₁ = 1. Rule: Lₙ = L_{n-1} + L_{n-2}.',
        step2Method: 'Compute terms step by step: L₂ = 2+1=3; L₃ = 1+3=4; L₄ = 3+4=7; L₅ = 4+7=11; L₆ = 7+11=18.',
        step3Substitute: 'L₆ = 7 + 11.',
        step4Simplify: '7 + 11 = 18.',
        step5Answer: 'The 6th Lucas number is L₆ = 18.'
      },
      {
        title: 'Moderately Challenging: Using Fibonacci-Lucas Identity',
        difficulty: 'Moderately Challenging',
        problem: 'Given F₄ = 3 and F₆ = 8, determine L₅ using the identity Lₙ = F_{n-1} + F_{n+1}.',
        step1Identify: 'Here n = 5. So n - 1 = 4 and n + 1 = 6.',
        step2Method: 'Substitute F₄ = 3 and F₆ = 8 into L₅ = F₄ + F₆.',
        step3Substitute: 'L₅ = 3 + 8.',
        step4Simplify: '3 + 8 = 11.',
        step5Answer: 'L₅ = 11. (This matches the Lucas sequence 2, 1, 3, 4, 7, 11).'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_luc_1',
        question: 'What is the value of L₄ in the Lucas sequence?',
        options: ['7', '6', '8', '11'],
        correctIndex: 0,
        explanation: 'L₀ = 2, L₁ = 1, L₂ = 3, L₃ = 4, L₄ = 7.',
        stepByStep: ['L₂ = 3, L₃ = 4', 'L₄ = 3 + 4 = 7']
      },
      {
        id: 'q_luc_2',
        question: 'What is the sum L₀ + L₁ + L₂?',
        options: ['6', '5', '7', '8'],
        correctIndex: 0,
        explanation: '2 + 1 + 3 = 6.',
        stepByStep: ['2 + 1 + 3 = 6']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'triangular_numbers',
    number: 25,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Triangular Numbers',
    shortDesc: 'Dots arranged in equilateral triangles and sum of consecutive integers',
    level: 'Beginner',
    definition: 'A triangular number Tₙ counts objects arranged in an equilateral triangle. The n-th triangular number is the sum of the first n natural numbers: Tₙ = 1 + 2 + 3 + ... + n = n(n + 1)/2. The sequence begins: 1, 3, 6, 10, 15, 21, 28, 36, ...',
    formulas: [
      {
        name: 'Triangular Number Formula',
        formula: 'Tₙ = n(n + 1) / 2',
        description: 'Direct algebraic formula for the n-th triangular number.',
        symbols: [
          { symbol: 'Tₙ', meaning: 'The n-th triangular number' },
          { symbol: 'n', meaning: 'Triangle side length in dots' }
        ]
      },
      {
        name: 'Sum of Two Consecutive Triangular Numbers',
        formula: 'Tₙ + T_{n-1} = n²',
        description: 'Two consecutive triangular numbers assemble geometrically into a perfect square.',
        symbols: [
          { symbol: 'n²', meaning: 'Square number' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Triangular Numbers:',
      actions: [
        { id: 'find_tn', label: 'Find nth Triangular (Tₙ)' },
        { id: 'check_if_triangular', label: 'Test if a Number is Triangular' },
        { id: 'sum_triangulars', label: 'Sum of Two Consecutive' }
      ],
      defaultAction: 'find_tn',
      fields: [
        { id: 'index_n', label: 'Position (n)', placeholder: 'e.g. 7', defaultValue: '7' }
      ],
      examplePills: [
        { label: 'n = 7 (Bowling Pins / Days)', values: { index_n: '7' } },
        { label: 'n = 10', values: { index_n: '10' } },
        { label: 'n = 20', values: { index_n: '20' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: 10th Triangular Number',
        difficulty: 'Basic',
        problem: 'Find the 10th triangular number T₁₀.',
        step1Identify: 'n = 10.',
        step2Method: 'Use the formula Tₙ = n(n + 1) / 2.',
        step3Substitute: 'T₁₀ = 10(10 + 1) / 2 = 10 × 11 / 2.',
        step4Simplify: '110 / 2 = 55.',
        step5Answer: 'The 10th triangular number is T₁₀ = 55.'
      },
      {
        title: 'Moderately Challenging: Testing if 78 is a Triangular Number',
        difficulty: 'Moderately Challenging',
        problem: 'Determine whether the number 78 is a triangular number.',
        step1Identify: 'Set Tₙ = 78: n(n + 1)/2 = 78.',
        step2Method: 'Multiply by 2: n(n + 1) = 156 ⇒ n² + n - 156 = 0.',
        step3Substitute: 'Calculate discriminant: D = 1² - 4(1)(-156) = 1 + 624 = 625 = 25².',
        step4Simplify: 'n = (-1 + 25) / 2 = 24 / 2 = 12.',
        step5Answer: 'Yes, 78 is the 12th triangular number (T₁₂ = 78).'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_tri_1',
        question: 'What is T₆ (the 6th triangular number)?',
        options: ['21', '28', '15', '36'],
        correctIndex: 0,
        explanation: 'T₆ = 6(7)/2 = 42/2 = 21.',
        stepByStep: ['6 × 7 = 42', '42 / 2 = 21']
      },
      {
        id: 'q_tri_2',
        question: 'What do you get when you add T₄ (10) and T₃ (6)?',
        options: ['16 (which is 4²)', '15', '20', '18'],
        correctIndex: 0,
        explanation: 'Tₙ + T_{n-1} = n². For n=4: 10 + 6 = 16 = 4².',
        stepByStep: ['10 + 6 = 16', '16 is 4²']
      }
    ],
    visualType: 'polygonal_lattice'
  },
  {
    id: 'square_numbers',
    number: 26,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Square Numbers',
    shortDesc: 'Perfect squares, odd number sums, and quadratic growth',
    level: 'Beginner',
    definition: 'A square number Sₙ is the product of an integer with itself: Sₙ = n². Geometrically, it represents dots arranged in a square grid of side n. A beautiful theorem states that every square number is the sum of the first n odd natural numbers: 1 + 3 + 5 + ... + (2n - 1) = n².',
    formulas: [
      {
        name: 'Square Formula',
        formula: 'Sₙ = n²',
        description: 'Area of a square grid of side length n.',
        symbols: [
          { symbol: 'n²', meaning: 'n multiplied by itself' }
        ]
      },
      {
        name: 'Sum of Odd Integers Identity',
        formula: '∑_{k=1}^n (2k - 1) = 1 + 3 + 5 + ... + (2n - 1) = n²',
        description: 'Every square number is composed of L-shaped gnomons of odd numbers.',
        symbols: [
          { symbol: '2k - 1', meaning: 'The k-th odd integer' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Square Numbers:',
      actions: [
        { id: 'find_sn', label: 'Find nth Square (n²)' },
        { id: 'odd_sum_decomp', label: 'Decompose into Odd Sum' },
        { id: 'check_square', label: 'Test Perfect Square' }
      ],
      defaultAction: 'find_sn',
      fields: [
        { id: 'side_n', label: 'Integer (n)', placeholder: 'e.g. 12', defaultValue: '12' }
      ],
      examplePills: [
        { label: 'n = 12', values: { side_n: '12' } },
        { label: 'n = 25', values: { side_n: '25' } },
        { label: 'n = 100', values: { side_n: '100' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: 12th Square Number',
        difficulty: 'Basic',
        problem: 'Find the 12th square number and write it as a sum of odd numbers.',
        step1Identify: 'n = 12.',
        step2Method: 'Compute 12² and list the first 12 odd numbers.',
        step3Substitute: '12² = 144.',
        step4Simplify: 'Odd numbers from 1 to 2(12) - 1 = 23: 1 + 3 + 5 + 7 + 9 + 11 + 13 + 15 + 17 + 19 + 21 + 23 = 144.',
        step5Answer: 'The 12th square number is 144.'
      },
      {
        title: 'Moderately Challenging: Difference of Consecutive Squares',
        difficulty: 'Moderately Challenging',
        problem: 'Show algebraically and numerically that the difference between (n + 1)² and n² is always the odd number 2n + 1.',
        step1Identify: 'Expand (n + 1)² - n².',
        step2Method: '(n + 1)² - n² = (n² + 2n + 1) - n² = 2n + 1.',
        step3Substitute: 'For n = 15: 16² - 15² = 256 - 225 = 31.',
        step4Simplify: 'Formula check: 2(15) + 1 = 30 + 1 = 31.',
        step5Answer: 'The difference between consecutive squares is always the next odd number (2n + 1).'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_sq_1',
        question: 'What is the sum of the first 15 odd integers (1 + 3 + 5 + ... + 29)?',
        options: ['225', '200', '250', '215'],
        correctIndex: 0,
        explanation: 'Sum of first n odd numbers is n²: 15² = 225.',
        stepByStep: ['15² = 225']
      },
      {
        id: 'q_sq_2',
        question: 'What is 100² - 99²?',
        options: ['199', '1', '100', '299'],
        correctIndex: 0,
        explanation: 'a² - b² = (a - b)(a + b) = 1 × 199 = 199.',
        stepByStep: ['(100 - 99)(100 + 99) = 1 × 199 = 199']
      }
    ],
    visualType: 'polygonal_lattice'
  },
  {
    id: 'cube_numbers',
    number: 27,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Cube Numbers',
    shortDesc: 'Volume scaling, Nicomachus theorem, and cubic summation',
    level: 'Intermediate',
    definition: 'A cube number Cₙ is an integer raised to the third power: Cₙ = n³. Geometrically, it represents unit cubes assembled into a 3D cube of side n. By Nicomachus\'s Theorem, the sum of the first n cubes equals the square of the n-th triangular number: 1³ + 2³ + ... + n³ = (1 + 2 + ... + n)².',
    formulas: [
      {
        name: 'Cube Formula',
        formula: 'Cₙ = n³',
        description: 'Third power of integer n.',
        symbols: [
          { symbol: 'n³', meaning: 'n × n × n' }
        ]
      },
      {
        name: 'Nicomachus Theorem (Sum of Cubes)',
        formula: '∑_{k=1}^n k³ = [n(n + 1) / 2]² = Tₙ²',
        description: 'The sum of the first n cubes is the square of the sum of the first n integers.',
        symbols: [
          { symbol: 'Tₙ', meaning: 'The n-th triangular number' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Cube Numbers and Nicomachus sums:',
      actions: [
        { id: 'find_cn', label: 'Find nth Cube (n³)' },
        { id: 'sum_cubes', label: 'Sum of First n Cubes' },
        { id: 'nicomachus_verify', label: 'Verify Nicomachus Identity' }
      ],
      defaultAction: 'find_cn',
      fields: [
        { id: 'side_n', label: 'Integer (n)', placeholder: 'e.g. 5', defaultValue: '5' }
      ],
      examplePills: [
        { label: 'n = 5', values: { side_n: '5' } },
        { label: 'n = 8', values: { side_n: '8' } },
        { label: 'n = 10', values: { side_n: '10' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Evaluating 1³ + 2³ + 3³ + 4³ + 5³',
        difficulty: 'Basic',
        problem: 'Find the sum of the first 5 cubes using Nicomachus\'s Theorem.',
        step1Identify: 'n = 5.',
        step2Method: 'First compute the triangular number T₅ = 5(6)/2 = 15, then square it.',
        step3Substitute: 'Sum = (15)².',
        step4Simplify: '15² = 225.',
        step5Answer: '1³ + 2³ + 3³ + 4³ + 5³ = 225.'
      },
      {
        title: 'Moderately Challenging: Consecutive Odd Groupings of Cubes',
        difficulty: 'Moderately Challenging',
        problem: 'Show how n³ can be represented as the sum of n consecutive odd numbers for n = 4.',
        step1Identify: 'For n = 4, the 4 consecutive odd numbers start after the first 1+2+3 = 6 odd numbers.',
        step2Method: 'The 7th, 8th, 9th, and 10th odd numbers are: 13, 15, 17, 19.',
        step3Substitute: 'Sum = 13 + 15 + 17 + 19.',
        step4Simplify: '13 + 15 = 28; 28 + 17 = 45; 45 + 19 = 64 = 4³.',
        step5Answer: '4³ = 13 + 15 + 17 + 19 = 64.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_cube_1',
        question: 'What is 1³ + 2³ + 3³ + 4³?',
        options: ['100', '64', '80', '125'],
        correctIndex: 0,
        explanation: '(1 + 2 + 3 + 4)² = 10² = 100.',
        stepByStep: ['1 + 2 + 3 + 4 = 10', '10² = 100']
      },
      {
        id: 'q_cube_2',
        question: 'What is the 7th cube number (7³)?',
        options: ['343', '216', '512', '729'],
        correctIndex: 0,
        explanation: '7 × 7 × 7 = 49 × 7 = 343.',
        stepByStep: ['49 × 7 = 343']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'polygonal_numbers',
    number: 28,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Polygonal Numbers',
    shortDesc: 'Figurate numbers: Pentagonal, Hexagonal, and s-gonal geometry',
    level: 'Intermediate',
    definition: 'Polygonal numbers (or figurate numbers) represent dots arranged into regular polygons with s sides. For s = 3 we have triangular numbers; for s = 4, square numbers; for s = 5, pentagonal numbers; and for s = 6, hexagonal numbers. The generalized formula for the n-th s-gonal number is P(s, n) = [(s - 2)n² - (s - 4)n] / 2.',
    formulas: [
      {
        name: 'Generalized s-gonal Formula',
        formula: 'P(s, n) = [(s - 2)n² - (s - 4)n] / 2',
        description: 'Computes the n-th figurate number for any polygon with s sides (s ≥ 3).',
        symbols: [
          { symbol: 's', meaning: 'Number of sides of polygon (3=Triangle, 4=Square, 5=Pentagon, 6=Hexagon)' },
          { symbol: 'n', meaning: 'Index / size rank' }
        ]
      },
      {
        name: 'Pentagonal Number Formula (s = 5)',
        formula: 'P₅(n) = n(3n - 1) / 2',
        description: 'Sequence: 1, 5, 12, 22, 35, 51, 70, 92, ...',
        symbols: [
          { symbol: 'P₅(n)', meaning: 'n-th pentagonal number' }
        ]
      },
      {
        name: 'Hexagonal Number Formula (s = 6)',
        formula: 'P₆(n) = n(2n - 1) = T_{2n-1}',
        description: 'Sequence: 1, 6, 15, 28, 45, 66, ... Every hexagonal number is an odd triangular number.',
        symbols: [
          { symbol: 'P₆(n)', meaning: 'n-th hexagonal number' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Polygonal Numbers:',
      actions: [
        { id: 'calc_polygonal', label: 'Calculate P(s, n)' },
        { id: 'generate_table', label: 'Generate Figurate Comparison Table' }
      ],
      defaultAction: 'calc_polygonal',
      fields: [
        { id: 'sides_s', label: 'Number of Sides (s)', placeholder: 'e.g. 5 for Pentagonal', defaultValue: '5' },
        { id: 'rank_n', label: 'Size Rank (n)', placeholder: 'e.g. 6', defaultValue: '6' }
      ],
      examplePills: [
        { label: 'Pentagonal: s=5, n=6', values: { sides_s: '5', rank_n: '6' } },
        { label: 'Hexagonal: s=6, n=5', values: { sides_s: '6', rank_n: '5' } },
        { label: 'Octagonal: s=8, n=4', values: { sides_s: '8', rank_n: '4' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: 5th Pentagonal Number',
        difficulty: 'Basic',
        problem: 'Find the 5th pentagonal number P₅(5).',
        step1Identify: 's = 5, n = 5.',
        step2Method: 'Use the pentagonal formula: P₅(n) = n(3n - 1) / 2.',
        step3Substitute: 'P₅(5) = 5(3(5) - 1) / 2 = 5(15 - 1) / 2 = 5(14) / 2.',
        step4Simplify: '5 × 7 = 35.',
        step5Answer: 'The 5th pentagonal number is 35.'
      },
      {
        title: 'Moderately Challenging: General Heptagonal Number (s = 7)',
        difficulty: 'Moderately Challenging',
        problem: 'Derive the formula for heptagonal numbers (s = 7) and calculate the 4th heptagonal number.',
        step1Identify: 's = 7.',
        step2Method: 'Substitute s = 7 into P(s, n) = [(s - 2)n² - (s - 4)n] / 2: P₇(n) = [(5)n² - (3)n] / 2 = n(5n - 3) / 2.',
        step3Substitute: 'For n = 4: P₇(4) = 4(5(4) - 3) / 2 = 4(20 - 3) / 2.',
        step4Simplify: '2 × 17 = 34.',
        step5Answer: 'The formula is n(5n - 3)/2, and the 4th heptagonal number is 34.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_poly_1',
        question: 'What is the 4th pentagonal number?',
        options: ['22', '35', '12', '26'],
        correctIndex: 0,
        explanation: 'P₅(4) = 4(3(4) - 1)/2 = 4(11)/2 = 22.',
        stepByStep: ['3(4) - 1 = 11', '4 × 11 / 2 = 22']
      },
      {
        id: 'q_poly_2',
        question: 'Every hexagonal number P₆(n) is identical to which triangular number?',
        options: ['T_{2n-1}', 'T_{2n}', 'T_{n-1}', '2 Tₙ'],
        correctIndex: 0,
        explanation: 'P₆(n) = n(2n - 1) = (2n - 1)(2n)/2 = T_{2n-1}.',
        stepByStep: ['n(2n - 1) = (2n - 1)(2n)/2 = T_{2n-1}']
      }
    ],
    visualType: 'polygonal_lattice'
  },
  {
    id: 'factorial_sequences',
    number: 29,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Factorial Sequences',
    shortDesc: 'Rapid combinatorial growth, Stirling approximation, and subfactorials',
    level: 'Intermediate',
    definition: 'The factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n: n! = n × (n - 1) × ... × 2 × 1, with 0! = 1 by convention. Factorials grow faster than any exponential function cⁿ and appear throughout combinatorics, Taylor series, and probability.',
    formulas: [
      {
        name: 'Factorial Definition',
        formula: 'n! = ∏_{k=1}^n k = n · (n - 1)!, \\quad 0! = 1',
        description: 'Recursive and product definition.',
        symbols: [
          { symbol: 'n!', meaning: 'n factorial' }
        ]
      },
      {
        name: 'Stirling Approximation (Large n)',
        formula: 'n! \\approx \\sqrt{2\\pi n} · (n / e)^n',
        description: 'Asymptotic formula giving high accuracy for large factorials.',
        symbols: [
          { symbol: 'e', meaning: 'Euler number ≈ 2.71828' },
          { symbol: 'π', meaning: 'Pi ≈ 3.14159' }
        ]
      },
      {
        name: 'Subfactorials (Derangements !n)',
        formula: '!n = n! · ∑_{k=0}^n (-1)^k / k!',
        description: 'Counts permutations of n items where no element appears in its original position.',
        symbols: [
          { symbol: '!n', meaning: 'Number of derangements' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Factorials and Stirling Approximations:',
      actions: [
        { id: 'calc_factorial', label: 'Evaluate n!' },
        { id: 'stirling_approx', label: 'Stirling Approximation' },
        { id: 'calc_derangement', label: 'Subfactorial (Derangements !n)' }
      ],
      defaultAction: 'calc_factorial',
      fields: [
        { id: 'integer_n', label: 'Non-negative Integer (n)', placeholder: 'e.g. 7', defaultValue: '7' }
      ],
      examplePills: [
        { label: 'n = 7', values: { integer_n: '7' } },
        { label: 'n = 10', values: { integer_n: '10' } },
        { label: 'n = 12', values: { integer_n: '12' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Evaluating 6!',
        difficulty: 'Basic',
        problem: 'Calculate the exact value of 6!.',
        step1Identify: 'n = 6.',
        step2Method: 'Multiply integers from 6 down to 1.',
        step3Substitute: '6! = 6 × 5 × 4 × 3 × 2 × 1.',
        step4Simplify: '6 × 5 = 30; 30 × 4 = 120; 120 × 3 = 360; 360 × 2 = 720; 720 × 1 = 720.',
        step5Answer: '6! = 720.'
      },
      {
        title: 'Moderately Challenging: Simplifying Factorial Quotients',
        difficulty: 'Moderately Challenging',
        problem: 'Evaluate 10! / (7! × 3!).',
        step1Identify: 'This is the combination formula C(10, 3).',
        step2Method: 'Expand 10! until 7! is exposed: 10! = 10 × 9 × 8 × 7!.',
        step3Substitute: '(10 × 9 × 8 × 7!) / (7! × (3 × 2 × 1)). Cancel 7!.',
        step4Simplify: '(10 × 9 × 8) / (6) = 720 / 6 = 120.',
        step5Answer: '10! / (7! × 3!) = 120.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_fac_1',
        question: 'What is 5!?',
        options: ['120', '24', '720', '60'],
        correctIndex: 0,
        explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120.',
        stepByStep: ['5 × 4 × 3 × 2 × 1 = 120']
      },
      {
        id: 'q_fac_2',
        question: 'Why is 0! defined as 1?',
        options: [
          'To satisfy the recurrence relation n! = n × (n - 1)! for n = 1',
          'Because zero multiplied by anything is 1',
          'Because factorials only work for odd numbers',
          'It is an arbitrary choice with no algebraic reason'
        ],
        correctIndex: 0,
        explanation: 'From 1! = 1 × 0!, solving gives 0! = 1! / 1 = 1.',
        stepByStep: ['1! = 1 × 0! ⇒ 0! = 1']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'alternating_sequences',
    number: 30,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Alternating Sequences',
    shortDesc: 'Oscillating signs, sign factors (-1)ⁿ, and boundedness',
    level: 'Intermediate',
    definition: 'An alternating sequence is a sequence whose terms alternate strictly between positive and negative values. Mathematically, this is modeled by incorporating a factor of (-1)ⁿ (terms start negative for n=1) or (-1)ⁿ⁺¹ (terms start positive for n=1).',
    formulas: [
      {
        name: 'Alternating Form (Starts Positive)',
        formula: 'aₙ = (-1)^{n+1} · cₙ',
        description: 'First term a₁ = +c₁, second a₂ = -c₂, third a₃ = +c₃, ...',
        symbols: [
          { symbol: 'cₙ', meaning: 'Positive magnitude function' },
          { symbol: '(-1)^{n+1}', meaning: 'Alternating sign generator' }
        ]
      },
      {
        name: 'Alternating Form (Starts Negative)',
        formula: 'aₙ = (-1)ⁿ · cₙ',
        description: 'First term a₁ = -c₁, second a₂ = +c₂, third a₃ = -c₃, ...',
        symbols: [
          { symbol: '(-1)ⁿ', meaning: 'Negative for odd n, positive for even n' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Analyze alternating sequence:',
      actions: [
        { id: 'generate_alt', label: 'Generate Terms' },
        { id: 'check_limit', label: 'Evaluate Limit as n → ∞' }
      ],
      defaultAction: 'generate_alt',
      fields: [
        { id: 'magnitude_c', label: 'Magnitude cₙ', placeholder: 'e.g. 1/n or 2*n', defaultValue: '1/n' },
        { id: 'start_sign', label: 'First Term Sign (+ or -)', placeholder: 'e.g. + or -', defaultValue: '+' },
        { id: 'num_terms', label: 'Terms to Generate', placeholder: 'e.g. 8', defaultValue: '8' }
      ],
      examplePills: [
        { label: 'Harmonic: (-1)ⁿ⁺¹/n', values: { magnitude_c: '1/n', start_sign: '+', num_terms: '8' } },
        { label: 'Geometric: (-1)ⁿ · (1/2ⁿ)', values: { magnitude_c: '1/(2^n)', start_sign: '-', num_terms: '8' } },
        { label: 'Bouncing: (-1)ⁿ · 5', values: { magnitude_c: '5', start_sign: '-', num_terms: '6' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Generating an Alternating Sequence',
        difficulty: 'Basic',
        problem: 'Write the first 5 terms of aₙ = (-1)ⁿ⁺¹ / (2n - 1).',
        step1Identify: '(-1)ⁿ⁺¹ produces signs +, -, +, -, + for n = 1, 2, 3, 4, 5. Magnitudes are 1/(2n-1).',
        step2Method: 'Evaluate for n = 1, 2, 3, 4, 5.',
        step3Substitute: 'n=1: +1/1 = 1; n=2: -1/3; n=3: +1/5; n=4: -1/7; n=5: +1/9.',
        step4Simplify: 'Terms: 1, -1/3, 1/5, -1/7, 1/9.',
        step5Answer: 'The first 5 terms are 1, -1/3, 1/5, -1/7, 1/9 (the Leibniz series sequence).'
      },
      {
        title: 'Moderately Challenging: Limit of Alternating Sequences',
        difficulty: 'Moderately Challenging',
        problem: 'Does the alternating sequence aₙ = (-1)ⁿ · n / (n + 1) converge as n → ∞?',
        step1Identify: 'Odd terms: a_odd = -n/(n+1) → -1. Even terms: a_even = +n/(n+1) → +1.',
        step2Method: 'For a limit to exist, all subsequences must converge to the same real number.',
        step3Substitute: 'lim a_{2k} = +1, while lim a_{2k-1} = -1.',
        step4Simplify: 'Because +1 ≠ -1, the terms oscillate between two distinct values.',
        step5Answer: 'The sequence diverges by oscillation.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_alt_1',
        question: 'What is the limit of aₙ = (-1)ⁿ / n² as n → ∞?',
        options: ['0', '1', '-1', 'Does not exist'],
        correctIndex: 0,
        explanation: 'By the Squeeze Theorem: -1/n² ≤ aₙ ≤ 1/n². Since ±1/n² → 0, aₙ → 0.',
        stepByStep: ['|aₙ| = 1/n²', '1/n² → 0 as n → ∞', 'Limit is 0']
      },
      {
        id: 'q_alt_2',
        question: 'Which factor ensures that the 1st term (n=1) is negative?',
        options: ['(-1)ⁿ', '(-1)^{n+1}', '(-1)^{2n}', '(-1)^{n-1}'],
        correctIndex: 0,
        explanation: '(-1)¹ = -1. In contrast, (-1)¹⁺¹ = (-1)² = +1.',
        stepByStep: ['For n=1, (-1)¹ = -1 (negative)']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'quadratic_sequences',
    number: 31,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Quadratic Sequences',
    shortDesc: 'Constant second differences and formulas aₙ = an² + bn + c',
    level: 'Intermediate',
    definition: 'A quadratic sequence is a sequence of numbers in which the first differences are not constant, but the second differences (the differences between the first differences) are non-zero and constant. The general term has the quadratic polynomial form aₙ = an² + bn + c, where 2a equals the constant second difference.',
    formulas: [
      {
        name: 'General Quadratic nth Term',
        formula: 'aₙ = a · n² + b · n + c',
        description: 'Quadratic polynomial in the position variable n.',
        symbols: [
          { symbol: 'a', meaning: 'Leading coefficient (half the second difference: 2a = Δ²)' },
          { symbol: 'b, c', meaning: 'Linear and constant coefficients' }
        ]
      },
      {
        name: 'Successive Differences Identity',
        formula: '2a = \\Delta^2, \\quad 3a + b = \\Delta_1, \\quad a + b + c = a_1',
        description: 'Standard 3-step linear system to extract a, b, and c directly from the difference table.',
        symbols: [
          { symbol: 'Δ²', meaning: 'Constant second difference' },
          { symbol: 'Δ₁', meaning: 'First difference between term 1 and term 2' },
          { symbol: 'a₁', meaning: 'First term of the sequence' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Fit quadratic formula aₙ = an² + bn + c:',
      actions: [
        { id: 'fit_quadratic', label: 'Find aₙ Formula' },
        { id: 'show_diff_table', label: 'Show 1st & 2nd Differences' },
        { id: 'predict_next', label: 'Predict Next 3 Terms' }
      ],
      defaultAction: 'fit_quadratic',
      fields: [
        { id: 'terms_input', label: 'At least 4 Terms of Sequence', placeholder: 'e.g. 4, 11, 22, 37, 56', defaultValue: '4, 11, 22, 37, 56' }
      ],
      examplePills: [
        { label: '4, 11, 22, 37, 56', values: { terms_input: '4, 11, 22, 37, 56' } },
        { label: '1, 6, 15, 28, 45', values: { terms_input: '1, 6, 15, 28, 45' } },
        { label: '5, 12, 23, 38, 57', values: { terms_input: '5, 12, 23, 38, 57' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Finding Quadratic Formula from Difference Table',
        difficulty: 'Basic',
        problem: 'Find the formula for the nth term of the sequence 4, 11, 22, 37, 56.',
        step1Identify: 'Terms: T₁=4, T₂=11, T₃=22, T₄=37, T₅=56.',
        step2Method: 'First differences: 11-4=7, 22-11=11, 37-22=15, 56-37=19. Second differences: 11-7=4, 15-11=4, 19-15=4.',
        step3Substitute: '2a = 4 ⇒ a = 2. 3a + b = 7 ⇒ 3(2) + b = 7 ⇒ b = 1.',
        step4Simplify: 'a + b + c = 4 ⇒ 2 + 1 + c = 4 ⇒ c = 1.',
        step5Answer: 'The formula is aₙ = 2n² + n + 1.'
      },
      {
        title: 'Moderately Challenging: Using Formula to Find High Index Term',
        difficulty: 'Moderately Challenging',
        problem: 'Using the formula aₙ = 2n² + n + 1, find the 20th term and verify if 801 is in the sequence.',
        step1Identify: 'a₂₀ = 2(20)² + 20 + 1.',
        step2Method: '2(400) + 21 = 800 + 21 = 821.',
        step3Substitute: 'Set 2n² + n + 1 = 801 ⇒ 2n² + n - 800 = 0.',
        step4Simplify: 'D = 1² - 4(2)(-800) = 1 + 6400 = 6401. Since √6401 ≈ 80.0062 is not an integer, n is not an integer.',
        step5Answer: 'The 20th term is 821. The number 801 is not a member of the sequence.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_quad_1',
        question: 'If the constant 2nd difference of a sequence is 8, what is the value of a in an² + bn + c?',
        options: ['4', '8', '2', '16'],
        correctIndex: 0,
        explanation: '2a = 2nd difference = 8 ⇒ a = 4.',
        stepByStep: ['2a = 8', 'a = 4']
      },
      {
        id: 'q_quad_2',
        question: 'What is the 5th term of aₙ = 3n² - 2n + 1?',
        options: ['66', '75', '60', '71'],
        correctIndex: 0,
        explanation: '3(5)² - 2(5) + 1 = 3(25) - 10 + 1 = 75 - 10 + 1 = 66.',
        stepByStep: ['3 × 25 = 75', '75 - 10 = 65', '65 + 1 = 66']
      }
    ],
    visualType: 'sequence_plot'
  },
  {
    id: 'agp_progressions',
    number: 32,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Arithmetic-Geometric Progressions',
    shortDesc: 'Hybrid sequences of AP and GP products and their summation',
    level: 'Advanced',
    definition: 'An Arithmetico-Geometric Progression (AGP) is a sequence in which each term is formed by multiplying the corresponding terms of an Arithmetic Progression and a Geometric Progression: a, (a + d)r, (a + 2d)r², (a + 3d)r³, ..., [a + (n - 1)d]rⁿ⁻¹.',
    formulas: [
      {
        name: 'nth Term of an AGP',
        formula: 'Tₙ = [a + (n - 1)d] · r^{n - 1}',
        description: 'Product of the linear AP factor and exponential GP factor.',
        symbols: [
          { symbol: 'a + (n - 1)d', meaning: 'Arithmetic part' },
          { symbol: 'r^{n - 1}', meaning: 'Geometric part' }
        ]
      },
      {
        name: 'Sum to Infinity of an AGP (|r| < 1)',
        formula: 'S_∞ = a / (1 - r) + d · r / (1 - r)²',
        description: 'Compact closed-form sum of an infinite converging AGP.',
        symbols: [
          { symbol: 'S_∞', meaning: 'Sum to infinity' },
          { symbol: 'a/(1 - r)', meaning: 'Base geometric contribution' },
          { symbol: 'dr/(1 - r)²', meaning: 'Arithmetic gradient contribution' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Calculate Arithmetico-Geometric Progression:',
      actions: [
        { id: 'agp_sum_infinity', label: 'Sum to Infinity (S_∞)' },
        { id: 'agp_nth_term', label: 'Find nth Term (Tₙ)' },
        { id: 'agp_finite_sum', label: 'Evaluate Finite Sum (Sₙ)' }
      ],
      defaultAction: 'agp_sum_infinity',
      fields: [
        { id: 'first_a', label: 'Initial a', placeholder: 'e.g. 1', defaultValue: '1' },
        { id: 'diff_d', label: 'AP Difference (d)', placeholder: 'e.g. 1', defaultValue: '1' },
        { id: 'ratio_r', label: 'GP Ratio (r)', placeholder: 'e.g. 0.5', defaultValue: '0.5' }
      ],
      examplePills: [
        { label: 'Standard: a=1, d=1, r=0.5', values: { first_a: '1', diff_d: '1', ratio_r: '0.5' } },
        { label: 'a=2, d=3, r=1/3 (0.333)', values: { first_a: '2', diff_d: '3', ratio_r: '0.33333' } },
        { label: 'a=1, d=2, r=0.25', values: { first_a: '1', diff_d: '2', ratio_r: '0.25' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: Infinite Sum of 1/2 + 2/4 + 3/8 + 4/16 + ...',
        difficulty: 'Basic',
        problem: 'Evaluate the infinite AGP: S = 1(1/2) + 2(1/4) + 3(1/8) + 4(1/16) + ...',
        step1Identify: 'Arithmetic part: 1, 2, 3, 4 (a = 1, d = 1). Geometric part: 1/2, 1/4, 1/8 (r = 1/2).',
        step2Method: 'Use the infinite AGP formula: S_∞ = a / (1 - r) + dr / (1 - r)², with first term a = 1.',
        step3Substitute: 'Notice the series is r · [1 + 2r + 3r² + ...]. For 1 + 2r + 3r²: S_∞ = 1/(1 - 0.5) + (1)(0.5)/(1 - 0.5)².',
        step4Simplify: '1 / 0.5 = 2. (0.5) / (0.25) = 2. Total bracket = 2 + 2 = 4. Multiplied by r = 0.5 gives 2.',
        step5Answer: 'The sum of the infinite series is exactly 2.'
      },
      {
        title: 'Moderately Challenging: General Infinite AGP',
        difficulty: 'Moderately Challenging',
        problem: 'Find the sum to infinity of 2 + 5/3 + 8/9 + 11/27 + ...',
        step1Identify: 'a = 2, d = 3, r = 1/3. Condition |r| = 1/3 < 1 holds.',
        step2Method: 'Apply S_∞ = a / (1 - r) + dr / (1 - r)².',
        step3Substitute: '1 - r = 2/3. First part: 2 / (2/3) = 3. Second part: 3(1/3) / (2/3)² = 1 / (4/9) = 9/4 = 2.25.',
        step4Simplify: 'S_∞ = 3 + 2.25 = 5.25 = 21/4.',
        step5Answer: 'The sum to infinity is 21/4 = 5.25.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_agp_1',
        question: 'What is the sum to infinity of 1 + 2(1/2) + 3(1/4) + 4(1/8) + ...?',
        options: ['4', '2', '3', '∞'],
        correctIndex: 0,
        explanation: 'a = 1, d = 1, r = 1/2. S_∞ = 1/(1 - 0.5) + 1(0.5)/(1 - 0.5)² = 2 + 0.5/0.25 = 2 + 2 = 4.',
        stepByStep: ['1 / 0.5 = 2', '0.5 / 0.25 = 2', '2 + 2 = 4']
      },
      {
        id: 'q_agp_2',
        question: 'Under what condition does an AGP have a finite sum to infinity?',
        options: ['|r| < 1', '|d| < 1', 'a > 0', 'd = 0'],
        correctIndex: 0,
        explanation: 'The geometric ratio determines convergence: |r| must be strictly less than 1.',
        stepByStep: ['Geometric factor controls convergence: |r| < 1']
      }
    ],
    visualType: 'partial_sums'
  },
  {
    id: 'higher_order_diff',
    number: 33,
    group: 'C',
    groupTitle: 'Group C: Special Sequences',
    title: 'Higher-Order Difference Sequences',
    shortDesc: 'Method of successive differences Δᵏ and Newton Gregory polynomials',
    level: 'Advanced',
    definition: 'The Method of Differences analyzes sequences whose higher differences become constant. If the k-th difference Δᵏ is constant, the sequence can be modeled by a polynomial of degree k using Newton\'s Forward Difference Formula: aₙ = ∑_{j=0}^k C(n - 1, j) · Δʲ a₁.',
    formulas: [
      {
        name: 'Newton Forward Difference Interpolation',
        formula: 'aₙ = a₁ + \\binom{n-1}{1} \\Delta a₁ + \\binom{n-1}{2} \\Delta² a₁ + \\binom{n-1}{3} \\Delta³ a₁ + ...',
        description: 'Constructs the exact polynomial of degree k matching the sequence.',
        symbols: [
          { symbol: '\\binom{n-1}{j}', meaning: 'Combinatorial coefficient (n-1)! / [j!(n-1-j)!]' },
          { symbol: '\\Deltaʲ a₁', meaning: 'The j-th forward difference of the first term' }
        ]
      }
    ],
    calculator: {
      questionPrompt: 'Compute higher-order differences and Newton formula:',
      actions: [
        { id: 'diff_table', label: 'Full Difference Table' },
        { id: 'newton_poly', label: 'Construct Newton Polynomial' }
      ],
      defaultAction: 'diff_table',
      fields: [
        { id: 'terms_list', label: 'Sequence Terms', placeholder: 'e.g. 1, 8, 27, 64, 125 or 2, 9, 28, 65', defaultValue: '1, 8, 27, 64, 125' }
      ],
      examplePills: [
        { label: 'Cubic: 1, 8, 27, 64, 125', values: { terms_list: '1, 8, 27, 64, 125' } },
        { label: 'Shifted: 2, 9, 28, 65, 126', values: { terms_list: '2, 9, 28, 65, 126' } },
        { label: 'Quartic: 1, 16, 81, 256, 625', values: { terms_list: '1, 16, 81, 256, 625' } }
      ]
    },
    workedExamples: [
      {
        title: 'Basic Example: 3rd Differences of a Cubic Sequence',
        difficulty: 'Basic',
        problem: 'Show that the sequence 1, 8, 27, 64, 125 has a constant 3rd difference equal to 6.',
        step1Identify: 'Original sequence: 1, 8, 27, 64, 125.',
        step2Method: 'Compute 1st differences: 7, 19, 37, 61. Compute 2nd differences: 12, 18, 24.',
        step3Substitute: 'Compute 3rd differences: 18 - 12 = 6; 24 - 18 = 6.',
        step4Simplify: 'The 3rd differences are constant and equal to 6.',
        step5Answer: 'Constant 3rd difference is 6 = 3! · 1 (consistent with n³).'
      },
      {
        title: 'Moderately Challenging: Newton Polynomial Construction',
        difficulty: 'Moderately Challenging',
        problem: 'Use Newton\'s formula to find the formula for a sequence whose leading differences are a₁ = 3, Δa₁ = 5, Δ²a₁ = 4, Δ³a₁ = 0.',
        step1Identify: 'a₁ = 3, Δa₁ = 5, Δ²a₁ = 4.',
        step2Method: 'aₙ = 3 + (n - 1)(5) + [(n - 1)(n - 2) / 2](4).',
        step3Substitute: '3 + 5n - 5 + 2(n² - 3n + 2) = 5n - 2 + 2n² - 6n + 4.',
        step4Simplify: '2n² - n + 2.',
        step5Answer: 'The formula for the n-th term is aₙ = 2n² - n + 2.'
      }
    ],
    practiceQuestions: [
      {
        id: 'q_hod_1',
        question: 'If the k-th difference of a sequence is non-zero and constant, what is the degree of the polynomial formula?',
        options: ['Degree k', 'Degree k + 1', 'Degree k - 1', 'Degree 2k'],
        correctIndex: 0,
        explanation: 'By the Fundamental Theorem of Calculus of Finite Differences, a degree k polynomial has constant k-th difference equal to k! × a_k.',
        stepByStep: ['Degree matches the order of the constant difference: k.']
      },
      {
        id: 'q_hod_2',
        question: 'What is the 4th difference of any cubic polynomial sequence aₙ = an³ + bn² + cn + d?',
        options: ['0', '6a', '24a', '6'],
        correctIndex: 0,
        explanation: 'Because the 3rd difference is constant, taking one more difference yields 0.',
        stepByStep: ['Δ³ is constant', 'Difference of a constant is 0: Δ⁴ = 0']
      }
    ],
    visualType: 'sequence_plot'
  }
];
