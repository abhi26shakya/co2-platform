"use client";

import { api } from "@/lib/api-client";
import type { DashboardStats } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<DashboardStats>("/dashboard"),
    refetchInterval: 30_000,
  });
}
