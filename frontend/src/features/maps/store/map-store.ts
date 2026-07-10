import { create } from "zustand";

interface CameraState {
  lat: number;
  lon: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface MapStore {
  camera: CameraState;
  activeBasemap: string;
  selectedFacility: any | null;
  selectedGas: string;
  
  // Actions
  setCamera: (camera: Partial<CameraState>) => void;
  setActiveBasemap: (basemap: string) => void;
  setSelectedFacility: (facility: any | null) => void;
  setSelectedGas: (gas: string) => void;
}

const DEFAULT_CAMERA = {
  lat: 24.0,
  lon: 80.0,
  zoom: 5.0,
  pitch: 45.0,
  bearing: 0.0,
};

const STORAGE_KEY_BASEMAP = "emissia-active-basemap";
const STORAGE_KEY_CAMERA = "emissia-camera-position";

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
      // ignore parsing error
    }
  }
  return DEFAULT_CAMERA;
};

export const useMapStore = create<MapStore>((set) => ({
  camera: getSavedCamera(),
  activeBasemap: getSavedBasemap(),
  selectedFacility: null,
  selectedGas: "co2",

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
  setSelectedGas: (gas) => set({ selectedGas: gas }),
}));
