"use client";

/* eslint-disable @next/next/no-img-element */
import { useUser } from "@/features/auth/hooks/use-auth";
import {
  useDeleteAvatar,
  useUpdateProfileDetails,
  useUploadAvatar,
} from "@/features/settings/hooks/use-profile";
import { Banner, errorMessageFor, useBanner } from "@/features/settings/components/shared";
import { useState } from "react";

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export function ProfileTab() {
  const { data: user } = useUser();
  const updateProfile = useUpdateProfileDetails();
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();
  const { banner, notify } = useBanner();

  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");

  const [syncedUserId, setSyncedUserId] = useState(user?.id);
  if (user && user.id !== syncedUserId) {
    setSyncedUserId(user.id);
    setFullName(user.full_name || "");
    setOrganization(user.organization || "");
    setJobTitle(user.job_title || "");
    setCountry(user.country || "");
    setBio(user.bio || "");
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > AVATAR_MAX_BYTES) {
      notify("Profile photo exceeds 5MB limit.", true);
      return;
    }
    try {
      await uploadAvatar.mutateAsync(file);
      notify("Profile photo uploaded successfully.");
    } catch (err) {
      notify(errorMessageFor(err, "Failed to upload avatar."), true);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await deleteAvatar.mutateAsync();
      notify("Profile photo removed.");
    } catch (err) {
      notify(errorMessageFor(err), true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      notify("Full Name cannot be empty.", true);
      return;
    }
    try {
      await updateProfile.mutateAsync({
        full_name: fullName.trim(),
        organization: organization.trim(),
        job_title: jobTitle.trim(),
        country: country.trim(),
        bio: bio.trim(),
      });
      notify("Profile details updated successfully.");
    } catch (err) {
      notify(errorMessageFor(err, "Failed to update profile details."), true);
    }
  };

  const isSaving = updateProfile.isPending;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in-50">
      <div>
        <h2 className="text-lg font-medium text-instrument">Profile</h2>
        <p className="text-sm text-ground-400">
          Manage your personal information and organization details.
        </p>
      </div>

      {banner && <Banner message={banner.message} isError={banner.isError} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-ground-800 border border-ground-700 flex items-center justify-center text-ground-400 font-medium text-lg overflow-hidden relative">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : fullName ? (
              fullName
                .split(" ")
                .map((w) => w[0])
                .join("")
            ) : (
              "U"
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-xs hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer block text-center font-medium">
              {uploadAvatar.isPending ? "Uploading…" : "Upload new photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={uploadAvatar.isPending}
                onChange={handleAvatarChange}
              />
            </label>
            {user?.avatar_url && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={deleteAvatar.isPending}
                className="text-xs text-alert hover:underline cursor-pointer disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <p className="sm:col-span-2 -mt-4 text-[11px] text-ground-400">PNG, JPEG, or WEBP. Max 5MB.</p>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ground-400">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ground-400">Email Address (Read-Only)</label>
          <input
            type="email"
            disabled
            value={user?.email ?? ""}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/30 px-3 py-2 text-sm text-ground-400 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ground-400">Organization</label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ground-400">Role / Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-ground-400">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-ground-400">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30 resize-none"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-ground-700 flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
