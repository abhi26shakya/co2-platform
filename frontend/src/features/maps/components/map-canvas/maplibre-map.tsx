"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Compass } from "lucide-react";
import { useMapStore, type SelectedFacility } from "@/features/maps/store/map-store";
import type { MapHotspot, PlantOut } from "@/types/geo";
import { CameraControls } from "@/features/maps/components/map-controls/camera-controls";
import { BASEMAP_TILES, OVERLAY_TILES } from "@/features/maps/lib/basemap-tiles";
import { getGasColorHex, getGasPlumes, resolveComparisonColorHex } from "@/features/maps/lib/gas-plume";
import {
  buildCircleResult,
  buildPickerResult,
  buildPolygonResult,
  buildPolylineResult,
  buildRectangleResult,
  hasMinimumPoints,
  haversineDistanceM,
  pointsRemaining,
  type CompletedDrawing,
  type GeoFeature,
} from "@/features/maps/components/gis-tools/lib/geo-math";
import type { DrawingMode } from "@/features/maps/hooks/use-drawing";
import type { ShowLayers } from "@/features/maps/components/layer-panel/layer-toggle-overlay";

interface Props {
  plants: PlantOut[];
  hotspots: MapHotspot[];
  showPlants: boolean;
  showHotspots: boolean;
  selectedMode?: string;
  activeBasemap?: string;
  onSelectFacility?: (fac: SelectedFacility) => void;
  drawingMode?: DrawingMode;
  comparisonMode?: boolean;
  showLayers?: ShowLayers;
  onDrawingComplete?: (draw: CompletedDrawing) => void;
  onLiveMeasurement?: (text: string | null) => void;
  clearTrigger?: number;
  comparisonType?: string;
  cameraTarget?: { lat: number; lon: number } | null;
}

const PLANTS_SOURCE = "plants-source";
const PLUME_SOURCE = "plume-source";
const DRAFT_SOURCE = "gis-draft-source";
const COMPLETED_SOURCE = "gis-completed-source";
const BOUNDARIES_SOURCE = "boundaries-overlay-source";
const ROADS_SOURCE = "roads-overlay-source";

/** Builds a raster style for the given basemap id — mirrors the tile choices in the Cesium engine. */
function buildBasemapStyle(basemapId: string): maplibregl.StyleSpecification {
  const tiles = BASEMAP_TILES[basemapId] ?? BASEMAP_TILES.dark;
  const sources: Record<string, maplibregl.RasterSourceSpecification> = {};
  const layers: maplibregl.LayerSpecification[] = [];

  tiles.forEach((tileUrl, i) => {
    const sourceId = `basemap-source-${i}`;
    sources[sourceId] = { type: "raster", tiles: [tileUrl], tileSize: 256 };
    layers.push({ id: `basemap-layer-${i}`, type: "raster", source: sourceId });
  });

  return { version: 8, sources, layers };
}

function addDataLayers(map: maplibregl.Map) {
  if (!map.getSource(PLANTS_SOURCE)) {
    map.addSource(PLANTS_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "plants-circle",
      type: "circle",
      source: PLANTS_SOURCE,
      paint: {
        "circle-radius": 6,
        "circle-color": "#10b981",
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 1.5,
      },
    });
    map.addLayer({
      id: "plants-prediction-label",
      type: "symbol",
      source: PLANTS_SOURCE,
      layout: {
        visibility: "none",
        "text-field": ["concat", ["get", "name"], "\n", ["get", "co2"], " ppm"],
        "text-size": 10,
        "text-offset": [0, 1.2],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#e2e8f0",
        "text-halo-color": "#09090b",
        "text-halo-width": 1.2,
      },
    });
  }

  // Overlay-only raster layers (LayerToggleOverlay's boundaries/roads checkboxes) — independent
  // of basemap choice, composited above it at reduced alpha.
  if (!map.getSource(BOUNDARIES_SOURCE)) {
    map.addSource(BOUNDARIES_SOURCE, { type: "raster", tiles: [OVERLAY_TILES.boundaries], tileSize: 256 });
    map.addLayer({ id: "boundaries-overlay", type: "raster", source: BOUNDARIES_SOURCE, layout: { visibility: "none" } });
  }
  if (!map.getSource(ROADS_SOURCE)) {
    map.addSource(ROADS_SOURCE, { type: "raster", tiles: [OVERLAY_TILES.roads], tileSize: 256 });
    map.addLayer({
      id: "roads-overlay",
      type: "raster",
      source: ROADS_SOURCE,
      layout: { visibility: "none" },
      paint: { "raster-opacity": 0.35 },
    });
  }

  if (!map.getSource(PLUME_SOURCE)) {
    map.addSource(PLUME_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "gas-heatmap",
      type: "heatmap",
      source: PLUME_SOURCE,
      layout: { visibility: "none" },
      paint: {
        // heatmap-opacity has no data-driven (per-feature) variant in the MapLibre style spec —
        // unlike heatmap-weight/-radius, it only accepts a constant or a zoom expression. Fold each
        // gas layer's configured opacity into the weight instead, so per-gas opacity still shows.
        "heatmap-weight": ["*", ["get", "intensity"], ["get", "opacity"]],
        "heatmap-intensity": 1,
        "heatmap-radius": 28,
        "heatmap-opacity": 0.85,
      },
    });
    map.addLayer({
      id: "gas-markers",
      type: "circle",
      source: PLUME_SOURCE,
      layout: { visibility: "none" },
      paint: {
        "circle-radius": 7,
        "circle-color": ["get", "color"],
        "circle-opacity": ["get", "opacity"],
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 1.5,
      },
    });
    map.addLayer({
      id: "gas-contour-outer",
      type: "circle",
      source: PLUME_SOURCE,
      layout: { visibility: "none" },
      paint: {
        "circle-radius": 16,
        "circle-color": "transparent",
        "circle-stroke-color": ["get", "color"],
        "circle-stroke-width": 1.5,
        "circle-stroke-opacity": ["*", ["get", "opacity"], 0.45],
      },
    });
    map.addLayer({
      id: "gas-contour-inner",
      type: "circle",
      source: PLUME_SOURCE,
      layout: { visibility: "none" },
      paint: {
        "circle-radius": 8,
        "circle-color": "transparent",
        "circle-stroke-color": ["get", "color"],
        "circle-stroke-width": 2.5,
        "circle-stroke-opacity": ["*", ["get", "opacity"], 0.95],
      },
    });
  }

  if (!map.getSource(COMPLETED_SOURCE)) {
    map.addSource(COMPLETED_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "gis-completed-fill",
      type: "fill",
      source: COMPLETED_SOURCE,
      filter: ["==", ["geometry-type"], "Polygon"],
      paint: { "fill-color": "#ef4444", "fill-opacity": 0.2 },
    });
    map.addLayer({
      id: "gis-completed-line",
      type: "line",
      source: COMPLETED_SOURCE,
      filter: ["!=", ["geometry-type"], "Point"],
      paint: { "line-color": "#ef4444", "line-width": 2.5 },
    });
    map.addLayer({
      id: "gis-completed-point",
      type: "circle",
      source: COMPLETED_SOURCE,
      filter: ["==", ["geometry-type"], "Point"],
      paint: { "circle-radius": 6, "circle-color": "#10b981", "circle-stroke-color": "#000000", "circle-stroke-width": 2 },
    });
  }

  if (!map.getSource(DRAFT_SOURCE)) {
    map.addSource(DRAFT_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "gis-draft-line",
      type: "line",
      source: DRAFT_SOURCE,
      filter: ["!=", ["geometry-type"], "Point"],
      paint: { "line-color": "#ef4444", "line-width": 2 },
    });
    map.addLayer({
      id: "gis-draft-point",
      type: "circle",
      source: DRAFT_SOURCE,
      filter: ["==", ["geometry-type"], "Point"],
      paint: { "circle-radius": 5, "circle-color": "#ef4444" },
    });
  }
}

export default function MapLibreMap({
  plants,
  hotspots,
  showPlants,
  showHotspots,
  selectedMode = "heatmap",
  activeBasemap = "dark",
  onSelectFacility = () => {},
  drawingMode = "none",
  comparisonMode = false,
  showLayers = { plants: true, heatmap: true, contours: true, prediction: true, boundaries: false, roads: false, clouds: false },
  onDrawingComplete = () => {},
  onLiveMeasurement = () => {},
  clearTrigger = 0,
  comparisonType = "split-screen",
  cameraTarget = null,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const completedShapesRef = useRef<GeoFeature[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);

  const { camera, setCamera, selectedFacility, setSelectedFacility, gases } = useMapStore();

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const storeCam = useMapStore.getState().camera;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildBasemapStyle("dark"),
      center: [storeCam.lon, storeCam.lat],
      zoom: storeCam.zoom,
      pitch: 0,
      bearing: storeCam.bearing,
      attributionControl: false,
      // Needed so canvas.toBlob()/toDataURL() (PNG export) doesn't read a blanked buffer —
      // WebGL clears the drawing buffer after each frame by default.
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });

    map.on("load", () => {
      addDataLayers(map);
      setMapReady(true);
    });

    map.on("mousemove", (e: maplibregl.MapMouseEvent) => setMouseCoords({ lat: e.lngLat.lat, lon: e.lngLat.lng }));
    map.on("mouseout", () => setMouseCoords(null));

    map.on("moveend", () => {
      // Deliberately omits pitch: MapLibre's 0-60 "tilt toward horizon" pitch and Cesium's
      // -90..90 "look direction" pitch are different conventions over the same store field —
      // writing this engine's value would corrupt the other engine's camera orientation on the
      // next mode switch. Cesium owns `camera.pitch`; this engine tracks its own tilt locally.
      setCamera({
        lat: map.getCenter().lat,
        lon: map.getCenter().lng,
        zoom: map.getZoom(),
        bearing: map.getBearing(),
      });
    });

    const handlePick = (e: maplibregl.MapLayerMouseEvent) => {
      const props = e.features?.[0]?.properties;
      if (props) {
        onSelectFacility(props);
        setSelectedFacility(props);
      }
    };
    map.on("click", "plants-circle", handlePick);
    map.on("click", "gas-markers", handlePick);
    map.on("click", "gas-contour-inner", handlePick);
    map.on("click", "gas-contour-outer", handlePick);

    mapRef.current = map;

    // MapLibre bakes in the container's size at construction time; if that size changes later
    // (side flyout opening/closing, a mode-toggle reflow, or the container simply not having its
    // final layout size yet on first paint) the canvas keeps rendering at the stale size — it can
    // go fully blank until something calls resize(). Watch the container directly.
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Basemap swap
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const applyStyle = () => {
      map.setStyle(buildBasemapStyle(activeBasemap));
      map.once("styledata", () => addDataLayers(map));
    };
    applyStyle();
  }, [activeBasemap, mapReady]);

  // Fly to selected facility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !selectedFacility) return;

    const lat = selectedFacility.lat ?? selectedFacility.latitude;
    const lon = selectedFacility.lon ?? selectedFacility.longitude;
    if (lat != null && lon != null) {
      map.flyTo({ center: [lon, lat], zoom: Math.max(map.getZoom(), 9), duration: 2500 });
    }
  }, [selectedFacility, mapReady]);

  // Fly to alert camera target
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !cameraTarget) return;
    map.flyTo({ center: [cameraTarget.lon, cameraTarget.lat], zoom: Math.max(map.getZoom(), 10), duration: 2000 });
  }, [cameraTarget, mapReady]);

  // Render plants + gas plumes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const plantsSource = map.getSource(PLANTS_SOURCE) as maplibregl.GeoJSONSource | undefined;
    const plumeSource = map.getSource(PLUME_SOURCE) as maplibregl.GeoJSONSource | undefined;
    if (!plantsSource || !plumeSource) return;

    const showPlantLayer = showPlants && showLayers.plants;
    plantsSource.setData({
      type: "FeatureCollection",
      features: showPlantLayer
        ? plants.map((p) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [p.lon, p.lat] },
            properties: {
              name: p.name,
              industry: p.fuel_type || "Energy Production",
              country: p.country,
              lat: p.lat,
              lon: p.lon,
              co2: p.co2_enhancement_ppm ? p.co2_enhancement_ppm.toFixed(2) : "—",
              confidence: p.co2_soundings ? "91%" : "n/a",
              satellite: "Sentinel-5P",
              dataset: "Sentinel-5P scene",
            },
          }))
        : [],
    });

    const showPlumeLayer = showHotspots && showLayers.heatmap;
    const plumeFeatures: GeoJSON.Feature[] = [];
    if (showPlumeLayer) {
      const activeGasKeys = Object.keys(gases).filter((k) => gases[k].enabled);
      activeGasKeys.forEach((gasKey) => {
        const config = gases[gasKey];
        const plumes = getGasPlumes(gasKey, hotspots);
        plumes.forEach((plume) => {
          const valueNorm = Math.min(1, plume.intensity);
          const baseColorHex = getGasColorHex(gasKey, valueNorm);
          const colorHex = resolveComparisonColorHex(baseColorHex, plume, comparisonMode, comparisonType);
          plumeFeatures.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [plume.lon, plume.lat] },
            properties: {
              name: `Detected ${gasKey.toUpperCase()} Plume`,
              industry: `Greenhouse Gas Source: ${gasKey.toUpperCase()}`,
              country: "India",
              lat: plume.lat,
              lon: plume.lon,
              co2: `${plume.value.toFixed(1)} ${plume.unit}`,
              confidence: `${Math.round(plume.intensity * 100)}%`,
              satellite: "Sentinel-5P",
              dataset: "Prediction Scene",
              color: colorHex,
              opacity: config.opacity,
              intensity: valueNorm,
            },
          });
        });
      });
    }
    plumeSource.setData({ type: "FeatureCollection", features: plumeFeatures });

    const activeGasPlumeLayer =
      selectedMode === "markers" ? "gas-markers" : selectedMode === "contours" ? "contours" : "gas-heatmap";
    const visibility = (id: string, show: boolean) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", show ? "visible" : "none");
    };
    visibility("gas-heatmap", showPlumeLayer && activeGasPlumeLayer === "gas-heatmap");
    visibility("gas-markers", showPlumeLayer && activeGasPlumeLayer === "gas-markers");
    // "contours" is both a full render mode and an always-on overlay toggle (showLayers.contours) —
    // show the ring layers whenever either wants them.
    const showContourRings = showPlumeLayer && (activeGasPlumeLayer === "contours" || showLayers.contours);
    visibility("gas-contour-inner", showContourRings);
    visibility("gas-contour-outer", showContourRings);

    visibility("plants-prediction-label", showPlantLayer && showLayers.prediction);
    visibility("boundaries-overlay", showLayers.boundaries);
    visibility("roads-overlay", showLayers.roads);
  }, [plants, hotspots, showPlants, showHotspots, selectedMode, showLayers, gases, comparisonMode, comparisonType, mapReady]);

  const syncCompletedShapes = () => {
    const map = mapRef.current;
    const source = map?.getSource(COMPLETED_SOURCE) as maplibregl.GeoJSONSource | undefined;
    source?.setData({
      type: "FeatureCollection",
      features: completedShapesRef.current,
    } as unknown as GeoJSON.FeatureCollection);
  };

  // Clear completed drawings
  useEffect(() => {
    completedShapesRef.current = [];
    syncCompletedShapes();
  }, [clearTrigger]);

  // GIS drawing/measurement tools — geometry & GeoJSON assembly delegated to gis-tools/lib/geo-math.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || drawingMode === "none") return;

    const draftSource = () => map.getSource(DRAFT_SOURCE) as maplibregl.GeoJSONSource | undefined;
    const setDraft = (features: GeoJSON.Feature[]) => draftSource()?.setData({ type: "FeatureCollection", features });

    let activePoints: { lat: number; lon: number }[] = [];
    let anchorPoint: { lat: number; lon: number } | null = null;
    let isDrawing = false;

    const needsDblClickDisabled = drawingMode === "polyline" || drawingMode === "distance" || drawingMode === "polygon" || drawingMode === "area";
    if (needsDblClickDisabled) map.doubleClickZoom.disable();

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      const coords = { lat: e.lngLat.lat, lon: e.lngLat.lng };
      const uuid = Math.random().toString(36).substring(2, 9);

      if (drawingMode === "picker") {
        const result = buildPickerResult(coords, uuid);
        completedShapesRef.current.push(result.geojson);
        syncCompletedShapes();
        onDrawingComplete(result);
        return;
      }

      if (drawingMode === "rectangle" || drawingMode === "circle") {
        if (!isDrawing) {
          isDrawing = true;
          anchorPoint = coords;
          setDraft([{ type: "Feature", geometry: { type: "Point", coordinates: [coords.lon, coords.lat] }, properties: {} }]);
        } else {
          isDrawing = false;
          const anchor = anchorPoint!;
          const result =
            drawingMode === "rectangle"
              ? buildRectangleResult(anchor, coords, uuid)
              : buildCircleResult(anchor, haversineDistanceM(anchor, coords), uuid);
          completedShapesRef.current.push(result.geojson);
          syncCompletedShapes();
          onDrawingComplete(result);
          setDraft([]);
          anchorPoint = null;
        }
        return;
      }

      // polygon / polyline / distance / area — multi-click, finished on double-click
      activePoints.push(coords);
      setDraft(
        activePoints.length > 1
          ? [{ type: "Feature", geometry: { type: "LineString", coordinates: activePoints.map((c) => [c.lon, c.lat]) }, properties: {} }]
          : [{ type: "Feature", geometry: { type: "Point", coordinates: [coords.lon, coords.lat] }, properties: {} }]
      );
    };

    const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
      const coords = { lat: e.lngLat.lat, lon: e.lngLat.lng };

      if (drawingMode === "picker") {
        onLiveMeasurement(`Coords Picker: ${coords.lat.toFixed(4)}°, ${coords.lon.toFixed(4)}°`);
        return;
      }

      if (drawingMode === "rectangle" && isDrawing && anchorPoint) {
        onLiveMeasurement(`Rectangle ${buildRectangleResult(anchorPoint, coords, "preview").measurement}`);
        return;
      }

      if (drawingMode === "circle" && isDrawing && anchorPoint) {
        onLiveMeasurement(`Circle ${buildCircleResult(anchorPoint, haversineDistanceM(anchorPoint, coords), "preview").measurement}`);
        return;
      }

      if (activePoints.length > 0) {
        const tempPoints = [...activePoints, coords];
        if (drawingMode === "polyline" || drawingMode === "distance") {
          let dist = 0;
          for (let i = 0; i < tempPoints.length - 1; i++) dist += haversineDistanceM(tempPoints[i], tempPoints[i + 1]);
          onLiveMeasurement(buildPolylineResult(tempPoints, dist, "preview").measurement);
        } else if (drawingMode === "polygon" || drawingMode === "area") {
          onLiveMeasurement(buildPolygonResult(tempPoints, "preview").measurement);
        }
      }
    };

    const handleDblClick = () => {
      if (!hasMinimumPoints(drawingMode, activePoints.length)) {
        const remaining = pointsRemaining(drawingMode, activePoints.length);
        onLiveMeasurement(`Add at least ${remaining} more point${remaining === 1 ? "" : "s"} to complete this ${drawingMode}.`);
        return;
      }
      const uuid = Math.random().toString(36).substring(2, 9);

      let result: CompletedDrawing;
      if (drawingMode === "polyline" || drawingMode === "distance") {
        let dist = 0;
        for (let i = 0; i < activePoints.length - 1; i++) dist += haversineDistanceM(activePoints[i], activePoints[i + 1]);
        result = buildPolylineResult(activePoints, dist, uuid, drawingMode);
      } else {
        result = buildPolygonResult(activePoints, uuid, drawingMode as "polygon" | "area");
      }

      completedShapesRef.current.push(result.geojson);
      syncCompletedShapes();
      onDrawingComplete(result);
      activePoints = [];
      setDraft([]);
    };

    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);
    map.on("dblclick", handleDblClick);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
      map.off("dblclick", handleDblClick);
      if (needsDblClickDisabled) map.doubleClickZoom.enable();
      setDraft([]);
      onLiveMeasurement(null);
    };
  }, [drawingMode, clearTrigger, onDrawingComplete, onLiveMeasurement, mapReady]);

  const handleZoom = (zoomIn: boolean) => mapRef.current?.[zoomIn ? "zoomIn" : "zoomOut"]();

  const handleTilt = (tiltUp: boolean) => {
    const map = mapRef.current;
    if (!map) return;
    map.setPitch(Math.max(0, Math.min(60, map.getPitch() + (tiltUp ? 5 : -5))));
  };

  const handleResetCamera = () => {
    mapRef.current?.flyTo({ center: [80.0, 24.0], zoom: 3, pitch: 0, bearing: 0, duration: 2000 });
  };

  const toggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen().catch((err) => {
        setFullscreenError(`Fullscreen unavailable: ${err.message}`);
        setTimeout(() => setFullscreenError(null), 4000);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={mapWrapperRef}
      data-map-viewport="maplibre"
      className="relative w-full h-full min-h-[40rem] rounded-xl overflow-hidden border border-ground-700 bg-ground-950"
    >
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-15 bg-ground-950/80 backdrop-blur-sm text-sm text-ground-400">
          <span className="h-6 w-6 rounded-full border-2 border-dashed border-sensor animate-spin" />
          <span>Loading 2D map…</span>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />

      {mapReady && (
        <>
          <div className="glass-strong absolute top-4 left-4 rounded-xl p-2.5 flex items-center justify-center z-10 select-none">
            <Compass className="h-7 w-7 text-sensor transition-transform duration-100" style={{ transform: `rotate(${-camera.bearing}deg)` }} />
          </div>

          <div className="glass-strong absolute bottom-4 left-4 rounded-lg px-3 py-1.5 text-[10px] font-mono text-instrument z-10 select-none">
            {mouseCoords ? (
              <span>
                LAT: {mouseCoords.lat.toFixed(4)}° &middot; LON: {mouseCoords.lon.toFixed(4)}°
              </span>
            ) : (
              <span className="text-ground-500">Out of bounds</span>
            )}
          </div>

          <div className="absolute bottom-12 left-4 flex flex-col gap-1 z-10 select-none">
            <div className="w-24 h-1.5 border-b-2 border-l-2 border-r-2 border-instrument" />
            <span className="text-[8px] font-mono text-ground-400 uppercase tracking-widest pl-1">Zoom level: {camera.zoom.toFixed(1)}</span>
          </div>

          <CameraControls
            onZoomIn={() => handleZoom(true)}
            onZoomOut={() => handleZoom(false)}
            onTiltUp={() => handleTilt(true)}
            onTiltDown={() => handleTilt(false)}
            onReset={handleResetCamera}
            onToggleFullscreen={toggleFullscreen}
          />
        </>
      )}

      {fullscreenError && (
        <div className="absolute top-4 right-52 bg-ground-900/90 border border-red-500/40 px-3 py-1.5 rounded-lg text-[10px] font-mono text-red-400 select-none shadow-lg z-10">
          {fullscreenError}
        </div>
      )}
    </div>
  );
}
