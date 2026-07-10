"use client";

import { useSystemStatus } from "@/features/dashboard/hooks/use-system-status";
import { cn } from "@/lib/utils";

export function StatusPill() {
  const { data, isLoading, isError } = useSystemStatus();

  const label = isLoading
    ? "Checking systems"
    : isError
      ? "API offline"
      : data?.ml_service === "ok"
        ? "All systems nominal"
        : "API online · ML service offline";

  const healthy = !isLoading && !isError;

  return (
    <div className="flex items-center gap-2 rounded-full border border-ground-700 bg-ground-900/70 px-3 py-1.5 text-xs text-ground-400 backdrop-blur">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isLoading && "animate-pulse bg-ground-400",
          isError && "bg-alert",
          healthy && "bg-sensor"
        )}
      />
      <span className="readout">{label}</span>
    </div>
  );
}
