export default function Footer() {
  return (
    <footer className="z-20 flex h-8 shrink-0 select-none items-center justify-between gap-3 border-t border-white/5 bg-[#0d1015] px-2.5 text-[11px] font-medium text-slate-500 sm:px-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <span className="inline-flex shrink-0 items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12m0 0a3 3 0 103 3m-3-3a3 3 0 113-3m9-6a3 3 0 11-3 3m3-3v6a6 6 0 01-6 6" />
          </svg>
          main
        </span>
        <span className="hidden truncate sm:inline">SystemVerilog · UTF-8</span>
        <span className="hidden md:inline">Ln 14, Col 22</span>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <span className="hidden lg:inline">Verilator 5.02</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Connected
        </span>
      </div>
    </footer>
  );
}
