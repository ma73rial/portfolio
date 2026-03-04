import Link from "next/link";
import { CONTRIBUTIONS } from "@/data/kernelContributions";
import type { Contribution } from "@/data/kernelContributions";

export const metadata = {
  title: "Linux Kernel Contributions — Max Pezzullo",
  description: "A full timeline of upstream Linux kernel patches — bug fixes, driver work, and subsystem improvements.",
};

const STATUS_STYLES: Record<string, string> = {
  Upstream: "text-emerald-400 border-emerald-400/30",
  Reviewed: "text-cyan-400   border-cyan-400/30",
  Sent:     "text-slate-400  border-slate-500/30",
};

export default function KernelPage() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="section-label mb-4">Open Source</div>
          <h1 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] text-white leading-tight mb-4">
            Linux Kernel<br />
            <span className="text-gradient-cyan">Contributions.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Real bugs in the real kernel. Each patch below was sent to the upstream
            Linux mailing lists — some reviewed by maintainers at AMD, Intel,
            Western Digital, and Meta.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-14">
          {Object.entries(STATUS_STYLES).map(([status, cls]) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`terminal text-xs px-2 py-0.5 rounded border ${cls}`}>{status}</span>
              <span className="text-xs text-slate-500">
                {status === "Upstream" && "Merged into mainline"}
                {status === "Reviewed" && "Reviewed-by received"}
                {status === "Sent"     && "On the mailing list"}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative pl-6 border-l border-cyan-400/15 space-y-10">
          {CONTRIBUTIONS.map((c, i) => (
            <div key={i} className="relative">
              {/* Dot */}
              <div
                className="absolute -left-[1.45rem] top-2 w-3 h-3 rounded-full border-2 bg-navy-900"
                style={{ borderColor: c.accent }}
              />

              <div className="glass rounded-2xl p-6 hover:border-white/15 transition-colors">
                {/* Top row */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="terminal text-xs tracking-widest" style={{ color: c.accent }}>
                    {c.date}
                  </span>
                  <span className={`terminal text-xs px-2 py-0.5 rounded border ${STATUS_STYLES[c.status]}`}>
                    {c.status}
                  </span>
                </div>

                <div className="terminal text-xs text-slate-500 mb-2">{c.subsystem}</div>

                <h2 className="font-display font-bold text-xl text-white mb-3 leading-snug">
                  {c.title}
                </h2>

                <p className="text-sm text-slate-400 leading-relaxed mb-4">{c.desc}</p>

                {c.bugLink && (
                  <a
                    href={c.bugLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 terminal text-xs transition-colors hover:text-white"
                    style={{ color: c.accent }}
                  >
                    View bug report
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}

          <div className="relative pl-0">
            <div className="absolute -left-[1.45rem] top-1.5 w-3 h-3 rounded-full border-2 border-cyan-400/30 bg-navy-900" />
            <p className="text-xs text-slate-600 terminal pt-1">more to come…</p>
          </div>
        </div>

        <div className="mt-16">
          <Link
            href="/"
            className="terminal text-xs text-slate-400 hover:text-cyan-400 transition-colors tracking-widest uppercase"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
