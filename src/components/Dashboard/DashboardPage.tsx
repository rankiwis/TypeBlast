import React from "react";
import {
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  Flame,
  Clock,
  TrendingUp,
  Award,
  Gamepad2,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  BarChart2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SeoHead } from "../SEO/SeoHead";

interface DashboardPageProps {
  onNavigatePath: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigatePath }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading your TypeBlast performance dashboard...</p>
      </div>
    );
  }

  // Guest view if not logged in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <SeoHead
          title="TypeBlast Dashboard | Track Your Typing Progress"
          description="View your personal best WPM, average accuracy, test history, and progress over time on TypeBlast."
        />

        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Unlock Your Personal Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Create a free account or log in to automatically record test histories, track your WPM progress over time, earn badges, and build daily streaks.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigatePath("/signup/")}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all"
            >
              Create Free Account
            </button>
            <button
              onClick={() => onNavigatePath("/login/")}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    displayName,
    username,
    personalBestWpm,
    averageWpm,
    averageAccuracy,
    testsCompleted,
    currentStreak,
    testHistory,
    gameScores,
    achievements,
    xp
  } = user;

  // Chart data calculation for Progress Over Time (WPM and Accuracy trend lines)
  const historyForChart = [...testHistory].reverse(); // chronological order
  const maxWpm = Math.max(100, ...historyForChart.map((t) => t.wpm));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <SeoHead
        title={`${displayName || username}'s Dashboard | TypeBlast`}
        description="Your personal typing performance dashboard with WPM graphs, accuracy metrics, daily streak counter, and recent test results."
      />

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
              Official Dashboard
            </span>
            <span className="text-xs text-slate-400 font-mono">XP: {xp}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {displayName || username}!
          </h1>
          <p className="text-xs text-slate-400">
            Keep practicing daily to build muscle memory and break your personal best speed records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigatePath("/typing-test/")}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Take Speed Test</span>
          </button>
        </div>
      </div>

      {/* MANDATORY DASHBOARD SECTIONS 1-5: STAT CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Section 1: Personal Best */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">1. Personal Best</span>
            <Trophy className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{personalBestWpm}</div>
          <div className="text-[11px] text-amber-400 font-medium">All-Time Peak WPM</div>
        </div>

        {/* Section 2: Average WPM */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg group">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">2. Average WPM</span>
            <Zap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{averageWpm}</div>
          <div className="text-[11px] text-cyan-400 font-medium">Overall Speed Avg</div>
        </div>

        {/* Section 3: Average Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg group">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">3. Average Accuracy</span>
            <Target className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{averageAccuracy}%</div>
          <div className="text-[11px] text-emerald-400 font-medium">Keystroke Precision</div>
        </div>

        {/* Section 4: Tests Completed */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg group">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">4. Tests Completed</span>
            <CheckCircle2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{testsCompleted}</div>
          <div className="text-[11px] text-purple-400 font-medium">Validated Sessions</div>
        </div>

        {/* Section 5: Current Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg group">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">5. Current Streak</span>
            <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{currentStreak}d</div>
          <div className="text-[11px] text-amber-400 font-medium">Consecutive Days</div>
        </div>
      </div>

      {/* SECTION 7: PROGRESS OVER TIME (VISUAL CHART GRAPH) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-black text-white">7. Progress Over Time</h2>
            </div>
            <p className="text-xs text-slate-400">Speed (WPM) and Accuracy trends across your completed typing tests.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-3 h-3 rounded-full bg-cyan-400" /> WPM
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-400" /> Accuracy %
            </span>
          </div>
        </div>

        {historyForChart.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-950 border border-slate-800/80 text-center space-y-3">
            <TrendingUp className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No completed tests recorded yet. Complete your first typing test to generate progress trend graphs!</p>
            <button
              onClick={() => onNavigatePath("/typing-test/")}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Take First Test
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
            {/* SVG Trend Graph */}
            <div className="h-48 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                {/* Background grid lines */}
                <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#1e293b" strokeDasharray="4 4" />

                {/* WPM Trend Line */}
                {historyForChart.length > 1 ? (
                  <polyline
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={historyForChart
                      .map((t, idx) => {
                        const x = (idx / (historyForChart.length - 1)) * 500;
                        const y = 140 - (t.wpm / maxWpm) * 120;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />
                ) : null}

                {/* Accuracy Trend Line */}
                {historyForChart.length > 1 ? (
                  <polyline
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                    points={historyForChart
                      .map((t, idx) => {
                        const x = (idx / (historyForChart.length - 1)) * 500;
                        const y = 140 - (t.accuracy / 100) * 120;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />
                ) : null}

                {/* Data Points */}
                {historyForChart.map((t, idx) => {
                  const x = historyForChart.length === 1 ? 250 : (idx / (historyForChart.length - 1)) * 500;
                  const yWpm = 140 - (t.wpm / maxWpm) * 120;
                  return (
                    <g key={t.id || idx}>
                      <circle cx={x} cy={yWpm} r="4" fill="#06b6d4" />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>First Session</span>
              <span>{historyForChart.length} Total Sessions Plotted</span>
              <span>Latest Session</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: RECENT RESULTS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>6. Recent Test Results</span>
            </h2>
            <p className="text-xs text-slate-400">
              Immutable session history stored securely on your account. Historical results cannot be directly edited.
            </p>
          </div>

          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            {testHistory.length} Sessions Logged
          </span>
        </div>

        {testHistory.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No test results recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Net WPM</th>
                  <th className="py-3 px-4">Raw WPM</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {testHistory.slice(0, 10).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {new Date(t.timestamp).toLocaleDateString()} {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 text-sm">{t.wpm} WPM</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{t.rawWpm || t.wpm}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{t.accuracy}%</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{t.duration}s</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-mono text-slate-400">{t.category}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Validated
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADDITIONAL PANELS: GAME SCORES & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Game High Scores */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <span>Arcade Game Records</span>
          </h3>

          {gameScores.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No game scores recorded yet. Play games in the Arcade Hub!</p>
          ) : (
            <div className="space-y-2">
              {gameScores.slice(0, 5).map((g, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{g.gameName}</div>
                    <div className="text-[10px] text-slate-400">{new Date(g.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-purple-400 text-sm">{g.score} pts</div>
                    <div className="text-[10px] text-slate-400">{g.wpm} WPM • {g.accuracy}% Acc</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unlocked Achievements */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Badges & Achievements</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => {
              const isUnlocked = ach.unlockedAt !== null;
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                    isUnlocked
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60"
                  }`}
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <div className="font-bold text-xs text-white">{ach.title}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{ach.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
