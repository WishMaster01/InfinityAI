import React, { useState } from "react";
import { ChevronDown, CircleHelp, Mail, Sparkles, MessageCircleQuestion } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How do credits work in InfinityAI?",
    a: "Every AI generation consumes a fixed number of credits shown on each tool card (e.g., 5 for blog titles, 10 for resume review, 15 for image generation). Your credits refresh each billing cycle.",
  },
  {
    q: "Where are my generated creations saved?",
    a: "All completed generations are automatically saved to your 'My History' tab where you can search, preview, copy, or download them at any time.",
  },
  {
    q: "How do I upgrade to the Pro plan?",
    a: "Navigate to the Subscription or Credits page and click 'Upgrade to Pro'. You will gain instant access to all 54+ tools with 1,000 monthly credits.",
  },
  {
    q: "How does Document Chat cite its sources?",
    a: "Document Chat uses vector semantic retrieval to extract exact paragraphs from your uploaded PDF or DOCX file, displaying page and section citations with every answer.",
  },
  {
    q: "Can I share my AI images with the community?",
    a: "Yes! When generating an image, simply toggle 'Share to Community Gallery' to showcase your art to thousands of creators worldwide.",
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Help Center & FAQs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Quick answers for tools, documents, history, credits, and billing.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageCircleQuestion className="h-4 w-4 text-indigo-600" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 text-xs text-slate-600 leading-relaxed bg-slate-50/50 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold">Still need assistance?</h3>
            <p className="mt-1 text-xs text-slate-300">
              Our 24/7 support team is here to assist with billing, API keys, or custom integrations.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-xs hover:bg-slate-100 transition-colors w-fit"
          >
            <Mail className="h-3.5 w-3.5" /> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
