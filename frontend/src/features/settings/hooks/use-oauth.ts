"use client";

import { settingsApi } from "@/features/settings/api/settings-api";
import { tokens } from "@/lib/auth-tokens";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGoogleStatus() {
  return useQuery({
    queryKey: ["settings", "google-status"],
    queryFn: settingsApi.googleStatus,
  });
}

export function useGoogleConnect() {
  return useMutation({
    mutationFn: settingsApi.googleConnect,
    onSuccess: ({ authorize_url }) => {
      // Server-side redirect flow: the browser leaves the app, so tokens must
      // still be present in localStorage when Google bounces back to /settings.
      if (tokens.access) window.location.href = authorize_url;
    },
  });
}

export function useGoogleDisconnect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.googleDisconnect,
    onSuccess: (user) => {
      qc.setQueryData(["me"], user);
      qc.invalidateQueries({ queryKey: ["settings", "google-status"] });
    },
  });
}
