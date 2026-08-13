import React, { useState } from "react";
import { Flame, Clock, Flag, Zap, ShieldCheck, Trophy, Sparkles } from "lucide-react";
import { WordBlastGame } from "./WordBlastGame";
import { TimeAttackGame } from "./TimeAttackGame";
import { TypingRaceGame } from "./TypingRaceGame";

export type GameMode = "word-blast" | "time-attack" | "typing-race";

export const GamesHubView: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameMode>("word-blast");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Game Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {[
            {
              id: "word-blast",
              label: "1. Word Blast",
              description: "Descend & Vaporize Target Words",
              icon: <Flame className="w-4 h-4 text-amber-400" />,
            },
            {
              id: "time-attack",
              label: "2. Time Attack",
              description: "Continuous Word Sprint Timer",
              icon: <Clock className="w-4 h-4 text-cyan-400" />,
            },
            {
              id: "typing-race",
              label: "3. Typing Race",
              description: "Passage Grand Prix vs Bots",
              icon: <Flag className="w-4 h-4 text-purple-400" />,
            },
          ].map((game) => {
            const isActive = activeGame === game.id;

            return (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id as GameMode)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-800 text-white border border-slate-700/80 shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive ? "bg-slate-950" : "bg-slate-800/60"
                  }`}
                >
                  {game.icon}
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-white text-xs">{game.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal hidden sm:block">
                    {game.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Verified Server Protection Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Server-Side Score Validation</span>
        </div>
      </div>

      {/* Render Selected Active Game */}
      <div className="transition-all duration-200">
        {activeGame === "word-blast" && <WordBlastGame />}
        {activeGame === "time-attack" && <TimeAttackGame />}
        {activeGame === "typing-race" && <TypingRaceGame />}
      </div>
    </div>
  );
};
