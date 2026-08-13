import type { MapMode } from "@/features/maps/store/map-store";

export interface BasemapDef {
  id: string;
  label: string;
  modes: MapMode[];
  /** Mapbox-hosted vector style URL (`mapbox://styles/...`) — passed straight to
   *  `map.setStyle()`/the constructor's `style` option. Mapbox GL JS resolves the `mapbox://`
   *  scheme itself (auth token, glyphs, sprites) once `mapboxgl.accessToken` is set. */
  styleUrl: string;
}

export const BASEMAPS: BasemapDef[] = [
  { id: "light", label: "Light style", modes: ["2d", "3d"], styleUrl: "mapbox://styles/mapbox/light-v11" },
  { id: "dark", label: "Dark style", modes: ["2d", "3d"], styleUrl: "mapbox://styles/mapbox/dark-v11" },
  { id: "satellite", label: "Satellite", modes: ["2d", "3d"], styleUrl: "mapbox://styles/mapbox/satellite-v9" },
  // Mapbox ships imagery + street/label overlay as one first-class style — replaces the previous
  // ArcGIS-imagery + CARTO-labels two-raster-source stack with a single native style.
  { id: "hybrid", label: "Hybrid", modes: ["2d", "3d"], styleUrl: "mapbox://styles/mapbox/satellite-streets-v12" },
  { id: "streets", label: "Street Map", modes: ["2d", "3d"], styleUrl: "mapbox://styles/mapbox/streets-v12" },
];

export const DEFAULT_2D_BASEMAP = "dark";

export function basemapsForMode(mode: MapMode): BasemapDef[] {
  return BASEMAPS.filter((b) => b.modes.includes(mode));
}

export function isBasemapSupported(basemapId: string, mode: MapMode): boolean {
  return BASEMAPS.some((b) => b.id === basemapId && b.modes.includes(mode));
}

export function getBasemapStyleUrl(basemapId: string): string {
  return BASEMAPS.find((b) => b.id === basemapId)?.styleUrl ?? BASEMAPS.find((b) => b.id === DEFAULT_2D_BASEMAP)!.styleUrl;
}
