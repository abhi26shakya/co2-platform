"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-ground-400">Your emission analysis at a glance.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Processed images"
          value={String(data?.processed_images ?? 0)}
          loading={isLoading}
        />
        <StatCard
          label="Total predictions"
          value={String(data?.total_predictions ?? 0)}
          loading={isLoading}
        />
        <StatCard
          label="Avg predicted emissions"
          value={
            data?.avg_emission_tonnes_per_year != null
              ? data.avg_emission_tonnes_per_year.toLocaleString()
              : "—"
          }
          sublabel="t CO₂ / year"
          emission
          loading={isLoading}
        />
        <StatCard
          label="Avg confidence"
          value={data?.avg_confidence != null ? `${data.avg_confidence}%` : "—"}
          loading={isLoading}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-sm font-medium">Recent uploads</h2>
          {data && data.recent_uploads.length === 0 ? (
            <p className="mt-6 text-sm text-ground-400">
              No images yet. Upload your first satellite scene to run a prediction.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ground-700">
              {data?.recent_uploads.map((u) => (
                <li key={u.id} className="flex items-baseline justify-between py-2.5 text-sm">
                  <span className="truncate pr-4">{u.filename}</span>
                  <span className="readout shrink-0 text-xs text-ground-400">
                    {formatBytes(u.size_bytes)} · {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium">System</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ground-400">Model version</dt>
              <dd className="readout">{data?.active_model_version ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ground-400">ML service</dt>
              <dd className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    data?.ml_service_status === "ok" ? "bg-sensor" : "bg-alert"
                  )}
                />
                <span className="readout text-xs">
                  {data?.ml_service_status === "ok" ? "online" : "unreachable"}
                </span>
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
