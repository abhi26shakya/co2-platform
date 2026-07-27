"use client";

/* eslint-disable @next/next/no-img-element */
import { Modal, errorMessageFor } from "@/features/settings/components/shared";
import { useEnable2FA, useSetup2FA } from "@/features/settings/hooks/use-2fa";
import { useEffect, useState } from "react";

export function TwoFactorSetupModal({
  onClose,
  onEnabled,
}: {
  onClose: () => void;
  onEnabled: (backupCodes: string[]) => void;
}) {
  const setup = useSetup2FA();
  const enable = useEnable2FA();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setup.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await enable.mutateAsync(code.trim());
      onEnabled(result.backup_codes);
    } catch (err) {
      setError(errorMessageFor(err, "Invalid verification code."));
    }
  };

  return (
    <Modal title="Set up Two-Factor Authentication" onClose={onClose}>
      {setup.isPending && <p className="text-sm text-ground-400">Generating your secret…</p>}
      {setup.isError && (
        <p className="text-sm text-alert">{errorMessageFor(setup.error, "Could not start 2FA setup.")}</p>
      )}
      {setup.data && (
        <form onSubmit={handleConfirm} className="space-y-4">
          <p className="text-sm text-ground-400">
            Scan this QR code with an authenticator app (Google Authenticator, 1Password, Authy),
            then enter the 6-digit code it shows.
          </p>
          <div className="flex justify-center">
            <img
              src={`data:image/png;base64,${setup.data.qr_code_base64}`}
              alt="2FA QR code"
              className="h-40 w-40 rounded-lg border border-ground-700 bg-white p-2"
            />
          </div>
          <details className="text-xs text-ground-400">
            <summary className="cursor-pointer">Can&apos;t scan? Enter manually</summary>
            <code className="mt-1 block break-all rounded bg-ground-800 p-2">{setup.data.otpauth_uri}</code>
          </details>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ground-400">Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-center text-lg tracking-[0.5em] text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
            />
          </div>
          {error && <p className="text-sm text-alert">{error}</p>}
          <button
            type="submit"
            disabled={enable.isPending || code.length !== 6}
            className="w-full rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {enable.isPending ? "Verifying…" : "Verify & Enable"}
          </button>
        </form>
      )}
    </Modal>
  );
}

export function BackupCodesModal({ codes, onClose }: { codes: string[]; onClose: () => void }) {
  return (
    <Modal title="Save your backup codes" onClose={onClose}>
      <p className="text-sm text-ground-400">
        Store these codes somewhere safe. Each can be used once to sign in if you lose access to
        your authenticator app. They will not be shown again.
      </p>
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-ground-700 bg-ground-800/60 p-4 font-mono text-sm">
        {codes.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2 text-sm font-medium transition-colors cursor-pointer"
      >
        I&apos;ve saved these codes
      </button>
    </Modal>
  );
}
