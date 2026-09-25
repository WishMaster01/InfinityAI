import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { ArrowUpRight, CreditCard, History, WalletCards } from "lucide-react";
import Card from "../components/ui/Card.jsx";
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
      else throw new Error(response.data.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to load credits.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  if (loading)
    return (
      <div className="page-shell">
        <div className="content-wrap">
          <OutputLoader label="Loading credits and transactions" />
        </div>
      </div>
    );
  const user = data?.user;
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section className="glass-card p-8 sm:p-10">
          <span className="section-kicker">
            <WalletCards className="mr-2 h-4 w-4" />
            Credits
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Manage your AI usage
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Track your balance, plan access, and payment activity from one
            transparent workspace.
          </p>
        </section>
        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 font-semibold text-rose-700"
          >
            {error}
          </p>
        )}
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="p-6">
            <WalletCards className="h-6 w-6 text-indigo-600" />
            <p className="mt-5 text-sm font-bold text-slate-500">
              Available credits
            </p>
            <p className="mt-2 text-4xl font-black text-slate-950">
              {user?.availableCredits ?? 0}
            </p>
          </Card>
          <Card className="p-6">
            <History className="h-6 w-6 text-cyan-600" />
            <p className="mt-5 text-sm font-bold text-slate-500">
              Used credits
            </p>
            <p className="mt-2 text-4xl font-black text-slate-950">
              {user?.usedCredits ?? 0}
            </p>
          </Card>
          <Card className="p-6">
            <CreditCard className="h-6 w-6 text-violet-600" />
            <p className="mt-5 text-sm font-bold text-slate-500">
              Current plan
            </p>
            <p className="mt-2 text-4xl font-black text-slate-950">
              {user?.plan || "BASIC"}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {user?.subscriptionStatus || "FREE"}
            </p>
          </Card>
        </div>
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-black text-slate-950">Transactions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Recent billing activity and payment status.
            </p>
          </div>
          {data?.payments?.length ? (
            <div className="divide-y divide-slate-100">
              {data.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-black text-slate-900">
                      {payment.plan} subscription
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : "Recent"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">
                      {payment.status}
                    </span>
                    <span className="font-bold text-slate-700">
                      {payment.amount
                        ? `${payment.currency || "USD"} ${payment.amount}`
                        : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm font-semibold text-slate-500">
              No transactions yet. Upgrade from Billing when you are ready.
            </div>
          )}
          <a
            href="/ai/billing"
            className="flex items-center gap-2 border-t border-slate-200 p-5 text-sm font-black text-indigo-700 hover:bg-indigo-50"
          >
            Manage subscription <ArrowUpRight className="h-4 w-4" />
          </a>
        </Card>
      </div>
    </div>
  );
};

export default Credits;
