import React from "react";
import { BarChart2, Calculator, CheckCircle2, ShieldAlert, Award } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { TypingTestView } from "../../TypingTest/TypingTestView";
import { TypingStats, TabType } from "../../../types";

interface WpmTestPageProps {
  onTestComplete: (stats: TypingStats) => void;
  setActiveTab: (tab: TabType) => void;
  onNavigatePath: (path: string) => void;
}

export const WpmTestPage: React.FC<WpmTestPageProps> = ({
  onTestComplete,
  setActiveTab,
  onNavigatePath,
}) => {
  const canonicalUrl = "https://typeblast.com/wpm-test/";
  const pageTitle = "WPM Test | Words Per Minute Typing Calculator & Speed Test";
  const metaDescription =
    "Calculate your exact Words Per Minute (WPM) with our accurate online WPM test. Learn the international formula: 5 characters equal 1 word.";

  const faqs = [
    {
      q: "Why are 5 characters counted as 1 word in WPM tests?",
      a: "Because words in human languages vary in length (e.g. 'a' vs 'extraordinary'), international typing standards standardized 1 'word' as exactly 5 keystrokes (including spaces and punctuation) to ensure fair measurement regardless of passage vocabulary.",
    },
    {
      q: "What is the difference between Gross WPM and Net WPM?",
      a: "Gross WPM measures total character speed without penalizing errors. Net WPM subtracts uncorrected errors to reflect true usable typing speed.",
    },
    {
      q: "How do I convert WPM to CPM?",
      a: "Multiply your WPM score by 5 to calculate your CPM (Characters Per Minute). For example, 60 WPM equals 300 CPM.",
    },
    {
      q: "What WPM score is required for data entry jobs?",
      a: "Most professional data entry and administrative roles require a minimum net score of 50 to 65 WPM with at least 95-98% accuracy.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeBlast WPM Calculator & Test",
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold">
          <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
          <span>International WPM Standard</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Words Per Minute (WPM) Typing Test & Calculator
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Calculate your exact <strong>Words Per Minute (WPM)</strong> score with our official online typing test calculator. Understand the standard mathematical formula where <strong>5 keystrokes equal 1 word</strong>, measure gross versus net speed, and convert WPM to CPM.
        </p>
      </header>

      {/* Math Formula Card Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>The Official WPM Calculation Formula</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-bold">NET WPM FORMULA:</div>
            <div className="text-cyan-300 font-extrabold text-base sm:text-lg">
              Net WPM = (Correct Chars ÷ 5) ÷ Time (Minutes)
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Example: 300 correct characters in 1 minute = (300 ÷ 5) ÷ 1 = <strong>60 Net WPM</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-bold">GROSS WPM FORMULA:</div>
            <div className="text-amber-300 font-extrabold text-base sm:text-lg">
              Gross WPM = (Total Typed Chars ÷ 5) ÷ Time (Minutes)
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Example: 325 total characters in 1 minute = (325 ÷ 5) ÷ 1 = <strong>65 Gross WPM</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-blue-400">
            <BarChart2 className="w-4 h-4" /> Live WPM Speed Assessment
          </span>
          <span>5 Chars = 1 Word Standard</span>
        </div>
        <TypingTestView onTestComplete={onTestComplete} setActiveTab={setActiveTab} />
      </div>

      {/* Educational Sections */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            What is WPM and How is Words Per Minute Calculated?
          </h2>
          <p>
            <strong>WPM (Words Per Minute)</strong> is the standardized metric used across education, technology, and business to measure typing speed. Rather than counting literal words—which can range from 1-letter words like "a" to 14-letter words like "implementation"—the international standard specifies that <strong>5 characters (including letters, numbers, punctuation, and spaces) count as 1 standard word</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            The Difference Between Net WPM and Gross WPM
          </h2>
          <p>
            When taking a <strong>typing WPM test</strong>, you will see two numbers:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300">Net WPM:</strong> Represents your true usable output speed after uncorrected typos are subtracted. This is the official score evaluated by employers.
            </li>
            <li className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-amber-300">Gross (Raw) WPM:</strong> Measures your raw finger speed including mistakes. If your Gross WPM is 80 but Net WPM is 50, your errors are significantly slowing you down.
            </li>
          </ul>
        </section>
      </article>

      {/* Internal Navigation */}
      <InternalLinksNav currentPath="/wpm-test/" onNavigate={onNavigatePath} />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
