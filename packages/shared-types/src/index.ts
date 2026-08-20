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
  maxLevel?: number;
  description?: string;
}

export interface LabRoomSummary {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Insane";
  runtime: "docker" | "virtualbox";
  estimatedMinutes: number;
}

export type ChallengeCategory =
  | "Web Security"
  | "Network Security"
  | "Active Directory"
  | "Linux"
  | "Binary Exploitation"
  | "Cryptography"
  | "Digital Forensics"
  | "Cloud Security"
  | "Reverse Engineering"
  | "OSINT";

export type ChallengeDifficulty = "Easy" | "Medium" | "Hard" | "Insane";

export interface PracticeChallenge {
  id: string;
  slug: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  xp: number;
  estimatedMinutes: number;
  solversCount: number;
  rating: number;
  solved: boolean;
  type: "quick" | "recommended" | "hard";
  description: string;
  scenario: string;
  prerequisites: string[];
  skillsTested: string[];
  imageUrl?: string;
  imageFileName?: string;
  attackMachine: {
    hostname: string;
    ip: string;
    os: string;
    sshUser?: string;
  };
  targetMachine: {
    hostname: string;
    ip: string;
    os: string;
    openPorts: number[];
  };
  tasks: ChallengeTask[];
}

export interface ChallengeTask {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  htmlContent?: string;
  hint?: string;
  hintCost: number;
  xp: number;
  completed: boolean;
  questionType: "flag" | "text" | "multiple-choice";
  flagFormat?: string;
  correctAnswer?: string;
  options?: string[];
  imageAttachment?: {
    name: string;
    url: string;
    size: string;
  };
}

export interface CTFEvent {
  id: string;
  title: string;
  tagline: string;
  status: "live" | "upcoming" | "ended";
  startTime: string;
  endTime: string;
  teamCount: number;
  registeredTeam?: {
    name: string;
    rank: number;
    points: number;
    solvedCount: number;
  };
  categories: ChallengeCategory[];
  challenges: CTFChallenge[];
  scoreboard: ScoreboardEntry[];
  firstBloods: FirstBlood[];
}

export interface CTFChallenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  points: number;
  solvedCount: number;
  isSolvedByTeam: boolean;
  firstBloodBy?: string;
  difficulty: ChallengeDifficulty;
  description: string;
  attachments?: { name: string; size: string; url: string }[];
  hint?: string;
  hintPenalty: number;
}

export interface ScoreboardEntry {
  rank: number;
  teamName: string;
  avatar: string;
  points: number;
  solvedCount: number;
  lastSolveTime: string;
  country: string;
  isCurrentUserTeam?: boolean;
}

export interface FirstBlood {
  id: string;
  challengeTitle: string;
  category: ChallengeCategory;
  teamName: string;
  timestamp: string;
  points: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  country: string;
  level: number;
  levelTitle: string;
  currentXp: number;
  nextLevelXp: number;
  globalRank: number;
  totalUsers: number;
  streakDays: number;
  joinedDate: string;
  skills: SkillStat[];
  badgesCount: number;
  certificatesCount: number;
  completedModulesCount: number;
  completedRoomsCount: number;
  completedChallengesCount: number;
}

export interface Badge {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent?: number;
  requirement: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
}

export interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  issueDate: string;
  credentialId: string;
  verificationUrl: string;
  grade: string;
  skillsVerified: string[];
  issuer: string;
}

export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AdminLabSession {
  id: string;
  userId: string;
  username: string;
  roomOrChallengeTitle: string;
  runtime: "docker" | "virtualbox";
  containerId: string;
  targetIp: string;
  attackIp: string;
  status: "running" | "starting" | "stopping" | "errored";
  uptimeSeconds: number;
  cpuPercent: number;
  memoryMb: number;
  startedAt: string;
}

export interface ChallengeDraft {
  title: string;
  slug: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  type: "quick" | "recommended" | "hard";
  description: string;
  scenario: string;
  estimatedMinutes: number;
  baseXp: number;
  image: string;
  imageUrl?: string;
  imageFileName?: string;
  containerImage: string;
  cpuCores: number;
  ramMb: number;
  targetPorts: string;
  roadmapStage?: "foundation" | "offensive" | "defensive" | "specialized" | "governance";
  moduleId?: string;
  tasks: Array<{
    title: string;
    description: string;
    htmlContent?: string;
    flag: string;
    hint: string;
    xp: number;
    imageAttachment?: {
      name: string;
      url: string;
      size: string;
    };
  }>;
  visibility: "draft" | "published" | "scheduled";
  isPremium: boolean;
  version: string;
}

export interface ChallengeTemplate {
  id: string;
  name: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  runtime: "docker" | "virtualbox";
  containerImage: string;
  targetPorts: string;
  description: string;
  sampleTask: {
    title: string;
    description: string;
    htmlContent: string;
    flag: string;
    hint: string;
    xp: number;
  };
}

export interface LearningPathDraft {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: "Red Team" | "Blue Team" | "Cloud" | "Web" | "General";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  prerequisites: string[];
  careerRoles: string[];
  description: string;
  stagesCount: number;
  modules: Array<{
    id: string;
    title: string;
    roomsCount: number;
    estimatedMinutes: number;
  }>;
}

export interface ModuleDraft {
  id: string;
  slug: string;
  title: string;
  category: "foundation" | "offensive" | "defensive" | "specialized" | "governance";
  iconName: string;
  description: string;
  stage: string;
  estimatedMinutes: number;
  roomsCount: number;
  orderNumber: number;
}
