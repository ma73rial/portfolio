"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";

const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), { ssr: false });

const WORDS = ["FROM SCRATCH", "OPEN SOURCE", "AT 15", "FOR LINUX", "SO IT WORSKS", "BECAUSE WHY NOT", "IN MY FREE TIME"];
const TYPE_SPEED   = 60;   // ms per char typed
const DELETE_SPEED = 35;   // ms per char deleted
const PAUSE_AFTER  = 1800; // ms to hold before deleting

export default function Hero() {
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const [typedWord, setTypedWord] = useState(WORDS[0]);

  // Hide animated elements immediately (before first paint) to prevent flash
  useLayoutEffect(() => {
    const words = titleRef.current?.querySelectorAll(".word");
    if (words?.length) gsap.set(words, { opacity: 0, y: 60, rotateX: -40 });
  }, []);

  // Typewriter effect
  useEffect(() => {
    let idx      = 0;
    let charIdx  = WORDS[0].length;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = WORDS[idx];
      if (!deleting) {
        if (charIdx < word.length) {
          charIdx++;
          setTypedWord(word.slice(0, charIdx));
          timer = setTimeout(tick, TYPE_SPEED);
        } else {
          timer = setTimeout(() => { deleting = true; tick(); }, PAUSE_AFTER);
        }
      } else {
        if (charIdx > 0) {
          charIdx--;
          setTypedWord(word.slice(0, charIdx));
          timer = setTimeout(tick, DELETE_SPEED);
        } else {
          deleting = false;
          idx = (idx + 1) % WORDS.length;
          timer = setTimeout(tick, 200);
        }
      }
    };

    timer = setTimeout(tick, PAUSE_AFTER);
    return () => clearTimeout(timer);
  }, []);

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 });

    // Split title words
    const titleEl = titleRef.current;
    if (titleEl) {
      const words = titleEl.querySelectorAll(".word");
      tl.fromTo(words,
        { opacity: 0, y: 60, rotateX: -40 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }
      );
    }

    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.4"
    );

    tl.fromTo(ctaRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.5"
    );

    tl.fromTo(metaRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      "-=0.3"
    );
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center overflow-hidden grid-overlay"
    >
      {/* Particle background */}
      <ParticleCanvas />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto mt-auto mb-auto pt-24">
        {/* Meta label */}
        <div ref={metaRef} className="flex items-center justify-center gap-3 mb-8 opacity-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 relative pulse-ring" />
          <span className="section-label text-emerald-400">Open Source Contributor · High School Sophomore</span>
        </div>

        {/* Main heading with word split */}
        <h1
          ref={titleRef}
          className="font-display font-black text-[clamp(2.8rem,8vw,7rem)] leading-none tracking-tight text-white mb-6"
          style={{ perspective: "800px" }}
        >
          {"I build".split(" ").map(w => (
            <span key={w} className="word inline-block mr-[0.25em] last:mr-0">{w}</span>
          ))}
          {" "}
          <span className="word inline-block text-gradient-cyan mr-[0.25em]">operating systems,</span>
          {" "}
          <br className="hidden sm:block" />
          {"kernel drivers, and platforms".split(" ").map(w => (
            <span key={w} className="word inline-block mr-[0.25em] last:mr-0 text-slate-400">{w}</span>
          ))}
          {" "}
          <span className="word inline-block text-gradient-white">from scratch</span>
          <span className="word inline-block text-cyan-400">.</span>
        </h1>

        {/* Rotating sub-description */}
        <p
          ref={subtitleRef}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light opacity-0"
        >
          I get frustrated at software that doesn&apos;t exist — so I build it{" "}
          <span className="text-cyan-400 font-semibold terminal">
            {typedWord}<span className="cursor-blink">|</span>
          </span>
          . Browser OS, Linux drivers, LLM dashboards.
        </p>

        {/* CTA buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0">
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative w-48 py-4 bg-cyan-400 text-navy-900 font-bold text-sm tracking-widest uppercase rounded-sm overflow-hidden hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] transition-all duration-300"
          >
            <span className="relative z-10">View Projects</span>
            <span className="absolute inset-0 bg-emerald-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          </button>
          <a
            href="https://github.com/ma7erial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-48 py-4 text-center border border-cyan-400/40 text-cyan-400 font-semibold text-sm tracking-widest uppercase rounded-sm hover:bg-cyan-400/10 transition-all duration-300"
          >
            GitHub →
          </a>
        </div>
      </div>

      {/* Scroll indicator — always pinned at bottom, above all layers */}
      <div className="relative z-20 flex flex-col items-center gap-2 pb-8 mt-auto">
        <span className="section-label text-slate-500">scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-cyan-400/50 to-transparent" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-24 left-6 hidden lg:block">
        <div className="terminal text-xs text-slate-600 space-y-1">
          <div>// vira_os v1.0</div>
          <div>// apps: <span className="text-emerald-400">30+</span></div>
          <div>// python: <span className="text-cyan-400">built-in</span></div>
        </div>
      </div>
      <div className="absolute top-24 right-6 hidden lg:block text-right">
        <div className="terminal text-xs text-slate-600 space-y-1">
          <div>driver: <span className="text-cyan-400">dwa-131 h1</span></div>
          <div>kernel: <span className="text-emerald-400">linux upstream</span></div>
          <div>ftc: <span className="text-slate-400">teams #10937 #30548</span></div>
        </div>
      </div>
    </section>
  );
}