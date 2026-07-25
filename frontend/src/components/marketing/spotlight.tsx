"use client";

import { useEffect, useRef } from "react";

/** Mouse-reactive glow that trails the cursor within its parent section.
 *  Pure CSS custom-property update on pointer move - no re-renders, no
 *  layout thrash. No-ops silently on touch-only devices. */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const handleMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      el.style.setProperty("--x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      el.style.opacity = "1";
    };
    const handleLeave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("pointermove", handleMove);
    parent.addEventListener("pointerleave", handleLeave);
    return () => {
      parent.removeEventListener("pointermove", handleMove);
      parent.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(52,211,153,0.08), transparent 60%)",
      }}
    />
  );
}
