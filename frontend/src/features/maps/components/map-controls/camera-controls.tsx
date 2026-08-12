import { HelpCircle, Layers, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onTiltUp: () => void;
  onTiltDown: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
  legendOn?: boolean;
  onToggleLegend?: () => void;
  onShowHelp?: () => void;
}

/** Bottom-right control dock — a horizontal pill row (Legend / Help / tilt / reset / fullscreen /
 *  zoom), structurally modeled on Climate TRACE's bottom-right button cluster rather than this
 *  app's previous vertical button stack. Handlers live in the map canvas engine. */
export function CameraControls({
  onZoomIn,
  onZoomOut,
  onTiltUp,
  onTiltDown,
  onReset,
  onToggleFullscreen,
  legendOn = false,
  onToggleLegend,
  onShowHelp,
}: Props) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5">
      {onToggleLegend && (
        <button
          onClick={onToggleLegend}
          className={`glass-strong h-8 px-3 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer transition-colors ${
            legendOn ? "text-sensor" : "text-ground-300 hover:text-instrument"
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> Legend
        </button>
      )}
      {onShowHelp && (
        <button
          onClick={onShowHelp}
          className="glass-strong h-8 px-3 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold text-ground-300 hover:text-instrument cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" /> How to use
        </button>
      )}

      <div className="glass-strong h-8 rounded-lg p-1 flex items-center gap-0.5">
        <button onClick={onTiltUp} className="h-6 w-6 rounded hover:bg-ground-800 flex items-center justify-center text-instrument text-[10px] font-semibold cursor-pointer" title="Tilt Up">
          ▲
        </button>
        <button onClick={onTiltDown} className="h-6 w-6 rounded hover:bg-ground-800 flex items-center justify-center text-instrument text-[10px] font-semibold cursor-pointer" title="Tilt Down">
          ▼
        </button>
        <div className="w-px h-4 bg-ground-700 mx-0.5" />
        <button onClick={onReset} className="h-6 w-6 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer" title="Reset Camera Orientation">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button onClick={onToggleFullscreen} className="h-6 w-6 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer" title="Toggle Fullscreen">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="glass-strong h-8 rounded-lg p-1 flex items-center gap-0.5">
        <button onClick={onZoomIn} className="h-6 w-6 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer" title="Zoom In">
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button onClick={onZoomOut} className="h-6 w-6 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer" title="Zoom Out">
          <Minus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
