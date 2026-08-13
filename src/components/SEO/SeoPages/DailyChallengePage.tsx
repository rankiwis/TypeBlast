import React from "react";
import { Trophy, Flame, Calendar } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";
import { DailyChallengeView } from "../../DailyChallenge/DailyChallengeView";
import { TabType } from "../../../types";

interface DailyChallengePageProps {
  setActiveTab: (tab: TabType) => void;
  onNavigatePath: (path: string) => void;
}

export const DailyChallengePage: React.FC<DailyChallengePageProps> = ({
  setActiveTab,
  onNavigatePath,
}) => {
  const canonicalUrl = "https://typeblast.com/daily-typing-challenge/";
  const pageTitle = "Daily Typing Speed Challenge - TypeBlast";
  const metaDescription =
    "Compete in today's official daily typing challenge. Test speed against typists worldwide on the daily passage and win streak rewards.";

  const breadcrumbs = [{ label: "Daily Challenge", path: "/daily-typing-challenge/" }];

  const faqs = [
    {
      q: "How often does the official daily typing challenge update?",
      a: "A brand new official daily challenge text passage unlocks every night at 00:00 UTC.",
    },
    {
      q: "How do daily streaks work?",
      a: "Completing at least 1 official daily challenge every 24 hours increments your streak counter. Maintaining consecutive day streaks unlocks XP multipliers and special profile badges.",
    },
    {
      q: "Can I retry today's daily challenge to improve my score?",
      a: "Yes! You can re-run today's challenge passage multiple times to improve your WPM and accuracy before the global leaderboard freezes at midnight.",
    },
    {
      q: "How are high scores verified on the daily leaderboard?",
      a: "Scores are validated client-side and server-side against anti-tamper algorithms that flag mathematically impossible keystroke intervals (>250 WPM).",
    },
  ];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeBlast Daily Typing Challenge Engine",
      url: canonicalUrl,
      applicationCategory: "EducationalApplication",
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigatePath} />

      {/* Hero Header */}
      <header className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Official 24-Hour Global Sprint</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Daily Typing Challenge & Global Competition
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Compete in today’s official <strong>daily typing challenge</strong>. Test your speed on a curated 24-hour sprint passage, build your daily activity streak, earn bonus XP, and climb the global leaderboards.
        </p>
      </header>

      {/* Embedded Daily Challenge View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" /> Today's Official Challenge Sprint
          </span>
          <span>Resets Daily at 00:00 UTC</span>
        </div>
        <DailyChallengeView setActiveTab={setActiveTab} />
      </div>

      {/* Educational Content Sections */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Why Daily Consistency Outperforms Massive Weekend Cramming
          </h2>
          <p>
            Neurological studies on motor skill acquisition demonstrate that short, daily 5-minute typing sprints strengthen synaptic pathways far better than 3-hour weekly marathons. Daily practice embeds involuntary finger habits into long-term procedural memory.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cyan-400" />
            Tracking Your Daily Streak, XP, and Global Ranking
          </h2>
          <p>
            Every completed daily challenge rewards you with XP calculated from your WPM multiplied by accuracy percentage. Maintain unbroken day streaks to unlock Master badges on your profile and rise on the global rankings.
          </p>
        </section>
      </article>

      {/* Internal Navigation */}
      <InternalLinksNav currentPath="/daily-typing-challenge/" onNavigate={onNavigatePath} />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
