import { useState } from 'react';

const TABS = [
  { id: 'explanation', label: 'Explanation' },
  { id: 'optimized', label: 'Optimized code' },
  { id: 'sources', label: 'Sources' },
];

export default function RightWorkspace({ debugResponse, isAnalyzing }) {
  const [tab, setTab] = useState('explanation');
  const [copied, setCopied] = useState(false);

  // Helper to safely resolve keys whether nested under 'properties' or flat
  const getVal = (key) => {
    if (!debugResponse) return null;
    if (debugResponse[key] !== undefined) return debugResponse[key];
    if (debugResponse.properties && debugResponse.properties[key] !== undefined) {
      return debugResponse.properties[key];
    }
    return null;
  };

  const rootCause = getVal('rootCause');
  const reasoning = getVal('reasoning');
  const optimizedCode = getVal('optimizedCode');
  const sources = getVal('sources');

  const handleCopyCode = () => {
    const codeToCopy = typeof debugResponse === 'string' 
      ? debugResponse 
      : optimizedCode || "";
      
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <p className="text-[12px] font-medium animate-pulse">Running AI diagnostics...</p>
          </div>
        ) : !debugResponse ? (
          <div className="flex h-full items-center justify-center text-[12px] text-slate-600">
            Submit a query to analyze the document or architecture.
          </div>
        ) : (
          <>
            {tab === 'explanation' && (
              typeof debugResponse === 'string' ? (
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-[13.5px] leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {debugResponse}
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.07] p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300">
                      Summary / Root Cause
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                      {rootCause || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Reasoning & Analysis
                    </p>
                    <ol className="mt-2.5 space-y-2.5 text-[13px] leading-relaxed text-slate-400">
                      {reasoning?.map((s, i) => (
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
              )
            )}

            {tab === 'optimized' && (
              <div className="overflow-hidden rounded-xl border border-white/5 bg-[#0d1015]">
                <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
                  <span className="text-[11px] font-semibold text-slate-400">output_patch.sv</span>
                  <button onClick={handleCopyCode} className="rounded-md border border-white/10 px-2 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/[0.06]">
                    {copied ? (
                      <>
                        <svg className="h-3.5 w-3.5 text-emerald-400 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5 text-slate-400 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-6 text-slate-300 whitespace-pre-wrap">
                  {typeof debugResponse === 'string' ? "No code optimizations available for this query." : (optimizedCode || "No revised code or text modifications generated for this request.")}
                </pre>
              </div>
            )}

            {tab === 'sources' && (
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-3">
                  Retrieved Documentation / Standards
                </p>
                {typeof debugResponse === 'string' || !sources?.length ? (
                   <p className="text-[13px] text-slate-400">No specific sources were retrieved for this query.</p>
                ) : (
                  <ul className="space-y-3">
                    {sources.map((src, index) => (
                      <li key={index} className="flex items-start gap-3 rounded-lg border border-indigo-500/10 bg-indigo-500/[0.02] p-3">
                        <svg className="h-5 w-5 shrink-0 text-indigo-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        <span className="text-[13px] leading-relaxed text-slate-300">{src}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}