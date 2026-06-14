import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Bot,
  BriefcaseBusiness,
  Code2,
  Eraser,
  FileText,
  GraduationCap,
  Hash,
  House,
  Image,
  LogOut,
  CreditCard,
  Clock3,
  Scissors,
  Sparkles,
  SquarePen,
  Users,
} from "lucide-react";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { allTools, featureCategories } from "../data/toolCatalog.js";

const categoryIcons = {
  Bot,
  BriefcaseBusiness,
  Code2,
  Eraser,
  GraduationCap,
  FileText,
  Hash,
  Image,
  Scissors,
  Sparkles,
  SquarePen,
};

const topToolSlugs = [
  "ai-article-writer",
  "ai-image-generator",
  "resume-review-ai",
  "blog-title-generator",
  "background-remover",
  "object-remover",
];

const topTools = topToolSlugs
  .map((slug) => allTools.find((tool) => tool.slug === slug && tool.path))
  .filter(Boolean);

const workspaceItems = [
  { to: "/ai/history", label: "History", Icon: Clock3 },
  { to: "/ai/community", label: "Community", Icon: Users },
  { to: "/ai/billing", label: "Billing", Icon: CreditCard },
];

const Sidebar = ({ sidebar, setSideBar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const location = useLocation();
  const selectedCategory = new URLSearchParams(location.search).get("category");
  const dashboardActive = location.pathname === "/ai" && !selectedCategory;

  const closeSidebar = () => setSideBar(false);

  const linkClass = (active) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-bold transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-lg shadow-indigo-200"
        : "text-slate-600 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700"
    }`;

  const sectionLabelClass =
    "px-4 pt-6 pb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400";

  return (
    <>
      {sidebar && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-20 bg-slate-950/20 backdrop-blur-sm sm:hidden"
        />
      )}
      <aside
        className={`z-30 flex w-80 max-w-[88vw] flex-col border-r border-white/70 bg-white/90 shadow-[18px_0_55px_rgba(15,23,42,0.08)] backdrop-blur-2xl max-sm:fixed max-sm:top-20 max-sm:bottom-0 sm:w-80 ${
          sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white via-indigo-50/70 to-cyan-50/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={user.imageUrl}
                alt="USER AVATAR"
                className="h-14 w-14 rounded-2xl object-cover shadow-lg shadow-indigo-100 ring-4 ring-white"
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-slate-950">
                  {user.fullName}
                </p>
                <p className="mt-1 text-xs font-semibold text-indigo-700">
                  InfinityAI Workspace
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            <p className={sectionLabelClass}>Overview</p>
            <Link
              to="/ai"
              onClick={closeSidebar}
              className={linkClass(dashboardActive)}
            >
              <House className="h-4 w-4 text-current" />
              Dashboard
            </Link>

            <p className={sectionLabelClass}>Featured Categories</p>
            {featureCategories.map((category) => {
              const Icon = categoryIcons[category.icon] || Bot;
              const active =
                location.pathname === "/ai" && selectedCategory === category.filter;

              return (
                <Link
                  key={category.key}
                  to={`/ai?category=${encodeURIComponent(category.filter)}`}
                  onClick={closeSidebar}
                  className={linkClass(active)}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-sm transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{category.filter}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.tools.length}
                  </span>
                </Link>
              );
            })}

            <p className={sectionLabelClass}>Top Tools</p>
            {topTools.map((tool) => {
              const IconComponent = categoryIcons[tool.icon] || Sparkles;

              return (
                <NavLink
                  key={tool.slug}
                  to={tool.path}
                  onClick={closeSidebar}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  <IconComponent className="h-4 w-4 text-current" />
                  <span className="min-w-0 flex-1 truncate">{tool.name}</span>
                </NavLink>
              );
            })}

            <p className={sectionLabelClass}>Workspace</p>
            {workspaceItems.map((item) => {
              const IconComponent = item.Icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  <IconComponent className="h-4 w-4 text-current" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="m-4 flex items-center justify-between rounded-3xl border border-slate-200/70 bg-white/90 p-3 shadow-sm">
          <div
            onClick={openUserProfile}
            className="flex min-w-0 cursor-pointer items-center gap-3"
          >
            <img
              src={user.imageUrl}
              alt="USER AVATAR"
              className="h-10 w-10 rounded-2xl object-cover"
            />

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-slate-900">
                {user.fullName}
              </h1>
              <p className="text-xs text-slate-500">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>
                Plan
              </p>
            </div>
          </div>

          <LogOut
            onClick={signOut}
            className="h-5 w-5 shrink-0 cursor-pointer text-slate-400 hover:text-rose-500"
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
