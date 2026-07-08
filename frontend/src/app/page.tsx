import { OrbitField } from "@/components/marketing/orbit-field";
import { Reveal } from "@/components/marketing/reveal";
import { StatusPill } from "@/components/layout/status-pill";
import {
  BarChart3,
  Cpu,
  FileText,
  Map,
  Satellite,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";

const display = { fontFamily: "var(--font-display)" };

const STEPS = [
  {
    n: "01",
    title: "Upload a scene",
    body: "Drop in GeoTIFF, TIFF, PNG, or JPG imagery of an industrial region. Georeferencing, CRS, and band structure are extracted automatically.",
  },
  {
    n: "02",
    title: "Run the model",
    body: "The inference service estimates annual CO₂ output with a confidence score and localizes emission hotspots inside the scene bounds.",
  },
  {
    n: "03",
    title: "Analyze over time",
    body: "Trends, distributions, and an interactive hotspot map accumulate across every prediction — exportable as PDF reports or raw CSV.",
  },
];

const FEATURES = [
  {
    icon: UploadCloud,
    title: "GeoTIFF-native ingestion",
    body: "Magic-byte validation, WGS84 bounds extraction, and browser-renderable previews generated on upload.",
  },
  {
    icon: Cpu,
    title: "Swappable inference",
    body: "An isolated ML service behind a versioned contract — the placeholder swaps for a trained CNN/U-Net without touching the platform.",
  },
  {
    icon: Map,
    title: "Hotspot mapping",
    body: "Emission hotspots and known plants on an interactive dark basemap, colored by predicted intensity.",
  },
  {
    icon: BarChart3,
    title: "Research analytics",
    body: "Monthly time-series, prediction distributions, and source statistics — aggregated in SQL, rendered live.",
  },
  {
    icon: FileText,
    title: "One-click reports",
    body: "PDF snapshots with embedded charts and summary tables, or the full prediction dataset as CSV.",
  },
  {
    icon: Satellite,
    title: "Model registry",
    body: "Versioned models with accuracy, precision, recall, and F1 — inference history logged on every request.",
  },
];

export default function Home() {
  return (
    <main>
      {/* ---- Hero ---- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <OrbitField />
        <div className="relative z-10 flex flex-col items-center text-center">
          <StatusPill />
          <h1
            className="mt-8 max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl"
            style={display}
          >
            See industrial CO₂
            <br />
            <span className="plume-text">from orbit</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ground-400">
            Emissia predicts CO₂ emissions from satellite imagery of industrial
            plants using machine learning — and turns every prediction into
            maps, trends, and shareable research reports.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-instrument px-6 py-3 text-sm font-medium text-ground-950 transition-opacity hover:opacity-90"
            >
              Start analyzing
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-ground-700 bg-ground-900/60 px-6 py-3 text-sm backdrop-blur transition-colors hover:border-ground-400"
            >
              Sign in
            </Link>
          </div>
          <p className="readout mt-14 text-xs uppercase tracking-[0.3em] text-ground-400">
            Sentinel-5P · OCO-2/3 · CNN/U-Net
          </p>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight" style={display}>
            From pixels to policy-grade numbers
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <p className="readout plume-text text-sm">{s.n}</p>
              <h3 className="mt-3 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ground-400">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="border-y border-ground-700 bg-ground-900/40">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-tight" style={display}>
              Built like a research instrument
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ground-400">
              Every layer — ingestion, inference, analytics — is modular, tested,
              and ready for the real model.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.1}>
                <div className="h-full rounded-xl border border-ground-700 bg-ground-800/60 p-5">
                  <f.icon className="h-5 w-5 text-ground-400" aria-hidden />
                  <h3 className="mt-4 text-sm font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ground-400">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Research motivation ---- */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight" style={display}>
            Why measure from space?
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-ground-400">
            <p>
              Self-reported emission inventories are slow, coarse, and unevenly
              audited. Satellites see every plant on Earth on a repeating
              schedule — Sentinel-5P&apos;s TROPOMI instrument maps NO₂ plumes
              daily, while OCO-2 and OCO-3 measure column CO₂ directly along
              their tracks.
            </p>
            <p>
              Machine learning closes the gap between what satellites observe
              and what regulators need: per-facility, per-year emission
              estimates with quantified confidence. Emissia is the platform
              layer of that research — the pipeline that turns a trained model
              into an instrument researchers can actually use.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---- CTA ---- */}
      <section className="border-t border-ground-700">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-tight" style={display}>
              Put your scenes to work
            </h2>
            <p className="mt-3 text-sm text-ground-400">
              Create an account, upload a GeoTIFF, and get your first prediction
              in under a minute.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-lg bg-instrument px-6 py-3 text-sm font-medium text-ground-950 transition-opacity hover:opacity-90"
            >
              Create a free account
            </Link>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-ground-700 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="readout text-xs text-ground-400">
            Emissia — satellite CO₂ emission intelligence
          </p>
          <p className="text-xs text-ground-400">
            A research platform · built for ML model integration
          </p>
        </div>
      </footer>
    </main>
  );
}
