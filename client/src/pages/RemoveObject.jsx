import { Scissors, Sparkles, Zap, Download } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import OutputLoader from "../components/OutputLoader.jsx";

const RemoveObject = () => {
  const [input, setInput] = useState(null);
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      toast.error("Please upload an image");
      return;
    }
    if (!object.trim()) {
      toast.error("Please specify which object to remove");
      return;
    }

    setLoading(true);
    setImageUrl("");

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/remove-object`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (data.success) {
        setImageUrl(data.imageURL);
        toast.success("Object removed seamlessly!");
      } else {
        toast.error(data.message || "Unable to remove object.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unexpected error.");
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
              Object Removal
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Seamlessly erase unwanted photobombers, text, blemishes, or objects with generative inpainting.
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
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setInput(e.target.files?.[0] || null)}
                  className="mt-1.5 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 text-xs text-slate-600 focus:border-indigo-500 focus:outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-indigo-700 hover:border-indigo-400"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {input ? `Selected: ${input.name}` : "Supports JPG, PNG, and WebP."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Object to Remove
                </label>
                <input
                  type="text"
                  value={object}
                  onChange={(e) => setObject(e.target.value)}
                  placeholder="e.g. watch, person in background, wire, logo"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required
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
                <Scissors className="h-4 w-4" />
              )}
              {loading ? "Inpainting Object..." : "Remove Object"}
            </button>
          </form>

          {/* Right: Output */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col min-h-[26rem]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Inpainted Result</h2>
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
                <OutputLoader label="Analyzing background context and inpainting seamlessly..." />
              ) : !imageUrl ? (
                <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <Scissors className="h-10 w-10 text-slate-300 stroke-1" />
                  <p className="mt-3 text-xs font-bold text-slate-700">
                    No image processed yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs">
                    Upload a picture and specify which element to remove.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                  <img
                    src={imageUrl}
                    alt="Cleaned visual"
                    className="w-full object-contain max-h-[26rem]"
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

export default RemoveObject;
