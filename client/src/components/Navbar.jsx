import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import InfinityLogo from "./InfinityLogo.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 px-4 py-3.5 backdrop-blur-xl sm:px-8 lg:px-16 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <InfinityLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex"
          aria-label="Main Navigation"
        >
          <Link
            to="/ai"
            className="transition-colors hover:text-indigo-600"
          >
            Tools
          </Link>
          <Link
            to="/pricing"
            className="transition-colors hover:text-indigo-600"
          >
            Pricing
          </Link>
          <Link
            to="/ai/community"
            className="transition-colors hover:text-indigo-600"
          >
            Community
          </Link>
          <Link
            to="/blog"
            className="transition-colors hover:text-indigo-600"
          >
            Blog
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" /> Dashboard
              </button>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate("/sign-in")}
                className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/sign-up")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-5 shadow-xl backdrop-blur-2xl md:hidden animate-fade-in-up">
          <nav className="flex flex-col gap-3 font-semibold text-slate-700">
            <Link
              to="/ai"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Tools
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Pricing
            </Link>
            <Link
              to="/ai/community"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Community
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Blog
            </Link>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full text-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/sign-in");
                    }}
                    className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/sign-up");
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
