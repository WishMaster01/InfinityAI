import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WriteArticle from "./pages/WriteArticle.jsx";
import BlogTitles from "./pages/BlogTitles.jsx";
import GenerateImages from "./pages/GenerateImages.jsx";
import RemoveBackground from "./pages/RemoveBackground.jsx";
import RemoveObject from "./pages/RemoveObject.jsx";
import ReviewResume from "./pages/ReviewResume.jsx";
import Community from "./pages/Community.jsx";

import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        {/* Route for the Home page */}
        <Route path="/" element={<Home />} />

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
        </Route>
      </Routes>
    </div>
  );
};

export default App;
