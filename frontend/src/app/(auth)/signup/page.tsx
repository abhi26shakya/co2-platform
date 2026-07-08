"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useSignup } from "@/hooks/use-auth";

export default function SignupPage() {
  const signup = useSignup();
  return (
    <AuthForm
      mode="signup"
      pending={signup.isPending}
      error={signup.error}
      onSubmit={(values) => signup.mutate(values)}
    />
  );
}
