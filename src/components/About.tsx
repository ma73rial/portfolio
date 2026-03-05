"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { STACK } from "@/data/stack";

gsap.registerPlugin(ScrollTrigger);

// Precompute final spread positions — arc fan, center highest, edges droop down
const SPREAD = STACK.map((_, i) => {
  const t       = STACK.length > 1 ? i / (STACK.length - 1) : 0.5;
  const theta   = (t - 0.5) * 56;                  // −28° → +28°
  const rad     = (theta * Math.PI) / 180;
  return {
    x:       Math.sin(rad) * 700,                   // lateral displacement
    y:       (1 - Math.cos(rad)) * 350,             // downward arc at edges (+y = down)
    rotateZ: theta,
  };
});

const TIMELINE = [
  { year: "2022", title: "First real program",  desc: "Started writing Python scripts to automate things in middle school. Never looked back." },
  { year: "2023", title: "FTC Robotics",        desc: "Joined FIRST Tech Challenge teams #10937 and #30548 at Stuttgart High School. Immediately started building the team dashboard because 10 Google Tabs was not acceptable." },
  { year: "2024", title: "Vira OS",             desc: "Built a full Mac-inspired OS running in the browser — filesystem, UAC, terminal, IDE, browser, 30+ apps, and a custom Python interpreter. From scratch. As a freshman." },
  { year: "2025", title: "Linux Kernel Driver", desc: "Reverse-engineered the D-Link DWA-131 rev H1 USB WiFi chip, wrote a plug-and-play Linux kernel driver in C, and submitted it upstream." },
  { year: "2025", title: "GelbIT",              desc: "Built an AI recycling assistant for USAG Stuttgart military families — computer vision, agentic scraping, and real-time local rules. Deployed to beta users." },
];

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stackRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const isDealtRef  = useRef(false);
  const activeCardRef = useRef<number | null>(null);

  // Restore all cards to their SPREAD resting positions
  const restoreAll = () => {
    if (activeCardRef.current === null) return;
    activeCardRef.current = null;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    cards.forEach((card, j) => {
      if (!card) return;
      gsap.to(card, { x: SPREAD[j].x, y: SPREAD[j].y, scale: 1, duration: 0.25, ease: "power2.out" });
      card.style.zIndex = String(j + 1);
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline animate-in
      const items = timelineRef.current?.querySelectorAll(".timeline-item");
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.6, stagger: 0.15,
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Desktop-only: deal + cascade flip when section enters view
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        if (!cards.length) return;

        // Start stacked at center, back face up
        gsap.set(cards, { x: 0, rotateZ: 0, rotateY: 0 });

        ScrollTrigger.create({
          trigger: stackRef.current,
          start: "top 60%",
          once: true,
          onEnter: () => {
            if (isDealtRef.current) return;
            isDealtRef.current = true;

            const tl = gsap.timeline();

            // Phase 1: deal — each card slides to its arc position
            tl.to(cards, {
              x:       (i: number) => SPREAD[i].x,
              y:       (i: number) => SPREAD[i].y,
              rotateZ: (i: number) => SPREAD[i].rotateZ,
              duration: 0.4,
              ease:     "power3.out",
              stagger:  0.035,
            });

            // Phase 2: cascade flip — rotateY 0→180 in a wave
            // stagger of 0.05s means when card[0] is at 90°, card[1] is at ~72°, card[2] at ~54°, etc.
            tl.to(cards, {
              rotateY:  180,
              duration: 0.5,
              ease:     "power1.inOut",
              stagger:  0.05,
            }, "-=0.05");
          },
        });

        // Restore all cards when user scrolls away
        ScrollTrigger.create({
          trigger: stackRef.current,
          start:  "top bottom",
          end:    "bottom top",
          onLeave:     restoreAll,
          onLeaveBack: restoreAll,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardHover = (i: number) => {
    if (!isDealtRef.current) return;
    activeCardRef.current = i;
    const PUSH = 45;
    cardRefs.current.forEach((card, j) => {
      if (!card) return;
      const offsetX = j < i ? -PUSH : j > i ? PUSH : 0;
      gsap.to(card, {
        x: SPREAD[j].x + offsetX,
        y: SPREAD[j].y,
        scale: j === i ? 1.06 : 1,
        duration: 0.25,
        ease: "power2.out",
      });
      card.style.zIndex = j === i ? "100" : String(j + 1);
    });
  };

  const handleContainerLeave = () => restoreAll();

  return (
    <section ref={sectionRef} id="about" className="relative py-32 px-6 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div className="section-label mb-10">03 / about</div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left: Bio */}
          <div>
            <h2 className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] text-white leading-tight mb-6">
              Built on frustration.<br />
              <span className="text-gradient-cyan">Driven by curiosity.</span>
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                I&apos;m a high school sophomore at Stuttgart High School who builds things
                because I get frustrated at what doesn&apos;t exist or doesn&apos;t work.
                That frustration has produced a browser-based OS, a Linux kernel driver,
                and a real-time club management platform used by two robotics teams.
              </p>
              <p>
                I write JavaScript when I want things to work fast, C when I need to talk
                directly to hardware, and Python when I need to interpret Python inside a
                browser OS I also wrote. I don&apos;t have a threshold for &quot;that&apos;s too hard.&quot;
              </p>
              <p>
                When I&apos;m not building, I&apos;m on my FTC robotics team &mdash; which is mostly
                just another excuse to build software.
              </p>
            </div>
          </div>

          {/* Right: Timeline */}
          <div ref={timelineRef} className="relative pl-6 border-l border-cyan-400/20">
            {TIMELINE.map((t, i) => (
              <div key={i} className="timeline-item relative mb-8 last:mb-0">
                <div className="absolute -left-[1.45rem] top-1.5 w-3 h-3 rounded-full border-2 border-cyan-400 bg-navy-900" />
                <div className="terminal text-xs text-cyan-400 mb-1 tracking-widest">{t.year}</div>
                <div className="font-semibold text-white mb-1">{t.title}</div>
                <div className="text-sm text-slate-400">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-24" id="stack" ref={stackRef}>
          <div className="section-label mb-8">Stack</div>

          {/* Desktop: casino deal + cascade flip */}
          <div
            className="hidden lg:block relative"
            style={{ height: "420px", perspective: "1200px" }}
            onMouseLeave={handleContainerLeave}
          >
            {STACK.map((s, i) => (
              <div
                key={s.name}
                ref={el => { cardRefs.current[i] = el; }}
                className="absolute rounded-xl cursor-pointer"
                style={{
                  width: 150, height: 200,
                  left: "50%", marginLeft: -75,
                  top: 60,
                  zIndex: i + 1,
                  transformStyle: "preserve-3d",
                }}
                onMouseEnter={() => handleCardHover(i)}
              >
                {/* Back face — visible before flip */}
                <div
                  className="absolute inset-0 rounded-xl stack-card"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div
                    className="absolute inset-2 rounded-lg"
                    style={{
                      border: "1px solid rgba(255,255,255,0.18)",
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.07) 8px, rgba(255,255,255,0.07) 9px)",
                    }}
                  />
                </div>

                {/* Front face — revealed by flip */}
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden stack-card"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 80% 15%, ${s.color}22 0%, transparent 65%)` }}
                  />
                  <div className="relative flex flex-col items-center justify-between h-full p-4">
                    <div className="flex-1 flex items-center justify-center">
                      <s.Icon style={{ color: s.color }} className="text-5xl" />
                    </div>
                    <div className="w-full">
                      <div className="font-display font-bold text-sm text-white text-center mb-2">
                        {s.name}
                      </div>
                      <div className="w-full h-0.5 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${s.proficiency}%`, background: s.color }} />
                      </div>
                      <Link
                        href={`/stack/${s.slug}`}
                        className="block text-center text-xs transition-opacity hover:opacity-100"
                        style={{ color: s.color, opacity: 0.55 }}
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: grid of tech chips */}
          <div className="lg:hidden grid grid-cols-3 sm:grid-cols-4 gap-3">
            {STACK.map((s) => (
              <Link
                key={s.name}
                href={`/stack/${s.slug}`}
                className="glass flex flex-col items-center gap-2 p-4 rounded-xl hover:border-white/20 transition-all"
              >
                <s.Icon style={{ color: s.color }} className="text-2xl" />
                <span className="text-xs text-slate-400 text-center leading-tight">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
