import React from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";

interface PrivacyPolicyPageProps {
  onNavigatePath: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://typeblast.com/privacy/";
  const pageTitle = "Privacy Policy & Data Protection - TypeBlast";
  const metaDescription =
    "Read the official TypeBlast privacy policy. Learn how we protect your personal information, user account data, and typing test scores.";

  const breadcrumbs = [{ label: "Privacy Policy", path: "/privacy/" }];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Data Protection Standards</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          At TypeBlast, we take user privacy and security seriously. Your typing test keystrokes are processed locally in real-time within your web browser.
        </p>
      </header>

      <article className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" /> 1. No Keylogging or Keystroke Storage
          </h2>
          <p>
            TypeBlast does NOT record, transmit, or store keylog logs of what you type during custom text or typing tests on external servers. Keystroke inputs are evaluated transiently inside your browser's memory.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" /> 2. Local Storage Persistence
          </h2>
          <p>
            Your personal best WPM scores, daily streak counts, and sound profile preferences are stored locally on your own device via standard browser <code>localStorage</code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" /> 3. COPPA & Student Privacy Compliance
          </h2>
          <p>
            TypeBlast is safe for educational use in elementary schools, middle schools, and high schools. We do not sell student data or require mandatory registration for core typing features.
          </p>
        </section>
      </article>

      <InternalLinksNav currentPath="/privacy/" onNavigate={onNavigatePath} />
    </div>
  );
};
