"use client";

import { api } from "@/lib/api-client";
import type { MLModelOut, ReportOut } from "@/types/report";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => api.get<ReportOut[]>("/reports"),
  });
}

export function useCreateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (format: "pdf" | "csv") => api.post<ReportOut>("/reports", { format }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export function useDeleteReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/reports/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => api.get<MLModelOut[]>("/models"),
  });
}
