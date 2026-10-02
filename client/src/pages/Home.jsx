import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Image as ImageIcon,
  Code2,
  Briefcase,
  SquarePen,
  Sparkles,
  Search,
  Star,
  Zap,
  ShieldCheck,
  Users,
  Compass,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Download,
  Copy,
  ChevronDown,
  Lock,
  Flame,
  CheckCircle2,
  ArrowUpRight,
  Laptop,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ToolCard from "../components/ToolCard.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { allTools, planCards } from "../data/toolCatalog.js";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const [heroPrompt, setHeroPrompt] = useState("");
  const [activeHeroTab, setActiveHeroTab] = useState("write");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [faqOpen, setFaqOpen] = useState(0);
  const [playgroundText, setPlaygroundText] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  // Filtered tools for the explore section
  const [selectedToolFilter, setSelectedToolFilter] = useState("ALL");

  const popularTools = allTools.slice(0, 8);

  const heroTabs = [
    { id: "write", label: "Write", icon: SquarePen },
    { id: "image", label: "Image", icon: ImageIcon },
    { id: "code", label: "Code", icon: Code2 },
    { id: "pdf", label: "PDF Chat", icon: FileText },
    { id: "career", label: "Career", icon: Briefcase },
  ];

  // Dynamic preview content based on active hero tab
  const heroPreviews = {
    write: {
      tag: "Content Generator",
      title: "Blog Post: The Future of AI in Modern Education",
      badge: "12 credits",
      content:
        "Artificial intelligence is rapidly transforming the education landscape, creating new opportunities for personalized learning, real-time comprehension telemetry, and automated grading...",
      cta: "Generate Article",
      path: "/ai/write-article",
    },
    image: {
      tag: "Image Generation",
      title: "Photorealistic Cyberpunk City at Golden Hour",
      badge: "15 credits",
      imageUrl:
        "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&h=380&fit=crop",
      cta: "Create Image",
      path: "/ai/generate-images",
    },
    code: {
      tag: "Developer Tools",
      title: "Python Script to Automate File Organization",
      badge: "5 credits",
      code: `import os, shutil\nfrom pathlib import Path\n\ndef organize_files(directory):\n    for item in Path(directory).iterdir():\n        if item.is_file():\n            folder = Path(directory) / item.suffix[1:]\n            folder.mkdir(exist_ok=True)\n            shutil.move(item, folder / item.name)`,
      cta: "Explain & Run Code",
      path: "/ai/developer",
    },
    pdf: {
      tag: "Document Intelligence",
      title: "Document Chat: Product_Requirements.pdf",
      badge: "10 credits",
      userQuery: "What are the core security guidelines specified?",
      aiReply:
        "Section 4.2 states: All authentication credentials must use PKCE OAuth 2.0 with JWT rotation, and tenant data must remain encrypted at rest via AES-256.",
      citation: "Source: Product_Requirements.pdf (Page 4)",
      cta: "Chat with Documents",
      path: "/ai/documents",
    },
    career: {
      tag: "Resume Analyzer",
      title: "ATS Compatibility & Keyword Matching",
      badge: "10 credits",
      score: "92",
      insights: [
        "High ATS compatibility with modern hiring platforms",
        "Keywords matched: React, TypeScript, Cloud Architecture, GraphQL",
        "Recommended: Add quantifiable metrics to recent role accomplishments",
      ],
      cta: "Analyze My Resume",
      path: "/ai/review-resume",
    },
  };

  const currentPreview = heroPreviews[activeHeroTab];

  const handleHeroSearch = (e) => {
    if (e.key === "Enter" && heroPrompt.trim()) {
      navigate(`/ai?search=${encodeURIComponent(heroPrompt.trim())}`);
    }
  };

  // Live prompt playground simulator
  const samplePrompts = [
    "Write 5 viral blog titles about generative AI",
    "Analyze resume keywords for Senior React Developer",
    "Explain Dijkstra shortest path algorithm in Python",
  ];

  const simulatePlayground = (prompt) => {
    setIsSimulating(true);
    setPlaygroundText("");
    let responseText = "";

    if (prompt.includes("blog titles")) {
      responseText =
        "1. The Unseen Leap: How AI Models Learn to Reason in 2026\n2. Beyond the Prompt: Building Real-World Generative Workflows\n3. Zero to Ship: Why Single-Creator SaaS is Booming with AI\n4. The 10x Engineer Myth: What AI Actually Changes in Software\n5. From Static Docs to Live Thinking: The Next Phase of AI";
    } else if (prompt.includes("resume keywords")) {
      responseText =
        "ATS Match Score: 94%\n• Core Found: React 19, TypeScript, Tailwind, REST, Next.js\n• Recommended Additions: State machine management, CI/CD pipeline optimization, bundle size reduction metrics\n• Summary: Strong action verbs detected. High interview probability.";
    } else {
      responseText =
        "def dijkstra(graph, start):\n    import heapq\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    while pq:\n        curr_dist, u = heapq.heappop(pq)\n        if curr_dist > distances[u]: continue\n        for v, weight in graph[u].items():\n            dist = curr_dist + weight\n            if dist < distances[v]:\n                distances[v] = dist\n                heapq.heappush(pq, (dist, v))\n    return distances";
    }

    let i = 0;
    const interval = setInterval(() => {
      setPlaygroundText(responseText.slice(0, i));
      i += 4;
      if (i > responseText.length + 5) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 20);
  };

  const faqItems = [
    {
      q: "How does the InfinityAI credit system work?",
      a: "Every tool clearly displays its credit cost before running (for instance, 5 credits for title ideation, 10 credits for document chat, 15 credits for ultra-realistic image generation). Credits refresh monthly on your billing date, and unused credits roll over on Pro plans.",
    },
    {
      q: "Is my private data or uploaded document safe?",
      a: "Yes. InfinityAI enforces zero data retention with AI provider model training. Your documents, code, and prompts are processed via encrypted enterprise pipelines, and all user sessions are secured via Clerk authentication.",
    },
    {
      q: "How does Document Chat cite its sources?",
      a: "Our document intelligence engine chunks and indexes your PDFs into localized semantic embeddings. When answering questions, it highlights the exact page and paragraph references so you can verify facts instantly.",
    },
    {
      q: "Can I cancel or change my plan at any time?",
      a: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any moment directly from your Subscription settings with no cancellation fees or lock-ins.",
    },
    {
      q: "What makes InfinityAI better than paying for separate AI tools?",
      a: "Rather than spending $20/month on ChatGPT Plus, $20 on Midjourney, $15 on PDF tools, and $15 on resume scanners ($70+/month total), InfinityAI consolidates all 54+ specialized neural tools into one unified workspace starting at just $12/month.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Soft Animated Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[34rem] w-full max-w-7xl overflow-hidden">
          <div className="absolute top-10 left-1/4 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl animate-blob" />
          <div
            className="absolute top-12 right-1/4 h-80 w-80 rounded-full bg-violet-300/25 blur-3xl animate-blob"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-28 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl animate-blob"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="content-wrap relative px-4 sm:px-6 lg:px-8 text-center">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-xs backdrop-blur-sm animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-spin-slow" />
            <span>AI tools for creators, builders and thinkers</span>
          </div>

          {/* Main Headline */}
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.15] lg:text-7xl">
            Your All-in-One <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent animate-gradient-flow">
              AI Creation Platform
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg sm:leading-relaxed">
            Create, build, analyze, and achieve more with 54+ powerful AI tools.
            From content generation to code analysis, InfinityAI has everything
            you need to turn your ideas into reality.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/sign-up")}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/70 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/ai")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-xs hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-600 transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore Tools
            </button>
          </div>

          {/* 3 Key Stats */}
          <div className="mx-auto mt-12 grid max-w-md grid-cols-3 divide-x divide-slate-200 border-t border-slate-200/80 pt-8 text-center sm:max-w-xl">
            <div className="px-3">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                54+
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                AI Tools
              </p>
            </div>
            <div className="px-3">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                100K+
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Active Users
              </p>
            </div>
            <div className="px-3">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  4.8
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                User Rating
              </p>
            </div>
          </div>

          {/* Floating Sticker Badges with animations */}
          <div className="hidden lg:block">
            <div className="absolute left-10 top-36 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-lg shadow-indigo-100/60 backdrop-blur-md animate-float-slow">
              <SquarePen className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="absolute right-10 top-44 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-lg shadow-purple-100/60 backdrop-blur-md animate-float-reverse">
              <Sparkles className="h-6 w-6 text-violet-600" />
            </div>
          </div>

          {/* Hero Interactive App Preview Card (Matching image top-left design) */}
          <ScrollReveal
            animation="fade-up"
            delay={150}
            className="mx-auto mt-14 max-w-3xl"
          >
            <div className="relative rounded-3xl border border-slate-800 bg-[#0B0F19] p-5 sm:p-7 text-left shadow-2xl shadow-indigo-950/20 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    Good morning, Creator!{" "}
                    <Sparkles className="h-4 w-4 text-amber-300 inline animate-spin-slow" />
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    What would you like to create today?
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[11px] font-semibold text-indigo-300">
                  <Zap className="h-3 w-3 text-indigo-400" /> 54+ Models Active
                </span>
              </div>

              {/* Interactive Search Bar inside Hero Card */}
              <div className="mt-5 relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  onKeyDown={handleHeroSearch}
                  placeholder="Search or describe what you want to create..."
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/90 py-3.5 pl-11 pr-24 text-sm text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      heroPrompt.trim()
                        ? `/ai?search=${encodeURIComponent(heroPrompt.trim())}`
                        : "/ai",
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-xs"
                >
                  Generate
                </button>
              </div>

              {/* Quick Filter Category Tabs inside Hero Card */}
              <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                {heroTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeHeroTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveHeroTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                        active
                          ? "bg-indigo-600 text-white shadow-xs scale-105"
                          : "border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Live Preview inside Hero Card */}
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition-all duration-300 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-indigo-400">
                      {currentPreview.tag}
                    </span>
                  </div>
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-800">
                    {currentPreview.badge}
                  </span>
                </div>

                <div className="pt-3">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {currentPreview.title}
                  </h4>

                  {currentPreview.imageUrl && (
                    <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-800 max-h-44">
                      <img
                        src={currentPreview.imageUrl}
                        alt="Preview"
                        className="w-full object-cover"
                      />
                    </div>
                  )}

                  {currentPreview.content && (
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                      {currentPreview.content}
                    </p>
                  )}

                  {currentPreview.code && (
                    <pre className="mt-2 text-[11px] font-mono text-cyan-300 bg-slate-900 p-2.5 rounded-lg overflow-x-hidden leading-relaxed">
                      {currentPreview.code}
                    </pre>
                  )}

                  {currentPreview.aiReply && (
                    <div className="mt-2 space-y-1.5 text-xs">
                      <p className="text-slate-400 font-medium italic">
                        "{currentPreview.userQuery}"
                      </p>
                      <p className="text-slate-200 bg-slate-900/90 p-2 rounded-lg leading-relaxed">
                        {currentPreview.aiReply}
                      </p>
                      <span className="inline-block text-[10px] text-indigo-400 font-semibold">
                        {currentPreview.citation}
                      </span>
                    </div>
                  )}

                  {currentPreview.score && (
                    <div className="mt-3 flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-lg">
                        {currentPreview.score}
                      </div>
                      <div className="space-y-1">
                        {currentPreview.insights.slice(0, 2).map((ins, i) => (
                          <p
                            key={i}
                            className="text-[11px] text-slate-300 flex items-center gap-1.5"
                          >
                            <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{ins}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3.5 flex justify-end">
                    <button
                      onClick={() => navigate(currentPreview.path)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                    >
                      {currentPreview.cta} <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Infinite Animated Marquee Ticker */}
      <ScrollReveal animation="fade" duration={600}>
        <section className="border-y border-slate-200/80 bg-white py-4 overflow-hidden shadow-xs">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold text-slate-600">
            {[
              "⚡ 54+ AI Workflows",
              "✍️ Blog Post Generator",
              "🎨 Generative Image Studio",
              "📄 ATS Resume Scoring (92%)",
              "💬 Grounded PDF Document Chat",
              "💻 Python & SQL Generator",
              "🛡️ 100% Private & Encrypted",
              "⭐ 4.8 Rating from 12k+ Reviews",
              "🚀 Instant Export to Markdown & Code",
              "⚡ 54+ AI Workflows",
              "✍️ Blog Post Generator",
              "🎨 Generative Image Studio",
              "📄 ATS Resume Scoring (92%)",
              "💬 Grounded PDF Document Chat",
              "💻 Python & SQL Generator",
              "🛡️ 100% Private & Encrypted",
              "⭐ 4.8 Rating from 12k+ Reviews",
              "🚀 Instant Export to Markdown & Code",
            ].map((item, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Bento Grid: Core Superpowers */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto">
            <span className="section-kicker">
              <Cpu className="h-3.5 w-3.5" /> Platform Capabilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Engineered for Complete Creative Freedom
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">
              Every AI capability you need—orchestrated with low latency, high
              accuracy, and intuitive interfaces.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {/* Bento Item 1: Long Form Content */}
          <ScrollReveal animation="fade-up" delay={50}>
            <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
                <SquarePen className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Long-Form Content Engine
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Generate structured, SEO-optimized articles, essays, and
                marketing copy with tone, length, and keyword precision.
              </p>
              <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                <span className="font-semibold text-indigo-700">
                  Tones included:
                </span>{" "}
                Professional, Casual, Authoritative, Creative.
              </div>
            </div>
          </ScrollReveal>

          {/* Bento Item 2: Document Chat */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
                <FileText className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Grounded Document Chat
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Drop PDFs, research papers, or contract agreements. Receive
                verified answers with instant page-by-page citations.
              </p>
              <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                <span className="font-semibold text-emerald-700">
                  Zero hallucinations:
                </span>{" "}
                Semantic vector search across multi-page PDFs.
              </div>
            </div>
          </ScrollReveal>

          {/* Bento Item 3: ATS Resume Engine */}
          <ScrollReveal animation="fade-up" delay={250}>
            <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">
                <Award className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                ATS Career Maximizer
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Scan your resume against real job descriptions. Get a weighted
                ATS score, missing keywords, and action-verb improvements.
              </p>
              <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-purple-700">
                  Average callback rate:
                </span>
                <span className="font-black text-slate-900">+42%</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Bento Item 4: Generative Visuals */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shadow-xs">
                <ImageIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Generative Visual Studio
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                High-resolution diffusion models, background cutout extraction,
                and inpainting tools for pixel-perfect assets.
              </p>
              <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                <span className="font-semibold text-amber-700">Styles:</span>{" "}
                Photorealistic, Anime, Digital Art, 3D Render.
              </div>
            </div>
          </ScrollReveal>

          {/* Bento Item 5: Developer Suite */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                <Code2 className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Developer Accelerator
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Debug complex stack traces, generate optimized SQL queries,
                write regex patterns, and draft unit tests in seconds.
              </p>
              <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                <span className="font-semibold text-indigo-700">
                  Languages:
                </span>{" "}
                Python, TypeScript, SQL, Go, Rust, Java.
              </div>
            </div>
          </ScrollReveal>

          {/* Bento Item 6: Bank-Grade Privacy */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Private & Encrypted
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Your data belongs solely to you. Zero retention, no training on
                your content, and Clerk authenticated session isolation.
              </p>
              <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                <span className="font-semibold text-rose-700">Compliance:</span>{" "}
                AES-256 at rest, TLS 1.3 in transit.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Interactive Live Playground Demo */}
      <section className="py-20 border-t border-slate-200/80 bg-white">
        <div className="content-wrap px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <span className="section-kicker">
                  <Flame className="h-3.5 w-3.5 text-amber-500" /> Interactive
                  Demo
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Try the Intelligence Engine in Real-Time
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">
                  Click any prompt below to watch InfinityAI synthesize
                  responses with zero wait time.
                </p>

                <div className="mt-6 space-y-2.5">
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => simulatePlayground(p)}
                      className="w-full text-left rounded-xl border border-slate-200/80 p-3.5 text-xs font-semibold text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-900 transition-all flex items-center justify-between group"
                    >
                      <span>"{p}"</span>
                      <Sparkles className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Terminal / Live Output Box */}
            <ScrollReveal animation="fade-left" delay={150}>
              <div className="rounded-3xl border border-slate-800 bg-[#0B0F19] p-5 sm:p-6 text-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-2 font-mono text-[11px]">
                      infinity-ai-stream
                    </span>
                  </div>
                  {isSimulating && (
                    <span className="text-[11px] text-indigo-400 font-bold animate-pulse">
                      Streaming tokens...
                    </span>
                  )}
                </div>

                <div className="min-h-[16rem] py-4 text-xs sm:text-sm font-mono leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {playgroundText || (
                    <span className="text-slate-500 italic">
                      Click a prompt on the left to watch live token
                      generation...
                    </span>
                  )}
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (playgroundText) {
                        navigator.clipboard.writeText(playgroundText);
                        toast.success("Copied to clipboard!");
                      }
                    }}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    <Copy className="h-3.5 w-3.5 inline mr-1" /> Copy output
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works in 3 Steps */}
      <section className="py-24 border-t border-slate-200/80 bg-slate-50/70">
        <div className="content-wrap px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="fade-up">
            <span className="section-kicker">
              <Sparkles className="h-3.5 w-3.5" /> Frictionless Flow
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How InfinityAI Accelerates Your Output
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              From initial thought to production-ready deliverable in three
              steps.
            </p>
          </ScrollReveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3 text-left">
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="h-full relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm shadow-xs">
                  01
                </span>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  Select Your AI Tool
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Choose from 54+ specialized models fine-tuned for content,
                  vision, code analysis, or PDF documents.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="h-full relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm shadow-xs">
                  02
                </span>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  Input Context or Files
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Add your prompt keywords, upload your document/resume, or
                  paste code snippets for contextual synthesis.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="h-full relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm shadow-xs">
                  03
                </span>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  Refine, Export & Publish
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Export to markdown, copy code, download transparent PNGs, or
                  share directly with the community gallery.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Comparison Section: InfinityAI vs Traditional Subscriptions */}
      <section className="py-24 border-t border-slate-200/80 bg-white">
        <div className="content-wrap px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto">
              <span className="section-kicker">
                <Award className="h-3.5 w-3.5" /> High-Value Economics
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Why Pay for 5 Separate Tools When You Need One?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Save over 80% on monthly SaaS subscriptions while unlocking a
                unified dashboard.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-200/80 shadow-xs">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Feature
                    </th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50/70">
                      InfinityAI Platform
                    </th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Multiple Subscriptions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  <tr>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      Monthly Cost
                    </td>
                    <td className="py-4 px-4 font-black text-indigo-600 bg-indigo-50/50">
                      $12 / month
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      $75 - $90 / month
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      Unified History & Search
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600 bg-indigo-50/50">
                      ✓ All creations in one place
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      ✗ Fragmented across 5 logins
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      Grounded PDF Chat with Citations
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600 bg-indigo-50/50">
                      ✓ Included
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      Requires separate tool ($15/mo)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      ATS Resume & Job Scorer
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600 bg-indigo-50/50">
                      ✓ Included
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      Requires separate tool ($20/mo)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      Image Studio & Background Remover
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600 bg-indigo-50/50">
                      ✓ Included
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      Requires separate tool ($20/mo)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured AI Tools Directory Grid */}
      <section className="py-24 border-t border-slate-200/80 bg-slate-50/70">
        <div className="content-wrap px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="section-kicker">
                  <Sparkles className="h-3.5 w-3.5" /> Popular Tools
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Explore Essential AI Tools
                </h2>
                <p className="mt-2 text-sm text-slate-500 max-w-xl">
                  Curated workflows to supercharge your daily writing, coding,
                  imaging, and career tasks.
                </p>
              </div>
              <button
                onClick={() => navigate("/ai")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                View all 54+ tools <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((tool, idx) => (
              <ScrollReveal
                key={tool.slug}
                animation="fade-up"
                delay={(idx % 4) * 80}
              >
                <ToolCard
                  tool={tool}
                  onUse={(t) => navigate(t.path || `/ai/tools/${t.slug}`)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Simple, Transparent Pricing Section (Matching uploaded image) */}
      <section className="py-24 border-t border-slate-200/80 bg-white">
        <div className="content-wrap px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="fade-up">
            <span className="section-kicker">
              <Sparkles className="h-3.5 w-3.5" /> Pricing
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
              Choose the plan that fits your needs. Upgrade or cancel anytime.
            </p>

            {/* Monthly / Yearly Switcher */}
            <div className="mt-8 inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  billingCycle === "yearly"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Yearly{" "}
                <span className="text-emerald-400 font-extrabold ml-1">
                  (Save 20%)
                </span>
              </button>
            </div>
          </ScrollReveal>

          {/* Pricing Cards Grid (Free, Pro, Enterprise) */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3 text-left">
            {/* Free Plan */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="h-full relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Free
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    $0
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    / month
                  </span>
                </div>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>10 credits per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Access to 10+ basic tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Community access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Basic support</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="mt-8 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </ScrollReveal>

            {/* Pro Plan - Featured / Most Popular */}
            <ScrollReveal animation="scale-up" delay={150}>
              <div className="h-full relative rounded-2xl border-2 border-indigo-600 bg-white p-7 shadow-lg shadow-indigo-100 scale-105 z-10">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-black text-white shadow-xs">
                  ⭐ Most Popular
                </span>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Pro
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {billingCycle === "monthly" ? "$12" : "$10"}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    / month
                  </span>
                </div>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>1,000 credits per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Access to all 54+ tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Advanced features & export</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
                >
                  Get Started
                </button>
              </div>
            </ScrollReveal>

            {/* Enterprise Plan */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="h-full relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Enterprise
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {billingCycle === "monthly" ? "$29" : "$24"}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    / month
                  </span>
                </div>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>3,000 credits per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>All Pro features included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Dedicated 24/7 support</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/contact")}
                  className="mt-8 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Contact Sales
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Bottom Trust Badges */}
          <ScrollReveal animation="fade" delay={250}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-indigo-600" /> No hidden fees
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-indigo-600" /> Cancel anytime
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-600" /> Secure
                payments
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Wall of Creator Testimonials */}
      <section className="py-24 border-t border-slate-200/80 bg-slate-50/70">
        <div className="content-wrap px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto">
              <span className="section-kicker">
                <Users className="h-3.5 w-3.5" /> Social Proof
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Trusted by 100,000+ Creators & Engineers
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                See how builders use InfinityAI every day to deliver top-tier
                work.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="h-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover-lift transition-all">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "InfinityAI replaced three distinct subscriptions for our
                  agency. The document intelligence and SEO blog generator have
                  doubled our client publishing cadence."
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces"
                    alt="Sarah Lin"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Sarah Lin
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Head of Growth, ScaleMedia
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="h-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover-lift transition-all">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "The Resume Analyzer was a game changer for my job search. It
                  pointed out three critical keyword gaps and scored my ATS
                  rating from 64 to 92. Landed 4 interviews the next week."
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces"
                    alt="Marcus Vance"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Marcus Vance
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Senior Cloud Architect
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="h-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover-lift transition-all">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "The UI is gorgeous, lightning fast, and having image
                  generation, code debugging, and PDF summarization under one
                  roof makes it my daily workspace driver."
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces"
                    alt="Elena Rostova"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Elena Rostova
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Founder & Indie Hacker
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="py-24 border-t border-slate-200/80 bg-white">
        <div className="content-wrap px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center">
              <span className="section-kicker">
                <Sparkles className="h-3.5 w-3.5" /> Got Questions?
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Everything you need to know about the product, credits, and
                security.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 space-y-3 text-left">
            {faqItems.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 60}>
                  <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all">
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? -1 : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 p-5 text-xs text-slate-600 leading-relaxed bg-slate-50/50 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final High-Impact CTA Banner */}
      <section className="py-20 border-t border-slate-200/80 bg-slate-50/70">
        <div className="content-wrap px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="scale-up" duration={800}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-8 sm:p-14 text-white shadow-2xl text-center">
              <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl animate-blob" />
              <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-blob" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-indigo-300 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" /> Start Free in 30 Seconds
                </span>
                <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Turn your ideas into reality with InfinityAI.
                </h2>
                <p className="mt-3 text-xs sm:text-base text-slate-300 leading-relaxed">
                  Join over 100,000 creators, engineers, and professionals
                  building the future. No credit card required.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="rounded-full bg-white px-8 py-3.5 text-xs sm:text-sm font-bold text-slate-900 shadow-md hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={() => navigate("/ai")}
                    className="rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all"
                  >
                    Explore All 54+ Tools
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
