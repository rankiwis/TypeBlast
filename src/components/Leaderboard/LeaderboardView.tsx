import React, { useState, useEffect, useCallback } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  Award,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Sparkles,
  ArrowUpDown,
  SlidersHorizontal
} from "lucide-react";
import { SeoHead } from "../SEO/SeoHead";
import { useAuth } from "../../context/AuthContext";
import { trackEvent } from "../../utils/analytics";

export interface LeaderboardEntry {
  id: string;
  rank: number;
  displayName: string;
  username: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  score: number;
  duration: number;
  category: string;
  timestamp: string;
  badge: string;
  verified: boolean;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StatsSummary {
  totalSubmissions: number;
  topWpm: number;
  avgWpm: number;
  avgAccuracy: number;
}

export type TimePeriod = "today" | "week" | "month" | "alltime";

interface LeaderboardViewProps {
  onNavigatePath?: (path: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onNavigatePath }) => {
  const { user } = useAuth();

  // State
  const [period, setPeriod] = useState<TimePeriod>("alltime");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [statsSummary, setStatsSummary] = useState<StatsSummary>({ totalSubmissions: 0, topWpm: 0, avgWpm: 0, avgAccuracy: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // User rank in current period
  const userEntry = user ? entries.find((e) => e.username.toLowerCase() === user.username.toLowerCase() || e.displayName.toLowerCase() === (user.displayName || user.username).toLowerCase()) : null;

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        period,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (durationFilter !== "all") {
        params.append("duration", durationFilter);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load leaderboard entries.");
      }

      const data = await res.json();
      if (data.status === "success") {
        setEntries(data.entries || []);
        setPagination(data.pagination || { total: 0, page: 1, limit, totalPages: 1 });
        setStatsSummary(data.statsSummary || { totalSubmissions: 0, topWpm: 0, avgWpm: 0, avgAccuracy: 0 });

        trackEvent("leaderboard_viewed", {
          category: durationFilter,
          timeframe: period,
        });
      } else {
        throw new Error(data.error || "Server returned error loading leaderboard.");
      }
    } catch (err: any) {
      console.error("Leaderboard fetch error:", err);
      setError(err.message || "Unable to connect to leaderboard service.");
    } finally {
      setIsLoading(false);
    }
  }, [period, page, limit, durationFilter, searchQuery]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Reset page to 1 when filters change
  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
    setPage(1);
  };

  const handleDurationChange = (dur: string) => {
    setDurationFilter(dur);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // Helper for relative date formatting
  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}d ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="TypeBlast Global Leaderboard - Today, This Week & All Time Speed Records"
        description="View official verified typing speed rankings across 15s, 30s & 60s typing sprints. Compete for top rank and master typing accuracy."
        canonicalUrl="https://typeblast.com/leaderboard/"
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Verified High Scores & Rankings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Trophy className="w-7 h-7 text-amber-400 animate-pulse" />
              <span>TypeBlast Global Leaderboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Fair, server-validated touch typing benchmarks. Real-time scores calculated using Net WPM, Keystroke Accuracy & Sprint Duration.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => onNavigatePath ? onNavigatePath("/typing-test/") : (window.location.href = "/typing-test/")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wide transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Submit Your Score</span>
            </button>
            <button
              onClick={fetchLeaderboard}
              disabled={isLoading}
              title="Refresh Leaderboard"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Records</div>
            <div className="text-xl font-mono font-black text-white mt-1">
              {statsSummary.totalSubmissions.toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Top WPM ({period})</div>
            <div className="text-xl font-mono font-black text-cyan-400 mt-1">
              {statsSummary.topWpm} <span className="text-xs text-slate-500 font-normal">WPM</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Avg WPM ({period})</div>
            <div className="text-xl font-mono font-black text-purple-400 mt-1">
              {statsSummary.avgWpm} <span className="text-xs text-slate-500 font-normal">WPM</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Avg Accuracy</div>
            <div className="text-xl font-mono font-black text-emerald-400 mt-1">
              {statsSummary.avgAccuracy}%
            </div>
          </div>
        </div>

        {/* User Standing Banner (If logged in) */}
        {user && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 font-black flex items-center justify-center text-sm uppercase">
                {(user.displayName || user.username).substring(0, 1)}
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Logged in as <strong className="text-cyan-300">{user.displayName || user.username}</strong></span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                    PB: {user.personalBestWpm} WPM
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {userEntry ? (
                    <span className="text-emerald-400 font-medium">
                      You are currently ranked <strong className="text-white">#{userEntry.rank}</strong> in this period with {userEntry.wpm} WPM ({userEntry.score} pts)!
                    </span>
                  ) : (
                    <span>Complete a typing test in this period to feature on the global board.</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigatePath ? onNavigatePath("/profile/") : (window.location.href = "/profile/")}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors"
            >
              Change Display Name
            </button>
          </div>
        )}

        {/* Filter & Controls Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Period Tabs: Today, This Week, This Month, All Time */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none">
              {[
                { id: "today", label: "Today" },
                { id: "week", label: "This Week" },
                { id: "month", label: "This Month" },
                { id: "alltime", label: "All Time" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id as TimePeriod)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    period === p.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Sub-Filters: Duration & Search */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Duration filter */}
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Sprint:</span>
                {["all", "15", "30", "60", "120"].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => handleDurationChange(dur)}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-colors ${
                      durationFilter === dur
                        ? "bg-slate-800 text-cyan-300 font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {dur === "all" ? "All" : `${dur}s`}
                  </button>
                ))}
              </div>

              {/* Search typist input */}
              <div className="relative flex-1 min-w-[160px]">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search typist name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchLeaderboard} className="underline font-bold hover:text-white">Retry</button>
          </div>
        )}

        {/* Leaderboard Entries Table / Cards */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <div className="text-xs text-slate-400 font-medium">Fetching verified leaderboard results...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-4">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No leaderboard entries found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No typing runs recorded yet for this duration and period. Be the first to claim the top spot!
              </p>
              <button
                onClick={() => onNavigatePath ? onNavigatePath("/typing-test/") : (window.location.href = "/typing-test/")}
                className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition-colors inline-flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Start Typing Test</span>
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                      <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                      <th className="py-3.5 px-4">Display Name</th>
                      <th className="py-3.5 px-4 text-center">Sprint</th>
                      <th className="py-3.5 px-4 text-right">Net WPM</th>
                      <th className="py-3.5 px-4 text-right">Accuracy</th>
                      <th className="py-3.5 px-4 text-right">Total Score</th>
                      <th className="py-3.5 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                    {entries.map((item) => {
                      const isCurrentUser = user && (item.username.toLowerCase() === user.username.toLowerCase() || item.displayName.toLowerCase() === (user.displayName || user.username).toLowerCase());

                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isCurrentUser
                              ? "bg-cyan-500/10 hover:bg-cyan-500/15"
                              : "hover:bg-slate-800/50"
                          }`}
                        >
                          {/* Rank Column */}
                          <td className="py-3.5 px-4 text-center">
                            {item.rank === 1 ? (
                              <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center justify-center font-black text-xs shadow-sm">
                                🥇
                              </span>
                            ) : item.rank === 2 ? (
                              <span className="w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 inline-flex items-center justify-center font-black text-xs">
                                🥈
                              </span>
                            ) : item.rank === 3 ? (
                              <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-400 border border-amber-700/40 inline-flex items-center justify-center font-black text-xs">
                                🥉
                              </span>
                            ) : (
                              <span className="font-mono text-slate-400 font-bold">#{item.rank}</span>
                            )}
                          </td>

                          {/* Display Name & Tier Badge */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 font-bold text-slate-300 flex items-center justify-center text-xs uppercase">
                                {item.displayName.substring(0, 1)}
                              </div>
                              <div className="space-y-0.5">
                                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                                  <span>{item.displayName}</span>
                                  {isCurrentUser && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                                      You
                                    </span>
                                  )}
                                  {item.verified && (
                                    <CheckCircle2 className="w-3 h-3 text-cyan-400" title="Verified Server Score" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                                      item.badge === "Grandmaster"
                                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                        : item.badge === "Master"
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                        : item.badge === "Diamond"
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                        : item.badge === "Platinum"
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Test Duration Sprint */}
                          <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-xs">
                            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 font-bold">
                              {item.duration}s
                            </span>
                          </td>

                          {/* WPM Speed */}
                          <td className="py-3.5 px-4 text-right font-mono font-black text-cyan-400 text-sm">
                            {item.wpm}
                          </td>

                          {/* Accuracy */}
                          <td className="py-3.5 px-4 text-right font-mono text-emerald-400">
                            {item.accuracy}%
                          </td>

                          {/* Total Score */}
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-300">
                            {item.score.toLocaleString()}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-right text-slate-400 text-[11px] font-mono">
                            {formatTimeAgo(item.timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout (Visible on Small Screens) */}
              <div className="block md:hidden divide-y divide-slate-800/80">
                {entries.map((item) => {
                  const isCurrentUser = user && (item.username.toLowerCase() === user.username.toLowerCase() || item.displayName.toLowerCase() === (user.displayName || user.username).toLowerCase());

                  return (
                    <div
                      key={item.id}
                      className={`p-4 space-y-2.5 transition-colors ${
                        isCurrentUser ? "bg-cyan-500/10" : "hover:bg-slate-800/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-400 text-xs">
                            {item.rank === 1 ? "🥇 #1" : item.rank === 2 ? "🥈 #2" : item.rank === 3 ? "🥉 #3" : `#${item.rank}`}
                          </span>
                          <span className="font-bold text-sm text-white">{item.displayName}</span>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                              You
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-bold">WPM</div>
                          <div className="text-sm font-mono font-black text-cyan-400">{item.wpm}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Accuracy</div>
                          <div className="text-sm font-mono font-bold text-emerald-400">{item.accuracy}%</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Score</div>
                          <div className="text-sm font-mono font-bold text-amber-300">{item.score}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-400">
                  Showing <strong className="text-slate-200">{((pagination.page - 1) * pagination.limit) + 1}</strong> to{" "}
                  <strong className="text-slate-200">{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of{" "}
                  <strong className="text-slate-200">{pagination.total}</strong> typists
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 mr-2 hidden sm:inline">Page {pagination.page} of {pagination.totalPages}</span>

                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1 || isLoading}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 font-mono">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pNum = i + 1;
                      if (pagination.totalPages > 5 && pagination.page > 3) {
                        pNum = pagination.page - 3 + i;
                        if (pNum > pagination.totalPages) pNum = pagination.totalPages - (4 - i);
                      }
                      if (pNum < 1) pNum = 1;

                      return (
                        <button
                          key={pNum}
                          onClick={() => setPage(pNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            pagination.page === pNum
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                              : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page >= pagination.totalPages || isLoading}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
