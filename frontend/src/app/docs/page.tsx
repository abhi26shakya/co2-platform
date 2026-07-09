"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { 
  BookOpen, 
  Cpu, 
  Layers, 
  Terminal, 
  Code,
  Shield
} from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  const sections = [
    { id: "intro", title: "Introduction", icon: BookOpen },
    { id: "quickstart", title: "Quick Start", icon: Terminal },
    { id: "architecture", title: "Architecture", icon: Layers },
    { id: "ml-integration", title: "ML Integration", icon: Cpu },
    { id: "api-reference", title: "API Reference", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-ground-950 text-instrument">
      <Navbar />
      
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-28 lg:h-[fit-content]">
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 border-b border-ground-700/50 lg:border-0 scrollbar-none">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 whitespace-nowrap ${
                      activeSection === section.id
                        ? "bg-ground-800 text-sensor shadow-inner border border-ground-700"
                        : "text-ground-400 hover:bg-ground-900/60 hover:text-instrument"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <article className="flex-1 max-w-3xl space-y-20 pb-24">
            
            {/* Introduction */}
            <section id="intro" className="scroll-mt-28 space-y-6">
              <div className="space-y-3">
                <span className="readout text-xs uppercase tracking-widest text-sensor">Overview</span>
                <h1 className="text-4xl font-medium tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Introduction to Emissia
                </h1>
              </div>
              <p className="text-base leading-relaxed text-ground-400">
                Emissia is a cutting-edge Satellite CO₂ Emission Intelligence Platform. By analyzing high-resolution satellite imagery using artificial intelligence and machine learning, it estimates local and global industrial greenhouse gas outputs, identifies hotspots, and generates comprehensive compliance reports.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2 mt-8">
                <div className="rounded-xl border border-ground-700 bg-ground-900/30 p-5">
                  <h3 className="text-sm font-medium text-instrument flex items-center gap-2">
                    <Shield className="h-4 w-4 text-sensor" /> Auditability
                  </h3>
                  <p className="mt-2 text-xs text-ground-400 leading-relaxed">
                    Compare self-reported carbon logs against transparent, objective satellite-derived estimations to ensure compliance.
                  </p>
                </div>
                <div className="rounded-xl border border-ground-700 bg-ground-900/30 p-5">
                  <h3 className="text-sm font-medium text-instrument flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-sensor" /> Advanced AI
                  </h3>
                  <p className="mt-2 text-xs text-ground-400 leading-relaxed">
                    Estimations are processed using specialized CNN and U-Net architectures optimized for multispectral raster analysis.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quickstart" className="scroll-mt-28 space-y-6">
              <div className="space-y-3">
                <span className="readout text-xs uppercase tracking-widest text-sensor">Deployment</span>
                <h2 className="text-3xl font-medium tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Quick Start Guide
                </h2>
              </div>
              <p className="text-sm text-ground-400 leading-relaxed">
                Run the complete Emissia development stack locally. Ensure you have Docker, Node.js 20+, and Python 3.12+ installed.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-ground-400 tracking-wider">1. Start Infrastructure & ML Mock</h4>
                  <pre className="readout p-4 rounded-xl border border-ground-700 bg-ground-900 text-xs text-sensor overflow-x-auto">
                    docker compose up -d postgres redis ml-service
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-ground-400 tracking-wider">2. Initialize & Run FastAPI Backend</h4>
                  <pre className="readout p-4 rounded-xl border border-ground-700 bg-ground-900 text-xs text-sensor overflow-x-auto font-mono">
                    {`cd backend\npython -m venv .venv && source .venv/bin/activate\npip install -r requirements-dev.txt\ncp .env.example .env\nalembic upgrade head          # Create database tables\npython -m scripts.seed        # Seed demo user & power plants\nuvicorn app.main:app --reload --port 8000`}
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-ground-400 tracking-wider">3. Launch Next.js Frontend</h4>
                  <pre className="readout p-4 rounded-xl border border-ground-700 bg-ground-900 text-xs text-sensor overflow-x-auto">
                    {`cd frontend\nnpm install\ncp .env.example .env.local\nnpm run dev`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="scroll-mt-28 space-y-6">
              <div className="space-y-3">
                <span className="readout text-xs uppercase tracking-widest text-sensor">Design</span>
                <h2 className="text-3xl font-medium tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Platform Architecture
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-ground-400">
                Emissia is architected using modular, loosely coupled components to isolate AI/ML workload pipelines from frontend UI presentation layers.
              </p>
              
              <div className="p-5 rounded-xl border border-ground-700 bg-ground-900/30 font-mono text-xs leading-relaxed text-sensor overflow-x-auto">
                {`  Next.js Frontend ──> FastAPI Backend ──> ML Service (Isolated)\n                            │\n                  PostgreSQL · Redis · Local Storage`}
              </div>

              <div className="space-y-4 text-sm text-ground-400">
                <div className="flex gap-4">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-ground-800 border border-ground-700 flex items-center justify-center text-xs text-sensor font-mono">1</div>
                  <div>
                    <h4 className="font-medium text-instrument">Next.js Frontend Client</h4>
                    <p className="mt-1 text-xs">Built with Next.js 15, React 19, and Tailwind CSS. React Query is used to manage server state. Maps are powered by Leaflet.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-ground-800 border border-ground-700 flex items-center justify-center text-xs text-sensor font-mono">2</div>
                  <div>
                    <h4 className="font-medium text-instrument">FastAPI Backend Gateway</h4>
                    <p className="mt-1 text-xs">Handles authentication (Argon2id + JWT token rotation), GeoTIFF processing (rasterio), job dispatching, and analytics storage.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-ground-800 border border-ground-700 flex items-center justify-center text-xs text-sensor font-mono">3</div>
                  <div>
                    <h4 className="font-medium text-instrument">ML Inference Engine</h4>
                    <p className="mt-1 text-xs">Isolated service listening on port 8001 that receives preprocessed image layers and outputs predictions according to the v1 schema.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ML Model Integration */}
            <section id="ml-integration" className="scroll-mt-28 space-y-6">
              <div className="space-y-3">
                <span className="readout text-xs uppercase tracking-widest text-sensor">AI Integration</span>
                <h2 className="text-3xl font-medium tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Integrating the Real ML Model
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-ground-400">
                The ML service uses a Mock Predictor by default. When your trained neural network models (CNN or U-Net) are ready, follow these integration steps:
              </p>
              
              <ol className="list-decimal pl-5 space-y-3 text-sm text-ground-400 font-sans">
                <li>
                  <strong className="text-instrument">Implement the Predictor Protocol:</strong> In <code className="text-sensor font-mono">ml-service/app/inference/model.py</code>, implement the predict function matching the <code className="text-sensor font-mono">PredictionResultV1</code> schema.
                </li>
                <li>
                  <strong className="text-instrument">Register active model:</strong> Update <code className="text-sensor font-mono">ml-service/app/main.py</code> to initialize your custom predictor class: <code className="text-sensor font-mono">PREDICTOR = UNetPredictor()</code>.
                </li>
                <li>
                  <strong className="text-instrument">Update packages:</strong> Add PyTorch or your specific inference library requirements to <code className="text-sensor font-mono">ml-service/requirements-model.txt</code>.
                </li>
              </ol>
            </section>

            {/* API Reference */}
            <section id="api-reference" className="scroll-mt-28 space-y-6">
              <div className="space-y-3">
                <span className="readout text-xs uppercase tracking-widest text-sensor">Endpoints</span>
                <h2 className="text-3xl font-medium tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  API Contract Reference
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-ground-400">
                The backend service exposes REST API endpoints guarded by JWT credentials. Complete API documentation is accessible locally at <code className="text-sensor font-mono">http://localhost:8000/docs</code>.
              </p>
              
              <div className="space-y-4">
                <div className="rounded-xl border border-ground-700 bg-ground-900/30 p-5">
                  <div className="flex items-center gap-3">
                    <span className="readout rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 font-bold font-mono">POST</span>
                    <span className="font-mono text-xs text-instrument">/api/v1/auth/login</span>
                  </div>
                  <p className="mt-2 text-xs text-ground-400">
                    Authenticates user credentials and returns access and refresh tokens.
                  </p>
                </div>

                <div className="rounded-xl border border-ground-700 bg-ground-900/30 p-5">
                  <div className="flex items-center gap-3">
                    <span className="readout rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 font-bold font-mono">POST</span>
                    <span className="font-mono text-xs text-instrument">/api/v1/uploads</span>
                  </div>
                  <p className="mt-2 text-xs text-ground-400">
                    Ingests a GeoTIFF or image file. Sneaks magic bytes to prevent extension spoofing.
                  </p>
                </div>

                <div className="rounded-xl border border-ground-700 bg-ground-900/30 p-5">
                  <div className="flex items-center gap-3">
                    <span className="readout rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 font-bold font-mono">POST</span>
                    <span className="font-mono text-xs text-instrument">/api/v1/predictions</span>
                  </div>
                  <p className="mt-2 text-xs text-ground-400">
                    Triggers isolated ML pipeline predictions for the specified uploaded image.
                  </p>
                </div>

                <div className="rounded-xl border border-ground-700 bg-ground-900/30 p-5">
                  <div className="flex items-center gap-3">
                    <span className="readout rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 font-bold font-mono">GET</span>
                    <span className="font-mono text-xs text-instrument">/api/v1/analytics</span>
                  </div>
                  <p className="mt-2 text-xs text-ground-400">
                    Returns aggregated statistics including monthly trends and emission histograms.
                  </p>
                </div>
              </div>
            </section>

          </article>
        </div>
      </div>
    </div>
  );
}
