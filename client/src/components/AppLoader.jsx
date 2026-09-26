import React from "react";
import { Sparkles } from "lucide-react";

const AppLoader = ({ label = "Loading your InfinityAI workspace..." }) => (
  <div
    role="status"
    aria-live="polite"
    className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eef2ff_48%,#ecfeff_100%)] p-6"
  >
    <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/25 blur-3xl" />
    <div className="relative flex w-full max-w-sm flex-col items-center text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-2xl shadow-indigo-300/60">
        <span className="absolute inset-0 animate-ping rounded-[2rem] bg-indigo-400/30" />
        <Sparkles className="relative h-10 w-10 animate-pulse" />
      </div>
      <p className="mt-8 text-2xl font-black tracking-tight text-slate-950">
        Infinity<span className="text-indigo-600">AI</span>
      </p>
      <p className="mt-3 text-sm font-semibold text-slate-500">{label}</p>
      <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-white/80 shadow-inner">
        <div className="h-full w-2/5 animate-[loader-progress_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-400" />
      </div>
      <div className="mt-5 flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:-.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" />
      </div>
    </div>
  </div>
);

export default AppLoader;
