import { beforeEach, describe, expect, it } from "vitest";
import { useMapUiStore } from "./map-ui-store";

beforeEach(() => {
  useMapUiStore.setState({ activePanel: null, inspectorDrawerOpen: false, alertsOpen: false });
});

describe("activePanel", () => {
  it("opens a panel", () => {
    useMapUiStore.getState().setActivePanel("layers");
    expect(useMapUiStore.getState().activePanel).toBe("layers");
  });

  it("togglePanel closes the panel if it is already active", () => {
    useMapUiStore.getState().setActivePanel("gas");
    useMapUiStore.getState().togglePanel("gas");
    expect(useMapUiStore.getState().activePanel).toBeNull();
  });

  it("togglePanel switches to a different panel", () => {
    useMapUiStore.getState().setActivePanel("search");
    useMapUiStore.getState().togglePanel("gis");
    expect(useMapUiStore.getState().activePanel).toBe("gis");
  });
});

describe("inspectorDrawer", () => {
  it("opens and closes independently of the left rail", () => {
    useMapUiStore.getState().openInspectorDrawer();
    expect(useMapUiStore.getState().inspectorDrawerOpen).toBe(true);
    useMapUiStore.getState().closeInspectorDrawer();
    expect(useMapUiStore.getState().inspectorDrawerOpen).toBe(false);
  });
});

describe("alertsOpen", () => {
  it("sets alerts visibility", () => {
    useMapUiStore.getState().setAlertsOpen(true);
    expect(useMapUiStore.getState().alertsOpen).toBe(true);
  });
});
