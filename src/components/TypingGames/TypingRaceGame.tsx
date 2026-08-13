import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Flag,
  Zap,
  RotateCcw,
  Play,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Flame,
  Award
} from "lucide-react";
import { soundEngine } from "../../utils/sound";
import { FAMOUS_QUOTES } from "../../utils/textGenerator";
import { useAuth } from "../../context/AuthContext";

interface BotRacer {
  name: string;
  icon: string;
  color: string;
  progress: number;
  speedMultiplier: number;
}

export const TypingRaceGame: React.FC = () => {
  const { user } = useAuth();

  // Passage & Race state
  const [passageText, setPassageText] = useState<string>("");
  const [typedInput, setTypedInput] = useState<string>("");
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");

  // Track Positions
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [bots, setBots] = useState<BotRacer[]>([
    { name: "Bot Turbo 🤖", icon: "🚗", color: "text-rose-400", progress: 0, speedMultiplier: 0.8 },
    { name: "Bot Apex ⚡", icon: "🏎️", color: "text-amber-400", progress: 0, speedMultiplier: 1.0 },
    { name: "Bot Phantom 👻", icon: "🏎️", color: "text-purple-400", progress: 0, speedMultiplier: 0.9 },
  ]);

  // Race timing & metrics
  const [startTime, setStartTime] = useState<number>(0);
  const [completionTimeSec, setCompletionTimeSec] = useState<number>(0);
  const [playerRank, setPlayerRank] = useState<number>(1);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Server validation state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verifiedRecord, setVerifiedRecord] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Pick passage
  const getNewPassage = useCallback((): string => {
    return FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];
  }, []);

  // Start / Reset Race
  const startRace = () => {
    const quote = getNewPassage();
    setPassageText(quote);
    setTypedInput("");
    setPlayerProgress(0);
    setBots([
      { name: "Bot Turbo 🤖", icon: "🚗", color: "text-rose-400", progress: 0, speedMultiplier: 0.75 + Math.random() * 0.3 },
      { name: "Bot Apex ⚡", icon: "🏎️", color: "text-amber-400", progress: 0, speedMultiplier: 0.85 + Math.random() * 0.3 },
      { name: "Bot Phantom 👻", icon: "🏎️", color: "text-purple-400", progress: 0, speedMultiplier: 0.8 + Math.random() * 0.3 },
    ]);
    setCorrectChars(0);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setPlayerRank(1);
    setVerifiedRecord(null);
    setSubmitError(null);
    setStartTime(Date.now());
    setGameState("playing");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Submit final race result to server
  const handleFinishRace = useCallback(
    async (
      timeInSec: number,
      rank: number,
      correct: number,
      totalKeys: number,
      errors: number
    ) => {
      setGameState("finished");
      setIsSubmitting(true);
      soundEngine.playFinishChime();

      const calculatedSec = Math.max(5, timeInSec);
      const acc = totalKeys > 0 ? Math.round((correct / totalKeys) * 100) : 100;
      const wpm = Math.round((correct / 5) / (calculatedSec / 60));
      const score = Math.round(wpm * (acc / 100) * 15 * (rank === 1 ? 1.3 : rank === 2 ? 1.1 : 1.0));

      try {
        const token = localStorage.getItem("typeblast_token");
        const res = await fetch("/api/games/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            gameType: "typing-race",
            wpm,
            accuracy: acc,
            score,
            duration: calculatedSec,
            wordsTyped: Math.round(correct / 5),
            totalChars: totalKeys,
            correctChars: correct,
            errorCount: errors,
            displayName: user ? user.displayName || user.username : "Speed Typist",
          }),
        });

        const data = await res.json();
        if (res.ok && data.status === "success") {
          setVerifiedRecord(data.record);
        } else {
          setSubmitError(data.error || "Server validation failed.");
        }
      } catch (err: any) {
        console.error("Typing Race submit error:", err);
        setSubmitError("Failed to reach server for validation.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [user]
  );

  // Bot progression game loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing") {
      interval = setInterval(() => {
        setBots((prev) =>
          prev.map((bot) => {
            if (bot.progress >= 100) return bot;
            const delta = (0.4 + Math.random() * 0.8) * bot.speedMultiplier;
            const nextProgress = Math.min(100, bot.progress + delta);
            return { ...bot, progress: nextProgress };
          })
        );
      }, 200);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Handle typing passage input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedInput(val);
    setTotalKeystrokes((k) => k + 1);

    // Calculate how many characters match passage prefix
    let matchingChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === passageText[i]) {
        matchingChars++;
      } else {
        setErrorCount((err) => err + 1);
        break;
      }
    }

    setCorrectChars(matchingChars);

    // Update player progress percentage
    const progress = Math.min(100, Math.round((matchingChars / passageText.length) * 100));
    setPlayerProgress(progress);

    if (val.length > matchingChars) {
      soundEngine.playKeyPress(false, true);
    } else {
      soundEngine.playKeyPress();
    }

    // Check if player completed full passage
    if (matchingChars >= passageText.length) {
      const elapsed = (Date.now() - startTime) / 1000;
      setCompletionTimeSec(elapsed);

      // Determine rank (#1, #2, #3, #4)
      const finishedBotsCount = bots.filter((b) => b.progress >= 100).length;
      const finalRank = finishedBotsCount + 1;
      setPlayerRank(finalRank);

      handleFinishRace(elapsed, finalRank, matchingChars, totalKeystrokes + 1, errorCount);
    }
  };

  const currentWpm =
    startTime > 0 && gameState === "playing"
      ? Math.round((correctChars / 5) / (Math.max(1, (Date.now() - startTime) / 1000) / 60))
      : 0;

  const currentAcc = totalKeystrokes > 0 ? Math.round((correctChars / totalKeystrokes) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Flag className="w-4 h-4 text-purple-400" />
            <span>Arcade Mode 3: Nitro Typing Race</span>
          </div>
          <h2 className="text-2xl font-black text-white">Nitro Grand Prix Race</h2>
          <p className="text-xs text-slate-400">
            Type the full quote passage to accelerate your sports car to the finish line!
          </p>
        </div>

        {gameState === "playing" && (
          <button
            onClick={startRace}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Race</span>
          </button>
        )}
      </div>

      {/* Main Game Screen Canvas */}
      <div className="relative min-h-[380px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
        {/* State 1: Instructions & Start Modal */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg">
              <Flag className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-black text-white">Nitro Race Rules</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                1. Race against 3 simulated AI drivers on identical tracks.<br />
                2. Every correct character typed accelerates your car forward.<br />
                3. First driver to 100% completion wins <strong>1st Place 🏆</strong>!<br />
                4. Your final completion time, WPM, and rank are stored on the server.
              </p>
            </div>

            <button
              onClick={startRace}
              className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-purple-600/20 transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Nitro Race</span>
            </button>
          </div>
        )}

        {/* State 2: Active Race */}
        {gameState === "playing" && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            {/* Visual Race Tracks */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
              {/* Player Track */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-cyan-400 flex items-center gap-1">🏎️ You (Player)</span>
                  <span className="font-mono text-cyan-300">{playerProgress}%</span>
                </div>
                <div className="relative h-10 bg-slate-950 rounded-lg border border-cyan-500/40 overflow-hidden flex items-center px-2">
                  <div
                    style={{ left: `${Math.min(92, playerProgress)}%` }}
                    className="absolute transition-all duration-100 text-xl"
                  >
                    🏎️
                  </div>
                  <div className="absolute right-2 text-[10px] font-mono font-bold text-slate-600 uppercase">
                    FINISH 🏁
                  </div>
                </div>
              </div>

              {/* AI Bot Tracks */}
              {bots.map((bot, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span className={bot.color}>{bot.name}</span>
                    <span className="font-mono">{Math.round(bot.progress)}%</span>
                  </div>
                  <div className="relative h-7 bg-slate-950/70 rounded-lg border border-slate-800/80 overflow-hidden flex items-center px-2">
                    <div
                      style={{ left: `${Math.min(92, bot.progress)}%` }}
                      className="absolute transition-all duration-200 text-sm"
                    >
                      {bot.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Passage Display */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-base sm:text-lg leading-relaxed select-none">
              {passageText.split("").map((char, idx) => {
                let colorClass = "text-slate-500";
                if (idx < typedInput.length) {
                  colorClass =
                    typedInput[idx] === char
                      ? "text-emerald-400 font-bold bg-emerald-500/10"
                      : "text-rose-400 font-bold bg-rose-500/20";
                }

                return (
                  <span key={idx} className={`${colorClass} transition-colors`}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Input Bar */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={typedInput}
                onChange={handleInputChange}
                placeholder="Start typing passage to accelerate..."
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full p-4 bg-slate-900 border border-purple-500/50 rounded-xl text-purple-200 font-mono text-base focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* State 3: Finished Race Results */}
        {gameState === "finished" && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Race Finished!</h3>
              <p className="text-xs text-slate-300">
                You placed <strong className="text-amber-400 font-mono text-sm">#{playerRank}</strong> out of 4 racers!
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Time</div>
                <div className="text-lg font-mono font-black text-cyan-400">
                  {completionTimeSec.toFixed(1)}s
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">WPM Speed</div>
                <div className="text-lg font-mono font-bold text-white">
                  {Math.round((correctChars / 5) / (completionTimeSec / 60))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</div>
                <div className="text-lg font-mono font-bold text-emerald-400">{currentAcc}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Rank Finish</div>
                <div className="text-lg font-mono font-bold text-amber-400">#{playerRank}</div>
              </div>
            </div>

            {/* Server Validation Badge */}
            <div className="w-full max-w-md p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="font-medium text-slate-300">Server Score Verification:</span>
              </div>
              {isSubmitting ? (
                <span className="text-cyan-400 font-mono text-[11px] animate-pulse">Validating...</span>
              ) : verifiedRecord ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Saved
                </span>
              ) : (
                <span className="text-amber-400 text-[11px]">{submitError || "Saved locally"}</span>
              )}
            </div>

            {/* Restart button */}
            <button
              onClick={startRace}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Next Race</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
