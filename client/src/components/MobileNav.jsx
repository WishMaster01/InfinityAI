import React from "react";
import { House, LayoutGrid, Clock3, UserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Home", icon: House },
    { to: "/ai", label: "Tools", icon: LayoutGrid },
    { to: "/ai/history", label: "History", icon: Clock3 },
    { to: "/ai/profile", label: "Profile", icon: UserRound },
  ];

  const isItemActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path === "/ai" && location.pathname === "/ai") return true;
    if (path !== "/dashboard" && path !== "/ai" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200/90 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-xl sm:hidden"
    >
      {navItems.map((item) => {
        const active = isItemActive(item.to);
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.to)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
              active
                ? "text-indigo-600 font-bold scale-105"
                : "text-slate-400 hover:text-slate-700 font-medium"
            }`}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {active && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-indigo-600" />
              )}
            </div>
            <span className="text-[11px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
