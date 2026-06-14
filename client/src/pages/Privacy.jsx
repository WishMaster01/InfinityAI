import React from "react";
import { Database, FileText, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const sections = [
  {
    title: "Information we collect",
    description:
      "InfinityAI may use account details from authentication, usage activity, tool prompts, generated outputs, billing status, and technical data needed to operate the platform.",
    Icon: Database,
  },
  {
    title: "How we use information",
    description:
      "We use information to provide AI tools, save user creations, manage credits and subscriptions, improve reliability, prevent abuse, and support user requests.",
    Icon: FileText,
  },
  {
    title: "Security and access",
    description:
      "The platform uses authenticated routes, server-side validation, plan access checks, and database-backed records to protect user workflows and billing state.",
    Icon: LockKeyhole,
  },
  {
    title: "Your choices",
    description:
      "You can manage your account through the profile menu, control what you publish publicly, and contact support for privacy or data questions.",
    Icon: ShieldCheck,
  },
];

const Privacy = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_40%,#ecfeff_72%,#faf5ff_100%)]">
      <Navbar />

      <section className="px-4 pb-20 pt-36 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap">
          <div className="glass-card p-7 text-center sm:p-10 lg:p-12">
            <span className="section-kicker">
              <Sparkles className="mr-2 h-4 w-4" />
              Privacy Policy
            </span>
            <h1 className="section-title">
              Privacy built for a modern{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                AI SaaS platform
              </span>
            </h1>
            <p className="section-copy">
              This page explains how InfinityAI handles account, usage, content,
              and billing-related information. Last updated: June 13, 2026.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {sections.map((item) => {
              const CardIcon = item.Icon;

              return (
                <article key={item.title} className="premium-card p-8">
                  <div className="icon-badge h-14 w-14 bg-gradient-to-br from-indigo-600 to-cyan-500">
                    <CardIcon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-7 text-3xl font-black text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-9">
            <h2 className="text-3xl font-black text-slate-950">
              Important note
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              This privacy page is a product-ready starting point and should be
              reviewed by a qualified legal professional before launch,
              especially if InfinityAI is used commercially, processes payments,
              or serves users across multiple regions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Privacy;
