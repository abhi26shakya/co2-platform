"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

interface Props {
  open: boolean;
  link: string;
  onClose: () => void;
}

export function ShareDialog({ open, link, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ground-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm p-6 bg-ground-900 border-ground-700 space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-instrument">Generated Shareable Link</h3>
          <p className="text-xs text-ground-400">Includes active basemaps, layers, camera settings, and gas selections.</p>
        </div>

        <div className="p-3 bg-ground-950 border border-ground-750 rounded-lg font-mono text-[10px] text-sensor break-all select-all">
          {link}
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 p-3.5 bg-ground-950 rounded-lg border border-ground-800">
          <span className="text-[10px] uppercase font-bold text-ground-450 tracking-wider">Scan to Open Map</span>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=10b981&bgcolor=09090b&data=${encodeURIComponent(link)}`}
            alt="Emissia Map QR Code"
            className="h-28 w-28 rounded border border-ground-800 p-1 bg-ground-950"
          />
        </div>

        <div className="flex justify-end items-center gap-2 pt-2">
          {copied && <span className="text-[10px] text-sensor mr-auto">Copied!</span>}
          <button
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-2 bg-ground-800 hover:bg-ground-750 text-xs font-semibold rounded-lg text-instrument cursor-pointer"
          >
            Copy Link
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sensor hover:bg-sensor/90 text-ground-950 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>
      </Card>
    </div>
  );
}
