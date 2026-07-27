"use client";

import { settingsApi } from "@/features/settings/api/settings-api";
import { DEFAULT_PREFERENCES, usePreferences } from "@/features/settings/hooks/use-preferences";
import { tokens } from "@/lib/auth-tokens";
import type { PreferencesOut } from "@/types/settings";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

function readLocal(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function readLocalBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  return raw === null ? fallback : raw === "true";
}

function readLocalNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  return raw === null ? fallback : Number(raw);
}

interface SettingsContextType {
  theme: string;
  resolvedTheme: string;
  accent: string;
  reducedMotion: boolean;
  compactMode: boolean;
  aiModel: string;
  aiThreshold: number;
  aiPalette: string;
  aiUnits: string;
  aiAutorun: boolean;
  aiExplainable: boolean;
  updateTheme: (v: string) => void;
  updateAccent: (v: string) => void;
  updateReducedMotion: (v: boolean) => void;
  updateCompactMode: (v: boolean) => void;
  updateAiModel: (v: string) => void;
  updateAiThreshold: (v: number) => void;
  updateAiPalette: (v: string) => void;
  updateAiUnits: (v: string) => void;
  updateAiAutorun: (v: boolean) => void;
  updateAiExplainable: (v: boolean) => void;
  formatEmission: (tonnesValue: number) => { value: string; unit: string };
  getHotspotColor: (t: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// t/year <-> kg/day is a display-only unit swap kept purely on the client;
// the backend stores prediction_units as "t_per_year" | "kg_per_day".
const unitsToBackend = (v: string) => (v === "kg/day" ? "kg_per_day" : "t_per_year");
const unitsFromBackend = (v: string) => (v === "kg_per_day" ? "kg/day" : "t/year");

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // localStorage seeds state for an instant paint before the network response
  // lands - it is a cache, not the source of truth. GET /settings/preferences
  // (below) overwrites it as soon as it resolves.
  const [theme, setTheme] = useState(() => readLocal("settings_appearance_theme", "dark"));
  const [resolvedTheme, setResolvedTheme] = useState("dark");
  const [accent, setAccent] = useState(() => readLocal("settings_appearance_accent", "green"));
  const [reducedMotion, setReducedMotion] = useState(() =>
    readLocalBool("settings_appearance_reduced_motion", false)
  );
  const [compactMode, setCompactMode] = useState(() => readLocalBool("settings_appearance_compact_mode", false));

  const [aiModel, setAiModel] = useState(() => readLocal("settings_ai_model", "unet-v1"));
  const [aiThreshold, setAiThreshold] = useState(() => readLocalNumber("settings_ai_threshold", 85));
  const [aiPalette, setAiPalette] = useState(() => readLocal("settings_ai_palette", "viridis"));
  const [aiUnits, setAiUnits] = useState(() => readLocal("settings_ai_units", "t/year"));
  const [aiAutorun, setAiAutorun] = useState(() => readLocalBool("settings_ai_autorun", true));
  const [aiExplainable, setAiExplainable] = useState(() => readLocalBool("settings_ai_explainable", false));

  const { data: serverPrefs } = usePreferences();
  const hydratedRef = useRef(false);

  // Hydrate every local field from the server once it resolves - this is the
  // moment localStorage stops being authoritative for this session.
  useEffect(() => {
    if (!serverPrefs || hydratedRef.current) return;
    hydratedRef.current = true;
    setTheme(serverPrefs.theme);
    setAccent(serverPrefs.accent_color);
    setReducedMotion(serverPrefs.reduced_motion);
    setCompactMode(serverPrefs.compact_mode);
    setAiModel(serverPrefs.ai_default_model);
    setAiThreshold(Math.round(serverPrefs.confidence_threshold * 100));
    setAiPalette(serverPrefs.heatmap_palette);
    setAiUnits(unitsFromBackend(serverPrefs.prediction_units));
    setAiAutorun(serverPrefs.auto_run_after_upload);
    setAiExplainable(serverPrefs.xai_enabled);
  }, [serverPrefs]);

  // Debounced write-through to the backend. localStorage is still written
  // synchronously (below, per updater) so a reload before the debounce fires
  // doesn't lose the change.
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const push = (partial: Partial<PreferencesOut>) => {
    if (typeof window === "undefined" || !tokens.access) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      const base: PreferencesOut = serverPrefs ?? {
        ...DEFAULT_PREFERENCES,
        theme: theme as PreferencesOut["theme"],
        accent_color: accent as PreferencesOut["accent_color"],
        reduced_motion: reducedMotion,
        compact_mode: compactMode,
        ai_default_model: aiModel,
        heatmap_palette: aiPalette as PreferencesOut["heatmap_palette"],
        confidence_threshold: aiThreshold / 100,
        prediction_units: unitsToBackend(aiUnits) as PreferencesOut["prediction_units"],
        auto_run_after_upload: aiAutorun,
        xai_enabled: aiExplainable,
      };
      settingsApi.putPreferences({ ...base, ...partial }).catch(() => {
        /* best-effort; the next successful save reconciles state */
      });
    }, 500);
  };

  // Sync resolved theme with theme + media query
  useEffect(() => {
    const updateResolved = () => {
      if (theme === "system") {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setResolvedTheme(systemDark ? "dark" : "light");
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolved();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    if (resolvedTheme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const html = document.documentElement;
    if (accent === "blue") {
      html.style.setProperty("--color-sensor", "#3b82f6");
    } else if (accent === "purple") {
      html.style.setProperty("--color-sensor", "#a855f7");
    } else {
      html.style.setProperty("--color-sensor", "#34d399");
    }
  }, [accent]);

  useEffect(() => {
    const html = document.documentElement;
    if (reducedMotion) {
      html.classList.add("reduced-motion");
    } else {
      html.classList.remove("reduced-motion");
    }
  }, [reducedMotion]);

  useEffect(() => {
    const html = document.documentElement;
    if (compactMode) {
      html.classList.add("compact-mode");
    } else {
      html.classList.remove("compact-mode");
    }
  }, [compactMode]);

  const updateTheme = (v: string) => {
    setTheme(v);
    localStorage.setItem("settings_appearance_theme", v);
    push({ theme: v as PreferencesOut["theme"] });
  };

  const updateAccent = (v: string) => {
    setAccent(v);
    localStorage.setItem("settings_appearance_accent", v);
    push({ accent_color: v as PreferencesOut["accent_color"] });
  };

  const updateReducedMotion = (v: boolean) => {
    setReducedMotion(v);
    localStorage.setItem("settings_appearance_reduced_motion", String(v));
    push({ reduced_motion: v });
  };

  const updateCompactMode = (v: boolean) => {
    setCompactMode(v);
    localStorage.setItem("settings_appearance_compact_mode", String(v));
    push({ compact_mode: v });
  };

  const updateAiModel = (v: string) => {
    setAiModel(v);
    localStorage.setItem("settings_ai_model", v);
    push({ ai_default_model: v });
  };

  const updateAiThreshold = (v: number) => {
    setAiThreshold(v);
    localStorage.setItem("settings_ai_threshold", String(v));
    push({ confidence_threshold: v / 100 });
  };

  const updateAiPalette = (v: string) => {
    setAiPalette(v);
    localStorage.setItem("settings_ai_palette", v);
    push({ heatmap_palette: v as PreferencesOut["heatmap_palette"] });
  };

  const updateAiUnits = (v: string) => {
    setAiUnits(v);
    localStorage.setItem("settings_ai_units", v);
    push({ prediction_units: unitsToBackend(v) as PreferencesOut["prediction_units"] });
  };

  const updateAiAutorun = (v: boolean) => {
    setAiAutorun(v);
    localStorage.setItem("settings_ai_autorun", String(v));
    push({ auto_run_after_upload: v });
  };

  const updateAiExplainable = (v: boolean) => {
    setAiExplainable(v);
    localStorage.setItem("settings_ai_explainable", String(v));
    push({ xai_enabled: v });
  };

  const formatEmission = (tonnesValue: number) => {
    if (aiUnits === "kg/day") {
      const kgDay = (tonnesValue * 1000) / 365;
      return {
        value: Math.round(kgDay).toLocaleString(),
        unit: "kg CO₂/day",
      };
    }
    return {
      value: Math.round(tonnesValue).toLocaleString(),
      unit: "t CO₂/yr",
    };
  };

  const getHotspotColor = (t: number): string => {
    const mix = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }, weight: number) => {
      const r = Math.round(c1.r + (c2.r - c1.r) * weight);
      const g = Math.round(c1.g + (c2.g - c1.g) * weight);
      const b = Math.round(c1.b + (c2.b - c1.b) * weight);
      return `rgb(${r}, ${g}, ${b})`;
    };

    if (aiPalette === "inferno") {
      const c1 = { r: 0x00, g: 0x00, b: 0x04 };
      const c2 = { r: 0xf8, g: 0x60, b: 0x12 };
      const c3 = { r: 0xfc, g: 0xff, b: 0xa4 };
      if (t < 0.5) return mix(c1, c2, t * 2);
      return mix(c2, c3, (t - 0.5) * 2);
    }
    if (aiPalette === "plasma") {
      const c1 = { r: 0x0d, g: 0x08, b: 0x87 };
      const c2 = { r: 0xcc, g: 0x47, b: 0x78 };
      const c3 = { r: 0xf0, g: 0xf9, b: 0x21 };
      if (t < 0.5) return mix(c1, c2, t * 2);
      return mix(c2, c3, (t - 0.5) * 2);
    }
    if (aiPalette === "turbo") {
      const c1 = { r: 0x30, g: 0x12, b: 0x3b };
      const c2 = { r: 0x28, g: 0xbb, b: 0xec };
      const c3 = { r: 0xe2, g: 0xe4, b: 0x18 };
      const c4 = { r: 0x7a, g: 0x04, b: 0x03 };
      if (t < 0.33) return mix(c1, c2, t * 3);
      if (t < 0.66) return mix(c2, c3, (t - 0.33) * 3);
      return mix(c3, c4, (t - 0.66) * 3);
    }
    const v1 = { r: 0x44, g: 0x01, b: 0x54 };
    const v2 = { r: 0x21, g: 0x91, b: 0x8c };
    const v3 = { r: 0xfd, g: 0xe7, b: 0x25 };
    if (t < 0.5) return mix(v1, v2, t * 2);
    return mix(v2, v3, (t - 0.5) * 2);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        resolvedTheme,
        accent,
        reducedMotion,
        compactMode,
        aiModel,
        aiThreshold,
        aiPalette,
        aiUnits,
        aiAutorun,
        aiExplainable,
        updateTheme,
        updateAccent,
        updateReducedMotion,
        updateCompactMode,
        updateAiModel,
        updateAiThreshold,
        updateAiPalette,
        updateAiUnits,
        updateAiAutorun,
        updateAiExplainable,
        formatEmission,
        getHotspotColor,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
