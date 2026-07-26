import { Card } from "@/components/ui/card";

export type ComparisonType =
  | "split-screen"
  | "before-after"
  | "gas-compare"
  | "time-compare"
  | "difference-layer"
  | "confidence-layer";

const COMPARISON_TYPES: { id: ComparisonType; label: string }[] = [
  { id: "split-screen", label: "Split-Screen" },
  { id: "before-after", label: "Before/After" },
  { id: "gas-compare", label: "Gas Compare" },
  { id: "time-compare", label: "Time Series" },
  { id: "difference-layer", label: "Diff Layer" },
  { id: "confidence-layer", label: "Confidence" },
];

const PREDICTION_OPTIONS = [
  { value: "pred-1", label: "Vindhyachal Scenario (v1.2)" },
  { value: "pred-2", label: "Sasan Local Scenario (v1.2)" },
];

interface Props {
  comparisonType: ComparisonType;
  onComparisonTypeChange: (type: ComparisonType) => void;
  predictionA: string;
  onPredictionAChange: (value: string) => void;
  predictionB: string;
  onPredictionBChange: (value: string) => void;
}

export function ComparisonPanel({
  comparisonType,
  onComparisonTypeChange,
  predictionA,
  onPredictionAChange,
  predictionB,
  onPredictionBChange,
}: Props) {
  return (
    <Card className="glass p-4 space-y-3.5 text-xs animate-in slide-in-from-top duration-250">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-ground-800 pb-2">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-sensor">Prediction Analysis Engine</span>
          <p className="text-[11px] text-ground-400">Perform comparative calculations between AI estimation runs.</p>
        </div>
        <div className="flex items-center gap-1 bg-ground-950 border border-ground-850 p-1 rounded-lg flex-wrap sm:flex-nowrap">
          {COMPARISON_TYPES.map((btn) => (
            <button
              key={btn.id}
              onClick={() => onComparisonTypeChange(btn.id)}
              className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                comparisonType === btn.id ? "bg-sensor text-ground-950 shadow-sm" : "text-ground-400 hover:text-instrument"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-ground-450">Source A (Base):</span>
            <select
              value={predictionA}
              onChange={(e) => onPredictionAChange(e.target.value)}
              className="bg-ground-950 border border-ground-750 px-2 py-1 rounded text-instrument font-semibold"
            >
              {PREDICTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-ground-450">Source B (Compare):</span>
            <select
              value={predictionB}
              onChange={(e) => onPredictionBChange(e.target.value)}
              className="bg-ground-950 border border-ground-750 px-2 py-1 rounded text-instrument font-semibold"
            >
              {PREDICTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-sensor/5 border border-sensor/20 text-sensor font-mono text-[11px] font-bold">
            Delta Max: +20.2% (Anomaly Spike)
          </div>
          <div className="px-2.5 py-1 rounded bg-blue-500/5 border border-blue-500/20 text-blue-400 font-mono text-[11px] font-bold">
            Confidence: 94.2% (High Correlation)
          </div>
        </div>
      </div>
    </Card>
  );
}
