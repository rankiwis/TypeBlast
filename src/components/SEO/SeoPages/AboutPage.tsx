import React from "react";
import {
  Activity,
  Zap,
  Award,
  Users,
  Code2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Target,
  Clock,
  Compass,
  Cpu,
} from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";

interface AboutPageProps {
  onNavigatePath: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://www.typeblast.com/about/";
  const pageTitle = "About TypeBlast - Modern Touch Typing & Speed Platform";
  const metaDescription =
    "Discover TypeBlast: what we do, our precision typing technology, and who we serve — from students and educators to programmers, writers, and competitive typists.";

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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigatePath} />

      {/* Hero Section */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>About TypeBlast</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Empowering High-Velocity, Accurate Typing for Everyone
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
          TypeBlast is a modern, high-precision typing platform engineered to help people of all skill levels develop muscle memory, eliminate keyboard hunting, and unlock effortless typing speed.
        </p>
      </header>

      {/* What TypeBlast Does */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
            Core Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">What TypeBlast Does</h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            We combine sub-millisecond timer precision, real-time keystroke telemetry, gamified practice modes, and intelligent error analysis into a distraction-free typing environment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-bold text-white text-base">Standardized Speed Benchmarks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Timed 15s, 30s, 60s, and 120s assessments calculating Net WPM, Gross WPM, Accuracy, and CPM using the universal 5-character word standard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-base">AI Performance Coaching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes your keystroke rhythm, recurring mistake patterns, and finger transitions to generate targeted drills tailored to your weak spots.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Gamepad2Icon className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-white text-base">Arcade Keyboard Games</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engaging games like Word Blast, Time Attack, and Typing Race that turn repetitive practice into high-replay reflexes and stamina training.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-base">Targeted Practice Modules</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drills for home row mastery, number rows, punctuation, programming syntax, and custom user-pasted practice texts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-white text-base">Verified Speed Certificates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn shareable, verifiable digital certificates documenting your validated typing milestones, WPM tier, and accuracy percentage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="font-bold text-white text-base">Fair Play Leaderboards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daily, weekly, and all-time leaderboards safeguarded by anti-tamper telemetry to ensure every ranking is genuine and earned.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            Our Community
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Who TypeBlast Serves</h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Keyboard literacy is a foundational superpower for modern education, careers, and creative work. TypeBlast is built for diverse communities worldwide:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Students & Young Learners</h3>
                <p className="text-xs text-slate-400">K-12 & University Education</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Typing without looking at the keys allows students to focus cognitive energy on creative expression, homework, and exam essays rather than hunting for letters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Software Engineers & Tech Professionals</h3>
                <p className="text-xs text-slate-400">Developers, DevOps & Terminal Users</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Speed and accuracy with curly braces, brackets, symbols, and identifier naming directly translate into faster coding flow states and fewer syntax mistakes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Writers, Transcribers & Office Professionals</h3>
                <p className="text-xs text-slate-400">Content Creators, Legal & Administrative Staff</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Drafting emails, reports, documentation, and transcripts at 70+ WPM saves hours each week while reducing physical wrist and hand fatigue through proper ergonomic technique.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Speed Typists & Keyboard Enthusiasts</h3>
                <p className="text-xs text-slate-400">Mechanical Keyboard & Competitive Typists</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              With realistic acoustic switch simulations, timer drift prevention, and detailed post-test percentile analysis, enthusiasts can benchmark custom boards and push beyond 120+ WPM.
            </p>
          </div>
        </div>
      </section>

      {/* Engineering & Design Philosophy */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" /> Our Technical Philosophy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> Sub-Millisecond Timing
            </div>
            <p className="text-slate-400">
              Timers are benchmarked against monotonic timestamps (<code>performance.now()</code>) so browser background tab throttling never causes timer drift.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Privacy First
            </div>
            <p className="text-slate-400">
              Keystrokes are evaluated in client-side memory. We do not record keylogger streams or store private text.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-400" /> Free & Accessible
            </div>
            <p className="text-slate-400">
              Core typing tests, lessons, practice modes, and game challenges are free to use without mandatory sign-up walls.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Action CTA */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Ready to test your typing speed?</h3>
          <p className="text-xs text-slate-300">Take a free 60-second test and discover your WPM baseline in seconds.</p>
        </div>
        <button
          onClick={() => onNavigatePath("/typing-test/")}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shrink-0 shadow-lg shadow-cyan-500/20"
        >
          Start Typing Test
        </button>
      </div>

      <InternalLinksNav currentPath="/about/" onNavigate={onNavigatePath} />
    </div>
  );
};

function Gamepad2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}
