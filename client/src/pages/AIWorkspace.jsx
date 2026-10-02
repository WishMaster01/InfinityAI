import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Zap,
  Gift,
  Crown,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { allTools, featureCategories, planRank } from "../data/toolCatalog.js";
import ToolCard from "../components/ToolCard.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";

const categoryFilters = [
  "All Categories",
  "Content & Writing",
  "Image & Design",
  "Career & Jobs",
  "Productivity",
  "Developer Tools",
  "Document & PDF",
];

const AIWorkspace = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [activeTab, setActiveTab] = useState("Popular");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl !== null) {
      setQuery(searchFromUrl);
    }
  }, [searchParams]);

  const currentPlan = user?.publicMetadata?.plan === "premium" ? "PRO" : "BASIC";

  const filterTabs = [
    { label: "Popular", icon: Flame },
    { label: "New", icon: Sparkles },
    { label: "Free", icon: Gift },
    { label: "Pro", icon: Crown },
  ];

  const visibleTools = useMemo(() => {
    return allTools.filter((tool) => {
      const text = `${tool.name} ${tool.description} ${tool.categoryTitle}`.toLowerCase();
      const matchesQuery = !query || text.includes(query.toLowerCase());

      // Tab filter
      let matchesTab = true;
      if (activeTab === "Free") {
        matchesTab = !tool.isPremium;
      } else if (activeTab === "Pro") {
        matchesTab = tool.isPremium;
      }

      // Category filter
      let matchesCat = true;
      if (selectedCategory !== "All Categories") {
        if (selectedCategory === "Content & Writing") matchesCat = tool.category === "CONTENT";
        else if (selectedCategory === "Image & Design") matchesCat = tool.category === "IMAGE";
        else if (selectedCategory === "Career & Jobs") matchesCat = tool.category === "CAREER";
        else if (selectedCategory === "Productivity") matchesCat = tool.category === "PRODUCTIVITY";
        else if (selectedCategory === "Developer Tools") matchesCat = tool.category === "DEVELOPER";
        else if (selectedCategory === "Document & PDF") matchesCat = tool.category === "PRODUCTIVITY" || tool.slug.includes("chat") || tool.slug.includes("pdf");
      }

      return matchesQuery && matchesTab && matchesCat;
    });
  }, [query, activeTab, selectedCategory]);

  const handleUseTool = (tool) => {
    const locked = (planRank[currentPlan] || 0) < (planRank[tool.minPlan] || 0);
    if (locked) {
      return navigate("/ai/billing");
    }
    navigate(tool.path || `/ai/tools/${tool.slug}`);
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Header matching image top-right: All AI Tools */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              All AI Tools
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Explore 54+ powerful AI tools to boost your productivity and creativity.
            </p>
          </div>

          {/* Search bar if needed on desktop */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Filter Bar with Tabs (Popular, New, Free, Pro) & Category pills */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
          {/* Main Status Tabs matching the uploaded image */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {filterTabs.map((tab) => {
              const active = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150 ${
                    active
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Category Dropdown/Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400"
            >
              {categoryFilters.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tool Cards Grid matching the uploaded image design */}
        {visibleTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleTools.map((tool, idx) => (
              <ScrollReveal key={tool.slug} animation="fade-up" delay={(idx % 4) * 60}>
                <ToolCard
                  tool={tool}
                  onUse={handleUseTool}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-indigo-400" />
            <h3 className="mt-3 text-sm font-bold text-slate-800">
              No matching tools found
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Try adjusting your search query or switching categories.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveTab("Popular");
                setSelectedCategory("All Categories");
              }}
              className="mt-4 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWorkspace;
