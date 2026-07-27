"use client";

import { useUser } from "@/features/auth/hooks/use-auth";
import { Banner, Modal, errorMessageFor, useBanner } from "@/features/settings/components/shared";
import {
  BackupCodesModal,
  TwoFactorSetupModal,
} from "@/features/settings/components/two-factor-setup-modal";
import { useDisable2FA } from "@/features/settings/hooks/use-2fa";
import { useGoogleConnect, useGoogleDisconnect, useGoogleStatus } from "@/features/settings/hooks/use-oauth";
import { useChangePassword } from "@/features/settings/hooks/use-security";
import {
  useRevokeOtherSessions,
  useRevokeSession,
  useSessions,
} from "@/features/settings/hooks/use-sessions";
import { CheckCircle, KeyRound, Laptop, LogOut } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AccountTab() {
  const { data: user } = useUser();
  const { banner, notify } = useBanner();
  const searchParams = useSearchParams();

  // Password change
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      notify("New password must be at least 8 characters.", true);
      return;
    }
    if (newPassword !== confirmPassword) {
      notify("New passwords do not match.", true);
      return;
    }
    try {
      await changePassword.mutateAsync({ current_password: currentPassword, new_password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      notify("Password updated. Other devices have been signed out.");
    } catch (err) {
      notify(errorMessageFor(err, "Failed to update password."), true);
    }
  };

  // 2FA
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showDisable2FA, setShowDisable2FA] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const disable2FA = useDisable2FA();
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await disable2FA.mutateAsync({ current_password: disablePassword, code: disableCode });
      setShowDisable2FA(false);
      setDisablePassword("");
      setDisableCode("");
      notify("Two-factor authentication disabled.");
    } catch (err) {
      notify(errorMessageFor(err, "Could not disable 2FA."), true);
    }
  };

  // Google OAuth
  const googleStatus = useGoogleStatus();
  const googleConnect = useGoogleConnect();
  const googleDisconnect = useGoogleDisconnect();

  useEffect(() => {
    const google = searchParams.get("google");
    if (google === "connected") notify("Google account linked.");
    if (google === "error") notify("Could not link your Google account.", true);
    if (google) {
      const url = new URL(window.location.href);
      url.searchParams.delete("google");
      window.history.replaceState({}, "", url.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleDisconnect = async () => {
    try {
      await googleDisconnect.mutateAsync();
      notify("Google account unlinked.");
    } catch (err) {
      notify(errorMessageFor(err), true);
    }
  };

  // Sessions
  const { data: sessions } = useSessions();
  const revokeSession = useRevokeSession();
  const revokeOthers = useRevokeOtherSessions();

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div>
        <h2 className="text-lg font-medium text-instrument">Account &amp; Security</h2>
        <p className="text-sm text-ground-400">
          Manage your credentials, 2-factor authentication, and active sessions.
        </p>
      </div>

      {banner && <Banner message={banner.message} isError={banner.isError} />}

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider flex items-center gap-2">
          <KeyRound className="h-4 w-4" /> Change Password
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs text-ground-400">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-ground-400">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-ground-400">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-xs hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer disabled:opacity-50"
        >
          {changePassword.isPending ? "Updating…" : "Update Password"}
        </button>
      </form>

      <hr className="border-ground-700/60" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-instrument">Two-Factor Authentication</h3>
          <p className="mt-1 text-xs text-ground-400">
            Add an extra layer of security to your account with a verification code.
          </p>
        </div>
        {user?.totp_enabled ? (
          <button
            type="button"
            onClick={() => setShowDisable2FA(true)}
            className="rounded-lg border border-alert/30 bg-alert/5 text-alert px-3 py-1.5 text-xs hover:bg-alert/10 transition-colors cursor-pointer"
          >
            Disable
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShow2FASetup(true)}
            className="rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-1.5 text-xs hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer"
          >
            Enable
          </button>
        )}
      </div>

      <hr className="border-ground-700/60" />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Connected Accounts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40">
            <div className="text-sm">
              <p className="font-medium text-instrument">Google</p>
              <p className="text-xs text-ground-400">
                {googleStatus.data?.google_email || "Link your Google account."}
              </p>
            </div>
            {googleStatus.data?.connected ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-sensor bg-sensor/5 border border-sensor/20 px-2 py-0.5 rounded-full font-mono">
                  <CheckCircle className="h-3 w-3" /> Connected
                </span>
                <button
                  onClick={handleGoogleDisconnect}
                  disabled={googleDisconnect.isPending}
                  className="text-xs text-alert hover:underline cursor-pointer disabled:opacity-50"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => googleConnect.mutate()}
                disabled={!googleStatus.data?.configured || googleConnect.isPending}
                title={!googleStatus.data?.configured ? "Not configured on this deployment" : undefined}
                className="rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-1.5 text-xs hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 opacity-70">
            <div className="text-sm">
              <p className="font-medium text-instrument">GitHub</p>
              <p className="text-xs text-ground-400">Sign in using your GitHub account.</p>
            </div>
            <span className="readout text-[10px] uppercase font-bold text-ground-400 bg-ground-800 border border-ground-700 px-2.5 py-1 rounded-full shrink-0">
              Coming Soon
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 opacity-70">
            <div className="text-sm">
              <p className="font-medium text-instrument">ORCID</p>
              <p className="text-xs text-ground-400">Link your researcher portfolio database identifier.</p>
            </div>
            <span className="readout text-[10px] uppercase font-bold text-ground-400 bg-ground-800 border border-ground-700 px-2.5 py-1 rounded-full shrink-0">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      <hr className="border-ground-700/60" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Sessions</h3>
          {(sessions?.length ?? 0) > 1 && (
            <button
              onClick={() => revokeOthers.mutate()}
              disabled={revokeOthers.isPending}
              className="flex items-center gap-1.5 rounded-lg border border-alert/20 bg-alert/5 text-alert hover:bg-alert/10 px-3 py-1.5 text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-3 w-3" /> Log out other devices
            </button>
          )}
        </div>
        <div className="space-y-2">
          {(sessions ?? []).map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl border border-ground-700 bg-ground-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <Laptop className="h-5 w-5 text-sensor mt-0.5 shrink-0" />
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-instrument">{s.device_name || "Unknown device"}</p>
                    {s.is_current && (
                      <span className="readout text-[9px] uppercase font-bold text-sensor bg-sensor/5 border border-sensor/20 px-1.5 py-0.2 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ground-400">
                    {s.ip_address ? `IP: ${s.ip_address}` : "IP unknown"}
                    {s.last_used_at ? ` · ${new Date(s.last_used_at).toLocaleString()}` : ""}
                  </p>
                </div>
              </div>
              {!s.is_current && (
                <button
                  onClick={() => revokeSession.mutate(s.id)}
                  disabled={revokeSession.isPending}
                  className="text-xs text-alert hover:underline cursor-pointer disabled:opacity-50 self-start md:self-auto"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {show2FASetup && (
        <TwoFactorSetupModal
          onClose={() => setShow2FASetup(false)}
          onEnabled={(codes) => {
            setShow2FASetup(false);
            setBackupCodes(codes);
            notify("Two-factor authentication enabled.");
          }}
        />
      )}

      {backupCodes && <BackupCodesModal codes={backupCodes} onClose={() => setBackupCodes(null)} />}

      {showDisable2FA && (
        <Modal title="Disable Two-Factor Authentication" onClose={() => setShowDisable2FA(false)}>
          <form onSubmit={handleDisable2FA} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-ground-400">Current Password</label>
              <input
                type="password"
                required
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-ground-400">Verification code or backup code</label>
              <input
                type="text"
                required
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
                className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
              />
            </div>
            <button
              type="submit"
              disabled={disable2FA.isPending}
              className="w-full rounded-lg bg-alert hover:bg-alert/90 text-white px-4 py-2 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {disable2FA.isPending ? "Disabling…" : "Disable 2FA"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
