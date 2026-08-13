import React, { useState } from "react";
import { Trophy, Medal, Crown, Flame, Award, Filter } from "lucide-react";
import { LeaderboardEntry } from "../../types";

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", username: "ApexTyper_99", avatar: "⚡", wpm: 142, accuracy: 99.4, testMode: "30s Words", date: "Today", badge: "Master" },
  { id: "2", username: "QuantumSwift", avatar: "🚀", wpm: 138, accuracy: 98.9, testMode: "30s Words", date: "Today", badge: "Master" },
  { id: "3", username: "CyberKeys_X", avatar: "💎", wpm: 129, accuracy: 97.8, testMode: "30s Words", date: "Today", badge: "Diamond" },
  { id: "4", username: "VelocityGirl", avatar: "🌸", wpm: 121, accuracy: 99.1, testMode: "30s Words", date: "Yesterday", badge: "Diamond" },
  { id: "5", username: "KeyboardNinja", avatar: "🥷", wpm: 115, accuracy: 98.2, testMode: "30s Words", date: "2 days ago", badge: "Platinum" },
  { id: "6", username: "SmoothFingerz", avatar: "⌨️", wpm: 108, accuracy: 97.5, testMode: "30s Words", date: "3 days ago", badge: "Platinum" },
  { id: "7", username: "CodeRunner_404", avatar: "💻", wpm: 102, accuracy: 96.9, testMode: "30s Words", date: "4 days ago", badge: "Gold" },
];

export const LeaderboardView: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<"daily" | "weekly" | "alltime">("daily");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Global TypeBlast Hall of Fame</span>
          </h3>
          <p className="text-xs text-slate-400">Top verified speed records across 15s, 30s & 60s typing sprints</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "daily", label: "Today" },
            { id: "weekly", label: "This Week" },
            { id: "alltime", label: "All-Time" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTimeFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeFilter === f.id
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Typer</th>
                <th className="py-3 px-4">Tier Badge</th>
                <th className="py-3 px-4 text-right">Speed (WPM)</th>
                <th className="py-3 px-4 text-right">Accuracy</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
              {MOCK_LEADERBOARD.map((user, idx) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    {idx === 0 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                        🥇 1
                      </span>
                    ) : idx === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/40 flex items-center justify-center font-bold">
                        🥈 2
                      </span>
                    ) : idx === 2 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/40 flex items-center justify-center font-bold">
                        🥉 3
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono pl-2">#{idx + 1}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 flex items-center gap-2">
                    <span className="text-base">{user.avatar}</span>
                    <span className="font-bold text-slate-200">{user.username}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.badge === "Master"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : user.badge === "Diamond"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {user.badge}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-black text-cyan-400 text-sm">
                    {user.wpm}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-emerald-400">
                    {user.accuracy}%
                  </td>

                  <td className="py-3 px-4 text-right text-slate-500">
                    {user.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
