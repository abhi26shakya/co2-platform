import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  sublabel?: string;
  emission?: boolean; // plume gradient is reserved for emission data
  loading?: boolean;
}

export function StatCard({ label, value, sublabel, emission, loading }: Props) {
  return (
    <Card className="p-5">
      <p className="text-xs text-ground-400">{label}</p>
      <p
        className={cn(
          "readout mt-2 text-3xl font-medium",
          emission && "plume-text",
          loading && "animate-pulse text-ground-400"
        )}
      >
        {loading ? "···" : value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-ground-400">{sublabel}</p>}
    </Card>
  );
}
