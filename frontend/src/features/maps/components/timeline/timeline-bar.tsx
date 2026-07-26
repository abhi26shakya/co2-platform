import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export type TimelinePeriod = "daily" | "weekly" | "monthly" | "yearly";

const PERIODS: { id: TimelinePeriod; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

const SPEEDS = [0.5, 1.0, 1.5, 2.5, 4.0];

interface Props {
  period: TimelinePeriod;
  onPeriodChange: (period: TimelinePeriod) => void;
  ticks: string[];
  sliderIndex: number;
  onSliderChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

/** Slim, always-visible bottom bar — timeline is the only content here (see map-first layout decision). */
export function TimelineBar({
  period,
  onPeriodChange,
  ticks,
  sliderIndex,
  onSliderChange,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onSpeedChange,
}: Props) {
  return (
    <Card className="glass p-3 space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-ground-750 pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-sensor" />
          <span className="text-[11px] font-semibold text-instrument uppercase tracking-wider">Timeline</span>
        </div>

        <div className="flex items-center gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id)}
              className={`px-2.5 py-1 text-[10px] rounded font-semibold transition-all cursor-pointer ${
                period === p.id ? "bg-ground-800 text-sensor" : "text-ground-400 hover:text-instrument"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onSliderChange((sliderIndex - 1 + ticks.length) % ticks.length)}
            className="h-7 w-7 rounded-lg border border-ground-700 hover:border-ground-450 bg-ground-950 flex items-center justify-center text-instrument cursor-pointer text-xs font-mono"
            title="Previous frame"
          >
            ◀
          </button>
          <button
            onClick={onTogglePlay}
            className="h-7 w-7 rounded-lg border border-ground-700 hover:border-ground-450 bg-ground-950 flex items-center justify-center text-sensor cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={() => onSliderChange((sliderIndex + 1) % ticks.length)}
            className="h-7 w-7 rounded-lg border border-ground-700 hover:border-ground-450 bg-ground-950 flex items-center justify-center text-instrument cursor-pointer text-xs font-mono"
            title="Next frame"
          >
            ▶
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-ground-400 shrink-0">
          <span>Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="bg-ground-950 border border-ground-700 rounded px-1.5 py-1 text-[10px] text-instrument focus:outline-none cursor-pointer"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s.toFixed(1)}x
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-1.5 min-w-[12rem]">
          <input
            type="range"
            min={0}
            max={ticks.length - 1}
            value={sliderIndex}
            onChange={(e) => onSliderChange(Number(e.target.value))}
            className="w-full accent-sensor bg-ground-800 h-1 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-ground-450 font-medium px-1">
            {ticks.map((tick, i) => (
              <span key={i} className={i === sliderIndex ? "text-sensor font-bold" : ""}>
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
