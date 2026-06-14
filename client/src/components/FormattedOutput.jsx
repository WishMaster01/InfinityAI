import React from "react";
import ReactMarkdown from "react-markdown";

const components = {
  h1: ({ ...props }) => (
    <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950" {...props} />
  ),
  h2: ({ ...props }) => (
    <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950" {...props} />
  ),
  h3: ({ ...props }) => (
    <h3 className="mt-6 text-2xl font-black text-slate-900" {...props} />
  ),
  p: ({ ...props }) => (
    <p className="mt-4 text-lg leading-9 text-slate-700" {...props} />
  ),
  ul: ({ ...props }) => (
    <ul className="mt-4 list-disc space-y-3 pl-6 text-lg leading-8 text-slate-700" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="mt-4 list-decimal space-y-3 pl-6 text-lg leading-8 text-slate-700" {...props} />
  ),
  li: ({ ...props }) => <li className="pl-1" {...props} />,
  strong: ({ ...props }) => (
    <strong className="font-black text-slate-950" {...props} />
  ),
  em: ({ ...props }) => <em className="text-slate-800" {...props} />,
  code: ({ ...props }) => (
    <code
      className="rounded-lg bg-slate-100 px-2 py-1 text-base font-bold text-indigo-700"
      {...props}
    />
  ),
  pre: ({ ...props }) => (
    <pre
      className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100 shadow-xl"
      {...props}
    />
  ),
  blockquote: ({ ...props }) => (
    <blockquote
      className="mt-5 border-l-4 border-indigo-400 bg-indigo-50/70 py-3 pl-5 text-lg leading-8 text-slate-700"
      {...props}
    />
  ),
  hr: ({ ...props }) => (
    <hr className="my-8 border-0 border-t border-slate-200" {...props} />
  ),
};

const FormattedOutput = ({ content }) => {
  return (
    <div className="ai-output max-h-[38rem] overflow-y-auto rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-inner shadow-blue-50 sm:p-8">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
};

export default FormattedOutput;
