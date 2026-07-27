"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthForm } from "@/features/auth/components/auth/auth-form";
import { useLogin, useVerify2FALogin } from "@/features/auth/hooks/use-auth";
import { ApiError } from "@/services/api-client";
import { useState } from "react";

function TwoFactorStep({ mfaToken }: { mfaToken: string }) {
  const verify = useVerify2FALogin();
  const [code, setCode] = useState("");

  const message =
    verify.error instanceof ApiError
      ? verify.error.message || "Invalid verification code."
      : verify.error
        ? "Invalid verification code."
        : null;

  return (
    <div className="w-full max-w-sm">
      <p className="readout mb-2 text-xs uppercase tracking-[0.3em] text-ground-400">Emissia</p>
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        Two-factor verification
      </h1>
      <p className="mb-8 mt-1 text-sm text-ground-400">
        Enter the 6-digit code from your authenticator app, or one of your backup codes.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="code">Verification code</Label>
          <Input
            id="code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verify.mutate({ mfa_token: mfaToken, code: code.trim() })}
          />
        </div>
        {message && <p className="text-sm text-alert">{message}</p>}
        <Button
          className="w-full"
          disabled={verify.isPending || !code.trim()}
          onClick={() => verify.mutate({ mfa_token: mfaToken, code: code.trim() })}
        >
          {verify.isPending ? "Verifying…" : "Verify"}
        </Button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const login = useLogin();

  if (login.data?.mfa_required && login.data.mfa_token) {
    return <TwoFactorStep mfaToken={login.data.mfa_token} />;
  }

  return (
    <AuthForm
      mode="login"
      pending={login.isPending}
      error={login.error}
      onSubmit={({ email, password }: { email: string; password: string; full_name?: string }) =>
        login.mutate({ email, password })
      }
    />
  );
}
