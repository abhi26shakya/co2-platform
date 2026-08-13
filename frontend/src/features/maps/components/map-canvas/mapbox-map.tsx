"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Compass } from "lucide-react";
import { useMapStore, type SelectedFacility } from "@/features/maps/store/map-store";
import type { MapHotspot, PlantOut } from "@/types/geo";
import { CameraControls } from "@/features/maps/components/map-controls/camera-controls";
import { getBasemapStyleUrl } from "@/features/maps/lib/basemap-catalog";
import { OVERLAY_TILES } from "@/features/maps/lib/basemap-tiles";
import { getGasColorHex, getGasPlumes, hexToRgb, resolveComparisonColorHex } from "@/features/maps/lib/gas-plume";
import { getSectorColorHex } from "@/features/maps/lib/sector-colors";
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

// Mapbox styles/tiles/geocoding all require this — set once before any `mapboxgl.Map` is
// constructed. Public token by Mapbox's own design (restricted via URL allow-listing in the
// Mapbox account dashboard, not by secrecy) — see .env.example.
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface Props {
  plants: (PlantOut & { sector?: string })[];
  hotspots: (MapHotspot & { sector?: string })[];
  showPlants: boolean;
  showHotspots: boolean;
  selectedMode?: string;
  activeBasemap?: string;
  /** "gas" (default) colors plumes/extrusion by gas-intensity gradient (real backend data);
   *  "sector" colors everything by industrial sector instead (client-fabricated - see
   *  sector-colors.ts / enrich-plants.ts). Additive alternate mode, not a replacement. */
  colorMode?: "gas" | "sector";
  onSelectFacility?: (fac: SelectedFacility) => void;
  drawingMode?: DrawingMode;
  comparisonMode?: boolean;
  showLayers?: ShowLayers;
  onDrawingComplete?: (draw: CompletedDrawing) => void;
  onLiveMeasurement?: (text: string | null) => void;
  clearTrigger?: number;
  comparisonType?: string;
  cameraTarget?: { lat: number; lon: number } | null;
  /** Selected search-result region (country/state, see regions.ts) - drawn as a highlighted
   *  outline and fit into view. null clears the outline. */
  regionBoundary?: { geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon; bbox: [number, number, number, number] } | null;
  legendOn?: boolean;
  onToggleLegend?: () => void;
}

// Globe-projection atmosphere styling ("Voyager2" polish pass) — a violet
// limb glow that fades out as you zoom past the planetary view, since the
// atmosphere ring only reads correctly when the whole globe is in frame.
// Ported from Mapbox GL JS's SkySpecification (sky-color/horizon-color/sky-horizon-blend/
// atmosphere-blend) to Mapbox GL JS's FogSpecification, which folds the "how much the horizon
// haze blends in" behavior into a single zoom-expression-capable `horizon-blend` property instead
// of two separate constant/expression properties.
const GLOBE_FOG: mapboxgl.FogSpecification = {
  color: "#7c5cff",
  "high-color": "#05040f",
  "space-color": "#05040f",
  "horizon-blend": ["interpolate", ["linear"], ["zoom"], 0, 0.6, 5, 0.25, 10, 0],
};

function applyGlobeFog(map: mapboxgl.Map, is3d: boolean) {
  // setFog(null) resets to the style spec's defaults when leaving globe mode, since fog/atmosphere
  // styling is only meaningful for the tilted globe projection.
  map.setFog(is3d ? GLOBE_FOG : null);
}

const PLANTS_SOURCE = "plants-source";
const PLUME_SOURCE = "plume-source";
const VOLUME_SOURCE = "gas-volume-source";
const PILL_CAP_SOURCE = "gas-pill-cap-source";
const DRAFT_SOURCE = "gis-draft-source";
const COMPLETED_SOURCE = "gis-completed-source";
const REGION_SOURCE = "region-boundary-source";
const BOUNDARIES_SOURCE = "boundaries-overlay-source";
const ROADS_SOURCE = "roads-overlay-source";
const POPULATION_SOURCE = "population-overlay-source";

/** Builds a small square footprint (~1.1km side) around a point so fill-extrusion has a polygon
 *  to extrude — Mapbox GL JS's "3D Extruded Columns" mode equivalent to Cesium's cylinder entities. */
function buildColumnFootprint(lat: number, lon: number): number[][] {
  const halfDeg = 0.003;
  const latRad = (lat * Math.PI) / 180;
  const lonHalf = halfDeg / Math.max(0.15, Math.cos(latRad));
  return [
    [lon - lonHalf, lat - halfDeg],
    [lon + lonHalf, lat - halfDeg],
    [lon + lonHalf, lat + halfDeg],
    [lon - lonHalf, lat + halfDeg],
    [lon - lonHalf, lat - halfDeg],
  ];
}

/** Builds a many-sided polygon approximating a circle, for the "Pill Markers" mode's rounded
 *  cap - a second fill-extrusion stacked on top of the thin gas-volume-extrusion shaft (same
 *  base/height trick used to place it at the correct altitude, since a Mapbox GL JS circle *layer*
 *  has no way to sit at an elevation matching an extrusion's height; only another extrusion
 *  polygon can). Wider than the shaft's own square footprint so it visibly overhangs as a cap. */
function buildCircularCapFootprint(lat: number, lon: number): number[][] {
  const radiusDeg = 0.006;
  const latRad = (lat * Math.PI) / 180;
  const lonScale = 1 / Math.max(0.15, Math.cos(latRad));
  const sides = 12;
  const coords: number[][] = [];
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    coords.push([lon + Math.cos(angle) * radiusDeg * lonScale, lat + Math.sin(angle) * radiusDeg]);
  }
  return coords;
}

function addDataLayers(map: mapboxgl.Map) {
  if (!map.getSource(PLANTS_SOURCE)) {
    // Mapbox GL JS's built-in clustering is client-side and handles many thousands of points
    // comfortably — plenty for this registry's current and near-term scale. Revisit only once
    // the facility count grows large enough to justify server-side aggregation (see the MVT
    // pipeline notes in docs/architecture.md).
    map.addSource(PLANTS_SOURCE, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
      cluster: true,
      clusterMaxZoom: 12,
      clusterRadius: 50,
    });
    map.addLayer({
      id: "plants-cluster-circle",
      type: "circle",
      source: PLANTS_SOURCE,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": ["step", ["get", "point_count"], "#34d399", 10, "#60a5fa", 50, "#e64980"],
        "circle-radius": ["step", ["get", "point_count"], 14, 10, 18, 50, 24],
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 1.5,
        "circle-opacity": 0.85,
      },
    });
    map.addLayer({
      id: "plants-circle",
      type: "circle",
      source: PLANTS_SOURCE,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": 6,
        // Data-driven so the "Render plants" effect can flip between the plain green dot and
        // sector-based coloring (colorMode prop) per-feature without rebuilding the layer.
        "circle-color": ["coalesce", ["get", "color"], "#10b981"],
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 1.5,
      },
    });
    map.addLayer({
      id: "plants-prediction-label",
      type: "symbol",
      source: PLANTS_SOURCE,
      filter: ["!", ["has", "point_count"]],
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
  if (!map.getSource(POPULATION_SOURCE)) {
    // WorldPop's ImageServer has no pre-generated tile cache (its plain /tile/{z}/{y}/{x} path
    // 404s), only the WMS-style exportImage operation - {bbox-epsg-3857} is Mapbox GL JS's standard
    // placeholder for exactly that pattern (same trick as any WMS raster source), verified
    // working directly (HTTP 200, image/png) before wiring this up. No API key/account needed,
    // unlike Mapbox's population-density offering (which isn't a ready-made tileset anyway - it'd
    // need its own from-scratch data pipeline, see the plan doc).
    map.addSource(POPULATION_SOURCE, {
      type: "raster",
      tiles: [
        "https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Population_Density_1km/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&f=image",
      ],
      tileSize: 256,
    });
    map.addLayer({
      id: "population-overlay",
      type: "raster",
      source: POPULATION_SOURCE,
      layout: { visibility: "none" },
      paint: { "raster-opacity": 0.55 },
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
        // heatmap-opacity has no data-driven (per-feature) variant in the Mapbox GL JS style spec —
        // unlike heatmap-weight/-radius, it only accepts a constant or a zoom expression. Fold each
        // gas layer's configured opacity into the weight instead, so per-gas opacity still shows.
        "heatmap-weight": ["*", ["get", "intensity"], ["get", "opacity"]],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
        // Footprint size comes from each hotspot's real modeled dispersion radius (radius_m, from
        // the backend's plume analysis — see MapHotspot.radius_m), not a fixed constant, so a
        // wider-reaching plume actually reads as covering more of the map than a tight one.
        "heatmap-radius": ["interpolate", ["linear"], ["get", "radius_m"], 0, 20, 1000, 45, 5000, 90, 20000, 140],
        "heatmap-opacity": 0.85,
        // Density → color ramp using this app's reserved plume-intensity tokens (amber → magenta,
        // see globals.css) instead of Mapbox GL JS's default blue-red ramp, capped with a deep red for
        // the highest-density "hot spots" — same visual language IntensityLegend already uses.
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(245, 166, 35, 0)",
          0.2, "rgba(245, 166, 35, 0.55)",
          0.5, "#f5a623",
          0.75, "#e64980",
          1, "#7f1d1d",
        ],
      },
    });
    // Soft bloom underneath the crisp marker/pulse dots - a larger, heavily
    // blurred duplicate of the same point, so gas sources read as glowing
    // rather than flat-filled circles (Voyager2 polish pass).
    map.addLayer({
      id: "gas-markers-glow",
      type: "circle",
      source: PLUME_SOURCE,
      layout: { visibility: "none" },
      paint: {
        "circle-radius": ["*", ["coalesce", ["get", "pulseRadius"], 10], 2.4],
        "circle-color": ["get", "color"],
        "circle-opacity": ["*", ["coalesce", ["get", "pulseOpacity"], ["get", "opacity"]], 0.35],
        "circle-blur": 1,
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
    // "Pill Markers" mode — a rounded cap sitting on top of the existing thin fill-extrusion
    // shaft (gas-volume-extrusion, same VOLUME_SOURCE footprint below it), approximating Climate
    // TRACE's rounded-capsule 3D markers. Mapbox GL JS's fill-extrusion only produces flat-topped
    // prisms (no native capsule geometry) and a true 3D mesh would need a custom WebGL layer -
    // the kind of engine complexity KI-004 deliberately retired (Cesium/three.js removal). A
    // plain `circle` layer can't substitute for the cap either - it has no way to sit at an
    // elevation matching the shaft's height (circles always render at ground level), so the cap
    // is a *second* fill-extrusion instead: a wider, many-sided polygon
    // (buildCircularCapFootprint) stacked exactly on top of the shaft via its own
    // fill-extrusion-base/-height (set to [shaft height, shaft height + cap thickness] per
    // feature in the render effect below).
    if (!map.getSource(PILL_CAP_SOURCE)) {
      map.addSource(PILL_CAP_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    }
    map.addLayer({
      id: "gas-pill-cap",
      type: "fill-extrusion",
      source: PILL_CAP_SOURCE,
      layout: { visibility: "none" },
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-base": ["get", "base"],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.95,
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
    // "Animated Pulse" mode — a variant of gas-markers whose radius/opacity are recomputed on an
    // interval (see the pulse effect below) instead of the static per-render values the other
    // modes use. Mirrors Cesium's CallbackProperty-driven pulsing ellipse.
    map.addLayer({
      id: "gas-animated-pulse",
      type: "circle",
      source: PLUME_SOURCE,
      layout: { visibility: "none" },
      paint: {
        "circle-radius": ["coalesce", ["get", "pulseRadius"], 10],
        "circle-color": ["get", "color"],
        "circle-opacity": ["coalesce", ["get", "pulseOpacity"], ["get", "opacity"]],
        "circle-blur": 0.55,
      },
    });
  }

  // "3D Extruded Columns" mode — fill-extrusion needs polygon geometry, so this is a dedicated
  // source (small square footprints from buildColumnFootprint) rather than reusing PLUME_SOURCE's
  // points. Renders under both mercator and globe projection.
  if (!map.getSource(VOLUME_SOURCE)) {
    map.addSource(VOLUME_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "gas-volume-extrusion",
      type: "fill-extrusion",
      source: VOLUME_SOURCE,
      layout: { visibility: "none" },
      paint: {
        // "color" is an rgba() string with per-feature opacity already baked in — see the
        // volumeFeatures push in the render effect below for why fill-extrusion-opacity itself
        // can't carry that per-feature (data expressions aren't supported on this property).
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0.9,
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

  // Selected region boundary (country/state search result, see regions.ts) - white outline with
  // a very faint fill, matching Climate TRACE's "click a region -> highlighted outline" look.
  if (!map.getSource(REGION_SOURCE)) {
    map.addSource(REGION_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    map.addLayer({
      id: "region-boundary-fill",
      type: "fill",
      source: REGION_SOURCE,
      paint: { "fill-color": "#ffffff", "fill-opacity": 0.06 },
    });
    map.addLayer({
      id: "region-boundary-line",
      type: "line",
      source: REGION_SOURCE,
      paint: { "line-color": "#ffffff", "line-width": 2 },
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

export default function MapboxMap({
  plants,
  hotspots,
  showPlants,
  showHotspots,
  selectedMode = "heatmap",
  activeBasemap = "dark",
  colorMode = "gas",
  onSelectFacility = () => {},
  drawingMode = "none",
  comparisonMode = false,
  showLayers = { plants: true, heatmap: true, contours: true, prediction: true, boundaries: false, roads: false, clouds: false, population: false },
  onDrawingComplete = () => {},
  onLiveMeasurement = () => {},
  clearTrigger = 0,
  comparisonType = "split-screen",
  cameraTarget = null,
  regionBoundary = null,
  legendOn = false,
  onToggleLegend,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const completedShapesRef = useRef<GeoFeature[]>([]);
  const plumeFeaturesRef = useRef<GeoJSON.Feature[]>([]);
  // Skips the "Basemap swap" effect's very first run (right after mount, when mapReady flips
  // true) - the map is already constructed with this exact basemap's style, so re-applying it
  // there was a redundant second setStyle() call racing the constructor's still-loading initial
  // style. See the mount effect's comment for what that raced into.
  const skipInitialBasemapSwap = useRef(true);
  const [mapReady, setMapReady] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const { camera, setCamera, selectedFacility, setSelectedFacility, gases, mapMode } = useMapStore();

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const storeCam = useMapStore.getState().camera;
    const initialMapMode = useMapStore.getState().mapMode;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      // Must match whatever the "Basemap swap" effect below will apply once `mapReady` flips true
      // - constructing with a different style than `activeBasemap` used to mean that effect fired
      // a real (non-diffable) setStyle() call microseconds after the initial style's "load" event,
      // racing its own in-flight sprite/glyph request teardown, which under Mapbox GL JS threw an
      // uncaught error deep inside its style loader and silently wedged every GeoJSON source's
      // worker round-trip for the rest of the session. Starting on the real basemap makes the
      // follow-up setStyle() a same-style no-op via the style diffing both engines share instead.
      style: getBasemapStyleUrl(activeBasemap),
      center: [storeCam.lon, storeCam.lat],
      zoom: storeCam.zoom,
      pitch: storeCam.pitch,
      bearing: storeCam.bearing,
      // 60 is the mercator-projection default; globe projection (the "3D" mode) wants a deeper
      // tilt to read as a planetary view rather than a slightly-angled flat map.
      maxPitch: 85,
      attributionControl: false,
      // Needed so canvas.toBlob()/toDataURL() (PNG export) doesn't read a blanked buffer — WebGL
      // clears the drawing buffer after each frame by default. Mapbox GL JS v3's MapOptions has no
      // alpha/canvasContextAttributes escape hatch for a transparent canvas (MapLibre's fork
      // added one), so
      // the deep-space area beyond the globe's silhouette can no longer show the .map-starfield CSS
      // div through the canvas — GLOBE_FOG's space-color/high-color (#05040f) is tone-matched to
      // .map-starfield's background-color (#05040c, globals.css) so the seam isn't visually jarring.
      preserveDrawingBuffer: true,
    });
    map.on("load", () => {
      // setProjection throws "Style is not done loading" if called before the style/sprite/glyphs
      // have finished loading — safe only once "load" has fired, not immediately after construction.
      map.setProjection(initialMapMode === "3d" ? "globe" : "mercator");
      applyGlobeFog(map, initialMapMode === "3d");
      addDataLayers(map);
      setMapReady(true);
    });

    map.on("mousemove", (e: mapboxgl.MapMouseEvent) => setMouseCoords({ lat: e.lngLat.lat, lon: e.lngLat.lng }));
    map.on("mouseout", () => setMouseCoords(null));

    map.on("moveend", () => {
      setCamera({
        lat: map.getCenter().lat,
        lon: map.getCenter().lng,
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      });
    });

    const handlePick = (e: mapboxgl.MapLayerMouseEvent) => {
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
    map.on("click", "gas-animated-pulse", handlePick);
    map.on("click", "gas-volume-extrusion", handlePick);
    map.on("click", "gas-pill-cap", handlePick);

    const handleClusterClick = (e: mapboxgl.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      const clusterId = feature?.properties?.cluster_id;
      if (clusterId == null) return;
      const source = map.getSource(PLANTS_SOURCE) as mapboxgl.GeoJSONSource;
      const geometry = feature!.geometry as GeoJSON.Point;
      // Mapbox GL JS's getClusterExpansionZoom is callback-style, unlike MapLibre's
      // Promise-returning version.
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom == null) return;
        map.easeTo({ center: geometry.coordinates as [number, number], zoom, duration: 500 });
      });
    };
    map.on("click", "plants-cluster-circle", handleClusterClick);
    map.on("mouseenter", "plants-cluster-circle", () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", "plants-cluster-circle", () => (map.getCanvas().style.cursor = ""));

    mapRef.current = map;

    // Mapbox GL JS bakes in the container's size at construction time; if that size changes later
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

  // 2D/3D toggle — switches the engine's projection (mercator <-> globe) instead of swapping to a
  // second rendering engine. Nudges pitch toward a planetary-view tilt entering 3D, and back to
  // top-down leaving it, but only when the user hasn't already set a custom tilt of their own.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    map.setProjection(mapMode === "3d" ? "globe" : "mercator");
    applyGlobeFog(map, mapMode === "3d");
    if (mapMode === "3d") {
      const easeTarget: { pitch?: number; zoom?: number } = {};
      if (map.getPitch() < 20) easeTarget.pitch = 40;
      // Both the store's default zoom (5) and the reset-camera zoom (3) sit too
      // close-in for the globe's curvature to read at all - pull back to a
      // planetary view on the 2D->3D transition so the globe is actually
      // visible as a sphere, not just a tilted flat map. -1 gave a clearly
      // curved, starfield-ringed globe with no "cover the container" floor
      // under MapLibre's globe projection; re-verify this holds identically
      // under Mapbox GL JS v3's globe implementation during manual QA and
      // adjust the target zoom constant if its clamping behavior differs.
      if (map.getZoom() > -1) easeTarget.zoom = -1;
      if (Object.keys(easeTarget).length > 0) map.easeTo({ ...easeTarget, duration: 900 });
    } else if (mapMode === "2d" && map.getPitch() > 0) {
      map.easeTo({ pitch: 0, duration: 800 });
    }
  }, [mapMode, mapReady]);

  // Basemap swap
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (skipInitialBasemapSwap.current) {
      skipInitialBasemapSwap.current = false;
      return;
    }

    const applyStyle = () => {
      map.setStyle(getBasemapStyleUrl(activeBasemap));
      map.once("styledata", () => {
        addDataLayers(map);
        applyGlobeFog(map, useMapStore.getState().mapMode === "3d");
      });
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

  // Selected region boundary (search result) - draw the outline and fit it into view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const regionSource = map.getSource(REGION_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (!regionSource) return;
    if (!regionBoundary) {
      regionSource.setData({ type: "FeatureCollection", features: [] });
      return;
    }
    regionSource.setData({
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: regionBoundary.geometry, properties: {} }],
    });
    const [minLon, minLat, maxLon, maxLat] = regionBoundary.bbox;
    map.fitBounds(
      [
        [minLon, minLat],
        [maxLon, maxLat],
      ],
      { padding: 60, duration: 1500 }
    );
  }, [regionBoundary, mapReady]);

  // Render plants + gas plumes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const plantsSource = map.getSource(PLANTS_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    const plumeSource = map.getSource(PLUME_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    const volumeSource = map.getSource(VOLUME_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    const capSource = map.getSource(PILL_CAP_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (!plantsSource || !plumeSource || !volumeSource || !capSource) return;

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
              color: colorMode === "sector" ? getSectorColorHex(p.sector) : null,
            },
          }))
        : [],
    });

    const showPlumeLayer = showHotspots && showLayers.heatmap;
    const plumeFeatures: GeoJSON.Feature[] = [];
    const volumeFeatures: GeoJSON.Feature[] = [];
    const capFeatures: GeoJSON.Feature[] = [];
    if (showPlumeLayer) {
      const activeGasKeys = Object.keys(gases).filter((k) => gases[k].enabled);
      activeGasKeys.forEach((gasKey) => {
        const config = gases[gasKey];
        const plumes = getGasPlumes(gasKey, hotspots);
        plumes.forEach((plume) => {
          const valueNorm = Math.min(1, plume.intensity);
          const baseColorHex = colorMode === "sector" ? getSectorColorHex(plume.sector) : getGasColorHex(gasKey, valueNorm);
          const colorHex = resolveComparisonColorHex(baseColorHex, plume, comparisonMode, comparisonType);
          const metadata = {
            name: `Detected ${gasKey.toUpperCase()} Plume`,
            industry: `Greenhouse Gas Source: ${gasKey.toUpperCase()}`,
            country: "India",
            lat: plume.lat,
            lon: plume.lon,
            co2: `${plume.value.toFixed(1)} ${plume.unit}`,
            confidence: `${Math.round(plume.intensity * 100)}%`,
            satellite: "Sentinel-5P",
            dataset: "Prediction Scene",
          };
          plumeFeatures.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [plume.lon, plume.lat] },
            properties: { ...metadata, color: colorHex, opacity: config.opacity, intensity: valueNorm, radius_m: plume.radiusM },
          });
          // fill-extrusion-opacity has no data-driven (per-feature) variant in the Mapbox GL JS style
          // spec (same limitation as heatmap-opacity above) — fold each gas layer's opacity into
          // the extrusion color's alpha channel instead, via an rgba() string.
          const rgb = hexToRgb(colorHex);
          const volumeColorRgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity})` : colorHex;
          const shaftHeight = 4000 + valueNorm * 90000;
          volumeFeatures.push({
            type: "Feature",
            geometry: { type: "Polygon", coordinates: [buildColumnFootprint(plume.lat, plume.lon)] },
            properties: { ...metadata, color: volumeColorRgba, height: shaftHeight },
          });
          capFeatures.push({
            type: "Feature",
            geometry: { type: "Polygon", coordinates: [buildCircularCapFootprint(plume.lat, plume.lon)] },
            properties: { ...metadata, color: volumeColorRgba, base: shaftHeight, height: shaftHeight + 3000 },
          });
        });
      });
    }
    plumeSource.setData({ type: "FeatureCollection", features: plumeFeatures });
    volumeSource.setData({ type: "FeatureCollection", features: volumeFeatures });
    capSource.setData({ type: "FeatureCollection", features: capFeatures });
    plumeFeaturesRef.current = plumeFeatures;

    const activeGasPlumeLayer =
      selectedMode === "markers"
        ? "gas-markers"
        : selectedMode === "contours"
          ? "contours"
          : selectedMode === "volume3d"
            ? "volume3d"
            : selectedMode === "pill3d"
              ? "pill3d"
              : selectedMode === "animated"
                ? "animated"
                : "gas-heatmap";
    const visibility = (id: string, show: boolean) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", show ? "visible" : "none");
    };
    visibility("gas-heatmap", showPlumeLayer && activeGasPlumeLayer === "gas-heatmap");
    visibility("gas-markers", showPlumeLayer && activeGasPlumeLayer === "gas-markers");
    visibility(
      "gas-volume-extrusion",
      showPlumeLayer && (activeGasPlumeLayer === "volume3d" || activeGasPlumeLayer === "pill3d")
    );
    visibility("gas-pill-cap", showPlumeLayer && activeGasPlumeLayer === "pill3d");
    visibility("gas-animated-pulse", showPlumeLayer && activeGasPlumeLayer === "animated");
    visibility(
      "gas-markers-glow",
      showPlumeLayer && (activeGasPlumeLayer === "gas-markers" || activeGasPlumeLayer === "animated")
    );
    // "contours" is both a full render mode and an always-on overlay toggle (showLayers.contours) —
    // show the ring layers whenever either wants them.
    const showContourRings = showPlumeLayer && (activeGasPlumeLayer === "contours" || showLayers.contours);
    visibility("gas-contour-inner", showContourRings);
    visibility("gas-contour-outer", showContourRings);

    visibility("plants-prediction-label", showPlantLayer && showLayers.prediction);
    visibility("boundaries-overlay", showLayers.boundaries);
    visibility("roads-overlay", showLayers.roads);
    visibility("population-overlay", showLayers.population);
  }, [plants, hotspots, showPlants, showHotspots, selectedMode, showLayers, gases, comparisonMode, comparisonType, colorMode, mapReady]);

  // Animated Pulse mode — recomputes radius/opacity on an interval from the last-built plume
  // features (plumeFeaturesRef, set by the effect above) rather than rebuilding gas plume data
  // from scratch every tick.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || selectedMode !== "animated" || !(showHotspots && showLayers.heatmap)) return;

    const interval = setInterval(() => {
      const source = map.getSource(PLUME_SOURCE) as mapboxgl.GeoJSONSource | undefined;
      if (!source) return;
      const t = Date.now() / 1000;
      const animated = plumeFeaturesRef.current.map((f, i) => {
        const props = (f.properties ?? {}) as Record<string, number>;
        const intensity = props.intensity ?? 0;
        const opacity = props.opacity ?? 0.7;
        const factor = 1 + 0.25 * Math.sin(t * 2.5 + i * 0.5);
        return {
          ...f,
          properties: {
            ...props,
            pulseRadius: (8 + intensity * 10) * factor,
            pulseOpacity: Math.min(1, opacity * (0.6 + 0.4 * factor)),
          },
        };
      });
      source.setData({ type: "FeatureCollection", features: animated } as GeoJSON.FeatureCollection);
    }, 100);

    return () => clearInterval(interval);
  }, [selectedMode, showHotspots, showLayers, mapReady]);

  const syncCompletedShapes = () => {
    const map = mapRef.current;
    const source = map?.getSource(COMPLETED_SOURCE) as mapboxgl.GeoJSONSource | undefined;
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

    const draftSource = () => map.getSource(DRAFT_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    const setDraft = (features: GeoJSON.Feature[]) => draftSource()?.setData({ type: "FeatureCollection", features });

    let activePoints: { lat: number; lon: number }[] = [];
    let anchorPoint: { lat: number; lon: number } | null = null;
    let isDrawing = false;

    const needsDblClickDisabled = drawingMode === "polyline" || drawingMode === "distance" || drawingMode === "polygon" || drawingMode === "area";
    if (needsDblClickDisabled) map.doubleClickZoom.disable();

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
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

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
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

  const handleZoom = (zoomIn: boolean) => {
    const map = mapRef.current;
    if (!map) return;
    // Default zoomIn()/zoomOut() can anchor around screen space rather than the map's actual
    // lng/lat center — under globe projection (tilted via the pitch this engine applies in 3D
    // mode) that visibly drifts the globe off-center as you zoom. Pin the center explicitly so
    // the zoom buttons always zoom straight in/out on whatever the globe is currently centered on.
    const targetZoom = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), map.getZoom() + (zoomIn ? 1 : -1)));
    map.easeTo({ center: map.getCenter(), zoom: targetZoom, duration: 300 });
  };

  const handleTilt = (tiltUp: boolean) => {
    const map = mapRef.current;
    if (!map) return;
    map.setPitch(Math.max(0, Math.min(85, map.getPitch() + (tiltUp ? 5 : -5))));
  };

  const handleResetCamera = () => {
    mapRef.current?.flyTo({ center: [80.0, 24.0], zoom: 3, pitch: mapMode === "3d" ? 50 : 0, bearing: 0, duration: 2000 });
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
      data-map-viewport="mapbox"
      className="relative w-full h-full min-h-[40rem] rounded-xl overflow-hidden border border-ground-700 bg-ground-950"
    >
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-15 bg-ground-950/80 backdrop-blur-sm text-sm text-ground-400">
          <span className="h-6 w-6 rounded-full border-2 border-dashed border-sensor animate-spin" />
          <span>{mapMode === "3d" ? "Synchronizing 3D Climate Globe…" : "Loading 2D map…"}</span>
        </div>
      )}

      {mapMode === "3d" && (
        <div className="map-starfield absolute inset-0" aria-hidden />
      )}
      <div ref={containerRef} className="relative w-full h-full" />

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
            legendOn={legendOn}
            onToggleLegend={onToggleLegend}
            onShowHelp={() => setHelpOpen((v) => !v)}
          />

          {helpOpen && (
            <div className="glass-strong absolute bottom-16 right-4 z-20 w-64 rounded-xl p-3.5 space-y-1.5 text-[11px] text-ground-300 animate-in fade-in slide-in-from-bottom-1 duration-150">
              <p className="font-semibold text-instrument">How to use this map</p>
              <p>Click a plant or gas layer point for details. Drag to pan, scroll to zoom, or use the +/− controls.</p>
              <p>Switch 2D/3D and pick a gas or fuel type from the toolbar above. Use the menu icon for basemaps, GIS tools, and export.</p>
              <button onClick={() => setHelpOpen(false)} className="text-sensor font-semibold cursor-pointer">
                Got it
              </button>
            </div>
          )}
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
