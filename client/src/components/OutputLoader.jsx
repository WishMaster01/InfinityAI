import React from "react";
import { Sparkles } from "lucide-react";

const OutputLoader = ({
  label = "Generating your AI response",
  helper = "Please keep this tab open while InfinityAI prepares the result.",
}) => {
  return (
    <div className="output-loader">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute inset-0 rounded-3xl bg-white/20 animate-ping" />
        <Sparkles className="relative h-9 w-9 animate-pulse" />
      </div>

      <div className="text-center">
        <p className="text-xl font-black text-slate-950">{label}</p>
        <p className="mt-2 text-base leading-7 text-slate-500">
          {helper}
        </p>
      </div>

      <div className="w-full max-w-xl space-y-3">
        <div className="h-4 animate-pulse rounded-full bg-gradient-to-r from-indigo-100 via-cyan-100 to-violet-100" />
        <div className="h-4 w-11/12 animate-pulse rounded-full bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-gradient-to-r from-violet-100 via-indigo-100 to-cyan-100" />
      </div>
    </div>
  );
};

export default OutputLoader;
