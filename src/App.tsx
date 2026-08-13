import React, { useState } from "react";
import { TabType, TypingStats } from "./types";
import { Navbar } from "./components/Navbar";
import { TypingTestView } from "./components/TypingTest/TypingTestView";
import { GamesHubView } from "./components/TypingGames/GamesHubView";
import { PracticeView } from "./components/TypingPractice/PracticeView";
import { LessonsView } from "./components/Lessons/LessonsView";
import { DailyChallengeView } from "./components/DailyChallenge/DailyChallengeView";
import { LeaderboardView } from "./components/Leaderboard/LeaderboardView";
import { CertificatesView } from "./components/Certificates/CertificatesView";
import { AICoachView } from "./components/AICoach/AICoachView";
import { KidsView } from "./components/Kids/KidsView";
import { TeachersView } from "./components/Teachers/TeachersView";
import { BlogView } from "./components/Blog/BlogView";
import { PricingView } from "./components/Pricing/PricingView";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("test");
  const [soundProfile, setSoundProfile] = useState<"mechanical" | "soft" | "typewriter" | "retro" | "muted">("mechanical");
  const [lastStats, setLastStats] = useState<TypingStats | null>(null);

  const [userStats, setUserStats] = useState({
    userWpm: 88,
    streak: 7,
    xp: 2450,
  });

  const handleTestComplete = (stats: TypingStats) => {
    setLastStats(stats);
    setUserStats((prev) => ({
      ...prev,
      userWpm: Math.max(prev.userWpm, stats.wpm),
      xp: prev.xp + stats.wpm * 2,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        soundProfile={soundProfile}
        setSoundProfile={setSoundProfile}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === "test" && (
          <TypingTestView onTestComplete={handleTestComplete} setActiveTab={setActiveTab} />
        )}
        {activeTab === "games" && <GamesHubView />}
        {activeTab === "practice" && <PracticeView />}
        {activeTab === "lessons" && <LessonsView />}
        {activeTab === "daily" && <DailyChallengeView setActiveTab={setActiveTab} />}
        {activeTab === "leaderboard" && <LeaderboardView />}
        {activeTab === "certificates" && <CertificatesView lastStats={lastStats} />}
        {activeTab === "aicoach" && <AICoachView lastStats={lastStats} setActiveTab={setActiveTab} />}
        {activeTab === "kids" && <KidsView />}
        {activeTab === "teachers" && <TeachersView />}
        {activeTab === "blog" && <BlogView />}
        {activeTab === "pricing" && <PricingView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-xs text-slate-500 text-center space-y-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">TypeBlast.com</span>
            <span>• Ultimate Speed & Precision Typing Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => setActiveTab("test")} className="hover:text-slate-300">Typing Test</button>
            <button onClick={() => setActiveTab("games")} className="hover:text-slate-300">Arcade Games</button>
            <button onClick={() => setActiveTab("practice")} className="hover:text-slate-300">Practice</button>
            <button onClick={() => setActiveTab("lessons")} className="hover:text-slate-300">Lessons</button>
            <button onClick={() => setActiveTab("aicoach")} className="hover:text-slate-300 text-purple-400 font-semibold">AI Coach</button>
            <button onClick={() => setActiveTab("certificates")} className="hover:text-slate-300">Certificates</button>
          </div>
        </div>
        <p>© 2026 TypeBlast. Powered by Google Gemini AI & React.</p>
      </footer>
    </div>
  );
}
