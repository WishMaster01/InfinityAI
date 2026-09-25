import React, { useState } from "react";
import { ChevronDown, CircleHelp, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  [
    "How do credits work?",
    "Each AI workflow consumes the credit amount shown on its card and workspace.",
  ],
  [
    "Where can I find my creations?",
    "Open History to search, inspect, duplicate, export, or delete saved creations.",
  ],
  [
    "How do I upgrade?",
    "Open Billing or Credits and choose a plan. Paid checkout is handled securely through Stripe.",
  ],
  [
    "Can I ask questions about a PDF?",
    "Open Documents, choose Document Chat, upload a PDF, and ask a grounded question.",
  ],
];
const Help = () => {
  const [open, setOpen] = useState(0);
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section className="glass-card p-8 sm:p-10">
          <span className="section-kicker">
            <CircleHelp className="mr-2 h-4 w-4" />
            Help center
          </span>
          <h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Quick answers for tools, documents, history, credits, and billing.
          </p>
        </section>
        <div className="space-y-3">
          {faqs.map(([question, answer], index) => (
            <div key={question} className="premium-card overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between p-6 text-left font-black text-slate-950"
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                {question}
                <ChevronDown
                  className={`h-5 w-5 transition ${open === index ? "rotate-180 text-indigo-600" : "text-slate-400"}`}
                />
              </button>
              {open === index && (
                <p className="px-6 pb-6 text-sm leading-7 text-slate-600">
                  {answer}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-7 text-white">
          <h2 className="text-2xl font-black">Still need help?</h2>
          <p className="mt-2 text-white/80">
            Our support team can help with account, billing, and product
            questions.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-black text-indigo-700"
          >
            <Mail className="h-4 w-4" />
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
