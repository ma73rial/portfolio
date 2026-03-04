"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/#projects", label: "Projects" },
  { href: "/kernel",    label: "Kernel"   },
  { href: "/#about",    label: "About"    },
  { href: "/#stack",    label: "Stack"    },
  { href: "/blog",      label: "Blog"     },
  { href: "/#contact",  label: "Contact"  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Nav() {
  const pathname  = usePathname();
  const navRef    = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0,   opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHashClick = (e: React.MouseEvent, href: string) => {
    if (pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      scrollToId(href.slice(2));
      setMenuOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark py-3 shadow-[0_1px_0_rgba(0,212,255,0.1)]" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Home">
          <span className="w-8 h-8 rounded flex items-center justify-center border border-cyan-400/30 group-hover:border-cyan-400 transition-colors duration-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h3l2-5 2 10 2-5h3" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="font-display font-bold text-white text-sm tracking-wide">
            max<span className="text-cyan-400">.</span>dev
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (pathname === "/" && href.startsWith("/#"));
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={(e) => handleHashClick(e, href)}
                  className={`terminal text-xs tracking-widest uppercase transition-colors duration-200 hover:text-cyan-400 ${
                    active ? "text-cyan-400" : "text-slate-400"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          <a
            href="https://github.com/ma7erial"
            target="_blank"
            rel="noopener noreferrer"
            className="terminal text-xs text-slate-400 hover:text-cyan-400 transition-colors tracking-widest uppercase"
          >
            GitHub
          </a>
          <button
            onClick={() => scrollToId("contact")}
            className="px-4 py-2 text-xs font-semibold tracking-widest uppercase border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 rounded-sm"
          >
            Contact
          </button>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-slate-400 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-px bg-slate-400 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-px bg-slate-400 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-dark mt-2 mx-4 rounded-lg p-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => { handleHashClick(e, href); setMenuOpen(false); }}
              className="terminal text-xs tracking-widest uppercase text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/ma7erial"
            target="_blank"
            rel="noopener noreferrer"
            className="terminal text-xs tracking-widest uppercase text-slate-400 hover:text-cyan-400 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </div>
    </nav>
  );
}
