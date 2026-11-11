import { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2, Pen, Minus, Plus, Undo, Redo, Grid3X3, ImagePlus } from 'lucide-react';

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);

  // Undo/redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initial setup and resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const initCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save initial blank state
        const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialData]);
        setHistoryIndex(0);
      }
    };
    
    initCanvas();
    
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent && canvas.width > 0 && canvas.height > 0) {
        const oldData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(oldData, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(data);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx && history[newIndex]) {
        ctx.putImageData(history[newIndex], 0, 0);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx && history[newIndex]) {
        ctx.putImageData(history[newIndex], 0, 0);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    
    if (showSizePanel) setShowSizePanel(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.lineWidth = lineWidth * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.closePath();
      ctx.globalCompositeOperation = 'source-over';
    }
    setIsDrawing(false);
    saveState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const toggleTool = (selectedTool: 'pen' | 'eraser') => {
    if (tool === selectedTool) {
      setShowSizePanel(!showSizePanel);
    } else {
      setTool(selectedTool);
      setShowSizePanel(true);
    }
  };

  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
  };

  const handleImageInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
        const width = img.width * scale;
        const height = img.height * scale;

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, 0, 0, width, height);
        saveState();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-6rem)] relative overflow-hidden bg-white dark:bg-white shadow-sm border border-gray-200 dark:border-gray-200">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: showGrid 
            ? 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)' 
            : 'none',
          backgroundSize: '24px 24px',
        }}
        className="block w-full h-full cursor-crosshair touch-none"
      />
      
      {/* Title */}
      <div className="absolute top-4 left-4 pointer-events-none z-10">
        <span className="text-gray-400 font-semibold text-sm drop-shadow-sm select-none tracking-wide">
          Digital Whiteboard
        </span>
      </div>

      {/* Left Toolbar */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur text-white rounded-xl shadow-2xl flex flex-col p-2 space-y-3 z-20 border border-gray-700/60">
        <button 
          className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-blue-600 shadow-sm' : 'hover:bg-gray-800'}`} 
          onClick={() => toggleTool('pen')}
          title="Pen"
        >
          <Pen size={20} />
        </button>
        <button 
          className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-blue-600 shadow-sm' : 'hover:bg-gray-800'}`} 
          onClick={() => toggleTool('eraser')}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>

        <button 
          className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-blue-600 shadow-sm' : 'hover:bg-gray-800'}`} 
          onClick={handleToggleGrid}
          title={showGrid ? "Grid Enabled (Permanent)" : "Toggle Grid"}
        >
          <Grid3X3 size={20} />
        </button>

        <button 
          className="p-2 rounded-lg transition-colors hover:bg-gray-800"
          onClick={() => imageInputRef.current?.click()}
          title="Insert Image"
        >
          <ImagePlus size={20} />
        </button>
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={handleImageInsert} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="flex justify-center items-center relative w-8 h-8 mx-auto group" title="Color Picker">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            disabled={tool === 'eraser'}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div 
            className={`w-6 h-6 rounded-full border-2 ${tool === 'eraser' ? 'border-gray-600 bg-gray-700' : 'border-white'} pointer-events-none shadow-sm transition-transform group-hover:scale-110`}
            style={{ backgroundColor: tool === 'eraser' ? '#ffffff' : color }}
          />
        </div>

        <div className="w-full h-px bg-gray-700 rounded"></div>

        <button 
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors" 
          onClick={clearCanvas}
          title="Clear Board"
        >
          <Trash2 size={20} className="text-red-400" />
        </button>
        
        <div className="w-full h-px bg-gray-700 rounded"></div>

        <button 
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent" 
          onClick={undo} 
          disabled={historyIndex <= 0}
          title="Undo"
        >
          <Undo size={20} />
        </button>
        <button 
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent" 
          onClick={redo} 
          disabled={historyIndex >= history.length - 1}
          title="Redo"
        >
          <Redo size={20} />
        </button>
      </div>

      {/* Brush Size Panel */}
      {showSizePanel && (
        <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur text-white p-4 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center space-y-4 z-20 min-w-[150px]">
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-sm font-medium text-gray-200 capitalize">{tool} Size</span>
            <button 
              onClick={() => setShowSizePanel(false)} 
              className="text-gray-400 hover:text-gray-200 ml-2 text-lg leading-none" 
              title="Close"
            >
              &times;
            </button>
          </div>
          
          <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-lg border border-gray-700">
            <div 
              className={`rounded-full transition-all ${tool === 'eraser' ? 'border-2 border-gray-300 bg-white' : ''}`}
              style={{ 
                width: `${Math.min(56, tool === 'eraser' ? lineWidth * 3 : lineWidth)}px`, 
                height: `${Math.min(56, tool === 'eraser' ? lineWidth * 3 : lineWidth)}px`,
                backgroundColor: tool === 'eraser' ? '#ffffff' : color 
              }} 
            />
          </div>
          
          <span className="text-xs text-gray-300 font-mono bg-gray-800 px-2.5 py-1 rounded border border-gray-700">
            {tool === 'eraser' ? lineWidth * 3 : lineWidth}px
          </span>
          
          <input 
            type="range"
            min="1"
            max="30"
            value={lineWidth}
            onChange={e => setLineWidth(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>
      )}

      {/* Zoom Controls (Visual Only) */}
      <div className="absolute bottom-4 right-4 flex items-center bg-white/95 dark:bg-white/95 backdrop-blur rounded-lg shadow-xl border border-gray-300 overflow-hidden z-20">
        <button 
          className="p-2 text-gray-700 hover:bg-gray-100 transition-colors" 
          onClick={() => setZoom(z => Math.max(10, z - 10))}
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
        <div className="px-3 py-1.5 text-xs font-medium text-gray-800 border-x border-gray-300 min-w-[3.5rem] text-center select-none">
          {zoom}%
        </div>
        <button 
          className="p-2 text-gray-700 hover:bg-gray-100 transition-colors" 
          onClick={() => setZoom(z => Math.min(500, z + 10))}
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
