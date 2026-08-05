import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import LeftWorkspace from './LeftWorkspace';
import RightWorkspace from './RightWorkspace';
import Footer from './Footer';

const STORE_KEY = 'ihd.layout.v1';
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function Dashboard() {
  const shellRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(264);
  const [leftRatio, setLeftRatio] = useState(0.56); // left workspace share of the split
  const [dragging, setDragging] = useState(null); // 'sidebar' | 'split' | null
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'ai'

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
      />

      {/* mobile pane switcher */}
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

      <div ref={shellRef} className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        {/* desktop sidebar */}
        {sidebarOpen && (
          <>
            <aside
              className="hidden min-h-0 shrink-0 md:block"
              style={{ width: `${sidebarWidth}px` }}
            >
              <Sidebar />
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
          className={`fixed inset-0 z-50 md:hidden ${drawerOpen ? '' : 'pointer-events-none'}`}
          aria-hidden={!drawerOpen}
        >
          <div
            onClick={() => setDrawerOpen(false)}
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
              drawerOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`absolute inset-y-0 left-0 w-[82%] max-w-[300px] shadow-2xl transition-transform duration-200 ${
              drawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </div>

        {/* workspaces */}
        <div className="flex min-w-0 flex-1 overflow-hidden">
          <div
            className={`min-w-0 flex-1 md:flex-none ${mobileTab === 'editor' ? 'flex' : 'hidden'} md:flex`}
            style={{ flexBasis: `${leftRatio * 100}%` }}
          >
            <LeftWorkspace />
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
            <RightWorkspace />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
