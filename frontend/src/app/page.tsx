import { Navbar } from "@/components/layout/navbar";
import { ContactForm } from "@/components/layout/contact-form";
import { OrbitField } from "@/components/marketing/orbit-field";
import { Reveal } from "@/components/marketing/reveal";
import {
  BarChart3,
  Cpu,
  FileText,
  Map,
  Satellite,
  UploadCloud,
  Mail,
  Linkedin,
  Github,
  Microscope,
  Landmark,
  Factory,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import { ScrollIndicator } from "@/components/marketing/scroll-indicator";

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

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "abhishekshakya80093@gmail.com",
    href: "mailto:abhishekshakya80093@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/abhi26shakya",
    href: "https://github.com/abhi26shakya",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/abhishek-shakya-42bab8212/",
    href: "https://www.linkedin.com/in/abhishek-shakya-42bab8212/",
  },
];

export default function Home() {
  return (
    <main>
      <Navbar />
      {/* ---- Hero ---- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <OrbitField />
        <div className="relative z-10 flex flex-col items-center text-center -translate-y-8 sm:-translate-y-12">
          <h1
            className="mt-8 max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl"
            style={display}
          >
            See industrial CO₂
            <br />
            <span className="plume-text">from orbit</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ground-400">
            Transform satellite imagery into industrial carbon intelligence with AI-powered emission estimation, hotspot detection, and research-ready analytics.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-instrument px-6 py-3 text-sm font-medium text-ground-950 transition-opacity hover:opacity-90"
            >
              Start Free
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-ground-700 bg-ground-900/60 px-6 py-3 text-sm backdrop-blur transition-colors hover:border-ground-400"
            >
              Watch Demo
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </section>

      {/* ---- Who It's Built For ---- */}
      <section className="mx-auto max-w-5xl px-6 py-24 border-t border-ground-700/60">
        <Reveal>
          <div className="text-center">
            <p className="readout text-xs uppercase tracking-[0.3em] text-sensor">
              USE CASES
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl" style={display}>
              Built for the people shaping a sustainable future
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-ground-400">
              From academic research to enterprise sustainability, Emissia transforms satellite imagery into actionable carbon intelligence.
            </p>
          </div>
        </Reveal>

        {/* 2x2 Grid of cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="group h-full rounded-xl border border-ground-700 bg-ground-800/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sensor/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-ground-700 bg-ground-900/60 text-sensor transition-all duration-300 group-hover:scale-110 group-hover:border-sensor/30">
                <Microscope className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-instrument">Researchers</h3>
              <p className="mt-2 text-sm leading-relaxed text-ground-400">
                Develop, validate, and benchmark machine learning models using satellite imagery, emission datasets, and research-ready exports.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="group h-full rounded-xl border border-ground-700 bg-ground-800/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sensor/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-ground-700 bg-ground-900/60 text-sensor transition-all duration-300 group-hover:scale-110 group-hover:border-sensor/30">
                <Landmark className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-instrument">Government & Regulators</h3>
              <p className="mt-2 text-sm leading-relaxed text-ground-400">
                Monitor industrial emissions, identify hotspots, and support environmental compliance with data-driven insights.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="group h-full rounded-xl border border-ground-700 bg-ground-800/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sensor/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-ground-700 bg-ground-900/60 text-sensor transition-all duration-300 group-hover:scale-110 group-hover:border-sensor/30">
                <Factory className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-instrument">Industrial Enterprises</h3>
              <p className="mt-2 text-sm leading-relaxed text-ground-400">
                Track facility-level emissions, evaluate sustainability initiatives, and generate reports for ESG and regulatory compliance.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="group h-full rounded-xl border border-ground-700 bg-ground-800/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sensor/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-ground-700 bg-ground-900/60 text-sensor transition-all duration-300 group-hover:scale-110 group-hover:border-sensor/30">
                <Leaf className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-instrument">Climate & Environmental Organizations</h3>
              <p className="mt-2 text-sm leading-relaxed text-ground-400">
                Visualize regional emission trends, prioritize mitigation strategies, and support climate action with transparent analytics.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Center Callout Box */}
        <Reveal delay={0.5}>
          <div className="mt-16 rounded-2xl border border-ground-700 bg-ground-900/40 p-8 md:p-10 text-center relative overflow-hidden">
            {/* Subtle glow effect behind */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-sensor/5 blur-[120px] pointer-events-none" />
            <h3 className="text-xl font-medium text-instrument" style={display}>One Platform. Multiple Applications.</h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ground-400">
              Whether you&apos;re conducting research, monitoring industrial facilities, or supporting climate policy, Emissia provides AI-powered insights from satellite imagery to help understand and reduce industrial carbon emissions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-ground-950 transition-all duration-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.35)] active:scale-[0.98] neon-btn-animate"
              >
                Start Analyzing
              </Link>
              <Link
                href="http://localhost:8000/docs"
                className="rounded-full border border-ground-700 bg-ground-900/60 px-6 py-3 text-sm font-medium text-ground-400 backdrop-blur transition-all duration-300 hover:border-ground-400 hover:text-instrument active:scale-[0.98]"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- How it works ---- */}
      <section id="platform" className="mx-auto max-w-5xl px-6 py-24">
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
      <section id="research" className="mx-auto max-w-3xl px-6 py-24">
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
              Start Free
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Contact Section ---- */}
      <section id="contact" className="border-t border-ground-700 bg-ground-900/20">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <Reveal>
            <div className="text-center">
              <p className="readout text-xs uppercase tracking-[0.3em] text-ground-400">
                Let&apos;s Talk
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl" style={display}>
                Get in Touch
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-12 md:grid-cols-12 items-start">
            {/* Left: Branding & Info */}
            <div className="md:col-span-5 flex flex-col text-left">
              <Reveal delay={0.1}>
                <h3 className="text-xl font-medium text-instrument">
                  Emissia Communications
                </h3>
                <p className="mt-2 text-xs uppercase tracking-widest text-ground-400">
                  Global Satellite Intelligence
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ground-400">
                  Have questions about Emissia, interested in research collaborations, enterprise deployment, or technical support? We&apos;d love to hear from you.
                </p>

                <div className="mt-8 flex flex-col gap-4">
                  {CONTACT_INFO.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-xl border border-ground-700 bg-ground-800/40 p-4 transition-all duration-300 hover:border-ground-400 hover:bg-ground-800/80"
                    >
                      <div className="rounded-lg bg-ground-900 p-2.5 border border-ground-700 transition-colors group-hover:border-ground-400 group-hover:bg-ground-800">
                        <item.icon className="h-5 w-5 text-ground-400 group-hover:text-instrument transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="readout text-[10px] uppercase tracking-wider text-ground-400">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-instrument truncate">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: Contact Form */}
            <div className="md:col-span-7 w-full">
              <Reveal delay={0.2}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-ground-700 bg-ground-950 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
            {/* Brand column */}
            <div className="md:col-span-2 flex flex-col items-start gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="rounded-lg p-1 bg-ground-900 border border-ground-700 group-hover:border-ground-500 transition-colors">
                  <Satellite className="h-5 w-5 text-sensor" />
                </div>
                <span className="font-display font-medium text-lg tracking-tight text-instrument group-hover:text-white transition-colors">
                  Emissia
                </span>
              </Link>
              <p className="text-xs leading-relaxed text-ground-400 max-w-xs">
                Predicting industrial CO₂ emissions from satellite imagery using machine learning.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-3">
              <span className="readout text-[10px] uppercase tracking-wider text-ground-400">
                Quick Links
              </span>
              <ul className="flex flex-col gap-2 text-xs text-ground-400">
                <li><Link href="/" className="hover:text-instrument transition-colors">Home</Link></li>
                <li><Link href="#platform" className="hover:text-instrument transition-colors">Platform</Link></li>
                <li><Link href="#research" className="hover:text-instrument transition-colors">Research</Link></li>
                <li><Link href="#contact" className="hover:text-instrument transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-3">
              <span className="readout text-[10px] uppercase tracking-wider text-ground-400">
                Resources
              </span>
              <ul className="flex flex-col gap-2 text-xs text-ground-400">
                <li><Link href="/docs" className="hover:text-instrument transition-colors">Documentation</Link></li>
                <li><Link href="/docs#api-reference" className="hover:text-instrument transition-colors">API References</Link></li>
                <li><a href="https://github.com/abhi26shakya" target="_blank" rel="noopener noreferrer" className="hover:text-instrument transition-colors">GitHub</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3">
              <span className="readout text-[10px] uppercase tracking-wider text-ground-400">
                Legal
              </span>
              <ul className="flex flex-col gap-2 text-xs text-ground-400">
                <li><Link href="/privacy" className="hover:text-instrument transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-instrument transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-16 border-t border-ground-700/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="readout text-xs text-ground-400">
              &copy; 2026 Emissia. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-ground-400">
              <a href="https://github.com/abhi26shakya" target="_blank" rel="noopener noreferrer" className="hover:text-instrument transition-colors">GitHub</a>
              <span>&middot;</span>
              <a href="https://www.linkedin.com/in/abhishek-shakya-42bab8212/" target="_blank" rel="noopener noreferrer" className="hover:text-instrument transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
