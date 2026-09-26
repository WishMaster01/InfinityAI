import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { allTools, featureCategories, planRank } from "../data/toolCatalog.js";
import ToolCard from "../components/ToolCard.jsx";
import Card from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/State.jsx";

const AIWorkspace = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Tools");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const currentPlan =
    user?.publicMetadata?.plan === "premium" ? "PRO" : "BASIC";
  const visible = useMemo(
    () =>
      allTools.filter((tool) => {
        const text =
          `${tool.name} ${tool.description} ${tool.categoryTitle}`.toLowerCase();
        return (
          (!query || text.includes(query.toLowerCase())) &&
          (category === "All Tools" ||
            category === "Free Tools" ||
            category === "Premium Tools" ||
            tool.categoryTitle === category) &&
          (!premiumOnly || tool.minPlan !== "BASIC")
        );
      }),
    [query, category, premiumOnly],
  );
  const useTool = (tool) => {
    if ((planRank[currentPlan] || 0) < (planRank[tool.minPlan] || 0))
      return navigate("/ai/billing");
    navigate(tool.path || `/ai/tools/${tool.slug}`);
  };
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-[linear-gradient(120deg,#ffffff_0%,#eef2ff_52%,#ecfeff_100%)] p-7 shadow-[var(--ia-shadow-card)] sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <span className="section-kicker">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Workspace
            </span>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              What do you want to create?
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Explore intelligent workflows built for writing, design, career
              growth, productivity, and development.
            </p>
            <label className="relative mt-7 block">
              <span className="sr-only">Search AI workflows</span>
              <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field-input mt-0 pl-12"
                placeholder="Search workflows, for example resume or image..."
              />
            </label>
          </div>
          <WandSparkles className="absolute -right-8 -top-8 h-56 w-56 rotate-12 text-indigo-200/60" />
        </section>
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">
                Browse by goal
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                AI categories
              </h2>
            </div>
            <span className="text-sm text-slate-500">
              {allTools.length} workflows
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {featureCategories.map((item) => (
              <button
                type="button"
                key={item.key}
                onClick={() => navigate(`/ai/${item.key.toLowerCase()}`)}
                className="rounded-3xl border border-slate-200 bg-white p-5 text-left text-slate-900 transition hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-950 hover:shadow-lg"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white`}
                >
                  <Sparkles className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-black text-slate-950">
                  {item.filter}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
                <p className="mt-3 text-xs font-bold text-indigo-700">
                  {item.tools.length} workflows
                </p>
              </button>
            ))}
          </div>
        </section>
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
              Filter workflows
            </div>
            <div className="flex flex-wrap gap-2">
              {["All Tools", "Free Tools", "Premium Tools"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`chip ${category === item ? "chip-active" : "chip-idle"}`}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPremiumOnly((value) => !value)}
                className={`chip ${premiumOnly ? "chip-active" : "chip-idle"}`}
              >
                Premium access
              </button>
            </div>
          </div>
        </Card>
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-black text-slate-950">
              {category === "All Tools" ? "Featured workflows" : category}
            </h2>
            <span className="text-sm text-slate-500">
              {visible.length} found
            </span>
          </div>
          {visible.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  locked={
                    (planRank[currentPlan] || 0) < (planRank[tool.minPlan] || 0)
                  }
                  onUse={useTool}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No workflows found"
              description={`Nothing matches “${query}”. Try another keyword or browse a category.`}
              action="Clear filters"
              onAction={() => {
                setQuery("");
                setCategory("All Tools");
                setPremiumOnly(false);
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default AIWorkspace;
