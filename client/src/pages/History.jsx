import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  Clock3,
  Database,
  Download,
  Search,
  Sparkles,
  WalletCards,
} from "lucide-react";
import CreationItem from "../components/CreationItem.jsx";
import OutputLoader from "../components/OutputLoader.jsx";
import { allTools } from "../data/toolCatalog.js";
import Dialog from "../components/ui/Dialog.jsx";
import { findItemsByDateDescending } from "../lib/dsa/binarySearch.js";

const toolMap = new Map(allTools.map((tool) => [tool.slug, tool]));

const formatDate = (value) => {
  if (!value) return "Saved";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const History = () => {
  const [loading, setLoading] = useState(true);
  const [creations, setCreations] = useState([]);
  const [toolUsages, setToolUsages] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [historyDate, setHistoryDate] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedCreation, setSelectedCreation] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);

      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );

        if (data.success) {
          setCreations(data.creations || []);
          setToolUsages(data.toolUsages || []);
          setUserStats(data.user || null);
        }
      } catch {
        setError("Unable to load history. Please retry.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getToken]);

  const deleteCreation = async (id) => {
    try {
      const token = await getToken();
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/user/creations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCreations((items) => items.filter((item) => item.id !== id));
    } catch {
      setError("Unable to delete this creation. Please try again.");
    }
  };
  const duplicateCreation = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/creations/${id}/duplicate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) setCreations((items) => [data.creation, ...items]);
    } catch {
      setError("Unable to duplicate this creation.");
    }
  };

  const exportHistory = () => {
    const blob = new Blob([JSON.stringify(creations, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "infinityai-history.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalCredits = useMemo(
    () => toolUsages.reduce((sum, usage) => sum + (usage.credits || 0), 0),
    [toolUsages],
  );
  const visibleCreations = useMemo(
    () =>
      findItemsByDateDescending(
        creations,
        historyDate,
        (item) => item.createdAt,
      ).filter((item) =>
        `${item.prompt} ${item.type} ${item.content}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [creations, historyDate, search],
  );
  const visibleToolUsages = useMemo(
    () =>
      findItemsByDateDescending(
        toolUsages,
        historyDate,
        (item) => item.createdAt,
      ),
    [toolUsages, historyDate],
  );

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <div className="glass-card p-7 sm:p-10">
          <span className="section-kicker">
            <Clock3 className="mr-2 h-4 w-4" />
            History
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Your AI activity and creations
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600 sm:text-xl">
            Review which tools you used, how many credits were spent, and the
            generated content saved to your workspace.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="dashboard-stat">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Saved Creations
              </p>
              <h2 className="mt-2 text-4xl font-black text-slate-950">
                {creations.length}
              </h2>
            </div>
            <div className="icon-badge bg-gradient-to-br from-indigo-600 to-cyan-500">
              <Database className="h-5 w-5" />
            </div>
          </div>

          <div className="dashboard-stat">
            <div>
              <p className="text-sm font-semibold text-slate-500">Tool Runs</p>
              <h2 className="mt-2 text-4xl font-black text-slate-950">
                {toolUsages.length}
              </h2>
            </div>
            <div className="icon-badge bg-gradient-to-br from-violet-600 to-fuchsia-500">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="dashboard-stat">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Credits Used
              </p>
              <h2 className="mt-2 text-4xl font-black text-slate-950">
                {userStats?.usedCredits ?? totalCredits}
              </h2>
            </div>
            <div className="icon-badge bg-gradient-to-br from-amber-400 to-rose-500">
              <WalletCards className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label
              htmlFor="history-date"
              className="text-sm font-black text-slate-800"
            >
              Find activity by date
            </label>
            <p className="mt-1 text-sm text-slate-500">
              Uses binary search over newest-first history.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="history-search">
              Search history
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                id="history-search"
                className="field-input mt-0 py-3 pl-10"
                placeholder="Search history"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <input
              id="history-date"
              type="date"
              value={historyDate}
              onChange={(event) => setHistoryDate(event.target.value)}
              className="field-input mt-0 py-3"
            />
            {historyDate && (
              <button
                type="button"
                className="secondary-button py-3"
                onClick={() => setHistoryDate("")}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className="secondary-button py-3"
              onClick={exportHistory}
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 font-semibold text-rose-700"
          >
            {error}
          </p>
        )}

        {loading ? (
          <div className="tool-panel">
            <OutputLoader label="Loading your AI history" />
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
            <section className="space-y-4">
              <div>
                <h2 className="text-3xl font-black text-slate-950">
                  Tool Usage
                </h2>
                <p className="mt-1 text-base text-slate-500">
                  Recent tools used by your account.
                </p>
              </div>

              {visibleToolUsages.length ? (
                <div className="space-y-3">
                  {visibleToolUsages.map((usage) => {
                    const tool = toolMap.get(usage.toolSlug);

                    return (
                      <article key={usage.id} className="premium-card p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-black text-slate-950">
                              {tool?.name || usage.toolSlug}
                            </h3>
                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              {formatDate(usage.createdAt)}
                            </p>
                          </div>
                          <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-indigo-700">
                            {usage.credits} credits
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                          {tool?.filter || usage.category}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <Sparkles className="h-10 w-10 text-indigo-400" />
                  <p className="text-sm font-semibold">
                    No tool usage recorded yet.
                  </p>
                </div>
              )}
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-3xl font-black text-slate-950">
                  Saved Creations
                </h2>
                <p className="mt-1 text-base text-slate-500">
                  Generated articles, titles, image results, and resume reviews.
                </p>
              </div>

              {visibleCreations.length ? (
                <div className="space-y-3">
                  {visibleCreations.map((item) => (
                    <CreationItem
                      key={item.id}
                      item={item}
                      onDelete={deleteCreation}
                      onDuplicate={duplicateCreation}
                      onOpen={setSelectedCreation}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Database className="h-10 w-10 text-indigo-400" />
                  <p className="text-sm font-semibold">
                    No creations saved yet.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
      <Dialog
        open={Boolean(selectedCreation)}
        onClose={() => setSelectedCreation(null)}
        title="Creation details"
      >
        {selectedCreation && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
                {selectedCreation.type}
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">
                {selectedCreation.prompt || "Saved creation"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Created {formatDate(selectedCreation.createdAt)}
              </p>
            </div>
            {selectedCreation.type === "image" ? (
              <img
                src={selectedCreation.content}
                alt={selectedCreation.prompt || "Saved creation"}
                className="max-h-96 w-full rounded-2xl object-contain"
              />
            ) : (
              <div className="max-h-96 overflow-y-auto rounded-2xl bg-slate-50 p-4">
                <FormattedCreationContent content={selectedCreation.content} />
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
};

const FormattedCreationContent = ({ content }) => (
  <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
    {content}
  </pre>
);

export default History;
