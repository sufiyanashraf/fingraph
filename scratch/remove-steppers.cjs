const fs = require('fs');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all <div className="flex items-center"> blocks containing - and + buttons
  // We use [\s\S]*? to match across newlines
  const regex = /<div className="flex items-center">[\s\S]*?<button[^>]+>-<\/button>[\s\S]*?(<input[^>]+>)[\s\S]*?<button[^>]+>\+<\/button>[\s\S]*?<\/div>/g;
  
  content = content.replace(regex, (match, inputHtml) => {
    return inputHtml
      .replace('text-center', '')
      .replace('border-y', 'border')
      .replace('focus:outline-none', 'focus:ring-2 focus:ring-blue-500 rounded-lg')
      .replace(/style=\{\{.*?\}\}/, '')
      .replace('  ', ' ');
  });

  fs.writeFileSync(filePath, content);
}

cleanFile('src/pages/InterestCalculator.tsx');
cleanFile('src/pages/InvestmentSimulator.tsx');
console.log('Cleaned');
