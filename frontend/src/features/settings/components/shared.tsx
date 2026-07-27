"use client";

import { cn } from "@/lib/utils";
import { ApiError } from "@/services/api-client";
import { CheckCircle, XCircle } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";

export function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-sensor/50",
        checked ? "bg-sensor" : "bg-ground-700",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-ground-950 shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export function Banner({ message, isError }: { message: string; isError: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-4",
        isError ? "border-alert/20 bg-alert/5 text-alert" : "border-sensor/20 bg-sensor/5 text-sensor"
      )}
    >
      {isError ? <XCircle className="h-4 w-4 shrink-0" /> : <CheckCircle className="h-4 w-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
  maxWidthClass = "max-w-md",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ground-950/80 backdrop-blur-sm animate-in fade-in-50">
      <div className={cn("w-full rounded-xl border border-ground-700 bg-ground-900 p-6 space-y-6", maxWidthClass)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-instrument">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-ground-400 hover:text-instrument cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function errorMessageFor(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (err instanceof ApiError) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

export function useBanner() {
  const [banner, setBanner] = useState<{ message: string; isError: boolean } | null>(null);

  const notify = useCallback((message: string, isError = false) => {
    setBanner({ message, isError });
    window.setTimeout(() => setBanner((cur) => (cur?.message === message ? null : cur)), 5000);
  }, []);

  return { banner, notify };
}
