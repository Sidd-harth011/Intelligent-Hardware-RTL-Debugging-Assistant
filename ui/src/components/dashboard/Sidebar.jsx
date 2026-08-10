import { useRef } from 'react';

export default function Sidebar({ onFileImport, currentFileName, currentCode, recentFiles = [], onSelectFile }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (onFileImport) {
        onFileImport(content, file.name);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExportFile = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFileName || 'rtl_patch_export.sv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="flex h-full w-full flex-col bg-[#0d1015]">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".sv,.v,.vh,.cpp,.h,.txt" 
        className="hidden" 
      />

      <div className="flex h-10 items-center justify-between border-b border-white/5 px-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Project Files</span>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => fileInputRef.current.click()} 
            title="Import Verilog/C++ File"
            className="rounded p-1 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>

          <button 
            onClick={handleExportFile} 
            title="Export Current Code"
            className="rounded p-1 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Render Last 5 Imported/Active Files List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">Open & Recent (Last 5)</p>
        {recentFiles.map((file, index) => {
          const isActive = file.name === currentFileName;
          return (
            <div 
              key={index}
              onClick={() => onSelectFile && onSelectFile(file)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12.5px] font-medium cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-white/[0.07] text-teal-300 border border-teal-400/20 shadow-inner' 
                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <svg className={`h-4 w-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate">{file.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}