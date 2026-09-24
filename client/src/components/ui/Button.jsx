import React from "react";

const variants = {
  primary:
    "bg-[var(--ia-primary)] text-white shadow-lg shadow-indigo-200/60 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl",
  secondary:
    "border border-slate-200 bg-[var(--ia-surface)] text-slate-800 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700",
  ghost: "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700",
  danger: "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
};

const Button = ({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--ia-radius-control)] px-5 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
