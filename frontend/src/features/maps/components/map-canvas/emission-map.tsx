"use client";

import { useEffect, useRef, useState } from "react";
import { useMapStore } from "@/features/maps/store/map-store";
import type { MapHotspot, PlantOut } from "@/types/geo";
import { Compass } from "lucide-react";
import { CameraControls } from "@/features/maps/components/map-controls/camera-controls";
import {
  buildCircleResult,
  buildPickerResult,
  buildPolygonResult,
  buildPolylineResult,
  buildRectangleResult,
  type CompletedDrawing,
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
  onSelectFacility?: (fac: any) => void;
  drawingMode?: DrawingMode;
  comparisonMode?: boolean;
  showLayers?: ShowLayers;
  onDrawingComplete?: (draw: CompletedDrawing) => void;
  onLiveMeasurement?: (text: string | null) => void;
  clearTrigger?: number;
  comparisonType?: string;
  cameraTarget?: { lat: number; lon: number } | null;
}

interface PlumePoint {
  lat: number;
  lon: number;
  intensity: number;
  value: number;
  unit: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function getGasColorHex(gas: string, val: number) {
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

const getGasPlumes = (gas: string, baseHotspots: MapHotspot[]): PlumePoint[] => {
  return baseHotspots.map((h, i) => {
    let latOffset = 0;
    let lonOffset = 0;
    let valueMultiplier = 1.0;
    let unit = "ppm";

    if (gas === "ch4") {
      latOffset = 0.02 * Math.sin(i);
      lonOffset = 0.02 * Math.cos(i);
      valueMultiplier = 1950.0;
      unit = "ppb";
    } else if (gas === "no2") {
      latOffset = -0.015 * Math.cos(i * 1.5);
      lonOffset = 0.015 * Math.sin(i * 1.5);
      valueMultiplier = 95.0;
      unit = "ppb";
    } else if (gas === "so2") {
      latOffset = 0.03 * Math.sin(i * 2);
      lonOffset = -0.01 * Math.cos(i * 2);
      valueMultiplier = 45.0;
      unit = "ppb";
    } else if (gas === "co") {
      latOffset = -0.01 * Math.cos(i * 0.5);
      lonOffset = -0.02 * Math.sin(i * 0.5);
      valueMultiplier = 120.0;
      unit = "ppb";
    } else {
      latOffset = 0;
      lonOffset = 0;
      valueMultiplier = 415.0;
      unit = "ppm";
    }

    return {
      lat: h.lat + latOffset,
      lon: h.lon + lonOffset,
      intensity: h.intensity,
      value: h.intensity * valueMultiplier,
      unit,
    };
  });
};

export default function EmissionMap({
  plants,
  hotspots,
  showPlants,
  showHotspots,
  selectedMode = "volume3d",
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
  const viewerRef = useRef<any>(null);
  const [cesiumReady, setCesiumReady] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);

  const { camera, setCamera, selectedFacility, setSelectedFacility, gases } = useMapStore();

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

  useEffect(() => {
    if (!cesiumReady || !containerRef.current || viewerRef.current) return;

    const Cesium = (window as any).Cesium;

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

    const mouseHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    mouseHandler.setInputAction((movement: any) => {
      const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        setMouseCoords({
          lat: Cesium.Math.toDegrees(cartographic.latitude),
          lon: Cesium.Math.toDegrees(cartographic.longitude),
        });
      } else {
        setMouseCoords(null);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    viewer.camera.percentageChanged = 0.05;
    viewer.camera.changed.addEventListener(() => {
      const cam = viewer.camera;
      const carto = Cesium.Cartographic.fromCartesian(cam.position);
      if (carto) {
        const lat = Cesium.Math.toDegrees(carto.latitude);
        const lon = Cesium.Math.toDegrees(carto.longitude);
        const zoom = Math.max(1, Math.min(20, Math.round(Math.log2((6378137 * Math.PI) / carto.height))));
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
      viewer.imageryLayers.addImageryProvider(provider);
      provider = new Cesium.UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
      });
    } else if (activeBasemap === "osm") {
      provider = new Cesium.OpenStreetMapImageryProvider({ url: "https://a.tile.openstreetmap.org/" });
    } else {
      provider = new Cesium.UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      });
    }

    viewer.imageryLayers.addImageryProvider(provider);

    if (activeBasemap === "terrain") {
      viewer.terrainProvider = Cesium.createWorldTerrain();
    } else {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }
  }, [activeBasemap]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedFacility) return;

    const Cesium = (window as any).Cesium;
    const lat = selectedFacility.lat || selectedFacility.latitude;
    const lon = selectedFacility.lon || selectedFacility.longitude;

    if (lat != null && lon != null) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 200000.0),
        orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-45.0), roll: 0.0 },
        duration: 2.5,
      });

      const entityId = selectedFacility.id ? `plant-point-${selectedFacility.id}` : undefined;
      if (entityId) {
        const ent = viewer.entities.getById(entityId);
        if (ent) viewer.selectedEntity = ent;
      }
    }
  }, [selectedFacility]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !cameraTarget) return;

    const Cesium = (window as any).Cesium;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(cameraTarget.lon, cameraTarget.lat, 120000.0),
      orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-60.0), roll: 0.0 },
      duration: 2.0,
    });
  }, [cameraTarget]);

  // Render plants + multi-gas plume fields
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const Cesium = (window as any).Cesium;
    viewer.entities.removeAll();

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

    if (showHotspots && showLayers.heatmap) {
      const activeGasKeys = Object.keys(gases).filter((k) => gases[k].enabled);

      activeGasKeys.forEach((gasKey) => {
        const config = gases[gasKey];
        const plumes = getGasPlumes(gasKey, hotspots);

        plumes.forEach((plume, idx) => {
          const valueNorm = Math.min(1, plume.intensity);
          const colorHex = getGasColorHex(gasKey, valueNorm);
          const color = Cesium.Color.fromCssColorString(colorHex);
          const baseHeight = 50000 * valueNorm;
          const timeOffset = idx * 0.5;

          let finalColorHex = colorHex;
          let finalColor = color;

          if (comparisonMode) {
            if (comparisonType === "difference-layer") {
              const indexSum = Math.floor(plume.lat * 100 + plume.lon * 100);
              finalColorHex = indexSum % 2 === 0 ? "#3b82f6" : "#ef4444";
              finalColor = Cesium.Color.fromCssColorString(finalColorHex);
            } else if (comparisonType === "confidence-layer") {
              const confNorm = plume.intensity;
              finalColorHex = confNorm > 0.8 ? "#10b981" : confNorm > 0.6 ? "#f59e0b" : "#ef4444";
              finalColor = Cesium.Color.fromCssColorString(finalColorHex);
            }
          }

          const pulseHeightProperty = new Cesium.CallbackProperty(() => {
            const time = viewer.clock.currentTime.secondsOfDay;
            const factor = 1.0 + 0.15 * Math.sin(time * 2.0 + timeOffset);
            return baseHeight * factor;
          }, false);

          const entityMeta = {
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

          if (selectedMode === "markers") {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(plume.lon, plume.lat),
              point: {
                pixelSize: 12,
                color: finalColor.withAlpha(config.opacity),
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              },
              properties: { metadata: entityMeta },
            });
          } else if (selectedMode === "heatmap") {
            const plumeCanvas = document.createElement("canvas");
            plumeCanvas.width = 128;
            plumeCanvas.height = 128;
            const ctx = plumeCanvas.getContext("2d");
            if (ctx) {
              const rgb = hexToRgb(finalColorHex) || { r: 250, g: 100, b: 100 };
              const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 60);
              grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity})`);
              grad.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity * 0.4})`);
              grad.addColorStop(0.8, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity * 0.1})`);
              grad.addColorStop(1.0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(64, 64, 64, 0, 2 * Math.PI);
              ctx.fill();
            }
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(plume.lon, plume.lat),
              ellipse: {
                semiMajorAxis: 18000.0,
                semiMinorAxis: 18000.0,
                material: new Cesium.ImageMaterialProperty({ image: plumeCanvas, transparent: true }),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              },
              properties: { metadata: entityMeta },
            });
          } else if (selectedMode === "animated") {
            const plumeCanvas = document.createElement("canvas");
            plumeCanvas.width = 128;
            plumeCanvas.height = 128;
            const ctx = plumeCanvas.getContext("2d");

            const animCanvasProperty = new Cesium.CallbackProperty(() => {
              if (ctx) {
                ctx.clearRect(0, 0, 128, 128);
                const time = viewer.clock.currentTime.secondsOfDay;
                const pulseFactor = 1.0 + 0.15 * Math.sin(time * 2.5 + timeOffset);
                const rgb = hexToRgb(finalColorHex) || { r: 250, g: 100, b: 100 };

                const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 60 * pulseFactor);
                grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity})`);
                grad.addColorStop(0.35, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity * 0.5})`);
                grad.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity * 0.15})`);
                grad.addColorStop(1.0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(64, 64, 64, 0, 2 * Math.PI);
                ctx.fill();
              }
              return plumeCanvas;
            }, false);

            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(plume.lon, plume.lat),
              ellipse: {
                semiMajorAxis: 20000.0,
                semiMinorAxis: 20000.0,
                material: new Cesium.ImageMaterialProperty({ image: animCanvasProperty, transparent: true }),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              },
              properties: { metadata: entityMeta },
            });
          } else if (selectedMode === "contours") {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(plume.lon, plume.lat, 10),
              ellipse: {
                semiMajorAxis: 8000.0,
                semiMinorAxis: 8000.0,
                material: Cesium.Color.TRANSPARENT,
                outline: true,
                outlineColor: finalColor.withAlpha(config.opacity * 0.95),
                outlineWidth: 2.5,
              },
            });
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(plume.lon, plume.lat, 10),
              ellipse: {
                semiMajorAxis: 16000.0,
                semiMinorAxis: 16000.0,
                material: Cesium.Color.TRANSPARENT,
                outline: true,
                outlineColor: finalColor.withAlpha(config.opacity * 0.45),
                outlineWidth: 1.5,
              },
              properties: { metadata: entityMeta },
            });
          } else {
            viewer.entities.add({
              id: `gas-plume-col-${gasKey}-${idx}`,
              position: Cesium.Cartesian3.fromDegrees(plume.lon, plume.lat),
              cylinder: {
                length: pulseHeightProperty,
                topRadius: 3000.0,
                bottomRadius: 3000.0,
                material: finalColor.withAlpha(config.opacity * 0.65),
                outline: true,
                outlineColor: finalColor,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              },
              properties: { metadata: entityMeta },
            });
          }
        });
      });
    }
  }, [plants, hotspots, showPlants, showHotspots, selectedMode, showLayers, gases, comparisonMode, comparisonType]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const toRemove: any[] = [];
    viewer.entities.values.forEach((ent: any) => {
      if (ent.id && ent.id.toString().startsWith("gis-draw-")) {
        toRemove.push(ent);
      }
    });
    toRemove.forEach((ent) => viewer.entities.remove(ent));
  }, [clearTrigger]);

  // GIS drawing/measurement tools — geometry & GeoJSON assembly delegated to gis-tools/lib/geo-math.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || drawingMode === "none") return;

    const Cesium = (window as any).Cesium;
    let activePoints: any[] = [];
    const entityCollection: any[] = [];
    let isDrawing = false;
    let anchorPoint: any = null;

    const drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    const toLatLon = (cartesian: any) => {
      const carto = Cesium.Cartographic.fromCartesian(cartesian);
      return { lat: Cesium.Math.toDegrees(carto.latitude), lon: Cesium.Math.toDegrees(carto.longitude) };
    };

    drawHandler.setInputAction((click: any) => {
      const cartesian = viewer.scene.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
      if (!cartesian) return;

      const uuid = Math.random().toString(36).substring(2, 9);

      if (drawingMode === "picker") {
        viewer.entities.add({
          id: `gis-draw-marker-${uuid}`,
          position: cartesian,
          point: {
            pixelSize: 12,
            color: Cesium.Color.fromCssColorString("#10b981"),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });
        onDrawingComplete(buildPickerResult(toLatLon(cartesian), uuid));
        return;
      }

      if (drawingMode === "rectangle" || drawingMode === "circle") {
        if (!isDrawing) {
          isDrawing = true;
          anchorPoint = cartesian;
          const pt = viewer.entities.add({
            id: `gis-draw-pt-${uuid}`,
            position: cartesian,
            point: { pixelSize: 8, color: Cesium.Color.RED },
          });
          entityCollection.push(pt);
        } else {
          isDrawing = false;
          const endPoint = cartesian;

          if (drawingMode === "rectangle") {
            const { west, east, south, north } = (() => {
              const a = toLatLon(anchorPoint);
              const b = toLatLon(endPoint);
              return {
                west: Math.min(a.lon, b.lon),
                east: Math.max(a.lon, b.lon),
                south: Math.min(a.lat, b.lat),
                north: Math.max(a.lat, b.lat),
              };
            })();

            viewer.entities.add({
              id: `gis-draw-rect-${uuid}`,
              rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(west, south, east, north),
                material: Cesium.Color.RED.withAlpha(0.2),
                outline: true,
                outlineColor: Cesium.Color.RED,
                outlineWidth: 2,
              },
            });

            onDrawingComplete(buildRectangleResult(toLatLon(anchorPoint), toLatLon(endPoint), uuid));
          } else {
            const radiusM = Cesium.Cartesian3.distance(anchorPoint, endPoint);
            viewer.entities.add({
              id: `gis-draw-circle-${uuid}`,
              position: anchorPoint,
              ellipse: {
                semiMajorAxis: radiusM,
                semiMinorAxis: radiusM,
                material: Cesium.Color.RED.withAlpha(0.2),
                outline: true,
                outlineColor: Cesium.Color.RED,
                outlineWidth: 2,
              },
            });

            onDrawingComplete(buildCircleResult(toLatLon(anchorPoint), radiusM, uuid));
          }
        }
        return;
      }

      activePoints.push(cartesian);

      const pt = viewer.entities.add({
        id: `gis-draw-pt-${uuid}`,
        position: cartesian,
        point: { pixelSize: 6, color: Cesium.Color.RED },
      });
      entityCollection.push(pt);

      if (activePoints.length > 1) {
        const line = viewer.entities.add({
          id: `gis-draw-line-${uuid}`,
          polyline: { positions: activePoints, width: 2.5, material: Cesium.Color.RED },
        });
        entityCollection.push(line);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    drawHandler.setInputAction((movement: any) => {
      const cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (!cartesian) return;

      const coords = toLatLon(cartesian);

      if (drawingMode === "picker") {
        onLiveMeasurement(`Coords Picker: ${coords.lat.toFixed(4)}°, ${coords.lon.toFixed(4)}°`);
        return;
      }

      if (drawingMode === "rectangle" && isDrawing && anchorPoint) {
        const anchorLatLon = toLatLon(anchorPoint);
        const areaResult = buildRectangleResult(anchorLatLon, coords, "preview");
        onLiveMeasurement(`Rectangle ${areaResult.measurement}`);
        return;
      }

      if (drawingMode === "circle" && isDrawing && anchorPoint) {
        const radiusM = Cesium.Cartesian3.distance(anchorPoint, cartesian);
        const circleResult = buildCircleResult(toLatLon(anchorPoint), radiusM, "preview");
        onLiveMeasurement(`Circle ${circleResult.measurement}`);
        return;
      }

      if (activePoints.length > 0) {
        const tempPoints = [...activePoints, cartesian];
        const tempCoordsList = tempPoints.map(toLatLon);

        if (drawingMode === "polyline" || drawingMode === "distance") {
          let dist = 0;
          for (let i = 0; i < tempPoints.length - 1; i++) {
            dist += Cesium.Cartesian3.distance(tempPoints[i], tempPoints[i + 1]);
          }
          onLiveMeasurement(buildPolylineResult(tempCoordsList, dist, "preview").measurement);
        } else if (drawingMode === "polygon" || drawingMode === "area") {
          onLiveMeasurement(buildPolygonResult(tempCoordsList, "preview").measurement);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    drawHandler.setInputAction(() => {
      if (activePoints.length < 2) return;

      const uuid = Math.random().toString(36).substring(2, 9);
      const coordsList = activePoints.map(toLatLon);

      if (drawingMode === "polyline" || drawingMode === "distance") {
        viewer.entities.add({
          id: `gis-draw-polyline-${uuid}`,
          polyline: { positions: activePoints, width: 3.0, material: Cesium.Color.RED },
        });

        let dist = 0;
        for (let i = 0; i < activePoints.length - 1; i++) {
          dist += Cesium.Cartesian3.distance(activePoints[i], activePoints[i + 1]);
        }
        onDrawingComplete(buildPolylineResult(coordsList, dist, uuid, drawingMode));
      } else if (drawingMode === "polygon" || drawingMode === "area") {
        viewer.entities.add({
          id: `gis-draw-polygon-${uuid}`,
          polygon: {
            hierarchy: activePoints,
            material: Cesium.Color.RED.withAlpha(0.2),
            outline: true,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 2,
          },
        });

        onDrawingComplete(buildPolygonResult(coordsList, uuid, drawingMode));
      }

      drawHandler.destroy();
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    return () => {
      drawHandler.destroy();
      entityCollection.forEach((ent) => viewer.entities.remove(ent));
      onLiveMeasurement(null);
    };
  }, [drawingMode, clearTrigger, onDrawingComplete, onLiveMeasurement]);

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
    viewer.camera.lookUp(Cesium.Math.toRadians(tiltUp ? 5 : -5));
  };

  const handleResetCamera = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const Cesium = (window as any).Cesium;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(80.0, 24.0, 8000000.0),
      orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 },
      duration: 2.0,
    });
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
    <div ref={mapWrapperRef} className="relative w-full h-full min-h-[40rem] rounded-xl overflow-hidden border border-ground-700 bg-ground-950">
      {!cesiumReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-15 bg-ground-950/80 backdrop-blur-sm text-sm text-ground-400">
          <span className="h-6 w-6 rounded-full border-2 border-dashed border-sensor animate-spin" />
          <span>Synchronizing 3D Climate Globe...</span>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />

      {cesiumReady && (
        <>
          <div className="absolute top-4 left-4 bg-ground-900/90 border border-ground-700/80 rounded-xl p-2.5 flex items-center justify-center shadow-2xl z-10 select-none">
            <Compass className="h-7 w-7 text-sensor transition-transform duration-100" style={{ transform: `rotate(${-camera.bearing}deg)` }} />
          </div>

          <div className="absolute bottom-4 left-4 bg-ground-900/95 border border-ground-700/80 rounded-lg px-3 py-1.5 text-[10px] font-mono text-instrument shadow-lg z-10 select-none">
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
            <span className="text-[8px] font-mono text-ground-400 uppercase tracking-widest pl-1">Zoom level: {camera.zoom}</span>
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
