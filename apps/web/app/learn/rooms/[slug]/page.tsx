"use client";

import {
  BarChart3,
  BookOpen,
  ListTodo,
  PlayCircle,
  Users2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { RoomHeader } from "@/components/room/RoomHeader";
import { TaskAccordion, type RoomTaskItem } from "@/components/room/TaskAccordion";
import { RoomChartView } from "@/components/room/RoomChartView";
import { RoomScoreboardView, RoomWriteupsView } from "@/components/room/RoomScoreboardView";

interface RoomMeta {
  title: string;
  tagline: string;
  difficulty: string;
  estimatedMinutes: number;
  solversCount: number;
  targetIp: string;
  hostname: string;
  category: string;
  avatarIcon: "flame" | "shield" | "terminal";
  tasks: RoomTaskItem[];
}

const ROOMS_CATALOG: Record<string, RoomMeta> = {
  "windows-fundamentals-1": {
    title: "Windows Fundamentals 1",
    tagline:
      "In part 1 of the Windows Fundamentals module, we'll start our journey learning about the Windows desktop, the NTFS file system, UAC, the Control Panel, and more..",
    difficulty: "Easy",
    estimatedMinutes: 30,
    solversCount: 594687,
    targetIp: "10.10.110.18",
    hostname: "win-target-01",
    category: "Windows",
    avatarIcon: "terminal",
    tasks: [
      {
        id: "wf-01",
        taskNumber: 1,
        title: "Windows Editions",
        completed: true,
        content: {
          heading: "Understanding Windows Client vs Server Editions",
          description:
            "Microsoft offers several versions of the Windows operating system tailored for consumer desktop workstations, enterprise business laptops, and high-performance server clusters.",
          codeSnippets: [
            {
              command: "winver",
              explanation: "Opens the About Windows dialogue box to verify the OS build version.",
            },
          ],
          tipBox: {
            title: "You'll need to...",
            steps: [
              "Launch the Windows target VM using Start AttackBox.",
              "Open Run (Win + R) and type winver.",
              "Observe the Windows edition installed on the machine.",
            ],
          },
          whyDoingThis:
            "Security engineers need to quickly identify target OS versions to find compatible privilege escalation exploits.",
        },
        questions: [
          {
            id: "wf-q1",
            prompt: "What Windows edition is designed for centralized server workloads?",
            placeholder: "e.g. Windows Server",
            correctAnswer: "Windows Server",
            hint: "Starts with Windows Server.",
            xp: 25,
          },
        ],
      },
      {
        id: "wf-02",
        taskNumber: 2,
        title: "The Desktop (GUI)",
        completed: true,
        content: {
          heading: "Navigating the Windows GUI & Taskbar",
          description:
            "The graphical user interface (GUI) provides intuitive interaction with files, shortcuts, the system tray, and notifications.",
          tipBox: {
            title: "You'll need to...",
            steps: [
              "Inspect the shortcuts on the desktop.",
              "Open File Explorer to navigate the local drives.",
            ],
          },
        },
        questions: [
          {
            id: "wf-q2",
            prompt: "What keyboard shortcut opens Windows File Explorer?",
            placeholder: "e.g. Win + E",
            correctAnswer: "Win + E",
            hint: "Hold Windows key and press E.",
            xp: 25,
          },
        ],
      },
      {
        id: "wf-03",
        taskNumber: 3,
        title: "Introduction to Windows",
        completed: true,
        content: {
          heading: "Core Architecture & Kernel Overview",
          description:
            "Windows employs a hybrid kernel architecture consisting of User Mode (subsystems, applications) and Kernel Mode (Executive, HAL, Device Drivers).",
        },
        questions: [
          {
            id: "wf-q3",
            prompt: "What mode does user-space software run in?",
            placeholder: "e.g. User Mode",
            correctAnswer: "User Mode",
            hint: "Opposite of Kernel Mode.",
            xp: 25,
          },
        ],
      },
      {
        id: "wf-04",
        taskNumber: 4,
        title: "The File System",
        completed: true,
        content: {
          heading: "NTFS Features & Access Control Lists",
          description:
            "NTFS (New Technology File System) supports file permissions (DACLs), encryption (EFS), compression, and Alternate Data Streams (ADS).",
        },
        questions: [
          {
            id: "wf-q4",
            prompt: "What is the primary modern Windows file system called?",
            placeholder: "e.g. NTFS",
            correctAnswer: "NTFS",
            hint: "4 letter acronym.",
            xp: 25,
          },
        ],
      },
      {
        id: "wf-05",
        taskNumber: 5,
        title: "The Windows\\System32 Folders",
        completed: true,
        content: {
          heading: "Essential Binaries in C:\\Windows\\System32",
          description:
            "System32 contains vital Windows system binaries like cmd.exe, powershell.exe, drivers, and dynamic link libraries (DLLs).",
        },
        questions: [
          {
            id: "wf-q5",
            prompt: "What folder contains core 64-bit Windows system executables and DLLs?",
            placeholder: "e.g. System32",
            correctAnswer: "System32",
            hint: "Located directly in C:\\Windows.",
            xp: 25,
          },
        ],
      },
      {
        id: "wf-06",
        taskNumber: 6,
        title: "User Accounts, Profiles, and Permissions",
        completed: true,
        content: {
          heading: "Managing Local and Domain Accounts",
          description:
            "Windows accounts have unique SIDs (Security Identifiers). Built-in Administrator always ends in RID 500.",
        },
        questions: [
          {
            id: "wf-q6",
            prompt: "What built-in account RID is assigned to the primary Administrator?",
            placeholder: "e.g. 500",
            correctAnswer: "500",
            hint: "3 digit number.",
            xp: 25,
          },
        ],
      },
      {
        id: "wf-07",
        taskNumber: 7,
        title: "User Account Control",
        completed: true,
        content: {
          heading: "UAC Privilege Elevation Prompts",
          description:
            "User Account Control (UAC) prompts users for consent before running binaries with elevated administrative token.",
        },
        questions: [
          {
            id: "wf-q7",
            prompt: "What security feature prompts users before applying administrative changes?",
            placeholder: "e.g. UAC",
            correctAnswer: "UAC",
            hint: "Abbreviation for User Account Control.",
            xp: 25,
          },
        ],
      },
      {
        id: "wf-08",
        taskNumber: 8,
        title: "Settings and the Control Panel",
        completed: true,
        content: {
          heading: "Configuring Windows Settings & Registry",
          description:
            "Control Panel and Settings allow administrators to manage network adapters, firewall profiles, and group policies.",
        },
        questions: [
          {
            id: "wf-q8",
            prompt: "Submit the completion flag found in the Control Panel assessment:",
            placeholder: "HC{...}",
            correctAnswer: "HC{windows_fundamentals_completed_100}",
            hint: "Check the flag file on desktop.",
            xp: 50,
          },
        ],
      },
    ],
  },
  "kerberos-fundamentals": {
    title: "Kerberos Fundamentals",
    tagline:
      "You have found Sentinel's internal network and their Domain Controller. Can you analyze Kerberos tickets and pwn the domain?",
    difficulty: "Intermediate",
    estimatedMinutes: 45,
    solversCount: 18420,
    targetIp: "10.10.110.200",
    hostname: "DC01.sentinel.local",
    category: "Active Directory",
    avatarIcon: "shield",
    tasks: [
      {
        id: "k-01",
        taskNumber: 1,
        title: "Introduction to Kerberos Authentication",
        completed: true,
        content: {
          heading: "Never search for things by hand again",
          description:
            "Kerberos is a ticket-based computer network authentication protocol that works on the basis of tickets to allow nodes communicating over a non-secure network to prove their identity to one another.",
          codeSnippets: [
            {
              command: "klist",
              explanation: "Display all Kerberos cached tickets currently held by the logged-in session.",
            },
          ],
          tipBox: {
            title: "You'll need to...",
            steps: [
              "Connect to the target Domain Controller via AttackBox or OpenVPN.",
              "Run 'klist' in your command prompt to verify local Kerberos tickets.",
            ],
          },
        },
        questions: [
          {
            id: "k-q1",
            prompt: "What is the primary protocol port number used by Kerberos authentication (UDP/TCP)?",
            placeholder: "e.g. 88",
            correctAnswer: "88",
            hint: "Kerberos operates on well-known port 88.",
            xp: 25,
          },
        ],
      },
      {
        id: "k-02",
        taskNumber: 2,
        title: "Key Distribution Center (KDC) Components",
        completed: true,
        content: {
          heading: "Understanding the KDC Architecture",
          description:
            "The Key Distribution Center (KDC) resides on the Domain Controller and consists of the Authentication Service (AS) and Ticket Granting Service (TGS).",
        },
        questions: [
          {
            id: "k-q2",
            prompt: "What service within the KDC is responsible for issuing Ticket Granting Tickets (TGT)?",
            placeholder: "e.g. Authentication Service",
            correctAnswer: "Authentication Service",
            hint: "Also abbreviated as AS.",
            xp: 35,
          },
        ],
      },
      {
        id: "k-03",
        taskNumber: 3,
        title: "Kerberoasting & Service Ticket Extraction",
        completed: false,
        content: {
          heading: "Practical Exploitation Lab",
          description:
            "Request Kerberos TGS tickets for SPNs with RC4 encryption and crack the ticket offline with Hashcat.",
        },
        questions: [
          {
            id: "k-q3",
            prompt: "After cracking the extracted TGS ticket with Hashcat, what is the recovered SQL service password?",
            placeholder: "HC{...} or Password",
            correctAnswer: "Summer2025!#",
            hint: "The password ends with exclamation and hash.",
            xp: 50,
          },
        ],
      },
    ],
  },
};

export default function LearnRoomWorkspace() {
  const params = useParams();
  const slug = (params?.slug as string) || "windows-fundamentals-1";

  const room = useMemo(() => {
    return ROOMS_CATALOG[slug] || ROOMS_CATALOG["windows-fundamentals-1"];
  }, [slug]);

  const [activeTab, setActiveTab] = useState<"tasks" | "stats" | "hackers" | "walkthroughs" | "video">("tasks");
  const [tasks, setTasks] = useState<RoomTaskItem[]>(room.tasks);

  const [openTasks, setOpenTasks] = useState<Record<string, boolean>>({
    [tasks[0]?.id || "wf-01"]: true,
  });

  const toggleTask = (taskId: string) => {
    setOpenTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleQuestionSolved = (taskId: string, questionId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <main className="min-h-screen bg-[#090E17] pb-16 text-[#E2E8F0]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. TryHackMe Room Header Bar */}
        <RoomHeader
          breadcrumbParent={{ label: "Back to all modules", href: "/learn/modules" }}
          breadcrumbCurrent={room.title}
          title={room.title}
          tagline={room.tagline}
          difficulty={room.difficulty}
          estimatedMinutes={room.estimatedMinutes}
          solversCount={room.solversCount}
          progressPercent={progressPercent}
          targetIp={room.targetIp}
          machineName={room.hostname}
          category={room.category}
          avatarIcon={room.avatarIcon}
        />

        {/* 2. Room Navigation Tab Bar */}
        <div className="mb-6 flex items-center justify-between border-b border-[#1E293B] pb-1">
          <div className="flex items-center gap-2">
            {[
              { id: "tasks", label: "Tasks", icon: ListTodo, count: tasks.length },
              { id: "stats", label: "Stats", icon: BarChart3 },
              { id: "hackers", label: "Hackers", icon: Users2 },
              { id: "walkthroughs", label: "Walkthroughs", icon: BookOpen },
              { id: "video", label: "Video", icon: PlayCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#22C55E] bg-[#111A28] text-white"
                    : "text-slate-400 hover:bg-[#111A28]/40 hover:text-white"
                }`}
              >
                <tab.icon size={15} className={activeTab === tab.id ? "text-emerald-400" : ""} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="rounded-full bg-[#1E293B] px-1.5 py-0.2 text-[10px] text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden font-mono text-xs text-slate-400 sm:block">
            {completedCount} of {tasks.length} tasks completed
          </div>
        </div>

        {/* 3. Tab Views */}
        {activeTab === "tasks" && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskAccordion
                key={task.id}
                task={task}
                isOpen={!!openTasks[task.id]}
                onToggle={() => toggleTask(task.id)}
                onQuestionSolved={handleQuestionSolved}
              />
            ))}
          </div>
        )}

        {activeTab === "stats" && <RoomChartView />}

        {activeTab === "hackers" && <RoomScoreboardView />}

        {activeTab === "walkthroughs" && <RoomWriteupsView />}

        {activeTab === "video" && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-4">
            <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-[#1E293B] bg-[#0C1322] shadow-2xl aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0C1322] to-[#111A28]" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <PlayCircle size={40} className="text-emerald-400" />
                </div>
                <p className="font-mono text-sm text-slate-300 font-bold">Room Walkthrough Video</p>
                <p className="text-xs text-slate-500">Video content coming soon for this room.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
