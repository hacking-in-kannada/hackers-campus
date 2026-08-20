"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { saveSession } from "@/lib/auth";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "login" ? { username, password } : { username, email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Unable to authenticate. Please try again.");
      saveSession({ accessToken: data.access_token, username: data.username, userId: data.user_id, role: data.role });
      const destination = searchParams.get("next") || (data.role === "admin" ? "/admin" : "/");
      router.replace((destination.startsWith("/") ? destination : "/") as any);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#090E17] px-4 py-12">
    <div className="w-full max-w-md rounded-2xl border border-[#1E293B] bg-[#0C1322] p-7 shadow-2xl sm:p-9">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"><ShieldCheck /></div>
      <p className="mt-5 font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">Hackers Campus</p>
      <h1 className="mt-2 text-2xl font-bold text-white">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-2 text-sm text-slate-400">{mode === "login" ? "Sign in to continue your learning." : "Start tracking your cybersecurity learning."}</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm text-slate-300">Username<input required minLength={3} value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#334155] bg-[#070B12] px-3 py-2.5 text-white outline-none focus:border-emerald-500" /></label>
        {mode === "register" && <label className="block text-sm text-slate-300">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#334155] bg-[#070B12] px-3 py-2.5 text-white outline-none focus:border-emerald-500" /></label>}
        <label className="block text-sm text-slate-300">Password<input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#334155] bg-[#070B12] px-3 py-2.5 text-white outline-none focus:border-emerald-500" /></label>
        {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"><LockKeyhole size={16} />{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">{mode === "login" ? "New here?" : "Already have an account?"} <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="font-semibold text-emerald-400 hover:text-emerald-300">{mode === "login" ? "Create an account" : "Sign in"}</button></p>
      <Link href="/" className="mt-5 block text-center text-xs text-slate-500 hover:text-slate-300">Return to campus</Link>
    </div>
  </div>;
}
