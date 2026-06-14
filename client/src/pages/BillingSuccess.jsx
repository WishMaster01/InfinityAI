import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillingSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <div className="content-wrap flex min-h-full items-center justify-center">
        <div className="glass-card max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Payment successful
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your subscription is being activated. Stripe webhooks will update
            your plan and credits in the database.
          </p>
          <button onClick={() => navigate("/ai/billing")} className="gradient-button mt-6">
            Back to Billing
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingSuccess;
