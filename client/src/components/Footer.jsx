import React from "react";
import { ArrowUp, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import InfinityLogo from "./InfinityLogo.jsx";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white px-6 pt-16 pb-12 text-slate-600 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-slate-100">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/">
              <InfinityLogo size="md" />
            </Link>
            <p className="mt-4 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Your All-in-One AI Creation Platform. Create, build, analyze, and achieve more with 54+ powerful AI tools.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>Crafted for creators & builders</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Product
            </h3>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600">
              <li>
                <Link to="/ai" className="hover:text-indigo-600 transition-colors">
                  All 54+ AI Tools
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-indigo-600 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/ai/community" className="hover:text-indigo-600 transition-colors">
                  Community Gallery
                </Link>
              </li>
              <li>
                <Link to="/ai/documents" className="hover:text-indigo-600 transition-colors">
                  Document Chat
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600">
              <li>
                <Link to="/blog" className="hover:text-indigo-600 transition-colors">
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-indigo-600 transition-colors">
                  Feature Highlights
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-indigo-600 transition-colors">
                  Solutions by Role
                </Link>
              </li>
              <li>
                <Link to="/ai/help" className="hover:text-indigo-600 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Legal & Support
            </h3>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600">
              <li>
                <Link to="/about" className="hover:text-indigo-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/ai-disclaimer" className="hover:text-indigo-600 transition-colors">
                  AI Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} InfinityAI Platform. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
