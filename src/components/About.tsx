"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiNodedotjs,
  SiPython, SiC, SiLinux, SiSocketdotio, SiSqlite, SiOllama, SiTailwindcss,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const STACK = [
  { name: "JavaScript",   color: "#f7df1e", Icon: SiJavascript,  code: `const fibonacci = n =>
  n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);

const seq = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log(seq);
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

export default fibonacci;` },
  { name: "TypeScript",   color: "#3178c6", Icon: SiTypescript,  code: `interface Project {
  id: string;
  name: string;
  deployed: boolean;
  tags: string[];
}

function filterDeployed(projects: Project[]): Project[] {
  return projects.filter(p => p.deployed);
}` },
  { name: "React",        color: "#61dafb", Icon: SiReact,       code: `function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} {count === 1 ? "time" : "times"}
    </button>
  );
}` },
  { name: "Next.js",      color: "#ffffff", Icon: SiNextdotjs,   code: `export default async function Page({
  params,
}: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}

export async function generateStaticParams() {
  return getPosts().map(p => ({ slug: p.id }));
}` },
  { name: "Node.js",      color: "#68a063", Icon: SiNodedotjs,   code: `import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ path: req.url, ok: true }));
});

server.listen(3000, () => console.log("listening"));` },
  { name: "Python",       color: "#3776ab", Icon: SiPython,      code: `def binary_search(arr: list, target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1` },
  { name: "C",            color: "#f97316", Icon: SiC,           code: `#include <stdio.h>
#include <stdlib.h>

int *range(int n) {
    int *arr = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) arr[i] = i;
    return arr;
}

int main(void) {
    int *r = range(10);
    free(r);
    return 0;
}` },
  { name: "Linux Kernel", color: "#ffcc00", Icon: SiLinux,       code: `#include <linux/module.h>
#include <linux/usb.h>

static int driver_probe(struct usb_interface *intf,
                        const struct usb_device_id *id) {
    dev_info(&intf->dev, "DWA-131 attached\\n");
    return 0;
}

module_usb_driver(dwa131_driver);
MODULE_LICENSE("GPL");` },
  { name: "WebSockets",   color: "#00d4ff", Icon: SiSocketdotio, code: `const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN)
        client.send(data);
    });
  });
});` },
  { name: "SQLite",       color: "#4479a1", Icon: SiSqlite,      code: `SELECT p.id, p.title, COUNT(t.id) AS tags
FROM posts p
LEFT JOIN post_tags t ON p.id = t.post_id
WHERE p.published = 1
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 10;` },
  { name: "Local LLM",    color: "#a78bfa", Icon: SiOllama,      code: `import ollama

response = ollama.generate(
    model="gemma3",
    prompt="Classify this waste item: empty yogurt cup",
    options={"temperature": 0.1},
)

print(response["response"])
# → yellow bin (Gelber Sack)` },
  { name: "Tailwind CSS", color: "#38bdf8", Icon: SiTailwindcss, code: `<div className="flex min-h-screen flex-col bg-navy-950">
  <nav className="sticky top-0 z-50 glass
                  border-b border-white/5 px-6 py-4">
    <span className="font-display font-black
                     text-gradient-cyan">
      Portfolio
    </span>
  </nav>
</div>` },
];

const TIMELINE = [
  { year: "2022", title: "First real program",          desc: "Started writing Python scripts to automate things in middle school. Never looked back." },
  { year: "2023", title: "FTC Robotics",                desc: "Joined FIRST Tech Challenge teams #10937 and #30548 at Stuttgart High School. Immediately started building the team dashboard because 10 Google Tabs was not acceptable." },
  { year: "2024", title: "Vira OS",                     desc: "Built a full Mac-inspired OS running in the browser — filesystem, UAC, terminal, IDE, browser, 30+ apps, and a custom Python interpreter. From scratch. As a freshman." },
  { year: "2025", title: "Linux Kernel Driver",         desc: "Reverse-engineered the D-Link DWA-131 rev H1 USB WiFi chip, wrote a plug-and-play Linux kernel driver in C, and submitted it upstream." },
  { year: "2025", title: "GelbIT",                      desc: "Built an AI recycling assistant for USAG Stuttgart military families — computer vision, agentic scraping, and real-time local rules. Deployed to beta users." },
];

export default function About() {
  const sectionRef      = useRef<HTMLElement>(null);
  const timelineRef     = useRef<HTMLDivElement>(null);
  const stackRef        = useRef<HTMLDivElement>(null);
  const stackInner      = useRef<HTMLDivElement>(null);
  const cardRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const codeBackdropRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline animate-in
      const timelineItems = timelineRef.current?.querySelectorAll(".timeline-item");
      if (timelineItems) {
        gsap.fromTo(timelineItems,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.15,
            scrollTrigger: { trigger: timelineRef.current, start: "top 75%", toggleActions: "play none none reverse" } }
        );
      }

      // Stacking cards — GSAP pin + sequential slide-up
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length && stackInner.current) {
        gsap.set(cards.slice(1), { yPercent: 110 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top 30%",
            end: `+=${(cards.length - 1) * 250}`,
            pin: stackInner.current,
            scrub: 0.8,
            onUpdate(self) {
              // Update full-section code backdrop to match the current card
              const idx = Math.min(STACK.length - 1, Math.round(self.progress * (STACK.length - 1)));
              if (codeBackdropRef.current) {
                codeBackdropRef.current.textContent = STACK[idx].code;
                codeBackdropRef.current.style.color  = STACK[idx].color;
              }
            },
          },
        });
        cards.slice(1).forEach((card, i) => {
          tl.to(card, { yPercent: 0, ease: "power2.out", duration: 1 }, i * 0.9);
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-32 px-6 overflow-hidden">
      {/* Full-section code backdrop — updated live as stack scrolls */}
      <pre
        ref={codeBackdropRef}
        className="absolute inset-0 p-10 font-mono text-xs leading-relaxed pointer-events-none select-none overflow-hidden"
        style={{ color: STACK[0].color, opacity: 0.08, whiteSpace: "pre", zIndex: 0 }}
        aria-hidden
      >{STACK[0].code}</pre>

      <div className="relative max-w-6xl mx-auto" style={{ zIndex: 1 }}>
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
                browser OS I also wrote. I don&apos;t have a threshold for "that&apos;s too hard."
              </p>
              <p>
                When I&apos;m not building, I&apos;m on my FTC robotics team — which is mostly
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

        {/* Tech stack — GSAP stacking cards with code backdrop */}
        <div className="mt-24" id="stack" ref={stackRef}>
          <div className="section-label mb-6">Stack</div>
          <div ref={stackInner} className="relative rounded-2xl overflow-hidden" style={{ height: "240px" }}>
            {STACK.map((s, i) => (
              <div
                key={s.name}
                ref={el => { cardRefs.current[i] = el; }}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ zIndex: i + 1 }}
              >
                {/* Solid backing so previous card is fully hidden */}
                <div className="stack-card absolute inset-0" style={{ background: "linear-gradient(135deg, #080d1a 0%, #0c1120 100%)" }} />
                {/* Code fills the whole card height */}
                <pre
                  className="stack-code-bg absolute inset-0 p-6 font-mono text-xs leading-relaxed pointer-events-none select-none overflow-hidden"
                  style={{ color: s.color }}
                  aria-hidden
                >{s.code}</pre>
                {/* Subtle accent glow on the right */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 150% at 100% 50%, ${s.color}12 0%, transparent 70%)` }} />
                {/* Label row pinned to bottom */}
                <div className="absolute bottom-0 inset-x-0 flex items-center gap-4 px-6 py-4"
                  style={{ background: `linear-gradient(to top, #080d1a 60%, transparent)` }}>
                  <s.Icon style={{ color: s.color }} className="text-2xl flex-shrink-0" />
                  <span className="font-display font-bold text-lg text-white">{s.name}</span>
                  <div className="ml-auto h-px flex-1 max-w-xs" style={{ background: `linear-gradient(to right, ${s.color}66, transparent)` }} />
                  <span className="terminal text-xs text-slate-500">{i + 1}/{STACK.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
