import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import FormattedOutput from "../components/FormattedOutput.jsx";
import OutputLoader from "../components/OutputLoader.jsx";

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Health",
    "Lifestyle",
    "Travel",
    "Food",
    "Education",
    "Finance",
    "Entertainment",
    "Sports",
    "Fashion",
    "Science",
    "Business",
    "Politics",
    "Environment",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
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
      const prompt = `Generate blog titles for the keyword ${input} in the ${selectedCategory} category.`;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/generate-blog-title`,
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Titles generated.");
      } else {
        toast.error(data.message || "Unable to generate titles.");
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
          <div className="icon-badge bg-gradient-to-br from-violet-600 to-fuchsia-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              Ideation tool
            </p>
            <h1 className="text-xl font-bold">AI Title Generator</h1>
          </div>
        </div>

        <label className="field-label" htmlFor="blog-keyword">
          Keyword
        </label>

        <input
          id="blog-keyword"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="field-input"
          placeholder="Artificial intelligence workflows"
          required
        />

        <p className="field-label">Category</p>

        <div className="mt-3 flex flex-wrap gap-3">
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectedCategory(item)}
              key={item}
              className={`chip ${
                selectedCategory === item
                  ? "chip-active"
                  : "chip-idle"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button disabled={loading} className="gradient-button mt-8 bg-gradient-to-r from-fuchsia-500 to-violet-600">
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Hash className="h-5 w-5" />
          )}
          Generate Title
        </button>
      </form>

      <div className="tool-panel flex min-h-[28rem] flex-col">
        <div className="panel-header">
          <div className="icon-badge bg-gradient-to-br from-fuchsia-500 to-violet-600">
            <Hash className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              Output
            </p>
            <h1 className="text-xl font-bold">Generated Titles</h1>
          </div>
        </div>

        <hr className="divider-soft" />

        {loading ? (
          <OutputLoader label="Generating blog title ideas" />
        ) : !content ? (
          <div className="empty-state">
            <Hash className="h-10 w-10 text-violet-400" />
            <p className="text-sm font-semibold">
              Enter a keyword and click Generate Title to get started.
            </p>
          </div>
        ) : (
          <FormattedOutput content={content} />
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
