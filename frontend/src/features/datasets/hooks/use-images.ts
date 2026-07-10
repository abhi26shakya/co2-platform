"use client";

import { api } from "@/services/api-client";
import type { ImageListOut } from "@/types/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useImages(params: { search?: string; source?: string; page?: number }) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.source) qs.set("source", params.source);
  qs.set("page", String(params.page ?? 1));
  return useQuery({
    queryKey: ["images", params],
    queryFn: () => api.get<ImageListOut>(`/images?${qs.toString()}`),
    placeholderData: (prev) => prev, // keep table stable while typing
  });
}

export function useDeleteImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/images/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["images"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
