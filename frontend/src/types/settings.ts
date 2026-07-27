export interface SessionOut {
  id: string;
  device_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  last_used_at: string | null;
  is_current: boolean;
}

export interface PreferencesOut {
  theme: "dark" | "light" | "system";
  accent_color: "blue" | "purple" | "green";
  reduced_motion: boolean;
  compact_mode: boolean;
  ai_default_model: string;
  heatmap_palette: "viridis" | "inferno" | "plasma" | "turbo";
  confidence_threshold: number;
  prediction_units: "t_per_year" | "kg_per_day";
  auto_run_after_upload: boolean;
  xai_enabled: boolean;
  notify_prediction_completed: boolean;
  notify_upload_finished: boolean;
  notify_report_generated: boolean;
  notify_weekly_summary: boolean;
  notify_announcements: boolean;
  notify_research_updates: boolean;
  notify_email_enabled: boolean;
  notify_browser_enabled: boolean;
}

export type PreferencesUpdate = PreferencesOut;

export interface AvatarOut {
  avatar_url: string;
}

export interface TwoFactorSetupOut {
  otpauth_uri: string;
  qr_code_base64: string;
}

export interface TwoFactorEnableOut {
  backup_codes: string[];
}

export interface GoogleStatusOut {
  configured: boolean;
  connected: boolean;
  google_email: string | null;
}

export interface GoogleAuthorizeOut {
  authorize_url: string;
}

export interface SystemStatusOut {
  api: string;
  ml_service: string;
  api_version: string;
  platform_version: string;
  inference_backend: string;
}
