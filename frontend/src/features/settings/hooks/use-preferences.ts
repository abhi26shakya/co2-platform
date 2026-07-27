"use client";

import { settingsApi } from "@/features/settings/api/settings-api";
import { tokens } from "@/lib/auth-tokens";
import type { PreferencesOut } from "@/types/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const DEFAULT_PREFERENCES: PreferencesOut = {
  theme: "dark",
  accent_color: "green",
  reduced_motion: false,
  compact_mode: false,
  ai_default_model: "unet-v1",
  heatmap_palette: "viridis",
  confidence_threshold: 0.85,
  prediction_units: "t_per_year",
  auto_run_after_upload: true,
  xai_enabled: false,
  notify_prediction_completed: true,
  notify_upload_finished: true,
  notify_report_generated: true,
  notify_weekly_summary: false,
  notify_announcements: false,
  notify_research_updates: false,
  notify_email_enabled: true,
  notify_browser_enabled: true,
};

export function usePreferences() {
  return useQuery({
    queryKey: ["settings", "preferences"],
    queryFn: settingsApi.getPreferences,
    enabled: typeof window !== "undefined" && !!tokens.access,
    staleTime: 30_000,
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.putPreferences,
    onSuccess: (prefs) => qc.setQueryData(["settings", "preferences"], prefs),
  });
}
