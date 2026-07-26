import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMapStore } from "./map-store";

function resetStore() {
  useMapStore.setState({
    camera: { lat: 24.0, lon: 80.0, zoom: 5.0, pitch: -45.0, bearing: 0.0 },
    activeBasemap: "dark",
    mapMode: "3d",
    selectedFacility: null,
    gases: {
      co2: { enabled: true, opacity: 0.8 },
      ch4: { enabled: false, opacity: 0.7 },
      no2: { enabled: false, opacity: 0.75 },
      so2: { enabled: false, opacity: 0.7 },
      co: { enabled: false, opacity: 0.65 },
    },
  });
}

beforeEach(() => {
  localStorage.clear();
  resetStore();
});

describe("useMapStore defaults", () => {
  it("starts with the default camera position", () => {
    expect(useMapStore.getState().camera).toEqual({
      lat: 24.0,
      lon: 80.0,
      zoom: 5.0,
      pitch: -45.0,
      bearing: 0.0,
    });
  });

  it("defaults co2 layer on and every other gas layer off", () => {
    const { gases } = useMapStore.getState();
    expect(gases.co2.enabled).toBe(true);
    expect(gases.ch4.enabled).toBe(false);
    expect(gases.no2.enabled).toBe(false);
    expect(gases.so2.enabled).toBe(false);
    expect(gases.co.enabled).toBe(false);
  });
});

describe("setCamera", () => {
  it("merges partial updates onto the existing camera state", () => {
    useMapStore.getState().setCamera({ zoom: 9 });
    expect(useMapStore.getState().camera).toMatchObject({ zoom: 9, lat: 24.0, lon: 80.0 });
  });

  it("persists the merged camera to localStorage", () => {
    useMapStore.getState().setCamera({ zoom: 12, bearing: 45 });
    const saved = JSON.parse(localStorage.getItem("emissia-camera-position")!);
    expect(saved).toMatchObject({ zoom: 12, bearing: 45 });
  });
});

describe("setActiveBasemap", () => {
  it("updates the active basemap", () => {
    useMapStore.getState().setActiveBasemap("satellite");
    expect(useMapStore.getState().activeBasemap).toBe("satellite");
  });

  it("persists the basemap choice to localStorage", () => {
    useMapStore.getState().setActiveBasemap("terrain");
    expect(localStorage.getItem("emissia-active-basemap")).toBe("terrain");
  });
});

describe("setMapMode", () => {
  it("updates the map mode", () => {
    useMapStore.getState().setMapMode("2d");
    expect(useMapStore.getState().mapMode).toBe("2d");
  });

  it("persists the map mode choice to localStorage", () => {
    useMapStore.getState().setMapMode("2d");
    expect(localStorage.getItem("emissia-map-mode")).toBe("2d");
  });

  it("defaults to 3d when nothing is saved", () => {
    expect(useMapStore.getState().mapMode).toBe("3d");
  });
});

describe("setSelectedFacility", () => {
  it("stores the selected facility", () => {
    const facility = { id: "plant-1", name: "Vindhyachal" };
    useMapStore.getState().setSelectedFacility(facility);
    expect(useMapStore.getState().selectedFacility).toEqual(facility);
  });

  it("clears the selected facility when set to null", () => {
    useMapStore.getState().setSelectedFacility({ id: "plant-1" });
    useMapStore.getState().setSelectedFacility(null);
    expect(useMapStore.getState().selectedFacility).toBeNull();
  });
});

describe("toggleGas", () => {
  it("flips enabled without touching other gases", () => {
    useMapStore.getState().toggleGas("ch4");
    const { gases } = useMapStore.getState();
    expect(gases.ch4.enabled).toBe(true);
    expect(gases.co2.enabled).toBe(true);
    expect(gases.no2.enabled).toBe(false);
  });

  it("toggling twice returns to the original state", () => {
    useMapStore.getState().toggleGas("so2");
    useMapStore.getState().toggleGas("so2");
    expect(useMapStore.getState().gases.so2.enabled).toBe(false);
  });

  it("persists the updated gas config to localStorage", () => {
    useMapStore.getState().toggleGas("no2");
    const saved = JSON.parse(localStorage.getItem("emissia-gas-layers")!);
    expect(saved.no2.enabled).toBe(true);
  });
});

describe("setGasOpacity", () => {
  it("updates only the opacity for the given gas", () => {
    useMapStore.getState().setGasOpacity("co2", 0.3);
    const { gases } = useMapStore.getState();
    expect(gases.co2.opacity).toBe(0.3);
    expect(gases.co2.enabled).toBe(true);
  });

  it("persists the updated opacity to localStorage", () => {
    useMapStore.getState().setGasOpacity("ch4", 0.55);
    const saved = JSON.parse(localStorage.getItem("emissia-gas-layers")!);
    expect(saved.ch4.opacity).toBe(0.55);
  });
});

describe("module initialization from localStorage", () => {
  it("hydrates camera/basemap/gases from previously saved values on load", async () => {
    localStorage.setItem(
      "emissia-camera-position",
      JSON.stringify({ lat: 1, lon: 2, zoom: 3, pitch: 4, bearing: 5 })
    );
    localStorage.setItem("emissia-active-basemap", "satellite");
    localStorage.setItem("emissia-map-mode", "2d");
    localStorage.setItem(
      "emissia-gas-layers",
      JSON.stringify({
        co2: { enabled: false, opacity: 0.1 },
        ch4: { enabled: true, opacity: 0.2 },
        no2: { enabled: false, opacity: 0.3 },
        so2: { enabled: false, opacity: 0.4 },
        co: { enabled: false, opacity: 0.5 },
      })
    );

    vi.resetModules();
    const fresh = await import("./map-store");
    const state = fresh.useMapStore.getState();

    expect(state.camera).toEqual({ lat: 1, lon: 2, zoom: 3, pitch: 4, bearing: 5 });
    expect(state.activeBasemap).toBe("satellite");
    expect(state.mapMode).toBe("2d");
    expect(state.gases.ch4.enabled).toBe(true);
  });
});
