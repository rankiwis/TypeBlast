import React, { useState } from "react";
import { CreditCard, Check, Sparkles, Shield, Zap } from "lucide-react";

export const PricingView: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white">Simple, Transparent Pricing</h2>
        <p className="text-xs text-slate-400">Unlock AI Coaching, Unlimited Arcade Games, and Official School Certifications</p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mt-4">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === "monthly" ? "bg-cyan-500 text-slate-950" : "text-slate-400"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === "annual" ? "bg-cyan-500 text-slate-950" : "text-slate-400"
            }`}
          >
            Annual (Save 20%) 🔥
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Tier */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Free Starter</h3>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-2">$0</div>
            <p className="text-xs text-slate-400">Essential typing speed tests</p>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Standard Typing Tests</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Speed Blast Arcade Game</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Basic Global Leaderboards</li>
          </ul>
        </div>

        {/* Pro Tier */}
        <div className="p-6 rounded-2xl bg-slate-900 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/10 space-y-4 relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase">
            POPULAR
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">TypeBlast Pro</h3>
            <div className="text-3xl font-black text-cyan-300 font-mono mt-2">
              {billingCycle === "annual" ? "$4.99" : "$6.99"} <span className="text-xs text-slate-400 font-normal">/mo</span>
            </div>
            <p className="text-xs text-slate-400">For serious typists & programmers</p>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Gemini AI Typing Coach</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Arcade Games & Nitro Race</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Official Verified Certificates</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Code & Custom Text Modes</li>
          </ul>
        </div>

        {/* Schools Tier */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Schools & Teachers</h3>
            <div className="text-3xl font-black text-purple-400 font-mono mt-2">$29 <span className="text-xs text-slate-400 font-normal">/mo</span></div>
            <p className="text-xs text-slate-400">Full classroom management</p>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 50 Student Accounts</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Teacher Analytics Dashboard</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Gradebook CSV Export</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
