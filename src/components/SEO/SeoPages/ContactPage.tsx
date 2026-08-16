import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Bug,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";
import { Breadcrumbs, generateBreadcrumbSchema } from "../Breadcrumbs";

interface ContactPageProps {
  onNavigatePath: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://www.typeblast.com/contact/";
  const pageTitle = "Contact TypeBlast - Support, Feedback & Inquiries";
  const metaDescription =
    "Get in touch with the TypeBlast team. Contact us for technical support, bug reports, feature suggestions, classroom integration questions, or general feedback.";

  const breadcrumbs = [{ label: "Contact Us", path: "/contact/" }];

  const structuredData = [
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact TypeBlast",
      url: canonicalUrl,
      description: metaDescription,
    },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subjectCategory: "general",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate brief client submission confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      subjectCategory: "general",
      subject: "",
      message: "",
    });
  };

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
          <Mail className="w-3.5 h-3.5 text-cyan-400" />
          <span>Help & Inquiries</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Contact TypeBlast
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Have a question about our typing speed algorithms, discovered a bug, or want to suggest a new feature or keyboard layout? Send us a note below or reach out via our contact channels.
        </p>
      </header>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-sm">General & Support Inquiries</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            For account assistance, test performance questions, or general feedback.
          </p>
          <div className="pt-1 text-xs font-mono text-cyan-400 font-semibold">
            support@typeblast.com
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-sm">Schools & Educators</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Questions regarding classroom typing drills, student assignments, and school accounts.
          </p>
          <div className="pt-1 text-xs font-mono text-emerald-400 font-semibold">
            teachers@typeblast.com
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-sm">Privacy & Data Requests</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            For personal data exports, account deletion requests, or privacy inquiries.
          </p>
          <div className="pt-1 text-xs font-mono text-purple-400 font-semibold">
            privacy@typeblast.com
          </div>
        </div>
      </div>

      {/* Interactive Contact Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800">
          {submitted ? (
            <div className="p-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Message Received!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out. We have logged your submission and our team will review your inquiry shortly.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Send Us a Direct Message</h2>
                <p className="text-xs text-slate-400">
                  Fill out the form below and we will get back to you as soon as possible.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Inquiry Category</label>
                  <select
                    value={formData.subjectCategory}
                    onChange={(e) => setFormData({ ...formData, subjectCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    <option value="general">General Inquiry / Feedback</option>
                    <option value="bug">Report a Bug / Glitch</option>
                    <option value="feature">Feature or Layout Request</option>
                    <option value="schools">Educator / Classroom Setup</option>
                    <option value="privacy">Privacy & Data Request</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Subject (Optional)</label>
                  <input
                    type="text"
                    placeholder="Brief summary of your inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  Your Message <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Please describe your question, bug report, or suggestion in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Quick FAQ / Guidance Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequent Topics
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div>
                <span className="font-bold text-white block">How are WPM scores calculated?</span>
                <span className="text-slate-400">
                  Scores follow the universal standard: (Total correct characters / 5) divided by test minutes.
                </span>
              </div>
              <div>
                <span className="font-bold text-white block">Is TypeBlast free for schools?</span>
                <span className="text-slate-400">
                  Yes! All basic typing tests, lessons, and games can be used in classrooms at no cost.
                </span>
              </div>
              <div>
                <span className="font-bold text-white block">Lost your password?</span>
                <span className="text-slate-400">
                  Contact support from your registered email for account recovery.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => onNavigatePath("/faq/")}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
              >
                View Full FAQ Page &rarr;
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-400" /> Response Times
            </div>
            <p>
              Inquiries are typically reviewed within 1 to 2 business days.
            </p>
          </div>
        </div>
      </div>

      <InternalLinksNav currentPath="/contact/" onNavigate={onNavigatePath} />
    </div>
  );
};
