import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ProblemScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryTitle?: string;
  onApplyProblem?: (problemText: string) => void;
}

export default function ProblemScanModal({
  isOpen,
  onClose,
  categoryTitle = 'Mathematics',
  onApplyProblem
}: ProblemScanModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESETS: Record<string, { label: string; problem: string; desc: string }[]> = {
    Trigonometry: [
      { label: 'Right Triangle Ratios', problem: '30°', desc: 'Evaluate sin(30°), cos(30°), tan(30°)' },
      { label: 'Unit Circle Angle', problem: '45°', desc: 'Inspect point (cos 45°, sin 45°) = (√2/2, √2/2)' },
      { label: 'Inverse Sinusoid', problem: '0.866', desc: 'Find arcsin(0.866) in degrees (≈ 60°)' }
    ],
    'Coordinate Geometry': [
      { label: '2D Distance & Midpoint', problem: 'A(1, 2), B(5, 8)', desc: 'Distance d = √52 ≈ 7.211, Midpoint (3, 5)' },
      { label: 'Line Slope & Equation', problem: 'P(2, 3), Q(6, 11)', desc: 'Slope m = 2, y = 2x - 1' },
      { label: '3D Space Distance', problem: 'A(1, 2, 3), B(4, 6, 8)', desc: '3D Euclidean distance d = √50 ≈ 7.071' }
    ],
    'Statistics and Probability': [
      { label: 'Class Test Scores', problem: '12, 15, 18, 22, 25, 28, 30', desc: 'Calculate Mean, Median, Mode, Variance, and Std Dev' },
      { label: 'Combinations (nCr)', problem: 'n = 8, r = 3', desc: '8C3 = 56 ways to choose 3 items from 8' },
      { label: 'Dice Probability', problem: 'fav = 1, total = 6', desc: 'P(Roll a 6) = 1/6 ≈ 0.1667 (16.67%)' }
    ],
    'Vectors and Matrices': [
      { label: '3D Vector Cross Product', problem: 'A=(1, 2, 3), B=(4, 5, 6)', desc: 'A × B = (-3, 6, -3), perpendicular vector' },
      { label: '2×2 Determinant', problem: '[[3, 8], [4, 6]]', desc: 'det = (3)(6) - (8)(4) = -14' },
      { label: 'Vector Dot Product', problem: 'A=(3, 4, 0), B=(4, -3, 0)', desc: 'A · B = 12 - 12 + 0 = 0 (Orthogonal)' }
    ]
  };

  const activePresets = PRESETS[categoryTitle] || [
    { label: 'Standard Problem 1', problem: 'x^2 + 5x + 6 = 0', desc: 'Quadratic roots x = -2, -3' },
    { label: 'Standard Problem 2', problem: '3, 7, 11, 15, 19', desc: 'Arithmetic sequence with d = 4' }
  ];

  const handleSelectPreset = (p: { problem: string }) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onApplyProblem?.(p.problem);
      onClose();
    }, 400);
  };

  const handleSimulateScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const chosen = activePresets[0]?.problem || '45';
      onApplyProblem?.(chosen);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-[#0b162f] border border-[#162c57] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-slate-100 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#070f22] border border-[#14264c] text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-semibold text-white">
              Scan / Upload Math Problem
            </h2>
            <p className="text-xs text-slate-400">
              Upload a picture of your worksheet, or select a textbook exercise for {categoryTitle}.
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Drop / Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 p-5 rounded-xl border-2 border-dashed border-[#1a356b] hover:border-blue-500 bg-[#070f22] hover:bg-[#0c1836] transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
        >
          {imagePreview ? (
            <div className="space-y-2">
              <img
                src={imagePreview}
                alt="Uploaded problem"
                className="max-h-36 rounded-lg mx-auto border border-[#162c57] shadow-sm object-contain"
              />
              <p className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{fileName || 'Image loaded successfully'}</span>
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 mb-2 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-200">
                Click to upload a problem photo or worksheet
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, HEIC, or WebP up to 10MB
              </p>
            </>
          )}
        </div>

        {/* Action Button if Image Loaded */}
        {imagePreview && (
          <div className="mt-3">
            <button
              onClick={handleSimulateScan}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? 'Recognizing Mathematics...' : 'Extract & Load Problem'}</span>
            </button>
          </div>
        )}

        {/* Textbook Presets */}
        <div className="mt-5 pt-4 border-t border-[#14264c]">
          <div className="text-[11px] uppercase tracking-wider font-mono text-slate-400 mb-2.5 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Or Select a Quick Textbook Problem:</span>
          </div>

          <div className="space-y-2">
            {activePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                disabled={isProcessing}
                className="w-full text-left p-2.5 rounded-xl bg-[#070f22] hover:bg-[#0f1f42] border border-[#14264c] hover:border-blue-500/50 transition-all group flex items-start justify-between gap-2 cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {preset.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {preset.desc}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900 shrink-0">
                  {preset.problem}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
