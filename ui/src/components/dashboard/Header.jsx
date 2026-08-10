import { useNavigate } from 'react-router-dom';

export default function Header({ onToggleSidebar, currentFileName }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // 1. Clear the authentication token from storage
    localStorage.removeItem('token'); // Replace 'token' with your actual storage key if different
    
    // 2. Redirect back to the login screen
    navigate('/');
  };

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-[#0d1015] px-4">
      {/* Left: Sidebar Toggle & Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg border border-teal-400/30 bg-gradient-to-br from-teal-400/20 to-teal-500/5 shadow-sm">
            <svg className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="hidden text-[13px] font-bold tracking-tight text-slate-100 sm:inline">
            Hardware Debugger AI
          </span>
        </div>
      </div>

      {/* Center: File path breadcrumb */}
      <div className="hidden items-center gap-2 rounded-md border border-white/5 bg-white/[0.03] px-3 py-1 font-mono text-[12px] text-slate-400 md:flex">
        <span className="text-slate-500">workspace</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200">{currentFileName}</span>
      </div>

      {/* Right: Profile User Avatar & Sign Out */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-inner">
          JD
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d1015]" />
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}