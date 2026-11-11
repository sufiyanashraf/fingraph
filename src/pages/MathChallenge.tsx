import { useState } from 'react';
import { Play, RotateCcw, Gamepad2, Lightbulb, Zap, Brain, Flame, Skull } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface Question {
  text: string;
  answer: number;
  hint: string;
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateQuestion(difficulty: Difficulty): Question {
  if (difficulty === 'easy') {
    const type = randomInt(0, 2);
    if (type === 0) {
      const a = randomInt(1, 100);
      const b = randomInt(1, 100);
      return { text: `${a} + ${b} = ?`, answer: a + b, hint: 'Use addition.' };
    } else if (type === 1) {
      const a = randomInt(1, 100);
      const b = randomInt(1, a);
      return { text: `${a} - ${b} = ?`, answer: a - b, hint: 'Use subtraction.' };
    } else {
      const a = randomInt(1, 25);
      const b = randomInt(1, 25);
      return { text: `${a} × ${b} = ?`, answer: a * b, hint: 'Use multiplication.' };
    }
  } else if (difficulty === 'medium') {
    const type = randomInt(0, 2);
    if (type === 0) {
      const a = randomInt(100, 500);
      const b = randomInt(100, 500);
      return { text: `${a} + ${b} = ?`, answer: a + b, hint: 'Add hundreds, tens, then ones.' };
    } else if (type === 1) {
      const a = randomInt(5, 30);
      const b = randomInt(5, 30);
      const c = randomInt(2, 10);
      return { text: `(${a} + ${b}) × ${c} = ?`, answer: (a + b) * c, hint: 'Do parentheses first.' };
    } else {
      const b_val = randomInt(1, 20) * 100;
      const a_val = randomInt(1, 99);
      return { text: `What is ${a_val}% of ${b_val}?`, answer: (a_val * b_val) / 100, hint: 'Divide by 100, then multiply.' };
    }
  } else if (difficulty === 'hard') {
    const type = randomInt(0, 2);
    if (type === 0) {
      const a = randomInt(100, 2000);
      const b = randomInt(100, 2000);
      return { text: `${a} + ${b} = ?`, answer: a + b, hint: 'Large addition.' };
    } else if (type === 1) {
      const r1 = randomInt(1, 15);
      const r2 = randomInt(-10, 0);
      const b = -(r1 + r2);
      const c = r1 * r2;
      return { text: `Find the positive root of: x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`, answer: r1, hint: 'Factor the quadratic equation.' };
    } else {
      const a = randomInt(2, 8);
      const n = randomInt(2, 5);
      const x = randomInt(1, 4);
      return { text: `Evaluate d/dx [${a}x^${n}] at x = ${x}`, answer: a * n * Math.pow(x, n - 1), hint: 'Power rule: d/dx[cx^n] = c*n*x^(n-1).' };
    }
  } else {
    const type = randomInt(0, 3);
    if (type === 0) {
      const n = randomInt(1, 3);
      const coeff = randomInt(1, 5) * (n + 1);
      const a = randomInt(1, 4);
      return { text: `Evaluate the definite integral ∫ from 0 to ${a} of ${coeff}x^${n} dx`, answer: (coeff / (n + 1)) * Math.pow(a, n + 1), hint: 'Power rule for integration.' };
    } else if (type === 1) {
      const a = randomInt(2, 20);
      return { text: `Evaluate the limit as x approaches ${a} of (x² - ${a * a}) / (x - ${a})`, answer: 2 * a, hint: 'Factor the numerator (difference of squares) and cancel.' };
    } else if (type === 2) {
      const a = randomInt(2, 5);
      const b = randomInt(1, 5);
      const c = randomInt(1, 4);
      return { text: `Evaluate d/dx [(${a}x + ${b})²] at x = ${c}`, answer: 2 * a * (a * c + b), hint: 'Use the chain rule: d/dx[u²] = 2u * u\'' };
    } else {
      const x = randomInt(1, 10);
      const y = randomInt(1, 10);
      const z = randomInt(1, 10);
      const c1 = randomInt(2, 5);
      const c2 = randomInt(2, 5);
      return { text: `Evaluate ${c1}x²y - ${c2}z at x=${x}, y=${y}, z=${z}`, answer: c1 * x * x * y - c2 * z, hint: 'Substitute the given values into the expression.' };
    }
  }
}

export default function MathChallenge() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setScore(0);
    setStreak(0);
    setGameState('playing');
    setCurrentQuestion(generateQuestion(selectedDifficulty));
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || userAnswer === '') return;

    const numAnswer = parseInt(userAnswer, 10);
    if (numAnswer === currentQuestion.answer) {
      setScore(prev => prev + (showHint ? 5 : 10) + (streak * 2));
      setStreak(prev => prev + 1);
      setFeedback('correct');
      setTimeout(() => {
        setCurrentQuestion(generateQuestion(difficulty));
        setUserAnswer('');
        setFeedback(null);
        setShowHint(false);
      }, 1000);
    } else {
      setStreak(0);
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <Gamepad2 className="mx-auto h-16 w-16 text-blue-500" />
            <h2 className="mt-6 text-4xl font-extrabold">Math Challenge</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Select a difficulty to test your skills.</p>
          </div>
          
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => startGame('easy')}
              className="flex items-center text-left bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-green-400 dark:hover:border-green-500 transition-all group overflow-hidden relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-green-400 to-emerald-500" />
              <div className="ml-4 p-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-bold">Easy</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Addition & subtraction up to 100, basic multiplication.</p>
              </div>
            </button>

            <button
              onClick={() => startGame('medium')}
              className="flex items-center text-left bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-yellow-400 dark:hover:border-yellow-500 transition-all group overflow-hidden relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-400 to-orange-500" />
              <div className="ml-4 p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                <Brain size={32} />
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-bold">Medium</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Multi-step operations, percentages, numbers up to 500.</p>
              </div>
            </button>

            <button
              onClick={() => startGame('hard')}
              className="flex items-center text-left bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-red-400 dark:hover:border-red-500 transition-all group overflow-hidden relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-400 to-rose-500" />
              <div className="ml-4 p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                <Flame size={32} />
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-bold">Hard</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Quadratic equations, polynomials, numbers up to 2000.</p>
              </div>
            </button>

            <button
              onClick={() => startGame('expert')}
              className="flex items-center text-left bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-purple-500 dark:hover:border-purple-600 transition-all group overflow-hidden relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-purple-500 to-fuchsia-600" />
              <div className="ml-4 p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Skull size={32} />
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-2xl font-bold">Expert</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Integration, limits, chain rule, multi-variable.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGameState('start')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              title="Back to Menu"
            >
              <RotateCcw size={24} />
            </button>
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {difficulty} Mode
            </span>
          </div>
          <div className="flex gap-6 text-lg font-bold">
            <span className="text-blue-600 dark:text-blue-400">Score: {score}</span>
            <span className="text-orange-500 dark:text-orange-400 flex items-center gap-1">
              <Flame size={20} /> {streak}
            </span>
          </div>
        </div>

        {currentQuestion && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12 border border-gray-100 dark:border-gray-700">
            <h3 className="text-3xl md:text-5xl font-black text-center mb-12 tracking-tight">
              {currentQuestion.text}
            </h3>

            <form onSubmit={handleAnswerSubmit} className="space-y-8">
              <div>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className={`w-full text-center text-4xl p-6 rounded-2xl border-4 outline-none transition-all ${
                    feedback === 'correct'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : feedback === 'incorrect'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 bg-gray-50 dark:bg-gray-900'
                  }`}
                  placeholder="?"
                  autoFocus
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-colors shadow-md"
                >
                  <Play size={24} /> Submit Answer
                </button>
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  disabled={showHint}
                  className="sm:w-1/3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-4 rounded-xl font-semibold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Lightbulb size={24} /> Hint
                </button>
              </div>
            </form>

            {showHint && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <p className="text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Lightbulb size={20} className="text-blue-500" />
                  {currentQuestion.hint}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
