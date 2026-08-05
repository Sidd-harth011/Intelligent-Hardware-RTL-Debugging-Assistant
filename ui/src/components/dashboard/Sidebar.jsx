const OPEN_EDITORS = [{ name: 'axi_interconnect.sv', kind: 'sv', active: true }];

const PROJECT_FILES = [
  { name: 'riscv_core.v', kind: 'v' },
  { name: 'alu_testbench.cpp', kind: 'cpp' },
  { name: 'uart_rx.sv', kind: 'sv' },
  { name: 'constraints.xdc', kind: 'xdc' },
];

const TONE = {
  sv: 'text-teal-300',
  v: 'text-sky-300',
  cpp: 'text-amber-300',
  xdc: 'text-slate-400',
};

function FileRow({ file, active }) {
  return (
    <button
      className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
        active
          ? 'bg-white/[0.07] text-slate-100 ring-1 ring-inset ring-teal-400/20'
          : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
      }`}
    >
      <svg className={`h-4 w-4 shrink-0 ${TONE[file.kind] || 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span className="truncate">{file.name}</span>
    </button>
  );
}

export default function Sidebar({ onClose }) {
  return (
    <div className="flex h-full min-h-0 flex-col border-r border-white/5 bg-[#0b0e13]">
      <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-white/5 px-3">
        <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Explorer
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          <button aria-label="New file" className="grid h-7 w-7 place-items-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m3 9a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
          </button>
          {onClose && (
            <button aria-label="Close explorer" onClick={onClose} className="grid h-7 w-7 place-items-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200 md:hidden">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-2 py-3">
        <section>
          <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
            Open editors
          </p>
          {OPEN_EDITORS.map((f) => (
            <FileRow key={f.name} file={f} active />
          ))}
        </section>

        <section>
          <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
            Project files
          </p>
          {PROJECT_FILES.map((f) => (
            <FileRow key={f.name} file={f} />
          ))}
        </section>
      </div>

      <div className="shrink-0 p-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="text-[12px] font-semibold text-slate-200">RAG index</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            AMBA AXI · RISC-V · UVM manuals loaded
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
