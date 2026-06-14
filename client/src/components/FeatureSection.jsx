import React from "react";
import {
  Bot,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Image,
  Sparkles,
  SquarePen,
} from "lucide-react";
import ToolCard from "./ToolCard.jsx";
import OutputLoader from "./OutputLoader.jsx";

const icons = {
  Bot,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Image,
  Sparkles,
  SquarePen,
};

const FeatureSection = ({
  category,
  tools,
  currentPlan,
  planRank,
  onUse,
  loading = false,
}) => {
  const Icon = icons[category.icon] || Sparkles;

  if (!loading && !tools.length) return null;

  return (
    <section className="space-y-6">
      <div
        className={`rounded-3xl bg-gradient-to-r ${category.gradient} p-6 text-white shadow-xl shadow-indigo-100 sm:p-8`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{category.title}</h2>
              <p className="mt-2 max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                {category.description}
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-white/20 px-5 py-2.5 text-sm font-black uppercase tracking-[0.16em] backdrop-blur">
            {(tools.length || category.tools.length)} tools
          </span>
        </div>
      </div>

      {loading ? (
        <div className="tool-panel">
          <OutputLoader
            label={`Loading ${category.filter}`}
            helper="Preparing tools, plan access, credits, and recent workspace data."
          />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              locked={planRank[currentPlan] < planRank[tool.minPlan]}
              onUse={onUse}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeatureSection;
