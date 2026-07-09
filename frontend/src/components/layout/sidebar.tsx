"use client";

import { useLogout, useUser } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Cpu,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Satellite,
  Upload,
  Settings,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, ready: true },
  { href: "/upload", label: "Upload", icon: Upload, ready: true },
  { href: "/map", label: "Map", icon: Map, ready: true },
  { href: "/datasets", label: "Datasets", icon: Database, ready: true },
  { href: "/analytics", label: "Analytics", icon: BarChart3, ready: true },
  { href: "/reports", label: "Reports", icon: FileText, ready: true },
  { href: "/model", label: "Model", icon: Cpu, ready: true },
  { href: "/shared-links", label: "Shared Links", icon: Share2, ready: true },
  { href: "/settings", label: "Settings", icon: Settings, ready: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const logout = useLogout();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-ground-700 bg-ground-900/60">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Satellite className="h-5 w-5 text-sensor" aria-hidden />
        <span className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Emissia
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Main">
        {NAV.map(({ href, label, icon: Icon, ready }) =>
          ready ? (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname.startsWith(href)
                  ? "bg-ground-800 text-instrument"
                  : "text-ground-400 hover:bg-ground-800/60 hover:text-instrument"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ) : (
            <span
              key={href}
              aria-disabled
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-ground-400/50"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
              <span className="readout ml-auto text-[10px] uppercase text-ground-400/70">soon</span>
            </span>
          )
        )}
      </nav>

      <div className="border-t border-ground-700 p-3">
        <div className="px-3 py-2">
          <p className="truncate text-sm text-instrument">{user?.full_name ?? "…"}</p>
          <p className="truncate text-xs text-ground-400">{user?.email}</p>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ground-400 transition-colors hover:bg-ground-800/60 hover:text-instrument"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
}
