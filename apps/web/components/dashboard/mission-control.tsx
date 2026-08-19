"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  Flame,
  Gauge,
  Lock,
  Network,
  Radar,
  Rocket,
  Route as RouteIcon,
  Search,
  Shield,
  Terminal,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

/* ── Data & Types ──────────────────────────────────── */

interface MissionCard {
  id: string;
  title: string;
  subtitle: string;
  xp: number;
  status: "completed" | "active";
  action: string;
  href: string;
  icon: "shield" | "terminal" | "book";
}

const missions: MissionCard[] = [
  {
    id: "daily-login",
    title: "Daily Login",
    subtitle: "Log in to Campus",
    xp: 25,
    status: "completed",
    action: "Completed",
    href: "/learn",
    icon: "shield",
  },
  {
    id: "medium-lab",
    title: "Solve Medium Lab",
    subtitle: "Any category",
    xp: 100,
    status: "active",
    action: "Start",
    href: "/learn/rooms/kerberos-fundamentals",
    icon: "terminal",
  },
  {
    id: "continue-module",
    title: "Continue Module",
    subtitle: "Complete 1 lesson",
    xp: 50,
    status: "active",
    action: "Continue",
    href: "/learn/rooms/windows-fundamentals-1",
    icon: "book",
  },
];

const skills = [
  { label: "Web", level: 75 },
  { label: "Linux", level: 70 },
  { label: "AD", level: 57 },
  { label: "Cloud", level: 35 },
  { label: "Network", level: 61 },
];

const journeySteps = [
  { label: "Start", state: "done" },
  { label: "Basics", state: "done" },
  { label: "Linux", state: "done" },
  { label: "Network", state: "done" },
  { label: "Web", state: "done" },
  { label: "Active Dir", state: "current" },
  { label: "Adv. Pentest", state: "locked" },
] as const;

const activityColumns = [
  [0, 2, 0, 3, 0, 4, 0],
  [2, 3, 4, 0, 0, 2, 3],
  [0, 0, 2, 0, 3, 0, 4],
  [4, 0, 3, 0, 0, 2, 0],
  [0, 2, 3, 4, 0, 0, 0],
  [0, 2, 3, 0, 0, 4, 0],
  [2, 3, 4, 0, 2, 0, 0],
  [0, 0, 4, 2, 3, 0, 0],
  [1, 0, 2, 0, 3, 1, 0],
  [0, 2, 0, 4, 0, 2, 1],
  [2, 3, 1, 0, 2, 0, 3],
  [0, 1, 0, 3, 0, 2, 0],
];

const achievements = [
  {
    labelTop: "Linux",
    labelBottom: "Explorer",
    icon: "P",
    tone: "bg-[#1e2a38] border-[#2c3d52] text-sky-300",
  },
  {
    labelTop: "First",
    labelBottom: "Blood",
    icon: "F",
    tone: "bg-[#381e1e] border-[#522c2c] text-rose-300",
  },
  {
    labelTop: "7 Day",
    labelBottom: "Streak",
    icon: "S",
    tone: "bg-[#382b1e] border-[#52412c] text-amber-300",
  },
  {
    labelTop: "Web",
    labelBottom: "Initiate",
    icon: "W",
    tone: "bg-[#1e3825] border-[#2c5236] text-emerald-300",
  },
];

/* ── Sub-components ────────────────────────────────── */

function MissionIcon({ icon, done }: { icon: "shield" | "terminal" | "book"; done: boolean }) {
  if (icon === "terminal") {
    return <Terminal className="text-slate-400" size={18} />;
  }
  if (icon === "book") {
    return <BookOpen className="text-slate-400" size={18} />;
  }
  return <Shield className={done ? "text-[#22C55E]" : "text-slate-400"} size={18} />;
}

function MissionTile({ mission }: { mission: MissionCard }) {
  const isDone = mission.status === "completed";

  return (
    <div
      className={`sub-panel flex min-h-[152px] flex-col justify-between p-5 rounded-xl border border-[#1E293B] bg-[#0C1322] transition-all hover:border-slate-600 ${
        isDone ? "opacity-65" : mission.id === "medium-lab" ? "border-l-4 border-l-[#22C55E]" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className={`text-lg font-bold text-white ${isDone ? "line-through text-slate-400" : ""}`}>
            {mission.title}
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
            {mission.subtitle}
          </p>
        </div>
        <MissionIcon icon={mission.icon} done={isDone} />
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-[#1E293B]/60">
        <span className={`font-mono text-xs font-bold ${isDone ? "text-[#22C55E]" : "text-slate-400"}`}>
          +{mission.xp} XP
        </span>
        {isDone ? (
          <span className="font-mono text-xs text-slate-400">{mission.action}</span>
        ) : (
          <Link
            href={mission.href as Route}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-mono text-xs text-white transition hover:bg-[#22C55E] hover:text-[#090E12] hover:border-[#22C55E]"
          >
            <span>{mission.action}</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}

function SkillRadar() {
  const polygon = skills
    .map((skill, index) => {
      const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
      const radius = 58 * (skill.level / 100);
      const x = 100 + Math.cos(angle) * radius;
      const y = 100 + Math.sin(angle) * radius;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="h-full w-full max-w-[200px]">
      <polygon className="fill-none stroke-[#1E293B]" points="100,20 176,75 147,163 53,163 24,75" />
      <polygon className="fill-none stroke-[#1E293B]" points="100,40 157,81 135,147 65,147 43,81" />
      <polygon className="fill-none stroke-[#1E293B]" points="100,60 138,87 123,130 77,130 62,87" />
      <polygon className="fill-none stroke-[#1E293B]" points="100,80 119,94 112,115 88,115 81,94" />
      <line x1="100" y1="100" x2="100" y2="20" className="stroke-[#1E293B]" />
      <line x1="100" y1="100" x2="176" y2="75" className="stroke-[#1E293B]" />
      <line x1="100" y1="100" x2="147" y2="163" className="stroke-[#1E293B]" />
      <line x1="100" y1="100" x2="53" y2="163" className="stroke-[#1E293B]" />
      <line x1="100" y1="100" x2="24" y2="75" className="stroke-[#1E293B]" />
      <polygon points={polygon} fill="rgba(34,197,94,0.2)" stroke="#22C55E" strokeWidth="2" />
      <text fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle" x="100" y="15">
        Web
      </text>
      <text fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="start" x="184" y="75">
        Linux
      </text>
      <text fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="start" x="155" y="175">
        AD
      </text>
      <text fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end" x="45" y="175">
        Cloud
      </text>
      <text fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end" x="16" y="75">
        Network
      </text>
    </svg>
  );
}

function ProgressRing() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#1E293B]">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#22C55E"
          strokeDasharray="68, 100"
          strokeWidth="3"
        />
      </svg>
      <span className="font-mono text-sm font-bold text-white">68%</span>
    </div>
  );
}

function ActivityHeatmap() {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2">
      {activityColumns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-1.5">
          {column.map((level, rowIndex) => {
            const tone = [
              "bg-[#111A28] border border-[#1E293B]",
              "bg-emerald-950/80 border border-emerald-800/40",
              "bg-emerald-700/80",
              "bg-emerald-500",
              "bg-[#4ADE80] shadow-[0_0_6px_rgba(74,222,128,0.5)]",
            ][level];

            return <div key={`${columnIndex}-${rowIndex}`} className={`h-3.5 w-3.5 rounded-[3px] ${tone}`} />;
          })}
        </div>
      ))}
    </div>
  );
}

/* ── Main Dashboard ─────────────────────────────────── */

export function MissionControlDashboard() {
  return (
    <>
      <main className="terminal-grid w-full pb-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 pb-8 pt-8 sm:px-6 md:px-8">
          {/* Header Bar */}
          <header className="mb-1">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                  Welcome back, Pavan
                </h1>
                <p className="mt-2 text-base text-slate-400 font-mono">Level 12 Specialist</p>
              </div>

              <div className="w-full md:w-72">
                <div className="mb-1.5 flex justify-between font-mono text-xs text-slate-400">
                  <span>XP Progress</span>
                  <span className="font-bold text-[#22C55E]">2,450 / 3,000 XP</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#1E293B]">
                  <div className="h-full w-[81%] rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
              </div>
            </div>

            {/* Stat Badges */}
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <div className="sub-panel flex items-center gap-2.5 rounded-xl border border-[#1E293B] bg-[#0C1322] px-4 py-2.5 text-slate-300">
                <Flame className="text-orange-400" size={15} />
                <span>7 Day Streak</span>
              </div>
              <div className="sub-panel flex items-center gap-2.5 rounded-xl border border-[#1E293B] bg-[#0C1322] px-4 py-2.5 text-slate-300">
                <Gauge className="text-amber-400" size={15} />
                <span>2,450 XP</span>
              </div>
              <div className="sub-panel flex items-center gap-2.5 rounded-xl border border-[#1E293B] bg-[#0C1322] px-4 py-2.5 text-slate-300">
                <Trophy className="text-sky-400" size={15} />
                <span>Rank #1,284</span>
              </div>
              <div className="sub-panel flex items-center gap-2.5 rounded-xl border border-[#1E293B] bg-[#0C1322] px-4 py-2.5 text-slate-300">
                <Shield className="text-violet-300" size={15} />
                <span>18 Badges</span>
              </div>
            </div>
          </header>

          {/* Section 1: Today's Missions */}
          <section className="panel rounded-2xl border border-[#1E293B] bg-[#0C1322] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Today&apos;s Missions
              </h2>
              <span className="font-mono text-xs font-bold text-[#22C55E]">1 / 3 COMPLETE</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {missions.map((mission) => (
                <MissionTile key={mission.id} mission={mission} />
              ))}
            </div>
          </section>

          {/* Section 2: Continue Mission + Skill Radar */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left 8 Cols: Continue Your Mission */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              <section className="panel flex h-full flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#0C1322] p-6 shadow-xl">
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Continue Your Mission
                    </h2>
                    <Terminal className="text-slate-400" size={16} />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      Active Directory Penetration Tester
                    </h3>
                    <p className="mt-1 text-sm text-slate-400 font-mono">Module: Kerberos &amp; Authentication</p>
                  </div>

                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                    <ProgressRing />
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                      <div className="sub-panel flex-1 rounded-xl border border-[#1E293B] bg-[#080E1A] p-4 text-center">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Modules</div>
                        <div className="mt-1 text-2xl font-bold text-white">8/12</div>
                      </div>
                      <div className="sub-panel flex-1 rounded-xl border border-[#1E293B] bg-[#080E1A] p-4 text-center">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Labs</div>
                        <div className="mt-1 text-2xl font-bold text-white">24/35</div>
                      </div>
                      <div className="sub-panel flex-1 rounded-xl border border-[#1E293B] bg-[#080E1A] p-4 text-center">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Time Spent</div>
                        <div className="mt-1 text-2xl font-bold text-white">6h 20m</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Up Banner */}
                <div className="sub-panel mt-auto flex flex-col items-start justify-between gap-4 rounded-xl border border-[#1E293B] bg-[#080E1A] p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#22C55E]">Next Up</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Kerberos Enumeration{" "}
                      <span className="text-slate-400 font-normal font-mono text-xs">(Intermediate · 45 min · +150 XP)</span>
                    </p>
                  </div>
                  <Link
                    href="/learn/rooms/kerberos-fundamentals"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#22C55E] px-6 py-2.5 font-mono text-xs font-bold text-[#090E12] transition hover:bg-[#4ADE80] sm:w-auto shadow-md"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </section>
            </div>

            {/* Right 4 Cols: Cyber Skill Radar */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              <section className="panel flex h-full flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#0C1322] p-6 shadow-xl">
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Cyber Skill Radar
                    </h2>
                    <Radar className="text-slate-400" size={16} />
                  </div>

                  <div className="mb-4 flex h-48 items-center justify-center">
                    <SkillRadar />
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-[#1E293B] pt-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Strongest Skill:</span>
                    <span className="font-bold text-[#22C55E]">Linux (Lvl 8)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fastest Growing:</span>
                    <span className="font-bold text-white">Active Directory</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Needs Practice:</span>
                    <span className="font-bold text-orange-400">Cloud Sec</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Section 3: Cyber Journey Path */}
          <section className="panel rounded-2xl border border-[#1E293B] bg-[#0C1322] p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Cyber Journey Path
              </h2>
              <RouteIcon className="text-slate-400" size={16} />
            </div>

            <div className="relative overflow-x-auto py-4">
              <div className="absolute left-4 right-4 top-1/2 hidden h-1 -translate-y-1/2 bg-[#1E293B] md:block" />
              <div className="absolute left-4 top-1/2 hidden h-1 w-3/5 -translate-y-1/2 bg-[#22C55E] md:block" />
              <div className="relative z-10 flex min-w-max flex-nowrap gap-10 md:min-w-0 md:justify-between">
                {journeySteps.map((step) => {
                  const current = step.state === "current";
                  const done = step.state === "done";
                  const locked = step.state === "locked";

                  return (
                    <div key={step.label} className="flex flex-col items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                          current
                            ? "border-2 border-[#22C55E] bg-[#090E17] text-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            : done
                              ? "bg-[#22C55E] text-[#090E12]"
                              : "bg-[#1E293B] text-slate-500"
                        }`}
                      >
                        {done ? (
                          <Check size={16} />
                        ) : current ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                        ) : (
                          <Lock size={15} />
                        )}
                      </div>
                      <span
                        className={`font-mono text-xs ${
                          current ? "font-bold text-white" : locked ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 4: 2 Columns (Activity & Achievements) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Activity */}
            <section className="panel rounded-2xl border border-[#1E293B] bg-[#0C1322] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between border-b border-[#1E293B] pb-3">
                <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Activity</h2>
                <div className="text-right text-xs font-mono">
                  <span className="mr-4 text-slate-300">28 Active Days</span>
                  <span className="text-[#22C55E] font-bold">1,840 XP this month</span>
                </div>
              </div>
              <ActivityHeatmap />
            </section>

            {/* Right: Recent Achievements */}
            <section className="panel rounded-2xl border border-[#1E293B] bg-[#0C1322] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between border-b border-[#1E293B] pb-3">
                <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Recent Achievements
                </h2>
                <Trophy className="text-slate-400" size={16} />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {achievements.map((achievement) => (
                  <div key={achievement.labelTop} className="flex min-w-[80px] flex-col items-center gap-1.5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border text-base font-bold shadow-lg ${achievement.tone}`}
                    >
                      {achievement.icon}
                    </div>
                    <span className="text-center font-mono text-[10px] leading-tight text-slate-400">
                      {achievement.labelTop}
                      <br />
                      {achievement.labelBottom}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Section 5: Recommended Next Move */}
          <section className="sub-panel flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#22C55E]/40 bg-gradient-to-r from-[#0C1424] via-[#0E1A2E] to-[#0A1220] p-6 md:flex-row md:items-center shadow-xl">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <Network className="text-[#22C55E]" size={20} />
                Recommended Next Move
              </h2>
              <p className="mt-2 max-w-3xl text-xs text-slate-300 leading-relaxed sm:text-sm">
                Based on your skill radar, you&apos;re building strong Active Directory knowledge.
                Level up your enumeration skills to bridge the gap before advancing to cloud
                security concepts.
              </p>
            </div>
            <Link
              href="/learn/rooms/kerberos-fundamentals"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#22C55E] px-6 py-3 text-xs font-bold text-[#090E12] transition hover:bg-[#4ADE80] shadow-lg"
            >
              <span>Start AD Enumeration</span>
              <Rocket size={16} />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
