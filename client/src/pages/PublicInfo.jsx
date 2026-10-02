import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";

const pageContent = {
  features: {
    label: "Features",
    title: "54+ Powerful AI Tools at Your Fingertips",
    intro: "Experience an all-in-one AI creation suite built to accelerate writing, design, programming, and career advancement.",
    items: [
      "Natural language blog, copy, and article generation",
      "High-resolution AI image generation and background removal",
      "Comprehensive ATS resume analysis with scoring",
      "Interactive grounded document chat with PDF citation",
      "Automated code explanation, refactoring, and test generation",
    ],
  },
  solutions: {
    label: "Solutions",
    title: "Built for Creators, Builders, and Teams",
    intro: "Whether you are a solo entrepreneur, professional writer, or fast-growing software team, InfinityAI scales with your ambitions.",
    items: [
      "Marketing teams: Produce high-converting campaigns and blog posts in seconds",
      "Job seekers: Pass ATS filters and prepare with customized interview roadmaps",
      "Researchers: Summarize dense research papers and cross-examine evidence",
      "Developers: Debug errors, understand unfamiliar codebases, and draft tests",
    ],
  },
  blog: {
    label: "Blog",
    title: "Insights, Workflows & Product Updates",
    intro: "Practical guides and thought leadership on maximizing AI productivity.",
    items: [
      "How to Prompt Like a Pro: 10 Frameworks for Flawless Output",
      "Understanding ATS Algorithms: How We Calculate Your Resume Score",
      "The Future of Multi-Modal AI in Everyday Workflows",
      "Security & Privacy: How InfinityAI Protects Your Confidential Data",
    ],
  },
};

const PublicInfo = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const info = pageContent[section] || pageContent.features;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      <Navbar />
      <div className="content-wrap px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 mb-8 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>

        <ScrollReveal animation="fade-up">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-xs">
            <span className="section-kicker">
              <Sparkles className="h-3.5 w-3.5" /> {info.label}
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {info.title}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {info.intro}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {info.items.map((item, idx) => (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {item}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/sign-up")}
                className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="rounded-full border border-slate-200 px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Pricing
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
      <Footer />
    </div>
  );
};

export const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="content-wrap px-4 pt-28 pb-20 sm:px-6 lg:px-8 text-center">
        <ScrollReveal animation="fade-up">
          {/* Header matching image: Simple, Transparent Pricing */}
          <span className="section-kicker">
            <Sparkles className="h-3.5 w-3.5" /> Pricing Plans
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Choose the plan that fits your needs. Upgrade or cancel anytime.
          </p>

          {/* Toggle: Monthly | Yearly */}
          <div className="mt-8 inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yearly <span className="text-emerald-400 font-extrabold ml-1">(Save 20%)</span>
            </button>
          </div>
        </ScrollReveal>

        {/* 3 Pricing Cards matching the image */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3 text-left">
          {/* Free Plan */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="h-full relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Free
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-sm font-semibold text-slate-500">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>10 credits per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Access to 10+ basic tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Community access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Basic support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/sign-up")}
                className="mt-8 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                Get Started
              </button>
            </div>
          </ScrollReveal>

          {/* Pro Plan - Featured / Most Popular */}
          <ScrollReveal animation="scale-up" delay={150}>
            <div className="h-full relative rounded-2xl border-2 border-indigo-600 bg-white p-7 shadow-lg shadow-indigo-100 scale-105 z-10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-black text-white shadow-xs">
                ⭐ Most Popular
              </span>
              <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                Pro
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {billingCycle === "monthly" ? "$12" : "$10"}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
                <li className="flex items-center gap-2 font-medium text-slate-900">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>1,000 credits per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Access to all 54+ tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Advanced features & export</span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/sign-up")}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>
          </ScrollReveal>

          {/* Enterprise Plan */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="h-full relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Enterprise
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {billingCycle === "monthly" ? "$29" : "$24"}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>3,000 credits per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>All Pro features included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Dedicated 24/7 support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/contact")}
                className="mt-8 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Reassurance Trust Badges matching image */}
        <ScrollReveal animation="fade" delay={250}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-indigo-600" /> No hidden fees
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-indigo-600" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-600" /> Secure payments
            </span>
          </div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
};

export default PublicInfo;
