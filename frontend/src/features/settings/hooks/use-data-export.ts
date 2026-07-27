"use client";

import { settingsApi } from "@/features/settings/api/settings-api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useExportData() {
  return useMutation({
    mutationFn: async () => {
      const data = await settingsApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `emissia-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return data;
    },
  });
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ["settings", "system-status"],
    queryFn: settingsApi.systemStatus,
    staleTime: 60_000,
  });
}
