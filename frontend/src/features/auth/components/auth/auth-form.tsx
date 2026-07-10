"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/services/api-client";
import Link from "next/link";
import { useState } from "react";

interface Props {
  mode: "login" | "signup";
  pending: boolean;
  error: Error | null;
  onSubmit: (values: { email: string; password: string; full_name: string }) => void;
}

export function AuthForm({ mode, pending, error, onSubmit }: Props) {
  const [values, setValues] = useState({ email: "", password: "", full_name: "" });
  const [validationError, setValidationError] = useState<string | null>(null);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    setValues((v) => ({ ...v, [k]: e.target.value }));
  };

  const handleSubmit = () => {
    setValidationError(null);
    const emailTrimmed = values.email.trim();
    const passwordTrimmed = values.password.trim();
    const nameTrimmed = values.full_name.trim();

    if (mode === "signup" && !nameTrimmed) {
      setValidationError("Full name is required.");
      return;
    }
    if (!emailTrimmed) {
      setValidationError("Email address is required.");
      return;
    }
    if (!emailTrimmed.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (!passwordTrimmed) {
      setValidationError("Password is required.");
      return;
    }
    if (passwordTrimmed.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    onSubmit({
      email: emailTrimmed,
      password: passwordTrimmed,
      full_name: nameTrimmed,
    });
  };

  const message =
    error instanceof ApiError && error.status === 401
      ? "Incorrect email or password."
      : error instanceof ApiError && error.status === 409
        ? "That email is already registered."
        : error
          ? "Something went wrong. Try again."
          : null;

  const displayError = validationError || message;

  return (
    <div className="w-full max-w-sm">
      <p className="readout mb-2 text-xs uppercase tracking-[0.3em] text-ground-400">Emissia</p>
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        {mode === "login" ? "Sign in" : "Create your account"}
      </h1>
      <p className="mb-8 mt-1 text-sm text-ground-400">
        {mode === "login"
          ? "Access your emission analyses."
          : "Start predicting CO₂ emissions from satellite imagery."}
      </p>

      <div className="space-y-4">
        {mode === "signup" && (
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              autoComplete="name"
              value={values.full_name}
              onChange={set("full_name")}
            />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={values.password}
            onChange={set("password")}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {mode === "signup" && (
            <p className="mt-1 text-xs text-ground-400">At least 8 characters.</p>
          )}
        </div>

        {displayError && <p className="text-sm text-alert">{displayError}</p>}

        <Button className="w-full" disabled={pending} onClick={handleSubmit}>
          {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </div>

      <p className="mt-6 text-sm text-ground-400">
        {mode === "login" ? (
          <>
            New to Emissia?{" "}
            <Link href="/signup" className="text-instrument underline underline-offset-4">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/login" className="text-instrument underline underline-offset-4">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
