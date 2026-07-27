"use client";

import { useSystemStatus } from "@/features/settings/hooks/use-data-export";
import { BookOpen, ChevronRight, Code, ExternalLink, FileText, HelpCircle, Shield } from "lucide-react";

export function AboutTab() {
  const { data: status } = useSystemStatus();

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h2 className="text-lg font-medium text-instrument">About Emissia</h2>
        <p className="text-sm text-ground-400">
          Core platform details, documentation channels, and developer source repositories.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40">
          <p className="text-xs text-ground-400">Platform Version</p>
          <p className="readout mt-1 text-lg font-semibold text-sensor">
            v{status?.platform_version ?? "…"}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40">
          <p className="text-xs text-ground-400">Inference Backend</p>
          <p className="readout mt-1 text-lg font-semibold text-sensor">
            {status?.inference_backend ?? "…"} ({status?.ml_service ?? "unknown"})
          </p>
        </div>
        <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40">
          <p className="text-xs text-ground-400">API Version</p>
          <p className="readout mt-1 text-lg font-semibold text-sensor">
            v{status?.api_version ?? "…"}
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Resources</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="/docs"
            className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 hover:border-ground-400 hover:bg-ground-800/20 transition-all text-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-sensor" /> Documentation
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-ground-400" />
          </a>

          <a
            href="https://github.com/abhi26shakya"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 hover:border-ground-400 hover:bg-ground-800/20 transition-all text-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Code className="h-4 w-4 text-sensor" /> GitHub Repository
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-ground-400" />
          </a>

          <a
            href="/privacy"
            className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 hover:border-ground-400 hover:bg-ground-800/20 transition-all text-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-sensor" /> Privacy Policy
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-ground-400" />
          </a>

          <a
            href="/terms"
            className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 hover:border-ground-400 hover:bg-ground-800/20 transition-all text-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-sensor" /> Terms of Service
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-ground-400" />
          </a>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/30 flex items-center justify-between">
        <div className="text-sm">
          <p className="font-medium text-instrument flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-sensor" /> Need Support?
          </p>
          <p className="mt-1 text-xs text-ground-400">Get in touch if you have queries or need assistance.</p>
        </div>
        <a
          href="mailto:abhishekshakya80093@gmail.com"
          className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-xs font-semibold hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer"
        >
          Email Support
        </a>
      </div>
    </div>
  );
}
