"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Hero backdrop: concentric orbital arcs with a satellite tracer and a slow
 *  ground-glow. Pure SVG - no WebGL - so it costs almost nothing. */
export function OrbitField() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* atmospheric glow at the horizon */}
      <div
        className="absolute left-1/2 top-[62%] h-[70rem] w-[70rem] -translate-x-1/2 rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(closest-side, rgba(245,166,35,0.35), rgba(230,73,128,0.12) 45%, transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 1200 700"
        className="absolute left-1/2 top-0 h-full w-[1400px] -translate-x-1/2"
        fill="none"
      >
        {[240, 330, 420].map((r, i) => (
          <circle
            key={r}
            cx="600"
            cy="760"
            r={r}
            stroke="#1c2942"
            strokeWidth="1"
            strokeDasharray={i === 1 ? "2 6" : undefined}
          />
        ))}
        {!reduce && (
          <motion.g
            style={{ originX: "600px", originY: "760px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          >
            {/* satellite tracer on the middle orbit */}
            <circle cx="600" cy="430" r="3" fill="#e6edf7" />
            <circle cx="600" cy="430" r="9" fill="none" stroke="#e6edf7" strokeOpacity="0.25" />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
