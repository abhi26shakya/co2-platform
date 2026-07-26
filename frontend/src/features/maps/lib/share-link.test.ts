import { describe, expect, it } from "vitest";
import { buildShareLink } from "./share-link";

describe("buildShareLink", () => {
  it("encodes the actual camera position, not a fixed placeholder", () => {
    const link = buildShareLink({
      camera: { lat: 12.3456, lon: 98.7654, zoom: 6.5 },
      mapMode: "3d",
      basemap: "dark",
      activeGasKeys: ["co2"],
    });
    expect(link).toContain("lat=12.3456");
    expect(link).toContain("lon=98.7654");
    expect(link).toContain("zoom=6.5");
  });

  it("includes the current map mode", () => {
    const link = buildShareLink({
      camera: { lat: 0, lon: 0, zoom: 1 },
      mapMode: "2d",
      basemap: "dark",
      activeGasKeys: [],
    });
    expect(link).toContain("mode=2d");
  });

  it("includes the basemap and a comma-joined gas list", () => {
    const link = buildShareLink({
      camera: { lat: 0, lon: 0, zoom: 1 },
      mapMode: "3d",
      basemap: "satellite",
      activeGasKeys: ["co2", "ch4"],
    });
    expect(link).toContain("basemap=satellite");
    expect(link).toContain("gases=co2,ch4");
  });

  it("still produces a valid gases param when no gas layer is enabled", () => {
    const link = buildShareLink({
      camera: { lat: 0, lon: 0, zoom: 1 },
      mapMode: "3d",
      basemap: "dark",
      activeGasKeys: [],
    });
    expect(link).toContain("gases=");
    expect(link.endsWith("gases=")).toBe(true);
  });
});
