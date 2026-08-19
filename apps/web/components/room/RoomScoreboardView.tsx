"use client";

import { Award, Flame, Shield, Trophy, Users } from "lucide-react";

export function RoomScoreboardView() {
  const solvers = [
    { rank: 1, name: "Pr0Hack3r", time: "18m 42s", points: 350, country: "US", avatar: "P" },
    { rank: 2, name: "f3qt86d76a05bstzog", time: "24m 10s", points: 350, country: "DE", avatar: "F" },
    { rank: 3, name: "Cipher007", time: "29m 55s", points: 350, country: "GB", avatar: "C" },
    { rank: 4, name: "Realix", time: "33m 12s", points: 350, country: "IN", avatar: "R" },
    { rank: 5, name: "Akty", time: "41m 05s", points: 350, country: "CA", avatar: "A" },
    { rank: 6, name: "pavanreddyx7", time: "44m 30s", points: 250, country: "IN", avatar: "P", isCurrent: true },
    { rank: 7, name: "0theplane10", time: "52m 19s", points: 250, country: "AU", avatar: "0" },
    { rank: 8, name: "b4ng", time: "58m 01s", points: 250, country: "FR", avatar: "B" },
  ];

  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <span>Room Leaderboard</span>
          </h3>
          <p className="text-xs text-slate-400">First-blood and fastest objective solvers</p>
        </div>
        <span className="font-mono text-xs text-slate-400">Top 8 Solvers</span>
      </div>

      <div className="divide-y divide-[#1E293B]">
        {solvers.map((s) => (
          <div
            key={s.rank}
            className={`flex items-center justify-between py-3 px-3 rounded-lg font-mono text-xs transition ${
              s.isCurrent ? "bg-emerald-950/30 border border-emerald-500/40 text-emerald-300" : "hover:bg-slate-800/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`w-6 font-bold text-center ${s.rank <= 3 ? "text-amber-400" : "text-slate-500"}`}>
                #{s.rank}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-white font-bold text-xs border border-slate-700">
                {s.avatar}
              </div>
              <span className={`font-semibold ${s.isCurrent ? "text-emerald-400" : "text-white"}`}>
                {s.name} {s.isCurrent && "(You)"}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-slate-400">{s.time}</span>
              <span className="font-bold text-emerald-400">+{s.points} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoomWriteupsView() {
  const writeups = [
    {
      title: "Comprehensive Walkthrough & Root Exploit Chain",
      author: "0xSecNinja",
      date: "2 days ago",
      upvotes: 84,
      readTime: "6 min read",
    },
    {
      title: "Methodical Kerberoasting & Token Forgery Guide",
      author: "CyberGhost",
      date: "5 days ago",
      upvotes: 62,
      readTime: "4 min read",
    },
    {
      title: "How to complete this room using only native CLI tools",
      author: "hacker99",
      date: "1 week ago",
      upvotes: 49,
      readTime: "8 min read",
    },
  ];

  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <div>
          <h3 className="text-base font-bold text-white">Community Write-ups</h3>
          <p className="text-xs text-slate-400">Verified solutions and educational walkthroughs by security researchers</p>
        </div>
        <button
          onClick={() => alert("Submit write-up feature: Write-up submission portal opens for completed rooms.")}
          className="rounded-lg bg-[#22C55E] px-3 py-1.5 font-mono text-xs font-bold text-[#090E12]"
        >
          + Submit Write-up
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {writeups.map((w, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-[#1E293B] bg-[#0E1624] p-4 hover:border-slate-600 transition"
          >
            <div>
              <span className="font-mono text-[10px] text-emerald-400 font-semibold">{w.readTime}</span>
              <h4 className="mt-1 text-sm font-bold text-white line-clamp-2">{w.title}</h4>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#1C273A] pt-3 text-xs text-slate-400 font-mono">
              <span>by {w.author}</span>
              <span className="text-emerald-400 font-bold">▲ {w.upvotes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
