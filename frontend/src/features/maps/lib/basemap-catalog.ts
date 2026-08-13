import type { MapMode } from "@/features/maps/store/map-store";

export interface BasemapDef {
  id: string;
  label: string;
  modes: MapMode[];
}

export const BASEMAPS: BasemapDef[] = [
  { id: "light", label: "Light style", modes: ["2d", "3d"] },
  { id: "dark", label: "Dark style", modes: ["2d", "3d"] },
  { id: "satellite", label: "Satellite", modes: ["2d", "3d"] },
  { id: "hybrid", label: "Hybrid", modes: ["2d", "3d"] },
  { id: "osm", label: "Street Map", modes: ["2d", "3d"] },
];

export const DEFAULT_2D_BASEMAP = "dark";

export function basemapsForMode(mode: MapMode): BasemapDef[] {
  return BASEMAPS.filter((b) => b.modes.includes(mode));
}

export function isBasemapSupported(basemapId: string, mode: MapMode): boolean {
  return BASEMAPS.some((b) => b.id === basemapId && b.modes.includes(mode));
}
