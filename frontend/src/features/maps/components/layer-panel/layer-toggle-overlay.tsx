import { Layers } from "lucide-react";

export interface ShowLayers {
  plants: boolean;
  heatmap: boolean;
  contours: boolean;
  prediction: boolean;
  boundaries: boolean;
  roads: boolean;
  clouds: boolean;
}

const TOGGLES: { key: keyof ShowLayers; label: string }[] = [
  { key: "plants", label: "Industrial Plants" },
  { key: "heatmap", label: "Heatmaps overlay" },
  { key: "contours", label: "Isoline Contours" },
  { key: "boundaries", label: "Political borders" },
  { key: "roads", label: "Roads & networks" },
  { key: "clouds", label: "Simulated Clouds" },
];

interface Props {
  showLayers: ShowLayers;
  onChange: (layers: ShowLayers) => void;
}

/** Compact floating overlay on the map canvas — kept minimal per the map-first layout, not a full Card. */
export function LayerToggleOverlay({ showLayers, onChange }: Props) {
  return (
    <div className="glass-strong absolute top-4 right-4 rounded-xl p-3.5 space-y-3 z-10 w-44">
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
