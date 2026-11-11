const fs = require('fs');
let file = fs.readFileSync('src/pages/GoalCalculator.tsx', 'utf8');

// Remove backslashes before backticks and $
file = file.replace(/\\\`/g, '`');
file = file.replace(/\\\$/g, '$');

fs.writeFileSync('src/pages/GoalCalculator.tsx', file);
