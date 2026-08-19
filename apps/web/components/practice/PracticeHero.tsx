"use client";

import { useMemo } from "react";

interface PracticeHeroProps {
  solvedCount: number;
  totalCount: number;
  easySolved?: number;
  easyTotal?: number;
  medSolved?: number;
  medTotal?: number;
  hardSolved?: number;
  hardTotal?: number;
}

export function PracticeHero({
  solvedCount = 15,
  totalCount = 523,
  easySolved = 10,
  easyTotal = 188,
  medSolved = 5,
  medTotal = 231,
  hardSolved = 0,
  hardTotal = 104,
}: PracticeHeroProps) {
  // Generate 48 segment notches for the visual segmented progress meter
  const totalSegments = 48;
  const activeSegments = useMemo(() => {
    const ratio = totalCount > 0 ? solvedCount / totalCount : 0;
    return Math.max(1, Math.round(ratio * totalSegments * 3)); // visual scaling
  }, [solvedCount, totalCount]);

  return (
    <header className="relative mb-8 overflow-hidden rounded-2xl border border-[#1E293B] bg-gradient-to-r from-[#0F172A] via-[#111C35] to-[#0A1628] p-6 md:p-10 shadow-2xl">
      {/* Background glow and subtle cyber grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 flex flex-col-reverse items-center justify-between gap-8 lg:flex-row lg:gap-12">
        {/* Left column: Title, segmented meter, and stats breakdown */}
        <div className="w-full flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Challenges
            </h1>
          </div>

          {/* Segmented Progress Meter Row */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {/* Segmented notched progress bar */}
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

              {/* Progress Count Display */}
              <div className="shrink-0 font-mono text-xl font-bold text-white md:text-2xl">
                <span>{solvedCount}</span>
                <span className="text-sm font-medium text-slate-400">/{totalCount}</span>
                <span className="ml-1.5 hidden text-xs font-normal text-slate-400 sm:inline">
                  Challenges
                </span>
              </div>
            </div>

            {/* Difficulty breakdown numbers */}
            <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-sm sm:gap-10 sm:text-base">
              {/* Easy */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                <span className="text-lg font-bold text-white sm:text-xl">{easySolved}</span>
                <span className="text-xs text-slate-400">/{easyTotal}</span>
                <span className="text-xs font-medium text-slate-300">Easy</span>
              </div>

              {/* Medium */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                <span className="text-lg font-bold text-white sm:text-xl">{medSolved}</span>
                <span className="text-xs text-slate-400">/{medTotal}</span>
                <span className="text-xs font-medium text-slate-300">Medium</span>
              </div>

              {/* Hard */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                <span className="text-lg font-bold text-white sm:text-xl">{hardSolved}</span>
                <span className="text-xs text-slate-400">/{hardTotal}</span>
                <span className="text-xs font-medium text-slate-300">Hard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: 3D Wireframe Cyber Mountain with Radar Rings and Flag */}
        <div className="relative flex shrink-0 items-center justify-center">
          {/* Pulsing ambient aura */}
          <div className="absolute h-52 w-52 rounded-full bg-emerald-500/20 blur-3xl" />

          <svg
            viewBox="0 0 280 200"
            className="relative h-44 w-60 sm:h-52 sm:w-72 drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="neonGreenGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="glowRings" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Concentric Radar Ellipses */}
            <ellipse
              cx="140"
              cy="160"
              rx="120"
              ry="28"
              stroke="url(#glowRings)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <ellipse
              cx="140"
              cy="160"
              rx="90"
              ry="20"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeOpacity="0.7"
            />
            <ellipse
              cx="140"
              cy="160"
              rx="55"
              ry="12"
              fill="#22C55E"
              fillOpacity="0.15"
              stroke="#22C55E"
              strokeWidth="2"
            />

            {/* Glowing mountain wireframe structure */}
            {/* Peak at (140, 50) */}
            {/* Left slope */}
            <polygon
              points="140,50 65,150 115,155"
              fill="url(#neonGreenGrad)"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Center front facet */}
            <polygon
              points="140,50 115,155 165,155"
              fill="url(#neonGreenGrad)"
              stroke="#4ADE80"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Right slope */}
            <polygon
              points="140,50 165,155 215,150"
              fill="url(#neonGreenGrad)"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Internal geometric cross wireframes */}
            <line x1="140" y1="50" x2="140" y2="155" stroke="#86EFAC" strokeWidth="1.5" />
            <line x1="102" y1="102" x2="178" y2="102" stroke="#86EFAC" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="83" y1="126" x2="197" y2="126" stroke="#86EFAC" strokeWidth="1" />
            <line x1="140" y1="50" x2="90" y2="152" stroke="#4ADE80" strokeWidth="1" />
            <line x1="140" y1="50" x2="190" y2="152" stroke="#4ADE80" strokeWidth="1" />

            {/* Mountain Summit Flag & Pole */}
            <line x1="140" y1="50" x2="140" y2="22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            {/* Flag polygon */}
            <polygon
              points="140,24 162,31 140,38"
              fill="#22C55E"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            {/* Pulsing summit beacon */}
            <circle cx="140" cy="22" r="3.5" fill="#FFFFFF" className="animate-ping" />
            <circle cx="140" cy="22" r="2.5" fill="#22C55E" />

            {/* Glowing corner particles */}
            <circle cx="65" cy="150" r="2.5" fill="#86EFAC" />
            <circle cx="115" cy="155" r="2.5" fill="#86EFAC" />
            <circle cx="165" cy="155" r="2.5" fill="#86EFAC" />
            <circle cx="215" cy="150" r="2.5" fill="#86EFAC" />
          </svg>
        </div>
      </div>
    </header>
  );
}
