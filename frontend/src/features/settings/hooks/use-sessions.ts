"use client";

import { settingsApi } from "@/features/settings/api/settings-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSessions() {
  return useQuery({
    queryKey: ["settings", "sessions"],
    queryFn: settingsApi.listSessions,
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.revokeSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "sessions"] }),
  });
}

export function useRevokeOtherSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.revokeOtherSessions,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "sessions"] }),
  });
}
