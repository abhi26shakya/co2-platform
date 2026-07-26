import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMapExport, type MapExportData } from "./use-map-export";

const baseData: MapExportData = {
  activeBasemap: "dark",
  activeGasKeys: ["co2"],
  plants: [{ name: "Vindhyachal", lat: 24.06, lon: 82.67, sector: "Power Combustion", latest_prediction: "45.00 ppm" }],
  hotspots: [{ lat: 24.1, lon: 82.7, emission_tonnes_per_year: 4760 }],
  inspectedFacilityName: null,
};

describe("useMapExport", () => {
  it("starts idle with no active format and empty history", () => {
    const { result } = renderHook(() => useMapExport(() => baseData));
    expect(result.current.activeFormat).toBeNull();
    expect(result.current.progress).toBe(0);
    expect(result.current.history).toEqual([]);
  });

  it("runs a json export to completion, records history, and downloads a blob", async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const { result } = renderHook(() => useMapExport(() => baseData));

    act(() => result.current.triggerExport("json"));
    expect(result.current.activeFormat).toBe("json");

    await waitFor(() => expect(result.current.activeFormat).toBeNull(), { timeout: 2000 });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toMatchObject({ format: "JSON", status: "Successful" });
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it("ignores a second trigger while an export is already in progress", async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const { result } = renderHook(() => useMapExport(() => baseData));

    act(() => result.current.triggerExport("csv"));
    act(() => result.current.triggerExport("geojson"));
    expect(result.current.activeFormat).toBe("csv");

    await waitFor(() => expect(result.current.activeFormat).toBeNull(), { timeout: 2000 });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].format).toBe("CSV");
    clickSpy.mockRestore();
  });
});
