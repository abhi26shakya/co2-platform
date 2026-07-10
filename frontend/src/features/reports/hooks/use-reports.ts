"use client";

import { api } from "@/services/api-client";
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
    mutationFn: (data: Partial<ReportOut>) => api.post<ReportOut>("/reports", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ReportOut> }) =>
      api.patch<ReportOut>(`/reports/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/reports/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => api.get<MLModelOut[]>("/models"),
  });
}
