import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  Sparkles,
  Star,
  FileText,
  Briefcase,
  Users,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Clock,
  Zap,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { allTools, planRank } from "../data/toolCatalog.js";
import { useUser } from "@clerk/clerk-react";

const ToolDetail = () => {
  const { toolSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("Overview");

  const tool = allTools.find((item) => item.slug === toolSlug) || {
    name: "Resume Analyzer",
    slug: "resume-reviewer",
    category: "CAREER",
    categoryTitle: "Career & Jobs",
    description:
      "Get your ATS score, discover strengths & weaknesses, and get personalized improvement tips to land your dream job.",
    credits: 10,
    minPlan: "BASIC",
    path: "/ai/review-resume",
  };

  const currentPlan = user?.publicMetadata?.plan === "premium" ? "PRO" : "BASIC";
  const locked = (planRank[currentPlan] || 0) < (planRank[tool.minPlan] || 0);

  const tabs = ["Overview", "How it works", "Features", "FAQs"];

  const benefits = [
    "ATS compatibility score",
    "Detailed feedback & suggestions",
    "Keyword matching analysis",
    "Personalized recommendations",
    "Improved chance of getting interviews",
  ];

  const targetAudiences = [
    { title: "Job Seekers", desc: "Tailor applications for higher callback rates" },
    { title: "Career Changers", desc: "Highlight transferable skills accurately" },
    { title: "Fresh Graduates", desc: "Format entry-level experience professionally" },
    { title: "Professionals", desc: "Optimize executive and senior resumes" },
  ];

  const handleLaunch = () => {
    if (locked) return navigate("/ai/billing");
    navigate(tool.path || `/ai/tools/${tool.slug}`);
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Breadcrumb matching image: Tools > Career & Jobs > Resume Analyzer */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/ai" className="hover:text-indigo-600 transition-colors">
            Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link
            to={`/ai/${tool.category.toLowerCase()}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {tool.categoryTitle || "Category"}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 font-bold">{tool.name}</span>
        </nav>

        {/* Hero Card matching the uploaded image */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            {/* Left Details */}
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                  <FileText className="h-6 w-6" />
                </span>
                <div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {tool.categoryTitle}
                  </span>
                </div>
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {tool.name}
              </h1>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl">
                {tool.description}
              </p>

              {/* Rating + Credits */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>4.8</span>
                  <span className="font-normal text-slate-400">(12,490 reviews)</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 font-bold text-indigo-600">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{tool.credits || 10} credits</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {locked ? (
                    <>
                      <LockKeyhole className="h-4 w-4" /> Upgrade to Access
                    </>
                  ) : (
                    <>
                      Start Analyzing <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Graphic Preview Mockup matching image */}
            <div className="relative mx-auto flex w-full max-w-sm justify-center">
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                      AJ
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Resume_v2.pdf</p>
                      <p className="text-[10px] text-slate-400">Software Engineer</p>
                    </div>
                  </div>
                  {/* ATS Score Circular Badge */}
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                    <span className="text-sm font-black">92</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600">ATS Score</span>
                  </div>
                </div>

                {/* Mock document lines */}
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-3/4 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-2 w-full rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-2 w-5/6 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-2 w-2/3 rounded-full bg-slate-200 animate-pulse" />
                </div>

                <div className="mt-4 rounded-xl bg-white p-3 border border-slate-200/70">
                  <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Key Insight
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                    Strong action verbs identified. Add 2 cloud certification keywords to reach 98%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation matching image */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 py-3 px-4 text-xs font-bold transition-all ${
                  active
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 2-Column Content: What you'll get & Perfect for */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* What you'll get card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-600" /> What you'll get
            </h2>
            <ul className="mt-4 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Perfect for card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" /> Perfect for
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {targetAudiences.map((target) => (
                <div
                  key={target.title}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                >
                  <p className="text-xs font-bold text-slate-900">{target.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
                    {target.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
