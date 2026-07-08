/** Mirrors backend/app/schemas/image.py — keep in sync. */

export interface ImageOut {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  bounds: [number, number, number, number] | null;
  crs: string | null;
  source: string;
  plant_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
  url: string | null;
  preview_url: string | null;
}

export interface ImageListOut {
  items: ImageOut[];
  total: number;
  page: number;
  page_size: number;
}
