"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Module = { id: string; slug: string; title: string; description: string; stage: string; estimated_minutes: number };
type Challenge = { id: string; slug: string; title: string; roadmap_stage?: string };

const STAGES = ["foundation", "offensive", "defensive", "specialized", "governance"];
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function InteractiveCybersecurityRoadmap() {
  const [modules, setModules] = useState<Module[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    Promise.all([fetch(`${apiBase}/curriculum/modules`), fetch(`${apiBase}/practice/challenges`)])
      .then(async ([moduleResponse, challengeResponse]) => {
        setModules(moduleResponse.ok ? await moduleResponse.json() : []);
        setChallenges(challengeResponse.ok ? await challengeResponse.json() : []);
      })
      .catch(() => { setModules([]); setChallenges([]); });
  }, []);

  return (
    <main className="min-h-screen bg-[#090E17] px-4 py-10 text-slate-200 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">Curriculum</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Cybersecurity Roadmap</h1>
        <p className="mt-2 text-sm text-slate-400">Content is shown only after an administrator creates it.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage) => {
            const stageModules = modules.filter((module) => module.stage === stage);
            const stageChallenges = challenges.filter((challenge) => challenge.roadmap_stage === stage);
            return <section key={stage} className="rounded-xl border border-[#1E293B] bg-[#0C1322] p-5">
              <h2 className="font-mono text-sm font-bold capitalize text-emerald-400">{stage}</h2>
              <div className="mt-4 space-y-2">
                {stageModules.map((module) => <Link key={module.id} href={`/learn/modules/${module.slug}`} className="block rounded border border-[#1E293B] p-3 text-sm text-white hover:border-emerald-500">{module.title}</Link>)}
                {stageChallenges.map((challenge) => <Link key={challenge.id} href={`/practice/${challenge.slug}`} className="block rounded border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-300 hover:border-emerald-500">{challenge.title}</Link>)}
                {!stageModules.length && !stageChallenges.length && <p className="text-xs text-slate-500">No content assigned.</p>}
              </div>
            </section>;
          })}
        </div>
      </div>
    </main>
  );
}
