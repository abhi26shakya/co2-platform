/** Mirrors backend/app/schemas/prediction_api.py — keep in sync. */
import type { Hotspot } from "@/types/prediction";

export interface PredictionOut {
  id: string;
  image_id: string;
  status: "completed" | "failed";
  schema_version: string;
  co2_emission_tonnes_per_year: number | null;
  confidence: number | null; // v1 only - see data_source for v2 predictions
  hotspots: Hotspot[] | null;
  inference_time_ms: number | null;
  created_at: string;
  // v2 fields - null on v1 rows. When data_source is set, don't assume
  // co2_emission_tonnes_per_year is present - it's null for "cnn_proxy"/
  // "unavailable" (no direct CO2 measurement for that location).
  data_source: "oco3_estimated" | "cnn_proxy" | "unavailable" | null;
  detection_confidence: number | null;
  co2_ppm_enhancement: number | null;
  co2_estimate_low: number | null;
  co2_estimate_high: number | null;
  // True only when co2_emission_tonnes_per_year came from the research
  // repo's CEA-ground-truth-corrected estimate, not this platform's own
  // placeholder mass-balance formula. Null on v1 rows and on v2 rows
  // where data_source isn't "oco3_estimated".
  ground_truth_validated: boolean | null;
  model_version: string | null;
  image_filename: string | null;
}

export interface PredictionListOut {
  items: PredictionOut[];
  total: number;
  page: number;
  page_size: number;
}
