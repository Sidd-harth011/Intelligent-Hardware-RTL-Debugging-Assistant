import Header from './Header';
import Sidebar from './Sidebar';
import LeftWorkspace from './LeftWorkspace';
import RightWorkspace from './RightWorkspace';
import Footer from './Footer';

export default function Dashboard() {
  return (
    <div className="h-screen w-full bg-[#09090b] text-zinc-200 flex flex-col font-sans overflow-hidden selection:bg-indigo-500/30 relative">
      
      {/* Subtle Ambient Background (Toned down for IDE focus) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"></div>

      {/* Top Navigation */}
      <Header />

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden z-10 relative">
        
        {/* Left Sidebar (File Explorer) */}
        <Sidebar />
        
        {/* Workspaces Wrapper - Stacks vertically on mobile, side-by-side on desktop */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative bg-zinc-950/20 shadow-inner">
          
          {/* Primary Engineering Area */}
          <LeftWorkspace />
          
          {/* IDE Panel Divider (Visible only on Desktop) */}
          <div className="hidden md:flex w-px bg-zinc-800/80 hover:bg-indigo-500/50 cursor-col-resize transition-colors duration-200 z-20 shrink-0"></div>

          {/* AI Output & Optimization Area */}
          <RightWorkspace />
          
        </div>
      </div>

      {/* Bottom Status Bar */}
      <Footer />
      
    </div>
  );
}