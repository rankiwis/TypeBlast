import React, { useState, useRef, useEffect } from "react";
import {
  Keyboard,
  Gamepad2,
  BookOpen,
  GraduationCap,
  Calendar,
  Trophy,
  Award,
  Sparkles,
  Smile,
  Users,
  FileText,
  CreditCard,
  Volume2,
  VolumeX,
  ChevronDown,
  Activity,
  Play,
  Menu,
  X,
  HelpCircle,
  Lightbulb,
  Info,
  Mail,
  User,
  LogOut,
  LayoutDashboard,
  LogIn,
  UserPlus
} from "lucide-react";
import { TabType } from "../types";
import { soundEngine } from "../utils/sound";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNavigatePath: (path: string) => void;
  userStats: {
    userWpm: number;
    streak: number;
    xp: number;
  };
  soundProfile: "mechanical" | "soft" | "typewriter" | "retro" | "muted";
  setSoundProfile: (profile: "mechanical" | "soft" | "typewriter" | "retro" | "muted") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNavigatePath,
  userStats,
  soundProfile,
  setSoundProfile,
}) => {
  const { user, logout } = useAuth();
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const soundMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
      if (soundMenuRef.current && !soundMenuRef.current.contains(event.target as Node)) {
        setShowSoundMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Primary navigation requested by user
  const primaryNavItems: { id: TabType; path: string; label: string; icon: React.ReactNode; tag?: string }[] = [
    { id: "test", path: "/typing-test/", label: "Typing Test", icon: <Keyboard className="w-4 h-4" /> },
    { id: "practice", path: "/typing-practice/", label: "Practice", icon: <BookOpen className="w-4 h-4" /> },
    { id: "games", path: "/typing-games/", label: "Games", icon: <Gamepad2 className="w-4 h-4" />, tag: "HOT" },
    { id: "daily", path: "/daily-typing-challenge/", label: "Daily Challenge", icon: <Calendar className="w-4 h-4" />, tag: "NEW" },
    { id: "leaderboard", path: "/leaderboard/", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
  ];

  // Secondary/More navigation links to ensure NO existing navigation links are removed
  const secondaryNavItems: { id?: TabType; path: string; label: string; icon: React.ReactNode; tag?: string }[] = [
    { id: "aicoach", path: "/aicoach/", label: "AI Coach", icon: <Sparkles className="w-4 h-4 text-purple-400" />, tag: "AI" },
    { id: "lessons", path: "/lessons/", label: "Lessons", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "certificates", path: "/certificates/", label: "Certificates", icon: <Award className="w-4 h-4" /> },
    { id: "kids", path: "/kids/", label: "Kids Mode", icon: <Smile className="w-4 h-4 text-amber-400" /> },
    { id: "teachers", path: "/teachers/", label: "Schools & Teachers", icon: <Users className="w-4 h-4" /> },
    { id: "blog", path: "/blog/", label: "Guides & Blog", icon: <FileText className="w-4 h-4" /> },
    { id: "pricing", path: "/pricing/", label: "Pro Features", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const soundProfiles: { id: "mechanical" | "soft" | "typewriter" | "retro" | "muted"; label: string }[] = [
    { id: "mechanical", label: "Mechanical Click ⌨️" },
    { id: "soft", label: "Soft Membrane 🎧" },
    { id: "typewriter", label: "Vintage Typewriter 📜" },
    { id: "retro", label: "8-Bit Arcade 🕹️" },
    { id: "muted", label: "Silent / Muted 🔇" },
  ];

  const handleStartTest = () => {
    setActiveTab("test");
    onNavigatePath("/typing-test/");
    soundEngine.playKeyPress();
    setShowMobileMenu(false);
  };

  const handleNavClick = (path: string, tab?: TabType) => {
    if (tab) {
      setActiveTab(tab);
    }
    onNavigatePath(path);
    soundEngine.playKeyPress();
    setShowMoreMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div
            onClick={() => handleNavClick("/typing-test/", "test")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            id="brand-logo"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  TypeBlast
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Primary Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.path, item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner"
                      : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.tag && (
                    <span
                      className={`text-[9px] font-extrabold px-1 py-0.2 rounded ${
                        item.tag === "NEW"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Desktop "More Features" Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors ${
                  showMoreMenu ? "bg-slate-800 text-slate-200" : ""
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreMenu ? "rotate-180" : ""}`} />
              </button>

              {showMoreMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800/60">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Additional Features
                  </div>
                  <div className="py-1">
                    {secondaryNavItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item.path, item.id)}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.tag && (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {item.tag}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Prominent "Start Test" CTA, Stats & Sound */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Prominent Start Test CTA Button */}
            <button
              onClick={handleStartTest}
              id="start-test-cta-btn"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 active:scale-95 transition-all duration-150 border border-cyan-300/30"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start Test</span>
            </button>

            {/* Sound Selector Dropdown */}
            <div className="relative" ref={soundMenuRef}>
              <button
                id="sound-selector-toggle"
                onClick={() => setShowSoundMenu(!showSoundMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                title="Keyboard Sound Effects"
              >
                {soundProfile === "muted" ? (
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showSoundMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Audio Sound Switch
                  </div>
                  {soundProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSoundProfile(p.id);
                        soundEngine.setSoundProfile(p.id);
                        soundEngine.playKeyPress();
                        setShowSoundMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                        soundProfile === p.id
                          ? "bg-cyan-500/10 text-cyan-400 font-bold"
                          : "text-slate-300 hover:bg-slate-800/80"
                      }`}
                    >
                      <span>{p.label}</span>
                      {soundProfile === p.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Account Controls */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px] uppercase">
                    {user.username.substring(0, 1)}
                  </div>
                  <span className="font-bold hidden sm:inline-block max-w-[100px] truncate">{user.displayName || user.username}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 divide-y divide-slate-800/80">
                    <div className="px-3.5 py-2">
                      <div className="font-bold text-xs text-white truncate">{user.displayName || user.username}</div>
                      <div className="text-[10px] text-slate-400 font-mono">PB: {user.personalBestWpm} WPM</div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigatePath("/dashboard/");
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigatePath("/profile/");
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        <span>Profile & Settings</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={async () => {
                          await logout();
                          setShowUserMenu(false);
                          onNavigatePath("/");
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => onNavigatePath("/login/")}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-colors"
                >
                  Log In
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
            >
              {showMobileMenu ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Mobile Navigation Menu Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 py-5 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Mobile Start Test Hero CTA */}
          <button
            onClick={handleStartTest}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Typing Test Now</span>
          </button>

          {/* Primary Nav Section */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Primary Navigation
            </div>
            <div className="grid grid-cols-2 gap-2">
              {primaryNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path, item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-900 border border-slate-800/80 text-slate-300"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* More Features Section */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
              Features & Tools
            </div>
            <div className="grid grid-cols-2 gap-2">
              {secondaryNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path, item.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-medium text-slate-300 text-left"
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resources & Info Section */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Resources & Info
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <button
                onClick={() => handleNavClick("/typing-tips/")}
                className="flex items-center gap-2 px-2 py-1.5 hover:text-cyan-400 text-left"
              >
                <Lightbulb className="w-3.5 h-3.5 text-cyan-400" /> Typing Tips
              </button>
              <button
                onClick={() => handleNavClick("/faq/")}
                className="flex items-center gap-2 px-2 py-1.5 hover:text-cyan-400 text-left"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> FAQ
              </button>
              <button
                onClick={() => handleNavClick("/about/")}
                className="flex items-center gap-2 px-2 py-1.5 hover:text-cyan-400 text-left"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" /> About
              </button>
              <button
                onClick={() => handleNavClick("/contact/")}
                className="flex items-center gap-2 px-2 py-1.5 hover:text-cyan-400 text-left"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
