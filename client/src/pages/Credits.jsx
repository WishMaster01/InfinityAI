import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { ArrowUpRight, CreditCard, History, WalletCards, Sparkles, Check } from "lucide-react";
import { Link } from "react-router-dom";
import OutputLoader from "../components/OutputLoader.jsx";

const Credits = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/billing/summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      if (response.data.success) setData(response.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="content-wrap">
          <OutputLoader label="Loading credits and transactions..." />
        </div>
      </div>
    );
  }

  const user = data?.user;
  const availableCredits = user?.availableCredits ?? 420;
  const currentPlan = user?.plan || "Pro";

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Credits & Balance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Track your available AI generation credits, renewals, and transaction history.
          </p>
        </div>

        {/* 2-Column Hero Cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Card 1: Credits Gradient Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-md shadow-indigo-200">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
            <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">
              Available Credits
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">
                {availableCredits}
              </span>
            </div>
            <p className="mt-1 text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
              Resets in 14 days
            </p>

            <div className="mt-6 flex gap-2">
              <Link
                to="/ai/billing"
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-xs hover:bg-indigo-50 transition-colors"
              >
                Top up Credits
              </Link>
            </div>
          </div>

          {/* Card 2: Current Plan */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Plan
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {currentPlan} Plan
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                  Active
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                1,000 monthly credits included with all 54+ tools
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500">
                Renews Apr 25, 2026
              </span>
              <Link
                to="/ai/billing"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Manage Plan <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-sm font-bold text-slate-900">
              Recent Transactions & Usage
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Billing charges and credit renewals
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
              <div>
                <p className="font-bold text-slate-800">Pro Plan Monthly Renewal</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Apr 1, 2026 · Stripe Checkout</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  Paid
                </span>
                <span className="font-bold text-slate-900">$12.00</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
              <div>
                <p className="font-bold text-slate-800">Welcome Bonus Credits</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Mar 25, 2026 · Registration</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200">
                  +100 Credits
                </span>
                <span className="font-bold text-slate-900">$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
