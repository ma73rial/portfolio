"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hidden easter egg. Typing the secret word "juniper" (no modifiers, not in
 * an input/textarea/contenteditable) replaces the entire page in-place with
 * a single link to st.junipervirtual.org, then navigates there in the same
 * tab via location.replace — overwriting the current history entry, so the
 * portfolio vanishes from the back button too.
 */
const SECRET = "juniper";
const TARGET = "https://st.junipervirtual.org";

export default function EasterEgg() {
  const buffer = useRef("");
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      return (
        el.isContentEditable ||
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT"
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (triggered) return;
      // Ignore modified keys and typing inside form fields.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      if (e.key.length === 1) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(-SECRET.length);
        if (buffer.current === SECRET) {
          setTriggered(true);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    // Swap the entire document out from under itself, then replace navigation.
    const id = window.setTimeout(() => {
      window.location.replace(TARGET);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [triggered]);

  if (!triggered) return null;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "#0a0e1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <a
        href={TARGET}
        style={{
          color: "#e2e8f0",
          fontFamily: "monospace",
          fontSize: "1.25rem",
          textDecoration: "underline",
          textUnderlineOffset: "6px",
        }}
      >
        st.junipervirtual.org
      </a>
    </div>
  );
}
