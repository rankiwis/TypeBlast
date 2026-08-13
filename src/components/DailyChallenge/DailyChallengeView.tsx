import React, { useState } from "react";
import { Calendar, Flame, Trophy, Play, CheckCircle2, Clock } from "lucide-react";
import { soundEngine } from "../../utils/sound";
import { DAILY_CHALLENGES } from "../../utils/textGenerator";
import { TabType } from "../../types";

interface DailyChallengeViewProps {
  setActiveTab: (tab: TabType) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({ setActiveTab }) => {
  const challenge = DAILY_CHALLENGES[0];
  const [completed, setCompleted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Official Daily Sprint • August 12, 2026</span>
          </div>
          <h2 className="text-3xl font-black text-white">{challenge.title}</h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Complete today's official challenge text to maintain your daily streak and earn +{challenge.rewardXp} XP!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily Streak</div>
            <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>7 Days</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Reward</div>
            <div className="text-xl font-bold text-cyan-300">{challenge.badge}</div>
          </div>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
          <span>Target Speed Goal: <strong className="text-cyan-400 font-mono">{challenge.targetWpm} WPM</strong></span>
          <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3.5 h-3.5" /> Resets in 03h 14m</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-lg text-slate-200">
          "{challenge.prompt}"
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              setActiveTab("test");
              soundEngine.playKeyPress();
            }}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-4 h-4" />
            <span>Launch Daily Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
