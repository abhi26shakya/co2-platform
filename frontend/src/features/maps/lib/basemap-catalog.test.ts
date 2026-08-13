import { describe, expect, it } from "vitest";
import { basemapsForMode, isBasemapSupported, BASEMAPS, DEFAULT_2D_BASEMAP } from "./basemap-catalog";

describe("basemapsForMode", () => {
  it("includes every basemap in 2d mode", () => {
    const ids = basemapsForMode("2d").map((b) => b.id);
    expect(ids).toEqual(["light", "dark", "satellite", "hybrid", "osm"]);
  });

  it("includes every basemap in 3d mode", () => {
    expect(basemapsForMode("3d")).toHaveLength(BASEMAPS.length);
  });
});

describe("isBasemapSupported", () => {
  it("rejects an unknown basemap id", () => {
    expect(isBasemapSupported("nonexistent", "2d")).toBe(false);
    expect(isBasemapSupported("nonexistent", "3d")).toBe(false);
  });

  it("accepts a shared basemap in either mode", () => {
    expect(isBasemapSupported("satellite", "2d")).toBe(true);
    expect(isBasemapSupported("satellite", "3d")).toBe(true);
  });

  it("DEFAULT_2D_BASEMAP is itself supported in 2d mode", () => {
    expect(isBasemapSupported(DEFAULT_2D_BASEMAP, "2d")).toBe(true);
  });
});
