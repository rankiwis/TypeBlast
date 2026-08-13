import React from "react";
import { BookOpen, Target, Sparkles, CheckCircle2 } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { PracticeView } from "../../TypingPractice/PracticeView";

interface TypingPracticePageProps {
  onNavigatePath: (path: string) => void;
}

export const TypingPracticePage: React.FC<TypingPracticePageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://typeblast.com/typing-practice/";
  const pageTitle = "Online Typing Practice | Free Custom Typing Exercises & Drills";
  const metaDescription =
    "Practice typing online with targeted exercises for home row, number row, punctuation, and custom text drills. Build muscle memory and typing speed.";

  const faqs = [
    {
      q: "How many minutes a day should I practice typing online?",
      a: "10 to 15 minutes of focused daily practice yields better muscle memory retentions than long, sporadic 2-hour cramming sessions once a week.",
    },
    {
      q: "Can I paste my own custom text into this practice tool?",
      a: "Yes! TypeBlast allows you to paste custom code snippets, legal text, medical terms, or literature paragraphs to practice specialized vocabulary.",
    },
    {
      q: "Should I focus on speed or accuracy during typing practice?",
      a: "Always prioritize accuracy first during practice drills. Once your fingers hit the correct keys involuntarily without hesitation, your speed will increase automatically.",
    },
    {
      q: "Are these online typing exercises free for students and teachers?",
      a: "Yes! All typing practice drills, custom text modes, and exercises on TypeBlast are 100% free with no account creation needed.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeBlast Online Typing Practice Engine",
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Targeted Skill & Drill Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Free Online Typing Practice & Drills
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Enhance your touch-typing muscle memory with our interactive <strong>free online typing practice exercises</strong>. Master home row keys, number row symbols, programming punctuation, and paste custom text drills to target your specific weak keys.
        </p>
      </header>

      {/* Embedded Practice View Tool */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4" /> Interactive Practice Canvas & Custom Drill Generator
          </span>
          <span>Select category or paste text</span>
        </div>
        <PracticeView />
      </div>

      {/* Educational H2 Sections */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Deliberate Practice: How To Train Your Fingers Effectively
          </h2>
          <p>
            Simply typing random sentences without feedback creates diminishing returns. <strong>Deliberate typing practice</strong> involves breaking down keyboard navigation into individual finger reaches:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">1. Home Row Anchor</h3>
              <p className="text-xs text-slate-400">Practice returning index fingers immediately to <code>F</code> and <code>J</code> after every reach.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">2. Pinky & Ring Isolation</h3>
              <p className="text-xs text-slate-400">Isolate weaker fingers on keys like <code>A, Z, P, Q</code> and shift keys.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="font-bold text-white text-sm">3. Custom Text Drills</h3>
              <p className="text-xs text-slate-400">Paste your daily work material or coding syntax into practice mode for instant real-world transfer.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            Building a Daily 15-Minute Typing Practice Habit
          </h2>
          <p>
            Consistency beats intensity. Spending 15 minutes every morning before starting your workday warm up finger muscles, reduces typing mistakes, and maintains peak typing speed.
          </p>
        </section>
      </article>

      {/* Internal Navigation */}
      <InternalLinksNav currentPath="/typing-practice/" onNavigate={onNavigatePath} />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
