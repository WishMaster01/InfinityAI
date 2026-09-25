import React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import Card from "../components/ui/Card.jsx";

const Profile = () => {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section className="glass-card p-8 sm:p-10">
          <span className="section-kicker">
            <UserRound className="mr-2 h-4 w-4" />
            Profile
          </span>
          <h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">
            Your InfinityAI profile
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Manage your identity, account information, and security preferences.
          </p>
        </section>
        <Card className="p-7 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || "Profile"}
              className="h-24 w-24 rounded-3xl object-cover shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {user?.fullName || "InfinityAI user"}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4" />
                {user?.primaryEmailAddress?.emailAddress ||
                  "No email available"}
              </p>
            </div>
            <button
              type="button"
              className="gradient-button sm:ml-auto"
              onClick={openUserProfile}
            >
              Edit profile
            </button>
          </div>
        </Card>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-6">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              Account security
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Authentication and password management are securely handled by
              Clerk.
            </p>
            <button
              type="button"
              className="secondary-button mt-5"
              onClick={openUserProfile}
            >
              Manage security
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
