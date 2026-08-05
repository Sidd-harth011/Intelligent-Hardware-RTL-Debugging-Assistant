import { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleAuthMode = () => setIsLogin((prev) => !prev);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0a0c10] p-4 font-sans antialiased sm:p-8">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-full max-w-3xl -translate-x-1/2 rounded-full bg-teal-500/[0.08] blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-sky-500/[0.06] blur-[120px]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9">
        <div className="mb-7 flex flex-col items-center">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-teal-400/20 bg-teal-400/10">
            <svg className="h-7 w-7 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>

          <div className="flex w-full rounded-xl border border-white/8 bg-white/[0.03] p-1">
            {[
              { id: true, label: 'Sign in' },
              { id: false, label: 'Create account' },
            ].map((t) => (
              <button
                key={t.label}
                onClick={() => setIsLogin(t.id)}
                className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                  isLogin === t.id
                    ? 'bg-white/[0.08] text-slate-100'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isLogin ? (
          <LoginForm toggleAuthMode={toggleAuthMode} />
        ) : (
          <SignUpForm toggleAuthMode={toggleAuthMode} />
        )}
      </div>
    </div>
  );
}
