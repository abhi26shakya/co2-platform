"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Cpu, FileText, Info, TrendingUp, X } from "lucide-react";
import type { HistoricalPoint } from "@/features/maps/lib/enrich-plants";

export interface InspectedFacility {
  name: string;
  industry?: string;
  sector?: string;
  company?: string;
  country?: string;
  lat?: number | null;
  lon?: number | null;
  latest_prediction?: string;
  confidence?: string;
  predicted_gases?: string[];
  trend?: string;
  historical?: HistoricalPoint[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  facility: InspectedFacility | null;
  timelinePeriod: string;
  sliderIndex: number;
}

export function InspectorDrawer({ open, onClose, facility, timelinePeriod, sliderIndex }: Props) {
  const [copilotNote, setCopilotNote] = useState<string | null>(null);
  const [datasetNote, setDatasetNote] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-ground-950/60 backdrop-blur-sm" onClick={onClose} />
      <Card className="glass-strong relative w-full max-w-md h-full rounded-none overflow-y-auto p-5 space-y-4 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-ground-750 pb-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" /> Industrial Facility Inspector
          </h3>
          <button onClick={onClose} className="text-ground-400 hover:text-instrument cursor-pointer" title="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {facility ? (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="text-sm font-semibold text-sensor">{facility.name}</h4>
              <span className="text-[10px] text-ground-500">
                {facility.industry || facility.sector || "Energy Production"} &middot; {facility.company || "n/a"}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-[11px] border-t border-ground-800 pt-3">
              <div>
                <dt className="text-ground-400">Coordinates:</dt>
                <dd className="font-mono text-instrument mt-0.5">
                  {facility.lat != null ? facility.lat.toFixed(4) : "—"}, {facility.lon != null ? facility.lon.toFixed(4) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-ground-400">Country:</dt>
                <dd className="text-instrument mt-0.5">{facility.country || "India"}</dd>
              </div>
              <div>
                <dt className="text-ground-400">Latest Prediction:</dt>
                <dd className="font-mono text-sensor font-bold mt-0.5">{facility.latest_prediction}</dd>
              </div>
              <div>
                <dt className="text-ground-400">AI Confidence:</dt>
                <dd className="font-mono text-instrument mt-0.5">{facility.confidence || "91%"}</dd>
              </div>
              <div>
                <dt className="text-ground-400">Predicted Gases:</dt>
                <dd className="text-instrument mt-0.5 flex flex-wrap gap-1">
                  {(facility.predicted_gases || ["CO₂", "NO₂"]).map((g) => (
                    <span key={g} className="px-1 py-0.5 bg-ground-850 rounded text-[9px] font-mono">
                      {g}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-ground-400">Trend Status:</dt>
                <dd className="font-mono text-instrument mt-0.5 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-red-400" />
                  <span>{facility.trend || "+2.4% (increasing)"}</span>
                </dd>
              </div>
            </dl>

            <div className="border-t border-ground-800 pt-3 space-y-2">
              <span className="text-[10px] uppercase font-bold text-ground-450 tracking-wider">
                Emission Trend ({timelinePeriod})
              </span>
              <div className="h-20 w-full bg-ground-950/40 rounded border border-ground-800/60 p-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={facility.historical || []}>
                    <XAxis dataKey="month" stroke="#4b5563" fontSize={7} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: 9 }} labelStyle={{ color: "#a1a1aa" }} />
                    <Bar dataKey="value" fill="#1f2937" radius={[2, 2, 0, 0]}>
                      {(facility.historical || []).map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === sliderIndex ? "#10b981" : "#1f2937"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border-t border-ground-800 pt-3 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-ground-450 tracking-wider">Historical Values Detail</span>
              <div className="divide-y divide-ground-850 bg-ground-950/20 rounded border border-ground-800/60 font-mono text-[10px] max-h-24 overflow-y-auto">
                {(facility.historical || []).map((item, i) => (
                  <div key={i} className={`flex justify-between p-2 ${i === sliderIndex ? "bg-sensor/5 border-l-2 border-sensor" : ""}`}>
                    <span className={i === sliderIndex ? "text-sensor font-bold" : "text-ground-400"}>{item.month}</span>
                    <span className={i === sliderIndex ? "text-sensor font-bold" : "text-instrument font-semibold"}>
                      {item.value.toFixed(2)} ppm
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/reports"
                className="px-3 py-2 bg-ground-800 hover:bg-ground-750 text-[10px] font-semibold text-instrument rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="h-3 w-3" /> View Report
              </Link>
              <button
                onClick={() => setDatasetNote("Redirecting to raw datasets archives...")}
                className="px-3 py-2 bg-ground-800 hover:bg-ground-750 text-[10px] font-semibold text-instrument rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                Open Dataset
              </button>
              <button
                onClick={() =>
                  setCopilotNote(
                    `Emissia Copilot: ${facility.name} is operating in sector ${facility.industry || facility.sector || "Power Generation"} with confidence ${facility.confidence || "91%"}.`
                  )
                }
                className="px-3 py-2 bg-sensor/10 hover:bg-sensor/20 border border-sensor/25 text-[10px] font-semibold text-sensor rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Cpu className="h-3 w-3" /> Ask Copilot
              </button>
            </div>

            {datasetNote && <p className="text-[10px] text-ground-400 bg-ground-950/40 p-2 rounded border border-ground-850">{datasetNote}</p>}
            {copilotNote && <p className="text-[10px] text-sensor bg-sensor/5 p-2 rounded border border-sensor/20">{copilotNote}</p>}
          </div>
        ) : (
          <p className="text-xs text-ground-500 py-6 text-center">
            Click on any plant point or 3D column on the map to inspect its real-time parameters.
          </p>
        )}
      </Card>
    </div>
  );
}
