/**
 * Raster tile URL templates for the map's basemap selector, shared across both the flat
 * (mercator) and globe projections so basemap choice looks consistent in either mode.
 */
export const BASEMAP_TILES: Record<string, string[]> = {
  dark: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
  // CARTO Positron — muted gray landmass, near-white ocean, minimal labels. Paired with the
  // globe's dark starfield sky (map-starfield in globals.css) this reproduces the Climate
  // TRACE-style "light planet floating in dark space" look.
  light: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
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
