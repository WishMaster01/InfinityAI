import React from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/80 px-4 py-4 shadow-lg shadow-blue-100/50 backdrop-blur-2xl sm:px-8 lg:px-20 xl:px-32">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <img
          src={assets.infinityLogo}
          alt="InfinityAI"
          className="h-14 w-auto cursor-pointer object-contain drop-shadow-sm sm:h-16"
          onClick={() => navigate("/")}
        />

        {!user && (
          <nav
            className="hidden items-center gap-6 text-sm font-bold text-slate-600 lg:flex"
            aria-label="Public navigation"
          >
            <Link to="/features" className="hover:text-indigo-700">
              Features
            </Link>
            <Link to="/solutions" className="hover:text-indigo-700">
              Solutions
            </Link>
            <Link to="/pricing" className="hover:text-indigo-700">
              Pricing
            </Link>
            <Link to="/blog" className="hover:text-indigo-700">
              Blog
            </Link>
          </nav>
        )}

        {user ? (
          <UserButton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
        ) : (
          <button
            onClick={openSignIn}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:px-8"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
