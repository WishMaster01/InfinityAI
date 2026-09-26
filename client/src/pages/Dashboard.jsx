import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  ArrowRight,
  BarChart3,
  BatteryWarning,
  Clock3,
  Crown,
  FileText,
  Image,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  WandSparkles,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { featureCategories, planRank } from "../data/toolCatalog.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import {
  EmptyState,
  ErrorState,
  OfflineState,
} from "../components/ui/State.jsx";

const categoryIcons = {
  CONTENT: WandSparkles,
  IMAGE: Image,
  CAREER: FileText,
  PRODUCTIVITY: Sparkles,
  DEVELOPER: BarChart3,
};
const formatTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Recently";

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(!navigator.onLine);

  const loadDashboard = useCallback(
    async ({ background = false } = {}) => {
      if (!background) setLoading(true);
      setError("");
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/get-user-creations`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );
        if (!response.data.success)
          throw new Error("Unable to load workspace.");
        setData(response.data);
      } catch (requestError) {
        if (!background)
          setError(
            requestError?.response?.status === 401
              ? "Your session has expired. Please sign in again."
              : "We couldn't load your workspace. Please try again.",
          );
      } finally {
        if (!background) setLoading(false);
      }
    },
    [getToken],
  );

  useEffect(() => {
    loadDashboard();
    const onOnline = () => {
      setOffline(false);
      loadDashboard({ background: true });
    };
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [loadDashboard]);

  const currentPlan = data?.user?.plan || "BASIC";
  const limit =
    currentPlan === "PRO" ? 2000 : currentPlan === "MODERATE" ? 500 : 20;
  const available = data?.user?.availableCredits ?? limit;
  const used = data?.user?.usedCredits ?? 0;
  const usagePercent = Math.min(
    100,
    Math.round((used / Math.max(limit, 1)) * 100),
  );
  const recommendations = (data?.recommendations || []).slice(0, 3);
  const recent = (data?.toolUsages || []).slice(0, 5);
  const creations = data?.creations || [];
  const greeting =
    user?.firstName || user?.fullName?.split(" ")[0] || "Creator";
  const hasHistory = creations.length > 0 || recent.length > 0;
  const planLevel = planRank[currentPlan] ?? 0;
  const quickCategories = useMemo(() => {
    const goal = user?.unsafeMetadata?.goal;
    const preferred = {
      content: "CONTENT",
      documents: "PRODUCTIVITY",
      career: "CAREER",
      productivity: "PRODUCTIVITY",
      code: "DEVELOPER",
    }[goal];
    return preferred
      ? [
          ...featureCategories.filter((item) => item.key === preferred),
          ...featureCategories.filter((item) => item.key !== preferred),
        ].slice(0, 5)
      : featureCategories.slice(0, 5);
  }, [user]);

  if (loading)
    return (
      <div className="page-shell">
        <div className="content-wrap space-y-8">
          <div className="h-52 animate-pulse rounded-[var(--ia-radius-card)] bg-white shadow-[var(--ia-shadow-card)]" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-[var(--ia-radius-card)] bg-white"
              />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-[var(--ia-radius-card)] bg-white" />
            <div className="h-72 animate-pulse rounded-[var(--ia-radius-card)] bg-white" />
          </div>
        </div>
      </div>
    );
  if (error && !data)
    return (
      <div className="page-shell">
        <div className="content-wrap">
          <ErrorState message={error} onRetry={() => loadDashboard()} />
        </div>
      </div>
    );

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-7">
        {offline && (
          <OfflineState
            onRetry={() => {
              setOffline(false);
              loadDashboard();
            }}
          />
        )}
        <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-[linear-gradient(120deg,#ffffff_0%,#eef2ff_52%,#ecfeff_100%)] p-7 shadow-[var(--ia-shadow-card)] sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <span className="section-kicker">My AI workspace</span>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 18
                  ? "afternoon"
                  : "evening"}
              , {greeting} <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              What are you creating today? Pick up where you left off or start a
              new workflow.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={() => navigate("/ai")}>
                <WandSparkles className="h-4 w-4" />
                Start creating
              </Button>
              <Button variant="secondary" onClick={() => navigate("/ai")}>
                Explore AI workspace
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Sparkles className="absolute -right-5 -top-8 h-48 w-48 rotate-12 text-indigo-200/60" />
        </section>

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Workspace overview"
        >
          <Card className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Current plan
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {currentPlan}
              </p>
            </div>
            <Crown className="h-8 w-8 text-amber-500" />
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Credits</p>
              <WalletCards className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-950">
              {available}{" "}
              <span className="text-sm font-semibold text-slate-400">
                / {limit}
              </span>
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${available <= Math.max(2, Math.ceil(limit * 0.15)) ? "bg-amber-500" : "bg-indigo-600"}`}
                style={{ width: `${Math.max(2, 100 - usagePercent)}%` }}
              />
            </div>
          </Card>
          <Card className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">Creations</p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {creations.length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-cyan-600" />
          </Card>
          <Card className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">Activity</p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {data?.analytics?.activityStreak || 0}{" "}
                <span className="text-sm font-semibold text-slate-400">
                  day streak
                </span>
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-violet-600" />
          </Card>
        </section>

        {available <= Math.max(2, Math.ceil(limit * 0.15)) && (
          <Card className="flex flex-col gap-4 border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <BatteryWarning className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h2 className="font-black text-amber-950">
                  You’re running low on credits
                </h2>
                <p className="mt-1 text-sm text-amber-800">
                  You have {available} credits left this period. Choose a plan
                  when you're ready.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate("/ai/billing")}>
              Manage credits
            </Button>
          </Card>
        )}
        {available === 0 && (
          <Card className="flex flex-col gap-4 border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-black text-rose-950">Credits exhausted</h2>
              <p className="mt-1 text-sm text-rose-800">
                You’ve used all available credits for this period. Your saved
                work is still available.
              </p>
            </div>
            <Button variant="danger" onClick={() => navigate("/ai/billing")}>
              View plans
            </Button>
          </Card>
        )}

        <div className="grid gap-7 xl:grid-cols-[1.15fr_.85fr]">
          <Card className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">
                  Continue creating
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Pick up where you left off
                </h2>
              </div>
              <Button
                variant="ghost"
                className="px-3"
                onClick={() => navigate("/ai/history")}
              >
                View history
              </Button>
            </div>
            {hasHistory ? (
              <div className="mt-5 space-y-3">
                {(creations.length
                  ? creations.slice(0, 3)
                  : recent.slice(0, 3)
                ).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => navigate("/ai/history")}
                    className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900">
                        {item.prompt || item.toolSlug}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatTime(item.createdAt)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState
                  title="Your workspace is ready"
                  description="Generate your first creation and it will appear here for easy access."
                  action="Explore workflows"
                  onAction={() => navigate("/ai")}
                />
              </div>
            )}
          </Card>
          <Card className="p-6 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">
                  Recommended for you
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  A smart next step
                </h2>
              </div>
              <Sparkles className="h-7 w-7 text-violet-500" />
            </div>
            {recommendations.length ? (
              <div className="mt-5 space-y-3">
                {recommendations.map((tool) => (
                  <button
                    type="button"
                    key={tool.slug}
                    onClick={() =>
                      planLevel < (planRank[tool.minPlan] || 0)
                        ? toast("This workflow is available on a higher plan.")
                        : navigate(tool.path || `/ai/tools/${tool.slug}`)
                    }
                    className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900">
                        {tool.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {tool.credits} credits · {tool.minPlan} access
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                Use a workflow to personalize your recommendations.
              </p>
            )}
          </Card>
        </div>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">
                Explore by goal
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Quick categories
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/ai")}
              className="text-sm font-bold text-indigo-700 hover:underline"
            >
              View workspace
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {quickCategories.map((category) => {
              const Icon = categoryIcons[category.key] || Sparkles;
              return (
                <button
                  type="button"
                  key={category.key}
                  onClick={() =>
                    navigate(
                      `/ai?category=${encodeURIComponent(category.filter)}`,
                    )
                  }
                  className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-black text-slate-950">
                    {category.filter}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {category.tools.length} workflows to explore
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">
                Recent activity
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Your latest workspace events
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/ai/history")}
              className="text-sm font-bold text-indigo-700 hover:underline"
            >
              View all
            </button>
          </div>
          {recent.length ? (
            <div className="mt-5 divide-y divide-slate-100">
              {recent.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${item.success ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">
                      {item.toolSlug}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatTime(item.createdAt)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {item.credits} credits
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState
                title="No activity yet"
                description="Your completed workflows will appear here."
                action="Start creating"
                onAction={() => navigate("/ai")}
              />
            </div>
          )}
        </Card>
        <Card className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || "Your profile"}
              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-indigo-50"
            />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">
                Profile snapshot
              </p>
              <h2 className="mt-2 truncate text-2xl font-black text-slate-950">
                {user?.fullName || "Your profile"}
              </h2>
              <p className="mt-1 truncate text-sm text-slate-500">
                {user?.primaryEmailAddress?.emailAddress || "InfinityAI member"}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Plan</p>
              <p className="mt-1 font-black text-slate-900">{currentPlan}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">
                Used this period
              </p>
              <p className="mt-1 font-black text-slate-900">{used} credits</p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={() => navigate("/ai/billing")}
          >
            {currentPlan === "BASIC" ? "Compare plans" : "Manage subscription"}
          </Button>
        </Card>
        {error && data && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900"
          >
            <RefreshCw className="h-4 w-4" />
            Some workspace data could not refresh.{" "}
            <button
              type="button"
              className="underline"
              onClick={() => loadDashboard({ background: true })}
            >
              Retry
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
