/* eslint-disable no-unused-vars */
import React from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Image,
  Layers3,
  LockKeyhole,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { featureCategories } from "../data/toolCatalog.js";

const highlights = [
  ["Smart AI Tools", "50+ AI tools for every need and workflow.", WandSparkles],
  ["Document Intelligence", "Chat with your PDFs, docs, and more.", FileText],
  ["Your Creative Hub", "Generate images, videos, voice, and more.", Image],
  ["Track Your Progress", "Access creations, history, and analytics.", Layers3],
  ["Community Driven", "Discover and share with a global community.", Sparkles],
  ["Secure & Reliable", "Your data is always safe with us.", LockKeyhole],
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <Navbar />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f5f3ff_48%,#ecfeff_78%,#fff7ed_100%)] px-4 pb-24 pt-32 sm:px-8 lg:px-20 xl:px-32">
        <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="content-wrap relative grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div className="animate-fade-up">
            <span className="section-kicker">
              <Sparkles className="mr-2 h-4 w-4" />
              Your personal AI workspace
            </span>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Turn your ideas into{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                reality with InfinityAI
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Create, write, design, code, and do more with the power of AI.
              Your all-in-one workspace for productivity, creativity, and
              growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="gradient-button w-fit"
                onClick={() => navigate("/ai")}
              >
                Start Creating Free <ArrowRight className="h-4 w-4" />
              </button>
              <Link to="/features" className="secondary-button w-fit">
                Explore AI Tools
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-5 text-sm font-bold text-slate-500">
              {[
                "No credit card required",
                "Free plan available",
                "Secure & private",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 rounded-full bg-violet-100 p-0.5 text-violet-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative animate-float-soft rounded-[2rem] border border-indigo-200/80 bg-white/80 p-3 shadow-[0_30px_100px_rgba(79,70,229,.2)] backdrop-blur-xl sm:p-5">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <span className="text-sm font-black text-indigo-700">
                  ∞ InfinityAI
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="grid min-h-[340px] grid-cols-[110px_1fr]">
                <aside className="hidden border-r border-slate-200 bg-white p-3 sm:block">
                  <p className="rounded-xl bg-indigo-100 px-2 py-2 text-[10px] font-black text-indigo-700">
                    Dashboard
                  </p>
                  {[
                    "AI Workspace",
                    "Documents",
                    "History",
                    "Community",
                    "Credits",
                  ].map((item) => (
                    <p
                      key={item}
                      className="px-2 py-3 text-[10px] font-bold text-slate-400"
                    >
                      {item}
                    </p>
                  ))}
                </aside>
                <div className="p-5 sm:p-7">
                  <p className="text-xs font-bold text-slate-400">
                    Good morning, Creator 👋
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    What are you creating today?
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {["Content AI", "Image AI", "Resume AI"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-xl text-white ${index === 0 ? "bg-indigo-500" : index === 1 ? "bg-pink-500" : "bg-cyan-500"}`}
                          >
                            <Sparkles className="h-4 w-4" />
                          </span>
                          <p className="mt-5 text-sm font-black text-slate-900">
                            {item}
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate("/ai")}
                            className="mt-4 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white"
                          >
                            Generate →
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-24 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <span className="section-kicker">Powerful features</span>
            <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Everything you need in one place
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              InfinityAI brings the best AI models and tools into a single,
              easy-to-use platform. No more switching between different apps.
            </p>
            <Link to="/features" className="gradient-button mt-7 w-fit">
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map(([title, text, Icon]) => (
              <article key={title} className="premium-card p-5">
                <span className="icon-badge h-11 w-11 bg-gradient-to-br from-indigo-600 to-cyan-500">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 px-4 py-24 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="section-kicker">Explore categories</span>
              <h2 className="text-4xl font-black text-slate-950">
                Find the perfect AI tool for your needs
              </h2>
              <p className="mt-3 text-slate-600">
                From content creation to career growth, find the workflow that
                fits.
              </p>
            </div>
            <Link to="/ai" className="secondary-button w-fit">
              View all tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {featureCategories.slice(0, 5).map((category) => (
              <button
                type="button"
                key={category.key}
                onClick={() => navigate(`/ai/${category.key.toLowerCase()}`)}
                className="rounded-3xl bg-gradient-to-br from-white to-indigo-50 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} text-white`}
                >
                  <Sparkles className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-black text-slate-950">
                  {category.filter}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {category.description}
                </p>
                <p className="mt-5 text-xs font-black text-indigo-700">
                  Explore →
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-20 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap grid items-center gap-10 rounded-[2rem] bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <span className="section-kicker">Why InfinityAI?</span>
            <h2 className="text-4xl font-black text-slate-950 sm:text-5xl">
              More than just AI tools. It&apos;s your complete workspace.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Create, organize, and collaborate with AI. Everything you need to
              turn your ideas into reality in one place.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {[
                ["50+", "AI tools"],
                ["10K+", "Happy users"],
                ["99.9%", "Uptime"],
                ["24/7", "Support"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-indigo-600">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-cyan-500 p-8 text-white shadow-2xl">
            <Sparkles className="h-10 w-10" />
            <h3 className="mt-10 text-3xl font-black">
              Create amazing content with AI
            </h3>
            <p className="mt-3 text-white/80">
              Choose a workflow, add your idea, and let InfinityAI help you make
              it real.
            </p>
            <Link
              to="/ai"
              className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 font-black text-indigo-700"
            >
              Start creating <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-950 p-8 text-white sm:flex-row sm:p-12">
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
              Ready to get started?
            </span>
            <h2 className="mt-5 text-3xl font-black">
              Your AI journey begins here.
            </h2>
            <p className="mt-2 text-white/70">
              Join creators and professionals building better with InfinityAI.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/ai")}
            className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-7 py-4 font-black shadow-xl"
          >
            Get started free <ArrowRight className="ml-2 inline h-4 w-4" />
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Home;
