import {
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  Code2,
  Flame,
  Gauge,
  Globe,
  Group,
  Lock,
  MonitorPlay,
  Network,
  Radar,
  Rocket,
  Route,
  Search,
  Send,
  Shield,
  Terminal,
  Trophy
} from "lucide-react";

import type { MissionCard, SkillStat } from "@hackers-campus/shared-types";

const navItems = ["Dashboard", "Learn", "Practice", "CTF"];

const missions: Array<MissionCard & { action: string; icon: "shield" | "terminal" | "book" }> = [
  {
    id: "daily-login",
    title: "Daily Login",
    subtitle: "Log in to Campus",
    xp: 25,
    status: "completed",
    action: "Completed",
    icon: "shield"
  },
  {
    id: "medium-lab",
    title: "Solve Medium Lab",
    subtitle: "Any category",
    xp: 100,
    status: "active",
    action: "Start",
    icon: "terminal"
  },
  {
    id: "continue-module",
    title: "Continue Module",
    subtitle: "Complete 1 lesson",
    xp: 50,
    status: "active",
    action: "Continue",
    icon: "book"
  }
];

const skills: SkillStat[] = [
  { label: "Web", level: 75 },
  { label: "Linux", level: 70 },
  { label: "AD", level: 57 },
  { label: "Cloud", level: 35 },
  { label: "Network", level: 61 }
];

const journeySteps = [
  { label: "Start", state: "done" },
  { label: "Basics", state: "done" },
  { label: "Linux", state: "done" },
  { label: "Network", state: "done" },
  { label: "Web", state: "done" },
  { label: "Active Dir", state: "current" },
  { label: "Adv. Pentest", state: "locked" }
] as const;

const activityColumns = [
  [0, 2, 0, 3, 0, 4, 0],
  [2, 3, 4, 0, 0, 2, 3],
  [0, 0, 2, 0, 3, 0, 4],
  [4, 0, 3, 0, 0, 2, 0],
  [0, 2, 3, 4, 0, 0, 0],
  [0, 2, 3, 0, 0, 4, 0],
  [2, 3, 4, 0, 2, 0, 0],
  [0, 0, 4, 2, 3, 0, 0]
];

const achievements = [
  {
    labelTop: "Linux",
    labelBottom: "Explorer",
    icon: "P",
    tone: "bg-[#1e2a38] border-[#2c3d52] text-sky-300"
  },
  {
    labelTop: "First",
    labelBottom: "Blood",
    icon: "F",
    tone: "bg-[#381e1e] border-[#522c2c] text-rose-300"
  },
  {
    labelTop: "7 Day",
    labelBottom: "Streak",
    icon: "S",
    tone: "bg-[#382b1e] border-[#52412c] text-amber-300"
  },
  {
    labelTop: "Web",
    labelBottom: "Initiate",
    icon: "W",
    tone: "bg-[#1e3825] border-[#2c5236] text-emerald-300"
  }
];

const footerGroups = [
  {
    title: "Platform",
    links: ["Dashboard", "Academy", "Labs", "CTF"]
  },
  {
    title: "Resources",
    links: ["Documentation", "Community", "Blog", "Support"]
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Privacy", "Terms"]
  }
];

const socialIcons = [Globe, MonitorPlay, Group, Terminal, Code2, BookOpen, Send];

function MissionIcon({ icon, done }: { icon: "shield" | "terminal" | "book"; done: boolean }) {
  if (icon === "terminal") {
    return <Terminal className="text-muted" size={18} />;
  }

  if (icon === "book") {
    return <BookOpen className="text-muted" size={18} />;
  }

  return <Shield className={done ? "text-lime" : "text-muted"} size={18} />;
}

function MissionTile({ mission }: { mission: (typeof missions)[number] }) {
  const isDone = mission.status === "completed";

  return (
    <div
      className={`sub-panel flex min-h-[152px] flex-col justify-between p-4 ${
        isDone ? "opacity-60" : mission.id === "medium-lab" ? "border-l-2 border-l-lime" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className={`text-xl font-medium text-ink ${isDone ? "line-through" : ""}`}>
            {mission.title}
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            {mission.subtitle}
          </p>
        </div>
        <MissionIcon icon={mission.icon} done={isDone} />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3">
        <span className={`font-mono text-sm ${isDone ? "text-lime" : "text-muted"}`}>
          +{mission.xp} XP
        </span>
        {isDone ? (
          <span className="font-mono text-xs text-muted">{mission.action}</span>
        ) : (
          <button className="inline-flex items-center gap-1 border border-panelBorder px-3 py-1.5 font-mono text-xs text-ink transition hover:bg-[#151d23] hover:text-lime">
            {mission.action}
            <ArrowRight size={14} />
          </button>
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
      <polygon className="fill-none stroke-[#1C252D]" points="100,20 176,75 147,163 53,163 24,75" />
      <polygon className="fill-none stroke-[#1C252D]" points="100,40 157,81 135,147 65,147 43,81" />
      <polygon className="fill-none stroke-[#1C252D]" points="100,60 138,87 123,130 77,130 62,87" />
      <polygon className="fill-none stroke-[#1C252D]" points="100,80 119,94 112,115 88,115 81,94" />
      <line x1="100" y1="100" x2="100" y2="20" className="stroke-[#1C252D]" />
      <line x1="100" y1="100" x2="176" y2="75" className="stroke-[#1C252D]" />
      <line x1="100" y1="100" x2="147" y2="163" className="stroke-[#1C252D]" />
      <line x1="100" y1="100" x2="53" y2="163" className="stroke-[#1C252D]" />
      <line x1="100" y1="100" x2="24" y2="75" className="stroke-[#1C252D]" />
      <polygon points={polygon} fill="rgba(157,255,0,0.2)" stroke="#9DFF00" strokeWidth="2" />
      <text fill="#98A2B0" fontSize="10" textAnchor="middle" x="100" y="15">
        Web
      </text>
      <text fill="#98A2B0" fontSize="10" textAnchor="start" x="184" y="75">
        Linux
      </text>
      <text fill="#98A2B0" fontSize="10" textAnchor="start" x="155" y="175">
        AD
      </text>
      <text fill="#98A2B0" fontSize="10" textAnchor="end" x="45" y="175">
        Cloud
      </text>
      <text fill="#98A2B0" fontSize="10" textAnchor="end" x="16" y="75">
        Network
      </text>
    </svg>
  );
}

function ProgressRing() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-divider">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-divider"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray="68, 100"
          strokeWidth="3"
          className="text-lime"
        />
      </svg>
      <span className="text-xl font-medium text-ink">68%</span>
    </div>
  );
}

function ActivityHeatmap() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {activityColumns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-1">
          {column.map((level, rowIndex) => {
            const tone = [
              "bg-divider",
              "bg-[#3e6a00]",
              "bg-[#427000]",
              "bg-lime/70",
              "bg-lime"
            ][level];

            return <div key={`${columnIndex}-${rowIndex}`} className={`h-3 w-3 rounded-[2px] ${tone}`} />;
          })}
        </div>
      ))}
    </div>
  );
}

export function MissionControlDashboard() {
  return (
    <>
      <main className="terminal-grid min-h-screen bg-canvas pb-8 text-ink">
        <nav className="sticky top-0 z-50 border-b border-divider bg-canvas/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-8">
            <div className="flex items-center gap-8">
              <span className="text-[2rem] font-bold tracking-tight text-lime">Hacker Campus</span>
              <div className="hidden items-center gap-6 text-lg md:flex">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={
                      item === "Dashboard"
                        ? "border-b-2 border-lime pb-1 text-lime"
                        : "pb-1 text-muted transition-colors hover:text-ink"
                    }
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted">
              <button aria-label="Search" className="transition hover:text-ink">
                <Search size={20} />
              </button>
              <button aria-label="Notifications" className="transition hover:text-ink">
                <Bell size={20} />
              </button>
              <div className="lime-ring ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-divider bg-panelSubtle font-mono text-xs text-lime">
                HC
              </div>
            </div>
          </div>
        </nav>

        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 pb-8 pt-10 md:px-8">
          <header className="mb-1">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-5xl font-semibold tracking-[-0.02em] md:text-7xl">
                  Welcome back, Pavan
                </h1>
                <p className="mt-3 text-2xl text-muted">Level 12 Specialist</p>
              </div>
              <div className="w-full md:w-64">
                <div className="mb-1 flex justify-between text-sm text-muted">
                  <span>XP Progress</span>
                  <span className="font-semibold text-lime">2,450 / 3,000 XP</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-divider">
                  <div className="h-full w-[81%] rounded-full bg-lime" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 font-mono text-sm text-muted">
              <div className="sub-panel flex items-center gap-3 px-4 py-3">
                <Flame className="text-orange-400" size={16} />
                7 Day Streak
              </div>
              <div className="sub-panel flex items-center gap-3 px-4 py-3">
                <Gauge className="text-amber-400" size={16} />
                2,450 XP
              </div>
              <div className="sub-panel flex items-center gap-3 px-4 py-3">
                <Trophy className="text-sky-400" size={16} />
                Rank #1,284
              </div>
              <div className="sub-panel flex items-center gap-3 px-4 py-3">
                <Shield className="text-violet-300" size={16} />
                18 Badges
              </div>
            </div>
          </header>

          <section className="panel p-6">
            <div className="mb-4 flex items-center justify-between border-b border-divider pb-2">
              <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-muted">Today&apos;s Missions</h2>
              <span className="font-mono text-sm text-ink">1 / 3 COMPLETE</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {missions.map((mission) => (
                <MissionTile key={mission.id} mission={mission} />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <section className="panel h-full p-6">
                <div className="mb-4 flex items-center justify-between border-b border-divider pb-2">
                  <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-muted">
                    Continue Your Mission
                  </h2>
                  <Terminal className="text-muted" size={18} />
                </div>

                <div className="mb-6">
                  <h3 className="text-[2rem] font-semibold uppercase tracking-[-0.01em] text-ink md:text-[2.35rem]">
                    Active Directory Penetration Tester
                  </h3>
                  <p className="mt-2 text-2xl text-muted">Module: Kerberos &amp; Authentication</p>
                </div>

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                  <ProgressRing />
                  <div className="flex flex-1 flex-col gap-4 md:flex-row">
                    <div className="sub-panel flex-1 p-4">
                      <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Modules</div>
                      <div className="mt-2 text-4xl font-semibold text-ink">8/12</div>
                    </div>
                    <div className="sub-panel flex-1 p-4">
                      <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Labs</div>
                      <div className="mt-2 text-4xl font-semibold text-ink">24/35</div>
                    </div>
                    <div className="sub-panel flex-1 p-4">
                      <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Time Spent</div>
                      <div className="mt-2 text-4xl font-semibold text-ink">6h 20m</div>
                    </div>
                  </div>
                </div>

                <div className="sub-panel mt-auto flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-lime">Next Up</p>
                    <p className="mt-2 text-lg text-ink">
                      Kerberos Enumeration{" "}
                      <span className="text-muted">(Intermediate - 45 min - +150 XP)</span>
                    </p>
                  </div>
                  <button className="inline-flex w-full items-center justify-center gap-2 bg-lime px-6 py-3 text-sm font-semibold text-canvas transition hover:bg-limeDim sm:w-auto">
                    Continue Learning
                    <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <section className="panel h-full p-6">
                <div className="mb-4 flex items-center justify-between border-b border-divider pb-2">
                  <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-muted">
                    Cyber Skill Radar
                  </h2>
                  <Radar className="text-muted" size={18} />
                </div>
                <div className="mb-4 flex h-48 items-center justify-center">
                  <SkillRadar />
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Strongest Skill:</span>
                    <span className="font-mono text-lime">Linux (Lvl 8)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Fastest Growing:</span>
                    <span className="font-mono text-ink">Active Directory</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Needs Practice:</span>
                    <span className="font-mono text-orange-400">Cloud Sec</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="panel p-6">
            <div className="mb-6 flex items-center justify-between border-b border-divider pb-2">
              <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-muted">
                Cyber Journey Path
              </h2>
              <Route className="text-muted" size={18} />
            </div>

            <div className="relative overflow-x-auto py-4">
              <div className="absolute left-4 right-4 top-1/2 hidden h-1 -translate-y-1/2 bg-divider md:block" />
              <div className="absolute left-4 top-1/2 hidden h-1 w-3/5 -translate-y-1/2 bg-lime md:block" />
              <div className="relative z-10 flex min-w-max flex-nowrap gap-10 md:min-w-0 md:justify-between">
                {journeySteps.map((step) => {
                  const current = step.state === "current";
                  const done = step.state === "done";
                  const locked = step.state === "locked";

                  return (
                    <div key={step.label} className="flex flex-col items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          current
                            ? "border-2 border-lime bg-canvas text-lime"
                            : done
                              ? "bg-lime text-canvas"
                              : "bg-divider text-muted"
                        }`}
                      >
                        {done ? (
                          <Check size={16} />
                        ) : current ? (
                          <div className="h-3 w-3 rounded-full bg-lime animate-pulse" />
                        ) : (
                          <Lock size={16} />
                        )}
                      </div>
                      <span
                        className={`font-mono text-sm ${
                          current ? "font-bold text-ink" : locked ? "text-muted" : "text-muted"
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

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <section className="panel p-6">
              <div className="mb-4 flex items-center justify-between border-b border-divider pb-2">
                <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-muted">Activity</h2>
                <div className="text-right text-sm">
                  <span className="mr-4 text-ink">28 Active Days</span>
                  <span className="text-lime">1,840 XP this month</span>
                </div>
              </div>
              <ActivityHeatmap />
            </section>

            <section className="panel p-6">
              <div className="mb-4 flex items-center justify-between border-b border-divider pb-2">
                <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-muted">
                  Recent Achievements
                </h2>
                <Trophy className="text-muted" size={18} />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {achievements.map((achievement) => (
                  <div key={achievement.labelTop} className="flex min-w-[80px] flex-col items-center gap-1">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border text-lg shadow-lg ${achievement.tone}`}
                    >
                      {achievement.icon}
                    </div>
                    <span className="text-center font-mono text-[11px] leading-tight text-muted">
                      {achievement.labelTop}
                      <br />
                      {achievement.labelBottom}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="sub-panel flex flex-col items-start justify-between gap-6 border border-lime bg-[linear-gradient(45deg,transparent_25%,rgba(157,255,0,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] p-6 md:flex-row md:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-ink">
                <Network className="text-lime" size={20} />
                Recommended Next Move
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-muted">
                Based on your skill radar, you&apos;re building strong Active Directory knowledge.
                Level up your enumeration skills to bridge the gap before advancing to cloud
                security concepts.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 bg-lime px-8 py-4 text-lg font-semibold text-canvas transition hover:bg-limeDim">
              Start AD Enumeration
              <Rocket size={18} />
            </button>
          </section>
        </div>
      </main>

      <footer className="border-t border-panelBorder bg-[#080d11] pb-8 pt-8">
        <div className="mx-auto max-w-[1440px] px-6 md:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="mb-1 text-xl font-bold text-lime">HACKERS CAMPUS</div>
              <p className="text-muted">Learn. Practice. Compete.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-5">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-ink">
                    {group.title}
                  </h4>
                  <ul className="space-y-3 text-sm text-muted">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="transition-colors hover:text-lime">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-ink">
                Follow Hackers Campus
              </h4>
              <div className="flex flex-wrap gap-4 text-muted">
                {socialIcons.map((Icon, index) => (
                  <a key={index} href="#" className="transition-colors hover:text-lime">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-panelBorder pt-6 text-sm md:flex-row">
            <p className="text-[#687380]">Copyright 2026 Hackers Campus. All rights reserved.</p>
            <p className="font-mono text-[#687380]">Made for hackers.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
