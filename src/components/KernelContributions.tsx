"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTRIBUTIONS, type Contribution } from "@/data/kernelContributions";

gsap.registerPlugin(ScrollTrigger);

const STATUS_STYLES: Record<Contribution["status"], string> = {
  Upstream: "text-emerald-400 border-emerald-400/30",
  Reviewed: "text-cyan-400   border-cyan-400/30",
  Sent:     "text-slate-400  border-slate-500/30",
};

export default function KernelContributions() {
  const sectionRef  = useRef<HTMLElement>(null);
  const listRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = listRef.current?.querySelectorAll(".contrib-item");
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.55, stagger: 0.1,
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="kernel" className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #00d4ff, transparent 70%)" }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="section-label mb-4">04 / open source</div>
        <h2 className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] text-white leading-tight mb-4">
          Linux Kernel<br />
          <span className="text-gradient-cyan">Contributions.</span>
        </h2>
        <p className="text-slate-400 max-w-xl mb-16 leading-relaxed">
          Real bugs in the real kernel. Each patch below was sent to the upstream
          Linux mailing lists — some reviewed by maintainers at AMD, Intel, Western
          Digital, and Meta.
        </p>

        {/* Timeline — show 3 most recent */}
        <div ref={listRef} className="relative pl-6 border-l border-cyan-400/15 space-y-10">
          {CONTRIBUTIONS.slice(-3).reverse().map((c, i) => (
            <div key={i} className="contrib-item relative">
              {/* Dot */}
              <div
                className="absolute -left-[1.45rem] top-1.5 w-3 h-3 rounded-full border-2 bg-navy-900"
                style={{ borderColor: c.accent }}
              />

              <div className="glass rounded-2xl p-6 group hover:border-white/15 transition-colors">
                {/* Top row */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="terminal text-xs tracking-widest" style={{ color: c.accent }}>
                    {c.date}
                  </span>
                  <span
                    className={`terminal text-xs px-2 py-0.5 rounded border ${STATUS_STYLES[c.status]}`}
                  >
                    {c.status}
                  </span>
                </div>

                {/* Subsystem path */}
                <div className="terminal text-xs text-slate-500 mb-2">{c.subsystem}</div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">
                  {c.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{c.desc}</p>

                {/* Links */}
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

          {/* End node / View all */}
          <div className="relative pl-0">
            <div className="absolute -left-[1.45rem] top-1.5 w-3 h-3 rounded-full border-2 border-cyan-400/30 bg-navy-900" />
            <Link
              href="/kernel"
              className="inline-flex items-center gap-2 mt-1 terminal text-xs text-cyan-400 hover:text-white transition-colors tracking-widest uppercase"
            >
              View all {CONTRIBUTIONS.length} contributions
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
