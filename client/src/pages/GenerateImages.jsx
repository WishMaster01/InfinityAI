import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import OutputLoader from "../components/OutputLoader.jsx";

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Cartoon",
    "Anime",
    "Abstract",
    "Minimalist",
    "Vintage",
    "Natural",
    "Fantasy",
    "Ghibli",
    "Pop Art",
    "Impressionist",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
        }
      );

      if (data.success) {
        setImageUrl(data.secure_url);
        toast.success("Image generated.");
      } else {
        toast.error(data.message || "Unable to generate image.");
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
          <div className="icon-badge bg-gradient-to-br from-emerald-500 to-cyan-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Visual tool
            </p>
            <h1 className="text-xl font-bold">AI Image Generator</h1>
          </div>
        </div>

        <label className="field-label" htmlFor="image-prompt">
          Describe Your Image
        </label>

        <textarea
          id="image-prompt"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="field-input min-h-32 resize-none"
          placeholder="A bright futuristic workspace with AI assistants and soft neon accents"
          required
        />

        <p className="field-label">Style</p>

        <div className="mt-3 flex flex-wrap gap-3">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={item}
              className={`chip ${
                selectedStyle === item
                  ? "chip-active"
                  : "chip-idle"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-3">
          <p className="text-sm font-semibold text-slate-700">
            Make this image public
          </p>
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />

            <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-cyan-500"></div>

            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span>
          </label>
        </div>

        <button disabled={loading} className="gradient-button mt-8">
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Image className="h-5 w-5" />
          )}
          Generate Image
        </button>
      </form>

      <div className="tool-panel flex min-h-[28rem] flex-col">
        <div className="panel-header">
          <div className="icon-badge bg-gradient-to-br from-emerald-500 to-cyan-500">
            <Image className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Output
            </p>
            <h1 className="text-xl font-bold">Generated Image</h1>
          </div>
        </div>

        <hr className="divider-soft" />

        {loading ? (
          <OutputLoader label="Generating your image" />
        ) : !imageUrl ? (
          <div className="empty-state">
            <Image className="h-10 w-10 text-emerald-400" />
            <p className="text-sm font-semibold">
              Describe an image and click Generate Image to get started.
            </p>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Generated result"
            className="max-h-[34rem] w-full rounded-2xl border border-slate-200 object-contain shadow-lg"
          />
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
