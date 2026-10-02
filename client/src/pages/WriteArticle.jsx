import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Copy,
  Download,
  Bookmark,
  Share2,
  Check,
  FileText,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import FormattedOutput from "../components/FormattedOutput.jsx";
import OutputLoader from "../components/OutputLoader.jsx";

const contentTypes = [
  "Blog Post",
  "Social Media",
  "Email",
  "Product Description",
  "Story",
  "Creative Writing",
  "Essay",
  "Resume",
];

const toneOptions = [
  "Professional",
  "Casual & Friendly",
  "Persuasive",
  "Authoritative",
  "Creative & Engaging",
];

const lengthOptions = [
  { length: 400, label: "Short (300-500 words)" },
  { length: 800, label: "Medium (500-800 words)" },
  { length: 1500, label: "Long (1000-1500 words)" },
];

const WriteArticle = () => {
  const [selectedType, setSelectedType] = useState("Blog Post");
  const [inputTopic, setInputTopic] = useState("");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedLength, setSelectedLength] = useState(lengthOptions[1]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Content copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inputTopic.slice(0, 20) || "ai_generated"}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully!");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!inputTopic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setLoading(true);
    setContent("");

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please log in to use this tool.");
        setLoading(false);
        return;
      }

      const prompt = `Write a ${selectedType} about: "${inputTopic}". Tone: ${selectedTone}. Length: ${selectedLength.label}.`;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/generate-article`,
        {
          prompt,
          length: selectedLength.length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Content generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate content");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Generation error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Content Type Sub-Navigation Pills (Matching image: Blog Post, Social Media, etc.) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 custom-scrollbar">
          {contentTypes.map((type) => {
            const active = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150 ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Header matching image: Blog Post Generator + 12 credits */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {selectedType} Generator
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Create engaging {selectedType.toLowerCase()}s with AI. Just add your topic and let the magic happen.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 w-fit">
            <Zap className="h-3.5 w-3.5 text-indigo-600" />
            <span>12 credits</span>
          </div>
        </div>

        {/* Main Grid: Form Inputs on Left / Result on Right */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: Input Form */}
          <form
            onSubmit={onSubmitHandler}
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Enter your topic
                </label>
                <input
                  type="text"
                  value={inputTopic}
                  onChange={(e) => setInputTopic(e.target.value)}
                  placeholder="e.g. The future of AI in education"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Tone
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    {toneOptions.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Length
                  </label>
                  <select
                    value={selectedLength.length}
                    onChange={(e) =>
                      setSelectedLength(
                        lengthOptions.find((l) => l.length === Number(e.target.value)) ||
                          lengthOptions[1],
                      )
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    {lengthOptions.map((item) => (
                      <option key={item.length} value={item.length}>
                        {item.label}
                      </option>
                    ))}
                  </select>
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
              {loading ? "Generating Content..." : "Generate"}
            </button>
          </form>

          {/* Right: Result Container matching image */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col min-h-[26rem]">
            {/* Result Header & Actions Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Result</h2>

              {content && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success("Saved to your history!")}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Bookmark className="h-3.5 w-3.5" /> Save
                  </button>
                </div>
              )}
            </div>

            {/* Output Display area */}
            <div className="mt-4 flex-1 flex flex-col justify-center">
              {loading ? (
                <OutputLoader label={`Generating your ${selectedType.toLowerCase()}...`} />
              ) : !content ? (
                <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <FileText className="h-10 w-10 text-slate-300 stroke-1" />
                  <p className="mt-3 text-xs font-bold text-slate-700">
                    No result generated yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs">
                    Configure your topic on the left and click Generate to see the AI magic.
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

export default WriteArticle;
