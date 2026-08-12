import { GASES } from "@/features/maps/lib/gas-catalog";

interface GasConfig {
  enabled: boolean;
  opacity: number;
}

interface Props {
  gases: Record<string, GasConfig>;
  showGasLayer: boolean;
}

/** Compact floating legend chip on the map canvas — one row per currently-enabled gas layer, so
 *  it never claims a scale/unit that isn't actually being rendered. Ranges/colors come from the
 *  same gas-catalog.ts entries GasLayerControls uses, so the two panels can't drift apart. */
export function IntensityLegend({ gases, showGasLayer }: Props) {
  const activeGases = showGasLayer ? GASES.filter((g) => gases[g.id]?.enabled) : [];

  return (
    <div className="glass-strong absolute bottom-16 right-4 rounded-xl p-3.5 z-10 w-52 space-y-2.5">
      <span className="text-[10px] font-bold text-ground-400 uppercase block">Intensity Legend</span>

      {activeGases.length === 0 ? (
        <p className="text-[10px] text-ground-500">No gas layer active</p>
      ) : (
        activeGases.map((gas) => (
          <div key={gas.id} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] text-ground-300 font-mono">{gas.shortLabel}</span>
              <span className="text-[9px] text-sensor font-bold font-mono">{gas.range}</span>
            </div>
            <div className={`h-1.5 rounded-full bg-gradient-to-r ${gas.gradient}`} />
          </div>
        ))
      )}
    </div>
  );
}
