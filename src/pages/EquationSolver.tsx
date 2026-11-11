import { useState, useRef } from 'react';

import type { SolverResult } from '../math/equationSolver';
import { solveEquation } from '../math/equationSolver';
import { ImagePlus, Clock, ArrowRight, CheckCircle2, ChevronRight, Calculator as CalcIcon, Trash2 } from 'lucide-react';

export default function EquationSolver() {
  const [equation, setEquation] = useState('2x + 4 = 10');
  const [result, setResult] = useState<SolverResult | null>(null);
  const [history, setHistory] = useState<{ eq: string, res: SolverResult }[]>([]);
  const [imageUploaded, setImageUploaded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSolve = (eqToSolve: string = equation) => {
    if (!eqToSolve.trim()) return;
    const res = solveEquation(eqToSolve);
    setResult(res);
    if (res.type !== 'error') {
      setHistory(prev => [{ eq: eqToSolve, res }, ...prev].slice(0, 10));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageUploaded(true);
      // In a real app, this would use OCR to extract math.
      // For now, we simulate extraction.
      setTimeout(() => {
        setEquation('x^2 - 5x + 6 = 0');
        setImageUploaded(false);
      }, 1000);
    }
  };

  const getExplanationText = (res: SolverResult) => {
    if (res.type === 'linear') return "This is a linear equation. The goal is to isolate the variable on one side by performing inverse operations—subtracting/adding terms, and then dividing by the coefficient.";
    if (res.type === 'quadratic') return "This is a quadratic equation. It is solved by setting the equation to zero (standard form ax² + bx + c = 0) and then applying the quadratic formula to find the roots. The discriminant (Δ) tells us how many real solutions exist.";
    return "This equation type is unsupported or contains an error.";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Equation Solver
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Step-by-step mathematical solutions and deep analysis.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Solver Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Enhanced Input Area */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              Enter your equation
            </label>
            
            <div className="relative group">
              <input 
                type="text" 
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSolve(equation)}
                className="w-full pl-6 pr-32 py-6 text-3xl md:text-4xl font-bold border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white font-mono placeholder-gray-300 dark:placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] transition-all"
                placeholder="e.g. 2x + 4 = 10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button 
                  onClick={() => handleSolve(equation)}
                  className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center transform hover:scale-105 active:scale-95"
                >
                  <CalcIcon className="w-6 h-6 mr-2" />
                  SOLVE
                </button>
              </div>
            </div>

            {/* Image Upload Option */}
            <div className="mt-6 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mr-3 transition-colors" />
              <span className="text-gray-500 group-hover:text-blue-600 font-medium">
                {imageUploaded ? "Processing image..." : "Scan or upload an image of your equation"}
              </span>
            </div>
          </div>

          {/* Results Area */}
          {result && (
            <div className={`rounded-2xl border shadow-lg overflow-hidden ${result.type === 'error' || result.type === 'unsupported' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
              
              <div className={`p-6 border-b ${result.type === 'error' ? 'border-red-200 dark:border-red-900/50' : 'border-gray-100 dark:border-gray-700'} flex items-center`}>
                <CheckCircle2 className={`w-8 h-8 mr-3 ${result.type === 'error' ? 'text-red-500' : 'text-green-500'}`} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.type === 'error' ? 'Error Solving Equation' : 'Solution Overview'}
                </h2>
              </div>
              
              <div className="p-8 space-y-8">
                
                {/* 1. Final Answer (Bold) */}
                {result.solutions.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/50">
                    <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-4 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Final Answer
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {result.solutions.map((sol, i) => (
                        <div key={i} className="text-4xl font-extrabold font-mono text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-900 shadow-sm py-4 px-6 rounded-xl border border-blue-200 dark:border-blue-800">
                          {sol}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Text Explanation */}
                {result.type !== 'error' && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                      Conceptual Explanation
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {getExplanationText(result)}
                    </p>
                  </div>
                )}

                {/* 3. Mathematical Solution (Step-by-step) */}
                {result.explanation.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center">
                      <ChevronRight className="w-5 h-5 mr-1" />
                      Step-by-step Mathematical Solution
                    </h3>
                    <div className="space-y-3">
                      {result.explanation.map((step, i) => (
                        <div key={i} className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold rounded-full mr-4">
                            {i + 1}
                          </div>
                          <div className="text-lg text-gray-700 dark:text-gray-200 font-mono py-1">
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Right Side: History */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-6">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                History
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-1 rounded-full font-semibold">{history.length}</span>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Clear History">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
  
            
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 italic">
                Your past equations will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, idx) => (
                  
                  <div key={idx} className="relative group/item">
                    <button 
                      onClick={() => {
                        setEquation(item.eq);
                        setResult(item.res);
                      }}
                      className="w-full text-left p-4 pr-10 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                    >
  
                    <div className="font-mono text-sm text-gray-800 dark:text-gray-200 font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.eq}
                    </div>
                    {item.res.solutions.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {item.res.solutions.join(' | ')}
                      </div>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHistory(h => h.filter((_, i) => i !== idx));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
