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

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Auth API Endpoints
app.post("/api/auth/signup", (req, res) => {
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

app.post("/api/auth/login", (req, res) => {
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
app.post("/api/leaderboard/submit", (req, res) => {
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
app.post("/api/games/submit", (req, res) => {
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

// Test Results Recording Endpoint
app.post("/api/user/test-results", (req, res) => {
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

// Game Scores Endpoint
app.post("/api/user/game-scores", (req, res) => {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: "Authentication token required." });

  try {
    const { gameId, gameName, score, wpm, accuracy } = req.body;
    const updatedUser = addGameScoreToUser(token, {
      gameId: String(gameId),
      gameName: String(gameName),
      score: Number(score) || 0,
      wpm: Number(wpm) || 0,
      accuracy: Number(accuracy) || 0,
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
app.post("/api/ai-coach", async (req, res) => {
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
