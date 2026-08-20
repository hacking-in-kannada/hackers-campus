"use client";

import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  ListTodo,
  Shield,
  Trophy,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { mapApiChallenge, type ApiChallenge } from "@/lib/challenges";
import type { PracticeChallenge } from "@hackers-campus/shared-types";
import { RoomHeader } from "@/components/room/RoomHeader";
import { TaskAccordion, type RoomTaskItem } from "@/components/room/TaskAccordion";
import { RoomChartView } from "@/components/room/RoomChartView";
import { RoomScoreboardView, RoomWriteupsView } from "@/components/room/RoomScoreboardView";
import { readSession } from "@/lib/auth";

export default function PracticeChallengeWorkspace() {
  const params = useParams();
  const slug = params?.slug as string;

  const [challenge, setChallenge] = useState<PracticeChallenge | null>(null);
  const [machineStarting, setMachineStarting] = useState(false);
  const [machineConnection, setMachineConnection] = useState("");
  const [machineError, setMachineError] = useState("");
  const [machineExpiresAt, setMachineExpiresAt] = useState("");
  const [machineTerminating, setMachineTerminating] = useState(false);
  useEffect(() => {
    if (!slug) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/practice/challenges/${slug}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data: ApiChallenge | null) => setChallenge(data ? mapApiChallenge(data) : null))
      .catch(() => setChallenge(null));
  }, [slug]);

  useEffect(() => {
    if (!challenge) return;
    const session = readSession();
    if (!session) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/practice/challenges/${challenge.slug}/machine`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }).then(async (response) => {
      if (!response.ok) return null;
      return response.json();
    }).then((data) => {
      if (!data) return;
      setMachineConnection(`Target IP: ${data.target_ip}`);
      setMachineExpiresAt(data.expires_at);
    }).catch(() => undefined);
  }, [challenge]);

  // Tab State
  const [activeTab, setActiveTab] = useState<"tasks" | "chart" | "scoreboard" | "writeups">("tasks");

  // Transform practice challenge tasks into rich TryHackMe RoomTaskItem structure
  const [tasks, setTasks] = useState<RoomTaskItem[]>([]);
  useEffect(() => {
    if (!challenge) return;
    setTasks(challenge.tasks.map((t, idx) => ({
      id: t.id,
      taskNumber: idx + 1,
      title: t.title,
      completed: t.completed,
      content: {
        heading: `Objective 0${idx + 1} · ${t.title}`,
        description: t.description,
        htmlContent: t.htmlContent,
        imageAttachment: t.imageAttachment,
        codeSnippets: [
          {
            command: `nmap -sC -sV -p- ${challenge.targetMachine.ip}`,
            explanation: "Scan all open ports and detect running service versions on the target machine.",
          },
          {
            command: `curl -i -X GET http://${challenge.targetMachine.ip}/api/auth/session`,
            explanation: "Inspect HTTP response headers and extract authentication cookies.",
          },
        ],
        tipBox: {
          title: "You'll need to...",
          steps: [
            `Connect to the target environment via AttackBox or OpenVPN at IP ${challenge.targetMachine.ip}.`,
            "Analyze the network response and decode any tokens found.",
            "Submit the exact flag string or secret value in the answer box below.",
          ],
        },
        whyDoingThis:
          "Understanding the underlying vulnerability allows you to spot similar security flaws in production architectures and write robust detection rules.",
      },
      questions: [
        {
          id: `${t.id}-q1`,
          prompt: `Submit the flag for ${t.title} found on the target system:`,
          placeholder: t.flagFormat || "HC{...}",
          hint: t.hint || undefined,
          xp: t.xp,
        },
      ],
    })));
  }, [challenge]);

  // Keep track of open accordions (default task 1 open)
  const [openTasks, setOpenTasks] = useState<Record<string, boolean>>({
    [tasks[0]?.id || "t1"]: true,
  });

  const toggleTask = (taskId: string) => {
    setOpenTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleQuestionSolved = (taskId: string, questionId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
  };

  const handleQuestionCheck = async (_taskId: string, questionId: string, answer: string) => {
    if (!challenge) return false;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/practice/submit-flag`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challenge.id, task_id: questionId.replace(/-q1$/, ""), flag: answer }),
    });
    return response.ok && (await response.json()).correct === true;
  };

  const handleStartMachine = async () => {
    if (!challenge) return;
    const session = readSession();
    if (!session) {
      setMachineError("Please sign in before starting a machine.");
      return;
    }
    setMachineStarting(true);
    setMachineError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/practice/challenges/${challenge.slug}/machine/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Unable to start the machine");
      setMachineConnection(`Target IP: ${data.target_ip}`);
      setMachineExpiresAt(data.expires_at);
    } catch (error) {
      setMachineError(error instanceof Error ? error.message : "Unable to start the machine");
    } finally {
      setMachineStarting(false);
    }
  };

  const handleTerminateMachine = async () => {
    if (!challenge) return;
    const session = readSession();
    if (!session) return;
    setMachineTerminating(true);
    setMachineError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/practice/challenges/${challenge.slug}/machine`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to terminate the machine");
      }
      setMachineConnection("");
      setMachineExpiresAt("");
    } catch (error) {
      setMachineError(error instanceof Error ? error.message : "Unable to terminate the machine");
    } finally {
      setMachineTerminating(false);
    }
  };

  const handleDownloadVpnProfile = async () => {
    const session = readSession();
    if (!session) {
      setMachineError("Please sign in before downloading the VPN profile.");
      return;
    }
    setMachineError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/practice/vpn-profile`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to download the VPN profile");
      }
      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "hackers-campus.ovpn";
      link.click();
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      setMachineError(error instanceof Error ? error.message : "Unable to download the VPN profile");
    }
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  if (!challenge) return <main className="min-h-screen bg-[#090E17] p-10 text-center text-slate-400">Challenge not found or unavailable.</main>;

  return (
    <main className="min-h-screen bg-[#090E17] pb-16 text-[#E2E8F0]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. TryHackMe Room Header Bar */}
        <RoomHeader
          breadcrumbParent={{ label: "Practice", href: "/practice" }}
          breadcrumbCurrent={challenge.title}
          title={challenge.title}
          tagline={challenge.scenario || challenge.description}
          difficulty={challenge.difficulty}
          estimatedMinutes={challenge.estimatedMinutes}
          solversCount={challenge.solversCount}
          progressPercent={progressPercent}
          targetIp={challenge.targetMachine.ip}
          machineName={challenge.targetMachine.hostname}
          category={challenge.category}
          avatarIcon="flame"
          onStartMachine={handleStartMachine}
          machineStarting={machineStarting}
          machineConnection={machineConnection}
          machineError={machineError}
          machineExpiresAt={machineExpiresAt}
          onTerminateMachine={handleTerminateMachine}
          machineTerminating={machineTerminating}
          onDownloadVpnProfile={handleDownloadVpnProfile}
        />

        {/* 2. Room Navigation Tab Bar (Chart, Tasks, Scoreboard, Writeups) */}
        <div className="mb-6 flex items-center justify-between border-b border-[#1E293B] pb-1">
          <div className="flex items-center gap-2">
            {[
              { id: "tasks", label: "Tasks", icon: ListTodo, count: tasks.length },
              { id: "chart", label: "Chart", icon: BarChart3 },
              { id: "scoreboard", label: "Scoreboard", icon: Trophy },
              { id: "writeups", label: "Write-ups", icon: FileText },
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
            {completedTasksCount} of {tasks.length} tasks completed
          </div>
        </div>

        {/* 3. Tab Content Switcher */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskAccordion
                key={task.id}
                task={task}
                isOpen={!!openTasks[task.id]}
                onToggle={() => toggleTask(task.id)}
                onQuestionSolved={handleQuestionSolved}
                onQuestionCheck={handleQuestionCheck}
              />
            ))}
          </div>
        )}

        {activeTab === "chart" && <RoomChartView />}

        {activeTab === "scoreboard" && <RoomScoreboardView />}

        {activeTab === "writeups" && <RoomWriteupsView />}
      </div>
    </main>
  );
}
