import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  title?: string;
  description?: string;
  faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  title = "Frequently Asked Questions",
  description = "Get instant answers to key questions about typing speed, accuracy standards, practice strategies, and calculation methods.",
  faqs,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="space-y-6 pt-10 border-t border-slate-800/80">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>SEO Knowledge Base & FAQs</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{description}</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-100 hover:text-cyan-300 transition-colors text-sm sm:text-base"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
