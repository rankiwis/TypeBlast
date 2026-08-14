import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  title?: string;
  badgeText?: string;
  description?: string;
  faqs: FaqItem[];
  defaultOpenIndex?: number | null;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  title = "Frequently Asked Questions",
  badgeText = "Frequently Asked Questions",
  description = "Get instant answers to key questions about typing speed, accuracy standards, practice strategies, and calculation methods.",
  faqs,
  defaultOpenIndex = null,
}) => {
  // All FAQ answers hidden by default when page first loads
  const [openIndices, setOpenIndices] = useState<number[]>(() =>
    defaultOpenIndex !== null && defaultOpenIndex !== undefined && defaultOpenIndex >= 0
      ? [defaultOpenIndex]
      : []
  );

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="space-y-6 pt-10 border-t border-slate-800/80" id="homepage-faq-section">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>{badgeText}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">{description}</p>
      </div>

      {/* 2-Column Responsive Layout: Mobile: 1 column, Tablet/Desktop: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {faqs.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          const faqId = `faq-answer-${index}`;
          return (
            <div
              key={index}
              className={`h-fit rounded-2xl bg-slate-900 border transition-all duration-200 shadow-md ${
                isOpen ? "border-cyan-500/40 bg-slate-900/95" : "border-slate-800 hover:border-slate-700/80"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                aria-expanded={isOpen}
                aria-controls={faqId}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3.5 font-bold text-slate-100 hover:text-cyan-300 transition-colors text-sm sm:text-base cursor-pointer"
              >
                <span className="leading-snug">{faq.q}</span>
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isOpen
                      ? "bg-cyan-500/20 text-cyan-300 rotate-180"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div
                  id={faqId}
                  className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in duration-200"
                >
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

