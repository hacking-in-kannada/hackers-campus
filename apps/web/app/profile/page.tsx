"use client";

import {
  Award,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  Lock,
  Mail,
  MapPin,
  QrCode,
  RotateCcw,
  Search,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  User,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BADGES,
  CERTIFICATES,
  USER_PROFILE,
  generateActivityData,
} from "@/lib/mock-data";
import type { Certificate } from "@hackers-campus/shared-types";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "completed" | "skills" | "badges" | "certificates" | "activity"
  >("overview");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [searchSolveQuery, setSearchSolveQuery] = useState("");

  const activityDays = useMemo(() => generateActivityData(), []);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    if (selectedBadgeFilter === "unlocked") return BADGES.filter((b) => b.unlocked);
    if (selectedBadgeFilter === "locked") return BADGES.filter((b) => !b.unlocked);
    return BADGES;
  }, [selectedBadgeFilter]);

  const completedActivities = useMemo(() => {
    return [
      {
        id: "c-1",
        title: "Windows Fundamentals 1",
        type: "Room",
        category: "Windows",
        completedAt: "August 18, 2026",
        xp: 100,
      },
      {
        id: "c-2",
        title: "Kerberos Fundamentals",
        type: "Room",
        category: "Active Directory",
        completedAt: "August 18, 2026",
        xp: 150,
      },
      {
        id: "c-3",
        title: "JWT None Algorithm Bypass",
        type: "Practice Lab",
        category: "Web Security",
        completedAt: "August 16, 2026",
        xp: 100,
      },
      {
        id: "c-4",
        title: "Linux SUID Binary Escalation",
        type: "Practice Lab",
        category: "Linux",
        completedAt: "August 12, 2026",
        xp: 120,
      },
      {
        id: "c-5",
        title: "Active Directory Security Module",
        type: "Module",
        category: "Active Directory",
        completedAt: "July 28, 2026",
        xp: 450,
      },
      {
        id: "c-6",
        title: "SQL Injection Deep Dive",
        type: "Room",
        category: "Web Security",
        completedAt: "July 15, 2026",
        xp: 200,
      },
      {
        id: "c-7",
        title: "Quantum Elliptic (First Blood)",
        type: "CTF Solve",
        category: "Cryptography",
        completedAt: "July 02, 2026",
        xp: 350,
      },
    ];
  }, []);

  const filteredCompleted = useMemo(() => {
    if (!searchSolveQuery.trim()) return completedActivities;
    const q = searchSolveQuery.toLowerCase();
    return completedActivities.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [completedActivities, searchSolveQuery]);

  // Segmented XP Progress Bar
  const totalXpSegments = 32;
  const activeXpSegments = Math.round(
    (USER_PROFILE.currentXp / USER_PROFILE.nextLevelXp) * totalXpSegments
  );

  return (
    <main className="min-h-screen bg-[#090E17] pb-16 text-[#E2E8F0]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. TryHackMe Style Profile Header Hero */}
        <section className="relative mb-8 overflow-hidden rounded-2xl border border-[#1E293B] bg-gradient-to-r from-[#0F172A] via-[#111C35] to-[#0A1628] p-6 sm:p-8 shadow-2xl">
          {/* Background glowing cyber atmosphere */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.12),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* User Identity Column */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar with glowing ring */}
              <div className="relative">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border-2 border-[#22C55E] bg-[#0E1624] font-mono text-2xl sm:text-3xl font-extrabold text-[#22C55E] shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  {USER_PROFILE.avatar}
                </div>
                <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#22C55E] text-xs font-bold text-[#090E12] shadow-md">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {USER_PROFILE.displayName}
                  </h1>
                  <span className="rounded bg-[#1E293B] px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-slate-700">
                    VIP Pro
                  </span>
                </div>

                <p className="font-mono text-xs text-emerald-400 mt-0.5">@{USER_PROFILE.username}</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {USER_PROFILE.bio}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-emerald-400" /> {USER_PROFILE.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> Joined {USER_PROFILE.joinedDate}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Flame size={13} className="text-orange-400" /> {USER_PROFILE.streakDays} Day Streak
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Rank & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Rank & Solves Pill */}
              <div className="rounded-xl border border-[#1E293B] bg-[#0E1624] p-4 text-center sm:text-left min-w-[200px]">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Platform Rank</span>
                  <Trophy size={16} className="text-amber-400" />
                </div>
                <div className="font-mono">
                  <span className="text-2xl font-extrabold text-white">#{USER_PROFILE.globalRank}</span>
                  <span className="ml-2 text-xs text-emerald-400 font-semibold">(Top 1%)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => alert("Public profile URL copied to clipboard: https://hackerscampus.com/p/pavanreddyx7")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#22C55E] px-4 py-2 font-mono text-xs font-bold text-[#090E12] shadow-md hover:bg-[#4ADE80] transition"
                >
                  <Share2 size={14} />
                  <span>Share Profile</span>
                </button>

                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1E293B] bg-[#111A28] px-4 py-2 font-mono text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition"
                >
                  <Settings size={14} />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Segmented XP Bar */}
          <div className="mt-6 border-t border-[#1C273C] pt-4">
            <div className="flex items-center justify-between font-mono text-xs mb-2">
              <span className="text-white font-bold">
                Level {USER_PROFILE.level} · {USER_PROFILE.levelTitle}
              </span>
              <span className="text-emerald-400 font-bold">
                {USER_PROFILE.currentXp} / {USER_PROFILE.nextLevelXp} XP ({USER_PROFILE.nextLevelXp - USER_PROFILE.currentXp} XP to Level {USER_PROFILE.level + 1})
              </span>
            </div>

            {/* Segmented notches */}
            <div className="flex items-center gap-1 overflow-hidden py-1">
              {Array.from({ length: totalXpSegments }).map((_, idx) => {
                const isActive = idx < activeXpSegments;
                return (
                  <div
                    key={idx}
                    className={`h-3 flex-1 rounded-xs transition-all duration-300 ${
                      isActive
                        ? "bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.7)]"
                        : "bg-[#1E293B]/80"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. Navigation Tab Bar */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto border-b border-[#1E293B] pb-1 hide-scrollbar">
          {[
            { id: "overview", label: "Overview" },
            { id: "completed", label: `Completed Solves (${completedActivities.length})` },
            { id: "skills", label: "Skills Matrix" },
            { id: "badges", label: `Badges (${BADGES.length})` },
            { id: "certificates", label: `Certificates (${CERTIFICATES.length})` },
            { id: "activity", label: "Activity Heatmap" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 rounded-t-lg px-4 py-2.5 font-mono text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "border-b-2 border-[#22C55E] bg-[#111A28] text-white"
                  : "text-slate-400 hover:bg-[#111A28]/40 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Learning Modules", value: USER_PROFILE.completedModulesCount, icon: Layers },
                { label: "Theory & Guided Rooms", value: USER_PROFILE.completedRoomsCount, icon: Terminal },
                { label: "Practical Lab Solves", value: USER_PROFILE.completedChallengesCount, icon: Zap },
                { label: "Verified Credentials", value: USER_PROFILE.certificatesCount, icon: ShieldCheck },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#1E293B] bg-[#111A28] p-5 shadow-md hover:border-slate-600 transition"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono text-[11px] uppercase tracking-wider">{stat.label}</span>
                    <stat.icon size={18} className="text-emerald-400" />
                  </div>
                  <p className="mt-3 font-mono text-2xl font-extrabold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              {/* Recent Solves */}
              <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Recent Completions & Solves
                  </h3>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className="font-mono text-xs text-emerald-400 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="divide-y divide-[#1E293B]">
                  {completedActivities.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-white">{item.title}</p>
                          <p className="font-mono text-[10px] text-slate-400">
                            {item.type} · {item.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <span className="font-bold text-emerald-400">+{item.xp} XP</span>
                        <p className="text-[10px] text-slate-400">{item.completedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Radar Preview */}
              <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Skill Competency Radar
                    </h3>
                    <button
                      onClick={() => setActiveTab("skills")}
                      className="font-mono text-xs text-emerald-400 hover:underline"
                    >
                      Full Matrix →
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <RadarChart skills={USER_PROFILE.skills} size={240} />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-[#1E293B] bg-[#0E1624] p-3.5 font-mono text-xs text-slate-300 text-center">
                  Top Competency: <strong className="text-emerald-400">Linux Hardening & AD (91%)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Completed Solves Log */}
        {activeTab === "completed" && (
          <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] overflow-hidden shadow-xl">
            <div className="border-b border-[#1E293B] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                Complete Activity & XP Log ({filteredCompleted.length})
              </h3>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  value={searchSolveQuery}
                  onChange={(e) => setSearchSolveQuery(e.target.value)}
                  placeholder="Filter by title, type, or category..."
                  className="w-full rounded-lg border border-[#1E293B] bg-[#0A101C] py-2 pl-9 pr-4 text-xs font-mono text-white placeholder:text-slate-400 focus:border-[#22C55E] focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-[#1E293B] bg-[#0C121D] text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Content Title</th>
                    <th className="py-3.5 px-6">Type</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Completed Date</th>
                    <th className="py-3.5 px-6 text-right">XP Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] text-slate-200">
                  {filteredCompleted.map((row) => (
                    <tr key={row.id} className="hover:bg-[#152238]/40 transition">
                      <td className="py-4 px-6 font-bold flex items-center gap-2 text-white">
                        <CheckCircle2 size={14} className="text-emerald-400" /> {row.title}
                      </td>
                      <td className="py-4 px-6 text-slate-400">{row.type}</td>
                      <td className="py-4 px-6 text-slate-400">{row.category}</td>
                      <td className="py-4 px-6 text-slate-400">{row.completedAt}</td>
                      <td className="py-4 px-6 text-right font-bold text-emerald-400">+{row.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Skills Matrix */}
        {activeTab === "skills" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl flex flex-col items-center justify-center">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-6 self-start">
                Domain Competency Radar
              </h3>
              <RadarChart skills={USER_PROFILE.skills} size={300} />
              <p className="mt-6 font-mono text-xs text-slate-400 text-center max-w-xs leading-relaxed">
                Generated automatically from verified room completions, CTF flags, and practical lab exploits.
              </p>
            </div>

            <div className="space-y-4">
              {USER_PROFILE.skills.map((skill) => (
                <div
                  key={skill.label}
                  className="rounded-xl border border-[#1E293B] bg-[#111A28] p-5 shadow-md"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-white">{skill.label}</span>
                    <span className="font-bold text-emerald-400">{skill.level}% Mastery</span>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#1E293B]">
                    <div
                      className="h-full rounded-full bg-[#22C55E] transition-all duration-700"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Badges */}
        {activeTab === "badges" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {(["all", "unlocked", "locked"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedBadgeFilter(filter)}
                  className={`rounded-lg px-3.5 py-1.5 font-mono text-xs capitalize transition ${
                    selectedBadgeFilter === filter
                      ? "bg-[#22C55E] text-[#090E12] font-bold shadow-md"
                      : "border border-[#1E293B] bg-[#111A28] text-slate-400 hover:text-white"
                  }`}
                >
                  {filter === "all" ? "All Badges" : filter}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
                    badge.unlocked
                      ? "border-emerald-500/40 bg-[#111A28] shadow-lg shadow-emerald-950/20"
                      : "border-[#1E293B] bg-[#0E1624] opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl font-mono text-lg font-bold ${
                        badge.unlocked
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-[#0A101C] text-slate-500 border border-[#1E293B]"
                      }`}
                    >
                      {badge.unlocked ? <Sparkles size={22} /> : <Lock size={20} />}
                    </div>
                    <span
                      className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold ${
                        badge.rarity === "Legendary"
                          ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                          : badge.rarity === "Epic"
                          ? "border-red-500/40 bg-red-500/10 text-red-400"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {badge.rarity}
                    </span>
                  </div>

                  <h4 className="mt-4 font-bold text-white text-sm">{badge.title}</h4>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{badge.description}</p>

                  <div className="mt-4 border-t border-[#1C273A] pt-3 font-mono text-[10px]">
                    {badge.unlocked ? (
                      <span className="text-emerald-400 font-semibold">
                        Unlocked on {badge.unlockedAt}
                      </span>
                    ) : (
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{badge.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#1E293B] overflow-hidden">
                          <div
                            className="h-full bg-amber-400"
                            style={{ width: `${badge.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Certificates */}
        {activeTab === "certificates" && (
          <div className="grid gap-6 md:grid-cols-2">
            {CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl hover:border-emerald-500/40 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                      VERIFIED CREDENTIAL
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-white">{cert.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{cert.subtitle}</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0E1624] border border-[#1E293B] text-emerald-400">
                    <ShieldCheck size={26} />
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#1E293B] bg-[#0E1624] p-3.5 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Credential ID:</span>
                    <span className="text-white font-bold">{cert.credentialId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Issue Date:</span>
                    <span className="text-slate-200">{cert.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Grade:</span>
                    <span className="text-emerald-400 font-bold">{cert.grade}</span>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-4 py-2 font-mono text-xs font-bold text-[#090E12] shadow-md hover:bg-[#4ADE80] transition"
                  >
                    <Award size={14} />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: Activity Heatmap (365-Day) */}
        {activeTab === "activity" && (
          <section className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl">
            <div className="flex flex-col justify-between gap-2 border-b border-[#1E293B] pb-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                  365-Day Exploit & Learning Activity
                </h3>
                <p className="text-xs text-slate-400 mt-1">1,420 activities recorded in the last year.</p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <span>Less</span>
                <span className="h-3 w-3 rounded-sm bg-[#0E1624] border border-[#1E293B]" />
                <span className="h-3 w-3 rounded-sm bg-emerald-500/25" />
                <span className="h-3 w-3 rounded-sm bg-emerald-500/50" />
                <span className="h-3 w-3 rounded-sm bg-emerald-500/80" />
                <span className="h-3 w-3 rounded-sm bg-[#22C55E]" />
                <span>More</span>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto pb-4 hide-scrollbar">
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
                {activityDays.map((day) => {
                  const colors = [
                    "bg-[#0E1624] border border-[#1E293B]",
                    "bg-emerald-500/25",
                    "bg-emerald-500/50",
                    "bg-emerald-500/80",
                    "bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.8)]",
                  ];
                  return (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} activities`}
                      className={`h-3 w-3 rounded-sm cursor-pointer transition hover:scale-125 ${
                        colors[day.level]
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Certificate Modal */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#1E293B] bg-[#111A28] p-8 shadow-2xl">
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>

              {/* Certificate Visual Card */}
              <div className="rounded-xl border-2 border-emerald-500/40 bg-[#0E1624] p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />

                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400 mb-2">
                  <ShieldCheck size={16} /> Official Certificate of Achievement
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {selectedCert.title}
                </h2>
                <p className="mt-1 font-mono text-xs text-slate-400">{selectedCert.subtitle}</p>

                <div className="my-6 border-t border-b border-[#1E293B] py-4">
                  <p className="text-xs uppercase font-mono text-slate-400">Presented To</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{USER_PROFILE.displayName}</p>
                  <p className="font-mono text-xs text-slate-400 mt-1">For successfully demonstrating proficiency in:</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {selectedCert.skillsVerified.map((skill) => (
                      <span
                        key={skill}
                        className="rounded border border-[#1E293B] bg-[#0A101C] px-2.5 py-1 font-mono text-[10px] text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left font-mono text-xs">
                  <div>
                    <span className="text-slate-400">Credential ID:</span>
                    <p className="font-bold text-white">{selectedCert.credentialId}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Issue Date:</span>
                    <p className="font-bold text-white">{selectedCert.issueDate}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => alert(`Certificate ${selectedCert.credentialId} link copied to clipboard!`)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#0E1624] px-4 py-2.5 text-slate-200 hover:border-[#22C55E] hover:text-white"
                >
                  <Share2 size={14} />
                  <span>Share Credential</span>
                </button>
                <button
                  onClick={() => alert("Downloading PDF certificate...")}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] px-5 py-2.5 font-bold text-[#090E12] shadow-md hover:bg-[#4ADE80]"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Custom SVG Radar Chart component for Cybersecurity Skills
function RadarChart({
  skills,
  size = 240,
}: {
  skills: typeof USER_PROFILE.skills;
  size?: number;
}) {
  const center = size / 2;
  const radius = center - 40;
  const numAxes = skills.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  const points = skills
    .map((skill, i) => {
      const r = (skill.level / 100) * radius;
      const angle = i * angleSlice - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Background Web Rings */}
      {[0.25, 0.5, 0.75, 1].map((level) => {
        const ringPoints = skills
          .map((_, i) => {
            const r = level * radius;
            const angle = i * angleSlice - Math.PI / 2;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
          })
          .join(" ");
        return (
          <polygon
            key={level}
            points={ringPoints}
            fill="none"
            stroke="#1E293B"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis Lines & Labels */}
      {skills.map((skill, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);

        const labelX = center + (radius + 22) * Math.cos(angle);
        const labelY = center + (radius + 22) * Math.sin(angle);

        return (
          <g key={skill.label}>
            <line
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#1E293B"
              strokeWidth="1"
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-400 font-mono text-[9px] font-semibold"
            >
              {skill.label.split(" ")[0]}
            </text>
          </g>
        );
      })}

      {/* Data Polygon Fill */}
      <polygon
        points={points}
        fill="rgba(34, 197, 94, 0.2)"
        stroke="#22C55E"
        strokeWidth="2"
      />

      {/* Data Vertex Dots */}
      {skills.map((skill, i) => {
        const r = (skill.level / 100) * radius;
        const angle = i * angleSlice - Math.PI / 2;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return (
          <circle
            key={skill.label}
            cx={x}
            cy={y}
            r="3.5"
            className="fill-[#090E17] stroke-[#22C55E] stroke-2"
          />
        );
      })}
    </svg>
  );
}
