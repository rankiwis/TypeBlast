import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on server side
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "TypeBlast API" });
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
