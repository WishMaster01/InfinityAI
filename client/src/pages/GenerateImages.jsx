import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        action=""
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Describe Your Image</p>

        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe What You Want to See in the Image...."
          required
        />

        <p className="mt-4 text-sm font-medium">Style</p>

        <div className="mt-3 flex flex-wrap gap-3 sm:max-w-9/11">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={item}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-green-50 text-green-700 hover:bg-green-300"
                  : "text-gray-500 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />

            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>

            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>

          <p className="text-sm">Make This Image Public</p>
        </div>

        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200">
          <Image className="w-5 h-5" />
          Generate Image
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96">
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generate Images</h1>
        </div>

        <hr className="my-8 h-px border-0 bg-gray-300 dark:bg-gray-700" />

        <div className="flex-1 flex justify-center items-center gap-5 text-gray-400">
          <Image className="w-9 h-9" />
          <p className="">
            Enter a Topic and Click "Generate Image" to get Started
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
