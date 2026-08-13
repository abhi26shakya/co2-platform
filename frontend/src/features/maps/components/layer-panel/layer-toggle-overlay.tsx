import { Layers } from "lucide-react";

export interface ShowLayers {
  plants: boolean;
  heatmap: boolean;
  contours: boolean;
  prediction: boolean;
  boundaries: boolean;
  roads: boolean;
  clouds: boolean;
  population: boolean;
}

const TOGGLES: { key: keyof ShowLayers; label: string }[] = [
  { key: "plants", label: "Industrial Plants" },
  { key: "heatmap", label: "Heatmaps overlay" },
  { key: "contours", label: "Isoline Contours" },
  { key: "prediction", label: "Prediction labels" },
  { key: "boundaries", label: "Political borders" },
  { key: "roads", label: "Roads & networks" },
  { key: "clouds", label: "Simulated Clouds" },
  { key: "population", label: "Population density" },
];

interface Props {
  showLayers: ShowLayers;
  onChange: (layers: ShowLayers) => void;
}

/** Rendered inline in the side "Layers" flyout, next to BasemapSelector. */
export function LayerToggleOverlay({ showLayers, onChange }: Props) {
  return (
    <div className="glass-strong rounded-xl p-3.5 space-y-3 w-full">
      <h4 className="text-[10px] uppercase font-bold text-ground-400 tracking-wider flex items-center gap-1.5 border-b border-ground-800 pb-1.5">
        <Layers className="h-3 w-3" /> Toggle Layers
      </h4>
      <div className="space-y-1.5 text-[11px] text-ground-300">
        {TOGGLES.map((lyr) => (
          <label key={lyr.key} className="flex items-center justify-between cursor-pointer select-none">
            <span>{lyr.label}</span>
            <input
              type="checkbox"
              checked={showLayers[lyr.key]}
              onChange={(e) => onChange({ ...showLayers, [lyr.key]: e.target.checked })}
              className="accent-sensor h-3 w-3 cursor-pointer"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
