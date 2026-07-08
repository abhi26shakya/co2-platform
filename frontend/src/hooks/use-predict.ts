"use client";

import { api } from "@/lib/api-client";
import type { PredictionRequest, PredictionResultV1 } from "@/types/prediction";
import { useMutation } from "@tanstack/react-query";

export function usePredict() {
  return useMutation({
    mutationFn: (req: PredictionRequest) =>
      api.post<PredictionResultV1>("/predictions", req),
  });
}
