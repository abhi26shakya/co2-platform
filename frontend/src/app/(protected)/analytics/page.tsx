"use client";

import { StatCard } from "@/features/dashboard/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { useAnalytics } from "@/features/maps/hooks/use-geo";
import { tokens } from "@/lib/auth-tokens";
import { Download, Share2 } from "lucide-react";
import { useState } from "react";
import { ShareModal } from "@/components/share/share-modal";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useSettings } from "@/providers/providers/settings-provider";

const PLUME_LO = "#f5a623";
const PLUME_HI = "#e64980";

async function downloadCsv(setBusy: (v: boolean) => void) {
  setBusy(true);
  try {
    const res = await fetch("/api/v1/analytics/export", {
      headers: tokens.access ? { Authorization: `Bearer ${tokens.access}` } : {},
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emissia-predictions.csv";
    a.click();
    URL.revokeObjectURL(url);
  } finally {
    setBusy(false);
  }
}

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();
  const { formatEmission, aiUnits, resolvedTheme } = useSettings();
  const [busy, setBusy] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const hasData = (data?.total_predictions ?? 0) > 0;

  const AXIS = resolvedTheme === "light" ? "#475569" : "#64748b";
  const GRID = resolvedTheme === "light" ? "#cbd5e1" : "#1c2942";
  const tooltipStyle = {
    backgroundColor: resolvedTheme === "light" ? "#ffffff" : "#0b1220",
    border: `1px solid ${resolvedTheme === "light" ? "#cbd5e1" : "#1c2942"}`,
    borderRadius: 8,
    fontSize: 12,
    color: resolvedTheme === "light" ? "#0f172a" : "#e6edf7",
  };

  const formattedPeak = data?.max_emission != null
    ? formatEmission(data.max_emission)
    : { value: "—", unit: "t CO₂ / year" };

  // Map timeseries data points
  const timeseriesData = data?.timeseries.map((item: any) => {
    const formatted = formatEmission(item.avg_emission);
    return {
      ...item,
      avg_emission: parseFloat(formatted.value.replace(/,/g, "")),
    };
  });

  // Map distribution bins
  const distributionData = data?.distribution.map((b: any) => {
    const formattedLo = formatEmission(b.lo);
    const loVal = parseFloat(formattedLo.value.replace(/,/g, ""));
    const label = loVal >= 1000 ? `${(loVal / 1000).toFixed(1)}k` : `${loVal}`;
    return {
      ...b,
      range: label,
    };
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
            Analytics
          </h1>
          <p className="mt-1 text-sm text-ground-400">
            Emission trends and prediction statistics across your scenes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-sensor text-ground-950 px-4 py-2 text-sm font-medium transition-colors hover:bg-sensor/90 cursor-pointer shrink-0"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button
            onClick={() => downloadCsv(setBusy)}
            disabled={!hasData || busy}
            className="flex items-center gap-2 rounded-lg border border-ground-700 bg-ground-800 px-4 py-2 text-sm transition-colors hover:border-ground-400 disabled:opacity-40"
          >
            <Download className="h-4 w-4" aria-hidden />
            {busy ? "Preparing…" : "Download CSV"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total predictions"
          value={String(data?.total_predictions ?? 0)}
          loading={isLoading}
        />
        <StatCard
          label="Peak emission"
          value={formattedPeak.value}
          sublabel={formattedPeak.unit}
          emission
          loading={isLoading}
        />
        <StatCard
          label="Avg confidence"
          value={data?.avg_confidence != null ? `${data.avg_confidence}%` : "—"}
          loading={isLoading}
        />
      </div>

      {!isLoading && !hasData && (
        <Card className="mt-6 p-6">
          <p className="text-sm text-ground-400">
            No predictions yet. Upload scenes and run predictions to populate these charts.
          </p>
        </Card>
      )}

      {hasData && (
        <>
          <Card className="mt-6 p-5">
            <h2 className="text-sm font-medium">Monthly average emissions</h2>
            <p className="readout mt-0.5 text-xs text-ground-400">
              {aiUnits === "kg/day" ? "kg CO₂ / day" : "t CO₂ / year"}
            </p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeseriesData}>
                  <defs>
                    <linearGradient id="plume" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={PLUME_LO} />
                      <stop offset="100%" stopColor={PLUME_HI} />
                    </linearGradient>
                    <linearGradient id="plumeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PLUME_HI} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={PLUME_LO} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke={AXIS} fontSize={11} tickLine={false} />
                  <YAxis stroke={AXIS} fontSize={11} tickLine={false} width={56} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="avg_emission"
                    name={aiUnits === "kg/day" ? "avg kg/day" : "avg t/yr"}
                    stroke="url(#plume)"
                    strokeWidth={2}
                    fill="url(#plumeFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <h2 className="text-sm font-medium">Prediction distribution</h2>
              <p className="readout mt-0.5 text-xs text-ground-400">
                count by emission range ({aiUnits === "kg/day" ? "kg CO₂ / day" : "t CO₂ / year"})
              </p>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="range" stroke={AXIS} fontSize={11} tickLine={false} />
                    <YAxis stroke={AXIS} fontSize={11} tickLine={false} allowDecimals={false} width={32} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#121b2e" }} />
                    <Bar dataKey="count" fill="url(#plume)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-medium">Images by source</h2>
              <ul className="mt-4 space-y-3">
                {data?.sources.map((s: any) => (
                  <li key={s.source} className="flex items-baseline justify-between text-sm">
                    <span className="text-ground-400">{s.source}</span>
                    <span className="readout">{s.count}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        resourceType="analytics"
        resourceId="global-analytics"
        title="Industrial CO₂ Emission Analytics Snapshot"
        metadata={{
          satellite: "Sentinel-5P / OCO-3 / OCO-2",
          acquisitionDate: new Date().toLocaleDateString(),
          resolution: "10m",
        }}
        predictionData={{
          co2Level: data?.max_emission || 3620,
          confidence: 93,
          facilities: data?.total_predictions || 5,
          processingTime: "11.2s",
          hotspots: [],
        }}
      />
    </div>
  );
}
