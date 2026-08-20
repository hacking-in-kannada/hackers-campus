"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type LearningPath = { id: string; slug: string; title: string; tagline: string; description: string; category: string; difficulty: string; estimated_hours: number; modules: Array<{ id: string; slug: string; title: string }> };

export default function PathDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [path, setPath] = useState<LearningPath | null>(null);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/paths`)
      .then((response) => response.ok ? response.json() : [])
      .then((paths: LearningPath[]) => setPath(paths.find((item) => item.slug === slug) || null))
      .catch(() => setPath(null));
  }, [slug]);
  if (!path) return <main className="min-h-screen bg-[#090E17] p-10 text-center text-slate-400">This learning path has not been created yet.</main>;
  return <main className="min-h-screen bg-[#090E17] p-6 text-slate-200"><div className="mx-auto max-w-4xl"><Link href="/learn/paths" className="text-sm text-emerald-400">← Learning paths</Link><h1 className="mt-5 text-3xl font-bold text-white">{path.title}</h1><p className="mt-2 text-slate-400">{path.tagline || path.description}</p><p className="mt-4 text-sm text-slate-500">{path.category} · {path.difficulty} · {path.estimated_hours} hours</p><div className="mt-8 space-y-3">{path.modules.map((module) => <Link key={module.id} href={`/learn/modules/${module.slug}`} className="block rounded-lg border border-[#1E293B] bg-[#0C1322] p-4 hover:border-emerald-500">{module.title}</Link>)}{!path.modules.length && <p className="text-sm text-slate-500">No modules have been assigned.</p>}</div></div></main>;
}
