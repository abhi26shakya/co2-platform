"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/services/api-client";
import type { ReportOut } from "@/types/report";

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

  // pdf/png are handled separately below — pdf is a real async network call, png is a real
  // (also effectively async) capture of the live map canvas.
  return { blob: null, filename };
}

/** Finds the currently-mounted map engine's canvas (Cesium or MapLibre — whichever has the
 *  `data-map-viewport` wrapper mounted) so PNG export captures a real screenshot rather than a
 *  fabricated placeholder. Requires `preserveDrawingBuffer: true` on both engines' WebGL context,
 *  otherwise the browser clears the buffer after each frame and this reads back blank. */
function findMapCanvas(): HTMLCanvasElement | null {
  return document.querySelector<HTMLCanvasElement>("[data-map-viewport] canvas");
}

function exportPng(): Promise<{ ok: true } | { ok: false; reason: string }> {
  return new Promise((resolve) => {
    const canvas = findMapCanvas();
    if (!canvas) {
      resolve({ ok: false, reason: "Map canvas not ready — try again once the map has finished loading." });
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve({ ok: false, reason: "Could not capture the map viewport." });
        return;
      }
      downloadBlob(blob, "emissia_viewport.png");
      resolve({ ok: true });
    });
  });
}

/** Calls the real backend report generator (backend/app/services/reports.py) instead of
 *  fabricating a placeholder PDF. Downloads via the returned storage URL, which the Next.js
 *  rewrite proxies straight to the backend's (dev-mode, unauthenticated) file-serving route. */
async function exportPdf(): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    const report = await api.post<ReportOut>("/reports", { format: "pdf" });
    if (!report.url) {
      return { ok: false, reason: "Report generated but no download URL was returned." };
    }
    const link = document.createElement("a");
    link.href = report.url;
    link.download = `${report.title.replace(/[^a-z0-9]+/gi, "_")}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
    return { ok: true };
  } catch (err) {
    const reason = err instanceof ApiError ? err.message : "Report generation failed — is the backend running?";
    return { ok: false, reason };
  }
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

      const recordHistory = (status: "Successful" | "Failed") => {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setHistory((prev) => [
          { id: Math.random().toString(36).substring(2, 9), format: format.toUpperCase(), time, status },
          ...prev,
        ]);
        activeFormatRef.current = null;
        setActiveFormat(null);
        setProgress(0);
      };

      let localProgress = 0;
      const interval = setInterval(() => {
        localProgress += 20;
        setProgress(localProgress);
        if (localProgress >= 100) {
          clearInterval(interval);

          // png/pdf are real async operations (canvas capture, network call); the rest stay
          // synchronous, built from already-fetched map state.
          if (format === "png") {
            void exportPng().then((result) => recordHistory(result.ok ? "Successful" : "Failed"));
          } else if (format === "pdf") {
            void exportPdf().then((result) => recordHistory(result.ok ? "Successful" : "Failed"));
          } else {
            const data = getExportDataRef.current();
            const { blob, filename } = buildExportBlob(format, data);
            if (blob) downloadBlob(blob, filename);
            recordHistory("Successful");
          }
        }
      }, 150);
    },
    []
  );

  return { activeFormat, progress, history, triggerExport };
}
