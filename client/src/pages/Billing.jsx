import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { Check, Crown, Sparkles, WalletCards, ShieldCheck, Zap } from "lucide-react";

const Billing = () => {
  const [loadingPlan, setLoadingPlan] = useState("");
  const [summary, setSummary] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { getToken } = useAuth();

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };
  }, [getToken]);

  const fetchSummary = useCallback(async () => {
    try {
      const config = await authHeaders();
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/billing/summary`,
        config,
      );
      if (data.success) setSummary(data);
    } catch {
      setSummary(null);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const startCheckout = async (plan) => {
    setLoadingPlan(plan);
    try {
      const config = await authHeaders();
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/billing/checkout`,
        { plan },
        config,
      );

      if (!data.success) {
        toast.error(data.message || "Unable to start checkout.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      toast.success("Plan updated!");
      fetchSummary();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Checkout failed.");
    } finally {
      setLoadingPlan("");
    }
  };

  const cancelSubscription = async () => {
    setCanceling(true);
    try {
      const config = await authHeaders();
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/billing/cancel`,
        {},
        config,
      );

      if (data.success) {
        toast.success("Subscription canceled.");
        fetchSummary();
      } else {
        toast.error(data.message || "Unable to cancel subscription.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cancel failed.");
    } finally {
      setCanceling(false);
    }
  };

  const currentPlan = summary?.user?.plan || "PRO";

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Header matching image */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Choose the plan that fits your needs. Upgrade or cancel anytime.
            </p>
          </div>

          {/* Monthly / Yearly Switcher */}
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-xs w-fit">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yearly <span className="text-emerald-400 font-extrabold ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards matching image */}
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Free Plan */}
          <div className="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Free
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">$0</span>
              <span className="text-sm font-semibold text-slate-500">/ month</span>
            </div>
            <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>10 credits per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Access to 10+ basic tools</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Community access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Basic support</span>
              </li>
            </ul>
            <button
              disabled={currentPlan === "BASIC"}
              onClick={() => startCheckout("BASIC")}
              className="mt-8 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {currentPlan === "BASIC" ? "Current Plan" : "Downgrade"}
            </button>
          </div>

          {/* Pro Plan - Featured / Most Popular */}
          <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-7 shadow-lg shadow-indigo-100 scale-105 z-10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-black text-white shadow-xs">
              ⭐ Most Popular
            </span>
            <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
              Pro
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">
                {billingCycle === "monthly" ? "$12" : "$10"}
              </span>
              <span className="text-sm font-semibold text-slate-500">/ month</span>
            </div>
            <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
              <li className="flex items-center gap-2 font-medium text-slate-900">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>1,000 credits per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Access to all 54+ tools</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Advanced features & export</span>
              </li>
            </ul>
            <button
              onClick={() => startCheckout("PRO")}
              disabled={loadingPlan === "PRO"}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
            >
              {loadingPlan === "PRO" ? "Processing..." : currentPlan === "PRO" ? "Current Plan" : "Upgrade to Pro"}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Enterprise
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">
                {billingCycle === "monthly" ? "$29" : "$24"}
              </span>
              <span className="text-sm font-semibold text-slate-500">/ month</span>
            </div>
            <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>3,000 credits per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>All Pro features included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Team collaboration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Dedicated 24/7 support</span>
              </li>
            </ul>
            <button
              onClick={() => startCheckout("ENTERPRISE")}
              className="mt-8 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Bottom Reassurance */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-indigo-600" /> No hidden fees
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-indigo-600" /> Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-600" /> Secure payments
          </span>
        </div>
      </div>
    </div>
  );
};

export default Billing;
