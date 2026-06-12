// middleware/auth.js
import { getAuth, clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    const plan = user.publicMetadata?.plan === "premium" ? "premium" : "free";
    req.plan = plan;

    if (plan === "free") {
      const usage = user.privateMetadata?.free_usage ?? 0;
      if (user.privateMetadata?.free_usage === undefined) {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: 0 },
        });
      }
      req.free_usage = usage;
    } else {
      req.free_usage = null;
    }
    req.userId = userId;

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};
