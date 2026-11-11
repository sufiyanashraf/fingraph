export type ToolType =
  | 'basics_analyzer'
  | 'expressions_tool'
  | 'polynomial_tool'
  | 'zero_poly_tool'
  | 'radicals_tool'
  | 'quadratic_tool'
  | 'linear_tool'
  | 'systems_tool'
  | 'inequality_tool'
  | 'sequences_tool'
  | 'functions_tool'
  | 'exponents_logs_tool'
  | 'rational_tool'
  | 'complex_tool'
  | 'matrix_tool';

export interface PracticeQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface FormulaCard {
  title: string;
  formula: string;
  note?: string;
}

export interface RelatedTopicRef {
  majorId: string;
  subtopicId: string;
  label: string;
}

export interface SubtopicData {
  id: string;
  title: string;
  shortDesc: string;
  badge?: string;
  intro: string;
  mathShowcase: string[];
  formulas: FormulaCard[];
  defaultEquation: string;
  defaultEquation2?: string; // For systems of equations
  examples: string[];
  actionLabel: string;
  toolType: ToolType;
  workedExample: {
    problem: string;
    steps: string[];
    finalAnswer: string;
  };
  practice: PracticeQuestion[];
  relatedTopics: RelatedTopicRef[];
}

export interface MajorTopic {
  id: string;
  title: string;
  shortTitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Foundation';
  description: string;
  iconName: string;
  subtopics: SubtopicData[];
}

export const ALGEBRA_TOPICS: MajorTopic[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. ALGEBRA BASICS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'basics',
    title: '1. Algebra Basics',
    shortTitle: 'Basics',
    level: 'Beginner',
    description: 'Symbols, variables, coefficients, like terms, and fundamental arithmetic order.',
    iconName: 'Compass',
    subtopics: [
      {
        id: 'what_is_algebra',
        title: 'What is Algebra?',
        shortDesc: 'Algebra uses symbols and variables to represent unknown or changing values.',
        badge: 'Core Concept',
        intro: 'Algebra replaces specific numbers with letters like x, y, and a to express universal mathematical relationships and solve for unknown values.',
        mathShowcase: ['3x + 5 = 20', '3x', 'x + 7', '2a + 3b'],
        formulas: [
          { title: 'Fundamental Form', formula: 'ax + b = c', note: 'Linear relationship between input and output' },
          { title: 'Equation Balance', formula: 'LHS = RHS', note: 'Equality holds when both sides balance' }
        ],
        defaultEquation: '3x + 5 = 20',
        examples: ['3x + 5 = 20', '2x + 7 = 15', '4x - 8 = 12'],
        actionLabel: 'Solve & Analyze',
        toolType: 'basics_analyzer',
        workedExample: {
          problem: 'Solve for x: 3x + 5 = 20',
          steps: [
            'Subtract 5 from both sides: 3x = 20 - 5 = 15',
            'Divide both sides by the coefficient 3: x = 15 / 3'
          ],
          finalAnswer: 'x = 5'
        },
        practice: [
          {
            question: 'In the equation 4y - 7 = 21, what is the value of y?',
            options: ['y = 5', 'y = 7', 'y = 28', 'y = 3.5'],
            correctIdx: 1,
            explanation: 'Add 7 to both sides (4y = 28), then divide by 4: y = 7.'
          }
        ],
        relatedTopics: [
          { majorId: 'basics', subtopicId: 'variables_constants', label: 'Variables & Constants' },
          { majorId: 'expressions', subtopicId: 'what_is_expression', label: 'Algebraic Expressions' },
          { majorId: 'linear', subtopicId: 'one_variable_linear', label: 'Linear Equations' }
        ]
      },
      {
        id: 'variables_constants',
        title: 'Variables, Constants & Coefficients',
        shortDesc: 'Dissecting algebraic terms into numbers, letters, and multipliers.',
        badge: 'Anatomy',
        intro: 'A variable represents an unknown quantity (e.g. x), a constant is a fixed number, and a coefficient is the numerical factor multiplying a variable.',
        mathShowcase: ['7x² - 3x + 14', 'Coefficient: 7', 'Variable: x', 'Constant: 14'],
        formulas: [
          { title: 'General Term', formula: 'c · xⁿ', note: 'c is coefficient, x is variable, n is power' },
          { title: 'Constant Term', formula: 'c · x⁰ = c', note: 'Variables with power 0 equal 1' }
        ],
        defaultEquation: '7x - 4',
        examples: ['7x - 4', '5x + 3y - 9', '12a - 8'],
        actionLabel: 'Analyze Components',
        toolType: 'basics_analyzer',
        workedExample: {
          problem: 'Identify components in: 5x + 3y - 11',
          steps: [
            'Variables: x and y',
            'Coefficients: 5 (for x) and 3 (for y)',
            'Constant term: -11'
          ],
          finalAnswer: 'Coeffs: [5, 3], Vars: [x, y], Const: -11'
        },
        practice: [
          {
            question: 'What is the coefficient of x in the expression 9 - 4x + 2y?',
            options: ['9', '-4', '4', '2'],
            correctIdx: 1,
            explanation: 'The sign belongs to the term that follows it. The term is -4x, so the coefficient is -4.'
          }
        ],
        relatedTopics: [
          { majorId: 'basics', subtopicId: 'terms_like_terms', label: 'Terms & Like Terms' },
          { majorId: 'expressions', subtopicId: 'combining_like_terms', label: 'Combining Like Terms' }
        ]
      },
      {
        id: 'terms_like_terms',
        title: 'Terms & Like Terms',
        shortDesc: 'Grouping expressions sharing identical variable factors.',
        badge: 'Simplification',
        intro: 'Like terms have the exact same variables raised to the exact same powers. Only like terms can be added or subtracted together.',
        mathShowcase: ['5x + 3x = 8x', '2a + 3b (Unlike)', '4x² + 7x² = 11x²'],
        formulas: [
          { title: 'Addition of Like Terms', formula: 'ax + bx = (a + b)x', note: 'Distributive law in reverse' },
          { title: 'Unlike Terms Rule', formula: 'ax + by', note: 'Cannot be merged into a single term' }
        ],
        defaultEquation: '3x + 2x - 5',
        examples: ['3x + 2x - 5', '5a + 3b - 2a + 4b', '4x^2 + 7x - 2x^2 + 3'],
        actionLabel: 'Group & Simplify',
        toolType: 'basics_analyzer',
        workedExample: {
          problem: 'Simplify: 3x + 7 - x + 4',
          steps: [
            'Group like terms: (3x - x) + (7 + 4)',
            'Combine x-terms: 2x',
            'Combine constants: 11'
          ],
          finalAnswer: '2x + 11'
        },
        practice: [
          {
            question: 'Which of the following pairs are like terms?',
            options: ['3x and 3y', '5x² and 5x', '7xy and -2xy', '4x²y and 4xy²'],
            correctIdx: 2,
            explanation: '7xy and -2xy both have the identical variable factor xy raised to the power 1.'
          }
        ],
        relatedTopics: [
          { majorId: 'expressions', subtopicId: 'combining_like_terms', label: 'Combining Like Terms' },
          { majorId: 'expressions', subtopicId: 'factoring_gcf', label: 'Factoring by GCF' }
        ]
      },
      {
        id: 'order_of_operations',
        title: 'Order of Operations (PEMDAS)',
        shortDesc: 'Parentheses, Exponents, Multiplication/Division, Addition/Subtraction.',
        badge: 'Rule Hierarchy',
        intro: 'Calculations follow a strict universal hierarchy: evaluate parentheses first, then powers, then multiplication and division from left to right, finally addition and subtraction.',
        mathShowcase: ['2 + 3 × 4 = 14', '(2 + 3) × 4 = 20', '3² × 2 - 5 = 13'],
        formulas: [
          { title: 'PEMDAS Rule', formula: 'P → E → MD (L to R) → AS (L to R)', note: 'Order of priority' }
        ],
        defaultEquation: '2 + 3 * 4 - 6 / 2',
        examples: ['2 + 3 * 4 - 6 / 2', '(4 + 2)^2 - 5 * 3', '8 / 2 * (2 + 2)'],
        actionLabel: 'Evaluate with PEMDAS',
        toolType: 'basics_analyzer',
        workedExample: {
          problem: 'Evaluate: 18 - 3 × (4 + 2) ÷ 9',
          steps: [
            'Inside parentheses: 4 + 2 = 6',
            'Multiply: 3 × 6 = 18',
            'Divide: 18 ÷ 9 = 2',
            'Subtract: 18 - 2 = 16'
          ],
          finalAnswer: '16'
        },
        practice: [
          {
            question: 'What is the value of 10 - 2 × 3 + 4?',
            options: ['28', '8', '24', '12'],
            correctIdx: 1,
            explanation: 'Multiply first: 2 × 3 = 6. Then left to right: 10 - 6 = 4; 4 + 4 = 8.'
          }
        ],
        relatedTopics: [
          { majorId: 'basics', subtopicId: 'substitution_eval', label: 'Substitution & Evaluation' }
        ]
      },
      {
        id: 'substitution_eval',
        title: 'Substitution & Evaluation',
        shortDesc: 'Plugging concrete numerical values into algebraic expressions.',
        badge: 'Evaluation',
        intro: 'To evaluate an expression, replace each variable with its given number and calculate the numerical result following PEMDAS.',
        mathShowcase: ['f(x) = 2x² - 3x + 1', 'f(3) = 2(3)² - 3(3) + 1 = 10', 'a = 4, b = -2'],
        formulas: [
          { title: 'Substitution', formula: 'E(x)|_{x=c} = E(c)', note: 'Replace variable symbol with value' }
        ],
        defaultEquation: '2x^2 - 3x + 5',
        examples: ['2x^2 - 3x + 5', '3a - 4b', 'x^2 + y^2'],
        actionLabel: 'Substitute & Evaluate',
        toolType: 'basics_analyzer',
        workedExample: {
          problem: 'Evaluate 3x² - 2x + 7 when x = 4',
          steps: [
            'Substitute 4: 3(4)² - 2(4) + 7',
            'Calculate exponent: 4² = 16',
            'Multiply: 3(16) = 48 and 2(4) = 8',
            'Combine: 48 - 8 + 7 = 47'
          ],
          finalAnswer: '47'
        },
        practice: [
          {
            question: 'If a = 5 and b = -2, what is the value of 2a + 3b?',
            options: ['16', '4', '-4', '10'],
            correctIdx: 1,
            explanation: '2(5) + 3(-2) = 10 - 6 = 4.'
          }
        ],
        relatedTopics: [
          { majorId: 'functions', subtopicId: 'function_evaluation', label: 'Function Evaluation' }
        ]
      },
      {
        id: 'translating_words',
        title: 'Translating Words to Algebra',
        shortDesc: 'Converting English phrases into precise algebraic equations.',
        badge: 'Translation',
        intro: 'Mathematical word problems convert phrases like "sum", "difference", "product", "is equal to" into operators +, -, *, =.',
        mathShowcase: ['"Five more than twice a number" → 2x + 5', '"A number decreased by 7 is 14" → x - 7 = 14'],
        formulas: [
          { title: 'Keywords Guide', formula: 'Sum (+), Less (-), Product (·), Quotient (÷), Is (=)', note: 'Translation vocabulary' }
        ],
        defaultEquation: '2x + 5 = 19',
        examples: ['2x + 5 = 19', '3n - 7 = 20', 'x / 4 + 2 = 9'],
        actionLabel: 'Translate & Solve',
        toolType: 'basics_analyzer',
        workedExample: {
          problem: 'Translate and solve: "Seven less than three times a number is 26."',
          steps: [
            'Let the number be x',
            'Three times the number: 3x',
            'Seven less than 3x: 3x - 7',
            'Equation: 3x - 7 = 26 → 3x = 33 → x = 11'
          ],
          finalAnswer: 'x = 11'
        },
        practice: [
          {
            question: 'Which equation translates: "The product of 4 and a number increased by 6 equals 30"?',
            options: ['4(x + 6) = 30', '4x + 6 = 30', 'x/4 + 6 = 30', '4 + x + 6 = 30'],
            correctIdx: 1,
            explanation: 'Product of 4 and a number is 4x; increased by 6 is 4x + 6; equals 30.'
          }
        ],
        relatedTopics: [
          { majorId: 'linear', subtopicId: 'one_variable_linear', label: 'Linear Equations' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ALGEBRAIC EXPRESSIONS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'expressions',
    title: '2. Algebraic Expressions',
    shortTitle: 'Expressions',
    level: 'Beginner',
    description: 'Expanding, FOIL multiplication, factoring, and standard algebraic identities.',
    iconName: 'Sparkles',
    subtopics: [
      {
        id: 'what_is_expression',
        title: 'What is an Expression?',
        shortDesc: 'Mathematical phrases containing variables, numbers, and operators without an equals sign.',
        badge: 'Foundation',
        intro: 'An algebraic expression is a combination of variables, constants, and operations. Unlike equations, expressions cannot be solved for a single value—they can only be simplified, expanded, or factored.',
        mathShowcase: ['3x² + 5x - 8', '(a + b)²', '2x(x - 4)', '7a - 3b + 2'],
        formulas: [
          { title: 'Expression vs Equation', formula: 'Expression: 2x + 5  |  Equation: 2x + 5 = 15', note: 'Equations have an equals sign' }
        ],
        defaultEquation: '3x^2 + 5x - 8',
        examples: ['3x^2 + 5x - 8', '2x(x - 4)', 'x^2 - 9'],
        actionLabel: 'Simplify / Analyze',
        toolType: 'expressions_tool',
        workedExample: {
          problem: 'Simplify: 4(2x - 3) + 5x',
          steps: [
            'Distribute 4: 8x - 12 + 5x',
            'Combine like terms: (8x + 5x) - 12',
            'Final simplified form: 13x - 12'
          ],
          finalAnswer: '13x - 12'
        },
        practice: [
          {
            question: 'What is 3(x + 4) - 2x simplified?',
            options: ['x + 12', '5x + 12', 'x + 4', 'x + 7'],
            correctIdx: 0,
            explanation: 'Distribute: 3x + 12 - 2x = x + 12.'
          }
        ],
        relatedTopics: [
          { majorId: 'expressions', subtopicId: 'expanding_foil', label: 'Expanding & FOIL' },
          { majorId: 'expressions', subtopicId: 'algebraic_identities', label: 'Algebraic Identities' }
        ]
      },
      {
        id: 'combining_like_terms',
        title: 'Combining Like Terms',
        shortDesc: 'Simplifying multi-variable expressions by collecting terms with matching powers.',
        badge: 'Core Skill',
        intro: 'Add or subtract coefficients of terms with identical variable factors to reduce expressions to their cleanest possible form.',
        mathShowcase: ['4x + 7x = 11x', '3a² + 5a² - 2a² = 6a²', '5xy - 2xy = 3xy'],
        formulas: [
          { title: 'Combination Rule', formula: 'c₁xⁿ + c₂xⁿ = (c₁ + c₂)xⁿ', note: 'Exponents remain unchanged' }
        ],
        defaultEquation: '5x + 3x - 2x + 8',
        examples: ['5x + 3x - 2x + 8', '4a^2 - 2a + 3a^2 + 7a', '3xy + 2x - xy + 5x'],
        actionLabel: 'Combine Like Terms',
        toolType: 'expressions_tool',
        workedExample: {
          problem: 'Simplify: 4x² + 7x - 2x² + 3 - 5x',
          steps: [
            'Group x² terms: (4x² - 2x²) = 2x²',
            'Group x terms: (7x - 5x) = 2x',
            'Group constants: +3'
          ],
          finalAnswer: '2x² + 2x + 3'
        },
        practice: [
          {
            question: 'Combine like terms: 8x - 3 + 2x - 5',
            options: ['10x - 8', '6x - 8', '10x + 2', '16x - 15'],
            correctIdx: 0,
            explanation: '(8x + 2x) + (-3 - 5) = 10x - 8.'
          }
        ],
        relatedTopics: [
          { majorId: 'expressions', subtopicId: 'expanding_foil', label: 'Expanding & FOIL' }
        ]
      },
      {
        id: 'expanding_foil',
        title: 'Expanding Expressions & FOIL',
        shortDesc: 'First, Outer, Inner, Last method for multiplying binomials.',
        badge: 'Multiplication',
        intro: 'To multiply two binomials (a + b)(c + d), use the FOIL mnemonic: First terms (ac), Outer terms (ad), Inner terms (bc), Last terms (bd).',
        mathShowcase: ['(x + 3)(x - 4)', '= x² - 4x + 3x - 12', '= x² - x - 12'],
        formulas: [
          { title: 'FOIL Identity', formula: '(a + b)(c + d) = ac + ad + bc + bd', note: 'Distribute each term across both' }
        ],
        defaultEquation: '(x + 3)(x - 5)',
        examples: ['(x + 3)(x - 5)', '(2x + 1)(x - 4)', '(x + 6)(x + 6)'],
        actionLabel: 'Expand with FOIL',
        toolType: 'expressions_tool',
        workedExample: {
          problem: 'Expand: (2x + 3)(x - 5)',
          steps: [
            'First: 2x · x = 2x²',
            'Outer: 2x · (-5) = -10x',
            'Inner: 3 · x = 3x',
            'Last: 3 · (-5) = -15',
            'Combine inner/outer: -10x + 3x = -7x'
          ],
          finalAnswer: '2x² - 7x - 15'
        },
        practice: [
          {
            question: 'What is (x - 4)(x + 7) expanded?',
            options: ['x² + 3x - 28', 'x² - 3x - 28', 'x² + 11x - 28', 'x² - 28'],
            correctIdx: 0,
            explanation: 'x² + 7x - 4x - 28 = x² + 3x - 28.'
          }
        ],
        relatedTopics: [
          { majorId: 'expressions', subtopicId: 'algebraic_identities', label: 'Algebraic Identities' },
          { majorId: 'quadratics', subtopicId: 'quad_factoring', label: 'Factoring Quadratics' }
        ]
      },
      {
        id: 'algebraic_identities',
        title: 'Standard Algebraic Identities',
        shortDesc: 'Square of sums, differences, difference of squares, and sum/difference of cubes.',
        badge: 'Key Formulas',
        intro: 'Identities are equations that hold true for every possible numerical value. Memorizing these essential patterns accelerates algebra and calculus computations.',
        mathShowcase: ['(a + b)² = a² + 2ab + b²', '(a - b)² = a² - 2ab + b²', 'a² - b² = (a - b)(a + b)'],
        formulas: [
          { title: 'Square of Sum', formula: '(a + b)² = a² + 2ab + b²', note: 'Perfect square trinomial' },
          { title: 'Square of Difference', formula: '(a - b)² = a² - 2ab + b²', note: 'Middle sign is negative' },
          { title: 'Difference of Squares', formula: 'a² - b² = (a - b)(a + b)', note: 'No middle term' },
          { title: 'Sum of Cubes', formula: 'a³ + b³ = (a + b)(a² - ab + b²)', note: 'Cubic identity' },
          { title: 'Difference of Cubes', formula: 'a³ - b³ = (a - b)(a² + ab + b²)', note: 'Cubic identity' }
        ],
        defaultEquation: '(x + 4)^2',
        examples: ['(x + 4)^2', '(2x - 3)^2', 'x^2 - 16'],
        actionLabel: 'Apply Identity',
        toolType: 'expressions_tool',
        workedExample: {
          problem: 'Expand: (3x - 4)²',
          steps: [
            'Use (a - b)² = a² - 2ab + b² with a = 3x, b = 4',
            'a² = (3x)² = 9x²',
            '2ab = 2(3x)(4) = 24x',
            'b² = 4² = 16'
          ],
          finalAnswer: '9x² - 24x + 16'
        },
        practice: [
          {
            question: 'Factor x² - 49:',
            options: ['(x - 7)(x + 7)', '(x - 7)²', '(x + 7)²', '(x - 49)(x + 1)'],
            correctIdx: 0,
            explanation: 'Difference of squares: a² - b² = (a - b)(a + b) with a = x, b = 7.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'quad_factoring', label: 'Quadratic Factoring' }
        ]
      },
      {
        id: 'factoring_gcf',
        title: 'Factoring by GCF',
        shortDesc: 'Extracting the Greatest Common Factor shared across all terms.',
        badge: 'Factoring',
        intro: 'The first step of all factoring is identifying the greatest number and variable power that divides evenly into every term in the expression.',
        mathShowcase: ['6x² + 9x = 3x(2x + 3)', '4a³b - 8ab² = 4ab(a² - 2b)'],
        formulas: [
          { title: 'GCF Rule', formula: 'ab + ac = a(b + c)', note: 'Reverses the distributive law' }
        ],
        defaultEquation: '6x^2 + 9x',
        examples: ['6x^2 + 9x', '12x^3 - 18x^2 + 6x', '4a^2b + 8ab^2'],
        actionLabel: 'Factor by GCF',
        toolType: 'expressions_tool',
        workedExample: {
          problem: 'Factor: 12x³ - 18x²',
          steps: [
            'Find GCF of numbers: gcd(12, 18) = 6',
            'Find GCF of variable powers: min(x³, x²) = x²',
            'Factor out 6x²: 6x²(2x - 3)'
          ],
          finalAnswer: '6x²(2x - 3)'
        },
        practice: [
          {
            question: 'What is the GCF of 15x⁴ and 25x²?',
            options: ['5x²', '5x⁴', '15x²', '75x⁴'],
            correctIdx: 0,
            explanation: 'gcd(15, 25) = 5, and lowest power of x is x².'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_factoring', label: 'Polynomial Factoring' }
        ]
      },
      {
        id: 'factoring_grouping',
        title: 'Factoring by Grouping',
        shortDesc: 'Factoring four-term expressions by grouping pairs with common binomial factors.',
        badge: 'Technique',
        intro: 'When an expression has four terms, pair them into two sets of two, pull out each pair\'s GCF, and factor out the common binomial.',
        mathShowcase: ['x³ + 3x² + 2x + 6', '= x²(x + 3) + 2(x + 3)', '= (x + 3)(x² + 2)'],
        formulas: [
          { title: 'Grouping Pattern', formula: 'ax + ay + bx + by = a(x + y) + b(x + y) = (x + y)(a + b)', note: 'Four-term factorization' }
        ],
        defaultEquation: 'x^3 + 3x^2 + 2x + 6',
        examples: ['x^3 + 3x^2 + 2x + 6', '2x^3 - 4x^2 + 3x - 6', 'x^3 - x^2 + x - 1'],
        actionLabel: 'Factor by Grouping',
        toolType: 'expressions_tool',
        workedExample: {
          problem: 'Factor: 2x³ - 4x² + 3x - 6',
          steps: [
            'Group pairs: (2x³ - 4x²) + (3x - 6)',
            'Factor first pair: 2x²(x - 2)',
            'Factor second pair: 3(x - 2)',
            'Factor out common binomial (x - 2): (x - 2)(2x² + 3)'
          ],
          finalAnswer: '(x - 2)(2x² + 3)'
        },
        practice: [
          {
            question: 'Factor x³ + 5x² + 2x + 10:',
            options: ['(x + 5)(x² + 2)', '(x + 2)(x² + 5)', '(x + 10)(x² + 1)', '(x - 5)(x² - 2)'],
            correctIdx: 0,
            explanation: 'x²(x + 5) + 2(x + 5) = (x + 5)(x² + 2).'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_factoring', label: 'Polynomial Factoring' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. POLYNOMIALS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'polynomials',
    title: '3. Polynomials',
    shortTitle: 'Polynomials',
    level: 'Intermediate',
    description: 'Degrees, terms, zero polynomial, synthetic division, zeros, and remainder theorem.',
    iconName: 'Target',
    subtopics: [
      {
        id: 'what_is_polynomial',
        title: 'What is a Polynomial?',
        shortDesc: 'A sum of terms with non-negative integer powers of variables.',
        badge: 'Foundation',
        intro: 'A polynomial is an expression consisting of variables and coefficients combined using addition, subtraction, and multiplication, where variable exponents must be whole numbers (0, 1, 2, ...).',
        mathShowcase: ['P(x) = 2x³ - 5x² + 3x - 7', 'Exponents ≥ 0', 'Coefficients ∈ ℝ'],
        formulas: [
          { title: 'Standard Form', formula: 'P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀', note: 'Terms ordered by descending degree' }
        ],
        defaultEquation: '2x^3 - 5x^2 + 3x - 7',
        examples: ['2x^3 - 5x^2 + 3x - 7', '4x^4 - 2x^2 + 1', 'x^3 - 4x + 3'],
        actionLabel: 'Analyze Polynomial',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Analyze P(x) = 3x⁴ - 5x² + 7x - 2',
          steps: [
            'Degree: 4 (highest power of x)',
            'Leading coefficient: 3',
            'Constant term: -2',
            'Classification: Quartic polynomial'
          ],
          finalAnswer: 'Degree 4, Leading coeff 3, Constant -2'
        },
        practice: [
          {
            question: 'Which of the following is NOT a polynomial?',
            options: ['3x² - 5x + 1', '4x³ + 2/x - 7', 'x⁵ - 9', '12'],
            correctIdx: 1,
            explanation: '2/x = 2x⁻¹ has a negative exponent, which violates the definition of a polynomial.'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_degree', label: 'Degree of Polynomial' },
          { majorId: 'polynomials', subtopicId: 'zero_polynomial', label: 'Zero Polynomial' }
        ]
      },
      {
        id: 'poly_terms_coeff',
        title: 'Terms & Coefficients',
        shortDesc: 'Individual monomial components that sum together to build the polynomial.',
        badge: 'Components',
        intro: 'Each term in a polynomial is a product of a number and variable powers. The leading term has the highest power, while the constant term has power zero.',
        mathShowcase: ['P(x) = 4x³ - 7x² + x - 9', 'Leading Term: 4x³', 'Constant: -9'],
        formulas: [
          { title: 'Leading Coefficient', formula: 'aₙ (where n = deg(P))', note: 'Determines end-behavior of graph' }
        ],
        defaultEquation: '4x^3 - 7x^2 + x - 9',
        examples: ['4x^3 - 7x^2 + x - 9', '5x^2 - 12', 'x^4 - 3x^3 + 2x - 5'],
        actionLabel: 'Extract Terms',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Find terms and coefficients for 5x³ - 2x + 8',
          steps: [
            'x³ term: 5x³ (coeff: 5)',
            'x² term: 0x² (coeff: 0)',
            'x term: -2x (coeff: -2)',
            'Constant: 8'
          ],
          finalAnswer: 'Coeffs: [5, 0, -2, 8]'
        },
        practice: [
          {
            question: 'What is the coefficient of x² in P(x) = 2x³ + 7x - 4?',
            options: ['0', '2', '7', '-4'],
            correctIdx: 0,
            explanation: 'Since there is no x² term written, its coefficient is 0 (0x²).'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_degree', label: 'Degree of Polynomial' }
        ]
      },
      {
        id: 'poly_degree',
        title: 'Degree of a Polynomial',
        shortDesc: 'The highest exponent of the variable appearing in the polynomial.',
        badge: 'Classification',
        intro: 'The degree of a polynomial dictates the maximum number of real roots it can possess and determines its long-term geometric end behavior.',
        mathShowcase: ['deg(5x³ - 2x + 1) = 3', 'deg(7) = 0 (Constant)', 'deg(0) = Undefined / -∞'],
        formulas: [
          { title: 'Degree Classification', formula: '1: Linear, 2: Quadratic, 3: Cubic, 4: Quartic, 5: Quintic', note: 'Names by degree' }
        ],
        defaultEquation: '6x^4 - 2x^3 + 5x - 1',
        examples: ['6x^4 - 2x^3 + 5x - 1', 'x^3 - 8', '2x + 7'],
        actionLabel: 'Find Degree & Behavior',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Determine degree and name of P(x) = -4x⁵ + 3x² - 1',
          steps: [
            'Highest power of x is 5',
            'Degree = 5',
            'Name: Quintic polynomial'
          ],
          finalAnswer: 'Degree 5 (Quintic)'
        },
        practice: [
          {
            question: 'What is the degree of the constant polynomial P(x) = 19?',
            options: ['0', '1', '19', 'Undefined'],
            correctIdx: 0,
            explanation: '19 can be written as 19x⁰, so any non-zero constant polynomial has degree 0.'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'zero_polynomial', label: 'Zero Polynomial' }
        ]
      },
      {
        id: 'poly_types',
        title: 'Types of Polynomials',
        shortDesc: 'Monomial (1 term), Binomial (2 terms), Trinomial (3 terms), and Multinomial.',
        badge: 'Taxonomy',
        intro: 'Polynomials are classified by their number of terms: a monomial has 1 term, a binomial has 2 terms, and a trinomial has 3 terms.',
        mathShowcase: ['Monomial: 5x³', 'Binomial: 2x - 7', 'Trinomial: x² - 5x + 6'],
        formulas: [
          { title: 'Count Classification', formula: '1: Monomial | 2: Binomial | 3: Trinomial | 4+: Multinomial', note: 'Count after combining like terms' }
        ],
        defaultEquation: 'x^2 - 5x + 6',
        examples: ['x^2 - 5x + 6', '3x^4', '2x - 9'],
        actionLabel: 'Classify Type',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Classify 4x² + 7x - 2x² + 5',
          steps: [
            'First combine like terms: (4x² - 2x²) + 7x + 5 = 2x² + 7x + 5',
            'Count simplified terms: 3 terms',
            'Classification: Trinomial (specifically a quadratic trinomial)'
          ],
          finalAnswer: 'Quadratic Trinomial (3 terms)'
        },
        practice: [
          {
            question: 'What type of polynomial is 7x³ - 4x?',
            options: ['Monomial', 'Binomial', 'Trinomial', 'Quadratic'],
            correctIdx: 1,
            explanation: 'It contains exactly two non-zero terms (7x³ and -4x), making it a binomial.'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_factoring', label: 'Factoring Polynomials' }
        ]
      },
      {
        id: 'zero_polynomial',
        title: 'The Zero Polynomial (P(x) = 0)',
        shortDesc: 'The unique polynomial where every coefficient is identically zero.',
        badge: 'Special Object',
        intro: 'The Zero Polynomial is P(x) = 0. Unlike non-zero constants which have degree 0, the zero polynomial has undefined degree (or -∞) because it has no non-zero leading coefficient.',
        mathShowcase: ['P(x) = 0', 'deg(P) = Undefined (or -∞)', '∀ c ∈ ℝ: P(c) = 0 (Every number is a root!)'],
        formulas: [
          { title: 'Definition', formula: 'P(x) = 0 · xⁿ + ... + 0 · x + 0 = 0', note: 'All coefficients vanish' },
          { title: 'Degree Property', formula: 'deg(P) = undefined / -∞', note: 'Non-zero constant c has deg 0, but 0 is undefined' },
          { title: 'Roots Property', formula: 'P(x) = 0 for ALL x', note: 'Possesses infinitely many roots' }
        ],
        defaultEquation: 'P(x) = 0',
        examples: ['P(x) = 0', '0x^2 + 0x + 0', 'P(x) = 0*x^3'],
        actionLabel: 'Inspect Zero Polynomial',
        toolType: 'zero_poly_tool',
        workedExample: {
          problem: 'Why is the degree of P(x) = 0 not 0?',
          steps: [
            'A polynomial with degree 0 is P(x) = c where c ≠ 0 (e.g. P(x) = 5 = 5x⁰)',
            'If P(x) = 0, we could write 0 = 0x⁰ = 0x¹ = 0x¹⁰⁰...',
            'Because no single power is the highest, the degree cannot be assigned a non-negative integer',
            'Mathematicians define deg(0) = undefined or -∞ to preserve deg(P·Q) = deg(P) + deg(Q)'
          ],
          finalAnswer: 'Degree is Undefined (or -∞)'
        },
        practice: [
          {
            question: 'How many roots does the Zero Polynomial P(x) = 0 possess?',
            options: ['0 roots', '1 root (x = 0)', 'Infinitely many roots', 'Undefined'],
            correctIdx: 2,
            explanation: 'Every real number c satisfies P(c) = 0, so every number is a root.'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_degree', label: 'Degree of Polynomial' },
          { majorId: 'polynomials', subtopicId: 'poly_zeros', label: 'Zeros & Roots' }
        ]
      },
      {
        id: 'poly_operations',
        title: 'Polynomial Operations',
        shortDesc: 'Adding, subtracting, and multiplying polynomials.',
        badge: 'Arithmetic',
        intro: 'Polynomials form an algebraic ring: adding or subtracting combines like coefficients, while multiplying requires distributing every term of one polynomial into the other.',
        mathShowcase: ['(2x² + 3x) + (x² - 5x) = 3x² - 2x', '(x + 2)(x² - 3x + 1) = x³ - x² - 5x + 2'],
        formulas: [
          { title: 'Degree of Product', formula: 'deg(P · Q) = deg(P) + deg(Q)', note: 'Degrees add under multiplication' }
        ],
        defaultEquation: '(x^2 + 2x - 1) + (2x^2 - 3x + 4)',
        examples: ['(x^2 + 2x - 1) + (2x^2 - 3x + 4)', '(x + 2)(x^2 - 3x + 1)', '(3x^2 - 4) - (x^2 + 2x)'],
        actionLabel: 'Perform Operation',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Multiply (x + 3)(x² - 2x + 4)',
          steps: [
            'Distribute x: x(x² - 2x + 4) = x³ - 2x² + 4x',
            'Distribute 3: 3(x² - 2x + 4) = 3x² - 6x + 12',
            'Combine like terms: x³ + (-2x² + 3x²) + (4x - 6x) + 12'
          ],
          finalAnswer: 'x³ + x² - 2x + 12'
        },
        practice: [
          {
            question: 'If deg(P) = 3 and deg(Q) = 2, what is deg(P · Q)?',
            options: ['6', '5', '3', '1'],
            correctIdx: 1,
            explanation: 'When polynomials multiply, degrees add: 3 + 2 = 5.'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_factoring', label: 'Factoring Polynomials' }
        ]
      },
      {
        id: 'poly_factoring',
        title: 'Factoring Polynomials',
        shortDesc: 'Breaking higher-degree polynomials into products of irreducible factors.',
        badge: 'Techniques',
        intro: 'Factoring polynomials enables finding their roots, solving polynomial equations P(x) = 0, and simplifying rational fractions.',
        mathShowcase: ['x³ - 4x = x(x - 2)(x + 2)', 'x³ - 8 = (x - 2)(x² + 2x + 4)'],
        formulas: [
          { title: 'Difference of Cubes', formula: 'x³ - a³ = (x - a)(x² + ax + a²)', note: 'SOAP signs: Same, Opposite, Always Positive' }
        ],
        defaultEquation: 'x^3 - 4x',
        examples: ['x^3 - 4x', 'x^3 - 8', 'x^3 + 2x^2 - x - 2'],
        actionLabel: 'Factor Polynomial',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Factor: x³ + 2x² - x - 2',
          steps: [
            'Group terms: (x³ + 2x²) - (x + 2)',
            'Factor pairs: x²(x + 2) - 1(x + 2)',
            'Factor common binomial: (x + 2)(x² - 1)',
            'Factor difference of squares: (x + 2)(x - 1)(x + 1)'
          ],
          finalAnswer: '(x + 2)(x - 1)(x + 1)'
        },
        practice: [
          {
            question: 'Factor x³ - 27:',
            options: ['(x - 3)(x² + 3x + 9)', '(x - 3)³', '(x - 3)(x² - 3x + 9)', '(x + 3)(x² - 3x + 9)'],
            correctIdx: 0,
            explanation: 'Difference of cubes with a = x, b = 3: (x - 3)(x² + 3x + 9).'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_zeros', label: 'Zeros & Roots' }
        ]
      },
      {
        id: 'poly_division',
        title: 'Polynomial Division',
        shortDesc: 'Long division of polynomials: P(x) = D(x) · Q(x) + R(x).',
        badge: 'Division Algorithm',
        intro: 'Polynomial long division divides a dividend P(x) by a divisor D(x), producing a quotient Q(x) and a remainder R(x) where deg(R) < deg(D).',
        mathShowcase: ['P(x) = D(x) · Q(x) + R(x)', 'deg(R) < deg(D)', '(2x² + 5x + 3) ÷ (x + 1) = 2x + 3'],
        formulas: [
          { title: 'Division Algorithm', formula: 'P(x) / D(x) = Q(x) + R(x) / D(x)', note: 'Quotient plus remainder over divisor' }
        ],
        defaultEquation: '(x^2 + 5x + 6) / (x + 2)',
        examples: ['(x^2 + 5x + 6) / (x + 2)', '(2x^3 - 3x^2 + 4x - 5) / (x - 2)'],
        actionLabel: 'Divide Polynomials',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Divide (x² + 7x + 12) by (x + 3)',
          steps: [
            'Divide leading terms: x² / x = x',
            'Multiply divisor by x: x(x + 3) = x² + 3x',
            'Subtract: (x² + 7x) - (x² + 3x) = 4x + 12',
            'Divide leading terms: 4x / x = 4',
            'Multiply and subtract: 4(x + 3) = 4x + 12 → Remainder = 0'
          ],
          finalAnswer: 'Quotient: x + 4, Remainder: 0'
        },
        practice: [
          {
            question: 'What is the remainder when x² + 4 is divided by x - 2?',
            options: ['8', '0', '4', '-8'],
            correctIdx: 0,
            explanation: 'By Remainder Theorem, R = P(2) = 2² + 4 = 8.'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'synthetic_division', label: 'Synthetic Division' }
        ]
      },
      {
        id: 'synthetic_division',
        title: 'Synthetic Division & Remainder Theorem',
        shortDesc: 'A rapid numerical shortcut to divide polynomials by linear binomials (x - c).',
        badge: 'Shortcut',
        intro: 'Synthetic division bypasses variable writing by operating only on numerical coefficients. The final bottom number is the remainder P(c).',
        mathShowcase: ['Divide by (x - c)', 'Remainder = P(c)', 'Factor if Remainder = 0'],
        formulas: [
          { title: 'Remainder Theorem', formula: 'P(c) = R', note: 'Remainder equals polynomial evaluated at c' },
          { title: 'Factor Theorem', formula: '(x - c) divides P(x) ⟺ P(c) = 0', note: 'c is a root if and only if remainder is 0' }
        ],
        defaultEquation: '2x^3 - 3x^2 - 11x + 6',
        examples: ['2x^3 - 3x^2 - 11x + 6', 'x^3 - 4x^2 + 2x - 5', 'x^4 - 1'],
        actionLabel: 'Run Synthetic Division',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Test if (x - 3) is a factor of P(x) = x³ - 4x² + x + 6',
          steps: [
            'Set c = 3 (since divisor is x - 3)',
            'Evaluate P(3) using Remainder Theorem:',
            'P(3) = 3³ - 4(3)² + 3 + 6 = 27 - 36 + 3 + 6 = 0',
            'Since remainder is 0, (x - 3) is a factor'
          ],
          finalAnswer: 'P(3) = 0 → (x - 3) is a factor!'
        },
        practice: [
          {
            question: 'If P(x) = x³ - 2x² + k and (x - 1) is a factor, what is k?',
            options: ['1', '-1', '2', '0'],
            correctIdx: 0,
            explanation: 'Factor Theorem requires P(1) = 0: 1³ - 2(1)² + k = 0 → 1 - 2 + k = 0 → k = 1.'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_zeros', label: 'Zeros & Roots' }
        ]
      },
      {
        id: 'poly_zeros',
        title: 'Zeros & Roots',
        shortDesc: 'The x-intercepts where P(x) = 0.',
        badge: 'Roots',
        intro: 'A zero or root of a polynomial is a value r such that P(r) = 0. By the Fundamental Theorem of Algebra, a degree-n polynomial has exactly n roots (counting multiplicity and complex roots).',
        mathShowcase: ['P(r) = 0', 'Graph crosses x-axis at (r, 0)', 'n roots for degree n'],
        formulas: [
          { title: 'Fundamental Theorem', formula: 'P(x) has n complex roots', note: 'Every polynomial of degree n factors completely' }
        ],
        defaultEquation: 'x^3 - 4x^2 + x + 6 = 0',
        examples: ['x^3 - 4x^2 + x + 6 = 0', 'x^3 - 6x^2 + 11x - 6 = 0', 'x^2 - 9 = 0'],
        actionLabel: 'Find Roots',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Find roots of P(x) = x³ - 3x² - 4x + 12',
          steps: [
            'Factor by grouping: x²(x - 3) - 4(x - 3) = 0',
            '(x - 3)(x² - 4) = 0',
            '(x - 3)(x - 2)(x + 2) = 0',
            'Set each factor to zero: x = 3, x = 2, x = -2'
          ],
          finalAnswer: 'x = {-2, 2, 3}'
        },
        practice: [
          {
            question: 'What is the maximum number of real roots a degree-4 polynomial can have?',
            options: ['4', '3', '5', 'Infinite'],
            correctIdx: 0,
            explanation: 'A degree-n polynomial can have at most n real roots.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'quad_roots_zeros', label: 'Quadratic Roots' }
        ]
      },
      {
        id: 'remainder_factor_theorem',
        title: 'Remainder & Factor Theorems',
        shortDesc: 'P(c) equals the division remainder; c is a root iff P(c) = 0.',
        badge: 'Theorems',
        intro: 'The Remainder Theorem provides an instant way to evaluate polynomial values, while the Factor Theorem connects polynomial zeros to linear factors.',
        mathShowcase: ['P(x) = (x - c)Q(x) + P(c)', 'P(c) = 0 ⟺ (x - c) is a factor'],
        formulas: [
          { title: 'Remainder Theorem', formula: 'Remainder when divided by (x - c) is P(c)' },
          { title: 'Factor Theorem', formula: '(x - c) divides P(x) ⟺ P(c) = 0' }
        ],
        defaultEquation: 'x^3 - 2x^2 - 5x + 6',
        examples: ['x^3 - 2x^2 - 5x + 6', 'x^4 - 16', '2x^3 + 3x^2 - 8x + 3'],
        actionLabel: 'Apply Factor Theorem',
        toolType: 'polynomial_tool',
        workedExample: {
          problem: 'Find the remainder when P(x) = 2x³ - 5x + 4 is divided by (x - 2)',
          steps: [
            'Set c = 2',
            'Calculate P(2): 2(2)³ - 5(2) + 4',
            '= 2(8) - 10 + 4 = 16 - 10 + 4 = 10',
            'The remainder is 10'
          ],
          finalAnswer: 'Remainder = 10'
        },
        practice: [
          {
            question: 'If P(-3) = 0, which of the following is guaranteed to be a factor of P(x)?',
            options: ['x + 3', 'x - 3', 'x', '3x'],
            correctIdx: 0,
            explanation: 'Since c = -3 is a zero, the factor is (x - c) = (x - (-3)) = (x + 3).'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'synthetic_division', label: 'Synthetic Division' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ROOTS AND RADICALS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'roots',
    title: '4. Roots and Radicals',
    shortTitle: 'Radicals',
    level: 'Intermediate',
    description: 'Simplifying radicals, square & higher roots, rationalizing denominators, and solving.',
    iconName: 'Sparkles',
    subtopics: [
      {
        id: 'what_is_radical',
        title: 'What is a Radical?',
        shortDesc: 'The inverse operation of exponentiation: ⁿ√x.',
        badge: 'Basics',
        intro: 'A radical expression represents the root of a number. The symbol √ is the radical, the number inside is the radicand, and the index n specifies which root is taken.',
        mathShowcase: ['√25 = 5', '∛27 = 3', '√(x²) = |x|', 'ⁿ√x = x^(1/n)'],
        formulas: [
          { title: 'Radical to Exponent', formula: 'ⁿ√x = x^(1/n)', note: 'Fractional exponent equivalence' },
          { title: 'Even Root Principal', formula: '√(x²) = |x|', note: 'Principal square root is non-negative' }
        ],
        defaultEquation: 'sqrt(64)',
        examples: ['sqrt(64)', 'cbrt(125)', 'sqrt(x^2)'],
        actionLabel: 'Evaluate Radical',
        toolType: 'radicals_tool',
        workedExample: {
          problem: 'Evaluate ∛(-64)',
          steps: [
            'Find a number whose cube is -64: (-4)³ = -64',
            'Odd roots of negative numbers are real and negative'
          ],
          finalAnswer: '-4'
        },
        practice: [
          {
            question: 'What is the value of ∜81?',
            options: ['3', '9', '27', '81'],
            correctIdx: 0,
            explanation: '3⁴ = 81, so ∜81 = 3.'
          }
        ],
        relatedTopics: [
          { majorId: 'roots', subtopicId: 'simplifying_radicals', label: 'Simplifying Radicals' },
          { majorId: 'exponents_logs', subtopicId: 'laws_of_exponents', label: 'Laws of Exponents' }
        ]
      },
      {
        id: 'simplifying_radicals',
        title: 'Simplifying Radicals',
        shortDesc: 'Extracting largest perfect squares or cubes from under the radical symbol.',
        badge: 'Core Skill',
        intro: 'To simplify √n, factor n into a product containing its largest perfect square factor a², then extract a outside the root: √(a²b) = a√b.',
        mathShowcase: ['√72 = √(36 · 2) = 6√2', '√50 = 5√2', '√48 = 4√3'],
        formulas: [
          { title: 'Product Property', formula: '√(a · b) = √a · √b', note: 'Valid for non-negative real numbers' },
          { title: 'Quotient Property', formula: '√(a / b) = √a / √b', note: 'b > 0' }
        ],
        defaultEquation: 'sqrt(72)',
        examples: ['sqrt(72)', 'sqrt(50)', 'sqrt(108)', 'sqrt(200)'],
        actionLabel: 'Simplify Radical',
        toolType: 'radicals_tool',
        workedExample: {
          problem: 'Simplify √108',
          steps: [
            'Find largest perfect square dividing 108: 36 (since 36 · 3 = 108)',
            'Break into factors: √(36 · 3)',
            'Apply product rule: √36 · √3 = 6√3'
          ],
          finalAnswer: '6√3'
        },
        practice: [
          {
            question: 'What is √75 simplified?',
            options: ['5√3', '3√5', '15√5', '25√3'],
            correctIdx: 0,
            explanation: '75 = 25 · 3, so √75 = √25 · √3 = 5√3.'
          }
        ],
        relatedTopics: [
          { majorId: 'roots', subtopicId: 'rationalizing_denominator', label: 'Rationalizing Denominators' }
        ]
      },
      {
        id: 'radical_operations',
        title: 'Operations with Radicals',
        shortDesc: 'Adding, subtracting, and multiplying radical terms.',
        badge: 'Operations',
        intro: 'Only like radicals (same index and same radicand) can be combined by adding or subtracting their coefficients: 3√5 + 2√5 = 5√5.',
        mathShowcase: ['3√5 + 2√5 = 5√5', '√2 · √8 = √16 = 4', '(√3 + 1)(√3 - 1) = 2'],
        formulas: [
          { title: 'Addition of Like Radicals', formula: 'a√x + b√x = (a + b)√x', note: 'Like radicals combine like terms' },
          { title: 'Multiplication', formula: '√a · √b = √(ab)', note: 'Radicands multiply' }
        ],
        defaultEquation: '3*sqrt(5) + 2*sqrt(5)',
        examples: ['3*sqrt(5) + 2*sqrt(5)', 'sqrt(12) + sqrt(27)', 'sqrt(2) * sqrt(8)'],
        actionLabel: 'Combine Radicals',
        toolType: 'radicals_tool',
        workedExample: {
          problem: 'Simplify: √12 + √27',
          steps: [
            'Simplify √12: √(4 · 3) = 2√3',
            'Simplify √27: √(9 · 3) = 3√3',
            'Combine like radicals: 2√3 + 3√3 = 5√3'
          ],
          finalAnswer: '5√3'
        },
        practice: [
          {
            question: 'What is 4√2 - √18?',
            options: ['√2', '3√2', '-√2', '4√2 - 3'],
            correctIdx: 0,
            explanation: '√18 = 3√2, so 4√2 - 3√2 = 1√2 = √2.'
          }
        ],
        relatedTopics: [
          { majorId: 'roots', subtopicId: 'simplifying_radicals', label: 'Simplifying Radicals' }
        ]
      },
      {
        id: 'rationalizing_denominator',
        title: 'Rationalizing the Denominator',
        shortDesc: 'Eliminating radicals from denominators by multiplying by roots or conjugates.',
        badge: 'Standardization',
        intro: 'Mathematical convention requires that denominators not contain radicals. For a monomial denominator √b, multiply top and bottom by √b. For a binomial a + √b, multiply by its conjugate a - √b.',
        mathShowcase: ['1 / √2 = √2 / 2', '3 / √5 = 3√5 / 5', '1 / (2 + √3) = 2 - √3'],
        formulas: [
          { title: 'Single Radical Rule', formula: 'a / √b = (a√b) / b', note: 'Multiply numerator and denominator by √b' },
          { title: 'Conjugate Rule', formula: '1 / (a + √b) = (a - √b) / (a² - b)', note: 'Eliminates cross terms via difference of squares' }
        ],
        defaultEquation: '1 / sqrt(3)',
        examples: ['1 / sqrt(3)', '6 / sqrt(2)', '1 / (sqrt(5) - sqrt(2))'],
        actionLabel: 'Rationalize Denominator',
        toolType: 'radicals_tool',
        workedExample: {
          problem: 'Rationalize: 6 / √3',
          steps: [
            'Multiply numerator and denominator by √3: (6 · √3) / (√3 · √3)',
            'Denominator simplifies to 3: (6√3) / 3',
            'Divide 6 by 3: 2√3'
          ],
          finalAnswer: '2√3'
        },
        practice: [
          {
            question: 'What is 10 / √5 rationalized?',
            options: ['2√5', '5√2', '10√5', '2'],
            correctIdx: 0,
            explanation: '(10 · √5) / 5 = 2√5.'
          }
        ],
        relatedTopics: [
          { majorId: 'roots', subtopicId: 'radical_equations', label: 'Radical Equations' }
        ]
      },
      {
        id: 'radical_equations',
        title: 'Radical Equations',
        shortDesc: 'Equations containing variables trapped inside a radical radicand.',
        badge: 'Equations',
        intro: 'To solve a radical equation, isolate the radical term on one side, raise both sides to the power of the index, and always verify for extraneous solutions introduced by squaring.',
        mathShowcase: ['√(2x + 1) = 5', '2x + 1 = 25', '2x = 24 ⟹ x = 12'],
        formulas: [
          { title: 'Solving Procedure', formula: '√f(x) = c ⟹ f(x) = c² (with c ≥ 0)', note: 'Check all solutions in original equation' }
        ],
        defaultEquation: 'sqrt(2x + 3) = 5',
        examples: ['sqrt(2x + 3) = 5', 'sqrt(x - 4) = 3', 'sqrt(3x + 1) = 4'],
        actionLabel: 'Solve Radical Equation',
        toolType: 'radicals_tool',
        workedExample: {
          problem: 'Solve: √(3x + 1) = 4',
          steps: [
            'Square both sides: (√(3x + 1))² = 4²',
            '3x + 1 = 16',
            'Subtract 1: 3x = 15',
            'Divide by 3: x = 5',
            'Check: √(3(5) + 1) = √16 = 4 (Valid!)'
          ],
          finalAnswer: 'x = 5'
        },
        practice: [
          {
            question: 'Solve √(x + 5) = 6:',
            options: ['x = 31', 'x = 1', 'x = 36', 'x = 11'],
            correctIdx: 0,
            explanation: 'Square both sides: x + 5 = 36 → x = 31.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'quad_overview', label: 'Quadratic Equations' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. QUADRATIC EXPRESSIONS & EQUATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'quadratics',
    title: '5. Quadratic Expressions & Equations',
    shortTitle: 'Quadratics',
    level: 'Intermediate',
    description: 'Degree-2 equations, parabola vertex, quadratic formula, discriminant, and graphing.',
    iconName: 'Activity',
    subtopics: [
      {
        id: 'quad_overview',
        title: 'Standard Form (ax² + bx + c = 0)',
        shortDesc: 'The canonical form of degree-2 polynomial equations with a ≠ 0.',
        badge: 'Standard Form',
        intro: 'A quadratic equation is a second-degree polynomial equation. In standard form ax² + bx + c = 0, a is the quadratic coefficient (a ≠ 0), b is linear, and c is the constant.',
        mathShowcase: ['ax² + bx + c = 0', 'x² - 5x + 6 = 0', '2x² + 4x - 6 = 0'],
        formulas: [
          { title: 'Standard Form', formula: 'ax² + bx + c = 0, a ≠ 0', note: 'All terms shifted to one side' }
        ],
        defaultEquation: 'x^2 - 5x + 6 = 0',
        examples: ['x^2 - 5x + 6 = 0', '2x^2 + 4x - 6 = 0', 'x^2 - 4x + 4 = 0'],
        actionLabel: 'Solve Quadratic',
        toolType: 'quadratic_tool',
        workedExample: {
          problem: 'Identify a, b, c and solve: x² - 5x + 6 = 0',
          steps: [
            'Coefficients: a = 1, b = -5, c = 6',
            'Factor: (x - 2)(x - 3) = 0',
            'Roots: x = 2, x = 3'
          ],
          finalAnswer: 'x = {2, 3}'
        },
        practice: [
          {
            question: 'What are the coefficients a, b, c in 3x² - 7 = 2x?',
            options: ['a = 3, b = -2, c = -7', 'a = 3, b = 2, c = -7', 'a = 3, b = -7, c = 2', 'a = 3, b = 0, c = -7'],
            correctIdx: 0,
            explanation: 'Rearrange to standard form: 3x² - 2x - 7 = 0. Therefore a = 3, b = -2, c = -7.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'quad_factoring', label: 'Factoring Quadratics' },
          { majorId: 'quadratics', subtopicId: 'quad_formula', label: 'Quadratic Formula' }
        ]
      },
      {
        id: 'quad_factoring',
        title: 'Factoring Method',
        shortDesc: 'Solving ax² + bx + c = 0 by rewriting as (px + q)(rx + s) = 0.',
        badge: 'Factoring',
        intro: 'Factoring relies on the Zero Product Property: if A · B = 0, then A = 0 or B = 0. Find two numbers that multiply to a·c and add to b.',
        mathShowcase: ['x² - 5x + 6 = 0', '(x - 2)(x - 3) = 0', 'x = 2 or x = 3'],
        formulas: [
          { title: 'Zero Product Property', formula: 'A · B = 0 ⟹ A = 0 or B = 0', note: 'Split into two linear equations' }
        ],
        defaultEquation: 'x^2 - 7x + 12 = 0',
        examples: ['x^2 - 7x + 12 = 0', 'x^2 + 2x - 15 = 0', '2x^2 + 5x + 2 = 0'],
        actionLabel: 'Factor & Solve',
        toolType: 'quadratic_tool',
        workedExample: {
          problem: 'Solve: x² + 2x - 15 = 0',
          steps: [
            'Find two numbers multiplying to -15 and adding to 2: 5 and -3',
            'Factor: (x + 5)(x - 3) = 0',
            'Set each to zero: x + 5 = 0 ⟹ x = -5; x - 3 = 0 ⟹ x = 3'
          ],
          finalAnswer: 'x = {-5, 3}'
        },
        practice: [
          {
            question: 'Solve x² - 9x + 20 = 0 by factoring:',
            options: ['x = 4, 5', 'x = -4, -5', 'x = 2, 10', 'x = -2, -10'],
            correctIdx: 0,
            explanation: '(-4)(-5) = 20 and (-4) + (-5) = -9, so (x - 4)(x - 5) = 0 ⟹ x = 4, 5.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'quad_completing_square', label: 'Completing the Square' }
        ]
      },
      {
        id: 'quad_completing_square',
        title: 'Completing the Square',
        shortDesc: 'Transforming ax² + bx into a perfect square (x + d)² + e.',
        badge: 'Analytical Technique',
        intro: 'Completing the square adds (b / 2a)² to both sides to turn the variable terms into a perfect square binomial, which is also how the Quadratic Formula is derived.',
        mathShowcase: ['x² + 6x = 7', 'x² + 6x + 9 = 7 + 9', '(x + 3)² = 16 ⟹ x + 3 = ±4'],
        formulas: [
          { title: 'Magic Constant', formula: 'Add (b / 2)² to both sides (when a = 1)', note: 'Creates (x + b/2)²' }
        ],
        defaultEquation: 'x^2 + 6x - 7 = 0',
        examples: ['x^2 + 6x - 7 = 0', 'x^2 - 8x + 12 = 0', 'x^2 + 4x + 1 = 0'],
        actionLabel: 'Complete the Square',
        toolType: 'quadratic_tool',
        workedExample: {
          problem: 'Solve x² + 6x - 7 = 0 by completing the square',
          steps: [
            'Move constant to right: x² + 6x = 7',
            'Calculate (b/2)² = (6/2)² = 3² = 9',
            'Add 9 to both sides: x² + 6x + 9 = 7 + 9 = 16',
            'Factor left side: (x + 3)² = 16',
            'Take square roots: x + 3 = ±4 ⟹ x = -3 ± 4'
          ],
          finalAnswer: 'x = 1 or x = -7'
        },
        practice: [
          {
            question: 'What number must be added to x² - 10x to complete the square?',
            options: ['25', '100', '5', '-25'],
            correctIdx: 0,
            explanation: '(b/2)² = (-10/2)² = (-5)² = 25.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'quad_formula', label: 'Quadratic Formula' },
          { majorId: 'quadratics', subtopicId: 'parabola_graph_vertex', label: 'Parabola Vertex Form' }
        ]
      },
      {
        id: 'quad_formula',
        title: 'The Quadratic Formula',
        shortDesc: 'Universal analytical solution: x = [-b ± √(b² - 4ac)] / 2a.',
        badge: 'Universal Solver',
        intro: 'The Quadratic Formula solves ANY quadratic equation ax² + bx + c = 0 directly, including equations with irrational or complex roots where factoring is impossible.',
        mathShowcase: ['x = [-b ± √(b² - 4ac)] / 2a', 'Discriminant: Δ = b² - 4ac'],
        formulas: [
          { title: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / (2a)', note: 'Universal solution for any quadratic' }
        ],
        defaultEquation: '2x^2 - 4x - 6 = 0',
        examples: ['2x^2 - 4x - 6 = 0', 'x^2 - 5x + 6 = 0', '3x^2 + 2x - 1 = 0'],
        actionLabel: 'Apply Formula',
        toolType: 'quadratic_tool',
        workedExample: {
          problem: 'Solve 2x² - 4x - 6 = 0 with the formula',
          steps: [
            'a = 2, b = -4, c = -6',
            'b² - 4ac = (-4)² - 4(2)(-6) = 16 + 48 = 64',
            'x = [-(-4) ± √64] / (2 · 2) = [4 ± 8] / 4',
            'x₁ = (4 + 8)/4 = 3; x₂ = (4 - 8)/4 = -1'
          ],
          finalAnswer: 'x = {3, -1}'
        },
        practice: [
          {
            question: 'What is the discriminant of x² - 4x + 5 = 0?',
            options: ['-4', '4', '36', '0'],
            correctIdx: 0,
            explanation: 'b² - 4ac = (-4)² - 4(1)(5) = 16 - 20 = -4.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'discriminant_nature_roots', label: 'The Discriminant' }
        ]
      },
      {
        id: 'discriminant_nature_roots',
        title: 'The Discriminant (Δ = b² - 4ac)',
        shortDesc: 'Predicting the number and nature of solutions without solving.',
        badge: 'Nature of Roots',
        intro: 'The discriminant Δ = b² - 4ac under the square root determines root nature: Δ > 0 gives 2 distinct real roots, Δ = 0 gives 1 repeated real root, and Δ < 0 gives 2 complex conjugate roots.',
        mathShowcase: ['Δ > 0 ⟹ 2 Real Roots', 'Δ = 0 ⟹ 1 Real Root (Vertex on axis)', 'Δ < 0 ⟹ 2 Complex Roots'],
        formulas: [
          { title: 'Discriminant', formula: 'Δ = b² - 4ac', note: 'Indicator under square root' }
        ],
        defaultEquation: 'x^2 - 4x + 4 = 0',
        examples: ['x^2 - 4x + 4 = 0', 'x^2 - 4x + 5 = 0', 'x^2 - 4x + 3 = 0'],
        actionLabel: 'Analyze Discriminant',
        toolType: 'quadratic_tool',
        workedExample: {
          problem: 'Find nature of roots for 3x² - 2x + 5 = 0',
          steps: [
            'a = 3, b = -2, c = 5',
            'Δ = b² - 4ac = (-2)² - 4(3)(5) = 4 - 60 = -56',
            'Since Δ < 0, the equation has two non-real complex roots'
          ],
          finalAnswer: 'Δ = -56 (Two Complex Conjugate Roots)'
        },
        practice: [
          {
            question: 'For which discriminant does a parabola touch the x-axis at exactly one point?',
            options: ['Δ = 0', 'Δ > 0', 'Δ < 0', 'Δ = 1'],
            correctIdx: 0,
            explanation: 'When Δ = 0, the vertex sits directly on the x-axis, producing a single repeated real root.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'parabola_graph_vertex', label: 'Parabola & Vertex' },
          { majorId: 'complex', subtopicId: 'complex_standard_form', label: 'Complex Numbers' }
        ]
      },
      {
        id: 'parabola_graph_vertex',
        title: 'Parabolas: Vertex & Axis of Symmetry',
        shortDesc: 'The U-shaped graph of y = ax² + bx + c with vertex (h, k).',
        badge: 'Geometry',
        intro: 'The graph of any quadratic function is a symmetric parabola. It opens upward if a > 0 and downward if a < 0. Its turning point is the vertex (h, k) where h = -b / 2a.',
        mathShowcase: ['Vertex: h = -b / (2a), k = c - b² / (4a)', 'Axis: x = -b / (2a)', 'Vertex Form: y = a(x - h)² + k'],
        formulas: [
          { title: 'Axis of Symmetry', formula: 'x = -b / (2a)', note: 'Vertical line of reflection' },
          { title: 'Vertex Form', formula: 'y = a(x - h)² + k', note: 'Directly displays vertex (h, k)' }
        ],
        defaultEquation: 'y = x^2 - 4x + 3',
        examples: ['y = x^2 - 4x + 3', 'y = -x^2 + 2x + 1', 'y = 2x^2 - 8x + 6'],
        actionLabel: 'Graph Parabola',
        toolType: 'quadratic_tool',
        workedExample: {
          problem: 'Find vertex and axis of symmetry of y = x² - 4x + 3',
          steps: [
            'a = 1, b = -4, c = 3',
            'h = -(-4) / (2 · 1) = 4 / 2 = 2',
            'k = (2)² - 4(2) + 3 = 4 - 8 + 3 = -1',
            'Vertex: (2, -1), Axis: x = 2'
          ],
          finalAnswer: 'Vertex: (2, -1), Opens Upward'
        },
        practice: [
          {
            question: 'What is the axis of symmetry for y = 2x² - 8x + 5?',
            options: ['x = 2', 'x = -2', 'x = 4', 'x = -4'],
            correctIdx: 0,
            explanation: 'x = -b / 2a = -(-8) / (2 · 2) = 8 / 4 = 2.'
          }
        ],
        relatedTopics: [
          { majorId: 'functions', subtopicId: 'function_machine', label: 'Functions' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. LINEAR EQUATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'linear',
    title: '6. Linear Equations',
    shortTitle: 'Linear',
    level: 'Beginner',
    description: 'One-variable equations, slope-intercept form, intercepts, and linear graphing.',
    iconName: 'Activity',
    subtopics: [
      {
        id: 'one_variable_linear',
        title: 'One-Variable Linear Equations',
        shortDesc: 'Isolating the unknown in equations of degree 1: ax + b = c.',
        badge: 'Foundations',
        intro: 'To solve a linear equation, perform inverse operations (addition/subtraction, multiplication/division) equally on both sides to isolate the variable.',
        mathShowcase: ['2x + 5 = 15', '2x = 10', 'x = 5'],
        formulas: [
          { title: 'Standard Linear Form', formula: 'ax + b = c ⟹ x = (c - b) / a', note: 'Requires a ≠ 0' }
        ],
        defaultEquation: '2x + 5 = 15',
        examples: ['2x + 5 = 15', '3x - 7 = 14', '5x + 2 = 3x + 10'],
        actionLabel: 'Solve Linear Equation',
        toolType: 'linear_tool',
        workedExample: {
          problem: 'Solve 5x - 7 = 3x + 9',
          steps: [
            'Subtract 3x from both sides: 2x - 7 = 9',
            'Add 7 to both sides: 2x = 16',
            'Divide by 2: x = 8'
          ],
          finalAnswer: 'x = 8'
        },
        practice: [
          {
            question: 'Solve 4x + 3 = 19:',
            options: ['x = 4', 'x = 5.5', 'x = 16', 'x = 3'],
            correctIdx: 0,
            explanation: '4x = 16 ⟹ x = 4.'
          }
        ],
        relatedTopics: [
          { majorId: 'linear', subtopicId: 'slope_intercept_form', label: 'Slope-Intercept Form' },
          { majorId: 'systems', subtopicId: 'two_variable_systems', label: 'Systems of Equations' }
        ]
      },
      {
        id: 'slope_intercept_form',
        title: 'Slope-Intercept Form (y = mx + b)',
        shortDesc: 'Connecting slope m (rise over run) and y-intercept b.',
        badge: 'Line Equations',
        intro: 'Slope-intercept form directly displays the line\'s steepness (slope m = Δy / Δx) and the vertical point where it crosses the y-axis (0, b).',
        mathShowcase: ['y = 2x + 3', 'Slope: m = 2', 'y-intercept: (0, 3)'],
        formulas: [
          { title: 'Slope-Intercept Form', formula: 'y = mx + b', note: 'm is slope, b is y-intercept' },
          { title: 'Slope Formula', formula: 'm = (y₂ - y₁) / (x₂ - x₁)', note: 'Vertical rise over horizontal run' }
        ],
        defaultEquation: 'y = 2x + 3',
        examples: ['y = 2x + 3', 'y = -0.5x + 4', 'y = 3x - 1'],
        actionLabel: 'Graph & Inspect Line',
        toolType: 'linear_tool',
        workedExample: {
          problem: 'Find slope and y-intercept of 2x + 4y = 8',
          steps: [
            'Isolate y: 4y = -2x + 8',
            'Divide by 4: y = (-2/4)x + 8/4',
            'Simplify: y = -0.5x + 2'
          ],
          finalAnswer: 'Slope m = -0.5, y-intercept b = 2'
        },
        practice: [
          {
            question: 'What is the slope of the line passing through (1, 2) and (3, 8)?',
            options: ['3', '2', '6', '4'],
            correctIdx: 0,
            explanation: 'm = (8 - 2) / (3 - 1) = 6 / 2 = 3.'
          }
        ],
        relatedTopics: [
          { majorId: 'linear', subtopicId: 'slope_and_intercepts', label: 'Slope & Intercepts' },
          { majorId: 'systems', subtopicId: 'systems_graphical', label: 'Systems Graphical Method' }
        ]
      },
      {
        id: 'slope_and_intercepts',
        title: 'Slope & Intercepts',
        shortDesc: 'Calculating x-intercept (where y = 0) and y-intercept (where x = 0).',
        badge: 'Intersections',
        intro: 'The intercepts are the points where the line crosses the coordinate axes. Setting y = 0 finds the x-intercept; setting x = 0 finds the y-intercept.',
        mathShowcase: ['x-intercept: (-b/m, 0)', 'y-intercept: (0, b)', 'Ax + By = C'],
        formulas: [
          { title: 'Standard Form Intercepts', formula: 'x-int: (C/A, 0) | y-int: (0, C/B)', note: 'Quick intercept computation' }
        ],
        defaultEquation: '3x - 4y = 12',
        examples: ['3x - 4y = 12', '2x + 5y = 10', 'y = 4x - 8'],
        actionLabel: 'Find Intercepts',
        toolType: 'linear_tool',
        workedExample: {
          problem: 'Find intercepts for 3x + 2y = 12',
          steps: [
            'Set y = 0: 3x = 12 ⟹ x = 4 (x-int is (4, 0))',
            'Set x = 0: 2y = 12 ⟹ y = 6 (y-int is (0, 6))'
          ],
          finalAnswer: 'x-int: (4, 0), y-int: (0, 6)'
        },
        practice: [
          {
            question: 'What is the x-intercept of y = 3x - 9?',
            options: ['(3, 0)', '(-3, 0)', '(0, -9)', '(9, 0)'],
            correctIdx: 0,
            explanation: 'Set y = 0: 0 = 3x - 9 ⟹ 3x = 9 ⟹ x = 3.'
          }
        ],
        relatedTopics: [
          { majorId: 'linear', subtopicId: 'slope_intercept_form', label: 'Slope-Intercept Form' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. SYSTEMS OF EQUATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'systems',
    title: '7. Systems of Equations',
    shortTitle: 'Systems',
    level: 'Intermediate',
    description: 'Two-variable simultaneous equations, substitution, elimination, and intersections.',
    iconName: 'Activity',
    subtopics: [
      {
        id: 'two_variable_systems',
        title: 'Two-Variable Linear Systems',
        shortDesc: 'Two linear equations sharing variables x and y solved simultaneously.',
        badge: 'Simultaneous Equations',
        intro: 'A system of linear equations consists of multiple equations with common variables. The solution is the point (x, y) where both lines intersect and satisfy both equations.',
        mathShowcase: ['x + y = 10', '2x - y = 5', 'Intersection: (5, 5)'],
        formulas: [
          { title: 'Matrix Representation', formula: 'Ax = b', note: 'Compact linear algebra form' }
        ],
        defaultEquation: 'x + y = 10',
        defaultEquation2: '2x - y = 5',
        examples: ['x + y = 10 & 2x - y = 5', '2x + y = 9 & 3x - y = 1', 'x - 2y = 4 & 2x + y = 3'],
        actionLabel: 'Solve System',
        toolType: 'systems_tool',
        workedExample: {
          problem: 'Solve: [1] x + y = 10, [2] 2x - y = 5',
          steps: [
            'Add the two equations: (x + 2x) + (y - y) = 10 + 5',
            '3x = 15 ⟹ x = 5',
            'Substitute x = 5 into [1]: 5 + y = 10 ⟹ y = 5'
          ],
          finalAnswer: '(x, y) = (5, 5)'
        },
        practice: [
          {
            question: 'Solve the system: x + y = 8 and x - y = 2',
            options: ['(5, 3)', '(4, 4)', '(6, 2)', '(3, 5)'],
            correctIdx: 0,
            explanation: 'Add equations: 2x = 10 ⟹ x = 5. Then y = 8 - 5 = 3.'
          }
        ],
        relatedTopics: [
          { majorId: 'systems', subtopicId: 'systems_substitution', label: 'Substitution Method' },
          { majorId: 'systems', subtopicId: 'systems_elimination', label: 'Elimination Method' }
        ]
      },
      {
        id: 'systems_substitution',
        title: 'Substitution Method',
        shortDesc: 'Isolating one variable in Equation 1 and substituting into Equation 2.',
        badge: 'Method',
        intro: 'Substitution isolates one variable in terms of the other, replacing that variable in the remaining equation to reduce the problem to a single one-variable equation.',
        mathShowcase: ['y = 2x - 1', '3x + y = 9', '3x + (2x - 1) = 9 ⟹ 5x = 10 ⟹ x = 2'],
        formulas: [
          { title: 'Substitution Step', formula: 'If y = f(x), then g(x, y) = g(x, f(x)) = 0', note: 'Reduces 2 variables to 1' }
        ],
        defaultEquation: 'y = 2x - 1',
        defaultEquation2: '3x + y = 9',
        examples: ['y = 2x - 1 & 3x + y = 9', 'x = 3 - y & 2x + y = 4'],
        actionLabel: 'Solve by Substitution',
        toolType: 'systems_tool',
        workedExample: {
          problem: 'Solve by substitution: y = 2x - 1 and 3x + y = 9',
          steps: [
            'Substitute (2x - 1) for y in second equation: 3x + (2x - 1) = 9',
            '5x - 1 = 9 ⟹ 5x = 10 ⟹ x = 2',
            'Back-substitute x = 2: y = 2(2) - 1 = 3'
          ],
          finalAnswer: '(x, y) = (2, 3)'
        },
        practice: [
          {
            question: 'If y = 3x and 2x + y = 15, what is x?',
            options: ['3', '5', '15', '1'],
            correctIdx: 0,
            explanation: '2x + (3x) = 15 ⟹ 5x = 15 ⟹ x = 3.'
          }
        ],
        relatedTopics: [
          { majorId: 'systems', subtopicId: 'systems_elimination', label: 'Elimination Method' }
        ]
      },
      {
        id: 'systems_elimination',
        title: 'Elimination / Addition Method',
        shortDesc: 'Scaling equations so coefficients cancel when added together.',
        badge: 'Method',
        intro: 'The elimination method multiplies equations by constants so that adding or subtracting them eliminates one variable completely.',
        mathShowcase: ['2x + 3y = 12', '2x - 3y = 4', 'Add: 4x = 16 ⟹ x = 4'],
        formulas: [
          { title: 'Elimination Rule', formula: 'c₁ · Eq1 + c₂ · Eq2', note: 'Choose c₁, c₂ so that one coefficient sums to zero' }
        ],
        defaultEquation: '2x + 3y = 12',
        defaultEquation2: '2x - 3y = 4',
        examples: ['2x + 3y = 12 & 2x - 3y = 4', '3x + 2y = 7 & 4x - 2y = 7'],
        actionLabel: 'Solve by Elimination',
        toolType: 'systems_tool',
        workedExample: {
          problem: 'Solve: 3x + 2y = 16 and 5x - 2y = 0',
          steps: [
            'Add equations directly: (3x + 5x) + (2y - 2y) = 16 + 0',
            '8x = 16 ⟹ x = 2',
            'Substitute into second equation: 5(2) - 2y = 0 ⟹ 2y = 10 ⟹ y = 5'
          ],
          finalAnswer: '(x, y) = (2, 5)'
        },
        practice: [
          {
            question: 'To eliminate y from 2x + 3y = 8 and 3x + y = 5, what should you multiply the second equation by?',
            options: ['-3', '3', '2', '-2'],
            correctIdx: 0,
            explanation: 'Multiplying the second equation by -3 gives -9x - 3y = -15, which cancels +3y.'
          }
        ],
        relatedTopics: [
          { majorId: 'advanced', subtopicId: 'matrix_determinants', label: 'Matrix Determinants' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. INEQUALITIES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'inequalities',
    title: '8. Inequalities',
    shortTitle: 'Inequalities',
    level: 'Intermediate',
    description: 'Symbols, linear inequalities, sign flip rule, compound intervals, and number lines.',
    iconName: 'Compass',
    subtopics: [
      {
        id: 'inequalities_linear_flip',
        title: 'Linear Inequalities & The Sign Flip Rule',
        shortDesc: 'Reversing inequality direction when multiplying or dividing by a negative number.',
        badge: 'Critical Rule',
        intro: 'Inequalities describe continuous ranges of solutions rather than single isolated points. Whenever you multiply or divide by a negative number, the inequality sign MUST reverse direction.',
        mathShowcase: ['2x + 5 ≤ 15 ⟹ x ≤ 5', '-3x < 12 ⟹ x > -4 (Flipped!)', 'x > 3'],
        formulas: [
          { title: 'Negative Multiplier Rule', formula: 'If a < b and c < 0, then a·c > b·c', note: 'Inequality sign reverses direction' },
          { title: 'Interval Notation', formula: 'x ≤ 5 ⟺ (-∞, 5]', note: 'Brackets for inclusive (≤, ≥); parentheses for strict (<, >)' }
        ],
        defaultEquation: '2x + 5 <= 15',
        examples: ['2x + 5 <= 15', '-3x < 12', '4x - 7 >= 9'],
        actionLabel: 'Solve Inequality',
        toolType: 'inequality_tool',
        workedExample: {
          problem: 'Solve: -2x + 6 < 14',
          steps: [
            'Subtract 6: -2x < 8',
            'Divide by -2 (FLIP inequality sign!): x > 8 / (-2)',
            'Result: x > -4, Interval: (-4, ∞)'
          ],
          finalAnswer: 'x > -4'
        },
        practice: [
          {
            question: 'Solve -5x ≥ 25:',
            options: ['x ≤ -5', 'x ≥ -5', 'x ≤ 5', 'x ≥ 5'],
            correctIdx: 0,
            explanation: 'Dividing by -5 flips the sign from ≥ to ≤, yielding x ≤ -5.'
          }
        ],
        relatedTopics: [
          { majorId: 'inequalities', subtopicId: 'compound_inequalities', label: 'Compound Inequalities' }
        ]
      },
      {
        id: 'compound_inequalities',
        title: 'Compound Inequalities (AND vs OR)',
        shortDesc: 'Conjunctions (overlap) and disjunctions (unions) of multiple inequality constraints.',
        badge: 'Intervals',
        intro: 'An AND compound inequality represents the intersection (overlap) of two conditions, while an OR compound inequality represents the union of either condition.',
        mathShowcase: ['-3 ≤ 2x - 1 < 7', 'x < -2 or x > 5', '[-1, 4)'],
        formulas: [
          { title: 'Conjunction (AND)', formula: 'a < x < b', note: 'Bounded interval (a, b)' },
          { title: 'Disjunction (OR)', formula: 'x < a ∪ x > b', note: 'Two separate infinite rays' }
        ],
        defaultEquation: '-3 <= 2x - 1 < 7',
        examples: ['-3 <= 2x - 1 < 7', '1 < 3x - 2 <= 10'],
        actionLabel: 'Solve Compound Interval',
        toolType: 'inequality_tool',
        workedExample: {
          problem: 'Solve: -3 ≤ 2x - 1 < 7',
          steps: [
            'Add 1 to all three parts: -2 ≤ 2x < 8',
            'Divide all three parts by 2: -1 ≤ x < 4',
            'Interval notation: [-1, 4)'
          ],
          finalAnswer: '-1 ≤ x < 4'
        },
        practice: [
          {
            question: 'What is the interval notation for -2 < x ≤ 5?',
            options: ['(-2, 5]', '[-2, 5)', '(-2, 5)', '[-2, 5]'],
            correctIdx: 0,
            explanation: 'Strict inequality (<) uses parenthesis `(`, inclusive (≤) uses bracket `]`.'
          }
        ],
        relatedTopics: [
          { majorId: 'inequalities', subtopicId: 'inequalities_linear_flip', label: 'Linear Inequalities' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. SEQUENCES AND SERIES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'sequences',
    title: '9. Sequences and Series',
    shortTitle: 'Sequences',
    level: 'Intermediate',
    description: 'Arithmetic & geometric progressions, nth terms, partial sums, and infinite series.',
    iconName: 'Layers',
    subtopics: [
      {
        id: 'arithmetic_sequences',
        title: 'Arithmetic Sequences & Series',
        shortDesc: 'Sequences with a constant common difference d added to each term.',
        badge: 'Linear Growth',
        intro: 'An arithmetic sequence adds a constant common difference d at each step. The nth term is given by aₙ = a₁ + (n - 1)d.',
        mathShowcase: ['aₙ = a₁ + (n - 1)d', 'Sₙ = n/2 · (a₁ + aₙ)', '3, 7, 11, 15, 19... (d = 4)'],
        formulas: [
          { title: 'nth Term', formula: 'aₙ = a₁ + (n - 1)d', note: 'Explicit formula' },
          { title: 'Arithmetic Series Sum', formula: 'Sₙ = (n / 2)(2a₁ + (n - 1)d)', note: 'Sum of first n terms' }
        ],
        defaultEquation: '3, 7, 11, 15, 19',
        examples: ['3, 7, 11, 15, 19', '5, 10, 15, 20', '100, 95, 90, 85'],
        actionLabel: 'Calculate Sequence Terms',
        toolType: 'sequences_tool',
        workedExample: {
          problem: 'Find the 20th term of: 3, 7, 11, 15...',
          steps: [
            'First term: a₁ = 3',
            'Common difference: d = 7 - 3 = 4',
            'Apply formula: a₂₀ = 3 + (20 - 1) · 4',
            'a₂₀ = 3 + 19 · 4 = 3 + 76 = 79'
          ],
          finalAnswer: 'a₂₀ = 79'
        },
        practice: [
          {
            question: 'What is the sum of the first 10 terms of the sequence 2, 4, 6, 8...?',
            options: ['110', '100', '120', '90'],
            correctIdx: 0,
            explanation: 'S₁₀ = (10 / 2)(a₁ + a₁₀) = 5(2 + 20) = 5(22) = 110.'
          }
        ],
        relatedTopics: [
          { majorId: 'sequences', subtopicId: 'geometric_sequences', label: 'Geometric Sequences' }
        ]
      },
      {
        id: 'geometric_sequences',
        title: 'Geometric Sequences & Infinite Series',
        shortDesc: 'Sequences with a constant common ratio r multiplied at each step.',
        badge: 'Exponential Growth',
        intro: 'In a geometric progression, each term is multiplied by a common ratio r: aₙ = a₁ · rⁿ⁻¹. If |r| < 1, the infinite sum converges to S_∞ = a₁ / (1 - r).',
        mathShowcase: ['aₙ = a₁ · rⁿ⁻¹', 'S_∞ = a₁ / (1 - r) (for |r| < 1)', '2, 6, 18, 54... (r = 3)'],
        formulas: [
          { title: 'nth Term', formula: 'aₙ = a₁ · rⁿ⁻¹', note: 'Explicit geometric formula' },
          { title: 'Finite Sum', formula: 'Sₙ = a₁(1 - rⁿ) / (1 - r)', note: 'Sum of first n terms (r ≠ 1)' },
          { title: 'Infinite Convergent Sum', formula: 'S_∞ = a₁ / (1 - r)', note: 'Converges only when |r| < 1' }
        ],
        defaultEquation: '2, 6, 18, 54',
        examples: ['2, 6, 18, 54', '1, 0.5, 0.25, 0.125', '3, -6, 12, -24'],
        actionLabel: 'Analyze Geometric Growth',
        toolType: 'sequences_tool',
        workedExample: {
          problem: 'Find the infinite sum of: 1 + 1/2 + 1/4 + 1/8...',
          steps: [
            'First term: a₁ = 1',
            'Common ratio: r = 1/2',
            'Since |r| = 0.5 < 1, the series converges',
            'S_∞ = 1 / (1 - 0.5) = 1 / 0.5 = 2'
          ],
          finalAnswer: 'S_∞ = 2'
        },
        practice: [
          {
            question: 'What is the 5th term of 3, 6, 12, 24...?',
            options: ['48', '36', '96', '30'],
            correctIdx: 0,
            explanation: 'a₅ = a₁ · r⁴ = 3 · 2⁴ = 3 · 16 = 48.'
          }
        ],
        relatedTopics: [
          { majorId: 'exponents_logs', subtopicId: 'laws_of_exponents', label: 'Exponents' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'functions',
    title: '10. Functions',
    shortTitle: 'Functions',
    level: 'Intermediate',
    description: 'Input-output relations, domain, range, evaluation, compositions, and inverse functions.',
    iconName: 'Target',
    subtopics: [
      {
        id: 'function_machine',
        title: 'The Function Machine: Input → Rule → Output',
        shortDesc: 'A mathematical rule that maps every valid input x to exactly one output f(x).',
        badge: 'Core Concept',
        intro: 'A function f is a mapping where every input x in the domain has exactly one corresponding output f(x). Graphically, it passes the Vertical Line Test.',
        mathShowcase: ['f(x) = x² + 3x + 2', 'Input x = 3 ⟹ f(3) = 20', 'Vertical Line Test'],
        formulas: [
          { title: 'Function Notation', formula: 'y = f(x)', note: 'x is independent variable; y is dependent' }
        ],
        defaultEquation: 'x^2 + 3x + 2',
        examples: ['x^2 + 3x + 2', '2x - 5', 'sqrt(x - 1)'],
        actionLabel: 'Evaluate & Map Function',
        toolType: 'functions_tool',
        workedExample: {
          problem: 'Evaluate f(x) = 2x² - 3x + 5 at x = 3',
          steps: [
            'Substitute 3: f(3) = 2(3)² - 3(3) + 5',
            'f(3) = 2(9) - 9 + 5 = 18 - 9 + 5 = 14'
          ],
          finalAnswer: 'f(3) = 14'
        },
        practice: [
          {
            question: 'If f(x) = 4x - 7, what is f(-2)?',
            options: ['-15', '-1', '1', '15'],
            correctIdx: 0,
            explanation: 'f(-2) = 4(-2) - 7 = -8 - 7 = -15.'
          }
        ],
        relatedTopics: [
          { majorId: 'functions', subtopicId: 'function_domain_range', label: 'Domain & Range' }
        ]
      },
      {
        id: 'function_domain_range',
        title: 'Domain & Range',
        shortDesc: 'All allowable input values (Domain) and all possible output values (Range).',
        badge: 'Sets',
        intro: 'The domain includes all real numbers x for which f(x) is defined. Key domain restrictions: denominators cannot equal zero, and radicands of even roots must be non-negative.',
        mathShowcase: ['f(x) = 1 / (x - 2) ⟹ Domain: x ≠ 2', 'f(x) = √(x - 3) ⟹ Domain: x ≥ 3'],
        formulas: [
          { title: 'Denominator Restriction', formula: '1 / g(x) ⟹ g(x) ≠ 0', note: 'Division by zero is undefined' },
          { title: 'Even Radical Restriction', formula: '√g(x) ⟹ g(x) ≥ 0', note: 'Radicand must be non-negative for real output' }
        ],
        defaultEquation: '1 / (x - 4)',
        examples: ['1 / (x - 4)', 'sqrt(x - 2)', 'x^2 + 1'],
        actionLabel: 'Find Domain Restrictions',
        toolType: 'functions_tool',
        workedExample: {
          problem: 'Find the domain of f(x) = 1 / √(x - 5)',
          steps: [
            'Inside square root must be non-negative: x - 5 ≥ 0',
            'Denominator cannot equal zero: x - 5 ≠ 0',
            'Combine restrictions: x - 5 > 0 ⟹ x > 5',
            'Domain: (5, ∞)'
          ],
          finalAnswer: 'Domain: x > 5'
        },
        practice: [
          {
            question: 'What is the domain of f(x) = √(2x - 6)?',
            options: ['x ≥ 3', 'x > 3', 'x ≤ 3', 'All real numbers'],
            correctIdx: 0,
            explanation: '2x - 6 ≥ 0 ⟹ 2x ≥ 6 ⟹ x ≥ 3.'
          }
        ],
        relatedTopics: [
          { majorId: 'rational', subtopicId: 'rational_domain_restrictions', label: 'Rational Domain Restrictions' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. EXPONENTS AND LOGARITHMS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'exponents_logs',
    title: '11. Exponents and Logarithms',
    shortTitle: 'Exponents & Logs',
    level: 'Intermediate',
    description: 'Laws of exponents, logarithmic properties, natural log ln(x), and exponential bridges.',
    iconName: 'Sparkles',
    subtopics: [
      {
        id: 'laws_of_exponents',
        title: 'Laws of Exponents',
        shortDesc: 'Product, quotient, power-of-a-power, negative, and fractional exponent rules.',
        badge: 'Fundamental Laws',
        intro: 'Exponent rules govern powers of numbers. When multiplying like bases add powers; when dividing subtract powers; a negative exponent inverts the base.',
        mathShowcase: ['xᵃ · xᵇ = xᵃ⁺ᵇ', '(xᵃ)ᵇ = xᵃᵇ', 'x⁻ⁿ = 1 / xⁿ', 'x^(1/2) = √x'],
        formulas: [
          { title: 'Product Law', formula: 'aᵐ · aⁿ = aᵐ⁺ⁿ', note: 'Add exponents' },
          { title: 'Quotient Law', formula: 'aᵐ / aⁿ = aᵐ⁻ⁿ', note: 'Subtract exponents' },
          { title: 'Zero Power', formula: 'a⁰ = 1 (for a ≠ 0)', note: 'Any non-zero base to power 0 equals 1' }
        ],
        defaultEquation: 'x^3 * x^4',
        examples: ['x^3 * x^4', '(x^2)^3', 'x^5 / x^2', 'x^-3'],
        actionLabel: 'Simplify Powers',
        toolType: 'exponents_logs_tool',
        workedExample: {
          problem: 'Simplify: (2x³)² · x⁴',
          steps: [
            'Square the term: 2² · (x³)² = 4x⁶',
            'Multiply by x⁴: 4x⁶ · x⁴ = 4x⁶⁺⁴ = 4x¹⁰'
          ],
          finalAnswer: '4x¹⁰'
        },
        practice: [
          {
            question: 'What is (x⁴)³ / x² simplified?',
            options: ['x¹⁰', 'x⁵', 'x⁷', 'x¹⁴'],
            correctIdx: 0,
            explanation: '(x⁴)³ = x¹²; x¹² / x² = x¹²⁻² = x¹⁰.'
          }
        ],
        relatedTopics: [
          { majorId: 'exponents_logs', subtopicId: 'logarithm_bridge', label: 'Logarithm Bridge' }
        ]
      },
      {
        id: 'logarithm_bridge',
        title: 'What is a Logarithm? (The Exponential Bridge)',
        shortDesc: 'The inverse operation of exponentiation: log_b(x) = y ⟺ b^y = x.',
        badge: 'Inverse Operation',
        intro: 'A logarithm answers the question: "To what power must base b be raised to get x?" Logarithms and exponentials are inverse operations that undo each other.',
        mathShowcase: ['log₂(8) = 3 ⟺ 2³ = 8', 'log₁₀(100) = 2', 'ln(e) = 1', 'log_b(1) = 0'],
        formulas: [
          { title: 'Logarithm Bridge', formula: 'log_b(x) = y ⟺ bʸ = x', note: 'Transforms logs into powers and vice versa' },
          { title: 'Product Property', formula: 'log(xy) = log(x) + log(y)', note: 'Multiplication turns to addition' },
          { title: 'Power Property', formula: 'log(xᵏ) = k · log(x)', note: 'Brings exponent to the front' }
        ],
        defaultEquation: 'log2(8)',
        examples: ['log2(8)', 'log10(1000)', 'ln(e^3)', '2^x = 16'],
        actionLabel: 'Convert & Evaluate Log',
        toolType: 'exponents_logs_tool',
        workedExample: {
          problem: 'Solve 2ˣ = 32 using logarithms',
          steps: [
            'Convert to logarithmic form: x = log₂(32)',
            'Express 32 as power of 2: 32 = 2⁵',
            'Apply inverse rule: log₂(2⁵) = 5'
          ],
          finalAnswer: 'x = 5'
        },
        practice: [
          {
            question: 'What is the value of log₃(81)?',
            options: ['4', '3', '27', '9'],
            correctIdx: 0,
            explanation: '3⁴ = 81, so log₃(81) = 4.'
          }
        ],
        relatedTopics: [
          { majorId: 'exponents_logs', subtopicId: 'laws_of_exponents', label: 'Laws of Exponents' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. RATIONAL EXPRESSIONS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'rational',
    title: '12. Rational Expressions',
    shortTitle: 'Rational',
    level: 'Intermediate',
    description: 'Polynomial fractions, domain restrictions, canceling common factors, and simplification.',
    iconName: 'Target',
    subtopics: [
      {
        id: 'rational_simplifying',
        title: 'Rational Expressions & Domain Restrictions',
        shortDesc: 'Factoring numerator and denominator to cancel common factors and identify excluded values.',
        badge: 'Fractions of Polynomials',
        intro: 'A rational expression is a fraction of two polynomials P(x) / Q(x). Any value of x where the denominator Q(x) = 0 is strictly excluded from the domain.',
        mathShowcase: ['(x² - 4) / (x - 2) = x + 2 (for x ≠ 2)', 'Excluded value: x = 2'],
        formulas: [
          { title: 'Cancellation Rule', formula: '(A · C) / (B · C) = A / B (where C ≠ 0)', note: 'Only multiply factors can be canceled' },
          { title: 'Excluded Values', formula: 'Denominator = 0', note: 'Values where original fraction is undefined' }
        ],
        defaultEquation: '(x^2 - 4) / (x - 2)',
        examples: ['(x^2 - 4) / (x - 2)', '(x^2 - 9) / (x + 3)', '(2x^2 + 4x) / (2x)'],
        actionLabel: 'Simplify & Find Restrictions',
        toolType: 'rational_tool',
        workedExample: {
          problem: 'Simplify (x² - 9) / (x² - x - 6) and state domain restrictions',
          steps: [
            'Factor numerator: (x - 3)(x + 3)',
            'Factor denominator: (x - 3)(x + 2)',
            'Domain restrictions: x - 3 ≠ 0 and x + 2 ≠ 0 ⟹ x ≠ 3, x ≠ -2',
            'Cancel common factor (x - 3): (x + 3) / (x + 2)'
          ],
          finalAnswer: '(x + 3) / (x + 2), with x ≠ 3, -2'
        },
        practice: [
          {
            question: 'What are the excluded values for (x + 1) / (x² - 16)?',
            options: ['x = 4 and x = -4', 'x = -1', 'x = 16', 'x = 4 only'],
            correctIdx: 0,
            explanation: 'Set denominator to zero: x² - 16 = 0 ⟹ x = ±4.'
          }
        ],
        relatedTopics: [
          { majorId: 'polynomials', subtopicId: 'poly_factoring', label: 'Polynomial Factoring' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. COMPLEX NUMBERS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'complex',
    title: '13. Complex Numbers',
    shortTitle: 'Complex Numbers',
    level: 'Advanced',
    description: 'Imaginary unit i, standard form a + bi, complex plane, conjugates, and modulus.',
    iconName: 'Compass',
    subtopics: [
      {
        id: 'complex_standard_form',
        title: 'The Imaginary Unit i & The Complex Plane',
        shortDesc: 'Numbers of the form z = a + bi where i² = -1.',
        badge: '2D Number System',
        intro: 'Because no real number squared yields a negative result, mathematicians define the imaginary unit i where i² = -1. A complex number z = a + bi combines a real part a and imaginary part b.',
        mathShowcase: ['i² = -1', 'z = a + bi', '|z| = √(a² + b²)', 'Conjugate: z* = a - bi'],
        formulas: [
          { title: 'Powers of i Cycle', formula: 'i¹ = i, i² = -1, i³ = -i, i⁴ = 1', note: 'Repeats modulo 4' },
          { title: 'Modulus (Absolute Value)', formula: '|z| = √(a² + b²)', note: 'Distance from origin (0, 0)' },
          { title: 'Conjugate Product', formula: 'z · z* = (a + bi)(a - bi) = a² + b²', note: 'Always a non-negative real number' }
        ],
        defaultEquation: '3 + 4i',
        examples: ['3 + 4i', '(2 + 3i) + (1 - 5i)', '(1 + 2i) * (3 - 4i)'],
        actionLabel: 'Analyze Complex Number',
        toolType: 'complex_tool',
        workedExample: {
          problem: 'Find modulus and conjugate of z = 3 + 4i',
          steps: [
            'Real part: a = 3, Imaginary part: b = 4',
            'Modulus: |z| = √(3² + 4²) = √(9 + 16) = √25 = 5',
            'Conjugate: z* = 3 - 4i'
          ],
          finalAnswer: '|z| = 5, Conjugate: 3 - 4i'
        },
        practice: [
          {
            question: 'What is the value of i¹⁵?',
            options: ['-i', 'i', '-1', '1'],
            correctIdx: 0,
            explanation: '15 mod 4 = 3, and i³ = -i.'
          }
        ],
        relatedTopics: [
          { majorId: 'quadratics', subtopicId: 'discriminant_nature_roots', label: 'Discriminant' }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. ADVANCED ALGEBRA
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'advanced',
    title: '14. Advanced Algebra',
    shortTitle: 'Advanced Algebra',
    level: 'Advanced',
    description: 'Matrix algebra, determinants, inverses, systems solving, and higher algebraic theorems.',
    iconName: 'Grid',
    subtopics: [
      {
        id: 'matrix_determinants',
        title: 'Matrices: Operations & Determinants',
        shortDesc: 'Rectangular arrays of numbers, matrix multiplication, and 2x2 determinants det = ad - bc.',
        badge: 'Linear Algebra',
        intro: 'A matrix organizes multiple linear relationships into a compact rectangular grid. For a 2x2 matrix, the determinant det(A) = ad - bc determines whether the matrix is invertible.',
        mathShowcase: ['[a b ; c d]', 'det(A) = ad - bc', 'A · A⁻¹ = I'],
        formulas: [
          { title: '2x2 Determinant', formula: 'det [a b ; c d] = ad - bc', note: 'Non-zero determinant means invertible' },
          { title: '2x2 Matrix Inverse', formula: 'A⁻¹ = (1 / det) · [d -b ; -c a]', note: 'Requires det(A) ≠ 0' }
        ],
        defaultEquation: '[[4, 2], [3, 2]]',
        examples: ['[[4, 2], [3, 2]]', '[[1, 2], [3, 4]]', '[[5, -2], [3, 1]]'],
        actionLabel: 'Calculate Determinant & Inverse',
        toolType: 'matrix_tool',
        workedExample: {
          problem: 'Find determinant of A = [4 2 ; 3 2]',
          steps: [
            'a = 4, b = 2, c = 3, d = 2',
            'det(A) = a·d - b·c = 4(2) - 2(3) = 8 - 6 = 2',
            'Since det(A) = 2 ≠ 0, the matrix is invertible'
          ],
          finalAnswer: 'det(A) = 2 (Invertible)'
        },
        practice: [
          {
            question: 'What is the determinant of [[2, 5], [1, 3]]?',
            options: ['1', '-1', '11', '0'],
            correctIdx: 0,
            explanation: 'ad - bc = (2)(3) - (5)(1) = 6 - 5 = 1.'
          }
        ],
        relatedTopics: [
          { majorId: 'systems', subtopicId: 'two_variable_systems', label: 'Systems of Equations' }
        ]
      }
    ]
  }
];
