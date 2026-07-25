import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/test/query-wrapper";
import { api } from "@/services/api-client";
import { usePlants, useHotspots, useAnalytics } from "./use-geo";

vi.mock("@/services/api-client", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const mockedGet = vi.mocked(api.get);

beforeEach(() => {
  mockedGet.mockReset();
});

describe("usePlants", () => {
  it("fetches plants from /map/plants", async () => {
    const plants = [{ id: "plant-1", name: "Vindhyachal", lat: 24.1, lon: 82.7 }];
    mockedGet.mockResolvedValueOnce(plants);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => usePlants(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledWith("/map/plants");
    expect(result.current.data).toEqual(plants);
  });
});

describe("useHotspots", () => {
  it("fetches hotspots from /map/hotspots", async () => {
    const hotspots = [{ lat: 24.1, lon: 82.7, intensity: 0.8, radius_m: 250 }];
    mockedGet.mockResolvedValueOnce(hotspots);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useHotspots(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledWith("/map/hotspots");
    expect(result.current.data).toEqual(hotspots);
  });

  it("surfaces a fetch failure as an error state", async () => {
    mockedGet.mockRejectedValueOnce(new Error("network down"));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useHotspots(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useAnalytics", () => {
  it("fetches analytics from /analytics", async () => {
    const analytics = {
      timeseries: [],
      distribution: [],
      sources: [],
      total_predictions: 0,
      max_emission: null,
      avg_confidence: null,
    };
    mockedGet.mockResolvedValueOnce(analytics);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useAnalytics(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledWith("/analytics");
    expect(result.current.data).toEqual(analytics);
  });
});
