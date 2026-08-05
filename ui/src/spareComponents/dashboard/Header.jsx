export default function Header() {
  return (
    <header className="h-12 lg:h-14 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between px-3 lg:px-4 shrink-0 select-none z-20">
      
      {/* Left Area: Branding & Breadcrumbs */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        
        {/* Logo & Application Title */}
        <div className="flex items-center space-x-2.5 cursor-pointer group">
          <div className="w-8 h-8 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg border border-zinc-700/50 flex items-center justify-center shadow-inner group-hover:border-slate-500/50 transition-colors">
            {/* Custom Microchip SVG Logo (Matches AuthPage) */}
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h1 className="font-semibold tracking-wide text-[13px] text-zinc-200 hidden sm:block group-hover:text-white transition-colors">
            Intelligent Debugger
          </h1>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-zinc-800/80"></div>

        {/* IDE-style Breadcrumb Navigation */}
        <div className="hidden md:flex items-center text-[12px] font-medium text-zinc-500 space-x-1.5">
          <span className="hover:text-zinc-300 cursor-pointer transition-colors">workspace</span>
          <svg className="w-3.5 h-3.5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="hover:text-zinc-300 cursor-pointer transition-colors">rtl_designs</span>
          <svg className="w-3.5 h-3.5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-zinc-300 cursor-default">axi_interconnect.sv</span>
        </div>
      </div>
      
      {/* Right Area: Actions, Status & Profile */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        
        {/* Cloud Sync Status */}
        <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-medium bg-emerald-950/30 text-emerald-500/90 px-2.5 py-1.5 rounded-md border border-emerald-900/30">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Cloud Synced</span>
        </div>

        {/* Utility Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-r border-zinc-800/80 pr-3 sm:pr-5">
          {/* Settings Icon */}
          <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          {/* Synthesize / Action Button */}
          <button className="hidden md:flex items-center space-x-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-all text-xs font-semibold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span>Run ML Scan</span>
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="relative group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-full border border-slate-500 group-hover:ring-2 group-hover:ring-slate-400 transition-all flex items-center justify-center shadow-sm">
            <span className="text-[11px] text-white font-bold tracking-wider">JD</span>
          </div>
          {/* Online Indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full"></div>
        </div>

      </div>
    </header>
  );
}