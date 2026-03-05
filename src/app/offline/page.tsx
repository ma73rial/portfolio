"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OfflinePage() {
  const [fromPath, setFromPath] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("from") ?? "";
    setFromPath(p);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="w-10 h-10 rounded flex items-center justify-center border border-cyan-400/30">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h3l2-5 2 10 2-5h3" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="font-display font-bold text-white tracking-wide">
          max<span className="text-cyan-400">.</span>dev
        </span>
      </div>

      {/* Icon */}
      <div className="relative flex items-center justify-center w-16 h-16">
        <span className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping opacity-40" />
        <span className="relative w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l22 22"/>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1"/>
          </svg>
        </span>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <p className="section-label text-amber-400">No connection</p>
        <h1 className="font-display font-bold text-2xl text-white">
          {fromPath ? "Page not available offline" : "You're offline"}
        </h1>
      </div>

      {/* Body */}
      <div className="max-w-sm space-y-3 text-slate-400 font-sans text-sm leading-relaxed">
        {fromPath ? (
          <>
            <p>
              The page{" "}
              <code className="text-cyan-400 bg-navy-800 px-1.5 py-0.5 rounded text-xs">
                {fromPath}
              </code>{" "}
              hasn&apos;t been cached on this device yet.
            </p>
            <p>
              Visit{" "}
              <span className="text-slate-300">{fromPath}</span> once while
              online to enable offline access.
            </p>
          </>
        ) : (
          <p>
            Your connection is unavailable. Cached pages are still accessible —
            connect to the internet to load the rest.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 rounded-sm terminal"
        >
          ← Back to home
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 text-xs tracking-widest uppercase text-slate-500 hover:text-slate-300 transition-colors terminal"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
