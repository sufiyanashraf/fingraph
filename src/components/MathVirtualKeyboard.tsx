import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Delete, RotateCcw, Copy, Check } from 'lucide-react';

interface MathVirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (char: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

type TabKey = '123' | 'symbols' | 'abc' | 'greek';

export default function MathVirtualKeyboard({
  isOpen,
  onClose,
  onInsert,
  onDelete,
  onClear,
}: MathVirtualKeyboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('123');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0c1833] border-t-2 border-[#1c3970] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] animate-slide-up select-none max-h-[46vh] sm:max-h-[42vh] overflow-y-auto">
      {/* Top Bar: Tabs + Actions */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 bg-[#081226] border-b border-[#14264c]">
        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('123')}
            className={`px-3 py-1 rounded text-xs font-semibold tracking-wide transition-all ${
              activeTab === '123'
                ? 'bg-blue-600 text-white shadow-sm border-b-2 border-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-[#0f2042]'
            }`}
          >
            123
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('symbols')}
            className={`px-3 py-1 rounded text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'symbols'
                ? 'bg-blue-600 text-white shadow-sm border-b-2 border-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-[#0f2042]'
            }`}
          >
            ∞ ≠ ∈
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('abc')}
            className={`px-3 py-1 rounded text-xs font-serif italic tracking-wide transition-all ${
              activeTab === 'abc'
                ? 'bg-blue-600 text-white shadow-sm border-b-2 border-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-[#0f2042]'
            }`}
          >
            abc
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('greek')}
            className={`px-3 py-1 rounded text-xs font-serif tracking-wide transition-all ${
              activeTab === 'greek'
                ? 'bg-blue-600 text-white shadow-sm border-b-2 border-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-[#0f2042]'
            }`}
          >
            α β γ
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#0f2042] rounded transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#0f2042] rounded transition-colors"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-[#10234a] hover:bg-[#163168] rounded border border-[#1d3c75] transition-colors ml-2"
            title="Close Keyboard"
          >
            <span>Hide</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Keys Container */}
      <div className="p-2 sm:p-3 max-w-4xl mx-auto">
        {/* TAB 1: 123 Numeric / Calculus keypad (Matching Image 1) */}
        {activeTab === '123' && (
          <div className="grid grid-cols-11 sm:grid-cols-12 gap-1.5 text-sm sm:text-base font-medium">
            {/* Left Column Variables */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <KeyBtn label="x" onClick={() => onInsert('x')} fontSerif />
              <KeyBtn label="y" onClick={() => onInsert('y')} fontSerif />
              <KeyBtn label="≤" onClick={() => onInsert(' <= ')} />
              <KeyBtn label="[" onClick={() => onInsert('[')} />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <KeyBtn label="a" onClick={() => onInsert('a')} fontSerif />
              <KeyBtn label="b" onClick={() => onInsert('b')} fontSerif />
              <KeyBtn label="≥" onClick={() => onInsert(' >= ')} />
              <KeyBtn label="]" onClick={() => onInsert(']')} />
            </div>

            {/* Central Numbers Block (7 8 9, 4 5 6, 1 2 3, 0) */}
            <div className="col-span-4 grid grid-cols-3 gap-1.5">
              <KeyBtn label="7" onClick={() => onInsert('7')} isNum />
              <KeyBtn label="8" onClick={() => onInsert('8')} isNum />
              <KeyBtn label="9" onClick={() => onInsert('9')} isNum />

              <KeyBtn label="4" onClick={() => onInsert('4')} isNum />
              <KeyBtn label="5" onClick={() => onInsert('5')} isNum />
              <KeyBtn label="6" onClick={() => onInsert('6')} isNum />

              <KeyBtn label="1" onClick={() => onInsert('1')} isNum />
              <KeyBtn label="2" onClick={() => onInsert('2')} isNum />
              <KeyBtn label="3" onClick={() => onInsert('3')} isNum />

              <KeyBtn label="0" onClick={() => onInsert('0')} isNum />
              <KeyBtn label="." onClick={() => onInsert('.')} />
              <KeyBtn label="," onClick={() => onInsert(',')} />
            </div>

            {/* Operations Column */}
            <div className="col-span-1 flex flex-col gap-1.5">
              <KeyBtn label="1/□" onClick={() => onInsert('1/')} isBlue />
              <KeyBtn label="×" onClick={() => onInsert('*')} isBlue />
              <KeyBtn label="±" onClick={() => onInsert('-')} />
              <KeyBtn label="+" onClick={() => onInsert('+')} isBlue />
            </div>

            {/* Right Functions Block (ln, sin, powers, root, trash) */}
            <div className="col-span-2 sm:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <KeyBtn label="ln" onClick={() => onInsert('ln(')} />
              <KeyBtn label="i" onClick={() => onInsert('i')} />
              <KeyBtn label="sin" onClick={() => onInsert('sin(')} />

              <KeyBtn label="□²" onClick={() => onInsert('^2')} />
              <KeyBtn label="□³" onClick={() => onInsert('^3')} />
              <KeyBtn label="√□" onClick={() => onInsert('sqrt(')} />

              <KeyBtn label="□⁻¹" onClick={() => onInsert('^(-1)')} />
              <KeyBtn label="∫" onClick={() => onInsert('integrate(')} />
              <KeyBtn label="lim" onClick={() => onInsert('lim ')} isBlue />

              <KeyBtn label="∞" onClick={() => onInsert('inf')} />
              <KeyBtn label="(" onClick={() => onInsert('(')} />
              <button
                type="button"
                onClick={onClear}
                className="p-2 sm:p-2.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow-sm"
                title="Clear All"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Symbols (Matching Image 2) */}
        {activeTab === 'symbols' && (
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 text-xs sm:text-sm font-medium">
            <KeyBtn label="sin" sub="sin⁻¹" onClick={() => onInsert('sin(')} />
            <KeyBtn label="cos" sub="cos⁻¹" onClick={() => onInsert('cos(')} />
            <KeyBtn label="tan" sub="tan⁻¹" onClick={() => onInsert('tan(')} />
            <KeyBtn label="ln" onClick={() => onInsert('ln(')} />
            <KeyBtn label="log" sub="log₁₀" onClick={() => onInsert('log10(')} />
            <KeyBtn label="exp" onClick={() => onInsert('exp(')} />
            <KeyBtn label="abs" onClick={() => onInsert('abs(')} />
            <KeyBtn label="|□|" onClick={() => onInsert('abs(')} />
            <KeyBtn label="lim" onClick={() => onInsert('lim ')} isBlue />
            <KeyBtn label="e" onClick={() => onInsert('e')} fontSerif />

            <KeyBtn label="π" onClick={() => onInsert('pi')} />
            <KeyBtn label="∞" onClick={() => onInsert('inf')} />
            <KeyBtn label="→" onClick={() => onInsert(' -> ')} />
            <KeyBtn label="←" onClick={() => onInsert(' <- ')} />
            <KeyBtn label="↔" onClick={() => onInsert(' <-> ')} />
            <KeyBtn label="∀" onClick={() => onInsert('forall ')} />
            <KeyBtn label="∃" onClick={() => onInsert('exists ')} />
            <KeyBtn label="∈" onClick={() => onInsert(' in ')} />
            <KeyBtn label="∉" onClick={() => onInsert(' notin ')} />
            <KeyBtn label="∪" onClick={() => onInsert(' union ')} />

            <KeyBtn label="∩" onClick={() => onInsert(' intersect ')} />
            <KeyBtn label="⊂" onClick={() => onInsert(' subset ')} />
            <KeyBtn label="∫" onClick={() => onInsert('integral ')} />
            <KeyBtn label="d" onClick={() => onInsert('d')} />
            <KeyBtn label="∂" onClick={() => onInsert('partial ')} />
            <KeyBtn label="·" onClick={() => onInsert('*')} />
            <KeyBtn label="<" onClick={() => onInsert('<')} />
            <KeyBtn label=">" onClick={() => onInsert('>')} />
            <KeyBtn label="/" onClick={() => onInsert('/')} />
            <button
              type="button"
              onClick={onDelete}
              className="p-2 rounded-lg bg-[#142852] hover:bg-[#1a346b] text-slate-200 flex items-center justify-center border border-[#1e3c78]"
            >
              ⌫
            </button>
          </div>
        )}

        {/* TAB 3: QWERTY Lowercase Alphabet (Matching Image 3) */}
        {activeTab === 'abc' && (
          <div className="space-y-1.5 max-w-2xl mx-auto">
            {/* Number row */}
            <div className="grid grid-cols-10 gap-1 text-xs sm:text-sm">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
                <KeyBtn key={num} label={num} onClick={() => onInsert(num)} isNum />
              ))}
            </div>

            {/* Q W E R T Y U I O P */}
            <div className="grid grid-cols-10 gap-1 text-xs sm:text-sm">
              {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((ch) => (
                <KeyBtn key={ch} label={ch} onClick={() => onInsert(ch)} fontSerif />
              ))}
            </div>

            {/* A S D F G H J K L */}
            <div className="grid grid-cols-9 gap-1 max-w-[90%] mx-auto text-xs sm:text-sm">
              {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map((ch) => (
                <KeyBtn key={ch} label={ch} onClick={() => onInsert(ch)} fontSerif />
              ))}
            </div>

            {/* Z X C V B N M */}
            <div className="grid grid-cols-9 gap-1 text-xs sm:text-sm">
              <div className="col-span-1" />
              {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((ch) => (
                <KeyBtn key={ch} label={ch} onClick={() => onInsert(ch)} fontSerif />
              ))}
              <button
                type="button"
                onClick={onDelete}
                className="col-span-1 p-2 rounded-lg bg-[#142852] hover:bg-[#1a346b] text-slate-200 flex items-center justify-center border border-[#1e3c78]"
              >
                ⌫
              </button>
            </div>

            {/* Bottom Row: - + = space , . < > */}
            <div className="flex gap-1.5 items-center justify-center pt-1 text-xs sm:text-sm">
              <KeyBtn label="-" onClick={() => onInsert('-')} />
              <KeyBtn label="+" onClick={() => onInsert('+')} />
              <KeyBtn label="=" onClick={() => onInsert('=')} />
              <button
                type="button"
                onClick={() => onInsert(' ')}
                className="flex-1 max-w-[200px] py-2 rounded-lg bg-[#102246] hover:bg-[#162f61] border border-[#1c3970] text-slate-300 text-xs"
              >
                space
              </button>
              <KeyBtn label="," onClick={() => onInsert(',')} />
              <KeyBtn label="." onClick={() => onInsert('.')} />
              <KeyBtn label="(" onClick={() => onInsert('(')} />
              <KeyBtn label=")" onClick={() => onInsert(')')} />
            </div>
          </div>
        )}

        {/* TAB 4: Greek Alphabet (Matching Image 4) */}
        {activeTab === 'greek' && (
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-xs sm:text-sm">
            {[
              { symbol: 'α', name: 'alpha' },
              { symbol: 'β', name: 'beta' },
              { symbol: 'γ', name: 'gamma' },
              { symbol: 'δ', name: 'delta' },
              { symbol: 'ε', name: 'epsilon' },
              { symbol: 'ζ', name: 'zeta' },
              { symbol: 'η', name: 'eta' },
              { symbol: 'θ', name: 'theta' },
              { symbol: 'ι', name: 'iota' },
              { symbol: 'κ', name: 'kappa' },
              { symbol: 'λ', name: 'lambda' },
              { symbol: 'μ', name: 'mu' },
              { symbol: 'ν', name: 'nu' },
              { symbol: 'ξ', name: 'xi' },
              { symbol: 'ο', name: 'omicron' },
              { symbol: 'π', name: 'pi' },
              { symbol: 'ρ', name: 'rho' },
              { symbol: 'σ', name: 'sigma' },
              { symbol: 'τ', name: 'tau' },
              { symbol: 'υ', name: 'upsilon' },
              { symbol: 'φ', name: 'phi' },
              { symbol: 'χ', name: 'chi' },
              { symbol: 'ψ', name: 'psi' },
              { symbol: 'ω', name: 'omega' },
              { symbol: 'Δ', name: 'Delta' },
              { symbol: 'Σ', name: 'Sigma' },
              { symbol: 'Ω', name: 'Omega' },
              { symbol: '∞', name: 'infinity' },
              { symbol: 'lim', name: 'limit' },
              { symbol: '⌫', name: 'backspace' },
            ].map((item) => (
              <button
                key={item.symbol}
                type="button"
                onClick={() => {
                  if (item.symbol === '⌫') onDelete();
                  else onInsert(item.symbol);
                }}
                className="py-1.5 px-2 rounded-lg bg-[#0e1f42] hover:bg-[#152e61] border border-[#173369] text-white flex flex-col items-center justify-center transition-all"
              >
                <span className="text-base sm:text-lg font-serif">{item.symbol}</span>
                <span className="text-[9px] text-slate-400 leading-none">{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function KeyBtn({
  label,
  sub,
  onClick,
  isNum,
  isBlue,
  fontSerif,
}: {
  label: string;
  sub?: string;
  onClick: () => void;
  isNum?: boolean;
  isBlue?: boolean;
  fontSerif?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative py-2 sm:py-2.5 px-2 rounded-lg text-xs sm:text-sm transition-all flex flex-col items-center justify-center border shadow-sm active:scale-95 ${
        isBlue
          ? 'bg-blue-600/90 hover:bg-blue-500 text-white border-blue-500'
          : isNum
          ? 'bg-[#112349] hover:bg-[#183166] text-white border-[#1c3970]'
          : 'bg-[#0d1d3d] hover:bg-[#142c5b] text-slate-200 border-[#173369]'
      }`}
    >
      <span className={fontSerif ? 'font-serif' : 'font-sans'}>{label}</span>
      {sub && <span className="text-[8px] text-sky-400 absolute top-0.5 right-1">{sub}</span>}
    </button>
  );
}
