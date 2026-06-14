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
};

const ToolCard = ({ tool, locked, onUse }) => {
  const Icon = icons[tool.icon] || Sparkles;

  return (
    <article className="premium-card group flex h-full min-h-72 flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="icon-badge h-14 w-14 bg-gradient-to-br from-indigo-600 to-cyan-500">
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] ${
              tool.isPremium
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {tool.isPremium ? "Premium" : "Free"}
          </span>
          {locked && (
            <span className="rounded-full bg-slate-100 p-1.5 text-slate-500">
              <Lock className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex-1">
        <h3 className="text-xl font-black text-slate-950">{tool.name}</h3>
        <p className="mt-3 line-clamp-3 text-base leading-7 text-slate-600">
          {tool.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <div className="flex items-center gap-2 text-sm font-black text-slate-500">
          <Zap className="h-4 w-4 text-indigo-500" />
          {tool.credits} credits
        </div>
        <button
          onClick={() => onUse(tool)}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black ${
            locked
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-100 hover:-translate-y-0.5"
          }`}
        >
          {locked ? <Crown className="h-3.5 w-3.5" /> : null}
          Use Tool
        </button>
      </div>
    </article>
  );
};

export default ToolCard;
