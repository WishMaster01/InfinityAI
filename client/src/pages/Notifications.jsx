import React, { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  CreditCard,
  Sparkles,
  X,
} from "lucide-react";

const notices = [
  {
    id: "workspace",
    title: "Your workspace is ready",
    text: "Explore the AI Workspace to discover your next workflow.",
    icon: Sparkles,
    preference: "productUpdates",
  },
  {
    id: "credits",
    title: "Keep an eye on credits",
    text: "Review usage and upgrade any time from Credits.",
    icon: CreditCard,
    preference: "usageAlerts",
  },
  {
    id: "security",
    title: "Account secure",
    text: "Your authenticated workspace is protected and ready to use.",
    icon: CheckCircle2,
    preference: "productUpdates",
  },
];
const readKey = "infinityai-read-notifications";

const Notifications = () => {
  const [read, setRead] = useState(() =>
    JSON.parse(localStorage.getItem(readKey) || "[]"),
  );
  const [settings] = useState(() => {
    try {
      return {
        productUpdates: true,
        usageAlerts: true,
        marketing: false,
        ...JSON.parse(localStorage.getItem("infinityai-settings") || "{}"),
      };
    } catch {
      return { productUpdates: true, usageAlerts: true, marketing: false };
    }
  });
  const visible = useMemo(
    () => notices.filter((notice) => settings[notice.preference] !== false),
    [settings],
  );
  const markRead = (id) => {
    const next = [...new Set([...read, id])];
    setRead(next);
    localStorage.setItem(readKey, JSON.stringify(next));
  };
  const markAllRead = () => {
    const ids = visible.map((notice) => notice.id);
    setRead((current) => {
      const next = [...new Set([...current, ...ids])];
      localStorage.setItem(readKey, JSON.stringify(next));
      return next;
    });
  };
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section className="glass-card p-8 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="section-kicker">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </span>
              <h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">
                Updates for your workspace
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Important product, usage, and account updates in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="secondary-button"
            >
              {" "}
              <Check className="h-4 w-4" /> Mark all read
            </button>
          </div>
        </section>
        <div className="space-y-3">
          {visible.length ? (
            visible.map(({ id, title, text, icon, preference }) => (
              <article
                key={id}
                className={`premium-card flex items-start gap-4 p-6 ${read.includes(id) ? "opacity-60" : ""}`}
              >
                {React.createElement(icon, {
                  className: "mt-1 h-5 w-5 shrink-0 text-indigo-600",
                })}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-slate-950">{title}</h2>
                    {!read.includes(id) && (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-black uppercase text-indigo-700">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {text}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {preference === "usageAlerts" ? "Usage" : "Product"}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Dismiss ${title}`}
                  onClick={() => markRead(id)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <Check className="h-8 w-8 text-emerald-500" />
              <p className="font-semibold">You’re all caught up.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
