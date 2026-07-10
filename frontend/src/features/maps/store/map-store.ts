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

interface MapStore {
  camera: CameraState;
  activeBasemap: string;
  selectedFacility: any | null;
  gases: Record<string, GasConfig>;
  
  // Actions
  setCamera: (camera: Partial<CameraState>) => void;
  setActiveBasemap: (basemap: string) => void;
  setSelectedFacility: (facility: any | null) => void;
  toggleGas: (gas: string) => void;
  setGasOpacity: (gas: string, opacity: number) => void;
}

const DEFAULT_CAMERA = {
  lat: 24.0,
  lon: 80.0,
  zoom: 5.0,
  pitch: -45.0,
  bearing: 0.0,
};

const STORAGE_KEY_BASEMAP = "emissia-active-basemap";
const STORAGE_KEY_CAMERA = "emissia-camera-position";
const STORAGE_KEY_GASES = "emissia-gas-layers";

const getSavedBasemap = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEY_BASEMAP) || "dark";
  }
  return "dark";
};

const getSavedCamera = (): CameraState => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMERA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
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
    } catch (e) {
      // ignore
    }
  }
  return defaults;
};

export const useMapStore = create<MapStore>((set) => ({
  camera: getSavedCamera(),
  activeBasemap: getSavedBasemap(),
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
