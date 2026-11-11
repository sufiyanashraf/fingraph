import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Calculator, TrendingUp, Target, FunctionSquare, Sigma, Info } from 'lucide-react';

interface FormulaProps {
  title: string;
  icon: React.ReactNode;
  formula: string;
  composition: string;
  terms: { symbol: string; meaning: string; units: string }[];
  example: string;
  usedIn: string;
  accentColor: string;
}

const formulas: FormulaProps[] = [
  {
    title: "Simple Interest",
    icon: <Calculator className="w-6 h-6" />,
    formula: "I = P × r × t",
    composition: "Calculates the total interest earned or paid on a principal sum over a period of time without compounding.",
    terms: [
      { symbol: "I", meaning: "Total Interest amount", units: "Currency (e.g., $)" },
      { symbol: "P", meaning: "Principal amount (initial investment/loan)", units: "Currency (e.g., $)" },
      { symbol: "r", meaning: "Annual interest rate", units: "Decimal (e.g., 0.05 for 5%)" },
      { symbol: "t", meaning: "Time period", units: "Years" }
    ],
    example: "If you invest $1,000 (P) at 5% (r = 0.05) for 3 years (t = 3): I = 1000 × 0.05 × 3 = $150. Total value = $1,150.",
    usedIn: "Basic Calculator, Loan Calculator",
    accentColor: "border-blue-500"
  },
  {
    title: "Compound Interest",
    icon: <TrendingUp className="w-6 h-6" />,
    formula: "A = P(1 + r/n)^(nt)",
    composition: "Calculates the future value of an investment where interest is added to the principal and thereafter earns interest.",
    terms: [
      { symbol: "A", meaning: "Final Amount (Future Value)", units: "Currency (e.g., $)" },
      { symbol: "P", meaning: "Principal amount", units: "Currency (e.g., $)" },
      { symbol: "r", meaning: "Annual interest rate", units: "Decimal" },
      { symbol: "n", meaning: "Number of times interest is compounded per year", units: "Integer (e.g., 12 for monthly)" },
      { symbol: "t", meaning: "Time the money is invested for", units: "Years" }
    ],
    example: "Investing $1,000 at 5% compounded monthly for 10 years: A = 1000(1 + 0.05/12)^(12×10) = 1000(1.004167)^120 ≈ $1,647.01",
    usedIn: "Investment Simulator, Compound Interest Calculator",
    accentColor: "border-green-500"
  },
  {
    title: "Monte Carlo Simulation",
    icon: <Sigma className="w-6 h-6" />,
    formula: "S_t = S_{t-1} × e^((μ - σ²/2)dt + σ√dt Z)",
    composition: "Models the future price of an asset using Geometric Brownian Motion, incorporating expected return (drift) and volatility (shock).",
    terms: [
      { symbol: "S_t", meaning: "Asset price at time t", units: "Currency" },
      { symbol: "S_{t-1}", meaning: "Asset price at previous time step", units: "Currency" },
      { symbol: "μ", meaning: "Expected return (drift)", units: "Decimal (annualized)" },
      { symbol: "σ", meaning: "Volatility (standard deviation of returns)", units: "Decimal (annualized)" },
      { symbol: "dt", meaning: "Time step size", units: "Years (e.g., 1/252 for daily)" },
      { symbol: "Z", meaning: "Random variable from standard normal distribution", units: "Dimensionless" }
    ],
    example: "With S=100, μ=0.10, σ=0.20, dt=1/252, and random Z=0.5: S_t = 100 × e^((0.10 - 0.20²/2)/252 + 0.20√(1/252)(0.5)) ≈ 100.63",
    usedIn: "Investment Simulator (Advanced Mode), Retirement Planner",
    accentColor: "border-purple-500"
  },
  {
    title: "Future Value of Annuity",
    icon: <TrendingUp className="w-6 h-6" />,
    formula: "FV = PMT × [((1 + r/n)^(nt) - 1) / (r/n)]",
    composition: "Calculates the future value of a series of equal regular payments (PMT) earning compound interest.",
    terms: [
      { symbol: "FV", meaning: "Future Value", units: "Currency" },
      { symbol: "PMT", meaning: "Regular payment amount", units: "Currency" },
      { symbol: "r", meaning: "Annual interest rate", units: "Decimal" },
      { symbol: "n", meaning: "Compounding periods per year", units: "Integer" },
      { symbol: "t", meaning: "Number of years", units: "Years" }
    ],
    example: "Investing $500 monthly (PMT) at 7% (r=0.07) compounded monthly (n=12) for 30 years: FV = 500 × [((1 + 0.07/12)^(360) - 1) / (0.07/12)] ≈ $609,985",
    usedIn: "Investment Simulator, Savings Calculator",
    accentColor: "border-emerald-500"
  },
  {
    title: "Required Monthly Contribution",
    icon: <Target className="w-6 h-6" />,
    formula: "PMT = (FV - PV(1+r/n)^(nt)) × (r/n) / ((1+r/n)^(nt) - 1)",
    composition: "Rearrangement of the annuity formula, factoring in an initial present value (PV), to solve for the required payment.",
    terms: [
      { symbol: "PMT", meaning: "Required regular payment", units: "Currency" },
      { symbol: "FV", meaning: "Target Future Value", units: "Currency" },
      { symbol: "PV", meaning: "Present Value (current savings)", units: "Currency" },
      { symbol: "r", meaning: "Expected annual return", units: "Decimal" },
      { symbol: "n", meaning: "Contribution frequency per year", units: "Integer" },
      { symbol: "t", meaning: "Time horizon", units: "Years" }
    ],
    example: "Need $100k in 10 years, currently have $10k, expecting 6% return: PMT = (100000 - 10000(1.005)^120) × 0.005 / (1.005^120 - 1) ≈ $540.66 monthly",
    usedIn: "Goal Calculator, Retirement Planner",
    accentColor: "border-rose-500"
  },
  {
    title: "Quadratic Formula",
    icon: <FunctionSquare className="w-6 h-6" />,
    formula: "x = (-b ± √(b² - 4ac)) / 2a",
    composition: "Solves quadratic equations of the form ax² + bx + c = 0 by completing the square.",
    terms: [
      { symbol: "x", meaning: "Roots of the equation", units: "Varies" },
      { symbol: "a", meaning: "Quadratic coefficient", units: "Number (a ≠ 0)" },
      { symbol: "b", meaning: "Linear coefficient", units: "Number" },
      { symbol: "c", meaning: "Constant term", units: "Number" }
    ],
    example: "For x² - 5x + 6 = 0: a=1, b=-5, c=6. x = (5 ± √(25 - 24)) / 2. Roots are x=3 and x=2.",
    usedIn: "Equation Solver",
    accentColor: "border-orange-500"
  },
  {
    title: "Linear Equation",
    icon: <FunctionSquare className="w-6 h-6" />,
    formula: "ax + b = 0  →  x = -b/a",
    composition: "Basic algebraic rearrangement to isolate the variable x.",
    terms: [
      { symbol: "x", meaning: "Unknown variable", units: "Varies" },
      { symbol: "a", meaning: "Coefficient", units: "Number (a ≠ 0)" },
      { symbol: "b", meaning: "Constant", units: "Number" }
    ],
    example: "For 3x + 12 = 0: a=3, b=12. x = -12 / 3 = -4.",
    usedIn: "Equation Solver",
    accentColor: "border-yellow-500"
  },
  {
    title: "Derivative Power Rule",
    icon: <FunctionSquare className="w-6 h-6" />,
    formula: "d/dx[xⁿ] = n · xⁿ⁻¹",
    composition: "Fundamental rule of differential calculus for finding the derivative of a function of x raised to the power of n.",
    terms: [
      { symbol: "x", meaning: "Variable", units: "N/A" },
      { symbol: "n", meaning: "Exponent", units: "Real number" },
      { symbol: "d/dx", meaning: "Derivative with respect to x", units: "Rate of change" }
    ],
    example: "For f(x) = x³: The derivative is f'(x) = 3x².",
    usedIn: "Graphing Calculator (Calculus Mode)",
    accentColor: "border-indigo-500"
  }
];

const FormulaSection = ({ item }: { item: FormulaProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`mb-4 border-l-4 ${item.accentColor} bg-white dark:bg-gray-800 rounded-r-lg shadow-sm overflow-hidden transition-all duration-200`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:outline hover:outline-2 hover:outline-blue-400 hover:-outline-offset-2 transition-all focus:outline-none"
      >
        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
          <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
            {item.icon}
          </div>
          <h2 className="text-xl font-semibold text-left">{item.title}</h2>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 text-gray-700 dark:text-gray-300 space-y-6">
          
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-inner">
            <span className="text-2xl md:text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
              {item.formula}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              Formula Composition
            </h3>
            <p className="leading-relaxed">{item.composition}</p>
          </div>

          <div className="overflow-x-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Terms & Units</h3>
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <th className="py-2 px-3 font-semibold">Symbol</th>
                  <th className="py-2 px-3 font-semibold">Meaning</th>
                  <th className="py-2 px-3 font-semibold">Units</th>
                </tr>
              </thead>
              <tbody>
                {item.terms.map((term, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:outline hover:outline-1 hover:outline-blue-300 hover:-outline-offset-1">
                    <td className="py-2 px-3 font-mono font-bold">{term.symbol}</td>
                    <td className="py-2 px-3">{term.meaning}</td>
                    <td className="py-2 px-3 text-gray-500 dark:text-gray-400">{term.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Practical Example</h3>
            <p className="text-blue-800 dark:text-blue-300">{item.example}</p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Used in:</span>
            {item.usedIn}
          </div>

        </div>
      )}
    </div>
  );
};

export default function Learn() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Mathematical Formulas</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deep dive into the formulas powering our calculators. Understand the math behind your financial and scientific computations.
          </p>
        </header>

        <div className="space-y-4">
          {formulas.map((item, index) => (
            <FormulaSection key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
