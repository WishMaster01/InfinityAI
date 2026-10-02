import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  Clock3,
  Search,
  Sparkles,
  SquarePen,
  Image as ImageIcon,
  FileText,
  Code2,
  MoreHorizontal,
  ChevronRight,
  Eye,
  Trash2,
  Copy,
  Download,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const initialHistoryItems = [
  {
    id: 1,
    category: "Content",
    title: "Blog Post: The Future of AI in Education",
    tool: "Content Generator",
    icon: SquarePen,
    iconColor: "bg-blue-50 text-blue-600 border-blue-100",
    time: "2 hours ago",
    content: "The landscape of education is shifting dramatically with generative AI. Personalized learning paths, automated grading assistance, and real-time comprehension feedback are empowering students and educators alike.",
  },
  {
    id: 2,
    category: "Images",
    title: "AI Generated Image: Cyberpunk City Sunset",
    tool: "Image Generator",
    icon: ImageIcon,
    iconColor: "bg-purple-50 text-purple-600 border-purple-100",
    time: "4 hours ago",
    content: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
    isImage: true,
  },
  {
    id: 3,
    category: "Career",
    title: "Resume Analysis: Senior Fullstack Engineer",
    tool: "Career Tools",
    icon: FileText,
    iconColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
    time: "1 day ago",
    content: "Score: 92/100. Keywords matched: React, Node.js, GraphQL, AWS. Recommended additions: Include metrics on database latency reduction.",
  },
  {
    id: 4,
    category: "Code",
    title: "Code Explanation: Binary Search Tree Balancing",
    tool: "Developer Tools",
    icon: Code2,
    iconColor: "bg-amber-50 text-amber-600 border-amber-100",
    time: "1 day ago",
    content: "AVL Tree self-balancing rotation explanation with O(log n) time complexity guarantees for insertion, lookup, and deletion.",
  },
];

const categoryPills = ["All", "Content", "Images", "Code", "Documents"];

const History = () => {
  const [items, setItems] = useState(initialHistoryItems);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );
        if (data.success && data.creations && data.creations.length > 0) {
          const apiItems = data.creations.map((c) => ({
            id: c.id,
            category: c.type?.includes("image")
              ? "Images"
              : c.type?.includes("code")
              ? "Code"
              : "Content",
            title: c.prompt || "AI Generation",
            tool: c.type || "AI Tool",
            icon: c.type?.includes("image") ? ImageIcon : SquarePen,
            iconColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
            time: "Recently",
            content: c.content,
            isImage: c.type?.includes("image"),
          }));
          setItems([...apiItems, ...initialHistoryItems]);
        }
      } catch {
        // Fallback to initial demo items
      }
    };
    fetchUserHistory();
  }, [getToken]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "All" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tool.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const handleDelete = (id) => {
    setItems((curr) => curr.filter((i) => i.id !== id));
    if (viewItem?.id === id) setViewItem(null);
    toast.success("Creation removed from history");
  };

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-6">
        {/* Header matching image: My History + Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My History
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            View and manage your AI creations and activity.
          </p>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
          {/* Category Tabs: All, Content, Images, Code, Documents */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
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

          {/* Search Input matching image: Search your creations... */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your creations..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* History Items List matching the uploaded image */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs divide-y divide-slate-100">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const Icon = item.icon || Sparkles;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/70 transition-colors"
                >
                  {/* Left: Icon, Title, Category */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        item.iconColor || "bg-indigo-50 text-indigo-600 border-indigo-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-bold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.tool}
                      </p>
                    </div>
                  </div>

                  {/* Right: Time, View Button, More */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0 ml-4">
                    <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
                      {item.time}
                    </span>

                    <button
                      type="button"
                      onClick={() => setViewItem(item)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400">
              <Clock3 className="mx-auto h-8 w-8 text-slate-300 stroke-1" />
              <p className="mt-2 text-xs font-bold text-slate-700">
                No creations found
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Try switching the category or changing your search terms.
              </p>
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {viewItem.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {viewItem.tool} · {viewItem.time}
                  </p>
                </div>
                <button
                  onClick={() => setViewItem(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 max-h-96 overflow-y-auto custom-scrollbar">
                {viewItem.isImage ? (
                  <img
                    src={viewItem.content}
                    alt={viewItem.title}
                    className="w-full rounded-xl object-cover max-h-80"
                  />
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
                    {viewItem.content}
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(viewItem.content || "");
                    toast.success("Copied to clipboard!");
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Copy Content
                </button>
                <button
                  type="button"
                  onClick={() => setViewItem(null)}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
