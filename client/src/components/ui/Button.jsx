import React from "react";

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl",
  secondary:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700",
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
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
