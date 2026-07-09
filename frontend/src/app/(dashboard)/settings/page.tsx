"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useUser, useUpdateProfile, useLogout } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";
import { useReports } from "@/hooks/use-reports";
import { useSettings } from "@/components/providers/settings-provider";
import { cn } from "@/lib/utils";
import {
  User,
  Shield,
  Bell,
  Database,
  Brain,
  Palette,
  Info,
  KeyRound,
  LogOut,
  Trash2,
  RefreshCw,
  Sliders,
  Download,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Laptop,
  Satellite,
  FileText,
  BookOpen,
  Code,
  ChevronRight,
} from "lucide-react";

// Toggle component matching existing dashboard design system
function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-sensor/50",
        checked ? "bg-sensor" : "bg-ground-700",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-ground-950 shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { data: user } = useUser();
  const updateProfile = useUpdateProfile();
  const logout = useLogout();

  const { data: dashboardData } = useDashboard();
  const { data: reportsData } = useReports();

  const {
    theme, updateTheme,
    accent, updateAccent,
    reducedMotion, updateReducedMotion,
    compactMode, updateCompactMode,
    aiModel, updateAiModel,
    aiThreshold, updateAiThreshold,
    aiPalette, updateAiPalette,
    aiUnits, updateAiUnits,
    aiAutorun, updateAiAutorun,
    aiExplainable, updateAiExplainable,
  } = useSettings();

  const [activeTab, setActiveTab] = useState("profile");
  
  // UI Status Banners/Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Password Update States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Account & Connected Accounts States
  const [tfa, setTfa] = useState(false);
  const [connectedGoogle, setConnectedGoogle] = useState(true);
  const [connectedGithub, setConnectedGithub] = useState(false);

  // Notification States
  const [notiPred, setNotiPred] = useState(true);
  const [notiUpload, setNotiUpload] = useState(true);
  const [notiReport, setNotiReport] = useState(false);
  const [notiWeekly, setNotiWeekly] = useState(true);
  const [notiAnnounce, setNotiAnnounce] = useState(false);
  const [notiResearch, setNotiResearch] = useState(true);
  const [notiEmail, setNotiEmail] = useState(true);
  const [notiBrowser, setNotiBrowser] = useState(true);

  // AI Preferences local states (so user clicks Save to apply)
  const [localAiModel, setLocalAiModel] = useState("unet-v1");
  const [localAiThreshold, setLocalAiThreshold] = useState(85);
  const [localAiPalette, setLocalAiPalette] = useState("viridis");
  const [localAiUnits, setLocalAiUnits] = useState("t/year");
  const [localAiAutorun, setLocalAiAutorun] = useState(true);
  const [localAiExplainable, setLocalAiExplainable] = useState(false);

  // Dirty tracking for unsaved change prompts
  const [isDirty, setIsDirty] = useState(false);

  // Delete Confirm Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Initial Load of Saved Settings from LocalStorage & Context
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrg(localStorage.getItem("settings_profile_org") || "Climate Policy Initiative");
      setRole(localStorage.getItem("settings_profile_role") || "Lead Climate Researcher");
      setCountry(localStorage.getItem("settings_profile_country") || "India");
      setBio(localStorage.getItem("settings_profile_bio") || "Conducting space-based carbon analysis for industrial power plant emission compliance.");
      setAvatarPreview(localStorage.getItem("settings_profile_avatar") || null);

      setTfa(localStorage.getItem("settings_security_2fa") === "true");
      setConnectedGoogle(localStorage.getItem("settings_connected_google") !== "false");
      setConnectedGithub(localStorage.getItem("settings_connected_github") === "true");

      setNotiPred(localStorage.getItem("settings_noti_pred") !== "false");
      setNotiUpload(localStorage.getItem("settings_noti_upload") !== "false");
      setNotiReport(localStorage.getItem("settings_noti_report") === "true");
      setNotiWeekly(localStorage.getItem("settings_noti_weekly") !== "false");
      setNotiAnnounce(localStorage.getItem("settings_noti_announce") === "true");
      setNotiResearch(localStorage.getItem("settings_noti_research") !== "false");
      setNotiEmail(localStorage.getItem("settings_noti_email") !== "false");
      setNotiBrowser(localStorage.getItem("settings_noti_browser") !== "false");
    }
  }, []);

  // Initialize profile values from user model
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Sync AI local states with Context changes
  useEffect(() => {
    setLocalAiModel(aiModel);
    setLocalAiThreshold(aiThreshold);
    setLocalAiPalette(aiPalette);
    setLocalAiUnits(aiUnits);
    setLocalAiAutorun(aiAutorun);
    setLocalAiExplainable(aiExplainable);
  }, [aiModel, aiThreshold, aiPalette, aiUnits, aiAutorun, aiExplainable]);

  // Prompt user on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Helper to show banners
  const triggerNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 5000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  // Mock Avatar Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerNotification("Profile photo exceeds 2MB limit.", true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        setAvatarPreview(base64Str);
        localStorage.setItem("settings_profile_avatar", base64Str);
        setIsDirty(true);
        triggerNotification("Profile photo uploaded successfully.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      triggerNotification("Full Name cannot be empty.", true);
      return;
    }

    setIsSaving(true);
    try {
      // Save name to database
      await updateProfile.mutateAsync({ full_name: fullName });

      // Save others to localStorage
      localStorage.setItem("settings_profile_org", org);
      localStorage.setItem("settings_profile_role", role);
      localStorage.setItem("settings_profile_country", country);
      localStorage.setItem("settings_profile_bio", bio);

      setIsDirty(false);
      triggerNotification("Profile details updated successfully.");
    } catch {
      triggerNotification("Failed to update profile details in database.", true);
    } finally {
      setIsSaving(false);
    }
  };

  // Revert unsaved profile changes
  const handleCancelProfile = () => {
    if (user) {
      setFullName(user.full_name || "");
    }
    setOrg(localStorage.getItem("settings_profile_org") || "Climate Policy Initiative");
    setRole(localStorage.getItem("settings_profile_role") || "Lead Climate Researcher");
    setCountry(localStorage.getItem("settings_profile_country") || "India");
    setBio(localStorage.getItem("settings_profile_bio") || "Conducting space-based carbon analysis for industrial power plant emission compliance.");
    setAvatarPreview(localStorage.getItem("settings_profile_avatar") || null);
    setIsDirty(false);
    triggerNotification("Unsaved changes reverted.");
  };

  // Change Password Action
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerNotification("Please fill in all password fields.", true);
      return;
    }
    if (newPassword.length < 8) {
      triggerNotification("New password must be at least 8 characters.", true);
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerNotification("New passwords do not match.", true);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsDirty(false);
      triggerNotification("Password updated successfully.");
    }, 1000);
  };

  // TFA Toggle
  const handleToggle2FA = () => {
    const nextVal = !tfa;
    setTfa(nextVal);
    localStorage.setItem("settings_security_2fa", String(nextVal));
    triggerNotification(nextVal ? "Two-Factor Authentication activated." : "Two-Factor Authentication deactivated.");
  };

  const handleToggleGoogle = () => {
    const nextVal = !connectedGoogle;
    setConnectedGoogle(nextVal);
    localStorage.setItem("settings_connected_google", String(nextVal));
    triggerNotification(nextVal ? "Google account linked." : "Google account unlinked.");
  };

  const handleToggleGithub = () => {
    const nextVal = !connectedGithub;
    setConnectedGithub(nextVal);
    localStorage.setItem("settings_connected_github", String(nextVal));
    triggerNotification(nextVal ? "GitHub account linked." : "GitHub account unlinked.");
  };

  // Save AI preferences from form states
  const handleSaveAIPreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateAiModel(localAiModel);
      updateAiThreshold(localAiThreshold);
      updateAiPalette(localAiPalette);
      updateAiUnits(localAiUnits);
      updateAiAutorun(localAiAutorun);
      updateAiExplainable(localAiExplainable);

      setIsSaving(false);
      setIsDirty(false);
      triggerNotification("AI modeling configurations saved.");
    }, 800);
  };

  const resetAIDefaultsAction = () => {
    setLocalAiModel("unet-v1");
    setLocalAiThreshold(85);
    setLocalAiPalette("viridis");
    setLocalAiUnits("t/year");
    setLocalAiAutorun(true);
    setLocalAiExplainable(false);

    updateAiModel("unet-v1");
    updateAiThreshold(85);
    updateAiPalette("viridis");
    updateAiUnits("t/year");
    updateAiAutorun(true);
    updateAiExplainable(false);

    setIsDirty(false);
    triggerNotification("AI preferences reset to factory defaults.");
  };

  // Data Actions
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        user: { fullName, email, org, role, country, bio },
        settings: {
          tfa,
          notiPred, notiUpload, notiReport, notiWeekly, notiAnnounce, notiResearch, notiEmail, notiBrowser,
          aiModel, aiThreshold, aiPalette, aiUnits, aiAutorun, aiExplainable,
          theme, accent, reducedMotion, compactMode
        }
      }, null, 2)
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `emissia_settings_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification("Settings data exported successfully as JSON.");
  };

  const handleClearCache = () => {
    localStorage.clear();
    triggerNotification("Client local storage cleared. Reloading page...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    triggerNotification("Account scheduled for deletion. Logging out...");
    setTimeout(() => {
      logout.mutate();
    }, 2000);
  };

  // Convert raw recent uploads size
  const totalUploadedBytes = dashboardData?.recent_uploads.reduce((acc, u) => acc + u.size_bytes, 0) ?? 0;
  const storageMB = (totalUploadedBytes / (1024 * 1024)).toFixed(1);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "data", label: "Data & Storage", icon: Database },
    { id: "ai", label: "AI Preferences", icon: Brain },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Dynamic Alerts Banner */}
      {successMessage && (
        <div className="rounded-xl border border-sensor/20 bg-sensor/5 px-4 py-3 text-sm text-sensor flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-4">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl border border-alert/20 bg-alert/5 px-4 py-3 text-sm text-alert flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-4">
          <Trash2 className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isDirty && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400 flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-4">
          <Sliders className="h-4 w-4 shrink-0" />
          <span>You have unsaved changes. Please save or cancel them before exiting.</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="mt-1 text-sm text-ground-400">
          Configure your Emissia account, preferences, and modeling thresholds.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Navigation Tabs */}
        <aside className="w-full lg:w-56 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0 scrollbar-none border-b border-ground-700/40 lg:border-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isDirty) {
                    const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to switch tabs?");
                    if (!confirmLeave) return;
                    setIsDirty(false);
                  }
                  setActiveTab(tab.id);
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer",
                  active
                    ? "bg-ground-800 text-instrument border border-ground-700/60"
                    : "text-ground-400 hover:bg-ground-800/40 hover:text-instrument"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Right Column: Settings Form Panels */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          <Card className="p-6 transition-all duration-300">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in-50">
                <div>
                  <h2 className="text-lg font-medium text-instrument">Profile</h2>
                  <p className="text-sm text-ground-400">
                    Manage your personal information and organization details.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Avatar section */}
                  <div className="sm:col-span-2 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-ground-800 border border-ground-700 flex items-center justify-center text-ground-400 font-medium text-lg overflow-hidden relative">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
                      ) : fullName ? (
                        fullName.split(" ").map(w => w[0]).join("")
                      ) : "U"}
                    </div>
                    <div>
                      <label className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-xs hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer block text-center font-medium">
                        Upload new photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                      <p className="mt-1 text-[11px] text-ground-400">JPG or PNG. Max 2MB.</p>
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div className="sm:col-span-2 p-4 rounded-xl border border-ground-700 bg-ground-900/40">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-ground-400">Profile Completion</span>
                      <span className="readout font-bold text-sensor">85%</span>
                    </div>
                    <div className="mt-2 w-full h-1.5 bg-ground-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sensor" style={{ width: "85%" }} />
                    </div>
                  </div>

                  {/* Current Plan */}
                  <div className="sm:col-span-2 p-4 rounded-xl border border-ground-700 bg-ground-900/40 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Current Plan</p>
                      <h4 className="mt-0.5 text-sm font-medium text-instrument">Free Research Plan</h4>
                    </div>
                    <span className="readout shrink-0 rounded-full border border-sensor/20 bg-sensor/5 px-2.5 py-1 text-[10px] uppercase font-bold text-sensor">
                      Upgrade (Soon)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-ground-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-ground-400">Email Address (Read-Only)</label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/30 px-3 py-2 text-sm text-ground-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-ground-400">Organization</label>
                    <input
                      type="text"
                      value={org}
                      onChange={(e) => {
                        setOrg(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-ground-400">Role</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-ground-400">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-ground-400">Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => {
                        setBio(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30 resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-ground-700 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleCancelProfile}
                    className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-sm text-ground-400 hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === "account" && (
              <div className="space-y-8 animate-in fade-in-50">
                <div>
                  <h2 className="text-lg font-medium text-instrument">Account & Security</h2>
                  <p className="text-sm text-ground-400">
                    Manage your credentials, 2-factor authentication, and active sessions.
                  </p>
                </div>

                {/* Change Password */}
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
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setIsDirty(true);
                        }}
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
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setIsDirty(true);
                        }}
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
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setIsDirty(true);
                        }}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-xs hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Updating…" : "Update Password"}
                  </button>
                </form>

                <hr className="border-ground-700/60" />

                {/* 2FA Toggle */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-instrument">Two-Factor Authentication</h3>
                    <p className="mt-1 text-xs text-ground-400">
                      Add an extra layer of security to your account with a verification code.
                    </p>
                  </div>
                  <Toggle checked={tfa} onChange={handleToggle2FA} />
                </div>

                <hr className="border-ground-700/60" />

                {/* Connected Accounts */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Connected Accounts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40">
                      <div className="text-sm">
                        <p className="font-medium text-instrument">Google</p>
                        <p className="text-xs text-ground-400">Sign in using your Google credentials.</p>
                      </div>
                      {connectedGoogle ? (
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-sensor bg-sensor/5 border border-sensor/20 px-2 py-0.5 rounded-full font-mono">
                            <CheckCircle className="h-3 w-3" /> Connected
                          </span>
                          <button onClick={handleToggleGoogle} className="text-xs text-alert hover:underline cursor-pointer">Disconnect</button>
                        </div>
                      ) : (
                        <button onClick={handleToggleGoogle} className="rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-1.5 text-xs hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer">Connect</button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40">
                      <div className="text-sm">
                        <p className="font-medium text-instrument">GitHub</p>
                        <p className="text-xs text-ground-400">Sign in using your GitHub account.</p>
                      </div>
                      {connectedGithub ? (
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-sensor bg-sensor/5 border border-sensor/20 px-2 py-0.5 rounded-full font-mono">
                            <CheckCircle className="h-3 w-3" /> Connected
                          </span>
                          <button onClick={handleToggleGithub} className="text-xs text-alert hover:underline cursor-pointer">Disconnect</button>
                        </div>
                      ) : (
                        <button onClick={handleToggleGithub} className="rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-1.5 text-xs hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer">Connect</button>
                      )}
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

                {/* Sessions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Sessions</h3>
                  <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Laptop className="h-5 w-5 text-sensor mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-instrument">Chrome (macOS)</p>
                          <span className="readout text-[9px] uppercase font-bold text-sensor bg-sensor/5 border border-sensor/20 px-1.5 py-0.2 rounded">Current</span>
                        </div>
                        <p className="text-xs text-ground-400">IP: 192.168.1.48 · Mumbai, India</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        triggerNotification("All active sessions logged out. Re-authenticating...");
                        setTimeout(() => {
                          logout.mutate();
                        }, 1500);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-alert/20 bg-alert/5 text-alert hover:bg-alert/10 px-4 py-2 text-xs transition-all cursor-pointer"
                    >
                      <LogOut className="h-3 w-3" /> Logout All Devices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div>
                  <h2 className="text-lg font-medium text-instrument">Notifications</h2>
                  <p className="text-sm text-ground-400">
                    Choose what actions and updates you&apos;d like to be notified about.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Platform Activities</h3>
                  <div className="divide-y divide-ground-700/60 border border-ground-700 rounded-xl bg-ground-900/20 overflow-hidden">
                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-instrument">Prediction completed</p>
                        <p className="text-xs text-ground-400">Receive alert when ML finishes estimating raster outputs.</p>
                      </div>
                      <Toggle
                        checked={notiPred}
                        onChange={() => {
                          const val = !notiPred;
                          setNotiPred(val);
                          localStorage.setItem("settings_noti_pred", String(val));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-instrument">Upload finished</p>
                        <p className="text-xs text-ground-400">Get notified when GeoTIFF raster parsing & alignment completes.</p>
                      </div>
                      <Toggle
                        checked={notiUpload}
                        onChange={() => {
                          const val = !notiUpload;
                          setNotiUpload(val);
                          localStorage.setItem("settings_noti_upload", String(val));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-instrument">Report generated</p>
                        <p className="text-xs text-ground-400">Alert when PDF reports or CSV analytics are ready for download.</p>
                      </div>
                      <Toggle
                        checked={notiReport}
                        onChange={() => {
                          const val = !notiReport;
                          setNotiReport(val);
                          localStorage.setItem("settings_noti_report", String(val));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Updates & Digests</h3>
                  <div className="divide-y divide-ground-700/60 border border-ground-700 rounded-xl bg-ground-900/20 overflow-hidden">
                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-instrument">Weekly summary</p>
                        <p className="text-xs text-ground-400">A weekly review digest of all uploaded images and predictions.</p>
                      </div>
                      <Toggle
                        checked={notiWeekly}
                        onChange={() => {
                          const val = !notiWeekly;
                          setNotiWeekly(val);
                          localStorage.setItem("settings_noti_weekly", String(val));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-instrument">Platform announcements</p>
                        <p className="text-xs text-ground-400">New system features, service statuses, or tooling enhancements.</p>
                      </div>
                      <Toggle
                        checked={notiAnnounce}
                        onChange={() => {
                          const val = !notiAnnounce;
                          setNotiAnnounce(val);
                          localStorage.setItem("settings_noti_announce", String(val));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-instrument">Research updates</p>
                        <p className="text-xs text-ground-400">Earth observation case studies and newly added models.</p>
                      </div>
                      <Toggle
                        checked={notiResearch}
                        onChange={() => {
                          const val = !notiResearch;
                          setNotiResearch(val);
                          localStorage.setItem("settings_noti_research", String(val));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Channels</h3>
                  <div className="divide-y divide-ground-700/60 border border-ground-700 rounded-xl bg-ground-900/20 overflow-hidden">
                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-instrument">Email notifications</p>
                        <p className="text-xs text-ground-400">Send digests and alerts directly to your registered inbox.</p>
                      </div>
                      <Toggle
                        checked={notiEmail}
                        onChange={() => {
                          const val = !notiEmail;
                          setNotiEmail(val);
                          localStorage.setItem("settings_noti_email", String(val));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-instrument">Browser notifications</p>
                        <p className="text-xs text-ground-400">Show floating banners inside your active browser view.</p>
                      </div>
                      <Toggle
                        checked={notiBrowser}
                        onChange={() => {
                          const val = !notiBrowser;
                          setNotiBrowser(val);
                          localStorage.setItem("settings_noti_browser", String(val));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DATA & STORAGE TAB */}
            {activeTab === "data" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div>
                  <h2 className="text-lg font-medium text-instrument">Storage & Data Management</h2>
                  <p className="text-sm text-ground-400">
                    Monitor usage thresholds, export datasets, or purge local files.
                  </p>
                </div>

                {/* Grid of Usage Metrics Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40">
                    <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Storage Used</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="readout text-xl font-bold text-instrument">{storageMB} MB</span>
                      <span className="readout text-xs text-ground-400">/ 20 GB limit</span>
                    </div>
                    <div className="mt-2.5 w-full h-1 bg-ground-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sensor animate-all duration-300" style={{ width: `${Math.min(100, (Number(storageMB) / 20000) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Uploaded Images</p>
                      <p className="readout mt-1 text-2xl font-semibold text-instrument">{dashboardData?.processed_images ?? 0}</p>
                    </div>
                    <Satellite className="h-8 w-8 text-ground-400/20" />
                  </div>

                  <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ground-400 uppercase tracking-wider font-semibold">Predictions Run</p>
                      <p className="readout mt-1 text-2xl font-semibold text-instrument">{dashboardData?.total_predictions ?? 0}</p>
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

                {/* Data Actions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Account Data Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2.5 text-xs text-ground-400 hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" /> Export My Data
                    </button>
                    <button
                      onClick={handleClearCache}
                      className="flex items-center gap-2 rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2.5 text-xs text-ground-400 hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Clear Local Cache
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 p-5 border border-alert/30 rounded-xl bg-alert/5 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-alert">Danger Zone</h3>
                    <p className="mt-1 text-xs text-ground-400">
                      Permanently delete your account, organizations, active settings, and satellite data records.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 rounded-lg bg-alert hover:bg-alert/90 text-white px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* AI PREFERENCES TAB */}
            {activeTab === "ai" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div>
                  <h2 className="text-lg font-medium text-instrument">AI Preferences</h2>
                  <p className="text-sm text-ground-400">
                    Configure machine learning model thresholds, formats, and post-processing variables.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-ground-400">Default Model</label>
                    <select
                      value={localAiModel}
                      onChange={(e) => {
                        setLocalAiModel(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
                    >
                      <option value="unet-v1">CNN/U-Net v1 (Active)</option>
                      <option value="vit" disabled>Vision Transformer (Coming Soon)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-ground-400">Heatmap Color Palette</label>
                    <select
                      value={localAiPalette}
                      onChange={(e) => {
                        setLocalAiPalette(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
                    >
                      <option value="viridis">Viridis</option>
                      <option value="inferno">Inferno</option>
                      <option value="plasma">Plasma</option>
                      <option value="turbo">Turbo</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-medium text-ground-400">Confidence Threshold</label>
                      <span className="readout font-semibold text-sensor">{localAiThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={99}
                      value={localAiThreshold}
                      onChange={(e) => {
                        setLocalAiThreshold(Number(e.target.value));
                        setIsDirty(true);
                      }}
                      className="w-full h-1 bg-ground-700 rounded-lg appearance-none cursor-pointer accent-sensor mt-2"
                    />
                    <p className="text-[10px] text-ground-400">Filter predictions showing confidence below this percentage threshold.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-ground-400">Prediction Units</label>
                    <select
                      value={localAiUnits}
                      onChange={(e) => {
                        setLocalAiUnits(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-ground-700 bg-ground-900/60 px-3 py-2 text-sm text-instrument focus:border-sensor/50 focus:outline-none focus:ring-1 focus:ring-sensor/30"
                    >
                      <option value="t/year">t CO₂/year</option>
                      <option value="kg/day">kg CO₂/day</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between gap-4 p-4 border border-ground-700 rounded-xl bg-ground-900/20">
                    <div>
                      <p className="text-sm font-medium text-instrument">Auto-run prediction after upload</p>
                      <p className="text-xs text-ground-400">Trigger isolated CNN inference automatically when files finish ingestion.</p>
                    </div>
                    <Toggle
                      checked={localAiAutorun}
                      onChange={() => {
                        setLocalAiAutorun(!localAiAutorun);
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between gap-4 p-4 border border-ground-700 rounded-xl bg-ground-900/20">
                    <div>
                      <p className="text-sm font-medium text-instrument">Enable Explainable AI (XAI)</p>
                      <p className="text-xs text-ground-400">Render prediction pixel activation maps mapping features to model outputs.</p>
                    </div>
                    <Toggle
                      checked={localAiExplainable}
                      onChange={() => {
                        setLocalAiExplainable(!localAiExplainable);
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-ground-700 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={resetAIDefaultsAction}
                    className="flex items-center gap-1.5 text-xs text-ground-400 hover:text-instrument transition-colors cursor-pointer"
                  >
                    <Sliders className="h-3.5 w-3.5" /> Reset to Defaults
                  </button>
                  <button
                    onClick={handleSaveAIPreferences}
                    disabled={isSaving}
                    className="rounded-lg bg-sensor hover:bg-sensor/90 text-ground-950 px-5 py-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Saving…" : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === "appearance" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div>
                  <h2 className="text-lg font-medium text-instrument">Appearance</h2>
                  <p className="text-sm text-ground-400">
                    Customize client styling, accent colorations, and UI behaviors.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Theme Select */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase text-ground-400 tracking-wider">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["dark", "light", "system"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateTheme(t)}
                          className={cn(
                            "py-3 text-sm rounded-lg border text-center transition-all capitalize font-medium cursor-pointer",
                            theme === t
                              ? "bg-ground-800 border-sensor text-instrument"
                              : "border-ground-700 bg-ground-900/40 text-ground-400 hover:border-ground-400"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color Select */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase text-ground-400 tracking-wider">Accent Color</label>
                    <div className="flex gap-4">
                      {["blue", "purple", "green"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateAccent(c)}
                          className={cn(
                            "h-7 w-7 rounded-full transition-all border-2 border-transparent flex items-center justify-center cursor-pointer",
                            accent === c && "border-instrument scale-115"
                          )}
                        >
                          <span
                            className={cn(
                              "h-5 w-5 rounded-full",
                              c === "blue" && "bg-blue-500",
                              c === "purple" && "bg-purple-500",
                              c === "green" && "bg-sensor"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-ground-700/60" />

                  {/* Animation toggle */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-instrument">Interface Animations</h3>
                      <p className="mt-1 text-xs text-ground-400">
                        Enable smooth page transitions and hover glow dynamics.
                      </p>
                    </div>
                    <Toggle checked={!reducedMotion} onChange={() => updateReducedMotion(!reducedMotion)} />
                  </div>

                  <hr className="border-ground-700/60" />

                  {/* Compact mode toggle */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-instrument">Compact Mode</h3>
                      <p className="mt-1 text-xs text-ground-400">
                        Reduce paddings to show more list outputs without scrolling.
                      </p>
                    </div>
                    <Toggle checked={compactMode} onChange={() => updateCompactMode(!compactMode)} />
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === "about" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div>
                  <h2 className="text-lg font-medium text-instrument">About Emissia</h2>
                  <p className="text-sm text-ground-400">
                    Core platform details, documentation channels, and developer source repositories.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40">
                    <p className="text-xs text-ground-400">Platform Version</p>
                    <p className="readout mt-1 text-lg font-semibold text-sensor">v1.0.0</p>
                  </div>
                  <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40">
                    <p className="text-xs text-ground-400">Model Registry Version</p>
                    <p className="readout mt-1 text-lg font-semibold text-sensor">mock-0.1.0</p>
                  </div>
                  <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/40">
                    <p className="text-xs text-ground-400">FastAPI API Version</p>
                    <p className="readout mt-1 text-lg font-semibold text-sensor">0.1.0</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-semibold uppercase text-ground-400 tracking-wider">Resources</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href="/docs"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 hover:border-ground-400 hover:bg-ground-800/20 transition-all text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-sensor" /> Documentation
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-ground-400" />
                    </a>

                    <a
                      href="https://github.com/abhi26shakya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 hover:border-ground-400 hover:bg-ground-800/20 transition-all text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-sensor" /> GitHub Repository
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-ground-400" />
                    </a>

                    <a
                      href="/privacy"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 hover:border-ground-400 hover:bg-ground-800/20 transition-all text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-sensor" /> Privacy Policy
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-ground-400" />
                    </a>

                    <a
                      href="/terms"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-ground-700 bg-ground-900/40 hover:border-ground-400 hover:bg-ground-800/20 transition-all text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-sensor" /> Terms of Service
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-ground-400" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-ground-700 bg-ground-900/30 flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium text-instrument flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-sensor" /> Need Support?
                    </p>
                    <p className="mt-1 text-xs text-ground-400">Get in touch if you have queries or need assistance.</p>
                  </div>
                  <a href="mailto:abhishekshakya80093@gmail.com" className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-xs font-semibold hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer">
                    Email Support
                  </a>
                </div>
              </div>
            )}
          </Card>

          {/* Footer inside Settings content container */}
          <footer className="text-center py-4 text-xs text-ground-400 border-t border-ground-700/30 flex flex-col gap-1">
            <span className="readout">Emissia v1.0.0</span>
            <span className="font-sans text-[10px] text-ground-400/80">Built for Earth Observation & Climate Intelligence</span>
          </footer>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ground-950/80 backdrop-blur-sm animate-in fade-in-50">
          <Card className="max-w-md w-full p-6 border-alert/30 bg-ground-900 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-alert flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> Delete Account
              </h3>
              <p className="mt-2 text-sm text-ground-400 leading-relaxed">
                Are you absolutely sure you want to delete your Emissia account? This action is permanent and cannot be undone. All database records, images, reports, and predictions will be permanently removed.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-ground-700/60">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-ground-700 bg-ground-900/60 px-4 py-2 text-sm text-ground-400 hover:border-ground-400 hover:text-instrument transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="rounded-lg bg-alert hover:bg-alert/90 text-white px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
