import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WriteArticle from "./pages/WriteArticle.jsx";
import BlogTitles from "./pages/BlogTitles.jsx";
import GenerateImages from "./pages/GenerateImages.jsx";
import RemoveBackground from "./pages/RemoveBackground.jsx";
import RemoveObject from "./pages/RemoveObject.jsx";
import ReviewResume from "./pages/ReviewResume.jsx";
import Community from "./pages/Community.jsx";
import History from "./pages/History.jsx";
import Billing from "./pages/Billing.jsx";
import BillingSuccess from "./pages/BillingSuccess.jsx";
import BillingCancel from "./pages/BillingCancel.jsx";
import UserSync from "./components/UserSync.jsx";

const App = () => {
  return (
    <div>
      <Toaster />
      <UserSync />
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
          <Route path="community" element={<Community />} />
          <Route path="history" element={<History />} />
          <Route path="billing" element={<Billing />} />
          <Route path="billing/success" element={<BillingSuccess />} />
          <Route path="billing/cancel" element={<BillingCancel />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
