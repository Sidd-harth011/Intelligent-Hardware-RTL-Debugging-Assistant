import { useState } from 'react';
import Editor from '@monaco-editor/react';

// ... keep your CODE constant exactly the same ...
const CODE = `// axi_interconnect.sv — paste Verilog / SystemVerilog / C++
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

export default function LeftWorkspace({ onAnalyze, isAnalyzing, setIsAnalyzing }) {
  const [code, setCode] = useState(CODE);
  const [prompt, setPrompt] = useState('');

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleDebugSubmit = async () => {
    if (!prompt.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);

    try {
      const response = await fetch('http://localhost:5000/api/debug/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, prompt }),
      });
      
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        onAnalyze(data.data); // Send data up to the Dashboard
      } else {
        console.error("Backend Error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-col bg-[#0a0c10]">
      {/* ... keep your tab strip identical ... */}
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-white/5 bg-[#0d1015] px-2">
        <div className="flex items-center gap-2 rounded-t-lg border-b-2 border-teal-400 bg-white/[0.05] px-3 py-1.5 text-[12px] font-medium text-slate-100">
          <svg className="h-3.5 w-3.5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="truncate">axi_interconnect.sv</span>
        </div>
      </div>

      {/* Editor */}
      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
        <div className="h-full overflow-hidden rounded-xl border border-white/5 bg-[#0d1015] shadow-inner shadow-black/40">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 16 },
              cursorBlinking: "smooth",
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>

      {/* Prompt Area */}
      <div className="shrink-0 border-t border-white/5 bg-[#0d1015] p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-2.5 focus-within:border-teal-400/40 transition-colors">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask about your architecture — e.g. “Why is my AXI transaction hanging?”"
            className="min-h-[44px] w-full resize-none bg-transparent text-[13px] leading-relaxed text-slate-200 placeholder-slate-600 outline-none"
          />
          <button
            onClick={handleDebugSubmit}
            disabled={isAnalyzing}
            aria-label="Send prompt"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#04211d] shadow-lg transition-all ${
              isAnalyzing ? 'bg-teal-600 animate-pulse cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-300 active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <svg className="h-4 w-4 animate-spin text-teal-200" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>
        </div>
        <p className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          <span className="relative flex h-1.5 w-1.5">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isAnalyzing ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isAnalyzing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          {isAnalyzing ? 'ML scanner analyzing...' : 'ML scanner ready'}
        </p>
      </div>
    </section>
  );
}