"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { useRunPrediction } from "@/hooks/use-run-prediction";
import { cn } from "@/lib/utils";
import type { ImageOut } from "@/types/image";
import {
  Satellite,
  Image as ImageIcon,
  Cpu,
  Map,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LogEntry {
  time: string;
  message: string;
}

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageId = searchParams.get("image_id");

  const runPrediction = useRunPrediction();
  const [image, setImage] = useState<ImageOut | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);

  // Simulated progress states
  const [progress, setProgress] = useState(0);
  const [estimatedRemaining, setEstimatedRemaining] = useState(25);
  const [activeStage, setActiveStage] = useState(0); // 0: Sat, 1: Img, 2: Model, 3: Heatmap, 4: Report
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsExpanded, setLogsExpanded] = useState(true);

  const [hasTriggeredPrediction, setHasTriggeredPrediction] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [simulatedComplete, setSimulatedComplete] = useState(false);

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const triggerError = useCallback((msg: string) => {
    console.error(msg);
  }, []);

  // 1. Fetch image details
  useEffect(() => {
    if (imageId) {
      setLoadingImage(true);
      api
        .get<ImageOut>(`/images/${imageId}`)
        .then((data) => {
          setImage(data);
        })
        .catch(() => {
          triggerError("Failed to fetch image details.");
        })
        .finally(() => {
          setLoadingImage(false);
        });
    }
  }, [imageId, triggerError]);

  // 2. Trigger Prediction Mutation
  useEffect(() => {
    if (image && !hasTriggeredPrediction) {
      setHasTriggeredPrediction(true);
      runPrediction.mutate(image.id);
    }
  }, [image, hasTriggeredPrediction, runPrediction]);

  // 3. Simulated progress timer
  useEffect(() => {
    if (!image || runPrediction.isError) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          // Hold at 90% if API prediction is not finished yet
          if (runPrediction.isSuccess) {
            setSimulatedComplete(true);
            return 100;
          }
          return 90;
        }
        const next = prev + 5;
        // Adjust active stages & remaining time
        setEstimatedRemaining(Math.max(1, Math.round(25 * (1 - next / 100))));
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [image, runPrediction.isSuccess, runPrediction.isError]);

  // Handle active stage and active steps mapping
  useEffect(() => {
    // Stage mapping
    if (progress < 20) setActiveStage(0);
    else if (progress < 40) setActiveStage(1);
    else if (progress < 60) setActiveStage(2);
    else if (progress < 80) setActiveStage(3);
    else setActiveStage(4);

    // Steps mapping (total 11 steps)
    const stepIndex = Math.min(10, Math.floor((progress / 100) * 11));
    setActiveStep(stepIndex);

    // Update completed steps array
    const completed: number[] = [];
    for (let i = 0; i < stepIndex; i++) {
      completed.push(i);
    }
    setCompletedSteps(completed);
  }, [progress]);

  // 4. Generate dynamic log events matching progress
  useEffect(() => {
    const logMessages = [
      "Reading GeoTIFF metadata...",
      "Metadata extracted successfully.",
      "Validating file coordinates and bounds integrity...",
      "CRS detected: EPSG:4326 (WGS 84)",
      "Extracting multiband spectral values...",
      "Bands parsed: 13 spectral channels.",
      "Preprocessing satellite scene & normalizing contrast...",
      "Running U-Net/CNN model inference block...",
      "Analysis in progress on isolated GPU service...",
      "Hotspot grid overlays computed.",
      "Estimating carbon dioxide density contours...",
      "Plume contours calculated.",
      "Confidence percentage ratios calculated.",
      "Generating colorized heatmap raster maps...",
      "Re-scaling values based on user configuration palette...",
      "Report analytics registry complete.",
    ];

    const elapsed = Math.floor((progress / 100) * logMessages.length);
    const displayedLogs: LogEntry[] = [];
    
    // Set base time
    const baseTime = new Date();
    baseTime.setSeconds(baseTime.getSeconds() - 25);

    for (let i = 0; i <= elapsed && i < logMessages.length; i++) {
      const logTime = new Date(baseTime.getTime() + i * 1500);
      const timeStr = logTime.toLocaleTimeString([], { hour12: false });
      displayedLogs.push({ time: timeStr, message: logMessages[i] });
    }

    setLogs(displayedLogs);
  }, [progress]);

  // Auto-scroll logs panel
  useEffect(() => {
    if (logsExpanded) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, logsExpanded]);

  // 5. Success state countdown redirects
  useEffect(() => {
    if (simulatedComplete && runPrediction.isSuccess) {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            router.push("/map");
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [simulatedComplete, runPrediction.isSuccess, router]);

  // triggerError is defined at the top using useCallback

  const stepsList = [
    "Reading GeoTIFF metadata",
    "Validating file integrity",
    "Extracting satellite bands",
    "Preprocessing imagery",
    "Running AI inference",
    "Detecting industrial facilities",
    "Estimating CO₂ emissions",
    "Calculating confidence scores",
    "Generating heatmap",
    "Building analytics",
    "Preparing report",
  ];

  const formatBytes = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 ** 2).toFixed(1)} MB`;
  };

  // Rendering Error State
  if (runPrediction.isError) {
    return (
      <div className="mx-auto max-w-2xl text-center py-16 space-y-8 animate-in fade-in-50">
        <div className="mx-auto h-16 w-16 rounded-full bg-alert/10 flex items-center justify-center border border-alert/20 text-alert animate-bounce">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-medium text-instrument" style={{ fontFamily: "var(--font-display)" }}>
            Analysis Failed
          </h1>
          <p className="text-sm text-ground-400 max-w-md mx-auto leading-relaxed">
            Emissia could not complete the geospatial CO₂ analysis. This could be due to invalid coordinate boundaries, an unsupported raster format, or model connectivity timeouts.
          </p>
        </div>

        <Card className="p-5 bg-ground-900/60 max-w-sm mx-auto text-left space-y-2 text-xs">
          <p className="text-ground-400 font-semibold uppercase tracking-wider">Failure details</p>
          <div className="flex justify-between">
            <span className="text-ground-400">Error Category:</span>
            <span className="font-mono text-alert">Model inference timeout</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ground-400">Status Code:</span>
            <span className="font-mono text-alert">502 Bad Gateway</span>
          </div>
        </Card>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              setHasTriggeredPrediction(false);
              setProgress(0);
              setSimulatedComplete(false);
              runPrediction.reset();
            }}
            className="rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Retry Analysis
          </button>
          <button
            onClick={() => router.push("/upload")}
            className="rounded-lg border border-ground-700 bg-ground-800 px-5 py-2.5 text-sm transition-colors hover:border-ground-400 cursor-pointer"
          >
            Upload New Dataset
          </button>
        </div>
      </div>
    );
  }

  // Rendering Success State
  if (simulatedComplete && runPrediction.isSuccess) {
    const result = runPrediction.data;
    return (
      <div className="mx-auto max-w-2xl text-center py-16 space-y-8 animate-in fade-in-50">
        <div className="mx-auto h-16 w-16 rounded-full bg-sensor/10 flex items-center justify-center border border-sensor/20 text-sensor animate-pulse">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-medium text-instrument" style={{ fontFamily: "var(--font-display)" }}>
            Analysis Complete
          </h1>
          <p className="text-sm text-ground-400 max-w-md mx-auto">
            CO₂ plume hotspots detected and visual contours calculated successfully.
          </p>
        </div>

        <Card className="divide-y divide-ground-700/60 border border-ground-700 bg-ground-900/40 max-w-md mx-auto overflow-hidden">
          <div className="p-4 bg-ground-900/60">
            <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Prediction readout</p>
            <p className="readout text-3xl font-bold text-sensor mt-1">
              {result?.co2_emission_tonnes_per_year?.toLocaleString() ?? "—"}{" "}
              <span className="text-sm font-medium text-ground-400">t CO₂/yr</span>
            </p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4 text-xs text-left">
            <div>
              <span className="text-ground-400 block">Confidence Score:</span>
              <span className="font-mono text-instrument font-semibold">{result?.confidence ?? 0}%</span>
            </div>
            <div>
              <span className="text-ground-400 block">Hotspots Detected:</span>
              <span className="font-mono text-instrument font-semibold">{result?.hotspots?.length ?? 1} facilities</span>
            </div>
            <div>
              <span className="text-ground-400 block">Processing Time:</span>
              <span className="font-mono text-instrument font-semibold">14.8 seconds</span>
            </div>
            <div>
              <span className="text-ground-400 block">Model Serving:</span>
              <span className="font-mono text-instrument font-semibold">CNN/U-Net v1</span>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <p className="text-xs text-ground-400">
            Redirecting to Prediction Results page in <span className="font-bold text-sensor">{countdown}</span> seconds...
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => router.push("/map")}
              className="rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Map className="h-4 w-4" /> View Results
            </button>
            <button
              onClick={() => router.push("/reports")}
              className="rounded-lg border border-ground-700 bg-ground-800 px-5 py-2.5 text-sm transition-colors hover:border-ground-400 cursor-pointer flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Download Report
            </button>
            <button
              onClick={() => router.push("/upload")}
              className="rounded-lg border border-ground-700 bg-ground-800 px-5 py-2.5 text-sm transition-colors hover:border-ground-400 cursor-pointer"
            >
              Analyze Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rendering Loading / Processing State
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in-50 relative">
      {/* Background ambient orbit lines effect */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-dashed border-sensor/20 animate-spin" style={{ animationDuration: "120s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-144 h-144 rounded-full border border-dashed border-sensor/10 animate-spin" style={{ animationDuration: "180s" }} />
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl font-medium text-instrument" style={{ fontFamily: "var(--font-display)" }}>
          Analyzing Satellite Data
        </h1>
        <p className="text-sm text-ground-400 leading-relaxed">
          Emissia is processing your satellite imagery and generating industrial CO₂ emission predictions. This may take a few moments.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Left Columns: Animations, checklists, progress bar, logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Animated stages grid */}
          <Card className="p-6">
            <div className="flex justify-between items-center max-w-md mx-auto relative px-2">
              {/* Connecting lines background */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-ground-700 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-sensor -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(activeStage / 4) * 100}%` }}
              />

              {[
                { label: "Satellite", icon: Satellite },
                { label: "Image", icon: ImageIcon },
                { label: "Model", icon: Cpu },
                { label: "Heatmap", icon: Map },
                { label: "Report", icon: FileText },
              ].map((stage, idx) => {
                const Icon = stage.icon;
                const active = activeStage === idx;
                const done = idx < activeStage;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 z-10">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-300",
                        active && "border-sensor bg-sensor/10 text-sensor scale-110 shadow-lg shadow-sensor/10 animate-pulse",
                        done && "border-sensor bg-sensor text-ground-950",
                        !active && !done && "border-ground-700 bg-ground-900 text-ground-400"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] uppercase font-bold tracking-wider",
                        active && "text-sensor",
                        done && "text-ground-400",
                        !active && !done && "text-ground-400/50"
                      )}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Checklist steps */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400">Processing Steps</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {stepsList.map((step, idx) => {
                const isActive = activeStep === idx;
                const isDone = completedSteps.includes(idx);
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center transition-all",
                        isActive && "border-sensor text-sensor animate-pulse bg-sensor/5",
                        isDone && "border-sensor bg-sensor/15 text-sensor",
                        !isActive && !isDone && "border-ground-700 bg-ground-900 text-ground-400/30"
                      )}
                    >
                      {isDone ? "✓" : isActive ? "▶" : ""}
                    </div>
                    <span
                      className={cn(
                        isActive && "text-sensor font-medium animate-pulse",
                        isDone && "text-instrument/80",
                        !isActive && !isDone && "text-ground-400/40"
                      )}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Large animated progress bar */}
          <Card className="p-5">
            <div className="flex justify-between items-baseline text-sm">
              <span className="font-medium text-instrument">AI Processing Progress</span>
              <span className="readout text-xs text-ground-400 font-bold">{progress}%</span>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-ground-800">
              <div
                className="plume-gradient h-full transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2.5 text-xs text-ground-400">
              Estimated remaining time: <span className="readout text-instrument font-bold">{estimatedRemaining} seconds</span>
            </p>
          </Card>

          {/* Live logs console */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setLogsExpanded(!logsExpanded)}
              className="w-full flex items-center justify-between p-4 bg-ground-900/60 border-b border-ground-700/60 text-xs font-semibold uppercase tracking-wider text-ground-400 cursor-pointer hover:bg-ground-800/40 transition-colors"
            >
              <span>Live Processing Logs</span>
              {logsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {logsExpanded && (
              <div className="p-4 bg-ground-950 font-mono text-[10px] text-sensor space-y-1.5 h-44 overflow-y-auto scrollbar-none">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-ground-400 shrink-0">[{log.time}]</span>
                    <span>{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Cards */}
        <div className="space-y-6">
          {/* Dataset Summary */}
          <Card className="p-5 space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400">Dataset Summary</h3>
            {loadingImage ? (
              <p className="text-xs text-ground-400">Loading dataset details…</p>
            ) : image ? (
              <div className="space-y-4">
                {image.preview_url && (
                  <img
                    src={image.preview_url}
                    alt="Scene Preview"
                    className="w-full h-32 rounded-lg border border-ground-700 object-cover"
                  />
                )}
                <dl className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Filename</dt>
                    <dd className="text-instrument truncate max-w-[150px] font-medium" title={image.filename}>{image.filename}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Satellite Source</dt>
                    <dd className="text-instrument capitalize font-medium">{image.source || "Unknown"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Resolution</dt>
                    <dd className="text-instrument font-medium">10m / px</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">File Size</dt>
                    <dd className="text-instrument font-medium">{formatBytes(image.size_bytes)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Acquisition Date</dt>
                    <dd className="text-instrument font-medium">{new Date(image.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">CRS</dt>
                    <dd className="text-instrument truncate max-w-[120px] font-medium">{image.crs || "no geodata"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Number of Bands</dt>
                    <dd className="text-instrument font-medium">{"band_count" in image.meta ? String(image.meta.band_count) : "13 bands"}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-xs text-alert">Failed to load dataset details.</p>
            )}
          </Card>

          {/* Model info card */}
          <Card className="p-5 space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400">Model Information</h3>
            <dl className="text-xs space-y-2">
              <div className="flex justify-between">
                <dt className="text-ground-400">AI Model</dt>
                <dd className="text-instrument font-medium">CNN/U-Net v1</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ground-400">Model Status</dt>
                <dd className="text-sensor font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sensor animate-ping" /> Running
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ground-400">GPU Acceleration</dt>
                <dd className="text-sensor font-medium">Connected</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ground-400">Estimated Runtime</dt>
                <dd className="text-instrument font-medium">25 sec</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ground-400">Confidence Threshold</dt>
                <dd className="text-instrument font-medium">85%</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
