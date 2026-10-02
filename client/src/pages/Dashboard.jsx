import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  SquarePen,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  Code2,
  Clock3,
  ChevronRight,
  ExternalLink,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ToolCard from "../components/ToolCard.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { allTools, planRank } from "../data/toolCatalog.js";

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        if (response.data.success) {
          setData(response.data);
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (!background) setLoading(false);
      }
    },
    [getToken],
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Derived user details
  const firstName =
    user?.firstName || user?.fullName?.split(" ")[0] || "Alex";
  const userPlan = data?.user?.plan || "Pro";
  const availableCredits = data?.user?.availableCredits ?? 420;

  // Quick Action items from the uploaded image
  const quickActions = [
    {
      title: "Generate Content",
      desc: "Articles, blogs & copywriting",
      icon: SquarePen,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      path: "/ai/write-article",
    },
    {
      title: "Create Image",
      desc: "AI illustrations & artwork",
      icon: ImageIcon,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      path: "/ai/generate-images",
    },
    {
      title: "Analyze Resume",
      desc: "ATS score & job suggestions",
      icon: FileText,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      path: "/ai/review-resume",
    },
    {
      title: "Chat with Document",
      desc: "Instant insights from PDFs",
      icon: MessageSquare,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      path: "/ai/documents",
    },
  ];

  // Popular tools displayed in the uploaded image dashboard
  const popularSlugs = [
    "resume-reviewer",
    "ai-image-generation",
    "code-explainer",
    "ai-file-chat",
  ];
  const popularTools = popularSlugs
    .map((slug) => allTools.find((t) => t.slug === slug))
    .filter(Boolean);

  const fallbackPopular = popularTools.length ? popularTools : allTools.slice(0, 4);

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-7">
        {/* User Greeting Section (Matching image: Hi, Alex 👋 Welcome back!) */}
        <ScrollReveal animation="fade-up">
          <div className="flex items-center gap-3.5">
            <img
              src={
                user?.imageUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              }
              alt={firstName}
              className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Hi, {firstName} 👋
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Welcome back! What would you like to create today?
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Top 2 Cards: Credits Gradient Card + Current Plan Card */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Card 1: Your Credits Gradient Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-md shadow-indigo-200">
              {/* Ambient glass sheen */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                    Your Credits
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight">
                      {availableCredits}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
                    Resets in 14 days
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigate("/ai/credits")}
                    className="rounded-xl bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/30 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/ai/billing")}
                    className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-indigo-700 shadow-xs hover:bg-indigo-50 transition-colors"
                  >
                    Free Credits
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Current Plan Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Current Plan
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {userPlan}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                    Active
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Renews on Apr 25, 2026
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  All 54+ tools unlocked
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/ai/billing")}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Section: Quick Actions */}
        <div>
          <ScrollReveal animation="fade-up">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Quick Actions
            </h2>
          </ScrollReveal>
          <div className="mt-3.5 grid gap-4 grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <ScrollReveal key={action.title} animation="fade-up" delay={idx * 60}>
                  <button
                    type="button"
                    onClick={() => navigate(action.path)}
                    className="w-full group flex flex-col text-left rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${action.color} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                      {action.desc}
                    </p>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Section: Popular Tools */}
        <div>
          <ScrollReveal animation="fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Popular Tools
              </h2>
              <button
                type="button"
                onClick={() => navigate("/ai")}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                View all Tools <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </ScrollReveal>

          <div className="mt-3.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackPopular.map((tool, idx) => (
              <ScrollReveal key={tool.slug} animation="fade-up" delay={idx * 75}>
                <ToolCard
                  tool={tool}
                  onUse={(t) => navigate(t.path || `/ai/tools/${t.slug}`)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Recent Creations / Activity Preview */}
        {data?.creations && data.creations.length > 0 && (
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Creations
                  </h3>
                </div>
                <button
                  onClick={() => navigate("/ai/history")}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="divide-y divide-slate-100 mt-2">
                {data.creations.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 hover:bg-slate-50/70 px-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => navigate("/ai/history")}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">
                        {item.prompt || "Untitled creation"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.type} · Recently
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 ml-2 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
