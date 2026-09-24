import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SignIn, useUser } from "@clerk/clerk-react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import MobileNav from "./MobileNav.jsx";

const AppShell = () => {
  const { user, isLoaded } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!isLoaded)
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-[var(--ia-background)] font-semibold text-indigo-700"
      >
        Loading your workspace...
      </div>
    );
  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ia-background)] p-4">
        <div className="rounded-3xl bg-white p-3 shadow-xl">
          <SignIn />
        </div>
      </div>
    );
  return (
    <div className="min-h-screen bg-[var(--ia-background)]">
      <Topbar onMenu={() => setSidebarOpen(true)} />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar sidebar={sidebarOpen} setSideBar={setSidebarOpen} />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default AppShell;
