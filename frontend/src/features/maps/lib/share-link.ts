import type { MapMode } from "@/features/maps/store/map-store";

const SHARE_BASE_URL = "https://co2-platform-nine.vercel.app/map";

export interface ShareLinkCamera {
  lat: number;
  lon: number;
  zoom: number;
}

export interface BuildShareLinkParams {
  camera: ShareLinkCamera;
  mapMode: MapMode;
  basemap: string;
  activeGasKeys: string[];
}

/**
 * Builds the map's shareable URL from the actual current view state, so a recipient opening the
 * link sees what the sharer was looking at — not a fixed placeholder position.
 */
export function buildShareLink({ camera, mapMode, basemap, activeGasKeys }: BuildShareLinkParams): string {
  const query = [
    `lat=${camera.lat.toFixed(4)}`,
    `lon=${camera.lon.toFixed(4)}`,
    `zoom=${camera.zoom.toFixed(1)}`,
    `mode=${mapMode}`,
    `basemap=${basemap}`,
    `gases=${activeGasKeys.join(",")}`,
  ].join("&");
  return `${SHARE_BASE_URL}?${query}`;
}
