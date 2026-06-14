import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import FormattedOutput from "../components/FormattedOutput.jsx";
import OutputLoader from "../components/OutputLoader.jsx";

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setContent("");

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/resume-review`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Resume reviewed.");
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
    <div className="tool-page-grid">
      <form
        onSubmit={onSubmitHandler}
        action=""
        className="tool-panel"
      >
        <div className="panel-header">
          <div className="icon-badge bg-gradient-to-br from-emerald-500 to-teal-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Career tool
            </p>
            <h1 className="text-xl font-bold">Resume Review</h1>
          </div>
        </div>

        <label className="field-label" htmlFor="resume-file">
          Upload Resume
        </label>

        <input
          id="resume-file"
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="file-input"
          required
        />

        <p className="helper-text">
          {input ? `Selected: ${input.name}` : "Supports PDF resumes only."}
        </p>

        <button disabled={loading} className="gradient-button mt-8">
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
          Review Resume
        </button>
      </form>

      <div className="tool-panel flex min-h-[28rem] flex-col">
        <div className="panel-header">
          <div className="icon-badge bg-gradient-to-br from-emerald-500 to-teal-500">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Output
            </p>
            <h1 className="text-xl font-bold">Analysis Results</h1>
          </div>
        </div>

        <hr className="divider-soft" />

        {loading ? (
          <OutputLoader label="Reviewing your resume" />
        ) : !content ? (
          <div className="empty-state">
            <FileText className="h-10 w-10 text-emerald-400" />
            <p className="text-sm font-semibold">
              Upload a resume and click Review Resume to get started.
            </p>
          </div>
        ) : (
          <FormattedOutput content={content} />
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
