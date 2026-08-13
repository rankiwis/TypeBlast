import React, { useState } from "react";
import { Award, Printer, Download, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { TypingStats } from "../../types";

interface CertificatesViewProps {
  lastStats: TypingStats | null;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ lastStats }) => {
  const [userName, setUserName] = useState("Alex Johnson");
  const [certTier, setCertTier] = useState<"Gold Certified" | "Platinum Certified" | "Master Certified">("Master Certified");

  const wpm = lastStats?.wpm || 88;
  const accuracy = lastStats?.accuracy || 98.5;
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const verificationCode = `TB-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Verified Speed Certification Studio</span>
          </h3>
          <p className="text-xs text-slate-400">Generate an official certificate of typing speed proficiency</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter Your Full Name"
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
          />

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card Canvas (Printable Target) */}
      <div
        id="certificate-print-area"
        className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/40 shadow-2xl relative overflow-hidden space-y-8 text-center"
      >
        {/* Subtle Watermark BG */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Certificate Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
            <Award className="w-8 h-8" />
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">Official Certification of Mastery</div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            TYPEBLAST SPEED & ACCURACY DIPLOMA
          </h1>
        </div>

        {/* Recipient Line */}
        <div className="space-y-2 py-4 border-y border-amber-500/20">
          <p className="text-xs uppercase font-mono tracking-widest text-slate-400">This certifies that</p>
          <p className="text-3xl sm:text-4xl font-bold font-serif text-amber-300 underline underline-offset-8 decoration-amber-500/40">
            {userName || "Your Name"}
          </p>
          <p className="text-xs text-slate-300 max-w-lg mx-auto pt-2">
            has successfully demonstrated professional typing speed and precision under verified timing standards.
          </p>
        </div>

        {/* Key Benchmark Metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Verified Speed</div>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono">{wpm} <span className="text-xs font-normal">WPM</span></div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Accuracy</div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">{accuracy}%</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Tier Rank</div>
            <div className="text-xs font-bold text-amber-300 font-mono mt-2">{certTier}</div>
          </div>
        </div>

        {/* Certificate Signatures & Security Stamp */}
        <div className="flex items-center justify-between pt-6 text-xs text-slate-400 border-t border-slate-800">
          <div className="text-left space-y-1">
            <div className="font-mono text-amber-400 font-bold">{verificationCode}</div>
            <div className="text-[10px] text-slate-500">Verification Hash • {dateStr}</div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TypeBlast Verified</span>
          </div>

          <div className="text-right space-y-1">
            <div className="font-serif italic text-slate-200 text-sm font-bold">TypeBlast Certification Board</div>
            <div className="text-[10px] text-slate-500">Authorized Digital Seal</div>
          </div>
        </div>
      </div>
    </div>
  );
};
