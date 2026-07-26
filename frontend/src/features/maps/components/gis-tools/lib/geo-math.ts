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
