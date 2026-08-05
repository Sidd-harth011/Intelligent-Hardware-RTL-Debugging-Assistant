export default function Header({ onToggleSidebar, sidebarOpen }) {
  return (
    <header className="z-30 flex h-12 shrink-0 select-none items-center justify-between gap-3 border-b border-white/5 bg-[#0d1015]/90 px-2.5 backdrop-blur-md sm:px-4 lg:h-14">
      {/* left */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Hide explorer' : 'Show explorer'}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="group flex min-w-0 cursor-pointer items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-teal-400/20 bg-teal-400/10 transition-colors group-hover:border-teal-400/40">
            <svg className="h-4 w-4 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h1 className="truncate text-[13px] font-semibold tracking-wide text-slate-100">
            Intelligent Debugger
          </h1>
        </div>

        <div className="hidden h-5 w-px bg-white/10 lg:block" />

        <nav className="hidden items-center gap-1.5 text-[12px] font-medium text-slate-500 lg:flex">
          <span className="cursor-pointer transition-colors hover:text-slate-300">workspace</span>
          <span className="text-slate-700">/</span>
          <span className="cursor-pointer transition-colors hover:text-slate-300">rtl_designs</span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-200">axi_interconnect.sv</span>
        </nav>
      </div>

      {/* right */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <span className="hidden items-center gap-1.5 rounded-md border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 lg:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Cloud synced
        </span>

        <button className="hidden items-center gap-1.5 rounded-lg border border-teal-400/25 bg-teal-400/10 px-3 py-1.5 text-xs font-semibold text-teal-300 transition-colors hover:bg-teal-400/20 md:inline-flex">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Synthesize
        </button>

        <button
          aria-label="Settings"
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-slate-700 to-slate-800 text-[11px] font-bold text-slate-200">
          JD
        </div>
      </div>
    </header>
  );
}
