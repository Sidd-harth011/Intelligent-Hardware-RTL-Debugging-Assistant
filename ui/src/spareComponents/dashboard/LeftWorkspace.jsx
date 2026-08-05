import Editor from '@monaco-editor/react';

export default function LeftWorkspace() {
  return (
    <main className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-zinc-800/80 min-w-0 bg-zinc-950/30">
      
      {/* File Tab Header */}
      <div className="h-10 border-b border-zinc-800/80 flex items-center px-4 shrink-0 bg-zinc-900/50">
        <div className="flex items-center space-x-2 text-xs font-medium text-zinc-300 bg-zinc-800/50 px-3 py-1.5 rounded-md border border-zinc-700/50 shadow-sm">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>axi_interconnect.sv</span>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 p-3 lg:p-4">
        <div className="h-full rounded-xl overflow-hidden border border-zinc-700/60 shadow-inner shadow-black/40 ring-1 ring-white/5 bg-[#1e1e1e]">
          <Editor
            height="100%"
            defaultLanguage="cpp" 
            theme="vs-dark"
            defaultValue="// Paste your Verilog, SystemVerilog, or C++ design here..."
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth"
            }}
          />
        </div>
      </div>
      
      {/* Prompt Input Area */}
      <div className="bg-zinc-900/60 backdrop-blur-md border-t border-zinc-800/80 p-3 lg:p-4 shrink-0 flex flex-col transition-all">
        <div className="relative">
          <textarea 
            className="w-full h-24 lg:h-28 bg-zinc-950/80 border border-zinc-700/80 rounded-xl p-3.5 pr-14 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 resize-none transition-all placeholder-zinc-600 shadow-inner"
            placeholder="Ask the AI about your architecture (e.g., 'Why is my AXI transaction hanging?')"
          ></textarea>
          
          {/* Floating Action Submit Button */}
          <button className="absolute bottom-3 right-3 bg-slate-200 hover:bg-white text-slate-900 p-2.5 rounded-lg shadow-sm shadow-slate-200/10 transition-all duration-200 active:scale-[0.98] group flex items-center justify-center">
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center mt-3 px-1">
          {/* ML Scanner Status */}
          <div className="flex items-center space-x-2 bg-zinc-800/60 px-2.5 py-1 rounded-full border border-zinc-700/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">ML Scanner Active</span>
          </div>
          
          {/* Keyboard Shortcut Hint */}
          <div className="hidden sm:flex items-center space-x-1">
             <span className="text-[11px] text-zinc-500 font-medium">Press</span>
             <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-400 font-mono">Shift</kbd>
             <span className="text-[11px] text-zinc-500 font-medium">+</span>
             <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-400 font-mono">Enter</kbd>
             <span className="text-[11px] text-zinc-500 font-medium">to debug</span>
          </div>
        </div>
      </div>
    </main>
  );
}