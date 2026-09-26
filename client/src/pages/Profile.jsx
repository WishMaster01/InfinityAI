import React from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import Card from "../components/ui/Card.jsx";

const Profile = () => {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const role = user?.unsafeMetadata?.role || "Creator";
  const goal = user?.unsafeMetadata?.goal || "Create better work";
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-8 text-white shadow-2xl shadow-indigo-200 sm:p-10">
          <Sparkles className="absolute -right-5 -top-7 h-44 w-44 rotate-12 text-white/15" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || "Profile"}
              className="h-24 w-24 rounded-3xl object-cover shadow-xl ring-4 ring-white/30"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                Your workspace profile
              </p>
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                {user?.firstName || user?.fullName || "Creator"}
              </h1>
              <p className="mt-2 text-white/80">
                {role} · focused on {goal}
              </p>
            </div>
            <button
              type="button"
              className="rounded-2xl bg-white px-5 py-3 font-black text-indigo-700 shadow-lg sm:ml-auto"
              onClick={openUserProfile}
            >
              Edit profile
            </button>
          </div>
        </section>
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="p-6">
            <Mail className="h-6 w-6 text-indigo-600" />
            <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
              Email
            </p>
            <p className="mt-2 truncate font-bold text-slate-900">
              {user?.primaryEmailAddress?.emailAddress || "No email available"}
            </p>
          </Card>
          <Card className="p-6">
            <UserRound className="h-6 w-6 text-cyan-600" />
            <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
              Your role
            </p>
            <p className="mt-2 font-bold capitalize text-slate-900">{role}</p>
          </Card>
          <Card className="p-6">
            <WalletCards className="h-6 w-6 text-violet-600" />
            <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
              Workspace goal
            </p>
            <p className="mt-2 font-bold capitalize text-slate-900">{goal}</p>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <Card className="p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="icon-badge bg-gradient-to-br from-emerald-500 to-cyan-500">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Your InfinityAI setup
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  A few ways to make the workspace work harder for you.
                </p>
              </div>
            </div>
            <div className="mt-7 space-y-4">
              <p className="flex gap-3 text-sm leading-6 text-slate-600">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                Your account is secured through Clerk authentication.
              </p>
              <p className="flex gap-3 text-sm leading-6 text-slate-600">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                Your onboarding preferences personalize dashboard
                recommendations.
              </p>
              <p className="flex gap-3 text-sm leading-6 text-slate-600">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                Your creations, documents, credits, and activity stay organized
                in one workspace.
              </p>
            </div>
          </Card>
          <Card className="p-7 sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              Quick actions
            </h2>
            <div className="mt-5 space-y-3">
              <Link
                to="/ai"
                className="secondary-button w-full justify-between"
              >
                Explore AI tools <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/ai/history"
                className="secondary-button w-full justify-between"
              >
                <BookOpen className="h-4 w-4" />
                Open history <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="secondary-button w-full justify-between"
                onClick={openUserProfile}
              >
                <ShieldCheck className="h-4 w-4" />
                Manage security <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
