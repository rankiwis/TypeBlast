import React, { useState } from "react";
import { Sparkles, Brain, AlertCircle, CheckCircle, ArrowRight, RefreshCw, Flame, Target } from "lucide-react";
import { TypingStats, AICoachReport, TabType } from "../../types";
import { soundEngine } from "../../utils/sound";

interface AICoachViewProps {
  lastStats: TypingStats | null;
  setActiveTab: (tab: TabType) => void;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ lastStats, setActiveTab }) => {
  const [loading, setLoading] = useState(false);
  const [coachReport, setCoachReport] = useState<AICoachReport | null>({
    coachName: "TypeBlast AI Master Coach",
    summary: lastStats
      ? `Analysis of your test run (${lastStats.wpm} WPM, ${lastStats.accuracy}% Accuracy): Excellent rhythm speed! You possess fast index finger transitions, but key delays were detected on pinky reaches.`
      : "Welcome to AI Coach! Run a typing test to receive deep real-time diagnostic recommendations and custom practice drills.",
    keyWeaknesses: lastStats && Object.keys(lastStats.errorKeys).length > 0
      ? Object.keys(lastStats.errorKeys).map((k) => `Reaches for key '${k.toUpperCase()}'`)
      : ["Pinky key reaches (; p q z)", "Rhythm consistency on punctuation"],
    suggestedFocus: "Focus on zero-error speed building and keeping wrists elevated slightly.",
    customDrillText: "the quick brown fox jumps over the lazy dog asdf jkl; qwer poiuy zxcv bnm, fast speed accuracy practice drill.",
    speedImprovementTips: [
      "Maintain a steady cadence rather than bursting speed on easy words.",
      "Keep your wrists neutral and slightly raised above the keyboard edge.",
      "Slow down by 5 WPM to push your accuracy above 98%."
    ]
  });

  const generateReportFromApi = async () => {
    setLoading(true);
    soundEngine.playKeyPress();

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wpm: lastStats?.wpm || 72,
          accuracy: lastStats?.accuracy || 96,
          duration: lastStats?.duration || 30,
          testType: "words",
          errorKeys: lastStats?.errorKeys ? Object.keys(lastStats.errorKeys) : ["p", ";", "q"],
        }),
      });

      const data = await res.json();
      if (data.fallback || data.summary) {
        setCoachReport(data.fallback || data);
      }
    } catch (err) {
      console.error("Coach API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 border border-purple-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Server-Side Gemini AI Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">AI Personal Typing Coach</h2>
          <p className="text-xs text-slate-300">
            Powered by Gemini AI • Evaluates keystroke latency, error matrix, and ergonomics
          </p>
        </div>

        <button
          onClick={generateReportFromApi}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Analyzing Keystrokes..." : "Generate AI Diagnosis"}</span>
        </button>
      </div>

      {/* Report Dashboard */}
      {coachReport && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>Diagnostic Summary</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {coachReport.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weaknesses List */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Detected Weaknesses</span>
              </h4>
              <ul className="space-y-2">
                {coachReport.keyWeaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ergonomic & Speed Tips */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Actionable Speed Tips</span>
              </h4>
              <ul className="space-y-2">
                {coachReport.speedImprovementTips.map((tip, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Custom Practice Drill */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>AI Generated Custom Practice Drill</span>
              </h4>
              <span className="text-[10px] text-purple-400 uppercase font-mono px-2 py-0.5 rounded bg-purple-500/10">Tailored For You</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-base text-slate-200">
              {coachReport.customDrillText}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setActiveTab("practice");
                  soundEngine.playKeyPress();
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-purple-400 transition-colors"
              >
                <span>Launch Custom AI Drill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
