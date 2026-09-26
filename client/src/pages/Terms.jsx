import React from "react";
import {
  BadgeCheck,
  CreditCard,
  FileCheck2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
const sections = [
  [
    "Accounts and content",
    "Keep account credentials secure and only upload material you have permission to process. Public creations may be visible to other users.",
    ShieldCheck,
  ],
  [
    "Billing and cancellation",
    "Paid subscriptions renew according to the checkout terms shown at purchase. Cancellation stops future renewal while active-period access remains available.",
    CreditCard,
  ],
  [
    "AI output",
    "Outputs may be inaccurate or incomplete. Review generated text, images, documents, and recommendations before publication or consequential use.",
    FileCheck2,
  ],
];
const Terms = () => (
  <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_45%,#ecfeff_72%,#faf5ff_100%)]">
    <Navbar />
    <section className="px-4 pb-20 pt-36 sm:px-8 lg:px-20 xl:px-32">
      <div className="content-wrap space-y-8">
        <section className="glass-card p-8 sm:p-12">
          <span className="section-kicker">
            <Sparkles className="mr-2 h-4 w-4" />
            Terms of Service
          </span>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Use powerful AI with clarity and responsibility.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            InfinityAI provides AI-assisted creation tools. You are responsible
            for reviewing outputs, protecting your account, and ensuring your
            use complies with applicable law.
          </p>
        </section>
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map(([title, text, icon]) => (
            <article key={title} className="premium-card p-7">
              <span className="icon-badge bg-gradient-to-br from-indigo-600 to-cyan-500">
                {React.createElement(icon, { className: "h-5 w-5" })}
              </span>
              <h2 className="mt-6 text-2xl font-black text-slate-950">
                {title}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7">
          <div className="flex gap-4">
            <BadgeCheck className="h-6 w-6 shrink-0 text-amber-600" />
            <p className="text-sm leading-7 text-amber-900">
              By using InfinityAI, you acknowledge that AI assistance does not
              replace professional judgment and that you are responsible for
              your account and content.
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default Terms;
