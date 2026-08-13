import React from "react";
import { CheckCircle2, Target, AlertTriangle, ShieldCheck } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { TypingTestView } from "../../TypingTest/TypingTestView";
import { TypingStats, TabType } from "../../../types";

interface TypingAccuracyTestPageProps {
  onTestComplete: (stats: TypingStats) => void;
  setActiveTab: (tab: TabType) => void;
  onNavigatePath: (path: string) => void;
}

export const TypingAccuracyTestPage: React.FC<TypingAccuracyTestPageProps> = ({
  onTestComplete,
  setActiveTab,
  onNavigatePath,
}) => {
  const canonicalUrl = "https://typeblast.com/typing-accuracy-test/";
  const pageTitle = "Typing Accuracy Test | Benchmark Keystroke Precision & Errors";
  const metaDescription =
    "Measure your typing accuracy percentage and identify error-prone keys with our free typing accuracy test. Improve keystroke precision and reduce backspacing.";

  const faqs = [
    {
      q: "What is a good typing accuracy score?",
      a: "An accuracy rate of 95% is average. Professional typists, programmers, and administrative staff aim for 98% to 100% accuracy to minimize backspacing friction.",
    },
    {
      q: "How is typing accuracy percentage calculated?",
      a: "Accuracy is calculated as: (Total Correct Characters Typed ÷ Total Characters Typed) × 100.",
    },
    {
      q: "Why does backspacing lower my typing speed so much?",
      a: "When you make a mistake, you must stop, press backspace 1-5 times, retype the correct keys, and resume your mental rhythm. Each mistake costs 3 to 5 times longer than typing a correct character smoothly.",
    },
    {
      q: "How can I improve my keystroke accuracy?",
      a: "Slow down your typing speed by 10-15 WPM and focus exclusively on zero-error key hits. Once your fingers build consistent muscle memory, your speed will naturally increase while keeping high accuracy.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeBlast Typing Accuracy Test",
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      {/* Hero Header */}
      <header className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Keystroke Precision & Error Analysis</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Typing Accuracy Test & Keystroke Precision Analyzer
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Take a free <strong>typing accuracy test</strong> to measure your keystroke precision percentage, track error-prone finger reaches, and eliminate frequent typos. Master zero-error touch typing to maximize real-world workplace productivity.
        </p>
      </header>

      {/* Embedded Test Tool */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Target className="w-4 h-4" /> Live Accuracy Test Canvas
          </span>
          <span>Target: 98%+ Keystroke Precision</span>
        </div>
        <TypingTestView onTestComplete={onTestComplete} setActiveTab={setActiveTab} />
      </div>

      {/* Educational Content Sections */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Why High Accuracy Matters More Than Raw Speed
          </h2>
          <p>
            In real-world work environments—such as coding, legal documentation, medical transcription, and data entry—a single typo can corrupt databases, produce invalid code syntax, or alter contractual terms. High typing speed without high accuracy creates extra editing work.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            The Hidden Time Cost of Backspacing and Correcting Errors
          </h2>
          <p>
            Typists often underestimate how severely typos reduce their net output. Consider the mathematical cost:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs sm:text-sm">
            <div className="text-amber-300 font-bold">THE COST OF A SINGLE TYPO:</div>
            <p>
              1. Strike incorrect character (1 keystroke)<br />
              2. Recognize the mistake & halt momentum (200ms mental pause)<br />
              3. Strike backspace key (1 keystroke)<br />
              4. Re-strike correct character (1 keystroke)<br />
              <strong>Total Lost Effort:</strong> Equivalent to typing 4-5 correct characters!
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Proven Strategies To Reduce Typing Mistakes
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm">
            <li><strong>Slow Down to Speed Up:</strong> Reduce typing speed by 10 WPM until your accuracy reaches 98%+, then gradually re-accelerate.</li>
            <li><strong>Fix Pinky Reach Errors:</strong> Numbers, symbols, and shift combinations (<code>P, Q, Z, X</code>) cause over 60% of all mistypes. Isolate these keys in practice.</li>
            <li><strong>Maintain Light Touch:</strong> Avoid heavy key slamming which causes accidental double presses.</li>
          </ol>
        </section>
      </article>

      {/* Internal Navigation */}
      <InternalLinksNav currentPath="/typing-accuracy-test/" onNavigate={onNavigatePath} />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
