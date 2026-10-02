import React, { useState } from "react";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, ShieldCheck, Headphones, Check, Layers, Zap } from "lucide-react";
import InfinityLogo from "../components/InfinityLogo.jsx";

const AuthFrame = ({ children, isSignUp = false }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* 2-Column Split Container matching the uploaded image */}
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] shadow-2xl shadow-indigo-950/40 grid lg:grid-cols-2">
        {/* Left Column: Glowing Indigo/Purple Mesh Silk Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-8 sm:p-12 text-white flex flex-col justify-between">
          {/* Ambient luminous waves */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

          {/* Top: Logo & Title */}
          <div className="relative z-10">
            <Link to="/" className="inline-block">
              <InfinityLogo size="lg" isDark={true} />
            </Link>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-400">
              Create. Build. Achieve.
            </p>
          </div>

          {/* Middle: Social proof message */}
          <div className="relative z-10 my-8 sm:my-12">
            <h2 className="text-xl sm:text-2xl font-black leading-snug text-white">
              Join 100,000+ creators and professionals already using InfinityAI to supercharge their productivity.
            </h2>

            {/* Bullets matching image */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Zap className="h-4 w-4" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  54+ AI Tools Unlocked
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Secure & Private
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Headphones className="h-4 w-4" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  24/7 Priority Support
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} InfinityAI Platform. All rights reserved.
          </div>
        </div>

        {/* Right Column: Clean White Card with Auth Switcher & Form */}
        <div className="bg-white p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {isSignUp
                ? "Sign up to start creating with 54+ AI tools"
                : "Sign in to your account to continue"}
            </p>
          </div>

          {/* Tab Switcher: Sign In | Create Account */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className={`flex-1 rounded-lg py-2 transition-all ${
                !isSignUp
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/sign-up")}
              className={`flex-1 rounded-lg py-2 transition-all ${
                isSignUp
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Clerk Component Embedding */}
          <div className="clerk-auth-container flex justify-center">
            {children}
          </div>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {!isSignUp ? (
              <p>
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Create one
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Login = () => (
  <AuthFrame isSignUp={false}>
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      forceRedirectUrl="/dashboard"
    />
  </AuthFrame>
);

export const Signup = () => (
  <AuthFrame isSignUp={true}>
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      forceRedirectUrl="/onboarding"
    />
  </AuthFrame>
);

export const ForgotPassword = () => (
  <AuthFrame isSignUp={false}>
    <SignIn routing="path" path="/forgot-password" />
  </AuthFrame>
);

export const Verification = () => (
  <AuthFrame isSignUp={true}>
    <SignUp routing="path" path="/verify" />
  </AuthFrame>
);

export const Onboarding = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState("creator");
  const [goal, setGoal] = useState("content");
  const [saving, setSaving] = useState(false);

  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await user.update({
        unsafeMetadata: { onboardingComplete: true, role, goal },
      });
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-white p-8 shadow-2xl">
        <div className="text-center">
          <InfinityLogo size="md" />
          <h1 className="mt-4 text-xl font-black text-slate-900">
            Set up your workspace
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Personalize your InfinityAI recommendations
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-800">
              I am a
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="creator">Creator & Writer</option>
              <option value="professional">Professional / Marketer</option>
              <option value="student">Student / Researcher</option>
              <option value="developer">Software Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800">
              My main goal is
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="content">Generate high-converting content</option>
              <option value="documents">Analyze and chat with documents</option>
              <option value="career">Enhance my resume & career score</option>
              <option value="code">Build and debug code faster</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
          >
            {saving ? "Saving..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};
