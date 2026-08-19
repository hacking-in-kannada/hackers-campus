"use client";

import {
  AlertOctagon,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Download,
  Eye,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  Moon,
  QrCode,
  Save,
  Shield,
  Smartphone,
  Terminal,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SECURITY_SESSIONS, USER_PROFILE } from "@/lib/mock-data";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "privacy" | "preferences" | "danger"
  >("profile");

  // Profile Form State
  const [displayName, setDisplayName] = useState(USER_PROFILE.displayName);
  const [username, setUsername] = useState(USER_PROFILE.username);
  const [bio, setBio] = useState(USER_PROFILE.bio);
  const [country, setCountry] = useState(USER_PROFILE.country);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [sessions, setSessions] = useState(SECURITY_SESSIONS);

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    reminders: true,
    challenges: true,
    achievements: true,
    securityAlerts: true,
    marketing: false,
  });

  // Privacy Toggles
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showBadges: true,
    showActivity: true,
    showRank: true,
    showSkills: true,
  });

  // Preferences
  const [connectionMode, setConnectionMode] = useState<"browser" | "vpn">("browser");
  const [timezone, setTimezone] = useState("UTC+05:30 (Asia/Kolkata)");

  // Danger Zone
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8">
      {/* Top Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted transition hover:text-lime"
          >
            <ArrowLeft size={14} /> Back to Profile
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Account & Security Settings
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage your credentials, 2-factor authentication, active lab VPN connections, and preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Left Navigation Sidebar */}
        <aside className="space-y-1">
          {[
            { id: "profile", label: "Profile Details", icon: User },
            { id: "security", label: "Security & 2FA", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "privacy", label: "Privacy Controls", icon: Eye },
            { id: "preferences", label: "Lab Preferences", icon: Terminal },
            { id: "danger", label: "Danger Zone", icon: AlertOctagon, danger: true },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 font-mono text-xs font-semibold transition ${
                activeTab === tab.id
                  ? tab.danger
                    ? "bg-danger/10 text-danger border border-danger/30"
                    : "bg-lime text-canvas shadow-glow"
                  : tab.danger
                  ? "text-danger hover:bg-danger/10"
                  : "text-muted hover:bg-panel hover:text-ink"
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Right Main Content Panel */}
        <main className="rounded-2xl border border-panelBorder bg-panel p-6 shadow-xl md:p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="border-b border-divider pb-4">
                <h2 className="text-lg font-bold text-ink">Public Profile</h2>
                <p className="text-xs text-muted">This information will be displayed on your public hacker profile.</p>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-lime bg-panelSubtle font-mono text-xl font-bold text-lime shadow-glow">
                  {USER_PROFILE.avatar}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => alert("Avatar upload dialog")}
                    className="rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2 font-mono text-xs font-bold text-ink hover:border-lime hover:text-lime"
                  >
                    Change Avatar
                  </button>
                  <p className="mt-1 font-mono text-[10px] text-muted">PNG, JPG or GIF up to 2MB</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-muted mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 text-xs text-ink focus:border-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted mb-1.5">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Bio / Specialization</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle p-3 text-xs leading-relaxed text-ink focus:border-lime focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Country / Region</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-divider pt-5">
                {savedSuccess && (
                  <span className="flex items-center gap-1.5 font-mono text-xs text-lime">
                    <CheckCircle2 size={14} /> Profile changes saved successfully!
                  </span>
                )}
                <div className="ml-auto flex gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-lime px-5 py-2.5 font-mono text-xs font-bold text-canvas shadow-glow transition hover:bg-limeDim"
                  >
                    <Save size={14} /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <div className="border-b border-divider pb-4">
                <h2 className="text-lg font-bold text-ink">Authentication & Security</h2>
                <p className="text-xs text-muted">Manage passwords, 2-factor authentication apps, and active browser sessions.</p>
              </div>

              {/* 2FA Section */}
              <div className="rounded-xl border border-panelBorder bg-panelSubtle p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10 text-lime border border-lime/30">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">Two-Factor Authentication (2FA)</h3>
                      <p className="text-xs text-muted mt-0.5">
                        Secure account logins with TOTP Authenticator apps (Google Authenticator, Bitwarden).
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!twoFactorEnabled) setShowQrModal(true);
                      else setTwoFactorEnabled(false);
                    }}
                    className={`rounded-lg px-4 py-2 font-mono text-xs font-bold transition ${
                      twoFactorEnabled
                        ? "border border-panelBorder bg-panel text-muted hover:text-danger"
                        : "bg-lime text-canvas shadow-glow hover:bg-limeDim"
                    }`}
                  >
                    {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>

                {twoFactorEnabled && (
                  <div className="mt-4 rounded-lg border border-lime/30 bg-lime/5 p-3 flex items-center justify-between font-mono text-xs">
                    <span className="flex items-center gap-2 text-lime">
                      <CheckCircle2 size={15} /> 2FA is currently active with Time-based One-Time Password.
                    </span>
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="text-ink underline hover:text-lime"
                    >
                      View Backup Codes
                    </button>
                  </div>
                )}
              </div>

              {/* Password Change */}
              <div className="rounded-xl border border-panelBorder bg-panelSubtle p-5">
                <h3 className="text-sm font-bold text-ink mb-4">Change Password</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-xs text-muted mb-1.5">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-panelBorder bg-panel px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-muted mb-1.5">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-panelBorder bg-panel px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => alert("Password updated successfully!")}
                  className="mt-4 rounded-lg border border-panelBorder bg-panel px-4 py-2 font-mono text-xs font-bold text-ink hover:border-lime hover:text-lime"
                >
                  Update Password
                </button>
              </div>

              {/* Active Sessions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-ink">Active Login Sessions</h3>
                  <button
                    onClick={() => setSessions(sessions.filter((s) => s.isCurrent))}
                    className="font-mono text-xs text-danger hover:underline"
                  >
                    Revoke All Other Sessions
                  </button>
                </div>

                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="flex items-center justify-between rounded-xl border border-panelBorder bg-panelSubtle p-4"
                    >
                      <div className="flex items-center gap-3">
                        {sess.device.includes("iPhone") ? (
                          <Smartphone size={20} className="text-muted" />
                        ) : (
                          <Laptop size={20} className="text-lime" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-ink flex items-center gap-2">
                            {sess.device}{" "}
                            {sess.isCurrent && (
                              <span className="rounded bg-lime/10 px-2 py-0.5 font-mono text-[9px] text-lime">
                                CURRENT SESSION
                              </span>
                            )}
                          </p>
                          <p className="font-mono text-[11px] text-muted mt-0.5">
                            {sess.browser} · {sess.ip} ({sess.location}) · {sess.lastActive}
                          </p>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(sess.id)}
                          className="rounded-lg border border-danger/30 px-3 py-1 font-mono text-xs text-danger hover:bg-danger/10"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-divider pb-4">
                <h2 className="text-lg font-bold text-ink">Notification Preferences</h2>
                <p className="text-xs text-muted">Control when and how you receive alerts and platform updates.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: "reminders", label: "Daily Streak Reminders", desc: "Get notified when your learning streak is about to reset." },
                  { key: "challenges", label: "New Challenge Releases", desc: "Receive immediate pings when new rooms or practice targets go live." },
                  { key: "achievements", label: "Achievement & Badge Unlocks", desc: "Alerts when you earn badges or platform certificates." },
                  { key: "securityAlerts", label: "Security & Login Alerts", desc: "Urgent notifications for logins from unknown IPs or password resets." },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-panelBorder bg-panelSubtle p-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-ink">{item.label}</h4>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(notifications as any)[item.key]}
                      onChange={(e) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="h-4 w-4 accent-lime cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="border-b border-divider pb-4">
                <h2 className="text-lg font-bold text-ink">Lab Environment Preferences</h2>
                <p className="text-xs text-muted">Customize your default penetration testing connections.</p>
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-2">Default Lab Connection Mode</label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div
                    onClick={() => setConnectionMode("browser")}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      connectionMode === "browser"
                        ? "border-lime bg-lime/10 shadow-glow"
                        : "border-panelBorder bg-panelSubtle"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink text-sm">In-Browser Terminal</span>
                      {connectionMode === "browser" && <CheckCircle2 size={16} className="text-lime" />}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Full web-based Kali attack console with zero setup required.
                    </p>
                  </div>

                  <div
                    onClick={() => setConnectionMode("vpn")}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      connectionMode === "vpn"
                        ? "border-lime bg-lime/10 shadow-glow"
                        : "border-panelBorder bg-panelSubtle"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink text-sm">OpenVPN / WireGuard</span>
                      {connectionMode === "vpn" && <CheckCircle2 size={16} className="text-lime" />}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Direct tunnel into the lab network using your local machine tools.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-2">Download VPN Profile</label>
                <button
                  onClick={() => alert("Downloading hackers-campus-pavan.ovpn configuration...")}
                  className="inline-flex items-center gap-2 rounded-lg border border-panelBorder bg-panelSubtle px-4 py-2.5 font-mono text-xs font-bold text-ink hover:border-lime hover:text-lime"
                >
                  <Download size={14} /> Download `hackers-campus-pavan.ovpn`
                </button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="border-b border-divider pb-4">
                <h2 className="text-lg font-bold text-ink">Profile Visibility Controls</h2>
                <p className="text-xs text-muted">Control what other hackers and recruiters can see on your profile.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: "publicProfile", label: "Public Profile Searchable", desc: "Allow your profile to be indexed on the platform leaderboard." },
                  { key: "showBadges", label: "Display Earned Badges", desc: "Show off your achievement badges." },
                  { key: "showActivity", label: "Display Activity Heatmap", desc: "Display your 365-day contribution calendar." },
                  { key: "showSkills", label: "Display Competency Radar Chart", desc: "Show verified skill levels for Web, Linux, AD." },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-panelBorder bg-panelSubtle p-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-ink">{item.label}</h4>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(privacy as any)[item.key]}
                      onChange={(e) =>
                        setPrivacy((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="h-4 w-4 accent-lime cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <div className="space-y-6">
              <div className="border-b border-divider pb-4">
                <h2 className="text-lg font-bold text-danger">Danger Zone</h2>
                <p className="text-xs text-muted">Irreversible actions regarding your account and lab progress.</p>
              </div>

              <div className="rounded-xl border border-danger/30 bg-danger/5 p-6">
                <h4 className="font-bold text-ink text-sm">Delete Account & Platform Data</h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  Permanently delete your account, earned XP, certificates, and challenge history. This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 font-mono text-xs font-bold text-white hover:bg-red-600"
                >
                  <Trash2 size={14} /> Delete My Account
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 2FA QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-panelBorder bg-panel p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-ink">Two-Factor Authentication Setup</h3>
            <p className="mt-1 text-xs text-muted">
              Scan this QR code with Google Authenticator or your password manager.
            </p>

            <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-panelBorder bg-white p-6">
              <QrCode size={160} className="text-black" />
              <p className="mt-3 font-mono text-xs font-bold text-black">
                SECRET: HC-2FA-9841-XYZ9
              </p>
            </div>

            <div className="rounded-lg border border-panelBorder bg-panelSubtle p-3 font-mono text-xs text-muted">
              <span className="font-bold text-ink">Emergency Backup Codes:</span>
              <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-lime">
                <span>9481-2094</span>
                <span>5512-8831</span>
                <span>0019-4820</span>
                <span>7731-9921</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setTwoFactorEnabled(true);
                  setShowQrModal(false);
                }}
                className="rounded-lg bg-lime px-5 py-2 font-mono text-xs font-bold text-canvas shadow-glow hover:bg-limeDim"
              >
                Done / Activated
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-danger/40 bg-panel p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-danger flex items-center gap-2">
              <AlertOctagon size={20} /> Delete Account Confirmation
            </h3>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              To proceed with deletion, please type <strong className="text-ink">delete my account</strong> below:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="delete my account"
              className="mt-3 w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-danger focus:outline-none"
            />
            <div className="mt-6 flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-panelBorder px-4 py-2 text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText !== "delete my account"}
                onClick={() => {
                  alert("Account deleted.");
                  setShowDeleteModal(false);
                }}
                className="rounded-lg bg-danger px-4 py-2 font-bold text-white disabled:opacity-40"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
