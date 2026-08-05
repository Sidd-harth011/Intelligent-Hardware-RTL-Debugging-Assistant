export default function LoginForm({ toggleAuthMode }) {
  return (
    <div className="w-full max-w-md mx-auto sm:px-6 md:px-0">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Welcome back</h2>
        <p className="text-sm text-zinc-400 mt-2.5">Sign in to your hardware debugging workspace</p>
      </div>

      <form className="space-y-5">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input 
              type="email" 
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 text-zinc-200 placeholder-zinc-600 transition-all sm:text-sm"
              placeholder="engineer@domain.com"
              required
            />
          </div>
        </div>
        
        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-300">Password</label>
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="password" 
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 text-zinc-200 placeholder-zinc-600 transition-all sm:text-sm"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Primary Submit Button */}
        <button 
          type="submit"
          className="w-full bg-slate-200 hover:bg-white text-slate-900 font-semibold py-2.5 rounded-lg shadow-sm shadow-slate-200/10 transition-all duration-200 active:scale-[0.98] sm:text-sm mt-2"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <span className="h-px w-full bg-zinc-800"></span>
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Or continue with</span>
        <span className="h-px w-full bg-zinc-800"></span>
      </div>

      {/* Social Logins */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button className="flex items-center justify-center space-x-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 py-2.5 rounded-lg text-sm font-medium text-zinc-300 transition-all active:scale-[0.98]">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span>GitHub</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 py-2.5 rounded-lg text-sm font-medium text-zinc-300 transition-all active:scale-[0.98]">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Google</span>
        </button>
      </div>

      {/* Footer Toggle */}
      <p className="text-center text-sm text-zinc-400 mt-8">
        Don't have an account?{' '}
        <button 
          onClick={toggleAuthMode} 
          className="text-slate-300 hover:text-white font-medium underline decoration-zinc-600 underline-offset-4 transition-colors"
        >
          Create one
        </button>
      </p>
    </div>
  );
}