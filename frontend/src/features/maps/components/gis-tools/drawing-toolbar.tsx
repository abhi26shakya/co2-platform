import { Card } from "@/components/ui/card";
import { Info, PenTool } from "lucide-react";
import type { CompletedDrawing, DrawingToolId } from "@/features/maps/components/gis-tools/lib/geo-math";
import type { DrawingMode } from "@/features/maps/hooks/use-drawing";

const TOOLS: { id: DrawingToolId; label: string }[] = [
  { id: "polygon", label: "Polygon Bounds" },
  { id: "rectangle", label: "Rectangle Crop" },
  { id: "circle", label: "Circle Buffer" },
  { id: "polyline", label: "Polyline Track" },
  { id: "distance", label: "Distance Ruler" },
  { id: "area", label: "Area Estimator" },
  { id: "picker", label: "Coords Picker" },
];

interface Props {
  drawingMode: DrawingMode;
  onToggleTool: (tool: DrawingToolId) => void;
  liveMeasurement: string | null;
  completedDrawings: CompletedDrawing[];
  onRemoveDrawing: (id: string) => void;
  onClearAll: () => void;
  onExportGeoJSON: () => void;
  exportStatus: string | null;
}

export function DrawingToolbar({
  drawingMode,
  onToggleTool,
  liveMeasurement,
  completedDrawings,
  onRemoveDrawing,
  onClearAll,
  onExportGeoJSON,
  exportStatus,
}: Props) {
  return (
    <Card className="p-4 bg-ground-900/40 border-ground-700/80 space-y-3">
      <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5 border-b border-ground-800 pb-1.5">
        <PenTool className="h-3.5 w-3.5" /> GIS Drawing Tools
      </h3>

      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToggleTool(tool.id)}
            className={`px-2 py-1.5 rounded font-semibold border transition-all cursor-pointer text-center ${
              drawingMode === tool.id
                ? "bg-sensor/10 border-sensor text-sensor"
                : "border-ground-700 hover:border-ground-500 text-ground-400"
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {liveMeasurement && (
        <div className="p-2 bg-sensor/5 border border-sensor/20 rounded text-[10px] text-sensor font-mono animate-pulse">
          Live: {liveMeasurement}
        </div>
      )}

      {completedDrawings.length > 0 && (
        <div className="space-y-1.5 border-t border-ground-850 pt-2 text-[10px]">
          <span className="text-[9px] uppercase font-bold text-ground-500 tracking-wider">Completed Shapes</span>
          <div className="space-y-1 max-h-24 overflow-y-auto pr-1 select-none">
            {completedDrawings.map((draw, idx) => (
              <div key={draw.id} className="flex items-center justify-between p-1.5 bg-ground-950/40 border border-ground-850 rounded">
                <span className="text-instrument capitalize">
                  {draw.type} #{idx + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono text-ground-450">{draw.measurement}</span>
                  <button
                    onClick={() => onRemoveDrawing(draw.id)}
                    className="text-red-400 hover:text-red-300 font-bold px-1"
                    title="Delete drawing"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-1.5 border-t border-ground-850 pt-2.5">
        <button
          onClick={onClearAll}
          className="px-2 py-1 bg-ground-800 hover:bg-ground-750 text-[10px] font-bold text-ground-400 hover:text-instrument rounded text-center transition-colors cursor-pointer border border-transparent"
        >
          Clear All
        </button>
        <button
          onClick={onExportGeoJSON}
          className="px-2 py-1 bg-sensor/10 hover:bg-sensor/20 text-[10px] font-bold text-sensor rounded text-center transition-colors cursor-pointer border border-sensor/20"
        >
          Export GeoJSON
        </button>
      </div>

      {exportStatus && (
        <div className="text-[9px] text-ground-400 bg-ground-950/40 p-1.5 rounded border border-ground-850">
          {exportStatus}
        </div>
      )}

      <div className="text-[8px] text-ground-555 leading-normal uppercase tracking-wider flex gap-1 items-start bg-ground-950/40 p-1.5 rounded border border-ground-850">
        <Info className="h-3.5 w-3.5 text-ground-500 shrink-0 mt-0.5" />
        <span>GIS layers pre-allocated for boundary clipping in backend spatial databases.</span>
      </div>
    </Card>
  );
}
