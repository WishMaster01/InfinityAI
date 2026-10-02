import React, { useState } from "react";
import {
  FileText,
  Upload,
  Plus,
  Send,
  Sparkles,
  CheckCircle2,
  FileCode,
  File,
  ChevronRight,
  BookOpen,
  Download,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

const initialDocuments = [
  {
    id: 1,
    name: "Product_Requirements.pdf",
    type: "PDF",
    size: "2.4 MB",
    updated: "2 hours ago",
    content: "Product requirements document detailing authentication, real-time collaboration, analytics dashboard, mobile responsive design, and API integrations.",
  },
  {
    id: 2,
    name: "Research_Paper.pdf",
    type: "PDF",
    size: "1.8 MB",
    updated: "Yesterday",
    content: "A comprehensive academic research paper analyzing state-of-the-art natural language processing and transformer models.",
  },
  {
    id: 3,
    name: "Project_Proposal.pdf",
    type: "PDF",
    size: "3.2 MB",
    updated: "3 days ago",
    content: "Proposal for the new multi-modal generative AI workspace architecture, cloud resource estimates, and quarterly milestones.",
  },
  {
    id: 4,
    name: "Notes.docx",
    type: "DOCX",
    size: "840 KB",
    updated: "Last week",
    content: "Team sync notes, design review feedback, sprint backlog items, and accessibility checklist.",
  },
];

const initialMessages = [
  {
    sender: "user",
    text: "What are the key features mentioned in this document?",
  },
  {
    sender: "ai",
    text: "The document outlines several key features:",
    bullets: [
      "User authentication and authorization",
      "Real-time collaboration",
      "Analytics and reporting dashboard",
      "Mobile responsive design",
      "API integration support",
    ],
    citation: "Source: Product_Requirements.pdf (Page 3-5)",
  },
];

const Documents = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedDoc, setSelectedDoc] = useState(initialDocuments[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userQuery = inputQuestion.trim();
    const newMsgList = [...messages, { sender: "user", text: userQuery }];
    setMessages(newMsgList);
    setInputQuestion("");
    setIsTyping(true);

    // Simulate intelligent grounded AI citation response
    setTimeout(() => {
      let aiReply;
      if (userQuery.toLowerCase().includes("summary") || userQuery.toLowerCase().includes("overview")) {
        aiReply = {
          sender: "ai",
          text: `Here is an overview of ${selectedDoc.name}:`,
          bullets: [
            "Covers core system specifications and operational requirements",
            "Identifies performance metrics and low-latency API benchmarks",
            "Outlines end-to-end security compliance and data encryption",
          ],
          citation: `Source: ${selectedDoc.name} (Section 1)`,
        };
      } else {
        aiReply = {
          sender: "ai",
          text: `Based on ${selectedDoc.name}, here are the findings for your query:`,
          bullets: [
            `Extracted direct context regarding: "${userQuery}"`,
            "Verified against reference index with high semantic confidence",
            "No conflicting clauses or security violations identified",
          ],
          citation: `Source: ${selectedDoc.name} (Pages 1-3)`,
        };
      }
      setMessages([...newMsgList, aiReply]);
      setIsTyping(false);
    }, 700);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        type: file.name.endsWith(".docx") ? "DOCX" : "PDF",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        updated: "Just now",
        content: "Newly uploaded file ready for grounded chat and document insights.",
      };
      setDocuments([newDoc, ...documents]);
      setSelectedDoc(newDoc);
      toast.success(`Uploaded ${file.name}`);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        sender: "ai",
        text: `Ready to answer questions about ${selectedDoc.name}. What would you like to know?`,
        citation: `Source: ${selectedDoc.name}`,
      },
    ]);
    toast.success("New chat started");
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Main 2-Pane Layout matching the uploaded image */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left Pane: My Documents */}
          <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            {/* Header + Upload Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                My Documents
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {documents.length} files
              </span>
            </div>

            {/* Upload Button */}
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 hover:shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all">
              <Plus className="h-4 w-4" />
              <span>Upload Document</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {/* Document List matching image */}
            <div className="mt-4 space-y-2 overflow-y-auto max-h-[32rem] custom-scrollbar pr-1">
              {documents.map((doc) => {
                const isSelected = selectedDoc.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      toast(`Viewing ${doc.name}`, { icon: "📄" });
                    }}
                    className={`group flex cursor-pointer items-center justify-between rounded-xl p-3 border transition-all duration-150 ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/60 shadow-xs"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          doc.type === "PDF"
                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`truncate text-xs font-bold ${
                            isSelected ? "text-indigo-900" : "text-slate-800"
                          }`}
                        >
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          <span className="font-semibold">{doc.type}</span> · {doc.size}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected ? "text-indigo-600" : "text-slate-300 group-hover:text-slate-500"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Pane: Document Chat matching image */}
          <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs min-h-[34rem]">
            {/* Header + Current Doc Pill + New Chat */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Document Chat
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  <FileText className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="max-w-[140px] sm:max-w-[220px] truncate">
                    {selectedDoc.name}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleNewChat}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> New Chat
              </button>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 space-y-4 overflow-y-auto py-4 custom-scrollbar max-h-[26rem] pr-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {/* User Bubble */}
                  {msg.sender === "user" ? (
                    <div className="max-w-md rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-xs">
                      {msg.text}
                    </div>
                  ) : (
                    /* AI Bubble matching the uploaded image design */
                    <div className="max-w-xl rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 text-xs sm:text-sm text-slate-800 shadow-xs space-y-2">
                      <p className="font-semibold text-slate-900">{msg.text}</p>

                      {msg.bullets && (
                        <ol className="list-decimal list-inside space-y-1 text-slate-700 font-normal pl-1">
                          {msg.bullets.map((bullet, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {bullet}
                            </li>
                          ))}
                        </ol>
                      )}

                      {msg.citation && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <span className="inline-block rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">
                            {msg.citation}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 animate-pulse">
                  <Sparkles className="h-4 w-4" /> Analyzing document context...
                </div>
              )}
            </div>

            {/* Chat Input Bar matching image */}
            <form onSubmit={handleSendMessage} className="relative mt-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask a question about your document..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                title="Send query"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
