import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface UserTestResult {
  id: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  cpm: number;
  totalChars: number;
  correctChars: number;
  errorCount: number;
  duration: number;
  category: string;
  timestamp: string;
}

export interface UserGameScore {
  gameId: string;
  gameName: string;
  score: number;
  wpm: number;
  accuracy: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  displayName?: string;
  bio?: string;
  keyboardLayout?: string;
  soundPreference?: string;
  
  // Progress stats
  personalBestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  testsCompleted: number;
  currentStreak: number;
  lastTestDate: string | null;
  xp: number;

  testHistory: UserTestResult[];
  gameScores: UserGameScore[];
  achievements: Achievement[];
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName?: string;
  createdAt: string;
  personalBestWpm: number;
  averageWpm: number;
  testsCompleted: number;
  currentStreak: number;
  achievementsCount: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory data structures synced with disk
let users: Record<string, UserAccount> = {};
let sessions: Record<string, string> = {}; // token -> userId

// Load initial data
try {
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    users = JSON.parse(raw);
  }
} catch (e) {
  console.error("Error loading users database:", e);
  users = {};
}

try {
  if (fs.existsSync(SESSIONS_FILE)) {
    const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
    sessions = JSON.parse(raw);
  }
} catch (e) {
  console.error("Error loading sessions database:", e);
  sessions = {};
}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save users database:", e);
  }
}

function saveSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save sessions database:", e);
  }
}

// Password hashing using PBKDF2
export function hashPassword(password: string, salt?: string) {
  const selectedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, selectedSalt, 10000, 64, "sha512")
    .toString("hex");
  return { hash, salt: selectedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const computed = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return computed === hash;
}

// Generate token
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Initial achievements template
export function getDefaultAchievements(): Achievement[] {
  return [
    {
      id: "first_test",
      title: "First Blast",
      description: "Complete your first typing speed test",
      icon: "⚡",
      unlockedAt: null,
    },
    {
      id: "speed_50",
      title: "Speedster (50 WPM)",
      description: "Reach 50+ WPM on a completed test",
      icon: "🚀",
      unlockedAt: null,
    },
    {
      id: "speed_70",
      title: "Velocity Master (70 WPM)",
      description: "Break the 70 WPM barrier",
      icon: "🏎️",
      unlockedAt: null,
    },
    {
      id: "speed_100",
      title: "Century Typist (100 WPM)",
      description: "Achieve triple-digit 100+ WPM speed",
      icon: "👑",
      unlockedAt: null,
    },
    {
      id: "sniper",
      title: "Precision Sniper (99%+)",
      description: "Complete a test with 99%+ accuracy",
      icon: "🎯",
      unlockedAt: null,
    },
    {
      id: "marathon_10",
      title: "Test Marathon (10 Tests)",
      description: "Complete 10 total typing tests",
      icon: "🏆",
      unlockedAt: null,
    },
    {
      id: "streak_3",
      title: "Streak Committer (3 Days)",
      description: "Maintain a 3-day typing streak",
      icon: "🔥",
      unlockedAt: null,
    },
  ];
}

// User methods
export function createUser(username: string, email: string, password: string): { user: UserAccount; token: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  // Check if exists
  const existingUser = Object.values(users).find(
    (u) => u.email.toLowerCase() === normalizedEmail || u.username.toLowerCase() === normalizedUsername
  );
  if (existingUser) {
    if (existingUser.email.toLowerCase() === normalizedEmail) {
      throw new Error("An account with this email address already exists.");
    }
    throw new Error("This username is already taken.");
  }

  const { hash, salt } = hashPassword(password);
  const userId = "usr_" + crypto.randomBytes(8).toString("hex");
  const now = new Date().toISOString();

  const newUser: UserAccount = {
    id: userId,
    username: username.trim(),
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    createdAt: now,
    displayName: username.trim(),
    bio: "TypeBlast enthusiast mastering speed touch typing.",
    keyboardLayout: "QWERTY",
    soundPreference: "mechanical",

    personalBestWpm: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    testsCompleted: 0,
    currentStreak: 1,
    lastTestDate: null,
    xp: 100,

    testHistory: [],
    gameScores: [],
    achievements: getDefaultAchievements(),
  };

  users[userId] = newUser;
  saveUsers();

  const token = generateToken();
  sessions[token] = userId;
  saveSessions();

  return { user: sanitizeUser(newUser), token };
}

export function loginUser(emailOrUsername: string, password: string): { user: UserAccount; token: string } {
  const query = emailOrUsername.trim().toLowerCase();
  const foundUser = Object.values(users).find(
    (u) => u.email.toLowerCase() === query || u.username.toLowerCase() === query
  );

  if (!foundUser) {
    throw new Error("Invalid username/email or password.");
  }

  const isValid = verifyPassword(password, foundUser.passwordHash, foundUser.salt);
  if (!isValid) {
    throw new Error("Invalid username/email or password.");
  }

  const token = generateToken();
  sessions[token] = foundUser.id;
  saveSessions();

  return { user: sanitizeUser(foundUser), token };
}

export function getUserByToken(token: string): UserAccount | null {
  const userId = sessions[token];
  if (!userId || !users[userId]) return null;
  return sanitizeUser(users[userId]);
}

export function logoutToken(token: string) {
  delete sessions[token];
  saveSessions();
}

export function sanitizeUser(user: UserAccount): UserAccount {
  const clone = { ...user };
  delete (clone as any).passwordHash;
  delete (clone as any).salt;
  return clone;
}

export function getPublicProfile(userId: string): PublicProfile | null {
  const user = users[userId];
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    createdAt: user.createdAt,
    personalBestWpm: user.personalBestWpm,
    averageWpm: user.averageWpm,
    testsCompleted: user.testsCompleted,
    currentStreak: user.currentStreak,
    achievementsCount: user.achievements.filter((a) => a.unlockedAt !== null).length,
  };
}

export function addTestResultToUser(token: string, testResult: Omit<UserTestResult, "id" | "timestamp">) {
  const userId = sessions[token];
  if (!userId || !users[userId]) {
    throw new Error("Unauthorized");
  }

  const user = users[userId];
  const now = new Date();
  const nowIso = now.toISOString();

  const resultEntry: UserTestResult = {
    ...testResult,
    id: "tst_" + crypto.randomBytes(6).toString("hex"),
    timestamp: nowIso,
  };

  // Append to history (immutable - users cannot edit or delete history)
  user.testHistory.unshift(resultEntry);

  // Recalculate stats
  const totalTests = user.testHistory.length;
  user.testsCompleted = totalTests;
  user.personalBestWpm = Math.max(user.personalBestWpm, testResult.wpm);

  const totalWpmSum = user.testHistory.reduce((acc, t) => acc + t.wpm, 0);
  user.averageWpm = Math.round(totalWpmSum / totalTests);

  const totalAccSum = user.testHistory.reduce((acc, t) => acc + t.accuracy, 0);
  user.averageAccuracy = Math.round(totalAccSum / totalTests);

  // Update streak
  const todayStr = now.toISOString().split("T")[0];
  if (user.lastTestDate) {
    const lastDateStr = user.lastTestDate.split("T")[0];
    if (lastDateStr !== todayStr) {
      const lastDate = new Date(user.lastTestDate);
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.currentStreak += 1;
      } else if (diffDays > 1) {
        user.currentStreak = 1;
      }
    }
  } else {
    user.currentStreak = 1;
  }
  user.lastTestDate = nowIso;
  user.xp += Math.round(testResult.wpm * 2);

  // Check achievement unlocks
  checkAchievements(user, resultEntry);

  saveUsers();
  return sanitizeUser(user);
}

function checkAchievements(user: UserAccount, latestTest: UserTestResult) {
  const nowIso = new Date().toISOString();

  user.achievements.forEach((ach) => {
    if (ach.unlockedAt) return; // already unlocked

    if (ach.id === "first_test" && user.testsCompleted >= 1) {
      ach.unlockedAt = nowIso;
    } else if (ach.id === "speed_50" && latestTest.wpm >= 50) {
      ach.unlockedAt = nowIso;
    } else if (ach.id === "speed_70" && latestTest.wpm >= 70) {
      ach.unlockedAt = nowIso;
    } else if (ach.id === "speed_100" && latestTest.wpm >= 100) {
      ach.unlockedAt = nowIso;
    } else if (ach.id === "sniper" && latestTest.accuracy >= 99) {
      ach.unlockedAt = nowIso;
    } else if (ach.id === "marathon_10" && user.testsCompleted >= 10) {
      ach.unlockedAt = nowIso;
    } else if (ach.id === "streak_3" && user.currentStreak >= 3) {
      ach.unlockedAt = nowIso;
    }
  });
}

export function addGameScoreToUser(token: string, scoreData: Omit<UserGameScore, "timestamp">) {
  const userId = sessions[token];
  if (!userId || !users[userId]) {
    throw new Error("Unauthorized");
  }

  const user = users[userId];
  const nowIso = new Date().toISOString();

  const gameEntry: UserGameScore = {
    ...scoreData,
    timestamp: nowIso,
  };

  user.gameScores.unshift(gameEntry);
  user.xp += Math.round(scoreData.score / 10);

  saveUsers();
  return sanitizeUser(user);
}

export function updateUserProfile(
  token: string,
  profileData: { displayName?: string; bio?: string; keyboardLayout?: string; soundPreference?: string }
) {
  const userId = sessions[token];
  if (!userId || !users[userId]) {
    throw new Error("Unauthorized");
  }

  const user = users[userId];
  if (profileData.displayName !== undefined) user.displayName = profileData.displayName.trim();
  if (profileData.bio !== undefined) user.bio = profileData.bio.trim();
  if (profileData.keyboardLayout !== undefined) user.keyboardLayout = profileData.keyboardLayout;
  if (profileData.soundPreference !== undefined) user.soundPreference = profileData.soundPreference;

  saveUsers();
  return sanitizeUser(user);
}
