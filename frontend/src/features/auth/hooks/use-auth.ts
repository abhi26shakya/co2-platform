"use client";

import { api } from "@/services/api-client";
import { tokens } from "@/lib/auth-tokens";
import type { LoginResult, TokenPair, UserRead } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<UserRead>("/auth/me"),
    enabled: typeof window !== "undefined" && !!tokens.access,
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<LoginResult>("/auth/login", data),
    onSuccess: (result) => {
      if (result.mfa_required) return; // caller shows the 2FA step instead
      tokens.set({ access_token: result.access_token!, refresh_token: result.refresh_token! });
      qc.invalidateQueries({ queryKey: ["me"] });
      router.push("/dashboard");
    },
  });
}

export function useVerify2FALogin() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { mfa_token: string; code: string }) =>
      api.post<TokenPair>("/auth/2fa/verify", data),
    onSuccess: (pair) => {
      tokens.set(pair);
      qc.invalidateQueries({ queryKey: ["me"] });
      router.push("/dashboard");
    },
  });
}

export function useSignup() {
  const login = useLogin();
  return useMutation({
    mutationFn: async (data: { email: string; password: string; full_name: string }) => {
      await api.post("/auth/signup", data);
      return data;
    },
    onSuccess: (data) => login.mutate({ email: data.email, password: data.password }),
  });
}

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const refresh = tokens.refresh;
      if (refresh) await api.post("/auth/logout", { refresh_token: refresh });
    },
    onSettled: () => {
      tokens.clear();
      qc.clear();
      router.push("/login");
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { full_name: string }) =>
      api.patch<UserRead>("/auth/me", data),
    onSuccess: (updatedUser) => {
      qc.setQueryData(["me"], updatedUser);
    },
  });
}
