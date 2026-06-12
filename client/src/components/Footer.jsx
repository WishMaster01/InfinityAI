import React from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div className="md:max-w-96">
          <img
            className="h-10 md:h-14"
            src={assets.logo1}
            alt="dummyLogoDark"
          />
          <p className="mt-6 text-sm text-gray-500 max-w-lg mx-auto">
            <span className="text-primary">"AI for Everything"</span> is your
            ultimate intelligent assistant, transforming how you work and
            create. Our AI SaaS app offers a powerful suite of tools for
            multiple uses, from generating engaging content and insightful
            articles to streamlining your daily tasks. We empower individuals
            and businesses with cutting-edge AI, making complex processes simple
            and boosting productivity on one intuitive platform.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="text-slate-700 text-[24px] font-semibold mb-5">
              Company
            </h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/about"}>About us</Link>
              </li>
              <li>
                <Link to={"/contact"}>Contact us</Link>
              </li>
              <li>
                <Link to={"/privacy"}>Privacy policy</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-slate-700 text-[24px] font-semibold mb-5">
              Subscribe to our <span className="text-primary">AI SaaS App</span>
            </h2>
            <div className="text-sm space-y-2">
              <p className="text-gray-500 max-w-lg mx-auto">
                Get the latest news, articles, and resources about new features
                of our AI SaaS App, sent to your inbox weekly.
              </p>
              <div className="flex items-center gap-2 pt-4">
                <input
                  className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2"
                  type="email"
                  placeholder="Enter your email"
                />
                <button className="bg-primary w-24 h-9 text-white rounded cursor-pointer hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 © AI for Everything. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
