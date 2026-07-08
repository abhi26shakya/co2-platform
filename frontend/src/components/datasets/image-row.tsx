"use client";

/* eslint-disable @next/next/no-img-element -- thumbnails are dynamic API files */
import { ImageViewer } from "@/components/datasets/image-viewer";
import { useDeleteImage } from "@/hooks/use-images";
import { useRunPrediction } from "@/hooks/use-run-prediction";
import { cn } from "@/lib/utils";
import type { ImageOut } from "@/types/image";
import { Download, ImageIcon, Play, Trash2 } from "lucide-react";
import { useState } from "react";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

export function ImageRow({ image }: { image: ImageOut }) {
  const run = useRunPrediction();
  const del = useDeleteImage();
  const [confirming, setConfirming] = useState(false);
  const [viewing, setViewing] = useState(false);

  const thumb = image.preview_url ?? image.url;
  const result = run.data;

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {thumb ? (
          <button
            onClick={() => setViewing(true)}
            className="shrink-0 rounded-lg transition-opacity hover:opacity-80"
            aria-label={`View ${image.filename}`}
          >
            <img
              src={thumb}
              alt=""
              className="h-12 w-12 rounded-lg border border-ground-700 object-cover"
            />
          </button>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-ground-700 bg-ground-800">
            <ImageIcon className="h-5 w-5 text-ground-400" aria-hidden />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm">{image.filename}</p>
          <p className="readout mt-0.5 text-xs text-ground-400">
            {formatBytes(image.size_bytes)}
            {image.width ? ` · ${image.width}×${image.height}` : ""}
            {image.crs ? ` · ${image.crs}` : " · no geodata"}
            {" · "}
            {new Date(image.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-16 sm:pl-0">
        {result && result.co2_emission_tonnes_per_year != null && (
          <span className="readout mr-1 text-sm">
            <span className="plume-text font-medium">
              {result.co2_emission_tonnes_per_year.toLocaleString()}
            </span>
            <span className="text-xs text-ground-400"> t/yr · {result.confidence}%</span>
          </span>
        )}
        {run.isError && (
          <span className="mr-1 text-xs text-alert">Prediction failed</span>
        )}
        <button
          onClick={() => run.mutate(image.id)}
          disabled={run.isPending}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border border-ground-700 bg-ground-800 px-3 py-1.5 text-xs transition-colors hover:border-ground-400",
            run.isPending && "opacity-60"
          )}
        >
          <Play className="h-3.5 w-3.5" aria-hidden />
          {run.isPending ? "Running…" : result ? "Run again" : "Run prediction"}
        </button>
        {image.url && (
          <a
            href={image.url}
            download={image.filename}
            className="rounded-lg border border-ground-700 bg-ground-800 p-1.5 transition-colors hover:border-ground-400"
            aria-label={`Download ${image.filename}`}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
        {confirming ? (
          <span className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => del.mutate(image.id)}
              disabled={del.isPending}
              className="rounded-lg bg-alert/15 px-2.5 py-1.5 text-alert transition-colors hover:bg-alert/25"
            >
              {del.isPending ? "Deleting…" : "Confirm delete"}
            </button>
            <button onClick={() => setConfirming(false)} className="text-ground-400">
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="rounded-lg border border-ground-700 bg-ground-800 p-1.5 text-ground-400 transition-colors hover:border-alert hover:text-alert"
            aria-label={`Delete ${image.filename}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </div>
      {viewing && thumb && (
        <ImageViewer
          src={thumb}
          title={image.filename}
          subtitle={[
            image.width ? `${image.width}×${image.height}px` : null,
            image.crs,
            image.bounds ? `bounds ${image.bounds.map((b) => b.toFixed(2)).join(", ")}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
          onClose={() => setViewing(false)}
        />
      )}
    </li>
  );
}
