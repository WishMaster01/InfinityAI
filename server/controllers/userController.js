import prisma from "../configs/db.js";

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
    const creations = await prisma.creation.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      creations,
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
    const [creations, toolUsages] = await Promise.all([
      prisma.creation.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.toolUsage.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        take: 100,
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

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await prisma.creation.findMany({
      where: { publish: true },
      orderBy: { createdAt: "desc" },
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

    const currentLikes = creation.likes ?? [];
    const isLiked = currentLikes.includes(userId);
    const updatedLikes = isLiked
      ? currentLikes.filter((likedUserId) => likedUserId !== userId)
      : [...currentLikes, userId];

    await prisma.creation.update({
      where: { id: creationId },
      data: { likes: updatedLikes },
    });

    res.json({
      success: true,
      message: isLiked ? "Creation unliked." : "Creation liked.",
    });
  } catch (error) {
    console.error("Error in toggleLikeCraetion:", error);
    res.json({ success: false, message: error.message });
  }
};
