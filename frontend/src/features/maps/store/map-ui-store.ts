import { create } from "zustand";

export type LeftPanelId = "layers" | "gas" | "filters" | "gis" | "export" | null;

interface MapUiStore {
  /** Only one left-rail panel open at a time; null means the rail is collapsed to icons only. */
  activePanel: LeftPanelId;
  setActivePanel: (panel: LeftPanelId) => void;
  togglePanel: (panel: Exclude<LeftPanelId, null>) => void;

  inspectorDrawerOpen: boolean;
  openInspectorDrawer: () => void;
  closeInspectorDrawer: () => void;

  alertsOpen: boolean;
  setAlertsOpen: (open: boolean) => void;
}

export const useMapUiStore = create<MapUiStore>((set, get) => ({
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
  togglePanel: (panel) => set({ activePanel: get().activePanel === panel ? null : panel }),

  inspectorDrawerOpen: false,
  openInspectorDrawer: () => set({ inspectorDrawerOpen: true }),
  closeInspectorDrawer: () => set({ inspectorDrawerOpen: false }),

  alertsOpen: false,
  setAlertsOpen: (open) => set({ alertsOpen: open }),
}));
