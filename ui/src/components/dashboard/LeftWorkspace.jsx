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

export default function LeftWorkspace() {
  const lines = CODE.split('\n');

  return (
    <section className="flex h-full min-h-0 w-full flex-col bg-[#0a0c10]">
      {/* tab strip */}
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-white/5 bg-[#0d1015] px-2">
        <div className="flex items-center gap-2 rounded-t-lg border-b-2 border-teal-400 bg-white/[0.05] px-3 py-1.5 text-[12px] font-medium text-slate-100">
          <svg className="h-3.5 w-3.5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="truncate">axi_interconnect.sv</span>
        </div>
      </div>

      {/* editor */}
      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
        <div className="min-h-full rounded-xl border border-white/5 bg-[#0d1015] shadow-inner shadow-black/40">
          <pre className="overflow-x-auto p-3 font-mono text-[12.5px] leading-6 sm:p-4">
            <code className="block">
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-[2.25rem_1fr] gap-3">
                  <span className="select-none text-right text-slate-700">{i + 1}</span>
                  <span
                    className={
                      line.trim().startsWith('//')
                        ? 'text-slate-500'
                        : 'text-slate-300'
                    }
                  >
                    {line || ' '}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {/* prompt */}
      <div className="shrink-0 border-t border-white/5 bg-[#0d1015] p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-2.5 focus-within:border-teal-400/40">
          <textarea
            rows={2}
            placeholder="Ask about your architecture — e.g. “Why is my AXI transaction hanging?”"
            className="min-h-[44px] w-full resize-none bg-transparent text-[13px] leading-relaxed text-slate-200 placeholder-slate-600 outline-none"
          />
          <button
            aria-label="Send prompt"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-400 text-[#04211d] transition-colors hover:bg-teal-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          ML scanner active
        </p>
      </div>
    </section>
  );
}
