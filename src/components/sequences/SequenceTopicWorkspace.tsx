import { useState, useEffect } from 'react';
import type { SubtopicData, MajorTopic, SolverOutput } from './types';
import { dispatchSequenceSolve } from './sequenceSolvers';
import SequenceVisualizers from './SequenceVisualizers';
import SequenceMathKeyboard from './SequenceMathKeyboard';
import SequenceCameraModal from './SequenceCameraModal';
import {
  Camera,
  Keyboard,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Award
} from 'lucide-react';

interface WorkspaceProps {
  majorTopic: MajorTopic;
  subtopic: SubtopicData;
}

export default function SequenceTopicWorkspace({ majorTopic, subtopic }: WorkspaceProps) {
  // Input State
  const [inputValue, setInputValue] = useState<string>(subtopic.defaultInput);
  const [activeActionId, setActiveActionId] = useState<string>(subtopic.defaultAction);
  const [solverResult, setSolverResult] = useState<SolverOutput | null>(null);

  // Keyboard & Camera Modals
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // Practice Quiz State
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<string, number | null>>({});
  const [showPracticeSteps, setShowPracticeSteps] = useState<Record<string, boolean>>({});

  // Reset & calculate when subtopic changes
  useEffect(() => {
    setInputValue(subtopic.defaultInput);
    setActiveActionId(subtopic.defaultAction);
    setSelectedPracticeAnswers({});
    setShowPracticeSteps({});

    // Auto-solve default problem
    const defaultRes = dispatchSequenceSolve(
      majorTopic.id,
      subtopic.id,
      subtopic.defaultAction,
      subtopic.defaultInput
    );
    setSolverResult(defaultRes);
  }, [subtopic.id, majorTopic.id]);

  const handleExecuteAction = (actionId: string) => {
    setActiveActionId(actionId);
    const res = dispatchSequenceSolve(
      majorTopic.id,
      subtopic.id,
      actionId,
      inputValue
    );
    setSolverResult(res);
  };

  const handleInsertKeyboardChar = (char: string) => {
    setInputValue(prev => prev + char);
  };

  const handleDeleteKeyboardChar = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleSelectPracticeOption = (questionId: string, optIdx: number) => {
    setSelectedPracticeAnswers(prev => ({ ...prev, [questionId]: optIdx }));
  };

  const togglePracticeStep = (questionId: string) => {
    setShowPracticeSteps(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ─── 1. TOPIC & SUBTOPIC IDENTITY HEADER ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-mono font-semibold">
              {majorTopic.number} · {majorTopic.title}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#112347] text-slate-300 font-mono">
              {subtopic.level}
            </span>
          </div>

          <span className="text-[11px] text-blue-400 font-mono">
            Roadmap: {majorTopic.roadmapStage}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-tight">
          {subtopic.title}
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {subtopic.definition}
        </p>

        {subtopic.classicNote && (
          <div className="mt-4 pt-3 border-t border-[#132244] italic text-xs text-blue-300/90 font-serif flex items-center gap-2">
            <span>{subtopic.classicNote}</span>
          </div>
        )}
      </div>

      {/* ─── 2. RELEVANT MATHEMATICAL FORMULA CARDS ─── */}
      {subtopic.formulas.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold px-1 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Classic Mathematical Formulas & Principles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {subtopic.formulas.map((form, fIdx) => (
              <div
                key={fIdx}
                className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-blue-500/40 transition-colors"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/60" />
                <div className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{form.name}</span>
                  {form.condition && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-mono">
                      {form.condition}
                    </span>
                  )}
                </div>

                <div className="text-base sm:text-lg font-mono font-bold text-white bg-[#060c1d] border border-[#132244] rounded-lg px-3.5 py-2.5 my-2 overflow-x-auto scrollbar-none shadow-inner">
                  {form.formula}
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed">
                  {form.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 3. ENTER YOUR OWN PROBLEM (WORKSPACE) ─── */}
      <div className="bg-[#091530] border-2 border-blue-900/60 rounded-2xl p-5 sm:p-7 shadow-xl relative">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs uppercase tracking-widest text-blue-300 font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{subtopic.inputLabel || 'Enter Your Own Problem'}</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                isKeyboardOpen
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-[#081226] text-slate-300 border-[#1b3363] hover:text-white'
              }`}
              title="Toggle Mathematical Keyboard"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Math Keyboard</span>
            </button>

            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-[#081226] hover:bg-[#12244a] text-blue-300 border border-blue-800/80 hover:border-blue-400 transition-colors"
              title="Upload or scan a Sequence & Series problem"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan / Upload</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecuteAction(activeActionId)}
            placeholder={subtopic.inputPlaceholder}
            className="w-full bg-[#060c1d] text-white font-mono text-base sm:text-lg px-4 py-3.5 pr-28 rounded-xl border border-[#1a3363] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              onClick={() => setInputValue('')}
              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-300 font-mono"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Quick Example Pills */}
        {subtopic.examplePills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mr-1">
              Try:
            </span>
            {subtopic.examplePills.map((pill, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  setInputValue(pill);
                  handleExecuteAction(activeActionId);
                }}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#070f22] hover:bg-[#12244a] border border-[#14264c] hover:border-blue-500/40 text-slate-300 hover:text-white transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>
        )}

        {/* Canvas-Quality Mathematical Keyboard */}
        <SequenceMathKeyboard
          isOpen={isKeyboardOpen}
          onClose={() => setIsKeyboardOpen(false)}
          onInsert={handleInsertKeyboardChar}
          onDelete={handleDeleteKeyboardChar}
          onClear={() => setInputValue('')}
          activeTopicId={majorTopic.id}
        />

        {/* Camera Modal */}
        <SequenceCameraModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onExtractMath={(mathText) => {
            setInputValue(mathText);
            handleExecuteAction(activeActionId);
          }}
        />

        {/* Topic-Specific Action Buttons */}
        <div className="mt-5 pt-4 border-t border-[#14264c]">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Topic Actions:
          </div>
          <div className="flex flex-wrap gap-2">
            {subtopic.actions.map((act) => {
              const isSelected = act.id === activeActionId;
              return (
                <button
                  key={act.id}
                  onClick={() => handleExecuteAction(act.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                      : 'bg-[#070f22] hover:bg-[#11244d] text-slate-200 hover:text-white border border-[#162c57]'
                  }`}
                >
                  {act.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 4. STEP-BY-STEP SOLUTION SYSTEM ─── */}
      {solverResult && (
        <div className="bg-[#081226] border border-[#152952] rounded-2xl p-5 sm:p-7 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#14264c]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-lg font-serif text-white font-medium">
                Step-by-Step Mathematical Derivation
              </h2>
            </div>
            <span className="text-xs font-mono text-blue-300 px-2.5 py-0.5 rounded bg-blue-950 border border-blue-800">
              {solverResult.topicTitle}
            </span>
          </div>

          {/* Given Values */}
          {solverResult.givenValues.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#060c1d] border border-[#132244] rounded-xl p-3">
              {solverResult.givenValues.map((gv, gvIdx) => (
                <div key={gvIdx} className="text-xs">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">{gv.label}</div>
                  <div className="font-mono font-bold text-white mt-0.5">{gv.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* 5-Step Process */}
          <div className="space-y-3 pt-2">
            {/* Step 1: Identify */}
            <div className="p-3.5 rounded-xl bg-[#0b162f] border border-[#162c57]">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Step 1 — Identify
              </div>
              <div className="text-xs text-slate-200 leading-relaxed">
                {solverResult.step1Identify}
              </div>
            </div>

            {/* Step 2: Choose Method */}
            <div className="p-3.5 rounded-xl bg-[#0b162f] border border-[#162c57]">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Step 2 — Choose Method
              </div>
              <div className="text-xs text-slate-200 leading-relaxed">
                {solverResult.step2Method}
              </div>
              <div className="mt-2 text-xs font-mono text-blue-300 bg-[#060c1d] p-2 rounded border border-[#14264c]">
                Formula Applied: {solverResult.formulaUsed}
              </div>
            </div>

            {/* Step 3: Substitute */}
            <div className="p-3.5 rounded-xl bg-[#0b162f] border border-[#162c57]">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Step 3 — Substitute
              </div>
              <div className="text-xs text-slate-200 font-mono leading-relaxed bg-[#060c1d] p-2 rounded border border-[#14264c]">
                {solverResult.step3Substitute}
              </div>
            </div>

            {/* Step 4: Simplify */}
            <div className="p-3.5 rounded-xl bg-[#0b162f] border border-[#162c57]">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Step 4 — Simplify
              </div>
              <div className="text-xs text-slate-200 leading-relaxed">
                {solverResult.step4Simplify}
              </div>
            </div>

            {/* Step 5: Final Answer */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 to-[#0e214d] border-2 border-blue-500 shadow-lg">
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Step 5 — Final Answer</span>
              </div>
              <div className="text-sm sm:text-base font-serif text-white font-medium leading-relaxed">
                {solverResult.step5Answer}
              </div>
              {solverResult.decimalAnswer && (
                <div className="text-xs font-mono text-blue-200 mt-1">
                  Decimal Value: {solverResult.decimalAnswer}
                </div>
              )}
            </div>
          </div>

          {/* Embedded Topic Visualizer */}
          {solverResult.visualData && (
            <div className="mt-4 pt-4 border-t border-[#14264c]">
              <SequenceVisualizers
                type={subtopic.visualType}
                data={solverResult.visualData}
              />
            </div>
          )}
        </div>
      )}

      {/* ─── 5. TOPIC-SPECIFIC PRACTICE QUESTIONS ─── */}
      {subtopic.practiceQuestions.length > 0 && (
        <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-base sm:text-lg font-serif text-white font-medium">
              Interactive Practice: {subtopic.title}
            </h3>
          </div>

          <div className="space-y-4">
            {subtopic.practiceQuestions.map((q, qIdx) => {
              const selectedOpt = selectedPracticeAnswers[q.id];
              const isAnswered = selectedOpt !== undefined && selectedOpt !== null;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;
              const showSteps = showPracticeSteps[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 sm:p-5"
                >
                  <div className="text-xs text-slate-400 font-mono mb-1">
                    Problem {qIdx + 1}
                  </div>
                  <div className="text-sm text-white font-medium mb-3">
                    {q.question}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selectedOpt === oIdx;
                      let btnStyle = 'bg-[#070f22] text-slate-200 border-[#14264c] hover:bg-[#12244a]';
                      if (isAnswered) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectPracticeOption(q.id, oIdx)}
                          className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && oIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Banner */}
                  {isAnswered && (
                    <div className="mt-3 pt-3 border-t border-[#14264c]">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            isCorrect ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isCorrect ? '✓ Correct Answer!' : '✗ Not quite. Inspect the steps below:'}
                        </span>

                        <button
                          onClick={() => togglePracticeStep(q.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 font-mono underline"
                        >
                          {showSteps ? 'Hide Solution Steps' : 'Show Solution Steps'}
                        </button>
                      </div>

                      {showSteps && (
                        <div className="mt-2.5 p-3 rounded-lg bg-[#060c1d] border border-[#14264c] text-xs space-y-1.5 font-mono text-slate-300">
                          <div className="text-slate-400 font-sans">{q.explanation}</div>
                          {q.stepByStep.map((st, stIdx) => (
                            <div key={stIdx} className="text-blue-300">
                              → {st}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 6. TOPIC-SPECIFIC COMMON MISTAKES ─── */}
      {subtopic.commonMistakes.length > 0 && (
        <div className="bg-[#120f06] border border-amber-900/50 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs uppercase tracking-wider font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Common Mathematical Pitfalls</span>
          </div>

          <div className="space-y-2">
            {subtopic.commonMistakes.map((mis, mIdx) => (
              <div key={mIdx} className="text-xs leading-relaxed">
                <span className="font-semibold text-amber-200">{mis.title}: </span>
                <span className="text-slate-300">{mis.description} </span>
                <span className="text-emerald-300 font-medium">({mis.correction})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

