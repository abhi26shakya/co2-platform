"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useLogin } from "@/hooks/use-auth";

export default function LoginPage() {
  const login = useLogin();
  return (
    <AuthForm
      mode="login"
      pending={login.isPending}
      error={login.error}
      onSubmit={({ email, password }) => login.mutate({ email, password })}
    />
  );
}
