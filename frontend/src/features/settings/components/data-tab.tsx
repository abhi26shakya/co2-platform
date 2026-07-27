"use client";

import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { useReports } from "@/features/reports/hooks/use-reports";
import { Banner, Modal, errorMessageFor, useBanner } from "@/features/settings/components/shared";
import { useExportData } from "@/features/settings/hooks/use-data-export";
import { useDeleteAccount } from "@/features/settings/hooks/use-security";
import type { RecentUpload } from "@/types/dashboard";
import { Brain, Database, Download, FileText, RefreshCw, Satellite, Trash2 } from "lucide-react";
import { useState } from "react";

export function DataTab() {
  const { data: dashboardData } = useDashboard();
  const { data: reportsData } = useReports();
  const { banner, notify } = useBanner();
  const exportData = useExportData();
  const deleteAccount = useDeleteAccount();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const totalUploadedBytes =
    dashboardData?.recent_uploads.reduce((acc: number, u: RecentUpload) => acc + u.size_bytes, 0) ?? 0;
  const storageMB = (totalUploadedBytes / (1024 * 1024)).toFixed(1);

  const handleExport = async () => {
    try {
      await exportData.mutateAsync();
      notify("Your data export has been downloaded.");
    } catch (err) {
      notify(errorMessageFor(err, "Failed to export data."), true);
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    notify("Client local storage cleared. Reloading page...");
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    try {
      await deleteAccount.mutateAsync({ current_password: deletePassword });
    } catch (err) {
      setDeleteError(errorMessageFor(err, "Could not delete account. Check your password."));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h2 className="text-lg font-medium text-instrument">Storage & Data Management</h2>
        <p className="text-sm text-ground-400">
          Monitor usage thresholds, export datasets, or purge local files.
        </p>
      </div>

      {banner && <Banner message={banner.message} isError={banner.isError} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40">
          <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Storage Used</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="readout text-xl font-bold text-instrument">{storageMB} MB</span>
            <span className="readout text-xs text-ground-400">/ 20 GB limit</span>
          </div>
          <div className="mt-2.5 w-full h-1 bg-ground-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sensor animate-all duration-300"
              style={{ width: `${Math.min(100, (Number(storageMB) / 20000) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Uploaded Images</p>
            <p className="readout mt-1 text-2xl font-semibold text-instrument">
              {dashboardData?.processed_images ?? 0}
            </p>
          </div>
          <Satellite className="h-8 w-8 text-ground-400/20" />
        </div>

        <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Predictions Run</p>
            <p className="readout mt-1 text-2xl font-semibold text-instrument">
              {dashboardData?.total_predictions ?? 0}
            </p>
          </div>
          <Brain className="h-8 w-8 text-ground-400/20" />
        </div>

        <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Reports Created</p>
            <p className="readout mt-1 text-2xl font-semibold text-instrument">{reportsData?.length ?? 0}</p>
          </div>
          <FileText className="h-8 w-8 text-ground-400/20" />
        </div>
      </div>

      <hr className="border-ground-700/60" />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Account Data Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExport}
            disabled={exportData.isPending}
            className="flex items-center gap-2 rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2.5 text-xs text-ground-400 hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> {exportData.isPending ? "Exporting…" : "Export My Data"}
          </button>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2.5 text-xs text-ground-400 hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Clear Local Cache
          </button>
        </div>
      </div>

      <div className="mt-8 p-5 border border-alert/30 rounded-xl bg-alert/5 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-alert flex items-center gap-2">
            <Database className="h-4 w-4" /> Danger Zone
          </h3>
          <p className="mt-1 text-xs text-ground-400">
            Permanently deactivate your account. Your profile is anonymized and you will be signed
            out of every device.
          </p>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 rounded-lg bg-alert hover:bg-alert/90 text-white px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <Modal title="Delete Account" onClose={() => setShowDeleteModal(false)}>
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <p className="text-sm text-ground-400 leading-relaxed">
              Are you absolutely sure you want to delete your Emissia account? Enter your password
              to confirm. This action signs you out of every device.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs text-ground-400">Current Password</label>
              <input
                type="password"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
              />
            </div>
            {deleteError && <p className="text-sm text-alert">{deleteError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-sm text-ground-400 hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={deleteAccount.isPending}
                className="rounded-lg bg-alert hover:bg-alert/90 text-white px-4 py-2 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleteAccount.isPending ? "Deleting…" : "Delete Account"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
