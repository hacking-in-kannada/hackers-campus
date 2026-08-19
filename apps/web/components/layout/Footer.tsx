import {
  Globe,
  MonitorPlay,
  Group,
  Terminal,
  Code2,
  BookOpen,
  Send
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", href: "/" },
      { label: "Learn", href: "/learn" },
      { label: "Practice", href: "/practice" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Community", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Support", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" }
    ]
  }
];

const socialIcons = [Globe, MonitorPlay, Group, Terminal, Code2, BookOpen, Send];

export function Footer() {
  return (
    <footer className="border-t border-panelBorder bg-[#080d11] pb-8 pt-8">
      <div className="mx-auto max-w-[1440px] px-6 md:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="mb-1 text-xl font-bold text-lime">HACKERS CAMPUS</div>
            <p className="text-muted">Learn. Practice. Compete.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-5">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-ink">
                  {group.title}
                </h4>
                <ul className="space-y-3 text-sm text-muted">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href as Route} className="transition-colors hover:text-lime">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-ink">
              Follow Hackers Campus
            </h4>
            <div className="flex flex-wrap gap-4 text-muted">
              {socialIcons.map((Icon, index) => (
                <a key={index} href="#" className="transition-colors hover:text-lime">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-panelBorder pt-6 text-sm md:flex-row">
          <p className="text-[#687380]">Copyright 2026 Hackers Campus. All rights reserved.</p>
          <p className="font-mono text-[#687380]">Made for hackers.</p>
        </div>
      </div>
    </footer>
  );
}
