"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Room = { id: string; title: string; category: string; difficulty: string; description: string; estimated_minutes: number };

export default function LearnRoomWorkspace() {
  const { slug } = useParams<{ slug: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/rooms`)
      .then((response) => response.ok ? response.json() : [])
      .then((rooms: Room[]) => setRoom(rooms.find((item) => item.id === slug) || null))
      .catch(() => setRoom(null));
  }, [slug]);
  if (!room) return <main className="min-h-screen bg-[#090E17] p-10 text-center text-slate-400">This room has not been created yet.</main>;
  return <main className="min-h-screen bg-[#090E17] p-6 text-slate-200"><div className="mx-auto max-w-4xl"><Link href="/learn/modules" className="text-sm text-emerald-400">← Learning modules</Link><h1 className="mt-5 text-3xl font-bold text-white">{room.title}</h1><p className="mt-3 text-slate-400">{room.description}</p><p className="mt-5 font-mono text-xs uppercase text-emerald-400">{room.category} · {room.difficulty} · {room.estimated_minutes} minutes</p></div></main>;
}
