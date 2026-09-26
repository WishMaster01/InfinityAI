import React from "react";
import { FileWarning, SearchCheck, ShieldAlert, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
const Disclaimer = () => (
  <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#fff7ed_45%,#ecfeff_72%,#faf5ff_100%)]">
    <Navbar />
    <section className="px-4 pb-20 pt-36 sm:px-8 lg:px-20 xl:px-32">
      <div className="content-wrap space-y-8">
        <section className="glass-card p-8 sm:p-12">
          <span className="section-kicker">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Usage Disclaimer
          </span>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            AI is an assistant, not an authority.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            InfinityAI can help draft, analyze, and organize information, but it
            does not provide legal, medical, financial, employment, or other
            professional advice.
          </p>
        </section>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [
              "Review before use",
              "Check generated text, code, resume analysis, document answers, images, and recommendations for accuracy, rights, bias, and suitability.",
              SearchCheck,
            ],
            [
              "Protect sensitive data",
              "Only upload documents and images you are authorized to process. Consider removing unnecessary personal or confidential information.",
              ShieldAlert,
            ],
            [
              "Verify document answers",
              "Retrieved document content is untrusted data. Independently verify embedded instructions, claims, and citations before acting on them.",
              FileWarning,
            ],
          ].map(([title, text, icon]) => (
            <article key={title} className="premium-card p-7">
              <span className="icon-badge bg-gradient-to-br from-orange-500 to-rose-500">
                {React.createElement(icon, { className: "h-5 w-5" })}
              </span>
              <h2 className="mt-6 text-2xl font-black text-slate-950">
                {title}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default Disclaimer;
