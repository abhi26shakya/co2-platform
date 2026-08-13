import type { MapHotspot, PlantOut } from "@/types/geo";
import { haversineDistanceM } from "@/features/maps/components/gis-tools/lib/geo-math";
import { UNCLASSIFIED_SECTOR } from "@/features/maps/lib/sector-colors";

export interface HistoricalPoint {
  month: string;
  value: number;
}

export interface EnrichedPlant extends PlantOut {
  sector: string;
  company: string;
  predicted_gases: string[];
  confidence: string;
  trend: string;
  historical: HistoricalPoint[];
  latest_prediction: string;
}

const SECTORS = ["Power Combustion", "Petrochemical Refinery", "Cement Manufacturing", "Steel Processing"];
const COMPANIES = ["National Thermal Power Corp", "State Oil Refinery", "Universal Cement Ltd", "Global Steel Works"];
const GAS_SCENARIOS = [
  ["CO₂", "NO₂", "CO"],
  ["CO₂", "CH₄"],
  ["CO₂", "SO₂"],
  ["CO₂", "NO₂", "SO₂", "CO"],
];
const TRENDS = ["+2.4% (increasing)", "-1.5% (decreasing)", "+0.8% (stable)", "-4.2% (falling)"];

/**
 * Placeholder enrichment: fabricates sector/company/gas/trend fields the backend does not
 * currently expose (see backend/app/schemas/geo.py PlantOut). Swap this module out for real
 * backend fields once available — nothing downstream depends on it being mock data specifically.
 */
export function enrichPlants(plants: PlantOut[]): EnrichedPlant[] {
  return plants.map((p, idx) => {
    const sector = SECTORS[idx % SECTORS.length];
    const company = p.name.includes("Taichung")
      ? "Taipower"
      : p.name.includes("Belchatow")
        ? "PGE Group"
        : COMPANIES[idx % COMPANIES.length];
    const predicted_gases = p.name.includes("Mundra") ? ["CO₂", "CH₄"] : GAS_SCENARIOS[idx % GAS_SCENARIOS.length];
    const confidence = `${88 + (idx % 11)}%`;
    const trend = TRENDS[idx % TRENDS.length];

    const baseEmissions = p.co2_enhancement_ppm || 45 + idx * 5;
    const historical: HistoricalPoint[] = [
      { month: "Nov 25", value: baseEmissions * 0.95 },
      { month: "Dec 25", value: baseEmissions * 0.98 },
      { month: "Jan 26", value: baseEmissions * 1.02 },
      { month: "Feb 26", value: baseEmissions * 1.0 },
      { month: "Mar 26", value: baseEmissions },
    ];

    return {
      ...p,
      sector,
      company,
      predicted_gases,
      confidence,
      trend,
      historical,
      latest_prediction: `${baseEmissions.toFixed(2)} ppm`,
    };
  });
}

/** Rescales a plant's historical series to the currently selected timeline tick set, matching enrichPlants' trend shape. */
export function buildFacilityHistoricalSeries(baseCo2: number, ticks: string[]): HistoricalPoint[] {
  return ticks.map((tick, i) => ({
    month: tick,
    value: baseCo2 * (0.85 + 0.15 * Math.sin(i * 1.5) + 0.05 * Math.cos(i * 3)),
  }));
}

/** Time-scales hotspot intensity/emissions to simulate historical variation at a given timeline index. */
export function timeScaleFactor(sliderIndex: number): number {
  return 0.85 + 0.15 * Math.sin(sliderIndex * 1.5) + 0.05 * Math.cos(sliderIndex * 3);
}

/** Distance below which two plant records are treated as the same physical facility (see
 *  dedupePlantsByLocation). The seed data's duplicate pairs vary from 0m (identical coordinates)
 *  up to ~2.8km apart, sometimes even under slightly different names ("...Power Station" vs
 *  "...Power Plant") - 5km safely covers every observed duplicate pair while staying well under
 *  the ~13km+ gap between this dataset's closest pair of genuinely different real facilities
 *  (Sasan and Vindhyachal), so it won't merge two real, distinct plants. */
const DUPLICATE_PLANT_RADIUS_M = 5000;

/** Collapses plants that sit within DUPLICATE_PLANT_RADIUS_M of an already-kept plant down to one
 *  marker - the demo seed data creates multiple synthetic sector/company records for the same
 *  physical facility (sometimes under slightly different names, e.g. "Korba Super Thermal Power
 *  Station" vs "...Power Plant"), which otherwise renders as separate, overlapping-or-nearby dots
 *  on the map. Scoped to the map's marker rendering only - callers that need the full roster
 *  (search results, facility counts) should keep using the un-deduped array. */
export function dedupePlantsByLocation(plants: EnrichedPlant[]): EnrichedPlant[] {
  const kept: EnrichedPlant[] = [];
  for (const p of plants) {
    const isDuplicate = kept.some(
      (k) => haversineDistanceM({ lat: p.lat, lon: p.lon }, { lat: k.lat, lon: k.lon }) < DUPLICATE_PLANT_RADIUS_M
    );
    if (!isDuplicate) kept.push(p);
  }
  return kept;
}

export interface SectorizedHotspot extends MapHotspot {
  sector: string;
}

/** Mirrors the backend's /internal/plants/nearest default search radius (25km) - beyond that a
 *  hotspot isn't really "at" any known facility, so it falls back to UNCLASSIFIED_SECTOR rather
 *  than borrowing a distant, unrelated plant's sector. Computed client-side against the plants
 *  array already loaded for the map (rather than one nearest-plant API call per hotspot) since
 *  that endpoint doesn't return fuel_type/sector anyway - sector lives only in enrichPlants(). */
const MAX_SECTOR_MATCH_DISTANCE_M = 25_000;

/** Attributes each hotspot a sector borrowed from its nearest enriched plant, for sector-based
 *  coloring parity between plant markers and plume/extrusion markers (see sector-colors.ts). */
export function attachNearestSector(hotspots: MapHotspot[], plants: EnrichedPlant[]): SectorizedHotspot[] {
  return hotspots.map((h) => {
    let nearestSector: string | null = null;
    let nearestDistanceM = Infinity;
    for (const p of plants) {
      const d = haversineDistanceM({ lat: h.lat, lon: h.lon }, { lat: p.lat, lon: p.lon });
      if (d < nearestDistanceM) {
        nearestDistanceM = d;
        nearestSector = p.sector;
      }
    }
    const sector = nearestSector && nearestDistanceM <= MAX_SECTOR_MATCH_DISTANCE_M ? nearestSector : UNCLASSIFIED_SECTOR;
    return { ...h, sector };
  });
}
