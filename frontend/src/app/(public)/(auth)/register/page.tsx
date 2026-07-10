"use client";

import { AuthForm } from "@/features/auth/components/auth/auth-form";
import { useSignup } from "@/features/auth/hooks/use-auth";

export default function SignupPage() {
  const signup = useSignup();
  return (
    <AuthForm
      mode="signup"
      pending={signup.isPending}
      error={signup.error}
      onSubmit={(values: { email: string; password: string; full_name: string }) => signup.mutate(values)}
    />
  );
}
