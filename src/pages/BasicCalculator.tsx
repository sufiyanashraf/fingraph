import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import * as math from 'mathjs';

export default function BasicCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isEvaluated, setIsEvaluated] = useState(false);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTyping, expression]);

  const handleInput = (val: string) => {
    if (isEvaluated) {
      if (['+', '-', '×', '÷', '^', '%'].includes(val)) {
        setExpression(result + val);
      } else {
        setExpression(val);
      }
      setIsEvaluated(false);
    } else {
      setExpression(prev => prev + val);
    }
    setIsTyping(true);
  };

  const calculate = () => {
    try {
      if (!expression) return;
      
      let evalExpr = expression;
      
      const countPipes = (evalExpr.match(/\|/g) || []).length;
      if (countPipes % 2 !== 0) {
        evalExpr += '|';
      }

      const openP = (evalExpr.match(/\(/g) || []).length;
      const closeP = (evalExpr.match(/\)/g) || []).length;
      for (let i = 0; i < openP - closeP; i++) {
        evalExpr += ')';
      }

      evalExpr = evalExpr
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/log\(/g, 'log10(')
        .replace(/ln\(/g, 'log(')
        .replace(/√\(/g, 'sqrt(')
        .replace(/π/g, 'pi')
        .replace(/\|([^|]+)\|/g, 'abs($1)')
        .replace(/sin\(/g, 'sin((pi/180)*')
        .replace(/cos\(/g, 'cos((pi/180)*')
        .replace(/tan\(/g, 'tan((pi/180)*')
        .replace(/asin\(/g, '(180/pi)*asin(')
        .replace(/acos\(/g, '(180/pi)*acos(')
        .replace(/atan\(/g, '(180/pi)*atan(');
      
      const res = math.evaluate(evalExpr);
      
      let formatted = math.format(res, { precision: 14 });
      if (Math.abs(res) < 1e-10) formatted = "0";

      setResult(formatted);
      setHistory([`${expression} = ${formatted}`, ...history].slice(0, 10));
      setIsTyping(true);
      setIsEvaluated(true);
    } catch (e) {
      setResult('Error');
      setIsTyping(true);
      setIsEvaluated(true);
    }
  };

  const toggleFraction = () => {
    if (result === 'Error' || !result) return;
    try {
      if (result.includes('/')) {
        const decimal = math.evaluate(result);
        let formatted = math.format(decimal, { precision: 14 });
        if (Math.abs(decimal as number) < 1e-10) formatted = "0";
        setResult(formatted);
      } else {
        const decimalVal = parseFloat(result);
        if (isNaN(decimalVal)) return;
        
        let bestNum = 1, bestDen = 1;
        let minError = Math.abs(decimalVal - 1);
        for (let d = 1; d <= 10000; d++) {
          let n = Math.round(decimalVal * d);
          let error = Math.abs(decimalVal - (n / d));
          if (error < minError) {
            minError = error;
            bestNum = n;
            bestDen = d;
            if (error < 1e-10) break;
          }
        }
        
        if (bestDen === 1) {
          setResult(bestNum.toString());
        } else {
          setResult(`${bestNum}/${bestDen}`);
        }
      }
    } catch (e) {
      // Ignored
    }
  };

  const clear = () => {
    setExpression('');
    setResult('0');
    setIsTyping(true);
    setIsEvaluated(false);
  };

  const backspace = () => {
    if (isEvaluated) {
      clear();
    } else {
      setExpression(prev => prev.slice(0, -1));
      setIsTyping(true);
    }
  };

  const handleMemory = (action: string) => {
    const currentVal = parseFloat(result);
    if (isNaN(currentVal) && action !== 'MR' && action !== 'MC') return;
    
    switch (action) {
      case 'M+': setMemory(memory + currentVal); break;
      case 'M-': setMemory(memory - currentVal); break;
      case 'MS': setMemory(currentVal); break;
      case 'MR': handleInput(memory.toString()); break;
      case 'MC': setMemory(0); break;
    }
    setIsTyping(true);
  };

  const sciFunctions = [
    { label: '√', val: '√(' },
    { label: 'xʸ', val: '^' },
    { label: 'x²', val: '^2' },
    { label: 'asin', val: 'asin(' },
    { label: 'acos', val: 'acos(' },
    { label: 'atan', val: 'atan(' },
    { label: '10ˣ', val: '10^' },
    { label: 'ln', val: 'ln(' },
    { label: 'log', val: 'log(' },
    { label: 'sin', val: 'sin(' },
    { label: 'cos', val: 'cos(' },
    { label: 'tan', val: 'tan(' },
    { label: '1/x', val: '1÷(' },
    { label: 'π', val: 'π' },
    { label: 'x!', val: '!' },
  ];

  const memButtons = ['M+', 'M-', 'MR', 'MS', 'MC'];

  const renderRichExpression = (str: string) => {
    if (!str) return '0';
    const nodes: React.ReactNode[] = [];
    let current = '';
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '^') {
        nodes.push(<span key={i}>{current}</span>);
        current = '';
        let j = i + 1;
        let supContent = '';
        let openBrackets = 0;
        while (j < str.length) {
          if (str[j] === '(') openBrackets++;
          else if (str[j] === ')') openBrackets--;
          
          if (openBrackets === 0 && ['+', '-', '×', '÷', '%', '^', '|'].includes(str[j])) {
            break;
          }
          supContent += str[j];
          j++;
        }
        nodes.push(
          <sup key={i + 'sup'} className="text-[0.55em] relative -top-5 ml-1 text-blue-300 bg-gray-800 rounded px-2 py-0.5 border border-gray-700 inline-block min-w-[24px] text-center shadow-inner">
            {supContent || '□'}
          </sup>
        );
        i = j - 1;
      } else if (str.substring(i, i+3) === '1÷(') {
        nodes.push(<span key={i}>{current}</span>);
        current = '';
        let j = i + 3;
        let fracContent = '';
        let openBrackets = 1;
        while (j < str.length) {
          if (str[j] === '(') openBrackets++;
          else if (str[j] === ')') openBrackets--;
          if (openBrackets === 0) break;
          fracContent += str[j];
          j++;
        }
        nodes.push(
          <div key={i + 'frac'} className="inline-flex flex-col items-center align-middle mx-2">
            <span className="text-[0.6em] border-b-2 border-gray-400 w-full text-center px-1">1</span>
            <span className="text-[0.6em] text-blue-300 bg-gray-800 rounded px-2 min-w-[24px] text-center shadow-inner">
              {fracContent || '□'}
            </span>
          </div>
        );
        if (str[j] === ')') i = j;
        else i = j - 1;
      } else if (str[i] === '|') {
        nodes.push(<span key={i}>{current}</span>);
        current = '';
        nodes.push(<span key={i + 'pipe'} className="mx-[1px] text-blue-400 font-light">|</span>);
      } else {
        current += str[i];
      }
    }
    nodes.push(<span key="end">{current}</span>);
    return <div className="flex items-center flex-wrap justify-end gap-y-2">{nodes}</div>;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        <h1 className="text-4xl font-normal text-gray-900 dark:text-white">
          Basic Calculator
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        <div className="xl:col-span-3 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col">
          
          <div className={`bg-gray-900 border-2 p-6 rounded-2xl mb-8 text-right font-mono min-h-[160px] flex flex-col justify-end shadow-inner relative transition-all duration-300 overflow-hidden ${isTyping ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 'border-gray-700'}`}>
            <div className="absolute top-4 left-4 text-xs text-gray-400 font-sans tracking-widest uppercase">
              {memory !== 0 ? `M: ${memory}` : ''}
              <span className="ml-4 text-blue-400 font-bold tracking-widest">DEG</span>
            </div>
            
            {isEvaluated ? (
              <>
                <div className="text-gray-500 text-xl md:text-2xl mb-2 min-h-[28px] break-all flex justify-end items-center gap-2">{renderRichExpression(expression)} <span className="text-gray-600">=</span></div>
                <div className="text-5xl md:text-6xl font-bold text-white break-all tracking-tight leading-tight">{result}</div>
              </>
            ) : (
              <>
                <div className="text-gray-500 text-xl md:text-2xl mb-2 min-h-[28px] break-all">{result !== '0' && result !== 'Error' ? `Ans: ${result}` : ''}</div>
                <div className="text-5xl md:text-6xl font-bold text-white break-all tracking-tight leading-tight">{renderRichExpression(expression)}</div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
            
            <div className="md:col-span-5 grid grid-cols-3 gap-3">
              {sciFunctions.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleInput(btn.val)}
                  className="py-3 bg-gradient-to-b from-gray-50 to-gray-200 text-gray-700 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300 hover:from-gray-100 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-md border border-gray-300 dark:border-gray-600"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="md:col-span-7 flex flex-col space-y-4">
              
              <div className="grid grid-cols-5 gap-2">
                {memButtons.map(btn => (
                  <button 
                    key={btn}
                    onClick={() => handleMemory(btn)}
                    className="py-2 bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 hover:brightness-110 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm border border-slate-300 dark:border-slate-600"
                  >
                    {btn}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3">
                <button onClick={toggleFraction} className="py-4 bg-gradient-to-b from-cyan-500 to-cyan-600 text-white rounded-xl font-bold text-lg hover:brightness-110 active:scale-95 transition-all shadow-md border border-cyan-700">F↔D</button>
                <button onClick={() => handleInput('(')} className="py-4 bg-gradient-to-b from-slate-200 to-slate-300 text-slate-800 dark:from-slate-600 dark:to-slate-700 dark:text-slate-100 rounded-xl font-bold text-xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-slate-400 dark:border-slate-500">(</button>
                <button onClick={() => handleInput(')')} className="py-4 bg-gradient-to-b from-slate-200 to-slate-300 text-slate-800 dark:from-slate-600 dark:to-slate-700 dark:text-slate-100 rounded-xl font-bold text-xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-slate-400 dark:border-slate-500">)</button>
                <button onClick={backspace} className="py-4 bg-gradient-to-b from-orange-400 to-orange-500 text-white rounded-xl font-bold text-lg hover:brightness-110 active:scale-95 transition-all shadow-md border border-orange-600">DEL</button>
                <button onClick={clear} className="py-4 bg-gradient-to-b from-red-500 to-red-600 text-white rounded-xl font-bold text-xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-red-700">C</button>
              </div>

              <div className="grid grid-cols-5 gap-3 flex-1">
                {['7', '8', '9'].map(btn => (
                  <button key={btn} onClick={() => handleInput(btn)} className="py-4 bg-gradient-to-b from-white to-gray-100 text-gray-900 dark:from-gray-800 dark:to-gray-900 dark:text-white rounded-xl font-bold text-2xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-gray-300 dark:border-gray-700">{btn}</button>
                ))}
                <button onClick={() => handleInput('÷')} className="py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl font-bold text-3xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-blue-700">÷</button>
                <button onClick={() => handleInput('%')} className="py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl font-bold text-2xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-blue-700">%</button>
                
                {['4', '5', '6'].map(btn => (
                  <button key={btn} onClick={() => handleInput(btn)} className="py-4 bg-gradient-to-b from-white to-gray-100 text-gray-900 dark:from-gray-800 dark:to-gray-900 dark:text-white rounded-xl font-bold text-2xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-gray-300 dark:border-gray-700">{btn}</button>
                ))}
                <button onClick={() => handleInput('×')} className="py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl font-bold text-3xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-blue-700">×</button>
                <button onClick={() => handleInput('exp(')} className="py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl font-bold text-xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-blue-700">exp</button>
                
                {['1', '2', '3'].map(btn => (
                  <button key={btn} onClick={() => handleInput(btn)} className="py-4 bg-gradient-to-b from-white to-gray-100 text-gray-900 dark:from-gray-800 dark:to-gray-900 dark:text-white rounded-xl font-bold text-2xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-gray-300 dark:border-gray-700">{btn}</button>
                ))}
                <button onClick={() => handleInput('-')} className="py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl font-bold text-4xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-blue-700">-</button>
                
                <button onClick={() => handleInput('|')} className="py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl font-bold text-xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-blue-700">|x|</button>
                
                <button onClick={() => handleInput('0')} className="py-4 bg-gradient-to-b from-white to-gray-100 text-gray-900 dark:from-gray-800 dark:to-gray-900 dark:text-white rounded-xl font-bold text-2xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-gray-300 dark:border-gray-700">0</button>
                <button onClick={() => handleInput('.')} className="py-4 bg-gradient-to-b from-white to-gray-100 text-gray-900 dark:from-gray-800 dark:to-gray-900 dark:text-white rounded-xl font-bold text-3xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-gray-300 dark:border-gray-700">.</button>
                <button onClick={calculate} className="py-4 bg-gradient-to-b from-green-500 to-green-600 text-white rounded-xl font-bold text-3xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-green-700">=</button>
                <button onClick={() => handleInput('+')} className="py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl font-bold text-3xl hover:brightness-110 active:scale-95 transition-all shadow-md border border-blue-700">+</button>
              </div>

            </div>
          </div>
        </div>

        <div className="xl:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 h-[500px] xl:h-auto overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Calculations</h2>
            {history.length > 0 && (
              <button onClick={() => setHistory([])} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-semibold">Clear</button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {history.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500 mt-10">
                <p>No history yet.</p>
                <p className="text-sm mt-2">Calculations will appear here.</p>
              </div>
            ) : (
              history.map((item, i) => {
                const [exp, res] = item.split(' = ');
                return (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 text-right group hover:border-blue-400 dark:hover:border-blue-500 transition-colors shadow-sm">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-all flex justify-end items-center flex-wrap">{renderRichExpression(exp)}</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white break-all">{res}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
