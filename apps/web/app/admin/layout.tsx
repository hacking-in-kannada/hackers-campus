"use client";

import {
  Activity,
  ArrowLeft,
  Award,
  Box,
  Cpu,
  Database,
  FileCode2,
  FolderTree,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Server,
  Settings,
  Shield,
  Terminal,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readSession } from "@/lib/auth";

import type { Route } from "next";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const session = readSession();
    if (session?.role === "admin") setAuthorized(true);
    else {
      setAuthorized(false);
      router.replace(`/login?next=${encodeURIComponent(pathname || "/admin")}`);
    }
  }, [pathname, router]);

  if (authorized !== true) return <div className="min-h-[calc(100vh-72px)] bg-canvas p-10 text-center font-mono text-sm text-muted">Checking access…</div>;

  const navItems = [
    { label: "Dashboard", href: "/admin" as Route, icon: LayoutDashboard },
    { label: "Challenge Builder", href: "/admin/builder" as Route, icon: PlusCircle },
    { label: "Paths & Roadmap", href: "/admin/paths" as Route, icon: FolderTree },
    { label: "Lab Orchestration", href: "/admin/labs" as Route, icon: Server },
    { label: "User Directory", href: "/admin/users" as Route, icon: Users },
  ];

  return (
    <div className="flex min-h-[calc(100vh-72px)] bg-canvas">
      {/* Fixed Admin Sidebar */}
      <aside className="w-64 shrink-0 border-r border-panelBorder bg-panelSubtle p-4 hidden md:flex md:flex-col md:justify-between">
        <div className="space-y-6">
          <div className="border-b border-divider pb-4">
            <div className="flex items-center gap-2 text-lime font-mono text-xs font-bold tracking-wider uppercase">
              <Shield size={16} /> Campus Control Center
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted">Admin & Lab Operations Console</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-mono text-xs font-semibold transition ${
                    isActive
                      ? "bg-lime text-canvas shadow-glow font-bold"
                      : "text-muted hover:bg-panel hover:text-ink"
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-divider pt-4 space-y-2">
          <div className="rounded-lg border border-panelBorder bg-panel p-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-muted">
              <span>Cluster Status</span>
              <span className="text-lime flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" /> HEALTHY
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-ink font-bold">42 Containers Active</p>
          </div>

          <Link
            href="/"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-mono text-xs text-muted transition hover:bg-panel hover:text-ink"
          >
            <ArrowLeft size={14} /> Back to Campus Web
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
