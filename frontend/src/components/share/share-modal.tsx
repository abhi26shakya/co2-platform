"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Share2,
  X,
  Copy,
  ExternalLink,
  QrCode,
  Lock,
  Check,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: "dataset" | "prediction" | "report" | "analytics" | "map";
  resourceId: string;
  title: string;
  metadata?: {
    filename?: string;
    satellite?: string;
    resolution?: string;
    size?: string;
    acquisitionDate?: string;
    crs?: string;
    bands?: string;
    thumbnail?: string;
  };
  predictionData?: {
    co2Level: number;
    confidence: number;
    facilities: number;
    processingTime: string;
    hotspots: Array<{ lat: number; lon: number; value: number }>;
  };
  reportUrl?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  resourceType,
  resourceId,
  title,
  metadata,
  predictionData,
  reportUrl,
}: ShareModalProps) {
  const [shareId, setShareId] = useState("");
  const [visibility, setVisibility] = useState<"anyone" | "org" | "private">("anyone");
  const [permission, setPermission] = useState<"viewer" | "commenter">("viewer");
  const [expiration, setExpiration] = useState<string>("never");
  const [customExpiryDate, setCustomExpiryDate] = useState("");
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  // Content to include options
  const [includedParts, setIncludedParts] = useState({
    predictionMap: true,
    co2Heatmap: true,
    charts: true,
    metadata: true,
    confidenceScores: true,
    report: true,
    aiSummary: true,
  });

  // Generate or load existing share config on open
  useEffect(() => {
    if (isOpen) {
      // Look for existing share link for this resource
      const existing = localStorage.getItem(`emissia_share_resource_${resourceType}_${resourceId}`);
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          setShareId(parsed.id);
          setVisibility(parsed.visibility);
          setPermission(parsed.permission);
          setExpiration(parsed.expiration || "never");
          if (parsed.expiresAt && parsed.expiration === "custom") {
            setCustomExpiryDate(parsed.expiresAt.split("T")[0]);
          }
          if (parsed.password) {
            setEnablePassword(true);
            setPassword(parsed.password);
          }
          if (parsed.includedParts) {
            setIncludedParts(parsed.includedParts);
          }
        } catch {
          generateNewId();
        }
      } else {
        generateNewId();
      }
    }
  }, [isOpen, resourceType, resourceId]);

  const generateNewId = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 9; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setShareId(result);
  };

  if (!isOpen) return null;

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${shareId}`
    : `https://emissia.ai/share/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // Calculate expiration date
    let expiresAt: string | null = null;
    if (expiration === "24h") {
      const d = new Date();
      d.setHours(d.getHours() + 24);
      expiresAt = d.toISOString();
    } else if (expiration === "7d") {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      expiresAt = d.toISOString();
    } else if (expiration === "30d") {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiresAt = d.toISOString();
    } else if (expiration === "custom" && customExpiryDate) {
      expiresAt = new Date(customExpiryDate).toISOString();
    }

    const shareConfig = {
      id: shareId,
      resourceType,
      resourceId,
      visibility,
      permission,
      expiration,
      expiresAt,
      password: enablePassword ? password : null,
      views: 0,
      createdAt: new Date().toISOString(),
      status: "active",
      title,
      metadata,
      predictionData,
      reportUrl,
      includedParts,
    };

    // Save configuration
    localStorage.setItem(`emissia_share_resource_${resourceType}_${resourceId}`, JSON.stringify(shareConfig));
    
    // Save to global list of shared links for the manager page
    const globalListRaw = localStorage.getItem("emissia_shared_links_list");
    let globalList = globalListRaw ? JSON.parse(globalListRaw) : [];
    // Remove existing link with same id if it exists
    globalList = globalList.filter((item: { id: string }) => item.id !== shareId);
    globalList.push({
      id: shareId,
      resourceType,
      resourceId,
      title,
      visibility,
      permission,
      expiresAt,
      views: 0,
      createdAt: shareConfig.createdAt,
      status: "active",
    });
    localStorage.setItem("emissia_shared_links_list", JSON.stringify(globalList));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ground-950/80 p-4 backdrop-blur-sm animate-in fade-in-30">
      <Card className="relative w-full max-w-3xl overflow-hidden bg-ground-900 border border-ground-700 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ground-700/60 p-5 shrink-0">
          <div>
            <h2 className="text-lg font-medium text-instrument" style={{ fontFamily: "var(--font-display)" }}>
              Share Resource
            </h2>
            <p className="text-xs text-ground-400">
              Generate a secure, customized public link for this resource.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ground-400 hover:bg-ground-800 hover:text-instrument transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Link URL row */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ground-400 uppercase tracking-wider">Secure URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-lg border border-ground-700 bg-ground-950 px-3 py-2 text-xs font-mono text-instrument focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="rounded-lg bg-ground-800 border border-ground-700 hover:border-ground-400 px-4 py-2 flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-sensor" /> : <Copy className="h-3.5 w-3.5 text-ground-400" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => setShowQr(!showQr)}
                className={cn(
                  "rounded-lg border px-3 py-2 transition-colors cursor-pointer",
                  showQr ? "border-sensor bg-sensor/10 text-sensor" : "border-ground-700 bg-ground-800 hover:border-ground-400"
                )}
                title="Show QR Code"
              >
                <QrCode className="h-4.5 w-4.5" />
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-ground-700 bg-ground-800 hover:border-ground-400 px-3 py-2 transition-colors flex items-center justify-center"
                title="Open Link in New Tab"
              >
                <ExternalLink className="h-4.5 w-4.5 text-ground-400" />
              </a>
            </div>
          </div>

          {/* QR Code Container */}
          {showQr && (
            <div className="flex flex-col items-center bg-ground-950 p-4 rounded-lg border border-ground-700 max-w-xs mx-auto animate-in slide-in-from-top-4 duration-200">
              <p className="text-xs text-ground-400 mb-2 font-medium">Scan to open share link</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}&color=e6edf7&bgcolor=070b12`}
                alt="QR Code"
                className="border border-ground-700 rounded-lg p-2 bg-ground-950"
              />
            </div>
          )}

          {/* Main settings split layout */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left side: Permissions, Expiry, Password */}
            <div className="space-y-5">
              {/* Visibility and Permissions */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400">Permissions</h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "anyone"}
                      onChange={() => setVisibility("anyone")}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="text-instrument font-medium">Anyone with the link</span>
                      <span className="block text-xs text-ground-400">Public access, no login required.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "org"}
                      onChange={() => setVisibility("org")}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="text-instrument font-medium">Organization Only</span>
                      <span className="block text-xs text-ground-400">Requires login under the same workspace org.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "private"}
                      onChange={() => setVisibility("private")}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="text-instrument font-medium">Private</span>
                      <span className="block text-xs text-ground-400">Requires explicit permission or login as owner.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Permission level */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ground-400 uppercase tracking-wider block">Access Level</label>
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value as "viewer" | "commenter")}
                  className="w-full rounded-lg border border-ground-700 bg-ground-950 px-3 py-2 text-xs text-instrument focus:outline-none"
                >
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="commenter">Commenter</option>
                </select>
              </div>

              {/* Expiration Settings */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400">Expiration</h3>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    className="rounded-lg border border-ground-700 bg-ground-950 px-3 py-2 text-xs text-instrument focus:outline-none"
                  >
                    <option value="never">Never</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="custom">Custom Date</option>
                  </select>
                  {expiration === "custom" && (
                    <div className="relative">
                      <input
                        type="date"
                        value={customExpiryDate}
                        onChange={(e) => setCustomExpiryDate(e.target.value)}
                        className="w-full rounded-lg border border-ground-700 bg-ground-950 px-3 py-1.5 text-xs text-instrument focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Password Protection */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-ground-400" /> Password Protection
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enablePassword}
                      onChange={(e) => setEnablePassword(e.target.checked)}
                      className="rounded border-ground-700 bg-ground-950"
                    />
                    <span className="text-xs text-ground-400 font-medium">Enable password access</span>
                  </label>
                  {enablePassword && (
                    <input
                      type="password"
                      placeholder="Enter access password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-ground-700 bg-ground-950 px-3 py-1.5 text-xs text-instrument focus:outline-none focus:border-sensor font-mono"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Shared content checkboxes & Preview card */}
            <div className="space-y-5">
              {/* Shared Content selections */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400">Included Content</h3>
                <div className="grid gap-2 grid-cols-2">
                  {Object.entries(includedParts).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) =>
                          setIncludedParts((prev) => ({ ...prev, [key]: e.target.checked }))
                        }
                        className="rounded border-ground-700 bg-ground-950 text-sensor"
                      />
                      <span className="text-xs text-instrument capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-ground-400">Preview Card</h3>
                <div className="rounded-lg border border-ground-700 bg-ground-950/40 p-4 flex gap-4">
                  {metadata?.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={metadata.thumbnail}
                      alt="Thumbnail"
                      className="h-16 w-16 rounded-lg border border-ground-700 object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg border border-ground-700 bg-ground-900 flex items-center justify-center shrink-0">
                      <Share2 className="h-6 w-6 text-ground-400" />
                    </div>
                  )}
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold text-instrument truncate" title={title}>{title}</p>
                    <p className="text-[10px] text-ground-400 font-medium uppercase">
                      Resource: <span className="text-sensor">{resourceType}</span>
                    </p>
                    {metadata?.satellite && (
                      <p className="text-xs text-ground-400">Source: {metadata.satellite}</p>
                    )}
                    {metadata?.acquisitionDate && (
                      <p className="text-[10px] text-ground-400">Date: {metadata.acquisitionDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success banner if copied */}
          {copied && (
            <div className="bg-sensor/10 border border-sensor/20 rounded-lg p-3 text-xs text-sensor flex items-center gap-2 animate-in slide-in-from-bottom-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>Link copied to clipboard successfully. Make sure to click save below.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-ground-700/60 p-5 shrink-0 bg-ground-950/40">
          <button
            onClick={onClose}
            className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-xs transition-colors hover:border-ground-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2 text-xs font-semibold transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </Card>
    </div>
  );
}
