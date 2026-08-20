"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Crosshair,
  Layers,
  Network,
  RotateCcw,
  Search,
  Shield,
  Signal,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface LearningPath {
  id: string;
  slug: string;
  title: string;
  role: string;
  trackType: "Offensive" | "Defensive" | "Specialist" | "Foundation";
  description: string;
  modules: number;
  labs: number;
  hours: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  skills: string[];
  enrolled: boolean;
  featured?: boolean;
}

function PathCard({ path }: { path: LearningPath }) {
  return (
    <Link href={`/learn/paths/${path.slug}`} className="group rounded-xl border border-[#1E293B] bg-[#0C1322] p-5 transition hover:border-emerald-500/50 hover:bg-[#0F1B30]">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] font-bold uppercase text-emerald-400">{path.trackType}</span>
        <span className="text-xs font-medium text-amber-400">{path.difficulty}</span>
      </div>
      <h3 className="mt-4 text-base font-bold text-white group-hover:text-emerald-400">{path.title}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{path.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-[#1E293B] pt-3 text-xs text-slate-400">
        <span>{path.modules} modules · {path.labs} labs</span>
        <span className="inline-flex items-center gap-1 text-emerald-400">View path <ArrowRight size={12} /></span>
      </div>
    </Link>
  );
}

export default function PathsPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/paths`);
        if (res.ok) {
          const data = await res.json();
          // Map backend data to frontend interface
          const mapped = data.map((d: any) => ({
            ...d,
            role: d.category,
            trackType: d.category === "Red Team" ? "Offensive" : d.category === "Blue Team" ? "Defensive" : d.category === "Cloud" ? "Specialist" : "Foundation",
            modules: d.modules?.length || 0,
            labs: d.modules?.reduce((acc: number, m: any) => acc + (m.roomsCount || 0), 0) || 0,
            hours: d.estimated_hours || 40,
            progress: 0,
            skills: ["Linux", "Networking"],
            enrolled: false,
          }));
          setLearningPaths(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch paths", err);
      }
    };
    fetchPaths();
  }, []);

  const filteredPaths = useMemo(() => {
    let result = [...learningPaths];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (selectedTrack !== "all") result = result.filter((p) => p.trackType.toLowerCase() === selectedTrack);
    if (selectedDifficulty !== "all") result = result.filter((p) => p.difficulty.toLowerCase() === selectedDifficulty);
    if (selectedStatus === "enrolled") result = result.filter((p) => p.progress > 0 && p.progress < 100);
    else if (selectedStatus === "completed") result = result.filter((p) => p.progress === 100);
    else if (selectedStatus === "not_started") result = result.filter((p) => p.progress === 0);
    if (sortBy === "labs") result.sort((a, b) => b.labs - a.labs);
    else if (sortBy === "duration") result.sort((a, b) => a.hours - b.hours);
    else if (sortBy === "progress") result.sort((a, b) => b.progress - a.progress);
    return result;
  }, [learningPaths, searchQuery, selectedTrack, selectedDifficulty, selectedStatus, sortBy]);

  const isFiltering = searchQuery.trim() !== "" || selectedTrack !== "all" || selectedDifficulty !== "all" || selectedStatus !== "all" || sortBy !== "recommended";

  const resetFilters = () => {
    setSearchQuery(""); setSelectedTrack("all"); setSelectedDifficulty("all");
    setSelectedStatus("all"); setSortBy("recommended");
  };

  const offensivePaths = learningPaths.filter((p) => p.trackType === "Offensive");
  const defensivePaths = learningPaths.filter((p) => p.trackType === "Defensive");
  const specialistPaths = learningPaths.filter((p) => p.trackType === "Specialist" || p.trackType === "Foundation");
  const featuredPath = learningPaths.find((p) => p.featured);
  const otherPaths = learningPaths.filter((p) => !p.featured).slice(0, 4);

  return (
    <div className="w-full space-y-10">
      {/* ── Hero ── */}
      <header className="relative overflow-hidden rounded-2xl border border-[#1E293B] bg-gradient-to-r from-[#0F172A] via-[#111C35] to-[#0A1628] p-6 md:p-10 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.15),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">Career Tracks</h1>
            <p className="max-w-xl text-sm text-slate-400 sm:text-base">
              Structured step-by-step career tracks designed to take you from foundational basics to job-ready cybersecurity professional.
            </p>
            <div className="flex flex-wrap gap-6 font-mono text-sm pt-2">
              {[
                { label: "Foundation", color: "bg-emerald-400", val: "1/1" },
                { label: "Offensive",  color: "bg-amber-400",   val: "1/2" },
                { label: "Defensive",  color: "bg-sky-400",     val: "1/2" },
                { label: "Specialist", color: "bg-purple-400",  val: "0/3" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${t.color}`} />
                  <span className="font-bold text-white">{t.val.split("/")[0]}</span>
                  <span className="text-xs text-slate-400">/{t.val.split("/")[1]}</span>
                  <span className="text-xs text-slate-300">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Compass graphic */}
          <svg viewBox="0 0 260 200" className="h-44 w-56 drop-shadow-[0_0_25px_rgba(34,197,94,0.4)] shrink-0" fill="none">
            <circle cx="130" cy="100" r="85" stroke="#22C55E" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="130" cy="100" r="60" stroke="#22C55E" strokeOpacity="0.5" strokeWidth="1.5" />
            <circle cx="130" cy="100" r="35" stroke="#38BDF8" strokeOpacity="0.8" strokeWidth="2" />
            <line x1="130" y1="15" x2="130" y2="185" stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="45" y1="100" x2="215" y2="100" stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="130" cy="100" r="9" fill="#22C55E" />
            <circle cx="130" cy="100" r="4" fill="#fff" />
            <circle cx="130" cy="40" r="6" fill="#22C55E" />
            <circle cx="130" cy="160" r="6" fill="#38BDF8" />
            <circle cx="70" cy="100" r="6" fill="#F59E0B" />
            <circle cx="190" cy="100" r="6" fill="#A855F7" />
            <polygon points="130,55 137,100 130,92 123,100" fill="#22C55E" />
            <polygon points="130,145 137,100 130,108 123,100" fill="#38BDF8" />
          </svg>
        </div>
      </header>

      {/* ── Filters ── */}
      <section className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by track, skill or certification (e.g. OSCP, SOC, Web, Cloud)..."
            className="w-full rounded-xl border border-[#1E293B] bg-[#0C1322] py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-[#22C55E] focus:outline-none"
          />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white">Clear</button>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: selectedTrack, setter: setSelectedTrack, options: [["all","Track: All"],["offensive","Offensive"],["defensive","Defensive"],["specialist","Specialist"],["foundation","Foundation"]] },
            { value: selectedDifficulty, setter: setSelectedDifficulty, options: [["all","Difficulty: All"],["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]] },
            { value: selectedStatus, setter: setSelectedStatus, options: [["all","Status: All"],["enrolled","In Progress"],["completed","Completed"],["not_started","Not Started"]] },
            { value: sortBy, setter: setSortBy, options: [["recommended","Sort: Recommended"],["progress","Highest Progress"],["labs","Most Labs"],["duration","Shortest"]] },
          ].map((sel, i) => (
            <div key={i} className="relative">
              <select value={sel.value} onChange={(e) => sel.setter(e.target.value)}
                className="appearance-none rounded-lg border border-[#1E293B] bg-[#0C1322] py-2 pl-3 pr-7 text-xs text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none">
                {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          ))}
          {isFiltering && (
            <button onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-slate-300 hover:border-[#22C55E] hover:text-[#22C55E]">
              <RotateCcw size={11} /> Reset
            </button>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      {isFiltering ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h2 className="text-lg font-bold text-white">Results ({filteredPaths.length})</h2>
            <button onClick={resetFilters} className="text-xs text-slate-400 hover:text-white">Clear filters</button>
          </div>
          {filteredPaths.length === 0 ? (
            <div className="rounded-2xl border border-[#1E293B] bg-[#0C1322] p-12 text-center">
              <p className="font-semibold text-white">No tracks match your search</p>
              <p className="mt-1 text-xs text-slate-400">Try adjusting the filters.</p>
              <button onClick={resetFilters} className="mt-4 rounded-lg bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#090E12]">Reset Filters</button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPaths.map((p) => <PathCard key={p.id} path={p} />)}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-12">
          {/* Recommended */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">Recommended for you</h2>
                <p className="text-xs text-slate-400">Career tracks based on industry demand and your active skill progress.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Helpful?</span>
                {feedbackGiven ? (
                  <span className="text-emerald-400 font-medium">✓ Thanks!</span>
                ) : (
                  <>
                    <button onClick={() => setFeedbackGiven("up")} className="rounded p-1 hover:bg-slate-800 hover:text-white"><ThumbsUp size={14} /></button>
                    <button onClick={() => setFeedbackGiven("down")} className="rounded p-1 hover:bg-slate-800 hover:text-white"><ThumbsDown size={14} /></button>
                  </>
                )}
              </div>
            </div>

            {/* Featured path banner */}
            {featuredPath && (
              <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#1E2D48] bg-gradient-to-r from-[#0C1424] via-[#0F1B30] to-[#0A1220] p-6 sm:p-8 hover:border-[#22C55E]/40 transition shadow-xl">
                <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-orange-400 uppercase">
                          {featuredPath.role}
                        </span>
                        <span className="font-mono text-xs text-slate-400">• HCOO Certified</span>
                      </div>
                      <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{featuredPath.title}</h2>
                      <p className="mt-1.5 text-xs text-slate-300 sm:text-sm max-w-2xl leading-relaxed">{featuredPath.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-amber-400"><Signal size={13} /> {featuredPath.difficulty}</span>
                      <span className="inline-flex items-center gap-1.5 text-slate-300"><Clock size={13} /> {featuredPath.hours} Hours</span>
                      <span className="inline-flex items-center gap-1.5 text-slate-300"><Layers size={13} /> {featuredPath.modules} Modules · {featuredPath.labs} Labs</span>
                      <span className="inline-flex items-center gap-1.5 text-emerald-400"><Zap size={13} /> {featuredPath.progress}% complete</span>
                    </div>
                    <Link href={`/learn/paths/${featuredPath.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] px-6 py-2.5 text-xs sm:text-sm font-bold text-[#090E12] hover:bg-[#4ADE80] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition">
                      Continue Track ({featuredPath.progress}%) <ArrowRight size={16} />
                    </Link>
                  </div>
                  <svg viewBox="0 0 180 160" className="h-32 w-36 sm:h-36 sm:w-40 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] shrink-0" fill="none">
                    <circle cx="90" cy="80" r="60" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="90" cy="80" r="42" stroke="#22C55E" strokeWidth="1.5" />
                    <circle cx="90" cy="80" r="24" stroke="#EF4444" strokeWidth="1.5" fill="#EF4444" fillOpacity="0.1" />
                    <line x1="90" y1="10" x2="90" y2="150" stroke="#22C55E" strokeWidth="1.5" />
                    <line x1="20" y1="80" x2="160" y2="80" stroke="#22C55E" strokeWidth="1.5" />
                    <circle cx="90" cy="80" r="4" fill="#EF4444" />
                    <circle cx="90" cy="80" r="2" fill="#fff" />
                  </svg>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherPaths.map((p) => <PathCard key={p.id} path={p} />)}
            </div>
          </section>

          {/* Offensive */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Offensive Security & Red Teaming</h2>
              <p className="text-xs text-slate-400">Hands-on exploitation, AD abuse, weaponization, and adversary emulation.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {offensivePaths.map((p) => <PathCard key={p.id} path={p} />)}
            </div>
          </section>

          {/* Defensive */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Defensive Security & SOC Operations</h2>
              <p className="text-xs text-slate-400">Threat hunting, SIEM log analysis, digital forensics, and incident containment.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {defensivePaths.map((p) => <PathCard key={p.id} path={p} />)}
            </div>
          </section>

          {/* Specialist */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Specialist & Foundation Tracks</h2>
              <p className="text-xs text-slate-400">Core cybersecurity fundamentals, Web Security, Active Directory, and Cloud Security.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {specialistPaths.map((p) => <PathCard key={p.id} path={p} />)}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
