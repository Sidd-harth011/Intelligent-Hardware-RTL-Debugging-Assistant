import { useState } from 'react';

const TABS = [
  { id: 'explanation', label: 'Explanation' },
  { id: 'optimized', label: 'Optimized code' },
  { id: 'sources', label: 'Sources' },
];

export default function RightWorkspace() {
  const [tab, setTab] = useState('explanation');

  return (
    <section className="flex h-full min-h-0 w-full flex-col border-l border-white/5 bg-[#0b0e13]">
      <div className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-white/5 bg-[#0d1015] px-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
              tab === t.id
                ? 'bg-white/[0.07] text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
        {tab === 'explanation' && (
          <>
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.07] p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300">
                Root cause
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                The write-response channel never asserts <code className="rounded bg-white/10 px-1 font-mono text-[12px] text-teal-300">BREADY</code>,
                so the arbiter holds the grant and every subsequent master stalls behind it.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Reasoning
              </p>
              <ol className="mt-2.5 space-y-2.5 text-[13px] leading-relaxed text-slate-400">
                {[
                  'Master 0 issues AW + W beats and the slave accepts both.',
                  'BVALID rises, but the interconnect never returns BREADY.',
                  'Round-robin grant cannot advance while the response is outstanding.',
                ].map((s, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-400/15 text-[11px] font-bold text-teal-300">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}

        {tab === 'optimized' && (
          <div className="overflow-hidden rounded-xl border border-white/5 bg-[#0d1015]">
            <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
              <span className="text-[11px] font-semibold text-slate-400">patch.sv</span>
              <button className="rounded-md border border-white/10 px-2 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/[0.06]">
                Copy
              </button>
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[12.5px] leading-6 text-slate-300">
{`always_comb begin
  s.bready = 1'b1;          // always accept responses
  grant_d  = resp_done ? next_grant : grant_q;
end`}
            </pre>
          </div>
        )}

        {tab === 'sources' && (
          <div className="space-y-2">
            {['AMBA AXI4 Spec — §A3.3 Write response channel', 'UVM Cookbook — Arbiter deadlocks', 'RISC-V SoC integration notes'].map((s) => (
              <div
                key={s}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-[13px] text-slate-400 transition-colors hover:border-teal-400/25 hover:text-slate-200"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-white/5 p-3">
        <button className="w-full rounded-lg bg-teal-400 py-2.5 text-[13px] font-semibold text-[#04211d] transition-colors hover:bg-teal-300">
          Apply fix to editor
        </button>
      </div>
    </section>
  );
}
