import { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[600px] bg-slate-800/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Main Authentication Card */}
      <div className="relative w-full max-w-md bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl p-8 sm:p-10 transition-all duration-300 ring-1 ring-white/5">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700/50 flex items-center justify-center shadow-inner shadow-slate-900/20 mb-6">
            {/* Custom Microchip / Hardware SVG Logo */}
            <svg 
              className="w-7 h-7 text-slate-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
        </div>

        {/* Dynamic Form Rendering */}
        <div className="w-full">
          {isLogin ? (
            <LoginForm toggleAuthMode={toggleAuthMode} />
          ) : (
            <SignUpForm toggleAuthMode={toggleAuthMode} />
          )}
        </div>
        
      </div>
    </div>
  );
}