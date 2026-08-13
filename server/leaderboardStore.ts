import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface LeaderboardRecord {
  id: string;
  userId?: string;
  displayName: string;
  username: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  score: number;
  duration: number;
  category: string;
  timestamp: string; // ISO Date String
  badge: string;
  verified: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const LEADERBOARD_FILE = path.join(DATA_DIR, "leaderboard.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let records: LeaderboardRecord[] = [];

// Seed high-quality verified default entries if database is empty
function getSeedRecords(): LeaderboardRecord[] {
  const now = new Date();
  
  const daysAgo = (days: number, hoursOffset = 0) => {
    const d = new Date(now.getTime() - days * 24 * 60 * 60 * 1000 - hoursOffset * 60 * 60 * 1000);
    return d.toISOString();
  };

  const seedData = [
    { name: "ApexTyper_99", wpm: 148, acc: 99.6, dur: 30, cat: "words", date: daysAgo(0, 1), badge: "Grandmaster" },
    { name: "QuantumSwift", wpm: 141, acc: 99.1, dur: 60, cat: "standard", date: daysAgo(0, 3), badge: "Grandmaster" },
    { name: "CyberKeys_X", wpm: 135, acc: 98.8, dur: 30, cat: "words", date: daysAgo(0, 5), badge: "Master" },
    { name: "VelocityGirl", wpm: 128, acc: 99.4, dur: 15, cat: "words", date: daysAgo(1, 2), badge: "Master" },
    { name: "HyperStrokes", wpm: 124, acc: 98.2, dur: 60, cat: "quotes", date: daysAgo(1, 6), badge: "Master" },
    { name: "KeyboardNinja", wpm: 119, acc: 98.9, dur: 30, cat: "words", date: daysAgo(2, 4), badge: "Diamond" },
    { name: "SmoothFingerz", wpm: 114, acc: 97.8, dur: 30, cat: "words", date: daysAgo(3, 1), badge: "Diamond" },
    { name: "CodeRunner_404", wpm: 108, acc: 98.5, dur: 60, cat: "standard", date: daysAgo(4, 8), badge: "Diamond" },
    { name: "NeonSprint", wpm: 102, acc: 96.9, dur: 15, cat: "words", date: daysAgo(5, 3), badge: "Diamond" },
    { name: "MatrixTypist", wpm: 98, acc: 99.0, dur: 30, cat: "words", date: daysAgo(6, 2), badge: "Platinum" },
    { name: "BlazingKeys", wpm: 94, acc: 97.4, dur: 60, cat: "standard", date: daysAgo(8, 5), badge: "Platinum" },
    { name: "SonicShift", wpm: 91, acc: 98.1, dur: 30, cat: "words", date: daysAgo(12, 4), badge: "Platinum" },
    { name: "TactileGenius", wpm: 87, acc: 99.2, dur: 60, cat: "quotes", date: daysAgo(15, 2), badge: "Platinum" },
    { name: "PrecisionPanda", wpm: 82, acc: 99.8, dur: 30, cat: "words", date: daysAgo(18, 9), badge: "Platinum" },
    { name: "QuickSilver_88", wpm: 78, acc: 96.5, dur: 30, cat: "words", date: daysAgo(22, 1), badge: "Gold" },
    { name: "ChronoTyper", wpm: 73, acc: 97.9, dur: 60, cat: "standard", date: daysAgo(25, 3), badge: "Gold" },
    { name: "EchoKeys", wpm: 68, acc: 95.8, dur: 30, cat: "words", date: daysAgo(28, 7), badge: "Gold" },
    { name: "ZenTyping", wpm: 64, acc: 99.0, dur: 60, cat: "quotes", date: daysAgo(35, 4), badge: "Gold" },
    { name: "PixelPusher", wpm: 58, acc: 96.2, dur: 30, cat: "words", date: daysAgo(42, 6), badge: "Silver" },
  ];

  return seedData.map((item, idx) => {
    const score = calculateScore(item.wpm, item.acc, item.dur);
    return {
      id: "ldr_" + (1000 + idx),
      userId: "sys_" + idx,
      displayName: item.name,
      username: item.name.toLowerCase(),
      wpm: item.wpm,
      rawWpm: item.wpm + Math.floor(Math.random() * 8 + 2),
      accuracy: item.acc,
      score,
      duration: item.dur,
      category: item.cat,
      timestamp: item.date,
      badge: item.badge,
      verified: true,
    };
  });
}

// Load from disk or initialize
try {
  if (fs.existsSync(LEADERBOARD_FILE)) {
    const raw = fs.readFileSync(LEADERBOARD_FILE, "utf-8");
    records = JSON.parse(raw);
  } else {
    records = getSeedRecords();
    saveRecords();
  }
} catch (e) {
  console.error("Error loading leaderboard database:", e);
  records = getSeedRecords();
}

function saveRecords() {
  try {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(records, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save leaderboard database:", e);
  }
}

// Badge calculation
export function calculateTierBadge(wpm: number): string {
  if (wpm >= 140) return "Grandmaster";
  if (wpm >= 120) return "Master";
  if (wpm >= 100) return "Diamond";
  if (wpm >= 80) return "Platinum";
  if (wpm >= 60) return "Gold";
  if (wpm >= 40) return "Silver";
  return "Bronze";
}

// Score calculation formula
export function calculateScore(wpm: number, accuracy: number, duration: number): number {
  const durationMult = duration >= 60 ? 1.2 : duration >= 30 ? 1.0 : 0.85;
  const rawScore = Math.round(wpm * (accuracy / 100) * 10 * durationMult);
  return Math.max(1, rawScore);
}

// Security Validation
export interface TestSubmissionInput {
  wpm: number;
  rawWpm?: number;
  accuracy: number;
  cpm?: number;
  totalChars?: number;
  correctChars?: number;
  errorCount?: number;
  duration: number;
  category?: string;
  displayName?: string;
  username?: string;
  userId?: string;
}

export function validateAndSanitizeSubmission(
  input: TestSubmissionInput
): { isValid: boolean; error?: string; record?: Omit<LeaderboardRecord, "id"> } {
  const duration = Number(input.duration) || 30;
  const wpm = Number(input.wpm) || 0;
  const rawWpm = Number(input.rawWpm) || wpm;
  const accuracy = Number(input.accuracy) || 0;
  const totalChars = Number(input.totalChars) || 0;
  const correctChars = Number(input.correctChars) || 0;

  // 1. Duration check
  if (duration < 5 || duration > 600) {
    return { isValid: false, error: "Invalid test duration (must be between 5s and 600s)." };
  }

  // 2. Reject impossible WPM (> 250 WPM)
  if (wpm < 0 || wpm > 250) {
    return { isValid: false, error: "Submission rejected: Speed exceeds maximum humanly possible limit (Max 250 WPM)." };
  }

  // 3. Accuracy bounds check
  if (accuracy < 0 || accuracy > 100) {
    return { isValid: false, error: "Submission rejected: Accuracy must be between 0% and 100%." };
  }

  // 4. Mathematical verification of keystroke counts if provided
  if (totalChars > 0 && correctChars >= 0) {
    if (correctChars > totalChars) {
      return { isValid: false, error: "Submission rejected: Correct characters cannot exceed total characters." };
    }

    const expectedAcc = Math.round((correctChars / totalChars) * 100);
    if (Math.abs(accuracy - expectedAcc) > 3) {
      return { isValid: false, error: "Submission rejected: Submitted accuracy does not match keystroke logs." };
    }

    // Expected Max WPM = (correctChars / 5) / (duration / 60)
    const expectedWpm = Math.round((correctChars / 5) / (duration / 60));
    if (wpm > expectedWpm + 5 && expectedWpm > 0) {
      return {
        isValid: false,
        error: `Submission rejected: Submitted WPM (${wpm}) exceeds calculated speed limit (${expectedWpm} WPM) for typing data.`
      };
    }
  }

  // Clean public display name (strictly remove HTML/script tags and restrict length)
  let cleanName = (input.displayName || input.username || "Speed Typist").trim();
  cleanName = cleanName.replace(/<[^>]*>?/gm, "").substring(0, 24);
  if (!cleanName) cleanName = "Speed Typist";

  let cleanUsername = (input.username || "user").trim().replace(/<[^>]*>?/gm, "").substring(0, 24);

  const score = calculateScore(wpm, accuracy, duration);
  const badge = calculateTierBadge(wpm);

  return {
    isValid: true,
    record: {
      userId: input.userId,
      displayName: cleanName,
      username: cleanUsername,
      wpm,
      rawWpm,
      accuracy,
      score,
      duration,
      category: String(input.category || "words"),
      timestamp: new Date().toISOString(),
      badge,
      verified: true,
    },
  };
}

// Record submission with anti-duplication
export function addLeaderboardRecord(submission: Omit<LeaderboardRecord, "id">): LeaderboardRecord {
  const now = new Date(submission.timestamp);

  // Check for duplicate submission (same user or display name within 3 seconds with identical WPM)
  const isDuplicate = records.some((r) => {
    if (r.displayName === submission.displayName && r.wpm === submission.wpm && r.score === submission.score) {
      const existingTime = new Date(r.timestamp).getTime();
      if (Math.abs(now.getTime() - existingTime) < 3000) {
        return true;
      }
    }
    return false;
  });

  if (isDuplicate) {
    const existing = records.find(
      (r) => r.displayName === submission.displayName && r.wpm === submission.wpm
    );
    if (existing) return existing;
  }

  const newRecord: LeaderboardRecord = {
    ...submission,
    id: "ldr_" + crypto.randomBytes(6).toString("hex"),
  };

  records.unshift(newRecord);
  saveRecords();

  return newRecord;
}

// Sync user display name across existing leaderboard records
export function updateUserDisplayNameInLeaderboard(userId: string, newDisplayName: string) {
  let updated = false;
  records.forEach((r) => {
    if (r.userId === userId) {
      r.displayName = newDisplayName.trim().substring(0, 24);
      updated = true;
    }
  });

  if (updated) {
    saveRecords();
  }
}

export type TimePeriod = "today" | "week" | "month" | "alltime";

export interface LeaderboardQueryOptions {
  period?: TimePeriod;
  page?: number;
  limit?: number;
  duration?: number;
  category?: string;
  search?: string;
}

export interface LeaderboardQueryResult {
  entries: (LeaderboardRecord & { rank: number })[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statsSummary: {
    totalSubmissions: number;
    topWpm: number;
    avgWpm: number;
    avgAccuracy: number;
  };
}

export function queryLeaderboard(options: LeaderboardQueryOptions = {}): LeaderboardQueryResult {
  const period = options.period || "alltime";
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(100, Math.max(5, Number(options.limit) || 15));
  const durationFilter = options.duration ? Number(options.duration) : null;
  const categoryFilter = options.category ? options.category.toLowerCase() : null;
  const searchFilter = options.search ? options.search.trim().toLowerCase() : null;

  const now = new Date();
  let minDate: Date | null = null;

  if (period === "today") {
    // Start of current day UTC
    minDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  } else if (period === "week") {
    // 7 days ago
    minDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "month") {
    // 30 days ago
    minDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Filter records
  let filtered = records.filter((r) => {
    // Period filter
    if (minDate) {
      const recDate = new Date(r.timestamp);
      if (recDate < minDate) return false;
    }

    // Duration filter
    if (durationFilter && r.duration !== durationFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter && categoryFilter !== "all" && r.category.toLowerCase() !== categoryFilter) {
      return false;
    }

    // Search filter
    if (searchFilter && !r.displayName.toLowerCase().includes(searchFilter) && !r.username.toLowerCase().includes(searchFilter)) {
      return false;
    }

    return true;
  });

  // Sort by score descending, then wpm descending, then accuracy descending, then timestamp ascending
  filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  // Calculate summary stats for this period
  const totalSubmissions = filtered.length;
  const topWpm = totalSubmissions > 0 ? Math.max(...filtered.map((r) => r.wpm)) : 0;
  const avgWpm = totalSubmissions > 0 ? Math.round(filtered.reduce((acc, r) => acc + r.wpm, 0) / totalSubmissions) : 0;
  const avgAccuracy = totalSubmissions > 0 ? Math.round(filtered.reduce((acc, r) => acc + r.accuracy, 0) / totalSubmissions) : 0;

  // Pagination calculation
  const totalPages = Math.ceil(totalSubmissions / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedRecords = filtered.slice(startIndex, startIndex + limit);

  // Attach 1-indexed overall rank
  const entriesWithRank = paginatedRecords.map((rec, idx) => ({
    ...rec,
    rank: startIndex + idx + 1,
  }));

  // Sanitize out any sensitive information (privacy rule: NEVER expose email or user secrets)
  const sanitizedEntries = entriesWithRank.map((e) => ({
    id: e.id,
    rank: e.rank,
    displayName: e.displayName,
    username: e.username,
    wpm: e.wpm,
    rawWpm: e.rawWpm,
    accuracy: e.accuracy,
    score: e.score,
    duration: e.duration,
    category: e.category,
    timestamp: e.timestamp,
    badge: e.badge,
    verified: e.verified,
  }));

  return {
    entries: sanitizedEntries,
    pagination: {
      total: totalSubmissions,
      page,
      limit,
      totalPages,
    },
    statsSummary: {
      totalSubmissions,
      topWpm,
      avgWpm,
      avgAccuracy,
    },
  };
}
