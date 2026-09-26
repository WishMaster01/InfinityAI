import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { planCards } from "../data/toolCatalog.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const content = {
  features: {
    label: "The InfinityAI toolkit",
    title: "Create with more clarity, speed, and creative range.",
    intro:
      "A polished AI workspace that turns blank pages, complex documents, and ambitious ideas into useful next steps.",
    items: [
      "54+ practical AI workflows",
      "Document chat with grounded sources",
      "History, credits, and reusable creations",
      "Secure plans with transparent usage",
    ],
  },
  solutions: {
    label: "Built around outcomes",
    title: "One intelligent workspace for every kind of work.",
    intro:
      "Move from first thought to finished deliverable with focused workflows for creators, professionals, students, and teams.",
    items: [
      "Create content and campaigns",
      "Analyze resumes and career goals",
      "Understand documents and research",
      "Build, explain, and review code",
    ],
  },
  blog: {
    label: "The InfinityAI journal",
    title: "Ideas for building better with AI.",
    intro:
      "Practical guidance, workflow ideas, and product notes for people making meaningful work with AI.",
    items: [
      "Prompting patterns that save time",
      "Responsible AI for everyday work",
      "Turning documents into decisions",
      "Better creative workflows",
    ],
  },
};

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="secondary-button mb-7 w-fit px-4 py-2.5 text-sm"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </button>
  );
};
const PublicInfo = () => {
  const { section } = useParams();
  const page = content[section] || content.features;
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f5f3ff_45%,#ecfeff_75%,#fff7ed_100%)]">
      <Navbar />
      <section className="px-4 pb-20 pt-32 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap">
          <BackButton />
          <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-[0_30px_100px_rgba(79,70,229,.15)] backdrop-blur-xl sm:p-12">
            <div className="absolute -right-16 -top-20 h-64 w-64 animate-pulse rounded-full bg-indigo-300/30 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
              <div>
                <span className="section-kicker">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {page.label}
                </span>
                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
                  {page.title}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  {page.intro}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/ai" className="gradient-button w-fit">
                    Open AI Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/pricing" className="secondary-button w-fit">
                    See pricing
                  </Link>
                </div>
              </div>
              <div className="relative rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-6 text-white shadow-2xl shadow-indigo-200">
                <WandSparkles className="h-10 w-10" />
                <p className="mt-12 text-2xl font-black">
                  Make room for your best work.
                </p>
                <p className="mt-3 leading-7 text-white/80">
                  Discover guided tools that feel calm, capable, and ready when
                  you are.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {["Create", "Analyze", "Refine", "Ship"].map((item) => (
                    <span
                      key={item}
                      className="rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-center text-sm font-bold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {page.items.map((item, index) => (
              <article
                key={item}
                className="premium-card animate-[fade-in-up_.5s_ease-out_both] p-7"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="icon-badge bg-gradient-to-br from-indigo-600 to-cyan-500">
                  <Check className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-black text-slate-950">
                  {item}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Designed to help you move from intention to a useful result.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export const Pricing = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eef2ff_50%,#ecfeff_100%)]">
      <Navbar />
      <section className="px-4 pb-20 pt-32 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="secondary-button mb-7 w-fit px-4 py-2.5 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <section className="glass-card relative overflow-hidden p-8 text-center sm:p-12">
            <Compass className="mx-auto h-10 w-10 animate-bounce text-indigo-600" />
            <span className="section-kicker mt-5">
              Simple, transparent pricing
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Choose the plan that keeps you moving.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Start free, then scale your AI workspace as your ideas and
              workflows grow.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/ai" className="gradient-button w-fit">
                Go to AI Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {planCards.map((plan, index) => (
              <article
                key={plan.plan}
                className={`premium-card relative flex min-h-[32rem] animate-[fade-in-up_.5s_ease-out_both] flex-col p-8 ${plan.highlighted ? "-translate-y-2 ring-2 ring-indigo-400" : ""}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.highlighted && (
                  <span className="absolute right-6 top-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-black text-white">
                    Most popular
                  </span>
                )}
                <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">
                  {plan.plan}
                </p>
                <h2 className="mt-4 text-3xl font-black text-slate-950">
                  {plan.name}
                </h2>
                <p className="mt-3 text-4xl font-black text-indigo-700">
                  {plan.price}
                </p>
                <p className="mt-3 text-slate-600">{plan.description}</p>
                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-sm leading-6 text-slate-600"
                    >
                      <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/sign-up" className="gradient-button mt-8">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default PublicInfo;
