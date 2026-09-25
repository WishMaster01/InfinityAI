import React, { useState } from "react";
import FormattedOutput from "./FormattedOutput.jsx";

const CreationItem = ({ item, onDelete, onDuplicate, onOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const createdAt = item.createdAt || item.created_at;

  return (
    <div className="premium-card max-w-6xl p-5 text-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-lg font-black leading-7 text-slate-900">
            {item.prompt}
          </h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {item.type} -{" "}
            {createdAt ? new Date(createdAt).toLocaleDateString() : "Saved"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-700"
        >
          {item.type}
        </button>
        {onDelete && (
          <button
            type="button"
            aria-label="Delete creation"
            onClick={() => onDelete(item.id)}
            className="rounded-full border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700"
          >
            Delete
          </button>
        )}
        {onDuplicate && (
          <button
            type="button"
            aria-label="Duplicate creation"
            onClick={() => onDuplicate(item.id)}
            className="rounded-full border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-700"
          >
            Duplicate
          </button>
        )}
        {onOpen && (
          <button
            type="button"
            aria-label="View creation details"
            onClick={() => onOpen(item)}
            className="rounded-full border border-cyan-200 px-3 py-2 text-xs font-bold text-cyan-700"
          >
            Details
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt={item.prompt || "Generated image"}
                className="w-full max-w-md rounded-2xl border border-slate-200 object-cover shadow-lg"
              />
            </div>
          ) : (
            <FormattedOutput content={item.content} />
          )}
          <button
            type="button"
            className="secondary-button mt-4"
            onClick={() => {
              const popup = window.open("", "_blank");
              if (!popup) return;
              popup.document.write(
                `<html><head><title>${item.prompt}</title></head><body><h1>${item.prompt}</h1><pre style="white-space:pre-wrap;font:16px sans-serif">${item.content.replaceAll("<", "&lt;")}</pre></body></html>`,
              );
              popup.document.close();
              popup.focus();
              popup.print();
            }}
          >
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default CreationItem;
