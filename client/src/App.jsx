import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import UserSync from "./components/UserSync.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
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

const App = () => {
  return (
    <div>
      <Toaster />
      <UserSync />
      <Suspense fallback={<div className="page-shell flex min-h-screen items-center justify-center font-bold text-indigo-700">Loading InfinityAI...</div>}>
      <Routes>
        {/* Route for the Home page */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* This is the parent route for AI-related pages, using Layout */}
        <Route path="/ai" element={<Layout />}>
          {/* Dashboard will be the default child route under /ai */}
          <Route index element={<Dashboard />} />

          {/* These will be /ai/write-article and /ai/blog-titles */}
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
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
      </Suspense>
    </div>
  );
};

export default App;
