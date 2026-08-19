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
import { useMemo, useState } from "react";
import { PRACTICE_CHALLENGES } from "@/lib/mock-data";
import { RoomHeader } from "@/components/room/RoomHeader";
import { TaskAccordion, type RoomTaskItem } from "@/components/room/TaskAccordion";
import { RoomChartView } from "@/components/room/RoomChartView";
import { RoomScoreboardView, RoomWriteupsView } from "@/components/room/RoomScoreboardView";

export default function PracticeChallengeWorkspace() {
  const params = useParams();
  const slug = params?.slug as string;

  const challenge = useMemo(() => {
    return PRACTICE_CHALLENGES.find((c) => c.slug === slug) || PRACTICE_CHALLENGES[0];
  }, [slug]);

  // Tab State
  const [activeTab, setActiveTab] = useState<"tasks" | "chart" | "scoreboard" | "writeups">("tasks");

  // Transform practice challenge tasks into rich TryHackMe RoomTaskItem structure
  const [tasks, setTasks] = useState<RoomTaskItem[]>(() => {
    return challenge.tasks.map((t, idx) => ({
      id: t.id,
      taskNumber: idx + 1,
      title: t.title,
      completed: t.completed,
      content: {
        heading: `Objective 0${idx + 1} · ${t.title}`,
        description: t.description,
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
          correctAnswer: t.correctAnswer || "HC{flag_solved}",
          hint: t.hint || undefined,
          xp: t.xp,
        },
      ],
    }));
  });

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

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTasksCount / tasks.length) * 100);

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
