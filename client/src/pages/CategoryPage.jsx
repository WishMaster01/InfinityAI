import React, { useMemo, useState } from "react";
import { Search, Sparkles, ChevronRight } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { allTools, featureCategories, planRank } from "../data/toolCatalog.js";
import { useUser } from "@clerk/clerk-react";
import ToolCard from "../components/ToolCard.jsx";

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [query, setQuery] = useState("");

  const categoryKey = (category || "").toUpperCase();
  const definition = featureCategories.find((item) => item.key === categoryKey) || featureCategories[0];
  const currentPlan = user?.publicMetadata?.plan === "premium" ? "PRO" : "BASIC";

  const tools = useMemo(() => {
    return allTools.filter(
      (tool) =>
        tool.category === categoryKey &&
        (!query ||
          `${tool.name} ${tool.description}`
            .toLowerCase()
            .includes(query.toLowerCase())),
    );
  }, [categoryKey, query]);

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/ai" className="hover:text-indigo-600 transition-colors">
            All AI Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 font-bold">{definition.filter}</span>
        </nav>

        {/* Category Header */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="section-kicker">
              <Sparkles className="h-3.5 w-3.5" /> AI Category
            </span>
            <h1 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {definition.title || definition.filter}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl">
              {definition.description}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${definition.filter}...`}
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Workflows in this category
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {tools.length} available
          </span>
        </div>

        {tools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
            <Sparkles className="mx-auto h-8 w-8 text-indigo-400" />
            <p className="mt-2 text-xs font-bold text-slate-700">
              No matching workflows found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try a different keyword or view all tools.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
