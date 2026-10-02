import React from "react";
import { InfinityIcon } from "./InfinityLogo.jsx";

const AppLoader = ({ label = "Loading your InfinityAI workspace..." }) => (
  <div
    role="status"
    aria-live="polite"
    className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50/80 p-6"
  >
    <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/20 blur-3xl pointer-events-none" />
    <div className="relative flex w-full max-w-xs flex-col items-center text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-lg shadow-indigo-100/60">
        <InfinityIcon className="h-10 w-12" />
      </div>
      <p className="mt-5 text-xl font-black tracking-tight text-slate-900">
        Infinity<span className="text-indigo-600">AI</span>
      </p>
      <p className="mt-2 text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-2/5 animate-[loader-progress_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-indigo-600 to-violet-600" />
      </div>
    </div>
  </div>
);

export default AppLoader;
