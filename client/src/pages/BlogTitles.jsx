import { Hash, Sparkles, Zap, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import FormattedOutput from "../components/FormattedOutput.jsx";
import OutputLoader from "../components/OutputLoader.jsx";

const blogCategories = [
  "Technology",
  "Productivity",
  "Business & SaaS",
  "Health & Wellness",
  "Finance & Crypto",
  "Education",
  "Travel & Lifestyle",
  "Science & AI",
];

const BlogTitles = () => {
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setContent("");

    try {
      const token = await getToken();
      const prompt = `Generate catchy, SEO-optimized blog titles for the topic: "${input}" in the ${selectedCategory} category.`;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/generate-blog-title`,
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Titles generated successfully!");
      } else {
        toast.error(data.message || "Unable to generate titles.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Generation error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Blog Title Generator
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Find viral, click-worthy, and SEO-friendly headlines for your articles.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 w-fit">
            <Zap className="h-3.5 w-3.5 text-indigo-600" />
            <span>5 credits</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: Input Form */}
          <form
            onSubmit={onSubmitHandler}
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Target Keyword / Topic
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. Next.js 15 performance optimization"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {blogCategories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Generating Titles..." : "Generate Titles"}
            </button>
          </form>

          {/* Right: Output */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col min-h-[26rem]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Generated Headlines</h2>
              {content && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-center">
              {loading ? (
                <OutputLoader label="Analyzing SEO trends and crafting viral headlines..." />
              ) : !content ? (
                <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <Hash className="h-10 w-10 text-slate-300 stroke-1" />
                  <p className="mt-3 text-xs font-bold text-slate-700">
                    No titles generated yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs">
                    Enter a keyword on the left and click Generate Titles to see ideas.
                  </p>
                </div>
              ) : (
                <div className="custom-scrollbar overflow-y-auto max-h-[30rem] pr-2">
                  <FormattedOutput content={content} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
