"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Layers,
  Monitor,
  Network,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Signal,
  Sparkles,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";

interface LearnModule {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  labs: number;
  hours: number;
  progress: number;
  xp: number;
  featured?: boolean;
}


const CATEGORIES = [
  "All",
  "Web Security",
  "Active Directory",
  "Linux",
  "Windows",
  "Network",
  "Cloud Security",
  "Defense & SOC",
  "Cryptography",
  "Binary Exploitation",
];

// Custom theme avatar icons for Modules
function ModuleAvatar({ category }: { category: string }) {
  if (category === "Active Directory") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-500/30 bg-purple-950/40 p-2 shadow-inner">
        <Network className="h-6 w-6 text-purple-400" />
      </div>
    );
  }
  if (category === "Linux") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/40 p-2 shadow-inner">
        <Terminal className="h-6 w-6 text-emerald-400" />
      </div>
    );
  }
  if (category === "Windows") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-500/30 bg-sky-950/40 p-2 shadow-inner">
        <Monitor className="h-6 w-6 text-sky-400" />
      </div>
    );
  }
  if (category === "Web Security") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-lime/30 bg-lime/10 p-2 shadow-inner">
        <Code2 className="h-6 w-6 text-lime" />
      </div>
    );
  }
  if (category === "Cloud Security") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/40 p-2 shadow-inner">
        <Cloud className="h-6 w-6 text-cyan-400" />
      </div>
    );
  }
  if (category === "Defense & SOC") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-blue-950/40 p-2 shadow-inner">
        <ShieldCheck className="h-6 w-6 text-blue-400" />
      </div>
    );
  }
  if (category === "Binary Exploitation") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-500/30 bg-red-950/40 p-2 shadow-inner">
        <Cpu className="h-6 w-6 text-red-400" />
      </div>
    );
  }
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/30 bg-amber-950/40 p-2 shadow-inner">
      <Zap className="h-6 w-6 text-amber-400" />
    </div>
  );
}

// Hero HUD for Module Library
function ModulesHero({ completedCount = 18, totalCount = 64 }: { completedCount?: number; totalCount?: number }) {
  const totalSegments = 48;
  const activeSegments = Math.round((completedCount / totalCount) * totalSegments);

  return (
    <header className="relative mb-8 overflow-hidden rounded-2xl border border-[#1E293B] bg-gradient-to-r from-[#0F172A] via-[#111C35] to-[#0A1628] p-6 md:p-10 shadow-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 flex flex-col-reverse items-center justify-between gap-8 lg:flex-row lg:gap-12">
        <div className="w-full flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Module Library
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Explore bite-sized, interactive cybersecurity courses and practical lab rooms organized by technology and attack vector.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center gap-1 overflow-hidden py-1">
                {Array.from({ length: totalSegments }).map((_, idx) => {
                  const isActive = idx < activeSegments;
                  return (
                    <div
                      key={idx}
                      className={`h-4.5 w-1.5 sm:w-2 rounded-xs transition-all duration-300 ${
                        isActive
                          ? "bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                          : "bg-[#1E293B]/90 hover:bg-[#334155]"
                      }`}
                    />
                  );
                })}
              </div>

              <div className="shrink-0 font-mono text-xl font-bold text-white md:text-2xl">
                <span>{completedCount}</span>
                <span className="text-sm font-medium text-slate-400">/{totalCount}</span>
                <span className="ml-1.5 hidden text-xs font-normal text-slate-400 sm:inline">
                  Modules
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-sm sm:gap-10 sm:text-base">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                <span className="text-lg font-bold text-white">12</span>
                <span className="text-xs text-slate-400">/28</span>
                <span className="text-xs font-medium text-slate-300">Beginner</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                <span className="text-lg font-bold text-white">5</span>
                <span className="text-xs text-slate-400">/24</span>
                <span className="text-xs font-medium text-slate-300">Intermediate</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                <span className="text-lg font-bold text-white">1</span>
                <span className="text-xs text-slate-400">/12</span>
                <span className="text-xs font-medium text-slate-300">Advanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: 3D Vector Cyber Matrix Isometric Cube */}
        <div className="relative flex shrink-0 items-center justify-center">
          <div className="absolute h-52 w-52 rounded-full bg-emerald-500/20 blur-3xl" />
          <svg
            viewBox="0 0 240 190"
            className="relative h-44 w-56 sm:h-52 sm:w-64 drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="modCubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#065F46" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Radar Base */}
            <ellipse cx="120" cy="155" rx="90" ry="22" stroke="#22C55E" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3" />
            <ellipse cx="120" cy="155" rx="60" ry="14" stroke="#22C55E" strokeOpacity="0.7" strokeWidth="1.5" />

            {/* Isometric Module Cube Top Face */}
            <polygon points="120,30 175,60 120,90 65,60" fill="url(#modCubeGrad)" stroke="#4ADE80" strokeWidth="1.5" />
            {/* Left Face */}
            <polygon points="65,60 120,90 120,150 65,120" fill="#0A1E24" stroke="#22C55E" strokeWidth="1.5" />
            {/* Right Face */}
            <polygon points="120,90 175,60 175,120 120,150" fill="#0E2D36" stroke="#22C55E" strokeWidth="1.5" />

            {/* Matrix Internal Grid lines */}
            <line x1="92" y1="45" x2="147" y2="75" stroke="#86EFAC" strokeWidth="1" />
            <line x1="147" y1="45" x2="92" y2="75" stroke="#86EFAC" strokeWidth="1" />
            <line x1="92" y1="105" x2="92" y2="135" stroke="#86EFAC" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="147" y1="105" x2="147" y2="135" stroke="#86EFAC" strokeWidth="1" strokeDasharray="2 2" />

            {/* Glowing Corner Nodes */}
            <circle cx="120" cy="30" r="4" fill="#FFFFFF" />
            <circle cx="175" cy="60" r="4" fill="#4ADE80" />
            <circle cx="65" cy="60" r="4" fill="#4ADE80" />
            <circle cx="120" cy="90" r="5" fill="#22C55E" />
            <circle cx="120" cy="150" r="4" fill="#4ADE80" />

            {/* Signal Pulse */}
            <circle cx="120" cy="30" r="8" stroke="#FFFFFF" strokeWidth="1" className="animate-ping" />
          </svg>
        </div>
      </div>
    </header>
  );
}

// Featured Module Banner Component
function FeaturedModuleBanner() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#1E2D48] bg-gradient-to-r from-[#0C1424] via-[#0F1B30] to-[#0A1220] p-6 sm:p-8 transition-all hover:border-[#22C55E]/40 shadow-xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-400 uppercase">
                Featured Module · +1,500 XP
              </span>
              <Shield size={16} className="text-purple-400 shrink-0" />
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Active Directory Security & Kerberos Exploitation
            </h2>
            <p className="mt-1.5 text-xs text-slate-300 sm:text-sm max-w-2xl leading-relaxed">
              Explore Windows Domain Controllers, BloodHound graph attacks, Kerberoasting, and ACL privilege escalation in enterprise environments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-400">
              <Signal size={13} />
              <span>Intermediate</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Clock size={13} />
              <span>12 Hours</span>
            </span>
            <span className="rounded-full bg-[#1E293B] px-3 py-0.5 text-xs font-medium text-slate-300 border border-slate-700/60">
              12 Lessons · 8 Interactive Labs
            </span>
          </div>

          <div className="pt-1">
            <Link
              href="/learn/modules/active-directory-security"
              className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] px-6 py-2.5 text-xs sm:text-sm font-bold text-[#090E12] transition-all hover:bg-[#4ADE80] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              <span>Continue Module (64%)</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Vector AD Tree Artwork */}
        <div className="relative shrink-0 flex items-center justify-center self-center md:self-auto">
          <svg
            viewBox="0 0 180 160"
            className="h-32 w-36 sm:h-36 sm:w-40 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Domain Controller Top Node */}
            <rect x="70" y="15" width="40" height="26" rx="6" fill="#0F172A" stroke="#A855F7" strokeWidth="1.5" />
            <circle cx="90" cy="28" r="4" fill="#A855F7" />

            {/* Tree Branch Lines */}
            <line x1="90" y1="41" x2="90" y2="70" stroke="#A855F7" strokeWidth="1.5" />
            <line x1="40" y1="70" x2="140" y2="70" stroke="#A855F7" strokeWidth="1.5" />
            <line x1="40" y1="70" x2="40" y2="100" stroke="#A855F7" strokeWidth="1.5" />
            <line x1="90" y1="70" x2="90" y2="100" stroke="#A855F7" strokeWidth="1.5" />
            <line x1="140" y1="70" x2="140" y2="100" stroke="#A855F7" strokeWidth="1.5" />

            {/* Child Member Nodes */}
            <rect x="22" y="100" width="36" height="24" rx="5" fill="#0F172A" stroke="#22C55E" strokeWidth="1.5" />
            <rect x="72" y="100" width="36" height="24" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <rect x="122" y="100" width="36" height="24" rx="5" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />

            <circle cx="40" cy="112" r="3" fill="#22C55E" />
            <circle cx="90" cy="112" r="3" fill="#38BDF8" />
            <circle cx="140" cy="112" r="3" fill="#F59E0B" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Single Module Card Component (TryHackMe Style)
function ModuleCard({ module }: { module: LearnModule }) {
  const isStarted = module.progress > 0 && module.progress < 100;
  const isComplete = module.progress === 100;

  const difficultyColors = {
    Beginner: "text-[#22C55E]",
    Intermediate: "text-[#F59E0B]",
    Advanced: "text-[#EF4444]",
  };

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-xl border border-[#1E293B] bg-[#111A28] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-600 hover:shadow-lg hover:shadow-emerald-950/20">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
              {module.category}
            </span>
            <Link
              href="/learn/modules/active-directory-security"
              className="mt-1 block text-base font-bold text-white transition-colors group-hover:text-emerald-400 line-clamp-1"
            >
              {module.title}
            </Link>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {module.description}
            </p>
          </div>

          <div className="shrink-0">
            <ModuleAvatar category={module.category} />
          </div>
        </div>

        {/* Metrics Row: Lessons, Labs, XP, Hours */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-[#1C273A] pt-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-300">
              {module.lessons} lessons • {module.labs} labs
            </span>
          </div>

          <span className="font-mono text-xs font-bold text-emerald-400">
            +{module.xp} XP
          </span>
        </div>
      </div>

      {/* Progress & Action CTA */}
      <div className="mt-4 pt-2">
        <div className="mb-2 flex items-center justify-between text-xs font-mono">
          <span className={module.progress ? "text-emerald-400 font-semibold" : "text-slate-400"}>
            {isComplete ? "Completed" : module.progress ? `${module.progress}% complete` : "Not started"}
          </span>
          <span className={difficultyColors[module.difficulty]}>
            {module.difficulty}
          </span>
        </div>

        {module.progress > 0 && (
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#1E293B]">
            <div
              className="h-full bg-[#22C55E] transition-all duration-500"
              style={{ width: `${module.progress}%` }}
            />
          </div>
        )}

        <Link
          href="/learn/modules/active-directory-security"
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
            isStarted
              ? "bg-[#22C55E] text-[#090E12] hover:bg-[#4ADE80]"
              : isComplete
              ? "border border-slate-700 bg-slate-800 text-white hover:border-slate-500"
              : "border border-slate-700 bg-[#111A28] text-white hover:border-[#22C55E] hover:text-[#22C55E]"
          }`}
        >
          <span>{isComplete ? "Review Module" : isStarted ? "Continue Module" : "Start Module"}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function ModulesPage() {
  const [learnModules, setLearnModules] = useState<LearnModule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [showMoreRecommended, setShowMoreRecommended] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/modules`);
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((d: any) => ({
            ...d,
            category: d.stage === "offensive" ? "Web Security" : d.stage === "defensive" ? "Defense & SOC" : d.stage === "specialized" ? "Cloud Security" : "Linux",
            difficulty: "Intermediate",
            lessons: d.roomsCount || 4,
            labs: d.roomsCount || 4,
            hours: Math.round((d.estimatedMinutes || 120) / 60),
            progress: 0,
            xp: 500,
            featured: false,
          }));
          setLearnModules(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch modules", err);
      }
    };
    fetchModules();
  }, []);

  const filteredModules = useMemo(() => {
    let result = [...learnModules];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((m) => m.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedDifficulty !== "all") {
      result = result.filter((m) => m.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    if (selectedStatus === "completed") {
      result = result.filter((m) => m.progress === 100);
    } else if (selectedStatus === "in_progress") {
      result = result.filter((m) => m.progress > 0 && m.progress < 100);
    } else if (selectedStatus === "not_started") {
      result = result.filter((m) => m.progress === 0);
    }

    if (sortBy === "xp") {
      result.sort((a, b) => b.xp - a.xp);
    } else if (sortBy === "duration") {
      result.sort((a, b) => a.hours - b.hours);
    } else if (sortBy === "labs") {
      result.sort((a, b) => b.labs - a.labs);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedStatus, sortBy]);

  const recommendedModules = useMemo(() => {
    const list = learnModules.filter((m) => !m.featured);
    return showMoreRecommended ? list : list.slice(0, 4);
  }, [showMoreRecommended]);

  const osModules = useMemo(() => {
    return learnModules.filter((m) => m.category === "Linux" || m.category === "Windows" || m.category === "Network");
  }, [learnModules]);

  const webAndAdModules = useMemo(() => {
    return learnModules.filter((m) => m.category === "Web Security" || m.category === "Active Directory");
  }, [learnModules]);

  const defenseAndAdvancedModules = useMemo(() => {
    return learnModules.filter(
      (m) =>
        m.category === "Cloud Security" ||
        m.category === "Defense & SOC" ||
        m.category === "Binary Exploitation" ||
        m.category === "Reverse Engineering"
    );
  }, [learnModules]);

  const isFiltering =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedDifficulty !== "all" ||
    selectedStatus !== "all" ||
    sortBy !== "recommended";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
    setSortBy("recommended");
  };

  return (
    <div className="w-full">
      {/* 1. Modules Hero HUD */}
      <ModulesHero completedCount={18} totalCount={64} />

      {/* 2. Search & Multi-Filter Toolbar */}
      <section className="mb-10 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find modules by topic, protocol, CVE, or tool (e.g. Kerberos, Nmap, Burp, SUID)..."
            className="w-full rounded-xl border border-[#1E293B] bg-[#111A28] py-3.5 pl-11 pr-10 text-sm font-medium text-white placeholder:text-slate-400 focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
            >
              <option value="All">Category: All</option>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
            >
              <option value="all">Difficulty: All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
            >
              <option value="all">Status: All</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not_started">Not Started</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="xp">Highest XP</option>
              <option value="labs">Most Hands-on Labs</option>
              <option value="duration">Shortest Duration</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {isFiltering && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-[#22C55E] hover:text-[#22C55E]"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar pt-2 border-t border-[#1C273A]">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#22C55E] text-[#090E12] font-bold shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                    : "border border-[#1E293B] bg-[#111A28] text-slate-300 hover:border-slate-600 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Filtered Results View OR Sectioned Showcase */}
      {isFiltering ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h2 className="text-lg font-bold text-white">
              Filtered Modules ({filteredModules.length})
            </h2>
            <button
              onClick={resetFilters}
              className="text-xs font-medium text-slate-400 hover:text-white"
            >
              Clear all filters
            </button>
          </div>

          {filteredModules.length === 0 ? (
            <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-12 text-center">
              <p className="text-base font-semibold text-white">No modules match your filter criteria</p>
              <p className="mt-1 text-xs text-slate-400">Try adjusting your keywords or clearing the active category.</p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#090E12]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-12">
          {/* SECTION 1: Recommended for you */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Recommended for you
                </h2>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Hand-picked modules tailored for your current offensive security progression.
                </p>
              </div>

              <button
                onClick={() => setShowMoreRecommended((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#111A28] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                <span>{showMoreRecommended ? "Show Less" : "Show More"}</span>
              </button>
            </div>

            {/* Featured Active Directory Banner */}
            <FeaturedModuleBanner />

            {/* 4 Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>

            {/* Feedback Prompt */}
            <div className="mt-5 flex items-center justify-end gap-3 text-xs text-slate-400">
              <span>Are these modules matching your current skill level?</span>
              {feedbackGiven ? (
                <span className="font-medium text-emerald-400">
                  ✓ Thanks for your feedback!
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFeedbackGiven("up")}
                    aria-label="Thumbs up"
                    className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    <ThumbsUp size={15} />
                  </button>
                  <button
                    onClick={() => setFeedbackGiven("down")}
                    aria-label="Thumbs down"
                    className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    <ThumbsDown size={15} />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 2: Core Operating Systems & Fundamentals */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Core Operating Systems & Fundamentals
              </h2>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                Master command-line proficiency, Windows internals, and network packet analysis.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {osModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </section>

          {/* SECTION 3: Offensive Web & Active Directory */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Web & Enterprise Exploitation
              </h2>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                Kerberoasting, Domain Controller pivoting, OWASP Top 10, and API vulnerability exploitation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {webAndAdModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </section>

          {/* SECTION 4: Cloud, Defense & Binary Exploitation */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Cloud, Defense & Binary Exploitation
              </h2>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                AWS IAM auditing, SOC incident triage, x86_64 ROP chains, and Ghidra decompilation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {defenseAndAdvancedModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
