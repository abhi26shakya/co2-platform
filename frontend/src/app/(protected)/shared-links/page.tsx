"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Share2,
  Copy,
  Trash2,
  Ban,
  Play,
  Check,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface SharedLinkItem {
  id: string;
  resourceType: string;
  resourceId: string;
  title: string;
  visibility: string;
  permission: string;
  expiresAt: string | null;
  views: number;
  createdAt: string;
  status: "active" | "disabled";
}

export default function SharedLinksPage() {
  const [links, setLinks] = useState<SharedLinkItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load links from localStorage
  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = () => {
    const raw = localStorage.getItem("emissia_shared_links_list");
    if (raw) {
      try {
        setLinks(JSON.parse(raw));
      } catch {
        setLinks([]);
      }
    }
  };

  const saveLinks = (updated: SharedLinkItem[]) => {
    setLinks(updated);
    localStorage.setItem("emissia_shared_links_list", JSON.stringify(updated));
  };

  const handleCopy = (id: string) => {
    const shareUrl = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    const updated = links.map((link) => {
      if (link.id === id) {
        const nextStatus: "active" | "disabled" = link.status === "active" ? "disabled" : "active";
        // Also update the individual resource localStorage configuration
        const resKey = `emissia_share_resource_${link.resourceType}_${link.resourceId}`;
        const rawRes = localStorage.getItem(resKey);
        if (rawRes) {
          try {
            const parsed = JSON.parse(rawRes);
            parsed.status = nextStatus;
            localStorage.setItem(resKey, JSON.stringify(parsed));
          } catch {}
        }
        return { ...link, status: nextStatus };
      }
      return link;
    });
    saveLinks(updated);
  };

  const handleDelete = (id: string, resourceType: string, resourceId: string) => {
    const updated = links.filter((link) => link.id !== id);
    saveLinks(updated);
    // Delete individual config
    localStorage.removeItem(`emissia_share_resource_${resourceType}_${resourceId}`);
  };

  const handleRegenerate = (oldId: string, resourceType: string, resourceId: string) => {
    // Generate new id
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let newId = "";
    for (let i = 0; i < 9; i++) {
      newId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const updated = links.map((link) => {
      if (link.id === oldId) {
        // Also update individual storage config
        const resKey = `emissia_share_resource_${resourceType}_${resourceId}`;
        const rawRes = localStorage.getItem(resKey);
        if (rawRes) {
          try {
            const parsed = JSON.parse(rawRes);
            parsed.id = newId;
            localStorage.setItem(resKey, JSON.stringify(parsed));
          } catch {}
        }
        return { ...link, id: newId };
      }
      return link;
    });
    saveLinks(updated);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Shared Links
        </h1>
        <p className="mt-1 text-sm text-ground-400">
          Manage secure URLs and sharing permissions for your datasets, maps, reports, and analytics.
        </p>
      </div>

      <Card className="p-6">
        {links.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-ground-800 border border-ground-700 flex items-center justify-center text-ground-400">
              <Share2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-instrument">No shared links generated yet</p>
              <p className="text-xs text-ground-400 max-w-sm mx-auto">
                Open the Map, Analytics, Reports, or Datasets pages, click the &quot;Share&quot; button, and generate secure links.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-ground-700 text-ground-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-4">Shared Link</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4 text-center">Views</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ground-800">
                {links.map((link) => {
                  const isExpired = link.expiresAt ? new Date(link.expiresAt) < new Date() : false;
                  return (
                    <tr key={link.id} className="hover:bg-ground-800/20 transition-colors">
                      <td className="py-4 px-4 font-mono font-medium max-w-[200px] truncate">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-instrument font-semibold block truncate" title={link.title}>
                            {link.title}
                          </span>
                          <span className="text-ground-400 text-[10px] truncate">
                            /share/{link.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 capitalize font-semibold text-sensor">
                        {link.resourceType}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-instrument capitalize">{link.visibility}</span>
                          <span className="text-[10px] text-ground-400 capitalize">{link.permission}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-ground-400">
                        {link.expiresAt ? (
                          <span className={cn(isExpired && "text-alert font-medium")}>
                            {isExpired ? "Expired" : new Date(link.expiresAt).toLocaleDateString()}
                          </span>
                        ) : (
                          "Never"
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-instrument">
                        {link.views}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            "readout rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border",
                            link.status === "active" && !isExpired
                              ? "border-sensor/40 bg-sensor/10 text-sensor"
                              : "border-alert/40 bg-alert/10 text-alert"
                          )}
                        >
                          {isExpired ? "expired" : link.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(link.id)}
                            className="rounded-lg p-1.5 border border-ground-700 bg-ground-800 text-ground-400 hover:text-instrument hover:border-ground-400 transition-all cursor-pointer"
                            title="Copy link URL"
                          >
                            {copiedId === link.id ? <Check className="h-3.5 w-3.5 text-sensor" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <a
                            href={`/share/${link.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 border border-ground-700 bg-ground-800 text-ground-400 hover:text-instrument hover:border-ground-400 transition-all flex items-center justify-center"
                            title="Open shared page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => handleToggleStatus(link.id)}
                            disabled={isExpired}
                            className={cn(
                              "rounded-lg p-1.5 border transition-all cursor-pointer disabled:opacity-40",
                              link.status === "active"
                                ? "border-ground-700 bg-ground-800 text-ground-400 hover:text-alert hover:border-alert/50"
                                : "border-sensor/30 bg-sensor/5 text-sensor hover:bg-sensor/10"
                            )}
                            title={link.status === "active" ? "Disable link" : "Enable link"}
                          >
                            {link.status === "active" ? <Ban className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleRegenerate(link.id, link.resourceType, link.resourceId)}
                            className="rounded-lg p-1.5 border border-ground-700 bg-ground-800 text-ground-400 hover:text-instrument hover:border-ground-400 transition-all cursor-pointer"
                            title="Regenerate Share ID"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(link.id, link.resourceType, link.resourceId)}
                            className="rounded-lg p-1.5 border border-ground-700 bg-ground-800 text-ground-400 hover:text-alert hover:border-alert transition-all cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
