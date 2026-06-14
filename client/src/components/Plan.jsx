import React from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { planCards } from "../data/toolCatalog.js";

const Plan = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const handlePlanClick = () => {
    if (user) {
      navigate("/ai/billing");
      return;
    }

    openSignIn();
  };

  return (
    <section className="relative overflow-hidden px-4 py-28 sm:px-8 lg:px-20 xl:px-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_38%,#f0fdfa_70%,#faf5ff_100%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="section-kicker">Pricing</span>
          <h2 className="section-title">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          <p className="section-copy">
            Start with basic credits, then scale into premium AI workflows when
            your team needs more capacity.
          </p>
        </div>

        <div className="mt-16 grid gap-7 lg:grid-cols-3">
          {planCards.map((card) => (
            <article
              key={card.plan}
              className={`premium-card relative flex min-h-[34rem] flex-col p-8 sm:p-9 ${
                card.highlighted ? "ring-2 ring-indigo-300" : ""
              }`}
            >
              {card.highlighted && (
                <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-indigo-200">
                  Popular
                </span>
              )}

              <div className="icon-badge h-14 w-14 bg-gradient-to-br from-indigo-600 to-cyan-500">
                {card.plan === "PRO" ? (
                  <Crown className="h-6 w-6" />
                ) : (
                  <Sparkles className="h-6 w-6" />
                )}
              </div>

              <h3 className="mt-7 text-3xl font-black text-slate-950">
                {card.name}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {card.description}
              </p>
              <p className="mt-7 text-5xl font-black tracking-tight text-slate-950">
                {card.price}
              </p>
              <p className="mt-2 text-base font-bold text-indigo-700">
                {card.credits}
              </p>

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

              <button onClick={handlePlanClick} className="gradient-button mt-8">
                {card.plan === "BASIC" ? "Get Started" : "Upgrade"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plan;
