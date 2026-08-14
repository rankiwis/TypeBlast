import fs from "fs";
import path from "path";
import crypto from "crypto";
import { validateAndSanitizeSubmission, addLeaderboardRecord } from "./leaderboardStore";

export interface DailyChallengeDef {
  dateKey: string; // e.g. "2026-08-13"
  formattedDate: string; // e.g. "August 13, 2026"
  title: string;
  prompt: string;
  duration: number; // Duration in seconds (e.g. 60)
  targetWpm: number;
  rewardXp: number;
  badge: string;
  category: string;
}

export interface DailySubmissionRecord {
  id: string;
  dateKey: string;
  userId?: string;
  username: string;
  displayName: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  score: number;
  duration: number;
  timestamp: string; // ISO date
  badge: string;
  verified: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DAILY_SUBMISSIONS_FILE = path.join(DATA_DIR, "daily_submissions.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let submissions: DailySubmissionRecord[] = [];

// Load existing submissions from file
function loadSubmissions() {
  try {
    if (fs.existsSync(DAILY_SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(DAILY_SUBMISSIONS_FILE, "utf-8");
      submissions = JSON.parse(data);
    } else {
      submissions = [];
      saveSubmissions();
    }
  } catch (err) {
    console.error("Error reading daily_submissions.json:", err);
    submissions = [];
  }
}

function saveSubmissions() {
  try {
    fs.writeFileSync(DAILY_SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing daily_submissions.json:", err);
  }
}

loadSubmissions();

// Master list of curated challenge prompts for daily rotation
const MASTER_CHALLENGE_POOL = [
  {
    title: "Quantum Speed Sprint",
    prompt: "The swift momentum of technological evolution demands unwavering precision, relentless focus, and flawless finger dexterity across all row transitions.",
    targetWpm: 75,
    rewardXp: 500,
    badge: "Quantum Striker 🔥"
  },
  {
    title: "Syntax & Logic Mastery",
    prompt: "Simplicity is prerequisite for reliability. Software engineering is the art of crafting clarity out of complexity through clean, self-documenting logic.",
    targetWpm: 70,
    rewardXp: 450,
    badge: "Syntax Samurai ⚔️"
  },
  {
    title: "Silicon Valley Sprint",
    prompt: "In the fast-paced landscape of modern software engineering, rapid typing speed combined with zero error tolerance empowers developers to transform ideas into production code.",
    targetWpm: 80,
    rewardXp: 550,
    badge: "Silicon Titan 🚀"
  },
  {
    title: "Cybernetic Rhythm",
    prompt: "A steady typing cadence eliminates cognitive friction, allowing your thoughts to flow directly onto the digital canvas with effortless precision and speed.",
    targetWpm: 68,
    rewardXp: 400,
    badge: "Cyber Pulse ⚡"
  },
  {
    title: "Architect's Blueprint",
    prompt: "System design requires deep foresight. When building distributed architectures, clear communication and quick documentation form the bedrock of resilient systems.",
    targetWpm: 72,
    rewardXp: 480,
    badge: "Architect Prime 🏛️"
  },
  {
    title: "Punctuation Precision",
    prompt: "Is code clarity paramount? Absolutely! (If x >= 100 && y <= 50) { return true; } else { console.log('Keep grinding!'); } -- Always test edge cases.",
    targetWpm: 65,
    rewardXp: 500,
    badge: "Precision Master 🎯"
  },
  {
    title: "The Velocity Protocol",
    prompt: "Touch typing mastery is not merely about raw speed; it is about muscle memory, ergonomy, and achieving a continuous state of flow under pressure.",
    targetWpm: 85,
    rewardXp: 600,
    badge: "Velocity Legend 🏆"
  },
  {
    title: "Algorithm Acceleration",
    prompt: "Optimization is the key to high-performance computing. Reduce time complexity from quadratic to logarithmic and watch your execution speed soar.",
    targetWpm: 78,
    rewardXp: 520,
    badge: "Algo Wizard 🧙‍♂️"
  },
  {
    title: "The Daily Grand Prix",
    prompt: "Every single keystroke brings you closer to victory. Stay relaxed, breathe steadily, and maintain a high accuracy threshold on every sentence.",
    targetWpm: 74,
    rewardXp: 470,
    badge: "Grand Prix Champion 🏎️"
  },
  {
    title: "Deep Focus Flow",
    prompt: "Clarity of mind leads to speed of execution. Eliminate distractions, adjust your posture, and let your fingers move fluidly across the mechanical switches.",
    targetWpm: 70,
    rewardXp: 450,
    badge: "Flow State Zen 🧘"
  }
];

// Helper to format ISO date string "YYYY-MM-DD" into readable Date "Month Day, Year"
export function formatReadableDate(dateKey: string): string {
  try {
    const parts = dateKey.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(Date.UTC(year, month, day));
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
      });
    }
  } catch (e) {
    // fallback
  }
  return dateKey;
}

// Deterministically generate the official daily challenge definition for any date string "YYYY-MM-DD"
export function getDailyChallenge(dateKey?: string): DailyChallengeDef {
  const todayKey = new Date().toISOString().split("T")[0];
  const targetKey = dateKey || todayKey;

  // Simple hash of dateKey to pick deterministic prompt
  let hash = 0;
  for (let i = 0; i < targetKey.length; i++) {
    hash = (hash << 5) - hash + targetKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % MASTER_CHALLENGE_POOL.length;
  const t = MASTER_CHALLENGE_POOL[index];

  return {
    dateKey: targetKey,
    formattedDate: formatReadableDate(targetKey),
    title: t.title,
    prompt: t.prompt,
    duration: 60, // Fixed 60s sprint duration
    targetWpm: t.targetWpm,
    rewardXp: t.rewardXp,
    badge: t.badge,
    category: "daily_challenge",
  };
}

// Generate high quality seed rankings for today's or past daily challenge if submissions are sparse
function getSeedSubmissionsForDate(dateKey: string): DailySubmissionRecord[] {
  const challenge = getDailyChallenge(dateKey);
  const seeds = [
    { name: "Apex_Daily_99", wpm: challenge.targetWpm + 38, acc: 99.6 },
    { name: "Quantum_Striker", wpm: challenge.targetWpm + 28, acc: 99.2 },
    { name: "CyberKeys_Pro", wpm: challenge.targetWpm + 22, acc: 98.8 },
    { name: "Velocity_Girl", wpm: challenge.targetWpm + 15, acc: 99.4 },
    { name: "Precision_Panda", wpm: challenge.targetWpm + 8, acc: 99.0 },
    { name: "TypeBlast_Racer", wpm: challenge.targetWpm + 2, acc: 97.5 },
  ];

  return seeds.map((s, idx) => ({
    id: `seed_${dateKey}_${idx}`,
    dateKey,
    displayName: s.name,
    username: s.name.toLowerCase(),
    wpm: s.wpm,
    rawWpm: s.wpm + 4,
    accuracy: s.acc,
    score: Math.round(s.wpm * (s.acc / 100) * 12),
    duration: challenge.duration,
    timestamp: `${dateKey}T${10 + idx}:30:00.000Z`,
    badge: challenge.badge,
    verified: true,
  }));
}

// Query leaderboard for a specific daily challenge date
export function getDailyChallengeLeaderboard(dateKey: string, page: number = 1, limit: number = 15) {
  loadSubmissions();

  // Filter submissions for this date
  const realEntries = submissions.filter((s) => s.dateKey === dateKey);

  // Combine real entries with seed entries for a rich leaderboard experience
  const seedEntries = getSeedSubmissionsForDate(dateKey);

  // Map to deduplicate by username (keeping highest score per user)
  const userBestMap = new Map<string, DailySubmissionRecord>();

  // Add real entries first (they take priority if user submitted)
  realEntries.forEach((entry) => {
    const key = (entry.username || entry.displayName).toLowerCase();
    const existing = userBestMap.get(key);
    if (!existing || entry.score > existing.score) {
      userBestMap.set(key, entry);
    }
  });

  // Add seed entries if user doesn't exist
  seedEntries.forEach((seed) => {
    const key = seed.username.toLowerCase();
    if (!userBestMap.has(key)) {
      userBestMap.set(key, seed);
    }
  });

  // Sort descending by score, then WPM, then accuracy
  const allSorted = Array.from(userBestMap.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    return b.accuracy - a.accuracy;
  });

  // Assign ranks
  const ranked = allSorted.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const total = ranked.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedEntries = ranked.slice(startIndex, startIndex + limit);

  return {
    dateKey,
    entries: paginatedEntries,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
    topWpm: allSorted.length > 0 ? allSorted[0].wpm : 0,
    totalParticipants: total,
  };
}

// User submission rate-limit cache (key: userId or username + dateKey -> timestamp)
const recentSubmissionsMap = new Map<string, number>();

// Submit daily challenge score with server validation & anti-abuse protection
export function submitDailyChallengeScore(data: {
  dateKey: string;
  wpm: number;
  rawWpm?: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  errorCount: number;
  duration: number;
  displayName: string;
  username: string;
  userId?: string;
}) {
  loadSubmissions();

  // Validate dateKey format (YYYY-MM-DD)
  if (!data.dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(data.dateKey)) {
    return {
      isValid: false,
      error: "Invalid date format for daily challenge. Must be YYYY-MM-DD.",
    };
  }

  // Prevent spoofing future dates beyond today UTC
  const todayKey = new Date().toISOString().split("T")[0];
  if (data.dateKey > todayKey) {
    return {
      isValid: false,
      error: "Cannot submit scores for future daily challenges.",
    };
  }

  const challenge = getDailyChallenge(data.dateKey);

  // Anti-abuse 1: Enforce cooldown between submissions per user
  const userKey = `${data.userId || data.username || "guest"}_${data.dateKey}`;
  const now = Date.now();
  const lastSubmit = recentSubmissionsMap.get(userKey);
  if (lastSubmit && now - lastSubmit < 10000) { // 10 seconds cooldown
    return {
      isValid: false,
      error: "Please wait 10 seconds before submitting another daily challenge attempt.",
    };
  }

  // Anti-abuse 2: Verify challenge duration matches
  if (Math.abs(data.duration - challenge.duration) > 5) {
    return {
      isValid: false,
      error: `Invalid challenge duration. Daily challenge requires ${challenge.duration}s.`,
    };
  }

  // Anti-abuse 3: Strictly validate typing metrics & score using server-side rules
  const validation = validateAndSanitizeSubmission({
    wpm: data.wpm,
    rawWpm: data.rawWpm || data.wpm,
    accuracy: data.accuracy,
    totalChars: data.totalChars,
    correctChars: data.correctChars,
    errorCount: data.errorCount,
    duration: challenge.duration,
    category: "daily_challenge",
    displayName: data.displayName,
    username: data.username,
    userId: data.userId,
  });

  if (!validation.isValid || !validation.record) {
    return {
      isValid: false,
      error: validation.error || "Daily challenge score failed server validation checks.",
    };
  }

  // Create official daily challenge submission
  const submissionRecord: DailySubmissionRecord = {
    id: `dc_${data.dateKey}_${crypto.randomBytes(6).toString("hex")}`,
    dateKey: data.dateKey,
    userId: data.userId,
    username: validation.record.username,
    displayName: validation.record.displayName,
    wpm: validation.record.wpm,
    rawWpm: validation.record.rawWpm,
    accuracy: validation.record.accuracy,
    score: validation.record.score,
    duration: challenge.duration,
    timestamp: new Date().toISOString(),
    badge: challenge.badge,
    verified: true,
  };

  // Add to submissions array
  submissions.push(submissionRecord);
  saveSubmissions();

  // Record submission timestamp in cooldown map
  recentSubmissionsMap.set(userKey, now);

  // Also publish to global verified leaderboard
  addLeaderboardRecord({
    ...validation.record,
    category: "daily_challenge",
  });

  // Calculate user's rank for today's challenge
  const leaderboard = getDailyChallengeLeaderboard(data.dateKey, 1, 100);
  const userRankEntry = leaderboard.entries.find(
    (e) => (e.username || e.displayName).toLowerCase() === data.username.toLowerCase()
  );

  return {
    isValid: true,
    record: submissionRecord,
    userRank: userRankEntry ? userRankEntry.rank : 1,
    totalParticipants: leaderboard.totalParticipants,
  };
}

// Scalable history query: get past N days of challenges
export function getDailyChallengeHistory(daysCount: number = 14) {
  const history = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = d.toISOString().split("T")[0];
    const challenge = getDailyChallenge(dateKey);

    // Get top record for date
    const lb = getDailyChallengeLeaderboard(dateKey, 1, 1);
    const topEntry = lb.entries.length > 0 ? lb.entries[0] : null;

    history.push({
      dateKey,
      formattedDate: challenge.formattedDate,
      title: challenge.title,
      targetWpm: challenge.targetWpm,
      rewardXp: challenge.rewardXp,
      badge: challenge.badge,
      topWpm: topEntry ? topEntry.wpm : challenge.targetWpm + 20,
      winner: topEntry ? topEntry.displayName : "ApexTyper_99",
      isToday: i === 0,
    });
  }

  return history;
}

// Get user's personal daily challenge stats & best result for date
export function getUserDailyChallengeResult(dateKey: string, usernameOrId: string) {
  loadSubmissions();
  const userSubmissions = submissions.filter(
    (s) =>
      s.dateKey === dateKey &&
      ((s.userId && s.userId === usernameOrId) ||
        s.username.toLowerCase() === usernameOrId.toLowerCase() ||
        s.displayName.toLowerCase() === usernameOrId.toLowerCase())
  );

  if (userSubmissions.length === 0) return null;

  // Return highest score
  return userSubmissions.reduce((best, curr) => (curr.score > best.score ? curr : best), userSubmissions[0]);
}
