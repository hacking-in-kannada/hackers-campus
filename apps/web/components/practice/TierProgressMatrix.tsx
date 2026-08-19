"use client";

import { CheckCircle2, Flame, Shield, Zap } from "lucide-react";

interface TierProgressMatrixProps {
  stats: {
    total: number;
    solved: number;
    easyTotal: number;
    easySolved: number;
    medTotal: number;
    medSolved: number;
    hardTotal: number;
    hardSolved: number;
  };
}

export function TierProgressMatrix({ stats }: TierProgressMatrixProps) {
  const easyPercent = stats.easyTotal > 0 ? (stats.easySolved / stats.easyTotal) * 100 : 0;
  const medPercent = stats.medTotal > 0 ? (stats.medSolved / stats.medTotal) * 100 : 0;
  const hardPercent = stats.hardTotal > 0 ? (stats.hardSolved / stats.hardTotal) * 100 : 0;

  return (
    <section className="card-module p-5 md:p-6 rounded-lg mb-8">
      <div className="flex items-center justify-between border-b border-[#151D23] pb-3 mb-5">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-lime" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
            Target Solve Matrix
          </h2>
        </div>
        <span className="rounded bg-[#0C1217] border border-[#151D23] px-2.5 py-1 font-mono text-[11px] font-bold text-ink">
          {stats.solved} / {stats.total} COMPLETED
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Easy Tier */}
        <div className="sub-module p-4 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                EASY TIER
              </span>
              <span className="font-mono text-xs text-lime font-bold">+100-150 XP</span>
            </div>
            <p className="font-mono text-xl font-bold text-ink">
              {stats.easySolved} <span className="text-xs font-normal text-muted">/ {stats.easyTotal} Solved</span>
            </p>
            <p className="text-xs text-muted mt-1">Fundamental vulnerabilities & single-step exploits</p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-mono text-muted mb-1">
              <span>Progress</span>
              <span className="text-ink font-semibold">{Math.round(easyPercent)}%</span>
            </div>
            <div className="h-2 progress-bar-track rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${easyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Medium Tier */}
        <div className="sub-module p-4 rounded-lg flex flex-col justify-between border-l-2 border-l-amber-400">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400">
                MEDIUM TIER
              </span>
              <span className="font-mono text-xs text-lime font-bold">+200-350 XP</span>
            </div>
            <p className="font-mono text-xl font-bold text-ink">
              {stats.medSolved} <span className="text-xs font-normal text-muted">/ {stats.medTotal} Solved</span>
            </p>
            <p className="text-xs text-muted mt-1">Chained vectors, AD escalation & bypasses</p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-mono text-muted mb-1">
              <span>Progress</span>
              <span className="text-ink font-semibold">{Math.round(medPercent)}%</span>
            </div>
            <div className="h-2 progress-bar-track rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${medPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hard / Insane Tier */}
        <div className="sub-module p-4 rounded-lg flex flex-col justify-between border-l-2 border-l-rose-500">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-400">
                HARD / INSANE TIER
              </span>
              <span className="font-mono text-xs text-lime font-bold">+400-600 XP</span>
            </div>
            <p className="font-mono text-xl font-bold text-ink">
              {stats.hardSolved} <span className="text-xs font-normal text-muted">/ {stats.hardTotal} Solved</span>
            </p>
            <p className="text-xs text-muted mt-1">Multi-subnet environments & custom binaries</p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-mono text-muted mb-1">
              <span>Progress</span>
              <span className="text-ink font-semibold">{Math.round(hardPercent)}%</span>
            </div>
            <div className="h-2 progress-bar-track rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${hardPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
