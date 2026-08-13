import type { MapMode } from "@/features/maps/store/map-store";

export interface VisualizationModeDef {
  id: string;
  label: string;
  /** "volume3d" (fill-extrusion columns) and "animated" (pulsing circle radius/opacity) are
   *  rendered by MapLibre under globe projection — kept 3D-only because they read best with the
   *  tilt/perspective the globe view provides, not because of any engine limitation. */
  modes: MapMode[];
}

export const VISUALIZATION_MODES: VisualizationModeDef[] = [
  { id: "volume3d", label: "3D Extruded Columns", modes: ["3d"] },
  { id: "pill3d", label: "Pill Markers", modes: ["3d"] },
  { id: "heatmap", label: "Plume Heatmap", modes: ["2d", "3d"] },
  { id: "markers", label: "Point Markers", modes: ["2d", "3d"] },
  { id: "contours", label: "Contours (Isolines)", modes: ["2d", "3d"] },
  { id: "animated", label: "Animated Pulse", modes: ["3d"] },
];

export const DEFAULT_2D_VISUALIZATION_MODE = "heatmap";

export function visualizationModesForMode(mode: MapMode): VisualizationModeDef[] {
  return VISUALIZATION_MODES.filter((m) => m.modes.includes(mode));
}

export function isModeSupported(modeId: string, mapMode: MapMode): boolean {
  return VISUALIZATION_MODES.some((m) => m.id === modeId && m.modes.includes(mapMode));
}
