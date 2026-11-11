const fs = require('fs');

// --- Patch EquationSolver.tsx ---
let eqFile = fs.readFileSync('src/pages/EquationSolver.tsx', 'utf8');

// 1. Add Trash2 to imports
eqFile = eqFile.replace(
  "import { ImagePlus, Clock, ArrowRight, CheckCircle2, ChevronRight, Calculator as CalcIcon } from 'lucide-react';",
  "import { ImagePlus, Clock, ArrowRight, CheckCircle2, ChevronRight, Calculator as CalcIcon, Trash2 } from 'lucide-react';"
);

// 2. Change heading text and color
eqFile = eqFile.replace(
  '<h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">\n          Professional Equation Solver\n        </h1>',
  '<h1 className="text-4xl font-bold text-gray-900 dark:text-white">\n          Equation Solver\n        </h1>'
);

// 3. Add delete functions (we can just add them inline inside onClick)
// Replace history header to add Clear All button
eqFile = eqFile.replace(
  /<div className="flex items-center justify-between mb-6">\s*<h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">\s*<Clock className="w-5 h-5 mr-2 text-indigo-500" \/>\s*History\s*<\/h2>\s*<span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-1 rounded-full font-semibold">\{history\.length\}<\/span>\s*<\/div>/,
  `
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
  `
);

// Replace history map to add individual delete button
eqFile = eqFile.replace(
  /<button\s*key=\{idx\}\s*onClick=\{\(\) => \{\s*setEquation\(item\.eq\);\s*setResult\(item\.res\);\s*\}\}\s*className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900\/10 transition-all group"\s*>/g,
  `
                  <div key={idx} className="relative group/item">
                    <button 
                      onClick={() => {
                        setEquation(item.eq);
                        setResult(item.res);
                      }}
                      className="w-full text-left p-4 pr-10 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                    >
  `
);

// Close the div added above
eqFile = eqFile.replace(
  /<\/div>\s*<\/button>\s*\)\)\}/g,
  `
                      </div>
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
  `
);

fs.writeFileSync('src/pages/EquationSolver.tsx', eqFile);

// --- Patch BasicCalculator.tsx ---
let basicFile = fs.readFileSync('src/pages/BasicCalculator.tsx', 'utf8');

basicFile = basicFile.replace(
  '<h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-100">',
  '<h1 className="text-4xl font-normal text-white">'
);

fs.writeFileSync('src/pages/BasicCalculator.tsx', basicFile);
