/** Mirrors backend/app/schemas/report.py + model.py — keep in sync. */

export interface ReportComment {
  id: string;
  author: string;
  avatar_url?: string;
  content: string;
  created_at: string;
  replies?: ReportComment[];
}

export interface ReportVersion {
  version: string;
  created_at: string;
  created_by: string;
  description: string;
}

export interface ReportOut {
  id: string;
  title: string;
  dataset_name: string;
  satellite_source: string;
  acquisition_date: string;
  prediction_date: string;
  model_used: string;
  confidence_score: number;
  estimated_co2: number;
  detected_facilities: number;
  processing_time: string;
  region: string;
  hotspots: { lat: number; lon: number; value: number }[];
  is_favorite: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  downloads_count: number;
  shares_count: number;
  size_mb: number;
  format: "pdf" | "csv" | "geojson" | "xlsx" | "json";
  summary: string;
  comments: ReportComment[];
  versions: ReportVersion[];
  created_at: string;
  url: string | null;
}

export interface MLModelOut {
  id: string;
  name: string;
  version: string;
  architecture: string | null;
  accuracy: number | null;
  precision_score: number | null;
  recall: number | null;
  f1_score: number | null;
  is_active: boolean;
  trained_at: string | null;
  created_at: string;
}
