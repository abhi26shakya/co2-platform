"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ExportFormat = "png" | "geojson" | "csv" | "json" | "tiff" | "pdf";

export interface ExportHistoryEntry {
  id: string;
  format: string;
  time: string;
  status: string;
}

export interface MapExportData {
  activeBasemap: string;
  activeGasKeys: string[];
  plants: { name: string; lat: number; lon: number; sector?: string; latest_prediction?: string }[];
  hotspots: { lat: number; lon: number; emission_tonnes_per_year: number | null }[];
  inspectedFacilityName?: string | null;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildExportBlob(format: ExportFormat, data: MapExportData): { blob: Blob | null; filename: string } {
  const filename = `emissia_export.${format}`;

  if (format === "json") {
    const payload = {
      timestamp: new Date().toISOString(),
      activeGases: data.activeGasKeys,
      basemap: data.activeBasemap,
      plants: data.plants,
      hotspots: data.hotspots,
    };
    return { blob: new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), filename };
  }

  if (format === "geojson") {
    const geojson = {
      type: "FeatureCollection",
      features: [
        ...data.plants.map((p) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [p.lon, p.lat] },
          properties: { name: p.name, type: "plant", emissions: p.latest_prediction },
        })),
        ...data.hotspots.map((h, i) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [h.lon, h.lat] },
          properties: { id: i, type: "hotspot", tonnes_per_year: h.emission_tonnes_per_year },
        })),
      ],
    };
    return { blob: new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" }), filename };
  }

  if (format === "csv") {
    let csv = "Type,Name,Lat,Lon,Sector,Emissions\n";
    data.plants.forEach((p) => {
      csv += `Plant,"${p.name}",${p.lat},${p.lon},"${p.sector ?? ""}",${p.latest_prediction ?? ""}\n`;
    });
    data.hotspots.forEach((h, i) => {
      csv += `Hotspot,"Hotspot #${i + 1}",${h.lat},${h.lon},Anomaly,${h.emission_tonnes_per_year ?? ""} t/y\n`;
    });
    return { blob: new Blob([csv], { type: "text/csv" }), filename };
  }

  if (format === "tiff") {
    return {
      blob: new Blob(
        ["Simulated GeoTIFF raster bands data placeholder content for spatial prediction clipping."],
        { type: "image/tiff" }
      ),
      filename: "emissia_raster_placeholder.tif",
    };
  }

  if (format === "pdf") {
    return {
      blob: new Blob(["%PDF-1.4\n% Simulated Emissia Spatial Report PDF Document export placeholder content."], {
        type: "application/pdf",
      }),
      filename: "emissia_report_placeholder.pdf",
    };
  }

  // png handled separately (canvas.toBlob is async) — see exportPng below
  return { blob: null, filename };
}

function exportPng(data: MapExportData) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("EMISSIA 3D EARTH VIEWPORT RENDER", 50, 80);
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "14px monospace";
    ctx.fillText(`Timestamp: ${new Date().toLocaleString()}`, 50, 130);
    ctx.fillText(`Active Basemap: ${data.activeBasemap.toUpperCase()}`, 50, 160);
    ctx.fillText(`Active Gases: ${data.activeGasKeys.join(", ").toUpperCase()}`, 50, 190);
    ctx.fillText(`Inspected: ${data.inspectedFacilityName ?? "None"}`, 50, 220);
  }
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, "emissia_viewport.png");
  });
}

/**
 * Owns export-format state (progress simulation + history log). `getExportData` is called at the
 * moment a download fires so the export always reflects current map state without stale closures.
 */
export function useMapExport(getExportData: () => MapExportData) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<ExportHistoryEntry[]>([]);
  const getExportDataRef = useRef(getExportData);
  useEffect(() => {
    getExportDataRef.current = getExportData;
  }, [getExportData]);
  const activeFormatRef = useRef<ExportFormat | null>(null);

  const triggerExport = useCallback(
    (format: ExportFormat) => {
      if (activeFormatRef.current) return;
      activeFormatRef.current = format;
      setActiveFormat(format);

      let localProgress = 0;
      const interval = setInterval(() => {
        localProgress += 20;
        setProgress(localProgress);
        if (localProgress >= 100) {
          clearInterval(interval);
          const data = getExportDataRef.current();

          if (format === "png") {
            exportPng(data);
          } else {
            const { blob, filename } = buildExportBlob(format, data);
            if (blob) downloadBlob(blob, filename);
          }

          const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          setHistory((prev) => [
            { id: Math.random().toString(36).substring(2, 9), format: format.toUpperCase(), time, status: "Successful" },
            ...prev,
          ]);
          activeFormatRef.current = null;
          setActiveFormat(null);
          setProgress(0);
        }
      }, 150);
    },
    []
  );

  return { activeFormat, progress, history, triggerExport };
}
