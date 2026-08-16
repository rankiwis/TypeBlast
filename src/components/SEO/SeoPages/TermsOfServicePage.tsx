import React from "react";
import {
  FileText,
  ShieldAlert,
  UserCheck,
  Zap,
  Gamepad2,
  Trophy,
  UploadCloud,
  Ban,
  Activity,
  Award,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";

interface TermsOfServicePageProps {
  onNavigatePath: (path: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://www.typeblast.com/terms/";
  const pageTitle = "Terms of Service - TypeBlast Usage & Fair Play Rules";
  const metaDescription =
    "Read the TypeBlast Terms of Service. Understand our policies regarding website usage, accounts, typing tests, games, leaderboard fair play, and intellectual property.";

  const breadcrumbs = [{ label: "Terms of Service", path: "/terms/" }];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "TypeBlast Terms of Service",
      url: canonicalUrl,
      description: metaDescription,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigatePath} />

      {/* Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Terms & Conditions</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Terms of Service
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
          <span>Last Updated: August 2026</span>
          <span>•</span>
          <span>Agreement Between User & TypeBlast</span>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Please read these Terms of Service carefully before accessing or using the TypeBlast platform. By accessing or using any part of the site, you agree to become bound by these terms.
        </p>
      </header>

      {/* Terms Sections */}
      <div className="space-y-6">
        {/* 1. Website Usage */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">1. Website Usage & General Access</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            TypeBlast provides an online touch typing evaluation, practice, education, and arcade gaming platform. You may use our service for personal, non-commercial, educational, or professional skill development purposes in compliance with all applicable laws and these Terms.
          </p>
        </section>

        {/* 2. User Accounts */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">2. User Accounts & Registration</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You may create an account to save typing test history, unlock verified certificates, and submit scores to competitive leaderboards. When creating an account:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>You agree to provide accurate and truthful information.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You are responsible for all activities that occur under your account.</li>
            <li>You must promptly notify us if you suspect unauthorized access to your account.</li>
          </ul>
        </section>

        {/* 3. Typing Tests & Benchmark Scoring */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">3. Typing Tests & Measurement Standards</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All typing speed assessments on TypeBlast adhere to the standardized international metric: <strong>1 Word = 5 Keystrokes</strong> (including spaces and punctuation). Net WPM is computed as <code>(Correct Characters / 5) / Elapsed Minutes</code>. Tests must be performed directly by a human user through physical or on-screen keyboard inputs.
          </p>
        </section>

        {/* 4. Arcade Games & Mini-Games */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">4. Arcade Games & Mini-Game Progression</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Games such as Word Blast, Time Attack, and Typing Race are designed for interactive skill building. Game scoring, combos, and difficulty multipliers are balanced by TypeBlast's game engine. Attempting to exploit game timing bugs or alter client-side memory values is strictly prohibited.
          </p>
        </section>

        {/* 5. Leaderboards & Fair Play Policy */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">5. Leaderboards & Fair Play Policy</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To preserve the integrity of competitive leaderboards and daily challenges:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>
              <strong>Anti-Bot Rule:</strong> Automated software scripts, macro tools, browser automation extensions, or artificial keystroke emulators are strictly forbidden.
            </li>
            <li>
              <strong>Mathematical Telemetry:</strong> All score submissions are verified against keystroke duration, character count consistency, and speed physics before being added to public leaderboards.
            </li>
            <li>
              <strong>Disqualification:</strong> Scores flagged as fraudulent or tampered will be rejected, and repeat offenders may have their leaderboard access or account revoked.
            </li>
          </ul>
        </section>

        {/* 6. User Submissions & Custom Content */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">6. User Submissions & Custom Practice Text</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When you enter custom text into practice modes or configure your profile:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>You retain ownership of any original text you paste or submit.</li>
            <li>You agree not to submit display names or feedback containing abusive, harassing, defamatory, or unlawful content.</li>
            <li>You grant TypeBlast the right to process your inputs temporarily for the purpose of executing the typing test.</li>
          </ul>
        </section>

        {/* 7. Prohibited Activities */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Ban className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">7. Prohibited Activities</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You may not engage in any of the following activities on TypeBlast:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>Attempting to probe, scan, or exploit vulnerabilities in our application or API infrastructure.</li>
            <li>Deploying denial-of-service attacks, rate-limit bypassing, or payload flooding.</li>
            <li>Reverse-engineering, decompiling, or disassembling our backend application code.</li>
            <li>Scraping user profiles or leaderboard rankings for commercial spam or data harvesting.</li>
          </ul>
        </section>

        {/* 8. Service Availability & Modifications */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">8. Service Availability & Modifications</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We strive to maintain continuous uptime and platform stability. However, TypeBlast is provided on an <strong>"as is" and "as available"</strong> basis. We reserve the right to modify, update, enhance, or temporarily suspend features for maintenance, security patches, or upgrades without prior notice.
          </p>
        </section>

        {/* 9. Intellectual Property */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">9. Intellectual Property Rights</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The TypeBlast name, logo, software interface, custom switch sound synthesizer routines, algorithms, certificates, and design elements are the intellectual property of TypeBlast and protected under applicable copyright and intellectual property laws. You may not duplicate or reproduce core branding without written consent.
          </p>
        </section>

        {/* 10. Limitation of Liability */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">10. Limitation of Liability & Disclaimers</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To the maximum extent permitted by applicable law, TypeBlast and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of, or inability to use, the platform, test scoring data, or third-party service integrations.
          </p>
        </section>
      </div>

      <InternalLinksNav currentPath="/terms/" onNavigate={onNavigatePath} />
    </div>
  );
};
