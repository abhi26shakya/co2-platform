import type { MapMode } from "@/features/maps/store/map-store";

interface Props {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}

/** Segmented 2D/3D engine switch, floating on the map canvas above the compass. */
export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="absolute top-20 left-4 z-10 flex bg-ground-900/90 border border-ground-700/80 rounded-lg p-1 gap-0.5 shadow-2xl select-none">
      {(["2d", "3d"] as const).map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            mode === id ? "bg-sensor/10 text-sensor" : "text-ground-400 hover:text-instrument"
          }`}
        >
          {id}
        </button>
      ))}
    </div>
  );
}
