"use client";

import "leaflet/dist/leaflet.css";

import type { MapHotspot, PlantOut } from "@/types/geo";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import { useSettings } from "@/components/providers/settings-provider";

interface Props {
  plants: PlantOut[];
  hotspots: MapHotspot[];
  showPlants: boolean;
  showHotspots: boolean;
}

export default function EmissionMap({ plants, hotspots, showPlants, showHotspots }: Props) {
  const { formatEmission, getHotspotColor, resolvedTheme } = useSettings();

  // center on the user's data when it exists, otherwise on India
  const center: [number, number] =
    hotspots.length > 0
      ? [
          hotspots.reduce((s, h) => s + h.lat, 0) / hotspots.length,
          hotspots.reduce((s, h) => s + h.lon, 0) / hotspots.length,
        ]
      : [22.5, 79.5];
  const zoom = hotspots.length > 0 ? 9 : 5;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-[36rem] w-full rounded-xl border border-ground-700"
      scrollWheelZoom
    >
      <TileLayer
        url={resolvedTheme === "light"
          ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {showPlants &&
        plants.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lon]}
            radius={5}
            pathOptions={{
              color: "#34d399",
              weight: 1.5,
              fillColor: "#34d399",
              fillOpacity: 0.25,
            }}
          >
            <Tooltip>
              <div className="text-xs">
                <p className="font-medium">{p.name}</p>
                <p>
                  {p.fuel_type} · {p.capacity_mw ? `${p.capacity_mw.toLocaleString()} MW` : "n/a"}
                </p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

      {showHotspots &&
        hotspots.map((h, i) => {
          const emissionInfo = formatEmission(h.emission_tonnes_per_year ?? 0);
          const color = getHotspotColor(h.intensity);
          return (
            <CircleMarker
              key={`${h.lat}-${h.lon}-${i}`}
              center={[h.lat, h.lon]}
              radius={6 + h.intensity * 10}
              pathOptions={{
                color: color,
                weight: 1,
                fillColor: color,
                fillOpacity: 0.35 + h.intensity * 0.3,
              }}
            >
              <Tooltip>
                <div className="text-xs">
                  <p className="font-medium">Intensity {(h.intensity * 100).toFixed(0)}%</p>
                  <p>
                    {emissionInfo.value} {emissionInfo.unit} · {h.image_filename}
                  </p>
                  <p>{new Date(h.predicted_at).toLocaleDateString()}</p>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
}
