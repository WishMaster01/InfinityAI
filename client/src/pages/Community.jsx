import React, { useState } from "react";
import {
  Heart,
  MessageSquare,
  Plus,
  Share2,
  Sparkles,
  Code,
  FileText,
  Image as ImageIcon,
  Check,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import ScrollReveal from "../components/ScrollReveal.jsx";

const initialCommunityPosts = [
  {
    id: 1,
    category: "Images",
    title: "A beautiful space themed wallpaper generated with AI",
    author: "creator123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&h=400&fit=crop",
    likes: 2400,
    comments: 124,
    isLiked: false,
    tag: "Midjourney Style",
  },
  {
    id: 2,
    category: "Text",
    title: "Resume improvement tips that actually work for tech roles",
    author: "career_guru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    snippet: "1. Quantify impact with metrics\n2. Align keywords to job description\n3. Keep layout clean and parseable by ATS scanners\n4. Remove outdated legacy tools",
    likes: 1800,
    comments: 96,
    isLiked: false,
    tag: "Career Advice",
  },
  {
    id: 3,
    category: "Code",
    title: "Python script to automate file organization and cleanup",
    author: "code_lover",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    codeSnippet: `import os, shutil
from pathlib import Path

def organize_downloads(folder):
    for f in Path(folder).iterdir():
        if f.is_file():
            ext = f.suffix.lower()
            dest = Path(folder) / ext[1:]
            dest.mkdir(exist_ok=True)
            shutil.move(f, dest / f.name)`,
    likes: 3200,
    comments: 208,
    isLiked: false,
    tag: "Python Automation",
  },
  {
    id: 4,
    category: "Images",
    title: "Serene bonsai tree with mist in Japanese garden",
    author: "zen_artist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&h=400&fit=crop",
    likes: 1540,
    comments: 72,
    isLiked: false,
    tag: "Digital Art",
  },
  {
    id: 5,
    category: "Images",
    title: "Majestic turquoise waterfall deep inside tropical canyon",
    author: "nature_lens",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop",
    likes: 2100,
    comments: 110,
    isLiked: false,
    tag: "Photorealistic",
  },
  {
    id: 6,
    category: "Design",
    title: "Modern glassmorphism UI dashboard concept for SaaS",
    author: "ui_craft",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
    likes: 2890,
    comments: 145,
    isLiked: false,
    tag: "UI / UX",
  },
];

const categoryPills = ["All", "Text", "Images", "Code", "Design", "Others"];

const Community = () => {
  const [posts, setPosts] = useState(initialCommunityPosts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Images");
  const [newContent, setNewContent] = useState("");

  const toggleLike = (id) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id === id) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      }),
    );
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost = {
      id: Date.now(),
      category: newCategory,
      title: newTitle,
      author: "you",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      image: newCategory === "Images" ? "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&h=400&fit=crop" : undefined,
      snippet: newCategory === "Text" ? newContent : undefined,
      codeSnippet: newCategory === "Code" ? newContent : undefined,
      likes: 1,
      comments: 0,
      isLiked: true,
      tag: "Community Share",
    };

    setPosts([newPost, ...posts]);
    setCreateModalOpen(false);
    setNewTitle("");
    setNewContent("");
    toast.success("Post shared with community!");
  };

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Header matching image: Community + Subtitle + Create Post Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Community
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
              Discover, share, and get inspired by amazing creations from our community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all w-fit"
          >
            <Plus className="h-4 w-4" /> Create Post
          </button>
        </div>

        {/* Filter Pills matching image: All, Text, Images, Code, Design, Others */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 custom-scrollbar">
          {categoryPills.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150 ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Community Grid matching the uploaded image */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, idx) => (
            <ScrollReveal key={post.id} animation="fade-up" delay={(idx % 3) * 80}>
              <div
                className="h-full group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
              >
                {/* Media Preview or Code snippet or Document preview */}
                {post.image ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {post.tag}
                    </span>
                  </div>
                ) : post.codeSnippet ? (
                  <div className="aspect-video w-full overflow-hidden bg-slate-950 p-4 font-mono text-[11px] text-cyan-300">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="ml-2 font-mono">script.py</span>
                    </div>
                    <pre className="mt-2 text-slate-300 overflow-x-hidden leading-relaxed">
                      {post.codeSnippet}
                    </pre>
                  </div>
                ) : (
                  <div className="aspect-video w-full overflow-hidden bg-indigo-50/50 p-4 border-b border-slate-100 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-2">
                      <FileText className="h-3.5 w-3.5" /> Resume Insight
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line line-clamp-4">
                      {post.snippet}
                    </p>
                  </div>
                )}

                {/* Card Footer with Details & Stats matching image */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="h-6 w-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-xs font-semibold text-slate-500">
                        @{post.author}
                      </span>
                    </div>
                  </div>

                  {/* Likes & Comments Count */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1.5 font-bold hover:text-rose-600 transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 transition-transform active:scale-125 ${
                          post.isLiked
                            ? "fill-rose-500 text-rose-500"
                            : "text-slate-400"
                        }`}
                      />
                      <span>
                        {post.likes >= 1000
                          ? `${(post.likes / 1000).toFixed(1)}k`
                          : post.likes}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5 font-semibold text-slate-400">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Create Post Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Share a Creation
                </h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Title / Prompt
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. A beautiful space themed wallpaper generated with AI"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Images">Images</option>
                    <option value="Text">Text</option>
                    <option value="Code">Code</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Description or Code Content
                  </label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Provide details, prompt, or code snippet..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
