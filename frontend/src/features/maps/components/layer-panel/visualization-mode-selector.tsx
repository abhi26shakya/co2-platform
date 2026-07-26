import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { visualizationModesForMode } from "@/features/maps/lib/visualization-mode-catalog";
import type { MapMode } from "@/features/maps/store/map-store";

interface Props {
  selectedMode: string;
  mapMode: MapMode;
  onSelect: (id: string) => void;
}

export function VisualizationModeSelector({ selectedMode, mapMode, onSelect }: Props) {
  const modes = visualizationModesForMode(mapMode);

  return (
    <Card className="p-4 bg-ground-900/40 border-ground-700/80 space-y-3">
      <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5" /> Render Modes
      </h3>
      <div className="grid grid-cols-1 gap-1 text-xs">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`w-full text-left p-2 rounded transition-colors cursor-pointer ${
              selectedMode === mode.id ? "bg-ground-800 text-sensor font-semibold" : "hover:bg-ground-850/40 text-ground-400"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
