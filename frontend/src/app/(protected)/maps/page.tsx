"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Globe, Layers2, Filter, PenTool, Download as DownloadIcon } from "lucide-react";

import { useAnalytics, useHotspots, usePlants } from "@/features/maps/hooks/use-geo";
import { useMapStore } from "@/features/maps/store/map-store";
import { useMapUiStore, type LeftPanelId } from "@/features/maps/store/map-ui-store";
import { useDrawing } from "@/features/maps/hooks/use-drawing";
import { useMapExport } from "@/features/maps/hooks/use-map-export";
import {
  enrichPlants,
  attachNearestSector,
  dedupePlantsByLocation,
  buildFacilityHistoricalSeries,
  timeScaleFactor,
} from "@/features/maps/lib/enrich-plants";
import { buildFacilityList, buildSearchResults, type MapSearchResult } from "@/features/maps/lib/search";
import { fetchStateBoundaries, searchStateBoundaries, type RegionBoundary } from "@/features/maps/lib/regions";
import { pointInPolygon } from "@/features/maps/components/gis-tools/lib/geo-math";
import { DEFAULT_2D_VISUALIZATION_MODE, isModeSupported } from "@/features/maps/lib/visualization-mode-catalog";
import { DEFAULT_2D_BASEMAP, isBasemapSupported } from "@/features/maps/lib/basemap-catalog";
import { buildShareLink } from "@/features/maps/lib/share-link";

import { MapToolbar } from "@/features/maps/components/toolbar/map-toolbar";
import { MapSidebar } from "@/features/maps/components/toolbar/map-sidebar";
import { MapSummaryCard } from "@/features/maps/components/summary/map-summary-card";
import { BasemapSelector } from "@/features/maps/components/layer-panel/basemap-selector";
import { GasLayerControls } from "@/features/maps/components/layer-panel/gas-layer-controls";
import { FacilityFilterPanel, applyFacilityFilters, toggleInSet } from "@/features/maps/components/layer-panel/facility-filter-panel";
import { VisualizationModeSelector } from "@/features/maps/components/layer-panel/visualization-mode-selector";
import { LayerToggleOverlay, type ShowLayers } from "@/features/maps/components/layer-panel/layer-toggle-overlay";
import { CloudsOverlay } from "@/features/maps/components/layer-panel/clouds-overlay";
import { IntensityLegend } from "@/features/maps/components/layer-panel/intensity-legend";
import { DrawingToolbar } from "@/features/maps/components/gis-tools/drawing-toolbar";
import { TimelineBar, type TimelinePeriod } from "@/features/maps/components/timeline/timeline-bar";
import { ComparisonPanel, type ComparisonType } from "@/features/maps/components/comparison/comparison-panel";
import { InspectorDrawer, type InspectedFacility } from "@/features/maps/components/facility-inspector/inspector-drawer";
import { AlertsBadge, type MapAlert } from "@/features/maps/components/alerts/alerts-badge";
import { ExportMenu } from "@/features/maps/components/export-share/export-menu";
import { ShareDialog } from "@/features/maps/components/export-share/share-dialog";

// MapLibre touches window/DOM APIs directly and drives both the flat (mercator) and globe
// projections — see KI-004 in KNOWN_ISSUES.md for why the separate Cesium 3D engine was retired.
const MapCanvas = dynamic(() => import("@/features/maps/components/map-canvas/maplibre-map"), {
  ssr: false,
  loading: () => (
    <div className="glass flex h-[40rem] items-center justify-center rounded-xl text-sm text-ground-400">
      Loading map…
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
  heatmap: false,
  contours: true,
  prediction: true,
  boundaries: false,
  roads: false,
  clouds: false,
  population: false,
};

const PANEL_TABS: { id: Exclude<LeftPanelId, null>; label: string; icon: typeof Globe }[] = [
  { id: "layers", label: "Layers & Basemaps", icon: Globe },
  { id: "gas", label: "Gas Layers", icon: Layers2 },
  { id: "filters", label: "Facility Filters", icon: Filter },
  { id: "gis", label: "GIS Tools", icon: PenTool },
  { id: "export", label: "Export", icon: DownloadIcon },
];

export default function MapPage() {
  const { data: plants = [] } = usePlants();
  const { data: hotspots = [] } = useHotspots();
  const { data: analytics } = useAnalytics();
  const enrichedPlants = enrichPlants(plants);

  const [filterCountries, setFilterCountries] = useState<Set<string>>(new Set());
  const [filterFuelTypes, setFilterFuelTypes] = useState<Set<string>>(new Set());
  const filteredPlants = applyFacilityFilters(enrichedPlants, filterCountries, filterFuelTypes);

  const { camera, activeBasemap, setActiveBasemap, mapMode, setMapMode, selectedFacility, setSelectedFacility, gases, toggleGas, setGasOpacity } =
    useMapStore();
  const { activePanel, setActivePanel, inspectorDrawerOpen, openInspectorDrawer, closeInspectorDrawer, alertsOpen, setAlertsOpen } =
    useMapUiStore();

  const [visualizationMode, setVisualizationMode] = useState("volume3d");
  // volume3d/animated modes have no 2D equivalent — fall back without mutating the stored
  // preference, so it's restored automatically when switching back to 3D.
  const effectiveVisualizationMode = isModeSupported(visualizationMode, mapMode)
    ? visualizationMode
    : DEFAULT_2D_VISUALIZATION_MODE;
  // Same non-mutating fallback for basemaps with no 2D equivalent — the selector and both map
  // engines all read this instead of the raw stored value.
  const effectiveBasemap = isBasemapSupported(activeBasemap, mapMode) ? activeBasemap : DEFAULT_2D_BASEMAP;
  const [showLayers, setShowLayers] = useState<ShowLayers>(DEFAULT_SHOW_LAYERS);
  const [legendOpen, setLegendOpen] = useState(true);
  // "sector" colors plants/plumes/extrusion by industrial sector (Climate TRACE-style) instead
  // of gas-intensity; additive alternate mode, see colorMode prop docs on MapLibreMap.
  const [colorMode, setColorMode] = useState<"gas" | "sector">("gas");

  const [timelinePeriod, setTimelinePeriod] = useState<TimelinePeriod>("monthly");
  const [sliderIndex, setSliderIndex] = useState(2);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(TIMELINE_TICKS.yearly[TIMELINE_TICKS.yearly.length - 1]);

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
  const sectorizedHotspots = attachNearestSector(timeScaledHotspots, filteredPlants);

  let inspectedFacility: InspectedFacility | null = null;
  if (selectedFacility) {
    const baseCo2 = selectedFacility.co2_enhancement_ppm || parseFloat(String(selectedFacility.co2)) || 45.5;
    const historical = buildFacilityHistoricalSeries(baseCo2, ticks);
    const currentValue = historical[sliderIndex]?.value ?? baseCo2;
    inspectedFacility = {
      ...selectedFacility,
      name: selectedFacility.name ?? "Unknown facility",
      latest_prediction: `${currentValue.toFixed(2)} ppm`,
      historical,
    };
  }

  const exportData = useMapExport(() => ({
    activeBasemap: effectiveBasemap,
    activeGasKeys: Object.keys(gases).filter((k) => gases[k].enabled),
    plants: filteredPlants.map((p) => ({ name: p.name, lat: p.lat, lon: p.lon, sector: p.sector, latest_prediction: p.latest_prediction })),
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

  const [selectedRegion, setSelectedRegion] = useState<RegionBoundary | null>(null);
  const regionFilteredCount = selectedRegion
    ? filteredPlants.filter((p) => pointInPolygon({ lat: p.lat, lon: p.lon }, selectedRegion.geometry)).length
    : filteredPlants.length;

  // Once a country is selected, its prefetched state/province boundaries (see
  // handleSelectSearchResult) become searchable too - e.g. typing "Maharashtra" after selecting
  // India surfaces it here alongside the usual plant/hotspot/country matches.
  const stateResults: MapSearchResult[] =
    selectedRegion?.type === "country" && selectedRegion.iso3
      ? searchStateBoundaries(selectedRegion.iso3, searchQuery).map((s) => ({
          type: "region" as const,
          id: `region-state-${s.name}`,
          name: s.name,
          country: selectedRegion.name,
          details: `${selectedRegion.name} · State boundary`,
          lat: (s.bbox[1] + s.bbox[3]) / 2,
          lon: (s.bbox[0] + s.bbox[2]) / 2,
          raw: s,
        }))
      : [];
  const searchResults = [...stateResults, ...buildSearchResults(filteredPlants, hotspots, searchQuery)];
  const allFacilities = buildFacilityList(filteredPlants);

  const handleSelectSearchResult = (result: MapSearchResult) => {
    if (result.type === "region") {
      const region = result.raw as RegionBoundary;
      setSelectedRegion(region);
      setSearchQuery(result.name);
      // Prefetches this country's state/province boundaries into regions.ts's in-memory cache so
      // that typing a state name next (e.g. after selecting "India") can resolve immediately via
      // searchStateBoundaries - fire-and-forget, a failed/unavailable fetch just means no
      // state-level results show up later, not a broken search.
      if (region.type === "country" && region.iso3) {
        fetchStateBoundaries(region.iso3).catch(() => {});
      }
      return;
    }
    setSelectedRegion(null);
    setSelectedFacility(result.raw);
    setSearchQuery(result.name);
    setCameraTarget({ lat: result.lat, lon: result.lon });
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
    const activeGasKeys = Object.keys(gases).filter((k) => gases[k].enabled);
    setShareConfigLink(
      buildShareLink({ camera, mapMode, basemap: effectiveBasemap, activeGasKeys })
    );
    setShareLinkOpen(true);
  };

  // Toolbar's fuel-type dropdown is a single-select convenience over the same filterFuelTypes
  // state the (multi-select) Facility Filters flyout panel uses — picking one here replaces
  // whatever the flyout had selected, rather than adding a second, disconnected filter mechanism.
  const fuelTypeOptions = Array.from(new Set(enrichedPlants.map((p) => p.fuel_type))).sort();
  const toolbarFuelType = filterFuelTypes.size === 1 ? Array.from(filterFuelTypes)[0] : "all";
  const handleToolbarFuelType = (fuelType: string) => {
    setFilterFuelTypes(fuelType === "all" ? new Set() : new Set([fuelType]));
  };

  // Toolbar's gas dropdown is a single-active-gas convenience (closer to Climate TRACE's "one gas
  // at a time" UX) layered over the same multi-gas `gases` store the Gas Layers flyout panel
  // fully controls — selecting one here enables it and disables the rest.
  const enabledGasIds = Object.keys(gases).filter((k) => gases[k].enabled);
  const toolbarPrimaryGas = enabledGasIds.length === 1 ? enabledGasIds[0] : (enabledGasIds[0] ?? "co2");
  const handleToolbarPrimaryGas = (gasId: string) => {
    Object.keys(gases).forEach((key) => {
      if (key === gasId && !gases[key].enabled) toggleGas(key);
      if (key !== gasId && gases[key].enabled) toggleGas(key);
    });
  };

  return (
    <div className="mx-auto max-w-[100rem] space-y-3">
      <MapToolbar
        menuOpen={!!activePanel}
        onToggleMenu={() => setActivePanel(activePanel ? null : "layers")}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setSelectedRegion(null);
        }}
        searchResults={searchResults}
        allFacilities={allFacilities}
        onSelectSearchResult={handleSelectSearchResult}
        fuelTypeOptions={fuelTypeOptions}
        selectedFuelType={toolbarFuelType}
        onSelectFuelType={handleToolbarFuelType}
        years={TIMELINE_TICKS.yearly}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        primaryGas={toolbarPrimaryGas}
        onSelectPrimaryGas={handleToolbarPrimaryGas}
        colorMode={colorMode}
        onColorModeChange={setColorMode}
        mapMode={mapMode}
        onMapModeChange={setMapMode}
        comparisonMode={comparisonMode}
        onToggleComparison={() => setComparisonMode(!comparisonMode)}
        onShare={triggerMapShare}
      />

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
        <MapSidebar
          open={!!activePanel}
          onClose={() => setActivePanel(null)}
          activePanel={activePanel}
          onSelectPanel={setActivePanel}
          sections={PANEL_TABS}
        >
          {activePanel === "layers" && (
            <>
              <BasemapSelector activeBasemap={effectiveBasemap} mapMode={mapMode} onSelect={setActiveBasemap} />
              <LayerToggleOverlay showLayers={showLayers} onChange={setShowLayers} />
            </>
          )}
          {activePanel === "gas" && <GasLayerControls gases={gases} onToggle={toggleGas} onOpacityChange={setGasOpacity} />}
          {activePanel === "filters" && (
            <FacilityFilterPanel
              plants={enrichedPlants}
              selectedCountries={filterCountries}
              selectedFuelTypes={filterFuelTypes}
              onToggleCountry={(country) => setFilterCountries((prev) => toggleInSet(prev, country))}
              onToggleFuelType={(fuelType) => setFilterFuelTypes((prev) => toggleInSet(prev, fuelType))}
              onClear={() => {
                setFilterCountries(new Set());
                setFilterFuelTypes(new Set());
              }}
            />
          )}
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
        </MapSidebar>

        <MapCanvas
          plants={dedupePlantsByLocation(filteredPlants)}
          hotspots={sectorizedHotspots}
          showPlants={showLayers.plants}
          showHotspots={showLayers.heatmap}
          selectedMode={effectiveVisualizationMode}
          activeBasemap={effectiveBasemap}
          colorMode={colorMode}
          onSelectFacility={(fac) => {
            setSelectedFacility(fac);
            if (fac.lat != null && fac.lon != null) {
              setCameraTarget({ lat: fac.lat, lon: fac.lon });
            }
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
          regionBoundary={selectedRegion}
          legendOn={legendOpen}
          onToggleLegend={() => setLegendOpen((v) => !v)}
        />

        <div className="absolute top-4 right-4 z-20">
          <VisualizationModeSelector
            variant="compact"
            selectedMode={effectiveVisualizationMode}
            mapMode={mapMode}
            onSelect={setVisualizationMode}
          />
        </div>

        <AlertsBadge open={alertsOpen} onToggle={() => setAlertsOpen(!alertsOpen)} onSelectAlert={handleSelectAlert} />
        {legendOpen && <IntensityLegend gases={gases} showGasLayer={showLayers.heatmap} />}
        {showLayers.clouds && <CloudsOverlay />}

        <MapSummaryCard
          analytics={analytics}
          sourceCount={regionFilteredCount}
          periodLabel={selectedRegion ? `${selectedRegion.name}` : selectedYear}
        />
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
