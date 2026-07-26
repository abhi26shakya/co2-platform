import type { MapMode } from "@/features/maps/store/map-store";

export interface VisualizationModeDef {
  id: string;
  label: string;
  /** "volume3d" (extruded columns) and "animated" (pulsing canvas texture) are 3D-only concepts
   *  with no sensible flat-map equivalent. */
  modes: MapMode[];
}

export const VISUALIZATION_MODES: VisualizationModeDef[] = [
  { id: "volume3d", label: "3D Extruded Columns", modes: ["3d"] },
  { id: "heatmap", label: "Plume Heatmap", modes: ["2d", "3d"] },
  { id: "contours", label: "Contours (Isolines)", modes: ["2d", "3d"] },
];

export const DEFAULT_2D_VISUALIZATION_MODE = "heatmap";

export function visualizationModesForMode(mode: MapMode): VisualizationModeDef[] {
  return VISUALIZATION_MODES.filter((m) => m.modes.includes(mode));
}

export function isModeSupported(modeId: string, mapMode: MapMode): boolean {
  return VISUALIZATION_MODES.some((m) => m.id === modeId && m.modes.includes(mapMode));
}
