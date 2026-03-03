import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiNodedotjs,
  SiPython, SiC, SiLinux, SiSocketdotio, SiSqlite, SiOllama, SiTailwindcss,
} from "react-icons/si";
import type { IconType } from "react-icons";

export type StackItem = {
  name: string;
  slug: string;
  color: string;
  Icon: IconType;
  proficiency: number; // 0–100
  since: string;
  tagline: string;
  description: string;
  usedFor: string[];
  projects: Array<{ id: string; name: string }>;
  code: string;
};

export const STACK: StackItem[] = [
  {
    name: "JavaScript",
    slug: "javascript",
    color: "#f7df1e",
    Icon: SiJavascript,
    proficiency: 93,
    since: "2022",
    tagline: "My foundation. Runs everywhere, builds everything.",
    description: "JavaScript was my first serious language. I used it to build Vira OS entirely in vanilla JS — no frameworks, no bundlers, just raw DOM manipulation, a custom event loop, and a Python interpreter written from scratch in JS. It's still my go-to when I need maximum control or need something to run at a file:// URL.",
    usedFor: [
      "Browser apps without frameworks",
      "Complex DOM manipulation and custom animations",
      "Node.js backends and CLI tooling",
      "Anywhere performance and control matter more than convention",
    ],
    projects: [{ id: "vira-os", name: "Vira OS" }],
    code: `const fibonacci = n =>
  n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);

const seq = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log(seq);
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

export default fibonacci;`,
  },
  {
    name: "TypeScript",
    slug: "typescript",
    color: "#3178c6",
    Icon: SiTypescript,
    proficiency: 87,
    since: "2023",
    tagline: "JavaScript with a conscience.",
    description: "I moved to TypeScript for any project that needs to survive contact with other code — or with myself six months later. It catches the dumb bugs at compile time instead of at 2am in production. I use it for FTC Dashboard, this portfolio, and any API other code will call.",
    usedFor: [
      "Production React and Next.js apps",
      "Typed REST APIs and WebSocket protocols",
      "Shared data types across frontend and backend",
      "Anything I expect to refactor later",
    ],
    projects: [{ id: "ftc-dashboard", name: "FTC Dashboard" }],
    code: `interface Project {
  id: string;
  name: string;
  deployed: boolean;
  tags: string[];
}

function filterDeployed(projects: Project[]): Project[] {
  return projects.filter(p => p.deployed);
}`,
  },
  {
    name: "React",
    slug: "react",
    color: "#61dafb",
    Icon: SiReact,
    proficiency: 88,
    since: "2023",
    tagline: "Component thinking, applied.",
    description: "React is my default UI library for complex stateful UIs. FTC Dashboard uses React for the Kanban board, attendance tracker, budget charts, and real-time WebSocket chat — all with custom hooks and context. I lean heavily on hooks and avoid third-party state managers unless the project demands it.",
    usedFor: [
      "Complex stateful UIs with lots of moving parts",
      "Component libraries and design systems",
      "SPAs with client-side routing",
      "Anywhere I'd otherwise write spaghetti",
    ],
    projects: [{ id: "ftc-dashboard", name: "FTC Dashboard" }],
    code: `function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} {count === 1 ? "time" : "times"}
    </button>
  );
}`,
  },
  {
    name: "Next.js",
    slug: "nextjs",
    color: "#ffffff",
    Icon: SiNextdotjs,
    proficiency: 82,
    since: "2024",
    tagline: "Full-stack without the ceremony.",
    description: "Next.js handles routing, SSR, API routes, and static generation in one framework. This portfolio runs on Next.js 15 with Turbopack — the blog uses file-based MDX, the admin panel uses API routes, and project pages use generateStaticParams for zero-JS static HTML.",
    usedFor: [
      "Portfolio and blog sites with SEO requirements",
      "Full-stack apps where I want one codebase",
      "Static generation of content-heavy pages",
      "API routes for simple backends",
    ],
    projects: [],
    code: `export default async function Page({
  params,
}: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}

export async function generateStaticParams() {
  return getPosts().map(p => ({ slug: p.id }));
}`,
  },
  {
    name: "Node.js",
    slug: "nodejs",
    color: "#68a063",
    Icon: SiNodedotjs,
    proficiency: 83,
    since: "2023",
    tagline: "JavaScript on the server, no apologies.",
    description: "Node.js runs the FTC Dashboard backend — a WebSocket server for real-time chat with mentions and read receipts, a REST API for attendance and budget data, and a local LLM bridge to Ollama. It's not the fastest runtime, but it's the fastest way from idea to working server.",
    usedFor: [
      "WebSocket servers for real-time features",
      "REST APIs for full-stack TypeScript apps",
      "CLI tools and automation scripts",
      "Local AI inference bridges",
    ],
    projects: [{ id: "ftc-dashboard", name: "FTC Dashboard" }],
    code: `import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ path: req.url, ok: true }));
});

server.listen(3000, () => console.log("listening"));`,
  },
  {
    name: "Python",
    slug: "python",
    color: "#3776ab",
    Icon: SiPython,
    proficiency: 90,
    since: "2022",
    tagline: "The language that handles everything I don't want to do in C.",
    description: "Python is my primary AI/ML language. GelbIT uses it for the Gemma fine-tuning pipeline, Selenium scraping of municipal rules, and the Ollama inference layer. I also wrote a Python interpreter in vanilla JavaScript for Vira OS — which means I've implemented Python from scratch, in its less-loved cousin.",
    usedFor: [
      "AI/ML pipelines and model fine-tuning",
      "Web scraping with Selenium and BeautifulSoup",
      "Automation scripts that would be painful in JS",
      "Rapid prototyping of algorithms",
    ],
    projects: [
      { id: "vira-os", name: "Vira OS" },
      { id: "project-gelb", name: "GelbIT" },
    ],
    code: `def binary_search(arr: list, target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
  },
  {
    name: "C",
    slug: "c",
    color: "#f97316",
    Icon: SiC,
    proficiency: 70,
    since: "2024",
    tagline: "When I need to talk directly to hardware.",
    description: "I wrote the DWA-131 H1 Linux kernel driver in C. Kernel code means no libc, manual memory management, strict pointer discipline, and zero tolerance for undefined behavior — the kernel panics, it doesn't segfault. Writing a kernel module taught me what C actually is under all the abstractions.",
    usedFor: [
      "Linux kernel modules and drivers",
      "Low-level hardware interfacing",
      "Embedded systems",
      "Anything where malloc() is a luxury",
    ],
    projects: [{ id: "linux-driver", name: "DWA-131 H1 Driver" }],
    code: `#include <stdio.h>
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
}`,
  },
  {
    name: "Linux Kernel",
    slug: "linux-kernel",
    color: "#ffcc00",
    Icon: SiLinux,
    proficiency: 62,
    since: "2024",
    tagline: "The one codebase that does not forgive mistakes.",
    description: "Contributing to the Linux kernel means reading USB specs, reverse-engineering closed hardware, and navigating a codebase built across 30 years. I submitted the DWA-131 H1 USB WiFi driver upstream. The kernel is unforgiving — but getting a commit merged is one of the most satisfying things I've done.",
    usedFor: [
      "USB and network driver development",
      "Kernel module development",
      "Hardware without existing Linux support",
    ],
    projects: [{ id: "linux-driver", name: "DWA-131 H1 Driver" }],
    code: `#include <linux/module.h>
#include <linux/usb.h>

static int driver_probe(struct usb_interface *intf,
                        const struct usb_device_id *id) {
    dev_info(&intf->dev, "DWA-131 attached\\n");
    return 0;
}

module_usb_driver(dwa131_driver);
MODULE_LICENSE("GPL");`,
  },
  {
    name: "WebSockets",
    slug: "websockets",
    color: "#00d4ff",
    Icon: SiSocketdotio,
    proficiency: 84,
    since: "2023",
    tagline: "The right tool for anything that needs to be live.",
    description: "FTC Dashboard's chat uses a custom WebSocket server with mention parsing (@username), read receipts, message history, and online presence. I built both client and server from scratch using the ws library — I wanted to understand the protocol, not abstract it away with Socket.io.",
    usedFor: [
      "Real-time chat and messaging",
      "Live dashboards with server-pushed updates",
      "Collaborative tools",
      "Features where polling would be embarrassing",
    ],
    projects: [{ id: "ftc-dashboard", name: "FTC Dashboard" }],
    code: `const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN)
        client.send(data);
    });
  });
});`,
  },
  {
    name: "SQLite",
    slug: "sqlite",
    color: "#4479a1",
    Icon: SiSqlite,
    proficiency: 78,
    since: "2023",
    tagline: "A database in a file. Underrated more often than not.",
    description: "SQLite runs FTC Dashboard's persistent storage — attendance records, budget entries, and message history. It's serverless, needs zero setup, and is fast enough for any app with hundreds of concurrent users. I'm comfortable writing raw SQL and optimizing queries.",
    usedFor: [
      "Embedded databases in desktop-like apps",
      "Local storage for CLI tools",
      "Simple CRUD apps that don't need a server",
      "Prototyping before migrating to Postgres",
    ],
    projects: [{ id: "ftc-dashboard", name: "FTC Dashboard" }],
    code: `SELECT p.id, p.title, COUNT(t.id) AS tags
FROM posts p
LEFT JOIN post_tags t ON p.id = t.post_id
WHERE p.published = 1
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 10;`,
  },
  {
    name: "Local LLM",
    slug: "local-llm",
    color: "#a78bfa",
    Icon: SiOllama,
    proficiency: 80,
    since: "2025",
    tagline: "AI that doesn't phone home.",
    description: "GelbIT and FTC Dashboard both use local LLMs via Ollama. For GelbIT, I fine-tuned Gemma 3 on German recycling rules, reaching 94% classification accuracy. Running models locally means no API costs, no rate limits, no data leaving the machine, and sub-second response times on consumer hardware.",
    usedFor: [
      "Privacy-sensitive AI features",
      "Offline-capable AI applications",
      "Cost-sensitive deployments",
      "Fine-tuned models for specific tasks",
    ],
    projects: [
      { id: "ftc-dashboard", name: "FTC Dashboard" },
      { id: "project-gelb", name: "GelbIT" },
    ],
    code: `import ollama

response = ollama.generate(
    model="gemma3",
    prompt="Classify this waste item: empty yogurt cup",
    options={"temperature": 0.1},
)

print(response["response"])
# → yellow bin (Gelber Sack)`,
  },
  {
    name: "Tailwind CSS",
    slug: "tailwind",
    color: "#38bdf8",
    Icon: SiTailwindcss,
    proficiency: 91,
    since: "2023",
    tagline: "Utility-first CSS that actually works at scale.",
    description: "Tailwind is my default CSS approach. I use Tailwind v4 for this portfolio with a custom design token system — navy palette, custom fonts, custom utilities. Utility classes plus CSS custom properties means I never leave the component to style it, and light/dark mode is consistently handled.",
    usedFor: [
      "Any web UI that needs to look good fast",
      "Design systems with custom tokens",
      "Responsive layouts",
      "Consistent dark/light mode implementations",
    ],
    projects: [{ id: "ftc-dashboard", name: "FTC Dashboard" }],
    code: `<div className="flex min-h-screen flex-col bg-navy-950">
  <nav className="sticky top-0 z-50 glass
                  border-b border-white/5 px-6 py-4">
    <span className="font-display font-black
                     text-gradient-cyan">
      Portfolio
    </span>
  </nav>
</div>`,
  },
];
