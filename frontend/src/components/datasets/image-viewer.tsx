"use client";

/* eslint-disable @next/next/no-img-element -- viewer displays dynamic API files */
import { cn } from "@/lib/utils";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 12;

/** Zoom (wheel / buttons) + pan (drag) viewer for satellite scenes. */
export function ImageViewer({ src, title, subtitle, onClose }: Props) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ x: number; y: number } | null>(null);

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
  const zoomBy = useCallback((factor: number) => {
    setZoom((z) => clampZoom(z * factor));
  }, []);
  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoomBy(1.25);
      if (e.key === "-") zoomBy(0.8);
      if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, zoomBy, reset]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ground-950/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${title}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-ground-700 px-5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm">{title}</p>
          {subtitle && <p className="readout truncate text-xs text-ground-400">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="readout mr-2 text-xs text-ground-400">
            {(zoom * 100).toFixed(0)}%
          </span>
          <ViewerButton onClick={() => zoomBy(0.8)} label="Zoom out">
            <Minus className="h-4 w-4" aria-hidden />
          </ViewerButton>
          <ViewerButton onClick={() => zoomBy(1.25)} label="Zoom in">
            <Plus className="h-4 w-4" aria-hidden />
          </ViewerButton>
          <ViewerButton onClick={reset} label="Reset view">
            <RotateCcw className="h-4 w-4" aria-hidden />
          </ViewerButton>
          <ViewerButton onClick={onClose} label="Close viewer">
            <X className="h-4 w-4" aria-hidden />
          </ViewerButton>
        </div>
      </div>

      <div
        className={cn("flex-1 overflow-hidden", dragging.current ? "cursor-grabbing" : "cursor-grab")}
        onWheel={(e) => zoomBy(e.deltaY < 0 ? 1.15 : 0.87)}
        onPointerDown={(e) => {
          dragging.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          setOffset({ x: e.clientX - dragging.current.x, y: e.clientY - dragging.current.y });
        }}
        onPointerUp={() => (dragging.current = null)}
      >
        <div className="flex h-full items-center justify-center">
          <img
            src={src}
            alt={title}
            draggable={false}
            className="max-h-full max-w-full select-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transition: dragging.current ? "none" : "transform 120ms ease-out",
            }}
          />
        </div>
      </div>

      <p className="readout border-t border-ground-700 px-5 py-2 text-center text-xs text-ground-400">
        scroll to zoom · drag to pan · +/− keys · 0 resets · esc closes
      </p>
    </div>
  );
}

function ViewerButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-lg border border-ground-700 bg-ground-800 p-2 transition-colors hover:border-ground-400"
    >
      {children}
    </button>
  );
}
