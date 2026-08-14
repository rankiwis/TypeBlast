import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  createUser,
  loginUser,
  getUserByToken,
  logoutToken,
  addTestResultToUser,
  addGameScoreToUser,
  updateUserProfile,
  getPublicProfile
} from "./server/authStore";
import {
  queryLeaderboard,
  validateAndSanitizeSubmission,
  addLeaderboardRecord,
  updateUserDisplayNameInLeaderboard
} from "./server/leaderboardStore";
import {
  getDailyChallenge,
  getDailyChallengeLeaderboard,
  submitDailyChallengeScore,
  getDailyChallengeHistory,
  getUserDailyChallengeResult
} from "./server/dailyChallengeStore";

dotenv.config();

const app = express();
const PORT = 3000;

// Security: Disable X-Powered-By header
app.disable("x-powered-by");

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Security: Enforce JSON body size limit (100kb)
app.use(express.json({ limit: "100kb" }));

// In-Memory Sliding Window Rate Limiter
function createRateLimiter(options: { windowMs: number; max: number; message: string }) {
  const requests = new Map<string, number[]>();

  // Cleanup routine every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requests.entries()) {
      const valid = timestamps.filter((t) => now - t < options.windowMs);
      if (valid.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, valid);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const timestamps = requests.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => now - t < options.windowMs);

    if (validTimestamps.length >= options.max) {
      return res.status(429).json({ error: options.message });
    }

    validTimestamps.push(now);
    requests.set(ip, validTimestamps);
    next();
  };
}

const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  message: "Too many authentication attempts. Please wait a minute before trying again.",
});

const submissionRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: "Submission rate limit exceeded. Please wait a moment before submitting another score.",
});

const aiCoachRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: "AI coach rate limit reached. Please wait a moment before requesting another analysis.",
});

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Helper middleware to extract authorization token
const getAuthToken = (req: express.Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.substring(7).trim();
};

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "TypeBlast API" });
});

// Dynamic XML Sitemap Generator
app.get("/sitemap.xml", (_req, res) => {
  const baseUrl = "https://www.typeblast.com";
  const today = new Date().toISOString().split("T")[0];

  const publicRoutes = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/typing-test/", priority: "0.9", changefreq: "daily" },
    { path: "/daily-typing-challenge/", priority: "0.9", changefreq: "daily" },
    { path: "/blog/", priority: "0.9", changefreq: "daily" },
    { path: "/blog/how-to-type-100-wpm-touch-typing-guide/", priority: "0.8", changefreq: "weekly" },
    { path: "/blog/home-row-finger-placement-mastery/", priority: "0.8", changefreq: "weekly" },
    { path: "/blog/ergonomics-and-wrist-health-for-typists/", priority: "0.8", changefreq: "weekly" },
    { path: "/blog/how-typing-speed-impacts-tech-careers/", priority: "0.8", changefreq: "weekly" },
    { path: "/blog/gamified-typing-for-kids-and-students/", priority: "0.8", changefreq: "weekly" },
    { path: "/blog/mechanical-keyboard-switches-wpm-guide/", priority: "0.8", changefreq: "weekly" },
    { path: "/typing-speed-test/", priority: "0.8", changefreq: "weekly" },
    { path: "/wpm-test/", priority: "0.8", changefreq: "weekly" },
    { path: "/typing-accuracy-test/", priority: "0.8", changefreq: "weekly" },
    { path: "/typing-practice/", priority: "0.8", changefreq: "weekly" },
    { path: "/typing-games/", priority: "0.8", changefreq: "weekly" },
    { path: "/touch-typing/", priority: "0.8", changefreq: "monthly" },
    { path: "/typing-tips/", priority: "0.7", changefreq: "monthly" },
    { path: "/faq/", priority: "0.6", changefreq: "monthly" },
    { path: "/about/", priority: "0.5", changefreq: "monthly" },
    { path: "/contact/", priority: "0.5", changefreq: "monthly" },
    { path: "/privacy/", priority: "0.3", changefreq: "yearly" },
    { path: "/terms/", priority: "0.3", changefreq: "yearly" },
  ];

  const xmlUrls = publicRoutes
    .map(
      (r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemapXml);
});

// Robots.txt Handler
app.get("/robots.txt", (_req, res) => {
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /profile/
Disallow: /admin/
Disallow: /login/
Disallow: /signup/
Disallow: /api/

Sitemap: https://www.typeblast.com/sitemap.xml`);
});

// LLMs.txt Handler
app.get("/llms.txt", (_req, res) => {
  res.header("Content-Type", "text/plain");
  res.send(`# TypeBlast - High-Precision Online Typing Platform

TypeBlast is a fast, responsive online typing speed test, touch-typing practice engine, and gamified typing platform.

## Key Capabilities
- Standardized WPM and Accuracy Testing (15s, 30s, 60s, 120s, 300s durations)
- Daily Typing Challenges with synchronized daily passages and global rankings
- Targeted Skill & Drill Practice Engine for home row, number row, code snippets, and custom text
- Arcade Typing Games (Word Blast, Time Attack, Typing Race, Speed Blast Laser, Nitro Typing Race, Word Defense Arena)
- Verification & Official Printable Speed Certificates
- Anti-Tamper Leaderboards with server-side validation
- AI Typing Coach powered by Google Gemini AI

## Important Public URLs
- https://www.typeblast.com/
- https://www.typeblast.com/typing-test/
- https://www.typeblast.com/daily-typing-challenge/
- https://www.typeblast.com/blog/
- https://www.typeblast.com/typing-speed-test/
- https://www.typeblast.com/wpm-test/
- https://www.typeblast.com/typing-accuracy-test/
- https://www.typeblast.com/typing-practice/
- https://www.typeblast.com/typing-games/
- https://www.typeblast.com/touch-typing/
- https://www.typeblast.com/typing-tips/
- https://www.typeblast.com/faq/
- https://www.typeblast.com/about/
- https://www.typeblast.com/contact/
- https://www.typeblast.com/privacy/
- https://www.typeblast.com/terms/`);
});

// Auth API Endpoints
app.post("/api/auth/signup", authRateLimiter, (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }
    const result = createUser(username, email, password);
    res.json({ status: "success", user: result.user, token: result.token });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to create account." });
  }
});

app.post("/api/auth/login", authRateLimiter, (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: "Email/username and password are required." });
    }
    const result = loginUser(emailOrUsername, password);
    res.json({ status: "success", user: result.user, token: result.token });
  } catch (error: any) {
    res.status(401).json({ error: error.message || "Invalid credentials." });
  }
});

app.get("/api/auth/me", (req, res) => {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  const user = getUserByToken(token);
  if (!user) return res.status(401).json({ error: "Session expired or invalid" });
  res.json({ status: "success", user });
});

app.post("/api/auth/logout", (req, res) => {
  const token = getAuthToken(req);
  if (token) logoutToken(token);
  res.json({ status: "success", message: "Logged out" });
});

// Leaderboard Query Endpoint (Today, Week, Month, All Time)
app.get("/api/leaderboard", (req, res) => {
  try {
    const period = (req.query.period as any) || "alltime";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const duration = req.query.duration ? Number(req.query.duration) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const result = queryLeaderboard({ period, page, limit, duration, category, search });
    res.json({ status: "success", ...result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch leaderboard" });
  }
});

// Secure Leaderboard Submission Endpoint
app.post("/api/leaderboard/submit", submissionRateLimiter, (req, res) => {
  try {
    const token = getAuthToken(req);
    const user = token ? getUserByToken(token) : null;

    const { wpm, rawWpm, accuracy, cpm, totalChars, correctChars, errorCount, duration, category, displayName } = req.body;

    // Strict validation of typing metrics & score
    const validation = validateAndSanitizeSubmission({
      wpm: Number(wpm),
      rawWpm: Number(rawWpm),
      accuracy: Number(accuracy),
      cpm: Number(cpm),
      totalChars: Number(totalChars),
      correctChars: Number(correctChars),
      errorCount: Number(errorCount),
      duration: Number(duration),
      category: String(category || "words"),
      displayName: user ? (user.displayName || user.username) : displayName,
      username: user ? user.username : "guest",
      userId: user ? user.id : undefined,
    });

    if (!validation.isValid || !validation.record) {
      return res.status(400).json({ error: validation.error || "Invalid typing score." });
    }

    // Add to global leaderboard store
    const record = addLeaderboardRecord(validation.record);

    // If user is logged in, also record in user test history
    let updatedUser = null;
    if (token && user) {
      updatedUser = addTestResultToUser(token, {
        wpm: validation.record.wpm,
        rawWpm: validation.record.rawWpm,
        accuracy: validation.record.accuracy,
        cpm: Number(cpm) || 0,
        totalChars: Number(totalChars) || 0,
        correctChars: Number(correctChars) || 0,
        errorCount: Number(errorCount) || 0,
        duration: validation.record.duration,
        category: validation.record.category,
      });
    }

    res.json({ status: "success", record, user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to submit leaderboard score." });
  }
});

// Game Score Submission Endpoint (with strict server-side validation)
app.post("/api/games/submit", submissionRateLimiter, (req, res) => {
  try {
    const token = getAuthToken(req);
    const user = token ? getUserByToken(token) : null;

    const { gameType, wpm, rawWpm, accuracy, duration, wordsTyped, totalChars, correctChars, errorCount, displayName } = req.body;

    // Validate gameType
    const validGames = ["word-blast", "time-attack", "typing-race"];
    if (!gameType || !validGames.includes(gameType)) {
      return res.status(400).json({ error: "Invalid game type. Must be word-blast, time-attack, or typing-race." });
    }

    const dur = Math.max(5, Number(duration) || 30);
    const speedWpm = Number(wpm) || 0;
    const acc = Number(accuracy) || 0;

    // Strict server-side validation
    const validation = validateAndSanitizeSubmission({
      wpm: speedWpm,
      rawWpm: Number(rawWpm) || speedWpm,
      accuracy: acc,
      totalChars: Number(totalChars) || 0,
      correctChars: Number(correctChars) || 0,
      errorCount: Number(errorCount) || 0,
      duration: dur,
      category: `game_${gameType.replace(/-/g, "_")}`,
      displayName: user ? (user.displayName || user.username) : displayName,
      username: user ? user.username : "guest",
      userId: user ? user.id : undefined,
    });

    if (!validation.isValid || !validation.record) {
      return res.status(400).json({ error: validation.error || "Game score failed server validation." });
    }

    // Save record into verified database
    const record = addLeaderboardRecord(validation.record);

    // Update user history if logged in
    let updatedUser = null;
    if (token && user) {
      updatedUser = addTestResultToUser(token, {
        wpm: validation.record.wpm,
        rawWpm: validation.record.rawWpm,
        accuracy: validation.record.accuracy,
        cpm: Math.round(validation.record.wpm * 5),
        totalChars: Number(totalChars) || 0,
        correctChars: Number(correctChars) || 0,
        errorCount: Number(errorCount) || 0,
        duration: validation.record.duration,
        category: `game_${gameType.replace(/-/g, "_")}`,
      });
    }

    res.json({
      status: "success",
      message: "Game score validated and stored.",
      record,
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to process game score." });
  }
});

// Daily Challenge Endpoints
app.get("/api/daily-challenge/today", (req, res) => {
  try {
    const token = getAuthToken(req);
    const user = token ? getUserByToken(token) : null;

    const todayKey = new Date().toISOString().split("T")[0];
    const challenge = getDailyChallenge(todayKey);
    const leaderboard = getDailyChallengeLeaderboard(todayKey, 1, 25);
    const history = getDailyChallengeHistory(14);

    let userResult = null;
    if (user) {
      userResult =
        getUserDailyChallengeResult(todayKey, user.username) ||
        getUserDailyChallengeResult(todayKey, user.displayName);
    }

    res.json({
      status: "success",
      serverTime: new Date().toISOString(),
      challenge,
      userResult,
      leaderboard,
      history,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to load daily challenge." });
  }
});

app.get("/api/daily-challenge/challenge", (req, res) => {
  try {
    const token = getAuthToken(req);
    const user = token ? getUserByToken(token) : null;
    const dateKey = (req.query.date as string) || new Date().toISOString().split("T")[0];

    const challenge = getDailyChallenge(dateKey);
    const leaderboard = getDailyChallengeLeaderboard(dateKey, 1, 25);

    let userResult = null;
    if (user) {
      userResult =
        getUserDailyChallengeResult(dateKey, user.username) ||
        getUserDailyChallengeResult(dateKey, user.displayName);
    }

    res.json({
      status: "success",
      serverTime: new Date().toISOString(),
      challenge,
      userResult,
      leaderboard,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to query daily challenge." });
  }
});

app.post("/api/daily-challenge/submit", submissionRateLimiter, (req, res) => {
  try {
    const token = getAuthToken(req);
    const user = token ? getUserByToken(token) : null;

    const {
      dateKey,
      wpm,
      rawWpm,
      accuracy,
      totalChars,
      correctChars,
      errorCount,
      duration,
      displayName,
    } = req.body;

    const targetDateKey = dateKey || new Date().toISOString().split("T")[0];
    const finalDisplayName = user
      ? user.displayName || user.username
      : displayName || "Anonymous Typist";
    const finalUsername = user
      ? user.username
      : displayName
      ? displayName.toLowerCase().replace(/\s+/g, "_")
      : "guest";

    const result = submitDailyChallengeScore({
      dateKey: targetDateKey,
      wpm: Number(wpm) || 0,
      rawWpm: Number(rawWpm) || Number(wpm) || 0,
      accuracy: Number(accuracy) || 0,
      totalChars: Number(totalChars) || 0,
      correctChars: Number(correctChars) || 0,
      errorCount: Number(errorCount) || 0,
      duration: Number(duration) || 60,
      displayName: finalDisplayName,
      username: finalUsername,
      userId: user ? user.id : undefined,
    });

    if (!result.isValid) {
      return res.status(400).json({ error: result.error || "Submission failed validation." });
    }

    // Record in user account history if logged in
    if (token && user) {
      addGameScoreToUser(token, {
        gameId: "daily-challenge",
        gameName: "Daily Challenge",
        score: result.record?.score || 0,
        wpm: result.record?.wpm || 0,
        accuracy: result.record?.accuracy || 0,
      });
    }

    const updatedLeaderboard = getDailyChallengeLeaderboard(targetDateKey, 1, 25);

    res.json({
      status: "success",
      record: result.record,
      userRank: result.userRank,
      totalParticipants: result.totalParticipants,
      leaderboard: updatedLeaderboard,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to submit daily challenge result." });
  }
});

// Test Results Recording Endpoint
app.post("/api/user/test-results", submissionRateLimiter, (req, res) => {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: "Authentication token required." });

  try {
    const user = getUserByToken(token);
    if (!user) return res.status(401).json({ error: "User session invalid." });

    const { wpm, rawWpm, accuracy, cpm, totalChars, correctChars, errorCount, duration, category } = req.body;
    if (wpm === undefined || accuracy === undefined) {
      return res.status(400).json({ error: "Invalid test result payload." });
    }

    // Validate submission parameters before recording
    const validation = validateAndSanitizeSubmission({
      wpm: Number(wpm),
      rawWpm: Number(rawWpm),
      accuracy: Number(accuracy),
      cpm: Number(cpm),
      totalChars: Number(totalChars),
      correctChars: Number(correctChars),
      errorCount: Number(errorCount),
      duration: Number(duration),
      category: String(category || "words"),
      displayName: user.displayName || user.username,
      username: user.username,
      userId: user.id,
    });

    if (!validation.isValid || !validation.record) {
      return res.status(400).json({ error: validation.error || "Invalid typing test metrics." });
    }

    // Record to global verified leaderboard
    addLeaderboardRecord(validation.record);

    // Save to user account history
    const updatedUser = addTestResultToUser(token, {
      wpm: validation.record.wpm,
      rawWpm: validation.record.rawWpm,
      accuracy: validation.record.accuracy,
      cpm: Number(cpm) || 0,
      totalChars: Number(totalChars) || 0,
      correctChars: Number(correctChars) || 0,
      errorCount: Number(errorCount) || 0,
      duration: validation.record.duration,
      category: validation.record.category,
    });

    res.json({ status: "success", user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to save test result." });
  }
});

// Game Scores Endpoint with strict payload validation
app.post("/api/user/game-scores", submissionRateLimiter, (req, res) => {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: "Authentication token required." });

  try {
    const { gameId, gameName, score, wpm, accuracy } = req.body;
    const validGames = ["word-blast", "time-attack", "typing-race", "daily-challenge"];
    const cleanGameId = String(gameId || "");
    if (!validGames.includes(cleanGameId)) {
      return res.status(400).json({ error: "Invalid game identifier." });
    }

    const updatedUser = addGameScoreToUser(token, {
      gameId: cleanGameId,
      gameName: String(gameName || "Typing Game"),
      score: Math.min(10000, Math.max(0, Number(score) || 0)),
      wpm: Math.min(230, Math.max(0, Number(wpm) || 0)),
      accuracy: Math.min(100, Math.max(0, Number(accuracy) || 0)),
    });
    res.json({ status: "success", user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to save game score." });
  }
});

// Profile Update Endpoint
app.put("/api/user/profile", (req, res) => {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: "Authentication token required." });

  try {
    const user = getUserByToken(token);
    if (!user) return res.status(401).json({ error: "Invalid session." });

    const { displayName, bio, keyboardLayout, soundPreference } = req.body;
    const updatedUser = updateUserProfile(token, { displayName, bio, keyboardLayout, soundPreference });

    if (displayName) {
      updateUserDisplayNameInLeaderboard(user.id, displayName);
    }

    res.json({ status: "success", user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to update profile." });
  }
});

// Public Safe Profile Endpoint (Does NOT expose email or password hash)
app.get("/api/user/public-profile/:id", (req, res) => {
  const profile = getPublicProfile(req.params.id);
  if (!profile) return res.status(404).json({ error: "User profile not found." });
  res.json({ status: "success", profile });
});

// AI Typing Coach Endpoint
app.post("/api/ai-coach", aiCoachRateLimiter, async (req, res) => {
  try {
    const { wpm, accuracy, duration, testType, errorKeys, slowKeys, recentHistory } = req.body;

    const ai = getAiClient();
    if (!ai) {
      // Fallback if GEMINI_API_KEY is not set
      return res.json({
        coachName: "TypeBlast AI Coach",
        summary: `Great effort! You finished with ${wpm || 60} WPM and ${accuracy || 95}% accuracy.`,
        keyWeaknesses: errorKeys?.length ? errorKeys : ["Punctuation", "Shift combinations"],
        suggestedFocus: "Practice home row stability and rhythm consistency.",
        customDrillText: "The quick brown fox jumps over the lazy dog repeatedly to master every key combination smoothly.",
        speedImprovementTips: [
          "Maintain a steady rhythm rather than bursting speed on easy words.",
          "Keep your fingers anchored lightly over ASDF and JKL; keys.",
          "Use your thumb exclusively for the spacebar."
        ]
      });
    }

    const prompt = `
You are TypeBlast AI, an expert, enthusiastic typing coach.
Analyze the user's recent typing performance and provide a structured JSON response.

User Statistics:
- Speed: ${wpm || 0} WPM
- Accuracy: ${accuracy || 0}%
- Test Duration / Mode: ${duration || 30}s / ${testType || 'standard'}
- Frequently Mistyped Keys / Bigrams: ${JSON.stringify(errorKeys || [])}
- Slowest Response Keys: ${JSON.stringify(slowKeys || [])}
- Recent Performance Trend: ${JSON.stringify(recentHistory || [])}

Provide feedback in strict JSON matching the schema:
{
  "coachName": "TypeBlast AI Coach",
  "summary": "Short encouraging diagnostic summary of their performance",
  "keyWeaknesses": ["Array of 2-4 key combinations or habits holding them back"],
  "suggestedFocus": "One key target focal area for their next session",
  "customDrillText": "A custom 25-40 word practice paragraph specifically rich in the letters, numbers, or punctuation they struggled with",
  "speedImprovementTips": ["Array of 3 actionable, specific ergonomic or mental tips"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coachName: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyWeaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestedFocus: { type: Type.STRING },
            customDrillText: { type: Type.STRING },
            speedImprovementTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["coachName", "summary", "keyWeaknesses", "suggestedFocus", "customDrillText", "speedImprovementTips"],
        },
      },
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text.trim());
      return res.json(parsedData);
    }

    throw new Error("Empty AI response");
  } catch (error) {
    console.error("AI Coach Error:", error);
    res.status(500).json({
      error: "Failed to generate AI typing analysis.",
      fallback: {
        coachName: "TypeBlast AI Coach",
        summary: "Keep practicing! Focus on consistency over raw speed.",
        keyWeaknesses: ["Rhythm consistency", "Pinky key reaches"],
        suggestedFocus: "Focus on zero-error speed building.",
        customDrillText: "asdf jkl; qwer poiuy zxcv bnm, fast speed accuracy practice drill.",
        speedImprovementTips: [
          "Slow down slightly to boost accuracy above 98%.",
          "Relax your wrists and maintain neutral posture.",
          "Focus on smooth finger transitions."
        ]
      }
    });
  }
});

// Favicon, Sitemap & Robots.txt Direct Serving
app.get(["/favicon.svg", "/favicon.ico"], (_req, res) => {
  const faviconPath = path.join(process.cwd(), "public", "favicon.svg");
  res.type("image/svg+xml");
  res.sendFile(faviconPath);
});

app.get("/sitemap.xml", (_req, res) => {
  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
  res.type("application/xml");
  res.sendFile(sitemapPath);
});

app.get("/robots.txt", (_req, res) => {
  const robotsPath = path.join(process.cwd(), "public", "robots.txt");
  res.type("text/plain");
  res.sendFile(robotsPath);
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TypeBlast Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
