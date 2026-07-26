import { describe, expect, it } from "vitest";
import { isModeSupported, visualizationModesForMode } from "./visualization-mode-catalog";

describe("visualizationModesForMode", () => {
  it("excludes volume3d in 2d mode", () => {
    const ids = visualizationModesForMode("2d").map((m) => m.id);
    expect(ids).not.toContain("volume3d");
    expect(ids).toEqual(["heatmap", "contours"]);
  });

  it("includes every mode in 3d mode", () => {
    const ids = visualizationModesForMode("3d").map((m) => m.id);
    expect(ids).toEqual(["volume3d", "heatmap", "contours"]);
  });
});

describe("isModeSupported", () => {
  it("returns false for volume3d in 2d mode", () => {
    expect(isModeSupported("volume3d", "2d")).toBe(false);
  });

  it("returns true for heatmap in either mode", () => {
    expect(isModeSupported("heatmap", "2d")).toBe(true);
    expect(isModeSupported("heatmap", "3d")).toBe(true);
  });
});
