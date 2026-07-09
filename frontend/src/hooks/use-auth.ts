"use client";

import { api } from "@/lib/api-client";
import { tokens } from "@/lib/auth-tokens";
import type { TokenPair, UserRead } from "@/types/auth";
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
      api.post<TokenPair>("/auth/login", data),
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
