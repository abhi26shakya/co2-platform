import { describe, expect, it } from "vitest";
import {
  buildCircleResult,
  buildPickerResult,
  buildPolygonResult,
  buildPolylineResult,
  buildRectangleResult,
  circleAreaM2,
  formatAreaKm2,
  formatDistanceKm,
  m2ToKm2,
  metersToKm,
  polygonAreaM2,
  rectangleAreaM2,
  rectangleBounds,
} from "./geo-math";

describe("polygonAreaM2", () => {
  it("returns 0 for fewer than 3 points", () => {
    expect(polygonAreaM2([])).toBe(0);
    expect(polygonAreaM2([{ lat: 0, lon: 0 }])).toBe(0);
    expect(polygonAreaM2([{ lat: 0, lon: 0 }, { lat: 1, lon: 1 }])).toBe(0);
  });

  it("computes a positive area for a small triangle", () => {
    const area = polygonAreaM2([
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0.01 },
      { lat: 0.01, lon: 0 },
    ]);
    expect(area).toBeGreaterThan(0);
  });

  it("is invariant to which vertex the polygon starts from", () => {
    const a = polygonAreaM2([
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0.02 },
      { lat: 0.02, lon: 0.02 },
      { lat: 0.02, lon: 0 },
    ]);
    const b = polygonAreaM2([
      { lat: 0.02, lon: 0.02 },
      { lat: 0.02, lon: 0 },
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0.02 },
    ]);
    expect(a).toBeCloseTo(b, 0);
  });
});

describe("rectangleBounds", () => {
  it("normalizes two arbitrary corners into west/east/south/north", () => {
    expect(rectangleBounds({ lat: 10, lon: 20 }, { lat: 5, lon: 25 })).toEqual({
      west: 20,
      east: 25,
      south: 5,
      north: 10,
    });
  });
});

describe("rectangleAreaM2", () => {
  it("returns 0 area for a degenerate (zero-width) rectangle", () => {
    expect(rectangleAreaM2({ lat: 0, lon: 0 }, { lat: 0, lon: 0 })).toBe(0);
  });

  it("scales with width and height", () => {
    const small = rectangleAreaM2({ lat: 0, lon: 0 }, { lat: 0.01, lon: 0.01 });
    const large = rectangleAreaM2({ lat: 0, lon: 0 }, { lat: 0.02, lon: 0.02 });
    expect(large).toBeGreaterThan(small);
  });
});

describe("circleAreaM2", () => {
  it("matches pi * r^2", () => {
    expect(circleAreaM2(1000)).toBeCloseTo(Math.PI * 1000 * 1000, 3);
  });

  it("is zero for zero radius", () => {
    expect(circleAreaM2(0)).toBe(0);
  });
});

describe("unit conversions and formatting", () => {
  it("converts m2 to km2", () => {
    expect(m2ToKm2(1_000_000)).toBe(1);
  });

  it("converts meters to km", () => {
    expect(metersToKm(2500)).toBe(2.5);
  });

  it("formats area in km2 with two decimals", () => {
    expect(formatAreaKm2(2_500_000)).toBe("2.50 km²");
  });

  it("formats distance in km with two decimals", () => {
    expect(formatDistanceKm(1234)).toBe("1.23 km");
  });
});

describe("buildPickerResult", () => {
  it("builds a Point feature with a coords measurement string", () => {
    const result = buildPickerResult({ lat: 24.062, lon: 82.671 }, "abc123");
    expect(result.type).toBe("marker");
    expect(result.id).toBe("marker-abc123");
    expect(result.measurement).toBe("Coords: 24.0620°, 82.6710°");
    expect(result.geojson.geometry).toEqual({ type: "Point", coordinates: [82.671, 24.062] });
  });
});

describe("buildRectangleResult", () => {
  it("builds a closed 5-point Polygon feature covering the two corners", () => {
    const result = buildRectangleResult({ lat: 10, lon: 20 }, { lat: 12, lon: 22 }, "r1");
    expect(result.type).toBe("rectangle");
    expect(result.geojson.geometry.type).toBe("Polygon");
    if (result.geojson.geometry.type !== "Polygon") throw new Error("expected Polygon geometry");
    const ring = result.geojson.geometry.coordinates[0];
    expect(ring).toHaveLength(5);
    expect(ring[0]).toEqual(ring[4]);
  });
});

describe("buildCircleResult", () => {
  it("builds a Point feature carrying the radius and area in properties", () => {
    const result = buildCircleResult({ lat: 1, lon: 2 }, 5000, "c1");
    expect(result.type).toBe("circle");
    expect(result.geojson.properties.radius_meters).toBe(5000);
    expect(result.measurement).toContain("Rad: 5.00 km");
  });
});

describe("buildPolylineResult", () => {
  it("builds a LineString feature and reports total distance", () => {
    const coords = [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 1 },
      { lat: 1, lon: 1 },
    ];
    const result = buildPolylineResult(coords, 15000, "p1");
    expect(result.type).toBe("polyline");
    expect(result.geojson.geometry.type).toBe("LineString");
    if (result.geojson.geometry.type !== "LineString") throw new Error("expected LineString geometry");
    expect(result.geojson.geometry.coordinates).toHaveLength(3);
    expect(result.measurement).toBe("Distance: 15.00 km");
  });

  it("supports the distance-tool alias type", () => {
    const result = buildPolylineResult([{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }], 1000, "p2", "distance");
    expect(result.type).toBe("distance");
  });
});

describe("buildPolygonResult", () => {
  it("builds a closed Polygon feature and reports area", () => {
    const coords = [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0.01 },
      { lat: 0.01, lon: 0.01 },
      { lat: 0.01, lon: 0 },
    ];
    const result = buildPolygonResult(coords, "poly1");
    expect(result.type).toBe("polygon");
    if (result.geojson.geometry.type !== "Polygon") throw new Error("expected Polygon geometry");
    const ring = result.geojson.geometry.coordinates[0];
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    expect(result.geojson.properties.area_km2).toBeGreaterThan(0);
  });

  it("supports the area-tool alias type", () => {
    const coords = [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0.01 },
      { lat: 0.01, lon: 0 },
    ];
    const result = buildPolygonResult(coords, "poly2", "area");
    expect(result.type).toBe("area");
  });
});
