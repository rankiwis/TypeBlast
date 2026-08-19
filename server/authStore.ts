import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sanitizeText } from "./leaderboardStore";

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

export interface SessionData {
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface PasswordResetToken {
  token: string;
  userId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const RESETS_FILE = path.join(DATA_DIR, "password_resets.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory data structures synced with disk
let users: Record<string, UserAccount> = {};
let sessions: Record<string, SessionData> = {}; // token -> SessionData
let passwordResets: Record<string, PasswordResetToken> = {}; // token -> PasswordResetToken

// Session TTL: 30 days in milliseconds
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
// Reset Token TTL: 1 hour in milliseconds
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

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
    const parsed = JSON.parse(raw);
    const now = Date.now();
    for (const [token, val] of Object.entries(parsed)) {
      if (typeof val === "string") {
        sessions[token] = {
          userId: val,
          createdAt: now,
          expiresAt: now + SESSION_TTL_MS,
        };
      } else if (val && typeof val === "object" && (val as any).userId) {
        sessions[token] = val as SessionData;
      }
    }
  }
} catch (e) {
  console.error("Error loading sessions database:", e);
  sessions = {};
}

try {
  if (fs.existsSync(RESETS_FILE)) {
    const raw = fs.readFileSync(RESETS_FILE, "utf-8");
    passwordResets = JSON.parse(raw);
  }
} catch (e) {
  console.error("Error loading password resets database:", e);
  passwordResets = {};
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

function savePasswordResets() {
  try {
    fs.writeFileSync(RESETS_FILE, JSON.stringify(passwordResets, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save password resets database:", e);
  }
}

// Password hashing using PBKDF2 with 100,000 iterations for defense against brute force
export function hashPassword(password: string, salt?: string) {
  const selectedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, selectedSalt, 100000, 64, "sha512")
    .toString("hex");
  return { hash, salt: selectedSalt };
}

// Timing-safe password verification to prevent timing attack vulnerabilities
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    // Check with 100,000 iterations
    const computed = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");
    
    const computedBuf = Buffer.from(computed, "hex");
    const hashBuf = Buffer.from(hash, "hex");

    if (computedBuf.length === hashBuf.length && crypto.timingSafeEqual(computedBuf, hashBuf)) {
      return true;
    }

    // Fallback for legacy 10,000 iteration hashes if present
    const legacyComputed = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    const legacyBuf = Buffer.from(legacyComputed, "hex");
    if (legacyBuf.length === hashBuf.length && crypto.timingSafeEqual(legacyBuf, hashBuf)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

// Generate secure token
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

// User registration with rigorous format validation & sanitization
export function createUser(username: string, email: string, password: string): { user: UserAccount; token: string } {
  if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid request payload.");
  }

  const rawUsername = username.trim();
  const rawEmail = email.trim().toLowerCase();

  // Username validation: 3-24 characters, alphanumeric + underscore + hyphen
  if (!/^[a-zA-Z0-9_-]{3,24}$/.test(rawUsername)) {
    throw new Error("Username must be between 3 and 24 characters and contain only letters, numbers, underscores, or hyphens.");
  }

  // Email format validation (RFC-compliant standard pattern)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(rawEmail) || rawEmail.length > 100) {
    throw new Error("Please provide a valid email address.");
  }

  // Password validation: 6-128 characters
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
  if (password.length > 128) {
    throw new Error("Password cannot exceed 128 characters.");
  }

  const normalizedEmail = rawEmail;
  const normalizedUsername = rawUsername.toLowerCase();

  // Check if account with email or username already exists
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
    username: rawUsername,
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    createdAt: now,
    displayName: rawUsername,
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
  const nowMs = Date.now();
  sessions[token] = {
    userId,
    createdAt: nowMs,
    expiresAt: nowMs + SESSION_TTL_MS,
  };
  saveSessions();

  return { user: sanitizeUser(newUser), token };
}

export function loginUser(emailOrUsername: string, password: string): { user: UserAccount; token: string } {
  if (typeof emailOrUsername !== "string" || typeof password !== "string") {
    throw new Error("Invalid credentials payload.");
  }

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
  const nowMs = Date.now();
  sessions[token] = {
    userId: foundUser.id,
    createdAt: nowMs,
    expiresAt: nowMs + SESSION_TTL_MS,
  };
  saveSessions();

  return { user: sanitizeUser(foundUser), token };
}

// Session resolution with expiration check and auto-pruning
export function getUserByToken(token: string): UserAccount | null {
  if (!token || typeof token !== "string") return null;

  const session = sessions[token];
  if (!session) return null;

  // Check session expiration
  const now = Date.now();
  if (session.expiresAt && session.expiresAt < now) {
    delete sessions[token];
    saveSessions();
    return null;
  }

  const userId = session.userId;
  if (!userId || !users[userId]) return null;
  return sanitizeUser(users[userId]);
}

export function logoutToken(token: string) {
  if (token && sessions[token]) {
    delete sessions[token];
    saveSessions();
  }
}

// Never expose password hash or salt
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
  const session = sessions[token];
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.userId;
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

  // Append to history
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
  user.xp += Math.min(500, Math.round(testResult.wpm * 2));

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
  const session = sessions[token];
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.userId;
  if (!userId || !users[userId]) {
    throw new Error("Unauthorized");
  }

  const user = users[userId];
  const nowIso = new Date().toISOString();

  // Validate game score bounds
  const clampedScore = Math.min(10000, Math.max(0, Number(scoreData.score) || 0));
  const clampedWpm = Math.min(230, Math.max(0, Number(scoreData.wpm) || 0));
  const clampedAcc = Math.min(100, Math.max(0, Number(scoreData.accuracy) || 0));
  const cleanGameId = sanitizeText(scoreData.gameId, 32);
  const cleanGameName = sanitizeText(scoreData.gameName, 48);

  const gameEntry: UserGameScore = {
    gameId: cleanGameId,
    gameName: cleanGameName,
    score: clampedScore,
    wpm: clampedWpm,
    accuracy: clampedAcc,
    timestamp: nowIso,
  };

  user.gameScores.unshift(gameEntry);
  user.xp += Math.min(1000, Math.round(clampedScore / 10));

  saveUsers();
  return sanitizeUser(user);
}

export function updateUserProfile(
  token: string,
  profileData: { displayName?: string; bio?: string; keyboardLayout?: string; soundPreference?: string }
) {
  const session = sessions[token];
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.userId;
  if (!userId || !users[userId]) {
    throw new Error("Unauthorized");
  }

  const user = users[userId];
  if (profileData.displayName !== undefined) {
    user.displayName = sanitizeText(profileData.displayName, 24) || user.username;
  }
  if (profileData.bio !== undefined) {
    user.bio = sanitizeText(profileData.bio, 200);
  }
  if (profileData.keyboardLayout !== undefined) {
    const validLayouts = ["QWERTY", "Dvorak", "Colemak", "AZERTY", "QWERTZ"];
    if (validLayouts.includes(profileData.keyboardLayout)) {
      user.keyboardLayout = profileData.keyboardLayout;
    }
  }
  if (profileData.soundPreference !== undefined) {
    const validSounds = ["mechanical", "typewriter", "bubble", "silent"];
    if (validSounds.includes(profileData.soundPreference)) {
      user.soundPreference = profileData.soundPreference;
    }
  }

  saveUsers();
  return sanitizeUser(user);
}

// Helper to send registration confirmation / welcome email
export async function sendWelcomeEmail(params: {
  toEmail: string;
  username: string;
  loginUrl: string;
}): Promise<boolean> {
  const { toEmail, username, loginUrl } = params;

  console.log(`\n==================================================`);
  console.log(`[WELCOME CONFIRMATION EMAIL DISPATCHED]`);
  console.log(`To: ${toEmail} (${username})`);
  console.log(`Login URL: ${loginUrl}`);
  console.log(`Subject: Welcome to TypeBlast – Your Account Is Ready`);
  console.log(`==================================================\n`);

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const port = Number(process.env.SMTP_PORT) || 587;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const fromAddress = process.env.SMTP_FROM || `"TypeBlast Support" <no-reply@typeblast.com>`;

      await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: "Welcome to TypeBlast – Your Account Is Ready",
        text: `Hi ${username},\n\nWelcome to TypeBlast! Your account has been successfully created.\n\nYou can now log in to track your typing speed progress, earn speed certificates, compete on global leaderboards, and access custom touch typing lessons.\n\nLog in to your account here: ${loginUrl}\n\nHappy typing,\nThe TypeBlast Team`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; background-color: #090d16; color: #f1f5f9; border-radius: 16px; border: 1px solid #1e293b;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 26px; font-weight: 900; color: #06b6d4; letter-spacing: -0.5px;">⚡ TYPEBLAST</span>
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 0; text-align: center;">Welcome to TypeBlast!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin-top: 16px;">
              Hi <strong>${username}</strong>,
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
              Your TypeBlast account has been successfully created. You're all set to elevate your typing speed, build muscle memory, and unlock achievements.
            </p>
            
            <div style="background-color: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <div style="font-size: 12px; font-weight: 700; color: #06b6d4; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">What you can do next:</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
                <li>⚡ Take WPM typing speed tests and save your personal records</li>
                <li>🎯 Practice speed drills, punctuation, and code snippets</li>
                <li>🏆 Compete on global leaderboards across timeframes</li>
                <li>📜 Earn verified official typing certificates</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${loginUrl}" style="display: inline-block; background-color: #06b6d4; color: #020617; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Log In to Your Account</a>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
              Or copy this link to log in: <a href="${loginUrl}" style="color: #06b6d4; word-break: break-all;">${loginUrl}</a>
            </p>

            <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
            <p style="font-size: 11px; color: #475569; text-align: center; margin-bottom: 0;">
              You received this confirmation email because a new account was registered on TypeBlast.
            </p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error("Failed to send welcome confirmation email via SMTP:", error);
      return false;
    }
  }

  return true;
}

// Helper to send password reset email via SMTP (if configured) or logged securely
export async function sendPasswordResetEmail(params: {
  toEmail: string;
  username: string;
  resetUrl: string;
}): Promise<boolean> {
  const { toEmail, username, resetUrl } = params;

  console.log(`\n==================================================`);
  console.log(`[PASSWORD RESET EMAIL DISPATCHED]`);
  console.log(`To: ${toEmail} (${username})`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log(`Token Validity: 1 hour (single-use)`);
  console.log(`==================================================\n`);

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const port = Number(process.env.SMTP_PORT) || 587;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const fromAddress = process.env.SMTP_FROM || `"TypeBlast Support" <no-reply@typeblast.com>`;

      await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: "Reset Your TypeBlast Password",
        text: `Hi ${username},\n\nWe received a request to reset your TypeBlast password. Click the link below to set a new password:\n\n${resetUrl}\n\nThis single-use link will expire in 1 hour. If you did not make this request, you can safely ignore this email.\n\nHappy typing,\nThe TypeBlast Team`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; background-color: #090d16; color: #f1f5f9; border-radius: 16px; border: 1px solid #1e293b;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 24px; font-weight: 900; color: #06b6d4; letter-spacing: -0.5px;">⚡ TYPEBLAST</span>
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 0;">Reset Your Password</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
              Hi <strong>${username}</strong>,<br/>
              We received a request to reset the password for your TypeBlast account. Click the button below to choose a new password:
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #06b6d4; color: #020617; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
              This link is secure, single-use, and expires in <strong>1 hour</strong>.<br/>
              If the button above does not work, copy and paste this URL into your browser:<br/>
              <a href="${resetUrl}" style="color: #06b6d4; word-break: break-all;">${resetUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
            <p style="font-size: 11px; color: #475569; text-align: center; margin-bottom: 0;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error("Failed to send SMTP email:", error);
      return false;
    }
  }

  return true;
}

// Request a password reset (creates single-use 1-hour token and dispatches email)
export async function createPasswordResetRequest(
  emailOrUsername: string,
  baseUrl: string
): Promise<{ success: boolean; previewResetUrl?: string; token?: string }> {
  if (!emailOrUsername || typeof emailOrUsername !== "string") {
    return { success: true };
  }

  const query = emailOrUsername.trim().toLowerCase();
  const user = Object.values(users).find(
    (u) => u.email.toLowerCase() === query || u.username.toLowerCase() === query
  );

  // If user does not exist, return generic success without leaking existence
  if (!user) {
    return { success: true };
  }

  // Invalidate any existing unused reset tokens for this user
  const now = Date.now();
  for (const t of Object.values(passwordResets)) {
    if (t.userId === user.id && !t.used) {
      t.used = true;
    }
  }

  // Generate cryptographically secure random token (32 bytes hex)
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = now + RESET_TOKEN_TTL_MS;

  passwordResets[token] = {
    token,
    userId: user.id,
    email: user.email,
    createdAt: now,
    expiresAt,
    used: false,
  };
  savePasswordResets();

  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const resetUrl = `${cleanBaseUrl}/reset-password/?token=${token}`;

  await sendPasswordResetEmail({
    toEmail: user.email,
    username: user.username,
    resetUrl,
  });

  return {
    success: true,
    previewResetUrl: resetUrl,
    token,
  };
}

// Validate a reset token (returns status and masked email if valid)
export function validatePasswordResetToken(token: string): {
  valid: boolean;
  error?: string;
  email?: string;
} {
  if (!token || typeof token !== "string") {
    return {
      valid: false,
      error: "Missing or invalid password reset token.",
    };
  }

  const resetRecord = passwordResets[token];
  if (!resetRecord) {
    return {
      valid: false,
      error: "This password reset link is invalid or does not exist.",
    };
  }

  if (resetRecord.used) {
    return {
      valid: false,
      error: "This password reset link has already been used. Please request a new one.",
    };
  }

  const now = Date.now();
  if (resetRecord.expiresAt < now) {
    return {
      valid: false,
      error: "This password reset link has expired (links are valid for 1 hour). Please request a new one.",
    };
  }

  const user = users[resetRecord.userId];
  if (!user) {
    return {
      valid: false,
      error: "The account associated with this reset link no longer exists.",
    };
  }

  const [localPart, domain] = user.email.split("@");
  const maskedLocal =
    localPart.length > 2
      ? localPart[0] + "***" + localPart[localPart.length - 1]
      : localPart[0] + "***";
  const maskedEmail = `${maskedLocal}@${domain}`;

  return {
    valid: true,
    email: maskedEmail,
  };
}

// Reset password with valid token and invalidate token + existing sessions
export function resetPasswordWithToken(
  token: string,
  newPassword: string
): { success: boolean; message: string } {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid password reset token.");
  }

  const resetRecord = passwordResets[token];
  if (!resetRecord || resetRecord.used) {
    throw new Error("This password reset link is invalid or has already been used.");
  }

  const now = Date.now();
  if (resetRecord.expiresAt < now) {
    throw new Error("This password reset link has expired. Please request a new one.");
  }

  if (!newPassword || typeof newPassword !== "string") {
    throw new Error("New password is required.");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  if (newPassword.length > 128) {
    throw new Error("Password cannot exceed 128 characters.");
  }

  const user = users[resetRecord.userId];
  if (!user) {
    throw new Error("Account not found.");
  }

  // Hash new password using PBKDF2 with 100,000 iterations & new salt
  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.salt = salt;
  saveUsers();

  // Invalidate token immediately
  resetRecord.used = true;
  savePasswordResets();

  // Invalidate any active sessions for this user for security
  for (const [sToken, sData] of Object.entries(sessions)) {
    if (sData.userId === user.id) {
      delete sessions[sToken];
    }
  }
  saveSessions();

  return {
    success: true,
    message: "Your password has been successfully reset. You can now log in with your new password.",
  };
}
