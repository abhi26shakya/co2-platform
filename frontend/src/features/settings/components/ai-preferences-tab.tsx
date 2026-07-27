"use client";

import { Banner, Toggle, useBanner } from "@/features/settings/components/shared";
import { useSettings } from "@/providers/providers/settings-provider";
import { Sliders } from "lucide-react";
import { useState } from "react";

export function AiPreferencesTab() {
  const {
    aiModel,
    updateAiModel,
    aiThreshold,
    updateAiThreshold,
    aiPalette,
    updateAiPalette,
    aiUnits,
    updateAiUnits,
    aiAutorun,
    updateAiAutorun,
    aiExplainable,
    updateAiExplainable,
  } = useSettings();
  const { banner, notify } = useBanner();

  // Local draft so edits only take effect on "Save Preferences", mirroring
  // the rest of this tab's original UX (Appearance applies immediately;
  // AI Preferences requires an explicit save).
  const [draft, setDraft] = useState({
    aiModel,
    aiThreshold,
    aiPalette,
    aiUnits,
    aiAutorun,
    aiExplainable,
  });
  const [synced, setSynced] = useState(
    JSON.stringify({ aiModel, aiThreshold, aiPalette, aiUnits, aiAutorun, aiExplainable })
  );
  const snapshot = JSON.stringify({ aiModel, aiThreshold, aiPalette, aiUnits, aiAutorun, aiExplainable });
  if (snapshot !== synced) {
    setSynced(snapshot);
    setDraft({ aiModel, aiThreshold, aiPalette, aiUnits, aiAutorun, aiExplainable });
  }

  const handleSave = () => {
    updateAiModel(draft.aiModel);
    updateAiThreshold(draft.aiThreshold);
    updateAiPalette(draft.aiPalette);
    updateAiUnits(draft.aiUnits);
    updateAiAutorun(draft.aiAutorun);
    updateAiExplainable(draft.aiExplainable);
    notify("AI modeling configurations saved.");
  };

  const handleReset = () => {
    const defaults = {
      aiModel: "unet-v1",
      aiThreshold: 85,
      aiPalette: "viridis",
      aiUnits: "t/year",
      aiAutorun: true,
      aiExplainable: false,
    };
    setDraft(defaults);
    updateAiModel(defaults.aiModel);
    updateAiThreshold(defaults.aiThreshold);
    updateAiPalette(defaults.aiPalette);
    updateAiUnits(defaults.aiUnits);
    updateAiAutorun(defaults.aiAutorun);
    updateAiExplainable(defaults.aiExplainable);
    notify("AI preferences reset to factory defaults.");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h2 className="text-lg font-medium text-instrument">AI Preferences</h2>
        <p className="text-sm text-ground-400">
          Configure machine learning model thresholds, formats, and post-processing variables.
        </p>
      </div>

      {banner && <Banner message={banner.message} isError={banner.isError} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ground-400">Default Model</label>
          <select
            value={draft.aiModel}
            onChange={(e) => setDraft((d) => ({ ...d, aiModel: e.target.value }))}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
          >
            <option value="unet-v1">CNN/U-Net v1 (Active)</option>
            <option value="vit" disabled>
              Vision Transformer (Coming Soon)
            </option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ground-400">Heatmap Color Palette</label>
          <select
            value={draft.aiPalette}
            onChange={(e) => setDraft((d) => ({ ...d, aiPalette: e.target.value }))}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
          >
            <option value="viridis">Viridis</option>
            <option value="inferno">Inferno</option>
            <option value="plasma">Plasma</option>
            <option value="turbo">Turbo</option>
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-medium text-ground-400">Confidence Threshold</label>
            <span className="readout font-semibold text-sensor">{draft.aiThreshold}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={99}
            value={draft.aiThreshold}
            onChange={(e) => setDraft((d) => ({ ...d, aiThreshold: Number(e.target.value) }))}
            className="w-full h-1 bg-ground-700 rounded-lg appearance-none cursor-pointer accent-sensor mt-2"
          />
          <p className="text-[10px] text-ground-400">
            Filter predictions showing confidence below this percentage threshold.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ground-400">Prediction Units</label>
          <select
            value={draft.aiUnits}
            onChange={(e) => setDraft((d) => ({ ...d, aiUnits: e.target.value }))}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
          >
            <option value="t/year">t CO₂/year</option>
            <option value="kg/day">kg CO₂/day</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex items-center justify-between gap-4 p-4 border border-ground-700 rounded-xl bg-ground-900/20">
          <div>
            <p className="text-sm font-medium text-instrument">Auto-run prediction after upload</p>
            <p className="text-xs text-ground-400">
              Trigger isolated CNN inference automatically when files finish ingestion.
            </p>
          </div>
          <Toggle
            checked={draft.aiAutorun}
            onChange={() => setDraft((d) => ({ ...d, aiAutorun: !d.aiAutorun }))}
          />
        </div>

        <div className="sm:col-span-2 flex items-center justify-between gap-4 p-4 border border-ground-700 rounded-xl bg-ground-900/20">
          <div>
            <p className="text-sm font-medium text-instrument">Enable Explainable AI (XAI)</p>
            <p className="text-xs text-ground-400">
              Render prediction pixel activation maps mapping features to model outputs.
            </p>
          </div>
          <Toggle
            checked={draft.aiExplainable}
            onChange={() => setDraft((d) => ({ ...d, aiExplainable: !d.aiExplainable }))}
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-ground-700 flex justify-between items-center">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-ground-400 hover:text-instrument transition-colors cursor-pointer"
        >
          <Sliders className="h-3.5 w-3.5" /> Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2 text-sm font-medium transition-colors cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
