"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export const PROJECTS = [
  {
    id:          "ftc-dashboard",
    name:        "FTC Dashboard",
    tagline:     "10 Google Tabs → 1 unified platform",
    description: "All-in-one club management for FIRST Tech Challenge robotics teams. Real-time attendance, Kanban tasks, budget tracking, WebSocket chat with mentions, AI-powered insights via a local LLM (Phi-3.5), and web scraping for part imports. Used live by teams #10937 and #30548.",
    tags:        ["React", "Node.js", "WebSocket", "Local LLM"],
    accent:      "#00ffb3",
    year:        "2024",
    status:      "npm package",
  },
  {
    id:          "vira-os",
    name:        "Vira OS",
    tagline:     "A full Mac-inspired OS — running in your browser",
    description: "Built from scratch in vanilla JS. Full filesystem with persistence, multi-user accounts with UAC, terminal, IDE, browser, games, and a custom Python interpreter. No backend. Runs entirely client-side at a file:// URL.",
    tags:        ["Vanilla JS", "Python Interpreter", "Browser OS"],
    accent:      "#00d4ff",
    year:        "2025",
    status:      "Open Source",
  },
  {
    id:          "project-gelb",
    name:        "GelbIT",
    tagline:     "AI recycling assistant for USAG Stuttgart military families",
    description: "Military families relocating to Germany face German's strict 5-bin recycling system with zero guidance. Built a computer-vision + agentic AI app: a fine-tuned Gemma model classifies items (including contamination), then an agentic Python/Selenium/Ollama system live-scrapes local municipal rules and returns hyper-local, multi-language instructions. 94% accuracy across 100 items. 85% self-reported increase in recycling compliance from beta users.",
    tags:        ["Python", "Gemma", "Computer Vision", "Agentic AI"],
    accent:      "#facc15",
    year:        "2025",
    status:      "Deployed",
  },
  {
    id:          "ap-world",
    name:        "AP World Study",
    tagline:     "Duolingo for AP World History",
    description: "Gamified study app for AP World History exam prep. Spaced-repetition flashcards, unit-based decks, streaks, and a clean interface that doesn't make studying feel like studying.",
    tags:        ["React", "TypeScript", "Education"],
    accent:      "#a78bfa",
    year:        "2025",
    status:      "Live",
  },
  {
    id:          "linux-driver",
    name:        "DWA-131 H1 Driver",
    tagline:     "Upstream Linux kernel driver for D-Link DWA-131 rev H1",
    description: "The D-Link DWA-131 rev H1 USB WiFi adapter had zero Linux support. I reverse-engineered the chip, wrote a plug-and-play kernel driver in C, and submitted it upstream to the Linux kernel. It just works now.",
    tags:        ["C", "Linux Kernel", "USB", "WiFi"],
    accent:      "#f97316",
    year:        "2026",
    status:      "Upstream",
  },
  {
    id:          "mit-maker-analysis",
    name:        "MIT Maker Analysis",
    tagline:     "ML pipeline to reverse-engineer MIT acceptance patterns",
    description: "Scraped 105 YouTube Maker Portfolio videos (25 accepted, 21 rejected), extracted transcripts, and trained a Gradient Boosting classifier on NLP features + Gemma:7b project extraction. 73.9% LOO accuracy. The irony of building this as a current MIT applicant is not lost on me.",
    tags:        ["Python", "NLP", "Gradient Boosting", "Ollama", "Gemma"],
    accent:      "#818cf8",
    year:        "2026",
    status:      "Research",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: headingRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Card entrance (staggered fade-in)
      const cards = trackRef.current?.querySelectorAll(".project-card");
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1, scale: 1, duration: 0.6, stagger: 0.12,
            scrollTrigger: { trigger: trackRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div id="projects" aria-hidden />
      <section ref={sectionRef} className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div ref={headingRef}>
            <div className="section-label mb-4">02 / projects</div>
            <h2 className="font-display font-black text-[clamp(2rem,5vw,4rem)] text-white leading-tight">
              Things I&apos;ve built.<br />
              <span className="text-gradient-cyan">Problems I&apos;ve killed.</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-lg">
              Each project started with something
              that didn&apos;t exist or didn&apos;t work the way I needed.
            </p>
          </div>
        </div>

        {/* Responsive card grid */}
        <div
          ref={trackRef}
          className="max-w-7xl mx-auto px-6 grid gap-6 projects-track"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project: p }: { project: typeof PROJECTS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt on hover
  useEffect(() => {
    const card = cardRef.current!;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / rect.height) * -14;
      const ry   = ((e.clientX - cx) / rect.width ) *  14;
      gsap.to(card, { rotateX: rx, rotateY: ry, scale: 1.02, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: "power2.out" });
    };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card relative glass rounded-2xl flex flex-col group overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Accent glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: p.accent, filter: "blur(60px)" }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative flex-1 p-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.accent }} />
            <span className="terminal text-xs text-slate-500 tracking-widest uppercase">{p.year}</span>
          </div>
          <span
            className="terminal text-xs px-2 py-1 rounded border"
            style={{ color: p.accent, borderColor: `${p.accent}33` }}
          >
            {p.status}
          </span>
        </div>

        <h3 className="font-display font-black text-3xl text-white mb-2">{p.name}</h3>
        <p className="text-sm font-semibold mb-4" style={{ color: p.accent }}>{p.tagline}</p>
        <p className="text-slate-400 text-sm leading-relaxed">{p.description}</p>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-8 pb-8">
        <div className="flex flex-wrap gap-2 mb-5">
          {p.tags.map(t => (
            <span
              key={t}
              className="terminal text-xs px-2 py-1 rounded-sm border border-navy-500/60 text-slate-400"
            >
              {t}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${p.id}`}
          className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase hover:text-cyan-400 transition-colors"
          style={{ color: p.accent }}
        >
          Read case study
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

