import { Delete, X } from 'lucide-react';

interface MathKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (char: string) => void;
  onDelete: () => void;
  onClear: () => void;
  activeTopicId?: string;
}

export default function SequenceMathKeyboard({
  isOpen,
  onClose,
  onInsert,
  onDelete,
  onClear,
  activeTopicId
}: MathKeyboardProps) {
  if (!isOpen) return null;

  // Topic-tailored key suggestions
  const topicShortcuts: Record<string, string[]> = {
    basics: ['aₙ', 'Tₙ', 'a₁', 'n', '2n + 1', 'n²'],
    ap: ['a', 'd', 'n', 'aₙ', 'Sₙ', 'l', 'a + (n-1)d', '(n/2)'],
    gp: ['a', 'r', 'n', 'aₙ', 'Sₙ', 'S∞', 'a · rⁿ⁻¹', '|r| < 1'],
    hp: ['1/a', '1/d', 'Hₙ', 'HM', '2ab/(a+b)'],
    means: ['AM', 'GM', 'HM', '√(ab)', 'A ≥ G ≥ H', 'G² = AH'],
    special: ['∑k', '∑k²', '∑k³', 'n(n+1)/2', 'Fₙ', 'φ'],
    sigma: ['∑', 'k=1', 'n', '∞', 'f(k)', '2k + 1'],
    telescoping: ['1/(n(n+1))', '1/n - 1/(n+1)', 'S_N', 'b₁ - b_{N+1}'],
    convergence: ['lim', 'n→∞', 'aₙ', 'S_N', '0', '≠ 0'],
    tests: ['L = lim', '|aₙ₊₁/aₙ|', '1/nᵖ', 'p > 1', 'n!', 'cⁿ'],
    power_series: ['∑ cₙ(x - a)ⁿ', 'R = 1/L', '|x - a| < R', 'xⁿ'],
    taylor_maclaurin: ['eˣ', 'sin(x)', 'cos(x)', 'f⁽ⁿ⁾(a)/n!', 'xⁿ/n!'],
    binomial: ['(1 + x)ᵅ', 'ⁿCᵣ', 'Tᵣ₊₁', 'α', '|x| < 1']
  };

  const activeShortcuts = (activeTopicId && topicShortcuts[activeTopicId]) || [
    'aₙ',
    'Sₙ',
    '∑',
    '∞',
    'd',
    'r'
  ];

  const standardKeyGroups = [
    {
      category: 'Topic Shortcuts',
      keys: activeShortcuts
    },
    {
      category: 'Sequences & Series Notation',
      keys: ['aₙ', 'Tₙ', 'Sₙ', 'S∞', '∑', 'lim', 'n→∞', '∞', 'a₁', 'aₙ₋₁', 'n!', 'ⁿCᵣ']
    },
    {
      category: 'Variables & Constants',
      keys: ['n', 'k', 'i', 'x', 'a', 'd', 'r', 'l', 'p', 'α', 'φ', 'e']
    },
    {
      category: 'Powers & Roots',
      keys: ['²', '³', 'ⁿ', '⁻¹', '√', '²', '^(', ')/(', '1/', '·']
    },
    {
      category: 'Operators & Relations',
      keys: ['+', '-', '×', '/', '=', '≠', '<', '>', '≤', '≥', '±', '|']
    },
    {
      category: 'Grouping & Numbers',
      keys: ['(', ')', '[', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.']
    }
  ];

  return (
    <div className="bg-[#070f22] border border-[#162c57] rounded-xl p-3 sm:p-4 shadow-2xl mt-3 animate-fade-in">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#14264c]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-serif text-white font-medium tracking-wide">
            Classic Mathematical Keyboard
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            (Sequence & Series Specialized)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onClear}
            className="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-white hover:bg-[#0f1f42] rounded transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-white hover:bg-[#0f1f42] rounded transition-colors"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-[#0f1f42] rounded transition-colors ml-1"
            title="Close Keyboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {standardKeyGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              {group.category}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.keys.map((keyVal, kIdx) => (
                <button
                  key={kIdx}
                  onClick={() => onInsert(keyVal)}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#0b162f] hover:bg-[#142954] active:scale-95 text-slate-200 hover:text-white font-mono text-xs sm:text-sm rounded-lg border border-[#172e5a] hover:border-blue-500/50 shadow-sm transition-all select-none"
                >
                  {keyVal}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

