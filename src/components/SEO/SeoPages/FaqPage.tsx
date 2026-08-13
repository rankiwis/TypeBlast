import React from "react";
import { HelpCircle } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";

interface FaqPageProps {
  onNavigatePath: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://typeblast.com/faq/";
  const pageTitle = "Typing Test FAQs & Speed Questions - TypeBlast";
  const metaDescription =
    "Find answers to common questions about typing speed tests, WPM scoring, keyboard accuracy, touch typing techniques, and certificates.";

  const breadcrumbs = [{ label: "FAQ", path: "/faq/" }];

  const mainFaqs = [
    {
      q: "How does TypeBlast calculate Words Per Minute (WPM)?",
      a: "TypeBlast follows the international standardized formula: 1 Word = 5 Keystrokes (including letters, spaces, and punctuation). Net WPM = (Total Correct Characters / 5) / (Elapsed Minutes).",
    },
    {
      q: "Is TypeBlast completely free to use?",
      a: "Yes! All typing tests, custom practice drills, arcade games, daily challenges, and downloadable certificates on TypeBlast are 100% free.",
    },
    {
      q: "What is considered a good typing speed?",
      a: "Average typing speed is around 40 WPM with 95% accuracy. Fast typists achieve 60-75 WPM, while competitive typists and professionals exceed 80-100+ WPM.",
    },
    {
      q: "How do official typing speed certificates work?",
      a: "After completing a 60-second or 3-minute test with at least 95% accuracy, you can generate an official TypeBlast Speed Certificate with a unique verification ID.",
    },
    {
      q: "How does the AI Typing Coach work?",
      a: "Powered by Google Gemini AI, the AI Coach analyzes your mistyped key heatmaps and error patterns to generate customized practice drills targeting your exact finger reaches.",
    },
    {
      q: "Is my typing data kept private?",
      a: "Yes. All keystrokes and speed metrics are processed locally in your browser and stored securely in local state without selling personal data.",
    },
  ];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: mainFaqs.map((f) => ({
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

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Complete Knowledge Base</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Frequently Asked Questions
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Everything you need to know about typing benchmarks, WPM formulas, accuracy calculations, daily challenges, and AI coaching.
        </p>
      </header>

      <FaqSection title="All Common Questions" description="Browse answers to common questions about TypeBlast platform capabilities." faqs={mainFaqs} />

      <InternalLinksNav currentPath="/faq/" onNavigate={onNavigatePath} />
    </div>
  );
};
