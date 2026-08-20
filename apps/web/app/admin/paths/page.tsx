"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Cpu,
  Flame,
  FolderPlus,
  FolderTree,
  Globe,
  HardDrive,
  Layers,
  MapPin,
  Network,
  Plus,
  PlusCircle,
  Radio,
  Save,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { LearningPathDraft, ModuleDraft } from "@hackers-campus/shared-types";

const INITIAL_PATHS: LearningPathDraft[] = [];

const ROADMAP_STAGES = [
  { id: "foundation", title: "1. Foundation", desc: "Core computer science, networking protocols, Linux CLI, and OS primitives" },
  { id: "offensive", title: "2. Offensive Security (Red Team)", desc: "Penetration testing, Active Directory, network attacks, reverse engineering" },
  { id: "defensive", title: "3. Defensive Security (Blue Team)", desc: "SOC analysis, Splunk SIEM hunting, forensics Wireshark, cryptography, IAM" },
  { id: "specialized", title: "4. Specialized Domains", desc: "Cloud security, AI threat modelling, blockchain auditing, 5G & emerging tech" },
  { id: "governance", title: "5. Governance & Architecture", desc: "GRC, NIST CSF 2.0, Zero Trust design, CVE vulnerability research" },
];

export default function AdminPathsAndModulesPage() {
  const [activeTab, setActiveTab] = useState<"paths" | "modules" | "roadmap">("paths");
  const [paths, setPaths] = useState<LearningPathDraft[]>(INITIAL_PATHS);
  const [modules, setModules] = useState<ModuleDraft[]>([]);
  const [challenges, setChallenges] = useState<Array<{ id: string; title: string; roadmap_stage?: string; module_id?: string }>>([]);

  // Fetch initial data

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/paths`);
        if (res.ok) {
          const data = await res.json();
          setPaths(data.map((path: any) => ({ ...path, estimatedHours: path.estimated_hours, modules: path.modules || [] })));
        }
      } catch (err) {
        console.error("Failed to fetch paths", err);
      }
    };

    const fetchModules = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/modules`);
        if (res.ok) {
          const data = await res.json();
          setModules(data.map((module: any) => ({ ...module, estimatedMinutes: module.estimated_minutes, orderNumber: module.order_number, roomsCount: 0, iconName: "book" })));
        }
      } catch (err) {
        console.error("Failed to fetch modules", err);
      }
    };

    fetchPaths();
    fetchModules();
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/admin/challenges`)
      .then((response) => response.ok ? response.json() : [])
      .then(setChallenges)
      .catch(() => setChallenges([]));
  }, []);

  // New Path Form State
  const [newPathModal, setNewPathModal] = useState(false);
  const [newPath, setNewPath] = useState<LearningPathDraft>({
    id: `path-${Date.now()}`,
    slug: "new-custom-track",
    title: "Advanced Threat Operations",
    tagline: "Custom curated hands-on career pathway.",
    category: "Red Team",
    difficulty: "Intermediate",
    estimatedHours: 40,
    prerequisites: ["Linux Basics", "Network Scanning"],
    careerRoles: ["Security Engineer"],
    description: "Curated modules and hands-on target labs.",
    stagesCount: 3,
    modules: [],
  });

  // New Module Form State
  const [newModuleModal, setNewModuleModal] = useState(false);
  const [newModule, setNewModule] = useState<ModuleDraft>({
    id: `mod-${Date.now()}`,
    slug: "custom-module",
    title: "Container & Kubernetes Security",
    category: "specialized",
    iconName: "cloud",
    description: "Hands-on cluster exploitation and admission controller hardening.",
    stage: "specialized",
    estimatedMinutes: 180,
    roomsCount: 4,
    orderNumber: 1,
  });

  const handleSavePath = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/paths`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPath.title, slug: newPath.slug, tagline: newPath.tagline, description: newPath.description,
          category: newPath.category, difficulty: newPath.difficulty, estimated_hours: newPath.estimatedHours,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setPaths((prev) => [...prev, { ...saved, estimatedHours: saved.estimated_hours, modules: saved.modules || [] }]);
        setNewPathModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveModule = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newModule.title, slug: newModule.slug, description: newModule.description,
          category: newModule.category, stage: newModule.stage,
          estimated_minutes: newModule.estimatedMinutes, order_number: newModule.orderNumber,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setModules((prev) => [...prev, { ...saved, estimatedMinutes: saved.estimated_minutes, orderNumber: saved.order_number, roomsCount: 0, iconName: "book" }]);
        setNewModuleModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePath = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/paths/${id}`, { method: "DELETE" });
    if (response.ok) setPaths((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteModule = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/modules/${id}`, { method: "DELETE" });
    if (response.ok) setModules((prev) => prev.filter((m) => m.id !== id));
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
            Paths, Modules & Roadmap Management
          </h1>
          <p className="text-xs text-muted mt-1">
            Author career pathways, create curriculum modules, and place modules inside the interactive Roadmap stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "paths" && (
            <button
              onClick={() => setNewPathModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-lime px-4 py-2 font-mono text-xs font-bold text-canvas shadow-glow hover:bg-limeDim transition"
            >
              <Plus size={14} /> Create Learning Path
            </button>
          )}
          {activeTab === "modules" && (
            <button
              onClick={() => setNewModuleModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-lime px-4 py-2 font-mono text-xs font-bold text-canvas shadow-glow hover:bg-limeDim transition"
            >
              <Plus size={14} /> Create New Module
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-divider pb-2">
        {[
          { id: "paths", label: "Learning Paths", count: paths.length, icon: FolderTree },
          { id: "modules", label: "Curriculum Modules", count: modules.length, icon: BookOpen },
          { id: "roadmap", label: "Roadmap Stage Placement", icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-bold transition ${
              activeTab === tab.id
                ? "bg-lime text-canvas shadow-glow"
                : "bg-panel text-muted hover:text-ink border border-panelBorder"
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === tab.id ? "bg-canvas text-lime" : "bg-panelSubtle text-muted"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Learning Paths ── */}
      {activeTab === "paths" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-panelBorder bg-panel p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-lime/40 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-lime/10 border border-lime/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-lime">
                    {p.category}
                  </span>
                  <span className="font-mono text-xs text-muted">{p.estimatedHours}h total</span>
                </div>

                <h3 className="text-lg font-bold text-ink">{p.title}</h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{p.tagline}</p>

                <div className="rounded-lg border border-panelBorder bg-panelSubtle p-3 space-y-1.5 font-mono text-[11px]">
                  <p className="text-muted text-[10px] uppercase font-bold text-lime">Included Modules ({p.modules.length}):</p>
                  {p.modules.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-ink">
                      <span>• {m.title}</span>
                      <span className="text-muted">{m.roomsCount} rooms</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-divider pt-4">
                <Link
                  href={`/learn/paths/${p.slug}`}
                  className="font-mono text-xs text-lime hover:underline flex items-center gap-1"
                >
                  Preview Path <ArrowRight size={12} />
                </Link>
                <button
                  onClick={() => handleDeletePath(p.id)}
                  className="text-muted hover:text-danger text-xs p-1"
                  title="Delete Path"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: Modules Catalog ── */}
      {activeTab === "modules" && (
        <div className="rounded-2xl border border-panelBorder bg-panel overflow-hidden">
          <div className="border-b border-divider px-6 py-4 flex items-center justify-between bg-panelSubtle">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-lime">All Modular Curricula</h3>
            <span className="font-mono text-xs text-muted">{modules.length} Modules Active</span>
          </div>

          <div className="divide-y divide-divider">
            {modules.map((m) => (
              <div key={m.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-panelSubtle/40 transition">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/40 border border-panelBorder text-lime">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-ink">{m.title}</h4>
                      <span className="rounded bg-panelSubtle border border-panelBorder px-2 py-0.5 font-mono text-[10px] text-muted uppercase">
                        Stage: {m.stage}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">{m.description}</p>
                    <p className="font-mono text-[11px] text-lime mt-1.5">
                      {m.roomsCount} Rooms · ~{m.estimatedMinutes} Mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/learn/modules/${m.slug}`}
                    className="rounded-lg border border-panelBorder bg-panel px-3 py-1.5 font-mono text-xs text-ink hover:text-lime transition"
                  >
                    View Module
                  </Link>
                  <button
                    onClick={() => handleDeleteModule(m.id)}
                    className="p-2 text-muted hover:text-danger rounded"
                    title="Delete Module"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: Roadmap Stage Placement ── */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-lime/30 bg-lime/5 p-4 font-mono text-xs text-lime">
            💡 Drag & assign modules into the 5 stages of the Interactive Cybersecurity Roadmap.
          </div>

          <div className="space-y-4">
            {ROADMAP_STAGES.map((stage) => {
              const stageModules = modules.filter((m) => m.stage === stage.id);
              const stageChallenges = challenges.filter((challenge) => challenge.roadmap_stage === stage.id);
              return (
                <div key={stage.id} className="rounded-2xl border border-panelBorder bg-panel p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-divider pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-ink">{stage.title}</h3>
                      <p className="text-xs text-muted">{stage.desc}</p>
                    </div>
                    <span className="rounded-full bg-lime/10 border border-lime/30 px-3 py-1 font-mono text-xs font-bold text-lime">
                      {stageModules.length} Modules · {stageChallenges.length} Challenges
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {stageModules.map((sm) => (
                      <div
                        key={sm.id}
                        className="rounded-xl border border-panelBorder bg-panelSubtle p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs text-ink">{sm.title}</p>
                          <p className="font-mono text-[10px] text-muted">{sm.roomsCount} target rooms</p>
                        </div>
                        <span className="text-lime text-xs">✓ Active</span>
                      </div>
                  ))}
                  {stageChallenges.map((challenge) => (
                    <Link key={challenge.id} href={`/practice/${challenge.id}`} className="flex items-center gap-2 rounded border border-lime/20 bg-lime/5 px-2 py-1.5 text-xs text-lime hover:bg-lime/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-lime" /> {challenge.title}
                    </Link>
                  ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Path Modal */}
      {newPathModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-panelBorder bg-panel p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-ink">Create New Learning Path Track</h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-muted mb-1">Path Title</label>
                <input
                  type="text"
                  value={newPath.title}
                  onChange={(e) => setNewPath({ ...newPath, title: e.target.value })}
                  className="w-full rounded border border-panelBorder bg-panelSubtle p-2 text-ink focus:border-lime focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1">Category</label>
                  <select
                    value={newPath.category}
                    onChange={(e) => setNewPath({ ...newPath, category: e.target.value as any })}
                    className="w-full rounded border border-panelBorder bg-panelSubtle p-2 text-ink focus:border-lime focus:outline-none"
                  >
                    <option value="Red Team">Red Team</option>
                    <option value="Blue Team">Blue Team</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Web">Web</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={newPath.estimatedHours}
                    onChange={(e) => setNewPath({ ...newPath, estimatedHours: parseInt(e.target.value) || 40 })}
                    className="w-full rounded border border-panelBorder bg-panelSubtle p-2 text-ink focus:border-lime focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Tagline</label>
                <input
                  type="text"
                  value={newPath.tagline}
                  onChange={(e) => setNewPath({ ...newPath, tagline: e.target.value })}
                  className="w-full rounded border border-panelBorder bg-panelSubtle p-2 text-ink focus:border-lime focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-divider font-mono text-xs">
              <button
                onClick={() => setNewPathModal(false)}
                className="px-4 py-2 rounded text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePath}
                className="px-5 py-2 rounded bg-lime text-canvas font-bold shadow-glow hover:bg-limeDim"
              >
                Save Path
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Module Modal */}
      {newModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-panelBorder bg-panel p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-ink">Create New Curriculum Module</h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-muted mb-1">Module Title</label>
                <input
                  type="text"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  className="w-full rounded border border-panelBorder bg-panelSubtle p-2 text-ink focus:border-lime focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1">Roadmap Stage</label>
                  <select
                    value={newModule.stage}
                    onChange={(e) => setNewModule({ ...newModule, stage: e.target.value })}
                    className="w-full rounded border border-panelBorder bg-panelSubtle p-2 text-ink focus:border-lime focus:outline-none"
                  >
                    <option value="foundation">1. Foundation</option>
                    <option value="offensive">2. Offensive Security</option>
                    <option value="defensive">3. Defensive Security</option>
                    <option value="specialized">4. Specialized Domains</option>
                    <option value="governance">5. Governance & Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted mb-1">Rooms Count</label>
                  <input
                    type="number"
                    value={newModule.roomsCount}
                    onChange={(e) => setNewModule({ ...newModule, roomsCount: parseInt(e.target.value) || 4 })}
                    className="w-full rounded border border-panelBorder bg-panelSubtle p-2 text-ink focus:border-lime focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  className="w-full rounded border border-panelBorder bg-panelSubtle p-2 text-ink focus:border-lime focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-divider font-mono text-xs">
              <button
                onClick={() => setNewModuleModal(false)}
                className="px-4 py-2 rounded text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModule}
                className="px-5 py-2 rounded bg-lime text-canvas font-bold shadow-glow hover:bg-limeDim"
              >
                Save Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
