import React from "react";
import { ChevronRight, House } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [] }) => (
  <nav
    aria-label="Breadcrumb"
    className="mb-5 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-slate-500"
  >
    <Link
      aria-label="Dashboard"
      to="/ai"
      className="rounded-lg p-1 hover:bg-indigo-50 hover:text-indigo-700"
    >
      <House className="h-4 w-4" />
    </Link>
    {items.map((item, index) => (
      <React.Fragment key={`${item.label}-${index}`}>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
        {item.to ? (
          <Link
            to={item.to}
            className="rounded-lg px-2 py-1 font-semibold hover:bg-indigo-50 hover:text-indigo-700"
          >
            {item.label}
          </Link>
        ) : (
          <span className="px-2 py-1 font-semibold text-slate-800">
            {item.label}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumbs;
