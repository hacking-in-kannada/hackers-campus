"use client";

import {
  Bookmark,
  Check,
  Clock,
  Flame,
  Shield,
  Signal,
  Terminal,
  ThumbsUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Route } from "next";

interface RoomHeaderProps {
  breadcrumbParent: { label: string; href: string };
  breadcrumbCurrent: string;
  title: string;
  tagline: string;
  difficulty: string;
  estimatedMinutes: number;
  solversCount: number;
  progressPercent: number;
  targetIp?: string;
  machineName?: string;
  category?: string;
  avatarIcon?: string;
}

export function RoomHeader({
  breadcrumbParent,
  breadcrumbCurrent,
  title,
  tagline,
  difficulty,
  estimatedMinutes,
  solversCount,
  progressPercent,
  targetIp = "10.10.110.45",
  machineName = "target-box-01",
  category = "Offensive",
  avatarIcon = "flame",
}: RoomHeaderProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [recommendCount, setRecommendCount] = useState(595);
  const [hasRecommended, setHasRecommended] = useState(false);

  const handleRecommend = () => {
    if (!hasRecommended) {
      setRecommendCount((prev) => prev + 1);
      setHasRecommended(true);
    } else {
      setRecommendCount((prev) => prev - 1);
      setHasRecommended(false);
    }
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#1E293B] bg-gradient-to-r from-[#0C1322] via-[#0F1B32] to-[#0A1220] shadow-2xl">
      {/* Background cyber particle art */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="relative z-10 p-6 sm:p-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href={breadcrumbParent.href as Route} className="transition hover:text-emerald-400">
            {breadcrumbParent.label}
          </Link>
          <span>&gt;</span>
          <span className="text-white font-medium">{breadcrumbCurrent}</span>
        </div>

        {/* Top Info Row: Thumbnail + Title + Subtitle + Meta */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Room Thumbnail Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-red-500/40 bg-gradient-to-br from-red-950 via-red-900 to-amber-950 p-3 shadow-lg shadow-red-950/40">
            {avatarIcon === "flame" ? (
              <Flame className="h-9 w-9 text-amber-400" />
            ) : avatarIcon === "shield" ? (
              <Shield className="h-9 w-9 text-sky-400" />
            ) : (
              <Terminal className="h-9 w-9 text-emerald-400" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            <p className="mt-1.5 max-w-3xl text-xs text-slate-300 sm:text-sm leading-relaxed">
              {tagline}
            </p>

            {/* Metadata Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Signal size={14} />
                <span>{difficulty}</span>
              </span>

              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock size={14} />
                <span>{estimatedMinutes} min</span>
              </span>

              <span className="flex items-center gap-1.5 text-slate-400">
                <Users size={14} />
                <span>{solversCount.toLocaleString()}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  HC
                </span>
                <span className="text-slate-400">by SentinelTeam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#1C273C]">
          {/* Share Your Achievement Button */}
          <button
            onClick={() => alert("Achievement link copied to clipboard! Share your milestone on LinkedIn and Twitter.")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#090E12] shadow-md hover:bg-[#4ADE80] transition"
          >
            <Zap size={14} fill="currentColor" />
            <span>Share your achievement</span>
          </button>

          {/* Save Room Button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition ${
              isSaved
                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                : "border-[#1E293B] bg-[#111A28] text-slate-300 hover:border-slate-600 hover:text-white"
            }`}
          >
            <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
            <span>{isSaved ? "Saved" : "Save Room"}</span>
          </button>

          {/* Recommend Button */}
          <button
            onClick={handleRecommend}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition ${
              hasRecommended
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-[#1E293B] bg-[#111A28] text-slate-300 hover:border-slate-600 hover:text-white"
            }`}
          >
            <ThumbsUp size={14} fill={hasRecommended ? "currentColor" : "none"} />
            <span>{recommendCount} Recommend</span>
          </button>
        </div>
      </div>

      {/* Bottom Room Progress Bar */}
      <div className="relative border-t border-[#1C273C] bg-[#080D18]">
        <div
          className="h-1 bg-[#22C55E] transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="flex items-center justify-between px-6 py-1 font-mono text-[11px] text-slate-400">
          <span>Room progress: {progressPercent}%</span>
          {progressPercent === 100 && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check size={12} /> Room Completed!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
