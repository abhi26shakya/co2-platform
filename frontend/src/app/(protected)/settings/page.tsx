"use client";

import { Card } from "@/components/ui/card";
import { AboutTab } from "@/features/settings/components/about-tab";
import { AccountTab } from "@/features/settings/components/account-tab";
import { AiPreferencesTab } from "@/features/settings/components/ai-preferences-tab";
import { AppearanceTab } from "@/features/settings/components/appearance-tab";
import { DataTab } from "@/features/settings/components/data-tab";
import { NotificationsTab } from "@/features/settings/components/notifications-tab";
import { ProfileTab } from "@/features/settings/components/profile-tab";
import { cn } from "@/lib/utils";
import {
  Bell,
  Brain,
  Database,
  Info,
  Palette,
  Shield,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TABS = [
  { id: "profile", label: "Profile", icon: User, Component: ProfileTab },
  { id: "account", label: "Account", icon: Shield, Component: AccountTab },
  { id: "notifications", label: "Notifications", icon: Bell, Component: NotificationsTab },
  { id: "data", label: "Data & Storage", icon: Database, Component: DataTab },
  { id: "ai", label: "AI Preferences", icon: Brain, Component: AiPreferencesTab },
  { id: "appearance", label: "Appearance", icon: Palette, Component: AppearanceTab },
  { id: "about", label: "About", icon: Info, Component: AboutTab },
] as const;

function SettingsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = TABS.some((t) => t.id === searchParams.get("tab"))
    ? (searchParams.get("tab") as (typeof TABS)[number]["id"])
    : "profile";

  const setActiveTab = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    router.push(`${url.pathname}${url.search}`);
  };

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component ?? ProfileTab;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="mt-1 text-sm text-ground-400">
          Configure your Emissia account, preferences, and modeling thresholds.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-56 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0 scrollbar-none border-b border-ground-700/40 lg:border-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer",
                  active
                    ? "bg-ground-800 text-instrument border border-ground-700/60"
                    : "text-ground-400 hover:bg-ground-800/40 hover:text-instrument"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        <div className="flex-1 min-w-0 w-full space-y-6">
          <Card className="p-6 transition-all duration-300">
            <ActiveComponent />
          </Card>

          <footer className="text-center py-4 text-xs text-ground-400 border-t border-ground-700/30 flex flex-col gap-1">
            <span className="readout">Emissia v1.0.0</span>
            <span className="font-sans text-[10px] text-ground-400/80">
              Built for Earth Observation & Climate Intelligence
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageInner />
    </Suspense>
  );
}
