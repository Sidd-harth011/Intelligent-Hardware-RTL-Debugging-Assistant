import { useState } from 'react';

const TABS = [
  { id: 'explanation', label: 'Explanation' },
  { id: 'optimized', label: 'Optimized code' },
  { id: 'sources', label: 'Sources' },
];

export default function RightWorkspace({ debugResponse, isAnalyzing }) {
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
        {isAnalyzing ? (
          <div className="flex h-full flex-col items-center justify-center space-y-3 text-slate-500">
            <svg className="h-6 w-6 animate-spin text-teal-400/50" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-[12px] font-medium animate-pulse">Running ML diagnostics...</p>
          </div>
        ) : !debugResponse ? (
          <div className="flex h-full items-center justify-center text-[12px] text-slate-600">
            Submit a query to analyze the architecture.
          </div>
        ) : (
          <>
            {tab === 'explanation' && (
              <>
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.07] p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300">
                    Root cause
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                    {debugResponse.rootCause}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Reasoning
                  </p>
                  <ol className="mt-2.5 space-y-2.5 text-[13px] leading-relaxed text-slate-400">
                    {debugResponse.reasoning.map((s, i) => (
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
                  {debugResponse.optimizedCode}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}