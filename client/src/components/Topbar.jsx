import React from "react";
import { Bell, CircleHelp, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Topbar = ({ onMenu }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <header className="flex min-h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation"
        className="rounded-xl p-2 text-slate-600 hover:bg-indigo-50 sm:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => navigate("/ai")}
        className="shrink-0 text-lg font-black text-slate-950"
      >
        Infinity<span className="text-indigo-600">AI</span>
      </button>
      <label className="relative hidden min-w-0 flex-1 sm:block">
        <span className="sr-only">Search AI tools</span>
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          onKeyDown={(event) => {
            if (event.key === "Enter")
              navigate(
                `/ai?search=${encodeURIComponent(event.currentTarget.value)}`,
              );
          }}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          placeholder="Search tools, creations, or anything..."
        />
      </label>
      <button
        aria-label="Help"
        type="button"
        className="hidden rounded-xl p-3 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700 sm:block"
      >
        <CircleHelp className="h-5 w-5" />
      </button>
      <button
        aria-label="Notifications"
        type="button"
        onClick={() => navigate("/ai/billing")}
        className="rounded-xl p-3 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
      >
        <Bell className="h-5 w-5" />
      </button>
      <img
        src={user?.imageUrl}
        alt={user?.fullName || "Account"}
        className="h-9 w-9 rounded-xl object-cover"
      />
    </header>
  );
};

export default Topbar;
