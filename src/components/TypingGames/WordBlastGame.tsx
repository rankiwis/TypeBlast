import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Flame,
  Zap,
  RotateCcw,
  Play,
  Heart,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award
} from "lucide-react";
import { soundEngine } from "../../utils/sound";
import { COMMON_WORDS } from "../../utils/textGenerator";
import { useAuth } from "../../context/AuthContext";
import { trackEvent } from "../../utils/analytics";

interface FallingWord {
  id: string;
  word: string;
  x: number; // percentage left offset
  y: number; // percentage top offset
  speed: number;
}

export const WordBlastGame: React.FC = () => {
  const { user, token: authToken } = useAuth();

  // Game state
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [typedInput, setTypedInput] = useState<string>("");

  // Stats tracking for accuracy & WPM
  const [wordsBlasted, setWordsBlasted] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Server validation result
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verifiedRecord, setVerifiedRecord] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to pick word based on difficulty level
  const getRandomWordForLevel = useCallback((lvl: number): string => {
    let filtered = COMMON_WORDS;
    if (lvl === 1) {
      filtered = COMMON_WORDS.filter((w) => w.length <= 4);
    } else if (lvl === 2) {
      filtered = COMMON_WORDS.filter((w) => w.length <= 6);
    }
    if (filtered.length === 0) filtered = COMMON_WORDS;
    return filtered[Math.floor(Math.random() * filtered.length)];
  }, []);

  // Start / Reset Game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setLevel(1);
    setFallingWords([]);
    setTypedInput("");
    setWordsBlasted(0);
    setCorrectChars(0);
    setTotalCharsTyped(0);
    setErrorCount(0);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setVerifiedRecord(null);
    setSubmitError(null);

    // Initial words spawn
    const firstWord = getRandomWordForLevel(1);
    setFallingWords([
      {
        id: "w_" + Math.random().toString(36).substring(2, 9),
        word: firstWord,
        x: 20 + Math.floor(Math.random() * 60),
        y: 5,
        speed: 0.8,
      },
    ]);

    trackEvent("typing_game_started", {
      game_id: "word_blast",
      game_name: "Word Blast Arena",
      difficulty: "level_1",
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Submit Score to Server upon Game Over
  const handleGameOver = useCallback(
    async (
      finalScore: number,
      finalWords: number,
      finalCorrect: number,
      finalTotal: number,
      finalErrors: number,
      durationSec: number
    ) => {
      setGameState("gameover");
      setIsSubmitting(true);

      const calculatedDuration = Math.max(5, durationSec);
      const acc = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 100;
      const wpm = Math.round((finalCorrect / 5) / (calculatedDuration / 60));

      trackEvent("typing_game_completed", {
        game_id: "word_blast",
        game_name: "Word Blast Arena",
        score: finalScore,
        wpm: wpm,
        accuracy: acc,
      });

      try {
        const token = authToken || localStorage.getItem("typeblast_auth_token");
        const res = await fetch("/api/games/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            gameType: "word-blast",
            wpm,
            accuracy: acc,
            score: finalScore,
            duration: calculatedDuration,
            wordsTyped: finalWords,
            totalChars: finalTotal,
            correctChars: finalCorrect,
            errorCount: finalErrors,
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
        console.error("Word Blast submit error:", err);
        setSubmitError("Failed to reach server for validation.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [user]
  );

  // Game Loop (Update falling words positions & level progression)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing") {
      interval = setInterval(() => {
        const nowSec = Math.floor((Date.now() - startTime) / 1000);
        setElapsedSeconds(nowSec);

        setFallingWords((prev) => {
          // Move existing words down according to their speed & level multiplier
          const speedMultiplier = 1 + (level - 1) * 0.25;
          const updated = prev.map((w) => ({
            ...w,
            y: w.y + w.speed * speedMultiplier,
          }));

          // Check if any word reached danger threshold (>= 88%)
          const hitBottom = updated.filter((w) => w.y >= 88);
          if (hitBottom.length > 0) {
            soundEngine.playKeyPress(false, true);

            // Deduct lives
            setLives((l) => {
              const newLives = l - hitBottom.length;
              if (newLives <= 0) {
                // Trigger Game Over
                const finalDuration = Math.max(5, Math.floor((Date.now() - startTime) / 1000));
                handleGameOver(score, wordsBlasted, correctChars, totalCharsTyped + hitBottom.length * 4, errorCount + hitBottom.length, finalDuration);
              }
              return Math.max(0, newLives);
            });

            // Count penalized errors
            setErrorCount((e) => e + hitBottom.length);
            setTotalCharsTyped((t) => t + hitBottom.length * 4);
          }

          const alive = updated.filter((w) => w.y < 88);

          // Calculate max target words on screen based on level
          const maxWords = Math.min(6, 2 + Math.floor(level / 2));
          if (alive.length < maxWords && Math.random() > 0.35) {
            const wordText = getRandomWordForLevel(level);
            alive.push({
              id: "w_" + Math.random().toString(36).substring(2, 9),
              word: wordText,
              x: 10 + Math.floor(Math.random() * 75),
              y: 0,
              speed: 0.6 + Math.random() * 0.8,
            });
          }

          return alive;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [
    gameState,
    level,
    startTime,
    score,
    wordsBlasted,
    correctChars,
    totalCharsTyped,
    errorCount,
    getRandomWordForLevel,
    handleGameOver,
  ]);

  // Handle Input typing matching
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedInput(val);
    const cleanVal = val.trim().toLowerCase();

    setTotalCharsTyped((t) => t + 1);

    // Search for match in falling words
    const matchedIndex = fallingWords.findIndex(
      (w) => w.word.toLowerCase() === cleanVal
    );

    if (matchedIndex !== -1) {
      const matchedWord = fallingWords[matchedIndex];
      soundEngine.playLaserShot();

      // Update score and blast count
      const points = matchedWord.word.length * 20 * level;
      const newScore = score + points;
      const newBlasted = wordsBlasted + 1;

      setScore(newScore);
      setWordsBlasted(newBlasted);
      setCorrectChars((c) => c + matchedWord.word.length);

      // Increase level gradually every 5 words
      const newLevel = Math.min(10, 1 + Math.floor(newBlasted / 5));
      if (newLevel > level) {
        setLevel(newLevel);
        soundEngine.playFinishChime();
      }

      // Remove word
      setFallingWords((prev) => prev.filter((_, idx) => idx !== matchedIndex));
      setTypedInput("");
    } else {
      soundEngine.playKeyPress();
    }
  };

  const calculatedAccuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
  const calculatedWpm = elapsedSeconds > 0 ? Math.round((correctChars / 5) / (elapsedSeconds / 60)) : 0;

  return (
    <div className="space-y-6">
      {/* Game Header Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Arcade Mode 1: Word Blast</span>
          </div>
          <h2 className="text-2xl font-black text-white">Word Blast Speed Defense</h2>
          <p className="text-xs text-slate-400">
            Type descending words before they touch the ground. High speed & accuracy unlock higher difficulty levels!
          </p>
        </div>

        <div className="flex items-center gap-4">
          {gameState === "playing" && (
            <button
              onClick={startGame}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="relative min-h-[380px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
        {/* State 1: Instructions & Start Modal */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <Zap className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-black text-white">Word Blast Rules</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                1. Words will fall from top to bottom.<br />
                2. Type the exact word in the input box to blast it.<br />
                3. Every 5 words blasted advances your <strong>Difficulty Level</strong>.<br />
                4. Do not let words hit the danger line, or you lose a life!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> 3 Health Lives</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Multiplier Bonus</span>
              <span>•</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Server Verified</span>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Word Blast</span>
            </button>
          </div>
        )}

        {/* State 2: Active Gameplay Stage */}
        {gameState === "playing" && (
          <>
            {/* Top Game HUD */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 z-10 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-rose-400 font-bold">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>{lives} Lives</span>
                </div>
                <div className="text-slate-400">
                  Level: <strong className="text-cyan-400 font-mono text-sm">{level}</strong>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">WPM</span>
                  <span className="font-mono font-bold text-slate-200">{calculatedWpm}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Accuracy</span>
                  <span className="font-mono font-bold text-emerald-400">{calculatedAccuracy}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Score</span>
                  <span className="font-mono font-black text-amber-400 text-base">{score}</span>
                </div>
              </div>
            </div>

            {/* Falling Words Arena */}
            <div className="relative flex-1 my-2 overflow-hidden min-h-[220px]">
              {fallingWords.map((w) => {
                const isMatchingPrefix = typedInput.trim().length > 0 && w.word.toLowerCase().startsWith(typedInput.trim().toLowerCase());

                return (
                  <div
                    key={w.id}
                    style={{ left: `${w.x}%`, top: `${w.y}%` }}
                    className={`absolute px-3 py-1.5 rounded-xl text-sm font-mono font-bold border transition-all duration-75 shadow-lg ${
                      isMatchingPrefix
                        ? "bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 scale-110 z-10"
                        : "bg-slate-900/90 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10"
                    }`}
                  >
                    {w.word}
                  </div>
                );
              })}
            </div>

            {/* Danger Line */}
            <div className="w-full border-t-2 border-dashed border-rose-500/40 my-1 relative">
              <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-mono text-[9px] uppercase font-bold">
                Danger Zone
              </span>
            </div>

            {/* Bottom Keyboard Input Bar */}
            <div className="relative mt-2">
              <input
                ref={inputRef}
                type="text"
                value={typedInput}
                onChange={handleInputChange}
                placeholder="Type displayed word here..."
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full p-3.5 bg-slate-900 border border-cyan-500/50 rounded-xl text-cyan-300 font-mono text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-slate-500"
              />
            </div>
          </>
        )}

        {/* State 3: Game Over Results Screen */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Blast Game Over</h3>
              <p className="text-xs text-slate-400">Word defense limit reached!</p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Final Score</div>
                <div className="text-lg font-mono font-black text-amber-400">{score}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Words Blasted</div>
                <div className="text-lg font-mono font-bold text-white">{wordsBlasted}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">WPM Speed</div>
                <div className="text-lg font-mono font-bold text-cyan-400">{calculatedWpm}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</div>
                <div className="text-lg font-mono font-bold text-emerald-400">{calculatedAccuracy}%</div>
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
                <span className="text-amber-400 text-[11px]">{submitError || "Stored locally"}</span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
