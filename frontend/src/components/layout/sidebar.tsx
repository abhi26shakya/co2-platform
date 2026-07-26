"use client";

import { useLogout, useUser } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Cpu,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  Satellite,
  Settings,
  Share2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebarStore } from "./sidebar-store";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/upload", label: "Upload", icon: Upload },
      { href: "/maps", label: "Map", icon: Map },
      { href: "/datasets", label: "Datasets", icon: Database },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/reports", label: "Reports", icon: FileText },
      { href: "/ai", label: "Model", icon: Cpu },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/shared-links", label: "Shared Links", icon: Share2 },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

const EASE = "ease-[cubic-bezier(0.21,0.6,0.35,1)]";

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const logout = useLogout();
  const { collapsed, focusMode, mobileOpen, toggleCollapsed, toggleFocusMode, setMobileOpen } =
    useSidebarStore();

  const rail = collapsed && !focusMode;

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Let Escape close the mobile drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-ground-700 bg-ground-900/95 shadow-2xl transition-transform duration-300",
          EASE,
          "lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 lg:bg-ground-900/60 lg:shadow-none",
          "lg:transition-[width,transform,opacity] lg:duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Width: full drawer on mobile always; collapses/hides only at lg+.
          // overflow-hidden only while animating to 0 width (focus mode) so inner
          // content doesn't spill out; visible otherwise so rail tooltips can escape.
          focusMode
            ? "w-72 lg:w-0 lg:overflow-hidden lg:border-transparent lg:opacity-0"
            : rail
              ? "w-72 lg:w-[80px] lg:overflow-visible"
              : "w-72 lg:w-64 lg:overflow-visible"
        )}
        aria-label="Main navigation"
        aria-hidden={focusMode ? true : undefined}
        inert={focusMode || undefined}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <Satellite className="h-5 w-5 shrink-0 text-sensor" aria-hidden />
          <span
            className={cn(
              "overflow-hidden whitespace-nowrap text-lg font-medium transition-all duration-200",
              rail ? "lg:max-w-0 lg:opacity-0" : "max-w-[160px] opacity-100"
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            Emissia
          </span>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="ml-auto inline-flex items-center justify-center rounded-lg p-1.5 text-ground-400 transition-colors hover:bg-ground-800/60 hover:text-instrument lg:hidden"
          >
            <X className="h-4.5 w-4.5" aria-hidden />
          </button>

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className={cn(
              "hidden items-center justify-center rounded-lg p-1.5 text-ground-400 transition-colors hover:bg-ground-800/60 hover:text-instrument lg:inline-flex",
              rail ? "mx-auto" : "ml-auto"
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-4 px-3 pb-3" aria-label="Main">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p
                className={cn(
                  "mb-1.5 overflow-hidden px-2 text-[10px] font-medium uppercase tracking-wider text-ground-400/60 transition-all duration-200",
                  rail ? "lg:mb-0 lg:h-0 lg:opacity-0" : "h-auto opacity-100"
                )}
              >
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <div key={href} className="group relative">
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          rail && "lg:justify-center lg:px-2",
                          isActive
                            ? "bg-ground-800 text-instrument"
                            : "text-ground-400 hover:bg-ground-800/60 hover:text-instrument"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        <span
                          className={cn(
                            "overflow-hidden whitespace-nowrap transition-all duration-200",
                            rail ? "lg:max-w-0 lg:opacity-0" : "max-w-[160px] opacity-100"
                          )}
                        >
                          {label}
                        </span>
                      </Link>

                      {rail && (
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-ground-700 bg-ground-900 px-2.5 py-1.5 text-xs text-instrument opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 lg:block"
                        >
                          {label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-ground-700 p-3">
          <div className="group relative">
            <button
              type="button"
              onClick={toggleFocusMode}
              aria-pressed={focusMode}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ground-400 transition-colors hover:bg-ground-800/60 hover:text-instrument",
                rail && "lg:justify-center lg:px-2"
              )}
            >
              <Maximize2 className="h-4 w-4 shrink-0" aria-hidden />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-200",
                  rail ? "lg:max-w-0 lg:opacity-0" : "max-w-[160px] opacity-100"
                )}
              >
                Focus Mode
              </span>
            </button>
            {rail && (
              <span
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-ground-700 bg-ground-900 px-2.5 py-1.5 text-xs text-instrument opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 lg:block"
              >
                Focus Mode
              </span>
            )}
          </div>

          <div
            className={cn(
              "overflow-hidden px-3 transition-all duration-200",
              rail ? "lg:max-h-0 lg:py-0 lg:opacity-0" : "max-h-20 py-2 opacity-100"
            )}
          >
            <p className="truncate text-sm text-instrument">{user?.full_name ?? "…"}</p>
            <p className="truncate text-xs text-ground-400">{user?.email}</p>
          </div>

          <div className="group relative">
            <button
              onClick={() => logout.mutate()}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ground-400 transition-colors hover:bg-ground-800/60 hover:text-instrument",
                rail && "lg:justify-center lg:px-2"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-200",
                  rail ? "lg:max-w-0 lg:opacity-0" : "max-w-[160px] opacity-100"
                )}
              >
                Sign out
              </span>
            </button>
            {rail && (
              <span
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-ground-700 bg-ground-900 px-2.5 py-1.5 text-xs text-instrument opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 lg:block"
              >
                Sign out
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
