import React from "react";
import { Lightbulb, CheckCircle2, ShieldCheck, Flame, Zap, Compass } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";

interface TypingTipsPageProps {
  onNavigatePath: (path: string) => void;
}

export const TypingTipsPage: React.FC<TypingTipsPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://typeblast.com/typing-tips/";
  const pageTitle = "Top Typing Tips & Ergonomic Speed Drills | TypeBlast";
  const metaDescription =
    "Discover 10 expert typing tips to boost WPM, improve accuracy, master ergonomics, and build effortless touch-typing muscle memory.";

  const faqs = [
    {
      q: "What is the single most effective tip to increase typing speed?",
      a: "Stop looking down at your keyboard. Training your eyes to stay fixed on the screen builds subconscious muscle memory, increasing speed by 20+ WPM within weeks.",
    },
    {
      q: "How should my hands and wrists be positioned while typing?",
      a: "Keep your wrists floating slightly above the desk in a neutral, straight line. Resting wrists heavily on hard desk edges compresses median nerves and causes finger fatigue.",
    },
    {
      q: "Should I switch to Dvorak or Colemak keyboard layouts?",
      a: "While Dvorak and Colemak reduce total finger travel distance, standard QWERTY remains universally supported across all devices. Mastering QWERTY touch-typing is sufficient to reach 100+ WPM.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: pageTitle,
      description: metaDescription,
      url: canonicalUrl,
      author: {
        "@type": "Organization",
        name: "TypeBlast Speed Typing Experts",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
          <span>Expert Typing Guides & Ergonomics</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          10 Essential Typing Tips for Maximum WPM & Zero Strain
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Transform your typing performance with our research-backed typing tips. Whether you want to break past a 50 WPM plateau or eliminate wrist pain, follow these golden rules of speed touch-typing.
        </p>
      </header>

      {/* 10 Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">1</span>
            Anchor the Home Row (ASDF JKL;)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Always rest index fingers on the <code>F</code> and <code>J</code> tactile bumps. Every key reach should start and return to these home row anchors.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">2</span>
            Focus on Accuracy Before Speed
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Speed is a natural byproduct of error-free muscle memory. Typing with 98%+ accuracy saves seconds otherwise wasted on backspacing.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">3</span>
            Maintain Floating Ergonomic Wrists
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Keep forearms parallel to the floor and wrists level. Avoid resting wrists heavily on hard desks while actively typing.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">4</span>
            Never Look at the Keyboard
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Force your eyes to remain fixed on the screen text. If you misplace a key, feel for the <code>F</code> and <code>J</code> bumps instead of glancing down.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">5</span>
            Establish a Rhythm and Cadence
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Type with steady metronome-like rhythm. Avoid erratic bursts followed by long pauses when encountering tricky words.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase">
            <span className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-xs">6</span>
            Master Common Bigrams & Trigrams
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Practice high-frequency English key clusters like <code>th</code>, <code>he</code>, <code>in</code>, <code>er</code>, and <code>tion</code> until they feel like a single motion.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          Ready To Put These Tips Into Practice?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Launch our interactive typing test or practice drills to benchmark your speed right now.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigatePath("/typing-test/")}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
          >
            Take 60s Typing Test
          </button>
          <button
            onClick={() => onNavigatePath("/typing-practice/")}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-colors"
          >
            Start Practice Drills
          </button>
        </div>
      </div>

      <InternalLinksNav currentPath="/typing-tips/" onNavigate={onNavigatePath} />
      <FaqSection faqs={faqs} />
    </div>
  );
};
