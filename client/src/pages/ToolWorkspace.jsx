import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FileUp,
  Image,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  Copy,
  Download,
  RotateCcw,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import FormattedOutput from "../components/FormattedOutput.jsx";
import OutputLoader from "../components/OutputLoader.jsx";
import { allTools } from "../data/toolCatalog.js";

const PDF_TOOLS = new Set([
  "pdf-summarizer",
  "ai-document-analyzer",
  "ai-file-chat",
]);
const IMAGE_UPLOAD_TOOLS = new Set([
  "ai-image-upscaler",
  "ai-image-caption-generator",
  "ai-ocr-scanner",
]);
const IMAGE_OUTPUT_TOOLS = new Set([
  "ai-image-upscaler",
  "ai-logo-generator",
  "ai-thumbnail-generator",
  "ai-poster-flyer-generator",
  "ai-avatar-generator",
]);
const CHAT_TOOLS = new Set([
  "ai-chat-assistant",
  "ai-voice-assistant",
  "ai-file-chat",
]);

const contextLabels = {
  "ai-paragraph-rewriter": "Desired tone or rewrite instructions (optional)",
  "ai-email-writer": "Recipient, tone, and call to action (optional)",
  "ai-social-media-post-generator": "Target platform and audience (optional)",
  "ai-product-description-generator": "Audience and brand voice (optional)",
  "ai-ad-copy-generator": "Platform, audience, and campaign goal (optional)",
  "ai-youtube-script-generator": "Audience, duration, and style (optional)",
  "ai-resume-builder": "Target role or job description (optional)",
  "ai-cover-letter-generator": "Target role and company context (optional)",
  "ai-interview-preparation": "Role, seniority, and interview type (optional)",
  "linkedin-profile-optimizer": "Target role and industry (optional)",
  "ats-resume-score-checker": "Target job description",
  "job-description-analyzer":
    "Your background or comparison criteria (optional)",
  "career-roadmap-generator": "Target role and timeline (optional)",
  "ai-study-assistant": "Learning level and goal (optional)",
  "ai-presentation-generator": "Audience, slide count, and tone (optional)",
  "quiz-generator": "Difficulty and question count (optional)",
  "ai-code-generator": "Language, framework, and constraints (optional)",
  "ai-code-reviewer": "Language and review priorities (optional)",
  "ai-bug-fixer": "Error message and expected behavior (optional)",
  "ai-sql-query-generator": "Database dialect and schema (optional)",
  "ai-api-documentation-generator": "Framework and API context (optional)",
  "regex-generator": "Regex engine and examples (optional)",
  "unit-test-generator": "Language and test framework (optional)",
  "ai-translation-tool": "Target language and tone",
  "ai-research-assistant": "Scope, audience, and constraints (optional)",
  "ai-prompt-generator": "Target AI model and output format (optional)",
};

const inputLabels = {
  "ai-paragraph-rewriter": "Text to rewrite",
  "ai-summarizer": "Text to summarize",
  "ai-grammar-checker": "Text to check",
  "ai-email-writer": "Email brief",
  "ats-resume-score-checker": "Resume text",
  "job-description-analyzer": "Job description",
  "linkedin-profile-optimizer": "Current LinkedIn profile text",
  "ai-code-reviewer": "Code to review",
  "ai-bug-fixer": "Buggy code",
  "code-explainer": "Code to explain",
  "unit-test-generator": "Code to test",
  "ai-file-chat": "Question about the PDF",
  "ai-chat-assistant": "Message",
  "ai-voice-assistant": "Speak or type a message",
  "ai-translation-tool": "Text to translate",
};

const placeholders = {
  CONTENT:
    "Describe what you want to create, or paste the text you want to transform...",
  IMAGE:
    "Describe the visual style, subject, colors, composition, and intended use...",
  CAREER:
    "Paste your career information, profile, resume content, or target requirements...",
  PRODUCTIVITY: "Paste the source material, topic, or learning goal...",
  DEVELOPER: "Paste code or describe the technical requirement in detail...",
  ADVANCED: "Enter your request with enough context for a precise result...",
};

const promptIdeas = {
  CONTENT: [
    "Professional and concise",
    "SEO-focused",
    "Friendly and conversational",
  ],
  IMAGE: [
    "Minimalist premium style",
    "Bold editorial composition",
    "Modern cinematic lighting",
  ],
  CAREER: [
    "Optimize for a senior role",
    "Highlight measurable impact",
    "Focus on ATS keywords",
  ],
  PRODUCTIVITY: [
    "Beginner-friendly explanation",
    "Exam revision format",
    "Action-oriented summary",
  ],
  DEVELOPER: [
    "Include tests and edge cases",
    "Prioritize security",
    "Explain time and space complexity",
  ],
  ADVANCED: [
    "Return structured Markdown",
    "State assumptions",
    "Include an actionable checklist",
  ],
};

const getMode = (slug) => {
  if (PDF_TOOLS.has(slug)) return "pdf";
  if (IMAGE_UPLOAD_TOOLS.has(slug)) return "image-upload";
  return "text";
};

const ToolWorkspace = () => {
  const { toolSlug } = useParams();
  const tool = useMemo(
    () => allTools.find((item) => item.slug === toolSlug),
    [toolSlug],
  );
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const { getToken } = useAuth();

  useEffect(() => {
    setInput("");
    setContext("");
    setFile(null);
    setContent("");
    setImageUrl("");
    setMessages([]);
    setError("");
  }, [toolSlug]);

  if (!tool) {
    return (
      <div className="page-shell">
        <div className="empty-state content-wrap">
          <Sparkles className="h-10 w-10 text-indigo-500" />
          <p className="font-bold">This AI tool does not exist.</p>
          <Link className="secondary-button" to="/ai">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const mode = getMode(tool.slug);
  const needsInput = ![
    "pdf-summarizer",
    "ai-document-analyzer",
    "ai-image-upscaler",
    "ai-image-caption-generator",
    "ai-ocr-scanner",
  ].includes(tool.slug);
  const contextRequired = [
    "ats-resume-score-checker",
    "ai-translation-tool",
  ].includes(tool.slug);
  const isVoice = tool.slug === "ai-voice-assistant";
  const isChat = CHAT_TOOLS.has(tool.slug);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported by this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error("Unable to capture speech.");
    };
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  const speakResult = () => {
    if (!window.speechSynthesis || !content) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      content.replace(/[#*_`>-]/g, " "),
    );
    window.speechSynthesis.speak(utterance);
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    if (!isChat) setContent("");
    setImageUrl("");

    try {
      const token = await getToken();
      const conversationContext =
        isChat && messages.length
          ? messages
              .slice(-8)
              .map((message) => `${message.role}: ${message.content}`)
              .join("\n")
          : context;
      let body;
      const headers = { Authorization: `Bearer ${token}` };
      if (mode !== "text") {
        body = new FormData();
        if (file) body.append("file", file);
        body.append("input", input);
        body.append("context", conversationContext);
      } else {
        body = { input, context: conversationContext };
        headers["Content-Type"] = "application/json";
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/tools/${tool.slug}`,
        body,
        { headers, withCredentials: true },
      );
      if (!data.success)
        throw new Error(data.message || "Unable to run this tool.");
      setContent(data.content || "");
      setImageUrl(data.imageUrl || "");
      if (isChat) {
        setMessages((current) => [
          ...current,
          { role: "You", content: input },
          { role: "InfinityAI", content: data.content },
        ]);
        setInput("");
      }
      toast.success(`${tool.name} completed.`);
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Unexpected error.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page-grid">
      <form onSubmit={submit} className="tool-panel overflow-y-auto">
        <div className="panel-header">
          <div className="icon-badge bg-gradient-to-br from-indigo-600 to-cyan-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              {tool.categoryTitle}
            </p>
            <h1>{tool.name}</h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {tool.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tool.algorithmUsed.map((algorithm) => (
            <span
              key={algorithm}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
            >
              {algorithm}
            </span>
          ))}
        </div>

        {mode !== "text" && (
          <>
            <label className="field-label" htmlFor="workflow-file">
              {mode === "pdf" ? "Upload PDF" : "Upload image"}
            </label>
            <input
              id="workflow-file"
              type="file"
              accept={
                mode === "pdf"
                  ? "application/pdf"
                  : "image/jpeg,image/png,image/webp"
              }
              className="file-input"
              onChange={(event) => setFile(event.target.files[0] || null)}
              required
            />
            <p className="helper-text">
              {file
                ? `Selected: ${file.name}`
                : mode === "pdf"
                  ? "PDF up to 10MB."
                  : "JPG, PNG, or WebP up to 10MB."}
            </p>
          </>
        )}

        {needsInput && (
          <>
            <label className="field-label" htmlFor="workflow-input">
              {inputLabels[tool.slug] || "Your input"}
            </label>
            <textarea
              id="workflow-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="field-input min-h-40 resize-y"
              placeholder={placeholders[tool.category]}
              maxLength={50000}
              required
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {promptIdeas[tool.category].map((idea) => (
                <button
                  key={idea}
                  type="button"
                  className="chip chip-idle px-3 py-1.5 text-xs"
                  onClick={() =>
                    setContext((current) =>
                      current ? `${current}; ${idea}` : idea,
                    )
                  }
                >
                  {idea}
                </button>
              ))}
            </div>
          </>
        )}

        {contextLabels[tool.slug] && !isChat && (
          <>
            <label className="field-label" htmlFor="workflow-context">
              {contextLabels[tool.slug]}
            </label>
            <textarea
              id="workflow-context"
              value={context}
              onChange={(event) => setContext(event.target.value)}
              className="field-input min-h-28 resize-y"
              maxLength={20000}
              required={contextRequired}
            />
          </>
        )}

        {isVoice && (
          <button
            type="button"
            className="secondary-button mt-4 w-full"
            onClick={startListening}
          >
            {listening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            {listening ? "Listening..." : "Speak instead"}
          </button>
        )}

        <button disabled={loading} className="gradient-button mt-8">
          {mode === "text" ? (
            <Send className="h-5 w-5" />
          ) : (
            <FileUp className="h-5 w-5" />
          )}
          {loading ? "Processing..." : `Run ${tool.name}`}
        </button>
        <p className="helper-text text-center">
          Uses {tool.credits} credits · Requires {tool.minPlan.toLowerCase()}{" "}
          plan
        </p>
      </form>

      <div className="tool-panel flex min-h-[28rem] flex-col">
        <div className="panel-header">
          <div className="icon-badge bg-gradient-to-br from-violet-600 to-fuchsia-500">
            {IMAGE_OUTPUT_TOOLS.has(tool.slug) ? (
              <Image className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              Output
            </p>
            <h1>{isChat ? "Conversation" : "Generated result"}</h1>
          </div>
        </div>
        <hr className="divider-soft" />

        {error ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="font-black text-rose-900">
              We couldn’t complete this run
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-rose-700">
              {error}
            </p>
            <button
              type="button"
              className="secondary-button mt-5"
              onClick={() => setError("")}
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
          </div>
        ) : loading ? (
          <OutputLoader label={`Running ${tool.name}`} />
        ) : imageUrl ? (
          <div className="space-y-4">
            <img
              src={imageUrl}
              alt={`${tool.name} result`}
              className="max-h-[36rem] w-full rounded-2xl border border-slate-200 object-contain shadow-lg"
            />
            <div className="flex flex-wrap gap-3">
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="secondary-button flex-1"
              >
                Open full-size result
              </a>
              <a
                href={imageUrl}
                download={`${tool.slug}-result`}
                className="secondary-button"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          </div>
        ) : isChat && messages.length ? (
          <div className="space-y-4">
            <div className="ai-output max-h-[34rem] space-y-4 overflow-y-auto pr-2">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-2xl p-4 ${message.role === "You" ? "ml-8 bg-indigo-50" : "mr-8 border border-slate-200 bg-white"}`}
                >
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                    {message.role}
                  </p>
                  <div className="mt-2">
                    <FormattedOutput content={message.content} />
                  </div>
                </div>
              ))}
            </div>
            {isVoice && content && (
              <button
                type="button"
                className="secondary-button w-full"
                onClick={speakResult}
              >
                <Volume2 className="h-5 w-5" /> Read latest response aloud
              </button>
            )}
          </div>
        ) : content ? (
          <>
            <FormattedOutput content={content} />
            <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  navigator.clipboard?.writeText(content);
                  toast.success("Result copied.");
                }}
              >
                <Copy className="h-4 w-4" /> Copy
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement("a");
                  anchor.href = url;
                  anchor.download = `${tool.slug}-result.txt`;
                  anchor.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
            {isVoice && (
              <button
                type="button"
                className="secondary-button mt-4 w-full"
                onClick={speakResult}
              >
                <Volume2 className="h-5 w-5" /> Read response aloud
              </button>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Sparkles className="h-10 w-10 text-violet-400" />
            <p className="text-sm font-semibold">
              Configure the tool and run it to see the result.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolWorkspace;
