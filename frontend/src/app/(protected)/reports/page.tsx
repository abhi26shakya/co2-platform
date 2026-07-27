"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  useReports,
  useCreateReport,
  useDeleteReport,
} from "@/features/reports/hooks/use-reports";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { FileText, Search, ArrowUpDown, Plus, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ReportOut } from "@/types/report";

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useReports();
  useDashboard();
  const createReport = useCreateReport();
  const deleteReport = useDeleteReport();

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"newest" | "oldest" | "name">("newest");
  const [newFormat, setNewFormat] = useState<"pdf" | "csv">("pdf");

  const filteredReports = reports.filter((r: ReportOut) =>
    r.title.toLowerCase().includes(search.toLowerCase().trim())
  );

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortField === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortField === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in-50">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
            Reports Library
          </h1>
          <p className="mt-1 text-sm text-ground-400">
            Generate and download emission reports compiled from your prediction history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={newFormat}
            onChange={(e) => setNewFormat(e.target.value as "pdf" | "csv")}
            className="bg-ground-950 border border-ground-700/80 text-sm text-ground-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-ground-400 cursor-pointer"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
          <button
            onClick={() => createReport.mutate({ format: newFormat })}
            disabled={createReport.isPending}
            className="flex items-center gap-2 rounded-lg bg-sensor text-ground-950 px-4 py-2.5 text-sm font-medium transition-all hover:bg-sensor/90 cursor-pointer shadow-lg shadow-sensor/5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {createReport.isPending ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {/* Control bar: Search + sort */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-ground-900/20 p-3 rounded-lg border border-ground-700/60">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ground-400" />
          <input
            type="text"
            placeholder="Search by report title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ground-950 border border-ground-700/80 rounded-lg text-sm placeholder-ground-500 focus:outline-none focus:border-ground-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="h-4 w-4 text-ground-400" />
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "newest" | "oldest" | "name")}
            className="bg-ground-950 border border-ground-700/80 text-sm text-ground-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-ground-400 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Alphabetically</option>
          </select>
        </div>
      </div>

      {/* Reports list */}
      {isLoading ? (
        <p className="text-sm text-ground-400 py-12 text-center animate-pulse">Loading reports...</p>
      ) : sortedReports.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-ground-750 rounded-xl space-y-5 bg-ground-900/10">
          <span className="text-5xl block">📄</span>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-instrument">No Reports Yet</h3>
            <p className="text-xs text-ground-400 leading-relaxed">
              Run your first AI prediction, or click &ldquo;Generate Report&rdquo; above to compile
              your current emission analytics into a PDF or CSV.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-block rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer font-semibold shadow-lg shadow-sensor/5"
          >
            Upload Dataset
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedReports.map((r) => {
            const dateStr = new Date(r.created_at).toLocaleString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={r.id}
                className="flex items-center justify-between gap-4 p-4 border border-ground-700/80 hover:border-ground-400/40 transition-colors bg-ground-900/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-sensor shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-instrument truncate">{r.title}</p>
                    <p className="text-[10px] text-ground-500 mt-0.5 flex items-center gap-2">
                      <span className="uppercase font-bold tracking-wider">{r.format}</span>
                      <span>·</span>
                      <span>{dateStr}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {r.url && (
                    <a
                      href={r.url}
                      download
                      className="p-2 rounded text-ground-400 hover:bg-ground-800 hover:text-instrument cursor-pointer"
                      title="Download report"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Delete this report? This cannot be undone.")) {
                        deleteReport.mutate(r.id);
                      }
                    }}
                    className="p-2 rounded text-ground-400 hover:bg-ground-800 hover:text-alert cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
