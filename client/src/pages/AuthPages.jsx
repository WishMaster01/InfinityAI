import React, { useState } from "react";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Navigate, Link, useNavigate } from "react-router-dom";

const AuthFrame = ({ children, title }) => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--ia-background)] p-4">
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <Link to="/" className="text-2xl font-black text-indigo-700">
          ∞ InfinityAI
        </Link>
        <h1 className="mt-5 text-3xl font-black text-slate-950">{title}</h1>
      </div>
      <div className="rounded-3xl bg-white p-3 shadow-xl">{children}</div>
    </div>
  </div>
);

export const Login = () => (
  <AuthFrame title="Welcome back">
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      forceRedirectUrl="/ai"
    />
  </AuthFrame>
);

export const Signup = () => (
  <AuthFrame title="Create your account">
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      forceRedirectUrl="/onboarding"
    />
  </AuthFrame>
);

export const ForgotPassword = () => (
  <AuthFrame title="Reset your password">
    <SignIn routing="path" path="/forgot-password" />
  </AuthFrame>
);

export const Verification = () => (
  <AuthFrame title="Verify your account">
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
      navigate("/ai");
    } finally {
      setSaving(false);
    }
  };
  return (
    <AuthFrame title="Set up your workspace">
      <form onSubmit={submit} className="space-y-5 p-5">
        <p className="text-sm leading-6 text-slate-600">
          Tell us what you want to accomplish so your workspace starts in the
          right place.
        </p>
        <label className="field-label" htmlFor="onboarding-role">
          I am a
        </label>
        <select
          id="onboarding-role"
          className="field-input mt-0"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="creator">Creator</option>
          <option value="professional">Professional</option>
          <option value="student">Student</option>
          <option value="developer">Developer</option>
          <option value="team">Team member</option>
        </select>
        <label className="field-label" htmlFor="onboarding-goal">
          My main goal is
        </label>
        <select
          id="onboarding-goal"
          className="field-input mt-0"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
        >
          <option value="content">Create content</option>
          <option value="documents">Understand documents</option>
          <option value="career">Grow my career</option>
          <option value="productivity">Work smarter</option>
          <option value="code">Build with code</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="gradient-button w-full"
        >
          {saving ? "Saving..." : "Continue to InfinityAI"}
        </button>
      </form>
    </AuthFrame>
  );
};
