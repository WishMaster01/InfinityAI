import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillingCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <div className="content-wrap flex min-h-full items-center justify-center">
        <div className="glass-card max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Checkout canceled
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            No payment was completed. You can return to billing whenever you are
            ready to upgrade.
          </p>
          <button onClick={() => navigate("/ai/billing")} className="gradient-button mt-6">
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingCancel;
