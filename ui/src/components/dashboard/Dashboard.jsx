import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import LeftWorkspace from './LeftWorkspace';
import RightWorkspace from './RightWorkspace';
import Footer from './Footer';

const STORE_KEY = 'ihd.layout.v1';
const RECENT_FILES_KEY = 'ihd.recent_files.v1';
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const DEFAULT_CODE = `// axi_interconnect.sv — paste Verilog / SystemVerilog / C++
module axi_interconnect #(
    parameter int N_MASTERS = 4,
    parameter int DATA_W    = 64
) (
    input  logic clk,
    input  logic rst_n,
    axi_if.slave  m [N_MASTERS],
    axi_if.master s
);
  // Round-robin arbiter across masters
  logic [$clog2(N_MASTERS)-1:0] grant_q, grant_d;

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) grant_q <= '0;
    else        grant_q <= grant_d;
  end
endmodule`;

export default function Dashboard() {
  const shellRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(264);
  const [leftRatio, setLeftRatio] = useState(0.56);
  const [dragging, setDragging] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'ai'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [debugResponse, setDebugResponse] = useState(null);

  // Editor and File State
  const [editorCode, setEditorCode] = useState(DEFAULT_CODE);
  const [fileName, setFileName] = useState("axi_interconnect.sv");

  // Recent Files History (Last 5 files persistent in localStorage)
  const [recentFiles, setRecentFiles] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_FILES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [{ name: "axi_interconnect.sv", content: DEFAULT_CODE }];
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(recentFiles));
    } catch (_) {}
  }, [recentFiles]);

  const handleFileImport = (content, name) => {
    setEditorCode(content);
    setFileName(name);
    setDrawerOpen(false);

    setRecentFiles((prev) => {
      const filtered = prev.filter((f) => f.name !== name);
      return [{ name, content }, ...filtered].slice(0, 5);
    });
  };

  const handleSelectFile = (file) => {
    setEditorCode(file.content);
    setFileName(file.name);
    setDrawerOpen(false);
  };

  /* ---------- restore / persist layout ---------- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      if (typeof saved.sidebarWidth === 'number') setSidebarWidth(clamp(saved.sidebarWidth, 200, 460));
      if (typeof saved.leftRatio === 'number') setLeftRatio(clamp(saved.leftRatio, 0.25, 0.78));
      if (typeof saved.sidebarOpen === 'boolean') setSidebarOpen(saved.sidebarOpen);
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ sidebarWidth, leftRatio, sidebarOpen }));
    } catch (_) {}
  }, [sidebarWidth, leftRatio, sidebarOpen]);

  /* ---------- drag to resize ---------- */
  const onPointerDown = (which) => (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(which);
  };

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging || !shellRef.current) return;
      const rect = shellRef.current.getBoundingClientRect();
      if (dragging === 'sidebar') {
        setSidebarWidth(clamp(e.clientX - rect.left, 200, 460));
      } else {
        const splitLeft = rect.left + (sidebarOpen ? sidebarWidth : 0);
        const splitWidth = rect.width - (sidebarOpen ? sidebarWidth : 0);
        if (splitWidth > 0) setLeftRatio(clamp((e.clientX - splitLeft) / splitWidth, 0.25, 0.78));
      }
    },
    [dragging, sidebarOpen, sidebarWidth]
  );

  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(null);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stop);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stop);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging, onPointerMove]);

  const handleKey = (which) => (e) => {
    const step = e.shiftKey ? 32 : 12;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      if (which === 'sidebar') setSidebarWidth((w) => clamp(w + dir * step, 200, 460));
      else setLeftRatio((r) => clamp(r + dir * 0.02, 0.25, 0.78));
    }
  };

  const resetHandle = (which) => () =>
    which === 'sidebar' ? setSidebarWidth(264) : setLeftRatio(0.56);

  const handleClass = (active) =>
    `group relative hidden md:flex w-[7px] shrink-0 cursor-col-resize items-center justify-center bg-transparent z-30 ${
      active ? 'bg-teal-400/10' : ''
    }`;

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#0a0c10] font-sans text-slate-300 antialiased selection:bg-teal-400/25">
      {/* ambient depth */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[380px] w-full max-w-[900px] -translate-x-1/2 rounded-full bg-teal-500/[0.06] blur-[130px]" />

      <Header
        onToggleSidebar={() => {
          if (window.matchMedia('(min-width: 768px)').matches) setSidebarOpen((v) => !v);
          else setDrawerOpen(true);
        }}
        sidebarOpen={sidebarOpen}
        currentFileName={fileName}
      />

      {/* mobile pane switcher */}
      {!drawerOpen && (
        <div className="z-20 flex shrink-0 gap-1 border-b border-white/5 bg-[#0d1015] p-1.5 md:hidden">
          {[
            { id: 'editor', label: 'Editor' },
            { id: 'ai', label: 'AI Panel' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMobileTab(t.id)}
              className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                mobileTab === t.id
                  ? 'bg-white/[0.07] text-slate-100 shadow-inner shadow-white/5'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div ref={shellRef} className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        {/* desktop sidebar */}
        {sidebarOpen && (
          <>
            <aside
              className="hidden min-h-0 shrink-0 md:block"
              style={{ width: `${sidebarWidth}px` }}
            >
              <Sidebar 
                onFileImport={handleFileImport}
                currentFileName={fileName}
                currentCode={editorCode}
                recentFiles={recentFiles}
                onSelectFile={handleSelectFile}
              />
            </aside>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize explorer"
              tabIndex={0}
              onPointerDown={onPointerDown('sidebar')}
              onDoubleClick={resetHandle('sidebar')}
              onKeyDown={handleKey('sidebar')}
              className={handleClass(dragging === 'sidebar')}
            >
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10 transition-colors group-hover:bg-teal-400/60 group-focus-visible:bg-teal-400" />
            </div>
          </>
        )}

        {/* mobile drawer */}
        <div
          className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          aria-hidden={!drawerOpen}
        >
          <div
            onClick={() => setDrawerOpen(false)}
            className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
              drawerOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`absolute inset-y-0 left-0 w-[82%] max-w-[300px] bg-[#0d1015] shadow-2xl transition-transform duration-300 ease-out z-50 ${
              drawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar 
              onClose={() => setDrawerOpen(false)} 
              onFileImport={handleFileImport}
              currentFileName={fileName}
              currentCode={editorCode}
              recentFiles={recentFiles}
              onSelectFile={handleSelectFile}
            />
          </div>
        </div>

        {/* workspaces */}
        <div className="flex min-w-0 flex-1 overflow-hidden">
          <div
            className={`min-w-0 flex-1 md:flex-none ${mobileTab === 'editor' ? 'flex' : 'hidden'} md:flex`}
            style={{ flexBasis: `${leftRatio * 100}%` }}
          >
            <LeftWorkspace 
              onAnalyze={(res) => {
                setDebugResponse(res);
                setMobileTab('ai'); // Auto-switch to AI tab on mobile
              }}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
              externalCode={editorCode}
              fileName={fileName}
              onCodeChange={setEditorCode}
            />
          </div>

          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize workspaces"
            tabIndex={0}
            onPointerDown={onPointerDown('split')}
            onDoubleClick={resetHandle('split')}
            onKeyDown={handleKey('split')}
            className={handleClass(dragging === 'split')}
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10 transition-colors group-hover:bg-teal-400/60 group-focus-visible:bg-teal-400" />
          </div>

          <div
            className={`min-w-0 flex-1 ${mobileTab === 'ai' ? 'flex' : 'hidden'} md:flex`}
          >
            <RightWorkspace 
              debugResponse={debugResponse} 
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}