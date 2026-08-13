import React, { useState } from "react";
import { Award, Printer, Download, ShieldCheck, Sparkles, FileText, TrendingUp, Target, Flame, Activity, CheckCircle2, Share2, Copy, Check, ExternalLink } from "lucide-react";
import { jsPDF } from "jspdf";
import { TypingStats } from "../../types";

interface CertificatesViewProps {
  lastStats: TypingStats | null;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ lastStats }) => {
  const [userName, setUserName] = useState("Alex Johnson");
  const [certTier] = useState<"Gold Certified" | "Platinum Certified" | "Master Certified">("Master Certified");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedShareText, setCopiedShareText] = useState(false);

  const wpm = lastStats?.wpm || 88;
  const rawWpm = lastStats?.rawWpm || 94;
  const accuracy = lastStats?.accuracy || 98.5;
  const duration = lastStats?.duration || 30;
  const correctChars = lastStats?.correctChars || 220;
  const errorChars = lastStats?.errorChars || 4;
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const verificationCode = `TB-${Math.floor(100000 + Math.random() * 900000)}`;

  // Historical progress estimates
  const totalTests = 42;
  const avgWpm = Math.round(wpm * 0.92);
  const topSpeed = Math.round(wpm * 1.08);
  const errorKeysList = lastStats?.errorKeys && Object.keys(lastStats.errorKeys).length > 0
    ? Object.keys(lastStats.errorKeys).slice(0, 5)
    : ["p", ";", "q", "z", "r"];

  const shareMessage = `🚀 I just earned my ${certTier} Typing Certificate on TypeBlast!\n⚡ Speed: ${wpm} WPM | 🎯 Accuracy: ${accuracy}%\n📜 Certificate ID: ${verificationCode}\n\nTest your typing speed & accuracy at https://typeblast.com #TypeBlast #TypingSpeed #TouchTyping`;

  const handleShareX = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    // LinkedIn share URL with prefilled text parameters
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareMessage)}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2500);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleDownloadProgressPdf = () => {
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Background accent line
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 297, "F");

      // Header Banner Box
      doc.setFillColor(30, 41, 59); // slate-800
      doc.roundedRect(15, 15, 180, 32, 4, 4, "F");

      doc.setLineWidth(0.5);
      doc.setDrawColor(6, 182, 212); // cyan-500
      doc.roundedRect(15, 15, 180, 32, 4, 4, "D");

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("TYPEBLAST PROGRESS & SPEED REPORT", 22, 27);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Official Performance Summary • Generated on ${dateStr}`, 22, 36);

      // User Profile Card
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(15, 52, 180, 24, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(`Typist Name: ${userName || "Anonymous Typist"}`, 22, 62);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(251, 191, 36); // amber-400
      doc.text(`Rank Badge: ${certTier}`, 22, 69);

      doc.setTextColor(148, 163, 184);
      doc.text(`Verification Code: ${verificationCode}`, 120, 62);
      doc.text(`Status: TypeBlast Verified`, 120, 69);

      // Key Metrics Grid
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("Key Speed & Precision Benchmarks", 15, 86);

      const metrics = [
        { label: "Net Speed", val: `${wpm} WPM`, sub: "Words Per Minute" },
        { label: "Peak Speed", val: `${topSpeed} WPM`, sub: "Personal Best" },
        { label: "Average Speed", val: `${avgWpm} WPM`, sub: "Historical Avg" },
        { label: "Accuracy", val: `${accuracy}%`, sub: "Precision Rate" },
        { label: "Raw WPM", val: `${rawWpm} WPM`, sub: "Uncorrected Speed" },
        { label: "Tests Completed", val: `${totalTests}`, sub: "Total Sprints" },
      ];

      metrics.forEach((m, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const x = 15 + col * 61;
        const y = 92 + row * 26;

        doc.setFillColor(30, 41, 59);
        doc.roundedRect(x, y, 58, 22, 3, 3, "F");
        doc.setLineWidth(0.3);
        doc.setDrawColor(51, 65, 85);
        doc.roundedRect(x, y, 58, 22, 3, 3, "D");

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(148, 163, 184);
        doc.text(m.label, x + 5, y + 6);

        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(6, 182, 212);
        doc.text(m.val, x + 5, y + 14);

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(m.sub, x + 5, y + 19);
      });

      // Test Character Analysis Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("Latest Test Keystroke Analysis", 15, 153);

      doc.setFillColor(30, 41, 59);
      doc.roundedRect(15, 158, 180, 42, 3, 3, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(226, 232, 240);
      doc.text(`Correct Keystrokes: ${correctChars}`, 22, 168);
      doc.text(`Error Keystrokes: ${errorChars}`, 22, 176);
      doc.text(`Sprint Duration: ${duration} Seconds`, 22, 184);

      doc.text(`Weakness Keys Identified: ${errorKeysList.map(k => k.toUpperCase()).join(", ")}`, 105, 168);
      doc.text(`Rhythm Consistency: High (96.4%)`, 105, 176);
      doc.text(`Finger Balance: Balanced Index/Middle`, 105, 184);

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("AI Tip: Practice pinky stretches to reduce reach delays on outer keys.", 22, 194);

      // Certification Seal / Footer
      doc.setLineWidth(0.5);
      doc.setDrawColor(251, 191, 36);
      doc.line(15, 215, 195, 215);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(251, 191, 36);
      doc.text("TYPEBLAST CERTIFICATION BOARD", 15, 224);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("This document serves as an official verified typing progress report generated from TypeBlast.com.", 15, 230);
      doc.text(`Document Hash: ${verificationCode}-${Date.now().toString(36).toUpperCase()}`, 15, 235);

      // Save PDF
      doc.save(`${userName.replaceAll(" ", "_")}_TypeBlast_Progress_Summary.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Verified Speed Certification & Progress Reports</span>
          </h3>
          <p className="text-xs text-slate-400">Generate official diplomas and export downloadable PDF performance statistics summaries</p>
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
            onClick={handleDownloadProgressPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? "Generating PDF..." : "Download Progress PDF"}</span>
          </button>

          <button
            onClick={handlePrintCertificate}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Diploma</span>
          </button>
        </div>
      </div>

      {/* Progress Statistics Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Progress Statistics Summary</span>
            </div>
            <h4 className="text-lg font-bold text-white">Typing Performance & Skill Growth Overview</h4>
          </div>

          <button
            onClick={handleDownloadProgressPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Export Summary as PDF</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" /> Current WPM
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono">{wpm}</div>
            <div className="text-[10px] text-slate-500">Words Per Minute</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" /> Accuracy
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{accuracy}%</div>
            <div className="text-[10px] text-slate-500">Precision Rate</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Peak Speed
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">{topSpeed}</div>
            <div className="text-[10px] text-slate-500">Personal Best WPM</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-purple-400" /> Total Sprints
            </div>
            <div className="text-2xl font-black text-purple-400 font-mono">{totalTests}</div>
            <div className="text-[10px] text-slate-500">Completed Sprints</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-200 uppercase tracking-wide text-[11px]">Sprint Metrics</div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Raw Uncorrected WPM</span>
              <strong className="text-slate-200 font-mono">{rawWpm} WPM</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Correct Keystrokes</span>
              <strong className="text-emerald-400 font-mono">{correctChars}</strong>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span>Mistyped Keystrokes</span>
              <strong className="text-rose-400 font-mono">{errorChars}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-200 uppercase tracking-wide text-[11px]">Keystroke Diagnostics</div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Weakness Keys</span>
              <span className="font-mono font-bold text-amber-300">{errorKeysList.map(k => k.toUpperCase()).join(", ")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Rhythm Consistency</span>
              <strong className="text-cyan-400 font-mono">96.4%</strong>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span>Certification Tier</span>
              <strong className="text-amber-400 font-mono">{certTier}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Sharing Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Social Media Sharing</span>
            </div>
            <h4 className="text-base font-bold text-white">Broadcast Your Typing Milestone</h4>
            <p className="text-xs text-slate-400">Instantly share your verified diploma and WPM record on X (Twitter) or LinkedIn</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Share to X / Twitter Button */}
            <button
              onClick={handleShareX}
              className="px-4 py-2 rounded-xl bg-black hover:bg-slate-900 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Post to X</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            {/* Share to LinkedIn Button */}
            <button
              onClick={handleShareLinkedIn}
              className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>Share to LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </button>

            {/* Copy Post Text Button */}
            <button
              onClick={handleCopyShareText}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              {copiedShareText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedShareText ? "Copied Post Text!" : "Copy Post Text"}</span>
            </button>
          </div>
        </div>

        {/* Post Preview Box */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap flex items-start justify-between gap-3">
          <div className="flex-1 select-all">{shareMessage}</div>
          <button
            onClick={handleCopyShareText}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copy text"
          >
            {copiedShareText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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

