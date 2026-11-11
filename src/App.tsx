import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import StudyMaths from './pages/StudyMaths';
import FinanceBusiness from './pages/FinanceBusiness';
import VisualsExploring from './pages/VisualsExploring';
import LearnPractice from './pages/LearnPractice';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark'; // Default deep dark navy as in the provided PDF
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.body.style.backgroundColor = initialTheme === 'dark' ? '#060c1d' : '#f8fafc';
    document.body.style.color = initialTheme === 'dark' ? '#f1f5f9' : '#0f172a';

    // Splash screen timer: 2 full continuous 360-degree rotations (2.0s) then fade out
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => setShowSplash(false), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#060c1d] ${isFadingOut ? 'animate-fade-out' : ''}`}>
          <div className="relative flex flex-col items-center justify-center p-8 select-none">
            {/* Subtle ambient glow aura */}
            <div className="absolute w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

            {/* Pulsing ring */}
            <div className="absolute w-52 h-52 rounded-full border border-blue-500/30 animate-glow-ring pointer-events-none" />

            {/* 3D Spinning Logo */}
            <div className="relative flex flex-col items-center [perspective:1200px]">
              <img
                src="/logo-dark.png"
                alt="FinGraph Lab"
                className="w-28 h-28 sm:w-36 sm:h-36 animate-spin-3d-two-rounds drop-shadow-xl"
              />
              <div className="w-24 h-2.5 mt-4 bg-blue-950/80 blur-sm rounded-full animate-shadow-pulse" />
            </div>

            {/* Brand text */}
            <div className="mt-8 text-center animate-brand-reveal">
              <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wider">
                FinGraph Lab
              </h1>
              <p className="mt-2 text-xs text-blue-300 font-mono tracking-widest uppercase">
                MATHEMATICS · FINANCE · VISUALIZATION
              </p>

              {/* Minimal dots */}
              <div className="flex justify-center gap-2 mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-float-dot" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-float-dot" style={{ animationDelay: '0.4s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-float-dot" style={{ animationDelay: '0.8s' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main App Container — Full Viewport, No Global Left Dashboard Sidebar */}
      <div className={`min-h-screen bg-slate-50 dark:bg-[#060c1d] text-slate-900 dark:text-slate-100 transition-colors duration-200 ${!showSplash ? 'animate-landing-in' : 'opacity-0'}`}>
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<Dashboard />} />

          {/* 4 Primary Categories */}
          <Route path="/study-maths" element={<StudyMaths />} />
          <Route path="/math" element={<StudyMaths />} />

          <Route path="/finance" element={<FinanceBusiness />} />
          <Route path="/interest" element={<FinanceBusiness />} />

          <Route path="/visuals" element={<VisualsExploring />} />
          <Route path="/graphing" element={<VisualsExploring />} />

          <Route path="/learn" element={<LearnPractice />} />

          {/* Direct tool route compatibility mapped to their dedicated home tabs */}
          <Route path="/continuity" element={<StudyMaths defaultSubtopic="continuity" />} />
          <Route path="/differentiation" element={<StudyMaths defaultSubtopic="derivatives" />} />
          <Route path="/derivatives" element={<StudyMaths defaultSubtopic="derivatives" />} />
          <Route path="/diff" element={<StudyMaths defaultSubtopic="derivatives" />} />
          <Route path="/applications-of-derivatives" element={<StudyMaths defaultSubtopic="app_derivatives" />} />
          <Route path="/app-derivatives" element={<StudyMaths defaultSubtopic="app_derivatives" />} />
          <Route path="/optimization" element={<StudyMaths defaultSubtopic="app_derivatives" />} />
          <Route path="/integration" element={<StudyMaths defaultSubtopic="integration" />} />
          <Route path="/integrals" element={<StudyMaths defaultSubtopic="integration" />} />
          <Route path="/definite-integrals" element={<StudyMaths defaultSubtopic="definite_integrals" />} />
          <Route path="/definite-integral" element={<StudyMaths defaultSubtopic="definite_integrals" />} />
          <Route path="/definite" element={<StudyMaths defaultSubtopic="definite_integrals" />} />
          <Route path="/differential-equations" element={<StudyMaths defaultSubtopic="differential_equations" />} />
          <Route path="/diff-eq" element={<StudyMaths defaultSubtopic="differential_equations" />} />
          <Route path="/ode" element={<StudyMaths defaultSubtopic="differential_equations" />} />
          <Route path="/multivariable" element={<StudyMaths defaultSubtopic="multivariable" />} />
          <Route path="/multivariable-calculus" element={<StudyMaths defaultSubtopic="multivariable" />} />
          <Route path="/algebra" element={<StudyMaths defaultCategory="algebra" />} />
          <Route path="/algebra-basics" element={<StudyMaths defaultCategory="algebra" defaultSubtopic="basics" />} />
          <Route path="/polynomials" element={<StudyMaths defaultCategory="algebra" defaultSubtopic="polynomials" />} />
          <Route path="/quadratics" element={<StudyMaths defaultCategory="algebra" defaultSubtopic="quadratics" />} />
          <Route path="/quadratic" element={<StudyMaths defaultCategory="algebra" defaultSubtopic="quadratics" />} />
          <Route path="/systems-of-equations" element={<StudyMaths defaultCategory="algebra" defaultSubtopic="systems" />} />
          <Route path="/complex-numbers" element={<StudyMaths defaultCategory="algebra" defaultSubtopic="complex" />} />
          <Route path="/sequences" element={<StudyMaths defaultCategory="sequences" />} />
          <Route path="/sequence" element={<StudyMaths defaultCategory="sequences" />} />
          <Route path="/ap" element={<StudyMaths defaultCategory="sequences" defaultSubtopic="ap" />} />
          <Route path="/gp" element={<StudyMaths defaultCategory="sequences" defaultSubtopic="gp" />} />
          <Route path="/arithmetic-progression" element={<StudyMaths defaultCategory="sequences" defaultSubtopic="ap" />} />
          <Route path="/geometric-progression" element={<StudyMaths defaultCategory="sequences" defaultSubtopic="gp" />} />
          <Route path="/arithmetic-mean" element={<StudyMaths defaultCategory="sequences" defaultSubtopic="am" />} />
          <Route path="/geometric-mean" element={<StudyMaths defaultCategory="sequences" defaultSubtopic="gm" />} />
          <Route path="/harmonic-mean" element={<StudyMaths defaultCategory="sequences" defaultSubtopic="hm" />} />
          <Route path="/trig" element={<StudyMaths defaultCategory="trig" />} />
          <Route path="/trigonometry" element={<StudyMaths defaultCategory="trig" />} />
          <Route path="/unit-circle" element={<StudyMaths defaultCategory="trig" defaultSubtopic="unit_circle" />} />
          <Route path="/inverse-trig" element={<StudyMaths defaultCategory="trig" defaultSubtopic="inverse" />} />
          <Route path="/coordinate" element={<StudyMaths defaultCategory="coordinate" />} />
          <Route path="/coordinate-geometry" element={<StudyMaths defaultCategory="coordinate" />} />
          <Route path="/stats" element={<StudyMaths defaultCategory="stats" />} />
          <Route path="/statistics" element={<StudyMaths defaultCategory="stats" />} />
          <Route path="/probability" element={<StudyMaths defaultCategory="stats" defaultSubtopic="prob" />} />
          <Route path="/vectors" element={<StudyMaths defaultCategory="vectors" />} />
          <Route path="/matrices" element={<StudyMaths defaultCategory="vectors" defaultSubtopic="matrices" />} />
          <Route path="/matrix" element={<StudyMaths defaultCategory="vectors" defaultSubtopic="matrices" />} />
          <Route path="/basic" element={<StudyMaths />} />
          <Route path="/equations" element={<StudyMaths />} />
          <Route path="/investment" element={<FinanceBusiness />} />
          <Route path="/goals" element={<LearnPractice />} />
          <Route path="/compare" element={<LearnPractice />} />
          <Route path="/monte-carlo" element={<FinanceBusiness />} />
          <Route path="/challenge" element={<LearnPractice />} />
          <Route path="/whiteboard" element={<LearnPractice />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
