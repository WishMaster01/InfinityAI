export const PLAN_ORDER = {
  BASIC: 0,
  MODERATE: 1,
  PRO: 2,
};

export const PLAN_CREDITS = {
  BASIC: 20,
  MODERATE: 500,
  PRO: 2000,
};

export const PLAN_PRICE_ENV = {
  BASIC: "STRIPE_BASIC_PRICE_ID",
  MODERATE: "STRIPE_MODERATE_PRICE_ID",
  PRO: "STRIPE_PRO_PRICE_ID",
};

export const CREDIT_COSTS = {
  TEXT: 1,
  RESUME: 2,
  IMAGE: 3,
  DOCUMENT: 4,
  ADVANCED: 5,
};

const CATEGORY_ALGORITHMS = {
  CONTENT: ["Trie autocomplete", "Frequency map", "Sliding-window text analysis", "Priority ranking"],
  IMAGE: ["Plan-priority queue", "LRU result cache", "SHA-256 duplicate detection"],
  CAREER: ["KMP skill matching", "Cosine similarity", "Weighted ATS scoring", "Priority ranking"],
  PRODUCTIVITY: ["Token-safe text chunking", "Graph traversal", "Priority ranking"],
  DEVELOPER: ["Stack validation", "Dependency graph", "Topological sort", "Pattern matching"],
  ADVANCED: ["LRU cache", "Request queue", "Similarity search", "Token bucket"],
};

export const toolCategories = [
  {
    key: "CONTENT",
    filter: "Content AI",
    title: "Content & Writing AI",
    description:
      "Create, rewrite, summarize, and polish written content for every channel.",
    icon: "SquarePen",
    gradient: "from-blue-500 via-indigo-500 to-violet-600",
    tools: [
      ["blog-title-generator", "Blog Title Generator", "Find sharp, SEO-friendly blog titles.", "Hash", "BASIC", CREDIT_COSTS.TEXT, "/ai/blog-titles"],
      ["ai-article-writer", "AI Article Writer", "Generate long-form articles from a topic.", "SquarePen", "BASIC", CREDIT_COSTS.TEXT, "/ai/write-article"],
      ["ai-blog-generator", "AI Blog Generator", "Draft full blog posts with structure and tone.", "BookOpen", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-paragraph-rewriter", "AI Paragraph Rewriter", "Rewrite paragraphs for clarity and style.", "RefreshCw", "BASIC", CREDIT_COSTS.TEXT],
      ["ai-summarizer", "AI Summarizer", "Condense long text into useful summaries.", "ListCollapse", "BASIC", CREDIT_COSTS.TEXT],
      ["ai-grammar-checker", "AI Grammar Checker", "Fix grammar, spelling, and readability issues.", "SpellCheck", "BASIC", CREDIT_COSTS.TEXT],
      ["ai-email-writer", "AI Email Writer", "Write concise professional emails.", "Mail", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-social-media-post-generator", "AI Social Media Post Generator", "Create posts for social channels.", "Share2", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-product-description-generator", "AI Product Description Generator", "Generate conversion-focused product copy.", "Package", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-ad-copy-generator", "AI Ad Copy Generator", "Create high-performing ad copy variants.", "Megaphone", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-youtube-script-generator", "AI YouTube Script Generator", "Draft scripts, hooks, and outlines.", "Youtube", "PRO", CREDIT_COSTS.TEXT],
    ],
  },
  {
    key: "IMAGE",
    filter: "Image AI",
    title: "Image & Design AI",
    description:
      "Generate, edit, upscale, and prepare visual assets with AI.",
    icon: "Image",
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    tools: [
      ["ai-image-generator", "AI Image Generator", "Create images from prompts.", "Image", "MODERATE", CREDIT_COSTS.IMAGE, "/ai/generate-images"],
      ["background-remover", "Background Remover", "Remove image backgrounds cleanly.", "Eraser", "MODERATE", CREDIT_COSTS.IMAGE, "/ai/remove-background"],
      ["object-remover", "Object Remover", "Remove unwanted objects from images.", "Scissors", "MODERATE", CREDIT_COSTS.IMAGE, "/ai/remove-object"],
      ["ai-image-upscaler", "AI Image Upscaler", "Improve image size and sharpness.", "Maximize", "MODERATE", CREDIT_COSTS.IMAGE],
      ["ai-logo-generator", "AI Logo Generator", "Create logo concepts for brands.", "Badge", "PRO", CREDIT_COSTS.IMAGE],
      ["ai-thumbnail-generator", "AI Thumbnail Generator", "Design thumbnails for videos and posts.", "PanelTop", "MODERATE", CREDIT_COSTS.IMAGE],
      ["ai-poster-flyer-generator", "AI Poster/Flyer Generator", "Create campaign visuals and flyers.", "FileImage", "PRO", CREDIT_COSTS.IMAGE],
      ["ai-avatar-generator", "AI Avatar Generator", "Generate profile avatars and characters.", "UserRound", "MODERATE", CREDIT_COSTS.IMAGE],
      ["ai-image-caption-generator", "AI Image Caption Generator", "Write captions from visual context.", "Captions", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-color-palette-generator", "AI Color Palette Generator", "Generate polished brand palettes.", "Palette", "BASIC", CREDIT_COSTS.TEXT],
    ],
  },
  {
    key: "CAREER",
    filter: "Career AI",
    title: "Career & Resume AI",
    description:
      "Improve resumes, cover letters, interviews, and career planning.",
    icon: "BriefcaseBusiness",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    tools: [
      ["resume-review-ai", "Resume Review AI", "Analyze and improve a PDF resume.", "FileText", "MODERATE", CREDIT_COSTS.RESUME, "/ai/review-resume"],
      ["ai-resume-builder", "AI Resume Builder", "Build a role-specific resume.", "ClipboardList", "MODERATE", CREDIT_COSTS.RESUME],
      ["ai-cover-letter-generator", "AI Cover Letter Generator", "Write tailored cover letters.", "MailPlus", "MODERATE", CREDIT_COSTS.RESUME],
      ["ai-interview-preparation", "AI Interview Preparation", "Practice questions and answers.", "MessagesSquare", "MODERATE", CREDIT_COSTS.RESUME],
      ["linkedin-profile-optimizer", "LinkedIn Profile Optimizer", "Improve headline, summary, and profile sections.", "Linkedin", "MODERATE", CREDIT_COSTS.RESUME],
      ["ats-resume-score-checker", "ATS Resume Score Checker", "Check ATS readiness and keywords.", "ScanSearch", "PRO", CREDIT_COSTS.RESUME],
      ["job-description-analyzer", "Job Description Analyzer", "Extract requirements and keywords.", "SearchCheck", "MODERATE", CREDIT_COSTS.RESUME],
      ["career-roadmap-generator", "Career Roadmap Generator", "Plan skills and next steps.", "Route", "PRO", CREDIT_COSTS.RESUME],
    ],
  },
  {
    key: "PRODUCTIVITY",
    filter: "Productivity AI",
    title: "Productivity & Study AI",
    description:
      "Summarize documents, create study assets, and turn meetings into actions.",
    icon: "GraduationCap",
    gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    tools: [
      ["pdf-summarizer", "PDF Summarizer", "Summarize long PDF files.", "FileText", "MODERATE", CREDIT_COSTS.DOCUMENT],
      ["ai-notes-generator", "AI Notes Generator", "Turn raw text into structured notes.", "NotebookPen", "BASIC", CREDIT_COSTS.TEXT],
      ["ai-mind-map-generator", "AI Mind Map Generator", "Create mind map outlines.", "GitFork", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-study-assistant", "AI Study Assistant", "Get guided study help.", "GraduationCap", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-presentation-generator", "AI Presentation Generator", "Create slide outlines and copy.", "Presentation", "PRO", CREDIT_COSTS.DOCUMENT],
      ["flashcard-generator", "Flashcard Generator", "Create revision flashcards.", "Layers", "BASIC", CREDIT_COSTS.TEXT],
      ["quiz-generator", "Quiz Generator", "Generate quizzes and answer keys.", "CircleHelp", "MODERATE", CREDIT_COSTS.TEXT],
      ["assignment-helper", "Assignment Helper", "Outline and improve assignments.", "PenTool", "MODERATE", CREDIT_COSTS.TEXT],
      ["meeting-notes-summarizer", "Meeting Notes Summarizer", "Extract decisions and action items.", "ListChecks", "PRO", CREDIT_COSTS.DOCUMENT],
    ],
  },
  {
    key: "DEVELOPER",
    filter: "Developer AI",
    title: "Developer AI",
    description:
      "Generate, review, debug, document, and test code faster.",
    icon: "Code2",
    gradient: "from-slate-700 via-indigo-700 to-blue-700",
    tools: [
      ["ai-code-generator", "AI Code Generator", "Generate code from requirements.", "Code2", "MODERATE", CREDIT_COSTS.ADVANCED],
      ["ai-code-reviewer", "AI Code Reviewer", "Review code for issues and improvements.", "GitPullRequestArrow", "MODERATE", CREDIT_COSTS.ADVANCED],
      ["ai-bug-fixer", "AI Bug Fixer", "Explain and fix bugs.", "Bug", "MODERATE", CREDIT_COSTS.ADVANCED],
      ["ai-sql-query-generator", "AI SQL Query Generator", "Generate SQL queries from intent.", "Database", "BASIC", CREDIT_COSTS.TEXT],
      ["ai-api-documentation-generator", "AI API Documentation Generator", "Create docs for API endpoints.", "Braces", "PRO", CREDIT_COSTS.ADVANCED],
      ["regex-generator", "Regex Generator", "Create and explain regex patterns.", "Regex", "BASIC", CREDIT_COSTS.TEXT],
      ["code-explainer", "Code Explainer", "Explain unfamiliar code clearly.", "FileCode2", "BASIC", CREDIT_COSTS.TEXT],
      ["unit-test-generator", "Unit Test Generator", "Generate test cases for code.", "TestTube2", "PRO", CREDIT_COSTS.ADVANCED],
    ],
  },
  {
    key: "ADVANCED",
    filter: "Advanced AI",
    title: "Advanced AI Tools",
    description:
      "High-value assistant, voice, OCR, research, and document workflows.",
    icon: "Sparkles",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    tools: [
      ["ai-chat-assistant", "AI Chat Assistant", "Chat with a general-purpose AI assistant.", "Bot", "PRO", CREDIT_COSTS.ADVANCED],
      ["ai-voice-assistant", "AI Voice Assistant", "Voice-based AI assistant workflows.", "AudioLines", "PRO", CREDIT_COSTS.ADVANCED],
      ["ai-ocr-scanner", "AI OCR Scanner", "Extract text from scanned images.", "ScanText", "MODERATE", CREDIT_COSTS.DOCUMENT],
      ["ai-translation-tool", "AI Translation Tool", "Translate text across languages.", "Languages", "MODERATE", CREDIT_COSTS.TEXT],
      ["ai-document-analyzer", "AI Document Analyzer", "Analyze files and extract insights.", "FileSearch", "PRO", CREDIT_COSTS.DOCUMENT],
      ["ai-file-chat", "AI File Chat", "Ask questions about uploaded files.", "MessagesSquare", "PRO", CREDIT_COSTS.DOCUMENT],
      ["ai-research-assistant", "AI Research Assistant", "Create research briefs and outlines.", "Search", "PRO", CREDIT_COSTS.ADVANCED],
      ["ai-prompt-generator", "AI Prompt Generator", "Generate strong prompts for AI tools.", "Sparkles", "BASIC", CREDIT_COSTS.TEXT],
    ],
  },
];

export const tools = toolCategories.flatMap((category) =>
  category.tools.map(([slug, name, description, icon, minPlan, credits, path]) => ({
    id: slug,
    slug,
    name,
    description,
    icon,
    minPlan,
    requiredPlan: minPlan,
    credits,
    creditCost: credits,
    path: path || `/ai/tools/${slug}`,
    category: category.key,
    categoryTitle: category.title,
    isPremium: minPlan !== "BASIC",
    algorithmUsed: CATEGORY_ALGORITHMS[category.key],
  }))
);

export const toolMap = new Map(tools.map((tool) => [tool.slug, tool]));
