import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import OutputLoader from "../components/OutputLoader.jsx";

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
        }
      );

      if (data.success) {
        setImageUrl(data.imageURL);
        toast.success("Object removed.");
      } else {
        toast.error(data.message || "Unable to remove object.");
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
          <div className="icon-badge bg-gradient-to-br from-blue-500 to-violet-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Image cleanup
            </p>
            <h1 className="text-xl font-bold">Object Removal</h1>
          </div>
        </div>

        <label className="field-label" htmlFor="object-image">
          Upload Image
        </label>

        <input
          id="object-image"
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="file-input"
          required
        />

        <p className="helper-text">
          {input ? `Selected: ${input.name}` : "Supports JPG, PNG, and WebP images."}
        </p>

        <label className="field-label" htmlFor="object-name">
          Describe Object Name to Remove
        </label>

        <textarea
          id="object-name"
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="field-input min-h-32 resize-none"
          placeholder="Example: watch, spoon, backpack"
          required
        />

        <button disabled={loading} className="gradient-button mt-8">
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Scissors className="h-5 w-5" />
          )}
          Remove Object
        </button>
      </form>

      <div className="tool-panel flex min-h-[28rem] flex-col">
        <div className="panel-header">
          <div className="icon-badge bg-gradient-to-br from-blue-500 to-violet-600">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Output
            </p>
            <h1 className="text-xl font-bold">Processed Image</h1>
          </div>
        </div>

        <hr className="divider-soft" />

        {loading ? (
          <OutputLoader label="Removing the selected object" />
        ) : !imageUrl ? (
          <div className="empty-state">
            <Scissors className="h-10 w-10 text-indigo-400" />
            <p className="text-sm font-semibold">
              Upload an image and click Remove Object to get started.
            </p>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Object removed result"
            className="max-h-[34rem] w-full rounded-2xl border border-slate-200 object-contain shadow-lg"
          />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
