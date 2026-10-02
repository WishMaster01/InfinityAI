import { Image as ImageIcon, Sparkles, Zap, Download, Share2, Eye } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import OutputLoader from "../components/OutputLoader.jsx";

const imageStyles = [
  "Realistic",
  "Anime",
  "Digital Art",
  "Cyberpunk",
  "Minimalist",
  "Photorealistic",
  "Fantasy",
  "3D Render",
];

const GenerateImages = () => {
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setImageUrl("");

    try {
      const token = await getToken();
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}.`;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/generate-image`,
        { prompt, publish },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (data.success) {
        setImageUrl(data.secure_url);
        toast.success("Image generated successfully!");
      } else {
        toast.error(data.message || "Unable to generate image.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Generation error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    window.open(imageUrl, "_blank");
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Image Generator
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Create stunning, high-resolution visuals from text descriptions.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold text-purple-700 w-fit">
            <Zap className="h-3.5 w-3.5 text-purple-600" />
            <span>15 credits</span>
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
                  Prompt Description
                </label>
                <textarea
                  rows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. A beautiful space themed wallpaper with cosmic nebulas and glowing stars..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Art Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {imageStyles.map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        selectedStyle === style
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public gallery toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-xs font-semibold text-slate-700">
                  Share to Community Gallery
                </span>
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
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
              {loading ? "Generating Image..." : "Generate Image"}
            </button>
          </form>

          {/* Right: Output */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col min-h-[26rem]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Generated Result</h2>
              {imageUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              )}
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-center">
              {loading ? (
                <OutputLoader label="Synthesizing pixels and artistic textures..." />
              ) : !imageUrl ? (
                <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <ImageIcon className="h-10 w-10 text-slate-300 stroke-1" />
                  <p className="mt-3 text-xs font-bold text-slate-700">
                    No image generated yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs">
                    Enter a prompt description on the left and select your preferred style.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                  <img
                    src={imageUrl}
                    alt="AI Generated Visual"
                    className="w-full object-cover max-h-[30rem]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
