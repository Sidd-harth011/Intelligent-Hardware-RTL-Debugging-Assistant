export default function Header({ onToggleSidebar, currentFileName }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-[#0d1015] px-4">
      {/* Left: Sidebar Toggle & Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-teal-400/20 to-teal-500/5 border border-teal-400/30 shadow-sm">
            <svg className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[13px] font-bold tracking-tight text-slate-100 hidden sm:inline">
            Hardware Debugger AI
          </span>
        </div>
      </div>

      {/* Center: File path breadcrumb */}
      <div className="hidden md:flex items-center gap-2 rounded-md bg-white/[0.03] border border-white/5 px-3 py-1 text-[12px] text-slate-400 font-mono">
        <span className="text-slate-500">workspace</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200">{currentFileName}</span>
      </div>

      {/* Right: Profile User Avatar */}
      <div className="flex items-center gap-3">
        <div className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white text-xs shadow-inner">
          JD
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d1015]" />
        </div>
      </div>
    </header>
  );
}