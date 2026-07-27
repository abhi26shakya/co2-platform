"use client";

import { StatCard } from "@/features/dashboard/components/dashboard/stat-card";
import { QuickActions } from "@/features/dashboard/components/dashboard/quick-actions";
import { QuickUpload } from "@/features/dashboard/components/dashboard/quick-upload";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import type { RecentUpload } from "@/types/dashboard";
import { useReports } from "@/features/reports/hooks/use-reports";
import { cn } from "@/lib/utils";
import { useSettings } from "@/providers/providers/settings-provider";
import { useUser } from "@/features/auth/hooks/use-auth";
import { FileText, Clock, Image, Activity, Gauge, Flame, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

function ListRowSkeleton() {
  return (
    <li className="flex items-center justify-between py-2.5">
      <Skeleton className="h-3.5 w-40" />
      <Skeleton className="h-3 w-20" />
    </li>
  );
}

export default function DashboardPage() {
  const { data, isLoading, dataUpdatedAt } = useDashboard();
  const { data: reports = [], isLoading: reportsLoading } = useReports();
  const { data: user } = useUser();
  const { formatEmission } = useSettings();
  const [alertDismissed, setAlertDismissed] = useState(false);

  const lastUpdatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const formattedEmission = data?.avg_emission_tonnes_per_year != null
    ? formatEmission(data.avg_emission_tonnes_per_year)
    : { value: "—", unit: "t CO₂ / year" };

  const recentReports = reports.slice(0, 5);
  const greetingName = user?.full_name?.split(" ")[0] || user?.email;
  const showMlAlert = !isLoading && data?.ml_service_status === "unreachable" && !alertDismissed;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          {greetingName ? `Welcome back, ${greetingName}` : "Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-ground-400">Your emission analysis at a glance.</p>
      </div>

      {showMlAlert && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-alert/30 bg-alert/10 px-4 py-3">
          <div className="flex items-center gap-2.5 text-sm text-alert">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>ML service is unreachable — new predictions may be delayed.</span>
          </div>
          <button
            onClick={() => setAlertDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 text-alert/70 hover:text-alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <QuickActions />

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Processed images"
          value={String(data?.processed_images ?? 0)}
          loading={isLoading}
          icon={Image}
        />
        <StatCard
          label="Total predictions"
          value={String(data?.total_predictions ?? 0)}
          loading={isLoading}
          icon={Activity}
        />
        <StatCard
          label="Avg predicted emissions"
          value={formattedEmission.value}
          sublabel={formattedEmission.unit}
          emission
          loading={isLoading}
          icon={Flame}
        />
        <StatCard
          label="Avg confidence"
          value={data?.avg_confidence != null ? `${data.avg_confidence}%` : "—"}
          loading={isLoading}
          icon={Gauge}
        />
      </div>

      <QuickUpload />

      {/* Main cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

        {/* Recent uploads */}
        <Card className="p-5 md:col-span-2 lg:col-span-2 bg-ground-900/20 border-ground-700/80">
          <h2 className="text-sm font-medium">Recent uploads</h2>
          {isLoading ? (
            <ul className="mt-4 divide-y divide-ground-750">
              {Array.from({ length: 4 }).map((_, i) => (
                <ListRowSkeleton key={i} />
              ))}
            </ul>
          ) : data && data.recent_uploads.length === 0 ? (
            <p className="mt-6 text-sm text-ground-400">
              No images yet. Drop one into Quick upload above to run your first prediction.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ground-750">
              {data?.recent_uploads.map((u: RecentUpload) => (
                <li key={u.id}>
                  <Link
                    href="/datasets"
                    className="flex items-baseline justify-between py-2.5 text-sm text-instrument hover:text-sensor transition-colors"
                  >
                    <span className="truncate pr-4">{u.filename}</span>
                    <span className="readout shrink-0 text-xs text-ground-400">
                      {formatBytes(u.size_bytes)} · {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* System status */}
        <Card className="p-5 bg-ground-900/20 border-ground-700/80">
          <h2 className="text-sm font-medium">System</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ground-400">Model version</dt>
              {isLoading ? (
                <Skeleton className="h-3.5 w-16" />
              ) : (
                <dd className="readout text-instrument">{data?.active_model_version ?? "—"}</dd>
              )}
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ground-400">ML service</dt>
              {isLoading ? (
                <Skeleton className="h-3.5 w-14" />
              ) : (
                <dd className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      data?.ml_service_status === "ok" ? "bg-sensor" : "bg-alert"
                    )}
                  />
                  <span className="readout text-xs text-instrument">
                    {data?.ml_service_status === "ok" ? "online" : "unreachable"}
                  </span>
                </dd>
              )}
            </div>
          </dl>
          {lastUpdatedLabel && (
            <p className="mt-4 border-t border-ground-750 pt-3 text-[10px] text-ground-500">
              Last updated {lastUpdatedLabel}
            </p>
          )}
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="p-5 bg-ground-900/20 border-ground-700/80 space-y-4">
        <div className="flex items-center justify-between border-b border-ground-750 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ground-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-sensor" /> Recent Reports
          </h2>
          <Link href="/reports" className="text-[10px] text-sensor hover:underline font-medium">
            View all
          </Link>
        </div>
        {reportsLoading ? (
          <ul className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListRowSkeleton key={i} />
            ))}
          </ul>
        ) : recentReports.length === 0 ? (
          <div className="flex flex-col items-start gap-3 py-2">
            <p className="text-xs text-ground-500">No reports generated yet. Generate one from the Reports library.</p>
            <Link href="/reports">
              <Button size="sm" variant="secondary">
                <FileText className="h-3.5 w-3.5" /> Generate a report
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentReports.map((r) => (
              <li key={r.id} className="text-xs flex items-center justify-between hover:bg-ground-850/20 p-1.5 rounded transition-all">
                <Link href="/reports" className="truncate text-instrument font-medium hover:text-sensor flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-ground-400" />
                  <span className="truncate">{r.title}</span>
                </Link>
                <span className="text-[10px] text-ground-500 font-mono shrink-0">
                  {r.format.toUpperCase()} · {new Date(r.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
