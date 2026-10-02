import React from "react";
import {
  AudioLines,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Bug,
  CircleHelp,
  ClipboardList,
  Code2,
  Crown,
  Database,
  Eraser,
  FileCode2,
  FileImage,
  FileSearch,
  FileText,
  GraduationCap,
  Hash,
  Image,
  Languages,
  Layers,
  ListChecks,
  Lock,
  Mail,
  MailPlus,
  Megaphone,
  NotebookPen,
  Package,
  Palette,
  Presentation,
  RefreshCw,
  Route,
  Scissors,
  Search,
  SearchCheck,
  Share2,
  Sparkles,
  SquarePen,
  TestTube2,
  UserRound,
  Youtube,
  Zap,
  ArrowRight,
} from "lucide-react";

const icons = {
  AudioLines,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Bug,
  CircleHelp,
  ClipboardList,
  Code2,
  Database,
  Eraser,
  FileCode2,
  FileImage,
  FileSearch,
  FileText,
  GraduationCap,
  Hash,
  Image,
  Languages,
  Layers,
  ListChecks,
  Mail,
  MailPlus,
  Megaphone,
  NotebookPen,
  Package,
  Palette,
  Presentation,
  RefreshCw,
  Route,
  Scissors,
  Search,
  SearchCheck,
  Share2,
  Sparkles,
  SquarePen,
  TestTube2,
  UserRound,
  Youtube,
  Zap,
};

// Pastel badge colors matching the image theme
const categoryStyles = {
  CONTENT: { bg: "bg-blue-50 text-blue-600 border-blue-100", label: "Content" },
  IMAGE: { bg: "bg-purple-50 text-purple-600 border-purple-100", label: "Image" },
  CAREER: { bg: "bg-indigo-50 text-indigo-600 border-indigo-100", label: "Career" },
  PRODUCTIVITY: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", label: "Productivity" },
  DEVELOPER: { bg: "bg-amber-50 text-amber-600 border-amber-100", label: "Developer" },
  ADVANCED: { bg: "bg-violet-50 text-violet-600 border-violet-100", label: "Advanced" },
};

const ToolCard = ({ tool, locked = false, onUse }) => {
  const Icon = icons[tool.icon] || Sparkles;
  const style = categoryStyles[tool.category] || {
    bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    label: tool.categoryTitle || "AI Tool",
  };

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md">
      <div>
        {/* Top: Icon Badge + Plan Tag */}
        <div className="flex items-start justify-between">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${style.bg} transition-transform duration-200 group-hover:scale-105 shadow-xs`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200/60">
                <Crown className="h-3 w-3" /> Pro
              </span>
            )}
            {locked && (
              <span className="rounded-full bg-slate-100 p-1 text-slate-400">
                <Lock className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>

        {/* Title & Category & Description */}
        <div className="mt-4">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
            {tool.name}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            {tool.categoryTitle || style.label}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Bottom: Credits info & Try Now button */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span>{tool.credits || 10} credits</span>
        </div>

        <button
          type="button"
          onClick={() => onUse && onUse(tool)}
          className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
            locked
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white shadow-xs"
          }`}
        >
          {locked ? (
            <>
              <Crown className="h-3 w-3" /> Unlock
            </>
          ) : (
            <>
              Try Now <ArrowRight className="h-3 w-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default ToolCard;
