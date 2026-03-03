import Link from "next/link";

const LINKS = [
  { section: "Work",    items: [
    { label: "Projects", href: "/#projects" },
    { label: "Blog",     href: "/blog"      },
    { label: "Stack",    href: "/#stack"    },
  ]},
  { section: "Connect", items: [
    { label: "GitHub",   href: "https://github.com/ma7erial"       },
    { label: "LinkedIn", href: "https://linkedin.com/in/maximilian-pezzullo" },
    { label: "Email",    href: "mailto:mpez6366@student.dodea.edu" },
  ]},
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-cyan-400/10 pt-16 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-display font-black text-xl text-white mb-3">
              max<span className="text-cyan-400">.</span>dev
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              High school sophomore. I build things that don&apos;t exist — or fix the ones that don&apos;t work.
            </p>
            <div className="mt-5 terminal text-xs text-slate-600 space-y-1">
              <div>$ projects <span className="text-emerald-400">5 shipped</span></div>
              <div>$ kernel <span className="text-cyan-400">1 upstream pr</span></div>
              <div>$ status <span className="text-emerald-400">building<span className="cursor-blink">_</span></span></div>
            </div>
          </div>

          {/* Links */}
          {LINKS.map(group => (
            <div key={group.section}>
              <div className="section-label mb-5">{group.section}</div>
              <ul className="space-y-3">
                {group.items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-navy-600/40">
          <span className="terminal text-xs text-slate-600">
            © {year} Maximilian Pezzullo. Built with Next.js, GSAP, and stubborn curiosity.
          </span>
          <div className="flex items-center gap-1 terminal text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
