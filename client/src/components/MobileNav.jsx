import React from "react";
import { Clock3, House, Plus, Sparkles, UserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    ["/dashboard", "Home", House],
    ["/ai", "Tools", Sparkles],
    ["/ai", "Create", Plus],
    ["/ai/history", "History", Clock3],
    ["/ai/billing", "Profile", UserRound],
  ];
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:hidden"
    >
      {items.map(([to, label, IconComponent], index) => {
        const active = location.pathname === to;
        return (
          <button
            key={label}
            type="button"
            onClick={() => navigate(to)}
            className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold ${active ? "text-indigo-700" : "text-slate-500"} ${index === 2 ? "-mt-5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200" : ""}`}
          >
            {React.createElement(IconComponent, { className: "h-5 w-5" })}
            {label}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
