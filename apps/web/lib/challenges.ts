import type { PracticeChallenge } from "@hackers-campus/shared-types";

export type ApiChallenge = {
  id: string; slug: string; title: string; category: PracticeChallenge["category"];
  difficulty: PracticeChallenge["difficulty"]; xp: number; estimated_minutes: number;
  description: string; scenario: string; target_ip: string; target_hostname: string;
  target_ports?: string; tasks: Array<{ id: string; task_number: string; title: string; description: string; hint?: string; xp: number }>;
};

export function mapApiChallenge(challenge: ApiChallenge): PracticeChallenge {
  const openPorts = (challenge.target_ports || "").split(",").map((value) => Number(value.trim())).filter(Number.isFinite);
  return {
    id: challenge.id, slug: challenge.slug, title: challenge.title, category: challenge.category,
    difficulty: challenge.difficulty, xp: challenge.xp, estimatedMinutes: challenge.estimated_minutes,
    solversCount: 0, rating: 0, solved: false,
    type: challenge.difficulty === "Hard" || challenge.difficulty === "Insane" ? "hard" : challenge.estimated_minutes <= 20 ? "quick" : "recommended",
    description: challenge.description, scenario: challenge.scenario, prerequisites: [], skillsTested: [],
    attackMachine: { hostname: "AttackBox", ip: "", os: "Kali Linux" },
    targetMachine: { hostname: challenge.target_hostname || "Provisioned target", ip: challenge.target_ip || "Provision at launch", os: "Container", openPorts },
    tasks: challenge.tasks.map((task) => ({ id: task.id, taskNumber: task.task_number, title: task.title,
      description: task.description, hint: task.hint, hintCost: 0, xp: task.xp, completed: false,
      questionType: "flag", flagFormat: "HC{...}" })),
  };
}
