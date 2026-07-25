import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/test/query-wrapper";
import { api } from "@/services/api-client";
import { useRunPrediction } from "./use-run-prediction";
import type { PredictionOut } from "@/types/prediction-api";

vi.mock("@/services/api-client", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const mockedPost = vi.mocked(api.post);

beforeEach(() => {
  mockedPost.mockReset();
});

describe("useRunPrediction", () => {
  it("POSTs the image id to /predictions", async () => {
    const response: PredictionOut = {
      id: "pred-1",
      image_id: "img-1",
      status: "completed",
      schema_version: "v1",
      co2_emission_tonnes_per_year: 4760,
      confidence: 94.5,
      hotspots: [],
      inference_time_ms: 320,
      created_at: new Date().toISOString(),
      model_version: "v1.2.0",
      image_filename: "vindhyachal.tif",
    };
    mockedPost.mockResolvedValueOnce(response);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useRunPrediction(), { wrapper: Wrapper });

    act(() => {
      result.current.mutate("img-1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPost).toHaveBeenCalledWith("/predictions", { image_id: "img-1" });
    expect(result.current.data).toEqual(response);
  });

  it("invalidates dashboard and predictions queries on success", async () => {
    mockedPost.mockResolvedValueOnce({} as PredictionOut);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useRunPrediction(), { wrapper: Wrapper });

    act(() => {
      result.current.mutate("img-2");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["dashboard"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["predictions"] });
  });

  it("does not invalidate queries when the request fails", async () => {
    mockedPost.mockRejectedValueOnce(new Error("failed"));

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useRunPrediction(), { wrapper: Wrapper });

    act(() => {
      result.current.mutate("img-3");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
