import { create } from "zustand";

interface SidebarStore {
  /** Desktop icon-rail mode — sidebar stays visible but shrinks to icons only. */
  collapsed: boolean;
  /** Full workspace mode — sidebar is hidden entirely so content gets 100% width. */
  focusMode: boolean;
  /** Mobile off-canvas drawer visibility. Not persisted — always starts closed. */
  mobileOpen: boolean;

  toggleCollapsed: () => void;
  setFocusMode: (value: boolean) => void;
  toggleFocusMode: () => void;
  setMobileOpen: (value: boolean) => void;
}

const STORAGE_KEY_COLLAPSED = "emissia-sidebar-collapsed";
const STORAGE_KEY_FOCUS_MODE = "emissia-sidebar-focus-mode";

const getSavedFlag = (key: string): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) === "true";
  }
  return false;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: getSavedFlag(STORAGE_KEY_COLLAPSED),
  focusMode: getSavedFlag(STORAGE_KEY_FOCUS_MODE),
  mobileOpen: false,

  toggleCollapsed: () =>
    set((state) => {
      const next = !state.collapsed;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_COLLAPSED, String(next));
      }
      return { collapsed: next };
    }),

  setFocusMode: (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_FOCUS_MODE, String(value));
    }
    set({ focusMode: value });
  },

  toggleFocusMode: () =>
    set((state) => {
      const next = !state.focusMode;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_FOCUS_MODE, String(next));
      }
      return { focusMode: next };
    }),

  setMobileOpen: (value) => set({ mobileOpen: value }),
}));
