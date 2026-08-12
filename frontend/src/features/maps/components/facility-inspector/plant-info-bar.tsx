import { Cpu, Info, X } from "lucide-react";
import type { InspectedFacility } from "@/features/maps/components/facility-inspector/inspector-drawer";

interface Props {
  facility: InspectedFacility | null;
  onOpenDetails: () => void;
  onClear: () => void;
}

/** Bottom glass bar — the always-visible "selected plant" summary. Opens the full
 *  InspectorDrawer for charts/history rather than duplicating that detail here. */
export function PlantInfoBar({ facility, onOpenDetails, onClear }: Props) {
  if (!facility) return null;

  return (
    <div className="glass-strong absolute bottom-4 left-4 z-10 w-[26rem] max-w-[calc(100%-2rem)] rounded-xl p-3.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider text-ground-400">
            <Cpu className="h-3 w-3" /> Selected Plant
          </div>
          <h4 className="mt-0.5 text-sm font-semibold text-sensor truncate">{facility.name}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-ground-400 font-mono">
            <span>{facility.industry || facility.sector || "Energy Production"}</span>
            <span>{facility.country || "—"}</span>
            {facility.lat != null && facility.lon != null && (
              <span>
                {facility.lat.toFixed(3)}, {facility.lon.toFixed(3)}
              </span>
            )}
            {facility.latest_prediction && <span className="text-sensor font-semibold">{facility.latest_prediction}</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={onOpenDetails}
            className="flex items-center gap-1 rounded-lg bg-sensor/10 hover:bg-sensor/20 border border-sensor/25 px-2.5 py-1.5 text-[10px] font-semibold text-sensor cursor-pointer"
            title="Open full facility inspector"
          >
            <Info className="h-3 w-3" /> Details
          </button>
          <button
            onClick={onClear}
            className="rounded-lg p-1.5 text-ground-400 hover:text-instrument hover:bg-ground-850 cursor-pointer"
            title="Clear selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
