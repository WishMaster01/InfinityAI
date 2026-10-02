import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Lock,
  Camera,
  Check,
  Sparkles,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const subTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard, path: "/ai/billing" },
];

const Profile = () => {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState(user?.fullName || "Alex Johnson");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || "alex@example.com",
  );
  const [bio, setBio] = useState(
    "AI enthusiast | Builder | Lifelong learner",
  );
  const [saving, setSaving] = useState(false);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile changes saved successfully!");
    }, 500);
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Sub-navigation tabs matching image left column */}
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Settings Left Tab Menu */}
          <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              if (tab.path) {
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{tab.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all whitespace-nowrap text-left ${
                    active
                      ? "bg-indigo-50 text-indigo-700 font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-indigo-600" : "text-slate-400"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Pane: Profile Settings Form matching image */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Profile Settings
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage your account information and preferences.
              </p>
            </div>

            <form onSubmit={handleSaveChanges} className="mt-6 space-y-5">
              {/* Avatar Section matching image */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="relative">
                  <img
                    src={
                      user?.imageUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces"
                    }
                    alt={fullName}
                    className="h-16 w-16 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={openUserProfile}
                    className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 p-1.5 text-white shadow-xs hover:bg-indigo-700 transition-colors"
                    title="Change photo"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={openUserProfile}
                    className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Change photo
                  </button>
                  <p className="mt-1 text-[11px] text-slate-400">
                    JPG, GIF or PNG. Max size 2MB
                  </p>
                </div>
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Save Changes Button matching image */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
