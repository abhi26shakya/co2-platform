/** Mirrors backend/app/schemas/prediction_api.py — keep in sync. */
import type { Hotspot } from "@/types/prediction";

export interface PredictionOut {
  id: string;
  image_id: string;
  status: "completed" | "failed";
  schema_version: string;
  co2_emission_tonnes_per_year: number | null;
  confidence: number | null;
  hotspots: Hotspot[] | null;
  inference_time_ms: number | null;
  created_at: string;
  model_version: string | null;
  image_filename: string | null;
}

export interface PredictionListOut {
  items: PredictionOut[];
  total: number;
  page: number;
  page_size: number;
}
