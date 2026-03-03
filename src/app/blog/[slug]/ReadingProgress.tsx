"use client";
export default function ReadingProgress() {
  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 z-50"
      style={{
        background: "linear-gradient(90deg, #00d4ff, #00ffb3)",
        transformOrigin: "left",
        transform: "scaleX(0)",
        animation: "scroll-progress linear both",
        // @ts-ignore
        animationTimeline: "scroll(root)",
      }}
      aria-hidden
    />
  );
}
