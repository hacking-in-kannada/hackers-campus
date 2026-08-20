"use client";

import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  Copy,
  Download,
  FileCode,
  ImageIcon,
  Lightbulb,
  Terminal,
  Zap,
} from "lucide-react";
import { useState } from "react";

export interface TaskQuestion {
  id: string;
  prompt: string;
  placeholder?: string;
  correctAnswer?: string;
  hint?: string;
  xp?: number;
}

export interface RoomTaskItem {
  id: string;
  taskNumber: number;
  title: string;
  completed: boolean;
  content: {
    heading?: string;
    description: string;
    htmlContent?: string;
    imageAttachment?: {
      name: string;
      url: string;
      size: string;
    };
    codeSnippets?: Array<{ command: string; explanation: string }>;
    tipBox?: {
      title: string;
      steps: string[];
    };
    whyDoingThis?: string;
  };
  questions: TaskQuestion[];
}

interface TaskAccordionProps {
  task: RoomTaskItem;
  isOpen: boolean;
  onToggle: () => void;
  onQuestionSolved: (taskId: string, questionId: string) => void;
  onQuestionCheck?: (taskId: string, questionId: string, answer: string) => Promise<boolean>;
}

export function TaskAccordion({ task, isOpen, onToggle, onQuestionSolved, onQuestionCheck }: TaskAccordionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionResults, setQuestionResults] = useState<Record<string, "idle" | "correct" | "incorrect">>({});
  const [unlockedHints, setUnlockedHints] = useState<Record<string, boolean>>({});
  const [showWhyDoingThis, setShowWhyDoingThis] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleAnswerChange = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    if (questionResults[qId] === "incorrect") {
      setQuestionResults((prev) => ({ ...prev, [qId]: "idle" }));
    }
  };

  const handleCheck = async (q: TaskQuestion) => {
    const val = answers[q.id]?.trim() || "";
    if (!val) return;
    const isMatch = onQuestionCheck
      ? await onQuestionCheck(task.id, q.id, val)
      : Boolean(q.correctAnswer && (val === q.correctAnswer || val.toLowerCase() === q.correctAnswer.toLowerCase() || (q.correctAnswer.startsWith("HC{") && val.toLowerCase().includes(q.correctAnswer.toLowerCase()))));

    if (isMatch) {
      setQuestionResults((prev) => ({ ...prev, [q.id]: "correct" }));
      onQuestionSolved(task.id, q.id);
    } else {
      setQuestionResults((prev) => ({ ...prev, [q.id]: "incorrect" }));
    }
  };

  const handleCopy = (cmd: string) => {
    navigator.clipboard?.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className={`overflow-hidden rounded-xl border transition-all duration-200 ${
      isOpen ? "border-[#22C55E]/30 shadow-[0_0_20px_rgba(34,197,94,0.06)]" : "border-[#1E293B]"
    } bg-[#0C1322]`}>

      {/* ── Accordion Header ── */}
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between px-5 py-4 text-left transition-colors ${
          isOpen ? "bg-[#0F1D33] border-b border-[#1E293B]" : "hover:bg-[#0F1D33]/60"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Task number pill */}
          <span className="rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-400">
            Task {task.taskNumber}
          </span>

          {task.completed ? (
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          ) : (
            <Circle size={14} className="text-slate-500 shrink-0" />
          )}

          <span className="text-sm font-semibold text-white">{task.title}</span>
        </div>

        <ChevronDown
          size={15}
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-400" : ""}`}
        />
      </button>

      {/* ── Accordion Body ── */}
      {isOpen && (
        <div className="p-6 sm:p-8 space-y-7">

          {/* Heading */}
          {task.content.heading && (
            <div className="flex items-start gap-3">
              <span className="mt-1 h-5 w-1 rounded-full bg-emerald-400 shrink-0" />
              <h3 className="text-lg font-bold tracking-tight text-white leading-snug">
                {task.content.heading}
              </h3>
            </div>
          )}

          {/* Description / HTML Content */}
          {task.content.htmlContent ? (
            <div
              className="prose prose-invert max-w-none text-sm leading-7 text-slate-300 border-l-2 border-[#22C55E]/40 pl-4 space-y-2 [&_code]:rounded [&_code]:bg-[#070B0E] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-emerald-300 [&_pre]:rounded-lg [&_pre]:bg-[#070B0E] [&_pre]:p-3 [&_pre]:border [&_pre]:border-[#1E293B] [&_a]:text-emerald-400 [&_a]:underline [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
              dangerouslySetInnerHTML={{ __html: task.content.htmlContent }}
            />
          ) : (
            <p className="text-sm leading-7 text-slate-300 border-l-2 border-[#1E293B] pl-4 whitespace-pre-wrap">
              {task.content.description}
            </p>
          )}

          {/* Attached Task Image / Diagram Download Card */}
          {task.content.imageAttachment && (
            <div className="rounded-xl border border-panelBorder bg-[#080E18] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white">{task.content.imageAttachment.name}</p>
                  <p className="font-mono text-[10px] text-slate-400">{task.content.imageAttachment.size} · Challenge Asset Attachment</p>
                </div>
              </div>

              <a
                href={task.content.imageAttachment.url}
                download={task.content.imageAttachment.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-canvas transition"
              >
                <Download size={13} />
                <span>Download Asset</span>
              </a>
            </div>
          )}

          {/* Code Snippets — Terminal style */}
          {task.content.codeSnippets && task.content.codeSnippets.length > 0 && (
            <div className="rounded-xl overflow-hidden border border-[#1E293B] shadow-xl">
              {/* Terminal top bar */}
              <div className="flex items-center gap-2 bg-[#0A1018] px-4 py-2.5 border-b border-[#1E293B]">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 font-mono text-[10px] text-slate-500">terminal</span>
              </div>
              {/* Snippet rows */}
              <div className="bg-[#060D18] divide-y divide-[#1E293B]">
                {task.content.codeSnippets.map((snip, idx) => (
                  <div key={idx} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <Terminal size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                      <div>
                        <p className="font-mono text-xs text-slate-400">{snip.explanation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-5 sm:ml-0">
                      <code className="rounded-lg bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 font-mono text-xs font-bold text-emerald-300 tracking-wide">
                        $ {snip.command}
                      </code>
                      <button
                        onClick={() => handleCopy(snip.command)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 transition"
                        title="Copy"
                      >
                        {copiedCmd === snip.command ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tip Box */}
          {task.content.tipBox && (
            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-[#0C1322] p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/25">
                  <Terminal size={14} className="text-emerald-400" />
                </div>
                <p className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  {task.content.tipBox.title}
                </p>
              </div>
              <ol className="space-y-3">
                {task.content.tipBox.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-3 text-xs text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25 font-mono text-[10px] font-bold text-emerald-400">
                      {sIdx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Why you're doing this */}
          {task.content.whyDoingThis && (
            <div>
              <button
                onClick={() => setShowWhyDoingThis(!showWhyDoingThis)}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500 hover:text-emerald-400 transition"
              >
                <ChevronRight
                  size={13}
                  className={`transition-transform ${showWhyDoingThis ? "rotate-90 text-emerald-400" : ""}`}
                />
                Why you&apos;re doing this
              </button>
              {showWhyDoingThis && (
                <p className="mt-2 rounded-lg bg-[#0A101C] border border-[#1E293B] p-4 text-xs leading-relaxed text-slate-300">
                  {task.content.whyDoingThis}
                </p>
              )}
            </div>
          )}

          {/* ── Questions Section ── */}
          <div className="rounded-xl border border-[#1E293B] bg-[#080E1A] overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 bg-[#0B1220] px-5 py-3 border-b border-[#1E293B]">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-rose-400">
                Answer the questions below
              </h4>
            </div>

            <div className="divide-y divide-[#1E293B]">
              {task.questions.map((q) => {
                const isCorrect = questionResults[q.id] === "correct";
                const isIncorrect = questionResults[q.id] === "incorrect";

                return (
                  <div key={q.id} className="p-5 space-y-4">
                    {/* Question prompt + XP badge */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-white leading-relaxed">{q.prompt}</p>
                      {q.xp && (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-400">
                          <Zap size={10} fill="currentColor" />
                          +{q.xp} XP
                        </span>
                      )}
                    </div>

                    {/* Input + Check row */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                      <input
                        type="text"
                        disabled={isCorrect}
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCheck(q)}
                        placeholder={q.placeholder || "Enter your answer..."}
                        className={`flex-1 rounded-lg border bg-[#060C16] px-4 py-2.5 font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                          isCorrect
                            ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-bold"
                            : isIncorrect
                            ? "border-rose-500/50 bg-rose-950/10"
                            : "border-[#1E293B] focus:border-emerald-500/50"
                        }`}
                      />
                      <button
                        onClick={() => handleCheck(q)}
                        disabled={isCorrect}
                        className={`rounded-lg px-5 py-2.5 font-mono text-xs font-bold transition-all ${
                          isCorrect
                            ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 cursor-default"
                            : "border border-[#22C55E]/50 bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-[#090E12]"
                        }`}
                      >
                        {isCorrect ? (
                          <span className="flex items-center gap-1.5"><Check size={13} /> Correct</span>
                        ) : "Check"}
                      </button>
                    </div>

                    {/* Feedback */}
                    {isCorrect && (
                      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 font-mono text-[11px] text-emerald-400">
                        <Check size={12} />
                        <span>Correct! <strong>+{q.xp || 25} XP</strong> awarded to your profile.</span>
                      </div>
                    )}
                    {isIncorrect && (
                      <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 font-mono text-[11px] text-rose-400">
                        <span className="font-bold">✕</span>
                        <span>Incorrect — review the content above or unlock a hint.</span>
                      </div>
                    )}

                    {/* Hint */}
                    {q.hint && (
                      <div>
                        {unlockedHints[q.id] ? (
                          <div className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-xs text-amber-300">
                            <Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-400" />
                            <span><strong className="font-bold text-amber-400">Hint:</strong> {q.hint}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setUnlockedHints((prev) => ({ ...prev, [q.id]: true }))}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 font-mono text-[11px] text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10 transition"
                          >
                            <Lightbulb size={12} />
                            Show Hint
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
