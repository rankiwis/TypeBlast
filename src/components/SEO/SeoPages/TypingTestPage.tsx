import React from "react";
import { CheckCircle2, ShieldCheck, Clock, BarChart2 } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { generateBreadcrumbSchema } from "../Breadcrumbs";
import { TypingTestView } from "../../TypingTest/TypingTestView";
import { TypingStats, TabType } from "../../../types";

interface TypingTestPageProps {
  onTestComplete: (stats: TypingStats) => void;
  setActiveTab: (tab: TabType) => void;
  onNavigatePath: (path: string) => void;
}

export const TypingTestPage: React.FC<TypingTestPageProps> = ({
  onTestComplete,
  setActiveTab,
  onNavigatePath,
}) => {
  const canonicalUrl = "https://www.typeblast.com/typing-test/";
  const pageTitle = "Free Online Typing Speed Test - TypeBlast";
  const metaDescription =
    "Take our free online typing test to measure your WPM speed and accuracy. Instant results with 15s, 30s, 60s, and 3-minute test options.";

  const breadcrumbs = [{ label: "Typing Test", path: "/typing-test/" }];

  const faqs = [
    {
      q: "How is typing speed (WPM) calculated on TypeBlast?",
      a: "Net WPM is calculated using the international standard formula: (Total Correct Characters / 5) divided by Elapsed Minutes. Uncorrected errors reduce your net WPM score, rewarding both speed and accuracy under realistic workplace typing conditions.",
    },
    {
      q: "Is TypeBlast free to use?",
      a: "Yes! TypeBlast provides 100% free online typing speed tests, custom practice drills, arcade games, daily sprints, and official downloadable certificates without requiring subscriptions or paywalls.",
    },
    {
      q: "How long is a standard typing test online?",
      a: "Standard online typing tests typically offer 15-second, 30-second, 60-second (1-minute), and 3-minute options. The 60-second duration is the international standard for employment assessments, certifications, and school benchmarks.",
    },
    {
      q: "What is a good typing test score for employment?",
      a: "An average typing speed is around 40 WPM with 95% accuracy. Administrative, customer support, and data entry roles often require 60 to 75 WPM, while software engineers, executive assistants, and transcriptionists frequently exceed 80 to 100+ WPM.",
    },
    {
      q: "How does anti-tamper score validation work?",
      a: "TypeBlast validates keystroke timing logs, elapsed time, and mathematical character metrics before saving or posting scores to prevent automated scripts or tampered entries on global leaderboards.",
    },
    {
      q: "How can I improve my typing speed and accuracy?",
      a: "Focus on touch typing fundamentals: anchor your fingers on the Home Row (A-S-D-F and J-K-L-;), avoid looking down at the keyboard, and maintain a smooth, steady cadence. Utilize our Gemini AI Coach for targeted error analysis and finger-reach diagnostics.",
    },
    {
      q: "Does TypeBlast support code typing practice for programmers?",
      a: "Yes! We provide specialized code typing exercises featuring real JavaScript, Python, C++, and HTML syntax to help developers master speed with brackets, semicolons, quotes, and indentation.",
    },
    {
      q: "Can teachers and schools track student typing progress?",
      a: "Yes! Teachers can utilize the Schools & Teachers Portal to manage student rosters, track lesson completion, view real-time WPM benchmarks, and export gradebook CSV reports.",
    },
  ];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeBlast Online Typing Test",
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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      {/* Embedded Interactive Typing Test Tool */}
      <TypingTestView onTestComplete={onTestComplete} setActiveTab={setActiveTab} />

      {/* Helpful Educational H2 Sections */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            What Does a Standard Online Typing Test Measure?
          </h2>
          <p>
            An online <strong>typing test</strong> evaluates two primary metrics: <strong>Net Words Per Minute (WPM)</strong> and <strong>Accuracy Percentage</strong>. While gross speed counts total characters typed over time, net WPM factors in uncorrected mistakes, ensuring that speed is balanced with workplace reliability.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-xs uppercase font-mono">Net WPM Speed</strong>
                <span className="text-xs text-slate-400">Measures usable output without uncorrected errors.</span>
              </div>
            </li>
            <li className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-xs uppercase font-mono">Keystroke Accuracy %</strong>
                <span className="text-xs text-slate-400">Percentage of correctly struck keys versus total key hits.</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Standard Test Durations: 15s, 30s, 60s & 3-Minute Benchmarks
          </h2>
          <p>
            Depending on your goal, choosing the right duration ensures an accurate benchmark:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">15s / 30s Sprints</h3>
              <p className="text-xs text-slate-400">Ideal for warm-ups, testing peak finger velocity, and quick reflex drills.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">60s Standard Test</h3>
              <p className="text-xs text-slate-400">The standard benchmark accepted by employers, civil service exams, and schools.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">3-Minute Endurance</h3>
              <p className="text-xs text-slate-400">Tests sustained concentration, rhythm maintenance, and stamina over long paragraphs.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            How To Prepare for Your Typing Speed Assessment
          </h2>
          <p>
            To achieve your highest score during a official typing test:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2 text-xs sm:text-sm text-slate-300">
            <li><strong>Sit Up Straight:</strong> Maintain upright posture with feet flat on the floor and elbows bent at a 90-degree angle.</li>
            <li><strong>Anchor Home Row:</strong> Keep left fingers lightly on <code>A-S-D-F</code> and right fingers on <code>J-K-L-;</code>.</li>
            <li><strong>Focus on Rhythm:</strong> Avoid typing in bursts; maintain a continuous, steady cadence across sentences.</li>
            <li><strong>Look at the Screen:</strong> Keep eyes fixed on the target text rather than looking down at keys.</li>
          </ol>
        </section>
      </article>

      {/* Internal Navigation Section */}
      <InternalLinksNav currentPath="/typing-test/" onNavigate={onNavigatePath} />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
