"use client";

import { useEffect, useRef, useState } from "react";
import { useMapStore } from "@/features/maps/store/map-store";
import { useSettings } from "@/providers/providers/settings-provider";
import type { MapHotspot, PlantOut } from "@/types/geo";
import { Maximize2, Compass, RotateCcw, ZoomIn, ZoomOut, Compass as CompassIcon } from "lucide-react";

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

function getGasColorHex(gas: string, val: number, confidence: number) {
  const normVal = Math.min(1, Math.max(0, val));
  if (gas === "ch4") {
    if (normVal < 0.3) return "#3b82f6";
    if (normVal < 0.6) return "#06b6d4";
    return "#a855f7";
  }
  if (gas === "no2") {
    if (normVal < 0.3) return "#facc15";
    if (normVal < 0.6) return "#f97316";
    return "#ef4444";
  }
  if (gas === "so2") {
    if (normVal < 0.5) return "#8b5cf6";
    return "#ec4899";
  }
  if (gas === "co") {
    if (normVal < 0.5) return "#14b8a6";
    return "#f97316";
  }
  if (normVal < 0.2) return "#22c55e";
  if (normVal < 0.4) return "#eab308";
  if (normVal < 0.6) return "#f97316";
  if (normVal < 0.8) return "#ef4444";
  return "#7f1d1d";
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
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const [cesiumReady, setCesiumReady] = useState(false);
  const [measurementResult, setMeasurementResult] = useState<string | null>(null);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Zustand Store binding
  const { camera, setCamera, selectedFacility, setSelectedFacility } = useMapStore();

  // Load Cesium globally
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

    // Use dark basemap initially
    const initialBasemapProvider = new Cesium.UrlTemplateImageryProvider({
      url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    });

    const viewer = new Cesium.Viewer(containerRef.current, {
      imageryProvider: initialBasemapProvider,
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

    viewer.scene.skyBox.show = false;
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#09090b");

    // Initialize camera position from Zustand store
    const storeCam = useMapStore.getState().camera;
    const targetHeight = (6378137 * Math.PI) / Math.pow(2, storeCam.zoom);
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(storeCam.lon, storeCam.lat, targetHeight),
      orientation: {
        heading: Cesium.Math.toRadians(storeCam.bearing),
        pitch: Cesium.Math.toRadians(storeCam.pitch),
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
          setSelectedFacility(metadata);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Mouse Move handler for coordinates
    const mouseHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    mouseHandler.setInputAction((movement: any) => {
      const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        setMouseCoords({ lat, lon });
      } else {
        setMouseCoords(null);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Camera listener to sync state to Zustand store
    viewer.camera.percentageChanged = 0.05;
    viewer.camera.changed.addEventListener(() => {
      const cam = viewer.camera;
      const carto = Cesium.Cartographic.fromCartesian(cam.position);
      if (carto) {
        const lat = Cesium.Math.toDegrees(carto.latitude);
        const lon = Cesium.Math.toDegrees(carto.longitude);
        const zoom = Math.max(1, Math.min(20, Math.round(Math.log2(6378137 * Math.PI / carto.height))));
        const pitch = Cesium.Math.toDegrees(cam.pitch);
        const bearing = Cesium.Math.toDegrees(cam.heading);
        setCamera({ lat, lon, zoom, pitch, bearing });
      }
    });

    return () => {
      handler.destroy();
      mouseHandler.destroy();
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [cesiumReady, onSelectFacility, setCamera, setSelectedFacility]);

  // Update Basemaps instantly
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const Cesium = (window as any).Cesium;
    viewer.imageryLayers.removeAll();

    let provider;
    if (activeBasemap === "satellite") {
      provider = new Cesium.UrlTemplateImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      });
    } else if (activeBasemap === "hybrid") {
      provider = new Cesium.UrlTemplateImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      });
      // Overlay streets/labels on hybrid
      viewer.imageryLayers.addImageryProvider(provider);
      provider = new Cesium.UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
      });
    } else if (activeBasemap === "osm") {
      provider = new Cesium.OpenStreetMapImageryProvider({
        url: "https://a.tile.openstreetmap.org/",
      });
    } else {
      // "dark" / "terrain"
      provider = new Cesium.UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      });
    }

    viewer.imageryLayers.addImageryProvider(provider);

    // Dynamic 3D Terrain
    if (activeBasemap === "terrain") {
      viewer.terrainProvider = Cesium.createWorldTerrain();
    } else {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }
  }, [activeBasemap]);

  // Fly to selected facility when updated from search/externally
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedFacility) return;

    const Cesium = (window as any).Cesium;
    const lat = selectedFacility.lat || selectedFacility.latitude;
    const lon = selectedFacility.lon || selectedFacility.longitude;

    if (lat != null && lon != null) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 200000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: 0.0,
        },
        duration: 2.5,
      });

      // Highlight/open popup
      const entityId = selectedFacility.id ? `plant-point-${selectedFacility.id}` : undefined;
      if (entityId) {
        const ent = viewer.entities.getById(entityId);
        if (ent) {
          viewer.selectedEntity = ent;
        }
      }
    }
  }, [selectedFacility]);

  // Render Cylinders and Contours
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const Cesium = (window as any).Cesium;
    viewer.entities.removeAll();

    // 1. Render Plants
    if (showPlants && showLayers.plants) {
      plants.forEach((p) => {
        viewer.entities.add({
          id: `plant-point-${p.id}`,
          position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat),
          point: {
            pixelSize: 10,
            color: Cesium.Color.fromCssColorString("#10b981"),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
          properties: {
            metadata: {
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

        let timeOffset = idx * 0.5;
        const pulseHeightProperty = new Cesium.CallbackProperty(() => {
          const time = viewer.clock.currentTime.secondsOfDay;
          const factor = 1.0 + 0.15 * Math.sin(time * 2.0 + timeOffset);
          return baseHeight * factor;
        }, false);

        if (selectedMode === "heatmap") {
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(h.lon, h.lat),
            ellipse: {
              semiMajorAxis: h.radius_m || 5000,
              semiMinorAxis: h.radius_m || 5000,
              material: color.withAlpha(confidenceAlpha * 0.25),
              outline: false,
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

  // Camera navigation triggers
  const handleZoom = (zoomIn: boolean) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const factor = zoomIn ? 0.6 : 1.6;
    viewer.camera.zoomIn(viewer.camera.positionCartographic.height * (1 - factor));
  };

  const handleTilt = (tiltUp: boolean) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const Cesium = (window as any).Cesium;
    const angle = Cesium.Math.toRadians(tiltUp ? 5 : -5);
    viewer.camera.lookUp(angle);
  };

  const handleResetCamera = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const Cesium = (window as any).Cesium;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(80.0, 24.0, 8000000.0),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
      },
      duration: 2.0,
    });
  };

  const toggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen().catch((err) => {
        alert(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={mapWrapperRef} className="relative w-full h-[40rem] rounded-xl overflow-hidden border border-ground-700 bg-ground-950">
      {!cesiumReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-15 bg-ground-950/80 backdrop-blur-sm text-sm text-ground-400">
          <span className="h-6 w-6 rounded-full border-2 border-dashed border-sensor animate-spin" />
          <span>Synchronizing 3D Climate Globe...</span>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Control Elements */}
      {cesiumReady && (
        <>
          {/* Compass Dial Indicator (Dynamic rotation based on camera bearing) */}
          <div className="absolute top-4 left-4 bg-ground-900/90 border border-ground-700/80 rounded-xl p-2.5 flex items-center justify-center shadow-2xl z-10 select-none">
            <Compass
              className="h-7 w-7 text-sensor transition-transform duration-100"
              style={{ transform: `rotate(${-camera.bearing}deg)` }}
            />
          </div>

          {/* Mouse Coordinates Readout overlay */}
          <div className="absolute bottom-4 left-4 bg-ground-900/95 border border-ground-700/80 rounded-lg px-3 py-1.5 text-[10px] font-mono text-instrument shadow-lg z-10 select-none">
            {mouseCoords ? (
              <span>
                LAT: {mouseCoords.lat.toFixed(4)}° &middot; LON: {mouseCoords.lon.toFixed(4)}°
              </span>
            ) : (
              <span className="text-ground-500">Out of bounds</span>
            )}
          </div>

          {/* Scale context overlay bar */}
          <div className="absolute bottom-12 left-4 flex flex-col gap-1 z-10 select-none">
            <div className="w-24 h-1.5 border-b-2 border-l-2 border-r-2 border-instrument" />
            <span className="text-[8px] font-mono text-ground-400 uppercase tracking-widest pl-1">
              Zoom level: {camera.zoom}
            </span>
          </div>

          {/* Camera navigation panel buttons (zoom, tilt, reset, fullscreen) */}
          <div className="absolute bottom-4 right-20 bg-ground-900/90 border border-ground-700/80 rounded-xl p-1.5 flex flex-col gap-1 z-10 shadow-2xl">
            <button
              onClick={() => handleZoom(true)}
              className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleZoom(false)}
              className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="h-px bg-ground-700 my-0.5" />
            <button
              onClick={() => handleTilt(true)}
              className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument text-xs font-semibold cursor-pointer"
              title="Tilt Up"
            >
              ▲
            </button>
            <button
              onClick={() => handleTilt(false)}
              className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument text-xs font-semibold cursor-pointer"
              title="Tilt Down"
            >
              ▼
            </button>
            <div className="h-px bg-ground-700 my-0.5" />
            <button
              onClick={handleResetCamera}
              className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer"
              title="Reset Camera Orientation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {measurementResult && (
        <div className="absolute top-4 right-52 bg-ground-900/90 border border-ground-700 px-3 py-1.5 rounded-lg text-xs font-mono text-sensor select-none shadow-lg z-10 animate-pulse">
          {measurementResult}
        </div>
      )}
    </div>
  );
}
