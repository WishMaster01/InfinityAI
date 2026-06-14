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
            <span className="font-semibold text-indigo-700">
              InfinityAI
            </span>{" "}
            is The Ultimate All-in-One AI Platform for Content Creation, Image
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
            </ul>
          </div>

          <div className="max-w-md">
            <h2 className="mb-5 text-2xl font-black leading-tight text-slate-950">
              Subscribe to our{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                InfinityAI updates
              </span>
            </h2>
            <div className="space-y-2 text-base">
              <p className="max-w-lg leading-7 text-slate-600">
                Get the latest product updates, AI workflow guides, and new
                feature releases sent to your inbox weekly.
              </p>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <input
                  className="field-input mt-0 sm:max-w-64"
                  type="email"
                  placeholder="Enter your email"
                />
                <button className="inline-flex h-14 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 text-base font-bold text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5">
                  Subscribe
                </button>
              </div>
            </div>
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
