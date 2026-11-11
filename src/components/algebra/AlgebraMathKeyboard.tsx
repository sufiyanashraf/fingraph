import { Delete, RotateCcw, Keyboard as KeyboardIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface AlgebraMathKeyboardProps {
  isOpen: boolean;
  onToggle: () => void;
  onInsert: (char: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function AlgebraMathKeyboard({
  isOpen,
  onToggle,
  onInsert,
  onDelete,
  onClear
}: AlgebraMathKeyboardProps) {
  const keyboardGroups = [
    {
      name: 'Variables',
      keys: ['x', 'y', 'z', 'a', 'b', 'c', 'n', 't']
    },
    {
      name: 'Operators & Relations',
      keys: ['+', '-', '*', '/', '=', '!=', '<', '>', '<=', '>=', '+-']
    },
    {
      name: 'Powers & Roots',
      keys: ['^2', '^3', '^', 'sqrt(', 'cbrt(', '(', ')', '[', ']']
    },
    {
      name: 'Special & Functions',
      keys: ['i', 'pi', 'e', 'log(', 'ln(', 'f(x)', 'P(x)']
    },
    {
      name: 'Numbers',
      keys: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.']
    }
  ];

  const getDisplayLabel = (k: string) => {
    switch (k) {
      case '^2':
        return 'x²';
      case '^3':
        return 'x³';
      case '^':
        return 'xⁿ';
      case 'sqrt(':
        return '√';
      case 'cbrt(':
        return '∛';
      case '*':
        return '×';
      case '/':
        return '÷';
      case '!=':
        return '≠';
      case '<=':
        return '≤';
      case '>=':
        return '≥';
      case '+-':
        return '±';
      case 'pi':
        return 'π';
      default:
        return k;
    }
  };

  return (
    <div className="w-full space-y-2 select-none">
      {/* Keyboard Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isOpen
              ? 'bg-blue-600/30 border-blue-500/70 text-blue-200'
              : 'bg-[#081226] border-[#14264c] text-slate-300 hover:text-white hover:bg-[#0d1e3d]'
          }`}
        >
          <KeyboardIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>Canvas Math Keyboard</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
        </button>

        {isOpen && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 rounded bg-[#091530] hover:bg-[#12244a] text-slate-300 hover:text-white border border-[#162c57] text-xs transition-colors flex items-center gap-1"
              title="Backspace"
            >
              <Delete className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded bg-[#091530] hover:bg-[#12244a] text-slate-300 hover:text-white border border-[#162c57] text-xs transition-colors flex items-center gap-1"
              title="Clear Input"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Docked Keyboard Body */}
      {isOpen && (
        <div className="p-3 bg-[#071024] border border-[#142850] rounded-xl space-y-2.5 animate-in fade-in duration-200 shadow-xl">
          {keyboardGroups.map((group) => (
            <div key={group.name} className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 w-20 shrink-0 font-medium">
                {group.name}:
              </span>
              <div className="flex flex-wrap gap-1 flex-1">
                {group.keys.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => onInsert(k)}
                    className="min-w-[34px] h-8 px-2 rounded bg-[#0b1836] hover:bg-blue-600 active:bg-blue-700 text-white font-mono text-xs border border-[#1b315b] hover:border-blue-400 shadow-sm transition-all flex items-center justify-center font-medium"
                  >
                    {getDisplayLabel(k)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
