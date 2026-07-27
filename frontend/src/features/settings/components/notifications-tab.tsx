"use client";

import { Toggle } from "@/features/settings/components/shared";
import { DEFAULT_PREFERENCES, usePreferences, useUpdatePreferences } from "@/features/settings/hooks/use-preferences";
import type { PreferencesOut } from "@/types/settings";

const PLATFORM_ROWS: { key: keyof PreferencesOut; label: string; description: string }[] = [
  {
    key: "notify_prediction_completed",
    label: "Prediction completed",
    description: "Receive alert when ML finishes estimating raster outputs.",
  },
  {
    key: "notify_upload_finished",
    label: "Upload finished",
    description: "Get notified when GeoTIFF raster parsing & alignment completes.",
  },
  {
    key: "notify_report_generated",
    label: "Report generated",
    description: "Alert when PDF reports or CSV analytics are ready for download.",
  },
];

const DIGEST_ROWS: { key: keyof PreferencesOut; label: string; description: string }[] = [
  {
    key: "notify_weekly_summary",
    label: "Weekly summary",
    description: "A weekly review digest of all uploaded images and predictions.",
  },
  {
    key: "notify_announcements",
    label: "Platform announcements",
    description: "New system features, service statuses, or tooling enhancements.",
  },
  {
    key: "notify_research_updates",
    label: "Research updates",
    description: "Earth observation case studies and newly added models.",
  },
];

const CHANNEL_ROWS: { key: keyof PreferencesOut; label: string; description: string }[] = [
  {
    key: "notify_email_enabled",
    label: "Email notifications",
    description: "Send digests and alerts directly to your registered inbox.",
  },
  {
    key: "notify_browser_enabled",
    label: "Browser notifications",
    description: "Show floating banners inside your active browser view.",
  },
];

function Section({
  title,
  rows,
  prefs,
  onToggle,
}: {
  title: string;
  rows: { key: keyof PreferencesOut; label: string; description: string }[];
  prefs: PreferencesOut;
  onToggle: (key: keyof PreferencesOut) => void;
}) {
  return (
    <div className="space-y-4 pt-4 first:pt-0">
      <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">{title}</h3>
      <div className="divide-y divide-ground-700/60 border border-ground-700 rounded-xl bg-ground-900/20 overflow-hidden">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-instrument">{row.label}</p>
              <p className="text-xs text-ground-400">{row.description}</p>
            </div>
            <Toggle checked={Boolean(prefs[row.key])} onChange={() => onToggle(row.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationsTab() {
  const { data } = usePreferences();
  const update = useUpdatePreferences();
  const prefs = data ?? DEFAULT_PREFERENCES;

  const toggle = (key: keyof PreferencesOut) => {
    update.mutate({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h2 className="text-lg font-medium text-instrument">Notifications</h2>
        <p className="text-sm text-ground-400">
          Choose what actions and updates you&apos;d like to be notified about.
        </p>
      </div>

      <Section title="Platform Activities" rows={PLATFORM_ROWS} prefs={prefs} onToggle={toggle} />
      <Section title="Updates & Digests" rows={DIGEST_ROWS} prefs={prefs} onToggle={toggle} />
      <Section title="Channels" rows={CHANNEL_ROWS} prefs={prefs} onToggle={toggle} />
    </div>
  );
}
