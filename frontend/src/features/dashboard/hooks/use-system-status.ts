"use client";

import { api } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

interface SystemStatus {
  api: string;
  ml_service: string;
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ["system-status"],
    queryFn: () => api.get<SystemStatus>("/system/status"),
    refetchInterval: 15_000,
  });
}
