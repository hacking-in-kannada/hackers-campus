"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Crosshair,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  Flame,
  Globe,
  HardDrive,
  Key,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Minus,
  Network,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Swords,
  Terminal,
  Trophy,
  Users2,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Route } from "next";

/* ── Types ─────────────────────────────────────────── */

interface Task {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
  description?: string;
}

interface Room {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Intermediate" | "Hard";
  estimatedMinutes: number;
  xp: number;
  tasks: Task[];
}

interface ModuleNode {
  id: string;
  number: number;
  slug: string;
  title: string;
  category: "foundation" | "offensive" | "defensive" | "specialized" | "governance";
  iconName: string;
  description: string;
  totalRoomsCount: number;
  rooms: Room[];
}

/* ── Dataset matching cybersecurityroadmap.web.app ─── */

const MODULES_DATA: ModuleNode[] = [
  // 1. Foundation
  {
    id: "mod-1",
    number: 1,
    slug: "foundation",
    title: "Foundation",
    category: "foundation",
    iconName: "terminal",
    description: "Core computer science, networking protocols, Linux CLI, and security primitives required for all security tracks.",
    totalRoomsCount: 11,
    rooms: [
      {
        id: "rm-1-1",
        slug: "windows-fundamentals-1",
        title: "Windows Fundamentals 1",
        difficulty: "Easy",
        estimatedMinutes: 30,
        xp: 250,
        tasks: [
          { id: "t-1-1-1", title: "Understanding Windows Client vs Server Editions", completed: true, xp: 25 },
          { id: "t-1-1-2", title: "Navigating the Windows GUI & Taskbar", completed: true, xp: 25 },
          { id: "t-1-1-3", title: "Core Architecture & Kernel Overview", completed: true, xp: 25 },
          { id: "t-1-1-4", title: "NTFS Features & Access Control Lists", completed: true, xp: 25 },
          { id: "t-1-1-5", title: "The Windows System32 Folder & Executables", completed: true, xp: 25 },
          { id: "t-1-1-6", title: "User Accounts, SIDs, and Administrator RID 500", completed: true, xp: 25 },
          { id: "t-1-1-7", title: "User Account Control (UAC) Elevation Prompts", completed: true, xp: 25 },
          { id: "t-1-1-8", title: "Control Panel & Registry Settings Assessment", completed: true, xp: 75 },
        ],
      },
      {
        id: "rm-1-2",
        slug: "linux-fundamentals",
        title: "Linux Command Line Mastery",
        difficulty: "Easy",
        estimatedMinutes: 40,
        xp: 300,
        tasks: [
          { id: "t-1-2-1", title: "Filesystem Hierarchy Standard (/etc, /var, /bin)", completed: true, xp: 30 },
          { id: "t-1-2-2", title: "Permissions, SUID, SGID and Sticky Bit", completed: true, xp: 40 },
          { id: "t-1-2-3", title: "Process Management & Cron Jobs", completed: true, xp: 30 },
          { id: "t-1-2-4", title: "SSH Keys & Remote Shell Access", completed: false, xp: 50 },
        ],
      },
      {
        id: "rm-1-3",
        slug: "networking-basics",
        title: "TCP/IP & Network Protocols",
        difficulty: "Easy",
        estimatedMinutes: 35,
        xp: 250,
        tasks: [
          { id: "t-1-3-1", title: "OSI 7-Layer Model vs TCP/IP Stack", completed: true, xp: 30 },
          { id: "t-1-3-2", title: "TCP 3-Way Handshake & Flags (SYN/ACK)", completed: true, xp: 35 },
          { id: "t-1-3-3", title: "DNS Hierarchy & Root Servers", completed: true, xp: 35 },
          { id: "t-1-3-4", title: "HTTP/HTTPS Request & Response Headers", completed: false, xp: 50 },
        ],
      },
    ],
  },

  // 2. Offensive Security
  {
    id: "mod-2",
    number: 2,
    slug: "offensive-security-operator",
    title: "Offensive Security (Red Team)",
    category: "offensive",
    iconName: "flame",
    description: "Penetration testing methodology, active reconnaissance, initial compromise, privilege escalation, and lateral movement.",
    totalRoomsCount: 25,
    rooms: [
      {
        id: "rm-2-1",
        slug: "kerberos-fundamentals",
        title: "Kerberos Fundamentals & AD Attacks",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        xp: 350,
        tasks: [
          { id: "t-2-1-1", title: "Introduction to Kerberos Authentication & Port 88", completed: true, xp: 25 },
          { id: "t-2-1-2", title: "Key Distribution Center (KDC) Components & AS/TGS", completed: true, xp: 35 },
          { id: "t-2-1-3", title: "Kerberoasting & Service Ticket Extraction with Hashcat", completed: false, xp: 50 },
          { id: "t-2-1-4", title: "Golden Ticket & Silver Ticket Forgery", completed: false, xp: 60 },
        ],
      },
      {
        id: "rm-2-2",
        slug: "network-reconnaissance",
        title: "Active Network Recon & Scanning",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        xp: 300,
        tasks: [
          { id: "t-2-2-1", title: "Nmap Stealth SYN Scan & NSE Scripts", completed: true, xp: 40 },
          { id: "t-2-2-2", title: "Service Version Detection & OS Fingerprinting", completed: false, xp: 40 },
          { id: "t-2-2-3", title: "SMB Enumeration with Enum4linux & NetExec", completed: false, xp: 50 },
        ],
      },
      {
        id: "rm-2-3",
        slug: "metasploit-exploitation",
        title: "Metasploit Framework Exploitation",
        difficulty: "Intermediate",
        estimatedMinutes: 50,
        xp: 400,
        tasks: [
          { id: "t-2-3-1", title: "Exploit Modules, Auxiliary & Payloads", completed: false, xp: 50 },
          { id: "t-2-3-2", title: "Meterpreter Sessions & Post-Exploitation", completed: false, xp: 50 },
          { id: "t-2-3-3", title: "MS17-010 EternalBlue Remote Code Execution", completed: false, xp: 80 },
        ],
      },
    ],
  },
  {
    id: "mod-8",
    number: 8,
    slug: "malware-reverse-engineering",
    title: "Malware & Reverse Engineering",
    category: "offensive",
    iconName: "code",
    description: "Static and dynamic analysis of portable executables (PE), assembly decompilation with Ghidra, and unpacking techniques.",
    totalRoomsCount: 14,
    rooms: [
      {
        id: "rm-8-1",
        slug: "ghidra-decompilation",
        title: "Static Analysis with Ghidra & IDA",
        difficulty: "Hard",
        estimatedMinutes: 60,
        xp: 450,
        tasks: [
          { id: "t-8-1-1", title: "x86/x64 Registers and Stack Frame Analysis", completed: false, xp: 40 },
          { id: "t-8-1-2", title: "Decompiling C++ Binaries & Finding Logic Bugs", completed: false, xp: 50 },
          { id: "t-8-1-3", title: "Unpacking UPX Executables & Import Table Reconstruction", completed: false, xp: 60 },
        ],
      },
      {
        id: "rm-8-2",
        slug: "dynamic-sandbox",
        title: "Dynamic Triage in Sandbox Environments",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        xp: 350,
        tasks: [
          { id: "t-8-2-1", title: "Procmon & Regshot Registry Persistence Monitoring", completed: false, xp: 40 },
          { id: "t-8-2-2", title: "Fiddler / INetSim Simulated C2 Traffic Analysis", completed: false, xp: 45 },
        ],
      },
    ],
  },
  {
    id: "mod-9",
    number: 9,
    slug: "hardware-security",
    title: "Hardware Security",
    category: "offensive",
    iconName: "cpu",
    description: "UART, JTAG, SPI bus sniffing, microcontroller firmware extraction, and hardware side-channel attacks.",
    totalRoomsCount: 11,
    rooms: [
      {
        id: "rm-9-1",
        slug: "uart-firmware",
        title: "Hardware Bus Exploitation (UART & JTAG)",
        difficulty: "Hard",
        estimatedMinutes: 50,
        xp: 400,
        tasks: [
          { id: "t-9-1-1", title: "Finding UART Pinouts with Multimeter & Logic Analyzer", completed: false, xp: 45 },
          { id: "t-9-1-2", title: "Dumping Flash Memory via SPI Flashrom", completed: false, xp: 55 },
        ],
      },
    ],
  },
  {
    id: "mod-10",
    number: 10,
    slug: "industrial-security",
    title: "Industrial Security",
    category: "offensive",
    iconName: "radio",
    description: "SCADA, ICS, Modbus, DNP3, and PLC protocol exploitation across critical infrastructure targets.",
    totalRoomsCount: 12,
    rooms: [
      {
        id: "rm-10-1",
        slug: "scada-modbus",
        title: "Modbus/TCP Network Attack & Injection",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        xp: 350,
        tasks: [
          { id: "t-10-1-1", title: "Modbus Function Code 05/06 Coil Register Writes", completed: false, xp: 40 },
          { id: "t-10-1-2", title: "PLC Firmware Update Tampering", completed: false, xp: 50 },
        ],
      },
    ],
  },

  // 3. Defensive Security
  {
    id: "mod-3",
    number: 3,
    slug: "soc-threat-analyst",
    title: "Defensive Security (Blue Team)",
    category: "defensive",
    iconName: "shield",
    description: "Security Operations Center (SOC) triage, SIEM query construction, packet inspection, and active endpoint response.",
    totalRoomsCount: 28,
    rooms: [
      {
        id: "rm-3-1",
        slug: "splunk-siem-hunting",
        title: "Splunk SIEM Threat Hunting",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        xp: 350,
        tasks: [
          { id: "t-3-1-1", title: "Writing Splunk Processing Language (SPL) Queries", completed: true, xp: 35 },
          { id: "t-3-1-2", title: "Detecting Pass-the-Hash with Windows Event 4624", completed: false, xp: 45 },
          { id: "t-3-1-3", title: "Correlation Rules & Alert Dashboards", completed: false, xp: 50 },
        ],
      },
      {
        id: "rm-3-2",
        slug: "wireshark-pcap",
        title: "Network Forensic Investigation (Wireshark)",
        difficulty: "Easy",
        estimatedMinutes: 35,
        xp: 250,
        tasks: [
          { id: "t-3-2-1", title: "Filtering TCP Streams & Extracting Transferred Files", completed: true, xp: 30 },
          { id: "t-3-2-2", title: "Identifying Cobalt Strike Beacon Heartbeats", completed: false, xp: 50 },
        ],
      },
    ],
  },
  {
    id: "mod-4",
    number: 4,
    slug: "purple-team",
    title: "Purple Team",
    category: "defensive",
    iconName: "swords",
    description: "Bridging red and blue operations: MITRE ATT&CK atomic tests, detection engineering, and telemetry gap closure.",
    totalRoomsCount: 11,
    rooms: [
      {
        id: "rm-4-1",
        slug: "atomic-red-team",
        title: "Atomic Red Team & Detection Validation",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        xp: 300,
        tasks: [
          { id: "t-4-1-1", title: "Executing T1059 Command and Scripting Interpreter Tests", completed: false, xp: 35 },
          { id: "t-4-1-2", title: "Authoring Sigma Rules from Telemetry Artifacts", completed: false, xp: 45 },
        ],
      },
    ],
  },
  {
    id: "mod-12",
    number: 12,
    slug: "cryptography",
    title: "Cryptography",
    category: "defensive",
    iconName: "key",
    description: "Symmetric & asymmetric ciphers, hashing, PKI, digital signatures, TLS handshakes, and quantum-resistant algorithms.",
    totalRoomsCount: 14,
    rooms: [
      {
        id: "rm-12-1",
        slug: "crypto-pki",
        title: "Public Key Infrastructure (PKI) & TLS",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        xp: 300,
        tasks: [
          { id: "t-12-1-1", title: "RSA Key Generation & Certificate Authority Signing", completed: false, xp: 35 },
          { id: "t-12-1-2", title: "Diffie-Hellman Key Exchange Math Breakdown", completed: false, xp: 40 },
        ],
      },
    ],
  },
  {
    id: "mod-13",
    number: 13,
    slug: "identity-access-management",
    title: "Identity & Access Management (IAM)",
    category: "defensive",
    iconName: "users",
    description: "OAuth 2.0, OpenID Connect, SAML 2.0 assertions, Active Directory Federation Services (ADFS), and Zero Trust access.",
    totalRoomsCount: 11,
    rooms: [
      {
        id: "rm-13-1",
        slug: "oauth-saml-security",
        title: "OAuth 2.0 & SAML Token Security",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        xp: 350,
        tasks: [
          { id: "t-13-1-1", title: "OAuth Redirect URI Validation Bypass", completed: false, xp: 40 },
          { id: "t-13-1-2", title: "SAML XML Signature Wrapping (XSW) Exploitation", completed: false, xp: 50 },
        ],
      },
    ],
  },

  // 4. Specialized Domains
  {
    id: "mod-5",
    number: 5,
    slug: "web-attack-specialist",
    title: "Application Security (AppSec)",
    category: "specialized",
    iconName: "globe",
    description: "OWASP Top 10, API security, JWT tampering, Business Logic Flaws, and CI/CD SAST/DAST pipeline integration.",
    totalRoomsCount: 20,
    rooms: [
      {
        id: "rm-5-1",
        slug: "owasp-top-10",
        title: "OWASP Top 10 Deep Dive",
        difficulty: "Intermediate",
        estimatedMinutes: 50,
        xp: 400,
        tasks: [
          { id: "t-5-1-1", title: "SQL Injection: Error-based & Time-based Blind", completed: false, xp: 45 },
          { id: "t-5-1-2", title: "Cross-Site Scripting (XSS) DOM & Stored vectors", completed: false, xp: 40 },
          { id: "t-5-1-3", title: "Server-Side Request Forgery (SSRF) Cloud Metadata Access", completed: false, xp: 55 },
        ],
      },
    ],
  },
  {
    id: "mod-6",
    number: 6,
    slug: "cloud-security-analyst",
    title: "Cloud Security",
    category: "specialized",
    iconName: "cloud",
    description: "AWS, Azure, and GCP security architecture, IAM policy privilege escalation, Kubernetes RBAC, and container breakout.",
    totalRoomsCount: 18,
    rooms: [
      {
        id: "rm-6-1",
        slug: "aws-iam-pentest",
        title: "AWS IAM Privilege Escalation",
        difficulty: "Hard",
        estimatedMinutes: 55,
        xp: 450,
        tasks: [
          { id: "t-6-1-1", title: "Enumerating AWS Permissions with Pacu", completed: false, xp: 45 },
          { id: "t-6-1-2", title: "Abusing iam:PassRole to Assume EC2 Admin Role", completed: false, xp: 60 },
        ],
      },
    ],
  },
  {
    id: "mod-7",
    number: 7,
    slug: "ai-security",
    title: "AI Security",
    category: "specialized",
    iconName: "sparkles",
    description: "LLM jailbreaking, prompt injection, model extraction, training data poisoning, and securing AI agent toolchains.",
    totalRoomsCount: 12,
    rooms: [
      {
        id: "rm-7-1",
        slug: "llm-prompt-injection",
        title: "LLM Direct & Indirect Prompt Injection",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        xp: 300,
        tasks: [
          { id: "t-7-1-1", title: "System Prompt Extraction & Guardrail Bypass", completed: false, xp: 40 },
          { id: "t-7-1-2", title: "Indirect Prompt Injection via Web Retrieval (RAG)", completed: false, xp: 50 },
        ],
      },
    ],
  },
  {
    id: "mod-11",
    number: 11,
    slug: "blockchain-security",
    title: "Blockchain Security",
    category: "specialized",
    iconName: "network",
    description: "Solidity smart contract auditing, reentrancy vulnerabilities, oracle manipulation, and flash loan attack analysis.",
    totalRoomsCount: 10,
    rooms: [
      {
        id: "rm-11-1",
        slug: "solidity-reentrancy",
        title: "Solidity Smart Contract Exploitation",
        difficulty: "Hard",
        estimatedMinutes: 50,
        xp: 400,
        tasks: [
          { id: "t-11-1-1", title: "Reentrancy Attacks with Fallback Functions", completed: false, xp: 50 },
          { id: "t-11-1-2", title: "Integer Overflow and Frontrunning in Mempool", completed: false, xp: 45 },
        ],
      },
    ],
  },
  {
    id: "mod-17",
    number: 17,
    slug: "emerging-tech",
    title: "Emerging Technologies",
    category: "specialized",
    iconName: "radio",
    description: "Post-quantum cryptography, Satellite RF comms, 5G standalone architecture security, and neurotech interface security.",
    totalRoomsCount: 8,
    rooms: [
      {
        id: "rm-17-1",
        slug: "5g-network-security",
        title: "5G Core Network Security & Slice Isolation",
        difficulty: "Hard",
        estimatedMinutes: 45,
        xp: 350,
        tasks: [
          { id: "t-17-1-1", title: "SUPI/SUCI IMSI Encryption Assessment", completed: false, xp: 40 },
        ],
      },
    ],
  },
  {
    id: "mod-18",
    number: 18,
    slug: "industry-specializations",
    title: "Industry Specializations",
    category: "specialized",
    iconName: "server",
    description: "Sector-specific cybersecurity requirements across FinTech (PCI-DSS), Healthcare (HIPAA), Automotive (ISO/SAE 21434), and Aerospace.",
    totalRoomsCount: 6,
    rooms: [
      {
        id: "rm-18-1",
        slug: "fintech-pci-dss",
        title: "Fintech Tokenization & API Defense",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        xp: 300,
        tasks: [
          { id: "t-18-1-1", title: "PCI-DSS v4.0 Scope Reduction & Key Vaulting", completed: false, xp: 35 },
        ],
      },
    ],
  },

  // 5. Governance & Architecture
  {
    id: "mod-14",
    number: 14,
    slug: "governance-risk-compliance",
    title: "Governance, Risk & Compliance (GRC)",
    category: "governance",
    iconName: "shieldCheck",
    description: "NIST CSF 2.0, ISO/IEC 27001, SOC 2 Type II, threat modeling with STRIDE, and vendor supply chain risk assessments.",
    totalRoomsCount: 16,
    rooms: [
      {
        id: "rm-14-1",
        slug: "nist-threat-modeling",
        title: "Threat Modeling with STRIDE & NIST CSF",
        difficulty: "Easy",
        estimatedMinutes: 35,
        xp: 250,
        tasks: [
          { id: "t-14-1-1", title: "STRIDE Element Identification on Data Flow Diagrams", completed: false, xp: 30 },
          { id: "t-14-1-2", title: "Risk Scoring with CVSS v3.1 & DREAD Matrix", completed: false, xp: 35 },
        ],
      },
    ],
  },
  {
    id: "mod-15",
    number: 15,
    slug: "security-architecture",
    title: "Security Architecture",
    category: "governance",
    iconName: "layers",
    description: "Enterprise Zero Trust design (NIST SP 800-207), microsegmentation, EDR agent deployment, and resilient disaster recovery.",
    totalRoomsCount: 12,
    rooms: [
      {
        id: "rm-15-1",
        slug: "zero-trust-architecture",
        title: "Enterprise Zero Trust Implementation",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        xp: 350,
        tasks: [
          { id: "t-15-1-1", title: "Policy Enforcement Points (PEP) vs Policy Decision Points (PDP)", completed: false, xp: 40 },
        ],
      },
    ],
  },
  {
    id: "mod-16",
    number: 16,
    slug: "security-research",
    title: "Security Research",
    category: "governance",
    iconName: "terminal",
    description: "Vulnerability disclosure pipelines, Bug Bounty hunting workflows, Proof-of-Concept authoring, and CVE registration.",
    totalRoomsCount: 10,
    rooms: [
      {
        id: "rm-16-1",
        slug: "cve-research-workflow",
        title: "Vulnerability Disclosure & CVE Registration",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        xp: 300,
        tasks: [
          { id: "t-16-1-1", title: "Writing Responsible Disclosure Reports", completed: false, xp: 35 },
        ],
      },
    ],
  },
];

/* ── Icon Selector Helper ──────────────────────────── */

function renderModuleIcon(iconName: string, category: ModuleNode["category"]) {
  const iconProps = { size: 16, className: "shrink-0" };
  switch (iconName) {
    case "flame": return <Flame {...iconProps} className="text-red-400" />;
    case "shield": return <Shield {...iconProps} className={category === "defensive" ? "text-cyan-400" : "text-emerald-400"} />;
    case "terminal": return <Terminal {...iconProps} className="text-emerald-400" />;
    case "code": return <FileCode {...iconProps} className="text-rose-400" />;
    case "cpu": return <Cpu {...iconProps} className="text-pink-400" />;
    case "radio": return <Radio {...iconProps} className="text-amber-400" />;
    case "swords": return <Swords {...iconProps} className="text-teal-300" />;
    case "key": return <Key {...iconProps} className="text-cyan-300" />;
    case "users": return <Users2 {...iconProps} className="text-sky-400" />;
    case "globe": return <Globe {...iconProps} className="text-purple-400" />;
    case "cloud": return <Cloud {...iconProps} className="text-indigo-400" />;
    case "sparkles": return <Sparkles {...iconProps} className="text-amber-300" />;
    case "shieldCheck": return <ShieldCheck {...iconProps} className="text-violet-400" />;
    case "layers": return <Layers {...iconProps} className="text-purple-300" />;
    default: return <Circle {...iconProps} className="text-slate-400" />;
  }
}

/* ── Component ─────────────────────────────────────── */

export default function InteractiveCybersecurityRoadmap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<ModuleNode | null>(null);
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Group modules by category for graph nodes
  const foundationModule = MODULES_DATA.find((m) => m.category === "foundation")!;
  const offensiveModules = MODULES_DATA.filter((m) => m.category === "offensive");
  const defensiveModules = MODULES_DATA.filter((m) => m.category === "defensive");
  const specializedModules = MODULES_DATA.filter((m) => m.category === "specialized");
  const governanceModules = MODULES_DATA.filter((m) => m.category === "governance");

  // Calculate task counts
  const totalTasksCount = useMemo(() => {
    return MODULES_DATA.reduce((acc, m) => {
      return acc + m.rooms.reduce((rAcc, r) => rAcc + r.tasks.length, 0);
    }, 0);
  }, []);

  const completedTasksCount = useMemo(() => {
    return MODULES_DATA.reduce((acc, m) => {
      return acc + m.rooms.reduce((rAcc, r) => rAcc + r.tasks.filter((t) => t.completed).length, 0);
    }, 0);
  }, []);

  const overallProgress = Math.round((completedTasksCount / totalTasksCount) * 100);

  // Node helper
  const renderNodeCard = (mod: ModuleNode) => {
    const isMatchesSearch = searchQuery.trim() !== "" && (
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.rooms.some((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const modTasks = mod.rooms.flatMap((r) => r.tasks);
    const modDone = modTasks.filter((t) => t.completed).length;
    const modTotal = modTasks.length || mod.totalRoomsCount;
    const modProgress = modTasks.length ? Math.round((modDone / modTasks.length) * 100) : 0;

    const categoryBorderColors = {
      foundation: "hover:border-[#22C55E]/80 border-[#22C55E]/30 bg-[#0C1726]",
      offensive: "hover:border-[#F43F5E]/80 border-[#F43F5E]/30 bg-[#160E1E]",
      defensive: "hover:border-[#06B6D4]/80 border-[#06B6D4]/30 bg-[#0A1A24]",
      specialized: "hover:border-[#A855F7]/80 border-[#A855F7]/30 bg-[#150F26]",
      governance: "hover:border-[#8B5CF6]/80 border-[#8B5CF6]/30 bg-[#140E26]",
    };

    const progressFillColors = {
      foundation: "bg-[#22C55E]",
      offensive: "bg-[#F43F5E]",
      defensive: "bg-[#06B6D4]",
      specialized: "bg-[#A855F7]",
      governance: "bg-[#8B5CF6]",
    };

    return (
      <Link
        key={mod.id}
        href={`/learn/paths/${mod.slug}` as Route}
        className={`group relative flex w-full flex-col justify-between rounded-xl border p-4 text-left shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl sm:p-5 ${
          categoryBorderColors[mod.category]
        } ${isMatchesSearch ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-black" : ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/40 p-1.5 border border-white/10">
              {renderModuleIcon(mod.iconName, mod.category)}
            </div>
            <h4 className="text-xs font-bold leading-tight text-white transition group-hover:text-emerald-300 sm:text-sm">
              {mod.number}. {mod.title.replace(/^\d+\.\s*/, "")}
            </h4>
          </div>

          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedModule(mod);
              setExpandedRoomId(mod.rooms[0]?.id || null);
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white transition"
            title="Quick preview tasks"
          >
            <Eye size={12} />
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[11px] text-slate-400">
          <span>{modDone}/{modTotal}</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${progressFillColors[mod.category]}`}
              style={{ width: `${modProgress}%` }}
            />
          </div>
          <span className="text-[10px]">{modProgress}%</span>
        </div>
      </Link>
    );
  };

  return (
    <main className="relative min-h-screen bg-[#070B14] text-[#E2E8F0] overflow-x-hidden selection:bg-emerald-500/30">
      {/* Background cyber grid & glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.08),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Top Navbar Header matching the screenshot */}
      <header className="sticky top-0 z-40 border-b border-[#1A2336] bg-[#070B14]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070B14]">
                <ShieldCheck size={18} className="text-emerald-400" />
              </div>
            </div>
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                HACKERS CAMPUS
              </p>
              <h1 className="text-sm font-extrabold text-white tracking-wide sm:text-base">
                CYBERSEC <span className="text-emerald-400">ROADMAP</span>
              </h1>
            </div>
          </div>

          {/* Search Input Bar matching screenshot */}
          <div className="relative hidden w-full max-w-md md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. SIEM, OSINT, Zero Trust, Linux, Kerberos)..."
              className="w-full rounded-xl border border-[#1E293B] bg-[#0C1322] py-2 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Controls: Zoom, Stats */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#0C1322] p-1 font-mono text-xs text-slate-400">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="rounded p-1 hover:bg-slate-800 hover:text-white transition"
                title="Zoom out"
              >
                <Minus size={13} />
              </button>
              <span className="w-10 text-center text-[10px]">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                className="rounded p-1 hover:bg-slate-800 hover:text-white transition"
                title="Zoom in"
              >
                <Plus size={13} />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="rounded p-1 hover:bg-slate-800 hover:text-white transition ml-1"
                title="Reset zoom"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 font-mono text-xs text-emerald-400">
              <span className="font-bold">{overallProgress}%</span>
              <span className="ml-1 text-[10px] text-slate-400">Done</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search input */}
      <div className="px-4 pt-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. SIEM, Linux, Kerberos)..."
            className="w-full rounded-lg border border-[#1E293B] bg-[#0C1322] py-2 pl-9 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* ── CANVAS TREE VIEW ── */}
      <div
        className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 transition-transform duration-300 origin-top"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* 1. TOP HEADER GLOWING PILL */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-purple-500 opacity-70 blur-md transition duration-500 group-hover:opacity-100" />
            <div className="relative flex items-center gap-2 rounded-2xl border border-emerald-400/60 bg-[#09111E] px-8 py-3 shadow-2xl">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400 border border-cyan-400/40">
                ⓘ
              </span>
              <span className="font-mono text-xs font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-300 uppercase sm:text-sm">
                CYBERSECURITY ROADMAP
              </span>
            </div>
          </div>

          {/* SVG Connection line down to Foundation */}
          <svg width="4" height="32" className="my-1">
            <line x1="2" y1="0" x2="2" y2="32" stroke="#22C55E" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
        </div>

        {/* 2. FOUNDATION PILL & NODE */}
        <div className="mx-auto flex flex-col items-center max-w-sm">
          {/* Foundation Tag */}
          <div className="rounded-full border border-emerald-500/40 bg-emerald-950/40 px-5 py-1 font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-widest shadow-md">
            1. FOUNDATION — CORE PREREQUISITES
          </div>

          <svg width="4" height="16" className="my-1">
            <line x1="2" y1="0" x2="2" y2="16" stroke="#22C55E" strokeWidth="2" />
          </svg>

          {/* Foundation Node Card */}
          <div className="w-full">
            {renderNodeCard(foundationModule)}
          </div>

          {/* SVG Splitter Line down to Offensive / Defensive */}
          <svg width="4" height="24" className="my-1">
            <line x1="2" y1="0" x2="2" y2="24" stroke="#475569" strokeWidth="2" />
          </svg>
        </div>

        {/* 3. SPLIT BRANCH: OFFENSIVE & DEFENSIVE (Circuit Split) */}
        <div className="relative mt-2">
          {/* Top Horizontal Connector Bar */}
          <div className="relative mx-auto hidden md:block max-w-4xl h-6">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 24">
              <path d="M 400 0 L 400 12 L 200 12 L 200 24 M 400 12 L 600 12 L 600 24" fill="none" stroke="#334155" strokeWidth="2" />
              <circle cx="400" cy="12" r="3" fill="#22C55E" />
              <circle cx="200" cy="24" r="3" fill="#F43F5E" />
              <circle cx="600" cy="24" r="3" fill="#06B6D4" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-2">
            {/* LEFT COLUMN: OFFENSIVE SECURITY */}
            <div className="flex flex-col items-center">
              {/* Category Pill */}
              <div className="rounded-full border border-rose-500/50 bg-rose-950/40 px-5 py-1 font-mono text-[10px] font-bold text-rose-400 uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                ⚔️ OFFENSIVE SECURITY (RED TEAM)
              </div>

              <svg width="4" height="16" className="my-1">
                <line x1="2" y1="0" x2="2" y2="16" stroke="#F43F5E" strokeWidth="2" />
              </svg>

              {/* 2-Column Grid of Offensive Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                {offensiveModules.map((mod) => renderNodeCard(mod))}
              </div>
            </div>

            {/* RIGHT COLUMN: DEFENSIVE SECURITY */}
            <div className="flex flex-col items-center">
              {/* Category Pill */}
              <div className="rounded-full border border-cyan-500/50 bg-cyan-950/40 px-5 py-1 font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                🛡️ DEFENSIVE SECURITY (BLUE TEAM)
              </div>

              <svg width="4" height="16" className="my-1">
                <line x1="2" y1="0" x2="2" y2="16" stroke="#06B6D4" strokeWidth="2" />
              </svg>

              {/* 2-Column Grid of Defensive Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                {defensiveModules.map((mod) => renderNodeCard(mod))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. LOWER CONNECTOR BAR TO SPECIALIZED & GOVERNANCE */}
        <div className="relative my-8">
          <div className="relative mx-auto hidden md:block max-w-4xl h-8">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 32">
              <path d="M 200 0 L 200 16 L 400 16 L 400 32 M 600 0 L 600 16 L 400 16 M 400 16 L 200 16 L 200 32 M 400 16 L 600 16 L 600 32" fill="none" stroke="#334155" strokeWidth="2" />
              <circle cx="400" cy="16" r="3" fill="#A855F7" />
              <circle cx="200" cy="32" r="3" fill="#A855F7" />
              <circle cx="600" cy="32" r="3" fill="#8B5CF6" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-2">
            {/* SPECIALIZED DOMAINS */}
            <div className="flex flex-col items-center">
              {/* Category Pill */}
              <div className="rounded-full border border-purple-500/50 bg-purple-950/40 px-5 py-1 font-mono text-[10px] font-bold text-purple-400 uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                ⚡ SPECIALIZED DOMAINS
              </div>

              <svg width="4" height="16" className="my-1">
                <line x1="2" y1="0" x2="2" y2="16" stroke="#A855F7" strokeWidth="2" />
              </svg>

              {/* 3-Column / 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
                {specializedModules.map((mod) => renderNodeCard(mod))}
              </div>
            </div>

            {/* GOVERNANCE & ARCHITECTURE */}
            <div className="flex flex-col items-center">
              {/* Category Pill */}
              <div className="rounded-full border border-violet-500/50 bg-violet-950/40 px-5 py-1 font-mono text-[10px] font-bold text-violet-400 uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                🏛️ GOVERNANCE & ARCHITECTURE
              </div>

              <svg width="4" height="16" className="my-1">
                <line x1="2" y1="0" x2="2" y2="16" stroke="#8B5CF6" strokeWidth="2" />
              </svg>

              {/* 3-Column / 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
                {governanceModules.map((mod) => renderNodeCard(mod))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE MODAL DRAWER: MODULE -> ROOMS -> TASKS ── */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0A111E] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1E293B] bg-[#0E1626] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 border border-white/10 p-2">
                  {renderModuleIcon(selectedModule.iconName, selectedModule.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Module {selectedModule.number} · {selectedModule.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white sm:text-lg">
                    {selectedModule.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/learn/paths/${selectedModule.slug}` as Route}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-3.5 py-1.5 font-mono text-xs font-bold text-[#090E12] shadow-md hover:bg-[#4ADE80] transition"
                >
                  <span>Open Full Path</span>
                  <ExternalLink size={13} />
                </Link>

                <button
                  onClick={() => setSelectedModule(null)}
                  className="rounded-xl border border-slate-700 bg-slate-800/60 p-2 text-slate-400 hover:border-slate-500 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Description Bar */}
            <div className="bg-[#070D18] px-6 py-3 border-b border-[#1E293B] text-xs text-slate-300">
              <p>{selectedModule.description}</p>
            </div>

            {/* Modal Body: Rooms & Tasks List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  Hands-on Rooms in this Module ({selectedModule.rooms.length})
                </h4>
                <span className="font-mono text-xs text-emerald-400">
                  Click room to view tasks & launch lab
                </span>
              </div>

              {selectedModule.rooms.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#1E293B] p-8 text-center text-xs text-slate-400">
                  Rooms for this module are actively being provisioned. Check back shortly!
                </div>
              ) : (
                selectedModule.rooms.map((room) => {
                  const isExpanded = expandedRoomId === room.id;
                  const completedTasks = room.tasks.filter((t) => t.completed).length;
                  const roomProgress = room.tasks.length
                    ? Math.round((completedTasks / room.tasks.length) * 100)
                    : 0;

                  return (
                    <div
                      key={room.id}
                      className="overflow-hidden rounded-xl border border-[#1E293B] bg-[#0C1424] transition-all"
                    >
                      {/* Room Header */}
                      <button
                        onClick={() => setExpandedRoomId(isExpanded ? null : room.id)}
                        className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-[#111C30] transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                            <Terminal size={14} />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-emerald-400">
                              {room.title}
                            </h5>
                            <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400 mt-0.5">
                              <span className="text-amber-400">{room.difficulty}</span>
                              <span>•</span>
                              <span>{room.estimatedMinutes} min</span>
                              <span>•</span>
                              <span className="text-emerald-400">+{room.xp} XP</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
                            <span className="text-slate-400">{completedTasks}/{room.tasks.length}</span>
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${roomProgress}%` }}
                              />
                            </div>
                          </div>

                          <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-white" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expanded Tasks & Actions */}
                      {isExpanded && (
                        <div className="border-t border-[#1E293B] bg-[#080E1A] p-4 sm:p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Room Objectives & Tasks ({room.tasks.length})
                            </p>
                            <Link
                              href={`/learn/rooms/${room.slug}` as Route}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-4 py-1.5 font-mono text-xs font-bold text-[#090E12] shadow-md hover:bg-[#4ADE80] transition"
                            >
                              <span>Launch Room</span>
                              <ExternalLink size={13} />
                            </Link>
                          </div>

                          {/* Task List */}
                          <div className="space-y-2">
                            {room.tasks.map((task, tIdx) => (
                              <div
                                key={task.id}
                                className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-xs transition ${
                                  task.completed
                                    ? "border-emerald-500/30 bg-emerald-950/10 text-slate-300"
                                    : "border-[#1E293B] bg-[#0A1220] text-slate-200"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-[10px] font-bold text-slate-500">
                                    #{tIdx + 1}
                                  </span>
                                  {task.completed ? (
                                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle size={14} className="text-slate-500 shrink-0" />
                                  )}
                                  <span className={task.completed ? "line-through text-slate-400" : ""}>
                                    {task.title}
                                  </span>
                                </div>

                                <span className="font-mono text-[10px] font-bold text-emerald-400 shrink-0">
                                  +{task.xp} XP
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#1E293B] bg-[#0E1626] px-6 py-3 text-xs font-mono text-slate-400">
              <span>Press ESC or click outside to close</span>
              <button
                onClick={() => setSelectedModule(null)}
                className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs text-white hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
