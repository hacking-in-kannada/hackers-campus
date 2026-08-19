"use client";

import { CheckCircle2, Clock, Flag, Heart, Signal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { PracticeChallenge } from "@hackers-campus/shared-types";
import type { Route } from "next";

interface ChallengeCardProps {
  challenge: PracticeChallenge;
  onToggleFavorite?: (id: string, isFav: boolean) => void;
}

// Custom theme avatar icons for TryHackMe aesthetic
function RoomAvatar({ slug, category }: { slug: string; category: string }) {
  if (slug === "checkmate" || slug.includes("chess")) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-500/30 bg-red-950/40 p-2 shadow-inner">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-400" fill="currentColor">
          <path d="M19 22H5V20H19V22M17 10C15.9 10 15 9.1 15 8C15 7.4 15.2 6.9 15.6 6.5C15.1 5.6 14.1 5 13 5C11.9 5 10.9 5.6 10.4 6.5C10.8 6.9 11 7.4 11 8C11 9.1 10.1 10 9 10H8V12H9V18H15V12H16V10H17M7 2H9V4H7V2M15 2H17V4H15V2M11 2H13V4H11V2Z" />
        </svg>
      </div>
    );
  }

  if (slug === "cache-me-outside" || slug.includes("cache")) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-lime/30 bg-lime/10 p-2 shadow-inner">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-lime" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M13 17H11V15H13V17M13 13H11V7H13V13Z" />
        </svg>
      </div>
    );
  }

  if (slug.includes("bricks") || slug.includes("heist")) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/40 p-2 shadow-inner">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-400" fill="currentColor">
          <path d="M19 4H5C3.89 4 3 4.89 3 6V18C3 19.1 3.89 20 5 20H19C20.1 20 21 19.1 21 18V6C21 4.89 20.1 4 19 4M19 7H14V6H19V7M12 6V7H5V6H12M5 9H10V11H5V9M12 9H20V11H12V9M19 13V15H14V13H19M12 13V15H5V13H12M5 17H10V18H5V17M12 17H20V18H12V17Z" />
        </svg>
      </div>
    );
  }

  if (slug.includes("fools") || slug.includes("crypto")) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-500/30 bg-purple-950/40 p-2 shadow-inner">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-purple-400" fill="currentColor">
          <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M9 9A2 2 0 0 0 7 11A2 2 0 0 0 9 13A2 2 0 0 0 11 11A2 2 0 0 0 9 9M15 9A2 2 0 0 0 13 11A2 2 0 0 0 15 13A2 2 0 0 0 17 11A2 2 0 0 0 15 9M12 14C9.75 14 7.8 15.5 7.15 17.5H16.85C16.2 15.5 14.25 14 12 14Z" />
        </svg>
      </div>
    );
  }

  // Default Cyber Room Badge
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-500/30 bg-sky-950/40 p-2 shadow-inner">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-400" fill="currentColor">
        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 5A3 3 0 0 1 15 8A3 3 0 0 1 12 11A3 3 0 0 1 9 8A3 3 0 0 1 12 5M17.13 17C15.92 18.85 14.11 20.24 12 20.92C9.89 20.24 8.08 18.85 6.87 17C6.53 16.5 6.24 15.97 6 15.42C6.87 14.44 8.87 13.75 12 13.75C15.13 13.75 17.13 14.44 18 15.42C17.76 15.97 17.47 16.5 17.13 17Z" />
      </svg>
    </div>
  );
}

export function ChallengeCard({ challenge, onToggleFavorite }: ChallengeCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const difficultyColors = {
    Easy: "text-[#22C55E]",
    Medium: "text-[#F59E0B]",
    Hard: "text-[#EF4444]",
    Insane: "text-[#A855F7]",
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFavorited;
    setIsFavorited(next);
    onToggleFavorite?.(challenge.id, next);
  };

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-xl border border-[#1E293B] bg-[#111A28] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-600 hover:shadow-lg hover:shadow-emerald-950/20">
      <div>
        {/* Top Header: Title & Room Avatar Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Link
              href={`/practice/${challenge.slug}` as Route}
              className="block text-base font-bold text-white transition-colors group-hover:text-emerald-400 line-clamp-1"
            >
              {challenge.title}
            </Link>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {challenge.description}
            </p>
          </div>

          <div className="shrink-0">
            <RoomAvatar slug={challenge.slug} category={challenge.category} />
          </div>
        </div>

        {/* Solved Status Badge if completed */}
        {challenge.solved && (
          <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Completed</span>
          </div>
        )}
      </div>

      {/* Bottom Metadata Row: Flag, Difficulty, Duration, Favorite Button */}
      <div className="mt-5 flex items-center justify-between border-t border-[#1C273A] pt-3.5 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {/* Flag indicator */}
          <span className="flex items-center text-slate-400">
            <Flag size={13} />
          </span>

          {/* Difficulty */}
          <span
            className={`flex items-center gap-1 font-medium ${
              difficultyColors[challenge.difficulty] || difficultyColors.Easy
            }`}
          >
            <Signal size={13} />
            <span>{challenge.difficulty}</span>
          </span>

          {/* Duration */}
          <span className="flex items-center gap-1 text-slate-400">
            <Clock size={13} />
            <span>{challenge.estimatedMinutes} min</span>
          </span>
        </div>

        {/* Bookmark / Heart Button */}
        <button
          onClick={handleHeartClick}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          className={`rounded-full p-1.5 transition-colors hover:bg-slate-800 ${
            isFavorited ? "text-rose-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Heart size={15} fill={isFavorited ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Link overlay */}
      <Link
        href={`/practice/${challenge.slug}` as Route}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`Open challenge ${challenge.title}`}
      />
      {/* Ensure the favorite button is clickable over the link overlay */}
      <div className="relative z-10 pointer-events-none" />
    </div>
  );
}
