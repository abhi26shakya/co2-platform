"use client";

import { useState } from "react";
import { ChevronDown, Compass, Menu, Share2 } from "lucide-react";
import { FacilitySearch } from "@/features/maps/components/search/facility-search";
import type { MapSearchResult } from "@/features/maps/lib/search";
import type { MapMode } from "@/features/maps/store/map-store";
import { GASES } from "@/features/maps/lib/gas-catalog";

interface DropdownProps {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onSelect: (id: string) => void;
}

/** Compact single-select dropdown shared by the fuel-type/year/gas toolbar controls. */
function ToolbarDropdown({ label, value, options, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const activeLabel = options.find((o) => o.id === value)?.label ?? label;

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-xs text-ground-300 hover:border-ground-500 cursor-pointer whitespace-nowrap"
      >
        <span className="text-ground-500">{label}:</span>
        <span className="font-semibold text-instrument">{activeLabel}</span>
        <ChevronDown className={`h-3 w-3 text-ground-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="glass-strong absolute top-full left-0 mt-1 rounded-lg z-30 min-w-full w-max p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                onSelect(o.id);
                setOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                value === o.id ? "bg-ground-800 text-sensor font-semibold" : "hover:bg-ground-850/60 text-ground-300"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />}
    </div>
  );
}

interface Props {
  menuOpen: boolean;
  onToggleMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResults: MapSearchResult[];
  allFacilities: MapSearchResult[];
  onSelectSearchResult: (r: MapSearchResult) => void;
  fuelTypeOptions: string[];
  selectedFuelType: string;
  onSelectFuelType: (f: string) => void;
  years: string[];
  selectedYear: string;
  onSelectYear: (y: string) => void;
  primaryGas: string;
  onSelectPrimaryGas: (g: string) => void;
  mapMode: MapMode;
  onMapModeChange: (m: MapMode) => void;
  comparisonMode: boolean;
  onToggleComparison: () => void;
  onShare: () => void;
}

/** Persistent top toolbar for the map — structurally modeled on Climate TRACE's explore-page bar
 *  (search + sector/year/gas filters + a global timeframe/view control, all in one row above a
 *  full-bleed map) rather than this app's previous title header + side icon rail. `onToggleMenu`
 *  opens the existing layer/basemap/GIS/export flyout panels as a dropdown beneath this bar. */
export function MapToolbar({
  menuOpen,
  onToggleMenu,
  searchQuery,
  onSearchChange,
  searchResults,
  allFacilities,
  onSelectSearchResult,
  fuelTypeOptions,
  selectedFuelType,
  onSelectFuelType,
  years,
  selectedYear,
  onSelectYear,
  primaryGas,
  onSelectPrimaryGas,
  mapMode,
  onMapModeChange,
  comparisonMode,
  onToggleComparison,
  onShare,
}: Props) {
  const fuelOptions = [{ id: "all", label: "All Fuel Types" }, ...fuelTypeOptions.map((f) => ({ id: f, label: f }))];
  const yearOptions = years.map((y) => ({ id: y, label: y }));
  const gasOptions = GASES.map((g) => ({ id: g.id, label: g.shortLabel }));

  return (
    <div className="glass rounded-xl px-3 py-2.5 flex flex-wrap items-center gap-2">
      <button
        onClick={onToggleMenu}
        title="Layers, basemaps, GIS tools & export"
        className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
          menuOpen ? "bg-sensor/10 text-sensor" : "text-ground-400 hover:bg-ground-850 hover:text-instrument"
        }`}
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-ground-750">
        <Compass className="h-4 w-4 text-sensor" />
        <span className="text-sm font-semibold text-instrument hidden sm:inline" style={{ fontFamily: "var(--font-display)" }}>
          Emissia
        </span>
      </div>

      <div className="min-w-0 w-56 grow max-w-xs">
        <FacilitySearch
          query={searchQuery}
          onQueryChange={onSearchChange}
          results={searchResults}
          onSelect={onSelectSearchResult}
          allFacilities={allFacilities}
        />
      </div>

      <ToolbarDropdown label="Fuel Type" value={selectedFuelType} options={fuelOptions} onSelect={onSelectFuelType} />
      <ToolbarDropdown label="Year" value={selectedYear} options={yearOptions} onSelect={onSelectYear} />
      <ToolbarDropdown label="Gas" value={primaryGas} options={gasOptions} onSelect={onSelectPrimaryGas} />

      <div className="glass-strong flex rounded-lg p-1 gap-0.5 select-none shrink-0">
        {(["2d", "3d"] as const).map((id) => (
          <button
            key={id}
            onClick={() => onMapModeChange(id)}
            className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              mapMode === id ? "bg-sensor/10 text-sensor" : "text-ground-400 hover:text-instrument"
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleComparison}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
            comparisonMode ? "bg-sensor/10 border-sensor text-sensor" : "border-ground-700 hover:border-ground-400 text-ground-300 bg-ground-900/60"
          }`}
        >
          {comparisonMode ? "✕ Exit Comparison" : "Compare"}
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 rounded-lg bg-sensor text-ground-950 px-3 py-2 text-xs font-semibold transition-colors hover:bg-sensor/90 cursor-pointer shadow-lg shadow-sensor/5"
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      </div>
    </div>
  );
}
