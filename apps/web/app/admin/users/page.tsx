"use client";

import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Lock,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([
    {
      id: "u-1",
      name: "Pavan Reddy",
      username: "pavanreddyx7",
      email: "pavan@hackerscampus.internal",
      role: "Admin",
      level: 12,
      xp: 2450,
      activeLabs: 1,
      status: "Active",
    },
    {
      id: "u-2",
      name: "Alex Vance",
      username: "alex_pwn_master",
      email: "alex@secops.io",
      role: "Student",
      level: 8,
      xp: 1820,
      activeLabs: 1,
      status: "Active",
    },
    {
      id: "u-3",
      name: "Sarah Lin",
      username: "sarah_dfir",
      email: "sarah@forensics.org",
      role: "Instructor",
      level: 15,
      xp: 4100,
      activeLabs: 0,
      status: "Active",
    },
    {
      id: "u-4",
      name: "Bad Actor",
      username: "dos_flooder_99",
      email: "spammer@botnet.xyz",
      role: "Student",
      level: 1,
      xp: 50,
      activeLabs: 0,
      status: "Banned",
    },
  ]);

  const toggleBan = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

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
            User Directory & Access Roles
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage student enrollments, instructor credentials, and access restrictions.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="rounded-xl border border-panelBorder bg-panel p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hackers by name, handle, or email..."
            className="w-full rounded-lg border border-panelBorder bg-panelSubtle py-2.5 pl-10 pr-4 font-mono text-xs text-ink placeholder:text-muted focus:border-lime focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-panelBorder bg-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-divider bg-panelSubtle text-muted uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Level / XP</th>
                <th className="py-3.5 px-6">Active Labs</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider text-ink">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-panelSubtle transition">
                  <td className="py-4 px-6 font-bold flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-panelSubtle border border-panelBorder flex items-center justify-center text-[10px] text-lime">
                      {u.username.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-ink">{u.name}</p>
                      <p className="text-[10px] text-muted">@{u.username}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted">{u.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        u.role === "Admin"
                          ? "bg-lime/10 text-lime border border-lime/30"
                          : u.role === "Instructor"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                          : "bg-panelSubtle text-muted border border-panelBorder"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted">
                    Lvl {u.level} · <span className="text-lime font-bold">{u.xp} XP</span>
                  </td>
                  <td className="py-4 px-6 text-muted">{u.activeLabs} Pods</td>
                  <td className="py-4 px-6">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        u.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-danger"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => toggleBan(u.id)}
                      className={`rounded px-3 py-1 text-[11px] font-bold transition ${
                        u.status === "Active"
                          ? "border border-danger/30 text-danger hover:bg-danger/10"
                          : "border border-lime/30 text-lime hover:bg-lime/10"
                      }`}
                    >
                      {u.status === "Active" ? "Ban User" : "Unban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
