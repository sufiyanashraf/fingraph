const fs = require('fs');

const files = [
  'src/pages/ScenarioComparison.tsx',
  'src/pages/MonteCarloSimulator.tsx',
  'src/pages/InvestmentSimulator.tsx',
  'src/pages/InterestCalculator.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Try to insert the hook correctly
  // Look for `export default function ` ... `() {`
  const match = content.match(/export default function [^{]+\{\r?\n/);
  if (match && !content.includes('const { currency } = useCurrency();')) {
    const insertPos = match.index + match[0].length;
    content = content.slice(0, insertPos) + "  const { currency } = useCurrency();\n" + content.slice(insertPos);
  }

  fs.writeFileSync(file, content);
});

// Fix GoalCalculator import
let goal = fs.readFileSync('src/pages/GoalCalculator.tsx', 'utf8');
goal = goal.replace('../calculations/goalCalculator', '../calculations/goalCalculation');
fs.writeFileSync('src/pages/GoalCalculator.tsx', goal);

console.log('Fixed hook and import');
