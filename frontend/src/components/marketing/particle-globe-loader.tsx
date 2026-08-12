"use client";

import dynamic from "next/dynamic";

/** Client-only wrapper so the WebGL globe can be dynamically imported with
 *  ssr:false from server-component pages (next/dynamic ssr:false is only
 *  allowed inside a Client Component). */
export const ParticleGlobe = dynamic(() => import("./particle-globe"), {
  ssr: false,
  loading: () => (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
      <div className="hero-atmosphere absolute h-[44rem] w-[44rem] rounded-full opacity-50" />
    </div>
  ),
});
