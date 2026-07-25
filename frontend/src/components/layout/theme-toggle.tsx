"use client";

import { Moon, Sun } from "lucide-react";
import { useSettings } from "@/providers/providers/settings-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, updateTheme } = useSettings();
  const isLight = resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => updateTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-ground-700 bg-ground-900/50 text-ground-400 backdrop-blur-md transition-all duration-300 hover:border-sensor/40 hover:text-instrument active:scale-90 ${className}`}
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isLight ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
        aria-hidden
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isLight ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
        aria-hidden
      />
    </button>
  );
}
