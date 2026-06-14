import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSideBar] = useState(false);

  const { user } = useUser();

  return user ? (
    <div className="flex h-screen flex-col items-start justify-start bg-slate-50">
      <nav className="z-40 flex min-h-20 w-full items-center justify-between border-b border-white/70 bg-white/85 px-4 shadow-lg shadow-blue-100/50 backdrop-blur-2xl sm:px-8">
        <img
          src={assets.infinityLogo}
          alt="InfinityAI"
          onClick={() => navigate("/")}
          className="h-14 w-auto cursor-pointer object-contain drop-shadow-sm sm:h-16"
        />

        {sidebar ? (
          <X
            className="h-6 w-6 cursor-pointer text-slate-700 sm:hidden"
            onClick={() => setSideBar(false)}
          />
        ) : (
          <Menu
            className="h-6 w-6 cursor-pointer text-slate-700 sm:hidden"
            onClick={() => setSideBar(true)}
          />
        )}
      </nav>

      <div className="flex h-[calc(100vh-80px)] w-full flex-1">
        <Sidebar sidebar={sidebar} setSideBar={setSideBar} />

        <main className="min-w-0 flex-1 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(219,234,254,0.9),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(221,214,254,0.8),transparent_28rem),linear-gradient(135deg,#ffffff,#eef8ff)] p-4">
      <div className="glass-card p-3">
        <SignIn />
      </div>
    </div>
  );
};

export default Layout;
