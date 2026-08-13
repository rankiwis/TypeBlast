import React from "react";
import { FileText, ShieldAlert } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";

interface TermsOfServicePageProps {
  onNavigatePath: (path: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://typeblast.com/terms/";
  const pageTitle = "Terms of Service | TypeBlast";
  const metaDescription =
    "Read TypeBlast's Terms of Service. Learn about platform fair play rules, leaderboard integrity, certificate validation, and user terms.";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
      />

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Terms & Conditions</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Terms of Service
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          By accessing or using TypeBlast, you agree to comply with our platform terms and fair play guidelines.
        </p>
      </header>

      <article className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" /> 1. Leaderboard Fair Play & Anti-Bot Policy
          </h2>
          <p>
            Users are strictly prohibited from utilizing automated typing scripts, macro tools, or software bots to forge typing test scores on global leaderboards or daily challenges. Submissions that fail mathematical anti-tamper telemetry will be flagged and disqualified.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" /> 2. Speed Certificates
          </h2>
          <p>
            TypeBlast speed certificates reflect test performances completed on the platform under standard timer rules. Certificates are issued digitally with unique verification codes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" /> 3. Service Availability
          </h2>
          <p>
            TypeBlast is provided "as is" and "as available". We continuously update platform features, typing passages, and AI coach integrations to ensure maximum uptime.
          </p>
        </section>
      </article>

      <InternalLinksNav currentPath="/terms/" onNavigate={onNavigatePath} />
    </div>
  );
};
