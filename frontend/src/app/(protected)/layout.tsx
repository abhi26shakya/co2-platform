"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useSidebarStore } from "@/components/layout/sidebar-store";
import { tokens } from "@/lib/auth-tokens";
import { Menu, Minimize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Token presence is known synchronously (localStorage-backed), so this can be a lazy
  // initializer instead of effect-driven state — the effect below only needs to perform the
  // redirect side effect, not set any state.
  const [checked] = useState(() => Boolean(tokens.access || tokens.refresh));
  const { focusMode, setFocusMode, setMobileOpen } = useSidebarStore();

  useEffect(() => {
    if (!tokens.access && !tokens.refresh) {
      router.replace("/login");
    }
  }, [router]);

  if (!checked) return null; // avoid flashing protected UI

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-ground-700/60 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="inline-flex items-center justify-center rounded-lg p-2 text-ground-400 transition-colors hover:bg-ground-800/60 hover:text-instrument"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <span className="text-sm font-medium text-instrument">Emissia</span>
        </div>

        {focusMode && (
          <button
            type="button"
            onClick={() => setFocusMode(false)}
            aria-label="Exit focus mode"
            className="glass fixed left-4 top-4 z-40 hidden items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-ground-400 shadow-lg transition-colors hover:text-instrument lg:flex"
          >
            <Minimize2 className="h-3.5 w-3.5" aria-hidden />
            Exit Focus Mode
          </button>
        )}

        <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
