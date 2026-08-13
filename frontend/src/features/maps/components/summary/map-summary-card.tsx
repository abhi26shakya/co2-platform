"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { AnalyticsOut } from "@/types/geo";

interface Props {
  analytics: AnalyticsOut | undefined;
  sourceCount: number;
  periodLabel: string;
}

function formatTonnes(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

/** Bottom-left floating stats card — structurally modeled on Climate TRACE's "61B t CO2e / N
 *  sources" summary chip, but every figure here is a live aggregate of this user's own completed
 *  predictions (via GET /analytics), not a global registry total — this platform has no public
 *  facility inventory to summarize the way Climate TRACE's does. Shows an honest empty state
 *  instead of a fabricated number when there's no prediction history yet. */
export function MapSummaryCard({ analytics, sourceCount, periodLabel }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [granularity, setGranularity] = useState<"monthly" | "annual">("monthly");

  const timeseries = useMemo(() => analytics?.timeseries ?? [], [analytics]);
  const totalEmission = useMemo(() => timeseries.reduce((sum, t) => sum + t.total_emission, 0), [timeseries]);

  const annual = useMemo(() => {
    const byYear = new Map<string, number>();
    for (const t of timeseries) {
      const year = t.month.slice(0, 4);
      byYear.set(year, (byYear.get(year) ?? 0) + t.total_emission);
    }
    return Array.from(byYear.entries()).map(([month, total_emission]) => ({ month, total_emission }));
  }, [timeseries]);

  const chartData = granularity === "monthly" ? timeseries : annual;
  const hasData = totalEmission > 0;

  return (
    <div className="absolute bottom-4 left-4 z-10 w-72 max-w-[calc(100%-2rem)] overflow-hidden rounded-xl bg-white text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)] animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="p-3.5 space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">{periodLabel}: My Predictions</div>

        {hasData ? (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-zinc-900" style={{ fontFamily: "var(--font-display)" }}>
                {formatTonnes(totalEmission)}
              </span>
              <span className="text-sm text-zinc-500">t CO₂e</span>
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              {sourceCount} facilities · {analytics?.total_predictions ?? 0} predictions
            </div>
          </>
        ) : (
          <p className="text-xs text-zinc-500 py-1">
            No completed predictions yet — run one from Upload to populate this view.
          </p>
        )}

        {chartData.length > 0 && (
          <>
            <div className="flex items-center gap-1 pt-1">
              {(["monthly", "annual"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  className={`px-2 py-0.5 rounded text-[9px] uppercase font-semibold tracking-wide cursor-pointer ${
                    granularity === g ? "bg-zinc-900/10 text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="h-14 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="#a1a1aa" fontSize={7} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", fontSize: 9 }}
                    labelStyle={{ color: "#52525b" }}
                    formatter={(value: number) => [`${formatTonnes(value)} t`, "Total emission"]}
                  />
                  <Bar dataKey="total_emission" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {expanded && analytics && (
        <div className="border-t border-zinc-200 p-3.5 space-y-1.5 text-[11px] animate-in fade-in duration-150">
          <div className="flex justify-between">
            <span className="text-zinc-500">Max single prediction</span>
            <span className="font-mono text-zinc-900">{analytics.max_emission != null ? `${analytics.max_emission} t/yr` : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Avg confidence</span>
            <span className="font-mono text-zinc-900">{analytics.avg_confidence != null ? `${analytics.avg_confidence}%` : "—"}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1 py-1.5 bg-zinc-50 text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 cursor-pointer border-t border-zinc-200"
      >
        More Details {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
    </div>
  );
}
