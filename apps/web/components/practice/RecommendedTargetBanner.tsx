"use client";

import { Play, Shield, Signal, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

interface RecommendedTargetBannerProps {
  slug?: string;
  title?: string;
  category?: string;
  difficulty?: string;
  timeEstimate?: string;
  description?: string;
}

export function RecommendedTargetBanner({
  slug = "ai-threat-modelling",
  title = "AI Threat Modelling Assessment",
  category = "Artificial intelligence",
  difficulty = "Easy",
  timeEstimate = "15 min",
  description = "Put your AI threat modelling skills to the test using an interactive assessment application.",
}: RecommendedTargetBannerProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#1E2D48] bg-gradient-to-r from-[#0C1424] via-[#0F1B30] to-[#0A1220] p-6 sm:p-8 transition-all hover:border-[#22C55E]/40 shadow-xl">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        {/* Left: Challenge info and Play button */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {title}
              </h2>
              <Shield size={18} className="text-sky-400 shrink-0" />
            </div>
            <p className="mt-1.5 text-xs text-slate-300 sm:text-sm max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <Signal size={13} className="text-emerald-400" />
              <span>{difficulty}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Clock size={13} />
              <span>{timeEstimate}</span>
            </span>

            <span className="rounded-full bg-[#1E293B] px-3 py-0.5 text-xs font-medium text-slate-300 border border-slate-700/60">
              {category}
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <Link
              href={`/practice/${slug}` as Route}
              className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] px-6 py-2.5 text-xs sm:text-sm font-bold text-[#090E12] transition-all hover:bg-[#4ADE80] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              <Play size={16} fill="currentColor" />
              <span>Play now</span>
            </Link>
          </div>
        </div>

        {/* Right: AI Cyber Head & Threat Node Network Illustration */}
        <div className="relative shrink-0 flex items-center justify-center self-center md:self-auto">
          <svg
            viewBox="0 0 200 180"
            className="h-32 w-36 sm:h-36 sm:w-44 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="aiHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>
              <radialGradient id="nodeAlertGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </radialGradient>
            </defs>

            {/* Neural Web Connections */}
            <path
              d="M100 30 L60 60 L40 100 L70 120 L100 140 L130 120 L160 100 L140 60 Z"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              strokeOpacity="0.7"
            />
            <path
              d="M100 30 L100 90 L100 140 M60 60 L140 60 M40 100 L160 100 M60 60 L100 90 L140 60 M70 120 L100 90 L130 120"
              stroke="#22C55E"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />

            {/* Glowing Peripheral Nodes */}
            <circle cx="100" cy="30" r="4" fill="#4ADE80" />
            <circle cx="60" cy="60" r="3.5" fill="#4ADE80" />
            <circle cx="140" cy="60" r="3.5" fill="#4ADE80" />
            <circle cx="40" cy="100" r="3.5" fill="#4ADE80" />
            <circle cx="160" cy="100" r="3.5" fill="#4ADE80" />
            <circle cx="70" cy="120" r="3.5" fill="#4ADE80" />
            <circle cx="130" cy="120" r="3.5" fill="#4ADE80" />
            <circle cx="100" cy="140" r="4" fill="#4ADE80" />

            {/* Neural Central Brain Base / Head Container */}
            <path
              d="M50 145 C50 135 70 130 100 130 C130 130 150 135 150 145 L145 165 C145 172 130 178 100 178 C70 178 55 172 55 165 Z"
              fill="url(#aiHeadGrad)"
              stroke="#22C55E"
              strokeWidth="1.5"
            />

            {/* Visor / Scanner Slot */}
            <path
              d="M65 152 Q100 156 135 152 Q100 159 65 152"
              fill="#064E3B"
              stroke="#86EFAC"
              strokeWidth="1"
            />

            {/* Threat Alert Markers (Red exclamations) */}
            <g className="animate-pulse">
              {/* Alert 1 */}
              <circle cx="85" cy="75" r="7" fill="url(#nodeAlertGrad)" stroke="#EF4444" strokeWidth="1" />
              <text x="85" y="78.5" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>

              {/* Alert 2 */}
              <circle cx="118" cy="85" r="7" fill="url(#nodeAlertGrad)" stroke="#EF4444" strokeWidth="1" />
              <text x="118" y="88.5" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>

              {/* Alert 3 */}
              <circle cx="100" cy="115" r="6" fill="url(#nodeAlertGrad)" stroke="#EF4444" strokeWidth="1" />
              <text x="100" y="118" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">!</text>
            </g>

            {/* Floating Data Sparks */}
            <circle cx="170" cy="45" r="2" fill="#22C55E" className="animate-ping" />
            <circle cx="30" cy="70" r="2" fill="#22C55E" className="animate-ping" />
          </svg>
        </div>
      </div>
    </div>
  );
}
