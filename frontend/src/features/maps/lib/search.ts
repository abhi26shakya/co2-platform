import type { EnrichedPlant } from "@/features/maps/lib/enrich-plants";
import type { MapHotspot } from "@/types/geo";
import { searchCountryBoundaries, type RegionBoundary } from "@/features/maps/lib/regions";

export interface MapSearchResult {
  type: "plant" | "hotspot" | "region";
  id: string;
  name: string;
  country: string;
  details: string;
  lat: number;
  lon: number;
  raw: EnrichedPlant | (MapHotspot & { name: string }) | RegionBoundary;
}

const MAX_RESULTS = 5;

/** Full plant roster for the browse-by-list / dropdown affordance in FacilitySearch, shown when
 *  the query is empty instead of the empty filtered-results state. */
export function buildFacilityList(plants: EnrichedPlant[]): MapSearchResult[] {
  return plants.map((p) => ({
    type: "plant" as const,
    id: p.id,
    name: p.name,
    country: p.country,
    details: `${p.sector} · ${p.company}`,
    lat: p.lat,
    lon: p.lon,
    raw: p,
  }));
}

export function buildSearchResults(
  plants: EnrichedPlant[],
  hotspots: MapHotspot[],
  query: string
): MapSearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];

  const regionResults: MapSearchResult[] = searchCountryBoundaries(trimmed).map((r) => ({
    type: "region" as const,
    id: `region-${r.name}`,
    name: r.name,
    country: r.name,
    details: "Country boundary",
    lat: (r.bbox[1] + r.bbox[3]) / 2,
    lon: (r.bbox[0] + r.bbox[2]) / 2,
    raw: r,
  }));

  const candidates: MapSearchResult[] = [
    ...regionResults,
    ...plants.map((p) => ({
      type: "plant" as const,
      id: p.id,
      name: p.name,
      country: p.country,
      details: `${p.sector} · ${p.company}`,
      lat: p.lat,
      lon: p.lon,
      raw: p,
    })),
    ...hotspots.map((h, i) => ({
      type: "hotspot" as const,
      id: `hotspot-${i}`,
      name: `Detected Hotspot #${i + 1}`,
      country: "India",
      details: `Anomaly · ${(h.intensity * 100).toFixed(0)}% confidence`,
      lat: h.lat,
      lon: h.lon,
      raw: { ...h, name: `Detected Hotspot #${i + 1}` },
    })),
  ];

  const q = trimmed.toLowerCase();
  return candidates
    .filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q) ||
        item.lat.toFixed(4).includes(q) ||
        item.lon.toFixed(4).includes(q)
    )
    .slice(0, MAX_RESULTS);
}
