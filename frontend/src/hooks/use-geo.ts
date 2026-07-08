"use client";

import { api } from "@/lib/api-client";
import type { AnalyticsOut, MapHotspot, PlantOut } from "@/types/geo";
import { useQuery } from "@tanstack/react-query";

export function usePlants() {
  return useQuery({
    queryKey: ["map", "plants"],
    queryFn: () => api.get<PlantOut[]>("/map/plants"),
    staleTime: 5 * 60_000, // reference data changes rarely
  });
}

export function useHotspots() {
  return useQuery({
    queryKey: ["map", "hotspots"],
    queryFn: () => api.get<MapHotspot[]>("/map/hotspots"),
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => api.get<AnalyticsOut>("/analytics"),
  });
}
