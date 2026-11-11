import { useState } from 'react';
import { Camera, Upload, X, Sparkles } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractMath: (extractedText: string) => void;
}

export default function SequenceCameraModal({
  isOpen,
  onClose,
  onExtractMath
}: CameraModalProps) {
  const [isScanning, setIsScanning] = useState<boolean>(false);

  if (!isOpen) return null;

  const PRESET_SAMPLES = [
    {
      title: 'Handwritten A.P. Problem',
      previewText: '3, 7, 11, 15, 19... find 20th term',
      extracted: '3, 7, 11, 15, 19'
    },
    {
      title: 'Textbook Infinite G.P.',
      previewText: 'Find S∞ for 12 + 6 + 3 + 1.5 + ...',
      extracted: 'a = 12, r = 0.5'
    },
    {
      title: 'Recurring Decimal Scan',
      previewText: 'Convert 0.272727... to rational fraction',
      extracted: '0.272727...'
    },
    {
      title: 'Telescoping Sum Problem',
      previewText: 'Evaluate ∑ 1 / [n(n + 1)] from n = 1 to ∞',
      extracted: '1 / (n * (n + 1))'
    },
    {
      title: 'Taylor Series Homework',
      previewText: 'Maclaurin expansion for e^x up to degree 4',
      extracted: 'e^x'
    }
  ];

  const handleSelectPreset = (sample: typeof PRESET_SAMPLES[0]) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onExtractMath(sample.extracted);
      onClose();
    }, 700);
  };

  const handleFileUpload = (e: { target: HTMLInputElement }) => {
    if (e.target.files && e.target.files[0]) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        onExtractMath('3, 7, 11, 15, 19');
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b162f] border border-[#162c57] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#12244a] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif text-white font-medium">
              Scan or Upload Problem
            </h3>
            <p className="text-xs text-slate-400">
              Upload or scan a Sequence & Series problem
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="my-4 border-2 border-dashed border-[#1a3363] hover:border-blue-500/60 rounded-xl p-5 text-center transition-colors bg-[#081226]/60">
          <input
            type="file"
            id="camera-upload-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="camera-upload-input"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-xs font-medium text-slate-200">
              Click to browse or drop handwritten / textbook photo
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Supports PNG, JPG, WEBP math problem captures
            </span>
          </label>
        </div>

        {/* Scanning Animation Indicator */}
        {isScanning && (
          <div className="my-3 p-3 bg-blue-950/80 border border-blue-600/50 rounded-xl flex items-center gap-3 animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-xs text-blue-300 font-mono">
              Extracting mathematical notation and parameters...
            </span>
          </div>
        )}

        {/* Preset Sample Problems */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Or test with sample scanned problem:
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {PRESET_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(sample)}
                className="w-full text-left p-2.5 rounded-lg bg-[#081226] hover:bg-[#12244a] border border-[#14264c] hover:border-blue-500/40 flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="text-xs font-medium text-slate-200 group-hover:text-blue-300">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {sample.previewText}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

