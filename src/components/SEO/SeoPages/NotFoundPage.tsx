import React from "react";
import {
  AlertCircle,
  Home,
  Zap,
  Gamepad2,
  Keyboard,
  Compass,
  Trophy,
  Flame,
  ArrowRight,
} from "lucide-react";
import { SeoHead } from "../SeoHead";

interface NotFoundPageProps {
  onNavigatePath?: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigatePath }) => {
  const pageTitle = "Page Not Found | TypeBlast";
  const metaDescription =
    "The page you're looking for doesn't exist or may have moved. Continue practicing your touch typing, taking a speed test, or playing typing games on TypeBlast.";

  const handleNavigate = (path: string) => {
    if (onNavigatePath) {
      onNavigatePath(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl="https://www.typeblast.com/404/"
        noIndex={true}
      />

      <div className="max-w-2xl w-full mx-auto text-center space-y-8">
        {/* Subtle Keyboard Key Visual Element */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 select-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-slate-700/80 shadow-[0_6px_0_0_#334155] flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">4</span>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-bold">ERR</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-slate-700/80 shadow-[0_6px_0_0_#334155] flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">0</span>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-bold">KEY</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-slate-700/80 shadow-[0_6px_0_0_#334155] flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">4</span>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-bold">MISS</span>
          </div>
        </div>

        {/* Heading & Clear Explanatory Message */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>404 Error</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Page Not Found
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">
            The page you're looking for doesn't exist or may have moved.
          </p>
        </div>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleNavigate("/")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02] cursor-pointer"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </button>

          <button
            onClick={() => handleNavigate("/typing-test/")}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:border-cyan-500/40 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400" /> Take a Typing Test
          </button>

          <button
            onClick={() => handleNavigate("/typing-games/")}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:border-purple-500/40 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-purple-400" /> Explore Typing Games
          </button>
        </div>

        {/* Useful Navigation: "Try one of these instead:" */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" /> Try one of these instead:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">TypeBlast Fast Navigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleNavigate("/typing-speed-test/")}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Typing Speed Test
                  </div>
                  <div className="text-[11px] text-slate-400">Benchmark your Net & Gross WPM</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => handleNavigate("/typing-practice/")}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Typing Practice
                  </div>
                  <div className="text-[11px] text-slate-400">Master code, numbers, and symbols</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => handleNavigate("/typing-games/")}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    Typing Games
                  </div>
                  <div className="text-[11px] text-slate-400">Word Blast, Time Attack & Race</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => handleNavigate("/daily-typing-challenge/")}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    Daily Typing Challenge
                  </div>
                  <div className="text-[11px] text-slate-400">Compete on today's leaderboard</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
