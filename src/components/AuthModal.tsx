import { useState } from 'react';
import { X, Lock, Mail, User, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'login' | 'signup';
  onClose: () => void;
}

export default function AuthModal({ isOpen, initialMode = 'login', onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(
    initialMode === 'signup' ? 'signup' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0b1730] text-slate-100 rounded-2xl border border-[#1b3260] shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-serif font-normal text-white">
            {mode === 'login' ? 'Sign in to FinGraph Lab' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access your saved calculations, graphs, and simulations'
              : 'Start exploring mathematics and financial modeling'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 mb-6 rounded-lg bg-[#070f22] border border-[#142345]">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'signup'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <p className="text-base font-medium text-white">Welcome to FinGraph Lab</p>
            <p className="text-xs text-slate-400 mt-1">Session initialized successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#060c1d] border border-[#1b315b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#060c1d] border border-[#1b315b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#060c1d] border border-[#1b315b] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm mt-2"
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('demo@fingraphlab.com');
                setPassword('password123');
                setSubmitted(true);
                setTimeout(() => {
                  setSubmitted(false);
                  onClose();
                }, 1000);
              }}
              className="w-full py-2 px-4 bg-[#0d1c3a] hover:bg-[#132750] border border-[#1c3565] text-slate-300 text-xs font-medium rounded-lg transition-colors"
            >
              Continue as Guest / Demo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
