export default function Sidebar() {
  return (
    <aside className="w-55 bg-zinc-950/50 border-r border-zinc-800/80 flex flex-col hidden md:flex shrink-0 select-none">
      
      {/* Explorer Header */}
      <div className="h-10 px-4 border-b border-zinc-800/80 flex justify-between items-center bg-zinc-900/40 shrink-0">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Explorer</span>
        <div className="flex items-center space-x-3">
          {/* New File Action */}
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors group">
            <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          {/* Collapse All Action */}
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors group">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* File Tree Area */}
      <div className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        
        {/* Open Editors Section */}
        <div className="mb-5">
          <div className="px-3 mb-1.5 flex items-center space-x-1 cursor-pointer group">
            <svg className="w-3 h-3 text-zinc-500 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">Open Editors</span>
          </div>
          <div className="px-2">
            {/* Active File State */}
            <div className="flex items-center space-x-2 bg-zinc-800/80 text-zinc-200 px-2 py-1.5 rounded-md border border-zinc-700/50 cursor-pointer shadow-sm">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-[13px] font-medium truncate">axi_interconnect.sv</span>
            </div>
          </div>
        </div>
        
        {/* Project Files Section */}
        <div>
          <div className="px-3 mb-1.5 flex items-center space-x-1 cursor-pointer group">
            <svg className="w-3 h-3 text-zinc-500 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">Project Files</span>
          </div>
          
          <div className="px-2 space-y-0.5">
            {/* Inactive File 1 */}
            <div className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 px-2 py-1.5 rounded-md cursor-pointer transition-colors group">
              <svg className="w-4 h-4 text-blue-400 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[13px] truncate">riscv_core.v</span>
            </div>
            
            {/* Inactive File 2 */}
            <div className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 px-2 py-1.5 rounded-md cursor-pointer transition-colors group">
              <svg className="w-4 h-4 text-purple-400 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-[13px] truncate">alu_testbench.cpp</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}