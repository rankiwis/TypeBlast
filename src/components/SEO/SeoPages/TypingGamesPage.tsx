import React from "react";
import { Gamepad2, Flame, Trophy, Sparkles } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { GamesHubView } from "../../TypingGames/GamesHubView";

interface TypingGamesPageProps {
  onNavigatePath: (path: string) => void;
}

export const TypingGamesPage: React.FC<TypingGamesPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://typeblast.com/typing-games/";
  const pageTitle = "Free Typing Games Online | Fun Arcade Speed & Reflex Games";
  const metaDescription =
    "Play free online typing games including Speed Blast Laser, Nitro Typing Race, and Word Defense Arena. Train reflexes and typing speed while playing.";

  const faqs = [
    {
      q: "Are these typing games completely free to play online?",
      a: "Yes! All arcade typing games on TypeBlast are 100% free with no ads interrupting gameplay, no sign-up required, and no hidden paywalls.",
    },
    {
      q: "Do typing games actually help improve real-world typing speed?",
      a: "Yes! Action typing games trigger fast visual-to-motor reflexes, forcing typists to recognize whole word patterns instantly rather than reading character-by-character.",
    },
    {
      q: "Which typing game is best for beginners?",
      a: "Word Defense Arena is excellent for beginners because incoming targets travel at predictable speeds, giving typists time to locate home row keys before firing lasers.",
    },
    {
      q: "Can children and students play these typing games?",
      a: "Absolutely! Our arcade typing games are designed for all age groups, providing an engaging classroom and home educational experience.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeBlast Online Arcade Typing Games Hub",
      url: canonicalUrl,
      applicationCategory: "GameApplication",
      operatingSystem: "All",
      description: metaDescription,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
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

      {/* Hero Header */}
      <header className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
          <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Gamified Reflex & Speed Training</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Free Online Typing Games & Arcade Suite
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Level up your typing velocity while playing immersive <strong>free typing games online</strong>. Blast descending laser asteroids in <em>Speed Blast</em>, burn rubber in <em>Nitro Typing Race</em>, and defend bases in <em>Word Defense Arena</em>.
        </p>
      </header>

      {/* Interactive Arcade Hub Tool */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-purple-400">
            <Sparkles className="w-4 h-4" /> Live Interactive Arcade Suite
          </span>
          <span>Click Game Card To Launch</span>
        </div>
        <GamesHubView />
      </div>

      {/* Educational Content Sections */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            The Psychology of Gamified Typing Practice
          </h2>
          <p>
            Traditional repetitive drill sessions can feel monotonous. <strong>Gamified typing games</strong> introduce immediate visual feedback, time pressure, and score multipliers that stimulate focus. Under game conditions, typists transition from conscious key hunting to subconscious involuntary muscle memory.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            Featured Arcade Games: Speed Blast Laser, Nitro Race & Defense
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">Laser Asteroids</h3>
              <p className="text-xs text-slate-400">Type words attached to falling space debris before they strike your planetary shield.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">Nitro Typing Race</h3>
              <p className="text-xs text-slate-400">Accelerate your race car by typing consecutive error-free word bursts against opponent AI drivers.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">Word Defense Arena</h3>
              <p className="text-xs text-slate-400">Defend military outposts against waves of fast-moving vocabulary targets.</p>
            </div>
          </div>
        </section>
      </article>

      {/* Internal Navigation */}
      <InternalLinksNav currentPath="/typing-games/" onNavigate={onNavigatePath} />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
