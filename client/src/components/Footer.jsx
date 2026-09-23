import React from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/70 bg-white/80 px-6 pt-16 text-slate-600 backdrop-blur-xl md:px-16 lg:px-24 xl:px-32">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 border-b border-slate-200 pb-10 md:flex-row">
        <div className="md:max-w-xl">
          <img
            className="h-12 drop-shadow-sm md:h-16"
            src={assets.infinityLogo}
            alt="InfinityAI"
          />
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600">
            <span className="font-semibold text-indigo-700">InfinityAI</span> is
            The Ultimate All-in-One AI Platform for Content Creation, Image
            Generation, Career Growth, Productivity, and Development.
          </p>
        </div>

        <div className="flex flex-1 flex-col items-start gap-10 sm:flex-row md:justify-end lg:gap-20">
          <div>
            <h2 className="mb-5 text-xl font-black text-slate-950">Company</h2>
            <ul className="space-y-3 text-base font-medium">
              <li>
                <Link className="hover:text-indigo-700" to={"/"}>
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" to={"/about"}>
                  About us
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" to={"/contact"}>
                  Contact us
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" to={"/privacy"}>
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" to="/terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="hover:text-indigo-700" to="/ai-disclaimer">
                  AI Usage Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div className="max-w-md">
            <h2 className="mb-5 text-2xl font-black leading-tight text-slate-950">
              Build with practical AI
            </h2>
            <p className="max-w-lg leading-7 text-slate-600">
              Explore the workspace to create content, analyze documents,
              improve career materials, and work with code.
            </p>
            <Link className="secondary-button mt-5" to="/ai">
              Open workspace
            </Link>
          </div>
        </div>
      </div>

      <p className="pb-6 pt-5 text-center text-sm text-slate-500 md:text-base">
        Copyright 2026 (c) InfinityAI. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
