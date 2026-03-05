"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [fading, setFading]     = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [status, setStatus]     = useState("Loading\u2026");

  // Dismiss as fast as possible once React hydrates
  useEffect(() => {
    setFading(true);
    const t = setTimeout(() => setDismissed(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Connectivity + SW message status
  useEffect(() => {
    if (!navigator.onLine) setStatus("Offline \u2014 loading from cache\u2026");
    if (!("serviceWorker" in navigator)) return;
    const handler = (e: MessageEvent) => {
      const { type, reason } = e.data ?? {};
      if (type !== "CACHE_SERVED") return;
      setStatus(
        reason === "offline"
          ? "Offline \u2014 loading from cache\u2026"
          : "Slow connection \u2014 loading from cache\u2026"
      );
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, []);

  if (dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99995,
        background: "#020b18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.25s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/*
        Inner content uses CSS animation-delay: 0.5s.
        The parent's opacity goes to 0 before 500ms on fast connections,
        so the inner content never becomes visible to the user.
        On slow connections (hydration > 500ms), the inner content
        appears after 0.5s and shows until React finally hydrates.
      */}
      <div className="loader-inner">
        <svg width="28" height="28" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 8h3l2-5 2 10 2-5h3" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" />
        </div>
        <span className="loader-status">{status}</span>
      </div>
    </div>
  );
}
