import { api } from "@/services/api-client";
import type { UserRead } from "@/types/auth";
import type {
  AvatarOut,
  GoogleAuthorizeOut,
  GoogleStatusOut,
  PreferencesOut,
  PreferencesUpdate,
  SessionOut,
  SystemStatusOut,
  TwoFactorEnableOut,
  TwoFactorSetupOut,
} from "@/types/settings";

export const settingsApi = {
  updateProfile: (data: {
    full_name?: string;
    organization?: string;
    job_title?: string;
    country?: string;
    bio?: string;
  }) => api.patch<UserRead>("/auth/me", data),

  uploadAvatar: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.postForm<AvatarOut>("/settings/avatar", form);
  },
  deleteAvatar: () => api.delete<UserRead>("/settings/avatar"),

  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post<void>("/auth/change-password", data),
  deleteAccount: (data: { current_password: string }) =>
    api.post<void>("/settings/account/delete", data),

  listSessions: () => api.get<SessionOut[]>("/settings/sessions"),
  revokeSession: (id: string) => api.delete<void>(`/settings/sessions/${id}`),
  revokeOtherSessions: () => api.delete<void>("/settings/sessions"),

  setup2FA: () => api.post<TwoFactorSetupOut>("/auth/2fa/setup"),
  enable2FA: (code: string) => api.post<TwoFactorEnableOut>("/auth/2fa/enable", { code }),
  disable2FA: (data: { current_password: string; code: string }) =>
    api.post<void>("/auth/2fa/disable", data),

  googleStatus: () => api.get<GoogleStatusOut>("/auth/oauth/google/status"),
  googleConnect: () => api.get<GoogleAuthorizeOut>("/auth/oauth/google/connect"),
  googleDisconnect: () => api.delete<UserRead>("/auth/oauth/google"),

  getPreferences: () => api.get<PreferencesOut>("/settings/preferences"),
  putPreferences: (data: PreferencesUpdate) => api.put<PreferencesOut>("/settings/preferences", data),

  exportData: () => api.get<Record<string, unknown>>("/settings/export"),

  systemStatus: () => api.get<SystemStatusOut>("/system/status"),
};
