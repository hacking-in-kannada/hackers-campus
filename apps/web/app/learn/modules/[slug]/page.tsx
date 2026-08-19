"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  Flame,
  HelpCircle,
  Laptop,
  Layers,
  Link as LinkIcon,
  Lock,
  Monitor,
  Network,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { Route } from "next";

interface ModuleRoom {
  id: string;
  slug: string;
  title: string;
  description: string;
  completed: boolean;
  duration?: string;
}

interface ModuleDetails {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string[];
  artworkType: "windows" | "active-directory" | "linux" | "web";
  rooms: ModuleRoom[];
  nextStep: {
    title: string;
    description: string;
    slug: string;
  };
}

const MODULE_DATA: Record<string, ModuleDetails> = {
  "windows-exploitation-basics": {
    id: "mod-win-01",
    slug: "windows-exploitation-basics",
    title: "Windows Exploitation Basics",
    tagline:
      "Hacking Windows is often daunting. Grasp the fundamentals of core Windows concepts and Active Directory vulnerabilities.",
    description: [
      "Windows is the most popular operating system, used by both individuals and within corporate environments. Windows systems are often linked together to create networks, which are used in most enterprises around the world.",
      "This module will explore everything from getting started with using Windows, to attacking common flaws that are found in common Windows systems.",
    ],
    artworkType: "windows",
    rooms: [
      {
        id: "r1",
        slug: "windows-fundamentals-1",
        title: "Windows Fundamentals 1",
        description:
          "In part 1 of the Windows Fundamentals module, we'll start our journey learning about the Windows desktop, the NTFS file system, UAC, the Control Panel, and more..",
        completed: true,
      },
      {
        id: "r2",
        slug: "windows-fundamentals-2",
        title: "Windows Fundamentals 2",
        description:
          "In part 2 of the Windows Fundamentals module, discover more about System Configuration, UAC Settings, Resource Monitoring, the Windows Registry and more..",
        completed: true,
      },
      {
        id: "r3",
        slug: "active-directory-basics",
        title: "Active Directory Basics",
        description:
          "This room will introduce the basic concepts and functionality provided by Active Directory.",
        completed: true,
      },
      {
        id: "r4",
        slug: "metasploit-introduction",
        title: "Metasploit: Introduction",
        description:
          "An introduction to the main components of the Metasploit Framework.",
        completed: true,
      },
      {
        id: "r5",
        slug: "metasploit-exploitation",
        title: "Metasploit: Exploitation",
        description:
          "Using Metasploit for scanning, vulnerability assessment and exploitation.",
        completed: true,
      },
    ],
    nextStep: {
      title: "Shells and Privilege Escalation",
      description:
        "Once you have initial access on a machine, learn how to escalate your account privileges to root.",
      slug: "shells-and-privilege-escalation",
    },
  },
  "active-directory-security": {
    id: "mod-ad-01",
    slug: "active-directory-security",
    title: "Active Directory Security",
    tagline:
      "Master enterprise identity architecture, Kerberos authentication protocol mechanics, and Domain Controller attack vectors.",
    description: [
      "Active Directory is the backbone of modern enterprise enterprise environments, managing identity, authentication, and policy enforcement for thousands of systems.",
      "This module dives deep into Active Directory architecture, Kerberoasting attacks, BloodHound attack path mapping, and group policy hijacking.",
    ],
    artworkType: "active-directory",
    rooms: [
      {
        id: "r1",
        slug: "kerberos-fundamentals",
        title: "Kerberos Fundamentals",
        description:
          "Understand tickets, KDC architecture, AS-REQ / AS-REP exchanges, and service ticket extraction.",
        completed: true,
      },
      {
        id: "r2",
        slug: "active-directory-enumeration",
        title: "Active Directory Enumeration",
        description:
          "Enumerate domain users, groups, GPOs, and Kerberoastable SPNs using Impacket and BloodHound.",
        completed: true,
      },
      {
        id: "r3",
        slug: "kerberoasting-deep-dive",
        title: "Kerberoasting Deep Dive",
        description:
          "Request service tickets for MSSQL and web service accounts and perform offline dictionary cracking with Hashcat.",
        completed: true,
      },
      {
        id: "r4",
        slug: "gpo-abuse-privilege-escalation",
        title: "GPO Abuse & Scheduled Task Hijacking",
        description:
          "Exploit GenericAll permissions on Group Policy Objects to execute SYSTEM commands across all domain machines.",
        completed: true,
      },
      {
        id: "r5",
        slug: "cross-forest-trust-exploitation",
        title: "Cross-Forest Trust & Golden Tickets",
        description:
          "Forge inter-realm Kerberos TGT tickets with ExtraSids to cross bidirectional forest trusts.",
        completed: true,
      },
    ],
    nextStep: {
      title: "Active Directory Certificate Services (AD CS)",
      description:
        "Learn how misconfigured certificate templates (ESC1-ESC8) can be abused for full domain takeover.",
      slug: "ad-cs-exploitation",
    },
  },
};

// Artwork component for shattered Windows / AD logo
function ShatteredArtwork({ type }: { type: ModuleDetails["artworkType"] }) {
  if (type === "windows") {
    return (
      <svg
        viewBox="0 0 280 240"
        className="h-44 w-52 sm:h-56 sm:w-64 drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="winGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="winGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>

        {/* Top-Left Pane (Shattered shards) */}
        <polygon points="50,40 100,32 110,75 55,80" fill="url(#winGrad1)" />
        <polygon points="112,30 130,28 132,70 114,75" fill="url(#winGrad1)" />
        <polygon points="52,85 105,82 108,110 48,112" fill="url(#winGrad1)" />
        <polygon points="110,82 132,75 133,110 110,111" fill="url(#winGrad1)" />

        {/* Top-Right Pane (Shattered shards) */}
        <polygon points="145,26 210,16 215,65 147,70" fill="url(#winGrad2)" />
        <polygon points="218,15 240,12 242,60 220,64" fill="url(#winGrad2)" />
        <polygon points="146,76 215,70 216,108 145,110" fill="url(#winGrad2)" />
        <polygon points="220,70 242,65 245,106 221,107" fill="url(#winGrad2)" />

        {/* Bottom-Left Pane */}
        <polygon points="46,120 108,119 105,160 48,155" fill="url(#winGrad1)" />
        <polygon points="110,119 133,118 132,160 108,161" fill="url(#winGrad1)" />
        <polygon points="50,162 104,166 100,205 52,198" fill="url(#winGrad1)" />
        <polygon points="106,166 131,165 130,208 102,207" fill="url(#winGrad1)" />

        {/* Bottom-Right Pane */}
        <polygon points="145,118 216,116 218,160 146,162" fill="url(#winGrad2)" />
        <polygon points="221,115 245,114 242,158 223,159" fill="url(#winGrad2)" />
        <polygon points="146,168 218,166 215,220 145,210" fill="url(#winGrad2)" />
        <polygon points="223,165 242,163 238,214 219,218" fill="url(#winGrad2)" />

        {/* Floating Glass Shards */}
        <polygon points="35,60 42,52 40,68" fill="#38BDF8" />
        <polygon points="150,10 162,5 158,18" fill="#38BDF8" />
        <polygon points="255,80 268,75 260,95" fill="#38BDF8" />
        <polygon points="135,225 145,232 138,238" fill="#38BDF8" />
        <polygon points="25,140 38,148 30,160" fill="#38BDF8" />
        <polygon points="250,185 262,192 255,202" fill="#38BDF8" />
      </svg>
    );
  }

  // Default Cyber Forest Artwork for AD
  return (
    <svg
      viewBox="0 0 280 240"
      className="h-44 w-52 sm:h-56 sm:w-64 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="140" cy="120" r="90" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
      <circle cx="140" cy="120" r="60" stroke="#A855F7" strokeWidth="1.5" strokeOpacity="0.7" />

      <rect x="115" y="30" width="50" height="35" rx="8" fill="#1E1B4B" stroke="#A855F7" strokeWidth="2" />
      <circle cx="140" cy="48" r="6" fill="#A855F7" />

      <line x1="140" y1="65" x2="140" y2="105" stroke="#A855F7" strokeWidth="2" />
      <line x1="75" y1="105" x2="205" y2="105" stroke="#A855F7" strokeWidth="2" />

      <line x1="75" y1="105" x2="75" y2="140" stroke="#A855F7" strokeWidth="2" />
      <line x1="140" y1="105" x2="140" y2="140" stroke="#A855F7" strokeWidth="2" />
      <line x1="205" y1="105" x2="205" y2="140" stroke="#A855F7" strokeWidth="2" />

      <rect x="52" y="140" width="46" height="30" rx="6" fill="#0F172A" stroke="#22C55E" strokeWidth="1.5" />
      <rect x="117" y="140" width="46" height="30" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="182" y="140" width="46" height="30" rx="6" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
    </svg>
  );
}

export default function ModuleDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "windows-exploitation-basics";

  const moduleData = useMemo(() => {
    return MODULE_DATA[slug] || MODULE_DATA["windows-exploitation-basics"];
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#090E17] pb-16 text-[#E2E8F0]">
      {/* 1. Top Dark Hero Banner (Matching TryHackMe Screenshot 1) */}
      <section className="relative overflow-hidden border-b border-[#1E293B] bg-gradient-to-r from-[#0C1322] via-[#0E1A30] to-[#0A1220] py-10 sm:py-14">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1),transparent_70%)]" />

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Link
            href="/learn/modules"
            className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white transition mb-6"
          >
            <ArrowLeft size={14} />
            <span>Back to all modules</span>
          </Link>

          <div className="flex flex-col-reverse justify-between gap-8 lg:flex-row lg:items-center">
            {/* Left: Title, Tagline, Paragraphs */}
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {moduleData.title}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-200">
                {moduleData.tagline}
              </p>
              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {moduleData.description.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Right: Shattered 3D Artwork */}
            <div className="relative shrink-0 flex items-center justify-center self-center lg:self-auto">
              <ShatteredArtwork type={moduleData.artworkType} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content 2-Column Layout */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Column: List of Rooms in this Module (Screenshot 1) */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-[#1E293B] pb-4">
              Rooms in this Module ({moduleData.rooms.length})
            </h2>

            <div className="space-y-6">
              {moduleData.rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-start gap-4 transition-all hover:translate-x-1"
                >
                  {/* Circular Checkmark Badge */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-500/40 bg-sky-950/60 text-sky-400 shadow-md">
                    <Check size={18} strokeWidth={2.5} />
                  </div>

                  {/* Room Details */}
                  <div className="flex-1">
                    <Link
                      href={`/learn/rooms/${room.slug}` as Route}
                      className="inline-flex items-center gap-1.5 text-base font-bold text-white hover:text-sky-400 transition"
                    >
                      <span>{room.title}</span>
                      <ExternalLink size={14} className="text-slate-400" />
                    </Link>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {room.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar Cards (Screenshot 1) */}
          <div className="space-y-6">
            {/* Card 1: Next Steps */}
            <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Next steps</h3>

              <div className="flex items-start gap-3 rounded-xl border border-[#1E293B] bg-[#0E1624] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/50 text-amber-400">
                  <Terminal size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{moduleData.nextStep.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {moduleData.nextStep.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: What are modules? */}
            <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-6 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white">What are modules?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A learning pathway is made up of modules, and a module is made of bite-sized rooms (think of a room like a mini security lab).
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
