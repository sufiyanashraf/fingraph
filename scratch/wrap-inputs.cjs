const fs = require('fs');

function wrapInputs(file, stateMappings) {
  let content = fs.readFileSync(file, 'utf8');

  stateMappings.forEach(mapping => {
    const regex = new RegExp(`(<label[^>]*>.*?${mapping.label}.*?<\\/label>\\s*)(<input[^>]+>)`, 'g');
    
    content = content.replace(regex, (match, labelHtml, inputHtml) => {
      if (inputHtml.includes('button onClick=')) return match;
      
      let cleanInput = inputHtml
        .replace(/className="[^"]+"/, `className="w-full text-center px-3 py-2 border-y border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"`)
        .replace(/style=\{\{.*?\}\}/, '');
      
      const minBound = mapping.min !== undefined ? `Math.max(${mapping.min}, ` : '';
      const minBoundClose = mapping.min !== undefined ? `)` : '';
      
      const maxBound = mapping.max !== undefined ? `Math.min(${mapping.max}, ` : '';
      const maxBoundClose = mapping.max !== undefined ? `)` : '';

      const decreaseExpr = `${minBound}${mapping.state} - ${mapping.amt}${minBoundClose}`;
      const increaseExpr = `${maxBound}${mapping.state} + ${mapping.amt}${maxBoundClose}`;
      
      const setterOpen = mapping.setterOpen || `${mapping.setter}(`;
      const setterClose = mapping.setterClose || `)`;

      const wrapped = `${labelHtml}<div className="flex items-center">
              <button onClick={() => ${setterOpen}${decreaseExpr}${setterClose}} className="px-3 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition font-bold">-</button>
              ${cleanInput}
              <button onClick={() => ${setterOpen}${increaseExpr}${setterClose}} className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition font-bold">+</button>
            </div>`;
            
      return wrapped;
    });
  });

  fs.writeFileSync(file, content);
}

wrapInputs('src/pages/InvestmentSimulator.tsx', [
  { label: 'Starting Balance', state: 'startingBalance', setter: 'setStartingBalance', amt: 1000, min: 0 },
  { label: 'Monthly Contribution', state: 'monthlyContribution', setter: 'setMonthlyContribution', amt: 100, min: 0 },
  { label: 'Expected Annual Return', state: 'expectedReturn', setter: 'setExpectedReturn', amt: 0.5, min: 0, max: 100 },
  { label: 'Years', state: 'years', setter: 'setYears', amt: 1, min: 1 },
  { label: 'Annual Contribution Increase', state: 'annualIncrease', setter: 'setAnnualIncrease', amt: 0.5, min: 0 },
  { label: 'Inflation Rate', state: 'inflation', setter: 'setInflation', amt: 0.5, min: 0 },
  { label: 'Annual Fees', state: 'annualFees', setter: 'setAnnualFees', amt: 0.1, min: 0 }
]);

wrapInputs('src/pages/MonteCarloSimulator.tsx', [
  { label: 'Initial Investment', state: 'params.initialInvestment', setterOpen: 'setParams({ ...params, initialInvestment: ', setterClose: ' })', amt: 1000, min: 0 },
  { label: 'Monthly Contribution', state: 'params.monthlyContribution', setterOpen: 'setParams({ ...params, monthlyContribution: ', setterClose: ' })', amt: 100, min: 0 },
  { label: 'Expected Annual Return', state: 'params.expectedAnnualReturnPercent', setterOpen: 'setParams({ ...params, expectedAnnualReturnPercent: ', setterClose: ' })', amt: 0.5, min: 0, max: 100 },
  { label: 'Annual Volatility', state: 'params.annualVolatilityPercent', setterOpen: 'setParams({ ...params, annualVolatilityPercent: ', setterClose: ' })', amt: 0.5, min: 0, max: 100 },
  { label: 'Time Horizon', state: 'params.years', setterOpen: 'setParams({ ...params, years: ', setterClose: ' })', amt: 1, min: 1 }
]);

wrapInputs('src/pages/GoalCalculator.tsx', [
  { label: 'Target Amount', state: 'targetAmount', setter: 'setTargetAmount', amt: 1000, min: 0 },
  { label: 'Starting Balance', state: 'startingBalance', setter: 'setStartingBalance', amt: 1000, min: 0 },
  { label: 'Time Horizon', state: 'years', setter: 'setYears', amt: 1, min: 1 },
  { label: 'Expected Annual Return', state: 'expectedReturn', setter: 'setExpectedReturn', amt: 0.5, min: 0, max: 100 }
]);

console.log('Wrapped files');
