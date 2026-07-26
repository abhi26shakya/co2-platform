import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onTiltUp: () => void;
  onTiltDown: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
}

/** Presentational camera-control button stack — Cesium viewer handlers live in the map canvas engine. */
export function CameraControls({ onZoomIn, onZoomOut, onTiltUp, onTiltDown, onReset, onToggleFullscreen }: Props) {
  return (
    <div className="absolute bottom-4 right-20 bg-ground-900/90 border border-ground-700/80 rounded-xl p-1.5 flex flex-col gap-1 z-10 shadow-2xl">
      <button onClick={onZoomIn} className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer" title="Zoom In">
        <ZoomIn className="h-4 w-4" />
      </button>
      <button onClick={onZoomOut} className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer" title="Zoom Out">
        <ZoomOut className="h-4 w-4" />
      </button>
      <div className="h-px bg-ground-700 my-0.5" />
      <button onClick={onTiltUp} className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument text-xs font-semibold cursor-pointer" title="Tilt Up">
        ▲
      </button>
      <button onClick={onTiltDown} className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument text-xs font-semibold cursor-pointer" title="Tilt Down">
        ▼
      </button>
      <div className="h-px bg-ground-700 my-0.5" />
      <button onClick={onReset} className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer" title="Reset Camera Orientation">
        <RotateCcw className="h-4 w-4" />
      </button>
      <button onClick={onToggleFullscreen} className="h-7.5 w-7.5 rounded hover:bg-ground-800 flex items-center justify-center text-instrument cursor-pointer" title="Toggle Fullscreen">
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}
