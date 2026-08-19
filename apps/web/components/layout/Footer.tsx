import {
  Globe,
  MonitorPlay,
  Users,
  Terminal,
  Code2,
  BookOpen,
  Send,
  ShieldCheck,
  Flame,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "Mission Control", href: "/" },
      { label: "Learning Paths", href: "/learn/paths" },
      { label: "Modules Library", href: "/learn/modules" },
      { label: "Cybersecurity Roadmap", href: "/learn/roadmap" },
      { label: "Practice Labs", href: "/practice" },
    ],
  },
  {
    title: "Community & Learn",
    links: [
      { label: "Active Directory Security", href: "/learn/modules/active-directory-security" },
      { label: "Kerberos Fundamentals", href: "/learn/rooms/kerberos-fundamentals" },
      { label: "Public Profile", href: "/profile" },
      { label: "Account Settings", href: "/settings" },
    ],
  },
  {
    title: "Platform Hub",
    links: [
      { label: "Lab Fleet (Admin)", href: "/admin/labs" },
      { label: "Room Builder", href: "/admin/builder" },
      { label: "User Management", href: "/admin/users" },
      { label: "Platform Overview", href: "/admin" },
    ],
  },
];

const socialIcons = [
  { icon: Globe, label: "Website", href: "#" },
  { icon: MonitorPlay, label: "Streams", href: "#" },
  { icon: Users, label: "Community", href: "#" },
  { icon: Terminal, label: "CLI", href: "#" },
  { icon: Code2, label: "GitHub", href: "https://github.com/hacking-in-kannada/hackers-campus" },
  { icon: BookOpen, label: "Docs", href: "#" },
  { icon: Send, label: "Telegram", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#070B14] pb-10 pt-12 text-slate-400">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                HACKERS <span className="text-[#22C55E]">CAMPUS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              Standard offensive & defensive cybersecurity training. Learn real-world tradecraft, master threat vectors, and earn verifiable certifications.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded-md px-3 py-1.5 w-fit">
              <Flame size={13} className="text-emerald-400 animate-pulse" />
              <span>SYSTEM ACTIVE & RUNNING</span>
            </div>
          </div>

          {/* Nav Links Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-5">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white">
                  {group.title}
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href as Route}
                        className="transition-colors hover:text-[#22C55E] flex items-center gap-1.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social / Community Column */}
          <div className="lg:col-span-3">
            <h4 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white">
              Connect With Us
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Join our community of ethical hackers, security analysts, and CTF competitors.
            </p>
            <div className="flex flex-wrap gap-2.5 text-slate-400">
              {socialIcons.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="rounded-lg border border-[#1E293B] bg-[#0E1624] p-2 hover:border-[#22C55E]/50 hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#1E293B] pt-6 text-xs md:flex-row text-slate-500 font-mono">
          <p>© 2026 Hackers Campus. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Crafted for security practitioners</span>
            <span className="text-[#22C55E]">•</span>
            <span className="text-slate-400">v0.1.0</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
