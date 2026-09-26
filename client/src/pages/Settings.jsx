import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Bell, Check, Settings as SettingsIcon, Zap } from "lucide-react";
import Card from "../components/ui/Card.jsx";

const defaults = {
  productUpdates: true,
  usageAlerts: true,
  marketing: false,
  reducedMotion: false,
};
const options = [
  [
    "productUpdates",
    "Product updates",
    "Learn about new tools and improvements.",
    Bell,
  ],
  [
    "usageAlerts",
    "Usage alerts",
    "Get notified when credits are running low.",
    Zap,
  ],
  [
    "marketing",
    "Occasional product news",
    "Receive optional tips and product news.",
    Bell,
  ],
  [
    "reducedMotion",
    "Reduce motion",
    "Prefer fewer animated transitions.",
    SettingsIcon,
  ],
];

const Settings = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState(defaults);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSettings({ ...defaults, ...(user?.unsafeMetadata?.settings || {}) });
  }, [user]);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      settings.reducedMotion,
    );
    return () => document.documentElement.classList.remove("reduce-motion");
  }, [settings.reducedMotion]);
  const update = (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    localStorage.setItem("infinityai-settings", JSON.stringify(next));
    user
      ?.update({ unsafeMetadata: { ...user.unsafeMetadata, settings: next } })
      .catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section className="glass-card p-8 sm:p-10">
          <span className="section-kicker">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </span>
          <h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">
            Tune your workspace
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Control notifications and interface preferences for InfinityAI.
          </p>
        </section>
        <Card className="divide-y divide-slate-100 p-2">
          {options.map(([key, title, description, icon]) => (
            <button
              type="button"
              key={key}
              onClick={() => update(key)}
              className="flex w-full items-center gap-4 rounded-2xl p-5 text-left hover:bg-slate-50"
            >
              {React.createElement(icon, {
                className: "h-5 w-5 text-indigo-600",
              })}
              <span className="flex-1">
                <span className="block font-black text-slate-900">{title}</span>
                <span className="mt-1 block text-sm text-slate-500">
                  {description}
                </span>
              </span>
              <span
                className={`flex h-7 w-12 items-center rounded-full p-1 transition ${settings[key] ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"}`}
              >
                <span className="h-5 w-5 rounded-full bg-white shadow" />
              </span>
            </button>
          ))}
        </Card>
        {saved && (
          <p className="flex items-center gap-2 font-bold text-emerald-700">
            <Check className="h-4 w-4" />
            Settings saved
          </p>
        )}
      </div>
    </div>
  );
};

export default Settings;
