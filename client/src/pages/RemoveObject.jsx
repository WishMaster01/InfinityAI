import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");

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
          <Sparkles className="w-6 h-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Obejct Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        <p className="mt-6 text-sm font-medium">
          Describe Obejct Name to Remove
        </p>

        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="E.G., Watch or Spoon, Only Single Object Name to Remove from the Image...."
          required
        />

        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200">
          <Scissors className="w-5 h-5" />
          Remove Object
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96">
        <div className="flex items-center gap-3">
          <Scissors className="w-6 h-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        <hr className="my-8 h-px border-0 bg-gray-300 dark:bg-gray-700" />

        <div className="flex-1 flex justify-center items-center gap-5 text-gray-400">
          <Scissors className="w-9 h-9" />
          <p className="">
            Upload an Image and Click "Remove Object" to get Started
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
