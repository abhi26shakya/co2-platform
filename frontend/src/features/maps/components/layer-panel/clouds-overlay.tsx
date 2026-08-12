/**
 * "Simulated Clouds" toggle from LayerToggleOverlay — a decorative drift animation rendered once
 * above the map canvas. Not real cloud imagery — the layer is explicitly named "simulated" in
 * the spec.
 */
export function CloudsOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-xl">
      <div className="clouds-drift-a absolute -inset-x-1/2 top-[8%] h-24 w-[200%] rounded-full bg-white/10 blur-2xl" />
      <div className="clouds-drift-b absolute -inset-x-1/2 top-[38%] h-32 w-[200%] rounded-full bg-white/[0.07] blur-3xl" />
      <div className="clouds-drift-a absolute -inset-x-1/2 top-[68%] h-20 w-[200%] rounded-full bg-white/[0.08] blur-2xl" />
      <style jsx>{`
        @keyframes clouds-drift-a {
          from { transform: translateX(-15%); }
          to { transform: translateX(15%); }
        }
        @keyframes clouds-drift-b {
          from { transform: translateX(10%); }
          to { transform: translateX(-20%); }
        }
        .clouds-drift-a { animation: clouds-drift-a 90s ease-in-out infinite alternate; }
        .clouds-drift-b { animation: clouds-drift-b 130s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
}
