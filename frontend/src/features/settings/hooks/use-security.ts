"use client";

import { settingsApi } from "@/features/settings/api/settings-api";
import { tokens } from "@/lib/auth-tokens";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useChangePassword() {
  return useMutation({ mutationFn: settingsApi.changePassword });
}

export function useDeleteAccount() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.deleteAccount,
    onSuccess: () => {
      tokens.clear();
      qc.clear();
      router.push("/login");
    },
  });
}
