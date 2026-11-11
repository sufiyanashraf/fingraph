const fs = require('fs');

let file = fs.readFileSync('src/pages/GraphingCalculator.tsx', 'utf8');

// I will parse the JSX correctly or rather just revert and apply the change properly.
// But we can also check the current state.
console.log(file.split('\\n').map((l, i) => \`\${i+1}: \${l}\`).slice(240, 260).join('\\n'));
console.log('-----');
console.log(file.split('\\n').map((l, i) => \`\${i+1}: \${l}\`).slice(330, 360).join('\\n'));
