import { Card } from "@/components/ui/card";
import { Layers2 } from "lucide-react";
import { GASES } from "@/features/maps/lib/gas-catalog";

interface GasConfig {
  enabled: boolean;
  opacity: number;
}

interface Props {
  gases: Record<string, GasConfig>;
  onToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

export function GasLayerControls({ gases, onToggle, onOpacityChange }: Props) {
  return (
    <Card className="glass p-4 space-y-3">
      <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
        <Layers2 className="h-3.5 w-3.5" /> Multi-Gas Layers
      </h3>
      <p className="text-[10px] leading-snug text-ground-500">
        Only CO₂ is measured from satellite data today. CH₄/NO₂/SO₂/CO layers are simulated
        for visualization — derived from the same CO₂ signal, not independent measurements.
      </p>
      <div className="space-y-3 text-xs">
        {GASES.map((gas) => {
          const config = gases[gas.id] || { enabled: false, opacity: 0.8 };
          return (
            <div key={gas.id} className="space-y-1.5 p-2 rounded-lg bg-ground-950/40 border border-ground-800/40">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => onToggle(gas.id)}
                    className="accent-sensor h-3 w-3 cursor-pointer"
                  />
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${gas.color}`} />
                    <span className={config.enabled ? "text-instrument font-medium" : "text-ground-400"}>{gas.label}</span>
                  </span>
                </label>
              </div>

              {config.enabled && (
                <div className="space-y-1.5 pl-5 pt-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[10px] text-ground-400">
                    <span>Opacity: {Math.round(config.opacity * 100)}%</span>
                    <span className="font-mono text-sensor">{gas.range}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.opacity}
                    onChange={(e) => onOpacityChange(gas.id, parseFloat(e.target.value))}
                    className="w-full accent-sensor bg-ground-800 h-1 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-1.5 w-full rounded bg-gradient-to-r ${gas.gradient}`} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
