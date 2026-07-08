/** Mirrors backend/app/schemas/dashboard.py — keep in sync. */

export interface RecentUpload {
  id: string;
  filename: string;
  source: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
}

export interface DashboardStats {
  processed_images: number;
  total_predictions: number;
  avg_emission_tonnes_per_year: number | null;
  avg_confidence: number | null;
  recent_uploads: RecentUpload[];
  active_model_version: string | null;
  ml_service_status: "ok" | "unreachable";
}
