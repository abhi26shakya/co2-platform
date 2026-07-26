import { describe, expect, it } from "vitest";
import { basemapsForMode, isBasemapSupported, BASEMAPS, DEFAULT_2D_BASEMAP } from "./basemap-catalog";

describe("basemapsForMode", () => {
  it("excludes Terrain 3D in 2d mode", () => {
    const ids = basemapsForMode("2d").map((b) => b.id);
    expect(ids).not.toContain("terrain");
    expect(ids).toEqual(["dark", "satellite", "hybrid", "osm"]);
  });

  it("includes every basemap in 3d mode", () => {
    expect(basemapsForMode("3d")).toHaveLength(BASEMAPS.length);
  });
});

describe("isBasemapSupported", () => {
  it("rejects terrain in 2d mode", () => {
    expect(isBasemapSupported("terrain", "2d")).toBe(false);
  });

  it("accepts terrain in 3d mode", () => {
    expect(isBasemapSupported("terrain", "3d")).toBe(true);
  });

  it("accepts a shared basemap in either mode", () => {
    expect(isBasemapSupported("satellite", "2d")).toBe(true);
    expect(isBasemapSupported("satellite", "3d")).toBe(true);
  });

  it("DEFAULT_2D_BASEMAP is itself supported in 2d mode", () => {
    expect(isBasemapSupported(DEFAULT_2D_BASEMAP, "2d")).toBe(true);
  });
});
