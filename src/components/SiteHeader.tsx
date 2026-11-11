import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserPlus, LogIn } from 'lucide-react';
import AuthModal from './AuthModal';

interface SiteHeaderProps {
  currentSection?: string;
}

export default function SiteHeader({}: SiteHeaderProps) {
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'login' | 'signup' }>({
    open: false,
    mode: 'login'
  });

  const [isDark, setIsDark] = useState<boolean>(true);

  // Sync theme with document and localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDarkTheme = saved ? saved === 'dark' : true; // Default dark navy
    setIsDark(isDarkTheme);
    document.documentElement.classList.toggle('dark', isDarkTheme);
    document.body.style.backgroundColor = isDarkTheme ? '#060c1d' : '#f8fafc';
    document.body.style.color = isDarkTheme ? '#f1f5f9' : '#0f172a';

    const handleStorage = () => {
      const current = localStorage.getItem('theme') === 'dark';
      setIsDark(current);
    };
    window.addEventListener('themechange', handleStorage);
    return () => window.removeEventListener('themechange', handleStorage);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    document.body.style.backgroundColor = next ? '#060c1d' : '#f8fafc';
    document.body.style.color = next ? '#f1f5f9' : '#0f172a';
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <>
      <header className="w-full bg-white/90 dark:bg-[#060c1d]/95 backdrop-blur border-b border-slate-200 dark:border-[#132244] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
            {/* The rotating 3D logo from splash screen */}
            <img
              src="/logo-dark.png"
              alt="FinGraph Lab Logo"
              className="w-full h-full object-contain rounded-full drop-shadow-md group-hover:rotate-12 group-hover:scale-105 transition-all duration-300"
            />
          </div>
          <span className="text-lg sm:text-xl font-serif font-medium text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            FinGraph Lab
          </span>
        </Link>

        {/* Right Section: Theme Toggle + Auth Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Half-Black Half-White Circular Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-9 h-9 rounded-full flex items-center justify-center p-1 border border-slate-300 dark:border-[#1b315b] bg-slate-100/90 dark:bg-[#081226] hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 active:scale-95 transition-all shadow-sm group cursor-pointer"
          >
            {/* Circle whose half is black and half is white */}
            <div className="w-5 h-5 rounded-full border border-slate-400 dark:border-slate-300 overflow-hidden relative shadow-inner rotate-[-45deg] group-hover:rotate-[135deg] transition-transform duration-500">
              {/* White half */}
              <div className="absolute inset-0 bg-white" />
              {/* Black half */}
              <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#090d16]" />
            </div>
          </button>

          {/* Sign In Button with Icon */}
          <button
            onClick={() => setAuthModal({ open: true, mode: 'signin' })}
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#1b315b] hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-[#081226]/80 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Sign in</span>
          </button>

          {/* Log In Button with Icon */}
          <button
            onClick={() => setAuthModal({ open: true, mode: 'login' })}
            className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm hover:shadow-md hover:shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Log in</span>
          </button>
        </div>
      </header>

      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal(prev => ({ ...prev, open: false }))}
      />
    </>
  );
}
