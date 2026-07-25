"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Hero backdrop: layered aurora blobs + concentric orbital arcs with a
 *  satellite tracer and a slow ground-glow. Pure SVG/CSS - no WebGL - so it
 *  costs almost nothing. Aurora blobs use sensor/halo tones only; the plume
 *  glow at the horizon is the one deliberate exception, echoing the
 *  product's core "emission plume" visual rather than generic chrome. */
export function OrbitField() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* aurora depth layer - cool, chrome-safe accents */}
      <div
        className="aurora-blob aurora-blob-a left-[8%] top-[8%] h-[26rem] w-[26rem] opacity-[0.16]"
        style={{ background: "radial-gradient(closest-side, var(--color-sensor), transparent 70%)" }}
      />
      <div
        className="aurora-blob aurora-blob-b right-[6%] top-[18%] h-[30rem] w-[30rem] opacity-[0.14]"
        style={{ background: "radial-gradient(closest-side, var(--color-halo), transparent 70%)" }}
      />
      <div
        className="aurora-blob aurora-blob-c left-1/2 top-[2%] h-[22rem] w-[22rem] -translate-x-1/2 opacity-[0.1]"
        style={{ background: "radial-gradient(closest-side, var(--color-instrument), transparent 72%)" }}
      />
      <div className="bg-noise" />

      {/* atmospheric glow at the horizon - the plume signature */}
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
            stroke="var(--color-ground-700)"
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
            <circle cx="600" cy="430" r="3" fill="var(--color-instrument)" />
            <circle cx="600" cy="430" r="9" fill="none" stroke="var(--color-instrument)" strokeOpacity="0.25" />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
