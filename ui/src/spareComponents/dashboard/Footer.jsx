export default function Footer() {
  return (
    <footer className="h-8 lg:h-9 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-between px-3 lg:px-4 text-[11px] font-medium text-zinc-500 shrink-0 select-none z-10 relative">
      
      {/* Left Area: Live System Status */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        
        {/* Node Backend Status */}
        <div className="flex items-center space-x-1.5 cursor-default group hover:text-zinc-300 transition-colors">
          <span className="relative flex w-1.5 h-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-500"></span>
          </span>
          <span>Node Backend Connected</span>
        </div>

        <span className="hidden sm:inline text-zinc-700/80 font-light">|</span>

        {/* Vector DB Status */}
        <div className="hidden sm:flex items-center space-x-1.5 cursor-default group hover:text-zinc-300 transition-colors">
          <span className="relative flex w-1.5 h-1.5">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"></span>
          </span>
          <span className="flex space-x-1">
            <span>Vector DB:</span>
            <span className="text-amber-500 group-hover:text-amber-400 transition-colors">Connecting...</span>
          </span>
        </div>

      </div>

      {/* Right Area: Legal & Links */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        
        {/* Optional Secondary Links (Hidden on tiny mobile screens) */}
        <a href="#" className="hidden md:inline hover:text-zinc-300 transition-colors">Documentation</a>
        <span className="hidden md:inline text-zinc-700/80 font-light">|</span>
        
        <a href="#" className="hidden sm:inline hover:text-zinc-300 transition-colors">Privacy Policy</a>
        <span className="hidden sm:inline text-zinc-700/80 font-light">|</span>
        
        <a href="#" className="hidden sm:inline hover:text-zinc-300 transition-colors">Terms of Service</a>
        <span className="hidden sm:inline text-zinc-700/80 font-light">|</span>
        
        {/* Copyright */}
        <span className="text-zinc-600 hover:text-zinc-400 transition-colors cursor-default">
          &copy; {new Date().getFullYear()} Intelligent Debugger
        </span>

      </div>
    </footer>
  );
}