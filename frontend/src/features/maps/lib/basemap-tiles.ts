/**
 * Standalone overlay layers toggled independently of the basemap (LayerToggleOverlay's
 * "boundaries"/"roads" checkboxes). These are unaffected by the Mapbox basemap migration — the
 * basemap style itself now comes from `basemap-catalog.ts`'s `styleUrl` field (Mapbox-hosted
 * vector styles), but these overlays are separate raster sources composited on top regardless of
 * which basemap style is active, so they stay on their existing free providers.
 */
export const OVERLAY_TILES = {
  /** CARTO's labels-only tile includes admin borders + place labels, no fill — a real overlay,
   *  not a full basemap swap. */
  boundaries: "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
  /** No free roads-only tile source is wired into this project; standard OSM cartography at
   *  reduced alpha is used as an approximation since roads dominate its linework. */
  roads: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
};
