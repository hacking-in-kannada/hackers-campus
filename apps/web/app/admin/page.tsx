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
  HardDrive,
  Layers,
  PlusCircle,
  RefreshCw,
  Server,
  Shield,
  Terminal,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ADMIN_LAB_SESSIONS } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const [sessions, setSessions] = useState(ADMIN_LAB_SESSIONS);

  const handleKillSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-[1440px] space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-lime">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" /> CLUSTER TELEMETRY & OPERATIONS
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Mission Control Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/builder"
            className="inline-flex items-center gap-2 rounded-lg bg-lime px-4 py-2.5 font-mono text-xs font-bold text-canvas shadow-glow transition hover:bg-limeDim"
          >
            <PlusCircle size={15} /> Create New Challenge
          </Link>
        </div>
      </div>

      {/* Cluster Telemetry Gauges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Lab Containers", value: "42 / 50", sub: "84% Pool Capacity", icon: Box, status: "normal" },
          { label: "Total CPU Load", value: "38.4%", sub: "16 Cores Provisioned", icon: Cpu, status: "normal" },
          { label: "Cluster Memory (RAM)", value: "24.8 GB", sub: "64% of 32 GB Allocated", icon: HardDrive, status: "normal" },
          { label: "Active Hackers Online", value: "128", sub: "Across 14 timezones", icon: Users, status: "normal" },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-panelBorder bg-panel p-5">
            <div className="flex items-center justify-between text-muted">
              <span className="font-mono text-xs uppercase">{metric.label}</span>
              <metric.icon size={18} className="text-lime" />
            </div>
            <p className="mt-3 font-mono text-2xl font-bold text-ink">{metric.value}</p>
            <p className="mt-1 font-mono text-[11px] text-lime">{metric.sub}</p>
          </div>
        ))}
      </div>

      {/* Live Active Container Sessions */}
      <section className="rounded-xl border border-panelBorder bg-panel overflow-hidden">
        <div className="border-b border-divider px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
              Live Disposable Lab Sessions ({sessions.length})
            </h2>
            <p className="text-xs text-muted mt-0.5">Real-time Docker & VirtualBox containers running in isolation.</p>
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

      {/* System Event Logs */}
      <section className="rounded-xl border border-panelBorder bg-panel p-6">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
          Recent Platform Audit Events
        </h3>
        <div className="space-y-3 font-mono text-xs text-muted">
          {[
            { time: "03:44:12 UTC", event: "[ORCHESTRATOR] Successfully spawned docker container 'hc_jwt_bypass_8942' for user pavanreddyx7", level: "info" },
            { time: "03:42:00 UTC", event: "[API] Automated garbage collection reclaimed 4 idle containers", level: "info" },
            { time: "03:39:18 UTC", event: "[CTF] First Blood claimed on challenge 'Quantum Elliptic' by team '0xNullPointers'", level: "highlight" },
            { time: "03:30:05 UTC", event: "[AUTH] New user registration: sarah_dfir (verified email)", level: "info" },
          ].map((log, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-divider/60 pb-2">
              <span className="text-muted shrink-0">{log.time}</span>
              <span className={log.level === "highlight" ? "text-lime font-bold" : "text-ink"}>
                {log.event}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
