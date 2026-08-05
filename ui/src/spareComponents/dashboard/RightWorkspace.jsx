export default function RightWorkspace() {
  return (
    <aside className="w-full md:w-1/3 lg:w-[450px] flex flex-col shrink-0 min-h-[400px] md:min-h-0 bg-zinc-950/40 md:border-l border-zinc-800/80 transition-all">
      
      {/* File-style Tabs Header (Matches LeftWorkspace height) */}
      <div className="h-10 border-b border-zinc-800/80 flex items-center px-2 bg-zinc-900/50 shrink-0">
        <div className="flex space-x-1 w-full h-full pt-1.5">
          <button className="px-4 py-1.5 text-xs font-medium bg-zinc-800/80 text-zinc-200 border-t border-x border-zinc-700/80 rounded-t-md shadow-sm flex items-center space-x-2">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>AI Explanation</span>
          </button>
          <button className="px-4 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 rounded-t-md transition-colors flex items-center space-x-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Optimized Code</span>
          </button>
        </div>
      </div>
      
      {/* AI Output Area */}
      <div className="flex-1 p-4 lg:p-5 overflow-y-auto space-y-6">
        
        {/* AI System/Welcome Message */}
        <div className="flex space-x-3">
          {/* AI Avatar */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          {/* Message Content */}
          <div className="flex-1 bg-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-2xl rounded-tl-sm p-4 shadow-sm ring-1 ring-white/5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-1.5">Intelligent Debugger Ready</h3>
            <p className="text-[13px] text-zinc-400 leading-relaxed">
              I am connected to your RAG pipeline and loaded with the latest AMBA AXI, RISC-V, and UVM manuals. How can we optimize your architecture today?
            </p>
            
            {/* Actionable Suggestions (Micro-interactions) */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2.5">Suggested Queries</p>
              <button className="w-full text-left px-3 py-2.5 bg-zinc-950/50 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/80 rounded-lg text-[13px] text-zinc-300 transition-all group flex items-center justify-between active:scale-[0.98]">
                <span>Analyze structural timing bottlenecks</span>
                <svg className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button className="w-full text-left px-3 py-2.5 bg-zinc-950/50 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/80 rounded-lg text-[13px] text-zinc-300 transition-all group flex items-center justify-between active:scale-[0.98]">
                <span>Verify UVM testbench bindings</span>
                <svg className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
        
      </div>

      {/* Model Status Footer */}
      <div className="h-10 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between px-4 shrink-0 mt-auto">
         <div className="flex items-center space-x-2">
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Vector DB Connected</span>
         </div>
         <span className="text-[11px] text-zinc-500 font-medium flex items-center space-x-1">
           <span>Powered by</span>
           <span className="text-zinc-300 font-semibold">Gemini API</span>
         </span>
      </div>

    </aside>
  );
}