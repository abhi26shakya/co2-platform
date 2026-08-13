import type { MapSearchResult } from "@/features/maps/lib/search";

interface MapboxGeocodingFeature {
  id: string;
  place_name: string;
  text: string;
  center: [number, number];
  bbox?: [number, number, number, number];
  place_type: string[];
  context?: { id: string; text: string }[];
}

interface MapboxGeocodingResponse {
  features: MapboxGeocodingFeature[];
}

const GEOCODING_LIMIT = 5;
// Countries/regions/cities/POIs are the useful granularity for a global emissions map zoomed out
// past street level; "address" is deliberately excluded since exact street addresses aren't a
// meaningful unit here.
const GEOCODING_TYPES = "country,region,place,locality,poi";

function featureCountry(feature: MapboxGeocodingFeature): string {
  const countryContext = feature.context?.find((c) => c.id.startsWith("country"));
  return countryContext?.text ?? (feature.place_type.includes("country") ? feature.text : "");
}

function toMapSearchResult(feature: MapboxGeocodingFeature): MapSearchResult {
  const [lon, lat] = feature.center;
  return {
    type: "place",
    id: `geocode-${feature.id}`,
    name: feature.text,
    country: featureCountry(feature),
    details: feature.place_name,
    lat,
    lon,
    raw: { bbox: feature.bbox },
  };
}

/**
 * Live free-text place lookup via Mapbox's Geocoding API — additive to search.ts's pure
 * client-side substring filter over already-loaded plant/hotspot/region data, not a replacement.
 * Fails open (resolves []) on any error/rate-limit so a geocoding hiccup never breaks the rest of
 * the search results, matching the fire-and-forget tolerance this codebase already uses for
 * boundary fetches (see fetchStateBoundaries in maps/page.tsx).
 */
export async function geocodeSearch(query: string, proximity?: { lat: number; lon: number }): Promise<MapSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return [];

  const params = new URLSearchParams({
    access_token: token,
    limit: String(GEOCODING_LIMIT),
    types: GEOCODING_TYPES,
  });
  if (proximity) params.set("proximity", `${proximity.lon},${proximity.lat}`);

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json?${params.toString()}`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as MapboxGeocodingResponse;
    return (data.features ?? []).map(toMapSearchResult);
  } catch {
    return [];
  }
}
