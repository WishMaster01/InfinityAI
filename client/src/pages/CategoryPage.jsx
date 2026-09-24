import React, { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { allTools, featureCategories, planRank } from "../data/toolCatalog.js";
import { useUser } from "@clerk/clerk-react";
import ToolCard from "../components/ToolCard.jsx";
import { EmptyState } from "../components/ui/State.jsx";

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const categoryKey = category.toUpperCase();
  const definition = featureCategories.find((item) => item.key === categoryKey);
  const currentPlan =
    user?.publicMetadata?.plan === "premium" ? "PRO" : "BASIC";
  const tools = useMemo(
    () =>
      allTools.filter(
        (tool) =>
          tool.category === categoryKey &&
          (!query ||
            `${tool.name} ${tool.description}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [categoryKey, query],
  );
  if (!definition)
    return (
      <div className="page-shell">
        <div className="content-wrap">
          <EmptyState
            title="Category not found"
            action="Back to AI Workspace"
            onAction={() => navigate("/ai")}
          />
        </div>
      </div>
    );
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section
          className={`rounded-[28px] bg-gradient-to-br ${definition.gradient} p-8 text-white shadow-[var(--ia-shadow-card)] sm:p-10`}
        >
          <span className="text-xs font-black uppercase tracking-[.2em] text-white/80">
            AI category
          </span>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            {definition.filter}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/85">
            {definition.description}
          </p>
          <p className="mt-5 text-sm font-bold">
            {definition.tools.length} workflows available
          </p>
        </section>
        <label className="relative block">
          <span className="sr-only">Search {definition.filter}</span>
          <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field-input mt-0 pl-12"
            placeholder={`Search ${definition.filter} workflows...`}
          />
        </label>
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-950">
              All workflows
            </h2>
            <span className="text-sm text-slate-500">{tools.length} found</span>
          </div>
          {tools.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  locked={
                    (planRank[currentPlan] || 0) < (planRank[tool.minPlan] || 0)
                  }
                  onUse={() => navigate(tool.path || `/ai/tools/${tool.slug}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No workflows found"
              description="Try another search term."
              action="Clear search"
              onAction={() => setQuery("")}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
