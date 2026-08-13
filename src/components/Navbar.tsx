import React, { useState } from "react";
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
  Flame,
  ChevronDown,
  Activity
} from "lucide-react";
import { TabType } from "../types";
import { soundEngine } from "../utils/sound";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
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
  userStats,
  soundProfile,
  setSoundProfile,
}) => {
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode; tag?: string }[] = [
    { id: "test", label: "Typing Test", icon: <Keyboard className="w-4 h-4" /> },
    { id: "games", label: "Games", icon: <Gamepad2 className="w-4 h-4" />, tag: "HOT" },
    { id: "practice", label: "Practice", icon: <BookOpen className="w-4 h-4" /> },
    { id: "lessons", label: "Lessons", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "daily", label: "Daily Challenge", icon: <Calendar className="w-4 h-4" />, tag: "NEW" },
    { id: "leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
    { id: "certificates", label: "Certificates", icon: <Award className="w-4 h-4" /> },
    { id: "aicoach", label: "AI Coach", icon: <Sparkles className="w-4 h-4 text-purple-400" />, tag: "AI" },
    { id: "kids", label: "Kids", icon: <Smile className="w-4 h-4 text-amber-400" /> },
    { id: "teachers", label: "Schools", icon: <Users className="w-4 h-4" /> },
    { id: "blog", label: "Guides", icon: <FileText className="w-4 h-4" /> },
    { id: "pricing", label: "Pro", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const soundProfiles: { id: "mechanical" | "soft" | "typewriter" | "retro" | "muted"; label: string }[] = [
    { id: "mechanical", label: "Mechanical Click ⌨️" },
    { id: "soft", label: "Soft Membrane 🎧" },
    { id: "typewriter", label: "Vintage Typewriter 📜" },
    { id: "retro", label: "8-Bit Arcade 🕹️" },
    { id: "muted", label: "Silent / Muted 🔇" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab("test")}
            className="flex items-center gap-3 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  TypeBlast
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  .com
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">Speed • Precision • Mastery</p>
            </div>
          </div>

          {/* Desktop Navigation Row */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    soundEngine.playKeyPress();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.tag && (
                    <span
                      className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                        item.tag === "AI"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Stats & Sound */}
          <div className="flex items-center gap-3">
            {/* User WPM & Streak Badge */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-semibold" title="Daily Streak">
                <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>{userStats.streak}d</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1 text-cyan-400 font-bold">
                <span className="font-mono">{userStats.userWpm || "--"}</span>
                <span className="text-[10px] text-slate-400 uppercase font-normal">WPM</span>
              </div>
            </div>

            {/* Sound Selector Dropdown */}
            <div className="relative">
              <button
                id="sound-selector-toggle"
                onClick={() => setShowSoundMenu(!showSoundMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                title="Keyboard Sound Effects"
              >
                {soundProfile === "muted" ? (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                )}
                <span className="hidden md:inline capitalize">{soundProfile}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showSoundMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
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
                          ? "bg-cyan-500/10 text-cyan-400 font-semibold"
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

            {/* Mobile Nav Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              id="mobile-menu-toggle"
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${showMobileMenu ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMobileMenu(false);
                  soundEngine.playKeyPress();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                  activeTab === item.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:bg-slate-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
