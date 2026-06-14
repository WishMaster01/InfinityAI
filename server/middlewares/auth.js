import { getAuth, clerkClient } from "@clerk/express";
import { upsertUserFromClerk } from "../utils/subscription.js";

export const auth = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const user = await upsertUserFromClerk(clerkUser);

    req.userId = userId;
    req.user = user;
    req.plan = user.currentPlan;
    req.free_usage = user.usedCredits;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};
