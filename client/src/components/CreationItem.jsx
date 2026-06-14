import React, { useState } from "react";
import FormattedOutput from "./FormattedOutput.jsx";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const createdAt = item.createdAt || item.created_at;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="premium-card max-w-6xl cursor-pointer p-5 text-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-lg font-black leading-7 text-slate-900">
            {item.prompt}
          </h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {item.type} - {createdAt ? new Date(createdAt).toLocaleDateString() : "Saved"}
          </p>
        </div>

        <button className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-700">
          {item.type}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="IMAGE"
                className="w-full max-w-md rounded-2xl border border-slate-200 object-cover shadow-lg"
              />
            </div>
          ) : (
            <FormattedOutput content={item.content} />
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
