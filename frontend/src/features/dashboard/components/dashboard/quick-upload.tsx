"use client";

import { Card } from "@/components/ui/card";
import { Dropzone } from "@/features/upload/components/upload/dropzone";
import { useUpload } from "@/features/upload/hooks/use-upload";
import { CheckCircle2, XCircle, Play } from "lucide-react";
import Link from "next/link";

export function QuickUpload() {
  const { state, upload, reset } = useUpload();

  return (
    <Card className="p-5 bg-ground-900/20 border-ground-700/80">
      <h2 className="text-sm font-medium">Quick upload</h2>

      {state.status === "idle" && (
        <div className="mt-4">
          <Dropzone onFile={upload} />
        </div>
      )}

      {state.status === "uploading" && (
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="truncate pr-4 text-instrument">{state.filename}</span>
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
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ground-700 bg-ground-900/60 p-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-sensor" aria-hidden />
            <span className="truncate text-instrument">Uploaded {state.image.filename}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/processing?image_id=${state.image.id}`}
              className="flex items-center gap-1.5 rounded-lg bg-sensor px-3.5 py-1.5 text-xs font-medium text-ground-950 transition-colors hover:bg-sensor/90"
            >
              <Play className="h-3.5 w-3.5" /> Analyze
            </Link>
            <button onClick={reset} className="text-xs text-ground-400 underline">
              Upload another
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
