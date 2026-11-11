const fs = require('fs');

let file = fs.readFileSync('src/pages/GraphingCalculator.tsx', 'utf8');

// 1. Rename "Dynamic Viewport" to "Domain & Range (Viewport)"
file = file.replace(
  '<h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Dynamic Viewport</h2>',
  '<h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Domain & Range (Viewport)</h2>'
);

// 2. Fix the flex spilling in functions list
file = file.replace(
  /className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title=\{isVisible\[i\] \? "Hide Graph" : "Show Graph"\}/g,
  'className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shrink-0" title={isVisible[i] ? "Hide Graph" : "Show Graph"}'
);
file = file.replace(
  '<div className="font-mono text-gray-500 ml-1">f(x)=</div>',
  '<div className="font-mono text-gray-500 ml-1 shrink-0">f(x)=</div>'
);
file = file.replace(
  /className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm"/g,
  'className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm"'
);

// 3. Add Line Generator from points state & logic
const importReplace = "import { Plus, Trash2, Info, ArrowLeftRight, Eye, EyeOff, Edit2, X, Activity } from 'lucide-react';";
file = file.replace(/import \{ Plus, [^\}]+ \} from 'lucide-react';/, importReplace);

const stateInsert = `  const [domain, setDomain] = useState({ minX: -10, maxX: 10, minY: -10, maxY: 10 });
  const [point1, setPoint1] = useState({ x: 0, y: 0 });
  const [point2, setPoint2] = useState({ x: 1, y: 1 });

  const generateLineFromPoints = () => {
    if (point1.x === point2.x) {
      alert("Vertical lines (x = c) cannot be expressed as f(x).");
      return;
    }
    const m = (point2.y - point1.y) / (point2.x - point1.x);
    const b = point1.y - m * point1.x;
    
    let mStr = parseFloat(m.toFixed(4));
    let bStr = parseFloat(Math.abs(b).toFixed(4));
    const sign = b >= 0 ? '+' : '-';
    
    let funcStr = '';
    if (b === 0) funcStr = \`\${mStr} * x\`;
    else if (m === 0) funcStr = \`\${b}\`;
    else funcStr = \`\${mStr} * x \${sign} \${bStr}\`;
    
    setFunctions(['', ...functions]);
    handleUpdate(0, funcStr);
    setShowInverse([false, ...showInverse]);
    setIsVisible([true, ...isVisible]);
  };
`;
file = file.replace('  const [domain, setDomain] = useState({ minX: -10, maxX: 10, minY: -10, maxY: 10 });', stateInsert);

// 4. Add the Line Generator UI panel
const generatorUI = `
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Generate Line from 2 Points
            </h2>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Point 1 (X, Y)</label>
                  <div className="flex space-x-1">
                    <input type="number" value={point1.x} onChange={e => setPoint1({...point1, x: Number(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-center" placeholder="X1" />
                    <input type="number" value={point1.y} onChange={e => setPoint1({...point1, y: Number(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-center" placeholder="Y1" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Point 2 (X, Y)</label>
                  <div className="flex space-x-1">
                    <input type="number" value={point2.x} onChange={e => setPoint2({...point2, x: Number(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-center" placeholder="X2" />
                    <input type="number" value={point2.y} onChange={e => setPoint2({...point2, y: Number(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-center" placeholder="Y2" />
                  </div>
                </div>
              </div>
              <button onClick={generateLineFromPoints} className="w-full py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm">
                Generate f(x)
              </button>
            </div>
          </div>
`;

file = file.replace(
  '          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">',
  generatorUI + '\n          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-4">'
);

fs.writeFileSync('src/pages/GraphingCalculator.tsx', file);
