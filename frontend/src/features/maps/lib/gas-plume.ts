import type { MapHotspot } from "@/types/geo";

/** Gas-plume color/offset logic shared by every render mode in maplibre-map.tsx (heatmap,
 *  markers, contours, volume, animated), across both the flat and globe projections. */
export interface PlumePoint {
  lat: number;
  lon: number;
  intensity: number;
  value: number;
  unit: string;
  /** The real dispersion radius (meters) the backend estimated for this hotspot
   *  (MapHotspot.radius_m) — how far its effect actually reaches on the ground, not a display
   *  constant. Drives the density layer's footprint size in maplibre-map.tsx. */
  radiusM: number;
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

export function getGasColorHex(gas: string, val: number): string {
  const normVal = Math.min(1, Math.max(0, val));
  if (gas === "ch4") {
    if (normVal < 0.3) return "#3b82f6";
    if (normVal < 0.6) return "#06b6d4";
    return "#a855f7";
  }
  if (gas === "no2") {
    if (normVal < 0.3) return "#facc15";
    if (normVal < 0.6) return "#f97316";
    return "#ef4444";
  }
  if (gas === "so2") {
    if (normVal < 0.5) return "#8b5cf6";
    return "#ec4899";
  }
  if (gas === "co") {
    if (normVal < 0.5) return "#14b8a6";
    return "#f97316";
  }
  if (normVal < 0.2) return "#22c55e";
  if (normVal < 0.4) return "#eab308";
  if (normVal < 0.6) return "#f97316";
  if (normVal < 0.8) return "#ef4444";
  return "#7f1d1d";
}

export function getGasPlumes(gas: string, baseHotspots: MapHotspot[]): PlumePoint[] {
  return baseHotspots.map((h, i) => {
    let latOffset = 0;
    let lonOffset = 0;
    let valueMultiplier = 1.0;
    let unit = "ppm";

    if (gas === "ch4") {
      latOffset = 0.02 * Math.sin(i);
      lonOffset = 0.02 * Math.cos(i);
      valueMultiplier = 1950.0;
      unit = "ppb";
    } else if (gas === "no2") {
      latOffset = -0.015 * Math.cos(i * 1.5);
      lonOffset = 0.015 * Math.sin(i * 1.5);
      valueMultiplier = 95.0;
      unit = "ppb";
    } else if (gas === "so2") {
      latOffset = 0.03 * Math.sin(i * 2);
      lonOffset = -0.01 * Math.cos(i * 2);
      valueMultiplier = 45.0;
      unit = "ppb";
    } else if (gas === "co") {
      latOffset = -0.01 * Math.cos(i * 0.5);
      lonOffset = -0.02 * Math.sin(i * 0.5);
      valueMultiplier = 120.0;
      unit = "ppb";
    } else {
      latOffset = 0;
      lonOffset = 0;
      valueMultiplier = 415.0;
      unit = "ppm";
    }

    return {
      lat: h.lat + latOffset,
      lon: h.lon + lonOffset,
      intensity: h.intensity,
      value: h.intensity * valueMultiplier,
      unit,
      radiusM: h.radius_m,
    };
  });
}

/** Applies the same comparison-mode color overrides (difference/confidence layers) both engines use. */
export function resolveComparisonColorHex(
  baseColorHex: string,
  plume: { lat: number; lon: number; intensity: number },
  comparisonMode: boolean,
  comparisonType?: string
): string {
  if (!comparisonMode) return baseColorHex;
  if (comparisonType === "difference-layer") {
    const indexSum = Math.floor(plume.lat * 100 + plume.lon * 100);
    return indexSum % 2 === 0 ? "#3b82f6" : "#ef4444";
  }
  if (comparisonType === "confidence-layer") {
    const confNorm = plume.intensity;
    return confNorm > 0.8 ? "#10b981" : confNorm > 0.6 ? "#f59e0b" : "#ef4444";
  }
  return baseColorHex;
}
