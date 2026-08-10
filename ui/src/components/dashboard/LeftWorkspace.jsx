import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function LeftWorkspace({ onAnalyze, isAnalyzing, setIsAnalyzing, externalCode, fileName, onCodeChange }) {
  const [code, setCode] = useState(externalCode);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    setCode(externalCode);
  }, [externalCode]);

  const handleEditorChange = (value) => {
    setCode(value);
    if (onCodeChange) onCodeChange(value);
  };

  // Determine Monaco editor language based on file extension
  const getEditorLanguage = (name) => {
    if (!name) return 'plaintext';
    if (name.endsWith('.sv') || name.endsWith('.v') || name.endsWith('.cpp') || name.endsWith('.h')) return 'cpp';
    if (name.endsWith('.json')) return 'json';
    if (name.endsWith('.md')) return 'markdown';
    return 'plaintext'; // Default fallback for text, cover letters, emails, etc.
  };

  const handleDebugSubmit = async () => {
    if (!prompt.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);

    try {
      const response = await fetch('http://localhost:5000/api/ml/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, prompt }),
      });
      
      const data = await response.json();

      if (response.ok && data.analysis) {
        onAnalyze(data.analysis);
      } else {
        console.error("Backend Error: Unexpected data format from server.", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isCodeFile = fileName.endsWith('.sv') || fileName.endsWith('.v') || fileName.endsWith('.cpp') || fileName.endsWith('.h');

  return (
    <section className="flex h-full min-h-0 w-full flex-col bg-[#0a0c10]">
      {/* Tab Strip */}
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-white/5 bg-[#0d1015] px-2">
        <div className="flex items-center gap-2 rounded-t-lg border-b-2 border-teal-400 bg-white/[0.05] px-3 py-1.5 text-[12px] font-medium text-slate-100">
          <svg className="h-3.5 w-3.5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="truncate">{fileName}</span>
        </div>
      </div>

      {/* Editor */}
      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
        <div className="h-full overflow-hidden rounded-xl border border-white/5 bg-[#0d1015] shadow-inner shadow-black/40">
          <Editor
            height="100%"
            language={getEditorLanguage(fileName)}
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
              wordWrap: "on", // Ensures text like cover letters wrap naturally instead of forcing horizontal scroll
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
            placeholder={isCodeFile ? "Ask about your architecture — e.g. “Why is my AXI transaction hanging?”" : "Ask about this text — e.g. “Proofread this cover letter and make it more professional”"}
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
          {isAnalyzing ? 'AI engine processing...' : 'AI engine ready'}
        </p>
      </div>
    </section>
  );
}