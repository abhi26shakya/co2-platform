"use client";

import { useHotspots, usePlants } from "@/features/maps/hooks/use-geo";
import { useMapStore } from "@/features/maps/store/map-store";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Script from "next/script";
import { Card } from "@/components/ui/card";
import {
  Share2,
  Layers,
  Globe,
  Settings,
  Eye,
  Activity,
  Plus,
  Play,
  RotateCcw,
  Search,
  PenTool,
  AlertCircle,
  FileText,
  Download,
  Info,
  Calendar,
  Layers2,
  TrendingUp,
  Cpu,
  TrendingDown,
  Trash2
} from "lucide-react";
import Link from "next/link";

// Cesium loads on client and requires script files in head
const EmissionMap = dynamic(() => import("@/features/maps/components/map/emission-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[40rem] items-center justify-center rounded-xl border border-ground-700 bg-ground-900/40 text-sm text-ground-400">
      Loading Cesium 3D Globe...
    </div>
  ),
});

export default function MapPage() {
  const { data: plants = [] } = usePlants();
  const { data: hotspots = [] } = useHotspots();

  // Zustand Store bindings
  const {
    activeBasemap,
    setActiveBasemap,
    selectedFacility,
    setSelectedFacility,
    gases,
    toggleGas,
    setGasOpacity
  } = useMapStore();

  // Map settings and local states
  const [visualizationMode, setVisualizationMode] = useState("volume3d");
  const [drawingMode, setDrawingMode] = useState("none");
  const [showLayers, setShowLayers] = useState({
    plants: true,
    heatmap: true,
    contours: true,
    prediction: true,
    boundaries: false,
    roads: false,
    clouds: false,
  });

  // Timeline & Slider states
  const [timelinePeriod, setTimelinePeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [sliderIndex, setSliderIndex] = useState(2);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Comparison Mode
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparePredictionA, setComparePredictionA] = useState("pred-1");
  const [comparePredictionB, setComparePredictionB] = useState("pred-2");

  // Share
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [shareConfigLink, setShareConfigLink] = useState("");

  // Timeline ticks based on period
  const timelineTicks = {
    daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
    monthly: ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026"],
    yearly: ["2023", "2024", "2025", "2026"],
  };

  // Autoplay simulation
  useEffect(() => {
    if (!isTimelinePlaying) return;
    const ticksCount = timelineTicks[timelinePeriod].length;
    const interval = setInterval(() => {
      setSliderIndex((idx) => (idx + 1) % ticksCount);
    }, 1500);
    return () => clearInterval(interval);
  }, [isTimelinePlaying, timelinePeriod]);

  // Handle drawing mode action triggers
  const handleDrawingModeChange = (mode: string) => {
    setDrawingMode(drawingMode === mode ? "none" : mode);
  };

  // Export handlers
  const handleExportMap = (format: string) => {
    alert(`Exporting current 3D viewport coordinates and layers as ${format.toUpperCase()}...`);
  };

  // Share configuration links
  const triggerMapShare = () => {
    const activeGasKeys = Object.keys(gases).filter((k) => gases[k].enabled).join(",");
    const cameraParams = `lat=22.50&lon=79.50&zoom=9&basemap=${activeBasemap}&gases=${activeGasKeys}`;
    const generated = `https://co2-platform-nine.vercel.app/map?${cameraParams}`;
    setShareConfigLink(generated);
    setShareLinkOpen(true);
  };

  // Combined search results filtering
  const searchResults = searchQuery.trim().length > 0 ? [
    ...plants.map(p => ({
      type: "plant",
      id: p.id,
      name: p.name,
      country: p.country,
      details: `${p.fuel_type || "Energy"} · ${p.capacity_mw || 0}MW`,
      lat: p.lat,
      lon: p.lon,
      industry: p.fuel_type || "Energy Production",
      co2: p.co2_enhancement_ppm ? p.co2_enhancement_ppm.toFixed(2) : "—",
      confidence: p.co2_soundings ? "91%" : "n/a",
      satellite: "Sentinel-5P",
    })),
    ...hotspots.map((h, i) => ({
      type: "hotspot",
      id: `hotspot-${i}`,
      name: `Detected Hotspot #${i + 1}`,
      country: "India",
      details: `Anomaly · ${(h.intensity * 100).toFixed(0)}% confidence`,
      lat: h.lat,
      lon: h.lon,
      industry: "Industrial Facility Anomaly",
      co2: h.emission_tonnes_per_year ? h.emission_tonnes_per_year.toLocaleString() : "4,760",
      confidence: `${(h.intensity * 100).toFixed(0)}%`,
      satellite: "Sentinel-5P",
      dataset: h.image_filename,
    }))
  ].filter(item => {
    const query = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(query) ||
      item.country.toLowerCase().includes(query) ||
      item.details.toLowerCase().includes(query) ||
      item.lat.toFixed(4).includes(query) ||
      item.lon.toFixed(4).includes(query)
    );
  }).slice(0, 5) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      
      {/* Stylesheets & Scripts for Cesium */}
      <link
        rel="stylesheet"
        href="https://cesium.com/downloads/cesiumjs/releases/1.115/Build/Cesium/Widgets/widgets.css"
      />
      <Script
        src="https://cesium.com/downloads/cesiumjs/releases/1.115/Build/Cesium/Cesium.js"
        strategy="beforeInteractive"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
            Earth Observation Map
          </h1>
          <p className="mt-1 text-sm text-ground-400">
            Interactive 3D planetary tracking of industrial greenhouse gas emissions.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              comparisonMode
                ? "bg-sensor/10 border-sensor text-sensor"
                : "border-ground-700 hover:border-ground-400 text-ground-300 bg-ground-900/60"
            }`}
          >
            {comparisonMode ? "✕ Exit Comparison" : "Compare Predictions"}
          </button>
          <button
            onClick={triggerMapShare}
            className="flex items-center gap-2 rounded-lg bg-sensor text-ground-950 px-4 py-2 text-sm font-semibold transition-colors hover:bg-sensor/90 cursor-pointer shadow-lg shadow-sensor/5 shrink-0"
          >
            <Share2 className="h-4 w-4" /> Share Map
          </button>
        </div>
      </div>

      {/* Primary Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Control Panel: Basemaps, Gases, Drawings, Layer Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Basemaps */}
          <Card className="p-4 bg-ground-900/40 border-ground-700/80 space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Basemaps
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-ground-300">
              {[
                { id: "dark", label: "Dark style" },
                { id: "satellite", label: "Satellite" },
                { id: "hybrid", label: "Hybrid" },
                { id: "terrain", label: "Terrain 3D" },
                { id: "osm", label: "Street Map" },
              ].map((base) => (
                <button
                  key={base.id}
                  onClick={() => setActiveBasemap(base.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    activeBasemap === base.id
                      ? "bg-ground-800 text-sensor font-semibold"
                      : "hover:bg-ground-850"
                  }`}
                >
                  {base.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Interactive Search Box with matches overlay dropdown */}
          <div className="relative">
            <Card className="p-3 bg-ground-900/40 border-ground-700/80">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ground-400" />
                <input
                  type="text"
                  placeholder="Search facility, city, lat, lon..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchFocused(true);
                  }}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full pl-8 pr-3 py-1.5 bg-ground-950 border border-ground-700/80 rounded-lg text-xs placeholder-ground-555 focus:outline-none focus:border-ground-400 text-instrument"
                />
              </div>
            </Card>

            {/* Results Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-ground-950 border border-ground-700 rounded-lg shadow-2xl z-20 overflow-hidden divide-y divide-ground-800 animate-in fade-in slide-in-from-top-1 duration-150">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onMouseDown={() => {
                      setSelectedFacility(result);
                      setSearchQuery(result.name);
                      setSearchFocused(false);
                    }}
                    className="w-full text-left p-3 hover:bg-ground-900 transition-colors flex flex-col gap-0.5 cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-instrument">{result.name}</span>
                    <div className="flex items-center justify-between text-[10px] text-ground-400 font-mono">
                      <span>{result.details}</span>
                      <span>{result.lat.toFixed(3)}, {result.lon.toFixed(3)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Click outside closer helper */}
            {searchFocused && (
              <div className="fixed inset-0 z-10" onClick={() => setSearchFocused(false)} />
            )}
          </div>

          {/* Gas Layers Selector */}
          <Card className="p-4 bg-ground-900/40 border-ground-700/80 space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
              <Layers2 className="h-3.5 w-3.5" /> Multi-Gas Layers
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { id: "co2", label: "Carbon Dioxide (CO₂)", color: "bg-red-500", range: "380 - 450 ppm", gradient: "from-red-600 to-red-400" },
                { id: "ch4", label: "Methane (CH₄)", color: "bg-purple-500", range: "1800 - 2200 ppb", gradient: "from-purple-600 to-purple-400" },
                { id: "no2", label: "Nitrogen Dioxide (NO₂)", color: "bg-orange-500", range: "0 - 150 ppb", gradient: "from-orange-600 to-orange-400" },
                { id: "so2", label: "Sulfur Dioxide (SO₂)", color: "bg-pink-500", range: "0 - 80 ppb", gradient: "from-pink-600 to-pink-400" },
                { id: "co", label: "Carbon Monoxide (CO)", color: "bg-teal-500", range: "50 - 200 ppb", gradient: "from-teal-600 to-teal-400" },
              ].map((gas) => {
                const config = gases[gas.id] || { enabled: false, opacity: 0.8 };
                return (
                  <div key={gas.id} className="space-y-1.5 p-2 rounded-lg bg-ground-950/40 border border-ground-800/40">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={() => toggleGas(gas.id)}
                          className="accent-sensor h-3 w-3 cursor-pointer"
                        />
                        <span className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${gas.color}`} />
                          <span className={config.enabled ? "text-instrument font-medium" : "text-ground-400"}>{gas.label}</span>
                        </span>
                      </label>
                    </div>
                    
                    {config.enabled && (
                      <div className="space-y-1.5 pl-5 pt-1 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-[10px] text-ground-400">
                          <span>Opacity: {Math.round(config.opacity * 100)}%</span>
                          <span className="font-mono text-sensor">{gas.range}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={config.opacity}
                          onChange={(e) => setGasOpacity(gas.id, parseFloat(e.target.value))}
                          className="w-full accent-sensor bg-ground-800 h-1 rounded-lg cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`h-1.5 w-full rounded bg-gradient-to-r ${gas.gradient}`} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Visualization Modes */}
          <Card className="p-4 bg-ground-900/40 border-ground-700/80 space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" /> Render Modes
            </h3>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {[
                { id: "volume3d", label: "3D Extruded Columns" },
                { id: "heatmap", label: "Plume Heatmap" },
                { id: "contours", label: "Contours (Isolines)" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setVisualizationMode(mode.id)}
                  className={`w-full text-left p-2 rounded transition-colors cursor-pointer ${
                    visualizationMode === mode.id
                      ? "bg-ground-800 text-sensor font-semibold"
                      : "hover:bg-ground-850/40 text-ground-400"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Drawing & Measurements */}
          <Card className="p-4 bg-ground-900/40 border-ground-700/80 space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
              <PenTool className="h-3.5 w-3.5" /> Drawing & Measures
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: "polygon", label: "Draw Area" },
                { id: "distance", label: "Measure Dist" },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleDrawingModeChange(tool.id)}
                  className={`px-2 py-1.5 rounded border transition-colors cursor-pointer text-center ${
                    drawingMode === tool.id
                      ? "bg-red-500/10 border-red-500 text-red-400"
                      : "border-ground-700 hover:border-ground-500 text-ground-400"
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 3D Map Center View Container */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Comparison Mode Setup */}
          {comparisonMode && (
            <Card className="p-4 bg-ground-900/80 border-ground-700 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sensor">Comparison Mode Active</span>
                <p className="text-ground-400">Plot differences between predictions and compute emission growth percentages.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-ground-400">Source A:</span>
                  <select
                    value={comparePredictionA}
                    onChange={(e) => setComparePredictionA(e.target.value)}
                    className="bg-ground-950 border border-ground-750 px-2 py-1 rounded text-instrument"
                  >
                    <option value="pred-1">Vindhyachal (v1.2)</option>
                    <option value="pred-2">Sasan scene (v1.2)</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-ground-400">Source B:</span>
                  <select
                    value={comparePredictionB}
                    onChange={(e) => setComparePredictionB(e.target.value)}
                    className="bg-ground-950 border border-ground-750 px-2 py-1 rounded text-instrument"
                  >
                    <option value="pred-1">Vindhyachal (v1.2)</option>
                    <option value="pred-2">Sasan scene (v1.2)</option>
                  </select>
                </div>
                <div className="px-2 py-1.5 rounded bg-sensor/5 border border-sensor/20 text-sensor font-mono">
                  Diff: +20.2% Growth
                </div>
              </div>
            </Card>
          )}

          {/* Actual 3D map component */}
          <div className="relative">
            <EmissionMap
              plants={plants}
              hotspots={hotspots}
              showPlants={showLayers.plants}
              showHotspots={showLayers.heatmap}
              selectedMode={visualizationMode}
              activeBasemap={activeBasemap}
              onSelectFacility={setSelectedFacility}
              drawingMode={drawingMode}
              comparisonMode={comparisonMode}
              timelineDate={timelineTicks[timelinePeriod][sliderIndex]}
              showLayers={showLayers}
            />

            {/* Layer Visibility Overlays Panel (Floating Right) */}
            <div className="absolute top-4 right-4 bg-ground-950/95 border border-ground-700/80 rounded-xl p-3.5 space-y-3 z-10 w-44 shadow-2xl">
              <h4 className="text-[10px] uppercase font-bold text-ground-400 tracking-wider flex items-center gap-1.5 border-b border-ground-800 pb-1.5">
                <Layers className="h-3 w-3" /> Toggle Layers
              </h4>
              <div className="space-y-1.5 text-[11px] text-ground-300">
                {[
                  { key: "plants", label: "Industrial Plants" },
                  { key: "heatmap", label: "Heatmaps overlay" },
                  { key: "contours", label: "Isoline Contours" },
                  { key: "boundaries", label: "Political borders" },
                  { key: "roads", label: "Roads & networks" },
                  { key: "clouds", label: "Simulated Clouds" },
                ].map((lyr) => (
                  <label key={lyr.key} className="flex items-center justify-between cursor-pointer select-none">
                    <span>{lyr.label}</span>
                    <input
                      type="checkbox"
                      checked={showLayers[lyr.key as keyof typeof showLayers]}
                      onChange={(e) =>
                        setShowLayers({
                          ...showLayers,
                          [lyr.key]: e.target.checked,
                        })
                      }
                      className="accent-sensor h-3 w-3 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Intensity Legend overlay */}
            <div className="absolute bottom-4 right-4 bg-ground-950/95 border border-ground-700/80 rounded-xl p-3.5 z-10 w-48 shadow-2xl space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold text-ground-400 uppercase">Intensity Legend</span>
                <span className="text-[9px] text-sensor font-bold font-mono">PPM / Density</span>
              </div>
              <div className="h-2 rounded-full plume-gradient" />
              <div className="flex justify-between text-[9px] text-ground-400">
                <span>Very Low</span>
                <span>Moderate</span>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Timeline Slider component */}
          <Card className="p-5 bg-ground-900/40 border-ground-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-ground-750 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sensor" />
                <span className="text-xs font-semibold text-instrument uppercase tracking-wider">Timeline controls</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                {[
                  { id: "daily", label: "Daily" },
                  { id: "weekly", label: "Weekly" },
                  { id: "monthly", label: "Monthly" },
                  { id: "yearly", label: "Yearly" },
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => {
                      setTimelinePeriod(period.id as any);
                      setSliderIndex(0);
                    }}
                    className={`px-2.5 py-1 text-[10px] rounded font-semibold transition-all cursor-pointer ${
                      timelinePeriod === period.id
                        ? "bg-ground-800 text-sensor"
                        : "text-ground-400 hover:text-instrument"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsTimelinePlaying(!isTimelinePlaying)}
                className="h-8 w-8 rounded-full border border-ground-700 hover:border-ground-450 bg-ground-950 flex items-center justify-center text-sensor cursor-pointer"
              >
                {isTimelinePlaying ? "⏸" : "▶"}
              </button>
              
              {/* Slider */}
              <div className="flex-1 space-y-2">
                <input
                  type="range"
                  min={0}
                  max={timelineTicks[timelinePeriod].length - 1}
                  value={sliderIndex}
                  onChange={(e) => setSliderIndex(Number(e.target.value))}
                  className="w-full accent-sensor bg-ground-800 h-1 rounded-lg cursor-pointer"
                />
                
                {/* Labels */}
                <div className="flex justify-between text-[10px] text-ground-450 font-medium px-1">
                  {timelineTicks[timelinePeriod].map((tick, i) => (
                    <span
                      key={i}
                      className={i === sliderIndex ? "text-sensor font-bold" : ""}
                    >
                      {tick}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Dynamic AI Anomaly Insights Panel */}
          <Card className="p-4 bg-red-500/5 border border-red-500/20 text-xs rounded-xl flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-red-400 uppercase tracking-wider text-[10px]">Real-Time Climate Anomaly Alert</h4>
              <p className="text-ground-300 leading-relaxed">
                Emissia AI identified a significant +15.4% emission anomaly over the Vindhyachal Super Thermal complex comparing March 2026 data. Signal source matches Sentinel-5P column offsets. Recommendation: Schedule automated high-resolution spatial auditing.
              </p>
            </div>
          </Card>

          {/* Detail panels grid: Left = Facility details, Right = Export/Share */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Clicked Facility panel */}
            <Card className="p-5 bg-ground-900/20 border-ground-700/80 space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5 border-b border-ground-750 pb-2">
                <Info className="h-3.5 w-3.5" /> Industrial Facility Inspector
              </h3>
              {selectedFacility ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="text-sm font-semibold text-sensor">{selectedFacility.name}</h4>
                    <span className="text-[10px] text-ground-500">{selectedFacility.industry} · {selectedFacility.country}</span>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-[11px] border-t border-ground-800 pt-3">
                    <div>
                      <dt className="text-ground-400">Coordinates:</dt>
                      <dd className="font-mono text-instrument mt-0.5">
                        {selectedFacility.lat.toFixed(4)}, {selectedFacility.lon.toFixed(4)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ground-400">Emission signal:</dt>
                      <dd className="font-mono text-sensor font-bold mt-0.5">
                        +{selectedFacility.co2} ppm
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ground-400">AI Confidence:</dt>
                      <dd className="font-mono text-instrument mt-0.5">
                        {selectedFacility.confidence}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ground-400">Imaging Satellite:</dt>
                      <dd className="text-instrument mt-0.5">
                        {selectedFacility.satellite}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href="/reports"
                      className="px-3 py-2 bg-ground-800 hover:bg-ground-750 text-[10px] font-semibold text-instrument rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="h-3 w-3" /> View Report
                    </Link>
                    <button
                      onClick={() => alert("Redirecting to raw datasets archives...")}
                      className="px-3 py-2 bg-ground-800 hover:bg-ground-750 text-[10px] font-semibold text-instrument rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      Open Dataset
                    </button>
                    <button
                      onClick={() => alert("Emissia Copilot: Signal parameters look consistent with coal power combustion at scale.")}
                      className="px-3 py-2 bg-sensor/10 hover:bg-sensor/20 border border-sensor/25 text-[10px] font-semibold text-sensor rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Cpu className="h-3 w-3" /> Ask Copilot
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ground-500 py-6 text-center">
                  Click on any plant point or 3D column on the map to inspect its real-time parameters.
                </p>
              )}
            </Card>

            {/* Export and download card */}
            <Card className="p-5 bg-ground-900/20 border-ground-700/80 space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5 border-b border-ground-750 pb-2">
                <Download className="h-3.5 w-3.5" /> Export Data & Viewports
              </h3>
              <div className="space-y-3.5 text-xs text-ground-300">
                <p className="text-[11px] text-ground-450">Download currently filtered layers, geodetic coordinates, or 3D viewport renders.</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { format: "png", label: "PNG Image" },
                    { format: "pdf", label: "PDF Document" },
                    { format: "geojson", label: "GeoJSON File" },
                    { format: "tiff", label: "GeoTIFF bands" },
                    { format: "csv", label: "CSV Table" },
                  ].map((exp) => (
                    <button
                      key={exp.format}
                      onClick={() => handleExportMap(exp.format)}
                      className="px-2.5 py-1.5 bg-ground-800 hover:bg-ground-750 text-[11px] text-instrument font-semibold rounded-lg text-left flex items-center gap-2 cursor-pointer border border-ground-750"
                    >
                      <Download className="h-3 w-3 text-sensor" /> {exp.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Link Generation Overlay */}
      {shareLinkOpen && (
        <div className="fixed inset-0 z-50 bg-ground-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 bg-ground-900 border-ground-700 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-instrument">Generated Shareable Link</h3>
              <p className="text-xs text-ground-400">Includes active basemaps, layers, camera settings, and gas selections.</p>
            </div>
            <div className="p-3 bg-ground-950 border border-ground-750 rounded-lg font-mono text-[10px] text-sensor break-all select-all">
              {shareConfigLink}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareConfigLink);
                  alert("Link copied to clipboard!");
                }}
                className="px-4 py-2 bg-ground-800 hover:bg-ground-750 text-xs font-semibold rounded-lg text-instrument cursor-pointer"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShareLinkOpen(false)}
                className="px-4 py-2 bg-sensor hover:bg-sensor/90 text-ground-950 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
