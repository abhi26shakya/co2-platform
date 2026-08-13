/** Pure geodesy helpers for GIS drawing/measurement tools — no Cesium dependency, unit-testable in isolation.
 *  Distances/radii are supplied by the caller (computed from Cesium.Cartesian3.distance on actual scene
 *  points) so this module only owns area math and GeoJSON/measurement-string assembly, not the 3D geometry. */

const EARTH_RADIUS_M = 6378137;

export interface LatLon {
  lat: number;
  lon: number;
}

export interface GeoFeature {
  type: "Feature";
  geometry:
    | { type: "Point"; coordinates: [number, number] }
    | { type: "LineString"; coordinates: [number, number][] }
    | { type: "Polygon"; coordinates: [number, number][][] };
  properties: Record<string, unknown>;
}

/** Planar (equirectangular) polygon area approximation, adequate for the small regions this tool measures. */
export function polygonAreaM2(coords: LatLon[]): number {
  if (coords.length < 3) return 0;

  const originLat = coords[0].lat;
  const originLon = coords[0].lon;
  const x = coords.map(
    (c) => (((c.lon - originLon) * Math.PI) / 180) * EARTH_RADIUS_M * Math.cos((originLat * Math.PI) / 180)
  );
  const y = coords.map((c) => ((c.lat - originLat) * Math.PI) / 180 * EARTH_RADIUS_M);

  let area = 0;
  const len = coords.length;
  for (let i = 0; i < len; i++) {
    const next = (i + 1) % len;
    area += x[i] * y[next] - x[next] * y[i];
  }
  return Math.abs(area / 2);
}

export function rectangleBounds(a: LatLon, b: LatLon) {
  return {
    west: Math.min(a.lon, b.lon),
    east: Math.max(a.lon, b.lon),
    south: Math.min(a.lat, b.lat),
    north: Math.max(a.lat, b.lat),
  };
}

export function rectangleAreaM2(a: LatLon, b: LatLon): number {
  const { west, east, south, north } = rectangleBounds(a, b);
  const midLat = (south + north) / 2;

  const widthM = (((east - west) * Math.PI) / 180) * EARTH_RADIUS_M * Math.cos((midLat * Math.PI) / 180);
  const heightM = ((north - south) * Math.PI) / 180 * EARTH_RADIUS_M;
  return Math.abs(widthM * heightM);
}

export function circleAreaM2(radiusM: number): number {
  return Math.PI * radiusM * radiusM;
}

/** Great-circle distance between two lat/lon points — used by the 2D (MapLibre) engine, which has no
 *  Cesium.Cartesian3.distance equivalent since it works in lng/lat rather than a 3D ellipsoid frame. */
/** Ray-casting point-in-polygon test (even-odd rule) for a single ring, [lon, lat] pairs as
 *  GeoJSON coordinates use. Used to filter facilities/hotspots down to a selected region
 *  boundary (see regions.ts) - accurate enough for country/state-sized polygons at this app's
 *  scale, no need for a full geodesic library. */
function pointInRing(lon: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** Tests a point against a GeoJSON Polygon or MultiPolygon geometry (first ring of each polygon
 *  is the outer boundary; subsequent rings are holes, handled via the even-odd rule per-ring). */
export function pointInPolygon(point: LatLon, geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon): boolean {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  for (const rings of polygons) {
    let inside = pointInRing(point.lon, point.lat, rings[0]);
    for (let i = 1; i < rings.length; i++) {
      if (pointInRing(point.lon, point.lat, rings[i])) inside = false;
    }
    if (inside) return true;
  }
  return false;
}

export function haversineDistanceM(a: LatLon, b: LatLon): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function m2ToKm2(m2: number): number {
  return m2 / 1_000_000;
}

export function metersToKm(m: number): number {
  return m / 1000;
}

export function formatAreaKm2(m2: number): string {
  return `${m2ToKm2(m2).toFixed(2)} km²`;
}

export function formatDistanceKm(m: number): string {
  return `${metersToKm(m).toFixed(2)} km`;
}

export type DrawingToolId =
  | "polygon"
  | "rectangle"
  | "circle"
  | "polyline"
  | "distance"
  | "area"
  | "picker";

export interface CompletedDrawing {
  id: string;
  type: DrawingToolId | "marker";
  measurement: string;
  geojson: GeoFeature;
}

/** Minimum vertex count each multi-click tool needs before it can be completed —
 *  polygon/area need a closed ring (3 unique vertices), polyline/distance just need 2. */
const MINIMUM_POINTS: Record<string, number> = {
  polygon: 3,
  area: 3,
  polyline: 2,
  distance: 2,
};

/** Whether a multi-click drawing tool has enough vertices to complete. Tools not present in
 *  MINIMUM_POINTS (picker/rectangle/circle) use their own click-driven completion flow, not this
 *  double-click-to-finish path, so they always report supported here. */
export function hasMinimumPoints(type: string, count: number): boolean {
  const min = MINIMUM_POINTS[type];
  if (min == null) return true;
  return count >= min;
}

export function pointsRemaining(type: string, count: number): number {
  const min = MINIMUM_POINTS[type];
  if (min == null) return 0;
  return Math.max(0, min - count);
}

export function buildPickerResult(coords: LatLon, uuid: string): CompletedDrawing {
  const measurement = `Coords: ${coords.lat.toFixed(4)}°, ${coords.lon.toFixed(4)}°`;
  return {
    id: `marker-${uuid}`,
    type: "marker",
    measurement,
    geojson: {
      type: "Feature",
      geometry: { type: "Point", coordinates: [coords.lon, coords.lat] },
      properties: { type: "picker", coords: measurement },
    },
  };
}

export function buildRectangleResult(a: LatLon, b: LatLon, uuid: string): CompletedDrawing {
  const { west, east, south, north } = rectangleBounds(a, b);
  const areaM2 = rectangleAreaM2(a, b);
  const measurement = formatAreaKm2(areaM2);
  return {
    id: `rectangle-${uuid}`,
    type: "rectangle",
    measurement,
    geojson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [west, south],
            [east, south],
            [east, north],
            [west, north],
            [west, south],
          ],
        ],
      },
      properties: { type: "rectangle", measurement, area_km2: m2ToKm2(areaM2) },
    },
  };
}

export function buildCircleResult(center: LatLon, radiusM: number, uuid: string): CompletedDrawing {
  const areaM2 = circleAreaM2(radiusM);
  const measurement = `Area: ${formatAreaKm2(areaM2)} (Rad: ${formatDistanceKm(radiusM)})`;
  return {
    id: `circle-${uuid}`,
    type: "circle",
    measurement,
    geojson: {
      type: "Feature",
      geometry: { type: "Point", coordinates: [center.lon, center.lat] },
      properties: { type: "circle", radius_meters: radiusM, measurement },
    },
  };
}

export function buildPolylineResult(
  coords: LatLon[],
  totalDistanceM: number,
  uuid: string,
  type: "polyline" | "distance" = "polyline"
): CompletedDrawing {
  const measurement = `Distance: ${formatDistanceKm(totalDistanceM)}`;
  return {
    id: `polyline-${uuid}`,
    type,
    measurement,
    geojson: {
      type: "Feature",
      geometry: { type: "LineString", coordinates: coords.map((c) => [c.lon, c.lat]) },
      properties: { type, measurement, length_km: metersToKm(totalDistanceM) },
    },
  };
}

export function buildPolygonResult(
  coords: LatLon[],
  uuid: string,
  type: "polygon" | "area" = "polygon"
): CompletedDrawing {
  const areaM2 = polygonAreaM2(coords);
  const measurement = formatAreaKm2(areaM2);
  const closed = coords.map((c) => [c.lon, c.lat] as [number, number]);
  if (closed.length > 0) closed.push([coords[0].lon, coords[0].lat]);
  return {
    id: `polygon-${uuid}`,
    type,
    measurement,
    geojson: {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [closed] },
      properties: { type, measurement, area_km2: m2ToKm2(areaM2) },
    },
  };
}
