import React from "react";
import {
  FileSearch,
  MessageSquareText,
  ScanText,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card.jsx";

const documentTools = [
  {
    slug: "pdf-summarizer",
    title: "PDF Summarizer",
    description:
      "Turn long documents into structured summaries, key points, topics, and study notes.",
    icon: ScanText,
  },
  {
    slug: "ai-document-analyzer",
    title: "Document Analyzer",
    description:
      "Inspect claims, evidence, risks, contradictions, and recommended actions.",
    icon: FileSearch,
  },
  {
    slug: "ai-file-chat",
    title: "Document Chat",
    description:
      "Ask grounded questions and receive answers with retrieved source citations.",
    icon: MessageSquareText,
  },
];

const Documents = () => {
  const navigate = useNavigate();
  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <section className="glass-card relative overflow-hidden p-8 sm:p-10">
          <span className="section-kicker">
            <Sparkles className="mr-2 h-4 w-4" />
            Documents
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Your document intelligence workspace
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Upload a PDF, understand its structure, and ask questions grounded
            in the original source.
          </p>
        </section>
        <div className="grid gap-5 md:grid-cols-3">
          {documentTools.map(({ slug, title, description, icon }) => (
            <Card key={slug} className="flex flex-col p-6">
              <span className="icon-badge w-fit bg-gradient-to-br from-indigo-600 to-cyan-500">
                {React.createElement(icon, { className: "h-5 w-5" })}
              </span>
              <h2 className="mt-5 text-xl font-black text-slate-950">
                {title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {description}
              </p>
              <button
                type="button"
                className="gradient-button mt-6"
                onClick={() => navigate(`/ai/tools/${slug}`)}
              >
                Open workspace
              </button>
            </Card>
          ))}
        </div>
        <Card className="p-6 sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">
            How sources work
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Documents are split into searchable passages. Document Chat
            retrieves the most relevant passages for each question and shows
            citation metadata alongside the answer.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Documents;
