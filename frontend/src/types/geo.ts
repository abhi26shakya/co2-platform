/** Mirrors backend/app/schemas/geo.py — keep in sync. */

export interface PlantOut {
  id: string;
  name: string;
  country: string;
  fuel_type: string;
  capacity_mw: number | null;
  lat: number;
  lon: number;
  // --- CO2 enhancement results ---
  co2_enhancement_ppm?: number | null;
  co2_bg_std_ppm?: number | null;
  co2_no2_peak_km?: number | null;
  co2_soundings?: number | null;
  co2_wind_diff_deg?: number | null;
}

export interface MapHotspot {
  lat: number;
  lon: number;
  intensity: number;
  radius_m: number;
  emission_tonnes_per_year: number | null;
  image_filename: string;
  predicted_at: string;
}

export interface TimeseriesPoint {
  month: string;
  avg_emission: number;
  total_emission: number;
  prediction_count: number;
}

export interface DistributionBucket {
  lo: number;
  hi: number;
  count: number;
}

export interface AnalyticsOut {
  timeseries: TimeseriesPoint[];
  distribution: DistributionBucket[];
  sources: { source: string; count: number }[];
  total_predictions: number;
  max_emission: number | null;
  avg_confidence: number | null;
}
