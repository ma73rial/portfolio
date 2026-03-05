"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

type Toast = "slow" | "recached" | null;

// Probe bypasses the SW (SW ignores ?_probe=1) to check real connectivity
async function probeConnectivity(): Promise<boolean> {
  try {
    await fetch(`/?_probe=1&t=${Date.now()}`, {
      method: "HEAD",
      cache: "no-store",
    });
    return true;
  } catch {
    return false;
  }
}

// Fetch index pages and extract internal hrefs for background caching
async function prefetchLinkedPages(ctrl: ServiceWorker) {
  try {
    // Fetch pages that contain links to sub-pages
    const indexPages = ["/", "/blog", "/kernel"];
    const urls = new Set<string>();
    await Promise.allSettled(
      indexPages.map(async (page) => {
        const res = await fetch(page, { cache: "no-store" });
        if (!res.ok) return;
        const html = await res.text();
        const matches = html.matchAll(/href="(\/[^"?#]+)"/g);
        for (const [, href] of matches) {
          if (href.startsWith("/api") || href.startsWith("/admin")) continue;
          urls.add(href);
        }
      })
    );
    if (urls.size) {
      ctrl.postMessage({ type: "PREFETCH", urls: [...urls] });
    }
  } catch {
    // prefetch is best-effort; ignore errors
  }
}

export default function OfflineManager() {
  const [offline, setOffline]     = useState(false);
  const [toast, setToast]         = useState<Toast>(null);
  const [recaching, setRecaching] = useState(false);
  const toastTimer                = useRef<ReturnType<typeof setTimeout> | null>(null);
  const regRef                    = useRef<ServiceWorkerRegistration | null>(null);
  const pathname                  = usePathname();
  const prevPathname              = useRef(pathname);

  const showToast = useCallback((t: Toast, ms = 4500) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(t);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  }, []);

  // ── Route-change loading bar ─────────────────────────────────────────────
  useEffect(() => {
    const bar = document.getElementById("route-loader");
    if (!bar || pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    // Mark as done (new page has rendered)
    bar.classList.remove("active");
    bar.classList.add("done");
    setTimeout(() => bar.classList.remove("done"), 350);
  }, [pathname]);

  // Intercept link clicks to start the bar before navigation
  useEffect(() => {
    const bar = document.getElementById("route-loader");
    if (!bar) return;
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto")) return;
      bar.classList.remove("done");
      bar.classList.add("active");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // ── Service worker + connectivity ────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Initial connectivity check (probeConnectivity bypasses SW caches)
    probeConnectivity().then((online) => setOffline(!online));

    const handleOnline = () => {
      probeConnectivity().then((online) => {
        setOffline(!online);
        if (online) regRef.current?.update();
      });
    };
    const handleOffline = () => setOffline(true);
    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register SW
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        regRef.current = reg;
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update();
        });

        // Background: prefetch all internal links found on /blog and /kernel
        // so sub-pages work offline even without being visited
        const ctrl = reg.active || reg.installing || reg.waiting;
        if (ctrl) prefetchLinkedPages(ctrl);
      })
      .catch(console.error);

    // SW → page messages
    const onMessage = (event: MessageEvent) => {
      const { type, reason } = event.data ?? {};
      if (type === "CACHE_SERVED") {
        if (reason === "slow")    showToast("slow");
        if (reason === "offline") setOffline(true);
      }
      if (type === "RECACHE_DONE") {
        setRecaching(false);
        showToast("recached", 3000);
      }
    };
    navigator.serviceWorker.addEventListener("message", onMessage);

    // Auto-reload when new SW takes control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });

    return () => {
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker.removeEventListener("message", onMessage);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [showToast]);

  const handleRecache = useCallback(() => {
    const ctrl = navigator.serviceWorker?.controller;
    if (!ctrl || recaching) return;
    setRecaching(true);
    ctrl.postMessage({ type: "RECACHE" });
  }, [recaching]);

  return (
    <>
      {/* ── Offline indicator ────────────────────────────────────────────── */}
      <div
        role="status"
        aria-live="polite"
        className={`
          fixed bottom-5 left-1/2 -translate-x-1/2 z-[9000]
          flex items-center gap-3
          glass-dark border border-amber-400/30 rounded-lg
          px-4 py-2.5 shadow-lg
          transition-all duration-300 ease-in-out
          ${offline ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"}
        `}
      >
        <span className="relative flex-shrink-0 w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-60" />
          <span className="relative block w-2 h-2 rounded-full bg-amber-400" />
        </span>
        <span className="terminal text-xs tracking-widest uppercase text-amber-300 whitespace-nowrap">
          Offline mode
        </span>
        <button
          onClick={handleRecache}
          disabled={recaching}
          aria-label="Re-cache the site for offline use"
          className={`
            terminal text-[11px] tracking-widest uppercase
            border border-cyan-400/40 text-cyan-400
            hover:bg-cyan-400/10 hover:border-cyan-400
            disabled:opacity-40 disabled:border-cyan-400/20
            transition-all duration-200 rounded-sm px-2.5 py-1
            whitespace-nowrap
          `}
        >
          {recaching ? "Caching…" : "Recache site"}
        </button>
      </div>

      {/* ── Transient toasts ─────────────────────────────────────────────── */}
      <div
        aria-live="assertive"
        className={`
          fixed top-20 right-5 z-[9000]
          glass-dark rounded-lg px-4 py-2.5 shadow-lg
          transition-all duration-300 ease-in-out
          ${toast ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-4 pointer-events-none"}
        `}
      >
        {toast === "slow" && (
          <p className="terminal text-xs tracking-widest uppercase text-slate-400 whitespace-nowrap">
            <span className="mr-2 text-amber-400">⚡</span>Slow connection — served from cache
          </p>
        )}
        {toast === "recached" && (
          <p className="terminal text-xs tracking-widest uppercase text-cyan-400 whitespace-nowrap">
            <span className="mr-2">✓</span>Site recached
          </p>
        )}
      </div>
    </>
  );
}
