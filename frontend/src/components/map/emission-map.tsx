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

// A plant's CO2 confidence, matching the pipeline's honest logic.
function co2Confidence(p: PlantOut) {
  if (p.co2_enhancement_ppm == null || (p.co2_soundings ?? 0) < 20) {
    return { label: "Insufficient data", color: "#9ca3af", hasSignal: false };
  }
  const strong = p.co2_enhancement_ppm > (p.co2_bg_std_ppm ?? 0);
  const close = (p.co2_no2_peak_km ?? 999) <= 10;
  const wind = (p.co2_wind_diff_deg ?? 999) < 45;
  const score = [strong, close, wind].filter(Boolean).length;
  if (score >= 3) return { label: "Strong signal", color: "#f5dc50", hasSignal: true };
  if (score === 2) return { label: "Good signal", color: "#f08c28", hasSignal: true };
  return { label: "Moderate signal", color: "#c8506e", hasSignal: true };
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
        plants.map((p) => {
          const conf = co2Confidence(p);
          // Plants with a CO2 signal are tinted by confidence; others stay green.
          const markerColor = conf.hasSignal ? conf.color : "#34d399";
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lon]}
              radius={conf.hasSignal ? 6 + (p.co2_enhancement_ppm ?? 0) * 3 : 5}
              pathOptions={{
                color: markerColor,
                weight: 1.5,
                fillColor: markerColor,
                fillOpacity: 0.3,
              }}
            >
              <Tooltip>
                <div className="text-xs">
                  <p className="font-medium">{p.name}</p>
                  <p>
                    {p.fuel_type}  {p.capacity_mw ? `${p.capacity_mw.toLocaleString()} MW` : "n/a"}
                  </p>

                  {/* --- CO2 enhancement (honest: number only when reliable) --- */}
                  {p.co2_enhancement_ppm != null ? (
                    <p className="mt-1" style={{ color: conf.color }}>
                      CO₂ +{p.co2_enhancement_ppm.toFixed(2)} ppm
                      <span className="text-ground-400">
                        {" "}· NO₂ {p.co2_no2_peak_km?.toFixed(0)} km
                        {" "}· {p.co2_soundings} soundings · {conf.label}
                      </span>
                    </p>
                  ) : p.co2_soundings != null ? (
                    <p className="mt-1 text-ground-400">
                      CO₂: insufficient coverage ({p.co2_soundings} soundings)
                    </p>
                  ) : null}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

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
                    {emissionInfo.value} {emissionInfo.unit}  {h.image_filename}
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
