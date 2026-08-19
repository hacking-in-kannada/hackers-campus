"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  Cpu,
  Eye,
  FileCode,
  HardDrive,
  Layers,
  Lightbulb,
  Lock,
  Plus,
  Play,
  Rocket,
  Save,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { INITIAL_CHALLENGE_DRAFT } from "@/lib/mock-data";
import type { ChallengeCategory, ChallengeDifficulty } from "@hackers-campus/shared-types";

const STEPS = [
  { step: 1, title: "Basics" },
  { step: 2, title: "Content" },
  { step: 3, title: "Tasks" },
  { step: 4, title: "Lab Specs" },
  { step: 5, title: "Flags & Hints" },
  { step: 6, title: "Scoring" },
  { step: 7, title: "Access" },
  { step: 8, title: "Preview" },
  { step: 9, title: "Publish" },
];

export default function ChallengeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState(INITIAL_CHALLENGE_DRAFT);
  const [published, setPublished] = useState(false);
  const [testLabRunning, setTestLabRunning] = useState(false);

  // Task creation state
  const handleAddTask = () => {
    setDraft((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          title: "New Sub-Objective",
          description: "Describe the specific technique or inspection required.",
          flag: "HC{flag_objective_here}",
          hint: "Provide an optional tactical hint.",
          xp: 50,
        },
      ],
    }));
  };

  const handleRemoveTask = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateTask = (index: number, key: string, value: any) => {
    setDraft((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t, i) => (i === index ? { ...t, [key]: value } : t)),
    }));
  };

  return (
    <div className="max-w-[1200px] space-y-8">
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
            9-Step Challenge Builder
          </h1>
          <p className="text-xs text-muted mt-1">
            Author and deploy standardized disposable target environments across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded border border-panelBorder bg-panelSubtle px-3 py-1.5 font-mono text-xs text-muted">
            Version: <strong className="text-lime">{draft.version}</strong>
          </span>
        </div>
      </div>

      {/* 9-Step Progress Bar */}
      <div className="overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex items-center gap-1 min-w-[750px] border-b border-divider pb-4">
          {STEPS.map((s) => {
            const isCurrent = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono transition ${
                  isCurrent
                    ? "bg-lime text-canvas font-bold shadow-glow"
                    : isCompleted
                    ? "bg-lime/10 text-lime border border-lime/30"
                    : "bg-panel text-muted hover:text-ink border border-panelBorder"
                }`}
              >
                <span className="font-bold">{s.step < 10 ? `0${s.step}` : s.step}</span>
                <span className="truncate">{s.title}</span>
                {isCompleted && <Check size={12} className="ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Container Panels */}
      <div className="rounded-2xl border border-panelBorder bg-panel p-6 shadow-xl md:p-8">
        {/* Step 1: Basics */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 1: Challenge Basics & Metadata</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Challenge Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Category</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value as ChallengeCategory })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 text-xs text-ink focus:border-lime focus:outline-none"
                >
                  <option value="Web Security">Web Security</option>
                  <option value="Active Directory">Active Directory</option>
                  <option value="Linux">Linux</option>
                  <option value="Binary Exploitation">Binary Exploitation</option>
                  <option value="Digital Forensics">Digital Forensics</option>
                  <option value="Cloud Security">Cloud Security</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Difficulty</label>
                <select
                  value={draft.difficulty}
                  onChange={(e) => setDraft({ ...draft, difficulty: e.target.value as ChallengeDifficulty })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 text-xs text-ink focus:border-lime focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Insane">Insane</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Estimated Duration (mins)</label>
                <input
                  type="number"
                  value={draft.estimatedMinutes}
                  onChange={(e) => setDraft({ ...draft, estimatedMinutes: parseInt(e.target.value) || 30 })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">Short Overview</label>
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="w-full rounded-lg border border-panelBorder bg-panelSubtle p-3 text-xs text-ink focus:border-lime focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Content & Scenario Briefing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 2: Scenario Briefing & Context</h2>
            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">Scenario Narrative (Markdown Supported)</label>
              <textarea
                rows={6}
                value={draft.scenario}
                onChange={(e) => setDraft({ ...draft, scenario: e.target.value })}
                className="w-full rounded-lg border border-panelBorder bg-panelSubtle p-3 font-mono text-xs leading-relaxed text-ink focus:border-lime focus:outline-none"
              />
            </div>
            <div className="rounded-lg border border-lime/30 bg-lime/5 p-4 font-mono text-xs text-lime">
              💡 Provide high-context immersion detailing enterprise network topology and target motives.
            </div>
          </div>
        )}

        {/* Step 3: Task Builder */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Step 3: Objective & Task Sequence</h2>
              <button
                onClick={handleAddTask}
                className="inline-flex items-center gap-1.5 rounded-lg bg-lime px-3.5 py-1.5 font-mono text-xs font-bold text-canvas hover:bg-limeDim"
              >
                <Plus size={14} /> Add Task
              </button>
            </div>

            <div className="space-y-4">
              {draft.tasks.map((task, idx) => (
                <div key={idx} className="rounded-xl border border-panelBorder bg-panelSubtle p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-lime">Task {idx + 1}</span>
                    {draft.tasks.length > 1 && (
                      <button
                        onClick={() => handleRemoveTask(idx)}
                        className="text-muted hover:text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleUpdateTask(idx, "title", e.target.value)}
                    placeholder="Task title..."
                    className="w-full rounded-lg border border-panelBorder bg-panel px-3 py-2 text-xs text-ink focus:border-lime focus:outline-none font-bold"
                  />
                  <textarea
                    rows={2}
                    value={task.description}
                    onChange={(e) => handleUpdateTask(idx, "description", e.target.value)}
                    placeholder="Task details & guidance..."
                    className="w-full rounded-lg border border-panelBorder bg-panel p-2.5 text-xs text-ink focus:border-lime focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Lab Specs & Container Configuration */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 4: Disposable Lab Infrastructure</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Target Docker Image</label>
                <input
                  type="text"
                  value={draft.containerImage}
                  onChange={(e) => setDraft({ ...draft, containerImage: e.target.value })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Exposed Ports</label>
                <input
                  type="text"
                  value={draft.targetPorts}
                  onChange={(e) => setDraft({ ...draft, targetPorts: e.target.value })}
                  placeholder="80, 443, 8080"
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Allocated CPU Cores</label>
                <input
                  type="number"
                  value={draft.cpuCores}
                  onChange={(e) => setDraft({ ...draft, cpuCores: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Allocated RAM (MB)</label>
                <input
                  type="number"
                  value={draft.ramMb}
                  onChange={(e) => setDraft({ ...draft, ramMb: parseInt(e.target.value) || 512 })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Flags & Tactical Hints */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 5: Flags, Answers & Hints</h2>
            <div className="space-y-4">
              {draft.tasks.map((task, idx) => (
                <div key={idx} className="rounded-xl border border-panelBorder bg-panelSubtle p-4 space-y-3">
                  <span className="font-mono text-xs font-bold text-ink">Task {idx + 1}: {task.title}</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-mono text-[11px] text-muted mb-1">Expected Flag Solution</label>
                      <input
                        type="text"
                        value={task.flag}
                        onChange={(e) => handleUpdateTask(idx, "flag", e.target.value)}
                        className="w-full rounded border border-panelBorder bg-panel px-3 py-2 font-mono text-xs text-lime focus:border-lime focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-muted mb-1">Tactical Hint</label>
                      <input
                        type="text"
                        value={task.hint}
                        onChange={(e) => handleUpdateTask(idx, "hint", e.target.value)}
                        className="w-full rounded border border-panelBorder bg-panel px-3 py-2 font-mono text-xs text-amber-300 focus:border-lime focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Scoring */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 6: XP Rewards & Scoring</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">Total Base XP Award</label>
                <input
                  type="number"
                  value={draft.baseXp}
                  onChange={(e) => setDraft({ ...draft, baseXp: parseInt(e.target.value) || 100 })}
                  className="w-full rounded-lg border border-panelBorder bg-panelSubtle px-3.5 py-2.5 font-mono text-xs text-ink focus:border-lime focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Access & Permissions */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 7: Access Control & Visibility</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-lg border border-panelBorder bg-panelSubtle p-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.isPremium}
                  onChange={(e) => setDraft({ ...draft, isPremium: e.target.checked })}
                  className="h-4 w-4 accent-lime"
                />
                <div>
                  <span className="font-bold text-ink text-xs">Pro / Premium Tier Only</span>
                  <p className="text-[11px] text-muted">Restrict access to verified subscribers.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 8: Live Preview */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-divider pb-4">
              <div>
                <h2 className="text-lg font-bold text-ink">Step 8: Interactive Test Sandbox</h2>
                <p className="text-xs text-muted">Verify the challenge experience exactly as learners will see it.</p>
              </div>
              <button
                onClick={() => setTestLabRunning(!testLabRunning)}
                className={`rounded-lg px-4 py-2 font-mono text-xs font-bold transition ${
                  testLabRunning
                    ? "bg-red-500 text-white"
                    : "bg-lime text-canvas shadow-glow hover:bg-limeDim"
                }`}
              >
                {testLabRunning ? "Stop Test Sandbox" : "▶ Spin Up Test Instance"}
              </button>
            </div>

            <div className="rounded-xl border border-panelBorder bg-panelSubtle p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-lime/10 px-2 py-0.5 font-mono text-xs text-lime">
                  {draft.category}
                </span>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-400">
                  {draft.difficulty}
                </span>
                <span className="font-mono text-xs text-muted">+{draft.baseXp} XP</span>
              </div>
              <h3 className="text-2xl font-bold text-ink">{draft.title}</h3>
              <p className="text-sm text-muted">{draft.description}</p>

              {testLabRunning && (
                <div className="rounded-lg border border-lime/30 bg-canvas p-4 font-mono text-xs text-lime">
                  ✓ Test container `{draft.containerImage}` running on `10.10.110.99`. Ports: {draft.targetPorts}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 9: Publish & Deploy */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 9: Pre-Flight Verification & Publish</h2>
            <div className="space-y-3">
              {[
                "Target Dockerfile validated and security scanned",
                "All flags conform to HC{...} regex standard",
                "Hints configured with valid XP penalty balances",
                "Authoritative writeup stored in encrypted vault",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-panelBorder bg-panelSubtle p-3.5 font-mono text-xs text-ink">
                  <CheckCircle2 size={16} className="text-lime shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-divider flex items-center justify-between">
              <span className="font-mono text-xs text-muted">Ready for production deployment.</span>
              <button
                onClick={() => setPublished(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-mono text-xs font-bold text-canvas shadow-glow hover:bg-limeDim"
              >
                <Rocket size={16} /> Publish Challenge to Platform
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-divider pt-6">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="inline-flex items-center gap-2 rounded-lg border border-panelBorder px-4 py-2 font-mono text-xs text-muted hover:text-ink disabled:opacity-40"
          >
            <ArrowLeft size={14} /> Previous Step
          </button>

          {currentStep < 9 ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(9, s + 1))}
              className="inline-flex items-center gap-2 rounded-lg bg-lime px-5 py-2 font-mono text-xs font-bold text-canvas shadow-glow hover:bg-limeDim"
            >
              Next Step <ArrowRight size={14} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Publish Celebratory Modal */}
      {published && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-lime/40 bg-panel p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime/20 text-lime border border-lime shadow-glow">
              <Rocket size={32} />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-ink">Challenge Published!</h3>
            <p className="mt-2 text-xs text-muted">
              `{draft.title}` (v{draft.version}) is now live in the Target Practice catalog for all learners.
            </p>
            <div className="mt-6 flex justify-center gap-3 font-mono text-xs">
              <Link
                href="/practice"
                className="rounded-lg bg-lime px-5 py-2.5 font-bold text-canvas shadow-glow hover:bg-limeDim"
              >
                View in Target Practice
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
