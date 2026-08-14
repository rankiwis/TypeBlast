import React from "react";
import { Activity, ShieldCheck, Zap, Award, Users } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";

interface AboutPageProps {
  onNavigatePath: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://www.typeblast.com/about/";
  const pageTitle = "About TypeBlast Speed Platform - TypeBlast";
  const metaDescription =
    "Learn about TypeBlast, our mission to advance global keyboard literacy, and our free typing speed test and training platform tools.";

  const breadcrumbs = [{ label: "About Us", path: "/about/" }];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About TypeBlast",
      url: canonicalUrl,
      description: metaDescription,
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
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Our Platform Mission</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          About TypeBlast
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          TypeBlast was built with a single objective: to deliver a <strong>sub-millisecond precise</strong> typing test and practice platform that empowers learners, students, developers, and professionals to master speed touch-typing.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <Zap className="w-8 h-8 text-cyan-400" />
          <h3 className="font-bold text-white text-lg">Zero Timer Drift</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our engine uses <code>performance.now()</code> delta tracking rather than uncalibrated intervals, guaranteeing exact timing down to the millisecond.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <Award className="w-8 h-8 text-amber-400" />
          <h3 className="font-bold text-white text-lg">Anti-Tamper Leaderboards</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every daily challenge and leaderboard submission undergoes mathematical validation to ensure fair competition.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <Users className="w-8 h-8 text-purple-400" />
          <h3 className="font-bold text-white text-lg">Gemini AI Coaching</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrated with Google Gemini AI to analyze mistyped key heatmaps and generate targeted custom drills.
          </p>
        </div>
      </div>

      <InternalLinksNav currentPath="/about/" onNavigate={onNavigatePath} />
    </div>
  );
};
