import React, { useEffect, useState } from "react";
import { Bell, CircleHelp, Menu, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import InfinityLogo from "./InfinityLogo.jsx";

const Topbar = ({ onMenu }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [credits, setCredits] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    let active = true;
    getToken()
      .then((token) =>
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/sync`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      )
      .then(({ data }) => {
        if (active && data.success) setCredits(data.user.availableCredits);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [getToken]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/ai?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 transition-all duration-200">
      {/* Left side: Mobile menu toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open sidebar menu"
          className="rounded-xl p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-left focus:outline-none"
        >
          <InfinityLogo size="sm" />
        </button>
      </div>

      {/* Center: Search input matching the uploaded image */}
      <div className="mx-4 flex max-w-xl flex-1 items-center justify-center">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search tools, creations, or anything..."
            className="h-10 w-full rounded-full border border-slate-200/90 bg-slate-50/70 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100/60 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side: Actions & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Credits Badge */}
        <button
          type="button"
          onClick={() => navigate("/ai/credits")}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
          title="View credit balance"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>{credits !== null ? `${credits} credits` : "Credits"}</span>
        </button>

        {/* Notifications Icon */}
        <button
          type="button"
          onClick={() => navigate("/ai/notifications")}
          aria-label="View notifications"
          className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse" />
        </button>

        {/* Help Center */}
        <button
          type="button"
          onClick={() => navigate("/ai/help")}
          aria-label="Help Center"
          className="hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors sm:block"
        >
          <CircleHelp className="h-5 w-5" />
        </button>

        {/* User Avatar */}
        <button
          type="button"
          onClick={() => navigate("/ai/profile")}
          className="flex items-center rounded-full p-0.5 ring-2 ring-transparent hover:ring-indigo-300 transition-all"
        >
          <img
            src={user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
            alt={user?.fullName || "User Profile"}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-slate-200"
          />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
