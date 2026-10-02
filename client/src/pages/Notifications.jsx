import React, { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  CreditCard,
  Sparkles,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const initialNotices = [
  {
    id: "workspace",
    title: "Welcome to your new InfinityAI workspace",
    text: "Explore 54+ intelligent AI workflows for content generation, image creation, resume analysis, and coding.",
    icon: Sparkles,
    time: "10 mins ago",
    tag: "Welcome",
  },
  {
    id: "credits",
    title: "Credits reset reminder",
    text: "Your monthly credits will automatically refresh in 14 days.",
    icon: CreditCard,
    time: "2 hours ago",
    tag: "Usage",
  },
  {
    id: "security",
    title: "Security verified",
    text: "Your authenticated session is active and encrypted with Clerk.",
    icon: CheckCircle2,
    time: "Yesterday",
    tag: "Security",
  },
];

const Notifications = () => {
  const [notices, setNotices] = useState(initialNotices);

  const dismissNotice = (id) => {
    setNotices((curr) => curr.filter((n) => n.id !== id));
    toast.success("Notification dismissed");
  };

  const markAllRead = () => {
    setNotices([]);
    toast.success("All notifications cleared");
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Important updates, balance alerts, and security notifications.
            </p>
          </div>

          {notices.length > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors w-fit"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notices.length > 0 ? (
            notices.map((notice) => {
              const Icon = notice.icon;
              return (
                <div
                  key={notice.id}
                  className="flex items-start justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:border-indigo-200 transition-all gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                          {notice.title}
                        </h2>
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-100">
                          {notice.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {notice.text}
                      </p>
                      <p className="mt-2 text-[10px] font-semibold text-slate-400">
                        {notice.time}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => dismissNotice(notice.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
              <Check className="mx-auto h-8 w-8 text-emerald-500" />
              <p className="mt-2 text-xs font-bold text-slate-700">
                You're all caught up!
              </p>
              <p className="mt-1 text-xs text-slate-400">
                No new notifications at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
