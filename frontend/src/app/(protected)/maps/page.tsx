"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Globe, Layers2, PenTool, Search as SearchIcon, Share2, Download as DownloadIcon } from "lucide-react";

import { useHotspots, usePlants } from "@/features/maps/hooks/use-geo";
import { useMapStore } from "@/features/maps/store/map-store";
import { useMapUiStore, type LeftPanelId } from "@/features/maps/store/map-ui-store";
import { useDrawing } from "@/features/maps/hooks/use-drawing";
import { useMapExport } from "@/features/maps/hooks/use-map-export";
import { enrichPlants, buildFacilityHistoricalSeries, timeScaleFactor } from "@/features/maps/lib/enrich-plants";
import { buildSearchResults, type MapSearchResult } from "@/features/maps/lib/search";
import { DEFAULT_2D_VISUALIZATION_MODE, isModeSupported } from "@/features/maps/lib/visualization-mode-catalog";
import { DEFAULT_2D_BASEMAP, isBasemapSupported } from "@/features/maps/lib/basemap-catalog";

import { BasemapSelector } from "@/features/maps/components/layer-panel/basemap-selector";
import { GasLayerControls } from "@/features/maps/components/layer-panel/gas-layer-controls";
import { VisualizationModeSelector } from "@/features/maps/components/layer-panel/visualization-mode-selector";
import { LayerToggleOverlay, type ShowLayers } from "@/features/maps/components/layer-panel/layer-toggle-overlay";
import { IntensityLegend } from "@/features/maps/components/layer-panel/intensity-legend";
import { FacilitySearch } from "@/features/maps/components/search/facility-search";
import { DrawingToolbar } from "@/features/maps/components/gis-tools/drawing-toolbar";
import { TimelineBar, type TimelinePeriod } from "@/features/maps/components/timeline/timeline-bar";
import { ComparisonPanel, type ComparisonType } from "@/features/maps/components/comparison/comparison-panel";
import { InspectorDrawer, type InspectedFacility } from "@/features/maps/components/facility-inspector/inspector-drawer";
import { AlertsBadge, type MapAlert } from "@/features/maps/components/alerts/alerts-badge";
import { ExportMenu } from "@/features/maps/components/export-share/export-menu";
import { ShareDialog } from "@/features/maps/components/export-share/share-dialog";
import { ModeToggle } from "@/features/maps/components/map-controls/mode-toggle";

// Cesium loads on client and requires script files in head; both engines are ssr:false since they
// touch window/DOM APIs directly.
const EmissionMap = dynamic(() => import("@/features/maps/components/map-canvas/emission-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[40rem] items-center justify-center rounded-xl border border-ground-700 bg-ground-900/40 text-sm text-ground-400">
      Loading Cesium 3D Globe...
    </div>
  ),
});

const MapLibreMap = dynamic(() => import("@/features/maps/components/map-canvas/maplibre-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[40rem] items-center justify-center rounded-xl border border-ground-700 bg-ground-900/40 text-sm text-ground-400">
      Loading 2D map…
    </div>
  ),
});

const TIMELINE_TICKS: Record<TimelinePeriod, string[]> = {
  daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
  monthly: ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026"],
  yearly: ["2023", "2024", "2025", "2026"],
};

const DEFAULT_SHOW_LAYERS: ShowLayers = {
  plants: true,
  heatmap: true,
  contours: true,
  prediction: true,
  boundaries: false,
  roads: false,
  clouds: false,
};

const RAIL_ITEMS: { id: Exclude<LeftPanelId, null>; label: string; icon: typeof SearchIcon }[] = [
  { id: "search", label: "Search", icon: SearchIcon },
  { id: "layers", label: "Layers", icon: Globe },
  { id: "gas", label: "Gas Layers", icon: Layers2 },
  { id: "gis", label: "GIS Tools", icon: PenTool },
  { id: "export", label: "Export", icon: DownloadIcon },
];

export default function MapPage() {
  const { data: plants = [] } = usePlants();
  const { data: hotspots = [] } = useHotspots();
  const enrichedPlants = enrichPlants(plants);

  const { activeBasemap, setActiveBasemap, mapMode, setMapMode, selectedFacility, setSelectedFacility, gases, toggleGas, setGasOpacity } =
    useMapStore();
  const { activePanel, togglePanel, inspectorDrawerOpen, openInspectorDrawer, closeInspectorDrawer, alertsOpen, setAlertsOpen } =
    useMapUiStore();

  const [visualizationMode, setVisualizationMode] = useState("volume3d");
  // volume3d/animated modes have no 2D equivalent — fall back without mutating the stored
  // preference, so it's restored automatically when switching back to 3D.
  const effectiveVisualizationMode = isModeSupported(visualizationMode, mapMode)
    ? visualizationMode
    : DEFAULT_2D_VISUALIZATION_MODE;
  // Same non-mutating fallback for basemaps with no 2D equivalent (e.g. "Terrain 3D") — the
  // selector and both map engines all read this instead of the raw stored value.
  const effectiveBasemap = isBasemapSupported(activeBasemap, mapMode) ? activeBasemap : DEFAULT_2D_BASEMAP;
  const [showLayers, setShowLayers] = useState<ShowLayers>(DEFAULT_SHOW_LAYERS);

  const [timelinePeriod, setTimelinePeriod] = useState<TimelinePeriod>("monthly");
  const [sliderIndex, setSliderIndex] = useState(2);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const [searchQuery, setSearchQuery] = useState("");

  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparePredictionA, setComparePredictionA] = useState("pred-1");
  const [comparePredictionB, setComparePredictionB] = useState("pred-2");
  const [comparisonType, setComparisonType] = useState<ComparisonType>("split-screen");
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lon: number } | null>(null);

  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [shareConfigLink, setShareConfigLink] = useState("");
  const [geoJsonExportNote, setGeoJsonExportNote] = useState<string | null>(null);

  const drawing = useDrawing();

  const ticks = TIMELINE_TICKS[timelinePeriod];
  const timeFactor = timeScaleFactor(sliderIndex);
  const timeScaledHotspots = hotspots.map((h) => ({
    ...h,
    emission_tonnes_per_year: h.emission_tonnes_per_year ? Math.round(h.emission_tonnes_per_year * timeFactor) : 4500,
    intensity: Math.min(1.0, Math.max(0.1, h.intensity * timeFactor)),
  }));

  let inspectedFacility: InspectedFacility | null = null;
  if (selectedFacility) {
    const baseCo2 = selectedFacility.co2_enhancement_ppm || parseFloat(selectedFacility.co2) || 45.5;
    const historical = buildFacilityHistoricalSeries(baseCo2, ticks);
    const currentValue = historical[sliderIndex]?.value ?? baseCo2;
    inspectedFacility = {
      ...selectedFacility,
      latest_prediction: `${currentValue.toFixed(2)} ppm`,
      historical,
    };
  }

  const exportData = useMapExport(() => ({
    activeBasemap: effectiveBasemap,
    activeGasKeys: Object.keys(gases).filter((k) => gases[k].enabled),
    plants: enrichedPlants.map((p) => ({ name: p.name, lat: p.lat, lon: p.lon, sector: p.sector, latest_prediction: p.latest_prediction })),
    hotspots: timeScaledHotspots.map((h) => ({ lat: h.lat, lon: h.lon, emission_tonnes_per_year: h.emission_tonnes_per_year })),
    inspectedFacilityName: inspectedFacility?.name ?? null,
  }));

  // Autoplay simulation
  useEffect(() => {
    if (!isTimelinePlaying) return;
    const interval = setInterval(() => {
      setSliderIndex((idx) => (idx + 1) % ticks.length);
    }, 1500 / playbackSpeed);
    return () => clearInterval(interval);
  }, [isTimelinePlaying, playbackSpeed, ticks.length]);

  const searchResults = buildSearchResults(enrichedPlants, hotspots, searchQuery);

  const handleSelectSearchResult = (result: MapSearchResult) => {
    setSelectedFacility(result.raw);
    setSearchQuery(result.name);
    openInspectorDrawer();
  };

  const handleSelectAlert = (alert: MapAlert) => {
    setCameraTarget({ lat: alert.lat, lon: alert.lon });
    const match = enrichedPlants.find((p) => p.name.toLowerCase().includes(alert.facility.split(" ")[0].toLowerCase()));
    if (match) {
      setSelectedFacility(match);
      openInspectorDrawer();
    }
    setAlertsOpen(false);
  };

  const triggerMapShare = () => {
    const activeGasKeys = Object.keys(gases)
      .filter((k) => gases[k].enabled)
      .join(",");
    const cameraParams = `lat=22.50&lon=79.50&zoom=9&basemap=${effectiveBasemap}&gases=${activeGasKeys}`;
    setShareConfigLink(`https://co2-platform-nine.vercel.app/map?${cameraParams}`);
    setShareLinkOpen(true);
  };

  return (
    <div className="mx-auto max-w-[100rem] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
            Earth Observation Map
          </h1>
          <p className="mt-1 text-sm text-ground-400">Interactive 3D planetary tracking of industrial greenhouse gas emissions.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              comparisonMode ? "bg-sensor/10 border-sensor text-sensor" : "border-ground-700 hover:border-ground-400 text-ground-300 bg-ground-900/60"
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

      {/* Primary workspace: collapsible icon rail + flyout panel + full-bleed map */}
      <div className="flex items-start gap-3">
        {/* Icon rail */}
        <div className="flex flex-col gap-1.5 bg-ground-900/60 border border-ground-700/80 rounded-xl p-1.5 shrink-0">
          {RAIL_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => togglePanel(id)}
              title={label}
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                activePanel === id ? "bg-sensor/10 text-sensor" : "text-ground-400 hover:bg-ground-850 hover:text-instrument"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Flyout panel — only one open at a time */}
        {activePanel && (
          <div className="w-72 shrink-0 space-y-4 animate-in fade-in slide-in-from-left-2 duration-150">
            {activePanel === "search" && (
              <FacilitySearch query={searchQuery} onQueryChange={setSearchQuery} results={searchResults} onSelect={handleSelectSearchResult} />
            )}
            {activePanel === "layers" && (
              <>
                <BasemapSelector activeBasemap={effectiveBasemap} mapMode={mapMode} onSelect={setActiveBasemap} />
                <VisualizationModeSelector selectedMode={effectiveVisualizationMode} mapMode={mapMode} onSelect={setVisualizationMode} />
              </>
            )}
            {activePanel === "gas" && <GasLayerControls gases={gases} onToggle={toggleGas} onOpacityChange={setGasOpacity} />}
            {activePanel === "gis" && (
              <DrawingToolbar
                drawingMode={drawing.drawingMode}
                onToggleTool={drawing.toggleDrawingMode}
                liveMeasurement={drawing.liveMeasurement}
                completedDrawings={drawing.completedDrawings}
                onRemoveDrawing={drawing.removeDrawing}
                onClearAll={drawing.clearDrawings}
                onExportGeoJSON={() => {
                  const result = drawing.exportGeoJSON();
                  setGeoJsonExportNote(result.ok ? "Drawings exported as GeoJSON." : result.reason);
                  setTimeout(() => setGeoJsonExportNote(null), 4000);
                }}
                exportStatus={geoJsonExportNote}
              />
            )}
            {activePanel === "export" && (
              <ExportMenu activeFormat={exportData.activeFormat} progress={exportData.progress} history={exportData.history} onExport={exportData.triggerExport} />
            )}
          </div>
        )}

        {/* Map + timeline column */}
        <div className="flex-1 space-y-4 min-w-0">
          {comparisonMode && (
            <ComparisonPanel
              comparisonType={comparisonType}
              onComparisonTypeChange={setComparisonType}
              predictionA={comparePredictionA}
              onPredictionAChange={setComparePredictionA}
              predictionB={comparePredictionB}
              onPredictionBChange={setComparePredictionB}
            />
          )}

          <div className="relative h-[42rem]">
            {mapMode === "2d" ? (
              <MapLibreMap
                plants={enrichedPlants}
                hotspots={timeScaledHotspots}
                showPlants={showLayers.plants}
                showHotspots={showLayers.heatmap}
                selectedMode={effectiveVisualizationMode}
                activeBasemap={effectiveBasemap}
                onSelectFacility={(fac) => {
                  setSelectedFacility(fac);
                  openInspectorDrawer();
                }}
                drawingMode={drawing.drawingMode}
                comparisonMode={comparisonMode}
                showLayers={showLayers}
                onDrawingComplete={drawing.addDrawing}
                onLiveMeasurement={drawing.setLiveMeasurement}
                clearTrigger={drawing.clearTrigger}
                comparisonType={comparisonType}
                cameraTarget={cameraTarget}
              />
            ) : (
              <EmissionMap
                plants={enrichedPlants}
                hotspots={timeScaledHotspots}
                showPlants={showLayers.plants}
                showHotspots={showLayers.heatmap}
                selectedMode={effectiveVisualizationMode}
                activeBasemap={effectiveBasemap}
                onSelectFacility={(fac) => {
                  setSelectedFacility(fac);
                  openInspectorDrawer();
                }}
                drawingMode={drawing.drawingMode}
                comparisonMode={comparisonMode}
                showLayers={showLayers}
                onDrawingComplete={drawing.addDrawing}
                onLiveMeasurement={drawing.setLiveMeasurement}
                clearTrigger={drawing.clearTrigger}
                comparisonType={comparisonType}
                cameraTarget={cameraTarget}
              />
            )}

            <ModeToggle mode={mapMode} onChange={setMapMode} />
            <AlertsBadge open={alertsOpen} onToggle={() => setAlertsOpen(!alertsOpen)} onSelectAlert={handleSelectAlert} />
            <LayerToggleOverlay showLayers={showLayers} onChange={setShowLayers} />
            <IntensityLegend timeFactor={timeFactor} />
          </div>

          <TimelineBar
            period={timelinePeriod}
            onPeriodChange={(p) => {
              setTimelinePeriod(p);
              setSliderIndex(0);
            }}
            ticks={ticks}
            sliderIndex={sliderIndex}
            onSliderChange={setSliderIndex}
            isPlaying={isTimelinePlaying}
            onTogglePlay={() => setIsTimelinePlaying(!isTimelinePlaying)}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
          />
        </div>
      </div>

      <InspectorDrawer
        open={inspectorDrawerOpen}
        onClose={closeInspectorDrawer}
        facility={inspectedFacility}
        timelinePeriod={timelinePeriod}
        sliderIndex={sliderIndex}
      />

      <ShareDialog open={shareLinkOpen} link={shareConfigLink} onClose={() => setShareLinkOpen(false)} />
    </div>
  );
}
