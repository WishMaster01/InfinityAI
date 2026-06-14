import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import FormattedOutput from "../components/FormattedOutput.jsx";
import OutputLoader from "../components/OutputLoader.jsx";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
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

      if (!token) {
        toast.error("Authentication token missing.");
        setLoading(false);
        return;
      }

      const prompt = `Write an article ${input} in ${selectedLength.text}`;
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
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Article generated!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) toast.error("Unauthorized. Please login again.");
      else toast.error(error?.response?.data?.message || "Unexpected error");
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
          <div className="icon-badge bg-gradient-to-br from-blue-500 to-cyan-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Writing tool
            </p>
            <h1 className="text-xl font-bold">Article Configuration</h1>
          </div>
        </div>

        <label className="field-label" htmlFor="article-topic">
          Article Topic
        </label>

        <input
          id="article-topic"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="field-input"
          placeholder="The future of artificial intelligence in education"
          required
        />

        <p className="field-label">Article Length</p>

        <div className="mt-3 flex flex-wrap gap-3">
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              key={index}
              className={`chip ${
                selectedLength.text === item.text
                  ? "chip-active"
                  : "chip-idle"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="gradient-button mt-8"
        >
          {loading ? (
            <span className="my-1 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          ) : (
            <Edit className="h-5 w-5" />
          )}
          Generate Article
        </button>
      </form>

      <div className="tool-panel flex min-h-[28rem] flex-col">
        <div className="panel-header">
          <div className="icon-badge bg-gradient-to-br from-blue-500 to-indigo-600">
            <Edit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Output
            </p>
            <h1 className="text-xl font-bold">Generated Article</h1>
          </div>
        </div>

        <hr className="divider-soft" />

        {loading ? (
          <OutputLoader label="Writing your article" />
        ) : !content ? (
          <div className="empty-state">
            <Edit className="h-10 w-10 text-blue-400" />
            <p className="text-sm font-semibold">
              Enter a topic and click Generate Article to get started.
            </p>
          </div>
        ) : (
          <FormattedOutput content={content} />
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
