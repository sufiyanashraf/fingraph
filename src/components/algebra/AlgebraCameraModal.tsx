import { useState, useRef } from 'react';
import { Camera, X, Image as ImageIcon, CheckCircle, Info } from 'lucide-react';

interface AlgebraCameraModalProps {
  onImageSelected?: (dataUrl: string, fileName: string) => void;
  activeImage: { url: string; name: string } | null;
  onClearImage: () => void;
}

export default function AlgebraCameraModal({
  onImageSelected,
  activeImage,
  onClearImage
}: AlgebraCameraModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageSelected?.(reader.result, file.name);
          setIsOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera Button Trigger */}
      <button
        type="button"
        onClick={() => {
          if (activeImage) {
            setIsOpen(true);
          } else {
            fileInputRef.current?.click();
          }
        }}
        className="relative group p-2 rounded-lg bg-[#0b1836] hover:bg-[#12244a] text-blue-400 hover:text-white border border-[#1b315b] hover:border-blue-400/60 transition-all flex items-center justify-center shrink-0"
        title="Upload or scan a math problem"
        aria-label="Upload or scan a math problem"
      >
        <Camera className="w-4 h-4" />
        {activeImage && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0b1836]" />
        )}

        {/* Hover Tooltip */}
        <span className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-slate-900 text-slate-100 text-[10px] px-2 py-1 rounded shadow-lg border border-slate-700 pointer-events-none z-50">
          Upload or scan a math problem
        </span>
      </button>

      {/* Reference Card when Image is Loaded */}
      {activeImage && (
        <div className="w-full bg-[#08142c] border border-blue-900/60 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-slate-200">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={activeImage.url}
              alt="Problem Reference"
              className="w-10 h-10 object-cover rounded border border-[#162c57] shrink-0"
            />
            <div className="truncate">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Reference: {activeImage.name}</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Info className="w-3 h-3 text-blue-400 shrink-0" />
                <span>Image loaded for visual reference. Type your equation below.</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClearImage}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Clear Reference Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal Dialog if User wants to view full image or re-upload */}
      {isOpen && activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0b162f] border border-[#162c57] rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#14264c] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                Uploaded Problem Reference
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-auto flex justify-center bg-[#070f22] p-2 rounded-lg border border-[#132244]">
              <img
                src={activeImage.url}
                alt="Uploaded math problem"
                className="max-h-64 object-contain rounded"
              />
            </div>

            <div className="bg-[#07122a] border border-[#14264c] p-3 rounded-lg text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Visual Reference</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The uploaded problem is displayed above for your reference. Type the mathematical expression into the equation input or use the Canvas Math Keyboard to solve it step-by-step.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white border border-[#1b315b] hover:bg-[#12244a]"
              >
                Upload Different Image
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearImage();
                  setIsOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white border border-rose-900/60 hover:bg-rose-950/60"
              >
                Remove Image
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
