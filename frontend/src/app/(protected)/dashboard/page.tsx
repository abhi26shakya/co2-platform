"use client";

import { StatCard } from "@/features/dashboard/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { useReports } from "@/features/reports/hooks/use-reports";
import { cn } from "@/lib/utils";
import { useSettings } from "@/providers/providers/settings-provider";
import { FileText, Star, Download, Clock } from "lucide-react";
import Link from "next/link";
import type { ReportOut } from "@/types/report";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { data: reports = [] } = useReports();
  const { formatEmission } = useSettings();

  const formattedEmission = data?.avg_emission_tonnes_per_year != null
    ? formatEmission(data.avg_emission_tonnes_per_year)
    : { value: "—", unit: "t CO₂ / year" };

  // Filter reports categories
  const activeReports = reports.filter((r: ReportOut) => !r.is_deleted);
  const pinnedReports = activeReports.filter((r: ReportOut) => r.is_favorite).slice(0, 3);
  const recentReports = activeReports.slice(0, 3);
  const downloadedReports = activeReports
    .filter((r: ReportOut) => (r.downloads_count || 0) > 0)
    .sort((a: ReportOut, b: ReportOut) => (b.downloads_count || 0) - (a.downloads_count || 0))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-ground-400">Your emission analysis at a glance.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          value={formattedEmission.value}
          sublabel={formattedEmission.unit}
          emission
          loading={isLoading}
        />
        <StatCard
          label="Avg confidence"
          value={data?.avg_confidence != null ? `${data.avg_confidence}%` : "—"}
          loading={isLoading}
        />
      </div>

      {/* Main cards grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        
        {/* Recent uploads */}
        <Card className="p-5 lg:col-span-2 bg-ground-900/20 border-ground-700/80">
          <h2 className="text-sm font-medium">Recent uploads</h2>
          {data && data.recent_uploads.length === 0 ? (
            <p className="mt-6 text-sm text-ground-400">
              No images yet. Upload your first satellite scene to run a prediction.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ground-750">
              {data?.recent_uploads.map((u: any) => (
                <li key={u.id} className="flex items-baseline justify-between py-2.5 text-sm text-instrument">
                  <span className="truncate pr-4">{u.filename}</span>
                  <span className="readout shrink-0 text-xs text-ground-400">
                    {formatBytes(u.size_bytes)} · {new Date(u.created_at).toLocaleDateString()}
                  </span>
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
              <dd className="readout text-instrument">{data?.active_model_version ?? "—"}</dd>
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
                <span className="readout text-xs text-instrument">
                  {data?.ml_service_status === "ok" ? "online" : "unreachable"}
                </span>
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Reports management widgets section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Pinned / Pinned Reports */}
        <Card className="p-5 bg-ground-900/20 border-ground-700/80 space-y-4">
          <div className="flex items-center justify-between border-b border-ground-750 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ground-400 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-current" /> Pinned Reports
            </h2>
            <Link href="/reports?tab=favorites" className="text-[10px] text-sensor hover:underline font-medium">
              View all
            </Link>
          </div>
          {pinnedReports.length === 0 ? (
            <p className="text-xs text-ground-500 py-4">No pinned reports. Click the star icon on any report card to pin it here.</p>
          ) : (
            <ul className="space-y-3">
              {pinnedReports.map((r: ReportOut) => (
                <li key={r.id} className="text-xs flex items-center justify-between hover:bg-ground-850/20 p-1.5 rounded transition-all">
                  <Link href="/reports" className="truncate text-instrument font-medium hover:text-sensor flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-ground-400" />
                    <span className="truncate">{r.title}</span>
                  </Link>
                  <span className="text-[10px] text-ground-500 font-mono shrink-0">{r.format.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

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
          {recentReports.length === 0 ? (
            <p className="text-xs text-ground-500 py-4">No reports generated yet. Reports appear automatically after predicting emissions.</p>
          ) : (
            <ul className="space-y-3">
              {recentReports.map((r: ReportOut) => (
                <li key={r.id} className="text-xs flex items-center justify-between hover:bg-ground-850/20 p-1.5 rounded transition-all">
                  <Link href="/reports" className="truncate text-instrument font-medium hover:text-sensor flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-ground-400" />
                    <span className="truncate">{r.title}</span>
                  </Link>
                  <span className="text-[10px] text-ground-550 shrink-0">
                    {new Date(r.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recently Downloaded */}
        <Card className="p-5 bg-ground-900/20 border-ground-700/80 space-y-4">
          <div className="flex items-center justify-between border-b border-ground-750 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ground-400 flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-ground-300" /> Recently Downloaded
            </h2>
            <Link href="/reports" className="text-[10px] text-sensor hover:underline font-medium">
              View all
            </Link>
          </div>
          {downloadedReports.length === 0 ? (
            <p className="text-xs text-ground-500 py-4">No downloads recorded. Download PDF/CSV outputs from the Reports library.</p>
          ) : (
            <ul className="space-y-3">
              {downloadedReports.map((r: ReportOut) => (
                <li key={r.id} className="text-xs flex items-center justify-between hover:bg-ground-850/20 p-1.5 rounded transition-all">
                  <Link href="/reports" className="truncate text-instrument font-medium hover:text-sensor flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-ground-400" />
                    <span className="truncate">{r.title}</span>
                  </Link>
                  <span className="text-[10px] text-ground-400 font-mono shrink-0 flex items-center gap-0.5">
                    {r.downloads_count} <Download className="h-2.5 w-2.5" />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
