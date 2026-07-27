"use client";

import { Toggle } from "@/features/settings/components/shared";
import { useSettings } from "@/providers/providers/settings-provider";
import { cn } from "@/lib/utils";

export function AppearanceTab() {
  const {
    theme,
    updateTheme,
    accent,
    updateAccent,
    reducedMotion,
    updateReducedMotion,
    compactMode,
    updateCompactMode,
  } = useSettings();

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h2 className="text-lg font-medium text-instrument">Appearance</h2>
        <p className="text-sm text-ground-400">
          Customize client styling, accent colorations, and UI behaviors.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase text-ground-400 tracking-wider">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateTheme(t)}
                className={cn(
                  "py-3 text-sm rounded-lg border text-center transition-all capitalize font-medium cursor-pointer",
                  theme === t
                    ? "bg-ground-800 border-sensor text-instrument"
                    : "border-ground-700 bg-ground-900/40 text-ground-400 hover:border-ground-400"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase text-ground-400 tracking-wider">Accent Color</label>
          <div className="flex gap-4">
            {(["blue", "purple", "green"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateAccent(c)}
                className={cn(
                  "h-7 w-7 rounded-full transition-all border-2 border-transparent flex items-center justify-center cursor-pointer",
                  accent === c && "border-instrument scale-115"
                )}
              >
                <span
                  className={cn(
                    "h-5 w-5 rounded-full",
                    c === "blue" && "bg-blue-500",
                    c === "purple" && "bg-purple-500",
                    c === "green" && "bg-sensor"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <hr className="border-ground-700/60" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-instrument">Interface Animations</h3>
            <p className="mt-1 text-xs text-ground-400">
              Enable smooth page transitions and hover glow dynamics.
            </p>
          </div>
          <Toggle checked={!reducedMotion} onChange={() => updateReducedMotion(!reducedMotion)} />
        </div>

        <hr className="border-ground-700/60" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-instrument">Compact Mode</h3>
            <p className="mt-1 text-xs text-ground-400">
              Reduce paddings to show more list outputs without scrolling.
            </p>
          </div>
          <Toggle checked={compactMode} onChange={() => updateCompactMode(!compactMode)} />
        </div>
      </div>
    </div>
  );
}
