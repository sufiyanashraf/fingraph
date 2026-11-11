const fs = require('fs');

let file = fs.readFileSync('src/pages/GraphingCalculator.tsx', 'utf8');

const analyzeFuncStart = `  const analyzeFunction = (funcStr: string, compiled: any, xVals: number[], yVals: number[]) => {`;
const analyzeFuncEnd = `return { type, yIntercept, roots: roots.slice(0,3).map(r => math.format(r, {precision:2})).join(', ') || 'None in view', vertex, limits };`;

const newAnalyzeFunc = `  const analyzeFunction = (funcStr: string, compiled: any, xVals: number[], yVals: number[]) => {
    let type = "Curve";
    let yIntercept = "None";
    let roots: number[] = [];
    let vertex = "None";
    let limits = "Unknown";
    let domainStr = '(-∞, ∞)';
    let rangeStr = '(-∞, ∞)';

    if (!funcStr) return { type, yIntercept, roots, vertex, limits, domain: domainStr, range: rangeStr };

    try {
      const y0 = compiled.evaluate({ x: 0 });
      if (typeof y0 === 'number' && !isNaN(y0)) yIntercept = math.format(y0, {precision: 4});
    } catch {}

    for (let i = 1; i < xVals.length; i++) {
      if ((yVals[i-1] <= 0 && yVals[i] >= 0) || (yVals[i-1] >= 0 && yVals[i] <= 0)) {
        if (!isNaN(xVals[i])) roots.push(xVals[i]);
      }
    }

    try {
      const yInf = compiled.evaluate({ x: 1e10 });
      const yNegInf = compiled.evaluate({ x: -1e10 });
      let lInf = typeof yInf === 'number' ? (Math.abs(yInf) > 1e9 ? '±∞' : math.format(yInf, {precision: 2})) : 'DNE';
      let lNegInf = typeof yNegInf === 'number' ? (Math.abs(yNegInf) > 1e9 ? '±∞' : math.format(yNegInf, {precision: 2})) : 'DNE';
      limits = \`x→+∞: \${lInf} | x→-∞: \${lNegInf}\`;
    } catch {
      limits = "Undefined";
    }

    if (funcStr.includes('sin') || funcStr.includes('cos')) {
      type = "Trigonometric";
      rangeStr = '[-1, 1]';
    } else if (funcStr.includes('tan')) {
      type = "Trigonometric";
      domainStr = 'x ≠ (2n+1)π/2';
    } else if (funcStr.includes('log') || funcStr.includes('ln')) {
      type = "Logarithmic";
      domainStr = '(0, ∞)';
    } else if (funcStr.includes('e^') || funcStr.includes('^x')) {
      type = "Exponential";
      rangeStr = '(0, ∞)';
    } else if (funcStr.includes('x^3')) {
      type = "Cubic";
    } else if (funcStr.includes('x^2')) {
      type = "Quadratic";
      const validY = yVals.filter(y => !isNaN(y));
      if (validY.length > 0) {
        const minY = Math.min(...validY);
        vertex = \`Min around (\${math.format(xVals[yVals.indexOf(minY)], {precision:2})}, \${math.format(minY, {precision:2})})\`;
        rangeStr = \`[\${math.format(minY, {precision:2})}, ∞)\`;
      }
    } else if (funcStr.includes('1/x')) {
      type = "Rational";
      domainStr = 'x ≠ 0';
      rangeStr = 'y ≠ 0';
    } else if (funcStr.includes('x')) {
      type = "Linear";
    } else {
      type = "Constant / Other";
    }

    return { type, yIntercept, roots: roots.slice(0,3).map(r => math.format(r, {precision:2})).join(', ') || 'None in view', vertex, limits, domain: domainStr, range: rangeStr };`;

file = file.replace(file.substring(file.indexOf(analyzeFuncStart), file.indexOf(analyzeFuncEnd) + analyzeFuncEnd.length), newAnalyzeFunc);


file = file.replace(
  /<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-4">\s*<h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Domain & Range \(Viewport\)<\/h2>[\s\S]*?<\/div>\s*<\/div>/,
  `
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <Info className="w-5 h-5 mr-2 text-indigo-500" />
              Domain, Range & Intersection
            </h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {chartData.filter(s => s.analysis).map((series, idx) => (
                <div key={idx} className="pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <h3 className="font-bold text-sm mb-1" style={{color: series.line?.color}}>{series.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div><span className="font-semibold text-gray-800 dark:text-gray-300">Domain:</span> {series.analysis.domain}</div>
                    <div><span className="font-semibold text-gray-800 dark:text-gray-300">Range:</span> {series.analysis.range}</div>
                  </div>
                </div>
              ))}
              
              {chartData.find(s => s.name === 'Intersections') && (
                <div className="pt-2">
                  <h3 className="font-bold text-sm text-red-500 mb-1">Intersection Points:</h3>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {chartData.find(s => s.name === 'Intersections').x.map((xVal, i) => (
                      <div key={i}>Point {i+1}: ({math.format(xVal, {precision:3})}, {math.format(chartData.find(s => s.name === 'Intersections').y[i], {precision:3})})</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
  `
);

fs.writeFileSync('src/pages/GraphingCalculator.tsx', file);
