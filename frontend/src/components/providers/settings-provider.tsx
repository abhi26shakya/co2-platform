"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark");
  const [resolvedTheme, setResolvedTheme] = useState("dark");
  const [accent, setAccent] = useState("green");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const [aiModel, setAiModel] = useState("unet-v1");
  const [aiThreshold, setAiThreshold] = useState(85);
  const [aiPalette, setAiPalette] = useState("viridis");
  const [aiUnits, setAiUnits] = useState("t/year");
  const [aiAutorun, setAiAutorun] = useState(true);
  const [aiExplainable, setAiExplainable] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("settings_appearance_theme") || "dark";
      const savedAccent = localStorage.getItem("settings_appearance_accent") || "green";
      const savedMotion = localStorage.getItem("settings_appearance_reduced_motion") === "true";
      const savedCompact = localStorage.getItem("settings_appearance_compact_mode") === "true";

      const savedAiModel = localStorage.getItem("settings_ai_model") || "unet-v1";
      const savedAiThreshold = Number(localStorage.getItem("settings_ai_threshold") || "85");
      const savedAiPalette = localStorage.getItem("settings_ai_palette") || "viridis";
      const savedAiUnits = localStorage.getItem("settings_ai_units") || "t/year";
      const savedAiAutorun = localStorage.getItem("settings_ai_autorun") !== "false";
      const savedAiExplainable = localStorage.getItem("settings_ai_explainable") === "true";

      setTheme(savedTheme);
      setAccent(savedAccent);
      setReducedMotion(savedMotion);
      setCompactMode(savedCompact);
      setAiModel(savedAiModel);
      setAiThreshold(savedAiThreshold);
      setAiPalette(savedAiPalette);
      setAiUnits(savedAiUnits);
      setAiAutorun(savedAiAutorun);
      setAiExplainable(savedAiExplainable);
    }
  }, []);

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

  // Sync resolvedTheme class to documentElement
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

  // Sync accent style to documentElement
  useEffect(() => {
    const html = document.documentElement;
    if (accent === "blue") {
      html.style.setProperty("--color-sensor", "#3b82f6");
    } else if (accent === "purple") {
      html.style.setProperty("--color-sensor", "#a855f7");
    } else {
      html.style.setProperty("--color-sensor", "#34d399"); // default green
    }
  }, [accent]);

  // Sync animation classes to documentElement
  useEffect(() => {
    const html = document.documentElement;
    if (reducedMotion) {
      html.classList.add("reduced-motion");
    } else {
      html.classList.remove("reduced-motion");
    }
  }, [reducedMotion]);

  // Sync compact mode class to documentElement
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
  };

  const updateAccent = (v: string) => {
    setAccent(v);
    localStorage.setItem("settings_appearance_accent", v);
  };

  const updateReducedMotion = (v: boolean) => {
    setReducedMotion(v);
    localStorage.setItem("settings_appearance_reduced_motion", String(v));
  };

  const updateCompactMode = (v: boolean) => {
    setCompactMode(v);
    localStorage.setItem("settings_appearance_compact_mode", String(v));
  };

  const updateAiModel = (v: string) => {
    setAiModel(v);
    localStorage.setItem("settings_ai_model", v);
  };

  const updateAiThreshold = (v: number) => {
    setAiThreshold(v);
    localStorage.setItem("settings_ai_threshold", String(v));
  };

  const updateAiPalette = (v: string) => {
    setAiPalette(v);
    localStorage.setItem("settings_ai_palette", v);
  };

  const updateAiUnits = (v: string) => {
    setAiUnits(v);
    localStorage.setItem("settings_ai_units", v);
  };

  const updateAiAutorun = (v: boolean) => {
    setAiAutorun(v);
    localStorage.setItem("settings_ai_autorun", String(v));
  };

  const updateAiExplainable = (v: boolean) => {
    setAiExplainable(v);
    localStorage.setItem("settings_ai_explainable", String(v));
  };

  // Convert tonnesValue to selected display units
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

  // Perform dynamic mathematical palette interpolation for Viridis, Inferno, Plasma, and Turbo
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
    // Default Viridis
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
