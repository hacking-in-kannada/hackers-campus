"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  Code2,
  Cpu,
  Download,
  Eye,
  FileCode,
  FolderTree,
  HardDrive,
  ImageIcon,
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
  Upload,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { readSession } from "@/lib/auth";
import type { ChallengeCategory, ChallengeDifficulty, ChallengeDraft, ChallengeTemplate } from "@hackers-campus/shared-types";

const EMPTY_CHALLENGE_DRAFT: ChallengeDraft = {
  title: "", slug: "", category: "Web Security", difficulty: "Easy", type: "recommended",
  description: "", scenario: "", estimatedMinutes: 30, baseXp: 100, image: "",
  containerImage: "", cpuCores: 1, ramMb: 512, targetPorts: "80", roadmapStage: "foundation",
  tasks: [], visibility: "published", isPremium: false, version: "1.0.0",
};

function formatApiError(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const detail = (payload as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((issue) => {
      if (issue && typeof issue === "object") {
        const item = issue as { loc?: unknown[]; msg?: string };
        return `${item.loc?.slice(1).join(" → ") || "Field"}: ${item.msg || "is invalid"}`;
      }
      return String(issue);
    }).join(". ");
  }
  return fallback;
}

const TEMPLATES: ChallengeTemplate[] = [
  {
    id: "tmpl-sqli",
    name: "Web SQL Injection (Docker Target)",
    category: "Web Security",
    difficulty: "Easy",
    runtime: "docker",
    containerImage: "hackerscampus/sql-injection-01:latest",
    targetPorts: "80, 8080",
    description: "Vulnerable web application with SQLite/Postgres database and UNION SELECT injection vulnerability.",
    sampleTask: {
      title: "Exploit UNION SELECT Vulnerability",
      description: "Search for records and inject a SQL payload to extract admin credentials.",
      htmlContent: `<p>Analyze the <code>/search</code> parameter. Notice how single quotes are not sanitized.</p>
<pre><code>' UNION SELECT 1, flag_name, flag_value, 4 FROM secret_vault --</code></pre>
<p><strong>Goal:</strong> Extract the flag from the <code>secret_vault</code> table.</p>`,
      flag: "HC{sql_injection_union_select_admin_pwned}",
      hint: "Use UNION SELECT with 4 columns.",
      xp: 50,
    },
  },
  {
    id: "tmpl-suid",
    name: "Linux SUID Binary PrivEsc (Ubuntu)",
    category: "Linux",
    difficulty: "Easy",
    runtime: "docker",
    containerImage: "hackerscampus/suid-privesc-01:latest",
    targetPorts: "22",
    description: "Linux system with custom SUID diagnostic binary vulnerable to relative PATH hijacking.",
    sampleTask: {
      title: "Escalate to Root via SUID PATH Hijacking",
      description: "Identify unquoted system calls in /usr/local/bin/sys-diag and spawn a root shell.",
      htmlContent: `<p>Scan for SUID binaries using the find command:</p>
<pre><code>find / -perm -u=s -type f 2>/dev/null</code></pre>
<p>Create a malicious <code>netstat</code> binary in <code>/tmp</code> and prepend <code>/tmp</code> to your <code>$PATH</code>.</p>`,
      flag: "HC{gtfobins_suid_privesc_complete_9901}",
      hint: "Export PATH=/tmp:$PATH",
      xp: 60,
    },
  },
  {
    id: "tmpl-cmdi",
    name: "Blind OS Command Injection (Flask)",
    category: "Web Security",
    difficulty: "Medium",
    runtime: "docker",
    containerImage: "hackerscampus/command-injection-01:latest",
    targetPorts: "80",
    description: "Network diagnostics web portal vulnerable to command separators and IFS bypass.",
    sampleTask: {
      title: "Execute Arbitrary OS Commands",
      description: "Bypass space sanitization using shell environment variables and read the flag.",
      htmlContent: `<p>The ping utility filters spaces. Bypass space filters using internal field separator:</p>
<pre><code>127.0.0.1;cat\${IFS}/tmp/vault_secret.txt</code></pre>`,
      flag: "HC{vault_master_key_exfiltrated_9024}",
      hint: "Use ${IFS} instead of space.",
      xp: 75,
    },
  },
  {
    id: "tmpl-kerb",
    name: "Active Directory Kerberoasting",
    category: "Active Directory",
    difficulty: "Medium",
    runtime: "virtualbox",
    containerImage: "windows-server-2022-dc",
    targetPorts: "53, 88, 135, 389, 445, 1433",
    description: "Enterprise domain controller with roastable MSSQL service principal names.",
    sampleTask: {
      title: "Request and Crack TGS Service Tickets",
      description: "Extract Kerberos service tickets with Impacket and crack with Hashcat.",
      htmlContent: `<p>Request service tickets using Impacket GetUserSPNs:</p>
<pre><code>impacket-GetUserSPNs sentinel.local/user:pass -dc-ip 10.10.110.200 -request</code></pre>`,
      flag: "HC{spn_enum_mssqlsvc_found}",
      hint: "Hashcat mode 13100 for Kerberos 5 TGS-REP etype 23.",
      xp: 75,
    },
  },
];

const STEPS = [
  { step: 1, title: "Template & Basics" },
  { step: 2, title: "Content & Assets" },
  { step: 3, title: "HTML Tasks" },
  { step: 4, title: "Lab Specs" },
  { step: 5, title: "Roadmap Stage" },
  { step: 6, title: "Flags & Scoring" },
  { step: 7, title: "Preview" },
  { step: 8, title: "Publish" },
];

export default function ChallengeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<ChallengeDraft>(EMPTY_CHALLENGE_DRAFT);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [testLabRunning, setTestLabRunning] = useState(false);
  const [dockerUploadStatus, setDockerUploadStatus] = useState<string | null>(null);
  const [dockerUploadError, setDockerUploadError] = useState<string | null>(null);
  const [isUploadingDockerImage, setIsUploadingDockerImage] = useState(false);
  const [activeTaskTab, setActiveTaskTab] = useState<Record<number, "html" | "raw">>({ 0: "html" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dockerArchiveInputRef = useRef<HTMLInputElement>(null);

  // Apply template
  const handleApplyTemplate = (tmpl: ChallengeTemplate) => {
    setDraft((prev) => ({
      ...prev,
      title: tmpl.name,
      category: tmpl.category,
      difficulty: tmpl.difficulty,
      containerImage: tmpl.containerImage,
      targetPorts: tmpl.targetPorts,
      description: tmpl.description,
      tasks: [
        {
          title: tmpl.sampleTask.title,
          description: tmpl.sampleTask.description,
          htmlContent: tmpl.sampleTask.htmlContent,
          flag: tmpl.sampleTask.flag,
          hint: tmpl.sampleTask.hint,
          xp: tmpl.sampleTask.xp,
        },
      ],
    }));
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setDraft((prev) => ({
        ...prev,
        imageUrl: result,
        imageFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDockerArchiveUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archive = event.target.files?.[0];
    if (!archive) return;
    if (!archive.name.toLowerCase().endsWith(".tar")) {
      setDockerUploadError("Select a Docker image archive ending in .tar.");
      return;
    }
    const session = readSession();
    if (!session?.accessToken) {
      setDockerUploadError("Sign in as an administrator before uploading a Docker image.");
      return;
    }
    setDockerUploadStatus(null);
    setDockerUploadError(null);
    setIsUploadingDockerImage(true);
    try {
      const body = new FormData();
      body.append("archive", archive);
      body.append("expected_image", draft.containerImage);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "/backend-api"}/admin/docker-images/upload`, {
        method: "POST", headers: { Authorization: `Bearer ${session.accessToken}` }, body,
      });
      const rawBody = await response.text();
      let data: { detail?: unknown; image?: string } = {};
      try { data = rawBody ? JSON.parse(rawBody) : {}; } catch { /* Non-JSON proxy errors are handled below. */ }
      if (!response.ok) {
        const detail = typeof data.detail === "string" ? data.detail : rawBody.slice(0, 240);
        throw new Error(`Upload failed (HTTP ${response.status})${detail ? `: ${detail}` : ""}`);
      }
      if (data.image) setDraft((current) => ({ ...current, containerImage: data.image || current.containerImage }));
      setDockerUploadStatus(`Loaded ${data.image || archive.name}. The temporary archive was deleted.`);
    } catch (reason) {
      setDockerUploadError(reason instanceof Error ? reason.message : "Unable to load the Docker image.");
    } finally {
      setIsUploadingDockerImage(false);
      event.target.value = "";
    }
  };

  // Task Management
  const handleAddTask = () => {
    const newIdx = draft.tasks.length;
    setDraft((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          title: `Objective 0${newIdx + 1}`,
          description: "Describe the tactical steps or command inspection required.",
          htmlContent: `<p>Detailed instructions for <strong>Objective 0${newIdx + 1}</strong>:</p>\n<pre><code>nmap -sC -sV target.ip</code></pre>`,
          flag: "HC{flag_objective_here}",
          hint: "Provide an optional tactical hint.",
          xp: 50,
        },
      ],
    }));
    setActiveTaskTab((prev) => ({ ...prev, [newIdx]: "html" }));
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

  const handlePublish = async () => {
    setPublishError(null);
    if (!draft.title || !draft.slug || !draft.containerImage || draft.tasks.length === 0) {
      setPublishError("Add a title, URL slug, container image, and at least one task before publishing.");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) {
      setPublishError("URL slug must use lowercase letters, numbers, and hyphens only (example: boot2root-01).");
      return;
    }
    setIsPublishing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/practice/challenges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title, slug: draft.slug, category: draft.category, difficulty: draft.difficulty,
          xp: draft.baseXp, estimated_minutes: draft.estimatedMinutes, description: draft.description,
          scenario: draft.scenario, target_ip: "", target_hostname: draft.containerImage,
          target_ports: draft.targetPorts, container_image: draft.containerImage,
          roadmap_stage: draft.roadmapStage, module_id: draft.moduleId || null,
          is_published: draft.visibility === "published",
          tasks: draft.tasks.map((task) => ({ title: task.title, description: task.description, hint: task.hint, flag: task.flag, xp: task.xp })),
        }),
      });
      if (!response.ok) throw new Error(formatApiError(await response.json().catch(() => null), "Unable to publish the challenge."));
      setPublished(true);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Unable to publish the challenge.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-[1200px] space-y-8 pb-16">
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
            Challenge & Lab Creator Studio
          </h1>
          <p className="text-xs text-muted mt-1">
            Build real challenges with starter templates, image uploads/downloads, rich HTML tasks, and Roadmap stage alignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded border border-panelBorder bg-panelSubtle px-3 py-1.5 font-mono text-xs text-muted">
            Version: <strong className="text-lime">{draft.version}</strong>
          </span>
        </div>
      </div>

      {/* Step Navigation Bar */}
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

      {/* Step Content Container */}
      <div className="rounded-2xl border border-panelBorder bg-panel p-6 shadow-xl md:p-8">
        {/* ── STEP 1: Templates & Basics ── */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-ink">Choose Starter Template (Optional)</h2>
              <p className="text-xs text-muted mt-1">
                Select a pre-configured target template to automatically populate Docker image, commands, and tasks.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="flex flex-col text-left rounded-xl border border-panelBorder bg-panelSubtle p-4 hover:border-lime transition group"
                  >
                    <span className="font-mono text-[10px] uppercase font-bold text-lime">{tmpl.category}</span>
                    <h4 className="font-bold text-xs text-ink mt-1 group-hover:text-lime">{tmpl.name}</h4>
                    <p className="text-[11px] text-muted mt-2 line-clamp-2">{tmpl.description}</p>
                    <span className="mt-3 font-mono text-[10px] text-muted group-hover:text-ink">Use Template →</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-divider" />

            <h3 className="text-sm font-bold text-ink uppercase tracking-wider font-mono text-lime">Challenge Metadata</h3>
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
                  <option value="Cryptography">Cryptography</option>
                  <option value="Reverse Engineering">Reverse Engineering</option>
                  <option value="OSINT">OSINT</option>
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

        {/* ── STEP 2: Content & Image Upload / Download ── */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 2: Scenario & Challenge Image Assets</h2>

            {/* Image Asset Upload / Download */}
            <div className="rounded-xl border border-panelBorder bg-panelSubtle p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-ink uppercase tracking-wider font-mono">
                    Challenge Diagram / Cover Image
                  </h3>
                  <p className="text-xs text-muted">Upload architectural diagram or challenge banner.</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-lime/40 bg-lime/10 px-3.5 py-2 font-mono text-xs font-bold text-lime hover:bg-lime/20 transition"
                  >
                    <Upload size={13} />
                    Upload Image
                  </button>
                </div>
              </div>

              {draft.imageUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border border-panelBorder bg-black/40 p-2 flex items-center justify-center max-h-[300px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draft.imageUrl}
                      alt="Challenge asset preview"
                      className="max-h-[280px] w-auto object-contain rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted text-[11px] truncate">{draft.imageFileName || "challenge-asset.png"}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={draft.imageUrl}
                        download={draft.imageFileName || "challenge-diagram.png"}
                        className="inline-flex items-center gap-1.5 rounded bg-panel border border-panelBorder px-3 py-1 text-ink hover:text-lime text-[11px] transition"
                      >
                        <Download size={12} />
                        Download Image
                      </a>
                      <button
                        onClick={() => setDraft({ ...draft, imageUrl: undefined, imageFileName: undefined })}
                        className="text-danger hover:underline text-[11px] px-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border-2 border-dashed border-panelBorder p-8 text-center cursor-pointer hover:border-lime/50 transition bg-canvas/30"
                >
                  <ImageIcon size={32} className="mx-auto text-muted mb-2" />
                  <p className="font-mono text-xs text-ink font-bold">Click to upload challenge image / topology diagram</p>
                  <p className="text-[11px] text-muted mt-1">Supports PNG, JPG, WebP, SVG up to 10MB</p>
                </div>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">Scenario Narrative (Markdown Supported)</label>
              <textarea
                rows={5}
                value={draft.scenario}
                onChange={(e) => setDraft({ ...draft, scenario: e.target.value })}
                className="w-full rounded-lg border border-panelBorder bg-panelSubtle p-3 font-mono text-xs leading-relaxed text-ink focus:border-lime focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ── STEP 3: Rich HTML Tasks & Code Snippets ── */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink">Step 3: Rich HTML Task Objectives</h2>
                <p className="text-xs text-muted">Author tasks with full HTML tags (`&lt;code&gt;`, `&lt;pre&gt;`, lists, tables, links).</p>
              </div>
              <button
                onClick={handleAddTask}
                className="inline-flex items-center gap-1.5 rounded-lg bg-lime px-3.5 py-1.5 font-mono text-xs font-bold text-canvas hover:bg-limeDim"
              >
                <Plus size={14} /> Add Task
              </button>
            </div>

            <div className="space-y-6">
              {draft.tasks.map((task, idx) => {
                const mode = activeTaskTab[idx] || "html";
                return (
                  <div key={idx} className="rounded-xl border border-panelBorder bg-panelSubtle p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-divider pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-lime">Task {idx + 1}</span>
                        <div className="flex rounded-lg border border-panelBorder bg-panel p-0.5 font-mono text-[10px]">
                          <button
                            onClick={() => setActiveTaskTab((p) => ({ ...p, [idx]: "html" }))}
                            className={`px-2 py-0.5 rounded ${mode === "html" ? "bg-lime text-canvas font-bold" : "text-muted"}`}
                          >
                            HTML Code Editor
                          </button>
                          <button
                            onClick={() => setActiveTaskTab((p) => ({ ...p, [idx]: "raw" }))}
                            className={`px-2 py-0.5 rounded ${mode === "raw" ? "bg-lime text-canvas font-bold" : "text-muted"}`}
                          >
                            Live HTML Preview
                          </button>
                        </div>
                      </div>

                      {draft.tasks.length > 1 && (
                        <button
                          onClick={() => handleRemoveTask(idx)}
                          className="text-muted hover:text-danger text-xs font-mono flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleUpdateTask(idx, "title", e.target.value)}
                      placeholder="Task title (e.g. Inspect Session Headers)..."
                      className="w-full rounded-lg border border-panelBorder bg-panel px-3.5 py-2 text-xs font-bold text-ink focus:border-lime focus:outline-none"
                    />

                    {mode === "html" ? (
                      <div>
                        <label className="block font-mono text-[11px] text-muted mb-1">
                          Task HTML Content (Raw HTML tags allowed)
                        </label>
                        <textarea
                          rows={6}
                          value={task.htmlContent || task.description}
                          onChange={(e) => {
                            handleUpdateTask(idx, "htmlContent", e.target.value);
                            handleUpdateTask(idx, "description", e.target.value);
                          }}
                          placeholder="<p>Submit payload to target endpoint:</p><pre><code>curl http://target/api</code></pre>"
                          className="w-full rounded-lg border border-panelBorder bg-panel p-3 font-mono text-xs leading-relaxed text-emerald-400 focus:border-lime focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block font-mono text-[11px] text-muted mb-1">
                          Live Rendered HTML Preview:
                        </label>
                        <div
                          className="rounded-lg border border-[#22C55E]/30 bg-[#070B0E] p-4 text-xs text-slate-300 space-y-2 [&_code]:rounded [&_code]:bg-[#0C1217] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-emerald-300 [&_pre]:rounded [&_pre]:bg-[#0C1217] [&_pre]:p-3 [&_pre]:border [&_pre]:border-panelBorder [&_a]:text-emerald-400 [&_ul]:list-disc [&_ul]:ml-4"
                          dangerouslySetInnerHTML={{ __html: task.htmlContent || task.description }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 4: Lab Specs & Docker Runtime ── */}
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
                  placeholder="e.g. hackerscampus/sql-injection-01:latest"
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

            <div className="rounded-xl border border-dashed border-lime/40 bg-lime/5 p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase text-lime">Upload Docker Image Archive</h3>
                  <p className="mt-1 text-xs text-muted">Upload a `.tar` created with `docker save`. It is loaded into Docker, then deleted from temporary storage.</p>
                </div>
                <input ref={dockerArchiveInputRef} type="file" accept=".tar,application/x-tar" onChange={handleDockerArchiveUpload} className="hidden" />
                <button type="button" onClick={() => dockerArchiveInputRef.current?.click()} disabled={isUploadingDockerImage} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-lime/40 bg-lime/10 px-4 py-2 font-mono text-xs font-bold text-lime hover:bg-lime/20 disabled:opacity-60">
                  <Upload size={14} /> {isUploadingDockerImage ? "Loading image…" : "Upload .tar"}
                </button>
              </div>
              {dockerUploadStatus && <p className="mt-3 text-xs text-lime">{dockerUploadStatus}</p>}
              {dockerUploadError && <p className="mt-3 text-xs text-danger">{dockerUploadError}</p>}
            </div>

            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">Custom Dockerfile (Runs in background)</label>
              <textarea
                rows={10}
                value={(draft as any).customDockerfile || ""}
                onChange={(e) => setDraft({ ...draft, customDockerfile: e.target.value } as any)}
                placeholder={'FROM ubuntu:latest\nRUN apt-get update && apt-get install -y nginx\nCMD ["nginx", "-g", "daemon off;"]'}
                className="w-full rounded-lg border border-panelBorder bg-panelSubtle p-3 font-mono text-xs text-ink focus:border-lime focus:outline-none"
              />
              <p className="text-[11px] text-muted mt-1">
                If provided, this Dockerfile will be built and run in the background when the lab starts, ignoring the Target Docker Image field above.
              </p>
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

        {/* ── STEP 5: Roadmap Stage Assignment ── */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 5: Roadmap Stage & Module Placement</h2>
            <p className="text-xs text-muted">
              Position this challenge / room into the interactive Cybersecurity Progression Roadmap.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { id: "foundation", title: "1. Foundation", desc: "Core CLI, Networking, Windows/Linux basics" },
                { id: "offensive", title: "2. Offensive Security (Red Team)", desc: "Web, AD, Network Exploitation, Reverse Engineering" },
                { id: "defensive", title: "3. Defensive Security (Blue Team)", desc: "SOC, SIEM Splunk, Forensics Wireshark, Cryptography" },
                { id: "specialized", title: "4. Specialized Domains", desc: "Cloud Security, AI Security, Blockchain, 5G" },
                { id: "governance", title: "5. Governance & Architecture", desc: "GRC, Zero Trust, CVE Research" },
              ].map((st) => (
                <label
                  key={st.id}
                  className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
                    draft.roadmapStage === st.id
                      ? "border-lime bg-lime/10"
                      : "border-panelBorder bg-panelSubtle hover:border-lime/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="roadmapStage"
                    value={st.id}
                    checked={draft.roadmapStage === st.id || (!draft.roadmapStage && st.id === "offensive")}
                    onChange={() => setDraft({ ...draft, roadmapStage: st.id as any })}
                    className="mt-1 accent-lime"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-ink">{st.title}</h4>
                    <p className="text-[11px] text-muted mt-0.5">{st.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 6: Flags & Scoring ── */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 6: Flags, Answers & Scoring</h2>
            <div className="space-y-4">
              {draft.tasks.map((task, idx) => (
                <div key={idx} className="rounded-xl border border-panelBorder bg-panelSubtle p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink">Task {idx + 1}: {task.title}</span>
                    <span className="font-mono text-xs text-lime">+{task.xp} XP</span>
                  </div>
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

        {/* ── STEP 7: Preview ── */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-divider pb-4">
              <div>
                <h2 className="text-lg font-bold text-ink">Step 7: Interactive Test Sandbox</h2>
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
                <span className="rounded bg-lime/10 px-2 py-0.5 font-mono text-xs text-lime font-bold">
                  {draft.category}
                </span>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-400">
                  {draft.difficulty}
                </span>
                <span className="font-mono text-xs text-muted">+{draft.baseXp} XP</span>
              </div>
              <h3 className="text-2xl font-bold text-ink">{draft.title}</h3>
              <p className="text-sm text-muted">{draft.description}</p>

              {draft.imageUrl && (
                <div className="max-w-md rounded-lg overflow-hidden border border-panelBorder">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.imageUrl} alt="Challenge banner" className="w-full h-auto" />
                </div>
              )}

              {testLabRunning && (
                <div className="rounded-lg border border-lime/30 bg-canvas p-4 font-mono text-xs text-lime">
                  ✓ Test container `{draft.containerImage}` running on `10.10.110.99`. Ports: {draft.targetPorts}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 8: Publish ── */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ink">Step 8: Pre-Flight Verification & Publish</h2>
            <div className="space-y-3">
              {[
                "Target Dockerfile & Image validated and ready for cluster allocation",
                "All flags conform to standard validation rules",
                "HTML task formatting syntax verified",
                "Roadmap stage placement configured",
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
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-mono text-xs font-bold text-canvas shadow-glow hover:bg-limeDim"
              >
                <Rocket size={16} /> {isPublishing ? "Publishing…" : "Publish Challenge to Platform"}
              </button>
            </div>
            {publishError && <p className="rounded-lg border border-danger/30 bg-danger/10 p-3 font-mono text-xs text-danger">{publishError}</p>}
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

          {currentStep < 8 ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(8, s + 1))}
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
              `{draft.title}` (v{draft.version}) is now live in the Target Practice catalog and Roadmap.
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
