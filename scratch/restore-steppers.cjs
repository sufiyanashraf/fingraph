const fs = require('fs');

function restoreSteppersInterest() {
  let content = fs.readFileSync('src/pages/InterestCalculator.tsx', 'utf8');
  
  content = content.replace(
    /<input type="number" min="0" value=\{principal\} onChange=\{e => setPrincipal\(Number\(e\.target\.value\) \|\| 0\)\} \n                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" \/>/,
    `<div className="flex items-center">
              <button onClick={() => setPrincipal(Math.max(0, principal - 1000))} className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="0" value={principal} onChange={e => setPrincipal(Number(e.target.value) || 0)} 
                   className="w-full text-center px-4 py-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setPrincipal(principal + 1000)} className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>`
  );

  content = content.replace(
    /<input type="number" step="0\.1" max="100" min="0" value=\{rate\} onChange=\{e => handleRateChange\(Number\(e\.target\.value\) \|\| 0\)\} \n                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" \/>/,
    `<div className="flex items-center">
              <button onClick={() => handleRateChange(rate - 0.5)} className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" step="0.1" max="100" min="0" value={rate} onChange={e => handleRateChange(Number(e.target.value) || 0)} 
                   className="w-full text-center px-4 py-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => handleRateChange(rate + 0.5)} className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>`
  );

  content = content.replace(
    /<input type="number" min="1" value=\{years\} onChange=\{e => setYears\(Number\(e\.target\.value\) \|\| 1\)\} \n                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" \/>/,
    `<div className="flex items-center">
              <button onClick={() => setYears(Math.max(1, years - 1))} className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" min="1" value={years} onChange={e => setYears(Number(e.target.value) || 1)} 
                   className="w-full text-center px-4 py-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setYears(years + 1)} className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>`
  );

  fs.writeFileSync('src/pages/InterestCalculator.tsx', content);
}

function restoreSteppersInvestment() {
  let content = fs.readFileSync('src/pages/InvestmentSimulator.tsx', 'utf8');

  // Helper to replace plain inputs with wrappers
  const wrap = (valName, stepFn, amt, step, min, max, baseClass) => {
    let inputRegex;
    if (max) {
       inputRegex = new RegExp(`<input type="number" step="${step}" max="${max}" min="${min}" value=\\{${valName}\\} onChange=\\{e => ${stepFn}\\(Math\\.min\\(${max}, Math\\.max\\(${min}, Number\\(e\\.target\\.value\\) \\|\\| 0\\)\\)\\)\\} \\n                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" \\/>`);
    } else {
       inputRegex = new RegExp(`<input type="number" ${step ? `step="${step}" ` : ''}${min!==null ? `min="${min}" ` : ''}value=\\{${valName}\\} onChange=\\{e => ${stepFn}\\(Number\\(e\\.target\\.value\\) \\|\\| ${min==1?1:0}\\)\\} \\n                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" \\/>`);
    }

    const replacement = `<div className="flex items-center">
              <button onClick={() => ${stepFn}(Math.max(${min||0}, ${valName} - ${amt}))} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              <input type="number" ${step ? `step="${step}" ` : ''}${max?`max="${max}" `:''}${min!==null?`min="${min}" `:''}value={${valName}} onChange={e => ${stepFn}(${max ? `Math.min(${max}, Math.max(${min||0}, Number(e.target.value) || 0))` : `Number(e.target.value) || ${min==1?1:0}`})} 
                   className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => ${stepFn}(${max ? `Math.min(${max}, ${valName} + ${amt})` : `${valName} + ${amt}`})} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>`;
            
    content = content.replace(inputRegex, replacement);
  };

  wrap('startingBalance', 'setStartingBalance', 1000, null, 0, null);
  wrap('monthlyContribution', 'setMonthlyContribution', 100, null, 0, null);
  wrap('expectedReturn', 'setExpectedReturn', 0.5, '0.1', 0, 100);
  wrap('years', 'setYears', 1, null, 1, null);
  wrap('annualIncrease', 'setAnnualIncrease', 0.5, '0.1', 0, null);
  wrap('inflation', 'setInflation', 0.5, '0.1', 0, null);
  wrap('annualFees', 'setAnnualFees', 0.1, '0.1', 0, null);

  fs.writeFileSync('src/pages/InvestmentSimulator.tsx', content);
}

restoreSteppersInterest();
restoreSteppersInvestment();
console.log('Restored');
