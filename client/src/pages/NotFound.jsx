import React from "react";
import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="page-shell flex min-h-screen items-center justify-center p-6">
    <div className="glass-card max-w-lg p-10 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-700">
        <Compass className="h-8 w-8" />
      </span>
      <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-indigo-600">
        404
      </p>
      <h1 className="mt-3 text-4xl font-black text-slate-950">
        Page not found
      </h1>
      <p className="mt-4 leading-7 text-slate-600">
        The page may have moved, or the link may be incomplete.
      </p>
      <Link to="/" className="gradient-button mt-7 inline-flex">
        <ArrowLeft className="h-4 w-4" /> Return home
      </Link>
    </div>
  </main>
);

export default NotFound;
