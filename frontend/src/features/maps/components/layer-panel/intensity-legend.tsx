interface Props {
  timeFactor: number;
}

/** Compact floating legend chip on the map canvas. */
export function IntensityLegend({ timeFactor }: Props) {
  return (
    <div className="absolute bottom-4 right-4 bg-ground-950/95 border border-ground-700/80 rounded-xl p-3.5 z-10 w-48 shadow-2xl space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] font-bold text-ground-400 uppercase">Intensity Legend</span>
        <span className="text-[9px] text-sensor font-bold font-mono">
          {Math.round(380 * timeFactor)} - {Math.round(480 * timeFactor)} PPM
        </span>
      </div>
      <div className="h-2 rounded-full plume-gradient" />
      <div className="flex justify-between text-[9px] text-ground-400 font-mono">
        <span>Low</span>
        <span>Moderate</span>
        <span>Critical</span>
      </div>
    </div>
  );
}
