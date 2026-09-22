import prisma from "../configs/db.js";
import { PLAN_CREDITS } from "../config/tools.js";
import { normalizePlan } from "./accessControl.js";

export const getCreditsForPlan = (plan) => {
  return PLAN_CREDITS[normalizePlan(plan)] ?? PLAN_CREDITS.BASIC;
};

export const upsertUserFromClerk = async (clerkUser, preferredPlan) => {
  const email = clerkUser.emailAddresses?.[0]?.emailAddress || null;
  const fullName =
    clerkUser.fullName ||
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    null;
  const legacyPlan =
    clerkUser.publicMetadata?.plan === "premium" ? "PRO" : undefined;
  const plan = normalizePlan(preferredPlan || legacyPlan || "BASIC");

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    create: {
      clerkId: clerkUser.id,
      email,
      fullName,
      imageUrl: clerkUser.imageUrl,
      currentPlan: plan,
      availableCredits: getCreditsForPlan(plan),
      subscriptionStatus: plan === "BASIC" ? "FREE" : "ACTIVE",
    },
    update: {
      email,
      fullName,
      imageUrl: clerkUser.imageUrl,
    },
  });
};

export const applyPlanToUser = async ({
  userId,
  plan,
  status = "ACTIVE",
  stripeCustomerId,
  stripeSubscriptionId,
}) => {
  const normalizedPlan = normalizePlan(plan);

  return prisma.user.update({
    where: { id: userId },
    data: {
      currentPlan: normalizedPlan,
      subscriptionStatus: status,
      stripeCustomerId,
      stripeSubscriptionId,
    },
  });
};
