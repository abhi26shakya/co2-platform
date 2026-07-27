import Link from "next/link";
import { UploadCloud, FileText, Map, BarChart3 } from "lucide-react";

const ACTIONS = [
  { label: "Upload image", href: "/upload", icon: UploadCloud },
  { label: "Generate report", href: "/reports", icon: FileText },
  { label: "View map", href: "/maps", icon: Map },
  { label: "View analytics", href: "/analytics", icon: BarChart3 },
] as const;

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2.5 rounded-xl border border-ground-700 bg-ground-800/60 p-3.5 text-sm text-instrument backdrop-blur transition-colors hover:border-ground-600 hover:bg-ground-800"
        >
          <Icon className="h-4 w-4 shrink-0 text-sensor" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </div>
  );
}
