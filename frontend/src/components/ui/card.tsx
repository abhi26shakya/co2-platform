import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-ground-700 bg-ground-800/60 backdrop-blur", className)}
      {...props}
    />
  );
}
