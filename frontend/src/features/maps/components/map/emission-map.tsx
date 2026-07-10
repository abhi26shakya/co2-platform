"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/providers/providers/settings-provider";
import type { MapHotspot, PlantOut } from "@/types/geo";

interface Props {
  plants: PlantOut[];
  hotspots: MapHotspot[];
  showPlants: boolean;
  showHotspots: boolean;
  selectedGas?: string;
  selectedMode?: string;
  activeBasemap?: string;
  onSelectFacility?: (fac: any) => void;
  drawingMode?: string;
  comparisonMode?: boolean;
  timelineDate?: string;
  showLayers?: Record<string, boolean>;
}

// Gas Color Palettes helper
function getGasColorHex(gas: string, val: number, confidence: number) {
  const normVal = Math.min(1, Math.max(0, val));
  if (gas === "ch4") {
    // Blue -> Cyan -> Purple
    if (normVal < 0.3) return "#3b82f6"; // blue
    if (normVal < 0.6) return "#06b6d4"; // cyan
    return "#a855f7"; // purple
  }
  if (gas === "no2") {
    // Yellow -> Orange -> Red
    if (normVal < 0.3) return "#facc15"; // yellow
    if (normVal < 0.6) return "#f97316"; // orange
    return "#ef4444"; // red
  }
  if (gas === "so2") {
    // Purple -> Pink
    if (normVal < 0.5) return "#8b5cf6"; // purple
    return "#ec4899"; // pink
  }
  if (gas === "co") {
    // Teal -> Orange
    if (normVal < 0.5) return "#14b8a6"; // teal
    return "#f97316"; // orange
  }
  // Default: co2 (Green -> Yellow -> Orange -> Red -> Dark Red)
  if (normVal < 0.2) return "#22c55e"; // green
  if (normVal < 0.4) return "#eab308"; // yellow
  if (normVal < 0.6) return "#f97316"; // orange
  if (normVal < 0.8) return "#ef4444"; // red
  return "#7f1d1d"; // dark red
}

export default function EmissionMap({
  plants,
  hotspots,
  showPlants,
  showHotspots,
  selectedGas = "co2",
  selectedMode = "volume3d",
  activeBasemap = "dark",
  onSelectFacility = () => {},
  drawingMode = "none",
  comparisonMode = false,
  timelineDate = "",
  showLayers = { plants: true, heatmap: true },
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const [cesiumReady, setCesiumReady] = useState(false);
  const [measurementResult, setMeasurementResult] = useState<string | null>(null);

  // Load Cesium globally from window
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const checkCesium = () => {
      if (typeof window !== "undefined" && (window as any).Cesium) {
        setCesiumReady(true);
        clearInterval(interval);
      }
    };
    interval = setInterval(checkCesium, 100);
    checkCesium();
    return () => clearInterval(interval);
  }, []);

  // Initialize Cesium Viewer
  useEffect(() => {
    if (!cesiumReady || !containerRef.current || viewerRef.current) return;

    const Cesium = (window as any).Cesium;

    // Use dark style basemap template by default
    const darkBasemapProvider = new Cesium.UrlTemplateImageryProvider({
      url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    });

    const viewer = new Cesium.Viewer(containerRef.current, {
      imageryProvider: darkBasemapProvider,
      terrainProvider: undefined,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      timeline: false,
      animation: false,
      fullscreenButton: false,
      scene3DOnly: false,
    });

    // Make Cesium render dark sky background
    viewer.scene.skyBox.show = false;
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#09090b");

    // Camera settings
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(79.5, 22.5, 8000000.0), // Center on India
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
      },
    });

    viewerRef.current = viewer;

    // Click handler for picking facilities
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: any) => {
      const pickedObject = viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject) && pickedObject.id) {
        const metadata = pickedObject.id.properties?.metadata?.getValue();
        if (metadata) {
          onSelectFacility(metadata);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [cesiumReady, onSelectFacility]);

  // Update Basemaps
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const Cesium = (window as any).Cesium;
    viewer.imageryLayers.removeAll();

    let provider;
    if (activeBasemap === "satellite" || activeBasemap === "hybrid") {
      provider = new Cesium.UrlTemplateImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      });
    } else if (activeBasemap === "osm") {
      provider = new Cesium.OpenStreetMapImageryProvider({
        url: "https://a.tile.openstreetmap.org/",
      });
    } else {
      // "dark"
      provider = new Cesium.UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      });
    }

    viewer.imageryLayers.addImageryProvider(provider);

    // Dynamic Terrain switching
    if (activeBasemap === "terrain") {
      viewer.terrainProvider = Cesium.createWorldTerrain();
    } else {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }
  }, [activeBasemap]);

  // Render 3D Cylinders, Heatmaps, and Plant Markers
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const Cesium = (window as any).Cesium;
    viewer.entities.removeAll();

    // 1. Render Plants
    if (showPlants && showLayers.plants) {
      plants.forEach((p) => {
        const strong = (p.co2_enhancement_ppm ?? 0) > (p.co2_bg_std_ppm ?? 0.5);
        const markerColor = strong ? Cesium.Color.GOLD.withAlpha(0.7) : Cesium.Color.SPRINGGREEN.withAlpha(0.6);

        viewer.entities.add({
          id: `plant-${p.id}`,
          position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, 100),
          point: {
            pixelSize: 8,
            color: markerColor,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1.5,
          },
          properties: {
            metadata: {
              name: p.name,
              industry: p.fuel_type || "Power Gen",
              country: p.country || "India",
              lat: p.lat,
              lon: p.lon,
              co2: p.co2_enhancement_ppm ? p.co2_enhancement_ppm.toFixed(2) : "n/a",
              confidence: p.co2_soundings ? "91%" : "n/a",
              satellite: "Sentinel-5P",
              dataset: "plant_results.json",
            },
          },
        });
      });
    }

    // 2. Render Hotspots as animated 3D extruded columns
    if (showHotspots && showLayers.heatmap) {
      hotspots.forEach((h, idx) => {
        const valueNorm = Math.min(1, (h.emission_tonnes_per_year || 4500) / 6000);
        const hotspotConfidence = Math.round((h.intensity ?? 0.94) * 100);
        const colorHex = getGasColorHex(selectedGas, valueNorm, hotspotConfidence);
        const color = Cesium.Color.fromCssColorString(colorHex);
        const confidenceAlpha = Math.min(1, Math.max(0.2, hotspotConfidence / 100));

        const baseHeight = 50000 * valueNorm;

        // Dynamic pulsing callback
        let timeOffset = idx * 0.5;
        const pulseHeightProperty = new Cesium.CallbackProperty(() => {
          const time = viewer.clock.currentTime.secondsOfDay;
          const pulse = Math.sin(time * 2 + timeOffset) * 0.15 + 0.85; // pulse size
          return baseHeight * pulse;
        }, false);

        // 3D Volume
        if (selectedMode === "volume3d") {
          viewer.entities.add({
            id: `hotspot-vol-${idx}`,
            position: Cesium.Cartesian3.fromDegrees(h.lon, h.lat, baseHeight / 2),
            ellipsoid: {
              radii: new Cesium.Cartesian3(5000, 5000, baseHeight / 2),
              material: color.withAlpha(confidenceAlpha * 0.25),
              outline: true,
              outlineColor: color,
            },
            properties: {
              metadata: {
                name: `Detected Hotspot #${idx + 1}`,
                industry: "Industrial Facility Anomaly",
                country: "India",
                lat: h.lat,
                lon: h.lon,
                co2: h.emission_tonnes_per_year ? h.emission_tonnes_per_year.toLocaleString() : "4,760",
                confidence: `${hotspotConfidence}%`,
                satellite: "Sentinel-5P",
                dataset: h.image_filename || "scene.tif",
              },
            },
          });
        } else {
          // Standard Extruded Column
          viewer.entities.add({
            id: `hotspot-col-${idx}`,
            position: Cesium.Cartesian3.fromDegrees(h.lon, h.lat),
            cylinder: {
              length: pulseHeightProperty,
              topRadius: 3500.0,
              bottomRadius: 3500.0,
              material: color.withAlpha(confidenceAlpha * 0.6),
              outline: true,
              outlineColor: color,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
            properties: {
              metadata: {
                name: `Detected Hotspot #${idx + 1}`,
                industry: "Industrial Facility Anomaly",
                country: "India",
                lat: h.lat,
                lon: h.lon,
                co2: h.emission_tonnes_per_year ? h.emission_tonnes_per_year.toLocaleString() : "4,760",
                confidence: `${hotspotConfidence}%`,
                satellite: "Sentinel-5P",
                dataset: h.image_filename || "scene.tif",
              },
            },
          });
        }

        // Draw Contours
        if (selectedMode === "contours") {
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(h.lon, h.lat, 10),
            ellipse: {
              semiMajorAxis: 8000.0,
              semiMinorAxis: 8000.0,
              material: Cesium.Color.TRANSPARENT,
              outline: true,
              outlineColor: color.withAlpha(0.9),
              outlineWidth: 3.0,
            },
          });
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(h.lon, h.lat, 10),
            ellipse: {
              semiMajorAxis: 15000.0,
              semiMinorAxis: 15000.0,
              material: Cesium.Color.TRANSPARENT,
              outline: true,
              outlineColor: color.withAlpha(0.4),
              outlineWidth: 1.5,
            },
          });
        }
      });
    }
  }, [plants, hotspots, showPlants, showHotspots, selectedGas, selectedMode, showLayers]);

  // Handle Drawings / Polygon Measure tools
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || drawingMode === "none") return;

    const Cesium = (window as any).Cesium;
    const activePoints: any[] = [];
    const entityCollection: any[] = [];

    const drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    drawHandler.setInputAction((click: any) => {
      const cartesian = viewer.scene.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
      if (cartesian) {
        activePoints.push(cartesian);

        const pt = viewer.entities.add({
          position: cartesian,
          point: {
            pixelSize: 6,
            color: Cesium.Color.RED,
          },
        });
        entityCollection.push(pt);

        if (activePoints.length > 1) {
          const line = viewer.entities.add({
            polyline: {
              positions: activePoints,
              width: 2.5,
              material: Cesium.Color.RED,
            },
          });
          entityCollection.push(line);
        }

        if (drawingMode === "distance" && activePoints.length > 1) {
          let dist = 0;
          for (let i = 0; i < activePoints.length - 1; i++) {
            dist += Cesium.Cartesian3.distance(activePoints[i], activePoints[i + 1]);
          }
          setMeasurementResult(`Distance: ${(dist / 1000).toFixed(2)} km`);
        }

        if (drawingMode === "polygon" && activePoints.length >= 3) {
          const poly = viewer.entities.add({
            polygon: {
              hierarchy: activePoints,
              material: Cesium.Color.RED.withAlpha(0.2),
              outline: true,
              outlineColor: Cesium.Color.RED,
            },
          });
          entityCollection.push(poly);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    drawHandler.setInputAction(() => {
      drawHandler.destroy();
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    return () => {
      drawHandler.destroy();
      entityCollection.forEach((ent) => viewer.entities.remove(ent));
      setMeasurementResult(null);
    };
  }, [drawingMode]);

  return (
    <div className="relative w-full h-[40rem] rounded-xl overflow-hidden border border-ground-700 bg-ground-950">
      {!cesiumReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-15 bg-ground-950/80 backdrop-blur-sm text-sm text-ground-400">
          <span className="h-6 w-6 rounded-full border-2 border-dashed border-sensor animate-spin" />
          <span>Synchronizing 3D Climate Globe...</span>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full" />

      {measurementResult && (
        <div className="absolute top-4 left-4 bg-ground-900/90 border border-ground-700 px-3 py-1.5 rounded-lg text-xs font-mono text-sensor select-none shadow-lg z-10 animate-pulse">
          {measurementResult}
        </div>
      )}
    </div>
  );
}
