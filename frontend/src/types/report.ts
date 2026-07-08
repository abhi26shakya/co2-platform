/** Mirrors backend/app/schemas/report.py + model.py — keep in sync. */

export interface ReportOut {
  id: string;
  title: string;
  format: "pdf" | "csv";
  params: Record<string, unknown>;
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
