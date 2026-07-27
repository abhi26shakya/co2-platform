"use client";

import { settingsApi } from "@/features/settings/api/settings-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfileDetails() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: (user) => qc.setQueryData(["me"], user),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => settingsApi.uploadAvatar(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useDeleteAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.deleteAvatar,
    onSuccess: (user) => qc.setQueryData(["me"], user),
  });
}
