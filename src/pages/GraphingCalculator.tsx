import { useState, useMemo, useEffect } from 'react';
import * as math from 'mathjs';
import Plot from 'react-plotly.js';
import { Plus, Trash2, Info, ArrowLeftRight, Eye, EyeOff, Edit2, X, Activity, Play, Sparkles } from 'lucide-react';

export default function GraphingCalculator() {
  const initialDefault = ['x^2', 'sin(x)^2', 'cos(x)^2'];
  const [functions, setFunctions] = useState<string[]>(initialDefault);
  const [appliedFunctions, setAppliedFunctions] = useState<string[]>(initialDefault);
  const [isRunning, setIsRunning] = useState(false);
  const [showInverse, setShowInverse] = useState<boolean[]>([false, false, false]);
  const [isVisible, setIsVisible] = useState<boolean[]>([true, true, true]);
  
  const [domain] = useState({ minX: -10, maxX: 10, minY: -10, maxY: 10 });
  const [point1, setPoint1] = useState({ x: 0, y: 0 });
  const [point2, setPoint2] = useState({ x: 1, y: 1 });

  const handleRun = () => {
    setIsRunning(true);
    setAppliedFunctions([...functions]);
    setTimeout(() => setIsRunning(false), 250);
  };

  const handleAddTrigSquare = (expr: string = 'sin(x)^2') => {
    const newFuncs = [expr, ...functions];
    setFunctions(newFuncs);
    setAppliedFunctions(newFuncs);
    setShowInverse([false, ...showInverse]);
    setIsVisible([true, ...isVisible]);
  };

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
    if (b === 0) funcStr = `${mStr} * x`;
    else if (m === 0) funcStr = `${b}`;
    else funcStr = `${mStr} * x ${sign} ${bStr}`;
    
    const newFuncs = [funcStr, ...functions];
    setFunctions(newFuncs);
    setAppliedFunctions(newFuncs);
    setShowInverse([false, ...showInverse]);
    setIsVisible([true, ...isVisible]);
  };

  const [selectedCurve, setSelectedCurve] = useState<number | null>(null);
  
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === 'class') setIsDark(document.documentElement.classList.contains('dark'));
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  const handleAdd = () => {
    const newFuncs = ['', ...functions];
    setFunctions(newFuncs);
    setAppliedFunctions(newFuncs);
    setShowInverse([false, ...showInverse]);
    setIsVisible([true, ...isVisible]);
  };
  
  const handleUpdate = (index: number, val: string) => {
    const newF = [...functions];
    newF[index] = val;
    setFunctions(newF);
  };
  
  const handleRemove = (index: number) => {
    const newF = functions.filter((_, i) => i !== index);
    setFunctions(newF);
    setAppliedFunctions(appliedFunctions.filter((_, i) => i !== index));
    setShowInverse(showInverse.filter((_, i) => i !== index));
    setIsVisible(isVisible.filter((_, i) => i !== index));
    if (selectedCurve !== null) setSelectedCurve(null);
  };

  const toggleInverse = (index: number) => {
    const newInv = [...showInverse];
    newInv[index] = !newInv[index];
    setShowInverse(newInv);
  };

  const toggleVisible = (index: number) => {
    const newVis = [...isVisible];
    newVis[index] = !newVis[index];
    setIsVisible(newVis);
  };

  const analyzeFunction = (funcStr: string, compiled: any, xVals: number[], yVals: number[]) => {
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
      limits = `x→+∞: ${lInf} | x→-∞: ${lNegInf}`;
    } catch {
      limits = "Undefined";
    }

    if (funcStr.includes('sin') || funcStr.includes('cos')) {
      const isSquared = funcStr.includes('^2') || funcStr.includes('²') || funcStr.includes('^ 2');
      type = isSquared ? "Square of Trigonometric" : "Trigonometric";
      rangeStr = isSquared ? '[0, 1]' : '[-1, 1]';
      domainStr = '(-∞, ∞)';
    } else if (funcStr.includes('tan')) {
      const isSquared = funcStr.includes('^2') || funcStr.includes('²') || funcStr.includes('^ 2');
      type = isSquared ? "Square of Trigonometric" : "Trigonometric";
      rangeStr = isSquared ? '[0, ∞)' : '(-∞, ∞)';
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
        vertex = `Min around (${math.format(xVals[yVals.indexOf(minY)], {precision:2})}, ${math.format(minY, {precision:2})})`;
        rangeStr = `[${math.format(minY, {precision:2})}, ∞)`;
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

    return { type, yIntercept, roots: roots.slice(0,3).map(r => math.format(r, {precision:2})).join(', ') || 'None in view', vertex, limits, domain: domainStr, range: rangeStr };
  };

  const chartData = useMemo(() => {
    const steps = 400; 
    const step = (domain.maxX - domain.minX) / steps;
    const x = Array.from({length: steps + 1}, (_, i) => domain.minX + i * step);
    
    let allSeries: any[] = [];
    let validEvaluations: {name: string, y: number[]}[] = [];

    appliedFunctions.forEach((rawFuncStr, idx) => {
      let y: number[] = [];
      let name = `f(x) = ${rawFuncStr}`;
      let analysis = null;
      try {
        if (!rawFuncStr.trim()) throw new Error('Empty');
        // Normalize any trigonometric square syntax (sin^2(x) or sin²(x)) into (sin(x))^2 for mathjs
        const normalized = rawFuncStr
          .replace(/(sin|cos|tan|sec|csc|cot)\^2\(([^)]+)\)/gi, '($1($2))^2')
          .replace(/(sin|cos|tan|sec|csc|cot)²\(([^)]+)\)/gi, '($1($2))^2');

        const compiled = math.compile(normalized);
        y = x.map(xVal => {
          try {
            const res = compiled.evaluate({ x: xVal });
            if (res && res.im !== undefined) return NaN;
            return typeof res === 'number' ? res : NaN;
          } catch { return NaN; }
        });
        analysis = analyzeFunction(rawFuncStr, compiled, x, y);
      } catch (e) {
        y = Array(x.length).fill(NaN);
        name = 'Invalid Expression';
      }
      
      const isValid = name !== 'Invalid Expression' && y.some(v => !Number.isNaN(v));
      if (isValid) {
        validEvaluations.push({name, y});

        if (isVisible[idx]) {
          allSeries.push({
            name,
            x,
            y,
            type: 'scatter',
            mode: 'lines',
            line: { color: colors[idx % colors.length], width: 2 },
            originalIndex: idx,
            analysis,
            funcStr: rawFuncStr,
            hovertemplate: `(%{x:.2f}, %{y:.2f})<extra>${name}</extra>`,
          });

          if (showInverse[idx]) {
            allSeries.push({
              name: `Inverse of ${rawFuncStr}`,
              x: y,
              y: x,
              type: 'scatter',
              mode: 'lines',
              line: { color: colors[idx % colors.length], width: 2, dash: 'dash' },
              originalIndex: idx,
              analysis: { type: 'Inverse', yIntercept: 'See original root', roots: 'See original y-intercept', vertex: 'Swapped', limits: 'Swapped domain/range' },
              funcStr: `Inverse`,
              hovertemplate: `(%{x:.2f}, %{y:.2f})<extra>Inverse</extra>`,
            });
          }
        }
      }
    });

    if (validEvaluations.length >= 2 && isVisible[0] && isVisible[1]) {
      const y1 = validEvaluations[0].y;
      const y2 = validEvaluations[1].y;
      const intersectionsX: number[] = [];
      const intersectionsY: number[] = [];

      for (let i = 1; i < x.length; i++) {
        const diff1 = y1[i-1] - y2[i-1];
        const diff2 = y1[i] - y2[i];
        if (!isNaN(diff1) && !isNaN(diff2)) {
          if ((diff1 <= 0 && diff2 >= 0) || (diff1 >= 0 && diff2 <= 0)) {
            intersectionsX.push(x[i]);
            intersectionsY.push(y1[i]);
          }
        }
      }

      if (intersectionsX.length > 0) {
        allSeries.push({
          name: 'Intersections',
          x: intersectionsX,
          y: intersectionsY,
          mode: 'markers',
          type: 'scatter',
          marker: { color: 'red', size: 8, symbol: 'circle-open', line: { width: 2 } },
          hoverinfo: 'none'
        });
      }
    }
    
    return allSeries;
  }, [appliedFunctions, domain, showInverse, isVisible]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Graphing Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4 flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Functions</h2>
            
            {/* Square of Trigonometric Function presets */}
            <div className="mb-3 p-2.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/80">
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1.5 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
                Square of Trig Functions:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button 
                  type="button"
                  onClick={() => handleAddTrigSquare('sin(x)^2')}
                  className="px-2 py-1 text-xs font-mono font-semibold bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded border border-blue-300 dark:border-blue-700 transition-colors shadow-2xs text-center"
                  title="Add sin²(x) [sin(x)^2]"
                >
                  + sin²(x)
                </button>
                <button 
                  type="button"
                  onClick={() => handleAddTrigSquare('cos(x)^2')}
                  className="px-2 py-1 text-xs font-mono font-semibold bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded border border-blue-300 dark:border-blue-700 transition-colors shadow-2xs text-center"
                  title="Add cos²(x) [cos(x)^2]"
                >
                  + cos²(x)
                </button>
                <button 
                  type="button"
                  onClick={() => handleAddTrigSquare('tan(x)^2')}
                  className="px-2 py-1 text-xs font-mono font-semibold bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded border border-blue-300 dark:border-blue-700 transition-colors shadow-2xs text-center"
                  title="Add tan²(x) [tan(x)^2]"
                >
                  + tan²(x)
                </button>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleAdd}
              className="mb-3 flex items-center justify-center w-full py-2 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg text-blue-600 dark:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Function
            </button>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {functions.map((f, i) => (
                <div key={i} className="flex flex-col space-y-2 p-3 border-2 rounded-lg border-blue-400/80 dark:border-blue-500/70 hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-blue-50/20 dark:bg-blue-950/20 shadow-xs">
                  <div className="flex items-center space-x-1.5">
                    <button onClick={() => toggleVisible(i)} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded shrink-0" title={isVisible[i] ? "Hide Graph" : "Show Graph"}>
                      {isVisible[i] ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    </button>
                    <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">f(x)=</div>
                    <input 
                      type="text" 
                      value={f}
                      onChange={(e) => handleUpdate(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
                      className="flex-1 min-w-0 px-2 py-1 border border-blue-300 dark:border-blue-600 rounded dark:bg-gray-700 dark:text-white font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. sin(x)^2"
                    />
                    <button onClick={() => handleRemove(i)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded shrink-0 transition-colors" title="Delete Function">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pl-8 pt-0.5">
                    <button 
                      type="button"
                      onClick={() => toggleInverse(i)}
                      className={`text-[11px] px-2 py-0.5 rounded transition-colors ${showInverse[i] ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 font-semibold' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      <ArrowLeftRight className="w-3 h-3 inline mr-1" />
                      Inverse
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        const cur = f.trim();
                        let squared = '';
                        if (cur.match(/^(sin|cos|tan)\(x\)$/i)) {
                          squared = `${cur}^2`;
                        } else if (cur.endsWith('^2')) {
                          squared = cur;
                        } else {
                          squared = `(${cur || 'sin(x)'})^2`;
                        }
                        handleUpdate(i, squared);
                      }}
                      className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors font-mono font-medium"
                      title="Square this function (e.g. sin(x) -> sin(x)^2)"
                    >
                      Square (²)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Run Button at the bottom of the functions box */}
            <button
              type="button"
              onClick={handleRun}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 text-sm"
              title="Compile and plot all functions"
            >
              <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Plotting...' : 'Run'}</span>
            </button>
          </div>
          

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
                    <input type="number" value={point1.x} onChange={e => setPoint1({...point1, x: Number(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="X1" />
                    <input type="number" value={point1.y} onChange={e => setPoint1({...point1, y: Number(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="Y1" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Point 2 (X, Y)</label>
                  <div className="flex space-x-1">
                    <input type="number" value={point2.x} onChange={e => setPoint2({...point2, x: Number(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="X2" />
                    <input type="number" value={point2.y} onChange={e => setPoint2({...point2, y: Number(e.target.value)||0})} className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="Y2" />
                  </div>
                </div>
              </div>
              <button onClick={generateLineFromPoints} className="w-full py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm">
                Generate f(x)
              </button>
            </div>
          </div>

          
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
                    {chartData.find(s => s.name === 'Intersections')?.x.map((xVal: any, i: number) => (
                      <div key={i}>Point {i+1}: ({math.format(xVal, {precision:3})}, {math.format(chartData.find(s => s.name === 'Intersections')?.y[i], {precision:3})})</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[600px] overflow-hidden relative">
            {chartData.length > 0 ? (
              <Plot
                data={chartData}
                layout={{
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  xaxis: {
                    zeroline: true, zerolinecolor: isDark ? '#4b5563' : '#9ca3af', zerolinewidth: 2,
                    gridcolor: isDark ? '#374151' : '#e5e7eb',
                    range: [domain.minX, domain.maxX],
                    title: { text: 'X Axis', font: { color: isDark ? '#9ca3af' : '#4b5563' } },
                    tickfont: { color: isDark ? '#9ca3af' : '#4b5563' },
                  },
                  yaxis: {
                    zeroline: true, zerolinecolor: isDark ? '#4b5563' : '#9ca3af', zerolinewidth: 2,
                    gridcolor: isDark ? '#374151' : '#e5e7eb',
                    range: [domain.minY, domain.maxY],
                    title: { text: 'Y Axis', font: { color: isDark ? '#9ca3af' : '#4b5563' } },
                    tickfont: { color: isDark ? '#9ca3af' : '#4b5563' },
                  },
                  legend: { font: { color: isDark ? '#e5e7eb' : '#111827' }, orientation: 'h', y: -0.1 },
                  margin: { t: 20, l: 40, r: 20, b: 40 },
                  autosize: true,
                  hovermode: 'closest'
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ displayModeBar: false, responsive: true }}
                onClick={(e) => {
                  if (e.points && e.points.length > 0) {
                    setSelectedCurve(e.points[0].curveNumber);
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Enter and show a valid function to see the graph.
              </div>
            )}
          </div>

          {selectedCurve !== null && chartData[selectedCurve] && chartData[selectedCurve].originalIndex !== undefined && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 flex items-center">
                  Selected Graph: <span className="ml-2 px-2 py-1 bg-white dark:bg-gray-800 rounded font-mono shadow-sm">{chartData[selectedCurve].name}</span>
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Manage this function directly below the graph.</p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button 
                  onClick={() => {
                    const origIndex = chartData[selectedCurve].originalIndex;
                    const el = document.querySelectorAll('input')[origIndex];
                    if (el) {
                      el.focus();
                      el.select();
                    }
                  }} 
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </button>
                <button 
                  onClick={() => handleRemove(chartData[selectedCurve].originalIndex)} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
                <button 
                  onClick={() => setSelectedCurve(null)} 
                  className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
               <Info className="w-5 h-5 mr-2" />
               Graph Explanations & Properties
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {chartData.filter(s => s.analysis).map((series, idx) => (
                 <div key={idx} className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                   <h3 className="font-bold text-lg mb-2" style={{color: series.line?.color}}>{series.name}</h3>
                   <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                     <li><strong>Type:</strong> {series.analysis.type}</li>
                     <li><strong>Limits:</strong> {series.analysis.limits}</li>
                     <li><strong>Y-Intercept:</strong> {series.analysis.yIntercept}</li>
                     <li><strong>Est. X-Intercepts:</strong> {series.analysis.roots}</li>
                     {series.analysis.vertex !== 'None' && <li><strong>Vertex/Extrema:</strong> {series.analysis.vertex}</li>}
                   </ul>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
