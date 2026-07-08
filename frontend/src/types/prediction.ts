/** Mirrors backend/app/schemas/prediction.py — keep in sync. */

export interface Hotspot {
  lat: number;
  lon: number;
  intensity: number;
  radius_m: number;
}

export interface PredictionRequest {
  image_id: string;
  image_url?: string | null;
  bounds?: [number, number, number, number] | null;
  metadata?: Record<string, unknown>;
}

export interface PredictionResultV1 {
  schema_version: "v1";
  co2_emission_tonnes_per_year: number;
  confidence: number;
  hotspots: Hotspot[];
  heatmap_url: string | null;
  model_version: string;
  inference_time_ms: number;
}
