"use client";

import { useCallback, useState } from "react";
import type { CompletedDrawing, DrawingToolId } from "@/features/maps/components/gis-tools/lib/geo-math";

export type DrawingMode = DrawingToolId | "none";

/**
 * Owns GIS drawing-tool UI state (active tool, completed shapes, live measurement readout).
 * The actual Cesium scene-picking and GeoJSON assembly happens inside the map canvas engine
 * (which calls back into `addDrawing`); this hook keeps that state out of the page component.
 */
export function useDrawing() {
  const [drawingMode, setDrawingModeState] = useState<DrawingMode>("none");
  const [liveMeasurement, setLiveMeasurement] = useState<string | null>(null);
  const [completedDrawings, setCompletedDrawings] = useState<CompletedDrawing[]>([]);
  const [clearTrigger, setClearTrigger] = useState(0);

  const toggleDrawingMode = useCallback((mode: DrawingToolId) => {
    setDrawingModeState((current) => (current === mode ? "none" : mode));
  }, []);

  const addDrawing = useCallback((draw: CompletedDrawing) => {
    setCompletedDrawings((prev) => [...prev, draw]);
    setDrawingModeState("none");
    setLiveMeasurement(null);
  }, []);

  const removeDrawing = useCallback((id: string) => {
    setCompletedDrawings((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const clearDrawings = useCallback(() => {
    setCompletedDrawings([]);
    setClearTrigger((t) => t + 1);
  }, []);

  const exportGeoJSON = useCallback((): { ok: true } | { ok: false; reason: string } => {
    if (completedDrawings.length === 0) {
      return { ok: false, reason: "No drawings to export yet — draw a shape on the map first." };
    }
    const featureCollection = {
      type: "FeatureCollection",
      features: completedDrawings.map((d) => d.geojson),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(featureCollection, null, 2));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", "emissia_drawings.geojson");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return { ok: true };
  }, [completedDrawings]);

  return {
    drawingMode,
    toggleDrawingMode,
    liveMeasurement,
    setLiveMeasurement,
    completedDrawings,
    addDrawing,
    removeDrawing,
    clearDrawings,
    clearTrigger,
    exportGeoJSON,
  };
}
