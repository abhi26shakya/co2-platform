import { create } from "zustand";

interface CameraState {
  lat: number;
  lon: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface GasConfig {
  enabled: boolean;
  opacity: number;
}

export type MapMode = "2d" | "3d";

/** Whatever was last clicked/selected on the map — a plant (PlantOut-shaped) or a synthetic gas
 *  plume/hotspot entity (see the `metadata` shape built in maplibre-map.tsx), which don't share a
 *  single schema. All fields optional and no index signature, so concrete shapes like
 *  EnrichedPlant/PlantOut remain structurally assignable here. */
export interface SelectedFacility {
  id?: string;
  name?: string;
  lat?: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
  co2?: string | number;
  co2_enhancement_ppm?: number | null;
  confidence?: string;
  satellite?: string;
  dataset?: string;
  industry?: string;
  sector?: string;
  company?: string;
  country?: string;
}

interface MapStore {
  camera: CameraState;
  activeBasemap: string;
  mapMode: MapMode;
  selectedFacility: SelectedFacility | null;
  gases: Record<string, GasConfig>;

  // Actions
  setCamera: (camera: Partial<CameraState>) => void;
  setActiveBasemap: (basemap: string) => void;
  setMapMode: (mode: MapMode) => void;
  setSelectedFacility: (facility: SelectedFacility | null) => void;
  toggleGas: (gas: string) => void;
  setGasOpacity: (gas: string, opacity: number) => void;
}

// pitch uses MapLibre's convention (0 = straight down, up to maxPitch) now that a single engine
// (globe projection for 3D, mercator for 2D) owns the camera — see maplibre-map.tsx.
const DEFAULT_CAMERA = {
  lat: 24.0,
  lon: 80.0,
  zoom: 5.0,
  pitch: 0.0,
  bearing: 0.0,
};

const STORAGE_KEY_BASEMAP = "emissia-active-basemap";
const STORAGE_KEY_CAMERA = "emissia-camera-position";
const STORAGE_KEY_GASES = "emissia-gas-layers";
const STORAGE_KEY_MAP_MODE = "emissia-map-mode";

const getSavedBasemap = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEY_BASEMAP) || "light";
  }
  return "light";
};

const getSavedMapMode = (): MapMode => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY_MAP_MODE);
    if (saved === "2d" || saved === "3d") return saved;
  }
  // 3D used to default off as a stopgap around a Cesium-specific Vercel crash (see KI-004 in
  // .claude/docs/KNOWN_ISSUES.md) — Cesium has since been retired in favor of MapLibre's native
  // globe projection, and production re-verification (2026-08-13) found no crash. New users now
  // land on the 3D globe, matching the Climate TRACE-style default view.
  return "3d";
};

const getSavedCamera = (): CameraState => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMERA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }
  return DEFAULT_CAMERA;
};

const getSavedGases = (): Record<string, GasConfig> => {
  const defaults = {
    co2: { enabled: true, opacity: 0.8 },
    ch4: { enabled: false, opacity: 0.7 },
    no2: { enabled: false, opacity: 0.75 },
    so2: { enabled: false, opacity: 0.7 },
    co: { enabled: false, opacity: 0.65 },
  };
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GASES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }
  return defaults;
};

export const useMapStore = create<MapStore>((set) => ({
  camera: getSavedCamera(),
  activeBasemap: getSavedBasemap(),
  mapMode: getSavedMapMode(),
  selectedFacility: null,
  gases: getSavedGases(),

  setCamera: (cam) =>
    set((state) => {
      const newCamera = { ...state.camera, ...cam };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_CAMERA, JSON.stringify(newCamera));
      }
      return { camera: newCamera };
    }),

  setActiveBasemap: (basemap) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_BASEMAP, basemap);
    }
    set({ activeBasemap: basemap });
  },

  setMapMode: (mode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_MAP_MODE, mode);
    }
    set({ mapMode: mode });
  },

  setSelectedFacility: (facility) => set({ selectedFacility: facility }),

  toggleGas: (gas) =>
    set((state) => {
      const updated = {
        ...state.gases,
        [gas]: {
          ...state.gases[gas],
          enabled: !state.gases[gas].enabled,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_GASES, JSON.stringify(updated));
      }
      return { gases: updated };
    }),

  setGasOpacity: (gas, opacity) =>
    set((state) => {
      const updated = {
        ...state.gases,
        [gas]: {
          ...state.gases[gas],
          opacity,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_GASES, JSON.stringify(updated));
      }
      return { gases: updated };
    }),
}));
