import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

const BASEMAPS = [
  { id: "dark", label: "Dark style" },
  { id: "satellite", label: "Satellite" },
  { id: "hybrid", label: "Hybrid" },
  { id: "terrain", label: "Terrain 3D" },
  { id: "osm", label: "Street Map" },
];

interface Props {
  activeBasemap: string;
  onSelect: (id: string) => void;
}

export function BasemapSelector({ activeBasemap, onSelect }: Props) {
  return (
    <Card className="p-4 bg-ground-900/40 border-ground-700/80 space-y-3">
      <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
        <Globe className="h-3.5 w-3.5" /> Basemaps
      </h3>
      <div className="grid grid-cols-2 gap-1.5 text-xs text-ground-300">
        {BASEMAPS.map((base) => (
          <button
            key={base.id}
            onClick={() => onSelect(base.id)}
            className={`px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
              activeBasemap === base.id ? "bg-ground-800 text-sensor font-semibold" : "hover:bg-ground-850"
            }`}
          >
            {base.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
