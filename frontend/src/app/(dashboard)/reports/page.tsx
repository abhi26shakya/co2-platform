"use client";

import { Card } from "@/components/ui/card";
import { useCreateReport, useDeleteReport, useReports } from "@/hooks/use-reports";
import { FileSpreadsheet, FileText, Trash2 } from "lucide-react";

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports();
  const create = useCreateReport();
  const del = useDeleteReport();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        Reports
      </h1>
      <p className="mt-1 text-sm text-ground-400">
        Generate shareable snapshots of your predictions — a PDF with charts and
        summary tables, or the raw data as CSV.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => create.mutate("pdf")}
          disabled={create.isPending}
          className="flex items-center gap-2 rounded-lg bg-instrument px-4 py-2.5 text-sm font-medium text-ground-950 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <FileText className="h-4 w-4" aria-hidden />
          {create.isPending && create.variables === "pdf" ? "Generating…" : "Generate PDF report"}
        </button>
        <button
          onClick={() => create.mutate("csv")}
          disabled={create.isPending}
          className="flex items-center gap-2 rounded-lg border border-ground-700 bg-ground-800 px-4 py-2.5 text-sm transition-colors hover:border-ground-400 disabled:opacity-50"
        >
          <FileSpreadsheet className="h-4 w-4" aria-hidden />
          {create.isPending && create.variables === "csv" ? "Generating…" : "Generate CSV export"}
        </button>
      </div>
      {create.isError && (
        <p className="mt-2 text-sm text-alert">Report generation failed. Try again.</p>
      )}

      <Card className="mt-6 px-5">
        {isLoading ? (
          <p className="py-8 text-sm text-ground-400">Loading reports…</p>
        ) : !reports || reports.length === 0 ? (
          <p className="py-8 text-sm text-ground-400">
            No reports yet. Generate one above — it will include your current
            predictions, charts, and summary statistics.
          </p>
        ) : (
          <ul className="divide-y divide-ground-700">
            {reports.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  {r.format === "pdf" ? (
                    <FileText className="h-4 w-4 shrink-0 text-ground-400" aria-hidden />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 shrink-0 text-ground-400" aria-hidden />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm">{r.title}</p>
                    <p className="readout mt-0.5 text-xs uppercase text-ground-400">
                      {r.format} · {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {r.url && (
                    <a
                      href={r.url}
                      download
                      className="rounded-lg border border-ground-700 bg-ground-800 px-3 py-1.5 text-xs transition-colors hover:border-ground-400"
                    >
                      Download
                    </a>
                  )}
                  <button
                    onClick={() => del.mutate(r.id)}
                    disabled={del.isPending}
                    className="rounded-lg border border-ground-700 bg-ground-800 p-1.5 text-ground-400 transition-colors hover:border-alert hover:text-alert"
                    aria-label={`Delete ${r.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
