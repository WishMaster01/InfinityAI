import React, { useEffect } from "react";
import { X } from "lucide-react";

const Dialog = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="dialog-title" className="text-xl font-black text-slate-950">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
};

export default Dialog;
