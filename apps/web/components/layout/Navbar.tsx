"use client";

import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Route } from "next";

const navItems = [
  { label: "Dashboard", href: "/" as Route },
  { label: "Learn", href: "/learn" as Route },
  { label: "Practice", href: "/practice" as Route },
];

export function Navbar() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-divider bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-7 lg:gap-12">
          <Link href="/" className="flex items-center gap-3 font-bold tracking-tight text-lime">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-lime/30 bg-lime/10 font-mono text-sm shadow-glow">
              HC
            </span>
            <span className="hidden text-[1.35rem] sm:inline">HACKERS CAMPUS</span>
          </Link>
          <div className="hidden h-[72px] items-center gap-7 text-[15px] font-medium md:flex">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    isActive
                      ? "flex h-full items-center border-b-2 border-lime text-lime font-semibold"
                      : "flex h-full items-center border-b-2 border-transparent text-muted transition-colors hover:text-ink"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted sm:gap-3">
          <button
            aria-label="Search"
            onClick={() => alert("Global search shortcut: Press / to search labs")}
            className="rounded-lg p-2 transition hover:bg-panel hover:text-ink"
          >
            <Search size={20} />
          </button>
          <button
            aria-label="Notifications"
            onClick={() => alert("You have 1 new notification: New practice challenge available!")}
            className="relative rounded-lg p-2 transition hover:bg-panel hover:text-ink"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
          </button>
          <div className="relative" ref={profileRef}>
            <button
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
              className="ml-1 flex items-center gap-2 rounded-lg p-1 transition hover:bg-panel"
            >
              <span className="lime-ring flex h-9 w-9 items-center justify-center rounded-full border border-lime/20 bg-panelSubtle font-mono text-xs text-lime font-bold">
                PR
              </span>
              <ChevronDown
                size={14}
                className={`hidden transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-xl border border-panelBorder bg-panel p-2 shadow-2xl">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block border-b border-divider px-3 py-3 hover:bg-panelSubtle rounded-lg transition"
                >
                  <p className="font-semibold text-ink">Pavan Reddy</p>
                  <p className="font-mono text-xs text-lime">Level 12 · 2,450 XP</p>
                </Link>

                <div className="mt-1 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-panelSubtle hover:text-lime"
                  >
                    <UserRound size={16} /> Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-panelSubtle hover:text-lime"
                  >
                    <Settings size={16} /> Manage Account
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-panelSubtle hover:text-lime"
                  >
                    <ShieldCheck size={16} /> Badges & Certificates
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-lime font-bold transition hover:bg-lime/10"
                  >
                    <Shield size={16} /> Admin Console
                  </Link>
                </div>

                <button
                  onClick={() => {
                    alert("Logged out of Hackers Campus.");
                    setProfileOpen(false);
                  }}
                  className="mt-1 flex w-full items-center gap-3 border-t border-divider px-3 py-2.5 text-sm text-danger transition hover:text-red-300"
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
