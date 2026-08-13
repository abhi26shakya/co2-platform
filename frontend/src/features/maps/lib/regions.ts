import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countries110m from "world-atlas/countries-110m.json";
import { whereNumeric } from "iso-3166-1";

export interface RegionBoundary {
  /** "country" for the bundled world-atlas dataset, "state" for on-demand geoBoundaries ADM1
   *  results - distinguishes the two tiers described in the plan doc (bundled vs fetched). */
  type: "country" | "state";
  name: string;
  /** ISO 3166-1 alpha-3 - present on countries (used to key the ADM1 fetch), absent on states
   *  (geoBoundaries' ADM1 features carry their own shapeISO, not a country-level code). */
  iso3?: string;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  bbox: [number, number, number, number];
}

function computeBbox(geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon): [number, number, number, number] {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  for (const rings of polygons) {
    for (const [lon, lat] of rings[0]) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [minLon, minLat, maxLon, maxLat];
}

let cachedCountries: RegionBoundary[] | null = null;

/** Bundled at build time (world-atlas's 110m Natural Earth extract, public domain, ~100KB) - no
 *  network request, no rate limit, available offline. Only country-level detail; see
 *  fetchStateBoundaries for the finer on-demand tier. */
export function getCountryBoundaries(): RegionBoundary[] {
  if (cachedCountries) return cachedCountries;
  const topology = countries110m as unknown as Topology;
  const collection = feature(
    topology,
    topology.objects.countries as GeometryCollection<{ name: string }>
  ) as GeoJSON.FeatureCollection<GeoJSON.Geometry, { name: string }>;
  const boundaries = collection.features
    .filter(
      (f): f is GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, { name: string }> =>
        f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
    )
    .map((f) => {
      const numericId = typeof f.id === "string" ? f.id : String(f.id ?? "");
      const iso = whereNumeric(numericId.padStart(3, "0"));
      return {
        type: "country" as const,
        name: f.properties.name ?? "Unknown",
        iso3: iso?.alpha3,
        geometry: f.geometry,
        bbox: computeBbox(f.geometry),
      };
    });
  cachedCountries = boundaries;
  return boundaries;
}

export function searchCountryBoundaries(query: string, limit = 5): RegionBoundary[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 2) return [];
  return getCountryBoundaries()
    .filter((c) => c.name.toLowerCase().includes(trimmed))
    .slice(0, limit);
}

const stateCache = new Map<string, RegionBoundary[]>();

/** On-demand fetch of a country's state/province (ADM1) boundaries from geoBoundaries.org's free,
 *  no-key API — verified reachable directly (curl) before wiring this up: the metadata endpoint
 *  returns a `simplifiedGeometryGeoJSON` URL that 302-redirects to media.githubusercontent.com
 *  (the underlying files are git-lfs objects in the geoBoundaries repo); that final response
 *  carries `access-control-allow-origin: *`, so a browser fetch() follows the redirect and reads
 *  the body directly. Cached in-memory per session — this app's facility footprint spans a
 *  handful of countries, so there's no need to persist beyond the current tab. */
export async function fetchStateBoundaries(iso3: string): Promise<RegionBoundary[]> {
  const cached = stateCache.get(iso3);
  if (cached) return cached;

  const metaRes = await fetch(`https://www.geoboundaries.org/api/current/gbOpen/${iso3}/ADM1/`);
  if (!metaRes.ok) throw new Error(`No ADM1 boundaries available for ${iso3}`);
  const meta = (await metaRes.json()) as { simplifiedGeometryGeoJSON?: string; gjDownloadURL?: string };
  const geojsonUrl = meta.simplifiedGeometryGeoJSON || meta.gjDownloadURL;
  if (!geojsonUrl) throw new Error(`No ADM1 geometry URL for ${iso3}`);

  const geoRes = await fetch(geojsonUrl);
  if (!geoRes.ok) throw new Error(`Failed to fetch ADM1 geometry for ${iso3}`);
  const collection = (await geoRes.json()) as GeoJSON.FeatureCollection<
    GeoJSON.Polygon | GeoJSON.MultiPolygon,
    { shapeName?: string }
  >;

  const boundaries = collection.features.map((f) => ({
    type: "state" as const,
    name: f.properties?.shapeName ?? "Unknown",
    geometry: f.geometry,
    bbox: computeBbox(f.geometry),
  }));
  stateCache.set(iso3, boundaries);
  return boundaries;
}

export function searchStateBoundaries(iso3: string, query: string, limit = 5): RegionBoundary[] {
  const trimmed = query.trim().toLowerCase();
  const cached = stateCache.get(iso3);
  if (!cached || trimmed.length < 2) return [];
  return cached.filter((s) => s.name.toLowerCase().includes(trimmed)).slice(0, limit);
}
