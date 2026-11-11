import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Keyboard, Camera } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import BasicCalculator from './BasicCalculator';
import EquationSolver from './EquationSolver';
import GraphingCalculator from './GraphingCalculator';
import MathCalculator from './MathCalculator';
import LimitCalculator from '../components/LimitCalculator';
import ContinuityCalculator from '../components/ContinuityCalculator';
import DifferentiationCalculator from '../components/DifferentiationCalculator';
import ApplicationsOfDerivativesCalculator from '../components/ApplicationsOfDerivativesCalculator';
import IntegrationCalculator from '../components/IntegrationCalculator';
import DefiniteIntegralCalculator from '../components/DefiniteIntegralCalculator';
import DifferentialEquationsHub from '../components/DifferentialEquationsHub';
import MultivariableCalculusHub from '../components/MultivariableCalculusHub';
import AlgebraLearningHub from '../components/AlgebraLearningHub';
import SequenceIntroTab from '../components/sequences/tabs/SequenceIntroTab';
import ArithmeticProgressionTab from '../components/sequences/tabs/ArithmeticProgressionTab';
import GeometricProgressionTab from '../components/sequences/tabs/GeometricProgressionTab';
import ArithmeticMeanTab from '../components/sequences/tabs/ArithmeticMeanTab';
import GeometricMeanTab from '../components/sequences/tabs/GeometricMeanTab';
import HarmonicMeanTab from '../components/sequences/tabs/HarmonicMeanTab';
import TrigFunctionsTab from '../components/trig/TrigFunctionsTab';
import InverseTrigTab from '../components/trig/InverseTrigTab';
import UnitCircleTab from '../components/trig/UnitCircleTab';
import Coordinate2DTab from '../components/coordinate/Coordinate2DTab';
import Coordinate3DTab from '../components/coordinate/Coordinate3DTab';
import DescriptiveStatsTab from '../components/stats/DescriptiveStatsTab';
import ProbabilityTab from '../components/stats/ProbabilityTab';
import MatrixAlgebraTab from '../components/vectors/MatrixAlgebraTab';
import VectorOpsTab from '../components/vectors/VectorOpsTab';
import MathVirtualKeyboard from '../components/MathVirtualKeyboard';
import ProblemScanModal from '../components/ProblemScanModal';

type CategoryId =
  | 'calculus'
  | 'algebra'
  | 'equations'
  | 'basic'
  | 'graphing'
  | 'trig'
  | 'coordinate'
  | 'stats'
  | 'vectors'
  | 'sequences';

interface CategoryConfig {
  id: CategoryId;
  label: string;
  subtopics: { id: string; label: string; desc: string }[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'calculus',
    label: 'Calculus',
    subtopics: [
      { id: 'limits', label: 'Limits', desc: 'Understand change and accumulation, the mathematics behind motion, growth, optimisation and finance.' },
      { id: 'continuity', label: 'Continuity', desc: 'Analyze piecewise continuity and limits at boundary points.' },
      { id: 'derivatives', label: 'Derivatives', desc: 'Find instant rates of change and tangent slopes for arbitrary functions.' },
      { id: 'app_derivatives', label: 'Applications of Derivatives', desc: 'Locate local maxima, minima, inflection points, and rates.' },
      { id: 'integration', label: 'Integration', desc: 'Compute symbolic anti-derivatives and areas under curves.' },
      { id: 'definite_integrals', label: 'Definite Integrals', desc: 'Evaluate numerical definite integrals over specific intervals [a, b].' },
      { id: 'differential_equations', label: 'Differential Equations', desc: 'Solve first and second order differential systems.' },
      { id: 'multivariable', label: 'Multivariable Calculus', desc: 'Partial derivatives, gradient vectors, and multiple integrals.' },
    ],
  },
  {
    id: 'algebra',
    label: 'Algebra',
    subtopics: [
      { id: 'basics', label: 'Algebra Basics', desc: 'Variables, constants, coefficients, like terms, and PEMDAS.' },
      { id: 'expressions', label: 'Algebraic Expressions', desc: 'Expanding, FOIL, factoring, and algebraic identities.' },
      { id: 'polynomials', label: 'Polynomials', desc: 'Degrees, the zero polynomial, long & synthetic division, and roots.' },
      { id: 'roots', label: 'Roots and Radicals', desc: 'Simplifying radicals, index notation, and rationalizing denominators.' },
      { id: 'quadratics', label: 'Quadratic Equations', desc: 'Parabolas, vertex, completing the square, formula, and discriminant.' },
      { id: 'linear', label: 'Linear Equations', desc: 'Solving equations, slope, intercepts, and linear graphing.' },
      { id: 'systems', label: 'Systems of Equations', desc: 'Simultaneous equations, substitution, elimination, and intersections.' },
      { id: 'inequalities', label: 'Inequalities', desc: 'Linear & compound inequalities, number lines, and sign flip rules.' },
      { id: 'sequences', label: 'Sequences and Series', desc: 'Arithmetic & geometric progressions, nth terms, and infinite sums.' },
      { id: 'functions', label: 'Functions', desc: 'Domain, range, function notation f(x), composition, and inverses.' },
      { id: 'exponents_logs', label: 'Exponents & Logarithms', desc: 'Laws of exponents, logarithms, and exponential-log conversions.' },
      { id: 'rational', label: 'Rational Expressions', desc: 'Polynomial fractions, excluded values, and simplifying rational forms.' },
      { id: 'complex', label: 'Complex Numbers', desc: 'Imaginary unit i, complex plane, conjugates, and standard form a + bi.' },
      { id: 'advanced', label: 'Advanced Algebra', desc: 'Matrix operations, determinants, inverses, and higher algebraic theorems.' },
    ],
  },
  {
    id: 'equations',
    label: 'Equations',
    subtopics: [
      { id: 'solver', label: 'Equation Solver', desc: 'Step-by-step algebraic equation solving with detailed derivations.' },
    ],
  },
  {
    id: 'basic',
    label: 'Basic Calc',
    subtopics: [
      { id: 'calculator', label: 'Basic Calculator', desc: 'Clean, reliable arithmetic, exponential, and scientific calculations.' },
    ],
  },
  {
    id: 'graphing',
    label: 'Graphing',
    subtopics: [
      { id: 'plotter', label: 'Interactive Graphing', desc: 'Plot single or multi-variable curves, inspect roots and extrema.' },
    ],
  },
  {
    id: 'trig',
    label: 'Trigonometry',
    subtopics: [
      { id: 'standard', label: 'Trigonometric Functions', desc: 'Sine, Cosine, Tangent evaluations across radians and degrees with reciprocal functions.' },
      { id: 'inverse', label: 'Inverse Trigonometry', desc: 'Arcsin, Arccos, and Arctan with principal range limits and exact angles.' },
      { id: 'unit_circle', label: 'Unit Circle Explorer', desc: 'Coordinate points (cos θ, sin θ) and interactive angle explorer on the unit circle.' },
    ],
  },
  {
    id: 'coordinate',
    label: 'Coordinate Geometry',
    subtopics: [
      { id: 'plane2d', label: '2D Coordinates', desc: 'Distance formula, slope, midpoint, line equations, and triangle area in 2D.' },
      { id: 'space3d', label: '3D Geometry', desc: '3D point distances, section formula ratios, and direction cosines in space.' },
    ],
  },
  {
    id: 'stats',
    label: 'Statistics and Probability',
    subtopics: [
      { id: 'summary', label: 'Descriptive Statistics', desc: 'Mean, median, mode, sample & population variance, standard deviation, and range.' },
      { id: 'prob', label: 'Combinatorics & Prob', desc: 'Permutations nPr, combinations nCr, factorials, and event probability calculations.' },
    ],
  },
  {
    id: 'vectors',
    label: 'Vectors and Matrices',
    subtopics: [
      { id: 'matrices', label: 'Matrix Algebra', desc: 'Determinants (2×2, 3×3), matrix addition, multiplication, transposes, and inverses.' },
      { id: 'vec_ops', label: 'Vector Operations', desc: 'Vector magnitude, dot product, cross product, angles between vectors, and unit vectors.' },
    ],
  },
  {
    id: 'sequences',
    label: 'Sequences and Series',
    subtopics: [
      { id: 'intro', label: 'Definition of Sequences', desc: 'Understanding ordered lists of numbers, general nth-term rules, and series summation.' },
      { id: 'ap', label: 'Arithmetic Progression', desc: 'Constant common difference d, nth terms, and Gauss summation of AP series.' },
      { id: 'gp', label: 'Geometric Progression', desc: 'Constant common ratio r, exponential scaling, finite sums, and sum to infinity.' },
      { id: 'am', label: 'Arithmetic Mean', desc: 'Single arithmetic mean, inserting k means between numbers, and average calculations.' },
      { id: 'gm', label: 'Geometric Mean', desc: 'Multiplicative central tendency, inserting k geometric means, and proportional scaling.' },
      { id: 'hm', label: 'Harmonic Mean', desc: 'Reciprocal mean for rates, harmonic progressions, and the AM ≥ GM ≥ HM inequality.' },
    ],
  },
];

export default function StudyMaths({
  defaultCategory,
  defaultSubtopic
}: {
  defaultCategory?: CategoryId;
  defaultSubtopic?: string;
} = {}) {
  const [searchParams] = useSearchParams();
  const urlCat = searchParams.get('cat') as CategoryId | null;

  const isAlgebra =
    defaultCategory !== 'sequences' &&
    (defaultCategory === 'algebra' ||
      defaultSubtopic === 'algebra' ||
      [
        'basics',
        'expressions',
        'polynomials',
        'roots',
        'quadratics',
        'linear',
        'systems',
        'inequalities',
        'functions',
        'exponents_logs',
        'rational',
        'complex',
        'advanced'
      ].includes(defaultSubtopic || ''));

  const initialCatId: CategoryId =
    urlCat && CATEGORIES.some((c) => c.id === urlCat)
      ? urlCat
      : defaultCategory === 'sequences' || defaultSubtopic === 'sequences'
      ? 'sequences'
      : isAlgebra
      ? 'algebra'
      : defaultCategory || 'calculus';

  const [activeCatId, setActiveCatId] = useState<CategoryId>(initialCatId);
  const activeCategory = CATEGORIES.find((c) => c.id === activeCatId) || CATEGORIES[0];
  const resolvedSubtopic =
    defaultSubtopic === 'diff' || defaultSubtopic === 'differentiation'
      ? 'derivatives'
      : defaultSubtopic === 'app_derivatives' || defaultSubtopic === 'applications' || defaultSubtopic === 'optimization'
      ? 'app_derivatives'
      : defaultSubtopic === 'definite_integrals' || defaultSubtopic === 'definite-integrals' || defaultSubtopic === 'definite' || defaultSubtopic === 'definite-integral'
      ? 'definite_integrals'
      : defaultSubtopic === 'integration' || defaultSubtopic === 'integrals'
      ? 'integration'
      : defaultSubtopic === 'differential_equations' || defaultSubtopic === 'differential-equations' || defaultSubtopic === 'diff-eq' || defaultSubtopic === 'ode'
      ? 'differential_equations'
      : defaultSubtopic === 'multivariable' || defaultSubtopic === 'multivariable-calculus' || defaultSubtopic === 'multivariable_calculus' || defaultSubtopic === 'mvc'
      ? 'multivariable'
      : defaultSubtopic;
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>(
    resolvedSubtopic && activeCategory.subtopics.some((s) => s.id === resolvedSubtopic)
      ? resolvedSubtopic
      : activeCategory.subtopics[0].id
  );

  // Virtual Math Keyboard & Picture Scan Modals
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const currentSubtopic =
    activeCategory.subtopics.find((s) => s.id === activeSubtopicId) || activeCategory.subtopics[0];

  // Universal keyboard handlers to insert characters into whichever input is active
  const handleKeyboardInsert = (char: string) => {
    const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      const start = activeEl.selectionStart ?? activeEl.value.length;
      const end = activeEl.selectionEnd ?? activeEl.value.length;
      const val = activeEl.value;
      const nextVal = val.substring(0, start) + char + val.substring(end);
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(activeEl, nextVal);
      } else {
        activeEl.value = nextVal;
      }
      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      activeEl.dispatchEvent(new Event('change', { bubbles: true }));
      setTimeout(() => {
        activeEl.focus();
        activeEl.setSelectionRange(start + char.length, start + char.length);
      }, 0);
    }
  };

  const handleKeyboardDelete = () => {
    const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      const start = activeEl.selectionStart ?? activeEl.value.length;
      const end = activeEl.selectionEnd ?? activeEl.value.length;
      if (start > 0 || start !== end) {
        const deleteCount = start === end ? 1 : 0;
        const newStart = Math.max(0, start - deleteCount);
        const nextVal = activeEl.value.substring(0, newStart) + activeEl.value.substring(end);
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        if (nativeSetter) nativeSetter.call(activeEl, nextVal);
        else activeEl.value = nextVal;
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        activeEl.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(() => {
          activeEl.focus();
          activeEl.setSelectionRange(newStart, newStart);
        }, 0);
      }
    }
  };

  const handleKeyboardClear = () => {
    const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      if (nativeSetter) nativeSetter.call(activeEl, '');
      else activeEl.value = '';
      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      activeEl.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  return (
    <div className="min-h-screen bg-[#060c1d] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <SiteHeader currentSection="Study Maths" />

      {/* Horizontal Category Nav */}
      <div className="w-full bg-[#081226] border-b border-[#132244] px-4 sm:px-8 py-2 overflow-x-auto scrollbar-hide flex items-center gap-1 sm:gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCatId;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCatId(cat.id);
                setActiveSubtopicId(cat.subtopics[0].id);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#0e1e3e]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-[#070f22] border-b md:border-b-0 md:border-r border-[#132244] p-4 sm:p-6 shrink-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold mb-3">
            CLASS 11–12 AND BEYOND
          </div>
          <h2 className="text-xl font-serif text-white mb-4">{activeCategory.label}</h2>

          <nav className="space-y-1">
            {activeCategory.subtopics.map((sub) => {
              const isSelected = sub.id === activeSubtopicId;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubtopicId(sub.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1833]'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 mb-2">
            Study Maths / {activeCategory.label} / <span className="text-blue-300">{currentSubtopic.label}</span>
          </div>

          {/* Subtopic Header & Tool Utility Bar (Keyboard + Picture option) */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-white font-normal mb-2">
                {currentSubtopic.label}
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {currentSubtopic.desc}
              </p>
            </div>

            {/* Quick Math Keyboard and Picture / Scan Option Toolbar */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isKeyboardOpen
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                    : 'bg-[#0b162f] hover:bg-[#12244a] text-slate-300 hover:text-white border-[#162c57]'
                }`}
                title="Toggle On-Screen Mathematical Keyboard"
              >
                <Keyboard className="w-3.5 h-3.5 text-blue-400" />
                <span>Math Keyboard</span>
              </button>

              <button
                type="button"
                onClick={() => setIsScanModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0b162f] hover:bg-[#12244a] text-slate-300 hover:text-white border border-[#162c57] transition-all cursor-pointer"
                title="Upload or scan a photo of your math problem"
              >
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                <span>Scan / Picture</span>
              </button>
            </div>
          </div>

          {/* Dynamic Tool Renderer */}
          <div className="mb-10">
            {activeCatId === 'basic' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <BasicCalculator />
              </div>
            ) : activeCatId === 'equations' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <EquationSolver />
              </div>
            ) : activeCatId === 'graphing' ? (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <GraphingCalculator />
              </div>
            ) : activeCatId === 'calculus' && activeSubtopicId === 'limits' ? (
              <LimitCalculator />
            ) : activeCatId === 'calculus' && activeSubtopicId === 'continuity' ? (
              <ContinuityCalculator />
            ) : activeCatId === 'calculus' && (activeSubtopicId === 'derivatives' || activeSubtopicId === 'diff' || activeSubtopicId === 'differentiation') ? (
              <DifferentiationCalculator />
            ) : activeCatId === 'calculus' && (activeSubtopicId === 'app_derivatives' || activeSubtopicId === 'applications_of_derivatives' || activeSubtopicId === 'applications' || activeSubtopicId === 'optimization') ? (
              <ApplicationsOfDerivativesCalculator />
            ) : activeCatId === 'calculus' && (activeSubtopicId === 'integration' || activeSubtopicId === 'integrals') ? (
              <IntegrationCalculator />
            ) : activeCatId === 'calculus' && (activeSubtopicId === 'definite_integrals' || activeSubtopicId === 'definite-integrals' || activeSubtopicId === 'definite') ? (
              <DefiniteIntegralCalculator />
            ) : activeCatId === 'calculus' && (activeSubtopicId === 'differential_equations' || activeSubtopicId === 'diff_eq' || activeSubtopicId === 'ode') ? (
              <DifferentialEquationsHub />
            ) : activeCatId === 'calculus' && (activeSubtopicId === 'multivariable' || activeSubtopicId === 'multivariable_calculus') ? (
              <MultivariableCalculusHub />
            ) : activeCatId === 'algebra' ? (
              <AlgebraLearningHub />
            ) : activeCatId === 'sequences' && (activeSubtopicId === 'intro' || activeSubtopicId === 'definition') ? (
              <SequenceIntroTab />
            ) : activeCatId === 'sequences' && activeSubtopicId === 'ap' ? (
              <ArithmeticProgressionTab />
            ) : activeCatId === 'sequences' && activeSubtopicId === 'gp' ? (
              <GeometricProgressionTab />
            ) : activeCatId === 'sequences' && activeSubtopicId === 'am' ? (
              <ArithmeticMeanTab />
            ) : activeCatId === 'sequences' && activeSubtopicId === 'gm' ? (
              <GeometricMeanTab />
            ) : activeCatId === 'sequences' && activeSubtopicId === 'hm' ? (
              <HarmonicMeanTab />
            ) : activeCatId === 'sequences' ? (
              <ArithmeticProgressionTab />
            ) : activeCatId === 'trig' && activeSubtopicId === 'inverse' ? (
              <InverseTrigTab />
            ) : activeCatId === 'trig' && activeSubtopicId === 'unit_circle' ? (
              <UnitCircleTab />
            ) : activeCatId === 'trig' ? (
              <TrigFunctionsTab />
            ) : activeCatId === 'coordinate' && activeSubtopicId === 'space3d' ? (
              <Coordinate3DTab />
            ) : activeCatId === 'coordinate' ? (
              <Coordinate2DTab />
            ) : activeCatId === 'stats' && activeSubtopicId === 'prob' ? (
              <ProbabilityTab />
            ) : activeCatId === 'stats' ? (
              <DescriptiveStatsTab />
            ) : activeCatId === 'vectors' && activeSubtopicId === 'vec_ops' ? (
              <VectorOpsTab />
            ) : activeCatId === 'vectors' ? (
              <MatrixAlgebraTab />
            ) : (
              <div className="bg-[#0b162f] rounded-2xl border border-[#162c57] p-2 sm:p-4">
                <MathCalculator />
              </div>
            )}
          </div>

          {/* 3 Summary Cards at Bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#132244]">
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Lessons</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Clear explanations in plain language, with worked examples for every step.
              </p>
            </div>
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Visual explorer</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Drag, zoom and change values to see the idea move in front of you.
              </p>
            </div>
            <div className="bg-[#081226] border border-[#14264c] rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-200">Practice</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Solve problems at your own pace and check each answer right away.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Universal Math Virtual Keyboard */}
      <MathVirtualKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onInsert={handleKeyboardInsert}
        onDelete={handleKeyboardDelete}
        onClear={handleKeyboardClear}
      />

      {/* Picture / Problem Scanner Modal */}
      <ProblemScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        categoryTitle={activeCategory.label}
        onApplyProblem={(problemText) => {
          const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
          if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
            const nativeSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              'value'
            )?.set;
            if (nativeSetter) nativeSetter.call(activeEl, problemText);
            else activeEl.value = problemText;
            activeEl.dispatchEvent(new Event('input', { bubbles: true }));
            activeEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }}
      />
    </div>
  );
}
