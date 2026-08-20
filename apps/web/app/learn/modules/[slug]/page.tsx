"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Module = { id: string; slug: string; title: string; description: string; category: string; stage: string; estimated_minutes: number };

export default function ModuleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [module, setModule] = useState<Module | null>(null);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/curriculum/modules`)
      .then((response) => response.ok ? response.json() : [])
      .then((modules: Module[]) => setModule(modules.find((item) => item.slug === slug) || null))
      .catch(() => setModule(null));
  }, [slug]);
  if (!module) return <main className="min-h-screen bg-[#090E17] p-10 text-center text-slate-400">This module has not been created yet.</main>;
  return <main className="min-h-screen bg-[#090E17] p-6 text-slate-200"><div className="mx-auto max-w-4xl"><Link href="/learn/modules" className="text-sm text-emerald-400">← Modules</Link><h1 className="mt-5 text-3xl font-bold text-white">{module.title}</h1><p className="mt-3 text-slate-400">{module.description}</p><p className="mt-5 font-mono text-xs uppercase text-emerald-400">{module.stage} · {module.estimated_minutes} minutes</p></div></main>;
}
