"use client";

import {
  Activity,
  ArrowLeft,
  Box,
  CheckCircle2,
  Clock,
  Cpu,
  FileCode,
  HardDrive,
  RefreshCw,
  Server,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ADMIN_LAB_SESSIONS } from "@/lib/mock-data";
import type { AdminLabSession } from "@hackers-campus/shared-types";

export default function AdminLabsPage() {
  const [sessions, setSessions] = useState<AdminLabSession[]>(ADMIN_LAB_SESSIONS);
  const [selectedLogsSess, setSelectedLogsSess] = useState<AdminLabSession | null>(null);

  const handleKillSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleExtendSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, uptimeSeconds: s.uptimeSeconds + 1800 } : s))
    );
  };

  return (
    <div className="max-w-[1440px] space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted transition hover:text-lime"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Live Lab Container Orchestration
          </h1>
          <p className="text-xs text-muted mt-1">
            Real-time management of active Docker pods, target virtual machines, and user allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSessions([...ADMIN_LAB_SESSIONS])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-panelBorder bg-panel px-3.5 py-2 font-mono text-xs text-muted hover:text-ink hover:border-lime"
          >
            <RefreshCw size={13} /> Refresh Cluster
          </button>
        </div>
      </div>

      {/* Cluster Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-panelBorder bg-panel p-5">
          <span className="font-mono text-xs uppercase text-muted">Running Containers</span>
          <p className="mt-2 font-mono text-2xl font-bold text-ink">{sessions.length} Pods</p>
        </div>
        <div className="rounded-xl border border-panelBorder bg-panel p-5">
          <span className="font-mono text-xs uppercase text-muted">Total Memory In Use</span>
          <p className="mt-2 font-mono text-2xl font-bold text-lime">
            {sessions.reduce((acc, s) => acc + s.memoryMb, 0)} MB
          </p>
        </div>
        <div className="rounded-xl border border-panelBorder bg-panel p-5">
          <span className="font-mono text-xs uppercase text-muted">Average CPU Usage</span>
          <p className="mt-2 font-mono text-2xl font-bold text-cyan-400">
            {(sessions.reduce((acc, s) => acc + s.cpuPercent, 0) / (sessions.length || 1)).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="rounded-xl border border-panelBorder bg-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-divider bg-panelSubtle text-muted uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Target / Challenge</th>
                <th className="py-3.5 px-6">Container ID</th>
                <th className="py-3.5 px-6">Target IP</th>
                <th className="py-3.5 px-6">CPU / RAM</th>
                <th className="py-3.5 px-6">Runtime</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider text-ink">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-panelSubtle transition">
                  <td className="py-4 px-6 font-bold text-lime">@{sess.username}</td>
                  <td className="py-4 px-6 font-semibold">{sess.roomOrChallengeTitle}</td>
                  <td className="py-4 px-6 text-muted">{sess.containerId}</td>
                  <td className="py-4 px-6 text-cyan-400 font-bold">{sess.targetIp}</td>
                  <td className="py-4 px-6 text-muted">
                    {sess.cpuPercent}% / {sess.memoryMb} MB
                  </td>
                  <td className="py-4 px-6 text-muted">{sess.startedAt}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setSelectedLogsSess(sess)}
                      className="rounded border border-panelBorder bg-panel px-2.5 py-1 text-[11px] text-muted hover:border-lime hover:text-lime"
                    >
                      Logs
                    </button>
                    <button
                      onClick={() => handleExtendSession(sess.id)}
                      className="rounded border border-panelBorder bg-panel px-2.5 py-1 text-[11px] text-ink hover:text-lime"
                    >
                      +30m
                    </button>
                    <button
                      onClick={() => handleKillSession(sess.id)}
                      className="rounded border border-danger/30 bg-danger/10 px-2.5 py-1 text-[11px] text-danger hover:bg-danger/20"
                    >
                      Terminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Container Logs Modal */}
      {selectedLogsSess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-panelBorder bg-panel p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-divider pb-3">
              <div>
                <h3 className="font-mono text-xs font-bold text-lime">
                  Container Logs: {selectedLogsSess.containerId}
                </h3>
                <p className="font-mono text-[10px] text-muted">Target IP: {selectedLogsSess.targetIp}</p>
              </div>
              <button
                onClick={() => setSelectedLogsSess(null)}
                className="text-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-4 h-64 overflow-y-auto rounded-lg bg-canvas p-4 font-mono text-xs leading-relaxed text-muted space-y-1">
              <p className="text-cyan-400">[init] Container started with isolated bridge network</p>
              <p>[nginx] 10.10.14.33 - - [18/Aug/2026:03:44:02 +0000] "GET /api/auth/session HTTP/1.1" 200</p>
              <p className="text-amber-400">[app] Authentication token signature verification: alg='none' detected</p>
              <p className="text-lime">[app] Admin privileges granted to session cookie token</p>
              <p>[nginx] 10.10.14.33 - - [18/Aug/2026:03:44:30 +0000] "GET /api/admin/vault HTTP/1.1" 200</p>
            </div>

            <div className="flex justify-end font-mono text-xs">
              <button
                onClick={() => setSelectedLogsSess(null)}
                className="rounded-lg bg-lime px-4 py-2 font-bold text-canvas shadow-glow hover:bg-limeDim"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
