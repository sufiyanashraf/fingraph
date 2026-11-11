const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function walk(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const reactHooks = [];
      if (content.includes('useState(')) reactHooks.push('useState');
      if (content.includes('useEffect(')) reactHooks.push('useEffect');
      if (content.includes('useMemo(')) reactHooks.push('useMemo');
      
      // if (reactHooks.length > 0 && !content.includes('from \'react\'')) {
      // we'll just prepend the import
      if (reactHooks.length > 0) {
        content = `import { ${reactHooks.join(', ')} } from 'react';\n` + content;
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

walk(dir);
