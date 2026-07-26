/**
 * Raster tile URL templates shared by both map engines (Cesium 3D and MapLibre 2D) so basemap
 * selection looks visually consistent regardless of which engine is active.
 */
export const BASEMAP_TILES: Record<string, string[]> = {
  dark: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
  satellite: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
  hybrid: [
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    "https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  ],
  osm: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
};

/**
 * Standalone overlay layers toggled independently of the basemap (LayerToggleOverlay's
 * "boundaries"/"roads" checkboxes). Reuses the same CARTO/OSM providers as the basemaps above —
 * no new tile provider — composited on top at reduced alpha.
 */
export const OVERLAY_TILES = {
  /** CARTO's labels-only tile includes admin borders + place labels, no fill — a real overlay,
   *  not a full basemap swap. */
  boundaries: "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
  /** No free roads-only tile source is wired into this project; standard OSM cartography at
   *  reduced alpha is used as an approximation since roads dominate its linework. */
  roads: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
};
