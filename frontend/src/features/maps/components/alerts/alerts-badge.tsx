"use client";

import { AlertCircle } from "lucide-react";

export interface MapAlert {
  id: string;
  facility: string;
  lat: number;
  lon: number;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  time: string;
  color: string;
}

export const REALTIME_ALERTS: MapAlert[] = [
  {
    id: "alert-1",
    facility: "Vindhyachal Power Station",
    lat: 24.062,
    lon: 82.671,
    severity: "critical",
    message: "CO₂ plume enhancement exceeded critical threshold (>450 ppm)",
    time: "2m ago",
    color: "border-red-500 bg-red-950/20 text-red-400",
  },
  {
    id: "alert-2",
    facility: "Sasan Ultra Mega Power",
    lat: 23.987,
    lon: 82.612,
    severity: "high",
    message: "Methane leak detected (CH₄ anomaly +15.4% above background)",
    time: "15m ago",
    color: "border-orange-500 bg-orange-950/20 text-orange-400",
  },
  {
    id: "alert-3",
    facility: "Korba Coal Plant",
    lat: 22.35,
    lon: 82.68,
    severity: "medium",
    message: "NO₂ plume density rising (+8.2% daily increase)",
    time: "1h ago",
    color: "border-yellow-500 bg-yellow-950/20 text-yellow-400",
  },
  {
    id: "alert-4",
    facility: "Ramagundam STPS",
    lat: 18.756,
    lon: 79.432,
    severity: "low",
    message: "SO₂ sensor status variance under normal tolerance",
    time: "3h ago",
    color: "border-blue-500 bg-blue-950/20 text-blue-400",
  },
];

interface Props {
  open: boolean;
  onToggle: () => void;
  onSelectAlert: (alert: MapAlert) => void;
}

/** Collapsed floating badge by default; expands into a compact list — replaces the always-open left-rail alerts card. */
export function AlertsBadge({ open, onToggle, onSelectAlert }: Props) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 bg-ground-950/95 border border-red-500/30 rounded-full px-3 py-1.5 shadow-2xl cursor-pointer"
      >
        <AlertCircle className="h-3.5 w-3.5 text-red-400" />
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
          {REALTIME_ALERTS.length} Live Alerts
        </span>
      </button>

      {open && (
        <div className="glass-strong absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 rounded-xl p-3 space-y-2 max-h-72 overflow-y-auto">
          {REALTIME_ALERTS.map((alertItem) => (
            <button
              key={alertItem.id}
              onClick={() => onSelectAlert(alertItem)}
              className={`w-full text-left p-2 rounded border ${alertItem.color} transition-all hover:scale-[1.01] cursor-pointer flex flex-col gap-1`}
            >
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="uppercase tracking-wider font-mono">{alertItem.severity} alert</span>
                <span className="text-ground-450">{alertItem.time}</span>
              </div>
              <span className="text-[10px] font-semibold text-instrument line-clamp-1">{alertItem.facility}</span>
              <p className="text-[9px] text-ground-300 leading-snug">{alertItem.message}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
