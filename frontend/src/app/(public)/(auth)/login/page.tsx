"use client";

import { AuthForm } from "@/features/auth/components/auth/auth-form";
import { useLogin } from "@/features/auth/hooks/use-auth";

export default function LoginPage() {
  const login = useLogin();
  return (
    <AuthForm
      mode="login"
      pending={login.isPending}
      error={login.error}
      onSubmit={({ email, password }: { email: string; password: string; full_name?: string }) => login.mutate({ email, password })}
    />
  );
}
