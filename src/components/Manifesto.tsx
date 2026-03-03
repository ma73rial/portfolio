"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "When it's slow,",
  "I complain.",
  "When it doesn't exist,",
  "I build it—",
  "from the ground up.",
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef   = useRef<HTMLDivElement>(null);
  const tagRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Words animate in from below (scroll down)
      const words = linesRef.current?.querySelectorAll(".manifest-word");
      if (words) {
        gsap.fromTo(words,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.04,
            scrollTrigger: {
              trigger: linesRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
        // Second trigger: re-enter from above (scroll back up)
        gsap.fromTo(words,
          { opacity: 0, y: -40 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.04,
            scrollTrigger: {
              trigger: linesRef.current,
              start: "bottom -5%",
              end: "top 50%",
              toggleActions: "none none play none",
            },
          }
        );
      }

      // Tag line
      gsap.fromTo(tagRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: tagRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="max-w-5xl mx-auto">
        <div className="section-label mb-10">01 / manifesto</div>

        <div ref={linesRef} className="mb-12">
          {LINES.map((line, li) => (
            <div key={li} className="overflow-hidden leading-tight">
              <p
                className={`font-display font-black text-[clamp(2rem,5.5vw,5rem)] leading-[1.1] mb-1 flex flex-wrap gap-x-[0.28em] ${li < 3 ? "manifest-dim" : ""}`}
                style={{ color: li < 3 ? "rgba(176,206,227,0.4)" : undefined }}
              >
                {line.split(" ").map((word, wi) => (
                  <span
                    key={wi}
                    className={`manifest-word inline-block ${
                      li >= 3 ? "text-white" : ""
                    } ${word === "rebuild—" ? "text-gradient-cyan" : ""}`}
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* Sub-description */}
        <p
          ref={tagRef}
          className="text-slate-400 text-lg max-w-xl leading-relaxed border-l-2 border-cyan-400/40 pl-5"
        >
          Most people open a ticket. I open a blank file. Whether it&apos;s a Linux kernel driver,
          a browser operating system, or an LLM-powered dashboard — if I need it and it doesn&apos;t
          exist, I build it.
        </p>
      </div>
    </section>
  );
}
