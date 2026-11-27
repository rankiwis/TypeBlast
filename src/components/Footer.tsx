import React from "react";
import { Activity, Sparkles, Trophy, Award, GraduationCap, Users, CreditCard } from "lucide-react";
import { TabType } from "../types";

interface FooterProps {
  onNavigatePath: (path: string) => void;
  setActiveTab: (tab: TabType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePath, setActiveTab }) => {
  const handleLink = (path: string, tab?: TabType) => {
    if (tab) {
      setActiveTab(tab);
    }
    onNavigatePath(path);
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950/95 py-12 px-4 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main 5-Column Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <a
              href="/typing-test/"
              onClick={(e) => {
                e.preventDefault();
                handleLink("/typing-test/", "test");
              }}
              className="flex items-center gap-2 cursor-pointer group w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                TypeBlast
              </span>
            </a>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
              The premier online typing speed, precision, and arcade gaming platform. Master touch typing with real-time telemetry and AI coaching.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider text-cyan-400">
              Product
            </h3>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="/typing-test/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/typing-test/", "test");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Typing Test
                </a>
              </li>
              <li>
                <a
                  href="/typing-speed-test/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/typing-speed-test/", "test");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Typing Speed Test
                </a>
              </li>
              <li>
                <a
                  href="/typing-practice/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/typing-practice/", "practice");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Typing Practice
                </a>
              </li>
              <li>
                <a
                  href="/typing-games/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/typing-games/", "games");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Typing Games
                </a>
              </li>
              <li>
                <a
                  href="/daily-typing-challenge/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/daily-typing-challenge/", "daily");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Daily Challenge
                </a>
              </li>
              <li>
                <a
                  href="/leaderboard/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/leaderboard/", "leaderboard");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider text-cyan-400">
              Resources
            </h3>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="/typing-tips/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/typing-tips/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Typing Tips
                </a>
              </li>
              <li>
                <a
                  href="/blog/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/blog/", "blog");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/faq/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/faq/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/touch-typing/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/touch-typing/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Touch Typing Guide
                </a>
              </li>
              <li>
                <a
                  href="/wpm-test/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/wpm-test/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  WPM Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider text-cyan-400">
              Account
            </h3>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="/dashboard/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/dashboard/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/profile/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/profile/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Profile Settings
                </a>
              </li>
              <li>
                <a
                  href="/login/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/login/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Log In
                </a>
              </li>
              <li>
                <a
                  href="/signup/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/signup/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Create Account
                </a>
              </li>
            </ul>
          </div>

          {/* About & Legal */}
          <div className="space-y-3">
            <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider text-cyan-400">
              Company & Legal
            </h3>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="/about/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/about/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/contact/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="/privacy/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/privacy/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink("/terms/");
                  }}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Secondary Navigation Row (More App Features) */}
        <div className="pt-6 border-t border-slate-900/80 flex flex-wrap items-center justify-between gap-4 text-[11px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400">
            <span className="font-semibold text-slate-300">More Tools:</span>
            <a
              href="/aicoach/"
              onClick={(e) => {
                e.preventDefault();
                handleLink("/aicoach/", "aicoach");
              }}
              className="hover:text-purple-300 font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-purple-400" /> AI Coach
            </a>
            <a
              href="/lessons/"
              onClick={(e) => {
                e.preventDefault();
                handleLink("/lessons/", "lessons");
              }}
              className="hover:text-cyan-300 flex items-center gap-1"
            >
              <GraduationCap className="w-3 h-3 text-cyan-400" /> Typing Lessons
            </a>
            <a
              href="/certificates/"
              onClick={(e) => {
                e.preventDefault();
                handleLink("/certificates/", "certificates");
              }}
              className="hover:text-cyan-300 flex items-center gap-1"
            >
              <Award className="w-3 h-3 text-amber-400" /> Certificates
            </a>
            <a
              href="/kids/"
              onClick={(e) => {
                e.preventDefault();
                handleLink("/kids/", "kids");
              }}
              className="hover:text-cyan-300 flex items-center gap-1"
            >
              <Users className="w-3 h-3 text-emerald-400" /> TypeBlast Kids
            </a>
            <a
              href="/teachers/"
              onClick={(e) => {
                e.preventDefault();
                handleLink("/teachers/", "teachers");
              }}
              className="hover:text-cyan-300 flex items-center gap-1"
            >
              <Trophy className="w-3 h-3 text-cyan-400" /> For Teachers
            </a>
            <a
              href="/pricing/"
              onClick={(e) => {
                e.preventDefault();
                handleLink("/pricing/", "pricing");
              }}
              className="hover:text-cyan-300 flex items-center gap-1"
            >
              <CreditCard className="w-3 h-3 text-amber-400" /> Pricing
            </a>
          </div>

          <div className="text-slate-500 font-mono text-[10px]">
            © 2026 TypeBlast • All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
