import React from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  Cookie,
  UserCheck,
  BarChart3,
  Server,
  Trash2,
  HelpCircle,
  Clock,
  Key,
} from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";

interface PrivacyPolicyPageProps {
  onNavigatePath: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://www.typeblast.com/privacy-policy/";
  const pageTitle = "Privacy Policy - TypeBlast Data Protection & Privacy";
  const metaDescription =
    "Read the official TypeBlast Privacy Policy. Understand how we handle account details, typing test data, analytics, cookies, leaderboards, and your privacy rights.";

  const breadcrumbs = [{ label: "Privacy Policy", path: "/privacy-policy/" }];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "TypeBlast Privacy Policy",
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Privacy & Data Transparency</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
          <span>Last Updated: August 2026</span>
          <span>•</span>
          <span>Scope: TypeBlast Web Application & Services</span>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          At TypeBlast, we believe privacy is fundamental. This policy explains clearly and transparently what data we process, how it is used, and how your privacy is protected when you use TypeBlast.
        </p>
      </header>

      {/* Policy Content Sections */}
      <div className="space-y-6">
        {/* 1. Typing-Test Data & Real-Time Processing */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">1. Typing-Test Data & In-Browser Processing</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When you take a typing test or practice on TypeBlast, your individual keystrokes are evaluated <strong>locally inside your web browser</strong> in real-time.
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>
              <strong>No Keylogger Logging:</strong> We do not log, stream, or retain keystroke transcripts of private or custom text pasted into practice modules.
            </li>
            <li>
              <strong>Calculated Metrics:</strong> At the conclusion of a test, only aggregate numerical performance statistics (Net WPM, Gross WPM, Accuracy percentage, CPM, duration, error count, and character counts) are computed.
            </li>
            <li>
              <strong>Guest Mode:</strong> If you are not signed in, test results are stored solely in your local browser cache (localStorage) and never transmitted to our backend servers unless you submit a verified score.
            </li>
          </ul>
        </section>

        {/* 2. Account Information */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">2. Account Information</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Creating an account is completely optional. If you choose to register an account, we collect:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>
              <strong>Username:</strong> A unique public identifier chosen by you to associate with your typing records.
            </li>
            <li>
              <strong>Display Name:</strong> An optional public name shown on certificates and leaderboards.
            </li>
            <li>
              <strong>Email Address:</strong> Used strictly for account authentication, account security, and critical service notifications. We do not sell or rent your email address to advertisers.
            </li>
            <li>
              <strong>Password Security:</strong> Passwords are cryptographically salted and hashed using standard server-side PBKDF2 hashing before storage. We never store or transmit plaintext passwords.
            </li>
          </ul>
        </section>

        {/* 3. Authentication & Sessions */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">3. Authentication & Session Management</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When you log in, the server generates a cryptographically random session token transmitted via standard <code>Authorization: Bearer</code> headers. Session tokens allow your browser to securely access your personal dashboard, test history, and certificates without transmitting your password on every request.
          </p>
        </section>

        {/* 4. Cookies & Local Storage */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cookie className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">4. Cookies & Local Browser Storage</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            TypeBlast utilizes minimal client-side browser storage (such as <code>localStorage</code>) to maintain essential site functionality:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>
              <strong>User Preferences:</strong> Storing your selected mechanical switch audio profile, volume settings, and timer duration presets.
            </li>
            <li>
              <strong>Offline / Guest History:</strong> Maintaining your personal best scores and streak counter on your local device.
            </li>
            <li>
              <strong>Session Persistence:</strong> Keeping you securely signed in between visits.
            </li>
            <li>
              <strong>No Third-Party Ad Cookies:</strong> We do not place third-party behavioral advertising cookies or tracking beacons on your browser.
            </li>
          </ul>
        </section>

        {/* 5. Leaderboard Information */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">5. Public Leaderboards & Game Scores</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you participate in competitive typing tests, daily challenges, or arcade games (Word Blast, Time Attack, Typing Race), your score submission includes:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>
              <strong>Public Fields:</strong> Username, display name, WPM score, accuracy percentage, test duration category, and timestamp.
            </li>
            <li>
              <strong>Private Fields:</strong> Your email address and account ID are <strong>never</strong> displayed on public leaderboards or queryable by third parties.
            </li>
          </ul>
        </section>

        {/* 6. Analytics & Diagnostic Data */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">6. Analytics & Performance Diagnostics</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We collect basic aggregate telemetry to monitor platform stability, fix software bugs, and assess feature adoption (e.g. test completions, game mode selections, or page load latency). This telemetry is anonymized and not correlated with your personal offline identity.
          </p>
        </section>

        {/* 7. Third-Party Services */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">7. Third-Party Integrations & Infrastructure</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            TypeBlast engages select infrastructure and service providers to operate reliably:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>
              <strong>Cloud Hosting:</strong> Cloud Run and container infrastructure hosted in secure Google Cloud data centers.
            </li>
            <li>
              <strong>AI Coaching (Google Gemini):</strong> If you use the AI Coach feature, only your aggregate typing statistics (WPM, accuracy, and specific mistyped key pairs like <code>r/t</code>) are sent to the AI API to generate customized drill recommendations. No personal account credentials or private documents are shared with the model.
            </li>
          </ul>
        </section>

        {/* 8. Data Retention */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">8. Data Retention</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We retain account credentials and associated test history for as long as your account remains active. If you request account closure or data deletion, your personal information, session tokens, and historical test logs are purged from our primary databases.
          </p>
        </section>

        {/* 9. User Rights & Data Control */}
        <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">9. User Privacy Rights & Requests</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every TypeBlast user has the right to control their personal data:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1.5 pl-2">
            <li>
              <strong>Right to Access & Export:</strong> You can view all saved typing session history, milestones, and certificates directly on your user dashboard.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can update your display name or account profile settings at any time.
            </li>
            <li>
              <strong>Right to Erasure (Deletion):</strong> You may request the full deletion of your user account and test records by contacting our team.
            </li>
            <li>
              <strong>Exercising Rights:</strong> To submit a data request, please email{" "}
              <span className="font-mono text-cyan-400 font-semibold">privacy@typeblast.com</span> or use our{" "}
              <button
                onClick={() => onNavigatePath("/contact/")}
                className="text-cyan-400 underline hover:text-cyan-300 font-semibold"
              >
                Contact Form
              </button>
              .
            </li>
          </ul>
        </section>
      </div>

      <InternalLinksNav currentPath="/privacy-policy/" onNavigate={onNavigatePath} />
    </div>
  );
};
