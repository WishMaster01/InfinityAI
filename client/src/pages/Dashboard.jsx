import React, { useEffect, useMemo, useState } from "react";
import { dummyCreationData } from "../assets/assets.js";
import { Crown, Sparkles, WalletCards } from "lucide-react";
import { Protect, useAuth, useUser } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem.jsx";
import FeatureSection from "../components/FeatureSection.jsx";
import SearchAndFilter from "../components/SearchAndFilter.jsx";
import UpgradeModal from "../components/UpgradeModal.jsx";
import {
  allTools,
  featureCategories,
  filters,
  planRank,
} from "../data/toolCatalog.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [activeFilter, setActiveFilter] = useState(() =>
    filters.includes(categoryFilter) ? categoryFilter : "All Tools"
  );
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [upgradeTool, setUpgradeTool] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const currentPlan =
    usageStats?.plan || (user?.publicMetadata?.plan === "premium" ? "PRO" : "BASIC");

  useEffect(() => {
    const getDashboardData = async () => {
      setLoadingWorkspace(true);

      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/get-user-creations`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (data.success) {
          setCreations(data.creations);
          setUsageStats(data.user);
          return;
        }
      } catch {
        setCreations(dummyCreationData);
      } finally {
        setLoadingWorkspace(false);
      }
    };

    getDashboardData();
  }, [getToken]);

  useEffect(() => {
    if (filters.includes(categoryFilter)) {
      setActiveFilter(categoryFilter);
    }
  }, [categoryFilter]);

  const visibleTools = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allTools.filter((tool) => {
      const matchesSearch =
        !normalizedSearch ||
        tool.name.toLowerCase().includes(normalizedSearch) ||
        tool.description.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        activeFilter === "All Tools" ||
        (activeFilter === "Free Tools" && !tool.isPremium) ||
        (activeFilter === "Premium Tools" && tool.isPremium) ||
        tool.filter === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, search]);

  const handleUseTool = (tool) => {
    const locked = planRank[currentPlan] < planRank[tool.minPlan];

    if (locked) {
      setUpgradeTool(tool);
      return;
    }

    if (tool.path) {
      navigate(tool.path);
      return;
    }

    toast("This tool workspace is coming soon.");
  };

  const totalCredits =
    currentPlan === "PRO" ? 2000 : currentPlan === "MODERATE" ? 500 : 20;
  const usedCredits = usageStats?.usedCredits ?? Math.min(creations.length, totalCredits);
  const availableCredits = usageStats?.availableCredits ?? totalCredits - usedCredits;

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_390px] xl:items-stretch">
          <div className="glass-card p-7 sm:p-10">
            <span className="section-kicker">AI SaaS Workspace</span>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Explore every AI tool by workflow
            </h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600 sm:text-xl">
              Search premium AI tools by category, compare credit costs, and
              launch the workflows that are already connected.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="dashboard-stat">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Current Plan
                </p>
                <h2 className="mt-2 text-4xl font-black text-slate-950">
                  <Protect plan="premium" fallback="Basic">
                    Pro
                  </Protect>
                </h2>
              </div>
              <div className="icon-badge bg-gradient-to-br from-amber-400 to-rose-500">
                <Crown className="h-5 w-5" />
              </div>
            </div>

            <div className="dashboard-stat">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Credits Used
                </p>
                <h2 className="mt-2 text-4xl font-black text-slate-950">
                  {usedCredits}/{usedCredits + availableCredits}
                </h2>
              </div>
              <div className="icon-badge bg-gradient-to-br from-blue-500 to-cyan-500">
                <WalletCards className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        <SearchAndFilter
          filters={filters}
          activeFilter={activeFilter}
          search={search}
          onFilter={setActiveFilter}
          onSearch={setSearch}
        />

        <div className="space-y-10">
          {featureCategories.map((category) => (
            <FeatureSection
              key={category.key}
              category={category}
              tools={visibleTools.filter((tool) => tool.category === category.key)}
              currentPlan={currentPlan}
              planRank={planRank}
              onUse={handleUseTool}
              loading={loadingWorkspace}
            />
          ))}
        </div>

        {!loadingWorkspace && !visibleTools.length && (
          <div className="empty-state">
            <Sparkles className="h-10 w-10 text-indigo-400" />
            <p className="text-sm font-semibold">No tools match your search.</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-950">
                Recent Creations
              </h2>
              <p className="mt-1 text-base text-slate-500">
                Generated outputs and history remain available below the tool
                catalog.
              </p>
            </div>
            <button
              onClick={() => navigate("/ai/history")}
              className="secondary-button w-fit"
            >
              View full history
            </button>
          </div>
          {creations.length ? (
            creations.map((item) => <CreationItem key={item.id} item={item} />)
          ) : (
            <div className="empty-state max-w-5xl">
              <Sparkles className="h-10 w-10 text-indigo-400" />
              <p className="text-sm font-semibold">No creations yet</p>
            </div>
          )}
        </div>
      </div>

      <UpgradeModal tool={upgradeTool} onClose={() => setUpgradeTool(null)} />
    </div>
  );
};

export default Dashboard;
