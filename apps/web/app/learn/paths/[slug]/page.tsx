"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Crosshair,
  Flame,
  GraduationCap,
  Layers,
  Lock,
  Network,
  RotateCcw,
  Shield,
  ShieldCheck,
  Signal,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Route } from "next";

// ── Data ─────────────────────────────────────────────────────────────────────

interface RoomItem {
  id: string;
  title: string;
  icon: "flame" | "shield" | "terminal" | "network" | "lock";
  completed: boolean;
  locked?: boolean;
  xp: number;
  href: string;
}

interface PathSection {
  sectionNumber: number;
  title: string;
  rooms: RoomItem[];
}

interface PathDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  modules: number;
  labs: number;
  estimatedHours: number;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  totalXp: number;
  enrolled: boolean;
  progress: number;
  certTitle: string;
  certCode: string;
  sections: PathSection[];
}

const PATHS_CATALOG: Record<string, PathDetail> = {
  "foundation": {
    id: "foundation",
    slug: "foundation",
    title: "Cybersecurity Foundation Track",
    category: "CORE PREREQUISITE",
    tagline: "Master core computer science fundamentals, Linux command line, networking protocols, and basic security concepts.",
    description: "The essential launchpad for every security professional. This track covers the foundational architecture of modern computing, operating systems, network traffic flow, and defensive principles necessary before advancing to specialized offensive or defensive tracks.",
    modules: 11,
    labs: 42,
    estimatedHours: 48,
    estimatedMinutes: 30,
    difficulty: "Beginner",
    totalXp: 5400,
    enrolled: true,
    progress: 60,
    certTitle: "HC Certified Foundation Operator",
    certCode: "HCFO",
    sections: [
      {
        sectionNumber: 1,
        title: "Computing & Operating System Internals",
        rooms: [
          { id: "f-01", title: "Windows Fundamentals 1",       icon: "terminal", completed: true,  xp: 250, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "f-02", title: "Linux Command Line Basics",      icon: "terminal", completed: true,  xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "f-03", title: "Processes, Memory & File Systems", icon: "shield",   completed: true,  xp: 250, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "f-04", title: "User Permissions & Access Control", icon: "terminal", completed: false, xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
        ],
      },
      {
        sectionNumber: 2,
        title: "Network Protocols & Traffic Analysis",
        rooms: [
          { id: "f-05", title: "TCP/IP & OSI 7-Layer Model",      icon: "network",  completed: true,  xp: 250, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "f-06", title: "DNS, DHCP & Routing Basics",      icon: "network",  completed: false, xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "f-07", title: "HTTP/HTTPS & Web Communication",  icon: "network",  completed: false, xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "f-08", title: "Foundations Capstone Assessment", icon: "lock",     completed: false, locked: true, xp: 400, href: "/learn/rooms/windows-fundamentals-1" },
        ],
      },
    ],
  },
  "offensive-security-operator": {
    id: "offensive-security-operator",
    slug: "offensive-security-operator",
    title: "Offensive Security Operator (Red Team)",
    category: "CAREER TRACK",
    tagline: "Build the attack mindset and hands-on skills needed to launch your career in offensive cybersecurity.",
    description: "This career track takes you from zero to operator-level in offensive security. You'll master recon, exploitation, privilege escalation, and Active Directory abuse through real lab environments. By the end you'll have the practical depth to tackle entry-level penetration testing roles and industry certifications.",
    modules: 20,
    labs: 112,
    estimatedHours: 102,
    estimatedMinutes: 45,
    difficulty: "Intermediate",
    totalXp: 11200,
    enrolled: true,
    progress: 34,
    certTitle: "HC Certified Offensive Operator",
    certCode: "HCOO",
    sections: [
      {
        sectionNumber: 1,
        title: "Hacker Foundations",
        rooms: [
          { id: "r-01", title: "How Hackers Think",              icon: "flame",    completed: true,  xp: 250, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-02", title: "The Defender's Perspective",     icon: "shield",   completed: true,  xp: 250, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-03", title: "OSINT & Information Gathering",  icon: "network",  completed: true,  xp: 200, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-04", title: "Linux for Hackers — Basics",     icon: "terminal", completed: false, xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-05", title: "Linux for Hackers — Advanced",   icon: "terminal", completed: false, xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-06", title: "Section Challenge Lab",          icon: "lock",     completed: false, locked: true, xp: 150, href: "/learn/rooms/windows-fundamentals-1" },
        ],
      },
      {
        sectionNumber: 2,
        title: "Attack Methodology & Lab Techniques",
        rooms: [
          { id: "r-07", title: "Web Application Attack Walkthrough",   icon: "flame",    completed: false, xp: 500, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-08", title: "Infrastructure Takeover Lab",          icon: "flame",    completed: false, xp: 500, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-09", title: "Attack Phases Breakdown",              icon: "shield",   completed: false, xp: 400, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-10", title: "Attacker Lifecycle (ATT&CK)",          icon: "network",  completed: false, xp: 350, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-11", title: "Offensive Toolkits & Frameworks",      icon: "terminal", completed: false, xp: 400, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-12", title: "Section Challenge Lab",                icon: "lock",     completed: false, locked: true, xp: 150, href: "/learn/rooms/windows-fundamentals-1" },
        ],
      },
      {
        sectionNumber: 3,
        title: "Recon & Network Mapping",
        rooms: [
          { id: "r-13", title: "Footprinting Targets",         icon: "network",  completed: false, xp: 350, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-14", title: "Live Host & Port Discovery",    icon: "flame",    completed: false, xp: 400, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-15", title: "Service Enumeration",          icon: "terminal", completed: false, xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "r-16", title: "Advanced Network Analysis",    icon: "terminal", completed: false, xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
        ],
      },
      {
        sectionNumber: 4,
        title: "Exploitation & Privilege Escalation",
        rooms: [
          { id: "r-17", title: "CVE Research & Vuln Scoring",     icon: "shield",   completed: false, xp: 400, href: "/learn/rooms/kerberos-fundamentals" },
          { id: "r-18", title: "Weaponising Exploits",            icon: "flame",    completed: false, xp: 500, href: "/learn/rooms/kerberos-fundamentals" },
          { id: "r-19", title: "Automated Exploitation Tooling",  icon: "terminal", completed: false, xp: 450, href: "/learn/rooms/kerberos-fundamentals" },
          { id: "r-20", title: "Post-Exploitation Persistence",   icon: "terminal", completed: false, xp: 500, href: "/learn/rooms/kerberos-fundamentals" },
          { id: "r-21", title: "Boss Room — Full Chain Attack",   icon: "flame",    completed: false, locked: true, xp: 800, href: "/learn/rooms/kerberos-fundamentals" },
        ],
      },
    ],
  },
  "soc-threat-analyst": {
    id: "soc-threat-analyst",
    slug: "soc-threat-analyst",
    title: "SOC Threat Analyst (Blue Team)",
    category: "DEFENSIVE TRACK",
    tagline: "Master SIEM log analysis, network packet triage, endpoint telemetry, and incident containment.",
    description: "Prepare for security operations center analyst and incident responder roles. You'll investigate real-world malware infections, parse complex Windows event logs, query Splunk and Elastic SIEM, and author YARA and Sigma detection rules.",
    modules: 16,
    labs: 78,
    estimatedHours: 85,
    estimatedMinutes: 0,
    difficulty: "Intermediate",
    totalXp: 8900,
    enrolled: true,
    progress: 25,
    certTitle: "HC Certified Defensive Analyst",
    certCode: "HCDA",
    sections: [
      {
        sectionNumber: 1,
        title: "Security Operations & Telemetry",
        rooms: [
          { id: "d-01", title: "SOC Analyst Fundamentals",         icon: "shield",   completed: true,  xp: 250, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "d-02", title: "Windows Event Logs Analysis",      icon: "terminal", completed: true,  xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "d-03", title: "Sysmon Telemetry & Deep Logging",  icon: "terminal", completed: false, xp: 350, href: "/learn/rooms/windows-fundamentals-1" },
        ],
      },
      {
        sectionNumber: 2,
        title: "SIEM & Network Threat Hunting",
        rooms: [
          { id: "d-04", title: "Splunk SIEM Query Language (SPL)", icon: "terminal", completed: false, xp: 400, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "d-05", title: "Wireshark Network Forensics",       icon: "network",  completed: false, xp: 350, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "d-06", title: "Snort & Suricata IDS Alert Rules", icon: "shield",   completed: false, xp: 400, href: "/learn/rooms/windows-fundamentals-1" },
        ],
      },
    ],
  },
};

// Default fallback generator for any slug
function getPathForSlug(slug: string): PathDetail {
  if (PATHS_CATALOG[slug]) {
    return PATHS_CATALOG[slug];
  }

  // Generate a clean title from slug
  const titleFromSlug = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: slug,
    slug: slug,
    title: `${titleFromSlug} Track`,
    category: "CAREER TRACK",
    tagline: `Master hands-on technical skills and security methodologies in ${titleFromSlug}.`,
    description: `This structured curriculum takes you step-by-step through key concepts, hands-on attack and defense scenarios, and lab assessments tailored to ${titleFromSlug}.`,
    modules: 12,
    labs: 36,
    estimatedHours: 42,
    estimatedMinutes: 0,
    difficulty: "Intermediate",
    totalXp: 6800,
    enrolled: true,
    progress: 15,
    certTitle: `HC Certified in ${titleFromSlug}`,
    certCode: `HC-${slug.slice(0, 3).toUpperCase()}`,
    sections: [
      {
        sectionNumber: 1,
        title: `${titleFromSlug} Fundamentals`,
        rooms: [
          { id: "gen-01", title: `Introduction to ${titleFromSlug}`, icon: "shield",   completed: true,  xp: 250, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "gen-02", title: "Core Protocols & Architecture",   icon: "network",  completed: false, xp: 300, href: "/learn/rooms/windows-fundamentals-1" },
          { id: "gen-03", title: "Practical Lab Walkthrough",       icon: "terminal", completed: false, xp: 350, href: "/learn/rooms/windows-fundamentals-1" },
        ],
      },
      {
        sectionNumber: 2,
        title: "Hands-on Exploitation & Defense",
        rooms: [
          { id: "gen-04", title: "Vulnerability Assessment",        icon: "flame",    completed: false, xp: 400, href: "/learn/rooms/kerberos-fundamentals" },
          { id: "gen-05", title: "Advanced Exploitation Scenario",  icon: "flame",    completed: false, xp: 500, href: "/learn/rooms/kerberos-fundamentals" },
          { id: "gen-06", title: "Capstone Practical Challenge",    icon: "lock",     completed: false, locked: true, xp: 600, href: "/learn/rooms/kerberos-fundamentals" },
        ],
      },
    ],
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RoomIcon({ icon, completed, locked }: { icon: RoomItem["icon"]; completed: boolean; locked?: boolean }) {
  const base = "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg";
  if (locked) return (
    <div className={`${base} border border-slate-700/60 bg-slate-800/60`}>
      <Lock size={14} className="text-slate-500" />
    </div>
  );
  if (completed) return (
    <div className={`${base} border border-emerald-500/30 bg-emerald-950/40`}>
      <CheckCircle2 size={15} className="text-emerald-400" />
    </div>
  );
  const map: Record<string, React.ReactNode> = {
    flame:    <Flame    size={15} className="text-orange-400" />,
    shield:   <Shield   size={15} className="text-sky-400" />,
    terminal: <Terminal size={15} className="text-emerald-400" />,
    network:  <Network  size={15} className="text-purple-400" />,
    lock:     <Lock     size={14} className="text-slate-500" />,
  };
  const colorMap: Record<string, string> = {
    flame:    "border-orange-500/25 bg-orange-950/40",
    shield:   "border-sky-500/25 bg-sky-950/40",
    terminal: "border-emerald-500/25 bg-emerald-950/40",
    network:  "border-purple-500/25 bg-purple-950/40",
    lock:     "border-slate-700/60 bg-slate-800/60",
  };
  return (
    <div className={`${base} border ${colorMap[icon]}`}>
      {map[icon]}
    </div>
  );
}

function RoomRow({ room }: { room: RoomItem }) {
  return (
    <Link
      href={room.href as Route}
      className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-all duration-150 ${
        room.locked
          ? "border-[#1A2336] bg-[#0A1018] opacity-60 cursor-not-allowed pointer-events-none"
          : room.completed
          ? "border-emerald-500/20 bg-[#071812] hover:border-emerald-500/40"
          : "border-[#1A2336] bg-[#0C1422] hover:border-[#22C55E]/30 hover:bg-[#0E1A2E]"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <RoomIcon icon={room.icon} completed={room.completed} locked={room.locked} />
        <span className={`text-sm font-medium truncate ${
          room.locked ? "text-slate-500" : room.completed ? "text-emerald-300" : "text-slate-200 group-hover:text-white"
        }`}>
          {room.title}
        </span>
        {room.completed && (
          <span className="shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400">
            DONE
          </span>
        )}
        {room.locked && (
          <span className="shrink-0 rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[9px] text-slate-500">
            LOCKED
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-slate-500">
          <Zap size={10} className="text-amber-400" />
          {room.xp} XP
        </span>
        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300 transition" />
      </div>
    </Link>
  );
}

function SectionBlock({ section }: { section: PathSection }) {
  const [collapsed, setCollapsed] = useState(false);
  const completed = section.rooms.filter((r) => r.completed).length;

  return (
    <div className="rounded-2xl border border-[#1A2336] bg-[#090F1C] overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 hover:bg-[#0C1422] transition"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 font-mono text-[11px] font-bold text-emerald-400">
            {section.sectionNumber}
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
              Section {section.sectionNumber}
            </p>
            <h3 className="text-sm font-bold text-white leading-tight">{section.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:block font-mono text-[10px] text-slate-500">
            {completed}/{section.rooms.length} done
          </span>
          <ChevronRight
            size={14}
            className={`text-slate-500 transition-transform duration-200 ${collapsed ? "" : "rotate-90"}`}
          />
        </div>
      </button>

      {/* Rooms list */}
      {!collapsed && (
        <div className="divide-y divide-[#1A2336] border-t border-[#1A2336] px-4 py-3 space-y-2">
          {section.rooms.map((room) => (
            <RoomRow key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PathDetailPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "offensive-security-operator";

  const path = useMemo(() => {
    return getPathForSlug(rawSlug);
  }, [rawSlug]);

  const totalRooms = path.sections.reduce((s, sec) => s + sec.rooms.length, 0);
  const completedRooms = path.sections.reduce(
    (s, sec) => s + sec.rooms.filter((r) => r.completed).length,
    0
  );
  const progressPct = Math.round((completedRooms / totalRooms) * 100);

  return (
    <div className="min-h-screen bg-[#070D18] text-[#E2E8F0]">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden border-b border-[#1A2336] bg-gradient-to-b from-[#0C1525] to-[#070D18]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.10),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 font-mono text-xs text-slate-500">
            <Link href="/learn" className="hover:text-emerald-400 transition">Learn</Link>
            <ChevronRight size={12} />
            <Link href="/learn/roadmap" className="hover:text-emerald-400 transition">Roadmap</Link>
            <ChevronRight size={12} />
            <span className="text-slate-300">{path.title}</span>
          </div>

          <p className="font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase mb-2">
            {path.category}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {path.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            {path.tagline}
          </p>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap items-center gap-6 sm:gap-8 text-sm font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Layers size={15} className="text-slate-400" />
              <span className="font-bold text-white">{path.modules}</span>
              <span className="text-slate-400 text-xs">Modules</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Terminal size={15} className="text-slate-400" />
              <span className="font-bold text-white">{path.labs}</span>
              <span className="text-slate-400 text-xs">Hands-on labs</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={15} className="text-slate-400" />
              <span className="font-bold text-white">{path.estimatedHours}h {path.estimatedMinutes}m</span>
              <span className="text-slate-400 text-xs">Estimated time</span>
            </div>
            <div className="flex items-center gap-2">
              <Signal size={15} className="text-amber-400" />
              <span className="font-bold text-amber-400">{path.difficulty}</span>
              <span className="text-slate-400 text-xs">Difficulty level</span>
            </div>
          </div>

          {/* Enroll / progress */}
          <div className="mt-8">
            {path.enrolled ? (
              <div className="space-y-2 max-w-xs">
                <div className="flex justify-between font-mono text-xs text-slate-400">
                  <span>{progressPct}% complete</span>
                  <span>{completedRooms}/{totalRooms} rooms</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#1A2336] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <Link
                  href={(path.sections[0].rooms.find((r) => !r.completed && !r.locked)?.href || "#") as Route}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#22C55E] px-6 py-2.5 text-sm font-bold text-[#060C14] hover:bg-[#4ADE80] transition shadow-lg"
                >
                  Continue Path <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] px-6 py-2.5 text-sm font-bold text-[#060C14] hover:bg-[#4ADE80] transition shadow-lg">
                Enroll in path <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Body: 2-Column Layout ── */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="lg:w-72 xl:w-80 shrink-0 space-y-5">

            {/* Sidebar image card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#1A2336] bg-[#0C1422]">
              <div className="relative h-44 w-full bg-gradient-to-br from-[#0a0f1a] via-[#0d1528] to-[#060c14] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.18),transparent_70%)]" />
                {/* Stylized hacker figure SVG */}
                <svg viewBox="0 0 200 160" className="relative h-36 w-40 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" fill="none">
                  {/* Laptop body */}
                  <rect x="40" y="80" width="120" height="70" rx="6" fill="#1a1a2e" stroke="#ef4444" strokeWidth="1.5" />
                  <rect x="45" y="85" width="110" height="55" rx="3" fill="#0d0d1a" />
                  {/* Screen glow */}
                  <rect x="48" y="88" width="104" height="49" rx="2" fill="#ef4444" fillOpacity="0.08" />
                  {/* Code lines on screen */}
                  {[0,1,2,3].map((i) => (
                    <rect key={i} x="54" y={96 + i * 10} width={40 + (i % 3) * 20} height="3" rx="1.5" fill="#ef4444" fillOpacity={0.4 - i * 0.05} />
                  ))}
                  {/* Laptop base */}
                  <rect x="28" y="148" width="144" height="6" rx="3" fill="#1a1a2e" stroke="#ef4444" strokeWidth="1" />
                  {/* Person silhouette head */}
                  <circle cx="100" cy="45" r="18" fill="#0d0d1a" stroke="#ef4444" strokeWidth="1.5" />
                  {/* Skull mask */}
                  <circle cx="94" cy="43" r="4" fill="#ef4444" fillOpacity="0.7" />
                  <circle cx="106" cy="43" r="4" fill="#ef4444" fillOpacity="0.7" />
                  {/* Hoodie */}
                  <path d="M74 78 Q100 65 126 78 L122 82 Q100 72 78 82 Z" fill="#1a1a2e" stroke="#ef4444" strokeWidth="1" />
                  {/* Glow */}
                  <circle cx="100" cy="45" r="22" stroke="#ef4444" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="3 3" />
                  {/* HC badge */}
                  <rect x="14" y="10" width="52" height="16" rx="4" fill="#22c55e" />
                  <text x="40" y="22" textAnchor="middle" fill="#060c14" fontSize="8" fontWeight="bold" fontFamily="monospace">HC 2025</text>
                </svg>
              </div>
              <div className="p-4 text-xs text-slate-400 leading-relaxed">
                <p>Build real operator skills across every phase of an offensive engagement.</p>
                <ul className="mt-2 space-y-1 text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">•</span> Recon, enumeration, exploitation & post-exploitation</li>
                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">•</span> Guided labs with real attacker tooling</li>
                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">•</span> Active Directory, web apps & network attacks</li>
                </ul>
              </div>
            </div>

            {/* Certificate of completion */}
            <div className="rounded-2xl border border-[#1A2336] bg-[#0C1422] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-950/40">
                  <GraduationCap size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">HC Completion Certificate</p>
                  <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
                    Finish every lab and challenge in this track to earn your verified Hackers Campus certificate.
                  </p>
                </div>
              </div>
            </div>

            {/* Certification card */}
            <div className="rounded-2xl border border-[#1A2336] bg-[#0C1422] p-5">
              {/* Cert badge */}
              <div className="flex justify-center mb-4">
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
                    <polygon points="60,8 112,30 112,90 60,112 8,90 8,30" fill="#0f0010" stroke="#7c3aed" strokeWidth="2" />
                    <polygon points="60,18 104,36 104,84 60,102 16,84 16,36" fill="#0a0018" stroke="#9333ea" strokeWidth="1" />
                    <circle cx="60" cy="55" r="18" fill="#4f0090" fillOpacity="0.4" />
                  </svg>
                  <div className="relative z-10 text-center">
                    <ShieldCheck size={24} className="mx-auto text-purple-400" />
                    <p className="font-mono text-[8px] font-bold text-purple-300 mt-1">CERTIFIED</p>
                    <p className="font-mono text-[10px] font-extrabold text-white">{path.certCode}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold text-white text-center">{path.certTitle}</p>
              <p className="mt-1 text-[11px] text-slate-400 text-center leading-relaxed">
                Prove your skills with an industry-validated, hands-on offensive security credential.
              </p>
              <button className="mt-4 w-full rounded-lg border border-[#1A2336] bg-[#111C30] py-2 text-xs font-semibold text-slate-300 hover:border-emerald-500/40 hover:text-white transition">
                Learn more
              </button>
            </div>

            {/* Stats card */}
            <div className="rounded-2xl border border-[#1A2336] bg-[#0C1422] p-4 space-y-3">
              <p className="text-xs font-bold text-white">Path Stats</p>
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5"><Users size={12} /> Enrolled</span>
                  <span className="text-white font-bold">84,291</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5"><Trophy size={12} className="text-amber-400" /> Completions</span>
                  <span className="text-white font-bold">12,430</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5"><Zap size={12} className="text-emerald-400" /> Total XP</span>
                  <span className="text-emerald-400 font-bold">{path.totalXp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5"><Signal size={12} className="text-amber-400" /> Difficulty</span>
                  <span className="text-amber-400 font-bold">{path.difficulty}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Introduction */}
            <div className="rounded-2xl border border-[#1A2336] bg-[#0C1422] p-6">
              <h2 className="text-base font-bold text-emerald-400 mb-3">About This Track</h2>
              <p className="text-sm text-slate-300 leading-7">{path.description}</p>
            </div>

            {/* Sections */}
            {path.sections.map((section) => (
              <SectionBlock key={section.sectionNumber} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
