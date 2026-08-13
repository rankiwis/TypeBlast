import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Zap,
  Flag,
  Shield,
  Users,
  Trophy,
  Play,
  RotateCcw,
  Heart,
  Sparkles,
  Flame,
  Award
} from "lucide-react";
import { soundEngine } from "../../utils/sound";
import { COMMON_WORDS } from "../../utils/textGenerator";

type GameSubMode = "blast" | "race" | "defense" | "multiplayer";

export const GamesHubView: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameSubMode>("blast");

  // Speed Blast Game State
  const [blastRunning, setBlastRunning] = useState(false);
  const [blastScore, setBlastScore] = useState(0);
  const [blastLives, setBlastLives] = useState(3);
  const [fallingWords, setFallingWords] = useState<{ id: string; word: string; x: number; y: number; speed: number }[]>([]);
  const [typedInput, setTypedInput] = useState("");
  const [blastHighscore, setBlastHighscore] = useState(1240);

  // Nitro Race State
  const [raceRunning, setRaceRunning] = useState(false);
  const [raceText, setRaceText] = useState("the fast race car speeds past the finish line with maximum wpm velocity");
  const [raceInput, setRaceInput] = useState("");
  const [userPos, setUserPos] = useState(0);
  const [botPositions, setBotPositions] = useState([0, 0, 0]);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceRank, setRaceRank] = useState<number | null>(null);

  // Speed Blast Game Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (blastRunning && blastLives > 0) {
      interval = setInterval(() => {
        setFallingWords((prev) => {
          // Move words down
          const updated = prev.map((w) => ({ ...w, y: w.y + w.speed }));

          // Filter out words that hit bottom (y > 85%)
          const missed = updated.filter((w) => w.y > 85);
          if (missed.length > 0) {
            setBlastLives((l) => {
              const newLives = l - missed.length;
              if (newLives <= 0) {
                setBlastRunning(false);
              }
              return Math.max(0, newLives);
            });
            soundEngine.playKeyPress(false, true);
          }

          const alive = updated.filter((w) => w.y <= 85);

          // Randomly spawn new word if less than 5
          if (alive.length < 5 && Math.random() > 0.4) {
            const randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
            alive.push({
              id: Math.random().toString(),
              word: randomWord,
              x: Math.floor(Math.random() * 70) + 10, // 10% to 80% left offset
              y: 0,
              speed: 1.2 + Math.random() * 1.5,
            });
          }

          return alive;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [blastRunning, blastLives]);

  // Handle word typing match in Speed Blast
  const handleBlastInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setTypedInput(e.target.value);

    // Check if input matches any falling word
    const matchedIndex = fallingWords.findIndex((w) => w.word.toLowerCase() === val);
    if (matchedIndex !== -1) {
      soundEngine.playLaserShot();
      setBlastScore((s) => {
        const nextScore = s + 100;
        if (nextScore > blastHighscore) setBlastHighscore(nextScore);
        return nextScore;
      });
      setFallingWords((prev) => prev.filter((_, idx) => idx !== matchedIndex));
      setTypedInput("");
    }
  };

  const startBlastGame = () => {
    setBlastScore(0);
    setBlastLives(3);
    setFallingWords([]);
    setTypedInput("");
    setBlastRunning(true);
  };

  // Nitro Race Game Loop
  useEffect(() => {
    let raceInterval: NodeJS.Timeout;
    if (raceRunning && !raceFinished) {
      raceInterval = setInterval(() => {
        setBotPositions((prev) => {
          const next = prev.map((pos) => pos + (0.5 + Math.random() * 0.8));
          if (next.some((p) => p >= 100)) {
            // A bot finished
          }
          return next;
        });
      }, 200);
    }
    return () => clearInterval(raceInterval);
  }, [raceRunning, raceFinished]);

  const handleRaceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRaceInput(val);

    if (!raceRunning) setRaceRunning(true);

    const progress = Math.min(100, (val.length / raceText.length) * 100);
    setUserPos(progress);
    soundEngine.playKeyPress();

    if (val.length >= raceText.length) {
      setRaceFinished(true);
      setRaceRunning(false);
      soundEngine.playFinishChime();

      // Determine rank
      const finishedBots = botPositions.filter((p) => p >= 100).length;
      setRaceRank(finishedBots + 1);
    }
  };

  const startRaceGame = () => {
    setRaceText("the fast nitro racing vehicle blasts down the highway toward victory");
    setRaceInput("");
    setUserPos(0);
    setBotPositions([0, 0, 0]);
    setRaceFinished(false);
    setRaceRank(null);
    setRaceRunning(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Game Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          {[
            { id: "blast", label: "Speed Blast", icon: <Zap className="w-4 h-4 text-amber-400" /> },
            { id: "race", label: "Nitro Typing Race", icon: <Flag className="w-4 h-4 text-cyan-400" /> },
            { id: "defense", label: "Word Tower Defense", icon: <Shield className="w-4 h-4 text-emerald-400" /> },
            { id: "multiplayer", label: "Live Arena", icon: <Users className="w-4 h-4 text-purple-400" /> },
          ].map((game) => (
            <button
              key={game.id}
              onClick={() => {
                setActiveGame(game.id as GameSubMode);
                soundEngine.playKeyPress();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeGame === game.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {game.icon}
              <span>{game.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GAME 1: SPEED BLAST (FALLING WORDS ARCADE) */}
      {activeGame === "blast" && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Speed Blast Arcade</span>
              </h3>
              <p className="text-xs text-slate-400">Type falling words to fire lasers before they reach ground!</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-rose-400 font-bold">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{blastLives} Lives</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Score</div>
                <div className="text-xl font-extrabold text-amber-400 font-mono">{blastScore}</div>
              </div>
            </div>
          </div>

          {/* Canvas Box */}
          <div className="relative h-[320px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
            {!blastRunning ? (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 space-y-4 text-center z-20">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-2xl font-black text-white">Speed Blast Attack</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Words fall from space. Type each word accurately to vaporize it before it crashes!
                </p>
                <button
                  onClick={startBlastGame}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Blast Game</span>
                </button>
              </div>
            ) : (
              <>
                {/* Falling words layer */}
                <div className="relative flex-1">
                  {fallingWords.map((w) => (
                    <div
                      key={w.id}
                      style={{ left: `${w.x}%`, top: `${w.y}%` }}
                      className="absolute px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-sm font-bold shadow-lg shadow-cyan-500/10 animate-bounce"
                    >
                      {w.word}
                    </div>
                  ))}
                </div>

                {/* Ground Danger Line */}
                <div className="w-full border-t-2 border-dashed border-rose-500/50 my-2" />

                {/* Laser Cannon Input Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={typedInput}
                    onChange={handleBlastInput}
                    placeholder="Type words here to fire..."
                    autoFocus
                    className="w-full p-3 bg-slate-900 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* GAME 2: NITRO TYPING RACE */}
      {activeGame === "race" && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Flag className="w-5 h-5 text-cyan-400" />
                <span>Nitro Typing Race</span>
              </h3>
              <p className="text-xs text-slate-400">Race against AI bots! Higher WPM accelerates your sports car.</p>
            </div>

            <button
              onClick={startRaceGame}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Race</span>
            </button>
          </div>

          {/* Race Track Canvas */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            {/* Player Track */}
            <div className="space-y-1">
              <div className="text-[10px] text-cyan-400 font-bold uppercase">You (Player) 🏎️</div>
              <div className="relative h-10 bg-slate-900 rounded-lg border border-cyan-500/30 overflow-hidden flex items-center px-2">
                <div
                  style={{ left: `${Math.min(92, userPos)}%` }}
                  className="absolute transition-all duration-150 text-xl"
                >
                  🏎️
                </div>
                <div className="absolute right-2 text-xs font-mono text-slate-500">FINISH 🏁</div>
              </div>
            </div>

            {/* AI Bot 1 Track */}
            {["Bot Turbo 🤖", "Bot Apex ⚡", "Bot Phantom 👻"].map((botName, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-[10px] text-slate-400 font-medium">{botName}</div>
                <div className="relative h-8 bg-slate-900/60 rounded-lg border border-slate-800 overflow-hidden flex items-center px-2">
                  <div
                    style={{ left: `${Math.min(92, botPositions[idx])}%` }}
                    className="absolute transition-all duration-200 text-base"
                  >
                    🚗
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Typing Prompt Input */}
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-lg">
              {raceText}
            </div>
            <input
              type="text"
              value={raceInput}
              onChange={handleRaceInput}
              disabled={raceFinished}
              placeholder="Start typing prompt to accelerate..."
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          {raceFinished && (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-2">
              <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">Race Finished!</h4>
              <p className="text-xs text-slate-300">
                You placed <span className="font-bold text-cyan-400">#{raceRank || 1}</span> in this grand prix!
              </p>
            </div>
          )}
        </div>
      )}

      {/* GAME 3 & 4 PLACEHOLDERS */}
      {(activeGame === "defense" || activeGame === "multiplayer") && (
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
          <Sparkles className="w-10 h-10 text-purple-400 mx-auto" />
          <h3 className="text-2xl font-bold text-white capitalize">{activeGame} Arena Mode</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Interactive real-time multiplayer lobbies and castle defense game mode loaded with daily global events!
          </p>
          <button
            onClick={startBlastGame}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Launch Speed Blast Arcade
          </button>
        </div>
      )}
    </div>
  );
};
