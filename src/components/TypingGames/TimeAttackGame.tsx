import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Clock,
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
import { COMMON_WORDS } from "../../utils/textGenerator";
import { useAuth } from "../../context/AuthContext";
import { trackEvent } from "../../utils/analytics";

type TimeOption = 15 | 30 | 60;

export const TimeAttackGame: React.FC = () => {
  const { user } = useAuth();

  // Settings
  const [selectedDuration, setSelectedDuration] = useState<TimeOption>(30);

  // Game state
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Words stream state
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [typedValue, setTypedValue] = useState<string>("");

  // Statistics
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);
  const [correctCharsCount, setCorrectCharsCount] = useState<number>(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Server validation state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verifiedRecord, setVerifiedRecord] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Generate word stream
  const generateWordsStream = useCallback((count: number = 100): string[] => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
    }
    return list;
  }, []);

  // Start / Reset Time Attack Game
  const startGame = () => {
    const freshWords = generateWordsStream(120);
    setWordsList(freshWords);
    setActiveWordIndex(0);
    setTypedValue("");
    setTimeLeft(selectedDuration);
    setWordsCompleted(0);
    setCorrectCharsCount(0);
    setTotalCharsTyped(0);
    setErrorCount(0);
    setVerifiedRecord(null);
    setSubmitError(null);
    setGameState("playing");

    trackEvent("typing_game_started", {
      game_id: "time_attack",
      game_name: "Time Attack Sprint",
      difficulty: `${selectedDuration}s`,
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Submit final score to server
  const handleGameOver = useCallback(
    async (
      dur: number,
      wordsCount: number,
      correctChars: number,
      totalChars: number,
      errors: number
    ) => {
      setGameState("gameover");
      setIsSubmitting(true);

      const acc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
      const wpm = Math.round((correctChars / 5) / (dur / 60));
      const score = Math.round(wpm * (acc / 100) * 12);

      trackEvent("typing_game_completed", {
        game_id: "time_attack",
        game_name: "Time Attack Sprint",
        score: score,
        wpm: wpm,
        accuracy: acc,
      });

      try {
        const token = localStorage.getItem("typeblast_token");
        const res = await fetch("/api/games/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            gameType: "time-attack",
            wpm,
            accuracy: acc,
            score,
            duration: dur,
            wordsTyped: wordsCount,
            totalChars,
            correctChars,
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
        console.error("Time Attack submit error:", err);
        setSubmitError("Failed to reach server for validation.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [user]
  );

  // Timer countdown hook
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleGameOver(
              selectedDuration,
              wordsCompleted,
              correctCharsCount,
              totalCharsTyped,
              errorCount
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [
    gameState,
    timeLeft,
    selectedDuration,
    wordsCompleted,
    correctCharsCount,
    totalCharsTyped,
    errorCount,
    handleGameOver,
  ]);

  // Handle word input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Check spacebar or word completion
    if (val.endsWith(" ")) {
      const trimmed = val.trim().toLowerCase();
      const currentWord = wordsList[activeWordIndex].toLowerCase();

      if (trimmed === currentWord) {
        soundEngine.playKeyPress(true, false);
        setWordsCompleted((w) => w + 1);
        setCorrectCharsCount((c) => c + currentWord.length + 1); // +1 for space
        setTotalCharsTyped((t) => t + currentWord.length + 1);
      } else {
        soundEngine.playKeyPress(true, true);
        setErrorCount((err) => err + 1);
        setTotalCharsTyped((t) => t + trimmed.length + 1);
      }

      // Advance to next word
      setActiveWordIndex((i) => i + 1);
      setTypedValue("");
    } else {
      soundEngine.playKeyPress();
      setTypedValue(val);
    }
  };

  const currentWord = wordsList[activeWordIndex] || "";
  const liveAcc = totalCharsTyped > 0 ? Math.round((correctCharsCount / totalCharsTyped) * 100) : 100;
  const elapsed = selectedDuration - timeLeft;
  const liveWpm = elapsed > 0 ? Math.round((correctCharsCount / 5) / (elapsed / 60)) : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Arcade Mode 2: Time Attack Sprint</span>
          </div>
          <h2 className="text-2xl font-black text-white">Time Attack Speed Test</h2>
          <p className="text-xs text-slate-400">
            Type as many continuous words as possible before the clock expires!
          </p>
        </div>

        {/* Duration selector tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[15, 30, 60].map((dur) => (
            <button
              key={dur}
              disabled={gameState === "playing"}
              onClick={() => {
                setSelectedDuration(dur as TimeOption);
                setTimeLeft(dur);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedDuration === dur
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {dur}s Sprint
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="relative min-h-[380px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
        {/* State 1: Instructions & Start Modal */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-black text-white">Time Attack Rules</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                1. Select your sprint time ({selectedDuration} seconds).<br />
                2. Type each word accurately followed by a <strong>Spacebar</strong>.<br />
                3. Maintain high accuracy to maximize your total WPM speed score.<br />
                4. Scores are verified and saved directly on the server.
              </p>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/20 transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start {selectedDuration}s Sprint</span>
            </button>
          </div>
        )}

        {/* State 2: Active Gameplay */}
        {gameState === "playing" && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            {/* HUD Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-xl font-mono font-black text-cyan-300">
                  {timeLeft}s
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Words</span>
                  <span className="font-mono font-bold text-white text-base">{wordsCompleted}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">WPM</span>
                  <span className="font-mono font-bold text-cyan-400 text-base">{liveWpm}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Accuracy</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">{liveAcc}%</span>
                </div>
              </div>
            </div>

            {/* Words Stream Board */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
              <div className="flex flex-wrap gap-2.5 text-lg font-mono font-medium leading-relaxed">
                {wordsList.slice(activeWordIndex, activeWordIndex + 12).map((word, idx) => {
                  const isCurrent = idx === 0;

                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        isCurrent
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold scale-105 shadow-md shadow-cyan-500/10"
                          : "text-slate-400 bg-slate-950/50 border border-slate-800/50"
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Input Bar */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={typedValue}
                onChange={handleInputChange}
                placeholder="Type current word and press space..."
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full p-4 bg-slate-900 border border-cyan-500/50 rounded-xl text-cyan-300 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* State 3: Game Over Results */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Time Attack Complete!</h3>
              <p className="text-xs text-slate-400">{selectedDuration} Second Sprint Finish</p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Net WPM</div>
                <div className="text-lg font-mono font-black text-cyan-400">
                  {Math.round((correctCharsCount / 5) / (selectedDuration / 60))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</div>
                <div className="text-lg font-mono font-bold text-emerald-400">{liveAcc}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Words Typed</div>
                <div className="text-lg font-mono font-bold text-white">{wordsCompleted}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Sprint Time</div>
                <div className="text-lg font-mono font-bold text-slate-300">{selectedDuration}s</div>
              </div>
            </div>

            {/* Server Validation Status */}
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

            {/* Buttons */}
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Sprint</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
