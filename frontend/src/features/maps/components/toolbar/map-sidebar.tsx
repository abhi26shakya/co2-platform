"use client";

import { X } from "lucide-react";
import type { LeftPanelId } from "@/features/maps/store/map-ui-store";

interface SidebarSection {
  id: Exclude<LeftPanelId, null>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Props {
  open: boolean;
  onClose: () => void;
  activePanel: LeftPanelId;
  onSelectPanel: (id: Exclude<LeftPanelId, null>) => void;
  sections: SidebarSection[];
  children: React.ReactNode;
}

/** Left-side floating sidebar, overlaying the map rather than pushing it down — structurally
 *  modeled on Climate TRACE's hamburger-menu navigation drawer, adapted to hold this map's own
 *  functional panels (layers, gas layers, filters, GIS tools, export) as a vertical section list
 *  instead of site navigation links. `children` renders the currently active section's content
 *  beneath the list, in the same column. */
export function MapSidebar({ open, onClose, activePanel, onSelectPanel, sections, children }: Props) {
  if (!open) return null;

  return (
    <>
      <div className="absolute inset-0 z-30 bg-ground-950/40 lg:hidden" onClick={onClose} />
      <div className="glass-strong absolute left-0 top-0 z-40 w-72 max-w-[85vw] rounded-xl overflow-hidden animate-in fade-in slide-in-from-left-2 duration-150 max-h-[calc(100%-2rem)] flex flex-col">
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-ground-800">
          <span className="text-xs font-bold uppercase tracking-wider text-ground-400">Map Tools</span>
          <button onClick={onClose} className="text-ground-400 hover:text-instrument cursor-pointer" title="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="p-2 space-y-0.5 border-b border-ground-800">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSelectPanel(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePanel === id ? "bg-sensor/10 text-sensor" : "text-ground-300 hover:bg-ground-850 hover:text-instrument"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 space-y-3 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
