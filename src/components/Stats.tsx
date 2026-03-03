"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";

const STATS = [
  { value: 5,   suffix: "",    label: "Projects shipped",            sub: "open source & in production" },
  { value: 1,   suffix: "",    label: "Linux kernel contribution",   sub: "dlink-dwa131 h1 driver"      },
  { value: 2,   suffix: "",    label: "FTC teams on my dashboard",   sub: "teams #10937 & #30548"       },
  { value: 30,  suffix: "+",   label: "Built-in apps (Vira OS)",     sub: "full OS in the browser"      },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const obj = useRef({ val: 0 });

  useEffect(() => {
    if (!inView) return;
    gsap.to(obj.current, {
      val: value,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => setDisplay(parseFloat(obj.current.val.toFixed(value < 10 ? 1 : 0))),
    });
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      <span className="text-cyan-400">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-24 px-6 border-y border-cyan-400/10"
    >
      {/* Horizontal scan line decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="group relative flex flex-col items-center text-center p-6 rounded-lg border border-navy-600/40 hover:border-cyan-400/30 transition-all duration-400 hover:bg-navy-800/40"
          >
            <div className="font-display font-black text-[clamp(2.5rem,5vw,3.5rem)] leading-none text-white mb-2">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm text-slate-300 font-semibold mb-1">{s.label}</div>
            <div className="terminal text-xs text-slate-500">{s.sub}</div>

            {/* Corner accent */}
            <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-cyan-400/40 group-hover:bg-cyan-400 transition-colors" />
          </div>
        ))}
      </div>
    </section>
  );
}
