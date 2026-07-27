export interface UserRead {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  organization: string | null;
  job_title: string | null;
  country: string | null;
  bio: string | null;
  avatar_url: string | null;
  totp_enabled: boolean;
  google_connected: boolean;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface LoginResult {
  access_token: string | null;
  refresh_token: string | null;
  token_type: "bearer";
  mfa_required: boolean;
  mfa_token: string | null;
}
