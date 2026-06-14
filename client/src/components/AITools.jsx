import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Image,
  Sparkles,
  SquarePen,
} from "lucide-react";
import { featureCategories } from "../data/toolCatalog.js";

const icons = {
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Image,
  Sparkles,
  SquarePen,
};

const AITools = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-4 py-28 sm:px-8 lg:px-20 xl:px-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(239,246,255,0.86)_45%,rgba(236,254,255,0.72)_100%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="section-kicker">AI toolkit</span>
          <h2 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Powerful{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              AI categories
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-slate-600 sm:text-2xl">
            Explore InfinityAI by workflow, from content creation and image
            generation to career growth, productivity, development, and
            advanced AI assistants.
          </p>
        </div>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {featureCategories.map((category) => {
            const Icon = icons[category.icon] || Sparkles;

            return (
              <button
                key={category.key}
                type="button"
                className="premium-card group flex min-h-80 cursor-pointer flex-col overflow-hidden p-8 text-left sm:p-9"
                onClick={() =>
                  navigate(`/ai?category=${encodeURIComponent(category.filter)}`)
                }
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${category.gradient} text-white shadow-xl shadow-indigo-100 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-10 w-10" />
                </div>

                <div className="mt-9 flex-1">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                    {category.filter}
                  </p>
                  <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    {category.title}
                  </h3>
                  <p className="mt-5 text-lg leading-8 text-slate-600">
                    {category.description}
                  </p>
                </div>

                <div className="mt-9 flex items-center justify-between border-t border-slate-200/70 pt-6">
                  <span className="rounded-full bg-slate-50 px-5 py-2.5 text-base font-bold text-slate-700 ring-1 ring-slate-200">
                    {category.tools.length} tools
                  </span>
                  <span className="inline-flex items-center gap-2 text-base font-black text-indigo-700">
                    Explore
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AITools;
