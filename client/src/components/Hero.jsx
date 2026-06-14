import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { ArrowRight, Play, Sparkles, Wand2 } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen w-full max-w-full items-center overflow-hidden px-4 pb-24 pt-32 sm:px-8 lg:px-20 xl:px-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(125deg,#ffffff_0%,#eff6ff_34%,#ecfeff_68%,#faf5ff_100%)]" />

      <div className="content-wrap grid min-w-0 items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="animate-fade-up text-center lg:text-left">
          <div className="section-kicker">
            <Sparkles className="mr-2 h-4 w-4" />
            Premium AI workspace
          </div>
          <h1 className="mx-auto max-w-[24rem] text-5xl font-black leading-[0.98] tracking-tight text-slate-950 sm:max-w-5xl sm:text-6xl md:text-7xl 2xl:text-8xl lg:mx-0">
          InfinityAI for{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
            every workflow
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-[24rem] text-lg leading-9 text-slate-600 sm:max-w-3xl sm:text-2xl lg:mx-0">
          The Ultimate All-in-One AI Platform for Content Creation, Image
          Generation, Career Growth, Productivity, and Development.
        </p>

      <div className="mt-10 flex flex-col justify-center gap-4 text-base min-[430px]:flex-row lg:justify-start">
        <button
          onClick={() => navigate("/ai")}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-200 hover:-translate-y-1 active:translate-y-0 min-[430px]:w-auto"
        >
          Start creating now <ArrowRight className="h-5 w-5" />
        </button>
        <button className="secondary-button w-full min-[430px]:w-auto">
          <Play className="h-5 w-5 fill-indigo-600 text-indigo-600" />
          Watch demo
        </button>
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 text-center text-base font-semibold text-slate-600 min-[430px]:flex-row min-[430px]:text-left lg:justify-start">
        <img src={assets.user_group} alt="Trusted users" className="h-11" />
        <span className="max-w-[22rem]">Trusted by 10k+ creators and teams building faster with AI</span>
      </div>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-xl animate-fade-up lg:max-w-none">
          <div className="glass-card animate-float-soft overflow-hidden p-5 sm:p-7">
            <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-blue-50/90 to-cyan-50/80 p-6 sm:p-8">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-base font-bold text-slate-500">
                    AI command center
                  </p>
                  <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Generate campaign assets
                  </h2>
                </div>
                <div className="icon-badge h-14 w-14 bg-gradient-to-br from-indigo-600 to-cyan-500">
                  <Wand2 className="h-6 w-6" />
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  "Long-form blog draft",
                  "SEO-ready title set",
                  "Launch image concept",
                  "Resume polish report",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <span className="min-w-0 truncate text-base font-bold text-slate-700">
                      {item}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
                      Ready
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["50+", "AI tools"],
                  ["6", "Workflows"],
                  ["24/7", "Creation"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/80 bg-white/80 p-4 text-center shadow-sm"
                  >
                    <p className="text-2xl font-black text-slate-950">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
