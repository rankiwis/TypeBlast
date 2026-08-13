import React, { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { SeoHead } from "../SeoHead";
import { InternalLinksNav } from "../InternalLinksNav";

interface ContactPageProps {
  onNavigatePath: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigatePath }) => {
  const canonicalUrl = "https://typeblast.com/contact/";
  const pageTitle = "Contact Us & Support | TypeBlast";
  const metaDescription =
    "Get in touch with the TypeBlast team. Contact us for feedback, feature requests, school licenses, or bug reports.";

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "Feedback", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
      />

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <Mail className="w-3.5 h-3.5 text-cyan-400" />
          <span>Get In Touch</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Contact TypeBlast Support & Team
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Have feedback, found a bug, or interested in school classroom integrations? Send us a message and our team will respond within 24 hours.
        </p>
      </header>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 max-w-2xl">
        {submitted ? (
          <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Thank You for Reaching Out!</h3>
            <p className="text-xs text-slate-300">Your message has been received. Our support team will get back to you shortly.</p>
            <button
              onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "Feedback", message: "" }); }}
              className="text-xs text-cyan-400 font-bold underline"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="Feedback">General Feedback</option>
                <option value="Bug">Report a Bug</option>
                <option value="Schools">Schools & Teachers License</option>
                <option value="Feature">Feature Request</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Message</label>
              <textarea
                required
                rows={4}
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </div>

      <InternalLinksNav currentPath="/contact/" onNavigate={onNavigatePath} />
    </div>
  );
};
