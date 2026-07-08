"use client";

import { useHotspots, usePlants } from "@/hooks/use-geo";
import dynamic from "next/dynamic";
import { useState } from "react";

// Leaflet touches `window`; it can only render client-side.
const EmissionMap = dynamic(() => import("@/components/map/emission-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[36rem] items-center justify-center rounded-xl border border-ground-700 bg-ground-900/40 text-sm text-ground-400">
      Loading map…
    </div>
  ),
});

function LayerToggle({
  label,
  checked,
  onChange,
  swatchClass,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  swatchClass: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 accent-current"
      />
      <span className={`h-2.5 w-2.5 rounded-full ${swatchClass}`} aria-hidden />
      {label}
    </label>
  );
}

export default function MapPage() {
  const { data: plants = [] } = usePlants();
  const { data: hotspots = [] } = useHotspots();
  const [showPlants, setShowPlants] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        Map
      </h1>
      <p className="mt-1 text-sm text-ground-400">
        Known industrial plants and emission hotspots from your predictions.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <LayerToggle
          label={`Plants (${plants.length})`}
          checked={showPlants}
          onChange={setShowPlants}
          swatchClass="bg-sensor"
        />
        <LayerToggle
          label={`Hotspots (${hotspots.length})`}
          checked={showHotspots}
          onChange={setShowHotspots}
          swatchClass="plume-gradient"
        />
        <div className="ml-auto flex items-center gap-2 text-xs text-ground-400">
          <span>low</span>
          <span className="plume-gradient h-1.5 w-24 rounded-full" aria-hidden />
          <span>high intensity</span>
        </div>
      </div>

      <div className="mt-4">
        <EmissionMap
          plants={plants}
          hotspots={hotspots}
          showPlants={showPlants}
          showHotspots={showHotspots}
        />
      </div>

      {hotspots.length === 0 && (
        <p className="mt-3 text-sm text-ground-400">
          No hotspots yet — run a prediction on a GeoTIFF scene from the Datasets page and
          they will appear here.
        </p>
      )}
    </div>
  );
}
