import React from "react";
import { AlertTriangle, Home, Keyboard, Gamepad2, Compass } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";

interface NotFoundPageProps {
  onNavigatePath?: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://www.typeblast.com/404/";
  const pageTitle = "404 Page Not Found Error - TypeBlast";
  const metaDescription =
    "The requested page could not be found on TypeBlast. Return to our free online typing speed test or practice tools to continue typing.";

  const handleNavigate = (path: string) => {
    if (onNavigatePath) {
      onNavigatePath(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-8">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        noIndex={true}
      />

      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-2">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          404 - Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
          Oops! The page or shortcut you were looking for doesn't exist or may have been moved. Choose one of the popular typing destinations below to continue.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
        <button
          onClick={() => handleNavigate("/typing-test/")}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Keyboard className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-white text-base">Free Typing Test</h2>
          <p className="text-xs text-slate-400">Take a 60-second typing test and get your WPM score.</p>
        </button>

        <button
          onClick={() => handleNavigate("/typing-games/")}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-white text-base">Typing Games</h2>
          <p className="text-xs text-slate-400">Play arcade typing games and speed challenges online.</p>
        </button>

        <button
          onClick={() => handleNavigate("/")}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-white text-base">Return Home</h2>
          <p className="text-xs text-slate-400">Back to the TypeBlast main speed platform homepage.</p>
        </button>
      </div>

      <div className="pt-8">
        <InternalLinksNav currentPath="/404/" onNavigate={handleNavigate} />
      </div>
    </div>
  );
};
