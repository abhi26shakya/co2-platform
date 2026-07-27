"use client";

import { settingsApi } from "@/features/settings/api/settings-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetup2FA() {
  return useMutation({ mutationFn: settingsApi.setup2FA });
}

export function useEnable2FA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => settingsApi.enable2FA(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useDisable2FA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.disable2FA,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}
