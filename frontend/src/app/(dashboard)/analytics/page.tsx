"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-geo";
import { tokens } from "@/lib/auth-tokens";
import { Download } from "lucide-react";
import { useState } from "react";
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

const AXIS = "#64748b"; // ground-400
const GRID = "#1c2942"; // ground-700
const PLUME_LO = "#f5a623";
const PLUME_HI = "#e64980";

const tooltipStyle = {
  backgroundColor: "#0b1220",
  border: `1px solid ${GRID}`,
  borderRadius: 8,
  fontSize: 12,
  color: "#e6edf7",
};

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
  const [busy, setBusy] = useState(false);

  const hasData = (data?.total_predictions ?? 0) > 0;

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
        <button
          onClick={() => downloadCsv(setBusy)}
          disabled={!hasData || busy}
          className="flex items-center gap-2 rounded-lg border border-ground-700 bg-ground-800 px-4 py-2 text-sm transition-colors hover:border-ground-400 disabled:opacity-40"
        >
          <Download className="h-4 w-4" aria-hidden />
          {busy ? "Preparing…" : "Download CSV"}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total predictions"
          value={String(data?.total_predictions ?? 0)}
          loading={isLoading}
        />
        <StatCard
          label="Peak emission"
          value={data?.max_emission != null ? data.max_emission.toLocaleString() : "—"}
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
            <p className="readout mt-0.5 text-xs text-ground-400">t CO₂ / year</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.timeseries}>
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
                    name="avg t/yr"
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
                count by emission range (t CO₂ / year)
              </p>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.distribution.map((b) => ({
                      ...b,
                      range: `${Math.round(b.lo / 100) / 10}k`,
                    }))}
                  >
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
                {data?.sources.map((s) => (
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
    </div>
  );
}
