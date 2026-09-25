import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useMemo, useState } from "react";
import { dummyPublishedCreationData } from "../assets/assets.js";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Dialog from "../components/ui/Dialog.jsx";

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCreations = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/get-published-creations`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );

        setCreations(
          data.success ? data.creations : dummyPublishedCreationData,
        );
      } catch {
        setCreations(dummyPublishedCreationData);
      } finally {
        setLoading(false);
      }
    };

    fetchCreations();
  }, [getToken]);

  const toggleLike = async (creationId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/toggle-like-creation`,
        { id: creationId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (!data.success) {
        toast.error(data.message || "Unable to update like.");
        return;
      }

      setCreations((current) =>
        current.map((creation) => {
          if (creation.id !== creationId) return creation;

          const likes = creation.likes || [];
          const isLiked = likes.includes(user.id);
          return {
            ...creation,
            likes: isLiked
              ? likes.filter((likedUserId) => likedUserId !== user.id)
              : [...likes, user.id],
          };
        }),
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update like.");
    }
  };

  const creatorCreations = useMemo(
    () =>
      selectedCreator
        ? creations.filter(
            (creation) => creation.userId === selectedCreator.userId,
          )
        : [],
    [creations, selectedCreator],
  );

  return (
    <div className="page-shell">
      <div className="content-wrap flex min-h-full flex-col">
        <div className="mb-8">
          <span className="section-kicker">Community</span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Creator Gallery
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Explore public AI images shared by the community.
          </p>
        </div>

        {loading ? (
          <div className="empty-state">Loading creator gallery…</div>
        ) : (
          <div className="grid gap-5 rounded-3xl border border-white/75 bg-white/80 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {creations.map((creation, index) => (
              <div
                key={index}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm"
              >
                <img
                  src={creation.content}
                  alt="CREATION CONTENT"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent p-4 text-white opacity-0 transition duration-300 group-hover:opacity-100">
                  <div>
                    <button
                      type="button"
                      className="text-left text-xs font-black text-cyan-200 hover:text-white"
                      onClick={() => setSelectedCreator(creation)}
                    >
                      View creator
                    </button>
                    <p className="mt-1 line-clamp-3 text-sm font-medium leading-5">
                      {creation.prompt}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold backdrop-blur">
                    <p>{creation.likes.length}</p>
                    <Heart
                      onClick={() => toggleLike(creation.id)}
                      className={`h-5 min-w-5 cursor-pointer transition hover:scale-110 ${
                        creation.likes.includes(user.id)
                          ? "fill-red-500 text-red-600"
                          : "text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Dialog
          open={Boolean(selectedCreator)}
          onClose={() => setSelectedCreator(null)}
          title="Creator profile"
        >
          {selectedCreator && (
            <div className="text-center">
              <img
                src={selectedCreator.user?.imageUrl || user?.imageUrl}
                alt="Creator avatar"
                className="mx-auto h-20 w-20 rounded-3xl object-cover"
              />
              <h2 className="mt-4 text-2xl font-black text-slate-950">
                {selectedCreator.user?.fullName || "InfinityAI creator"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {creatorCreations.length || 1} public creation
                {(creatorCreations.length || 1) === 1 ? "" : "s"}
              </p>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default Community;
