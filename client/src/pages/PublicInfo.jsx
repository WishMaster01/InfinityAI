import React from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { planCards } from "../data/toolCatalog.js";

const content = {
  features: {
    title: "Everything you need to create with AI",
    intro:
      "One focused workspace for writing, images, documents, career growth, productivity, and development.",
    items: [
      "54+ practical AI workflows",
      "Document chat with grounded sources",
      "History, credits, and reusable creations",
      "Secure plans with transparent usage",
    ],
  },
  solutions: {
    title: "AI workflows for real outcomes",
    intro:
      "From first draft to final deliverable, InfinityAI helps creators, professionals, students, and teams move faster.",
    items: [
      "Create content and campaigns",
      "Analyze resumes and career goals",
      "Understand documents and research",
      "Build, explain, and review code",
    ],
  },
  blog: {
    title: "Ideas for building better with AI",
    intro:
      "Practical guidance, workflow ideas, and product notes from the InfinityAI team.",
    items: [
      "Prompting patterns that save time",
      "Responsible AI for everyday work",
      "Turning documents into decisions",
      "Better creative workflows",
    ],
  },
};

const PublicInfo = () => {
  const { section } = useParams();
  const page = content[section] || content.features;
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-10">
        <section className="glass-card p-8 sm:p-12">
          <span className="section-kicker">
            <Sparkles className="mr-2 h-4 w-4" />
            InfinityAI {section}
          </span>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {page.intro}
          </p>
          <Link to="/ai" className="gradient-button mt-8 inline-flex">
            Explore the workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
        <div className="grid gap-5 md:grid-cols-2">
          {page.items.map((item) => (
            <article
              key={item}
              className="premium-card flex items-start gap-4 p-7"
            >
              <span className="icon-badge bg-gradient-to-br from-indigo-600 to-cyan-500">
                <Check className="h-5 w-5" />
              </span>
              <h2 className="pt-2 text-lg font-black text-slate-950">{item}</h2>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Pricing = () => (
  <div className="page-shell">
    <div className="content-wrap space-y-10">
      <section className="glass-card p-8 text-center sm:p-12">
        <span className="section-kicker">Pricing</span>
        <h1 className="mt-5 text-4xl font-black text-slate-950 sm:text-6xl">
          Simple plans for every stage
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Start free, then scale when your workflows grow.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        {planCards.map((plan) => (
          <article key={plan.plan} className="premium-card flex flex-col p-8">
            <h2 className="text-2xl font-black text-slate-950">{plan.name}</h2>
            <p className="mt-3 text-3xl font-black text-indigo-700">
              {plan.price}
            </p>
            <p className="mt-3 text-slate-600">{plan.description}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link to="/sign-up" className="gradient-button mt-8">
              Get started
            </Link>
          </article>
        ))}
      </div>
    </div>
  </div>
);

export default PublicInfo;
