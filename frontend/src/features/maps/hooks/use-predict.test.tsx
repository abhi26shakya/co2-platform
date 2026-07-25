import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/test/query-wrapper";
import { api } from "@/services/api-client";
import { usePredict } from "./use-predict";
import type { PredictionResultV1 } from "@/types/prediction";

vi.mock("@/services/api-client", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const mockedPost = vi.mocked(api.post);

beforeEach(() => {
  mockedPost.mockReset();
});

describe("usePredict", () => {
  it("POSTs the prediction request to /predictions", async () => {
    const response: PredictionResultV1 = {
      schema_version: "v1",
      co2_emission_tonnes_per_year: 4760,
      confidence: 94.5,
      hotspots: [{ lat: 24.1, lon: 82.7, intensity: 0.85, radius_m: 250 }],
      heatmap_url: null,
      model_version: "v1.2.0",
      inference_time_ms: 320,
    };
    mockedPost.mockResolvedValueOnce(response);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => usePredict(), { wrapper: Wrapper });

    act(() => {
      result.current.mutate({ image_id: "img-1" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPost).toHaveBeenCalledWith("/predictions", { image_id: "img-1" });
    expect(result.current.data).toEqual(response);
  });

  it("exposes a mutation error when the request fails", async () => {
    mockedPost.mockRejectedValueOnce(new Error("inference failed"));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => usePredict(), { wrapper: Wrapper });

    act(() => {
      result.current.mutate({ image_id: "img-1" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
