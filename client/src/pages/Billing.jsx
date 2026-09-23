import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { Check, Crown, Sparkles, WalletCards } from "lucide-react";
import { planCards } from "../data/toolCatalog.js";

const Billing = () => {
  const [loadingPlan, setLoadingPlan] = useState("");
  const [summary, setSummary] = useState(null);
  const [canceling, setCanceling] = useState(false);
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

      toast.success("Basic plan selected.");
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
        toast.success("Subscription cancellation scheduled.");
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

  const currentPlan = summary?.user?.plan || "BASIC";
  const paymentStatus =
    summary?.payments?.[0]?.status ||
    summary?.user?.subscriptionStatus ||
    "FREE";

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <div className="glass-card p-7 sm:p-10">
          <span className="section-kicker">Billing</span>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Choose the right AI plan
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600 sm:text-xl">
            Upgrade with Stripe Checkout to unlock premium tools, larger credit
            pools, and advanced AI workflows.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="dashboard-stat">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Current Plan
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                {currentPlan}
              </h2>
            </div>
            <div className="icon-badge bg-gradient-to-br from-amber-400 to-rose-500">
              <Crown className="h-5 w-5" />
            </div>
          </div>

          <div className="dashboard-stat">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Available Credits
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                {summary?.user?.availableCredits ?? "--"}
              </h2>
            </div>
            <div className="icon-badge bg-gradient-to-br from-indigo-500 to-cyan-500">
              <WalletCards className="h-5 w-5" />
            </div>
          </div>

          <div className="dashboard-stat">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Payment Status
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                {paymentStatus}
              </h2>
            </div>
            <button
              disabled={canceling || !summary?.subscription}
              onClick={cancelSubscription}
              className="secondary-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              {canceling ? "Canceling..." : "Cancel"}
            </button>
          </div>
        </div>
        <section className="glass-card p-6" aria-labelledby="billing-details">
          <h2
            id="billing-details"
            className="text-2xl font-black text-slate-950"
          >
            Billing details
          </h2>
          <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
            <p>
              <strong className="text-slate-950">Credits:</strong> 1 credit
              represents one standard AI operation; costs vary by tool.
            </p>
            <p>
              <strong className="text-slate-950">Renewal:</strong> Your
              subscription renews at the end of the current Stripe billing
              period.
            </p>
            <p>
              <strong className="text-slate-950">Cancellation:</strong>{" "}
              Cancellation stops renewal while access remains active until the
              period ends.
            </p>
          </div>
          {summary?.subscription?.currentPeriodEnd && (
            <p className="mt-4 font-semibold text-indigo-700">
              Current period ends{" "}
              {new Date(
                summary.subscription.currentPeriodEnd,
              ).toLocaleDateString()}
              .
            </p>
          )}
        </section>

        <div className="grid gap-7 lg:grid-cols-3">
          {planCards.map((card) => (
            <article
              key={card.plan}
              className={`premium-card relative flex min-h-[34rem] flex-col p-8 ${
                card.highlighted ? "ring-2 ring-indigo-300" : ""
              }`}
            >
              {card.highlighted && (
                <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-3 py-1 text-xs font-bold text-white">
                  Popular
                </span>
              )}

              <div className="icon-badge bg-gradient-to-br from-indigo-600 to-cyan-500">
                {card.plan === "PRO" ? (
                  <Crown className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </div>

              <h2 className="mt-6 text-3xl font-black text-slate-950">
                {card.name}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {card.description}
              </p>
              <div className="mt-5">
                <p className="text-3xl font-black text-slate-950">
                  {card.price}
                </p>
                <p className="mt-2 text-base font-bold text-indigo-700">
                  {card.credits}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                {card.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-base leading-7 text-slate-600"
                  >
                    <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => startCheckout(card.plan)}
                disabled={loadingPlan === card.plan}
                className="gradient-button mt-8"
              >
                {loadingPlan === card.plan ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : null}
                {card.plan === "BASIC" ? "Use Basic" : "Upgrade"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Billing;
