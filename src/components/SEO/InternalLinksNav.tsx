import React from "react";
import {
  Keyboard,
  Zap,
  BarChart2,
  CheckCircle,
  BookOpen,
  Gamepad2,
  Target,
  Trophy,
  ArrowRight,
} from "lucide-react";

interface InternalLinksNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const SEO_PAGES_META = [
  {
    path: "/typing-test/",
    label: "Typing Test",
    keyword: "typing test online",
    desc: "Standard benchmark speed & accuracy assessment.",
    icon: <Keyboard className="w-5 h-5 text-cyan-400" />,
  },
  {
    path: "/typing-speed-test/",
    label: "Typing Speed Test",
    keyword: "typing speed test",
    desc: "Measure raw typing velocity and speed tiers.",
    icon: <Zap className="w-5 h-5 text-amber-400" />,
  },
  {
    path: "/wpm-test/",
    label: "WPM Test",
    keyword: "words per minute test",
    desc: "Calculate exact WPM using international 5-char standard.",
    icon: <BarChart2 className="w-5 h-5 text-blue-400" />,
  },
  {
    path: "/typing-accuracy-test/",
    label: "Typing Accuracy Test",
    keyword: "typing accuracy test",
    desc: "Analyze keystroke precision and error heatmaps.",
    icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  },
  {
    path: "/typing-practice/",
    label: "Typing Practice",
    keyword: "typing practice online",
    desc: "Targeted drills for home row, numbers, and custom text.",
    icon: <BookOpen className="w-5 h-5 text-indigo-400" />,
  },
  {
    path: "/typing-games/",
    label: "Typing Games",
    keyword: "free typing games",
    desc: "Arcade speed, laser defense, and racing games.",
    icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
  },
  {
    path: "/touch-typing/",
    label: "Touch Typing Guide",
    keyword: "learn touch typing",
    desc: "Master touch typing without looking at keys.",
    icon: <Target className="w-5 h-5 text-rose-400" />,
  },
  {
    path: "/daily-typing-challenge/",
    label: "Daily Challenge",
    keyword: "daily typing challenge",
    desc: "Compete in today's official sprint and build streaks.",
    icon: <Trophy className="w-5 h-5 text-amber-500" />,
  },
];

export const InternalLinksNav: React.FC<InternalLinksNavProps> = ({ currentPath, onNavigate }) => {
  return (
    <section className="space-y-6 pt-10 border-t border-slate-800/80">
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
          Explore TypeBlast Hub
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Explore All Speed & Precision Typing Tools</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Discover specialized typing tests, accuracy analyzers, touch typing tutorials, and arcade speed games.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SEO_PAGES_META.map((item) => {
          const isCurrent = currentPath === item.path || currentPath === item.path.replace(/\/$/, "");
          return (
            <div
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isCurrent
                  ? "bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10 pointer-events-none"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">{item.icon}</div>
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">
                      Current Page
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 pt-1">
                <span>{item.keyword}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
