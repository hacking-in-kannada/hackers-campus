"use client";

import { useState } from "react";

const COLORS = [
  "#38BDF8", "#22C55E", "#F59E0B", "#A855F7",
  "#3B82F6", "#10B981", "#F97316", "#EAB308",
  "#EC4899", "#8B5CF6", "#06B6D4",
];

const users = [
  { name: "Pr0Hack3r",           score: 325, tasks: 8, time: 12 },
  { name: "f3qt86d76",           score: 250, tasks: 7, time: 18 },
  { name: "Cipher007",           score: 250, tasks: 7, time: 22 },
  { name: "Realix",              score: 250, tasks: 6, time: 30 },
  { name: "Akty",                score: 175, tasks: 5, time: 38 },
  { name: "Mehul",               score: 150, tasks: 5, time: 45 },
  { name: "0theplane10",         score: 125, tasks: 4, time: 55 },
  { name: "b4ng",                score: 100, tasks: 3, time: 62 },
  { name: "Knc3r",               score: 75,  tasks: 3, time: 70 },
  { name: "Hel.mi",              score: 50,  tasks: 2, time: 78 },
  { name: "pavanreddyx7",        score: 25,  tasks: 1, time: 88 },
];

const timeline = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

// Simulate cumulative score over time for top 5 users
const generateCurve = (finalScore: number, unlockAt: number) =>
  timeline.map((t) => {
    if (t < unlockAt) return 0;
    const progress = Math.min((t - unlockAt) / (90 - unlockAt), 1);
    return Math.round(finalScore * progress * progress);
  });

const topUsers = users.slice(0, 5).map((u, i) => ({
  ...u,
  color: COLORS[i],
  curve: generateCurve(u.score, u.time * 0.85),
}));

// Radar chart data
const radarMetrics = ["Speed", "Accuracy", "Stealth", "Exploit", "Recon", "Persistence"];
const radarUser = [0.9, 0.85, 0.7, 0.95, 0.8, 0.75];
const radarAvg  = [0.55, 0.6, 0.5, 0.6, 0.55, 0.5];

function polarToXY(angle: number, r: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function radarPoints(values: number[], cx: number, cy: number, maxR: number) {
  const step = 360 / values.length;
  return values.map((v, i) => {
    const { x, y } = polarToXY(i * step, v * maxR, cx, cy);
    return `${x},${y}`;
  }).join(" ");
}

export function RoomChartView() {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  const maxScore = 350;
  const chartW = 700;
  const chartH = 200;
  const padL = 40;
  const padR = 20;
  const padT = 10;
  const padB = 30;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const tx = (t: number) => padL + (t / 90) * innerW;
  const ty = (s: number) => padT + innerH - (s / maxScore) * innerH;

  // Bar chart data — top 8
  const barUsers = users.slice(0, 8);
  const barMax = 350;
  const barW = 680;
  const barH = 160;
  const barPad = 50;
  const barInner = barW - barPad * 2;
  const slotW = barInner / barUsers.length;
  const bw = slotW * 0.55;

  // Donut / completion ring
  const completedPct = 62.5; // 5 of 8 tasks
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = (completedPct / 100) * circ;

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Room Statistics</h3>
          <p className="text-xs text-slate-400">Live performance data across all participants</p>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* ── Row 1: Area Timeline + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Area Timeline */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1E293B] bg-[#0C1322] p-5">
          <p className="mb-1 text-xs font-bold text-white">Score Progression</p>
          <p className="mb-4 text-[11px] text-slate-500">Cumulative points over solve time (top 5)</p>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-52" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 100, 200, 300].map((v) => (
              <g key={v}>
                <line x1={padL} y1={ty(v)} x2={chartW - padR} y2={ty(v)} stroke="#1E293B" strokeWidth="1" />
                <text x={padL - 6} y={ty(v) + 4} fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="end">{v}</text>
              </g>
            ))}
            {/* X labels */}
            {[0, 30, 60, 90].map((t) => (
              <text key={t} x={tx(t)} y={chartH - 4} fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">{t}m</text>
            ))}

            {/* Area fills + lines */}
            {topUsers.map((u) => {
              const pts = timeline.map((t, i) => `${tx(t)},${ty(u.curve[i])}`).join(" ");
              const areaPath = `M ${tx(0)},${ty(0)} ` +
                timeline.map((t, i) => `L ${tx(t)},${ty(u.curve[i])}`).join(" ") +
                ` L ${tx(90)},${ty(0)} Z`;
              const linePath = `M ` + timeline.map((t, i) => `${tx(t)},${ty(u.curve[i])}`).join(" L ");
              const isHovered = hoveredUser === u.name;
              return (
                <g key={u.name}
                  onMouseEnter={() => setHoveredUser(u.name)}
                  onMouseLeave={() => setHoveredUser(null)}
                  style={{ cursor: "pointer" }}>
                  <path d={areaPath} fill={u.color} fillOpacity={isHovered ? 0.18 : 0.07} />
                  <path d={linePath} fill="none" stroke={u.color}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    strokeOpacity={isHovered ? 1 : 0.7} />
                  {/* Final dot */}
                  <circle cx={tx(90)} cy={ty(u.curve[18])} r={isHovered ? 4 : 2.5} fill={u.color} />
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3">
            {topUsers.map((u) => (
              <button key={u.name}
                onMouseEnter={() => setHoveredUser(u.name)}
                onMouseLeave={() => setHoveredUser(null)}
                className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono transition-all ${
                  hoveredUser === u.name ? "bg-white/10 text-white" : "text-slate-400"
                }`}>
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: u.color }} />
                {u.name}
              </button>
            ))}
          </div>
        </div>

        {/* Donut Ring */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#0C1322] p-5 flex flex-col items-center justify-center gap-3">
          <p className="text-xs font-bold text-white self-start">Your Completion</p>
          <svg viewBox="0 0 160 160" className="w-36 h-36">
            {/* Track */}
            <circle cx="80" cy="80" r={r} fill="none" stroke="#1E293B" strokeWidth="16" />
            {/* Progress */}
            <circle cx="80" cy="80" r={r} fill="none"
              stroke="url(#ringGrad)" strokeWidth="16"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={circ / 4}
              strokeLinecap="round" />
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <text x="80" y="75" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="monospace">
              {completedPct}%
            </text>
            <text x="80" y="95" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
              5 of 8 tasks
            </text>
          </svg>
          <div className="w-full space-y-1.5 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>XP Earned</span><span className="text-emerald-400 font-bold">175 XP</span>
            </div>
            <div className="flex justify-between">
              <span>Rank</span><span className="text-amber-400 font-bold">#6 / 11</span>
            </div>
            <div className="flex justify-between">
              <span>Time Spent</span><span className="text-white">45 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Bar Chart + Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Horizontal Bar Chart — Leaderboard */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#0C1322] p-5">
          <p className="mb-1 text-xs font-bold text-white">Leaderboard Scores</p>
          <p className="mb-4 text-[11px] text-slate-500">Total points per participant</p>
          <div className="space-y-2">
            {users.map((u, i) => {
              const pct = (u.score / barMax) * 100;
              return (
                <div key={u.name} className="flex items-center gap-3">
                  <span className="w-4 text-right font-mono text-[10px] text-slate-500">{i + 1}</span>
                  <span className="w-24 truncate font-mono text-[10px] text-slate-300">{u.name}</span>
                  <div className="flex-1 h-4 rounded bg-[#1E293B] overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${COLORS[i]}99, ${COLORS[i]})`,
                      }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-[10px] font-bold" style={{ color: COLORS[i] }}>
                    {u.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Radar / Spider Chart */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#0C1322] p-5 flex flex-col">
          <p className="mb-1 text-xs font-bold text-white">Skill Radar — You vs. Avg</p>
          <p className="mb-4 text-[11px] text-slate-500">Performance breakdown across 6 hacking disciplines</p>
          <div className="flex-1 flex items-center justify-center">
            <svg viewBox="0 0 220 220" className="w-52 h-52">
              {/* Grid rings */}
              {[0.25, 0.5, 0.75, 1].map((scale) => (
                <polygon key={scale}
                  points={radarPoints(Array(6).fill(scale), 110, 110, 80)}
                  fill="none" stroke="#1E293B" strokeWidth="1" />
              ))}
              {/* Axes */}
              {radarMetrics.map((_, i) => {
                const { x, y } = polarToXY(i * 60, 80, 110, 110);
                return <line key={i} x1="110" y1="110" x2={x} y2={y} stroke="#1E293B" strokeWidth="1" />;
              })}
              {/* Avg fill */}
              <polygon points={radarPoints(radarAvg, 110, 110, 80)}
                fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.6" />
              {/* User fill */}
              <polygon points={radarPoints(radarUser, 110, 110, 80)}
                fill="#22C55E" fillOpacity="0.2" stroke="#22C55E" strokeWidth="2" />
              {/* Labels */}
              {radarMetrics.map((label, i) => {
                const { x, y } = polarToXY(i * 60, 97, 110, 110);
                return (
                  <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                    fill="#94A3B8" fontSize="8" fontFamily="monospace">{label}</text>
                );
              })}
              {/* Dots */}
              {radarUser.map((v, i) => {
                const { x, y } = polarToXY(i * 60, v * 80, 110, 110);
                return <circle key={i} cx={x} cy={y} r="3" fill="#22C55E" />;
              })}
            </svg>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2 font-mono text-[10px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> You
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-400" /> Room Avg
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 3: Vertical Bar — Task XP breakdown ── */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0C1322] p-5">
        <p className="mb-1 text-xs font-bold text-white">XP per Task</p>
        <p className="mb-4 text-[11px] text-slate-500">Points awarded for each completed objective</p>
        <svg viewBox={`0 0 ${barW} ${barH + 30}`} className="w-full h-44" preserveAspectRatio="none">
          {/* Y grid */}
          {[0, 25, 50].map((v) => {
            const y = barH - (v / 50) * barH;
            return (
              <g key={v}>
                <line x1={barPad} y1={y} x2={barW - barPad} y2={y} stroke="#1E293B" strokeWidth="1" />
                <text x={barPad - 6} y={y + 4} fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="end">{v}</text>
              </g>
            );
          })}
          {barUsers.map((u, i) => {
            const x = barPad + i * slotW + (slotW - bw) / 2;
            const h = (u.tasks * 25 / 50) * barH;
            const y = barH - h;
            return (
              <g key={u.name}>
                <defs>
                  <linearGradient id={`barG${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS[i]} stopOpacity="1" />
                    <stop offset="100%" stopColor={COLORS[i]} stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <rect x={x} y={y} width={bw} height={h} rx="4" fill={`url(#barG${i})`} />
                <text x={x + bw / 2} y={y - 5} textAnchor="middle" fill={COLORS[i]}
                  fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {u.tasks * 25}
                </text>
                <text x={x + bw / 2} y={barH + 14} textAnchor="middle" fill="#64748B"
                  fontSize="8" fontFamily="monospace">
                  {u.name.slice(0, 7)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

    </div>
  );
}
