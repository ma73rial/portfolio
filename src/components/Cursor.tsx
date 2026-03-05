"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorMode = "default" | "pointer" | "text" | "drag";

const getMode = (target: EventTarget | null): CursorMode => {
  const el = target as Element | null;
  if (!el) return "default";
  if (el.closest("[data-cursor='drag']"))               return "drag";
  if (el.closest("a, button, [data-cursor='pointer']")) return "pointer";
  if (el.closest("p, h1, h2, h3, h4, h5, h6, li, blockquote, td")) return "text";
  return "default";
};

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    const setMode = (mode: CursorMode) => {
      dot.dataset.mode  = mode;
      ring.dataset.mode = mode;
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: "power2.out" });
      setMode(getMode(e.target));
    };

    const lerp = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(lerp);
    };
    const raf = requestAnimationFrame(lerp);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s" }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s" }}
      />
    </>
  );
}
