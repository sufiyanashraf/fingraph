const fs = require('fs');

const files = [
  'src/pages/ScenarioComparison.tsx',
  'src/pages/MonteCarloSimulator.tsx',
  'src/pages/InvestmentSimulator.tsx',
  'src/pages/InterestCalculator.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Add imports if not present
  if (!content.includes('useCurrency')) {
    const importStatements = `import CurrencySelector from '../components/CurrencySelector';\nimport { useCurrency } from '../hooks/useCurrency';\n`;
    // Find the last import
    const lastImportIndex = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf('\\n', lastImportIndex) + 1;
    content = content.slice(0, endOfLastImport) + importStatements + content.slice(endOfLastImport);
  }

  // 2. Add hook inside the component
  // Find "export default function "
  const functionMatch = content.match(/export default function \w+\(\) \{\n/);
  if (functionMatch && !content.includes('const { currency } = useCurrency();')) {
    const insertPos = functionMatch.index + functionMatch[0].length;
    content = content.slice(0, insertPos) + "  const { currency } = useCurrency();\n" + content.slice(insertPos);
  }

  // 3. Replace formatCurrency(x) with formatCurrency(x, currency)
  // Careful not to replace formatCurrency(x, y)
  content = content.replace(/formatCurrency\(([^,]+?)\)/g, 'formatCurrency($1, currency)');

  // 4. Inject <CurrencySelector />
  // We'll put it right after the </h1> tag, wrapped in a flex container if needed, 
  // or just replace </h1> with </h1>\n      <div className="mt-4"><CurrencySelector /></div>
  if (!content.includes('<CurrencySelector />')) {
    content = content.replace(/(<\/h1>)/, '$1\n      <div className="mt-4"><CurrencySelector /></div>');
  }

  fs.writeFileSync(file, content);
});

console.log("Patched all files.");
