"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Eye,
  FileCode,
  FolderTree,
  HardDrive,
  Layers,
  MapPin,
  PlusCircle,
  RefreshCw,
  Rocket,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ADMIN_LAB_SESSIONS } from "@/lib/mock-data";

type AdminChallenge = {
  id: string; slug: string; title: string; category: string; difficulty: string; xp: number;
  target_ip: string; target_ports: string; container_image?: string; tasks: { id: string }[];
};

export default function AdminDashboardPage() {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [sessions, setSessions] = useState(ADMIN_LAB_SESSIONS);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const loadChallenges = async () => {
    const response = await fetch(`${apiBase}/admin/challenges`);
    if (response.ok) setChallenges(await response.json());
  };
  useEffect(() => { loadChallenges().catch(console.error); }, []);

  const handleDeleteChallenge = async (id: string) => {
    if (!window.confirm("Delete this challenge and its tasks permanently?")) return;
    const response = await fetch(`${apiBase}/practice/challenges/${id}`, { method: "DELETE" });
    if (response.ok) setChallenges((prev) => prev.filter((c) => c.id !== id));
  };

  const handleKillSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-[1440px] space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-lime">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" /> CLUSTER TELEMETRY & OPERATIONS
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Campus Control Center
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage real container challenges, career learning paths, and curriculum roadmap alignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/builder"
            className="inline-flex items-center gap-2 rounded-lg bg-lime px-4 py-2.5 font-mono text-xs font-bold text-canvas shadow-glow transition hover:bg-limeDim"
          >
            <PlusCircle size={15} /> Create Real Challenge
          </Link>
          <Link
            href="/admin/paths"
            className="inline-flex items-center gap-2 rounded-lg border border-panelBorder bg-panel px-4 py-2.5 font-mono text-xs font-bold text-ink hover:text-lime hover:border-lime transition"
          >
            <FolderTree size={15} /> Paths & Roadmap
          </Link>
        </div>
      </div>

      {/* Real Cluster Telemetry Gauges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Verified Lab Challenges",
            value: `${challenges.length} Real Labs`,
            sub: "Docker & Container Targets",
            icon: Box,
            href: "/practice",
          },
          {
            label: "Career Learning Tracks",
            value: "4 Active Paths",
            sub: "Junior Pentester, SOC, AppSec",
            icon: FolderTree,
            href: "/admin/paths",
          },
          {
            label: "Roadmap Curriculum",
            value: "5 Core Stages",
            sub: "Foundation to GRC",
            icon: Layers,
            href: "/learn/roadmap",
          },
          {
            label: "Local Lab Engine",
            value: "ONLINE",
            sub: "Docker Engine Bridge: 10.100.50.0/24",
            icon: Server,
            href: "/admin/labs",
          },
        ].map((metric) => (
          <Link
            key={metric.label}
            href={metric.href as any}
            className="rounded-xl border border-panelBorder bg-panel p-5 hover:border-lime/40 transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between text-muted">
              <span className="font-mono text-xs uppercase">{metric.label}</span>
              <metric.icon size={18} className="text-lime group-hover:scale-110 transition" />
            </div>
            <p className="mt-3 font-mono text-2xl font-bold text-ink group-hover:text-lime transition">{metric.value}</p>
            <p className="mt-1 font-mono text-[11px] text-lime">{metric.sub}</p>
          </Link>
        ))}
      </div>

      {/* Real Challenge Catalog Table */}
      <section className="rounded-xl border border-panelBorder bg-panel overflow-hidden">
        <div className="border-b border-divider px-6 py-4 flex items-center justify-between bg-panelSubtle">
          <div>
            <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-lime">
              Verified Platform Challenge Catalog ({challenges.length})
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Production challenges configured with Dockerfiles, tasks, and flag validators.
            </p>
          </div>
          <Link
            href="/admin/builder"
            className="inline-flex items-center gap-1 font-mono text-xs text-lime hover:underline"
          >
            <PlusCircle size={13} /> Add Challenge
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-divider bg-panelSubtle text-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-6">Challenge Name</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Difficulty</th>
                <th className="py-3 px-6">Target IP / Port</th>
                <th className="py-3 px-6">Tasks</th>
                <th className="py-3 px-6">XP Reward</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider text-ink">
              {challenges.map((c) => (
                <tr key={c.id} className="hover:bg-panelSubtle transition">
                  <td className="py-3.5 px-6 font-bold">
                    <Link href={`/practice/${c.slug}`} className="hover:text-lime transition">
                      {c.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="rounded bg-lime/10 border border-lime/20 px-2 py-0.5 text-[10px] text-lime font-bold">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-amber-400 font-semibold">{c.difficulty}</td>
                  <td className="py-3.5 px-6 text-cyan-400 font-mono">
                    {c.target_ip || "Provisioned at launch"}{c.target_ports ? `:${c.target_ports}` : ""}
                  </td>
                  <td className="py-3.5 px-6 text-muted">{c.tasks.length} Tasks</td>
                  <td className="py-3.5 px-6 text-lime font-bold">+{c.xp} XP</td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <Link
                      href={`/practice/${c.slug}`}
                      className="inline-flex items-center gap-1 rounded border border-panelBorder bg-panel px-2.5 py-1 text-[11px] text-ink hover:text-lime hover:border-lime"
                    >
                      <Eye size={12} /> Test Lab
                    </Link>
                    <button
                      onClick={() => handleDeleteChallenge(c.id)}
                      className="rounded bg-danger/10 border border-danger/30 px-2.5 py-1 text-[11px] text-danger hover:bg-danger/20"
                      title="Delete Challenge"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Live Active Container Sessions */}
      <section className="rounded-xl border border-panelBorder bg-panel overflow-hidden">
        <div className="border-b border-divider px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
              Live Disposable Lab Sessions ({sessions.length})
            </h2>
            <p className="text-xs text-muted mt-0.5">Real-time Docker containers running in user isolation networks.</p>
          </div>
          <Link
            href="/admin/labs"
            className="font-mono text-xs text-lime hover:underline flex items-center gap-1"
          >
            All Lab Sessions <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-divider bg-panelSubtle text-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Challenge / Room</th>
                <th className="py-3 px-6">Container IP</th>
                <th className="py-3 px-6">Runtime</th>
                <th className="py-3 px-6">CPU / RAM</th>
                <th className="py-3 px-6">Uptime</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider text-ink">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-panelSubtle transition">
                  <td className="py-3.5 px-6 font-bold text-lime">@{sess.username}</td>
                  <td className="py-3.5 px-6 text-ink">{sess.roomOrChallengeTitle}</td>
                  <td className="py-3.5 px-6 text-muted">{sess.targetIp}</td>
                  <td className="py-3.5 px-6">
                    <span className="rounded bg-panelSubtle border border-panelBorder px-2 py-0.5 text-[10px] text-muted">
                      {sess.runtime}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-muted">
                    {sess.cpuPercent}% / {sess.memoryMb}MB
                  </td>
                  <td className="py-3.5 px-6 text-muted">{sess.startedAt}</td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleKillSession(sess.id)}
                      className="rounded bg-danger/10 border border-danger/30 px-2.5 py-1 text-[11px] text-danger hover:bg-danger/20"
                    >
                      Kill Pod
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Access Grid to Studio & Curriculum */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/builder"
          className="rounded-xl border border-panelBorder bg-panel p-5 hover:border-lime/50 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10 border border-lime/20 text-lime">
              <FileCode size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink group-hover:text-lime">Challenge Studio</h3>
              <p className="text-[11px] text-muted">Templates, HTML Tasks, Image Uploads</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/paths"
          className="rounded-xl border border-panelBorder bg-panel p-5 hover:border-lime/50 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <FolderTree size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink group-hover:text-lime">Paths & Modules</h3>
              <p className="text-[11px] text-muted">Author Career Tracks & Curriculum</p>
            </div>
          </div>
        </Link>

        <Link
          href="/learn/roadmap"
          className="rounded-xl border border-panelBorder bg-panel p-5 hover:border-lime/50 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink group-hover:text-lime">Cyber Roadmap</h3>
              <p className="text-[11px] text-muted">5-Stage Skill Progression Tree</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
