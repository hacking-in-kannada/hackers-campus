export type MissionStatus = "completed" | "active" | "locked";

export interface MissionCard {
  id: string;
  title: string;
  subtitle: string;
  xp: number;
  status: MissionStatus;
}

export interface SkillStat {
  label: string;
  level: number;
}

export interface LabRoomSummary {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  runtime: "docker" | "virtualbox";
  estimatedMinutes: number;
}

