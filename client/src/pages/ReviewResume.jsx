import { FileText, Sparkles, Zap, Award, Copy, Download, Check } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import FormattedOutput from "../components/FormattedOutput.jsx";
import OutputLoader from "../components/OutputLoader.jsx";

const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Analysis copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      toast.error("Please upload a PDF resume");
      return;
    }

    setLoading(true);
    setContent("");

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", input);
      formData.append("jobDescription", jobDescription);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/resume-review`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Resume analyzed successfully!");
      } else {
        toast.error(data.message || "Unable to review resume.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Header matching image */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Resume Analyzer
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Get your ATS score, discover strengths & weaknesses, and get personalized improvement tips.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 w-fit">
            <Zap className="h-3.5 w-3.5 text-indigo-600" />
            <span>10 credits</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Form Left */}
          <form
            onSubmit={onSubmitHandler}
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Upload Resume (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setInput(e.target.files?.[0] || null)}
                  className="mt-1.5 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-3 text-xs text-slate-600 focus:border-indigo-500 focus:outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-indigo-700 hover:border-indigo-400"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {input ? `Selected: ${input.name}` : "Supports PDF documents up to 5MB."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Target Job Description (Optional)
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements for tailored keyword matching and ATS scoring..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
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
              {loading ? "Analyzing Resume..." : "Start Analyzing"}
            </button>
          </form>

          {/* Result Right */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col min-h-[26rem]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600" /> Analysis & Recommendations
              </h2>

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
                <OutputLoader label="Extracting skills, formatting, and ATS metrics..." />
              ) : !content ? (
                <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <FileText className="h-10 w-10 text-slate-300 stroke-1" />
                  <p className="mt-3 text-xs font-bold text-slate-700">
                    No resume analyzed yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs">
                    Upload your resume on the left to receive an ATS compatibility score and feedback.
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

export default ReviewResume;
