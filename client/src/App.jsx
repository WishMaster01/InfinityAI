import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import UserSync from "./components/UserSync.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const Disclaimer = lazy(() => import("./pages/Disclaimer.jsx"));
const Layout = lazy(() => import("./pages/Layout.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const WriteArticle = lazy(() => import("./pages/WriteArticle.jsx"));
const BlogTitles = lazy(() => import("./pages/BlogTitles.jsx"));
const GenerateImages = lazy(() => import("./pages/GenerateImages.jsx"));
const RemoveBackground = lazy(() => import("./pages/RemoveBackground.jsx"));
const RemoveObject = lazy(() => import("./pages/RemoveObject.jsx"));
const ReviewResume = lazy(() => import("./pages/ReviewResume.jsx"));
const Community = lazy(() => import("./pages/Community.jsx"));
const History = lazy(() => import("./pages/History.jsx"));
const Billing = lazy(() => import("./pages/Billing.jsx"));
const BillingSuccess = lazy(() => import("./pages/BillingSuccess.jsx"));
const BillingCancel = lazy(() => import("./pages/BillingCancel.jsx"));
const ToolWorkspace = lazy(() => import("./pages/ToolWorkspace.jsx"));

class AppErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <main className="page-shell flex min-h-screen items-center justify-center">
          <div className="empty-state max-w-xl">
            <h1 className="text-2xl font-black text-slate-950">
              Something went wrong
            </h1>
            <p>InfinityAI could not load this page.</p>
            <button
              className="gradient-button max-w-xs"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </main>
      );
    return this.props.children;
  }
}

const App = () => {
  return (
    <div>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-indigo-700"
        href="#main-content"
      >
        Skip to content
      </a>
      <Toaster />
      <UserSync />
      <AppErrorBoundary>
        <Suspense
          fallback={
            <div
              role="status"
              aria-live="polite"
              className="page-shell flex min-h-screen items-center justify-center font-bold text-indigo-700"
            >
              Loading InfinityAI...
            </div>
          }
        >
          <main id="main-content">
            <Routes>
              {/* Route for the Home page */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/ai-disclaimer" element={<Disclaimer />} />

              {/* This is the parent route for AI-related pages, using Layout */}
              <Route path="/ai" element={<Layout />}>
                {/* Dashboard will be the default child route under /ai */}
                <Route index element={<Dashboard />} />

                {/* These will be /ai/write-article and /ai/blog-titles */}
                <Route path="write-article" element={<WriteArticle />} />
                <Route path="blog-titles" element={<BlogTitles />} />
                <Route path="generate-images" element={<GenerateImages />} />
                <Route
                  path="remove-background"
                  element={<RemoveBackground />}
                />
                <Route path="remove-object" element={<RemoveObject />} />
                <Route path="review-resume" element={<ReviewResume />} />
                <Route path="tools/:toolSlug" element={<ToolWorkspace />} />
                <Route path="community" element={<Community />} />
                <Route path="history" element={<History />} />
                <Route path="billing" element={<Billing />} />
                <Route path="billing/success" element={<BillingSuccess />} />
                <Route path="billing/cancel" element={<BillingCancel />} />
              </Route>
            </Routes>
          </main>
        </Suspense>
      </AppErrorBoundary>
    </div>
  );
};

export default App;
