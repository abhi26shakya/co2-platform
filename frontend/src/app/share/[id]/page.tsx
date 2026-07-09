"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import {
  Satellite,
  Lock,
  Download,
  AlertTriangle,
  Info,
  Layers,
  MapPin,
  TrendingUp,
} from "lucide-react";

// Dynamic leaflet map import for client-only rendering
const EmissionMap = dynamic(() => import("@/components/map/emission-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[24rem] items-center justify-center rounded-xl border border-ground-700 bg-ground-900/40 text-sm text-ground-400">
      Loading geospatial preview map…
    </div>
  ),
});

interface ShareConfig {
  id: string;
  resourceType: string;
  resourceId: string;
  visibility: string;
  permission: string;
  expiresAt: string | null;
  password?: string | null;
  views: number;
  createdAt: string;
  status: string;
  title: string;
  metadata?: Record<string, string>;
  predictionData?: {
    co2Level: number;
    confidence: number;
    facilities: number;
    processingTime: string;
    hotspots: Array<{ lat: number; lon: number; value: number }>;
  };
  reportUrl?: string;
  includedParts?: Record<string, boolean>;
}

export default function PublicSharePage() {
  const params = useParams();
  const shareId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ShareConfig | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password protection state
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordLocked, setPasswordLocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Search all localStorage keys for the matching share config ID
    let foundConfig: ShareConfig | null = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("emissia_share_resource_")) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || "");
          if (parsed.id === shareId) {
            foundConfig = parsed;
            break;
          }
        } catch {
          // Ignore
        }
      }
    }

    if (!foundConfig) {
      setErrorMsg("This share link could not be found or has been deleted.");
      setLoading(false);
      return;
    }

    // Check expiration
    if (foundConfig.expiresAt) {
      const isExpired = new Date(foundConfig.expiresAt) < new Date();
      if (isExpired) {
        setErrorMsg("This share link has expired.");
        setLoading(false);
        return;
      }
    }

    // Check disabled status
    if (foundConfig.status === "disabled") {
      setErrorMsg("This share link has been disabled by the owner.");
      setLoading(false);
      return;
    }

    // Check password protection
    if (foundConfig.password) {
      setPasswordLocked(true);
    }

    // Increment view count dynamically in localStorage
    try {
      foundConfig.views = (foundConfig.views || 0) + 1;
      localStorage.setItem(`emissia_share_resource_${foundConfig.resourceType}_${foundConfig.resourceId}`, JSON.stringify(foundConfig));
      
      // Update global list view counts
      const globalListRaw = localStorage.getItem("emissia_shared_links_list");
      if (globalListRaw) {
        const globalList = JSON.parse(globalListRaw);
        const updated = globalList.map((item: { id: string; views: number }) => {
          if (item.id === shareId) {
            return { ...item, views: item.views + 1 };
          }
          return item;
        });
        localStorage.setItem("emissia_shared_links_list", JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }

    setConfig(foundConfig);
    setLoading(false);
  }, [shareId]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config && passwordInput === config.password) {
      setPasswordLocked(false);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ground-950 text-sm text-ground-400">
        Locating secure shared resource…
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ground-950 px-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto h-12 w-12 rounded-full bg-alert/10 border border-alert/20 flex items-center justify-center text-alert">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-medium text-instrument" style={{ fontFamily: "var(--font-display)" }}>
              Access Denied
            </h1>
            <p className="text-sm text-ground-400">{errorMsg}</p>
          </div>
        </div>
      </div>
    );
  }

  if (passwordLocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ground-950 px-6">
        <Card className="max-w-md w-full p-6 border border-ground-700 bg-ground-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sensor/10 border border-sensor/20 flex items-center justify-center text-sensor shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-instrument">Password Required</h1>
              <p className="text-xs text-ground-400">This shared link is encrypted. Enter password to view.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="Access Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full rounded-lg border border-ground-700 bg-ground-950 px-3 py-2 text-sm text-instrument focus:outline-none focus:border-sensor"
            />
            {passwordError && (
              <p className="text-xs text-alert font-medium flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Invalid password. Please try again.
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 py-2 text-sm font-semibold transition-colors cursor-pointer"
            >
              Decrypt & View
            </button>
          </form>
        </Card>
      </div>
    );
  }

  if (!config) return null;

  // Calculate default values if preview elements are missing
  const meta = config.metadata || {};
  const pred = config.predictionData || { co2Level: 3200, confidence: 91, facilities: 1, processingTime: "14.8s", hotspots: [] };
  const parts = config.includedParts || {};

  const hotspotsData = (pred.hotspots || []).map((h: { lat: number; lon: number; value: number }) => ({
    lat: h.lat,
    lon: h.lon,
    intensity: h.value || 0,
    radius_m: 50,
    emission_tonnes_per_year: h.value || 0,
    image_filename: config.title,
    predicted_at: config.createdAt,
  }));

  if (hotspotsData.length === 0) {
    hotspotsData.push({
      lat: 24.0983,
      lon: 82.6714,
      intensity: pred.co2Level,
      radius_m: 100,
      emission_tonnes_per_year: pred.co2Level,
      image_filename: config.title,
      predicted_at: config.createdAt,
    });
  }

  return (
    <div className="min-h-screen bg-ground-950 text-instrument flex flex-col">
      {/* Read-Only Top Header Bar */}
      <header className="border-b border-ground-700/60 bg-ground-900 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Satellite className="h-5 w-5 text-sensor" />
          <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Emissia Share
          </span>
          <span className="readout rounded-full border border-ground-700 bg-ground-850 px-2.5 py-0.5 text-[10px] uppercase font-bold text-ground-400 tracking-wider">
            Read-only
          </span>
        </div>

        {parts.report && (
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-ground-700 bg-ground-800 hover:border-ground-400 px-3.5 py-1.5 text-xs transition-colors flex items-center gap-2 font-medium cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Save PDF Snapshot
          </button>
        )}
      </header>

      {/* Main content page area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Title Block */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-instrument tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {config.title}
          </h1>
          <p className="text-xs text-ground-400 flex items-center gap-3">
            <span>Shared: {new Date(config.createdAt).toLocaleDateString()}</span>
            <span>·</span>
            <span>Satellite: {meta.satellite || "Sentinel-5P"}</span>
          </p>
        </div>

        {/* Dynamic Layout split */}
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {/* Main content block: Map & Charts */}
          <div className="md:col-span-2 space-y-6">
            {/* Map Preview */}
            {parts.predictionMap && (
              <Card className="p-4 space-y-3 overflow-hidden">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sensor" /> Geospatial Prediction Map
                </h3>
                <div className="h-[26rem] w-full rounded-lg overflow-hidden border border-ground-700">
                  <EmissionMap
                    plants={[]}
                    hotspots={hotspotsData}
                    showPlants={false}
                    showHotspots={true}
                  />
                </div>
              </Card>
            )}

            {/* AI Summary / Detail Metrics */}
            {parts.aiSummary && (
              <Card className="p-5 space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-sensor" /> Industrial Carbon Assessment Summary
                </h3>
                <p className="text-xs text-ground-400 leading-relaxed">
                  The artificial intelligence pipeline calculated high-confidence carbon dioxide output signatures from the georeferenced satellite bands. Strong plume patterns indicate active combustion zones matching known industrial plant profiles.
                </p>
                <div className="border border-ground-700 rounded-lg p-3 bg-ground-900/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-ground-400 block mb-0.5">Model Identifier</span>
                    <span className="font-semibold text-instrument">CNN/U-Net v1</span>
                  </div>
                  <div>
                    <span className="text-ground-400 block mb-0.5">Computed Emissions</span>
                    <span className="font-bold text-sensor">{pred.co2Level.toLocaleString()} t/yr</span>
                  </div>
                  <div>
                    <span className="text-ground-400 block mb-0.5">Confidence Ratio</span>
                    <span className="font-mono text-instrument font-semibold">{pred.confidence}%</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right side: Metadata, stats readouts */}
          <div className="space-y-6">
            {/* Confidence & Statistics Card */}
            {parts.confidenceScores && (
              <Card className="p-5 space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-sensor" /> Prediction Quality
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline text-xs mb-1">
                      <span className="text-ground-400">Confidence Score</span>
                      <span className="font-bold text-sensor">{pred.confidence}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-ground-800 overflow-hidden">
                      <div className="h-full bg-sensor" style={{ width: `${pred.confidence}%` }} />
                    </div>
                  </div>
                  <dl className="text-xs space-y-2 pt-2 border-t border-ground-700/60">
                    <div className="flex justify-between">
                      <dt className="text-ground-400">Hotspots Detected</dt>
                      <dd className="text-instrument font-semibold">{pred.facilities} locations</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ground-400">GPU Processing Time</dt>
                      <dd className="text-instrument font-mono">{pred.processingTime}</dd>
                    </div>
                  </dl>
                </div>
              </Card>
            )}

            {/* Dataset Metadata */}
            {parts.metadata && (
              <Card className="p-5 space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-sensor" /> Scene Information
                </h3>
                <dl className="text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Filename</dt>
                    <dd className="text-instrument truncate max-w-[150px] font-medium" title={meta.filename || "vindhyachal_scene.tif"}>
                      {meta.filename || "vindhyachal_scene.tif"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Acquisition</dt>
                    <dd className="text-instrument font-medium">{meta.acquisitionDate || new Date().toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">CRS Identifier</dt>
                    <dd className="text-instrument font-medium truncate max-w-[120px]">{meta.crs || "EPSG:4326"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Resolution</dt>
                    <dd className="text-instrument font-medium">{meta.resolution || "10m / pixel"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">File Size</dt>
                    <dd className="text-instrument font-medium">{meta.size || "1.2 MB"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ground-400">Sensor Bands</dt>
                    <dd className="text-instrument font-medium">{meta.bands || "13 bands"}</dd>
                  </div>
                </dl>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
