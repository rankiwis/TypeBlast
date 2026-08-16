import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Calendar,
  Flame,
  Trophy,
  Play,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  RotateCcw,
  History,
  Sparkles,
  User,
  Lock,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { soundEngine } from "../../utils/sound";
import { useAuth } from "../../context/AuthContext";
import { TabType } from "../../types";
import { trackEvent } from "../../utils/analytics";

interface DailyChallengeViewProps {
  setActiveTab?: (tab: TabType) => void;
}

interface DailyChallengeData {
  dateKey: string;
  formattedDate: string;
  title: string;
  prompt: string;
  duration: number;
  targetWpm: number;
  rewardXp: number;
  badge: string;
  category: string;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  displayName: string;
  username: string;
  wpm: number;
  accuracy: number;
  score: number;
  badge: string;
  verified: boolean;
  timestamp: string;
}

interface HistoryItem {
  dateKey: string;
  formattedDate: string;
  title: string;
  targetWpm: number;
  rewardXp: number;
  badge: string;
  topWpm: number;
  winner: string;
  isToday: boolean;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = () => {
  const { user, token: authToken } = useAuth();

  // Challenge state
  const [selectedDateKey, setSelectedDateKey] = useState<string>("");
  const [challenge, setChallenge] = useState<DailyChallengeData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userResult, setUserResult] = useState<any | null>(null);
  const [serverTime, setServerTime] = useState<string>("");

  // Loading & UI State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTabMode] = useState<"challenge" | "history">("challenge");

  // Interactive Test State
  const [testState, setTestState] = useState<"idle" | "running" | "completed">("idle");
  const [typedInput, setTypedInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [startTime, setStartTime] = useState<number>(0);

  // Live Metrics
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Submit Verification State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<any | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch challenge data for today or specified date
  const fetchChallengeData = useCallback(async (dateKey?: string) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      const token = authToken || localStorage.getItem("typeblast_auth_token");
      const url = dateKey
        ? `/api/daily-challenge/challenge?date=${dateKey}`
        : "/api/daily-challenge/today";

      const res = await fetch(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setChallenge(data.challenge);
        setSelectedDateKey(data.challenge.dateKey);
        setLeaderboard(data.leaderboard?.entries || []);
        setUserResult(data.userResult || null);
        setServerTime(data.serverTime || new Date().toISOString());
        setTimeLeft(data.challenge.duration || 60);

        if (data.history) {
          setHistory(data.history);
        }
      } else {
        setSubmitError(data.error || "Failed to load daily challenge data.");
      }
    } catch (err: any) {
      console.error("Daily Challenge load error:", err);
      setSubmitError("Network error loading official daily challenge.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallengeData();
  }, [fetchChallengeData]);

  // Start Interactive Challenge Sprint
  const handleStartChallenge = () => {
    if (!challenge) return;
    setTestState("running");
    setTypedInput("");
    setTimeLeft(challenge.duration);
    setCorrectChars(0);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setSubmitError(null);
    setLastSubmissionResult(null);
    setStartTime(Date.now());

    trackEvent("daily_challenge_started", {
      date: challenge.dateKey,
      mode: challenge.category,
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Finish & Submit Challenge Score
  const handleFinishChallenge = useCallback(
    async (
      durationSec: number,
      finalCorrect: number,
      finalTotalKeys: number,
      finalErrors: number
    ) => {
      if (!challenge) return;

      setTestState("completed");
      setIsSubmitting(true);
      soundEngine.playFinishChime();

      const calculatedDuration = Math.max(5, durationSec);
      const acc = finalTotalKeys > 0 ? Math.round((finalCorrect / finalTotalKeys) * 100) : 100;
      const wpm = Math.round((finalCorrect / 5) / (calculatedDuration / 60));

      trackEvent("daily_challenge_completed", {
        date: challenge.dateKey,
        wpm: wpm,
        accuracy: acc,
        score: Math.round(wpm * (acc / 100) * 10),
      });

      try {
        const token = authToken || localStorage.getItem("typeblast_auth_token");
        const res = await fetch("/api/daily-challenge/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            dateKey: challenge.dateKey,
            wpm,
            accuracy: acc,
            totalChars: finalTotalKeys,
            correctChars: finalCorrect,
            errorCount: finalErrors,
            duration: challenge.duration,
            displayName: user ? user.displayName || user.username : "Guest Typist",
          }),
        });

        const data = await res.json();
        if (res.ok && data.status === "success") {
          setLastSubmissionResult(data);
          setUserResult(data.record);
          if (data.leaderboard?.entries) {
            setLeaderboard(data.leaderboard.entries);
          }
        } else {
          setSubmitError(data.error || "Server score validation failed.");
        }
      } catch (err: any) {
        console.error("Submit error:", err);
        setSubmitError("Failed to submit score to server.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [challenge, user]
  );

  // Test Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testState === "running" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            handleFinishChallenge(elapsed, correctChars, totalKeystrokes, errorCount);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testState, timeLeft, startTime, correctChars, totalKeystrokes, errorCount, handleFinishChallenge]);

  // Handle Input typing changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!challenge) return;

    const val = e.target.value;
    setTypedInput(val);
    setTotalKeystrokes((k) => k + 1);

    const promptText = challenge.prompt;

    // Count matching prefix characters
    let matching = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === promptText[i]) {
        matching++;
      } else {
        setErrorCount((err) => err + 1);
        break;
      }
    }

    setCorrectChars(matching);

    if (val.length > matching) {
      soundEngine.playKeyPress(false, true);
    } else {
      soundEngine.playKeyPress();
    }

    // Check if entire challenge text completed before time expires
    if (matching >= promptText.length) {
      const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      handleFinishChallenge(elapsed, matching, totalKeystrokes + 1, errorCount);
    }
  };

  const isTodayChallenge = challenge ? challenge.dateKey === new Date().toISOString().split("T")[0] : true;
  const liveWpm = startTime > 0 && testState === "running"
    ? Math.round((correctChars / 5) / (Math.max(1, (Date.now() - startTime) / 1000) / 60))
    : 0;
  const liveAcc = totalKeystrokes > 0 ? Math.round((correctChars / totalKeystrokes) * 100) : 100;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/30 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Daily Sprint</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Today's TypeBlast Challenge
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Every 24 hours, typists around the world compete on the exact same official challenge passage. Complete today’s challenge to set your daily rank and build your activity streak!
          </p>
        </div>

        {/* Challenge Stats Summary Box */}
        <div className="flex items-center gap-4 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 text-center shadow-lg">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Time Limit</div>
            <div className="text-xl font-black text-cyan-400 flex items-center justify-center gap-1 font-mono">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{challenge?.duration || 60}s</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Reward Badge</div>
            <div className="text-xs font-black text-amber-400 truncate max-w-[120px]">
              {challenge?.badge || "Quantum Striker"}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Streak XP</div>
            <div className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>+{challenge?.rewardXp || 500}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Bar: Challenge vs History */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabMode("challenge")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "challenge"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Today's Official Challenge</span>
          </button>

          <button
            onClick={() => setActiveTabMode("history")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "history"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Past Challenge History ({history.length})</span>
          </button>
        </div>

        {/* Server Time Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Server Verified • {challenge?.formattedDate || "Today"}</span>
        </div>
      </div>

      {/* ERROR / NOTIFICATION MESSAGE */}
      {submitError && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center gap-3 text-rose-300 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* VIEW 1: ACTIVE TODAY'S CHALLENGE VIEW */}
      {activeTab === "challenge" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Challenge Card (Cols 1 & 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl relative overflow-hidden">
              {/* Header inside Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold">
                    {challenge?.formattedDate}
                  </span>
                  {!isTodayChallenge && (
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                      Archived Sprint
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <span>Target WPM: <strong className="text-cyan-400 font-mono">{challenge?.targetWpm || 75} WPM</strong></span>
                  <span>Time: <strong className="text-white font-mono">{challenge?.duration || 60}s</strong></span>
                </div>
              </div>

              {/* Challenge Title */}
              <div>
                <h3 className="text-2xl font-black text-white">{challenge?.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Official challenge passage for {challenge?.formattedDate}. Read-only official test.
                </p>
              </div>

              {/* Read-Only Official Challenge Text Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative font-mono text-base sm:text-lg leading-relaxed select-none min-h-[120px] flex items-center">
                <div className="w-full">
                  {testState === "idle" && (
                    <span className="text-slate-200">"{challenge?.prompt}"</span>
                  )}

                  {testState === "running" && challenge && (
                    <div>
                      {challenge.prompt.split("").map((char, idx) => {
                        let styleClass = "text-slate-500";
                        if (idx < typedInput.length) {
                          styleClass =
                            typedInput[idx] === char
                              ? "text-emerald-400 font-bold bg-emerald-500/10"
                              : "text-rose-400 font-bold bg-rose-500/20";
                        }

                        return (
                          <span key={idx} className={`${styleClass} transition-colors`}>
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {testState === "completed" && (
                    <div className="text-center py-4 space-y-2">
                      <div className="text-emerald-400 font-black text-xl flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-6 h-6" /> Challenge Complete!
                      </div>
                      <p className="text-xs text-slate-400">
                        Your test score has been calculated and verified by the server.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Typing Controls */}
              {testState === "idle" && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Official Challenge Text is locked & immutable.</span>
                  </div>

                  <button
                    onClick={handleStartChallenge}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105"
                  >
                    <Play className="w-4.5 h-4.5 fill-slate-950" />
                    <span>Start Daily Challenge</span>
                  </button>
                </div>
              )}

              {testState === "running" && (
                <div className="space-y-4 pt-2">
                  {/* Live HUD */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-base">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>{timeLeft}s remaining</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Live WPM</span>
                        <span className="font-mono font-bold text-cyan-300 text-sm">{liveWpm}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Accuracy</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">{liveAcc}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Input Box */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={typedInput}
                    onChange={handleInputChange}
                    placeholder="Type official challenge passage here..."
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full p-4 bg-slate-950 border border-amber-500/50 rounded-2xl text-amber-200 font-mono text-base focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                </div>
              )}

              {testState === "completed" && (
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={handleStartChallenge}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Today's Challenge</span>
                  </button>
                </div>
              )}
            </div>

            {/* Current User's Result Box */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Your Result for {challenge?.formattedDate}
                </h4>

                {userResult ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Score Recorded
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">No submission yet today</span>
                )}
              </div>

              {userResult ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">WPM Speed</div>
                    <div className="text-xl font-mono font-black text-cyan-400">{userResult.wpm}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</div>
                    <div className="text-xl font-mono font-black text-emerald-400">{userResult.accuracy}%</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Score Points</div>
                    <div className="text-xl font-mono font-black text-amber-400">{userResult.score}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Daily Rank</div>
                    <div className="text-xl font-mono font-black text-purple-400">
                      #{lastSubmissionResult?.userRank || "Verified"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                  <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    You have not completed today's challenge yet. Click <strong>Start Daily Challenge</strong> to record your result on the global ranking!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Daily Leaderboard Column (Col 3) */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h4 className="text-lg font-black text-white">Daily Leaderboard</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">
                    {leaderboard.length} Entries
                  </span>
                </div>

                {/* Leaderboard Table List */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {leaderboard.map((entry) => {
                    const isTop1 = entry.rank === 1;
                    const isTop2 = entry.rank === 2;
                    const isTop3 = entry.rank === 3;

                    return (
                      <div
                        key={entry.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          isTop1
                            ? "bg-amber-500/10 border-amber-500/30 text-white"
                            : isTop2
                            ? "bg-slate-800/80 border-slate-700 text-slate-200"
                            : isTop3
                            ? "bg-amber-950/20 border-amber-900/30 text-slate-300"
                            : "bg-slate-950/60 border-slate-800/60 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-black flex-shrink-0 ${
                              isTop1
                                ? "bg-amber-500 text-slate-950"
                                : isTop2
                                ? "bg-slate-700 text-white"
                                : isTop3
                                ? "bg-amber-800 text-amber-200"
                                : "bg-slate-900 text-slate-500"
                            }`}
                          >
                            #{entry.rank}
                          </div>

                          <div className="min-w-0">
                            <div className="text-xs font-extrabold text-white truncate flex items-center gap-1">
                              <span>{entry.displayName}</span>
                              {entry.verified && (
                                <ShieldCheck className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {entry.accuracy}% Acc
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-mono font-black text-cyan-400">
                            {entry.wpm} <span className="text-[10px] text-slate-500">WPM</span>
                          </div>
                          <div className="text-[10px] font-mono text-amber-400 font-bold">
                            {entry.score} pts
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Security Note */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Leaderboard entries are server-verified using keystroke timing anti-tamper algorithms.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CHALLENGE HISTORY ARCHIVE */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  Past Daily Challenges History
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access official daily challenges from past days. All previous daily challenge texts remain stored and accessible for practice and ranking.
                </p>
              </div>
            </div>

            {/* History Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => (
                <div
                  key={item.dateKey}
                  className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    item.dateKey === selectedDateKey
                      ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-cyan-400">
                        {item.formattedDate}
                      </span>
                      {item.isToday ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                          Today
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Archived
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-white text-base">{item.title}</h4>
                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>Target: <strong className="text-slate-200">{item.targetWpm} WPM</strong></span>
                      <span>Reward: <strong className="text-amber-400">+{item.rewardXp} XP</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Top Score: <strong className="text-emerald-400 font-mono">{item.topWpm} WPM</strong>
                    </div>

                    <button
                      onClick={() => {
                        fetchChallengeData(item.dateKey);
                        setActiveTabMode("challenge");
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <span>Load Challenge</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
