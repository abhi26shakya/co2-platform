"use client";

import { api } from "@/lib/api-client";
import type { PredictionOut } from "@/types/prediction-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRunPrediction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) =>
      api.post<PredictionOut>("/predictions", { image_id: imageId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
}
