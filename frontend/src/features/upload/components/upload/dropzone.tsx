"use client";

import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const ACCEPT = ".png,.jpg,.jpeg,.tif,.tiff";
const MAX_MB = 200;

export function Dropzone({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const accept = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      setClientError(null);
      const ext = file.name.toLowerCase().split(".").pop() ?? "";
      if (!["png", "jpg", "jpeg", "tif", "tiff"].includes(ext)) {
        setClientError("Use PNG, JPG, or TIFF/GeoTIFF.");
        return;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setClientError(`File exceeds the ${MAX_MB} MB limit.`);
        return;
      }
      onFile(file);
    },
    [onFile]
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center transition-colors",
          dragging
            ? "border-sensor bg-ground-800/80"
            : "border-ground-700 bg-ground-900/40 hover:border-ground-400"
        )}
      >
        <UploadCloud className="h-8 w-8 text-ground-400" aria-hidden />
        <div>
          <p className="text-sm">Drop a satellite scene here, or click to browse</p>
          <p className="readout mt-1 text-xs text-ground-400">
            PNG · JPG · TIFF · GeoTIFF — up to {MAX_MB} MB
          </p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {clientError && <p className="mt-2 text-sm text-alert">{clientError}</p>}
    </div>
  );
}
