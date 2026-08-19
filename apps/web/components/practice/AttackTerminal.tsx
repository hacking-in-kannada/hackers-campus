"use client";

import { Check, Copy, Maximize2, Minimize2, Play, RefreshCw, Terminal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TerminalMessage {
  type: "input" | "output" | "system" | "error" | "success";
  text: string;
}

interface AttackTerminalProps {
  labStatus: "stopped" | "provisioning" | "running";
  targetIp: string;
  targetHostname: string;
  onQuickCommand?: (cmd: string) => void;
}

export function AttackTerminal({
  labStatus,
  targetIp,
  targetHostname,
}: AttackTerminalProps) {
  const [terminalInput, setTerminalInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<TerminalMessage[]>([
    {
      type: "system",
      text: "[OFFLINE] Lab environment is currently standby. Click 'Start Lab Instance' above to allocate your dedicated Kali attack container and network routing.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (labStatus === "provisioning") {
      setHistory([
        {
          type: "system",
          text: "[PROVISIONING] Allocating dedicated Kali Linux container pod...",
        },
        {
          type: "system",
          text: `[ROUTING] Establishing isolated subnet bridge to ${targetHostname} (${targetIp})...`,
        },
      ]);
    } else if (labStatus === "running") {
      setHistory((prev) => [
        ...prev,
        {
          type: "success",
          text: `[SYSTEM ONLINE] Kali Linux Attackbox connected. Target host reachable at ${targetIp}.`,
        },
        {
          type: "output",
          text: `Kali GNU/Linux 2026.1 (x86_64)\nType 'help' for tactical tool shortcuts, or run 'nmap', 'curl', 'whoami'.`,
        },
      ]);
    } else if (labStatus === "stopped") {
      setHistory([
        {
          type: "system",
          text: "[OFFLINE] Session terminated. Lab environment returned to standby.",
        },
      ]);
    }
  }, [labStatus, targetIp, targetHostname]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const cmd = cmdStr.trim();
    if (!cmd) return;

    if (labStatus !== "running") {
      setHistory((prev) => [
        ...prev,
        { type: "input", text: `$ ${cmd}` },
        {
          type: "error",
          text: "[-] Error: Kali attack container is offline. Click 'Start Lab Instance' above first.",
        },
      ]);
      setTerminalInput("");
      return;
    }

    const lowerCmd = cmd.toLowerCase();
    const newMessages: TerminalMessage[] = [{ type: "input", text: `$ ${cmd}` }];

    if (lowerCmd === "clear") {
      setHistory([]);
      setTerminalInput("");
      return;
    }

    if (lowerCmd === "help") {
      newMessages.push({
        type: "output",
        text: `Available Terminal Commands & Utilities:
  nmap -sC -sV ${targetIp}       Scan target open ports & services
  curl -i http://${targetIp}:3000/api/admin/vault
                                Test HTTP endpoint & forge auth cookies
  ping -c 3 ${targetIp}          Verify network connectivity
  whoami / id                   Check local execution privileges
  cat /etc/passwd               Inspect local system users
  clear                         Clear console buffer`,
      });
    } else if (lowerCmd.startsWith("nmap")) {
      newMessages.push({
        type: "output",
        text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-18 04:12 UTC
Nmap scan report for ${targetHostname} (${targetIp})
Host is up (0.0012s latency).
PORT     STATE SERVICE     VERSION
80/tcp   open  http        nginx/1.24.0
443/tcp  open  ssl/http    nginx/1.24.0
3000/tcp open  http        Node.js Express (Sentinel API)
|_http-title: Sentinel Internal Authorization Service
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS

Service detection performed. 1 service unrecognized but responds to JWT headers.`,
      });
    } else if (lowerCmd.startsWith("curl")) {
      if (lowerCmd.includes("none") || lowerCmd.includes("auth_token")) {
        newMessages.push({
          type: "success",
          text: `HTTP/1.1 200 OK
Server: nginx/1.24.0
Date: Tue, 18 Aug 2026 04:13:02 GMT
Content-Type: application/json; charset=utf-8
Set-Cookie: session_elevated=true; Path=/

{
  "status": "authenticated",
  "role": "administrator",
  "identity": "admin@sentinel.corp",
  "flag": "HC{jwt_none_alg_pwned_4981a}",
  "message": "Vault decrypted. High-privilege access confirmed."
}`,
        });
      } else {
        newMessages.push({
          type: "output",
          text: `HTTP/1.1 401 Unauthorized
Server: nginx/1.24.0
Date: Tue, 18 Aug 2026 04:12:44 GMT
Content-Type: application/json

{
  "error": "Missing or invalid authorization cookie",
  "detail": "Algorithm 'none' payload required or missing auth_token",
  "status": 401
}`,
        });
      }
    } else if (lowerCmd === "whoami") {
      newMessages.push({ type: "output", text: "hacker" });
    } else if (lowerCmd === "id") {
      newMessages.push({
        type: "output",
        text: "uid=1000(hacker) gid=1000(hacker) groups=1000(hacker),27(sudo),100(users)",
      });
    } else if (lowerCmd.startsWith("ping")) {
      newMessages.push({
        type: "output",
        text: `PING ${targetIp} (${targetIp}) 56(84) bytes of data.
64 bytes from ${targetIp}: icmp_seq=1 ttl=64 time=0.384 ms
64 bytes from ${targetIp}: icmp_seq=2 ttl=64 time=0.412 ms
64 bytes from ${targetIp}: icmp_seq=3 ttl=64 time=0.395 ms

--- ${targetIp} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2038ms
rtt min/avg/max/mdev = 0.384/0.397/0.412/0.011 ms`,
      });
    } else if (lowerCmd.startsWith("cat /etc/passwd")) {
      newMessages.push({
        type: "output",
        text: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
hacker:x:1000:1000:Hacker,,,:/home/hacker:/bin/bash`,
      });
    } else {
      newMessages.push({
        type: "output",
        text: `bash: ${cmd.split(" ")[0]}: command executed in simulated kali container. Type 'help' for recognized tools.`,
      });
    }

    setHistory((prev) => [...prev, ...newMessages]);
    setTerminalInput("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(terminalInput);
  };

  const handleCopyLogs = () => {
    const text = history.map((h) => h.text).join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-module rounded-lg flex flex-col h-full overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="bg-[#090E12] px-4 py-2.5 border-b border-[#1C252D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="font-mono text-xs font-semibold text-ink ml-2 flex items-center gap-1.5">
            <Terminal size={13} className="text-lime" /> kali@sentinel-attackbox: ~
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <button
            onClick={handleCopyLogs}
            className="text-muted hover:text-ink px-2 py-0.5 rounded sub-module flex items-center gap-1 transition"
            title="Copy console output"
          >
            {copied ? <Check size={11} className="text-lime" /> : <Copy size={11} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <button
            onClick={() => setHistory([])}
            className="text-muted hover:text-ink px-2 py-0.5 rounded sub-module flex items-center gap-1 transition"
            title="Clear console"
          >
            <Trash2 size={11} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Tactical Quick Command Bar */}
      <div className="bg-[#0C1217] px-3 py-1.5 border-b border-[#151D23] flex items-center gap-2 overflow-x-auto hide-scrollbar">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider whitespace-nowrap">
          Quick Shell:
        </span>
        <button
          onClick={() => executeCommand(`nmap -sC -sV ${targetIp}`)}
          className="sub-module px-2 py-0.5 rounded font-mono text-[11px] text-muted hover:text-lime hover:border-lime transition whitespace-nowrap"
        >
          nmap scan
        </button>
        <button
          onClick={() => executeCommand(`curl -i http://${targetIp}:3000/api/admin/vault`)}
          className="sub-module px-2 py-0.5 rounded font-mono text-[11px] text-muted hover:text-lime hover:border-lime transition whitespace-nowrap"
        >
          curl test
        </button>
        <button
          onClick={() =>
            executeCommand(
              `curl -i -H "Cookie: auth_token=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9." http://${targetIp}:3000/api/admin/vault`
            )
          }
          className="sub-module px-2 py-0.5 rounded font-mono text-[11px] text-muted hover:text-lime hover:border-lime transition whitespace-nowrap"
        >
          curl exploit (alg: none)
        </button>
        <button
          onClick={() => executeCommand(`ping -c 3 ${targetIp}`)}
          className="sub-module px-2 py-0.5 rounded font-mono text-[11px] text-muted hover:text-lime hover:border-lime transition whitespace-nowrap"
        >
          ping target
        </button>
        <button
          onClick={() => executeCommand("help")}
          className="sub-module px-2 py-0.5 rounded font-mono text-[11px] text-muted hover:text-lime hover:border-lime transition whitespace-nowrap"
        >
          help
        </button>
      </div>

      {/* Terminal Output Area */}
      <div
        className="flex-1 bg-[#070B0E] p-4 font-mono text-xs overflow-y-auto space-y-2 min-h-[360px] max-h-[500px]"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((msg, idx) => (
          <div key={idx} className="leading-relaxed whitespace-pre-wrap break-all">
            {msg.type === "input" && (
              <span className="text-lime font-bold">{msg.text}</span>
            )}
            {msg.type === "output" && (
              <span className="text-[#D9E3F2]">{msg.text}</span>
            )}
            {msg.type === "system" && (
              <span className="text-muted italic">{msg.text}</span>
            )}
            {msg.type === "error" && (
              <span className="text-rose-400 font-semibold">{msg.text}</span>
            )}
            {msg.type === "success" && (
              <span className="text-lime bg-lime/10 px-1 py-0.5 rounded font-bold border border-lime/20 inline-block">
                {msg.text}
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Line */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-[#090E12] border-t border-[#1C252D] px-4 py-2.5 flex items-center gap-2"
      >
        <span className="font-mono text-xs font-bold text-lime">$</span>
        <input
          ref={inputRef}
          type="text"
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          placeholder={
            labStatus === "running"
              ? "Enter command (e.g. nmap, curl, help)..."
              : "Start lab instance above to activate interactive shell"
          }
          disabled={labStatus !== "running"}
          className="flex-1 bg-transparent font-mono text-xs text-ink placeholder:text-muted/50 focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={labStatus !== "running" || !terminalInput.trim()}
          className="btn-primary px-3 py-1 rounded font-mono text-[11px] font-bold disabled:opacity-40"
        >
          Execute
        </button>
      </form>
    </div>
  );
}
