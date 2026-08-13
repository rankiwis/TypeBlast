import React, { useState } from "react";
import { Target, Keyboard, Hand, CheckCircle2, ShieldCheck } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { FaqSection } from "../FaqSection";
import { TypingTestView } from "../../TypingTest/TypingTestView";
import { TypingStats, TabType } from "../../../types";

interface TouchTypingPageProps {
  onTestComplete: (stats: TypingStats) => void;
  setActiveTab: (tab: TabType) => void;
  onNavigatePath: (path: string) => void;
}

export const TouchTypingPage: React.FC<TouchTypingPageProps> = ({
  onTestComplete,
  setActiveTab,
  onNavigatePath,
}) => {
  const canonicalUrl = "https://typeblast.com/touch-typing/";
  const pageTitle = "Learn Touch Typing Online | Free Guide & Finger Placement Guide";
  const metaDescription =
    "Learn touch typing without looking at the keyboard. Master home row finger positioning (ASDF JKL;), visual finger maps, and muscle memory drills.";

  const [selectedFinger, setSelectedFinger] = useState<string>("left-index");

  const fingerAssignments = [
    { id: "left-pinky", name: "Left Pinky", color: "text-rose-400 bg-rose-500/10 border-rose-500/30", keys: "Q, A, Z, 1, Tab, Caps, Shift" },
    { id: "left-ring", name: "Left Ring", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", keys: "W, S, X, 2" },
    { id: "left-middle", name: "Left Middle", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", keys: "E, D, C, 3" },
    { id: "left-index", name: "Left Index", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", keys: "R, T, F, G, V, B, 4, 5 (Anchor: F)" },
    { id: "thumbs", name: "Both Thumbs", color: "text-purple-400 bg-purple-500/10 border-purple-500/30", keys: "Spacebar" },
    { id: "right-index", name: "Right Index", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", keys: "Y, U, H, J, N, M, 6, 7 (Anchor: J)" },
    { id: "right-middle", name: "Right Middle", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", keys: "I, K, <, 8" },
    { id: "right-ring", name: "Right Ring", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", keys: "O, L, >, 9" },
    { id: "right-pinky", name: "Right Pinky", color: "text-rose-400 bg-rose-500/10 border-rose-500/30", keys: "P, ;, ', /, 0, -, =, Enter, Backspace" },
  ];

  const faqs = [
    {
      q: "What is touch typing?",
      a: "Touch typing is a typing technique where the typist uses muscle memory to locate keys without looking down at the keyboard layout.",
    },
    {
      q: "Why are there raised bumps on the F and J keys?",
      a: "The tactile ridges or bumps on the F and J keys allow typists to position their index fingers on the home row anchors blindly by touch alone.",
    },
    {
      q: "How long does it take to learn touch typing?",
      a: "With 15 minutes of daily practice, most beginners memorize all key positions within 2 weeks and achieve 50+ WPM touch typing speed within 30 days.",
    },
    {
      q: "Is touch typing faster than hunt-and-peck typing?",
      a: "Yes! Hunt-and-peck typists max out around 30-40 WPM due to head bobbing, whereas touch typists easily reach 80-120+ WPM because their eyes remain focused on the screen.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeBlast Touch Typing Learning Hub",
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-rose-400" />
          <span>Muscle Memory & Blind Typing Masterclass</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Master Touch Typing Without Looking at the Keyboard
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Learn the essential skill of <strong>touch typing</strong>. Master the <strong>Home Row (ASDF JKL;)</strong> finger positioning, leverage the tactile ridges on <strong>F and J</strong> keys, and follow our visual finger assignment map to type effortlessly without looking down.
        </p>
      </header>

      {/* Interactive Finger Assignment Matrix Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
            <Hand className="w-4 h-4" />
            <span>Interactive Touch Typing Finger-to-Key Guide</span>
          </div>
          <span className="text-xs text-slate-400">Click a finger to view key coverage</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {fingerAssignments.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFinger(f.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedFinger === f.id
                  ? `${f.color} ring-1 ring-cyan-400 shadow-md`
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="text-xs font-bold uppercase font-mono">{f.name}</div>
              <div className="text-[11px] mt-1 font-mono text-slate-300 truncate">{f.keys}</div>
            </button>
          ))}
        </div>

        {/* Selected Finger Details */}
        {selectedFinger && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Assigned Keys:</span>
              <p className="text-sm font-mono text-white font-bold">
                {fingerAssignments.find((f) => f.id === selectedFinger)?.keys}
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
              Always return to Home Row
            </span>
          </div>
        )}
      </div>

      {/* Embedded Touch Typing Test Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-rose-400">
            <Keyboard className="w-4 h-4" /> Touch Typing Practice Canvas
          </span>
          <span>Keep your eyes on the screen!</span>
        </div>
        <TypingTestView onTestComplete={onTestComplete} setActiveTab={setActiveTab} />
      </div>

      {/* Educational Content Sections */}
      <article className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            The Home Row Anchors: ASDF JKL; and the F/J Tactile Bumps
          </h2>
          <p>
            The foundation of touch typing relies on the <strong>Home Row</strong>. Rest your left hand fingers on <code>A - S - D - F</code> and right hand fingers on <code>J - K - L - ;</code>. Notice the tiny raised plastic ridges on the <code>F</code> and <code>J</code> keys—these allow you to re-center your hands blindly without glancing down.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Step-by-Step Guide To Learning Touch Typing in 30 Days
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm">
            <li><strong>Week 1 (Home Row):</strong> Practice <code>ASDF</code> and <code>JKL;</code> keys until you hit them 100% blindly.</li>
            <li><strong>Week 2 (Top Row):</strong> Expand to upper reaches: <code>QWERTY</code> and <code>UIOP</code>.</li>
            <li><strong>Week 3 (Bottom Row & Punctuation):</strong> Master <code>ZXCVB</code>, <code>NM</code>, commas, and periods.</li>
            <li><strong>Week 4 (Speed & Numbers):</strong> Build fluid sentences and incorporate top row numbers.</li>
          </ol>
        </section>
      </article>

      {/* Internal Navigation */}
      <InternalLinksNav currentPath="/touch-typing/" onNavigate={onNavigatePath} />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
