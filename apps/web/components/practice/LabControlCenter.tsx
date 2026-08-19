"use client";

import { Check, Clock, Copy, ExternalLink, Globe, Play, RefreshCw, Server, Shield, Square, Terminal, Wifi } from "lucide-react";
import { useState } from "react";

interface MachineInfo {
  hostname: string;
  ip: string;
  os: string;
  sshUser?: string;
  openPorts?: number[];
}

interface LabControlCenterProps {
  labStatus: "stopped" | "provisioning" | "running";
  timeLeft: number;
  targetMachine: MachineInfo;
  onStartLab: () => void;
  onStopLab: () => void;
  onExtendLab: () => void;
}

export function LabControlCenter({
  labStatus,
  timeLeft,
  targetMachine,
  onStartLab,
  onStopLab,
  onExtendLab,
}: LabControlCenterProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const primaryWebPort = targetMachine.openPorts?.find((p) => [80, 443, 3000, 8000, 8080, 5000].includes(p));

  return (
    <section className="card-module p-5 md:p-6 rounded-lg mb-6 shadow-xl">
      {/* Top Status & Main Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#151D23] pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-3.5 w-3.5 rounded-full transition-all duration-300 ${
              labStatus === "running"
                ? "bg-lime shadow-[0_0_12px_#9DFF00] animate-pulse"
                : labStatus === "provisioning"
                ? "bg-amber-400 animate-ping"
                : "bg-neutral-600"
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                Target Lab Status:
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  labStatus === "running"
                    ? "text-lime"
                    : labStatus === "provisioning"
                    ? "text-amber-400"
                    : "text-neutral-400"
                }`}
              >
                {labStatus === "running"
                  ? "ONLINE // TARGET HOST REACHABLE"
                  : labStatus === "provisioning"
                  ? "PROVISIONING TARGET INSTANCE..."
                  : "STANDBY // OFFLINE"}
              </span>
            </div>
            <p className="text-[11px] font-mono text-muted">
              Dedicated isolated target environment with private routing.
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          {labStatus === "running" ? (
            <>
              <div className="sub-module px-3 py-1.5 rounded flex items-center gap-2 font-mono text-xs text-ink">
                <Clock size={13} className="text-lime" />
                <span>Expires in: {formatTimer(timeLeft)}</span>
              </div>
              <button
                onClick={onExtendLab}
                className="btn-secondary px-3 py-1.5 rounded font-mono text-xs text-ink hover:text-lime hover:border-lime transition-all"
                title="Add 30 minutes to lab session"
              >
                +30m Extend
              </button>
              <button
                onClick={onStopLab}
                className="px-3 py-1.5 rounded font-mono text-xs text-rose-400 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-all flex items-center gap-1"
              >
                <Square size={12} /> Terminate
              </button>
            </>
          ) : (
            <button
              onClick={onStartLab}
              disabled={labStatus === "provisioning"}
              className="btn-primary px-5 py-2.5 rounded font-mono text-xs font-bold flex items-center gap-2 shadow-glow hover:bg-limeDim transition-all disabled:opacity-50"
            >
              {labStatus === "provisioning" ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Provisioning Target...
                </>
              ) : (
                <>
                  <Play size={14} /> Start Target Instance
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Target Host Details Matrix */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Target IP */}
        <div
          className={`sub-module p-3.5 rounded-lg flex flex-col justify-between transition-all ${
            labStatus === "running" ? "border-l-2 border-l-lime" : "opacity-75"
          }`}
        >
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider">Target IP</span>
            <Wifi size={13} className={labStatus === "running" ? "text-lime" : "text-muted"} />
          </div>
          {labStatus === "running" ? (
            <button
              onClick={() => copyToClipboard(targetMachine.ip, "tgt-ip")}
              className="flex items-center justify-between group cursor-pointer"
            >
              <span className="font-mono text-sm font-bold text-lime group-hover:underline">
                {targetMachine.ip}
              </span>
              <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                {copiedKey === "tgt-ip" ? (
                  <span className="text-lime flex items-center gap-0.5">
                    <Check size={11} /> Copied
                  </span>
                ) : (
                  <Copy size={12} className="group-hover:text-ink" />
                )}
              </span>
            </button>
          ) : (
            <span className="font-mono text-sm font-bold text-muted/60">--.--.--.--</span>
          )}
        </div>

        {/* Card 2: Hostname & Environment */}
        <div
          className={`sub-module p-3.5 rounded-lg flex flex-col justify-between transition-all ${
            labStatus === "running" ? "border-l-2 border-l-lime" : "opacity-75"
          }`}
        >
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider">Host & OS</span>
            <Server size={13} className="text-muted" />
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-ink truncate">
              {targetMachine.hostname}
            </p>
            <p className="font-mono text-[11px] text-muted truncate mt-0.5">
              {targetMachine.os}
            </p>
          </div>
        </div>

        {/* Card 3: Open Ports */}
        <div
          className={`sub-module p-3.5 rounded-lg flex flex-col justify-between transition-all ${
            labStatus === "running" ? "border-l-2 border-l-lime" : "opacity-75"
          }`}
        >
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider">Open Ports</span>
            <Terminal size={13} className="text-muted" />
          </div>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {targetMachine.openPorts && targetMachine.openPorts.length > 0 ? (
              targetMachine.openPorts.map((port) => (
                <span
                  key={port}
                  className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                    labStatus === "running"
                      ? "bg-lime/10 text-lime border border-lime/20 font-bold"
                      : "bg-[#151D23] text-muted"
                  }`}
                >
                  {port}/tcp
                </span>
              ))
            ) : (
              <span className="text-xs font-mono text-muted">No open ports</span>
            )}
          </div>
        </div>

        {/* Card 4: Web Target Access / Connection */}
        <div
          className={`sub-module p-3.5 rounded-lg flex flex-col justify-between transition-all ${
            labStatus === "running" ? "border-l-2 border-l-lime" : "opacity-75"
          }`}
        >
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider">Network Mode</span>
            <Globe size={13} className="text-muted" />
          </div>
          <div>
            {labStatus === "running" ? (
              <button
                onClick={() =>
                  copyToClipboard(
                    `http://${targetMachine.ip}${primaryWebPort && primaryWebPort !== 80 ? `:${primaryWebPort}` : ""}`,
                    "target-url"
                  )
                }
                className="font-mono text-[11px] text-ink hover:text-lime flex items-center justify-between w-full"
              >
                <span className="truncate">
                  http://{targetMachine.ip}{primaryWebPort && primaryWebPort !== 80 ? `:${primaryWebPort}` : ""}
                </span>
                {copiedKey === "target-url" ? <Check size={11} className="text-lime" /> : <Copy size={11} />}
              </button>
            ) : (
              <span className="font-mono text-xs text-muted flex items-center gap-1">
                <Shield size={12} className="text-emerald-400" /> Isolated Sandbox
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
