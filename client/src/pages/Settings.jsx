import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Bell, Check, Settings as SettingsIcon, Zap, Shield, Eye, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const defaults = {
  productUpdates: true,
  usageAlerts: true,
  marketing: false,
  autoSaveHistory: true,
};

const Settings = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    setSettings({ ...defaults, ...(user?.unsafeMetadata?.settings || {}) });
  }, [user]);

  const update = (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    localStorage.setItem("infinityai-settings", JSON.stringify(next));
    user
      ?.update({ unsafeMetadata: { ...user.unsafeMetadata, settings: next } })
      .catch(() => {});
    toast.success("Preference updated");
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Settings & Preferences
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Control your notifications, security, and AI workspace preferences.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Notification Preferences
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose what notifications you receive from InfinityAI
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Product Updates</p>
                <p className="text-[11px] text-slate-400">
                  Notify me when new AI tools and models are released
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.productUpdates}
                onChange={() => update("productUpdates")}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Usage & Balance Alerts</p>
                <p className="text-[11px] text-slate-400">
                  Send alerts when my monthly credits are below 10%
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.usageAlerts}
                onChange={() => update("usageAlerts")}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Auto-save Creations</p>
                <p className="text-[11px] text-slate-400">
                  Automatically persist generated outputs into My History
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSaveHistory}
                onChange={() => update("autoSaveHistory")}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Profile & Security</p>
              <p className="text-[11px] text-slate-400">
                Update password, two-factor auth, and personal info
              </p>
            </div>
            <Link
              to="/ai/profile"
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Manage Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
