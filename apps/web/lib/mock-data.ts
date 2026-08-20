import type { ActivityDay, AdminLabSession, Badge, Certificate, ChallengeDraft, CTFEvent, SecuritySession, UserProfile } from "@hackers-campus/shared-types";

// This file intentionally contains empty defaults only. Platform content is created through Admin.
export const CTF_EVENT = null as unknown as CTFEvent;

export const USER_PROFILE: UserProfile = {
  id: "", displayName: "", username: "", email: "", avatar: "", bio: "", country: "",
  level: 1, levelTitle: "", currentXp: 0, nextLevelXp: 100, globalRank: 0, totalUsers: 0,
  streakDays: 0, joinedDate: "", skills: [], badgesCount: 0, certificatesCount: 0,
  completedModulesCount: 0, completedRoomsCount: 0, completedChallengesCount: 0,
};

export const BADGES: Badge[] = [];
export const CERTIFICATES: Certificate[] = [];
export const SECURITY_SESSIONS: SecuritySession[] = [];
export const ADMIN_LAB_SESSIONS: AdminLabSession[] = [];

export const INITIAL_CHALLENGE_DRAFT: ChallengeDraft = {
  title: "", slug: "", category: "Web Security", difficulty: "Easy", type: "recommended",
  description: "", scenario: "", estimatedMinutes: 30, baseXp: 100, image: "", containerImage: "",
  cpuCores: 1, ramMb: 512, targetPorts: "80", roadmapStage: "foundation", tasks: [],
  visibility: "published", isPremium: false, version: "1.0.0",
};

export function generateActivityData(): ActivityDay[] {
  return [];
}
