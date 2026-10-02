import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  House,
  LayoutGrid,
  Clock3,
  Users,
  WalletCards,
  CreditCard,
  UserRound,
  FileText,
  Settings,
  Bell,
  Sparkles,
  LogOut,
  ChevronRight,
} from "lucide-react";
import InfinityLogo from "./InfinityLogo.jsx";

const primaryNavItems = [
  { to: "/dashboard", label: "Home", icon: House },
  { to: "/ai", label: "All Tools", icon: LayoutGrid },
  { to: "/ai/history", label: "History", icon: Clock3 },
  { to: "/ai/community", label: "Community", icon: Users },
  { to: "/ai/credits", label: "Credits", icon: WalletCards },
  { to: "/ai/billing", label: "Subscription", icon: CreditCard },
  { to: "/ai/profile", label: "Profile", icon: UserRound },
];

const secondaryNavItems = [
  { to: "/ai/documents", label: "Documents", icon: FileText },
  { to: "/ai/settings", label: "Settings", icon: Settings },
  { to: "/ai/notifications", label: "Notifications", icon: Bell },
];

const Sidebar = ({ sidebar, setSideBar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const location = useLocation();

  const closeSidebar = () => setSideBar(false);

  const isLinkActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path === "/ai" && location.pathname === "/ai") return true;
    if (path !== "/dashboard" && path !== "/ai" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {sidebar && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white shadow-sm transition-transform duration-300 ease-in-out lg:static lg:z-30 lg:translate-x-0 ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <Link to="/dashboard" onClick={closeSidebar}>
            <InfinityLogo size="sm" />
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 custom-scrollbar">
          {/* Main Navigation Items */}
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-indigo-50 text-indigo-700 font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Secondary workspace links */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeSidebar}
                    className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Upgrade to Pro promotional card matching the uploaded image */}
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-white p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-xs font-bold text-slate-900">Upgrade to Pro</p>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              More credits, more power!
            </p>
            <Link
              to="/ai/billing"
              onClick={closeSidebar}
              className="mt-3 block w-full text-center rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center justify-between rounded-xl p-2 hover:bg-slate-50 transition-colors">
            <div
              onClick={openUserProfile}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
            >
              <img
                src={user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
                alt={user?.fullName || "User"}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">
                  {user?.fullName || "Creator"}
                </p>
                <p className="text-[11px] font-medium text-indigo-600">
                  Pro Plan
                </p>
              </div>
            </div>

            <button
              onClick={signOut}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
