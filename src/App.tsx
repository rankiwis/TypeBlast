import React, { useState, useEffect } from "react";
import { TabType, TypingStats } from "./types";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
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
import { getBlogPostBySlug } from "./data/blogData";

// Auth & Dashboard Imports
import { LoginPage } from "./components/Auth/LoginPage";
import { SignupPage } from "./components/Auth/SignupPage";
import { ForgotPasswordPage } from "./components/Auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/Auth/ResetPasswordPage";
import { DashboardPage } from "./components/Dashboard/DashboardPage";
import { ProfilePage } from "./components/Profile/ProfilePage";

// SEO Page Imports
import { TypingTestPage } from "./components/SEO/SeoPages/TypingTestPage";
import { TypingSpeedTestPage } from "./components/SEO/SeoPages/TypingSpeedTestPage";
import { WpmTestPage } from "./components/SEO/SeoPages/WpmTestPage";
import { TypingAccuracyTestPage } from "./components/SEO/SeoPages/TypingAccuracyTestPage";
import { TypingPracticePage } from "./components/SEO/SeoPages/TypingPracticePage";
import { TypingGamesPage } from "./components/SEO/SeoPages/TypingGamesPage";
import { TouchTypingPage } from "./components/SEO/SeoPages/TouchTypingPage";
import { DailyChallengePage } from "./components/SEO/SeoPages/DailyChallengePage";
import { TypingTipsPage } from "./components/SEO/SeoPages/TypingTipsPage";
import { FaqPage } from "./components/SEO/SeoPages/FaqPage";
import { AboutPage } from "./components/SEO/SeoPages/AboutPage";
import { ContactPage } from "./components/SEO/SeoPages/ContactPage";
import { PrivacyPolicyPage } from "./components/SEO/SeoPages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/SEO/SeoPages/TermsOfServicePage";
import { NotFoundPage } from "./components/SEO/SeoPages/NotFoundPage";

function normalizePath(path: string): string {
  const [pathname] = path.split(/[?#]/);
  let cleaned = pathname.trim().toLowerCase();
  if (cleaned.length > 1 && !cleaned.endsWith("/")) {
    cleaned += "/";
  }
  return cleaned;
}

function MainAppContent() {
  const { recordTestResult } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("test");
  const [soundProfile, setSoundProfile] = useState<"mechanical" | "soft" | "typewriter" | "retro" | "muted">("mechanical");
  const [lastStats, setLastStats] = useState<TypingStats | null>(null);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return normalizePath(window.location.pathname);
    }
    return "/";
  });

  const [userStats, setUserStats] = useState({
    userWpm: 88,
    streak: 7,
    xp: 2450,
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToPath = (path: string) => {
    const normalized = normalizePath(path);
    if (typeof window !== "undefined") {
      const queryIndex = path.indexOf("?");
      const queryPart = queryIndex !== -1 ? path.substring(queryIndex) : "";
      window.history.pushState({}, "", normalized + queryPart);
    }
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTestComplete = (stats: TypingStats) => {
    setLastStats(stats);
    setUserStats((prev) => ({
      ...prev,
      userWpm: Math.max(prev.userWpm, stats.wpm),
      xp: prev.xp + stats.wpm * 2,
    }));
    // Record result in user account context
    recordTestResult(stats);
  };

  const handleNavbarTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "test") navigateToPath("/typing-test/");
    else if (tab === "games") navigateToPath("/typing-games/");
    else if (tab === "practice") navigateToPath("/typing-practice/");
    else if (tab === "daily") navigateToPath("/daily-typing-challenge/");
    else if (tab === "leaderboard") navigateToPath("/leaderboard/");
    else if (tab === "blog") navigateToPath("/blog/");
    else if (tab === "lessons") navigateToPath("/lessons/");
    else if (tab === "certificates") navigateToPath("/certificates/");
    else if (tab === "aicoach") navigateToPath("/aicoach/");
    else if (tab === "kids") navigateToPath("/kids/");
    else if (tab === "teachers") navigateToPath("/teachers/");
    else if (tab === "pricing") navigateToPath("/pricing/");
    else navigateToPath("/");
  };

  // Check if current URL path matches a dedicated view or SEO page
  const knownPaths = [
    "/typing-test/",
    "/typing-speed-test/",
    "/wpm-test/",
    "/typing-accuracy-test/",
    "/typing-practice/",
    "/typing-games/",
    "/touch-typing/",
    "/daily-typing-challenge/",
    "/typing-tips/",
    "/faq/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/privacy-policy/",
    "/terms/",
    "/terms-of-service/",
    "/leaderboard/",
    "/blog/",
    "/lessons/",
    "/certificates/",
    "/aicoach/",
    "/kids/",
    "/teachers/",
    "/pricing/",
    "/login/",
    "/signup/",
    "/forgot-password/",
    "/reset-password/",
    "/dashboard/",
    "/profile/",
  ];

  const isHome = currentPath === "/" || currentPath === "";
  const isBlogHub = currentPath === "/blog/";
  const isBlogPost = currentPath.startsWith("/blog/") && currentPath !== "/blog/" && Boolean(getBlogPostBySlug(currentPath.replace(/^\/blog\/?|\/$/g, "")));
  const isKnownPath = isHome || knownPaths.includes(currentPath) || isBlogHub || isBlogPost;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navbar with primary links, CTA, & mobile drawer */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavbarTabSelect}
        onNavigatePath={navigateToPath}
        userStats={userStats}
        soundProfile={soundProfile}
        setSoundProfile={setSoundProfile}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {/* 404 Fallback for unknown URLs */}
        {!isKnownPath && <NotFoundPage onNavigatePath={navigateToPath} />}

        {/* Auth & User Account Routes */}
        {currentPath === "/login/" && <LoginPage onNavigatePath={navigateToPath} />}
        {currentPath === "/signup/" && <SignupPage onNavigatePath={navigateToPath} />}
        {currentPath === "/forgot-password/" && <ForgotPasswordPage onNavigatePath={navigateToPath} />}
        {currentPath === "/reset-password/" && <ResetPasswordPage onNavigatePath={navigateToPath} />}
        {currentPath === "/dashboard/" && <DashboardPage onNavigatePath={navigateToPath} />}
        {currentPath === "/profile/" && <ProfilePage onNavigatePath={navigateToPath} />}

        {/* Specific Path Route Handler */}
        {currentPath === "/typing-test/" && (
          <TypingTestPage
            onTestComplete={handleTestComplete}
            setActiveTab={setActiveTab}
            onNavigatePath={navigateToPath}
          />
        )}
        {currentPath === "/typing-speed-test/" && (
          <TypingSpeedTestPage
            onTestComplete={handleTestComplete}
            setActiveTab={setActiveTab}
            onNavigatePath={navigateToPath}
          />
        )}
        {currentPath === "/wpm-test/" && (
          <WpmTestPage
            onTestComplete={handleTestComplete}
            setActiveTab={setActiveTab}
            onNavigatePath={navigateToPath}
          />
        )}
        {currentPath === "/typing-accuracy-test/" && (
          <TypingAccuracyTestPage
            onTestComplete={handleTestComplete}
            setActiveTab={setActiveTab}
            onNavigatePath={navigateToPath}
          />
        )}
        {currentPath === "/typing-practice/" && (
          <TypingPracticePage onNavigatePath={navigateToPath} />
        )}
        {currentPath === "/typing-games/" && (
          <TypingGamesPage onNavigatePath={navigateToPath} />
        )}
        {currentPath === "/touch-typing/" && (
          <TouchTypingPage
            onTestComplete={handleTestComplete}
            setActiveTab={setActiveTab}
            onNavigatePath={navigateToPath}
          />
        )}
        {currentPath === "/daily-typing-challenge/" && (
          <DailyChallengePage setActiveTab={setActiveTab} onNavigatePath={navigateToPath} />
        )}
        {currentPath === "/typing-tips/" && (
          <TypingTipsPage onNavigatePath={navigateToPath} />
        )}
        {currentPath === "/faq/" && (
          <FaqPage onNavigatePath={navigateToPath} />
        )}
        {currentPath === "/about/" && (
          <AboutPage onNavigatePath={navigateToPath} />
        )}
        {currentPath === "/contact/" && (
          <ContactPage onNavigatePath={navigateToPath} />
        )}
        {(currentPath === "/privacy/" || currentPath === "/privacy-policy/") && (
          <PrivacyPolicyPage onNavigatePath={navigateToPath} />
        )}
        {(currentPath === "/terms/" || currentPath === "/terms-of-service/") && (
          <TermsOfServicePage onNavigatePath={navigateToPath} />
        )}
        {currentPath === "/leaderboard/" && <LeaderboardView onNavigatePath={navigateToPath} />}
        {(isBlogHub || isBlogPost) && (
          <BlogView onNavigatePath={navigateToPath} currentPath={currentPath} />
        )}
        {currentPath === "/lessons/" && <LessonsView />}
        {currentPath === "/certificates/" && <CertificatesView lastStats={lastStats} />}
        {currentPath === "/aicoach/" && <AICoachView lastStats={lastStats} setActiveTab={setActiveTab} />}
        {currentPath === "/kids/" && <KidsView />}
        {currentPath === "/teachers/" && <TeachersView />}
        {currentPath === "/pricing/" && <PricingView />}

        {/* Root Homepage ("/") with tab switching */}
        {isHome && (
          <>
            {activeTab === "test" && (
              <TypingTestView
                onTestComplete={handleTestComplete}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "games" && <GamesHubView />}
            {activeTab === "practice" && <PracticeView />}
            {activeTab === "lessons" && <LessonsView />}
            {activeTab === "daily" && <DailyChallengeView setActiveTab={setActiveTab} />}
            {activeTab === "leaderboard" && <LeaderboardView onNavigatePath={navigateToPath} />}
            {activeTab === "certificates" && <CertificatesView lastStats={lastStats} />}
            {activeTab === "aicoach" && <AICoachView lastStats={lastStats} setActiveTab={setActiveTab} />}
            {activeTab === "kids" && <KidsView />}
            {activeTab === "teachers" && <TeachersView />}
            {activeTab === "blog" && <BlogView />}
            {activeTab === "pricing" && <PricingView />}
          </>
        )}
      </main>

      {/* Footer Component with Structured Columns */}
      <Footer onNavigatePath={navigateToPath} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
