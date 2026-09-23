import React from "react";

const styles = {
  neutral: "bg-slate-100 text-slate-700",
  primary: "bg-indigo-50 text-indigo-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-rose-50 text-rose-700",
};

const Badge = ({ tone = "neutral", children }) => (
  <span
    className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold ${styles[tone] || styles.neutral}`}
  >
    {children}
  </span>
);

export default Badge;
