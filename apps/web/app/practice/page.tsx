"use client";

import {
  ChevronDown,
  RotateCcw,
  Search,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Zap,
  Shield,
  Server,
  Layers,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { mapApiChallenge, type ApiChallenge } from "@/lib/challenges";
import { PracticeHero } from "@/components/practice/PracticeHero";
import { ChallengeCard } from "@/components/practice/ChallengeCard";
import { RecommendedTargetBanner } from "@/components/practice/RecommendedTargetBanner";
import type { ChallengeCategory, ChallengeDifficulty, PracticeChallenge } from "@hackers-campus/shared-types";

export default function PracticePage() {
  const [challenges, setChallenges] = useState<PracticeChallenge[]>([]);
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSubscription, setSelectedSubscription] = useState<string>("all");

  // Show More toggle for Recommended section
  const [showMoreRecommended, setShowMoreRecommended] = useState(false);

  // Recommendations Feedback state
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);

  // Filter logic
  const filteredChallenges = useMemo(() => {
    let result = [...challenges];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.skillsTested.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedDifficulty !== "all") {
      result = result.filter((c) => c.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    if (selectedStatus === "completed") {
      result = result.filter((c) => c.solved);
    } else if (selectedStatus === "unsolved") {
      result = result.filter((c) => !c.solved);
    }

    if (selectedType === "quick") {
      result = result.filter((c) => c.type === "quick" || c.estimatedMinutes <= 20);
    } else if (selectedType === "ctf") {
      result = result.filter((c) => c.type === "hard" || c.difficulty === "Hard" || c.difficulty === "Insane");
    }

    // Sort order
    if (sortBy === "popular") {
      result.sort((a, b) => b.solversCount - a.solversCount);
    } else if (sortBy === "easy-first") {
      const rank = { Easy: 1, Medium: 2, Hard: 3, Insane: 4 };
      result.sort((a, b) => rank[a.difficulty] - rank[b.difficulty]);
    } else if (sortBy === "hard-first") {
      const rank = { Easy: 1, Medium: 2, Hard: 3, Insane: 4 };
      result.sort((a, b) => rank[b.difficulty] - rank[a.difficulty]);
    } else if (sortBy === "shortest") {
      result.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    }

    return result;
  }, [challenges, searchQuery, selectedType, sortBy, selectedDifficulty, selectedStatus, selectedSubscription]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/practice/challenges`)
      .then((response) => response.ok ? response.json() : [])
      .then((data: ApiChallenge[]) => setChallenges(data.map(mapApiChallenge)))
      .catch(() => setChallenges([]));
  }, []);

  // Specific categorized lists for the standard landing view
  const recommendedItems = useMemo(() => {
    const list = challenges;
    return showMoreRecommended ? list : list.slice(0, 4);
  }, [challenges, showMoreRecommended]);

  const quick5MinHacks = useMemo(() => {
    return challenges.filter((c) => c.type === "quick" || c.estimatedMinutes <= 20).slice(0, 4);
  }, [challenges]);

  const webChallenges = useMemo(() => {
    return challenges.filter((c) => c.category === "Web Security").slice(0, 4);
  }, [challenges]);

  const adAndPrivescChallenges = useMemo(() => {
    return challenges.filter(
      (c) => c.category === "Active Directory" || c.category === "Linux" || c.category === "Binary Exploitation"
    ).slice(0, 4);
  }, [challenges]);

  const isFiltering =
    searchQuery.trim() !== "" ||
    selectedType !== "all" ||
    sortBy !== "recommended" ||
    selectedDifficulty !== "all" ||
    selectedStatus !== "all" ||
    selectedSubscription !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSortBy("recommended");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
    setSelectedSubscription("all");
  };

  return (
    <main className="min-h-screen bg-[#090E17] pb-16 text-[#E2E8F0]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. TryHackMe Style Practice Hero HUD with Segmented Meter & Cyber Mountain */}
        <PracticeHero
          solvedCount={0}
          totalCount={challenges.length}
          easyTotal={challenges.filter((c) => c.difficulty === "Easy").length}
          medTotal={challenges.filter((c) => c.difficulty === "Medium").length}
          hardTotal={challenges.filter((c) => c.difficulty === "Hard" || c.difficulty === "Insane").length}
        />

        {/* 2. Search Bar & Dropdown Filters Bar */}
        <section className="mb-10 space-y-4">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find content by a keyword..."
              className="w-full rounded-xl border border-[#1E293B] bg-[#111A28] py-3.5 pl-11 pr-10 text-sm font-medium text-white placeholder:text-slate-400 focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
              >
                <option value="all">Type: All</option>
                <option value="challenge">Challenge</option>
                <option value="quick">5-Min Hack</option>
                <option value="ctf">CTF / Hard</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Sort by */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="popular">Most Popular</option>
                <option value="easy-first">Difficulty: Low to High</option>
                <option value="hard-first">Difficulty: High to Low</option>
                <option value="shortest">Duration: Shortest</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Difficulty */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
              >
                <option value="all">Difficulty: All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="insane">Insane</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
              >
                <option value="all">Status: All</option>
                <option value="unsolved">Unsolved</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Subscription type */}
            <div className="relative">
              <select
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
                className="appearance-none rounded-lg border border-[#1E293B] bg-[#111A28] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 hover:border-slate-600 focus:border-[#22C55E] focus:outline-none"
              >
                <option value="all">Subscription: All</option>
                <option value="free">Free Access</option>
                <option value="vip">VIP / Premium</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Reset Filters button */}
            {isFiltering && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-[#22C55E] hover:text-[#22C55E]"
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </section>

        {/* 3. Render Either Filtered View OR Sectioned Showcase View */}
        {isFiltering ? (
          /* Filtered Results View */
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="text-lg font-bold text-white">
                Filtered Challenges ({filteredChallenges.length})
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs font-medium text-slate-400 hover:text-white"
              >
                Clear all filters
              </button>
            </div>

            {filteredChallenges.length === 0 ? (
              <div className="rounded-2xl border border-[#1E293B] bg-[#111A28] p-12 text-center">
                <p className="text-base font-semibold text-white">No challenges match your search criteria</p>
                <p className="mt-1 text-xs text-slate-400">Try adjusting your keywords or clearing the active filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-lg bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#090E12]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Standard TryHackMe Sectioned Experience */
          <div className="space-y-12">
            {/* SECTION 1: Recommended for you */}
            <section>
              {/* Header with Title, Subtitle, and Show More */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Recommended for you
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                    Here are some other challenges we think you'll like.
                  </p>
                </div>

                <button
                  onClick={() => setShowMoreRecommended((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#111A28] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                >
                  <span>{showMoreRecommended ? "Show Less" : "Show More"}</span>
                </button>
              </div>

              {/* Featured AI Threat Modelling Assessment Banner */}
              <RecommendedTargetBanner />

              {/* 4 Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedItems.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>

              {/* Useful recommendations feedback prompt */}
              <div className="mt-5 flex items-center justify-end gap-3 text-xs text-slate-400">
                <span>Are these recommendations useful?</span>
                {feedbackGiven ? (
                  <span className="font-medium text-emerald-400 animate-fadeIn">
                    ✓ Thanks for your feedback!
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setFeedbackGiven("up")}
                      aria-label="Thumbs up"
                      className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <ThumbsUp size={15} />
                    </button>
                    <button
                      onClick={() => setFeedbackGiven("down")}
                      aria-label="Thumbs down"
                      className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <ThumbsDown size={15} />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 2: 5 minute hacks */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  5 minute hacks
                </h2>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Find the weak spot and you're done. These are quick wins with a clear path and minimal resistance.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quick5MinHacks.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </section>

            {/* SECTION 3: Web Application Exploitation */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Web Application Exploitation
                </h2>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Master OWASP Top 10 vulnerabilities, authentication bypasses, and injection attacks.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {webChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </section>

            {/* SECTION 4: Active Directory & Privilege Escalation */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Active Directory & System Exploitation
                </h2>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Kerberoasting, pass-the-hash, domain pivoting, and Linux SUID privilege escalation.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {adAndPrivescChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
