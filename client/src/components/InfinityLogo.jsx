import React from "react";

export const InfinityIcon = ({ className = "h-7 w-7", isDark = false }) => (
  <svg
    viewBox="0 0 48 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="infGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="infGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="50%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#67E8F9" />
      </linearGradient>
    </defs>
    <path
      d="M14 6C8.477 6 4 10.477 4 16C4 21.523 8.477 26 14 26C18.5 26 21.5 22.5 24 16C26.5 9.5 29.5 6 34 6C39.523 6 44 10.477 44 16C44 21.523 39.523 26 34 26C29.5 26 26.5 22.5 24 16C21.5 9.5 18.5 6 14 6Z"
      stroke={isDark ? "url(#infGradDark)" : "url(#infGrad)"}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfinityLogo = ({ isDark = false, size = "md", className = "" }) => {
  const iconSizes = {
    sm: "h-6 w-8",
    md: "h-7 w-10",
    lg: "h-9 w-12",
  };
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <InfinityIcon
        className={iconSizes[size] || iconSizes.md}
        isDark={isDark}
      />
      <span
        className={`font-black tracking-tight ${textSizes[size] || textSizes.md} ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Infinity
        <span className={isDark ? "text-indigo-400" : "text-indigo-600"}>
          AI
        </span>
      </span>
    </div>
  );
};

export default InfinityLogo;
