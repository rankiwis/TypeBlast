import React, { useState } from "react";
import { FileText, Calculator, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export const BlogView: React.FC = () => {
  const [userWpmInput, setUserWpmInput] = useState(70);

  const benchmarks = [
    { profession: "General Computer User", avgWpm: 40 },
    { profession: "Professional Administrative Staff", avgWpm: 60 },
    { profession: "Software Engineer / Developer", avgWpm: 70 },
    { profession: "Professional Journalist / Editor", avgWpm: 80 },
    { profession: "Executive Legal Stenographer", avgWpm: 120 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>TypeBlast Guides & Career WPM Calculator</span>
        </h3>
        <p className="text-xs text-slate-400">Learn touch typing ergonomics, mechanical keyboard switch guides, and career speed standards</p>
      </div>

      {/* Interactive WPM Benchmark Calculator */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <span>Interactive Career Benchmark Calculator</span>
        </h4>

        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-300 font-semibold">Your Current WPM:</span>
          <input
            type="number"
            value={userWpmInput}
            onChange={(e) => setUserWpmInput(Number(e.target.value))}
            className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-cyan-400 font-mono font-bold text-center"
          />
        </div>

        <div className="space-y-2">
          {benchmarks.map((b, idx) => {
            const isExceeded = userWpmInput >= b.avgWpm;
            return (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">{b.profession}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 font-bold">{b.avgWpm} WPM</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isExceeded ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                    {isExceeded ? "Surpassed ✓" : "Goal Target"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blog Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-cyan-400">Ergonomics</span>
          <h4 className="text-base font-bold text-white">How to Reach 100+ WPM Without Wrist Strain</h4>
          <p className="text-xs text-slate-400">Discover proper hand anchoring, neutral floating posture, and rhythm pacing techniques.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-purple-400">Hardware</span>
          <h4 className="text-base font-bold text-white">Mechanical Switches: Linear vs Tactile vs Clicky</h4>
          <p className="text-xs text-slate-400">Understand actuation force, key travel distances, and how switch choice affects your typing speed.</p>
        </div>
      </div>
    </div>
  );
};
