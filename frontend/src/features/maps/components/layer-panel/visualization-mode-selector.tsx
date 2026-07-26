"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, Eye } from "lucide-react";
import { visualizationModesForMode } from "@/features/maps/lib/visualization-mode-catalog";
import type { MapMode } from "@/features/maps/store/map-store";

interface Props {
  selectedMode: string;
  mapMode: MapMode;
  onSelect: (id: string) => void;
  /** "panel" (default) renders the full vertical list card used in the side flyout.
   *  "compact" renders a single dropdown trigger sized for the top control bar. */
  variant?: "panel" | "compact";
}

export function VisualizationModeSelector({ selectedMode, mapMode, onSelect, variant = "panel" }: Props) {
  const modes = visualizationModesForMode(mapMode);
  const [open, setOpen] = useState(false);

  if (variant === "compact") {
    const activeLabel = modes.find((m) => m.id === selectedMode)?.label ?? "Render Mode";
    return (
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="glass-strong flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-instrument cursor-pointer whitespace-nowrap"
        >
          <Eye className="h-3.5 w-3.5 text-ground-400" />
          <span className="font-semibold">{activeLabel}</span>
          <ChevronDown className={`h-3 w-3 text-ground-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="glass-strong absolute top-full left-0 mt-1 rounded-lg z-20 w-52 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  onSelect(mode.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  selectedMode === mode.id ? "bg-ground-800 text-sensor font-semibold" : "hover:bg-ground-850/60 text-ground-300"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        )}

        {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />}
      </div>
    );
  }

  return (
    <Card className="glass p-4 space-y-3">
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
