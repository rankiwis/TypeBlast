import React from "react";
import { Zap, Gauge, TrendingUp, CheckCircle2 } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";
import { TypingTestView } from "../../TypingTest/TypingTestView";
import { TypingStats, TabType } from "../../../types";

interface TypingSpeedTestPageProps {
  onTestComplete: (stats: TypingStats) => void;
  setActiveTab: (tab: TabType) => void;
  onNavigatePath: (path: string) => void;
}

export const TypingSpeedTestPage: React.FC<TypingSpeedTestPageProps> = ({
  onTestComplete,
  setActiveTab,
  onNavigatePath,
}) => {
  const canonicalUrl = "https://www.typeblast.com/typing-speed-test/";
  const pageTitle = "Typing Speed Test & WPM Checker - TypeBlast";
  const metaDescription =
    "Check your typing speed and accuracy with our fast online WPM test. Analyze keystroke metrics, error keys, and improve finger speed.";

  const breadcrumbs = [{ label: "Typing Speed Test", path: "/typing-speed-test/" }];

  const faqs = [
    {
      q: "What is considered a fast typing speed?",
      a: "A typing speed of 40 WPM is average. 60-70 WPM is considered above average and fast, while speeds exceeding 80 to 100 WPM enter the advanced professional and competitive tier.",
    },
    {
      q: "How fast can the average person type?",
      a: "The average adult types at approximately 38 to 42 Words Per Minute with around 92-95% accuracy.",
    },
    {
      q: "Can I increase my typing speed by 20 WPM?",
      a: "Yes! By committing to 10-15 minutes of daily touch-typing practice focusing on home row discipline and error elimination, most typists increase their speed by 15-25 WPM within 4 weeks.",
    },
    {
      q: "Does mechanical keyboard switch type affect typing speed?",
      a: "Keyboards with tactile tactile or light linear switches (like Cherry MX Brown or Red) can reduce finger fatigue and improve typing speed compared to stiff rubber dome keys.",
    },
  ];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeBlast Typing Speed Test",
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
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Keystroke Velocity Benchmark</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Typing Speed Test Online
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Take our high-precision <strong>free typing speed test online</strong> to test your raw keystroke velocity and net WPM. Compare your performance against global speed tiers, analyze real-time acceleration graphs, and push your limits.
        </p>
      </header>

      {/* Embedded Typing Test Widget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Gauge className="w-4 h-4" /> Velocity Speed Measurement Canvas
          </span>
          <span>Instant WPM Tracking</span>
        </div>
        <TypingTestView onTestComplete={onTestComplete} setActiveTab={setActiveTab} />
      </div>

      {/* Educational Content Sections */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-400" />
            Typing Speed Benchmarks: Where Do You Rank?
          </h2>
          <p>
            Understanding typing speed tiers allows you to set realistic improvement targets:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Beginner Tier</span>
              <div className="text-2xl font-black text-slate-200 font-mono">0 - 30 WPM</div>
              <p className="text-xs text-slate-400">Hunt-and-peck technique or early touch typing learners.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">Average Tier</span>
              <div className="text-2xl font-black text-blue-400 font-mono">35 - 50 WPM</div>
              <p className="text-xs text-slate-400">Standard workplace typist level across general business offices.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono">Fast Tier</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">55 - 75 WPM</div>
              <p className="text-xs text-slate-400">Above average efficiency for programmers, writers, and journalists.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">Pro / Master Tier</span>
              <div className="text-2xl font-black text-purple-400 font-mono">80+ WPM</div>
              <p className="text-xs text-slate-400">Competitive touch typists, court reporters, and speed experts.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            How To Increase Your Typing Speed by 20+ WPM
          </h2>
          <p>
            Speed gains come from eliminating physical friction and hesitation. Follow these four pillars:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Eliminate Looking Down:</strong> Train eyes to look exclusively at source text, building involuntary tactile muscle memory.</span>
            </li>
            <li className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Practice Common Word Bigrams:</strong> Over 50% of English text consists of just 100 common words (e.g. <i>the, that, with, from</i>). Master these combinations first.</span>
            </li>
            <li className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Keep Wrists Level:</strong> Avoid resting wrists flat on hard desks while typing; keep hands floating comfortably.</span>
            </li>
          </ul>
        </section>
      </article>

      {/* Internal Navigation */}
      <InternalLinksNav currentPath="/typing-speed-test/" onNavigate={onNavigatePath} />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
