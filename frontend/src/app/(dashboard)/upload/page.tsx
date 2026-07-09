"use client";

/* eslint-disable @next/next/no-img-element -- previews are dynamic API files */
import { Dropzone } from "@/components/upload/dropzone";
import { Card } from "@/components/ui/card";
import { useUpload } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Play } from "lucide-react";
import Link from "next/link";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className="shrink-0 text-ground-400">{label}</dt>
      <dd className="readout truncate text-right">{value}</dd>
    </div>
  );
}

export default function UploadPage() {
  const { state, upload, reset } = useUpload();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        Upload
      </h1>
      <p className="mt-1 text-sm text-ground-400">
        Add a satellite scene. GeoTIFF geodata (bounds, CRS) is extracted automatically
        and used to place predictions on the map.
      </p>

      <div className="mt-8">
        {state.status !== "done" && <Dropzone onFile={upload} />}

        {state.status === "uploading" && (
          <div className="mt-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="truncate pr-4">{state.filename}</span>
              <span className="readout text-xs text-ground-400">{state.progress}%</span>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-ground-800"
              role="progressbar"
              aria-valuenow={state.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="plume-gradient h-full transition-[width] duration-200"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          </div>
        )}

        {state.status === "error" && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-ground-700 bg-ground-900/60 p-4 text-sm">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-alert" aria-hidden />
            <div>
              <p>{state.message}</p>
              <button onClick={reset} className="mt-1 text-ground-400 underline">
                Try another file
              </button>
            </div>
          </div>
        )}

        {state.status === "done" && (
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-sensor" aria-hidden />
              <span>Uploaded {state.image.filename}</span>
            </div>

            <div
              className={cn(
                "mt-4 grid gap-6",
                (state.image.preview_url ?? state.image.url) && "sm:grid-cols-2"
              )}
            >
              {(state.image.preview_url ?? state.image.url) && (
                <img
                  src={state.image.preview_url ?? state.image.url ?? ""}
                  alt={`Preview of ${state.image.filename}`}
                  className="w-full rounded-lg border border-ground-700 object-cover"
                />
              )}
              <dl className="text-sm">
                <Meta label="Size" value={formatBytes(state.image.size_bytes)} />
                <Meta label="Type" value={state.image.content_type} />
                <Meta
                  label="Dimensions"
                  value={
                    state.image.width
                      ? `${state.image.width} × ${state.image.height} px`
                      : "—"
                  }
                />
                <Meta label="CRS" value={state.image.crs ?? "—"} />
                <Meta
                  label="Bounds"
                  value={
                    state.image.bounds
                      ? state.image.bounds.map((b) => b.toFixed(3)).join(", ")
                      : "no geodata"
                  }
                />
                {"band_count" in state.image.meta && (
                  <Meta label="Bands" value={String(state.image.meta.band_count)} />
                )}
              </dl>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/processing?image_id=${state.image.id}`}
                className="rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Play className="h-4 w-4" /> Start AI Analysis
              </Link>
              <button
                onClick={reset}
                className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-sm transition-colors hover:border-ground-400 cursor-pointer"
              >
                Upload another
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
