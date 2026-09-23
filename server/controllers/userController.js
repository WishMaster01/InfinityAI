import prisma from "../configs/db.js";
import { PLAN_ORDER, tools } from "../config/tools.js";
import {
  buildUsageAnalytics,
  recommendTools,
} from "../utils/dsa/recommendation.js";

export const syncUser = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        clerkId: req.user.clerkId,
        email: req.user.email,
        fullName: req.user.fullName,
        imageUrl: req.user.imageUrl,
        plan: req.user.currentPlan,
        availableCredits: req.user.availableCredits,
        usedCredits: req.user.usedCredits,
        subscriptionStatus: req.user.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("Error in syncUser:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserCreations = async (req, res) => {
  try {
    const [creations, toolUsages, popularUsage] = await Promise.all([
      prisma.creation.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" },
        take: Math.min(Number(req.query.limit) || 25, 100),
        ...(req.query.cursor
          ? { skip: 1, cursor: { id: Number(req.query.cursor) } }
          : {}),
      }),
      prisma.toolUsage.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        take: Math.min(Number(req.query.limit) || 25, 100),
      }),
      prisma.toolUsage.groupBy({
        by: ["toolSlug"],
        where: { success: true },
        _count: { toolSlug: true },
        orderBy: { _count: { toolSlug: "desc" } },
        take: 20,
      }),
    ]);
    const popularity = new Map(
      popularUsage.map((usage) => [usage.toolSlug, usage._count.toolSlug]),
    );
    const accessible = (tool) =>
      PLAN_ORDER[tool.minPlan] <= PLAN_ORDER[req.user.currentPlan] &&
      tool.credits <= req.user.availableCredits;
    const recommended = recommendTools({
      tools,
      usages: toolUsages,
      plan: req.user.currentPlan,
      remainingCredits: req.user.availableCredits,
      popularity,
    });
    const recentSlugs = [
      ...new Set(
        toolUsages
          .filter((usage) => usage.success)
          .map((usage) => usage.toolSlug),
      ),
    ];
    const continueWhereYouLeftOff = recentSlugs
      .map((slug) => tools.find((tool) => tool.slug === slug))
      .filter((tool) => tool && accessible(tool))
      .slice(0, 6);
    const popular = [...popularity.keys()]
      .map((slug) => tools.find((tool) => tool.slug === slug))
      .filter((tool) => tool && accessible(tool))
      .slice(0, 6);
    const bestForPlan = tools
      .filter(accessible)
      .sort(
        (left, right) =>
          PLAN_ORDER[right.minPlan] - PLAN_ORDER[left.minPlan] ||
          left.credits - right.credits,
      )
      .slice(0, 6);

    res.json({
      success: true,
      creations,
      analytics: buildUsageAnalytics(toolUsages, {
        premiumToolSlugs: tools
          .filter((tool) => tool.isPremium)
          .map((tool) => tool.slug),
      }),
      recommendations: recommended,
      recommendationSections: {
        recommended,
        continueWhereYouLeftOff,
        popular,
        bestForPlan,
      },
      user: {
        plan: req.user.currentPlan,
        availableCredits: req.user.availableCredits,
        usedCredits: req.user.usedCredits,
        subscriptionStatus: req.user.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("Error in getUserCreations:", error);
    res.json({ success: false, message: error.message });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
    const search = String(req.query.q || "")
      .trim()
      .slice(0, 200);
    const type = String(req.query.type || "")
      .trim()
      .slice(0, 80);
    const order = req.query.sort === "oldest" ? "asc" : "desc";
    const [creations, toolUsages] = await Promise.all([
      prisma.creation.findMany({
        where: {
          userId: req.userId,
          ...(type ? { type } : {}),
          ...(search
            ? {
                OR: [
                  { prompt: { contains: search, mode: "insensitive" } },
                  { content: { contains: search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: order },
        take: limit,
        ...(req.query.cursor
          ? { skip: 1, cursor: { id: Number(req.query.cursor) } }
          : {}),
      }),
      prisma.toolUsage.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: order },
        take: limit,
      }),
    ]);

    res.json({
      success: true,
      creations,
      toolUsages,
      user: {
        plan: req.user.currentPlan,
        availableCredits: req.user.availableCredits,
        usedCredits: req.user.usedCredits,
        subscriptionStatus: req.user.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("Error in getUserHistory:", error);
    res.json({ success: false, message: error.message });
  }
};

export const duplicateCreation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res
        .status(400)
        .json({ success: false, message: "Valid creation id is required." });
    const original = await prisma.creation.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!original)
      return res
        .status(404)
        .json({ success: false, message: "Creation not found." });
    const copy = await prisma.creation.create({
      data: {
        userId: req.user.id,
        prompt: `Copy of ${original.prompt}`.slice(0, 4000),
        content: original.content,
        type: original.type,
        publish: false,
      },
    });
    return res.status(201).json({ success: true, creation: copy });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Unable to duplicate creation." });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await prisma.creation.findMany({
      where: { publish: true },
      orderBy: { createdAt: "desc" },
      take: Math.min(Number(req.query.limit) || 25, 100),
      ...(req.query.cursor
        ? { skip: 1, cursor: { id: Number(req.query.cursor) } }
        : {}),
    });

    res.json({ success: true, creations });
  } catch (error) {
    console.error("Error in getPublishedCreations:", error);
    res.json({ success: false, message: error.message });
  }
};

export const toggleLikeCraetion = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;
    const creationId = Number(id);

    if (!Number.isInteger(creationId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid creation id is required." });
    }

    const creation = await prisma.creation.findUnique({
      where: { id: creationId },
    });

    if (!creation) {
      return res.json({ success: false, message: "Creation not found." });
    }

    const existing = await prisma.creationLike.findUnique({
      where: { creationId_userId: { creationId, userId } },
    });
    if (existing)
      await prisma.creationLike.delete({
        where: { creationId_userId: { creationId, userId } },
      });
    else await prisma.creationLike.create({ data: { creationId, userId } });

    res.json({
      success: true,
      message: existing ? "Creation unliked." : "Creation liked.",
    });
  } catch (error) {
    console.error("Error in toggleLikeCraetion:", error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteCreation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res
        .status(400)
        .json({ success: false, message: "Valid creation id is required." });
    const result = await prisma.creation.deleteMany({
      where: { id, userId: req.user.id },
    });
    if (!result.count)
      return res
        .status(404)
        .json({ success: false, message: "Creation not found." });
    return res.json({ success: true });
  } catch (error) {
    console.error("Error deleting creation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to delete creation." });
  }
};
