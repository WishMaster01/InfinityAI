import React from "react";
import { ArrowRight, BrainCircuit, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const values = [
  {
    title: "All-in-one workflows",
    description:
      "InfinityAI brings content, images, career growth, productivity, and developer tools into one focused workspace.",
    Icon: Layers,
  },
  {
    title: "Practical AI output",
    description:
      "Every tool is designed around useful outcomes: drafts, visuals, resumes, summaries, and code support that can move work forward.",
    Icon: BrainCircuit,
  },
  {
    title: "Readable, secure SaaS",
    description:
      "A clean interface, authenticated workflows, credit tracking, and plan access keep the product simple for users and maintainable for teams.",
    Icon: ShieldCheck,
  },
];

const stats = [
  ["50+", "AI tools"],
  ["6", "Workflow categories"],
  ["24/7", "Creation support"],
];

const About = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_42%,#ecfeff_72%,#faf5ff_100%)]">
      <Navbar />

      <section className="px-4 pb-20 pt-36 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap">
          <div className="glass-card overflow-hidden p-7 sm:p-10 lg:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="section-kicker">
                  <Sparkles className="mr-2 h-4 w-4" />
                  About InfinityAI
                </span>
                <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  One bright AI workspace for{" "}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                    everyday creation
                  </span>
                </h1>
                <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
                  InfinityAI is The Ultimate All-in-One AI Platform for Content
                  Creation, Image Generation, Career Growth, Productivity, and
                  Development. It is built to help creators, students,
                  professionals, and teams produce useful work faster.
                </p>
                <button
                  onClick={() => navigate("/ai")}
                  className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-200 hover:-translate-y-0.5"
                >
                  Explore tools <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-[0_24px_70px_rgba(59,130,246,0.14)]">
                <div className="grid gap-4">
                  {stats.map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm"
                    >
                      <p className="text-5xl font-black text-slate-950">
                        {value}
                      </p>
                      <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {values.map((item) => {
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
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
