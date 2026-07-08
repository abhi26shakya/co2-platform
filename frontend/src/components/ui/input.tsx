import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-ground-700 bg-ground-900 px-3 text-sm text-instrument placeholder:text-ground-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sensor",
        className
      )}
      {...props}
    />
  );
}
