import React from "react";
import { Crown, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpgradeModal = ({ tool, onClose }) => {
  const navigate = useNavigate();

  if (!tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="icon-badge bg-gradient-to-br from-amber-400 to-rose-500">
            <Crown className="h-5 w-5" />
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-950">
          Upgrade required
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {tool.name} requires the {tool.minPlan.toLowerCase()} plan. Upgrade
          to unlock this tool and increase your monthly AI credits.
        </p>

        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-700">
            <Zap className="h-4 w-4" />
            {tool.credits} credits per use
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/ai/billing")}
            className="gradient-button"
          >
            View Plans
          </button>
          <button onClick={onClose} className="secondary-button w-full">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
