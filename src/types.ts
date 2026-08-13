export type TabType =
  | "test"
  | "games"
  | "practice"
  | "lessons"
  | "daily"
  | "leaderboard"
  | "certificates"
  | "kids"
  | "teachers"
  | "aicoach"
  | "blog"
  | "pricing";

export type TestDuration = 15 | 30 | 60 | 120;
export type TestCategory = "words" | "quotes" | "code" | "numbers" | "custom";

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  cpm: number;
  totalChars: number;
  correctChars: number;
  errorCount: number;
  timeElapsed: number;
  duration: number;
  timestamp: string;
  errorKeys: Record<string, number>;
  wpmHistory: number[]; // WPM values at each second
}

export interface SoundProfile {
  id: "mechanical" | "soft" | "typewriter" | "retro" | "muted";
  name: string;
}

export interface KeyboardKey {
  key: string;
  label: string;
  finger: "left-pinky" | "left-ring" | "left-middle" | "left-index" | "thumb" | "right-index" | "right-middle" | "right-ring" | "right-pinky";
  hand: "left" | "right";
  row: number;
}

export interface Lesson {
  id: string;
  title: string;
  unit: string;
  level: number;
  targetKeys: string[];
  content: string;
  minAccuracy: number;
  targetWpm: number;
  completed: boolean;
  stars: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  testMode: string;
  date: string;
  badge: "Master" | "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze";
}

export interface CertificateData {
  id: string;
  studentName: string;
  wpm: number;
  accuracy: number;
  date: string;
  testCategory: string;
  verificationCode: string;
  tier: "Gold Certified" | "Platinum Certified" | "Master Certified";
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avgWpm: number;
  avgAccuracy: number;
  lessonsCompleted: number;
  lastActive: string;
  status: "Exceeding Target" | "On Track" | "Needs Practice";
}

export interface AICoachReport {
  coachName: string;
  summary: string;
  keyWeaknesses: string[];
  suggestedFocus: string;
  customDrillText: string;
  speedImprovementTips: string[];
}
