import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  sublabel?: string;
  emission?: boolean; // plume gradient is reserved for emission data
  loading?: boolean;
  icon?: LucideIcon;
}

export function StatCard({ label, value, sublabel, emission, loading, icon: Icon }: Props) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ground-400">{label}</p>
        {Icon && <Icon className="h-3.5 w-3.5 text-ground-500" />}
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-20" />
      ) : (
        <p className={cn("readout mt-2 text-3xl font-medium", emission && "plume-text")}>
          {value}
        </p>
      )}
      {sublabel && !loading && <p className="mt-1 text-xs text-ground-400">{sublabel}</p>}
      {sublabel && loading && <Skeleton className="mt-1.5 h-3 w-24" />}
    </Card>
  );
}
