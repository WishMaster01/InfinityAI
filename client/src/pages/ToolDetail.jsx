import React from "react";
import { ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { allTools, planRank } from "../data/toolCatalog.js";
import { useUser } from "@clerk/clerk-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/State.jsx";

const ToolDetail = () => {
  const { toolSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const tool = allTools.find((item) => item.slug === toolSlug);
  const currentPlan =
    user?.publicMetadata?.plan === "premium" ? "PRO" : "BASIC";
  if (!tool)
    return (
      <div className="page-shell">
        <div className="content-wrap">
          <EmptyState
            title="Workflow not found"
            action="Back to AI Workspace"
            onAction={() => navigate("/ai")}
          />
        </div>
      </div>
    );
  const locked = (planRank[currentPlan] || 0) < (planRank[tool.minPlan] || 0);
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-7">
        <button
          type="button"
          onClick={() => navigate(`/ai/${tool.category.toLowerCase()}`)}
          className="text-sm font-bold text-indigo-700 hover:underline"
        >
          ← Back to {tool.categoryTitle}
        </button>
        <section className="grid gap-7 lg:grid-cols-[1fr_360px]">
          <Card className="p-8 sm:p-10">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
              <Sparkles className="h-7 w-7" />
            </span>
            <p className="mt-7 text-xs font-black uppercase tracking-[.2em] text-indigo-600">
              {tool.categoryTitle}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {tool.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {tool.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
                {tool.credits} credits per run
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                {tool.minPlan === "BASIC"
                  ? "Available on Basic"
                  : `${tool.minPlan} workflow`}
              </span>
            </div>
          </Card>
          <Card className="p-7">
            <h2 className="text-xl font-black text-slate-950">
              Launch workflow
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create, refine, and save your result in a focused workspace.
            </p>
            <Button
              className="mt-7 w-full"
              onClick={() =>
                navigate(
                  locked
                    ? "/ai/billing"
                    : `${tool.path || `/ai/tools/${tool.slug}`}`,
                )
              }
            >
              {locked ? (
                <>
                  <LockKeyhole className="h-4 w-4" />
                  Upgrade to unlock
                </>
              ) : (
                <>
                  Launch tool <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </Card>
        </section>
        <Card className="p-7 sm:p-9">
          <h2 className="text-2xl font-black text-slate-950">
            What you can do
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <p className="flex gap-3 text-slate-600">
              <Check className="h-5 w-5 shrink-0 text-emerald-500" />
              Start from a guided input experience.
            </p>
            <p className="flex gap-3 text-slate-600">
              <Check className="h-5 w-5 shrink-0 text-emerald-500" />
              Review and save your generated result.
            </p>
            <p className="flex gap-3 text-slate-600">
              <Check className="h-5 w-5 shrink-0 text-emerald-500" />
              Return to your history whenever you need it.
            </p>
            <p className="flex gap-3 text-slate-600">
              <Check className="h-5 w-5 shrink-0 text-emerald-500" />
              Retry safely when a provider request fails.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ToolDetail;
