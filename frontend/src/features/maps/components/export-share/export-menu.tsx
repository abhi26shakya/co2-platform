import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import type { ExportFormat, ExportHistoryEntry } from "@/features/maps/hooks/use-map-export";

const FORMATS: { format: ExportFormat; label: string; simulated?: boolean }[] = [
  { format: "png", label: "PNG Viewport" },
  { format: "geojson", label: "GeoJSON Spatial" },
  { format: "csv", label: "CSV Table" },
  { format: "json", label: "JSON Metadata" },
  { format: "tiff", label: "GeoTIFF (Raster)", simulated: true },
  { format: "pdf", label: "PDF Report" },
];

interface Props {
  activeFormat: ExportFormat | null;
  progress: number;
  history: ExportHistoryEntry[];
  onExport: (format: ExportFormat) => void;
}

export function ExportMenu({ activeFormat, progress, history, onExport }: Props) {
  return (
    <Card className="glass p-5 space-y-4">
      <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5 border-b border-ground-750 pb-2">
        <Download className="h-3.5 w-3.5" /> Export Data & Viewports
      </h3>
      <div className="space-y-3.5 text-xs text-ground-300">
        <p className="text-[11px] text-ground-450">Download currently filtered layers, geodetic coordinates, or 3D viewport renders.</p>
        <div className="grid grid-cols-2 gap-2">
          {FORMATS.map((exp) => {
            const isExporting = activeFormat === exp.format;
            return (
              <div key={exp.format} className="flex flex-col gap-1 w-full">
                <button
                  disabled={activeFormat !== null}
                  onClick={() => onExport(exp.format)}
                  className="px-2.5 py-1.5 bg-ground-800 hover:bg-ground-750 text-[11px] text-instrument font-semibold rounded-lg text-left flex items-center justify-between cursor-pointer border border-ground-750 disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <Download className={`h-3 w-3 text-sensor ${isExporting ? "animate-bounce" : ""}`} />
                    {exp.label}
                    {exp.simulated && (
                      <span
                        className="px-1 py-0.5 rounded bg-ground-700/60 text-[8px] font-bold uppercase tracking-wider text-ground-400"
                        title="Placeholder content — not generated from real map data"
                      >
                        Simulated
                      </span>
                    )}
                  </span>
                  {isExporting && <span className="text-[8px] font-mono text-sensor animate-pulse">{progress}%</span>}
                </button>
                {isExporting && (
                  <div className="w-full bg-ground-950 h-1.5 rounded-full overflow-hidden border border-ground-800">
                    <div className="bg-sensor h-full transition-all duration-150" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {history.length > 0 && (
          <div className="border-t border-ground-800 pt-3.5 space-y-2">
            <span className="text-[9px] uppercase font-bold text-ground-500 tracking-wider">Export History</span>
            <div className="divide-y divide-ground-850 font-mono text-[9px] text-ground-400 bg-ground-950/20 rounded border border-ground-800/60 max-h-24 overflow-y-auto pr-1">
              {history.map((hist) => (
                <div key={hist.id} className="flex justify-between p-2">
                  <span>
                    {hist.time} &middot; {hist.format}
                  </span>
                  <span className={`font-bold uppercase ${hist.status === "Failed" ? "text-red-400" : "text-sensor"}`}>
                    {hist.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
